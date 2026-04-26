"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  Bot,
  Building2,
  CalendarDays,
  CheckCircle2,
  CheckSquare,
  Clock,
  Copy,
  CreditCard,
  Database,
  Download,
  Eye,
  FileSignature,
  FileText,
  FolderKanban,
  Globe,
  Image as ImageIcon,
  Key,
  LifeBuoy,
  Lock,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  UploadCloud,
  User,
  Video,
  Wallet,
  X,
  Zap,
} from "lucide-react";

import {
  useUIStore,
  type UIActionPayload,
  type UIOverlayKey,
} from "@/lib/store/ui";
import {
  documentTemplates,
  getDocumentGeneratorHref,
} from "@/lib/docs/template-catalog";

type OverlayActionHandler = (key: UIOverlayKey, payload?: UIActionPayload) => void;

const templateOptions = documentTemplates;

function getTaskRecord(id: string | null) {
  if (id === "thread-task") {
    return {
      code: "OPS-221",
      title: "Convertir hilo de soporte en plan de acción",
      status: "En revisión",
      assignee: "IA COO",
      priority: "Alta",
      dueDate: "Hoy, 6:00 PM",
      description:
        "Organizar el hilo del cliente en una tarea operativa con checklist, responsables y respuesta propuesta.",
      relations: ["Thread #soporte-budaphone", "Ticket TCK-204", "Portal /support"],
      activity: [
        "IA generó el resumen inicial del hilo.",
        "Soporte adjuntó capturas y contexto adicional.",
        "Pendiente aprobación antes de responder al cliente.",
      ],
    };
  }

  return {
    code: id?.toUpperCase() ?? "NEX-140",
    title: "Implementar Omni-Switcher en el shell operativo",
    status: "En progreso",
    assignee: "Juan M.",
    priority: "Urgente",
    dueDate: "Mañana, 10:00 AM",
    description:
      "Conectar el shell del OS con estado global, cambios de contexto y acciones rápidas sin recargar la vista actual.",
    relations: ["PRD Frontend v3", "Calendar / EventDetail", "Docs / Generator"],
    activity: [
      "Diseño aprobado por producto.",
      "Falta abrir detalles y modales desde el store global.",
      "Se necesita QA en desktop y tablet.",
    ],
  };
}

function getClientRecord(id: string | null) {
  if (id === "budaphone") {
    return {
      name: "Budaphone",
      segment: "Retail & ecommerce",
      health: "84/100",
      owner: "Carlos M.",
      email: "distribuidorabudaphone@gmail.com",
      phone: "314 461 8379",
      projects: ["Budaphone ecommerce", "Portal cliente", "Assets onboarding"],
      summary:
        "Cliente activo con alto nivel de colaboración. Tiene pagos al día y solicitudes frecuentes sobre avance y entregables.",
    };
  }

  return {
    name: "GlobalBank Corp",
    segment: "Enterprise / Fintech",
    health: "92/100",
    owner: "Sarah R.",
    email: "elena@globalbank.com",
    phone: "+1 212 555 0140",
    projects: ["Core bancario v2", "Security audit", "Executive portal"],
    summary:
      "Cuenta enterprise con múltiples stakeholders y pipeline de expansión. Riesgo bajo, pero requiere seguimiento ejecutivo constante.",
  };
}

function getDealRecord(id: string | null) {
  if (id === "acme-renewal") {
    return {
      title: "Renovación + Upsell plataforma",
      company: "Acme Corp",
      stage: "Propuesta enviada",
      value: "$5,000 MRR",
      probability: "85%",
      nextStep: "Enviar propuesta final anualizada",
      notes:
        "La oportunidad viene acompañada de expansión a dos módulos adicionales. El cliente respondió positivamente al paquete ARR.",
    };
  }

  return {
    title: "Vertrex OS Enterprise",
    company: "GlobalBank Corp",
    stage: "Negociación",
    value: "$180,000 ARR",
    probability: "65%",
    nextStep: "Revisión legal del MSA",
    notes:
      "El trato está listo para cierre técnico. Se recomienda follow-up ejecutivo y envío de versión contractual actualizada.",
  };
}

function getEventRecord(id: string | null) {
  if (id === "nexus-review") {
    return {
      title: "Sprint review · Proyecto Nexus",
      description: "Revisión de sprint con backlog, riesgos y próximos entregables.",
      time: "Mañana · 9:00 AM - 9:45 AM",
      duration: "45 min",
      client: "Proyecto Nexus",
      project: "Migración DB / Omni-Switcher",
      attendees: ["Juan M.", "Sarah R.", "IA COO"],
    };
  }

  return {
    title: "Presentación propuesta GlobalBank",
    description: "Sesión comercial con brief técnico, costos y plan de implementación.",
    time: "Hoy · 11:00 AM - 12:30 PM",
    duration: "90 min",
    client: "GlobalBank Corp",
    project: "Vertrex OS Enterprise",
    attendees: ["Juan M.", "Sarah R.", "Carlos L."],
  };
}

function getAssetRecord(id: string | null) {
  if (id === "manual-usuario") {
    return {
      name: "Manual_Usuario_v6.pdf",
      type: "PDF",
      size: "12.4 MB",
      uploadedAt: "Ayer",
      uploadedBy: "Sarah R.",
      preview: "Documento técnico",
      tags: ["Legacy", "User Guide", "Portal"],
      relations: ["Docs / Shared", "Client / Budaphone", "Legal repository"],
    };
  }

  return {
    name: "app-icon-final.png",
    type: "Imagen",
    size: "450 KB",
    uploadedAt: "Hace 2 min",
    uploadedBy: "Juan M.",
    preview: "Preview de recurso visual",
    tags: ["UI", "Brand", "App"],
    relations: ["Proyecto Nexus", "Assets / Branding", "Portal / files"],
  };
}

