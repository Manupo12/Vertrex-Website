import bcrypt from "bcryptjs";
import { desc, eq, gt } from "drizzle-orm";

import {
  getDefaultCapabilitiesForSubrole,
  normalizeTeamCapabilities,
  normalizeTeamSubrole,
  type TeamCapability,
  type TeamSubrole,
} from "@/lib/admin/access-governance";
import {
  getRecentAuditEvents,
  recordAuditEvent,
  type AuditActorInput,
  type RecentAuditEvent,
} from "@/lib/audit/audit-service";
import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import { getOperationalStatsSnapshot, type OperationalStatsSnapshot } from "@/lib/dashboard/operational-stats";
import { assertOptimisticLock } from "@/lib/security/optimistic-lock";

export type ManagedSessionRiskStatus = "healthy" | "warning" | "critical";

export type ManagedAccessUser = {
  id: string;
  name: string;
  email: string;
  role: "team" | "client";
  teamSubrole: TeamSubrole | null;
  capabilities: TeamCapability[];
  isActive: boolean;
  updatedAt: string;
  lastLoginAt: string | null;
  activeSessionCount: number;
  lastSessionStartedAt: string | null;
  sessionRiskStatus: ManagedSessionRiskStatus;
  sessionRiskReasons: string[];
  clientId: string | null;
  clientSlug: string | null;
  clientName: string | null;
  isOwner: boolean;
};

export type ManagedClientOption = {
  id: string;
  slug: string;
  name: string;
  brand: string;
};

export type AccessManagementSnapshot = {
  databaseConfigured: boolean;
  users: ManagedAccessUser[];
  clients: ManagedClientOption[];
  stats: OperationalStatsSnapshot;
  recentAuditEvents: RecentAuditEvent[];
  summary: {
    managedUsers: number;
    activeUsers: number;
    clientAccounts: number;
    activeSessions: number;
  };
};

export type CreateManagedUserInput = {
  name: string;
  email: string;
  password: string;
  role: "team" | "client";
  teamSubrole?: TeamSubrole | null;
  capabilities?: TeamCapability[] | null;
  clientSlug?: string;
  clientName?: string;
  clientBrand?: string;
  clientEmail?: string;
};

const systemAdminEmail = "admin@vertrex.co";

