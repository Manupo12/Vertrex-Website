import { requireClientSession } from "@/lib/auth/session";
import { buildJsonErrorResponse } from "@/lib/api/error-response";
import { createWorkspaceMessage } from "@/lib/ops/workspace-service";
import { workspaceMessageSchema } from "@/lib/ops/workspace-schemas";
import { getPortalClientBySlug } from "@/lib/portal/portal-service";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await requireClientSession();
    const clientSlug = session.user.clientSlug;

    if (!clientSlug) {
      throw new Error("Tu sesión no tiene un portal cliente asignado.");
    }

    const client = await getPortalClientBySlug(clientSlug);
    return Response.json(client.messages ?? []);
  } catch (error) {
    return buildJsonErrorResponse(error, "No fue posible cargar el chat del portal.");
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireClientSession();
    enforceRateLimit({
      request,
      namespace: "portal-message-send",
      max: 15,
      windowMs: 5 * 60 * 1000,
      identifier: session.user.id,
      message: "Demasiados mensajes desde el portal en poco tiempo. Espera un momento antes de volver a enviar otro mensaje.",
    });
    const clientId = session.user.clientId;

    if (!clientId) {
      throw new Error("Tu sesión no tiene un cliente asociado.");
    }

    const command = workspaceMessageSchema.parse({
      ...(await request.json()),
      clientId,
      userId: session.user.id,
      senderRole: "client",
      senderName: session.user.name,
      autoReply: true,
    });
    const result = await createWorkspaceMessage(command, {
      actor: {
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
      },
    });
    return Response.json(result, { status: 201 });
  } catch (error) {
    return buildJsonErrorResponse(error, "No fue posible enviar el mensaje del portal.");
  }
}
