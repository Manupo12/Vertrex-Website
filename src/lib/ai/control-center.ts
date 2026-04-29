import { desc } from "drizzle-orm";

import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import { isActiveClientDealStage } from "@/lib/ops/deal-stages";
import { generateAIActionPlan } from "@/lib/ai/action-plans";
import { isDocumentAwaitingApprovalStatus } from "@/lib/ops/status-catalog";
import { getWorkspaceSnapshot } from "@/lib/ops/workspace-service";

export type AITab = "console" | "autonomous" | "memory" | "history" | "openclaw";

export type AIControlCenterData = {
  summary: {
    projects: number;
    openTasks: number;
    pendingTickets: number;
    pendingInvoices: number;
    clients: number;
    documents: number;
    messages: number;
    portalReadyClients: number;
  };
  recentProjects: Array<{ id: string; name: string; progress: number; status: string }>;
  recentTasks: Array<{ id: string; title: string; owner: string | null; status: string; updatedAt: string }>;
  recentClients: Array<{ id: string; name: string; projectCount: number; openTicketCount: number; portalAccessActive: boolean; lastActivityAt: string | null }>;
  recentDocuments: Array<{ id: string; title: string; status: string; clientName: string | null; projectName: string | null; updatedAt: string }>;
  recentMessages: Array<{ id: string; clientName: string | null; senderName: string; senderRole: string; channel: string; message: string; createdAt: string }>;
  relationalSignals: {
    clientsWithoutPortal: number;
    activeDealsWithoutProject: number;
    openTicketsWithoutProject: number;
    documentsPendingApproval: number;
  };
  promptHistory: Array<{ id: string; title: string; date: string; category: string }>;
  memoryEntries: Array<{ id: string; key: string; category: string; content: string; updatedAt: string }>;
  autonomousRuns: Array<{ id: string; title: string; status: string; summary: string; updatedAt: string }>;
  openClaw: {
    connected: boolean;
    activeSessions: number;
    lastSeenAt: string | null;
    sessions: Array<{ id: string; sessionKey: string; status: string; lastSeenAt: string }>;
    logs: Array<{ id: string; title: string; summary: string; updatedAt: string }>;
  };
};

export function coerceAITab(tab: string | undefined): AITab {
  switch (tab) {
    case "autonomous":
      return "autonomous";
    case "memory":
      return "memory";
    case "history":
      return "history";
    case "openclaw":
      return "openclaw";
    default:
      return "console";
  }
}