export async function getAccessManagementSnapshot(): Promise<AccessManagementSnapshot> {
  const stats = await getOperationalStatsSnapshot();

  if (!isDatabaseConfigured()) {
    return {
      databaseConfigured: false,
      users: [],
      clients: [],
      stats,
      recentAuditEvents: [],
      summary: {
        managedUsers: 0,
        activeUsers: 0,
        clientAccounts: 0,
        activeSessions: 0,
      },
    };
  }

  const db = getDb();
  const [users, clients, sessions, recentAuditEvents] = await Promise.all([
    readOptionalAccessDataset(() =>
      db
        .select({
          id: schema.users.id,
          name: schema.users.name,
          email: schema.users.email,
          role: schema.users.role,
          teamSubrole: schema.users.teamSubrole,
          capabilities: schema.users.capabilities,
          isActive: schema.users.isActive,
          updatedAt: schema.users.updatedAt,
          lastLoginAt: schema.users.lastLoginAt,
          clientId: schema.users.clientId,
        })
        .from(schema.users)
        .orderBy(desc(schema.users.updatedAt)),
    ),
    readOptionalAccessDataset(() =>
      db
        .select({
          id: schema.clients.id,
          slug: schema.clients.slug,
          name: schema.clients.name,
          brand: schema.clients.brand,
          email: schema.clients.email,
        })
        .from(schema.clients)
        .orderBy(desc(schema.clients.updatedAt)),
    ),
    readOptionalAccessDataset(() =>
      db
        .select({
          userId: schema.sessions.userId,
          createdAt: schema.sessions.createdAt,
        })
        .from(schema.sessions)
        .where(gt(schema.sessions.expiresAt, new Date())),
    ),
    getRecentAuditEvents(12),
  ]);

  const ownerEmail = normalizeEmail(process.env.OWNER_EMAIL);
  const activeSessionsByUserId = sessions.reduce<Map<string, Array<(typeof sessions)[number]>>>((accumulator, session) => {
    const currentSessions = accumulator.get(session.userId) ?? [];
    currentSessions.push(session);
    accumulator.set(session.userId, currentSessions);
    return accumulator;
  }, new Map());
  const clientsById = new Map(clients.map((client) => [client.id, client]));

  const managedUsers = users
    .filter((user) => isVisibleManagedUser(user.email, user.role, ownerEmail))
    .map<ManagedAccessUser>((user) => {
      const client = user.clientId ? clientsById.get(user.clientId) : null;
      const userSessions = activeSessionsByUserId.get(user.id) ?? [];
      const sessionRisk = evaluateManagedUserSessionRisk({
        role: user.role,
        isActive: user.isActive,
        clientId: user.clientId,
        activeSessions: userSessions.length,
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        teamSubrole: user.role === "team" ? normalizeTeamSubrole(user.teamSubrole) : null,
        capabilities: user.role === "team" ? normalizeTeamCapabilities(user.capabilities) : [],
        isActive: user.isActive,
        updatedAt: user.updatedAt.toISOString(),
        lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
        activeSessionCount: userSessions.length,
        lastSessionStartedAt: getLatestSessionStartedAt(userSessions),
        sessionRiskStatus: sessionRisk.status,
        sessionRiskReasons: sessionRisk.reasons,
        clientId: user.clientId,
        clientSlug: client?.slug ?? null,
        clientName: client?.name ?? null,
        isOwner: ownerEmail ? user.email === ownerEmail : false,
      };
    });

  const visibleClients = clients
    .filter((client) => !isSystemClientEmail(client.email))
    .map<ManagedClientOption>((client) => ({
      id: client.id,
      slug: client.slug,
      name: client.name,
      brand: client.brand,
    }));

  return {
    databaseConfigured: true,
    users: managedUsers,
    clients: visibleClients,
    stats,
    recentAuditEvents,
    summary: {
      managedUsers: managedUsers.length,
      activeUsers: managedUsers.filter((user) => user.isActive).length,
      clientAccounts: managedUsers.filter((user) => user.role === "client").length,
      activeSessions: managedUsers.reduce((total, user) => total + user.activeSessionCount, 0),
    },
  };
}

async function readOptionalAccessDataset<T>(reader: () => Promise<T[]>) {
  try {
    return await reader();
  } catch (error) {
    if (isMissingAccessRelationError(error)) {
      return [];
    }

    throw error;
  }
}

function isMissingAccessRelationError(error: unknown): boolean {
  if (!error) {
    return false;
  }

  if (typeof error === "string") {
    return hasMissingAccessRelationMessage(error);
  }

  if (typeof error === "object") {
    const candidate = error as { code?: unknown; message?: unknown; cause?: unknown };

    if (candidate.code === "42P01") {
      return true;
    }

    if (typeof candidate.message === "string" && hasMissingAccessRelationMessage(candidate.message)) {
      return true;
    }

    return isMissingAccessRelationError(candidate.cause);
  }

  return false;
}

function hasMissingAccessRelationMessage(message: string) {
  const normalized = message.toLowerCase();

  return (
    (normalized.includes("relation") && normalized.includes("does not exist"))
    || (normalized.includes("table") && normalized.includes("does not exist"))
    || normalized.includes("no such table")
    || normalized.includes("undefined_table")
  );
}

export async function createManagedUser(input: CreateManagedUserInput, actor?: AuditActorInput) {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL no está configurada. Conecta Neon para administrar accesos.");
  }

  const db = getDb();
  const email = requireEmail(input.email);
  const [existingUser] = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  if (existingUser) {
    throw new Error("Ya existe un usuario con ese correo.");
  }

  let clientId: string | null = null;
  let clientName: string | null = null;

  if (input.role === "client") {
    const managedClient = await ensureManagedClient({
      slug: input.clientSlug,
      name: input.clientName,
      brand: input.clientBrand,
      email: input.clientEmail ?? email,
    });

    clientId = managedClient.id;
    clientName = managedClient.name;
  }

  const teamSubrole = input.role === "team" ? normalizeTeamSubrole(input.teamSubrole) ?? "ops" : null;
  const capabilities = input.role === "team"
    ? resolveTeamCapabilities(teamSubrole, input.capabilities)
    : [];
  const passwordHash = await bcrypt.hash(input.password.trim(), 10);
  const [createdUser] = await db.insert(schema.users).values({
    name: input.name.trim(),
    email,
    passwordHash,
    role: input.role,
    teamSubrole,
    capabilities,
    clientId,
    isActive: true,
  }).returning({
    id: schema.users.id,
    name: schema.users.name,
  });

  await recordAuditEvent({
    actor,
    targetUserId: createdUser.id,
    targetName: createdUser.name,
    clientId,
    clientName,
    module: "access",
    action: "create-user",
    entityType: "user",
    entityId: createdUser.id,
    summary:
      input.role === "team"
        ? `Creó el acceso de ${createdUser.name} con gobierno interno.`
        : `Creó el acceso portal de ${createdUser.name}.`,
    metadata: {
      role: input.role,
      teamSubrole,
      capabilities,
      email,
    },
  });

  return getAccessManagementSnapshot();
}

