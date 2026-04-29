import { desc, eq } from "drizzle-orm";

import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import {
  resolvePortalClient,
  type PortalClient,
  type PortalCredential,
  type PortalDocument,
  type PortalFile,
  type PortalInvoice,
  type PortalMessage,
  type PortalProjectSummary,
  type PortalTask,
  type PortalTicket,
  type PortalTimelineItem,
} from "@/lib/portal/client-portal-data";
import {
  evaluateWorkspaceTicketSla,
  getWorkspaceRequestTypeLabel,
  inferWorkspaceRequestType,
} from "@/lib/ops/request-governance";
import { getRecentBusinessEvents, type BusinessEventRecord } from "@/lib/ops/business-event-service";
import {
  mapTaskStatusToPortalStatus,
  normalizeInvoiceStatus,
  isDocumentAttentionStatus,
  isPortalHighlightedDocumentStatus,
} from "@/lib/ops/status-catalog";
import { resolveStoredAssetHref } from "@/lib/storage/asset-storage";

export async function getPortalClientBySlug(clientSlug: string): Promise<PortalClient> {
  const fallback = resolvePortalClient(clientSlug);

  if (!isDatabaseConfigured()) {
    return fallback;
  }

  const db = getDb();
  const [client] = await readOptionalPortalDataset(() =>
    db
      .select()
      .from(schema.clients)
      .where(eq(schema.clients.slug, clientSlug))
      .limit(1),
  );

  if (!client) {
    return fallback;
  }

  const [projects, tasks, documents, invoices, credentials, files, tickets, messages, events, milestones, businessEvents] = await Promise.all([
    readOptionalPortalDataset(() => db.select().from(schema.projects).where(eq(schema.projects.clientId, client.id)).orderBy(desc(schema.projects.updatedAt))),
    readOptionalPortalDataset(() => db.select().from(schema.tasks).where(eq(schema.tasks.clientId, client.id)).orderBy(desc(schema.tasks.updatedAt))),
    readOptionalPortalDataset(() => db.select().from(schema.documents).where(eq(schema.documents.clientId, client.id)).orderBy(desc(schema.documents.updatedAt))),
    readOptionalPortalDataset(() => db.select().from(schema.invoices).where(eq(schema.invoices.clientId, client.id)).orderBy(desc(schema.invoices.updatedAt))),
    readOptionalPortalDataset(() => db.select().from(schema.portalCredentials).where(eq(schema.portalCredentials.clientId, client.id)).orderBy(desc(schema.portalCredentials.updatedAt))),
    readOptionalPortalDataset(() => db.select().from(schema.portalFiles).where(eq(schema.portalFiles.clientId, client.id)).orderBy(desc(schema.portalFiles.updatedAt))),
    readOptionalPortalDataset(() => db.select().from(schema.tickets).where(eq(schema.tickets.clientId, client.id)).orderBy(desc(schema.tickets.updatedAt))),
    readOptionalPortalDataset(() => db.select().from(schema.conversationMessages).where(eq(schema.conversationMessages.clientId, client.id)).orderBy(desc(schema.conversationMessages.createdAt))),
    readOptionalPortalDataset(() => db.select().from(schema.calendarEvents).where(eq(schema.calendarEvents.clientId, client.id)).orderBy(desc(schema.calendarEvents.startsAt))),
    readOptionalPortalDataset(() => db.select().from(schema.milestones).orderBy(desc(schema.milestones.updatedAt))),
    getRecentBusinessEvents({ limit: 8, clientId: client.id, clientVisibleOnly: true }),
  ]);

  const mappedTasks = tasks.map(mapTask);
  const mappedDocuments = documents.map(mapDocument);
  const mappedInvoices = invoices.map(mapInvoice);
  const mappedCredentials = credentials.map(mapCredential);
  const mappedFiles = files.map(mapFile);
  const mappedTickets = tickets.map(mapTicket);
  const mappedMessages = messages.slice().reverse().map(mapMessage);
  const timeline = buildPortalTimeline(mappedTasks, mappedDocuments, events, businessEvents, []);
  const completedTasks = mappedTasks.filter((task) => task.status === "done").length;
  const totalTasks = mappedTasks.length;
  const displayName = getStringMetadata(client.metadata, "displayName") ?? client.name;
  const projectSummaries = buildPortalProjectSummaries({ projects, tasks, documents, milestones, businessEvents, fallbackProjects: fallback.projects ?? [] });
  const nextActionContext = client.nextActionContext ?? inferPortalNextActionContext(mappedCredentials, mappedInvoices, mappedTickets);
  const nextAction =
    client.nextAction ??
    inferPortalNextAction({
      context: nextActionContext,
      invoices: mappedInvoices,
      credentials: mappedCredentials,
      tickets: mappedTickets,
      events,
    });
  const nextActionCta = client.nextActionCta ?? inferPortalNextActionCta(nextActionContext);
  const phase = client.phase ?? inferPortalPhase(client.progress);
  const statusLabel = getStringMetadata(client.metadata, "statusLabel") ?? inferPortalStatusLabel(client.progress, mappedInvoices, mappedTickets);
  const statusHighlights =
    getStatusHighlights(client.metadata) ?? buildPortalStatusHighlights({ progress: client.progress, completedTasks, totalTasks, documentsCount: mappedDocuments.length, tickets: mappedTickets, events });

  return {
    id: client.slug,
    brand: client.brand,
    displayName,
    statusLabel,
    welcomeTitle: client.welcomeTitle ?? `Bienvenido de nuevo, ${displayName}.`,
    welcomeDescription:
      client.welcomeDescription ??
      "Resumen en tiempo real del progreso, documentos, facturación, archivos y soporte de tu proyecto con Vertrex.",
    phase,
    progress: client.progress,
    totalInvestment: formatMoney(client.totalInvestmentCents),
    paid: formatMoney(client.paidCents),
    pending: formatMoney(client.pendingCents),
    nextAction,
    nextActionContext,
    nextActionCta,
    statusHighlights,
    projects: projectSummaries,
    completedTasks,
    totalTasks,
    timeline,
    tasks: mappedTasks,
    documents: mappedDocuments,
    invoices: mappedInvoices,
    credentials: mappedCredentials,
    files: mappedFiles,
    tickets: mappedTickets,
    messages: mappedMessages,
  };
}