export async function getAIControlCenterData(): Promise<AIControlCenterData> {
  if (!isDatabaseConfigured()) {
    return getFallbackData();
  }

  const db = getDb();
  const [workspaceSnapshot, memoryEntries, sessions] = await Promise.all([
    getWorkspaceSnapshot(),
    db.select().from(schema.aiMemory).orderBy(desc(schema.aiMemory.updatedAt)).limit(14),
    db.select().from(schema.openclawSessions).orderBy(desc(schema.openclawSessions.lastSeenAt)).limit(10),
  ]);

  const openTasks = workspaceSnapshot.tasks.filter((task) => task.status !== "done").length;
  const pendingTickets = workspaceSnapshot.tickets.filter((ticket) => ticket.status !== "resolved" && ticket.status !== "closed").length;
  const pendingInvoices = workspaceSnapshot.invoices.filter((invoice) => invoice.status === "pending" || invoice.status === "overdue").length;
  const relationalSignals = {
    clientsWithoutPortal: workspaceSnapshot.clients.filter((client) => !client.portalUserId).length,
    activeDealsWithoutProject: workspaceSnapshot.deals.filter((deal) => isActiveClientDealStage(deal.stage) && !deal.projectId).length,
    openTicketsWithoutProject: workspaceSnapshot.tickets.filter((ticket) => !ticket.projectId && ticket.status !== "resolved" && ticket.status !== "closed").length,
    documentsPendingApproval: workspaceSnapshot.documents.filter((document) => isDocumentAwaitingApprovalStatus(document.status)).length,
  };
  const recentMemory = memoryEntries.map((entry) => ({
    id: entry.id,
    key: entry.key,
    category: entry.category,
    content: entry.content,
    updatedAt: formatDateTime(entry.updatedAt),
  }));

  const openClawLogs = recentMemory
    .filter((entry) => entry.category === "openclaw")
    .slice(0, 5)
    .map((entry) => ({
      id: entry.id,
      title: entry.key,
      summary: entry.content,
      updatedAt: entry.updatedAt,
    }));

  const promptHistory = recentMemory.slice(0, 6).map((entry) => ({
    id: entry.id,
    title: entry.key,
    date: entry.updatedAt,
    category: entry.category,
  }));

  const autonomousRuns = [
    ...workspaceSnapshot.automationRuns.map((automationRun) => ({
      id: automationRun.id,
      title: automationRun.playbookTitle ?? automationRun.title,
      status: automationRun.status,
      summary: automationRun.summary,
      updatedAt: automationRun.finishedAt ?? automationRun.startedAt,
    })),
    ...buildRelationalRuns(workspaceSnapshot, relationalSignals),
    ...workspaceSnapshot.tasks.slice(0, 3).map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      summary: task.owner ? `Responsable actual: ${task.owner}` : "Sin responsable asignado.",
      updatedAt: task.updatedAt,
    })),
  ].slice(0, 6);

  return {
    summary: {
      projects: workspaceSnapshot.projects.length,
      openTasks,
      pendingTickets,
      pendingInvoices,
      clients: workspaceSnapshot.clients.length,
      documents: workspaceSnapshot.documents.length,
      messages: workspaceSnapshot.messages.length,
      portalReadyClients: workspaceSnapshot.clients.filter((client) => client.portalUserId).length,
    },
    recentProjects: workspaceSnapshot.projects.slice(0, 6).map((project) => ({
      id: project.id,
      name: project.name,
      progress: project.progress,
      status: project.status,
    })),
    recentTasks: workspaceSnapshot.tasks.slice(0, 6).map((task) => ({
      id: task.id,
      title: task.title,
      owner: task.owner,
      status: task.status,
      updatedAt: task.updatedAt,
    })),
    recentClients: workspaceSnapshot.clients.slice(0, 6).map((client) => ({
      id: client.id,
      name: client.name,
      projectCount: client.projectCount,
      openTicketCount: client.openTicketCount,
      portalAccessActive: client.portalAccessActive,
      lastActivityAt: client.lastActivityAt,
    })),
    recentDocuments: workspaceSnapshot.documents.slice(0, 6).map((document) => ({
      id: document.id,
      title: document.title,
      status: document.status,
      clientName: document.clientName,
      projectName: document.projectName,
      updatedAt: document.updatedAt,
    })),
    recentMessages: workspaceSnapshot.messages.slice(0, 6).map((message) => ({
      id: message.id,
      clientName: message.clientName,
      senderName: message.senderName,
      senderRole: message.senderRole,
      channel: message.channel,
      message: message.message,
      createdAt: message.createdAt,
    })),
    relationalSignals,
    promptHistory,
    memoryEntries: recentMemory,
    autonomousRuns,
    openClaw: {
      connected: sessions.some((session) => session.status === "active"),
      activeSessions: sessions.filter((session) => session.status === "active").length,
      lastSeenAt: sessions[0] ? formatDateTime(sessions[0].lastSeenAt) : null,
      sessions: sessions.map((session) => ({
        id: session.id,
        sessionKey: session.sessionKey,
        status: session.status,
        lastSeenAt: formatDateTime(session.lastSeenAt),
      })),
      logs: openClawLogs,
    },
  };
}

