import { z } from "zod";

import { documentDraftSchema } from "@/lib/docs/document-draft-schema";
import { renderDocumentTemplateHtml, renderDocumentTemplatePdf } from "@/lib/docs/template-renderer";

export const runtime = "nodejs";

const renderPayloadSchema = z.object({
  templateId: z.string().min(1),
  clientId: z.string().nullable().optional(),
  draft: documentDraftSchema,
  format: z.enum(["html", "pdf"]).default("html"),
});

export async function POST(request: Request) {
  try {
    const payload = renderPayloadSchema.parse(await request.json());

    if (payload.format === "pdf") {
      const pdfBuffer = await renderDocumentTemplatePdf(payload);
      const pdfArrayBuffer = toArrayBuffer(pdfBuffer);

      return new Response(pdfArrayBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${payload.draft.code}.pdf"`,
          "Cache-Control": "no-store",
        },
      });
    }

    const html = await renderDocumentTemplateHtml(payload);

    return Response.json({ html });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No fue posible renderizar el documento.";

    return Response.json({ error: message }, { status: 400 });
  }
}

function toArrayBuffer(buffer: Uint8Array<ArrayBufferLike>) {
  const arrayBuffer = new ArrayBuffer(buffer.byteLength);
  new Uint8Array(arrayBuffer).set(buffer);
  return arrayBuffer;
}
