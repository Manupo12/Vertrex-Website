import { assertOpenClawAuthorized, getOpenClawRequestId } from "@/lib/openclaw/auth";
import { openClawError, openClawJson } from "@/lib/openclaw/response";
import { createOpenClawProject, listOpenClawProjects } from "@/lib/openclaw/service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestId = getOpenClawRequestId(request);
  const unauthorizedResponse = assertOpenClawAuthorized(request, requestId);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const projects = await listOpenClawProjects();
    return openClawJson(projects, requestId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible listar proyectos.";
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
    const project = await createOpenClawProject(await request.json());
    return openClawJson(project, requestId, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible crear el proyecto.";
    return openClawError(message, requestId, 400);
  }
}
