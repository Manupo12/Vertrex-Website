import { assertOpenClawAuthorized, getOpenClawRequestId } from "@/lib/openclaw/auth";
import { openClawError, openClawJson } from "@/lib/openclaw/response";
import { deleteOpenClawMemory } from "@/lib/openclaw/service";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: Request, context: RouteContext) {
  const requestId = getOpenClawRequestId(request);
  const unauthorizedResponse = assertOpenClawAuthorized(request, requestId);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const { id } = await context.params;
    const memoryEntry = await deleteOpenClawMemory(id);
    return openClawJson(memoryEntry, requestId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible eliminar la memoria empresarial.";
    return openClawError(message, requestId, 400);
  }
}
