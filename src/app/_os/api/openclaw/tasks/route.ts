import { assertOpenClawAuthorized, getOpenClawRequestId } from "@/lib/openclaw/auth";
import { openClawError, openClawJson } from "@/lib/openclaw/response";
import { createOpenClawTask, listOpenClawTasks } from "@/lib/openclaw/service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestId = getOpenClawRequestId(request);
  const unauthorizedResponse = assertOpenClawAuthorized(request, requestId);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const url = new URL(request.url);
    const tasks = await listOpenClawTasks({
      projectId: url.searchParams.get("projectId"),
      status: url.searchParams.get("status"),
      assignee: url.searchParams.get("assignee"),
    });
    return openClawJson(tasks, requestId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible listar tareas.";
    return openClawError(message, requestId, 400);
  }
}

export async function POST(request: Request) {
  const requestId = getOpenClawRequestId(request);
  const unauthorizedResponse = assertOpenClawAuthorized(request, requestId);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const task = await createOpenClawTask(await request.json());
    return openClawJson(task, requestId, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible crear la tarea.";
    return openClawError(message, requestId, 400);
  }
}