async function readOptionalPortalDataset<T>(reader: () => Promise<T[]>) {
  try {
    return await reader();
  } catch (error) {
    if (isMissingPortalRelationError(error)) {
      return [];
    }

    throw error;
  }
}

function isMissingPortalRelationError(error: unknown): boolean {
  if (!error) {
    return false;
  }

  if (typeof error === "string") {
    return hasMissingPortalRelationMessage(error);
  }

  if (typeof error === "object") {
    const candidate = error as { code?: unknown; message?: unknown; cause?: unknown };

    if (candidate.code === "42P01") {
      return true;
    }

    if (typeof candidate.message === "string" && hasMissingPortalRelationMessage(candidate.message)) {
      return true;
    }

    return isMissingPortalRelationError(candidate.cause);
  }

  return false;
}

function hasMissingPortalRelationMessage(message: string) {
  const normalized = message.toLowerCase();

  return (
    (normalized.includes("relation") && normalized.includes("does not exist"))
    || (normalized.includes("table") && normalized.includes("does not exist"))
    || normalized.includes("no such table")
    || normalized.includes("undefined_table")
  );
}

function mapTask(task: typeof schema.tasks.$inferSelect): PortalTask {
  return {
    id: task.id,
    title: task.title,
    owner: task.owner ?? "Vertrex",
    status: mapTaskStatusToPortalStatus(task.status),
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
    highlight: isPortalHighlightedDocumentStatus(document.status),
    overlay,
    overlayId: document.id,
    href: `/api/docs/documents/${document.id}/pdf`,
  };
}

