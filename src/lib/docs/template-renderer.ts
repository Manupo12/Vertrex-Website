import { readFile } from "node:fs/promises";
import path from "node:path";

import puppeteer from "puppeteer";

import { renderGeneratedDocumentHtml, renderGeneratedDocumentPdf } from "@/lib/docs/generated-document-service";
import { isGeneratedDocumentType } from "@/lib/docs/generated-template-registry";
import {
  getDocumentTemplateById,
  type DocumentDraft,
  type DocumentTemplateDefinition,
} from "@/lib/docs/template-catalog";

type RenderDocumentInput = {
  templateId: string;
  clientId?: string | null;
  draft: DocumentDraft;
};

export async function renderDocumentTemplateHtml({ templateId, clientId, draft }: RenderDocumentInput) {
  const template = getDocumentTemplateById(templateId, clientId);

  if (template.clientId === "universales" && isGeneratedDocumentType(template.slug)) {
    return renderGeneratedDocumentHtml({
      type: template.slug,
      data: {
        ...draft,
        clientSlug: clientId ?? null,
      },
      lang: "es",
    });
  }

  let html = await readFile(getTemplateFilePath(template), "utf8");

  html = replaceMetadataLines(html, draft);
  html = replaceCommonPlaceholders(html, draft);
  html = replaceDocumentSpecificSections(html, template, draft);
  html = injectDynamicAppendix(html, template, draft);
  html = await replaceLocalAssetPaths(html);

  return html;
}

export async function renderDocumentTemplatePdf(input: RenderDocumentInput) {
  const template = getDocumentTemplateById(input.templateId, input.clientId);

  if (template.clientId === "universales" && isGeneratedDocumentType(template.slug)) {
    return renderGeneratedDocumentPdf({
      type: template.slug,
      data: {
        ...input.draft,
        clientSlug: input.clientId ?? null,
      },
      lang: "es",
    });
  }

  const html = await renderDocumentTemplateHtml(input);
  return renderHtmlToPdf(html);
}

export async function renderHtmlToPdf(html: string) {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    return await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
      preferCSSPageSize: true,
    });
  } finally {
    await browser.close();
  }
}

function getTemplateFilePath(template: DocumentTemplateDefinition) {
  const fileName = template.clientId === "universales" ? `${template.slug}.html` : `${template.clientId}-${template.slug}.html`;
  const folderParts = template.clientId === "universales" ? ["universales"] : [];

  return path.join(
    process.cwd(),
    "src",
    "app",
    "_os",
    "(os)",
    "docs",
    "generator",
    "plantillas",
    ...folderParts,
    fileName,
  );
}

function replaceMetadataLines(html: string, draft: DocumentDraft) {
  return html
    .replace(/(<span class="text-gray-300">FECHA:<\/span>\s*<span[^>]*>)([^<]*)(<\/span>)/, `$1${escapeHtml(draft.date)}$3`)
    .replace(/(<span class="text-gray-300">CÓDIGO:<\/span>\s*<span[^>]*>)([^<]*)(<\/span>)/, `$1${escapeHtml(draft.code)}$3`)
    .replace(/(<span class="text-gray-300">CIUDAD:<\/span>\s*<span[^>]*>)([^<]*)(<\/span>)/, `$1${escapeHtml(draft.city)}$3`);
}

function replaceCommonPlaceholders(html: string, draft: DocumentDraft) {
  const totalAmount = getTotalAmount(draft.lineItems);
  const firstLine = draft.lineItems[0];
  const subject = draft.subject || draft.title;
  const commonReplacements: Array<[string, string]> = [
    ["[FECHA]", draft.date],
    ["[Colocar fecha]", draft.date],
    ["[DD/MM/YYYY]", draft.date],
    ["VTX-OFC-PLT-001", draft.code],
    ["VTX-CDC-PLT-001", draft.code],
    ["VTX-SOW-001", draft.code],
    ["[NOMBRE DEL CLIENTE / EMPRESA]", draft.client.name],
    ["[IDENTIFICACIÓN]", draft.client.nit],
    ["[DIRECCIÓN DEL CLIENTE]", draft.client.address],
    ["[TELÉFONO DEL CLIENTE]", draft.client.phone],
    ["[CORREO DEL CLIENTE]", draft.client.email],
    ["[TIPO DE PROYECTO / SOLUCIÓN]", subject],
    ["[DESCRIPCIÓN DEL SERVICIO COBRADO]", firstLine?.label ?? draft.summary],
    ["$ [MONTO]", totalAmount],
    ["[MONTO]", totalAmount.replace(/[$,\s]/g, "")],
    ["[ESCRIBIR VALOR EN LETRAS]", numberToSpanishWords(parseCurrencyAmount(totalAmount)).toUpperCase()],
  ];

  return commonReplacements.reduce(
    (currentHtml, [token, value]) => currentHtml.split(token).join(escapeHtml(value)),
    html,
  );
}