function getFallbackData(): AIControlCenterData {
  return {
    summary: {
      projects: 2,
      openTasks: 5,
      pendingTickets: 2,
      pendingInvoices: 2,
      clients: 2,
      documents: 3,
      messages: 4,
      portalReadyClients: 1,
    },
    recentProjects: [
      { id: "budaphone-project", name: "BUDAPHONE · Portal Cliente", progress: 65, status: "active" },
      { id: "globalbank-project", name: "GLOBALBANK · Portal Cliente", progress: 78, status: "active" },
    ],
    recentTasks: [
      { id: "portal-checkout", title: "Validar flujo de checkout", owner: "Vertrex Frontend", status: "in_progress", updatedAt: "Hoy" },
      { id: "gb-uat", title: "Preparar guía de UAT", owner: "Vertrex PM", status: "in_progress", updatedAt: "Hoy" },
    ],
    recentClients: [
      { id: "budaphone-client", name: "Budaphone", projectCount: 1, openTicketCount: 1, portalAccessActive: true, lastActivityAt: "Hoy" },
      { id: "globalbank-client", name: "GlobalBank", projectCount: 1, openTicketCount: 1, portalAccessActive: false, lastActivityAt: "Hoy" },
    ],
    recentDocuments: [
      { id: "doc-1", title: "Minuta Kickoff GlobalBank", status: "review", clientName: "GlobalBank", projectName: "Portal Cliente", updatedAt: "Hoy" },
      { id: "doc-2", title: "SOW Budaphone", status: "signed", clientName: "Budaphone", projectName: "Portal Cliente", updatedAt: "Ayer" },
    ],
    recentMessages: [
      { id: "msg-1", clientName: "Budaphone", senderName: "Vertrex IA", senderRole: "assistant", channel: "portal", message: "Resumen operativo enviado al cliente.", createdAt: "Hoy" },
      { id: "msg-2", clientName: "GlobalBank", senderName: "Equipo Vertrex", senderRole: "team", channel: "ops", message: "Se solicitó feedback del portal UAT.", createdAt: "Hoy" },
    ],
    relationalSignals: {
      clientsWithoutPortal: 1,
      activeDealsWithoutProject: 1,
      openTicketsWithoutProject: 1,
      documentsPendingApproval: 1,
    },
    promptHistory: [
      { id: "memory-1", title: "config:ai-model", date: "Hoy", category: "global" },
      { id: "memory-2", title: "global:vertrex-context", date: "Hoy", category: "global" },
    ],
    memoryEntries: [
      {
        id: "memory-1",
        key: "config:ai-model",
        category: "global",
        content: "gpt-4o",
        updatedAt: "Hoy",
      },
      {
        id: "memory-2",
        key: "global:vertrex-context",
        category: "global",
        content: "Vertrex opera portales de cliente, generación documental, legal y soporte centralizado sobre Neon.",
        updatedAt: "Hoy",
      },
    ],
    autonomousRuns: [
      {
        id: "auto-1",
        title: "Resumen de estado de clientes",
        status: "done",
        summary: "Se consolidó el snapshot ejecutivo para Budaphone y GlobalBank.",
        updatedAt: "Hace 10 min",
      },
    ],
    openClaw: {
      connected: false,
      activeSessions: 0,
      lastSeenAt: null,
      sessions: [],
      logs: [],
    },
  };
}

function buildRelationalRuns(
  workspaceSnapshot: Awaited<ReturnType<typeof getWorkspaceSnapshot>>,
  relationalSignals: AIControlCenterData["relationalSignals"],
) {
  return [
    {
      id: "signal-portal-rollout",
      title: "Provisionamiento de portal",
      status: relationalSignals.clientsWithoutPortal > 0 ? "pending" : "done",
      summary:
        relationalSignals.clientsWithoutPortal > 0
          ? `${relationalSignals.clientsWithoutPortal} clientes activos aún no tienen acceso de portal listo.`
          : "Todos los clientes visibles ya tienen acceso de portal provisionado.",
      updatedAt: workspaceSnapshot.clients[0]?.lastActivityAt ?? "Sin actividad",
    },
    {
      id: "signal-delivery-link",
      title: "CRM → Delivery",
      status: relationalSignals.activeDealsWithoutProject > 0 ? "pending" : "done",
      summary:
        relationalSignals.activeDealsWithoutProject > 0
          ? `${relationalSignals.activeDealsWithoutProject} deals en cliente activo todavía no originan un proyecto operativo.`
          : "Los deals en cliente activo visibles ya están ligados a delivery.",
      updatedAt: workspaceSnapshot.deals[0]?.updatedAt ?? "Sin actividad",
    },
    {
      id: "signal-support-routing",
      title: "Soporte sin contexto de proyecto",
      status: relationalSignals.openTicketsWithoutProject > 0 ? "review" : "done",
      summary:
        relationalSignals.openTicketsWithoutProject > 0
          ? `${relationalSignals.openTicketsWithoutProject} tickets siguen abiertos sin projectId asociado.`
          : "Los tickets abiertos visibles ya tienen contexto de proyecto o cliente resuelto.",
      updatedAt: workspaceSnapshot.tickets[0]?.updatedAt ?? "Sin actividad",
    },
  ];
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}