function mapInvoice(invoice: typeof schema.invoices.$inferSelect): PortalInvoice {
  const normalized = normalizeInvoiceStatus(invoice.status);
  return {
    id: invoice.id,
    label: invoice.label,
    invoiceNumber: invoice.invoiceNumber,
    amount: formatMoney(invoice.amountCents),
    dueDate: invoice.dueLabel ?? formatDateLabel(invoice.updatedAt ?? invoice.createdAt),
    status: normalized === "overdue" || normalized === "disputed" ? "overdue" : normalized === "paid" ? "paid" : "pending",
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
    href: resolveStoredAssetHref(file.metadata, file.storageKey),
    provider: getStringMetadata(file.metadata, "provider"),
  };
}

function mapTicket(ticket: typeof schema.tickets.$inferSelect): PortalTicket {
  const requestType = inferWorkspaceRequestType({
    requestType: getStringMetadata(ticket.metadata, "requestType"),
    title: ticket.title,
    summary: ticket.summary,
    channel: getStringMetadata(ticket.metadata, "channel"),
  });
  const sla = evaluateWorkspaceTicketSla({
    requestType,
    status: ticket.status,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  });

  return {
    id: ticket.id,
    title: ticket.title,
    status: ticket.status === "closed" ? "resolved" : ticket.status,
    requestType,
    requestTypeLabel: getWorkspaceRequestTypeLabel(requestType),
    slaStatus: sla.status,
    slaLabel: sla.label,
    slaWindowLabel: sla.windowLabel,
    updatedAt: ticket.updatedLabel ?? formatDateLabel(ticket.updatedAt ?? ticket.createdAt),
    summary: ticket.summary ?? "Sin resumen disponible.",
  };
}

function mapMessage(message: typeof schema.conversationMessages.$inferSelect): PortalMessage {
  return {
    id: message.id,
    sender: message.senderName,
    role: message.senderRole === "assistant" ? "assistant" : message.senderRole === "client" ? "client" : "team",
    at: formatDateTime(message.createdAt),
    body: message.message,
  };
}

function buildPortalTimeline(
  tasks: PortalTask[],
  documents: PortalDocument[],
  events: Array<typeof schema.calendarEvents.$inferSelect>,
  businessEvents: BusinessEventRecord[],
  fallback: PortalTimelineItem[],
) {
  const businessTimeline: PortalTimelineItem[] = businessEvents.slice(0, 2).map((event) => ({
    status: event.entityType === "milestone" ? "active" : "done",
    title: event.summary,
    date: formatDateTime(new Date(event.createdAt)),
  }));
  const taskTimeline: PortalTimelineItem[] = tasks.slice(0, 2).map((task) => ({
    status: task.status,
    title: task.title,
    date: task.dueLabel,
  }));
  const documentTimeline: PortalTimelineItem[] = documents.slice(0, 1).map((document) => ({
    status: document.highlight ? "active" : "done",
    title: document.name,
    date: document.date,
  }));
  const eventTimeline: PortalTimelineItem[] = events.slice(0, 2).map((event) => ({
    status: event.startsAt >= new Date() ? "pending" : "done",
    title: event.title,
    date: formatDateTime(event.startsAt),
  }));
  const timeline: PortalTimelineItem[] = [...businessTimeline, ...taskTimeline, ...documentTimeline, ...eventTimeline].slice(0, 4);

  return timeline.length > 0 ? timeline : fallback;
}

