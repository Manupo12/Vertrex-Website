import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import Handlebars from "handlebars";
import { chromium } from "playwright";
import { z } from "zod";

import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import { documentDraftSchema } from "@/lib/docs/document-draft-schema";
import {
  generatedDocumentTypes,
  getGeneratedDocumentTemplate,
} from "@/lib/docs/generated-template-registry";
import {
  getGeneratedTemplateAssetsPath,
  getGeneratedTemplateFilePath,
  getGeneratedTemplateTokensPath,
} from "@/lib/docs/generated-template-paths";

const generatedDocumentDataSchema = documentDraftSchema.extend({
  tenantId: z.string().uuid().nullable().optional(),
  projectId: z.string().uuid().nullable().optional(),
  clientSlug: z.string().min(1).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export const generateDocumentPayloadSchema = z.object({
  type: z.enum(generatedDocumentTypes),
  data: generatedDocumentDataSchema,
  lang: z.string().trim().min(2).max(10).default("es"),
});

export type GeneratedDocumentData = z.infer<typeof generatedDocumentDataSchema>;
export type GeneratedDocumentInputData = z.input<typeof generatedDocumentDataSchema>;
export type GenerateDocumentPayload = z.infer<typeof generateDocumentPayloadSchema>;
export type GenerateDocumentInput = z.input<typeof generateDocumentPayloadSchema>;

const templateSourceCache = new Map<string, string>();
const assetDataUrlCache = new Map<string, string>();
let designTokensCssCache: string | null = null;
let handlebarsReady = false;

export async function renderGeneratedDocumentHtml(input: GenerateDocumentInput) {
  ensureHandlebarsHelpers();
  const payload = generateDocumentPayloadSchema.parse(input);

  const template = getGeneratedDocumentTemplate(payload.type);
  const [templateSource, designTokensCss, logoDataUrl, signatureDataUrl] = await Promise.all([
    readCachedTextFile(getGeneratedTemplateFilePath(payload.type)),
    getDesignTokensCss(),
    getAssetDataUrl(path.join(getGeneratedTemplateAssetsPath(), "logo.png"), "image/png"),
    getAssetDataUrl(path.join(getGeneratedTemplateAssetsPath(), "firma.png"), "image/png"),
  ]);

  const viewModel = buildTemplateViewModel({
    template,
    lang: payload.lang,
    data: payload.data,
    designTokensCss,
    logoDataUrl,
    signatureDataUrl,
  });

  const compiled = Handlebars.compile(templateSource);
  return compiled(viewModel);
}

export async function renderGeneratedDocumentPdf(input: GenerateDocumentInput) {
  const payload = generateDocumentPayloadSchema.parse(input);
  const html = await renderGeneratedDocumentHtml(payload);
  return renderPdfFromHtml(html, payload);
}

export async function generateDocument(input: GenerateDocumentInput) {
  const payload = generateDocumentPayloadSchema.parse(input);
  const pdfBuffer = await renderGeneratedDocumentPdf(payload);
  const upload = await uploadGeneratedPdf(payload, pdfBuffer);
  const historyRecord = await persistGeneratedDocumentHistory(payload, upload);

  return {
    type: payload.type,
    title: payload.data.title,
    code: payload.data.code,
    lang: payload.lang,
    url: upload.url,
    blobPath: upload.pathname,
    recordId: historyRecord?.id ?? null,
    historySaved: Boolean(historyRecord),
  };
}

function ensureHandlebarsHelpers() {
  if (handlebarsReady) {
    return;
  }

  Handlebars.registerHelper("eq", (left: unknown, right: unknown) => left === right);
  handlebarsReady = true;
}

async function readCachedTextFile(filePath: string) {
  const cached = templateSourceCache.get(filePath);

  if (cached) {
    return cached;
  }

  const source = await readFile(filePath, "utf8");
  templateSourceCache.set(filePath, source);
  return source;
}

async function getDesignTokensCss() {
  if (designTokensCssCache) {
    return designTokensCssCache;
  }

  designTokensCssCache = await readFile(getGeneratedTemplateTokensPath(), "utf8");
  return designTokensCssCache;
}

async function getAssetDataUrl(filePath: string, mimeType: string) {
  const cacheKey = `${mimeType}:${filePath}`;
  const cached = assetDataUrlCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const buffer = await readFile(filePath);
  const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
  assetDataUrlCache.set(cacheKey, dataUrl);
  return dataUrl;
}

function buildTemplateViewModel(input: {
  template: ReturnType<typeof getGeneratedDocumentTemplate>;
  lang: string;
  data: GeneratedDocumentData;
  designTokensCss: string;
  logoDataUrl: string;
  signatureDataUrl: string;
}) {
  const totalAmountValue = getTotalAmountValue(input.data.lineItems);
  const totalAmountFormatted = formatCurrencyAmount(totalAmountValue);
  const normalizedLineItems = (input.data.lineItems.length > 0 ? input.data.lineItems : [
    {
      label: input.data.subject,
      description: input.data.summary,
      amount: "$0",
    },
  ]).map((item) => ({
    label: item.label,
    description: item.description,
    amount: normalizeMoneyLabel(item.amount),
  }));

  return {
    lang: input.lang,
    designTokensCss: input.designTokensCss,
    logoDataUrl: input.logoDataUrl,
    signatureDataUrl: input.signatureDataUrl,
    branding: {
      name: "VERTREX",
      tagline: "Stealth-Brutalist Software House",
      location: "Neiva, Huila · Colombia",
      email: "vertrexsc@gmail.com",
      phone: "+57 320 207 0445",
      instagram: "instagram.com/vertrexsc",
    },
    template: input.template,
    document: {
      ...input.data,
      title: input.data.title,
      code: input.data.code,
      date: input.data.date,
      city: input.data.city,
      subject: input.data.subject,
      intro: input.data.intro,
      summary: input.data.summary,
      closing: input.data.closing,
      scopeItems: toIndexedItems(input.data.scope),
      requirementItems: toIndexedItems(input.data.requirements),
      lineItems: normalizedLineItems,
      totalAmountFormatted,
      totalAmountInWords: numberToSpanishWords(totalAmountValue).toUpperCase(),
    },
  };
}

async function renderPdfFromHtml(html: string, input: GenerateDocumentPayload) {
  const logoDataUrl = await getAssetDataUrl(path.join(getGeneratedTemplateAssetsPath(), "logo.png"), "image/png");
  const executablePath = resolvePlaywrightExecutablePath();
  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    await page.emulateMedia({ media: "print" });

    return await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: createPdfHeaderTemplate({
        logoDataUrl,
        code: input.data.code,
        title: input.data.title,
        clientName: input.data.client.name,
      }),
      footerTemplate: createPdfFooterTemplate(),
      margin: {
        top: "88px",
        bottom: "74px",
        left: "16mm",
        right: "16mm",
      },
    });
  } finally {
    await browser.close();
  }
}

