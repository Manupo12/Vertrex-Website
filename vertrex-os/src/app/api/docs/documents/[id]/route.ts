import { getDocumentById } from "@/lib/docs/document-service";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const document = await getDocumentById(id);

    if (!document) {
      return Response.json({ error: "Documento no encontrado." }, { status: 404 });
    }

    return Response.json({ document });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible consultar el documento.";
    return Response.json({ error: message }, { status: 400 });
  }
}