export async function setManagedUserActive(userId: string, isActive: boolean, actor?: AuditActorInput, expectedUpdatedAt?: string | null) {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL no está configurada. Conecta Neon para administrar accesos.");
  }

  const db = getDb();
  const targetUser = await requireManageableUser(userId);

  if (targetUser.isOwner) {
    throw new Error("No puedes desactivar el owner principal desde esta vista.");
  }

  assertOptimisticLock(
    expectedUpdatedAt === undefined || expectedUpdatedAt === targetUser.updatedAt.toISOString(),
    "El acceso cambió en otra sesión. Recarga la tabla antes de volver a activar o revocar este usuario.",
    {
      entity: "managed-access-user",
      expected: expectedUpdatedAt ?? null,
      actual: targetUser.updatedAt.toISOString(),
    },
  );

  await db
    .update(schema.users)
    .set({
      isActive,
      updatedAt: new Date(),
    })
    .where(eq(schema.users.id, userId));

  if (!isActive) {
    await db.delete(schema.sessions).where(eq(schema.sessions.userId, userId));
  }

  await recordAuditEvent({
    actor,
    targetUserId: targetUser.id,
    targetName: targetUser.name,
    clientId: targetUser.clientId,
    module: "access",
    action: isActive ? "activate-user" : "deactivate-user",
    entityType: "user",
    entityId: targetUser.id,
    summary: `${isActive ? "Activó" : "Revocó"} el acceso de ${targetUser.name}.`,
    metadata: {
      role: targetUser.role,
      closedSessions: !isActive,
    },
  });

  return getAccessManagementSnapshot();
}

export async function revokeManagedUserSessions(userId: string, actor?: AuditActorInput) {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL no está configurada. Conecta Neon para administrar accesos.");
  }

  const targetUser = await requireManageableUser(userId);
  const db = getDb();
  await db.delete(schema.sessions).where(eq(schema.sessions.userId, userId));

  await recordAuditEvent({
    actor,
    targetUserId: targetUser.id,
    targetName: targetUser.name,
    clientId: targetUser.clientId,
    module: "access",
    action: "revoke-sessions",
    entityType: "session",
    entityId: targetUser.id,
    summary: `Cerró las sesiones activas de ${targetUser.name}.`,
    metadata: {
      role: targetUser.role,
    },
  });

  return getAccessManagementSnapshot();
}

async function ensureManagedClient(input: {
  slug?: string;
  name?: string;
  brand?: string;
  email?: string;
}) {
  const slug = normalizeSlug(input.slug);

  if (!slug) {
    throw new Error("Debes indicar un slug de cliente para crear un acceso de portal.");
  }

  const db = getDb();
  const [existingClient] = await db
    .select({
      id: schema.clients.id,
      email: schema.clients.email,
      name: schema.clients.name,
      brand: schema.clients.brand,
    })
    .from(schema.clients)
    .where(eq(schema.clients.slug, slug))
    .limit(1);

  if (existingClient) {
    const clientName = input.name?.trim() || existingClient.name;
    const clientBrand = input.brand?.trim() || existingClient.brand;
    const nextEmail = normalizeEmail(input.email) ?? existingClient.email;

    await db
      .update(schema.clients)
      .set({
        name: clientName,
        brand: clientBrand,
        email: nextEmail,
        company: clientName,
        status: "active",
        metadata: {
          source: "settings",
          displayName: clientName,
          statusLabel: "Configurado",
          statusHighlights: [
            { label: "Origen", value: "Settings" },
            { label: "Estado", value: "Activo" },
          ],
        },
        updatedAt: new Date(),
      })
      .where(eq(schema.clients.id, existingClient.id));

    return {
      id: existingClient.id,
      name: clientName,
    };
  }

  const clientName = input.name?.trim() || slug.replace(/-/g, " ");
  const clientBrand = input.brand?.trim() || clientName.toUpperCase();
  const clientEmail = requireEmail(input.email ?? "");
  const [createdClient] = await db
    .insert(schema.clients)
    .values({
      slug,
      name: clientName,
      brand: clientBrand,
      email: clientEmail,
      company: clientName,
      status: "active",
      phase: "Onboarding",
      progress: 0,
      totalInvestmentCents: 0,
      paidCents: 0,
      pendingCents: 0,
      welcomeTitle: `Bienvenido, ${clientName}.`,
      welcomeDescription: "Portal listo para activarse con documentos, entregables y soporte.",
      nextAction: "Configurar el portal y compartir accesos.",
      nextActionContext: "Este cliente fue creado desde configuración para operar sobre Vertrex OS.",
      nextActionCta: "Entrar al portal",
      metadata: {
        source: "settings",
        displayName: clientName,
        statusLabel: "Configuración inicial",
        statusHighlights: [
          { label: "Origen", value: "Settings" },
          { label: "Estado", value: "Activo" },
        ],
      },
    })
    .returning({ id: schema.clients.id });

  return {
    id: createdClient.id,
    name: clientName,
  };
}

