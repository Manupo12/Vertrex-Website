import { and, desc, eq } from "drizzle-orm";

import type { AuditActorInput } from "@/lib/audit/audit-service";
import { getDb, isDatabaseConfigured, schema } from "@/lib/db";

export type BusinessEventActorType = "user" | "ai" | "system" | "automation";

export type BusinessEventRecord = {
  id: string;
  eventType: string;
  module: string;
  action: string;
  entityType: string;
  entityId: string;
  actorType: BusinessEventActorType;
  actorUserId: string | null;
  actorName: string | null;
  clientId: string | null;
  clientName: string | null;
  projectId: string | null;
  projectName: string | null;
  summary: string;
  clientVisible: boolean;
  payload: Record<string, unknown>;
  snapshotBefore: Record<string, unknown> | null;
  snapshotAfter: Record<string, unknown> | null;
  createdAt: string;
};

export type RecordBusinessEventInput = {
  actor?: AuditActorInput | null;
  actorType?: BusinessEventActorType | null;
  eventType: string;
  module: string;
  action: string;
  entityType: string;
  entityId: string;
  clientId?: string | null;
  clientName?: string | null;
  projectId?: string | null;
  projectName?: string | null;
  summary: string;
  clientVisible?: boolean | null;
  payload?: Record<string, unknown>;
  snapshotBefore?: Record<string, unknown> | null;
  snapshotAfter?: Record<string, unknown> | null;
  createdAt?: Date;
};

export async function recordBusinessEvent(input: RecordBusinessEventInput) {
  if (!isDatabaseConfigured()) {
    return;
  }

  try {
    const db = getDb();
    await db.insert(schema.businessEvents).values({
      eventType: input.eventType,
      module: input.module,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      actorType: resolveActorType(input.actorType, input.actor),
      actorUserId: input.actor?.userId ?? null,
      actorName: normalizeOptionalString(input.actor?.name),
      clientId: input.clientId ?? null,
      clientName: normalizeOptionalString(input.clientName),
      projectId: input.projectId ?? null,
      projectName: normalizeOptionalString(input.projectName),
      summary: input.summary,
      clientVisible: input.clientVisible ?? false,
      payload: input.payload ?? {},
      snapshotBefore: input.snapshotBefore ?? null,
      snapshotAfter: input.snapshotAfter ?? null,
      createdAt: input.createdAt ?? new Date(),
    });
  } catch (error) {
    if (isMissingBusinessEventRelationError(error)) {
      return;
    }

    throw error;
  }
}

export async function getRecentBusinessEvents(options?: { limit?: number; clientId?: string | null; clientVisibleOnly?: boolean }): Promise<BusinessEventRecord[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  const limit = options?.limit ?? 20;
  const rows = await readOptionalBusinessEventDataset(() => {
    const condition = buildBusinessEventsCondition(options?.clientId ?? null, options?.clientVisibleOnly ?? false);
    const query = getDb().select().from(schema.businessEvents).orderBy(desc(schema.businessEvents.createdAt)).limit(limit);

    return condition ? query.where(condition) : query;
  });

  return rows.map((row) => ({
    id: row.id,
    eventType: row.eventType,
    module: row.module,
    action: row.action,
    entityType: row.entityType,
    entityId: row.entityId,
    actorType: row.actorType,
    actorUserId: row.actorUserId,
    actorName: row.actorName,
    clientId: row.clientId,
    clientName: row.clientName,
    projectId: row.projectId,
    projectName: row.projectName,
    summary: row.summary,
    clientVisible: row.clientVisible,
    payload: row.payload,
    snapshotBefore: row.snapshotBefore ?? null,
    snapshotAfter: row.snapshotAfter ?? null,
    createdAt: row.createdAt.toISOString(),
  }));
}

async function readOptionalBusinessEventDataset<T>(reader: () => Promise<T[]>) {
  try {
    return await reader();
  } catch (error) {
    if (isMissingBusinessEventRelationError(error)) {
      return [];
    }

    throw error;
  }
}

function buildBusinessEventsCondition(clientId: string | null, clientVisibleOnly: boolean) {
  const filters = [];

  if (clientId) {
    filters.push(eq(schema.businessEvents.clientId, clientId));
  }

  if (clientVisibleOnly) {
    filters.push(eq(schema.businessEvents.clientVisible, true));
  }

  if (filters.length === 0) {
    return null;
  }

  if (filters.length === 1) {
    return filters[0] ?? null;
  }

  return and(...filters);
}

function resolveActorType(explicitType: BusinessEventActorType | null | undefined, actor: AuditActorInput | null | undefined): BusinessEventActorType {
  if (explicitType) {
    return explicitType;
  }

  if (actor?.userId) {
    return "user";
  }

  return "system";
}

function isMissingBusinessEventRelationError(error: unknown): boolean {
  if (!error) {
    return false;
  }

  if (typeof error === "string") {
    return hasMissingBusinessEventRelationMessage(error);
  }

  if (typeof error === "object") {
    const candidate = error as { code?: unknown; message?: unknown; cause?: unknown };

    if (candidate.code === "42P01") {
      return true;
    }

    if (typeof candidate.message === "string" && hasMissingBusinessEventRelationMessage(candidate.message)) {
      return true;
    }

    return isMissingBusinessEventRelationError(candidate.cause);
  }

  return false;
}

function hasMissingBusinessEventRelationMessage(message: string) {
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