function createPdfHeaderTemplate(input: {
  logoDataUrl: string;
  code: string;
  title: string;
  clientName: string;
}) {
  return `
    <div style="width:100%;padding:0 18px;font-family:Inter,Arial,sans-serif;">
      <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(10,10,10,0.12);padding:10px 0 8px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <img src="${input.logoDataUrl}" alt="Vertrex" style="width:28px;height:28px;object-fit:contain;border-radius:8px;" />
          <div style="display:flex;flex-direction:column;gap:2px;">
            <span style="font-size:10px;font-weight:900;letter-spacing:0.22em;color:#0a0a0a;">VERTREX</span>
            <span style="font-size:7px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#5f6872;">Stealth-Brutalist OS</span>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:2px;text-align:right;">
          <span style="font-size:8px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#0a0a0a;">${escapeHtml(input.title)}</span>
          <span style="font-size:7px;color:#5f6872;">${escapeHtml(input.clientName)} · ${escapeHtml(input.code)}</span>
        </div>
      </div>
    </div>
  `;
}

function createPdfFooterTemplate() {
  return `
    <div style="width:100%;padding:0 18px 8px;font-family:Inter,Arial,sans-serif;">
      <div style="border-top:1px solid rgba(10,10,10,0.12);padding-top:8px;display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;flex-direction:column;gap:2px;">
          <span style="font-size:7px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#0a0a0a;">VERTREX · vertrexsc@gmail.com · +57 320 207 0445</span>
          <span style="font-size:7px;color:#5f6872;">Documento generado desde Vertrex OS</span>
        </div>
        <div style="font-size:8px;font-weight:800;color:#0a0a0a;">
          <span class="pageNumber"></span>/<span class="totalPages"></span>
        </div>
      </div>
    </div>
  `;
}

