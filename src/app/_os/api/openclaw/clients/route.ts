import { assertOpenClawAuthorized, getOpenClawRequestId } from "@/lib/openclaw/auth";
import { openClawError, openClawJson } from "@/lib/openclaw/response";
import { createOpenClawClient, listOpenClawClients } from "@/lib/openclaw/service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestId = getOpenClawRequestId(request);
  const unauthorizedResponse = assertOpenClawAuthorized(request, requestId);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const clients = await listOpenClawClients();
    return openClawJson(clients, requestId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible listar clientes.";
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
    const client = await createOpenClawClient(await request.json());
    return openClawJson(client, requestId, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible crear el cliente.";
    return openClawError(message, requestId, 400);
  }
}
