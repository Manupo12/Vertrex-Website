import { desc, eq } from "drizzle-orm";

import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import {
  resolvePortalClient,
  type PortalClient,
  type PortalCredential,
  type PortalDocument,
  type PortalFile,
  type PortalInvoice,
  type PortalTask,
  type PortalTicket,
} from "@/lib/portal/client-portal-data";

export async function getPortalClientBySlug(clientSlug: string): Promise<PortalClient> {
  const fallback = resolvePortalClient(clientSlug);

  if (!isDatabaseConfigured) {
    return fallback;
  }

  const db = getDb();
  const [client] = await db
    .select()
    .from(schema.clients)
    .where(eq(schema.clients.slug, clientSlug))
    .limit(1);

  if (!client) {
    return fallback;
  }

  const [tasks, documents, invoices, credentials, files, tickets] = await Promise.all([
    db.select().from(schema.tasks).where(eq(schema.tasks.clientId, client.id)).orderBy(desc(schema.tasks.updatedAt)),
    db.select().from(schema.documents).where(eq(schema.documents.clientId, client.id)).orderBy(desc(schema.documents.updatedAt)),
    db.select().from(schema.invoices).where(eq(schema.invoices.clientId, client.id)).orderBy(desc(schema.invoices.updatedAt)),
    db.select().from(schema.portalCredentials).where(eq(schema.portalCredentials.clientId, client.id)).orderBy(desc(schema.portalCredentials.updatedAt)),
    db.select().from(schema.portalFiles).where(eq(schema.portalFiles.clientId, client.id)).orderBy(desc(schema.portalFiles.updatedAt)),
    db.select().from(schema.tickets).where(eq(schema.tickets.clientId, client.id)).orderBy(desc(schema.tickets.updatedAt)),
  ]);

  return {
    ...fallback,
    id: client.slug,
    brand: client.brand,
    displayName: getStringMetadata(client.metadata, "displayName") ?? client.name,
    statusLabel: getStringMetadata(client.metadata, "statusLabel") ?? fallback.statusLabel,
    welcomeTitle: client.welcomeTitle ?? fallback.welcomeTitle,
    welcomeDescription: client.welcomeDescription ?? fallback.welcomeDescription,
    phase: client.phase ?? fallback.phase,
    progress: client.progress,
    totalInvestment: formatMoney(client.totalInvestmentCents),
    paid: formatMoney(client.paidCents),
    pending: formatMoney(client.pendingCents),
    nextAction: client.nextAction ?? fallback.nextAction,
    nextActionContext: client.nextActionContext ?? fallback.nextActionContext,
    nextActionCta: client.nextActionCta ?? fallback.nextActionCta,
    statusHighlights: getStatusHighlights(client.metadata) ?? fallback.statusHighlights,
    tasks: tasks.length > 0 ? tasks.map(mapTask) : fallback.tasks,
    documents: documents.length > 0 ? documents.map(mapDocument) : fallback.documents,
    invoices: invoices.length > 0 ? invoices.map(mapInvoice) : fallback.invoices,
    credentials: credentials.length > 0 ? credentials.map(mapCredential) : fallback.credentials,
    files: files.length > 0 ? files.map(mapFile) : fallback.files,
    tickets: tickets.length > 0 ? tickets.map(mapTicket) : fallback.tickets,
  };
}

function mapTask(task: typeof schema.tasks.$inferSelect): PortalTask {
  return {
    id: task.id,
    title: task.title,
    owner: task.owner ?? "Vertrex",
    status: task.status === "done" ? "done" : task.status === "in_progress" ? "active" : "pending",
    dueLabel: task.dueLabel ?? "Pendiente",
  };
}

function mapDocument(document: typeof schema.documents.$inferSelect): PortalDocument {
  const type = document.category === "Legal"
    ? "Legal"
    : document.category === "Finanzas"
      ? "Factura"
      : "Entrega";

  const overlay = document.category === "Legal"
    ? "contract"
    : document.category === "Finanzas"
      ? "ticket"
      : "asset";

  return {
    id: document.id,
    name: document.title,
    date: formatDateLabel(document.updatedAt ?? document.createdAt),
    type,
    highlight: document.status === "review",
    overlay,
    overlayId: document.id,
    href: `/api/docs/documents/${document.id}/pdf`,
  };
}

function mapInvoice(invoice: typeof schema.invoices.$inferSelect): PortalInvoice {
  return {
    id: invoice.id,
    label: invoice.label,
    invoiceNumber: invoice.invoiceNumber,
    amount: formatMoney(invoice.amountCents),
    dueDate: invoice.dueLabel ?? formatDateLabel(invoice.updatedAt ?? invoice.createdAt),
    status: invoice.status === "cancelled" ? "overdue" : invoice.status,
    supportId: getStringMetadata(invoice.metadata, "supportId") ?? invoice.id,
  };
}

function mapCredential(credential: typeof schema.portalCredentials.$inferSelect): PortalCredential {
  return {
    id: credential.id,
    title: credential.title,
    scope: credential.scope ?? "General",
    status: credential.status,
    updatedAt: credential.updatedLabel ?? formatDateLabel(credential.updatedAt ?? credential.createdAt),
  };
}

function mapFile(file: typeof schema.portalFiles.$inferSelect): PortalFile {
  return {
    id: file.id,
    name: file.name,
    size: file.sizeLabel ?? "Sin tamaño",
    uploadedAt: file.uploadedAtLabel ?? formatDateLabel(file.updatedAt ?? file.createdAt),
    category: file.category ?? "General",
    source: file.source,
  };
}

function mapTicket(ticket: typeof schema.tickets.$inferSelect): PortalTicket {
  return {
    id: ticket.id,
    title: ticket.title,
    status: ticket.status === "closed" ? "resolved" : ticket.status,
    updatedAt: ticket.updatedLabel ?? formatDateLabel(ticket.updatedAt ?? ticket.createdAt),
    summary: ticket.summary ?? "Sin resumen disponible.",
  };
}

function formatMoney(amountCents: number | null) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format((amountCents ?? 0) / 100);
}

function formatDateLabel(date: Date | null) {
  if (!date) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getStringMetadata(metadata: Record<string, unknown>, key: string) {
  const value = metadata?.[key];
  return typeof value === "string" ? value : null;
}

function getStatusHighlights(metadata: Record<string, unknown>) {
  const value = metadata?.statusHighlights;

  if (!Array.isArray(value)) {
    return null;
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const label = "label" in item && typeof item.label === "string" ? item.label : null;
    const itemValue = "value" in item && typeof item.value === "string" ? item.value : null;

    return label && itemValue ? [{ label, value: itemValue }] : [];
  });
}
