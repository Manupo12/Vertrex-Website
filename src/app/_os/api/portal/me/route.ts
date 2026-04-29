import { requireClientSession } from "@/lib/auth/session";
import { buildJsonErrorResponse } from "@/lib/api/error-response";
import { getPortalClientBySlug } from "@/lib/portal/portal-service";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await requireClientSession();
    const clientSlug = session.user.clientSlug;

    if (!clientSlug) {
      throw new Error("Tu sesión no tiene un portal cliente asignado.");
    }

    const client = await getPortalClientBySlug(clientSlug);
    return Response.json(client);
  } catch (error) {
    return buildJsonErrorResponse(error, "No fue posible cargar tu portal.");
  }
}
