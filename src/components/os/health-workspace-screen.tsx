import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import { EmptyWorkspacePanel, formatDateTime } from "@/components/os/workspace-ui";
import type {
  WorkspaceHealthIssue,
  WorkspaceHealthSnapshot,
  WorkspaceHealthStatus,
} from "@/lib/ops/workspace-health";

export default function HealthWorkspaceScreen({ snapshot }: { snapshot: WorkspaceHealthSnapshot }) {
  const healthyModules = snapshot.modules.filter((module) => module.status === "healthy").length;

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-border bg-card p-2 text-primary">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">Salud operativa</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Riesgos accionables y estado por módulo derivados del snapshot operativo real.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={snapshot.overallStatus} label={getOverallLabel(snapshot.overallStatus)} />
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            Actualizado {formatDateTime(snapshot.generatedAt)}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Riesgos críticos"
          value={String(snapshot.counts.critical)}
          detail="Bloqueos o incumplimientos que requieren atención inmediata."
          tone="critical"
        />
        <MetricCard
          title="Riesgos en observación"
          value={String(snapshot.counts.warning)}
          detail="Señales tempranas que aún pueden corregirse sin escalamiento."
          tone="warning"
        />
        <MetricCard
          title="Módulos saludables"
          value={String(healthyModules)}
          detail="Módulos sin alertas activas en este corte compatible."
          tone="healthy"
        />
        <MetricCard
          title="Total de señales"
          value={String(snapshot.counts.total)}
          detail="Suma de issues detectados por las reglas actuales de health."
          tone="neutral"
        />
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-lg font-medium text-foreground">Estado por módulo</h2>
          <span className="text-xs text-muted-foreground">Semáforo compatible sin migración</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {snapshot.modules.map((module) => (
            <Link
              key={module.key}
              href={module.path}
              className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-[0_0_15px_rgba(0,255,135,0.05)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{module.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{module.summary}</p>
                </div>
                <StatusBadge status={module.status} label={getOverallLabel(module.status)} compact />
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{module.issueCount} señales activas</span>
                <span className="inline-flex items-center gap-1 group-hover:text-foreground">
                  Abrir módulo
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {snapshot.projectScores.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="text-lg font-medium text-foreground">Salud por proyecto</h2>
            <span className="text-xs text-muted-foreground">Score derivado del snapshot</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {snapshot.projectScores.map((project) => (
              <div key={project.projectId} className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{project.projectName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {project.score}/{project.maxScore} puntos
                    </p>
                  </div>
                  <StatusBadge status={project.status} label={project.status === "critical" ? "Crítico" : project.status === "warning" ? "Atención" : "Saludable"} compact />
                </div>
                <div className="mt-4 space-y-1">
                  {project.reasons.map((reason, index) => (
                    <p key={index} className="text-xs text-muted-foreground">• {reason}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {snapshot.clientScores.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="text-lg font-medium text-foreground">Salud por cliente</h2>
            <span className="text-xs text-muted-foreground">Score derivado del snapshot</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {snapshot.clientScores.map((client) => (
              <div key={client.clientId} className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{client.clientName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {client.score}/{client.maxScore} puntos
                    </p>
                  </div>
                  <StatusBadge status={client.status} label={client.status === "critical" ? "Crítico" : client.status === "warning" ? "Atención" : "Saludable"} compact />
                </div>
                <div className="mt-4 space-y-1">
                  {client.reasons.map((reason, index) => (
                    <p key={index} className="text-xs text-muted-foreground">• {reason}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-lg font-medium text-foreground">Riesgos activos</h2>
          <span className="text-xs text-muted-foreground">Ordenados por severidad</span>
        </div>
        {snapshot.issues.length > 0 ? (
          <div className="space-y-3">
            {snapshot.issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        ) : (
          <EmptyWorkspacePanel
            title="Sin riesgos activos"
            description="El corte actual no detectó señales críticas ni warnings sobre los módulos cubiertos por esta primera capa de health."
          />
        )}
      </section>
    </div>
  );
}

function MetricCard({
  title,
  value,
  detail,
  tone,
}: {
  title: string;
  value: string;
  detail: string;
  tone: "critical" | "warning" | "healthy" | "neutral";
}) {
  const toneClass =
    tone === "critical"
      ? "text-destructive"
      : tone === "warning"
        ? "text-amber-500"
        : tone === "healthy"
          ? "text-primary"
          : "text-blue-400";

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <h3 className={`mt-2 text-3xl font-semibold tracking-tight ${toneClass}`}>{value}</h3>
      <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function IssueCard({ issue }: { issue: WorkspaceHealthIssue }) {
  const styles =
    issue.severity === "critical"
      ? "border-destructive/30 bg-destructive/5"
      : "border-amber-500/30 bg-amber-500/5";
  const iconTone = issue.severity === "critical" ? "text-destructive" : "text-amber-500";

  return (
    <div className={`rounded-xl border p-5 ${styles}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div className={`rounded-lg border border-current/15 bg-background/60 p-2 ${iconTone}`}>
            {issue.severity === "critical" ? <ShieldAlert className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-foreground">{issue.title}</p>
              <span className="rounded-full border border-border bg-card px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                {issue.module}
              </span>
              <StatusBadge status={issue.severity === "critical" ? "critical" : "warning"} label={issue.severity === "critical" ? "Crítico" : "Warning"} compact />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{issue.message}</p>
          </div>
        </div>
        <Link
          href={issue.actionPath}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-wide text-foreground transition-colors hover:border-primary/30 hover:text-primary"
        >
          {issue.actionLabel}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function StatusBadge({ status, label, compact = false }: { status: WorkspaceHealthStatus; label: string; compact?: boolean }) {
  const classes =
    status === "critical"
      ? "border-destructive/30 bg-destructive/10 text-destructive"
      : status === "warning"
        ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
        : "border-primary/20 bg-primary/10 text-primary";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${classes} ${compact ? "" : ""}`}
    >
      {status === "healthy" ? <ShieldCheck className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
      {label}
    </span>
  );
}

function getOverallLabel(status: WorkspaceHealthStatus) {
  return status === "critical" ? "Crítico" : status === "warning" ? "En observación" : "Saludable";
}
