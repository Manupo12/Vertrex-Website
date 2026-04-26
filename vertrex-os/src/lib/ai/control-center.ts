import { desc } from "drizzle-orm";

import { getDb, isDatabaseConfigured, schema } from "@/lib/db";

export type AITab = "console" | "autonomous" | "memory" | "history" | "openclaw";

export type AIControlCenterData = {
  summary: {
    projects: number;
    openTasks: number;
    pendingTickets: number;
    pendingInvoices: number;
  };
  recentProjects: Array<{ id: string; name: string; progress: number; status: string }>;
  recentTasks: Array<{ id: string; title: string; owner: string | null; status: string; updatedAt: string }>;
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
  if (!isDatabaseConfigured) {
    return getFallbackData();
  }

  const db = getDb();
  const [projects, tasks, tickets, invoices, memoryEntries, sessions] = await Promise.all([
    db.select().from(schema.projects).orderBy(desc(schema.projects.updatedAt)).limit(6),
    db.select().from(schema.tasks).orderBy(desc(schema.tasks.updatedAt)).limit(12),
    db.select().from(schema.tickets).orderBy(desc(schema.tickets.updatedAt)).limit(8),
    db.select().from(schema.invoices).orderBy(desc(schema.invoices.updatedAt)).limit(8),
    db.select().from(schema.aiMemory).orderBy(desc(schema.aiMemory.updatedAt)).limit(14),
    db.select().from(schema.openclawSessions).orderBy(desc(schema.openclawSessions.lastSeenAt)).limit(10),
  ]);

  const openTasks = tasks.filter((task) => task.status !== "done").length;
  const pendingTickets = tickets.filter((ticket) => ticket.status !== "resolved" && ticket.status !== "closed").length;
  const pendingInvoices = invoices.filter((invoice) => invoice.status === "pending" || invoice.status === "overdue").length;
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

  const autonomousRuns = tasks.slice(0, 5).map((task) => ({
    id: task.id,
    title: task.title,
    status: task.status,
    summary: task.owner ? `Responsable actual: ${task.owner}` : "Sin responsable asignado.",
    updatedAt: formatDateTime(task.updatedAt),
  }));

  return {
    summary: {
      projects: projects.length,
      openTasks,
      pendingTickets,
      pendingInvoices,
    },
    recentProjects: projects.map((project) => ({
      id: project.id,
      name: project.name,
      progress: project.progress,
      status: project.status,
    })),
    recentTasks: tasks.slice(0, 6).map((task) => ({
      id: task.id,
      title: task.title,
      owner: task.owner,
      status: task.status,
      updatedAt: formatDateTime(task.updatedAt),
    })),
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
    },
    recentProjects: [
      { id: "budaphone-project", name: "BUDAPHONE · Portal Cliente", progress: 65, status: "active" },
      { id: "globalbank-project", name: "GLOBALBANK · Portal Cliente", progress: 78, status: "active" },
    ],
    recentTasks: [
      { id: "portal-checkout", title: "Validar flujo de checkout", owner: "Vertrex Frontend", status: "in_progress", updatedAt: "Hoy" },
      { id: "gb-uat", title: "Preparar guía de UAT", owner: "Vertrex PM", status: "in_progress", updatedAt: "Hoy" },
    ],
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

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}
