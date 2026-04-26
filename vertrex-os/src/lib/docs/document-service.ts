import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import {
  documentTemplates as catalogTemplates,
  getDocumentTemplateById,
  type DocumentDraft,
} from "@/lib/docs/template-catalog";
import { renderDocumentTemplateHtml } from "@/lib/docs/template-renderer";
import { resolvePortalClient } from "@/lib/portal/client-portal-data";

const lineItemSchema = z.object({
  label: z.string().min(1),
  description: z.string().min(1),
  amount: z.string().min(1),
});

export const documentDraftSchema = z.object({
  code: z.string().min(1),
  title: z.string().min(1),
  date: z.string().min(1),
  city: z.string().min(1),
  subject: z.string().min(1),
  intro: z.string().min(1),
  summary: z.string().min(1),
  closing: z.string().min(1),
  client: z.object({
    name: z.string().min(1),
    nit: z.string().min(1),
    address: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().min(1),
  }),
  scope: z.array(z.string().min(1)).min(1),
  requirements: z.array(z.string().min(1)).min(1),
  lineItems: z.array(lineItemSchema),
  signatory: z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    documentId: z.string().min(1),
    phone: z.string().min(1),
  }),
});

export const saveDocumentPayloadSchema = z.object({
  documentId: z.string().uuid().optional(),
  templateId: z.string().min(1),
  clientId: z.string().nullable().optional(),
  source: z.enum(["generator", "portal", "legal", "os"]).default("generator"),
  draft: documentDraftSchema,
});

export type SaveDocumentPayload = z.infer<typeof saveDocumentPayloadSchema>;

