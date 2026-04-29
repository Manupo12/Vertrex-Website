import { eq } from "drizzle-orm";

import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import { assertOptimisticLock } from "@/lib/security/optimistic-lock";

const operationalStatsOverrideKey = "config:operational-stats-overrides";
const metricKeys = ["activeProjects", "activeUsers", "community", "upcomingLaunches"] as const;
const upcomingProjectStatuses = new Set(["planned", "upcoming", "launch", "launching", "scheduled", "prelaunch"]);
const inactiveProjectStatuses = new Set(["archived", "cancelled", "completed", "done", "inactive", "paused"]);

export type OperationalMetricKey = (typeof metricKeys)[number];
export type OperationalMetricMode = "auto" | "manual";
export type OperationalMetricConfig = {
  mode: OperationalMetricMode;
  value: number | null;
};
export type OperationalMetricValues = Record<OperationalMetricKey, number>;
export type OperationalMetricOverrides = Record<OperationalMetricKey, OperationalMetricConfig>;
export type OperationalStatsSnapshot = {
  databaseConfigured: boolean;
  autoValues: OperationalMetricValues;
  values: OperationalMetricValues;
  sources: Record<OperationalMetricKey, OperationalMetricMode>;
  overrides: OperationalMetricOverrides;
  updatedAt: string | null;
};

const emptyValues: OperationalMetricValues = {
  activeProjects: 0,
  activeUsers: 0,
  community: 0,
  upcomingLaunches: 0,
};

const defaultOverrides: OperationalMetricOverrides = {
  activeProjects: { mode: "auto", value: null },
  activeUsers: { mode: "auto", value: null },
  community: { mode: "auto", value: null },
  upcomingLaunches: { mode: "auto", value: null },
};

export async function getOperationalStatsSnapshot(): Promise<OperationalStatsSnapshot> {
  if (!isDatabaseConfigured()) {
    return createSnapshot(emptyValues, defaultOverrides, false, null);
  }

  const db = getDb();
  const [projects, users, clients, overrideRecord] = await Promise.all([
    readOptionalOperationalDataset(() =>
      db
        .select({
          id: schema.projects.id,
          clientId: schema.projects.clientId,
          status: schema.projects.status,
          metadata: schema.projects.metadata,
        })
        .from(schema.projects),
    ),
    readOptionalOperationalDataset(() =>
      db
        .select({
          email: schema.users.email,
          role: schema.users.role,
          isActive: schema.users.isActive,
        })
        .from(schema.users),
    ),
    readOptionalOperationalDataset(() =>
      db
        .select({
          id: schema.clients.id,
          email: schema.clients.email,
          status: schema.clients.status,
          metadata: schema.clients.metadata,
        })
        .from(schema.clients),
    ),
    getStoredOverrideRecord(db),
  ]);

  const clientById = new Map(clients.map((client) => [client.id, client]));
  const overrides = parseOverrides(overrideRecord?.metadata);

  const autoValues: OperationalMetricValues = {
    activeProjects: projects.filter((project) => {
      if (!isTrackedProjectCountable(project.status, project.metadata, "commercial")) {
        return false;
      }

      if (!project.clientId) {
        return true;
      }

      const client = clientById.get(project.clientId);
      return !isSystemClient(client?.email ?? null);
    }).length,
    activeUsers: users.filter((user) => isActiveClientUser(user.email, user.role, user.isActive)).length,
    community: projects.filter((project) => {
      if (!isTrackedProjectCountable(project.status, project.metadata, "community")) {
        return false;
      }

      if (!project.clientId) {
        return true;
      }

      const client = clientById.get(project.clientId);
      return !isSystemClient(client?.email ?? null);
    }).length,
    upcomingLaunches: projects.filter((project) => {
      if (!isRoadmapProject(project.status, project.metadata)) {
        return false;
      }

      if (!project.clientId) {
        return true;
      }

      const client = clientById.get(project.clientId);
      return !isSystemClient(client?.email ?? null);
    }).length,
  };

  return createSnapshot(autoValues, overrides, true, overrideRecord?.updatedAt?.toISOString() ?? null);
}

