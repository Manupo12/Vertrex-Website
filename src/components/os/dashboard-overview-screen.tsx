import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  DollarSign,
  Sparkles,
  Ticket,
  UploadCloud,
  Zap,
} from "lucide-react";

import { OperationalStatsGrid } from "@/components/dashboard/operational-stats-grid";
import { formatDateTime, formatMoney } from "@/components/os/workspace-ui";
import type { OperationalStatsSnapshot } from "@/lib/dashboard/operational-stats";
import type { BusinessEventRecord } from "@/lib/ops/business-event-service";
import { dealPipelineGroups, getDealPipelineGroup } from "@/lib/ops/deal-stages";
import { isOutstandingInvoiceStatus } from "@/lib/ops/status-catalog";
import type { WorkspaceHealthSnapshot } from "@/lib/ops/workspace-health";
import type { WorkspaceSnapshot } from "@/lib/ops/workspace-service";

type DashboardOverviewScreenProps = {
  statsSnapshot: OperationalStatsSnapshot;
  workspaceSnapshot: WorkspaceSnapshot;
  healthSnapshot: WorkspaceHealthSnapshot;
  businessEvents: BusinessEventRecord[];
};

type TimelineEntry = {
  id: string;
  title: string;
  description: string;
  entity: string;
  timestamp: string;
  icon: typeof DollarSign;
  color: string;
  bgColor: string;
};

