import { assertOpenClawAuthorized, getOpenClawRequestId } from "@/lib/openclaw/auth";
import { openClawError, openClawJson } from "@/lib/openclaw/response";
import { createOpenClawChatResponse } from "@/lib/openclaw/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const requestId = getOpenClawRequestId(request);
  const unauthorizedResponse = assertOpenClawAuthorized(request, requestId);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const response = await createOpenClawChatResponse(await request.json());
    return openClawJson(response, requestId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible procesar el mensaje del agente OS.";
    return openClawError(message, requestId, 400);
  }
}
