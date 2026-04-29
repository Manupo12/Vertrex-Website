export const workspaceTaskStatusValues = ["todo", "in_progress", "review", "done", "blocked", "archived"] as const;
export type WorkspaceTaskStatusValue = (typeof workspaceTaskStatusValues)[number];

export const workspaceDocumentStatusValues = ["draft", "review", "approved", "published", "sent", "signed", "archived", "expired", "void"] as const;
export type WorkspaceDocumentStatusValue = (typeof workspaceDocumentStatusValues)[number];

export const workspaceInvoiceStatusValues = ["draft", "issued", "pending", "partially_paid", "paid", "overdue", "disputed", "cancelled", "canceled", "waived"] as const;
export type WorkspaceInvoiceStatusValue = (typeof workspaceInvoiceStatusValues)[number];
export type CanonicalWorkspaceInvoiceStatus = Exclude<WorkspaceInvoiceStatusValue, "canceled">;

export const taskBoardStatusValues = ["todo", "in_progress", "review", "blocked", "done"] as const;
export type TaskBoardStatus = (typeof taskBoardStatusValues)[number];

const taskStatusSet = new Set<string>(workspaceTaskStatusValues);
const documentStatusSet = new Set<string>(workspaceDocumentStatusValues);
const invoiceStatusSet = new Set<string>(workspaceInvoiceStatusValues);

export function normalizeTaskStatus(status: string | null | undefined): WorkspaceTaskStatusValue {
  const normalized = normalizeStatusValue(status);
  return taskStatusSet.has(normalized) ? (normalized as WorkspaceTaskStatusValue) : "todo";
}

export function mapTaskStatusToBoardStatus(status: string | null | undefined): TaskBoardStatus {
  const normalized = normalizeTaskStatus(status);

  if (normalized === "archived" || normalized === "done") {
    return "done";
  }

  if (normalized === "blocked") {
    return "blocked";
  }

  if (normalized === "review") {
    return "review";
  }

  if (normalized === "in_progress") {
    return "in_progress";
  }

  return "todo";
}

export function mapTaskStatusToPortalStatus(status: string | null | undefined): "done" | "active" | "pending" {
  if (isClosedTaskStatus(status)) {
    return "done";
  }

  const normalized = normalizeTaskStatus(status);
  return normalized === "in_progress" || normalized === "review" || normalized === "blocked" ? "active" : "pending";
}

export function isClosedTaskStatus(status: string | null | undefined) {
  const normalized = normalizeTaskStatus(status);
  return normalized === "done" || normalized === "archived";
}

export function isOpenTaskStatus(status: string | null | undefined) {
  return !isClosedTaskStatus(status);
}

export function isTaskExecutionStatus(status: string | null | undefined) {
  return normalizeTaskStatus(status) === "in_progress";
}

export function normalizeDocumentStatus(status: string | null | undefined): WorkspaceDocumentStatusValue {
  const normalized = normalizeStatusValue(status);
  return documentStatusSet.has(normalized) ? (normalized as WorkspaceDocumentStatusValue) : "draft";
}

export function isDocumentAwaitingApprovalStatus(status: string | null | undefined) {
  const normalized = normalizeDocumentStatus(status);
  return normalized === "draft" || normalized === "review";
}

export function isDocumentInTransitStatus(status: string | null | undefined) {
  const normalized = normalizeDocumentStatus(status);
  return normalized === "review" || normalized === "approved" || normalized === "published" || normalized === "sent";
}

export function isDocumentAttentionStatus(status: string | null | undefined) {
  const normalized = normalizeDocumentStatus(status);
  return normalized === "draft" || normalized === "review" || normalized === "sent" || normalized === "expired" || normalized === "void";
}

export function isPortalHighlightedDocumentStatus(status: string | null | undefined) {
  const normalized = normalizeDocumentStatus(status);
  return normalized === "review" || normalized === "published" || normalized === "sent";
}

export function normalizeInvoiceStatus(status: string | null | undefined): CanonicalWorkspaceInvoiceStatus {
  const normalized = normalizeStatusValue(status);

  if (normalized === "canceled") {
    return "cancelled";
  }

  if (invoiceStatusSet.has(normalized)) {
    return normalized as CanonicalWorkspaceInvoiceStatus;
  }

  return "pending";
}

export function isOutstandingInvoiceStatus(status: string | null | undefined) {
  const normalized = normalizeInvoiceStatus(status);
  return normalized === "issued" || normalized === "pending" || normalized === "partially_paid" || normalized === "overdue" || normalized === "disputed";
}

export function isInvoiceClosedStatus(status: string | null | undefined) {
  const normalized = normalizeInvoiceStatus(status);
  return normalized === "paid" || normalized === "cancelled" || normalized === "waived";
}

export function isOverdueInvoiceStatus(status: string | null | undefined) {
  return normalizeInvoiceStatus(status) === "overdue";
}

function normalizeStatusValue(status: string | null | undefined) {
  return typeof status === "string" ? status.trim().toLowerCase().replace(/[\s-]+/g, "_") : "";
}
