import { desc } from "drizzle-orm";

import { getDb, isDatabaseConfigured, schema } from "@/lib/db";

export type AuditActorInput = {
  userId?: string | null;
  role?: "team" | "client" | null;
  name?: string | null;
  email?: string | null;
};

export type RecordAuditEventInput = {
  actor?: AuditActorInput | null;
  targetUserId?: string | null;
  targetName?: string | null;
  clientId?: string | null;
  clientName?: string | null;
  projectId?: string | null;
  projectName?: string | null;
  module: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
};

export type RecentAuditEvent = {
  id: string;
  module: string;
  action: string;
  entityType: string;
  entityId: string | null;
  summary: string;
  actorName: string | null;
  actorEmail: string | null;
  actorRole: "team" | "client" | null;
  targetName: string | null;
  clientName: string | null;
  projectName: string | null;
  createdAt: string;
};

export async function recordAuditEvent(input: RecordAuditEventInput) {
  if (!isDatabaseConfigured()) {
    return;
  }

  try {
    const db = getDb();
    await db.insert(schema.auditEvents).values({
      actorUserId: input.actor?.userId ?? null,
      actorRole: input.actor?.role ?? null,
      actorName: normalizeOptionalString(input.actor?.name),
      actorEmail: normalizeOptionalString(input.actor?.email),
      targetUserId: input.targetUserId ?? null,
      targetName: normalizeOptionalString(input.targetName),
      clientId: input.clientId ?? null,
      clientName: normalizeOptionalString(input.clientName),
      projectId: input.projectId ?? null,
      projectName: normalizeOptionalString(input.projectName),
      module: input.module,
      action: input.action,
      entityType: input.entityType,
      entityId: normalizeOptionalString(input.entityId),
      summary: input.summary,
      metadata: input.metadata ?? {},
      createdAt: input.createdAt ?? new Date(),
    });
  } catch (error) {
    if (isMissingAuditRelationError(error)) {
      return;
    }

    throw error;
  }
}

export async function getRecentAuditEvents(limit = 20): Promise<RecentAuditEvent[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  const rows = await readOptionalAuditDataset(() =>
    getDb()
      .select()
      .from(schema.auditEvents)
      .orderBy(desc(schema.auditEvents.createdAt))
      .limit(limit),
  );

  return rows.map((row) => ({
    id: row.id,
    module: row.module,
    action: row.action,
    entityType: row.entityType,
    entityId: row.entityId,
    summary: row.summary,
    actorName: row.actorName,
    actorEmail: row.actorEmail,
    actorRole: row.actorRole,
    targetName: row.targetName,
    clientName: row.clientName,
    projectName: row.projectName,
    createdAt: row.createdAt.toISOString(),
  }));
}

async function readOptionalAuditDataset<T>(reader: () => Promise<T[]>) {
  try {
    return await reader();
  } catch (error) {
    if (isMissingAuditRelationError(error)) {
      return [];
    }

    throw error;
  }
}

function isMissingAuditRelationError(error: unknown): boolean {
  if (!error) {
    return false;
  }

  if (typeof error === "string") {
    return hasMissingAuditRelationMessage(error);
  }

  if (typeof error === "object") {
    const candidate = error as { code?: unknown; message?: unknown; cause?: unknown };

    if (candidate.code === "42P01") {
      return true;
    }

    if (typeof candidate.message === "string" && hasMissingAuditRelationMessage(candidate.message)) {
      return true;
    }

    return isMissingAuditRelationError(candidate.cause);
  }

  return false;
}

function hasMissingAuditRelationMessage(message: string) {
  const normalized = message.toLowerCase();

  return (
    (normalized.includes("relation") && normalized.includes("does not exist"))
    || (normalized.includes("table") && normalized.includes("does not exist"))
    || normalized.includes("no such table")
    || normalized.includes("undefined_table")
  );
}

function normalizeOptionalString(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}