function getVaultRecord(id: string | null) {
  if (id === "figma-account") {
    return {
      title: "Figma Enterprise",
      type: "credential",
      content: [
        "Usuario: design@vertrex.com",
        "Contraseña: •••••••••••••",
        "URL: https://figma.com",
      ],
      audit: ["Vista por Sarah R. hace 2 horas", "Última rotación: hace 15 días"],
    };
  }

  if (id === "twitter-totp") {
    return {
      title: "X Corporativo",
      type: "totp",
      content: ["Código actual: 845 102", "Expira en 23s", "QR disponible para re-enrolamiento"],
      audit: ["Usado por Marketing hace 35 min", "2FA activo desde enero"],
    };
  }

  return {
    title: "Proyecto Nexus · Production .env",
    type: "env",
    content: [
      "DATABASE_URL=neon://...",
      "BLOB_READ_WRITE_TOKEN=...",
      "OPENAI_API_KEY=...",
    ],
    audit: ["Último acceso por Juan M.", "Rotación sugerida por IA en 7 días"],
  };
}

function getThreadRecord(id: string | null) {
  if (id === "support-thread") {
    return {
      title: "Hilo de soporte · Budaphone",
      channel: "Portal / support",
      messages: [
        "Cliente: el pago pendiente no refleja el estado correcto en el portal.",
        "Soporte: estamos validando la sincronización entre invoice y transacciones.",
        "IA COO: propongo crear tarea para revisión del flujo de pagos.",
      ],
    };
  }

  return {
    title: "Hilo #dev-nexus",
    channel: "Chat / menciones",
    messages: [
      "Sarah: ¿puedes revisar el PR de navegación interna?",
      "Carlos: ya conecté el shell al store global.",
      "IA COO: la tarea puede derivarse al board con contexto automático.",
    ],
  };
}

function getContractRecord(id: string | null) {
  if (id === "budaphone-contract") {
    return {
      title: "SOW · Budaphone ecommerce",
      status: "Vence pronto",
      signatories: ["Budaphone", "Vertrex"],
      milestones: ["Versión 1.8 enviada", "Firma pendiente", "Compartido con portal"],
      preview: "Documento contractual con alcance, pagos y cronograma operativo.",
    };
  }

  return {
    title: "Contrato marco · GlobalBank",
    status: "Vigente",
    signatories: ["GlobalBank Corp", "Vertrex"],
    milestones: ["v2.4 aprobada", "PDF final disponible", "Renovación en 2027"],
    preview: "Documento base de prestación de servicios enterprise y anexos operativos.",
  };
}

function getTicketRecord(id: string | null) {
  if (id === "payment-sync") {
    return {
      title: "Pago pendiente no actualizado",
      status: "In progress",
      priority: "Alta",
      client: "Budaphone",
      project: "Portal cliente",
      activity: [
        "Cliente reportó inconsistencia de pagos.",
        "Finanzas validó invoice #INV-042.",
        "Pendiente parche del frontend para refresco de estado.",
      ],
    };
  }

  return {
    title: "Acceso al entorno de staging",
    status: "Open",
    priority: "Media",
    client: "GlobalBank Corp",
    project: "Executive portal",
    activity: [
      "Ticket creado por cliente vía portal.",
      "Asignado a operaciones.",
      "Esperando respuesta con credenciales temporales.",
    ],
  };
}