function replaceDocumentSpecificSections(
  html: string,
  template: DocumentTemplateDefinition,
  draft: DocumentDraft,
) {
  if (template.slug === "cuenta-de-cobro") {
    const totalAmount = getTotalAmount(draft.lineItems);
    const tableRows = draft.lineItems
      .map(
        (item) => `
          <tr>
            <td class="px-5 py-6">
              <p class="font-bold text-vBlack text-base">${escapeHtml(item.label)}</p>
              <p class="text-gray-600 mt-1 text-[13px] leading-relaxed">${escapeHtml(item.description)}</p>
            </td>
            <td class="px-5 py-6 text-right font-mono font-bold text-[17px] align-top whitespace-nowrap text-vBlack">
              ${escapeHtml(item.amount)}
            </td>
          </tr>
        `,
      )
      .join("");

    return html
      .replace(
        /<tbody class="bg-white divide-y divide-gray-200">[\s\S]*?<\/tbody>/,
        `<tbody class="bg-white divide-y divide-gray-200">${tableRows}</tbody>`,
      )
      .replace(
        /(<td class="px-5 py-4 text-right text-xl font-bold text-vBlack font-mono whitespace-nowrap">)([^<]*)(<\/td>)/,
        `$1${escapeHtml(totalAmount)}$3`,
      );
  }

  if (template.slug === "oficio") {
    return html.replace(
      /(<p class="text-sm font-bold text-gray-600 uppercase tracking-widest mb-1">Asunto:<\/p>\s*<h1[^>]*>)([\s\S]*?)(<\/h1>)/,
      `$1${escapeHtml(draft.subject)}$3`,
    );
  }

  if (template.slug === "sow") {
    return html.replace(
      /(<div class="w-\[45%\] text-right border-l border-gray-200 pl-6">[\s\S]*?<h3 class="font-bold text-base text-vBlack">)([\s\S]*?)(<\/h3>)/,
      `$1${escapeHtml(draft.client.name)}$3`,
    );
  }

  return html;
}

function injectDynamicAppendix(
  html: string,
  template: DocumentTemplateDefinition,
  draft: DocumentDraft,
) {
  const appendix = `
    <section class="my-10 break-inside-avoid print-border bg-white border border-gray-300 p-6 rounded shadow-sm border-t-4 border-t-vBlack" style="-webkit-print-color-adjust: exact; print-color-adjust: exact;">
      <p class="font-bold text-base text-vBlack mb-4 uppercase tracking-wider border-b border-gray-200 pb-2">Resumen operativo generado desde Vertrex OS</p>
      <div class="space-y-4 text-[14px] leading-relaxed text-gray-800">
        <p>${escapeHtml(draft.intro)}</p>
        <p>${escapeHtml(draft.summary)}</p>
      </div>
    </section>
    <section class="my-10 break-inside-avoid print-border bg-white border border-gray-300 p-6 rounded shadow-sm border-t-4 border-t-vGreen" style="-webkit-print-color-adjust: exact; print-color-adjust: exact;">
      <p class="font-bold text-base text-vBlack mb-4 uppercase tracking-wider border-b border-gray-200 pb-2">${escapeHtml(template.scopeLabel)}</p>
      <ul class="grid grid-cols-1 gap-y-3 text-[14px] text-gray-800 md:grid-cols-2 md:gap-x-6">
        ${draft.scope.map((item) => `<li class="flex items-start gap-3"><span class="text-vBlack font-bold mt-0.5">•</span><span>${escapeHtml(item)}</span></li>`).join("")}
      </ul>
    </section>
    <section class="my-10 break-inside-avoid print-border bg-white border border-gray-300 p-6 rounded shadow-sm border-t-4 border-t-vBlack" style="-webkit-print-color-adjust: exact; print-color-adjust: exact;">
      <p class="font-bold text-base text-vBlack mb-4 uppercase tracking-wider border-b border-gray-200 pb-2">${escapeHtml(template.requirementsLabel)}</p>
      <ul class="space-y-3 text-[14px] text-gray-800">
        ${draft.requirements.map((item) => `<li class="flex items-start gap-3"><span class="text-vGreen font-bold mt-0.5">■</span><span>${escapeHtml(item)}</span></li>`).join("")}
      </ul>
      <p class="mt-5 text-[14px] leading-relaxed text-gray-800">${escapeHtml(draft.closing)}</p>
    </section>
  `;

  return html.replace(/<\/main>/, `${appendix}</main>`);
}