function buildPortalProjectSummaries(input: {
  projects: Array<typeof schema.projects.$inferSelect>;
  tasks: Array<typeof schema.tasks.$inferSelect>;
  documents: Array<typeof schema.documents.$inferSelect>;
  milestones: Array<typeof schema.milestones.$inferSelect>;
  businessEvents: BusinessEventRecord[];
  fallbackProjects: PortalProjectSummary[];
}) {
  if (input.projects.length === 0) {
    return input.fallbackProjects;
  }

  const openTasksByProject = countBy(input.tasks.filter((task) => task.status !== "done"), (task) => task.projectId);
  const documentCountByProject = countBy(input.documents, (document) => document.projectId);
  const milestoneWeightByProject = sumBy(input.milestones, (milestone) => milestone.projectId, (milestone) => Math.max(1, milestone.weight));
  const completedMilestoneWeightByProject = sumBy(input.milestones.filter((milestone) => ["approved", "completed", "skipped"].includes(milestone.status)), (milestone) => milestone.projectId, (milestone) => Math.max(1, milestone.weight));
  const latestActivityByProject = new Map<string, Date>();

  const registerProjectActivity = (projectId: string | null | undefined, value: Date | null | undefined) => {
    if (!projectId || !value) {
      return;
    }

    const current = latestActivityByProject.get(projectId);

    if (!current || value.getTime() > current.getTime()) {
      latestActivityByProject.set(projectId, value);
    }
  };

  for (const project of input.projects) {
    registerProjectActivity(project.id, project.updatedAt);
  }

  for (const task of input.tasks) {
    registerProjectActivity(task.projectId, task.updatedAt);
  }

  for (const document of input.documents) {
    registerProjectActivity(document.projectId, document.updatedAt);
  }

  for (const milestone of input.milestones) {
    registerProjectActivity(milestone.projectId, milestone.updatedAt);
    registerProjectActivity(milestone.projectId, milestone.completedAt);
    registerProjectActivity(milestone.projectId, milestone.targetDate);
  }

  for (const event of input.businessEvents) {
    registerProjectActivity(event.projectId, new Date(event.createdAt));
  }

  return input.projects.map<PortalProjectSummary>((project) => {
    const totalMilestoneWeight = milestoneWeightByProject.get(project.id) ?? 0;
    const completedMilestoneWeight = completedMilestoneWeightByProject.get(project.id) ?? 0;
    const activeMilestone = input.milestones.find((milestone) => milestone.projectId === project.id && !["approved", "completed", "skipped"].includes(milestone.status));
    const recentBusinessEvent = input.businessEvents.find((event) => event.projectId === project.id);

    return {
      id: project.id,
      name: project.name,
      status: project.status,
      progress: totalMilestoneWeight > 0 ? Math.max(0, Math.min(100, Math.round((completedMilestoneWeight / totalMilestoneWeight) * 100))) : project.progress,
      openTasks: openTasksByProject.get(project.id) ?? 0,
      documents: documentCountByProject.get(project.id) ?? 0,
      lastUpdate: formatDateTime(latestActivityByProject.get(project.id) ?? project.updatedAt),
      focusLabel: activeMilestone?.title ?? recentBusinessEvent?.summary ?? project.description ?? "Seguimiento operativo",
    };
  });
}

function inferPortalStatusLabel(progress: number, invoices: PortalInvoice[], tickets: PortalTicket[]) {
  const overdueInvoices = invoices.filter((invoice) => invoice.status === "overdue").length;

  if (overdueInvoices > 0) {
    return `${overdueInvoices} pagos vencidos`;
  }

  const breachedTickets = tickets.filter((ticket) => ticket.status !== "resolved" && ticket.slaStatus === "breached").length;

  if (breachedTickets > 0) {
    return `${breachedTickets} solicitudes fuera de SLA`;
  }

  const pendingInvoices = invoices.filter((invoice) => invoice.status === "pending").length;

  if (pendingInvoices > 0) {
    return `${pendingInvoices} pagos pendientes`;
  }

  const openTickets = tickets.filter((ticket) => ticket.status !== "resolved").length;

  if (openTickets > 0) {
    return `${openTickets} tickets activos`;
  }

  if (progress >= 100) {
    return "Proyecto completado";
  }

  if (progress > 0) {
    return "Proyecto activo";
  }

  return "Portal activo";
}

function inferPortalPhase(progress: number) {
  if (progress >= 100) {
    return "4. Entrega completada";
  }

  if (progress >= 70) {
    return "3. Validación y cierre";
  }

  if (progress >= 30) {
    return "2. Implementación activa";
  }

  return "1. Kickoff operativo";
}

function inferPortalNextActionContext(credentials: PortalCredential[], invoices: PortalInvoice[], tickets: PortalTicket[]) {
  if (credentials.some((credential) => credential.status === "requested")) {
    return "credenciales";
  }

  if (invoices.some((invoice) => invoice.status === "pending" || invoice.status === "overdue")) {
    return "facturación";
  }

  if (tickets.some((ticket) => ticket.status !== "resolved")) {
    return "soporte";
  }

  return "operación";
}

