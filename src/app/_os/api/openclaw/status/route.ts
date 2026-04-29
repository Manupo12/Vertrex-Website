import { assertOpenClawAuthorized, getOpenClawRequestId } from "@/lib/openclaw/auth";
import { openClawError, openClawJson } from "@/lib/openclaw/response";
import { getOpenClawStatus } from "@/lib/openclaw/service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestId = getOpenClawRequestId(request);
  const unauthorizedResponse = assertOpenClawAuthorized(request, requestId);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const status = await getOpenClawStatus();
    return openClawJson(status, requestId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible consultar el estado de OpenClaw.";
    return openClawError(message, requestId, 400);
  }
}
