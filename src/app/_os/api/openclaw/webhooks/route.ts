import { assertOpenClawWebhookAuthorized, getOpenClawRequestId } from "@/lib/openclaw/auth";
import { openClawError, openClawJson } from "@/lib/openclaw/response";
import { handleOpenClawWebhook } from "@/lib/openclaw/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const requestId = getOpenClawRequestId(request);
  const unauthorizedResponse = assertOpenClawWebhookAuthorized(request, requestId);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const result = await handleOpenClawWebhook(await request.json());
    return openClawJson(result, requestId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible procesar el webhook de OpenClaw.";
    return openClawError(message, requestId, 400);
  }
}