export async function updateOperationalStatsOverrides(
  input: Partial<Record<OperationalMetricKey, Partial<OperationalMetricConfig>>>,
  expectedUpdatedAt?: string | null,
) {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL no está configurada. Conecta Neon para guardar overrides.");
  }

  const db = getDb();
  const currentRecord = await getStoredOverrideRecord(db);
  const currentOverrides = parseOverrides(currentRecord?.metadata);
  const nextOverrides = mergeOverrides(currentOverrides, input);
  const existingRecord = currentRecord
    ? { id: currentRecord.id, updatedAt: currentRecord.updatedAt }
    : null;

  if (existingRecord) {
    assertOptimisticLock(
      expectedUpdatedAt === undefined || expectedUpdatedAt === existingRecord.updatedAt.toISOString(),
      "Las métricas operativas cambiaron en otra sesión. Recarga configuración antes de volver a guardar overrides.",
      {
        entity: "operational-stats",
        expected: expectedUpdatedAt ?? null,
        actual: existingRecord.updatedAt.toISOString(),
      },
    );

    await db
      .update(schema.aiMemory)
      .set({
        content: "Operational stats overrides",
        metadata: nextOverrides,
        updatedAt: new Date(),
      })
      .where(eq(schema.aiMemory.id, existingRecord.id));
  } else {
    assertOptimisticLock(
      expectedUpdatedAt === undefined || expectedUpdatedAt === null,
      "Las métricas operativas ya fueron configuradas en otra sesión. Recarga configuración antes de volver a guardar overrides.",
      {
        entity: "operational-stats",
        expected: expectedUpdatedAt ?? null,
        actual: "created",
      },
    );

    await db.insert(schema.aiMemory).values({
      key: operationalStatsOverrideKey,
      category: "global",
      content: "Operational stats overrides",
      metadata: nextOverrides,
    });
  }

  return getOperationalStatsSnapshot();
}

async function getStoredOverrideRecord(db: ReturnType<typeof getDb>) {
  const [record] = await readOptionalOperationalDataset(() =>
    db
      .select({
        id: schema.aiMemory.id,
        metadata: schema.aiMemory.metadata,
        updatedAt: schema.aiMemory.updatedAt,
      })
      .from(schema.aiMemory)
      .where(eq(schema.aiMemory.key, operationalStatsOverrideKey))
      .limit(1),
  );

  return record ?? null;
}

async function readOptionalOperationalDataset<T>(reader: () => Promise<T[]>) {
  try {
    return await reader();
  } catch (error) {
    if (isMissingOperationalRelationError(error)) {
      return [];
    }

    throw error;
  }
}

function isMissingOperationalRelationError(error: unknown): boolean {
  if (!error) {
    return false;
  }

  if (typeof error === "string") {
    return hasMissingOperationalRelationMessage(error);
  }

  if (typeof error === "object") {
    const candidate = error as { code?: unknown; message?: unknown; cause?: unknown };

    if (candidate.code === "42P01") {
      return true;
    }

    if (typeof candidate.message === "string" && hasMissingOperationalRelationMessage(candidate.message)) {
      return true;
    }

    return isMissingOperationalRelationError(candidate.cause);
  }

  return false;
}

function hasMissingOperationalRelationMessage(message: string) {
  const normalized = message.toLowerCase();

  return (
    (normalized.includes("relation") && normalized.includes("does not exist"))
    || (normalized.includes("table") && normalized.includes("does not exist"))
    || normalized.includes("no such table")
    || normalized.includes("undefined_table")
  );
}

function createSnapshot(
  autoValues: OperationalMetricValues,
  overrides: OperationalMetricOverrides,
  databaseConfigured: boolean,
  updatedAt: string | null,
): OperationalStatsSnapshot {
  const values = { ...autoValues };
  const sources = {
    activeProjects: overrides.activeProjects.mode,
    activeUsers: overrides.activeUsers.mode,
    community: overrides.community.mode,
    upcomingLaunches: overrides.upcomingLaunches.mode,
  } satisfies Record<OperationalMetricKey, OperationalMetricMode>;

  for (const key of metricKeys) {
    if (overrides[key].mode === "manual" && typeof overrides[key].value === "number") {
      values[key] = normalizeMetricValue(overrides[key].value);
    }
  }

  return {
    databaseConfigured,
    autoValues,
    values,
    sources,
    overrides,
    updatedAt,
  };
}

