"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CheckSquare,
  Clock3,
  DollarSign,
  FileText,
  MessageSquare,
  Sparkles,
  Ticket,
  UploadCloud,
  Zap,
} from "lucide-react";

import { EmptyWorkspacePanel, formatDateTime, formatNumber } from "@/components/os/workspace-ui";
import type { BusinessEventRecord } from "@/lib/ops/business-event-service";
import { getDealStageLabel } from "@/lib/ops/deal-stages";
import { buildWorkspaceHealthSnapshot } from "@/lib/ops/workspace-health";
import type { WorkspaceSnapshot } from "@/lib/ops/workspace-service";
import { useUIStore } from "@/lib/store/ui";

type MyDayWorkspaceScreenProps = {
  workspaceSnapshot: WorkspaceSnapshot;
  businessEvents: BusinessEventRecord[];
};

type FocusTone = "critical" | "warning" | "info";

type FocusItem = {
  id: string;
  kind: "task" | "ticket" | "deal";
  entityId: string;
  title: string;
  context: string;
  summary: string;
  tone: FocusTone;
  timestamp: string;
  ctaLabel: string;
};

type AgendaItem = {
  id: string;
  title: string;
  startsAt: string;
  kind: string;
  clientName: string | null;
  projectName: string | null;
  attendeesCount: number;
};

type ActivityEntry = {
  id: string;
  title: string;
  description: string;
  entity: string;
  timestamp: string;
  actorLabel: string;
  icon: typeof Clock3;
  color: string;
  bgColor: string;
};

const focusTaskStatuses = new Set(["blocked", "review", "in_progress"]);
const openTicketStatuses = new Set(["open", "in_progress"]);

type FocusOpen = (key: "taskDetail" | "ticketDetail" | "dealDetail", payload?: string) => void;

