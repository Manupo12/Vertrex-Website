import { requireTeamSession } from "@/lib/auth/session";
import { buildJsonErrorResponse } from "@/lib/api/error-response";
import { createWorkspaceFile } from "@/lib/ops/workspace-service";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await requireTeamSession();
    enforceRateLimit({
      request,
      namespace: "admin-workspace-file-upload",
      max: 20,
      windowMs: 10 * 60 * 1000,
      identifier: session.user.id,
      message: "Demasiadas cargas de archivos internas en poco tiempo. Espera un momento antes de seguir subiendo recursos.",
    });
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new Error("Debes adjuntar un archivo válido.");
    }

    const clientId = getOptionalString(formData, "clientId");
    const clientSlug = getOptionalString(formData, "clientSlug");
    const projectId = getOptionalString(formData, "projectId");
    const category = getOptionalString(formData, "category");
    const source = getOptionalString(formData, "source") === "client" ? "client" : "vertrex";
    const targetValue = getOptionalString(formData, "target");
    const target = targetValue === "drive" || targetValue === "local" || targetValue === "auto" ? targetValue : "auto";
    const record = await createWorkspaceFile({
      file,
      clientId,
      clientSlug,
      projectId,
      category,
      source,
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
    return buildJsonErrorResponse(error, "No fue posible subir el archivo.");
  }
}

function getOptionalString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}
