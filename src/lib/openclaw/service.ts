import { randomUUID } from "node:crypto";

import { and, desc, eq } from "drizzle-orm";

import { generateAIActionPlan } from "@/lib/ai/action-plans";
import { buildOsAgentReply } from "@/lib/ai/os-agent";
import { isOpenTaskStatus, isOutstandingInvoiceStatus } from "@/lib/ops/status-catalog";
import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import {
  openClawChatInputSchema,
  openClawClientInputSchema,
  openClawDocumentInputSchema,
  openClawMemoryInputSchema,
  openClawProjectInputSchema,
  openClawProjectUpdateSchema,
  openClawTaskInputSchema,
  openClawTaskUpdateSchema,
  openClawTransactionInputSchema,
  openClawWebhookInputSchema,
} from "@/lib/openclaw/schemas";

export async function getOpenClawStatus() {
  const db = requireDb();
  const [clients, projects, tasks, documents, invoices, tickets, sessions] = await Promise.all([
    db.select().from(schema.clients),
    db.select().from(schema.projects),
    db.select().from(schema.tasks),
    db.select().from(schema.documents),
    db.select().from(schema.invoices),
    db.select().from(schema.tickets),
    db.select().from(schema.openclawSessions).orderBy(desc(schema.openclawSessions.lastSeenAt)),
  ]);

  return {
    databaseConfigured: true,
    clients: clients.length,
    projects: projects.length,
    tasks: tasks.length,
    documents: documents.length,
    invoices: invoices.length,
    tickets: tickets.length,
    openClaw: {
      connected: sessions.some((session) => session.status === "active"),
      activeSessions: sessions.filter((session) => session.status === "active").length,
      lastSeenAt: sessions[0]?.lastSeenAt?.toISOString() ?? null,
    },
  };
}

export async function listOpenClawProjects() {
  const db = requireDb();
  return db.select().from(schema.projects).orderBy(desc(schema.projects.updatedAt));
}

export async function getOpenClawProject(projectId: string) {
  const db = requireDb();
  const [project] = await db.select().from(schema.projects).where(eq(schema.projects.id, projectId)).limit(1);

  if (!project) {
    throw new Error("Proyecto no encontrado.");
  }

  const tasks = await db.select().from(schema.tasks).where(eq(schema.tasks.projectId, projectId)).orderBy(desc(schema.tasks.updatedAt));

  return {
    project,
    tasks,
  };
}

export async function createOpenClawProject(input: unknown) {
  const db = requireDb();
  const payload = openClawProjectInputSchema.parse(input);

  const [project] = await db
    .insert(schema.projects)
    .values({
      clientId: payload.clientId ?? null,
      name: payload.name,
      description: payload.description ?? null,
      status: payload.status ?? "active",
      progress: payload.progress ?? 0,
      startDate: parseDate(payload.startDate),
      endDate: parseDate(payload.endDate),
      metadata: payload.metadata ?? {},
      updatedAt: new Date(),
    })
    .returning();

  return project;
}

export async function updateOpenClawProject(projectId: string, input: unknown) {
  const db = requireDb();
  const payload = openClawProjectUpdateSchema.parse(input);

  const [project] = await db
    .update(schema.projects)
    .set({
      clientId: payload.clientId ?? undefined,
      name: payload.name,
      description: payload.description ?? undefined,
      status: payload.status,
      progress: payload.progress,
      startDate: payload.startDate === undefined ? undefined : parseDate(payload.startDate),
      endDate: payload.endDate === undefined ? undefined : parseDate(payload.endDate),
      metadata: payload.metadata,
      updatedAt: new Date(),
    })
    .where(eq(schema.projects.id, projectId))
    .returning();

  if (!project) {
    throw new Error("Proyecto no encontrado.");
  }

  return project;
}

export async function listOpenClawTasks(filters?: { projectId?: string | null; status?: string | null; assignee?: string | null }) {
  const db = requireDb();
  const conditions = [];

  if (filters?.projectId) {
    conditions.push(eq(schema.tasks.projectId, filters.projectId));
  }

  if (filters?.status) {
    conditions.push(eq(schema.tasks.status, normalizeTaskStatus(filters.status)));
  }

  if (filters?.assignee) {
    conditions.push(eq(schema.tasks.owner, filters.assignee));
  }

  const baseQuery = db.select().from(schema.tasks).orderBy(desc(schema.tasks.updatedAt));

  if (conditions.length === 0) {
    return baseQuery;
  }

  return db.select().from(schema.tasks).where(and(...conditions)).orderBy(desc(schema.tasks.updatedAt));
}