export default function MyDayWorkspaceScreen({ workspaceSnapshot, businessEvents }: MyDayWorkspaceScreenProps) {
  const router = useRouter();
  const open = useUIStore((store) => store.open);
  const model = useMemo(() => buildMyDayModel(workspaceSnapshot, businessEvents), [workspaceSnapshot, businessEvents]);

  if (model.isEmpty) {
    return (
      <div className="space-y-6">
        <EmptyWorkspacePanel
          title="Mi día todavía no tiene base operativa"
          description="Registra tareas, eventos, deals o actividad auditable para construir una vista diaria real del trabajo del equipo."
        />
        <button className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground" onClick={() => router.refresh()}>
          Actualizar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Mi día</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Prioridades, agenda inmediata, bloqueadores y feed reciente del equipo sobre la misma operación real del workspace.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/os/calendar" className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80">
            Abrir agenda
          </Link>
          <Link href="/os/health" className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80">
            Abrir salud
          </Link>
          <button className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80" onClick={() => router.refresh()}>
            Actualizar
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Prioridades hoy"
          value={String(model.focusItems.length)}
          subtitle={`${formatNumber(model.blockedTaskCount)} bloqueos · ${formatNumber(model.riskTicketCount)} requests en riesgo`}
          icon={CheckSquare}
        />
        <MetricCard
          title="Eventos hoy"
          value={String(model.todayEvents.length)}
          subtitle={model.todayEvents[0] ? model.todayEvents[0].title : `${formatNumber(model.nextEvents.length)} próximos hitos después de hoy`}
          icon={CalendarDays}
        />
        <MetricCard
          title="Riesgos críticos"
          value={String(model.healthSnapshot.counts.critical)}
          subtitle={`${formatNumber(model.healthSnapshot.counts.warning)} warnings activos en la operación`}
          icon={AlertTriangle}
        />
        <MetricCard
          title="Feed reciente"
          value={String(model.activityEntries.length)}
          subtitle={model.activitySourceLabel}
          icon={Activity}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold text-foreground">Prioridades de hoy</h2>
          </div>
          <div className="space-y-3 p-4">
            {model.focusItems.length > 0 ? (
              model.focusItems.map((item) => (
                <button
                  key={item.id}
                  className="w-full rounded-xl border border-border/60 bg-secondary/20 p-4 text-left transition-colors hover:border-primary/30 hover:bg-primary/5"
                  onClick={() => openFocusItem(item, open)}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${getToneClassName(item.tone)}`}>
                          {getToneLabel(item.tone)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{item.context}</p>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{formatDateTime(item.timestamp)}</span>
                  </div>
                  <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-muted-foreground">{item.summary}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-primary">
                      {item.ctaLabel}
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-secondary/10 p-4 text-sm text-muted-foreground">
                No hay prioridades urgentes derivadas desde tareas, tickets o pipeline en este momento.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold text-foreground">Agenda inmediata</h2>
          </div>
          <div className="space-y-5 p-4">
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Hoy</p>
              {model.todayEvents.length > 0 ? (
                model.todayEvents.map((event) => (
                  <AgendaEventCard key={event.id} item={event} onOpen={() => open("eventDetail", event.id)} />
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-secondary/10 p-4 text-sm text-muted-foreground">
                  No hay eventos agendados para hoy.
                </div>
              )}
            </div>
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Siguiente ventana</p>
              {model.nextEvents.length > 0 ? (
                model.nextEvents.map((event) => (
                  <AgendaEventCard key={event.id} item={event} onOpen={() => open("eventDetail", event.id)} />
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-secondary/10 p-4 text-sm text-muted-foreground">
                  No hay próximos hitos registrados después de hoy.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold text-foreground">Bloqueadores operativos</h2>
          </div>
          <div className="space-y-3 p-4">
            {model.healthSnapshot.issues.length > 0 ? (
              model.healthSnapshot.issues.slice(0, 5).map((issue) => (
                <Link
                  key={issue.id}
                  href={issue.actionPath}
                  className={`block rounded-xl border p-4 transition-colors hover:border-primary/30 hover:bg-primary/5 ${issue.severity === "critical" ? "border-destructive/30 bg-destructive/5" : "border-amber-500/30 bg-amber-500/5"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{issue.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{issue.message}</p>
                    </div>
                    <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${issue.severity === "critical" ? "border-destructive/20 bg-destructive/10 text-destructive" : "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300"}`}>
                      {issue.severity === "critical" ? "Critical" : "Warning"}
                    </span>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-primary">
                    {issue.actionLabel}
                    <ArrowUpRight className="h-3 w-3" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-secondary/10 p-4 text-sm text-muted-foreground">
                No hay bloqueadores derivados desde el health snapshot.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold text-foreground">Actividad reciente del equipo</h2>
          </div>
          <div className="p-5">
            {model.activityEntries.length > 0 ? (
              <div className="relative ml-3 space-y-8 border-l border-border/50 pb-4">
                {model.activityEntries.map((entry) => (
                  <ActivityTimelineEntry key={entry.id} entry={entry} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-secondary/10 p-4 text-sm text-muted-foreground">
                Aún no hay actividad reciente visible para construir el feed del equipo.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon }: { title: string; value: string; subtitle: string; icon: typeof Clock3 }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</h3>
        </div>
        <div className="rounded-xl bg-secondary/60 p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function AgendaEventCard({ item, onOpen }: { item: AgendaItem; onOpen: () => void }) {
  return (
    <button
      className="w-full rounded-xl border border-border/60 bg-secondary/20 p-4 text-left transition-colors hover:border-primary/30 hover:bg-primary/5"
      onClick={onOpen}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">{item.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {item.clientName ?? "Interno"}
            {item.projectName ? ` · ${item.projectName}` : ""}
          </p>
        </div>
        <span className="rounded-full border border-border bg-background px-2 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">
          {item.kind}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>{formatDateTime(item.startsAt)}</span>
        <span>·</span>
        <span>{item.attendeesCount} asistentes</span>
      </div>
    </button>
  );
}

function ActivityTimelineEntry({ entry }: { entry: ActivityEntry }) {
  const Icon = entry.icon;

  return (
    <div className="relative pl-6 sm:pl-8">
      <div className={`absolute -left-[17px] top-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-card ${entry.bgColor}`}>
        <Icon className={`h-3.5 w-3.5 ${entry.color}`} />
      </div>
      <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
        <h4 className="text-sm font-semibold text-foreground">{entry.title}</h4>
        <span className="font-mono text-xs text-muted-foreground">{formatDateTime(entry.timestamp)}</span>
      </div>
      <p className="mb-2 text-sm leading-relaxed text-muted-foreground">{entry.description}</p>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-border/50 bg-secondary px-2 py-1 font-medium text-foreground">
          <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
          {entry.entity}
        </span>
        <span>{entry.actorLabel}</span>
      </div>
    </div>
  );
}

function buildMyDayModel(snapshot: WorkspaceSnapshot, businessEvents: BusinessEventRecord[]) {
  const now = new Date();
  const healthSnapshot = buildWorkspaceHealthSnapshot(snapshot);
  const sortedUpcomingEvents = [...snapshot.events]
    .filter((event) => new Date(event.startsAt).getTime() >= now.getTime())
    .sort((left, right) => new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime());
  const todayEvents = sortedUpcomingEvents
    .filter((event) => isSameDay(event.startsAt, now))
    .slice(0, 4)
    .map((event) => ({
      id: event.id,
      title: event.title,
      startsAt: event.startsAt,
      kind: event.kind,
      clientName: event.clientName,
      projectName: event.projectName,
      attendeesCount: event.attendees.length,
    }));
  const nextEvents = sortedUpcomingEvents
    .filter((event) => !isSameDay(event.startsAt, now))
    .slice(0, 4)
    .map((event) => ({
      id: event.id,
      title: event.title,
      startsAt: event.startsAt,
      kind: event.kind,
      clientName: event.clientName,
      projectName: event.projectName,
      attendeesCount: event.attendees.length,
    }));
  const blockedTasks = snapshot.tasks.filter((task) => normalize(task.status) === "blocked");
  const priorityTasks: FocusItem[] = [...snapshot.tasks]
    .filter((task) => focusTaskStatuses.has(normalize(task.status)))
    .sort((left, right) => compareTaskPriority(left.status, right.status) || new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
    .slice(0, 4)
    .map((task) => {
      const tone: FocusTone = normalize(task.status) === "blocked" ? "critical" : normalize(task.status) === "review" ? "warning" : "info";

      return {
      id: `task-${task.id}`,
      kind: "task" as const,
      entityId: task.id,
      title: task.title,
      context: task.projectName ?? task.clientName ?? "Sin contexto",
      summary: `${formatTaskStatusLabel(task.status)} · ${task.owner ?? "Sin owner"}`,
      tone,
      timestamp: task.updatedAt,
      ctaLabel: "Abrir tarea",
    };
    });
  const riskyTickets: FocusItem[] = snapshot.tickets
    .filter((ticket) => openTicketStatuses.has(normalize(ticket.status)) && ["breached", "at_risk"].includes(ticket.slaStatus))
    .sort((left, right) => compareTicketRisk(left.slaStatus, right.slaStatus) || new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
    .slice(0, 3)
    .map((ticket) => {
      const tone: FocusTone = ticket.slaStatus === "breached" ? "critical" : "warning";

      return {
      id: `ticket-${ticket.id}`,
      kind: "ticket" as const,
      entityId: ticket.id,
      title: ticket.title,
      context: ticket.clientName ?? ticket.projectName ?? "Soporte",
      summary: `${ticket.requestTypeLabel} · ${ticket.slaLabel}`,
      tone,
      timestamp: ticket.updatedAt,
      ctaLabel: "Abrir ticket",
    };
    });
  const followUpDeals: FocusItem[] = snapshot.deals
    .filter((deal) => deal.probability >= 60 && (!deal.lastContactAt || isPastDate(deal.expectedCloseAt, now)))
    .sort((left, right) => right.probability - left.probability || new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
    .slice(0, 3)
    .map((deal) => {
      const tone: FocusTone = isPastDate(deal.expectedCloseAt, now) ? "critical" : "warning";

      return {
      id: `deal-${deal.id}`,
      kind: "deal" as const,
      entityId: deal.id,
      title: deal.title,
      context: deal.clientName ?? "CRM",
      summary: isPastDate(deal.expectedCloseAt, now)
        ? `Cierre esperado vencido · ${getDealStageLabel(deal.stage)}`
        : `Sin follow-up registrado · ${deal.probability}% probabilidad`,
      tone,
      timestamp: deal.expectedCloseAt ?? deal.updatedAt,
      ctaLabel: "Abrir deal",
    };
    });
  const focusItems = [...priorityTasks, ...riskyTickets, ...followUpDeals]
    .sort((left, right) => compareFocusTone(left.tone, right.tone) || new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime())
    .slice(0, 8);
  const activityEntries = (businessEvents.length > 0 ? buildBusinessEventEntries(businessEvents) : buildFallbackActivityEntries(snapshot)).slice(0, 10);

  return {
    isEmpty:
      snapshot.tasks.length === 0
      && snapshot.events.length === 0
      && snapshot.tickets.length === 0
      && snapshot.deals.length === 0
      && businessEvents.length === 0,
    healthSnapshot,
    focusItems,
    blockedTaskCount: blockedTasks.length,
    riskTicketCount: riskyTickets.length,
    todayEvents,
    nextEvents,
    activityEntries,
    activitySourceLabel: businessEvents.length > 0 ? "Desde business events auditables" : "Derivado desde snapshot operativo",
  };
}

function buildBusinessEventEntries(events: BusinessEventRecord[]): ActivityEntry[] {
  return [...events]
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .map((event) => {
      const visual = resolveBusinessEventVisual(event);

      return {
        id: event.id,
        title: event.summary,
        description: typeof event.payload.description === "string" ? event.payload.description : `${event.module} · ${event.action}`,
        entity: event.projectName ?? event.clientName ?? event.module,
        timestamp: event.createdAt,
        actorLabel: event.actorName ?? getActorLabel(event.actorType),
        icon: visual.icon,
        color: visual.color,
        bgColor: visual.bgColor,
      };
    });
}

function buildFallbackActivityEntries(snapshot: WorkspaceSnapshot): ActivityEntry[] {
  const taskEntries = snapshot.tasks.map((task) => ({
    id: `task-${task.id}`,
    title: `Tarea ${formatTaskStatusLabel(task.status)}`,
    description: task.title,
    entity: task.projectName ?? task.clientName ?? "Operaciones",
    timestamp: task.updatedAt,
    actorLabel: task.owner ?? "Sistema",
    icon: CheckCircle2,
    color: normalize(task.status) === "done" ? "text-primary" : "text-blue-400",
    bgColor: normalize(task.status) === "done" ? "bg-primary/10" : "bg-blue-400/10",
  }));
  const automationEntries = snapshot.automationRuns.map((run) => ({
    id: `automation-${run.id}`,
    title: run.playbookTitle ?? run.title,
    description: run.summary,
    entity: run.projectName ?? run.clientName ?? "Automatizaciones",
    timestamp: run.finishedAt ?? run.startedAt,
    actorLabel: "Automation",
    icon: Zap,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
  }));
  const fileEntries = snapshot.files.map((file) => ({
    id: `file-${file.id}`,
    title: "Archivo sincronizado",
    description: file.name,
    entity: file.clientName ?? file.provider,
    timestamp: file.uploadedAt,
    actorLabel: file.source === "client" ? "Cliente" : "Vertrex",
    icon: UploadCloud,
    color: file.provider === "drive" ? "text-blue-400" : "text-primary",
    bgColor: file.provider === "drive" ? "bg-blue-400/10" : "bg-primary/10",
  }));
  const messageEntries = snapshot.messages.map((message) => ({
    id: `message-${message.id}`,
    title: `${message.senderRole === "client" ? "Mensaje cliente" : "Mensaje operativo"}`,
    description: message.message,
    entity: message.clientName ?? message.channel,
    timestamp: message.createdAt,
    actorLabel: message.senderName,
    icon: MessageSquare,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  }));

  return [...taskEntries, ...automationEntries, ...fileEntries, ...messageEntries].sort(
    (left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime(),
  );
}

function resolveBusinessEventVisual(event: BusinessEventRecord) {
  if (event.module === "finance") {
    return {
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
    };
  }

  if (event.module === "automation" || event.actorType === "automation") {
    return {
      icon: Zap,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
    };
  }

  if (event.module === "calendar" || event.entityType === "event") {
    return {
      icon: CalendarDays,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    };
  }

  if (event.entityType === "task" || event.entityType === "milestone") {
    return {
      icon: CheckCircle2,
      color: event.entityType === "milestone" ? "text-blue-400" : "text-primary",
      bgColor: event.entityType === "milestone" ? "bg-blue-400/10" : "bg-primary/10",
    };
  }

  if (event.entityType === "file" || event.entityType === "document") {
    return {
      icon: FileText,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    };
  }

  if (event.module === "support" || event.entityType === "ticket") {
    return {
      icon: Ticket,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
    };
  }

  if (event.module === "chat" || event.entityType === "message") {
    return {
      icon: MessageSquare,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    };
  }

  return {
    icon: Sparkles,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  };
}

function getActorLabel(actorType: BusinessEventRecord["actorType"]) {
  if (actorType === "automation") {
    return "Automation";
  }

  if (actorType === "ai") {
    return "IA";
  }

  if (actorType === "system") {
    return "Sistema";
  }

  return "Usuario";
}

function openFocusItem(item: FocusItem, open: FocusOpen) {
  if (item.kind === "task") {
    open("taskDetail", item.entityId);
    return;
  }

  if (item.kind === "ticket") {
    open("ticketDetail", item.entityId);
    return;
  }

  open("dealDetail", item.entityId);
}

function compareTaskPriority(leftStatus: string, rightStatus: string) {
  return getTaskPriorityRank(leftStatus) - getTaskPriorityRank(rightStatus);
}

function getTaskPriorityRank(status: string) {
  const normalized = normalize(status);

  if (normalized === "blocked") {
    return 0;
  }

  if (normalized === "review") {
    return 1;
  }

  if (normalized === "in_progress") {
    return 2;
  }

  return 3;
}

function compareTicketRisk(left: string, right: string) {
  return getTicketRiskRank(left) - getTicketRiskRank(right);
}

function getTicketRiskRank(status: string) {
  if (status === "breached") {
    return 0;
  }

  if (status === "at_risk") {
    return 1;
  }

  return 2;
}

function compareFocusTone(left: FocusTone, right: FocusTone) {
  return getFocusToneRank(left) - getFocusToneRank(right);
}

function getFocusToneRank(value: FocusTone) {
  if (value === "critical") {
    return 0;
  }

  if (value === "warning") {
    return 1;
  }

  return 2;
}

function formatTaskStatusLabel(status: string) {
  const normalized = normalize(status);

  if (normalized === "in_progress") {
    return "En ejecución";
  }

  if (normalized === "review") {
    return "En review";
  }

  if (normalized === "blocked") {
    return "Bloqueada";
  }

  if (normalized === "done") {
    return "Completada";
  }

  return status;
}

function getToneClassName(tone: FocusTone) {
  if (tone === "critical") {
    return "border-destructive/30 bg-destructive/10 text-destructive";
  }

  if (tone === "warning") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300";
  }

  return "border-primary/30 bg-primary/10 text-primary";
}

function getToneLabel(tone: FocusTone) {
  if (tone === "critical") {
    return "Critical";
  }

  if (tone === "warning") {
    return "Warning";
  }

  return "Info";
}

function isSameDay(value: string, reference: Date) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  return parsed.toDateString() === reference.toDateString();
}

function isPastDate(value: string | null, reference: Date) {
  if (!value) {
    return false;
  }

  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && parsed.getTime() < reference.getTime();
}

function normalize(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}
