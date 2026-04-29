import { requireClientSession } from "@/lib/auth/session";
import { buildJsonErrorResponse } from "@/lib/api/error-response";
import { createWorkspaceTicket } from "@/lib/ops/workspace-service";
import { workspaceTicketSchema } from "@/lib/ops/workspace-schemas";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await requireClientSession();
    enforceRateLimit({
      request,
      namespace: "portal-ticket-create",
      max: 8,
      windowMs: 15 * 60 * 1000,
      identifier: session.user.id,
      message: "Demasiados tickets creados desde el portal en poco tiempo. Espera un momento antes de registrar otro request.",
    });

    if (!session.user.clientId) {
      throw new Error("Tu sesión no tiene un cliente asociado.");
    }

    const payload = workspaceTicketSchema.parse({
      ...(await request.json()),
      clientId: session.user.clientId,
      channel: "portal",
      status: "open",
    });
    const ticket = await createWorkspaceTicket(payload, {
      actor: {
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
      },
    });
    return Response.json(ticket, { status: 201 });
  } catch (error) {
    return buildJsonErrorResponse(error, "No fue posible crear el ticket del portal.");
  }
}
