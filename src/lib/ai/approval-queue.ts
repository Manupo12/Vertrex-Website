import { and, desc, eq, isNull, lte, sql } from "drizzle-orm";

import { getDb, isDatabaseConfigured, schema } from "@/lib/db";

export type AIActionType =
  | "create_task"
  | "update_task"
  | "delete_task"
  | "create_invoice"
  | "update_invoice"
  | "send_document"
  | "update_deal_stage"
  | "create_project"
  | "add_milestone"
  | "update_milestone"
  | "send_message"
  | "provision_portal"
  | "rotate_credential"
  | "execute_playbook"
  | "modify_budget";

export type AIApprovalStatus = "pending" | "approved" | "rejected" | "expired" | "cancelled";

export type AIApproval = {
  id: string;
  actionType: AIActionType;
  status: AIApprovalStatus;
  description: string;
  context: Record<string, unknown>;
  proposedChanges: Record<string, unknown>;
  requestedById: string | null;
  requestedByName: string | null;
  approvedById: string | null;
  approvedByName: string | null;
  approvedAt: string | null;
  rejectedById: string | null;
  rejectedByName: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  expiresAt: string | null;
  executedAt: string | null;
  executionResult: Record<string, unknown> | null;
  clientId: string | null;
  projectId: string | null;
  entityType: string | null;
  entityId: string | null;
  priority: string;
  riskLevel: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateAIApprovalInput = {
  actionType: AIActionType;
  description: string;
  context?: Record<string, unknown>;
  proposedChanges?: Record<string, unknown>;
  requestedById?: string | null;
  requestedByName?: string | null;
  expiresAt?: Date | null;
  clientId?: string | null;
  projectId?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  priority?: "low" | "normal" | "high" | "critical";
  riskLevel?: "low" | "medium" | "high" | "critical";
};

function mapDbToApproval(row: typeof schema.aiApprovals.$inferSelect): AIApproval {
  return {
    id: row.id,
    actionType: row.actionType as AIActionType,
    status: row.status as AIApprovalStatus,
    description: row.description,
    context: (row.context as Record<string, unknown>) ?? {},
    proposedChanges: (row.proposedChanges as Record<string, unknown>) ?? {},
    requestedById: row.requestedById,
    requestedByName: row.requestedByName,
    approvedById: row.approvedById,
    approvedByName: row.approvedByName,
    approvedAt: row.approvedAt?.toISOString() ?? null,
    rejectedById: row.rejectedById,
    rejectedByName: row.rejectedByName,
    rejectedAt: row.rejectedAt?.toISOString() ?? null,
    rejectionReason: row.rejectionReason,
    expiresAt: row.expiresAt?.toISOString() ?? null,
    executedAt: row.executedAt?.toISOString() ?? null,
    executionResult: (row.executionResult as Record<string, unknown>) ?? null,
    clientId: row.clientId,
    projectId: row.projectId,
    entityType: row.entityType,
    entityId: row.entityId,
    priority: row.priority,
    riskLevel: row.riskLevel,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function createAIApproval(input: CreateAIApprovalInput): Promise<AIApproval | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const db = getDb();

  const [row] = await db
    .insert(schema.aiApprovals)
    .values({
      actionType: input.actionType,
      description: input.description,
      context: input.context ?? {},
      proposedChanges: input.proposedChanges ?? {},
      requestedById: input.requestedById ?? null,
      requestedByName: input.requestedByName ?? null,
      expiresAt: input.expiresAt ?? null,
      clientId: input.clientId ?? null,
      projectId: input.projectId ?? null,
      entityType: input.entityType ?? null,
      entityId: input.entityId ?? null,
      priority: input.priority ?? "normal",
      riskLevel: input.riskLevel ?? "medium",
    })
    .returning();

  if (!row) {
    return null;
  }

  return mapDbToApproval(row);
}

export async function getPendingApprovals(
  limit = 50,
  offset = 0,
): Promise<AIApproval[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  const db = getDb();

  const rows = await db
    .select()
    .from(schema.aiApprovals)
    .where(eq(schema.aiApprovals.status, "pending"))
    .orderBy(desc(schema.aiApprovals.priority), desc(schema.aiApprovals.createdAt))
    .limit(limit)
    .offset(offset);

  return rows.map(mapDbToApproval);
}

export async function getApprovalsByEntity(
  entityType: string,
  entityId: string,
  status?: AIApprovalStatus,
): Promise<AIApproval[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  const db = getDb();

  const conditions = [
    eq(schema.aiApprovals.entityType, entityType),
    eq(schema.aiApprovals.entityId, entityId),
  ];

  if (status) {
    conditions.push(eq(schema.aiApprovals.status, status));
  }

  const rows = await db
    .select()
    .from(schema.aiApprovals)
    .where(and(...conditions))
    .orderBy(desc(schema.aiApprovals.createdAt));

  return rows.map(mapDbToApproval);
}

export async function approveAIApproval(
  approvalId: string,
  approverId: string,
  approverName?: string | null,
): Promise<AIApproval | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const db = getDb();

  const [row] = await db
    .update(schema.aiApprovals)
    .set({
      status: "approved",
      approvedById: approverId,
      approvedByName: approverName ?? null,
      approvedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(schema.aiApprovals.id, approvalId),
        eq(schema.aiApprovals.status, "pending"),
      ),
    )
    .returning();

  if (!row) {
    return null;
  }

  return mapDbToApproval(row);
}

export async function rejectAIApproval(
  approvalId: string,
  rejecterId: string,
  reason?: string | null,
  rejecterName?: string | null,
): Promise<AIApproval | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const db = getDb();

  const [row] = await db
    .update(schema.aiApprovals)
    .set({
      status: "rejected",
      rejectedById: rejecterId,
      rejectedByName: rejecterName ?? null,
      rejectedAt: new Date(),
      rejectionReason: reason ?? null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(schema.aiApprovals.id, approvalId),
        eq(schema.aiApprovals.status, "pending"),
      ),
    )
    .returning();

  if (!row) {
    return null;
  }

  return mapDbToApproval(row);
}