function parseOverrides(metadata: Record<string, unknown> | undefined): OperationalMetricOverrides {
  const parsed = { ...defaultOverrides };

  for (const key of metricKeys) {
    const value = metadata?.[key];

    if (!value || typeof value !== "object") {
      continue;
    }

    const mode = "mode" in value && value.mode === "manual" ? "manual" : "auto";
    const numericValue = "value" in value && typeof value.value === "number" ? normalizeMetricValue(value.value) : null;

    parsed[key] = {
      mode,
      value: numericValue,
    };
  }

  return parsed;
}

function mergeOverrides(
  currentOverrides: OperationalMetricOverrides,
  input: Partial<Record<OperationalMetricKey, Partial<OperationalMetricConfig>>>,
): OperationalMetricOverrides {
  const nextOverrides = { ...currentOverrides };

  for (const key of metricKeys) {
    const nextValue = input[key];

    if (!nextValue) {
      continue;
    }

    nextOverrides[key] = {
      mode: nextValue.mode === "manual" ? "manual" : "auto",
      value: typeof nextValue.value === "number" ? normalizeMetricValue(nextValue.value) : null,
    };
  }

  return nextOverrides;
}

function normalizeMetricValue(value: number) {
  return Math.max(0, Math.round(value));
}

function isTrackedProjectCountable(
  status: string | null,
  metadata: Record<string, unknown>,
  track: "commercial" | "community",
) {
  if (hasSeedSource(metadata)) {
    return false;
  }

  if (isInactiveProjectStatus(status)) {
    return false;
  }

  if (isRoadmapProject(status, metadata)) {
    return false;
  }

  return resolveProjectTrack(metadata, status) === track;
}

function isRoadmapProject(status: string | null, metadata: Record<string, unknown>) {
  if (hasSeedSource(metadata)) {
    return false;
  }

  if (isInactiveProjectStatus(status)) {
    return false;
  }

  return resolveProjectTrack(metadata, status) === "roadmap" || upcomingProjectStatuses.has((status ?? "").toLowerCase());
}

function resolveProjectTrack(metadata: Record<string, unknown>, status: string | null) {
  const metadataValues = [
    metadata?.track,
    metadata?.projectTrack,
    metadata?.type,
    metadata?.kind,
    metadata?.category,
    metadata?.segment,
    metadata?.audience,
  ];

  for (const candidate of metadataValues) {
    const normalized = typeof candidate === "string" ? candidate.trim().toLowerCase() : null;

    if (!normalized) {
      continue;
    }

    if (["community", "comunidad", "social", "open-source", "open_source"].includes(normalized)) {
      return "community";
    }

    if (["roadmap", "future", "futuro", "upcoming", "planned", "launch", "pipeline"].includes(normalized)) {
      return "roadmap";
    }

    if (["commercial", "comercial", "saas", "software", "product", "cliente", "client"].includes(normalized)) {
      return "commercial";
    }
  }

  if (metadata?.community === true || metadata?.isCommunity === true) {
    return "community";
  }

  if (upcomingProjectStatuses.has((status ?? "").toLowerCase())) {
    return "roadmap";
  }

  return "commercial";
}

function isInactiveProjectStatus(status: string | null) {
  return inactiveProjectStatuses.has((status ?? "active").toLowerCase());
}

function isActiveClientUser(email: string, role: "team" | "client", isActive: boolean) {
  if (!isActive || role !== "client") {
    return false;
  }

  return !isSystemClient(email);
}

function isSystemClient(email: string | null) {
  return Boolean(email && normalizeEmail(email)?.endsWith("@client.vertrex.co"));
}

function hasSeedSource(metadata: Record<string, unknown>) {
  return metadata?.source === "seed";
}

function normalizeEmail(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? null;
}
