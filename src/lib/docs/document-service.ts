import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import { recordAuditEvent, type AuditActorInput } from "@/lib/audit/audit-service";
import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import { documentDraftSchema } from "@/lib/docs/document-draft-schema";
import {
  documentTemplates as catalogTemplates,
  getDocumentTemplateById,
  type DocumentDraft,
} from "@/lib/docs/template-catalog";
import { renderDocumentTemplateHtml } from "@/lib/docs/template-renderer";
import { recordBusinessEvent } from "@/lib/ops/business-event-service";
import { resolvePortalClient } from "@/lib/portal/client-portal-data";
import { assertOptimisticLock } from "@/lib/security/optimistic-lock";

export const saveDocumentPayloadSchema = z.object({
  documentId: z.string().uuid().optional(),
  expectedVersion: z.number().int().min(1).nullable().optional(),
  templateId: z.string().min(1),
  clientId: z.string().nullable().optional(),
  source: z.enum(["generator", "portal", "legal", "os"]).default("generator"),
  draft: documentDraftSchema,
});

export type SaveDocumentPayload = z.infer<typeof saveDocumentPayloadSchema>;

export type SaveDocumentOptions = {
  actor?: AuditActorInput | null;
};

export type DocumentDetailVersionRecord = {
  id: string;
  versionNumber: number;
  htmlContent: string;
  pdfPath: string | null;
  draft: Record<string, unknown>;
  createdAt: string;
};

