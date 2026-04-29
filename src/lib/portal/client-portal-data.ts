import type { WorkspaceRequestType, WorkspaceSlaStatus } from "@/lib/ops/request-governance";

export type PortalView =
  | "overview"
  | "progress"
  | "documents"
  | "billing"
  | "credentials"
  | "files"
  | "support"
  | "chat";

export type PortalTimelineItem = {
  status: "done" | "active" | "pending";
  title: string;
  date: string;
};

export type PortalChecklistStatus = "done" | "active" | "pending";

export type PortalChecklistItem = {
  id: string;
  title: string;
  description: string;
  status: PortalChecklistStatus;
  view?: PortalView;
  ctaLabel?: string;
};

export type PortalReentrySummary = {
  title: string;
  lastUpdateLabel: string;
  momentumLabel: string;
  attentionLabel: string;
  recommendedView: PortalView;
  recommendedLabel: string;
};

export type PortalProjectSummary = {
  id: string;
  name: string;
  status: string;
  progress: number;
  openTasks: number;
  documents: number;
  lastUpdate: string;
  focusLabel: string;
};

export type PortalTask = {
  id: string;
  title: string;
  owner: string;
  status: "done" | "active" | "pending";
  dueLabel: string;
};

export type PortalDocument = {
  id: string;
  name: string;
  date: string;
  type: "Legal" | "Assets" | "Factura" | "Entrega";
  highlight?: boolean;
  href?: string;
  overlay: "contract" | "asset" | "ticket";
  overlayId: string;
};

export type PortalInvoice = {
  id: string;
  label: string;
  invoiceNumber: string;
  amount: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  supportId: string;
};

export type PortalCredential = {
  id: string;
  title: string;
  scope: string;
  status: "requested" | "shared" | "updated";
  updatedAt: string;
};

export type PortalFile = {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  category: string;
  source: "client" | "vertrex";
  href?: string | null;
  provider?: string | null;
};

export type PortalTicket = {
  id: string;
  title: string;
  status: "open" | "in_progress" | "resolved";
  requestType: WorkspaceRequestType;
  requestTypeLabel: string;
  slaStatus: WorkspaceSlaStatus;
  slaLabel: string;
  slaWindowLabel: string;
  updatedAt: string;
  summary: string;
};

export type PortalMessage = {
  id: string;
  sender: string;
  role: "team" | "client" | "assistant";
  at: string;
  body: string;
};

export type PortalClient = {
  id: string;
  brand: string;
  displayName: string;
  statusLabel: string;
  welcomeTitle: string;
  welcomeDescription: string;
  phase: string;
  progress: number;
  completedTasks: number;
  totalTasks: number;
  totalInvestment: string;
  paid: string;
  pending: string;
  nextAction: string;
  nextActionContext: string;
  nextActionCta: string;
  statusHighlights: Array<{ label: string; value: string }>;
  onboardingChecklist?: PortalChecklistItem[];
  reentrySummary?: PortalReentrySummary;
  projects?: PortalProjectSummary[];
  timeline: PortalTimelineItem[];
  tasks: PortalTask[];
  documents: PortalDocument[];
  invoices: PortalInvoice[];
  credentials: PortalCredential[];
  files: PortalFile[];
  tickets: PortalTicket[];
  messages: PortalMessage[];
};

export function listPortalClients(): PortalClient[] {
  return [];
}

export function resolvePortalClient(clientId: string): PortalClient {
  const normalizedId = clientId.toLowerCase();
  const displayName = normalizedId.replace(/-/g, " ");

  return {
    id: normalizedId,
    brand: normalizedId.replace(/-/g, " ").toUpperCase(),
    displayName,
    statusLabel: "Portal Activo",
    welcomeTitle: `Bienvenido, ${displayName}.`,
    welcomeDescription:
      "Vista base del portal del cliente con seguimiento, documentos, facturación y soporte centralizado.",
    phase: "1. Inicio",
    progress: 0,
    completedTasks: 0,
    totalTasks: 0,
    totalInvestment: "$0",
    paid: "$0",
    pending: "$0",
    nextAction: "Contactar al equipo Vertrex para configurar el proyecto.",
    nextActionContext: "Setup inicial",
    nextActionCta: "Contactar soporte",
    statusHighlights: [],
    timeline: [],
    tasks: [],
    documents: [],
    invoices: [],
    credentials: [],
    files: [],
    tickets: [],
    messages: [],
  };
}