export default function DashboardOverviewScreen({ statsSnapshot, workspaceSnapshot, healthSnapshot, businessEvents }: DashboardOverviewScreenProps) {
  const incomeTransactions = workspaceSnapshot.transactions.filter((transaction) => transaction.type === "income");
  const expenseTransactions = workspaceSnapshot.transactions.filter((transaction) => transaction.type === "expense");
  const paidIncome = incomeTransactions.reduce((total, transaction) => total + transaction.amountCents, 0);
  const totalExpenses = expenseTransactions.reduce((total, transaction) => total + transaction.amountCents, 0);
  const pendingInvoiceAmount = workspaceSnapshot.invoices
    .filter((invoice) => isOutstandingInvoiceStatus(invoice.status))
    .reduce((total, invoice) => total + invoice.amountCents, 0);
  const upcomingEvents = [...workspaceSnapshot.events]
    .sort((left, right) => new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime())
    .slice(0, 3);
  const topDeals = [...workspaceSnapshot.deals]
    .sort((left, right) => right.probability - left.probability || right.valueCents - left.valueCents)
    .slice(0, 3);
  const timeline = (businessEvents.length > 0 ? buildBusinessEventTimelineEntries(businessEvents) : buildTimelineEntries(workspaceSnapshot)).slice(0, 6);
  const alerts = buildAlerts(workspaceSnapshot, healthSnapshot);

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Visión General</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {workspaceSnapshot.databaseConfigured
              ? `Snapshot operativo sincronizado con ${workspaceSnapshot.summary.clients} clientes, ${workspaceSnapshot.summary.projects} proyectos y ${workspaceSnapshot.summary.files} archivos activos.`
              : "Neon todavía no está configurado. El dashboard mostrará cero datos hasta conectar la base real."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            Sync: Tiempo Real
          </span>
        </div>
      </div>

      <OperationalStatsGrid snapshot={statsSnapshot} />

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
        <SummaryCard title="Ingresos registrados" value={formatMoney(paidIncome)} detail={`${incomeTransactions.length} movimientos de ingreso`} icon={DollarSign} accent="text-primary" />
        <SummaryCard title="Gastos operativos" value={formatMoney(totalExpenses)} detail={`${expenseTransactions.length} egresos registrados`} icon={ArrowUpRight} accent="text-amber-400" />
        <SummaryCard title="Cobro pendiente" value={formatMoney(pendingInvoiceAmount)} detail={`${workspaceSnapshot.summary.pendingInvoices} facturas aún abiertas`} icon={Ticket} accent="text-destructive" />
        <SummaryCard title="Próximos eventos" value={String(workspaceSnapshot.summary.upcomingEvents)} detail={upcomingEvents[0] ? `${upcomingEvents[0].title} · ${formatDateTime(upcomingEvents[0].startsAt)}` : "Agenda libre"} icon={CalendarDays} accent="text-blue-400" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Timeline Global
            </h2>
            <span className="text-xs text-muted-foreground">Últimos cambios del workspace</span>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            {timeline.length > 0 ? (
              <div className="relative ml-3 space-y-8 border-l border-border/50 pb-4">
                {timeline.map((entry) => (
                  <TimelineEvent key={entry.id} entry={entry} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-secondary/20 px-6 py-12 text-center text-sm text-muted-foreground">
                Aún no hay actividad operativa real para mostrar en la línea de tiempo.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-card shadow-[0_0_30px_rgba(0,255,135,0.05)]">
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-primary to-emerald-700"></div>
            <div className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-md bg-primary/10 p-1.5">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-md font-semibold text-foreground">IA COO Insights</h2>
              </div>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <AlertItem key={alert.message} level={alert.level} message={alert.message} action={alert.action} href={alert.href} />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">Próximos Cierres (CRM)</h3>
            <div className="space-y-4">
              {topDeals.length > 0 ? (
                topDeals.map((deal) => (
                  <div key={deal.id} className="space-y-2">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <div>
                        <p className="font-medium text-foreground">{deal.title}</p>
                        <p className="text-xs text-muted-foreground">{deal.clientName ?? "Sin cliente"}</p>
                      </div>
                      <span className="font-mono text-primary">{formatMoney(deal.valueCents)}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-secondary">
                      <div className="h-1.5 rounded-full bg-primary" style={{ width: `${deal.probability}%` }}></div>
                    </div>
                    <p className="text-right text-xs text-muted-foreground">{deal.probability}% probabilidad</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No hay deals reales en el pipeline todavía.</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">Agenda inmediata</h3>
            <div className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="rounded-lg border border-border/60 bg-secondary/20 px-3 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{event.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(event.startsAt)}</p>
                      </div>
                      <span className="rounded-full border border-border bg-background px-2 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                        {event.kind}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No hay eventos próximos programados.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildTimelineEntries(snapshot: WorkspaceSnapshot): TimelineEntry[] {
  const transactions = snapshot.transactions.map((transaction) => ({
    id: `transaction-${transaction.id}`,
    title: transaction.type === "income" ? "Ingreso registrado" : "Gasto operativo registrado",
    description: transaction.description ?? transaction.category ?? "Movimiento financiero sincronizado.",
    entity: transaction.clientName ?? transaction.projectName ?? "Finanzas",
    timestamp: transaction.occurredAt,
    icon: DollarSign,
    color: transaction.type === "income" ? "text-primary" : "text-amber-400",
    bgColor: transaction.type === "income" ? "bg-primary/10" : "bg-amber-400/10",
  }));

  const tasks = snapshot.tasks.map((task) => ({
    id: `task-${task.id}`,
    title: `Tarea ${task.status}`,
    description: task.title,
    entity: task.projectName ?? task.clientName ?? "Operaciones",
    timestamp: task.updatedAt,
    icon: CheckCircle2,
    color: task.status === "done" ? "text-primary" : "text-blue-400",
    bgColor: task.status === "done" ? "bg-primary/10" : "bg-blue-400/10",
  }));

  const deals = snapshot.deals.map((deal) => ({
    id: `deal-${deal.id}`,
    title: `Pipeline ${deal.stage}`,
    description: deal.title,
    entity: deal.clientName ?? "CRM",
    timestamp: deal.updatedAt,
    icon: Sparkles,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  }));

  const files = snapshot.files.map((file, index) => ({
    id: `file-${file.id}`,
    title: "Archivo sincronizado",
    description: file.name,
    entity: file.clientName ?? file.provider,
    timestamp: new Date(Date.now() - index * 1000).toISOString(),
    icon: UploadCloud,
    color: file.provider === "drive" ? "text-blue-400" : "text-primary",
    bgColor: file.provider === "drive" ? "bg-blue-400/10" : "bg-primary/10",
  }));

  return [...transactions, ...tasks, ...deals, ...files].sort(
    (left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime(),
  );
}

function buildBusinessEventTimelineEntries(events: BusinessEventRecord[]): TimelineEntry[] {
  return events.map((event) => {
    const visual = resolveBusinessEventVisual(event);

    return {
      id: event.id,
      title: event.summary,
      description: typeof event.payload.description === "string" ? event.payload.description : event.eventType,
      entity: event.projectName ?? event.clientName ?? event.module,
      timestamp: event.createdAt,
      icon: visual.icon,
      color: visual.color,
      bgColor: visual.bgColor,
    };
  });
}

function resolveBusinessEventVisual(event: BusinessEventRecord) {
  if (event.module === "finance") {
    return {
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
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
      icon: UploadCloud,
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

  return {
    icon: Sparkles,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  };
}

function buildAlerts(
  snapshot: WorkspaceSnapshot,
  healthSnapshot: WorkspaceHealthSnapshot,
): Array<{ level: "critical" | "warning" | "success"; message: string; action: string; href?: string }> {
  const alerts: Array<{ level: "critical" | "warning" | "success"; message: string; action: string; href?: string }> = healthSnapshot.issues.slice(0, 3).map((issue) => ({
    level: issue.severity === "critical" ? "critical" : "warning",
    message: issue.message,
    action: issue.actionLabel,
    href: issue.actionPath,
  }));

  if (alerts.length < 3) {
    alerts.push({
      level: snapshot.storage.googleDriveConfigured ? "success" : "warning",
      message: snapshot.storage.googleDriveConfigured
        ? `Salud general ${healthSnapshot.overallStatus === "healthy" ? "estable" : "bajo observación"}${snapshot.storage.driveSharedAccount ? ` · Drive conectado con ${snapshot.storage.driveSharedAccount}` : ""}.`
        : "Google Drive todavía no está configurado para el storage híbrido real.",
      action: snapshot.storage.googleDriveConfigured ? "Abrir salud" : "Configurar storage",
      href: snapshot.storage.googleDriveConfigured ? "/os/health" : "/os/assets",
    });
  }

  return alerts.slice(0, 3);
}

function SummaryCard({ title, value, detail, icon: Icon, accent }: { title: string; value: string; detail: string; icon: typeof DollarSign; accent: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className={`mt-2 text-2xl font-semibold tracking-tight ${accent}`}>{value}</h3>
        </div>
        <div className="rounded-lg bg-secondary/60 p-2">
          <Icon className={`h-4 w-4 ${accent}`} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function TimelineEvent({ entry }: { entry: TimelineEntry }) {
  const timeLabel = formatDateTime(entry.timestamp);
  const Icon = entry.icon;

  return (
    <div className="relative pl-6 sm:pl-8">
      <div className={`absolute -left-[17px] top-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-card ${entry.bgColor}`}>
        <Icon className={`h-3.5 w-3.5 ${entry.color}`} />
      </div>
      <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
        <h4 className="text-sm font-semibold text-foreground">{entry.title}</h4>
        <span className="font-mono text-xs text-muted-foreground">{timeLabel}</span>
      </div>
      <p className="mb-2 text-sm leading-relaxed text-muted-foreground">{entry.description}</p>
      <div className="inline-flex items-center gap-1.5 rounded-md border border-border/50 bg-secondary px-2 py-1 text-xs font-medium text-foreground">
        <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
        {entry.entity}
      </div>
    </div>
  );
}

function AlertItem({ level, message, action, href }: { level: "critical" | "warning" | "success"; message: string; action: string; href?: string }) {
  const styles =
    level === "critical"
      ? "border-l-destructive bg-destructive/5 text-destructive"
      : level === "warning"
        ? "border-l-amber-500 bg-amber-500/5 text-amber-500"
        : "border-l-primary bg-primary/5 text-primary";

  return (
    <div className={`rounded-r-md border-l-2 pl-3 py-2 ${styles}`}>
      <p className="text-sm leading-snug text-foreground/90">{message}</p>
      {href ? (
        <Link href={href} className="mt-2 flex items-center gap-1 text-xs font-medium hover:underline">
          {action}
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      ) : (
        <button className="mt-2 flex items-center gap-1 text-xs font-medium hover:underline">
          {action}
          <ArrowUpRight className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
