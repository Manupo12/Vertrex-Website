import { getDocumentById } from "@/lib/docs/document-service";
import { documentDraftSchema } from "@/lib/docs/document-draft-schema";
import { renderGeneratedDocumentPdf } from "@/lib/docs/generated-document-service";
import { isGeneratedDocumentType } from "@/lib/docs/generated-template-registry";
import { renderHtmlToPdf } from "@/lib/docs/template-renderer";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const document = await getDocumentById(id);

    if (!document?.latestVersion?.htmlContent) {
      return Response.json({ error: "Documento no encontrado." }, { status: 404 });
    }

    const parsedDraft = document.latestVersion.draft ? documentDraftSchema.safeParse(document.latestVersion.draft) : null;
    const pdfBuffer = document.template?.clientSlug === "universales"
      && isGeneratedDocumentType(document.template.slug)
      && parsedDraft?.success
      ? await renderGeneratedDocumentPdf({
          type: document.template.slug,
          data: parsedDraft.data,
          lang: "es",
        })
      : await renderHtmlToPdf(document.latestVersion.htmlContent);
    const pdfArrayBuffer = toArrayBuffer(pdfBuffer);

    return new Response(pdfArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${document.document.code}.pdf"`,
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
