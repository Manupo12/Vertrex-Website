import { assertOpenClawAuthorized, getOpenClawRequestId } from "@/lib/openclaw/auth";
import { openClawError, openClawJson } from "@/lib/openclaw/response";
import { createOpenClawMemory, listOpenClawMemory } from "@/lib/openclaw/service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestId = getOpenClawRequestId(request);
  const unauthorizedResponse = assertOpenClawAuthorized(request, requestId);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const memory = await listOpenClawMemory();
    return openClawJson(memory, requestId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible leer la memoria empresarial.";
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
    const memoryEntry = await createOpenClawMemory(await request.json());
    return openClawJson(memoryEntry, requestId, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible guardar en memoria empresarial.";
    return openClawError(message, requestId, 400);
  }
}