export default function OSOverlayManager() {
  const router = useRouter();
  const ui = useUIStore((store) => store);

  return (
    <>
      <CommandCenterDialog
        open={ui.commandCenter}
        onOpenChange={(open) => {
          if (!open) {
            ui.close("commandCenter");
          }
        }}
        onAction={(key, payload) => {
          ui.close("commandCenter");
          ui.open(key, payload);
        }}
      />
      <OmniCreatorDialog
        open={ui.omniCreator}
        onOpenChange={(open) => {
          if (!open) {
            ui.close("omniCreator");
          }
        }}
        onAction={(key, payload) => {
          ui.close("omniCreator");
          ui.open(key, payload);
        }}
      />
      <UniversalInboxDialog
        open={ui.universalInbox}
        onOpenChange={(open) => {
          if (!open) {
            ui.close("universalInbox");
          }
        }}
        onOpenTicket={(id) => {
          ui.close("universalInbox");
          ui.open("ticketDetail", id);
        }}
        onOpenThread={(id) => {
          ui.close("universalInbox");
          ui.open("threadDetail", id);
        }}
      />
      <TaskDetailSheet
        open={ui.taskDetail.open}
        id={ui.taskDetail.id}
        onOpenChange={(open) => {
          if (!open) {
            ui.close("taskDetail");
          }
        }}
      />
      <ClientDetailSheet
        open={ui.clientDetail.open}
        id={ui.clientDetail.id}
        onOpenChange={(open) => {
          if (!open) {
            ui.close("clientDetail");
          }
        }}
      />
      <DealDetailSheet
        open={ui.dealDetail.open}
        id={ui.dealDetail.id}
        onOpenChange={(open) => {
          if (!open) {
            ui.close("dealDetail");
          }
        }}
      />
      <EventDetailSheet
        open={ui.eventDetail.open}
        id={ui.eventDetail.id}
        onOpenChange={(open) => {
          if (!open) {
            ui.close("eventDetail");
          }
        }}
        onEdit={() => {
          ui.close("eventDetail");
          ui.open("createEvent");
        }}
      />
      <AssetDetailSheet
        open={ui.assetDetail.open}
        id={ui.assetDetail.id}
        onOpenChange={(open) => {
          if (!open) {
            ui.close("assetDetail");
          }
        }}
      />
      <VaultEntrySheet
        open={ui.vaultEntry.open}
        id={ui.vaultEntry.id}
        onOpenChange={(open) => {
          if (!open) {
            ui.close("vaultEntry");
          }
        }}
        onEdit={() => {
          ui.close("vaultEntry");
          ui.open("connectCredential");
        }}
      />
      <ThreadDetailSheet
        open={ui.threadDetail.open}
        id={ui.threadDetail.id}
        onOpenChange={(open) => {
          if (!open) {
            ui.close("threadDetail");
          }
        }}
        onConvert={() => {
          ui.close("threadDetail");
          ui.open("taskDetail", "thread-task");
        }}
      />
      <ContractDetailSheet
        open={ui.contractDetail.open}
        id={ui.contractDetail.id}
        onOpenChange={(open) => {
          if (!open) {
            ui.close("contractDetail");
          }
        }}
        onNewVersion={() => {
          ui.open("templateSelector");
        }}
      />
      <TicketDetailSheet
        open={ui.ticketDetail.open}
        id={ui.ticketDetail.id}
        onOpenChange={(open) => {
          if (!open) {
            ui.close("ticketDetail");
          }
        }}
      />
      <UploadFileDialog
        open={ui.uploadFile.open}
        context={ui.uploadFile.context}
        onOpenChange={(open) => {
          if (!open) {
            ui.close("uploadFile");
          }
        }}
      />
      <ImportDocumentDialog
        open={ui.importDocument}
        onOpenChange={(open) => {
          if (!open) {
            ui.close("importDocument");
          }
        }}
      />
      <RegisterTransactionDialog
        open={ui.registerTransaction.open}
        transactionType={ui.registerTransaction.type}
        onOpenChange={(open) => {
          if (!open) {
            ui.close("registerTransaction");
          }
        }}
      />
      <ConnectCredentialDialog
        open={ui.connectCredential}
        onOpenChange={(open) => {
          if (!open) {
            ui.close("connectCredential");
          }
        }}
      />
      <CreateDealDialog
        open={ui.createDeal}
        onOpenChange={(open) => {
          if (!open) {
            ui.close("createDeal");
          }
        }}
      />
      <CreateEventDialog
        open={ui.createEvent}
        onOpenChange={(open) => {
          if (!open) {
            ui.close("createEvent");
          }
        }}
      />
      <CreateTicketDialog
        open={ui.createTicket}
        onOpenChange={(open) => {
          if (!open) {
            ui.close("createTicket");
          }
        }}
      />
      <CreateAutomationDialog
        open={ui.createAutomation}
        onOpenChange={(open) => {
          if (!open) {
            ui.close("createAutomation");
          }
        }}
      />
      <TemplateSelectorDialog
        open={ui.templateSelector.open}
        onOpenChange={(open) => {
          if (!open) {
            ui.close("templateSelector");
          }
        }}
        onSelect={(id) => {
          if (ui.templateSelector.onSelect) {
            ui.templateSelector.onSelect(id);
          } else {
            router.push(getDocumentGeneratorHref({ templateId: id, source: "overlay" }));
          }
          ui.close("templateSelector");
        }}
      />
    </>
  );
}

type DialogFrameProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidthClassName?: string;
};

