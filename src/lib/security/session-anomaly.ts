import { eq, and, gt, desc, sql } from "drizzle-orm";

import { getDb, isDatabaseConfigured, schema } from "@/lib/db";
import { recordAuditEvent } from "@/lib/audit/audit-service";

export type SessionAnomalyType = 
  | "concurrent_sessions"
  | "ip_change"
  | "location_change"
  | "user_agent_change"
  | "rapid_login_attempts"
  | "off_hours_access"
  | "suspicious_pattern";

export type SessionAnomaly = {
  id: string;
  userId: string;
  sessionId: string;
  anomalyType: SessionAnomalyType;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  metadata: Record<string, unknown>;
  detectedAt: string;
  acknowledgedAt: string | null;
  acknowledgedBy: string | null;
};

export type DetectedAnomaly = {
  type: SessionAnomalyType;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  metadata: Record<string, unknown>;
};

const OFFICE_HOURS_START = 7; // 7 AM
const OFFICE_HOURS_END = 20; // 8 PM
const CONCURRENT_SESSION_THRESHOLD = 3;
const RAPID_LOGIN_THRESHOLD = 5;
const RAPID_LOGIN_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export async function detectSessionAnomalies(
  userId: string,
  sessionId: string,
  context: {
    ip?: string;
    userAgent?: string;
    timestamp?: Date;
  }
): Promise<DetectedAnomaly[]> {
  const anomalies: DetectedAnomaly[] = [];

  if (!isDatabaseConfigured()) {
    return anomalies;
  }

  const [concurrentAnomaly, rapidLoginAnomaly, offHoursAnomaly] = await Promise.all([
    detectConcurrentSessions(userId, sessionId),
    detectRapidLoginAttempts(userId),
    detectOffHoursAccess(context.timestamp),
  ]);

  if (concurrentAnomaly) anomalies.push(concurrentAnomaly);
  if (rapidLoginAnomaly) anomalies.push(rapidLoginAnomaly);
  if (offHoursAnomaly) anomalies.push(offHoursAnomaly);

  return anomalies;
}

async function detectConcurrentSessions(
  userId: string,
  currentSessionId: string
): Promise<DetectedAnomaly | null> {
  const db = getDb();
  const now = new Date();

  const activeSessions = await db
    .select({ id: schema.sessions.id })
    .from(schema.sessions)
    .where(
      and(
        eq(schema.sessions.userId, userId),
        gt(schema.sessions.expiresAt, now)
      )
    );

  const sessionCount = activeSessions.length;

  if (sessionCount > CONCURRENT_SESSION_THRESHOLD) {
    return {
      type: "concurrent_sessions",
      severity: sessionCount > 5 ? "critical" : "high",
      description: `Usuario tiene ${sessionCount} sesiones activas simultáneas`,
      metadata: {
        sessionCount,
        threshold: CONCURRENT_SESSION_THRESHOLD,
        sessionIds: activeSessions.map((s) => s.id),
      },
    };
  }

  return null;
}

async function detectRapidLoginAttempts(userId: string): Promise<DetectedAnomaly | null> {
  const db = getDb();
  const windowStart = new Date(Date.now() - RAPID_LOGIN_WINDOW_MS);

  const recentAttempts = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.auditEvents)
    .where(
      and(
        eq(schema.auditEvents.actorUserId, userId),
        eq(schema.auditEvents.module, "auth"),
        eq(schema.auditEvents.action, "login"),
        gt(schema.auditEvents.createdAt, windowStart)
      )
    );

  const attemptCount = recentAttempts[0]?.count ?? 0;

  if (attemptCount > RAPID_LOGIN_THRESHOLD) {
    return {
      type: "rapid_login_attempts",
      severity: "high",
      description: `${attemptCount} intentos de login en los últimos 5 minutos`,
      metadata: {
        attemptCount,
        threshold: RAPID_LOGIN_THRESHOLD,
        windowMs: RAPID_LOGIN_WINDOW_MS,
      },
    };
  }

  return null;
}

function detectOffHoursAccess(timestamp?: Date): DetectedAnomaly | null {
  const checkTime = timestamp ?? new Date();
  const hour = checkTime.getHours();
  const day = checkTime.getDay(); // 0 = Sunday, 6 = Saturday

  const isWeekend = day === 0 || day === 6;
  const isOffHours = hour < OFFICE_HOURS_START || hour >= OFFICE_HOURS_END;

  if (isWeekend || isOffHours) {
    return {
      type: "off_hours_access",
      severity: isWeekend ? "medium" : "low",
      description: `Acceso fuera de horario laboral (${isWeekend ? "fin de semana" : "horas no laborales"})`,
      metadata: {
        hour,
        day,
        isWeekend,
        officeHoursStart: OFFICE_HOURS_START,
        officeHoursEnd: OFFICE_HOURS_END,
      },
    };
  }

  return null;
}

export async function recordSessionAnomaly(
  userId: string,
  sessionId: string,
  anomaly: DetectedAnomaly
): Promise<void> {
  if (!isDatabaseConfigured()) {
    return;
  }

  await recordAuditEvent({
    actor: { userId },
    action: "session_anomaly_detected",
    module: "security",
    entityType: "session",
    entityId: sessionId,
    summary: anomaly.description,
    metadata: {
      anomalyType: anomaly.type,
      severity: anomaly.severity,
      description: anomaly.description,
      anomalyMetadata: anomaly.metadata,
    },
  });
}

export async function getRecentAnomalies(
  options: {
    userId?: string;
    severity?: "low" | "medium" | "high" | "critical";
    limit?: number;
    offset?: number;
  } = {}
): Promise<SessionAnomaly[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  const db = getDb();
  const conditions = [];

  if (options.userId) {
    conditions.push(eq(schema.auditEvents.actorUserId, options.userId));
  }

  conditions.push(eq(schema.auditEvents.action, "session_anomaly_detected"));

  const rows = await db
    .select()
    .from(schema.auditEvents)
    .where(and(...conditions))
    .orderBy(desc(schema.auditEvents.createdAt))
    .limit(options.limit ?? 20)
    .offset(options.offset ?? 0);

  return rows.map((row) => ({
    id: row.id,
    userId: row.actorUserId ?? "",
    sessionId: row.entityId ?? "",
    anomalyType: (row.metadata as Record<string, unknown>)?.anomalyType as SessionAnomalyType,
    severity: (row.metadata as Record<string, unknown>)?.severity as SessionAnomaly["severity"],
    description: (row.metadata as Record<string, unknown>)?.description as string,
    metadata: (row.metadata as Record<string, unknown>)?.anomalyMetadata as Record<string, unknown>,
    detectedAt: row.createdAt.toISOString(),
    acknowledgedAt: null,
    acknowledgedBy: null,
  }));
}

