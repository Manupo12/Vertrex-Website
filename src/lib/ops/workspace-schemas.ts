import { z } from "zod";
import { canonicalDealStageValues } from "@/lib/ops/deal-stages";
import { workspaceRequestTypeValues } from "@/lib/ops/request-governance";
import { workspaceInvoiceStatusValues, workspaceTaskStatusValues } from "@/lib/ops/status-catalog";

const optionalUuid = z.string().uuid().optional().nullable();
const optionalDate = z.string().datetime().optional().nullable();
const optionalString = z.string().trim().optional().nullable();
const optionalEmail = z.string().email().optional().nullable();
const optionalBoolean = z.boolean().optional().nullable();
const optionalPercent = z.number().int().min(0).max(100).optional().nullable();
const optionalAmount = z.number().int().min(0).optional().nullable();
const automationPlaybookStatus = z.enum(["draft", "active", "paused"]);
const automationRunStatus = z.enum(["queued", "running", "completed", "needs_review", "failed"]);

export const workspaceClientSchema = z.object({
  name: z.string().min(1),
  slug: optionalString,
  brand: optionalString,
  email: optionalEmail,
  phone: optionalString,
  company: optionalString,
  phase: optionalString,
  progress: optionalPercent,
  totalInvestmentCents: optionalAmount,
  paidCents: optionalAmount,
  pendingCents: optionalAmount,
  nextAction: optionalString,
  nextActionContext: optionalString,
  nextActionCta: optionalString,
  provisionPortalAccess: optionalBoolean,
  portalUserName: optionalString,
  portalUserEmail: optionalEmail,
  portalUserPassword: optionalString,
  createInitialProject: optionalBoolean,
  initialProjectName: optionalString,
  initialProjectDescription: optionalString,
  initialProjectStatus: optionalString,
  initialProjectTrack: optionalString,
  initialProjectProgress: optionalPercent,
  initialProjectStartDate: optionalDate,
  initialProjectEndDate: optionalDate,
});

export const workspaceProjectSchema = z.object({
  clientId: optionalUuid,
  clientSlug: optionalString,
  clientName: optionalString,
  clientBrand: optionalString,
  clientEmail: optionalEmail,
  clientCompany: optionalString,
  clientTotalInvestmentCents: optionalAmount,
  clientPaidCents: optionalAmount,
  clientPendingCents: optionalAmount,
  createClient: optionalBoolean,
  provisionPortalAccess: optionalBoolean,
  portalUserName: optionalString,
  portalUserEmail: optionalEmail,
  portalUserPassword: optionalString,
  name: z.string().min(1),
  description: optionalString,
  status: optionalString,
  progress: optionalPercent,
  startDate: optionalDate,
  endDate: optionalDate,
  track: optionalString,
});

export const workspaceTaskSchema = z.object({
  clientId: optionalUuid,
  clientSlug: optionalString,
  projectId: optionalUuid,
  title: z.string().min(1),
  owner: optionalString,
  status: z.enum(workspaceTaskStatusValues).optional(),
  dueLabel: optionalString,
});

export const workspaceMilestoneSchema = z.object({
  clientId: optionalUuid,
  clientSlug: optionalString,
  projectId: z.string().uuid(),
  title: z.string().min(1),
  description: optionalString,
  status: z.enum(["pending", "in_progress", "under_review", "approved", "completed", "blocked", "skipped"]).optional(),
  targetDate: optionalDate,
  clientVisible: optionalBoolean,
  weight: z.number().int().min(1).optional().nullable(),
  orderIndex: z.number().int().min(0).optional().nullable(),
});

export const workspaceDealSchema = z.object({
  clientId: optionalUuid,
  clientSlug: optionalString,
  projectId: optionalUuid,
  title: z.string().min(1),
  stage: z.enum(canonicalDealStageValues).optional().nullable(),
  billingModel: optionalString,
  valueCents: optionalAmount,
  probability: optionalPercent,
  owner: optionalString,
  summary: optionalString,
  lastContactAt: optionalDate,
  expectedCloseAt: optionalDate,
});

export const workspaceEventSchema = z.object({
  clientId: optionalUuid,
  clientSlug: optionalString,
  projectId: optionalUuid,
  title: z.string().min(1),
  description: optionalString,
  kind: optionalString,
  location: optionalString,
  meetUrl: optionalString,
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  attendees: z.array(z.string().min(1)).optional().nullable(),
});