export async function saveDocument(payload: SaveDocumentPayload) {
  if (!isDatabaseConfigured) {
    throw new Error("DATABASE_URL no está configurada. Conecta Neon para guardar documentos reales.");
  }

  const parsed = saveDocumentPayloadSchema.parse(payload);
  const db = getDb();
  const template = getDocumentTemplateById(parsed.templateId, parsed.clientId);
  const templateRecord = await ensureTemplateRecord(template.id);
  const clientRecord = await ensureClientRecord(parsed.clientId, parsed.draft);
  const htmlContent = await renderDocumentTemplateHtml({
    templateId: parsed.templateId,
    clientId: parsed.clientId,
    draft: parsed.draft,
  });

  if (parsed.documentId) {
    const existingVersions = await db
      .select({ versionNumber: schema.documentVersions.versionNumber })
      .from(schema.documentVersions)
      .where(eq(schema.documentVersions.documentId, parsed.documentId))
      .orderBy(desc(schema.documentVersions.versionNumber));

    const nextVersion = (existingVersions[0]?.versionNumber ?? 0) + 1;

    await db
      .update(schema.documents)
      .set({
        code: parsed.draft.code,
        title: parsed.draft.title,
        status: "draft",
        category: template.type,
        origin: parsed.source,
        summary: parsed.draft.summary,
        payload: parsed.draft,
        templateId: templateRecord.id,
        clientId: clientRecord?.id ?? null,
        currentVersion: nextVersion,
        updatedAt: new Date(),
      })
      .where(eq(schema.documents.id, parsed.documentId));

    const [version] = await db
      .insert(schema.documentVersions)
      .values({
        documentId: parsed.documentId,
        versionNumber: nextVersion,
        htmlContent,
        draft: parsed.draft,
      })
      .returning({ id: schema.documentVersions.id, versionNumber: schema.documentVersions.versionNumber });

    return {
      documentId: parsed.documentId,
      versionId: version.id,
      versionNumber: version.versionNumber,
      htmlContent,
    };
  }

  const [document] = await db
    .insert(schema.documents)
    .values({
      code: parsed.draft.code,
      title: parsed.draft.title,
      status: "draft",
      category: template.type,
      origin: parsed.source,
      summary: parsed.draft.summary,
      payload: parsed.draft,
      templateId: templateRecord.id,
      clientId: clientRecord?.id ?? null,
      currentVersion: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({ id: schema.documents.id, currentVersion: schema.documents.currentVersion });

  const [version] = await db
    .insert(schema.documentVersions)
    .values({
      documentId: document.id,
      versionNumber: 1,
      htmlContent,
      draft: parsed.draft,
      createdAt: new Date(),
    })
    .returning({ id: schema.documentVersions.id });

  return {
    documentId: document.id,
    versionId: version.id,
    versionNumber: document.currentVersion,
    htmlContent,
  };
}

export async function getDocumentById(documentId: string) {
  if (!isDatabaseConfigured) {
    throw new Error("DATABASE_URL no está configurada. Conecta Neon para consultar documentos reales.");
  }

  const db = getDb();
  const [document] = await db
    .select()
    .from(schema.documents)
    .where(eq(schema.documents.id, documentId))
    .limit(1);

  if (!document) {
    return null;
  }

  const [latestVersion] = await db
    .select()
    .from(schema.documentVersions)
    .where(eq(schema.documentVersions.documentId, documentId))
    .orderBy(desc(schema.documentVersions.versionNumber))
    .limit(1);

  return {
    ...document,
    latestVersion,
  };
}

export async function syncTemplateCatalog() {
  if (!isDatabaseConfigured) {
    return [];
  }

  const inserted = [];
  for (const template of catalogTemplates) {
    inserted.push(await ensureTemplateRecord(template.id));
  }

  return inserted;
}

async function ensureTemplateRecord(templateId: string) {
  const template = getDocumentTemplateById(templateId, null);
  const db = getDb();
  const [existing] = await db
    .select()
    .from(schema.documentTemplates)
    .where(eq(schema.documentTemplates.templateKey, template.id))
    .limit(1);

  if (existing) {
    return existing;
  }

  const [created] = await db
    .insert(schema.documentTemplates)
    .values({
      templateKey: template.id,
      slug: template.slug,
      clientSlug: template.clientId,
      clientLabel: template.clientLabel,
      title: template.title,
      kind: template.kind,
      category: template.type,
      htmlPath: template.htmlPath,
      isDefault: template.clientId === "universales",
      metadata: {
        description: template.description,
        scopeLabel: template.scopeLabel,
        requirementsLabel: template.requirementsLabel,
        lineItemsLabel: template.lineItemsLabel,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return created;
}

async function ensureClientRecord(clientId: string | null | undefined, draft: DocumentDraft) {
  if (!clientId) {
    return null;
  }

  const db = getDb();
  const [existing] = await db
    .select()
    .from(schema.clients)
    .where(eq(schema.clients.slug, clientId))
    .limit(1);

  if (existing) {
    return existing;
  }

  const portalClient = resolvePortalClient(clientId);
  const [created] = await db
    .insert(schema.clients)
    .values({
      slug: portalClient.id,
      name: draft.client.name,
      brand: portalClient.brand,
      email: draft.client.email,
      phone: draft.client.phone,
      company: draft.client.name,
      status: "active",
      phase: portalClient.phase,
      progress: portalClient.progress,
      totalInvestmentCents: parseMoney(portalClient.totalInvestment),
      paidCents: parseMoney(portalClient.paid),
      pendingCents: parseMoney(portalClient.pending),
      welcomeTitle: portalClient.welcomeTitle,
      welcomeDescription: portalClient.welcomeDescription,
      nextAction: portalClient.nextAction,
      nextActionContext: portalClient.nextActionContext,
      nextActionCta: portalClient.nextActionCta,
      metadata: {
        displayName: portalClient.displayName,
        statusLabel: portalClient.statusLabel,
        statusHighlights: portalClient.statusHighlights,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return created;
}

function parseMoney(value: string) {
  return Number.parseInt(value.replace(/[^\d-]/g, "") || "0", 10) * 100;
}