function resolvePlaywrightExecutablePath() {
  const candidates = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    process.env.PUPPETEER_EXECUTABLE_PATH,
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/snap/bin/chromium",
  ].filter((value): value is string => Boolean(value));

  return candidates.find((candidate) => existsSync(candidate));
}

async function uploadGeneratedPdf(input: GenerateDocumentPayload, pdfBuffer: Buffer) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN no está configurado. Configura Vercel Blob para generar documentos.");
  }

  const pathname = buildGeneratedDocumentPath(input);
  const blob = await put(pathname, pdfBuffer, {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/pdf",
  });

  return {
    url: blob.url,
    pathname: blob.pathname,
  };
}

function buildGeneratedDocumentPath(input: GenerateDocumentPayload) {
  const dateSegment = new Date().toISOString().slice(0, 10);
  const clientSegment = sanitizePathSegment(input.data.clientSlug ?? input.data.client.name);
  const codeSegment = sanitizePathSegment(input.data.code);
  const idSegment = randomUUID().slice(0, 8);

  return path.posix.join("documents", "generated", input.type, dateSegment, `${clientSegment}-${codeSegment}-${idSegment}.pdf`);
}

async function persistGeneratedDocumentHistory(
  input: GenerateDocumentPayload,
  upload: {
    url: string;
    pathname: string;
  },
) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const db = getDb();
  const tenantId = await resolveTenantId(input.data);
  const [record] = await db
    .insert(schema.generatedDocuments)
    .values({
      tenantId,
      projectId: input.data.projectId ?? null,
      type: input.type,
      lang: input.lang,
      title: input.data.title,
      code: input.data.code,
      blobUrl: upload.url,
      blobPath: upload.pathname,
      payload: input.data,
      metadata: {
        template: getGeneratedDocumentTemplate(input.type).label,
        source: "api/documents/generate",
      },
      createdAt: new Date(),
    })
    .returning();

  return record ?? null;
}

async function resolveTenantId(data: GeneratedDocumentData) {
  if (data.tenantId) {
    return data.tenantId;
  }

  if (!data.clientSlug || !isDatabaseConfigured) {
    return null;
  }

  const db = getDb();
  const [client] = await db
    .select({ id: schema.clients.id })
    .from(schema.clients)
    .where(eq(schema.clients.slug, data.clientSlug))
    .limit(1);

  return client?.id ?? null;
}

function toIndexedItems(items: string[]) {
  return items.map((value, index) => ({
    index: String(index + 1).padStart(2, "0"),
    value,
  }));
}

function normalizeMoneyLabel(value: string) {
  return formatCurrencyAmount(parseCurrencyAmount(value));
}

function getTotalAmountValue(items: Array<{ amount: string }>) {
  return items.reduce((total, item) => total + parseCurrencyAmount(item.amount), 0);
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

function sanitizePathSegment(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "documento";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function numberToSpanishWords(value: number): string {
  if (value === 0) {
    return "cero pesos";
  }

  if (value < 0) {
    return `menos ${numberToSpanishWords(Math.abs(value))}`;
  }

  if (value < 1000) {
    return `${numberBelowThousandToSpanish(value)} pesos`;
  }

  if (value < 1000000) {
    const thousands = Math.floor(value / 1000);
    const remainder = value % 1000;
    const thousandsText = thousands === 1 ? "mil" : `${numberBelowThousandToSpanish(thousands)} mil`;
    return remainder === 0 ? `${thousandsText} pesos` : `${thousandsText} ${numberBelowThousandToSpanish(remainder)} pesos`;
  }

  const millions = Math.floor(value / 1000000);
  const remainder = value % 1000000;
  const millionsText = millions === 1 ? "un millon" : `${numberToSpanishWords(millions).replace(/ pesos$/, "")} millones`;
  return remainder === 0 ? `${millionsText} de pesos` : `${millionsText} ${numberToSpanishWords(remainder).replace(/ pesos$/, "")} pesos`;
}

function numberBelowThousandToSpanish(value: number): string {
  const units = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
  const teens = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciseis", "diecisiete", "dieciocho", "diecinueve"];
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