function DialogFrame({
  open,
  onOpenChange,
  title,
  subtitle,
  children,
  footer,
  maxWidthClassName = "max-w-3xl",
}: DialogFrameProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[140] flex items-start justify-center p-4 pt-[10vh]">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={`relative z-[141] flex w-full ${maxWidthClassName} flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-border/60 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            {subtitle ? (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            className="rounded-lg border border-border bg-secondary/50 p-2 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[65vh] overflow-y-auto px-6 py-5">{children}</div>
        {footer ? (
          <div className="border-t border-border/60 bg-background/60 px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

type SheetFrameProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

function SheetFrame({
  open,
  onOpenChange,
  title,
  subtitle,
  children,
  footer,
}: SheetFrameProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[140]">
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div
        className="absolute inset-y-0 right-0 z-[141] flex w-full max-w-2xl flex-col border-l border-border bg-card shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-border/60 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            {subtitle ? (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            className="rounded-lg border border-border bg-secondary/50 p-2 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
        {footer ? (
          <div className="border-t border-border/60 bg-background/60 px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: typeof FileText; title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      <span>{title}</span>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/20 px-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function TagChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground">
      <Tag className="h-3 w-3" />
      {label}
    </span>
  );
}

function ActivityList({ items }: { items: string[] }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item}
          className="rounded-xl border border-border/60 bg-background px-4 py-3 text-sm text-muted-foreground"
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function TextInput({ label, placeholder, defaultValue }: { label: string; placeholder?: string; defaultValue?: string }) {
  return (
    <label className="flex flex-col gap-2 text-sm text-muted-foreground">
      <span>{label}</span>
      <input
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
      />
    </label>
  );
}

function TextArea({ label, placeholder, defaultValue }: { label: string; placeholder?: string; defaultValue?: string }) {
  return (
    <label className="flex flex-col gap-2 text-sm text-muted-foreground">
      <span>{label}</span>
      <textarea
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={4}
        className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
      />
    </label>
  );
}

function PrimaryButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-secondary"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function CommandCenterDialog({
  open,
  onOpenChange,
  onAction,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: OverlayActionHandler;
}) {
  return (
    <DialogFrame
      open={open}
      onOpenChange={onOpenChange}
      title="Command Center"
      subtitle="Busca vistas, abre overlays globales y dispara acciones rápidas del OS."
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">Atajos: Ctrl/Cmd + K, N, I · Esc</span>
          <div className="flex items-center gap-2">
            <SecondaryButton>Ir a Proyectos</SecondaryButton>
            <PrimaryButton>
              <Sparkles className="h-4 w-4" />
              Preguntar a la IA
            </PrimaryButton>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            placeholder="Busca entidades, comandos o módulos..."
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <ActionCard
            icon={FolderKanban}
            title="Nuevo trato"
            description="Abre el modal de entrada rápida para CRM."
            onClick={() => onAction("createDeal")}
          />
          <ActionCard
            icon={CalendarDays}
            title="Nuevo evento"
            description="Agenda reunión, bloqueo de trabajo o follow-up."
            onClick={() => onAction("createEvent")}
          />
          <ActionCard
            icon={Wallet}
            title="Registrar ingreso"
            description="Lanza el modal de finanzas con el tipo preseleccionado."
            onClick={() => onAction("registerTransaction", { type: "income" })}
          />
          <ActionCard
            icon={UploadCloud}
            title="Subir archivo"
            description="Sube activos para Docs, Assets o Portal."
            onClick={() => onAction("uploadFile", { context: "Assets" })}
          />
          <ActionCard
            icon={FileText}
            title="Selector de plantillas"
            description="Abre la galería de plantillas HTML disponibles."
            onClick={() => onAction("templateSelector")}
          />
          <ActionCard
            icon={LifeBuoy}
            title="Nuevo ticket"
            description="Crea soporte desde OS o Portal."
            onClick={() => onAction("createTicket")}
          />
        </div>
      </div>
    </DialogFrame>
  );
}

function OmniCreatorDialog({
  open,
  onOpenChange,
  onAction,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: OverlayActionHandler;
}) {
  return (
    <DialogFrame
      open={open}
      onOpenChange={onOpenChange}
      title="Omni Creator"
      subtitle="Entrada rápida para entidades y acciones frecuentes."
      footer={
        <div className="flex justify-end gap-2">
          <SecondaryButton>Cancelar</SecondaryButton>
          <PrimaryButton>
            <Zap className="h-4 w-4" />
            Guardar borrador
          </PrimaryButton>
        </div>
      }
      maxWidthClassName="max-w-2xl"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <ActionCard
          icon={CheckSquare}
          title="Crear tarea"
          description="Abre la vista de detalle de tarea para completar contexto y seguimiento."
          onClick={() => onAction("taskDetail", { context: null })}
        />
        <ActionCard
          icon={Building2}
          title="Nuevo trato CRM"
          description="Inicia deal, cliente, valor y stage inicial."
          onClick={() => onAction("createDeal")}
        />
        <ActionCard
          icon={CalendarDays}
          title="Crear evento"
          description="Agenda reunión con cliente o evento interno."
          onClick={() => onAction("createEvent")}
        />
        <ActionCard
          icon={UploadCloud}
          title="Subir archivos"
          description="Carga recursos, documentos o material del cliente."
          onClick={() => onAction("uploadFile", { context: "Portal" })}
        />
      </div>
    </DialogFrame>
  );
}

function UniversalInboxDialog({
  open,
  onOpenChange,
  onOpenTicket,
  onOpenThread,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenTicket: (id: string) => void;
  onOpenThread: (id: string) => void;
}) {
  return (
    <DialogFrame
      open={open}
      onOpenChange={onOpenChange}
      title="Inbox universal"
      subtitle="Unifica menciones, alertas IA y tickets del portal."
      maxWidthClassName="max-w-4xl"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <InboxCard
          icon={MessageSquare}
          title="Mención en #dev-nexus"
          description="Sarah pidió revisar la navegación del shell y los shortcuts."
          actionLabel="Abrir hilo"
          onClick={() => onOpenThread("dev-thread")}
        />
        <InboxCard
          icon={Bell}
          title="Ticket portal · Budaphone"
          description="Pago pendiente no actualizado después de una transacción validada."
          actionLabel="Ver ticket"
          onClick={() => onOpenTicket("payment-sync")}
        />
        <InboxCard
          icon={Bot}
          title="IA CFO sugiere recordatorio"
          description="La invoice #INV-042 vence hoy y aún no se envió aviso al cliente."
          actionLabel="Ver soporte"
          onClick={() => onOpenTicket("payment-sync")}
        />
        <InboxCard
          icon={Sparkles}
          title="Resumen listo"
          description="La IA preparó minuta y tareas del kickoff con GlobalBank."
          actionLabel="Abrir hilo"
          onClick={() => onOpenThread("support-thread")}
        />
      </div>
    </DialogFrame>
  );
}

function TaskDetailSheet({ open, id, onOpenChange }: { open: boolean; id: string | null; onOpenChange: (open: boolean) => void }) {
  const record = getTaskRecord(id);

  return (
    <SheetFrame
      open={open}
      onOpenChange={onOpenChange}
      title={record.title}
      subtitle={`${record.code} · ${record.status}`}
      footer={
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
            Añadir comentario o contexto...
          </div>
          <PrimaryButton>
            <Send className="h-4 w-4" />
            Responder
          </PrimaryButton>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-3 md:grid-cols-2">
          <MetricRow label="Responsable" value={record.assignee} />
          <MetricRow label="Prioridad" value={record.priority} />
          <MetricRow label="Vence" value={record.dueDate} />
          <MetricRow label="Estado" value={record.status} />
        </div>
        <div>
          <SectionTitle icon={FileText} title="Descripción" />
          <p className="rounded-2xl border border-border/60 bg-secondary/20 p-4 text-sm text-muted-foreground">
            {record.description}
          </p>
        </div>
        <div>
          <SectionTitle icon={Database} title="Relaciones" />
          <div className="flex flex-wrap gap-2">
            {record.relations.map((relation) => (
              <TagChip key={relation} label={relation} />
            ))}
          </div>
        </div>
        <div>
          <SectionTitle icon={Clock} title="Actividad reciente" />
          <ActivityList items={record.activity} />
        </div>
      </div>
    </SheetFrame>
  );
}

function ClientDetailSheet({ open, id, onOpenChange }: { open: boolean; id: string | null; onOpenChange: (open: boolean) => void }) {
  const record = getClientRecord(id);

  return (
    <SheetFrame
      open={open}
      onOpenChange={onOpenChange}
      title={record.name}
      subtitle={`${record.segment} · Health ${record.health}`}
    >
      <div className="space-y-6">
        <div className="grid gap-3 md:grid-cols-2">
          <MetricRow label="Owner" value={record.owner} />
          <MetricRow label="Email" value={record.email} />
          <MetricRow label="Teléfono" value={record.phone} />
          <MetricRow label="Segmento" value={record.segment} />
        </div>
        <div>
          <SectionTitle icon={Building2} title="Resumen" />
          <p className="rounded-2xl border border-border/60 bg-secondary/20 p-4 text-sm text-muted-foreground">
            {record.summary}
          </p>
        </div>
        <div>
          <SectionTitle icon={FolderKanban} title="Proyectos vinculados" />
          <div className="space-y-2">
            {record.projects.map((project) => (
              <MetricRow key={project} label="Proyecto" value={project} />
            ))}
          </div>
        </div>
      </div>
    </SheetFrame>
  );
}

function DealDetailSheet({ open, id, onOpenChange }: { open: boolean; id: string | null; onOpenChange: (open: boolean) => void }) {
  const record = getDealRecord(id);

  return (
    <SheetFrame
      open={open}
      onOpenChange={onOpenChange}
      title={record.title}
      subtitle={`${record.company} · ${record.stage}`}
      footer={
        <div className="flex justify-end gap-2">
          <SecondaryButton>
            <Mail className="h-4 w-4" />
            Follow-up
          </SecondaryButton>
          <PrimaryButton>
            <ArrowRight className="h-4 w-4" />
            Avanzar etapa
          </PrimaryButton>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-3 md:grid-cols-3">
          <MetricRow label="Empresa" value={record.company} />
          <MetricRow label="Valor" value={record.value} />
          <MetricRow label="Probabilidad" value={record.probability} />
        </div>
        <MetricRow label="Siguiente paso" value={record.nextStep} />
        <div>
          <SectionTitle icon={Sparkles} title="Notas del deal" />
          <p className="rounded-2xl border border-border/60 bg-secondary/20 p-4 text-sm text-muted-foreground">
            {record.notes}
          </p>
        </div>
      </div>
    </SheetFrame>
  );
}

function EventDetailSheet({
  open,
  id,
  onOpenChange,
  onEdit,
}: {
  open: boolean;
  id: string | null;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}) {
  const record = getEventRecord(id);

  return (
    <SheetFrame
      open={open}
      onOpenChange={onOpenChange}
      title={record.title}
      subtitle={record.time}
      footer={
        <div className="flex justify-end gap-2">
          <SecondaryButton>
            <Trash2 className="h-4 w-4" />
            Eliminar
          </SecondaryButton>
          <SecondaryButton>
            <Video className="h-4 w-4" />
            Agregar a calendario
          </SecondaryButton>
          <PrimaryButton>
            <CalendarDays className="h-4 w-4" />
            Editar
          </PrimaryButton>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-3 md:grid-cols-2">
          <MetricRow label="Duración" value={record.duration} />
          <MetricRow label="Cliente" value={record.client} />
          <MetricRow label="Proyecto" value={record.project} />
          <MetricRow label="Horario" value={record.time} />
        </div>
        <div>
          <SectionTitle icon={CalendarDays} title="Descripción" />
          <p className="rounded-2xl border border-border/60 bg-secondary/20 p-4 text-sm text-muted-foreground">
            {record.description}
          </p>
        </div>
        <div>
          <SectionTitle icon={User} title="Asistentes" />
          <div className="flex flex-wrap gap-2">
            {record.attendees.map((attendee) => (
              <TagChip key={attendee} label={attendee} />
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <button className="text-sm font-medium text-primary" onClick={onEdit}>
            Abrir editor de evento
          </button>
        </div>
      </div>
    </SheetFrame>
  );
}

function AssetDetailSheet({ open, id, onOpenChange }: { open: boolean; id: string | null; onOpenChange: (open: boolean) => void }) {
  const record = getAssetRecord(id);

  return (
    <SheetFrame
      open={open}
      onOpenChange={onOpenChange}
      title={record.name}
      subtitle={`${record.type} · ${record.size}`}
      footer={
        <div className="flex justify-end gap-2">
          <SecondaryButton>
            <Download className="h-4 w-4" />
            Descargar
          </SecondaryButton>
          <SecondaryButton>
            <Globe className="h-4 w-4" />
            Compartir con cliente
          </SecondaryButton>
          <PrimaryButton>
            <Trash2 className="h-4 w-4" />
            Eliminar
          </PrimaryButton>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex h-56 items-center justify-center rounded-2xl border border-border/60 bg-secondary/20">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <ImageIcon className="h-10 w-10" />
            <span className="text-sm">{record.preview}</span>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <MetricRow label="Subido por" value={record.uploadedBy} />
          <MetricRow label="Fecha" value={record.uploadedAt} />
          <MetricRow label="Tipo" value={record.type} />
          <MetricRow label="Tamaño" value={record.size} />
        </div>
        <div>
          <SectionTitle icon={Tag} title="Tags IA" />
          <div className="flex flex-wrap gap-2">
            {record.tags.map((tag) => (
              <TagChip key={tag} label={tag} />
            ))}
          </div>
        </div>
        <div>
          <SectionTitle icon={FolderKanban} title="Vinculado a" />
          <div className="space-y-2">
            {record.relations.map((relation) => (
              <MetricRow key={relation} label="Entidad" value={relation} />
            ))}
          </div>
        </div>
      </div>
    </SheetFrame>
  );
}

function VaultEntrySheet({
  open,
  id,
  onOpenChange,
  onEdit,
}: {
  open: boolean;
  id: string | null;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}) {
  const record = getVaultRecord(id);

  return (
    <SheetFrame
      open={open}
      onOpenChange={onOpenChange}
      title={record.title}
      subtitle={`Tipo: ${record.type}`}
      footer={
        <div className="flex justify-end gap-2">
          <SecondaryButton>
            <Copy className="h-4 w-4" />
            Copiar
          </SecondaryButton>
          <SecondaryButton onClick={onEdit}>
            <Key className="h-4 w-4" />
            Editar
          </SecondaryButton>
          <PrimaryButton>
            <ShieldCheck className="h-4 w-4" />
            Revocar
          </PrimaryButton>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="space-y-2 rounded-2xl border border-border/60 bg-background p-4 font-mono text-sm text-foreground">
          {record.content.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
        <div>
          <SectionTitle icon={Clock} title="Historial de accesos" />
          <ActivityList items={record.audit} />
        </div>
      </div>
    </SheetFrame>
  );
}

function ThreadDetailSheet({
  open,
  id,
  onOpenChange,
  onConvert,
}: {
  open: boolean;
  id: string | null;
  onOpenChange: (open: boolean) => void;
  onConvert: () => void;
}) {
  const record = getThreadRecord(id);

  return (
    <SheetFrame
      open={open}
      onOpenChange={onOpenChange}
      title={record.title}
      subtitle={record.channel}
      footer={
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
            Responder inline...
          </div>
          <SecondaryButton>
            <AtSignPlaceholder />
            Menciones
          </SecondaryButton>
          <PrimaryButton>
            <CheckSquare className="h-4 w-4" />
            Enviar
          </PrimaryButton>
        </div>
      }
    >
      <div className="space-y-3">
        {record.messages.map((message) => (
          <div key={message} className="rounded-2xl border border-border/60 bg-secondary/20 p-4 text-sm text-muted-foreground">
            {message}
          </div>
        ))}
        <div className="flex justify-end pt-2">
          <button className="text-sm font-medium text-primary" onClick={onConvert}>
            Convertir a tarea
          </button>
        </div>
      </div>
    </SheetFrame>
  );
}

function ContractDetailSheet({
  open,
  id,
  onOpenChange,
  onNewVersion,
}: {
  open: boolean;
  id: string | null;
  onOpenChange: (open: boolean) => void;
  onNewVersion: () => void;
}) {
  const record = getContractRecord(id);

  return (
    <SheetFrame
      open={open}
      onOpenChange={onOpenChange}
      title={record.title}
      subtitle={`Estado: ${record.status}`}
      footer={
        <div className="flex justify-end gap-2">
          <SecondaryButton>
            <Send className="h-4 w-4" />
            Enviar a firma
          </SecondaryButton>
          <SecondaryButton>
            <Download className="h-4 w-4" />
            Descargar PDF
          </SecondaryButton>
          <PrimaryButton>
            <FileSignature className="h-4 w-4" />
            Compartir con cliente
          </PrimaryButton>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4 text-sm text-muted-foreground">
          {record.preview}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <MetricRow label="Firmantes" value={record.signatories.join(" · ")} />
          <MetricRow label="Estado" value={record.status} />
        </div>
        <div>
          <SectionTitle icon={Clock} title="Timeline de versiones" />
          <ActivityList items={record.milestones} />
        </div>
        <div className="flex justify-end">
          <button className="text-sm font-medium text-primary" onClick={onNewVersion}>
            Crear nueva versión desde plantilla
          </button>
        </div>
      </div>
    </SheetFrame>
  );
}

function TicketDetailSheet({ open, id, onOpenChange }: { open: boolean; id: string | null; onOpenChange: (open: boolean) => void }) {
  const record = getTicketRecord(id);

  return (
    <SheetFrame
      open={open}
      onOpenChange={onOpenChange}
      title={record.title}
      subtitle={`${record.client} · ${record.project}`}
      footer={
        <div className="flex justify-end gap-2">
          <SecondaryButton>
            <MessageSquare className="h-4 w-4" />
            Responder
          </SecondaryButton>
          <SecondaryButton>
            <User className="h-4 w-4" />
            Asignar
          </SecondaryButton>
          <PrimaryButton>
            <CheckCircle2 className="h-4 w-4" />
            Cambiar estado
          </PrimaryButton>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-3 md:grid-cols-2">
          <MetricRow label="Estado" value={record.status} />
          <MetricRow label="Prioridad" value={record.priority} />
          <MetricRow label="Cliente" value={record.client} />
          <MetricRow label="Proyecto" value={record.project} />
        </div>
        <div>
          <SectionTitle icon={Clock} title="Actividad" />
          <ActivityList items={record.activity} />
        </div>
      </div>
    </SheetFrame>
  );
}

function UploadFileDialog({
  open,
  context,
  onOpenChange,
}: {
  open: boolean;
  context: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <DialogFrame
      open={open}
      onOpenChange={onOpenChange}
      title="Subir archivo"
      subtitle={`Contexto actual: ${context ?? "General"}`}
      footer={
        <div className="flex justify-end gap-2">
          <SecondaryButton>Cancelar</SecondaryButton>
          <PrimaryButton>
            <UploadCloud className="h-4 w-4" />
            Subir a Vertrex Blob
          </PrimaryButton>
        </div>
      }
      maxWidthClassName="max-w-2xl"
    >
      <div className="space-y-5">
        <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-6 text-center text-sm text-muted-foreground">
          Arrastra archivos aquí o usa el selector para Assets, Docs o Portal.
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label="Tags opcionales" placeholder="branding, contrato, portal" />
          <TextInput label="Proyecto o categoría" placeholder="Portal cliente / Assets / Docs" />
        </div>
      </div>
    </DialogFrame>
  );
}

function ImportDocumentDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <DialogFrame
      open={open}
      onOpenChange={onOpenChange}
      title="Importar documento"
      subtitle="Ingiere PDF, DOCX, TXT o Markdown por URL o carga directa."
      footer={
        <div className="flex justify-end gap-2">
          <SecondaryButton>Cancelar</SecondaryButton>
          <PrimaryButton>
            <FileText className="h-4 w-4" />
            Importar
          </PrimaryButton>
        </div>
      }
    >
      <div className="space-y-4">
        <TextInput label="URL del documento" placeholder="https://.../documento.pdf" />
        <TextInput label="Nombre resultante" placeholder="Contrato Marco · Cliente" />
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label="Cliente vinculado" placeholder="Budaphone" />
          <TextInput label="Proyecto vinculado" placeholder="Portal cliente" />
        </div>
        <div className="rounded-2xl border border-dashed border-border bg-secondary/20 p-6 text-center text-sm text-muted-foreground">
          O arrastra aquí el archivo a importar.
        </div>
      </div>
    </DialogFrame>
  );
}

function RegisterTransactionDialog({
  open,
  transactionType,
  onOpenChange,
}: {
  open: boolean;
  transactionType: "income" | "expense" | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <DialogFrame
      open={open}
      onOpenChange={onOpenChange}
      title="Registrar transacción"
      subtitle={`Tipo preseleccionado: ${transactionType === "expense" ? "Gasto" : transactionType === "income" ? "Ingreso" : "Definir"}`}
      footer={
        <div className="flex justify-end gap-2">
          <SecondaryButton>Cancelar</SecondaryButton>
          <PrimaryButton>
            <Wallet className="h-4 w-4" />
            Guardar movimiento
          </PrimaryButton>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label="Monto en COP" placeholder="$ 0" />
        <TextInput label="Categoría" placeholder="MRR, Infra, Nómina, Otro" />
        <TextInput label="Cliente" placeholder="Opcional" />
        <TextInput label="Proyecto" placeholder="Opcional" />
        <TextInput label="Fecha" defaultValue="2026-04-24" />
        <TextInput label="Estado" defaultValue="Pendiente" />
      </div>
      <div className="mt-4">
        <TextArea label="Descripción" placeholder="Detalle de la transacción" />
      </div>
    </DialogFrame>
  );
}

function ConnectCredentialDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <DialogFrame
      open={open}
      onOpenChange={onOpenChange}
      title="Conectar credencial"
      subtitle="Define tipo, campos dinámicos y destino antes de cifrar con el vault."
      footer={
        <div className="flex justify-end gap-2">
          <SecondaryButton>Cancelar</SecondaryButton>
          <PrimaryButton>
            <Lock className="h-4 w-4" />
            Guardar credencial
          </PrimaryButton>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label="Nombre" placeholder="Figma Enterprise" />
          <TextInput label="Tipo" defaultValue="credential" />
          <TextInput label="Usuario / key" placeholder="design@vertrex.com" />
          <TextInput label="URL" placeholder="https://app.figma.com" />
        </div>
        <TextArea label="Secreto / notas" placeholder="Contraseña, TOTP o contenido libre" />
      </div>
    </DialogFrame>
  );
}

function CreateDealDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <DialogFrame
      open={open}
      onOpenChange={onOpenChange}
      title="Crear deal"
      subtitle="Entrada rápida para pipeline, valor, stage y fecha estimada de cierre."
      footer={
        <div className="flex justify-end gap-2">
          <SecondaryButton>Cancelar</SecondaryButton>
          <PrimaryButton>
            <Building2 className="h-4 w-4" />
            Crear trato
          </PrimaryButton>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label="Título" placeholder="Vertrex OS Enterprise" />
        <TextInput label="Cliente" placeholder="GlobalBank" />
        <TextInput label="Valor en COP" placeholder="$ 180000000" />
        <TextInput label="Stage inicial" defaultValue="lead" />
        <TextInput label="Cierre estimado" defaultValue="2026-05-15" />
        <TextInput label="Probabilidad" defaultValue="65%" />
      </div>
      <div className="mt-4">
        <TextArea label="Notas" placeholder="Contexto comercial, riesgos y siguiente paso" />
      </div>
    </DialogFrame>
  );
}

function CreateEventDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <DialogFrame
      open={open}
      onOpenChange={onOpenChange}
      title="Crear evento"
      subtitle="Agenda reuniones, bloqueos de foco o follow-ups recurrentes."
      footer={
        <div className="flex justify-end gap-2">
          <SecondaryButton>Cancelar</SecondaryButton>
          <PrimaryButton>
            <CalendarDays className="h-4 w-4" />
            Guardar evento
          </PrimaryButton>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label="Título" placeholder="Kickoff cliente" />
        <TextInput label="Cliente" placeholder="Budaphone" />
        <TextInput label="Proyecto" placeholder="Portal cliente" />
        <TextInput label="Repetición" defaultValue="Nunca" />
        <TextInput label="Inicio" defaultValue="2026-04-24 11:00" />
        <TextInput label="Fin" defaultValue="2026-04-24 12:30" />
      </div>
      <div className="mt-4">
        <TextArea label="Descripción" placeholder="Agenda, contexto y asistentes" />
      </div>
    </DialogFrame>
  );
}

function CreateTicketDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <DialogFrame
      open={open}
      onOpenChange={onOpenChange}
      title="Crear ticket"
      subtitle="Nuevo soporte para portal, operaciones o incidencias internas."
      footer={
        <div className="flex justify-end gap-2">
          <SecondaryButton>Cancelar</SecondaryButton>
          <PrimaryButton>
            <LifeBuoy className="h-4 w-4" />
            Crear ticket
          </PrimaryButton>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label="Título" placeholder="Pago no sincronizado" />
        <TextInput label="Prioridad" defaultValue="high" />
        <TextInput label="Cliente" placeholder="Budaphone" />
        <TextInput label="Proyecto" placeholder="Portal cliente" />
        <TextInput label="Asignado a" placeholder="Operaciones" />
        <TextInput label="Canal" defaultValue="portal" />
      </div>
      <div className="mt-4">
        <TextArea label="Descripción" placeholder="Detalle del problema y evidencia" />
      </div>
    </DialogFrame>
  );
}

function CreateAutomationDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <DialogFrame
      open={open}
      onOpenChange={onOpenChange}
      title="Crear automatización"
      subtitle="Entrada rápida para trigger + acción antes de abrir el canvas completo."
      footer={
        <div className="flex justify-end gap-2">
          <SecondaryButton>Cancelar</SecondaryButton>
          <PrimaryButton>
            <Zap className="h-4 w-4" />
            Crear flujo
          </PrimaryButton>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label="Nombre" placeholder="Onboarding cliente enterprise" />
        <TextInput label="Trigger" defaultValue="Nuevo proyecto creado" />
        <TextInput label="Acción principal" defaultValue="Crear tarea" />
        <TextInput label="Resultado" defaultValue="Abrir canvas" />
      </div>
      <div className="mt-4">
        <TextArea label="Resumen" placeholder="Qué debe pasar cuando se active el flujo" />
      </div>
    </DialogFrame>
  );
}

function TemplateSelectorDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "universales" | "cliente">("all");
  const filteredTemplates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return templateOptions.filter((template) => {
      const matchesFilter =
        filter === "all"
          ? true
          : filter === "universales"
            ? template.clientId === "universales"
            : template.clientId !== "universales";

      if (!matchesFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return [template.title, template.description, template.type, template.clientLabel]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [filter, query]);

  return (
    <DialogFrame
      open={open}
      onOpenChange={onOpenChange}
      title="Selector de plantillas"
      subtitle="Explora plantillas universales y por cliente con preview y uso inmediato."
      maxWidthClassName="max-w-5xl"
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">Filtros sugeridos: universales, cliente, legal, comercial.</span>
          <SecondaryButton onClick={() => onOpenChange(false)}>Cerrar</SecondaryButton>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              placeholder="Buscar por nombre o tipo..."
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <SecondaryButton onClick={() => setFilter(filter === "universales" ? "all" : "universales")}>Universales</SecondaryButton>
          <SecondaryButton onClick={() => setFilter(filter === "cliente" ? "all" : "cliente")}>Por cliente</SecondaryButton>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              className="rounded-2xl border border-border bg-secondary/20 p-4 text-left transition-colors hover:border-primary/40 hover:bg-secondary/40"
              onClick={() => onSelect(template.id)}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="rounded-xl border border-border bg-background p-2 text-primary">
                  <FileText className="h-4 w-4" />
                </div>
                <span className="rounded-full border border-border bg-background px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {template.kind}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-foreground">{template.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{template.description}</p>
              <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{template.type}</span>
                <span className="text-primary">Usar plantilla</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </DialogFrame>
  );
}

function ActionCard({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: typeof FolderKanban;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      className="rounded-2xl border border-border bg-secondary/20 p-4 text-left transition-colors hover:border-primary/40 hover:bg-secondary/40"
      onClick={onClick}
    >
      <div className="mb-3 rounded-xl border border-border bg-background p-2 text-primary w-fit">
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </button>
  );
}

function InboxCard({
  icon: Icon,
  title,
  description,
  actionLabel,
  onClick,
}: {
  icon: typeof MessageSquare;
  title: string;
  description: string;
  actionLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      className="rounded-2xl border border-border bg-secondary/20 p-4 text-left transition-colors hover:border-primary/40 hover:bg-secondary/40"
      onClick={onClick}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="rounded-xl border border-border bg-background p-2 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-primary">
        {actionLabel}
      </div>
    </button>
  );
}

function AtSignPlaceholder() {
  return <span className="text-xs font-semibold">@</span>;
}