export const workspaceTransactionSchema = z.object({
  clientId: optionalUuid,
  clientSlug: optionalString,
  projectId: optionalUuid,
  type: z.enum(["income", "expense"]),
  amountCents: z.number().int().min(0),
  category: optionalString,
  description: optionalString,
  occurredAt: optionalDate,
});

export const workspaceInvoiceSchema = z.object({
  clientId: optionalUuid,
  clientSlug: optionalString,
  projectId: optionalUuid,
  documentId: optionalUuid,
  label: z.string().min(1),
  invoiceNumber: optionalString,
  amountCents: z.number().int().min(0),
  dueDate: optionalDate,
  dueLabel: optionalString,
  status: z.enum(workspaceInvoiceStatusValues).optional(),
});

export const workspaceCredentialSchema = z.object({
  clientId: optionalUuid,
  clientSlug: optionalString,
  projectId: optionalUuid,
  title: z.string().min(1),
  scope: optionalString,
  status: z.enum(["requested", "shared", "updated"]).optional(),
  secret: optionalString,
  linkUrl: optionalString,
});

export const workspaceTicketSchema = z.object({
  clientId: optionalUuid,
  clientSlug: optionalString,
  title: z.string().min(1),
  summary: optionalString,
  status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
  requestType: z.enum(workspaceRequestTypeValues).optional(),
  priority: optionalString,
  assignedTo: optionalString,
  channel: optionalString,
  projectId: optionalUuid,
});

export const workspaceMessageSchema = z.object({
  clientId: z.string().uuid(),
  userId: optionalUuid,
  senderRole: z.enum(["team", "client", "assistant"]),
  senderName: z.string().min(1),
  channel: optionalString,
  message: z.string().min(1),
  autoReply: z.boolean().optional(),
});

export const workspaceAutomationPlaybookSchema = z.object({
  clientId: optionalUuid,
  clientSlug: optionalString,
  projectId: optionalUuid,
  title: z.string().min(1),
  trigger: z.string().min(1),
  action: z.string().min(1),
  result: optionalString,
  summary: optionalString,
  status: automationPlaybookStatus.optional(),
});

export const workspaceAutomationRunSchema = z.object({
  playbookId: optionalUuid,
  clientId: optionalUuid,
  clientSlug: optionalString,
  projectId: optionalUuid,
  title: optionalString,
  status: automationRunStatus.optional(),
  triggerSource: optionalString,
  summary: optionalString,
});

export const workspaceLinkKindValues = ["url", "social_profile", "github_repo", "tiktok_account", "streaming_community", "dashboard", "saas", "document_reference", "other"] as const;

export const workspaceLinkSchema = z.object({
  clientId: optionalUuid,
  clientSlug: optionalString,
  projectId: optionalUuid,
  title: z.string().min(1),
  url: z.string().url(),
  kind: z.enum(workspaceLinkKindValues).optional().nullable(),
  description: optionalString,
  imageUrl: z.string().url().optional().nullable(),
  domain: optionalString,
});

export const workspaceAdminCommandSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("client"), payload: workspaceClientSchema }),
  z.object({ kind: z.literal("project"), payload: workspaceProjectSchema }),
  z.object({ kind: z.literal("task"), payload: workspaceTaskSchema }),
  z.object({ kind: z.literal("milestone"), payload: workspaceMilestoneSchema }),
  z.object({ kind: z.literal("deal"), payload: workspaceDealSchema }),
  z.object({ kind: z.literal("event"), payload: workspaceEventSchema }),
  z.object({ kind: z.literal("transaction"), payload: workspaceTransactionSchema }),
  z.object({ kind: z.literal("invoice"), payload: workspaceInvoiceSchema }),
  z.object({ kind: z.literal("credential"), payload: workspaceCredentialSchema }),
  z.object({ kind: z.literal("link"), payload: workspaceLinkSchema }),
  z.object({ kind: z.literal("ticket"), payload: workspaceTicketSchema }),
  z.object({ kind: z.literal("message"), payload: workspaceMessageSchema }),
  z.object({ kind: z.literal("automationPlaybook"), payload: workspaceAutomationPlaybookSchema }),
  z.object({ kind: z.literal("automationRun"), payload: workspaceAutomationRunSchema }),
]);
