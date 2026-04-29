import { eq, and, desc } from "drizzle-orm";

import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import { recordPortalActivity } from "@/lib/portal/portal-activity";

export type AutomationExecutionStep = {
  stepNumber: number;
  action: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  startedAt?: string;
  completedAt?: string;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  logs: string[];
};

export type AutomationExecutionLog = {
  triggeredBy: string;
  triggerSource: string;
  steps: AutomationExecutionStep[];
  error?: string;
  result?: Record<string, unknown>;
};

export type CreateAutomationRunInput = {
  playbookId: string;
  clientId?: string | null;
  projectId?: string | null;
  title: string;
  summary?: string;
  triggeredBy: string;
  triggerSource: string;
};

export type AutomationRun = {
  id: string;
  playbookId: string | null;
  clientId: string | null;
  projectId: string | null;
  title: string;
  summary: string;
  status: "queued" | "running" | "completed" | "needs_review" | "failed";
  triggerSource: string | null;
  startedAt: string;
  finishedAt: string | null;
  createdAt: string;
  metadata: Record<string, unknown>;
};

function mapDbToRun(row: typeof schema.automationRuns.$inferSelect): AutomationRun {
  return {
    id: row.id,
    playbookId: row.playbookId,
    clientId: row.clientId,
    projectId: row.projectId,
    title: row.title,
    summary: row.summary ?? "",
    status: row.status as AutomationRun["status"],
    triggerSource: row.triggerSource ?? "manual",
    startedAt: row.startedAt.toISOString(),
    finishedAt: row.finishedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    metadata: (row.metadata as Record<string, unknown>) ?? {},
  };
}

export async function createAutomationRun(
  input: CreateAutomationRunInput,
): Promise<AutomationRun | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const db = getDb();

  const executionLog: AutomationExecutionLog = {
    triggeredBy: input.triggeredBy,
    triggerSource: input.triggerSource,
    steps: [],
  };

  const [row] = await db
    .insert(schema.automationRuns)
    .values({
      playbookId: input.playbookId,
      clientId: input.clientId ?? null,
      projectId: input.projectId ?? null,
      title: input.title,
      summary: input.summary ?? "",
      status: "queued",
      triggerSource: input.triggerSource,
      metadata: { executionLog },
    })
    .returning();

  if (!row) {
    return null;
  }

  return mapDbToRun(row);
}

export async function startAutomationRun(runId: string): Promise<AutomationRun | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const db = getDb();

  const [row] = await db
    .update(schema.automationRuns)
    .set({
      status: "running",
      startedAt: new Date(),
    })
    .where(and(eq(schema.automationRuns.id, runId), eq(schema.automationRuns.status, "queued")))
    .returning();

  if (!row) {
    return null;
  }

  return mapDbToRun(row);
}

export async function logExecutionStep(
  runId: string,
  step: AutomationExecutionStep,
): Promise<boolean> {
  if (!isDatabaseConfigured()) {
    return false;
  }

  const db = getDb();

  const run = await db
    .select()
    .from(schema.automationRuns)
    .where(eq(schema.automationRuns.id, runId))
    .limit(1);

  if (!run[0]) {
    return false;
  }

  const metadata = (run[0].metadata as Record<string, unknown>) ?? {};
  const executionLog = (metadata.executionLog as AutomationExecutionLog) ?? {
    triggeredBy: "system",
    triggerSource: "unknown",
    steps: [],
  };

  const existingStepIndex = executionLog.steps.findIndex((s) => s.stepNumber === step.stepNumber);
  if (existingStepIndex >= 0) {
    executionLog.steps[existingStepIndex] = step;
  } else {
    executionLog.steps.push(step);
  }

  await db
    .update(schema.automationRuns)
    .set({
      metadata: { ...metadata, executionLog },
    })
    .where(eq(schema.automationRuns.id, runId));

  return true;
}

export async function completeAutomationRun(
  runId: string,
  status: "completed" | "needs_review" | "failed",
  result?: Record<string, unknown>,
): Promise<AutomationRun | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const db = getDb();

  const run = await db
    .select()
    .from(schema.automationRuns)
    .where(eq(schema.automationRuns.id, runId))
    .limit(1);

  if (!run[0]) {
    return null;
  }

  const metadata = (run[0].metadata as Record<string, unknown>) ?? {};
  const executionLog = (metadata.executionLog as AutomationExecutionLog) ?? {
    triggeredBy: "system",
    triggerSource: "unknown",
    steps: [],
  };

  executionLog.result = result;

  const [row] = await db
    .update(schema.automationRuns)
    .set({
      status,
      finishedAt: new Date(),
      metadata: { ...metadata, executionLog },
    })
    .where(eq(schema.automationRuns.id, runId))
    .returning();

  if (!row) {
    return null;
  }

  if (row.clientId && row.projectId) {
    await recordPortalActivity({
      clientId: row.clientId,
      projectId: row.projectId,
      actorType: "system",
      action: status === "completed" ? "automation_completed" : "automation_failed",
      entityType: "automation_run",
      entityId: runId,
      entityName: row.title,
      description: `Automatización "${row.title}" ${status === "completed" ? "completada" : "requiere revisión"}`,
      metadata: { status, result },
      clientVisible: false,
    });
  }

  return mapDbToRun(row);
}

export async function getAutomationRunLogs(runId: string): Promise<AutomationExecutionLog | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const db = getDb();

  const run = await db
    .select()
    .from(schema.automationRuns)
    .where(eq(schema.automationRuns.id, runId))
    .limit(1);

  if (!run[0]) {
    return null;
  }

  const metadata = (run[0].metadata as Record<string, unknown>) ?? {};
  return (metadata.executionLog as AutomationExecutionLog) ?? null;
}

export async function getRecentAutomationRuns(
  options: {
    clientId?: string;
    projectId?: string;
    playbookId?: string;
    limit?: number;
    offset?: number;
  } = {},
): Promise<AutomationRun[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  const db = getDb();
  const conditions = [];

  if (options.clientId) {
    conditions.push(eq(schema.automationRuns.clientId, options.clientId));
  }
  if (options.projectId) {
    conditions.push(eq(schema.automationRuns.projectId, options.projectId));
  }
  if (options.playbookId) {
    conditions.push(eq(schema.automationRuns.playbookId, options.playbookId));
  }

  const query = db
    .select()
    .from(schema.automationRuns)
    .orderBy(desc(schema.automationRuns.createdAt))
    .limit(options.limit ?? 20)
    .offset(options.offset ?? 0);

  if (conditions.length > 0) {
    query.where(and(...conditions));
  }

  const rows = await query;
  return rows.map(mapDbToRun);
}