export async function createOpenClawTask(input: unknown) {
  const db = requireDb();
  const payload = openClawTaskInputSchema.parse(input);

  const [task] = await db
    .insert(schema.tasks)
    .values({
      clientId: payload.clientId ?? null,
      projectId: payload.projectId ?? null,
      title: payload.title,
      owner: payload.owner ?? null,
      status: payload.status ?? "todo",
      dueLabel: payload.dueLabel ?? null,
      position: payload.position ?? 0,
      metadata: payload.metadata ?? {},
      updatedAt: new Date(),
    })
    .returning();

  return task;
}

export async function updateOpenClawTask(taskId: string, input: unknown) {
  const db = requireDb();
  const payload = openClawTaskUpdateSchema.parse(input);

  const [task] = await db
    .update(schema.tasks)
    .set({
      clientId: payload.clientId ?? undefined,
      projectId: payload.projectId ?? undefined,
      title: payload.title,
      owner: payload.owner ?? undefined,
      status: payload.status,
      dueLabel: payload.dueLabel ?? undefined,
      position: payload.position,
      metadata: payload.metadata,
      updatedAt: new Date(),
    })
    .where(eq(schema.tasks.id, taskId))
    .returning();

  if (!task) {
    throw new Error("Tarea no encontrada.");
  }

  return task;
}

export async function listOpenClawClients() {
  const db = requireDb();
  return db.select().from(schema.clients).orderBy(desc(schema.clients.updatedAt));
}

export async function getOpenClawClient(clientId: string) {
  const db = requireDb();
  const [client] = await db.select().from(schema.clients).where(eq(schema.clients.id, clientId)).limit(1);

  if (!client) {
    throw new Error("Cliente no encontrado.");
  }

  const [projects, tasks, invoices, tickets] = await Promise.all([
    db.select().from(schema.projects).where(eq(schema.projects.clientId, clientId)).orderBy(desc(schema.projects.updatedAt)),
    db.select().from(schema.tasks).where(eq(schema.tasks.clientId, clientId)).orderBy(desc(schema.tasks.updatedAt)),
    db.select().from(schema.invoices).where(eq(schema.invoices.clientId, clientId)).orderBy(desc(schema.invoices.updatedAt)),
    db.select().from(schema.tickets).where(eq(schema.tickets.clientId, clientId)).orderBy(desc(schema.tickets.updatedAt)),
  ]);

  return {
    client,
    projects,
    tasks,
    invoices,
    tickets,
  };
}

export async function createOpenClawClient(input: unknown) {
  const db = requireDb();
  const payload = openClawClientInputSchema.parse(input);

  const [client] = await db
    .insert(schema.clients)
    .values({
      slug: payload.slug,
      name: payload.name,
      brand: payload.brand,
      email: payload.email ?? null,
      phone: payload.phone ?? null,
      company: payload.company ?? null,
      status: payload.status ?? "active",
      phase: payload.phase ?? null,
      progress: payload.progress ?? 0,
      totalInvestmentCents: payload.totalInvestmentCents ?? 0,
      paidCents: payload.paidCents ?? 0,
      pendingCents: payload.pendingCents ?? 0,
      welcomeTitle: payload.welcomeTitle ?? null,
      welcomeDescription: payload.welcomeDescription ?? null,
      nextAction: payload.nextAction ?? null,
      nextActionContext: payload.nextActionContext ?? null,
      nextActionCta: payload.nextActionCta ?? null,
      metadata: payload.metadata ?? {},
      updatedAt: new Date(),
    })
    .returning();

  return client;
}

