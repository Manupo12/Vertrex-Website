import { assertOpenClawAuthorized, getOpenClawRequestId } from "@/lib/openclaw/auth";
import { openClawError, openClawJson } from "@/lib/openclaw/response";
import { createOpenClawDocument, listOpenClawDocuments } from "@/lib/openclaw/service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestId = getOpenClawRequestId(request);
  const unauthorizedResponse = assertOpenClawAuthorized(request, requestId);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const documents = await listOpenClawDocuments();
    return openClawJson(documents, requestId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible listar documentos.";
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
    const document = await createOpenClawDocument(await request.json());
    return openClawJson(document, requestId, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible crear el documento.";
    return openClawError(message, requestId, 400);
  }
}
