import { assertOpenClawAuthorized, getOpenClawRequestId } from "@/lib/openclaw/auth";
import { openClawError, openClawJson } from "@/lib/openclaw/response";
import { createOpenClawTransaction } from "@/lib/openclaw/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const requestId = getOpenClawRequestId(request);
  const unauthorizedResponse = assertOpenClawAuthorized(request, requestId);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const transaction = await createOpenClawTransaction(await request.json());
    return openClawJson(transaction, requestId, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible registrar la transacción.";
    return openClawError(message, requestId, 400);
  }
}
