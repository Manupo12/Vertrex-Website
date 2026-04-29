import { generateDocument, generateDocumentPayloadSchema } from "@/lib/docs/generated-document-service";
import { buildJsonErrorResponse } from "@/lib/api/error-response";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    enforceRateLimit({
      request,
      namespace: "documents-generate",
      max: 20,
      windowMs: 10 * 60 * 1000,
      message: "Demasiadas generaciones documentales en poco tiempo. Espera un momento antes de volver a generar otro documento.",
    });
    const payload = generateDocumentPayloadSchema.parse(await request.json());
    const result = await generateDocument(payload);
    return Response.json(result, { status: 201 });
  } catch (error) {
    return buildJsonErrorResponse(error, "No fue posible generar el documento.");
  }
}
