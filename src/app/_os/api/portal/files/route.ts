import { requireClientSession } from "@/lib/auth/session";
import { buildJsonErrorResponse } from "@/lib/api/error-response";
import { createWorkspaceFile } from "@/lib/ops/workspace-service";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await requireClientSession();
    enforceRateLimit({
      request,
      namespace: "portal-file-upload",
      max: 10,
      windowMs: 15 * 60 * 1000,
      identifier: session.user.id,
      message: "Demasiadas cargas de archivos desde el portal. Espera un momento antes de volver a subir recursos.",
    });

    if (!session.user.clientId) {
      throw new Error("Tu sesión no tiene un cliente asociado.");
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new Error("Debes adjuntar un archivo válido.");
    }

    const category = getOptionalString(formData, "category");
    const projectId = getOptionalString(formData, "projectId");
    const targetValue = getOptionalString(formData, "target");
    const target = targetValue === "drive" || targetValue === "local" || targetValue === "auto" ? targetValue : "auto";
    const record = await createWorkspaceFile({
      file,
      clientId: session.user.clientId,
      projectId,
      category,
      source: "client",
      target,
    }, {
      actor: {
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
      },
    });

    return Response.json(record, { status: 201 });
  } catch (error) {
    return buildJsonErrorResponse(error, "No fue posible subir el archivo del portal.");
  }
}

function getOptionalString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}
