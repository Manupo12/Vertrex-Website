import { desc, eq, and } from "drizzle-orm";

import { getDb, isDatabaseConfigured, schema } from "@/lib/db";

export type PortalActivityActorType = "user" | "ai" | "system" | "client";

export type PortalActivityItem = {
  id: string;
  clientId: string;
  projectId: string | null;
  actorType: PortalActivityActorType;
  actorName: string | null;
  actorId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  entityName: string | null;
  description: string;
  metadata: Record<string, unknown>;
  clientVisible: boolean;
  createdAt: string;
};

export type CreatePortalActivityInput = {
  clientId: string;
  projectId?: string | null;
  actorType: PortalActivityActorType;
  actorName?: string | null;
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  entityName?: string | null;
  description: string;
  metadata?: Record<string, unknown>;
  clientVisible?: boolean;
};

function mapDbToActivity(row: typeof schema.portalActivityFeed.$inferSelect): PortalActivityItem {
  return {
    id: row.id,
    clientId: row.clientId,
    projectId: row.projectId,
    actorType: row.actorType as PortalActivityActorType,
    actorName: row.actorName,
    actorId: row.actorId,
    action: row.action,
    entityType: row.entityType,
    entityId: row.entityId,
    entityName: row.entityName,
    description: row.description,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    clientVisible: row.clientVisible,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function recordPortalActivity(
  input: CreatePortalActivityInput,
): Promise<PortalActivityItem | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const db = getDb();

  const [row] = await db
    .insert(schema.portalActivityFeed)
    .values({
      clientId: input.clientId,
      projectId: input.projectId ?? null,
      actorType: input.actorType,
      actorName: input.actorName ?? null,
      actorId: input.actorId ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      entityName: input.entityName ?? null,
      description: input.description,
      metadata: input.metadata ?? {},
      clientVisible: input.clientVisible ?? true,
    })
    .returning();

  if (!row) {
    return null;
  }

  return mapDbToActivity(row);
}

export async function getClientActivityFeed(
  clientId: string,
  options: {
    limit?: number;
    offset?: number;
    projectId?: string | null;
    onlyVisible?: boolean;
  } = {},
): Promise<PortalActivityItem[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  const db = getDb();
  const conditions = [eq(schema.portalActivityFeed.clientId, clientId)];

  if (options.projectId !== undefined && options.projectId !== null) {
    conditions.push(eq(schema.portalActivityFeed.projectId, options.projectId));
  }

  if (options.onlyVisible !== false) {
    conditions.push(eq(schema.portalActivityFeed.clientVisible, true));
  }

  const rows = await db
    .select()
    .from(schema.portalActivityFeed)
    .where(and(...conditions))
    .orderBy(desc(schema.portalActivityFeed.createdAt))
    .limit(options.limit ?? 50)
    .offset(options.offset ?? 0);

  return rows.map(mapDbToActivity);
}

export async function getProjectActivityFeed(
  projectId: string,
  options: {
    limit?: number;
    offset?: number;
    onlyVisible?: boolean;
  } = {},
): Promise<PortalActivityItem[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  const db = getDb();
  const conditions = [eq(schema.portalActivityFeed.projectId, projectId)];

  if (options.onlyVisible !== false) {
    conditions.push(eq(schema.portalActivityFeed.clientVisible, true));
  }

  const rows = await db
    .select()
    .from(schema.portalActivityFeed)
    .where(and(...conditions))
    .orderBy(desc(schema.portalActivityFeed.createdAt))
    .limit(options.limit ?? 50)
    .offset(options.offset ?? 0);

  return rows.map(mapDbToActivity);
}

export type PortalVisibilityProfile = {
  showProgress: boolean;
  showMilestones: boolean;
  showDocuments: boolean;
  showInvoices: boolean;
  showLinks: boolean;
  showTeam: boolean;
  showTimeline: boolean;
  allowDocumentRequests: boolean;
  allowTicketCreation: boolean;
  showHealthScore: boolean;
};

export const defaultPortalVisibilityProfile: PortalVisibilityProfile = {
  showProgress: true,
  showMilestones: true,
  showDocuments: true,
  showInvoices: true,
  showLinks: true,
  showTeam: false,
  showTimeline: true,
  allowDocumentRequests: true,
  allowTicketCreation: true,
  showHealthScore: true,
};

export function readVisibilityProfileFromMetadata(
  metadata: Record<string, unknown> | null | undefined,
): PortalVisibilityProfile {
  if (!metadata || typeof metadata !== "object") {
    return defaultPortalVisibilityProfile;
  }

  const profile = metadata.portalVisibilityProfile as Record<string, unknown> | undefined;
  if (!profile || typeof profile !== "object") {
    return defaultPortalVisibilityProfile;
  }

  return {
    showProgress: profile.showProgress !== false,
    showMilestones: profile.showMilestones !== false,
    showDocuments: profile.showDocuments !== false,
    showInvoices: profile.showInvoices !== false,
    showLinks: profile.showLinks !== false,
    showTeam: profile.showTeam === true,
    showTimeline: profile.showTimeline !== false,
    allowDocumentRequests: profile.allowDocumentRequests !== false,
    allowTicketCreation: profile.allowTicketCreation !== false,
    showHealthScore: profile.showHealthScore !== false,
  };
}

export function writeVisibilityProfileToMetadata(
  metadata: Record<string, unknown>,
  profile: Partial<PortalVisibilityProfile>,
): Record<string, unknown> {
  return {
    ...metadata,
    portalVisibilityProfile: {
      ...readVisibilityProfileFromMetadata(metadata),
      ...profile,
    },
  };
}