function inferPortalNextAction({
  context,
  invoices,
  credentials,
  tickets,
  events,
}: {
  context: string;
  invoices: PortalInvoice[];
  credentials: PortalCredential[];
  tickets: PortalTicket[];
  events: Array<typeof schema.calendarEvents.$inferSelect>;
}) {
  if (context === "credenciales") {
    const requestedCredential = credentials.find((credential) => credential.status === "requested");
    return requestedCredential ? `Sigue pendiente compartir ${requestedCredential.title} para avanzar con la operación.` : "Aún hay accesos pendientes por compartir.";
  }

  if (context === "facturación") {
    const pendingInvoice = invoices.find((invoice) => invoice.status === "overdue" || invoice.status === "pending");
    return pendingInvoice ? `Revisa ${pendingInvoice.label} (${pendingInvoice.invoiceNumber}) para mantener el proyecto al día.` : "Hay facturación pendiente por revisar.";
  }

  if (context === "soporte") {
    const openTicket = tickets.find((ticket) => ticket.status !== "resolved");
    return openTicket ? `Tenemos una solicitud activa: ${openTicket.title}. Puedes seguirla desde soporte.` : "Hay solicitudes de soporte activas en tu portal.";
  }

  const upcomingEvent = [...events]
    .sort((left, right) => new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime())
    .find((event) => new Date(event.startsAt).getTime() >= Date.now());

  if (upcomingEvent) {
    return `Tu próximo hito es ${upcomingEvent.title} el ${formatDateTime(upcomingEvent.startsAt)}.`;
  }

  return "Tu portal está sincronizado. Puedes revisar avances, documentos, archivos o abrir soporte cuando lo necesites.";
}

function inferPortalNextActionCta(context: string) {
  if (context === "credenciales") {
    return "Compartir acceso";
  }

  if (context === "facturación") {
    return "Revisar facturas";
  }

  if (context === "soporte") {
    return "Abrir soporte";
  }

  return "Ver detalle";
}

function countBy<T>(items: T[], getKey: (item: T) => string | null) {
  const map = new Map<string, number>();

  for (const item of items) {
    const key = getKey(item);

    if (!key) {
      continue;
    }

    map.set(key, (map.get(key) ?? 0) + 1);
  }

  return map;
}

function sumBy<T>(items: T[], getKey: (item: T) => string | null, getValue: (item: T) => number) {
  const map = new Map<string, number>();

  for (const item of items) {
    const key = getKey(item);

    if (!key) {
      continue;
    }

    map.set(key, (map.get(key) ?? 0) + getValue(item));
  }

  return map;
}

function buildPortalStatusHighlights({
  progress,
  completedTasks,
  totalTasks,
  documentsCount,
  tickets,
  events,
}: {
  progress: number;
  completedTasks: number;
  totalTasks: number;
  documentsCount: number;
  tickets: PortalTicket[];
  events: Array<typeof schema.calendarEvents.$inferSelect>;
}) {
  const nextEvent = [...events]
    .sort((left, right) => new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime())
    .find((event) => new Date(event.startsAt).getTime() >= Date.now());
  const openTickets = tickets.filter((ticket) => ticket.status !== "resolved").length;
  const breachedTickets = tickets.filter((ticket) => ticket.status !== "resolved" && ticket.slaStatus === "breached").length;

  return [
    { label: "Progreso", value: `${progress}%` },
    { label: "Tareas", value: totalTasks > 0 ? `${completedTasks}/${totalTasks}` : "0/0" },
    {
      label: nextEvent ? "Próximo hito" : breachedTickets > 0 ? "SLA" : openTickets > 0 ? "Soporte" : "Documentos",
      value: nextEvent
        ? formatDateTime(nextEvent.startsAt)
        : breachedTickets > 0
          ? `${breachedTickets} solicitudes vencidas`
          : openTickets > 0
            ? `${openTickets} tickets activos`
            : `${documentsCount} archivos`,
    },
  ];
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

function formatDateTime(date: Date | null) {
  if (!date) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
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