export async function markApprovalExecuted(
  approvalId: string,
  result?: Record<string, unknown>,
): Promise<AIApproval | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const db = getDb();

  const [row] = await db
    .update(schema.aiApprovals)
    .set({
      executedAt: new Date(),
      executionResult: result ?? {},
      updatedAt: new Date(),
    })
    .where(eq(schema.aiApprovals.id, approvalId))
    .returning();

  if (!row) {
    return null;
  }

  return mapDbToApproval(row);
}

export async function cancelAIApproval(
  approvalId: string,
): Promise<AIApproval | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const db = getDb();

  const [row] = await db
    .update(schema.aiApprovals)
    .set({
      status: "cancelled",
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(schema.aiApprovals.id, approvalId),
        eq(schema.aiApprovals.status, "pending"),
      ),
    )
    .returning();

  if (!row) {
    return null;
  }

  return mapDbToApproval(row);
}

export async function expireOverdueApprovals(): Promise<number> {
  if (!isDatabaseConfigured()) {
    return 0;
  }

  const db = getDb();
  const now = new Date();

  const result = await db
    .update(schema.aiApprovals)
    .set({
      status: "expired",
      updatedAt: now,
    })
    .where(
      and(
        eq(schema.aiApprovals.status, "pending"),
        isNull(schema.aiApprovals.expiresAt),
        lte(schema.aiApprovals.expiresAt, now),
      ),
    );

  return result.length ?? 0;
}

export async function countPendingApprovals(): Promise<number> {
  if (!isDatabaseConfigured()) {
    return 0;
  }

  const db = getDb();

  const rows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.aiApprovals)
    .where(eq(schema.aiApprovals.status, "pending"));

  return rows[0]?.count ?? 0;
}


export function requiresApproval(actionType: AIActionType): boolean {
  const highRiskActions: AIActionType[] = [
    "delete_task",
    "create_invoice",
    "modify_budget",
    "rotate_credential",
    "execute_playbook",
    "provision_portal",
    "send_document",
  ];

  return highRiskActions.includes(actionType);
}

export function getRiskLevel(actionType: AIActionType): "low" | "medium" | "high" | "critical" {
  const criticalActions: AIActionType[] = ["modify_budget", "rotate_credential"];
  const highActions: AIActionType[] = [
    "create_invoice",
    "execute_playbook",
    "provision_portal",
    "delete_task",
  ];

  if (criticalActions.includes(actionType)) return "critical";
  if (highActions.includes(actionType)) return "high";
  return "medium";
}
