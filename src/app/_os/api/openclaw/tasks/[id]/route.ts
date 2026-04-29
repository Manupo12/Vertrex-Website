import { assertOpenClawAuthorized, getOpenClawRequestId } from "@/lib/openclaw/auth";
import { openClawError, openClawJson } from "@/lib/openclaw/response";
import { updateOpenClawTask } from "@/lib/openclaw/service";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const requestId = getOpenClawRequestId(request);
  const unauthorizedResponse = assertOpenClawAuthorized(request, requestId);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const { id } = await context.params;
    const task = await updateOpenClawTask(id, await request.json());
    return openClawJson(task, requestId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible actualizar la tarea.";
    return openClawError(message, requestId, 400);
  }
}
