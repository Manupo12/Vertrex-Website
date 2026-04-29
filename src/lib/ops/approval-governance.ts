export type ApprovalStatus = "pending" | "approved" | "rejected";

export type ApprovalRecord = {
  status: ApprovalStatus;
  requestedBy: string | null;
  requestedAt: string | null;
  resolvedBy: string | null;
  resolvedAt: string | null;
  reason: string | null;
};

export function readApprovalFromMetadata(metadata: Record<string, unknown> | undefined): ApprovalRecord | null {
  if (!metadata || typeof metadata !== "object") {
    return null;
  }

  const approval = metadata.approval;
  if (!approval || typeof approval !== "object") {
    return null;
  }

  const status = (approval as Record<string, unknown>).status;
  if (typeof status !== "string" || !["pending", "approved", "rejected"].includes(status)) {
    return null;
  }

  return {
    status: status as ApprovalStatus,
    requestedBy: typeof (approval as Record<string, unknown>).requestedBy === "string" ? (approval as Record<string, unknown>).requestedBy as string : null,
    requestedAt: typeof (approval as Record<string, unknown>).requestedAt === "string" ? (approval as Record<string, unknown>).requestedAt as string : null,
    resolvedBy: typeof (approval as Record<string, unknown>).resolvedBy === "string" ? (approval as Record<string, unknown>).resolvedBy as string : null,
    resolvedAt: typeof (approval as Record<string, unknown>).resolvedAt === "string" ? (approval as Record<string, unknown>).resolvedAt as string : null,
    reason: typeof (approval as Record<string, unknown>).reason === "string" ? (approval as Record<string, unknown>).reason as string : null,
  };
}

export function writeApprovalToMetadata(
  metadata: Record<string, unknown>,
  approval: ApprovalRecord,
): Record<string, unknown> {
  return {
    ...metadata,
    approval: {
      status: approval.status,
      requestedBy: approval.requestedBy,
      requestedAt: approval.requestedAt,
      resolvedBy: approval.resolvedBy,
      resolvedAt: approval.resolvedAt,
      reason: approval.reason,
    },
  };
}

export function createPendingApproval(requestedBy: string, reason?: string | null): ApprovalRecord {
  return {
    status: "pending",
    requestedBy,
    requestedAt: new Date().toISOString(),
    resolvedBy: null,
    resolvedAt: null,
    reason: reason ?? null,
  };
}

export function resolveApproval(
  current: ApprovalRecord,
  status: "approved" | "rejected",
  resolvedBy: string,
  reason?: string | null,
): ApprovalRecord {
  return {
    ...current,
    status,
    resolvedBy,
    resolvedAt: new Date().toISOString(),
    reason: reason ?? current.reason ?? null,
  };
}