export async function getOpenClawFinanceSummary() {
  const db = requireDb();
  const [transactions, invoices] = await Promise.all([
    db.select().from(schema.transactions).orderBy(desc(schema.transactions.occurredAt)),
    db.select().from(schema.invoices).orderBy(desc(schema.invoices.updatedAt)),
  ]);

  const incomeCents = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amountCents, 0);
  const expenseCents = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amountCents, 0);
  const pendingInvoiceCents = invoices
    .filter((invoice) => invoice.status === "pending" || invoice.status === "overdue")
    .reduce((total, invoice) => total + invoice.amountCents, 0);

  return {
    transactions,
    invoices,
    incomeCents,
    expenseCents,
    netCents: incomeCents - expenseCents,
    pendingInvoiceCents,
  };
}

export async function createOpenClawTransaction(input: unknown) {
  const db = requireDb();
  const payload = openClawTransactionInputSchema.parse(input);

  const [transaction] = await db
    .insert(schema.transactions)
    .values({
      clientId: payload.clientId ?? null,
      projectId: payload.projectId ?? null,
      type: payload.type,
      amountCents: payload.amountCents,
      category: payload.category ?? null,
      description: payload.description ?? null,
      occurredAt: parseDate(payload.occurredAt) ?? new Date(),
      metadata: payload.metadata ?? {},
      updatedAt: new Date(),
    })
    .returning();

  return transaction;
}

export async function listOpenClawDocuments() {
  const db = requireDb();
  return db.select().from(schema.documents).orderBy(desc(schema.documents.updatedAt));
}

export async function createOpenClawDocument(input: unknown) {
  const db = requireDb();
  const payload = openClawDocumentInputSchema.parse(input);

  const [document] = await db
    .insert(schema.documents)
    .values({
      clientId: payload.clientId ?? null,
      projectId: payload.projectId ?? null,
      templateId: payload.templateId ?? null,
      createdById: payload.createdById ?? null,
      code: payload.code ?? `OC-${Date.now()}`,
      title: payload.title,
      status: payload.status ?? "draft",
      category: payload.category,
      origin: payload.origin ?? "os",
      summary: payload.summary ?? null,
      payload: payload.payload ?? {},
      updatedAt: new Date(),
    })
    .returning();

  return document;
}

export async function listOpenClawMemory() {
  const db = requireDb();
  return db.select().from(schema.aiMemory).orderBy(desc(schema.aiMemory.updatedAt));
}

export async function createOpenClawMemory(input: unknown, categoryOverride?: string) {
  const db = requireDb();
  const payload = openClawMemoryInputSchema.parse(input);
  const key = await resolveMemoryKey(payload.key);

  const [entry] = await db
    .insert(schema.aiMemory)
    .values({
      key,
      category: categoryOverride ?? payload.category ?? "global",
      content: payload.content,
      projectId: payload.projectId ?? null,
      clientId: payload.clientId ?? null,
      metadata: payload.metadata ?? {},
      updatedAt: new Date(),
    })
    .returning();

  return entry;
}

export async function deleteOpenClawMemory(memoryId: string) {
  const db = requireDb();
  const [entry] = await db.delete(schema.aiMemory).where(eq(schema.aiMemory.id, memoryId)).returning();

  if (!entry) {
    throw new Error("Memoria no encontrada.");
  }

  return entry;
}

export async function createOpenClawChatResponse(input: unknown) {
  const db = requireDb();
  const payload = openClawChatInputSchema.parse(input);

  if (payload.sessionKey) {
    await recordOpenClawSession(payload.sessionKey, {
      source: "chat",
    });
  }

  const [clients, projects, tasks, invoices, tickets, recentMemory] = await Promise.all([
    db.select().from(schema.clients),
    db.select().from(schema.projects),
    db.select().from(schema.tasks),
    db.select().from(schema.invoices),
    db.select().from(schema.tickets),
    db.select().from(schema.aiMemory).orderBy(desc(schema.aiMemory.updatedAt)).limit(20),
  ]);

  const snapshot = {
    userName: payload.userName ?? "OpenClaw",
    generatedAt: new Intl.DateTimeFormat("es-CO", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date()),
    clientCount: clients.length,
    projectCount: projects.length,
    openTaskCount: tasks.filter((task) => isOpenTaskStatus(task.status)).length,
    pendingInvoiceCount: invoices.filter((invoice) => isOutstandingInvoiceStatus(invoice.status)).length,
    pendingInvoiceCents: invoices
      .filter((invoice) => isOutstandingInvoiceStatus(invoice.status))
      .reduce((total, invoice) => total + invoice.amountCents, 0),
    openTicketCount: tickets.filter((ticket) => ticket.status !== "resolved" && ticket.status !== "closed").length,
    recentMemory: recentMemory.map((memory) => ({
      key: memory.key,
      category: memory.category,
      content: memory.content,
    })),
  };

  const result = buildOsAgentReply(payload.message, snapshot);

  if (payload.saveMemory) {
    await createOpenClawMemory(
      {
        key: `openclaw-chat-${Date.now()}`,
        category: "openclaw",
        content: `${payload.message}\n\n${result.reply}`,
        metadata: {
          source: "chat",
          toolsUsed: result.toolsUsed,
        },
      },
      "openclaw",
    );
  }

  return result;
}

