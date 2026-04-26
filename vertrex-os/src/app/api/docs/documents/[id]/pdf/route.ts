import { renderHtmlToPdf } from "@/lib/docs/template-renderer";
import { getDocumentById } from "@/lib/docs/document-service";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const document = await getDocumentById(id);

    if (!document?.latestVersion?.htmlContent) {
      return Response.json({ error: "Documento no encontrado." }, { status: 404 });
    }

    const pdfBuffer = await renderHtmlToPdf(document.latestVersion.htmlContent);
    const pdfArrayBuffer = toArrayBuffer(pdfBuffer);

    return new Response(pdfArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${document.code}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible generar el PDF.";
    return Response.json({ error: message }, { status: 400 });
  }
}

function toArrayBuffer(buffer: Uint8Array<ArrayBufferLike>) {
  const arrayBuffer = new ArrayBuffer(buffer.byteLength);
  new Uint8Array(arrayBuffer).set(buffer);
  return arrayBuffer;
}