export type DocumentDetailRecord = {
  document: {
    id: string;
    clientId: string | null;
    projectId: string | null;
    templateId: string | null;
    createdById: string | null;
    code: string;
    title: string;
    status: string;
    category: string;
    origin: string;
    htmlPath: string | null;
    pdfPath: string | null;
    summary: string | null;
    currentVersion: number;
    payload: Record<string, unknown>;
    sentAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
  latestVersion: DocumentDetailVersionRecord | null;
  versions: DocumentDetailVersionRecord[];
  client: {
    id: string;
    name: string;
    slug: string;
    company: string | null;
  } | null;
  project: {
    id: string;
    name: string;
    status: string;
    clientId: string | null;
  } | null;
  template: {
    id: string;
    templateKey: string;
    slug: string;
    title: string;
    kind: string;
    category: string;
    clientSlug: string;
    clientLabel: string;
  } | null;
  pdfHref: string;
};

export async function saveDocument(payload: SaveDocumentPayload, options: SaveDocumentOptions = {}) {
  if (!isDatabaseConfigured()) {
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
    const [existingDocument] = await db
      .select({
        id: schema.documents.id,
        clientId: schema.documents.clientId,
        projectId: schema.documents.projectId,
        code: schema.documents.code,
        title: schema.documents.title,
        status: schema.documents.status,
        category: schema.documents.category,
        origin: schema.documents.origin,
        summary: schema.documents.summary,
        currentVersion: schema.documents.currentVersion,
      })
      .from(schema.documents)
      .where(eq(schema.documents.id, parsed.documentId))
      .limit(1);

    if (!existingDocument) {
      throw new Error("Documento no encontrado.");
    }

    assertOptimisticLock(
      parsed.expectedVersion === existingDocument.currentVersion,
      "Este documento cambió en otra sesión. Recarga la última versión antes de volver a guardar.",
      {
        entity: "document",
        expected: parsed.expectedVersion ?? null,
        actual: existingDocument.currentVersion,
      },
    );

    const nextVersion = existingDocument.currentVersion + 1;

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

    await recordDocumentPersistenceEvents({
      actor: options.actor,
      action: "updated",
      documentId: parsed.documentId,
      client: {
        id: clientRecord?.id ?? existingDocument.clientId ?? null,
        name: clientRecord?.name ?? null,
      },
      project: {
        id: existingDocument.projectId ?? null,
        name: null,
      },
      title: parsed.draft.title,
      code: parsed.draft.code,
      category: template.type,
      origin: parsed.source,
      source: parsed.source,
      versionId: version.id,
      versionNumber: version.versionNumber,
      templateId: template.id,
      summary: parsed.draft.summary,
      snapshotBefore: buildDocumentEventSnapshot({
        code: existingDocument.code,
        title: existingDocument.title,
        status: existingDocument.status,
        category: existingDocument.category,
        origin: existingDocument.origin,
        summary: existingDocument.summary,
        versionNumber: existingDocument.currentVersion,
      }),
      snapshotAfter: buildDocumentEventSnapshot({
        code: parsed.draft.code,
        title: parsed.draft.title,
        status: "draft",
        category: template.type,
        origin: parsed.source,
        summary: parsed.draft.summary,
        versionNumber: version.versionNumber,
      }),
    });

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

  await recordDocumentPersistenceEvents({
    actor: options.actor,
    action: "created",
    documentId: document.id,
    client: {
      id: clientRecord?.id ?? null,
      name: clientRecord?.name ?? null,
    },
    project: {
      id: null,
      name: null,
    },
    title: parsed.draft.title,
    code: parsed.draft.code,
    category: template.type,
    origin: parsed.source,
    source: parsed.source,
    versionId: version.id,
    versionNumber: document.currentVersion,
    templateId: template.id,
    summary: parsed.draft.summary,
    snapshotBefore: null,
    snapshotAfter: buildDocumentEventSnapshot({
      code: parsed.draft.code,
      title: parsed.draft.title,
      status: "draft",
      category: template.type,
      origin: parsed.source,
      summary: parsed.draft.summary,
      versionNumber: document.currentVersion,
    }),
  });

  return {
    documentId: document.id,
    versionId: version.id,
    versionNumber: document.currentVersion,
    htmlContent,
  };
}

async function recordDocumentPersistenceEvents(input: {
  actor?: AuditActorInput | null;
  action: "created" | "updated";
  documentId: string;
  client?: { id: string | null; name?: string | null } | null;
  project?: { id: string | null; name?: string | null } | null;
  title: string;
  code: string;
  category: string;
  origin: string;
  source: SaveDocumentPayload["source"];
  versionId: string;
  versionNumber: number;
  templateId: string;
  summary?: string | null;
  snapshotBefore?: Record<string, unknown> | null;
  snapshotAfter?: Record<string, unknown> | null;
}) {
  const actionLabel = input.action === "created" ? "Documento creado" : "Documento actualizado";
  const metadata = {
    code: input.code,
    title: input.title,
    category: input.category,
    origin: input.origin,
    source: input.source,
    versionId: input.versionId,
    versionNumber: input.versionNumber,
    templateId: input.templateId,
    summary: input.summary ?? null,
  };

  await recordAuditEvent({
    actor: input.actor,
    clientId: input.client?.id ?? null,
    clientName: input.client?.name ?? null,
    projectId: input.project?.id ?? null,
    projectName: input.project?.name ?? null,
    module: "documents",
    action: input.action,
    entityType: "document",
    entityId: input.documentId,
    summary: `${actionLabel}: ${input.title}`,
    metadata,
  });

  await recordBusinessEvent({
    actor: input.actor,
    eventType: `documents.${input.action}`,
    module: "documents",
    action: input.action,
    entityType: "document",
    entityId: input.documentId,
    clientId: input.client?.id ?? null,
    clientName: input.client?.name ?? null,
    projectId: input.project?.id ?? null,
    projectName: input.project?.name ?? null,
    summary: `${actionLabel}: ${input.title} · v${input.versionNumber}`,
    clientVisible: input.source === "portal",
    payload: metadata,
    snapshotBefore: input.snapshotBefore ?? null,
    snapshotAfter: input.snapshotAfter ?? null,
  });
}

function buildDocumentEventSnapshot(input: {
  code: string;
  title: string;
  status: string;
  category: string;
  origin: string;
  summary?: string | null;
  versionNumber: number;
}) {
  return {
    code: input.code,
    title: input.title,
    status: input.status,
    category: input.category,
    origin: input.origin,
    summary: input.summary ?? null,
    versionNumber: input.versionNumber,
  };
}

export async function getDocumentById(documentId: string): Promise<DocumentDetailRecord | null> {
  if (!isDatabaseConfigured()) {
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

  const versions = await db
    .select({
      id: schema.documentVersions.id,
      versionNumber: schema.documentVersions.versionNumber,
      htmlContent: schema.documentVersions.htmlContent,
      pdfPath: schema.documentVersions.pdfPath,
      draft: schema.documentVersions.draft,
      createdAt: schema.documentVersions.createdAt,
    })
    .from(schema.documentVersions)
    .where(eq(schema.documentVersions.documentId, documentId))
    .orderBy(desc(schema.documentVersions.versionNumber));

  const [template] = document.templateId
    ? await db
        .select({
          id: schema.documentTemplates.id,
          templateKey: schema.documentTemplates.templateKey,
          slug: schema.documentTemplates.slug,
          title: schema.documentTemplates.title,
          kind: schema.documentTemplates.kind,
          category: schema.documentTemplates.category,
          clientSlug: schema.documentTemplates.clientSlug,
          clientLabel: schema.documentTemplates.clientLabel,
        })
        .from(schema.documentTemplates)
        .where(eq(schema.documentTemplates.id, document.templateId))
        .limit(1)
    : [null];

  const [client] = document.clientId
    ? await db
        .select({
          id: schema.clients.id,
          name: schema.clients.name,
          slug: schema.clients.slug,
          company: schema.clients.company,
        })
        .from(schema.clients)
        .where(eq(schema.clients.id, document.clientId))
        .limit(1)
    : [null];

  const [project] = document.projectId
    ? await db
        .select({
          id: schema.projects.id,
          name: schema.projects.name,
          status: schema.projects.status,
          clientId: schema.projects.clientId,
        })
        .from(schema.projects)
        .where(eq(schema.projects.id, document.projectId))
        .limit(1)
    : [null];

  const mappedVersions: DocumentDetailVersionRecord[] = versions.map((version) => ({
    id: version.id,
    versionNumber: version.versionNumber,
    htmlContent: version.htmlContent,
    pdfPath: version.pdfPath,
    draft: version.draft,
    createdAt: version.createdAt.toISOString(),
  }));

  return {
    document: {
      id: document.id,
      clientId: document.clientId,
      projectId: document.projectId,
      templateId: document.templateId,
      createdById: document.createdById,
      code: document.code,
      title: document.title,
      status: document.status,
      category: document.category,
      origin: document.origin,
      htmlPath: document.htmlPath,
      pdfPath: document.pdfPath,
      summary: document.summary,
      currentVersion: document.currentVersion,
      payload: document.payload,
      sentAt: toIsoString(document.sentAt),
      createdAt: toIsoString(document.createdAt) ?? new Date().toISOString(),
      updatedAt: toIsoString(document.updatedAt) ?? new Date().toISOString(),
    },
    latestVersion: mappedVersions[0] ?? null,
    versions: mappedVersions,
    client,
    project,
    template,
    pdfHref: `/api/docs/documents/${document.id}/pdf`,
  };
}

export async function syncTemplateCatalog() {
  if (!isDatabaseConfigured()) {
    return [];
  }

  const inserted = [];
  for (const template of catalogTemplates) {
    inserted.push(await ensureTemplateRecord(template.id));
  }

  return inserted;
}

function toIsoString(value: Date | null | undefined) {
  return value ? value.toISOString() : null;
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
