import { randomUUID } from "node:crypto";

import bcrypt from "bcryptjs";
import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import {
  signSessionToken,
  type SessionRole,
  verifySessionToken,
} from "@/lib/auth/token";
import { recordAuditEvent } from "@/lib/audit/audit-service";
import { getDb, isDatabaseConfigured, schema } from "@/lib/db";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: SessionRole;
  clientId: string | null;
  clientSlug: string | null;
};

export type AppSession = {
  sessionToken: string;
  expiresAt: string;
  user: SessionUser;
};

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

export async function authenticateUser(identifier: string, password: string, role: SessionRole) {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL no está configurada. Conecta Neon para habilitar autenticación real.");
  }

  const db = getDb();
  const normalizedIdentifier = normalizeIdentifier(identifier, role);
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, normalizedIdentifier))
    .limit(1);

  if (!user || !user.isActive || user.role !== role) {
    return null;
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    return null;
  }

  const clientSlug = user.clientId ? await getClientSlug(user.clientId) : null;
  const sessionToken = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.insert(schema.sessions).values({
    userId: user.id,
    sessionToken,
    expiresAt,
    createdAt: new Date(),
  });

  await db
    .update(schema.users)
    .set({
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(schema.users.id, user.id));

  const token = await signSessionToken({
    sid: sessionToken,
    role: user.role,
    email: user.email,
    name: user.name,
    clientId: user.clientId,
    clientSlug,
  }, user.id, expiresAt);

  await recordAuditEvent({
    actor: {
      userId: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    },
    targetUserId: user.id,
    targetName: user.name,
    clientId: user.clientId,
    module: "auth",
    action: "login",
    entityType: "session",
    entityId: sessionToken,
    summary: `${user.name} inició sesión en Vertrex OS.`,
    metadata: {
      loginRole: role,
      clientSlug,
    },
  });

  return {
    token,
    sessionToken,
    expiresAt,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      clientId: user.clientId,
      clientSlug,
    },
  };
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return getSessionFromToken(token);
}

export async function getSessionFromToken(token: string): Promise<AppSession | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const payload = await verifySessionToken(token);

  if (!payload?.sid || typeof payload.sub !== "string") {
    return null;
  }

  const db = getDb();
  const [session] = await db
    .select()
    .from(schema.sessions)
    .where(
      and(
        eq(schema.sessions.sessionToken, payload.sid),
        eq(schema.sessions.userId, payload.sub),
        gt(schema.sessions.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!session) {
    return null;
  }

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, payload.sub))
    .limit(1);

  if (!user || !user.isActive) {
    return null;
  }

  const clientSlug = user.clientId ? await getClientSlug(user.clientId) : null;

  return {
    sessionToken: session.sessionToken,
    expiresAt: session.expiresAt.toISOString(),
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      clientId: user.clientId,
      clientSlug,
    },
  };
}

export async function clearSession(token: string | null | undefined) {
  if (!token || !isDatabaseConfigured) {
    return;
  }

  const currentSession = await getSessionFromToken(token);
  const payload = await verifySessionToken(token);

  if (!payload?.sid) {
    return;
  }

  const db = getDb();
  await db.delete(schema.sessions).where(eq(schema.sessions.sessionToken, payload.sid));

  if (currentSession) {
    await recordAuditEvent({
      actor: {
        userId: currentSession.user.id,
        role: currentSession.user.role,
        name: currentSession.user.name,
        email: currentSession.user.email,
      },
      targetUserId: currentSession.user.id,
      targetName: currentSession.user.name,
      clientId: currentSession.user.clientId,
      module: "auth",
      action: "logout",
      entityType: "session",
      entityId: payload.sid,
      summary: `${currentSession.user.name} cerró su sesión.`,
      metadata: {
        clientSlug: currentSession.user.clientSlug,
      },
    });
  }
}

export function getSessionCookieOptions(expiresAt?: Date) {
  return {
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  };
}

export function getLoginRedirectPath(user: SessionUser) {
  if (user.role === "client") {
    return `/portal/${user.clientSlug ?? "budaphone"}`;
  }

  return "/os";
}

export async function requireAuthenticatedSession() {
  const session = await getCurrentSession();

  if (!session) {
    throw new Error("Sesión inválida o expirada.");
  }

  return session;
}

export async function requireTeamSession() {
  const session = await requireAuthenticatedSession();

  if (session.user.role !== "team") {
    throw new Error("Acceso restringido al equipo interno.");
  }

  return session;
}

export async function requireClientSession() {
  const session = await requireAuthenticatedSession();

  if (session.user.role !== "client") {
    throw new Error("Acceso restringido al portal del cliente.");
  }

  return session;
}

function normalizeIdentifier(identifier: string, role: SessionRole) {
  const normalized = identifier.trim().toLowerCase();

  if (normalized.includes("@")) {
    return normalized;
  }

  if (role === "team") {
    return `${normalized}@vertrex.co`;
  }

  return `${normalized}@client.vertrex.co`;
}

async function getClientSlug(clientId: string) {
  const db = getDb();
  const [client] = await db
    .select({ slug: schema.clients.slug })
    .from(schema.clients)
    .where(eq(schema.clients.id, clientId))
    .limit(1);

  return client?.slug ?? null;
}
