import { assertOpenClawAuthorized, getOpenClawRequestId } from "@/lib/openclaw/auth";
import { openClawError, openClawJson } from "@/lib/openclaw/response";
import { getOpenClawFinanceSummary } from "@/lib/openclaw/service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestId = getOpenClawRequestId(request);
  const unauthorizedResponse = assertOpenClawAuthorized(request, requestId);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const summary = await getOpenClawFinanceSummary();
    return openClawJson(summary, requestId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible consultar el resumen financiero.";
    return openClawError(message, requestId, 400);
  }
}
