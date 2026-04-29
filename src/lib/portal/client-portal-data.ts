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

const portalClients: Record<string, PortalClient> = {
  budaphone: {
    id: "budaphone",
    brand: "BUDAPHONE",
    displayName: "Budaphone",
    statusLabel: "Proyecto Activo",
    welcomeTitle: "Bienvenido de nuevo.",
    welcomeDescription:
      "Resumen en tiempo real del desarrollo, entregables y soporte de tu plataforma ecommerce.",
    phase: "2. Desarrollo Core",
    progress: 65,
    completedTasks: 24,
    totalTasks: 38,
    totalInvestment: "$15,000",
    paid: "$7,500",
    pending: "$7,500",
    nextAction: "Necesitamos los accesos al dominio para configurar el servidor de producción.",
    nextActionContext: "Dominio + DNS",
    nextActionCta: "Subir credenciales",
    statusHighlights: [
      { label: "Sprint actual", value: "Checkout + catálogo" },
      { label: "Último update", value: "Hoy, 10:30 AM" },
      { label: "Responsable", value: "Equipo Vertrex Core" },
    ],
    projects: [
      {
        id: "budaphone-core",
        name: "Ecommerce Core",
        status: "active",
        progress: 68,
        openTasks: 4,
        documents: 3,
        lastUpdate: "Hoy, 10:30 AM",
        focusLabel: "Checkout + catálogo",
      },
      {
        id: "budaphone-growth",
        name: "Growth Automation",
        status: "planned",
        progress: 24,
        openTasks: 2,
        documents: 1,
        lastUpdate: "Ayer",
        focusLabel: "CRM + remarketing",
      },
    ],
    timeline: [
      { status: "done", title: "Diseño UI/UX aprobado", date: "Hace 1 semana" },
      { status: "active", title: "Integración pasarela de pagos", date: "En progreso" },
      { status: "pending", title: "Migración de inventario", date: "Próxima semana" },
      { status: "pending", title: "Pase a producción", date: "15 mayo 2026" },
    ],
    tasks: [
      { id: "portal-checkout", title: "Validar flujo de checkout", owner: "Vertrex Frontend", status: "active", dueLabel: "Hoy" },
      { id: "portal-assets", title: "Subir logos y piezas master", owner: "Budaphone", status: "pending", dueLabel: "Pendiente cliente" },
      { id: "portal-qa", title: "QA responsive del portal", owner: "Vertrex QA", status: "pending", dueLabel: "Mañana" },
      { id: "portal-signoff", title: "Aprobación final del alcance", owner: "Budaphone", status: "done", dueLabel: "Completado" },
    ],
    documents: [
      { id: "budaphone-contract", name: "Contrato_Servicios_Firmado.pdf", date: "01/04/2026", type: "Legal", overlay: "contract", overlayId: "budaphone-contract" },
      { id: "budaphone-sow", name: "SOW_Alcance_Proyecto.pdf", date: "01/04/2026", type: "Legal", overlay: "contract", overlayId: "budaphone-contract" },
      { id: "manual-usuario", name: "Manual_Usuario_v6.pdf", date: "Hace 3 días", type: "Assets", overlay: "asset", overlayId: "manual-usuario", highlight: true },
      { id: "payment-support", name: "Invoice_INV-042.pdf", date: "Ayer", type: "Factura", overlay: "ticket", overlayId: "payment-sync" },
    ],
    invoices: [
      { id: "inv-041", label: "Anticipo inicial", invoiceNumber: "INV-041", amount: "$7,500", dueDate: "Pagado · 01/04/2026", status: "paid", supportId: "payment-sync" },
      { id: "inv-042", label: "Saldo fase desarrollo", invoiceNumber: "INV-042", amount: "$7,500", dueDate: "Vence hoy", status: "pending", supportId: "payment-sync" },
      { id: "inv-043", label: "Horas extra catálogo", invoiceNumber: "INV-043", amount: "$1,200", dueDate: "Vencida hace 3 días", status: "overdue", supportId: "payment-sync" },
    ],
    credentials: [
      { id: "domain-access", title: "Acceso al dominio", scope: "DNS / Producción", status: "requested", updatedAt: "Pendiente" },
      { id: "meta-business", title: "Meta Business", scope: "Ads + Pixel", status: "shared", updatedAt: "Hace 2 días" },
      { id: "shopify-app", title: "App privada catálogo", scope: "Integración inventario", status: "updated", updatedAt: "Hoy" },
    ],
    files: [
      { id: "client-assets-zip", name: "Logos_Alta_Resolucion.zip", size: "240 MB", uploadedAt: "Hace 3 días", category: "Branding", source: "client" },
      { id: "app-icon", name: "app-icon-final.png", size: "450 KB", uploadedAt: "Hace 2 min", category: "UI", source: "vertrex" },
      { id: "workshop-viernes", name: "Workshop_Viernes.mp4", size: "1.2 GB", uploadedAt: "Hace 3 días", category: "Meetings", source: "vertrex" },
    ],
    tickets: [
      { id: "payment-sync", title: "Pago pendiente no actualizado", status: "in_progress", requestType: "soporte", requestTypeLabel: "Soporte", slaStatus: "on_track", slaLabel: "SLA en tiempo", slaWindowLabel: "Resolución 48h", updatedAt: "Hace 35 min", summary: "Se validó la invoice pero el portal no refresca el estado en la vista de facturación." },
      { id: "staging-access", title: "Acceso a staging temporal", status: "open", requestType: "acceso", requestTypeLabel: "Acceso", slaStatus: "at_risk", slaLabel: "SLA en riesgo", slaWindowLabel: "Acuse 24h", updatedAt: "Hoy, 09:10 AM", summary: "Solicitud para revisar el entorno previo al release con accesos acotados." },
      { id: "support-thread", title: "Consulta IA sobre progreso técnico", status: "resolved", requestType: "consulta", requestTypeLabel: "Consulta", slaStatus: "on_track", slaLabel: "SLA en tiempo", slaWindowLabel: "Resolución 24h", updatedAt: "Ayer", summary: "El asistente explicó fase actual, riesgos y próximos pasos para el lanzamiento." },
    ],
    messages: [
      {
        id: "budaphone-msg-1",
        sender: "Vertrex PM",
        role: "team",
        at: "Hoy, 08:30 AM",
        body: "Estado actual: 2. Desarrollo Core. Ya completamos 24 de 38 tareas y seguimos priorizando dominio + DNS para el pase a producción.",
      },
      {
        id: "budaphone-msg-2",
        sender: "Budaphone",
        role: "client",
        at: "Hoy, 09:00 AM",
        body: "Perfecto. Esta tarde subimos el acceso del dominio y revisamos la factura pendiente.",
      },
      {
        id: "budaphone-msg-3",
        sender: "Vertrex IA",
        role: "assistant",
        at: "Hoy, 09:05 AM",
        body: "Próximos hitos: Integración pasarela de pagos · Migración de inventario. Si quieres, también puedo resumirte pagos y entregables pendientes.",
      },
    ],
  },
  globalbank: {
    id: "globalbank",
    brand: "GLOBALBANK",
    displayName: "GlobalBank Corp",
    statusLabel: "Enterprise Rollout",
    welcomeTitle: "Panel ejecutivo del proyecto.",
    welcomeDescription:
      "Seguimiento centralizado del rollout enterprise, seguridad, legal y entregables ejecutivos.",
    phase: "3. Integración avanzada",
    progress: 78,
    completedTasks: 41,
    totalTasks: 52,
    totalInvestment: "$180,000",
    paid: "$120,000",
    pending: "$60,000",
    nextAction: "Se requiere aprobación legal de la última versión contractual antes de liberar staging.",
    nextActionContext: "Legal review",
    nextActionCta: "Revisar contrato",
    statusHighlights: [
      { label: "Steering committee", value: "Mañana, 11:00 AM" },
      { label: "Compliance", value: "Checklist 92%" },
      { label: "Ambiente", value: "Staging habilitado" },
    ],
    projects: [
      {
        id: "globalbank-rollout",
        name: "Executive Portal Rollout",
        status: "active",
        progress: 78,
        openTasks: 3,
        documents: 2,
        lastUpdate: "Hoy",
        focusLabel: "Legal + UAT",
      },
      {
        id: "globalbank-security",
        name: "Security & Compliance Track",
        status: "active",
        progress: 84,
        openTasks: 1,
        documents: 1,
        lastUpdate: "Hace 4 horas",
        focusLabel: "RBAC + compliance",
      },
      {
        id: "globalbank-adoption",
        name: "Stakeholder Adoption",
        status: "planned",
        progress: 36,
        openTasks: 2,
        documents: 1,
        lastUpdate: "Ayer",
        focusLabel: "Comité + handoff",
      },
    ],
    timeline: [
      { status: "done", title: "Kickoff ejecutivo", date: "Hace 2 semanas" },
      { status: "done", title: "Security review inicial", date: "Hace 1 semana" },
      { status: "active", title: "Ajustes legales MSA", date: "En revisión" },
      { status: "pending", title: "UAT con stakeholders", date: "Próxima semana" },
    ],
    tasks: [
      { id: "gb-uat", title: "Preparar guía de UAT", owner: "Vertrex PM", status: "active", dueLabel: "Hoy" },
      { id: "gb-legal", title: "Feedback cláusulas MSA", owner: "Legal GlobalBank", status: "pending", dueLabel: "Esperando cliente" },
      { id: "gb-rbac", title: "Validar RBAC ejecutivo", owner: "Seguridad", status: "pending", dueLabel: "Viernes" },
      { id: "gb-kickoff", title: "Kickoff técnico", owner: "Vertrex Ops", status: "done", dueLabel: "Completado" },
    ],
    documents: [
      { id: "globalbank-contract", name: "MSA_GlobalBank_v2.4.pdf", date: "Hoy", type: "Legal", overlay: "contract", overlayId: "globalbank-contract" },
      { id: "prd-draft", name: "Executive_Portal_PRD.pdf", date: "Ayer", type: "Entrega", overlay: "asset", overlayId: "prd-draft" },
    ],
    invoices: [
      { id: "gb-inv-001", label: "Fase discovery", invoiceNumber: "GB-001", amount: "$60,000", dueDate: "Pagado · 12/02/2026", status: "paid", supportId: "staging-access" },
      { id: "gb-inv-002", label: "Fase build", invoiceNumber: "GB-002", amount: "$60,000", dueDate: "Pagado · 12/03/2026", status: "paid", supportId: "staging-access" },
      { id: "gb-inv-003", label: "Fase rollout", invoiceNumber: "GB-003", amount: "$60,000", dueDate: "Vence en 5 días", status: "pending", supportId: "staging-access" },
    ],
    credentials: [
      { id: "sso-sandbox", title: "SSO Sandbox", scope: "Azure / SAML", status: "shared", updatedAt: "Hoy" },
      { id: "staging-vpn", title: "VPN temporal", scope: "Staging", status: "updated", updatedAt: "Hace 4 horas" },
    ],
    files: [
      { id: "prd-draft", name: "Executive_Portal_PRD.pdf", size: "800 KB", uploadedAt: "Ayer", category: "Documentación", source: "vertrex" },
      { id: "workshop-viernes", name: "Security_Workshop.mp4", size: "950 MB", uploadedAt: "Hace 5 días", category: "Meetings", source: "vertrex" },
    ],
    tickets: [
      { id: "staging-access", title: "Acceso temporal a staging", status: "open", requestType: "acceso", requestTypeLabel: "Acceso", slaStatus: "at_risk", slaLabel: "SLA en riesgo", slaWindowLabel: "Acuse 24h", updatedAt: "Hoy", summary: "Pendiente asignar credenciales expiran en 72 horas." },
      { id: "support-thread", title: "Minuta y resumen ejecutivo IA", status: "resolved", requestType: "consulta", requestTypeLabel: "Consulta", slaStatus: "on_track", slaLabel: "SLA en tiempo", slaWindowLabel: "Resolución 24h", updatedAt: "Ayer", summary: "La IA generó minuta del kickoff y próximos hitos para el comité." },
    ],
    messages: [
      {
        id: "globalbank-msg-1",
        sender: "Vertrex PM",
        role: "team",
        at: "Hoy, 07:40 AM",
        body: "Checklist de compliance al 92% y staging habilitado. Queda pendiente aprobación legal del MSA antes de abrir UAT.",
      },
      {
        id: "globalbank-msg-2",
        sender: "GlobalBank Corp",
        role: "client",
        at: "Hoy, 08:15 AM",
        body: "Entendido. Compartan la última versión contractual y la agenda del steering committee.",
      },
      {
        id: "globalbank-msg-3",
        sender: "Vertrex IA",
        role: "assistant",
        at: "Hoy, 08:20 AM",
        body: "Próximos hitos: Ajustes legales MSA · UAT con stakeholders. También puedo generar un resumen ejecutivo para comité si lo necesitas.",
      },
    ],
  },
};

export function listPortalClients(): PortalClient[] {
  return Object.values(portalClients);
}

export function resolvePortalClient(clientId: string): PortalClient {
  const normalizedId = clientId.toLowerCase();

  if (portalClients[normalizedId]) {
    return portalClients[normalizedId];
  }

  return {
    ...portalClients.budaphone,
    id: normalizedId,
    brand: normalizedId.replace(/-/g, " ").toUpperCase(),
    displayName: normalizedId.replace(/-/g, " "),
    welcomeDescription:
      "Vista base del portal del cliente con seguimiento, documentos, facturación y soporte centralizado.",
  };
}
