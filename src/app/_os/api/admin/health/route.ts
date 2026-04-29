import { buildJsonErrorResponse } from "@/lib/api/error-response";
import { requireTeamSession } from "@/lib/auth/session";
import { buildWorkspaceHealthSnapshot } from "@/lib/ops/workspace-health";
import { getWorkspaceSnapshot } from "@/lib/ops/workspace-service";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireTeamSession();
    const workspaceSnapshot = await getWorkspaceSnapshot();
    return Response.json(buildWorkspaceHealthSnapshot(workspaceSnapshot));
  } catch (error) {
    return buildJsonErrorResponse(error, "No fue posible consultar la salud operativa.");
  }
}