async function replaceLocalAssetPaths(html: string) {
  const assetFolder = path.join(process.cwd(), "src", "app", "_os", "(os)", "docs", "generator", "plantillas", "vaul");
  const [logoBuffer, signatureBuffer] = await Promise.all([
    readFile(path.join(assetFolder, "logo.png")),
    readFile(path.join(assetFolder, "firma.png")),
  ]);
  const logoDataUrl = toDataUrl(logoBuffer, "image/png");
  const signatureDataUrl = toDataUrl(signatureBuffer, "image/png");

  return html
    .replaceAll('src="vaul/logo.png"', `src="${logoDataUrl}"`)
    .replaceAll('src="vaul/firma.png"', `src="${signatureDataUrl}"`);
}

function getTotalAmount(items: DocumentDraft["lineItems"]) {
  if (items.length === 0) {
    return "$0";
  }

  const sum = items.reduce((total, item) => total + parseCurrencyAmount(item.amount), 0);
  return formatCurrencyAmount(sum);
}

function parseCurrencyAmount(value: string) {
  const sanitized = value.replace(/[^\d-]/g, "");
  return Number.parseInt(sanitized || "0", 10);
}

function formatCurrencyAmount(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toDataUrl(buffer: Buffer, mimeType: string) {
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

function numberToSpanishWords(value: number): string {
  if (value === 0) {
    return "cero";
  }

  if (value < 0) {
    return `menos ${numberToSpanishWords(Math.abs(value))}`;
  }

  if (value < 1000) {
    return numberBelowThousandToSpanish(value);
  }

  if (value < 1000000) {
    const thousands = Math.floor(value / 1000);
    const remainder = value % 1000;
    const thousandsText = thousands === 1 ? "mil" : `${numberBelowThousandToSpanish(thousands)} mil`;
    return remainder === 0 ? thousandsText : `${thousandsText} ${numberBelowThousandToSpanish(remainder)}`;
  }

  const millions = Math.floor(value / 1000000);
  const remainder = value % 1000000;
  const millionsText = millions === 1 ? "un millón" : `${numberToSpanishWords(millions)} millones`;
  return remainder === 0 ? millionsText : `${millionsText} ${numberToSpanishWords(remainder)}`;
}

function numberBelowThousandToSpanish(value: number): string {
  const units = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
  const teens = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
  const tens = ["", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
  const hundreds = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

  if (value === 100) {
    return "cien";
  }

  if (value < 10) {
    return units[value];
  }

  if (value < 20) {
    return teens[value - 10];
  }

  if (value < 30) {
    return value === 20 ? "veinte" : `veinti${units[value - 20]}`;
  }

  if (value < 100) {
    const ten = Math.floor(value / 10);
    const unit = value % 10;
    return unit === 0 ? tens[ten] : `${tens[ten]} y ${units[unit]}`;
  }

  const hundred = Math.floor(value / 100);
  const remainder = value % 100;
  return remainder === 0 ? hundreds[hundred] : `${hundreds[hundred]} ${numberBelowThousandToSpanish(remainder)}`;
}