async function requireManageableUser(userId: string) {
  const db = getDb();
  const ownerEmail = normalizeEmail(process.env.OWNER_EMAIL);
  const [user] = await db
    .select({
      id: schema.users.id,
      name: schema.users.name,
      email: schema.users.email,
      role: schema.users.role,
      clientId: schema.users.clientId,
      updatedAt: schema.users.updatedAt,
    })
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);

  if (!user || !isVisibleManagedUser(user.email, user.role, ownerEmail)) {
    throw new Error("Usuario no encontrado o no administrable desde esta vista.");
  }

  return {
    ...user,
    isOwner: ownerEmail ? user.email === ownerEmail : false,
  };
}

function isVisibleManagedUser(email: string, role: "team" | "client", ownerEmail: string | null) {
  if (ownerEmail && email === ownerEmail) {
    return true;
  }

  if (email === systemAdminEmail) {
    return false;
  }

  if (role === "client" && isSystemClientEmail(email)) {
    return false;
  }

  return true;
}

function isSystemClientEmail(email: string | null) {
  return Boolean(normalizeEmail(email)?.endsWith("@client.vertrex.co"));
}

function evaluateManagedUserSessionRisk({
  role,
  isActive,
  clientId,
  activeSessions,
}: {
  role: "team" | "client";
  isActive: boolean;
  clientId: string | null;
  activeSessions: number;
}) {
  const reasons: string[] = [];
  let hasCriticalReason = false;

  if (!isActive && activeSessions > 0) {
    hasCriticalReason = true;
    reasons.push("Acceso revocado con sesiones todavía abiertas.");
  }

  if (role === "client" && !clientId && activeSessions > 0) {
    hasCriticalReason = true;
    reasons.push("Cuenta de portal con sesiones sin cliente asociado.");
  }

  if (role === "client") {
    if (activeSessions >= 3) {
      hasCriticalReason = true;
      reasons.push("Cliente con 3 o más sesiones concurrentes.");
    } else if (activeSessions >= 2) {
      reasons.push("Cliente con múltiples sesiones concurrentes.");
    }
  }

  if (role === "team") {
    if (activeSessions >= 6) {
      hasCriticalReason = true;
      reasons.push("Miembro interno con 6 o más sesiones activas.");
    } else if (activeSessions >= 4) {
      reasons.push("Miembro interno con 4 o más sesiones activas.");
    }
  }

  return {
    status: hasCriticalReason ? "critical" as const : reasons.length > 0 ? "warning" as const : "healthy" as const,
    reasons,
  };
}

function getLatestSessionStartedAt(sessions: Array<{ createdAt: Date }>) {
  const latestSession = sessions.reduce<Date | null>((latest, session) => {
    if (!latest || session.createdAt.getTime() > latest.getTime()) {
      return session.createdAt;
    }

    return latest;
  }, null);

  return latestSession ? latestSession.toISOString() : null;
}

function requireEmail(value: string) {
  const email = normalizeEmail(value);

  if (!email || !email.includes("@")) {
    throw new Error("Debes indicar un correo válido.");
  }

  return email;
}

function resolveTeamCapabilities(subrole: TeamSubrole | null, capabilities: TeamCapability[] | null | undefined) {
  const normalized = normalizeTeamCapabilities(capabilities);
  return normalized.length > 0 ? normalized : getDefaultCapabilitiesForSubrole(subrole);
}

function normalizeEmail(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? null;
}

function normalizeSlug(value: string | null | undefined) {
  return value
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "") ?? null;
}
