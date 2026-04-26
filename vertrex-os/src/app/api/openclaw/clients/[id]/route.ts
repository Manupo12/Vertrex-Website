import { assertOpenClawAuthorized, getOpenClawRequestId } from "@/lib/openclaw/auth";
import { openClawError, openClawJson } from "@/lib/openclaw/response";
import { getOpenClawClient } from "@/lib/openclaw/service";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const requestId = getOpenClawRequestId(request);
  const unauthorizedResponse = assertOpenClawAuthorized(request, requestId);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const { id } = await context.params;
    const client = await getOpenClawClient(id);
    return openClawJson(client, requestId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible consultar el cliente.";
    return openClawError(message, requestId, 400);
  }
}