export async function handleOpenClawWebhook(input: unknown) {
  const db = requireDb();
  const payload = openClawWebhookInputSchema.parse(input);

  await recordOpenClawSession(payload.sessionKey, {
    source: "webhook",
    event: payload.event,
  });

  switch (payload.event) {
    case "task.completed": {
      const taskId = extractPayloadString(payload.payload, "taskId");

      if (!taskId) {
        throw new Error("El webhook task.completed requiere payload.taskId.");
      }

      const [task] = await db
        .update(schema.tasks)
        .set({
          status: "done",
          updatedAt: new Date(),
        })
        .where(eq(schema.tasks.id, taskId))
        .returning();

      if (!task) {
        throw new Error("La tarea indicada no existe.");
      }

      return {
        event: payload.event,
        task,
      };
    }
    case "memory.updated": {
      const memoryEntry = await createOpenClawMemory(
        {
          key: extractPayloadString(payload.payload, "key") ?? `openclaw-memory-${Date.now()}`,
          category: "openclaw",
          content: extractPayloadString(payload.payload, "content") ?? JSON.stringify(payload.payload),
          metadata: {
            sessionKey: payload.sessionKey,
            rawPayload: payload.payload,
          },
        },
        "openclaw",
      );

      return {
        event: payload.event,
        memoryEntry,
      };
    }
    case "alert":
    case "skill.result":
    case "custom": {
      const memoryEntry = await createOpenClawMemory(
        {
          key: `openclaw-${payload.event}-${Date.now()}`,
          category: "openclaw",
          content: JSON.stringify(payload.payload),
          metadata: {
            sessionKey: payload.sessionKey,
            event: payload.event,
          },
        },
        "openclaw",
      );

      return {
        event: payload.event,
        memoryEntry,
      };
    }
    default:
      return {
        event: payload.event,
      };
  }
}

async function resolveMemoryKey(baseKey: string) {
  const db = requireDb();
  const [existing] = await db.select({ id: schema.aiMemory.id }).from(schema.aiMemory).where(eq(schema.aiMemory.key, baseKey)).limit(1);

  if (!existing) {
    return baseKey;
  }

  return `${baseKey}-${randomUUID().slice(0, 8)}`;
}

async function recordOpenClawSession(sessionKey: string, metadata: Record<string, unknown>) {
  const db = requireDb();
  const now = new Date();

  const [existing] = await db
    .select()
    .from(schema.openclawSessions)
    .where(eq(schema.openclawSessions.sessionKey, sessionKey))
    .limit(1);

  if (!existing) {
    await db.insert(schema.openclawSessions).values({
      sessionKey,
      status: "active",
      lastSeenAt: now,
      permissions: {},
      metadata,
      createdAt: now,
      updatedAt: now,
    });
    return;
  }

  await db
    .update(schema.openclawSessions)
    .set({
      status: "active",
      lastSeenAt: now,
      metadata: {
        ...existing.metadata,
        ...metadata,
      },
      updatedAt: now,
    })
    .where(eq(schema.openclawSessions.id, existing.id));
}

function requireDb() {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL no está configurada. OpenClaw requiere Neon activo.");
  }

  return getDb();
}

function parseDate(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  return new Date(value);
}

function extractPayloadString(payload: unknown, key: string) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const value = payload as Record<string, unknown>;
  return typeof value[key] === "string" ? value[key] : null;
}

function normalizeTaskStatus(status: string) {
  if (status === "todo" || status === "in_progress" || status === "review" || status === "done") {
    return status;
  }

  return "todo";
}
