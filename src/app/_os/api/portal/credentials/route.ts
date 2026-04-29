import { requireClientSession } from "@/lib/auth/session";
import { buildJsonErrorResponse } from "@/lib/api/error-response";
import { createWorkspaceCredential } from "@/lib/ops/workspace-service";
import { workspaceCredentialSchema } from "@/lib/ops/workspace-schemas";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await requireClientSession();
    enforceRateLimit({
      request,
      namespace: "portal-credentials-create",
      max: 6,
      windowMs: 15 * 60 * 1000,
      identifier: session.user.id,
      message: "Demasiadas solicitudes de credenciales desde el portal. Espera un momento antes de volver a compartir accesos.",
    });

    if (!session.user.clientId) {
      throw new Error("Tu sesión no tiene un cliente asociado.");
    }

    const payload = workspaceCredentialSchema.parse({
      ...(await request.json()),
      clientId: session.user.clientId,
    });
    const credential = await createWorkspaceCredential(payload, {
      actor: {
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
      },
    });
    return Response.json(credential, { status: 201 });
  } catch (error) {
    return buildJsonErrorResponse(error, "No fue posible guardar la credencial del portal.");
  }
}
