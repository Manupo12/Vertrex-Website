import { buildJsonErrorResponse } from "@/lib/api/error-response";
import { requireTeamSession } from "@/lib/auth/session";
import { workspaceLinkSchema } from "@/lib/ops/workspace-schemas";
import { createWorkspaceLink } from "@/lib/ops/workspace-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await requireTeamSession();
    const payload = workspaceLinkSchema.parse(await request.json());

    const link = await createWorkspaceLink(payload, {
      actor: {
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
      },
    });

    return Response.json(link);
  } catch (error) {
    return buildJsonErrorResponse(error, "No fue posible crear el link.");
  }
}
