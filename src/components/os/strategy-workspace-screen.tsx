"use client";

import { BarChart3, Plus, Target, TrendingUp, Zap } from "lucide-react";

import {
  EmptyWorkspacePanel,
  ErrorWorkspacePanel,
  LoadingWorkspacePanel,
  formatMoney,
  formatNumber,
} from "@/components/os/workspace-ui";
import { dealPipelineGroups, getDealPipelineGroup } from "@/lib/ops/deal-stages";
import { isOutstandingInvoiceStatus, isOpenTaskStatus } from "@/lib/ops/status-catalog";
import { useWorkspaceSnapshot } from "@/lib/ops/use-workspace-snapshot";
import { useUIStore } from "@/lib/store/ui";

export default function StrategyWorkspaceScreen() {
  const open = useUIStore((store) => store.open);
  const { snapshot, loading, error, refresh } = useWorkspaceSnapshot();

  const totalDeals = snapshot.deals.length;
  const activeClientDeals = snapshot.deals.filter((deal) => getDealPipelineGroup(deal.stage).key === "activo").length;
  const avgProjectProgress = snapshot.projects.length > 0
    ? Math.round(snapshot.projects.reduce((total, project) => total + project.progress, 0) / snapshot.projects.length)
    : 0;
  const portalCoverage = snapshot.clients.length > 0
    ? Math.round((snapshot.clients.filter((client) => client.portalUserId).length / snapshot.clients.length) * 100)
    : 0;
  const pendingInvoicesAmount = snapshot.invoices
    .filter((invoice) => isOutstandingInvoiceStatus(invoice.status))
    .reduce((total, invoice) => total + invoice.amountCents, 0);
  const openTasks = snapshot.tasks.filter((task) => isOpenTaskStatus(task.status)).length;
  const reviewTasks = snapshot.tasks.filter((task) => task.status === "review").length;

  const objectives = [
    {
      title: "Escalar adquisición rentable",
      progress: totalDeals > 0 ? Math.round((activeClientDeals / totalDeals) * 100) : 0,
      owner: "Revenue Engine",
      keyResults: [
        { label: "Deals cliente activo", current: activeClientDeals, target: Math.max(3, totalDeals), status: activeClientDeals >= Math.max(1, Math.ceil(totalDeals * 0.35)) ? "on-track" : "at-risk" },
        { label: "Pipeline ponderado", current: formatMoney(snapshot.deals.reduce((total, deal) => total + Math.round((deal.valueCents * deal.probability) / 100), 0)), target: formatMoney(Math.max(snapshot.deals.reduce((total, deal) => total + deal.valueCents, 0), 1)), status: totalDeals > 0 ? "on-track" : "behind" },
      ],
    },
    {
      title: "Entregar con control operativo",
      progress: avgProjectProgress,
      owner: "Delivery Ops",
      keyResults: [
        { label: "Avance medio proyectos", current: `${avgProjectProgress}%`, target: "80%+", status: avgProjectProgress >= 65 ? "on-track" : "behind" },
        { label: "Tareas en review", current: reviewTasks, target: Math.max(2, Math.ceil(openTasks * 0.2)), status: reviewTasks <= Math.max(2, Math.ceil(openTasks * 0.2)) ? "on-track" : "at-risk" },
      ],
    },
    {
      title: "Profundizar autoservicio cliente",
      progress: portalCoverage,
      owner: "Client Success",
      keyResults: [
        { label: "Cobertura portal", current: `${portalCoverage}%`, target: "100%", status: portalCoverage >= 70 ? "on-track" : "at-risk" },
        { label: "Cobro abierto por recuperar", current: formatMoney(pendingInvoicesAmount), target: formatMoney(Math.max(Math.round(pendingInvoicesAmount * 0.5), 1)), status: pendingInvoicesAmount === 0 ? "done" : "at-risk" },
      ],
    },
  ];

  if (loading) {
    return <LoadingWorkspacePanel label="Cargando dirección estratégica conectada..." />;
  }

  if (error) {
    return <ErrorWorkspacePanel message={error} onRetry={refresh} />;
  }

  if (snapshot.clients.length === 0 && snapshot.projects.length === 0 && snapshot.deals.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyWorkspacePanel
          title="Strategy todavía no tiene señales operativas"
          description="Necesitas deals, proyectos y clientes reales para convertir la dirección estratégica en un tablero de ejecución."
        />
        <div className="flex gap-3">
          <button className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground" onClick={refresh}>
            Actualizar
          </button>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" onClick={() => open("createDeal")}>
            Crear deal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Dirección Estratégica</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Objetivos ejecutivos calculados desde ventas, delivery, portal y finanzas del mismo OS.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
            onClick={refresh}
          >
            <span className="inline-flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Actualizar
            </span>
          </button>
          <button
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            onClick={() => open("omniCreator")}
          >
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Nuevo objetivo operativo
            </span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/20 bg-card p-5 shadow-[0_0_30px_rgba(0,255,135,0.04)]">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Insight estratégico cruzado</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Hoy el OS muestra {formatNumber(snapshot.summary.projects)} proyectos, {formatNumber(openTasks)} tareas abiertas y {formatNumber(snapshot.clients.filter((client) => client.portalUserId).length)} clientes con portal.
              La estrategia ya puede priorizar sobre capacidad, cashflow y activación cliente con datos reales.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {objectives.map((objective) => (
          <ObjectiveCard key={objective.title} title={objective.title} progress={objective.progress} owner={objective.owner} keyResults={objective.keyResults} />
        ))}
      </div>
    </div>
  );
}

function ObjectiveCard({ title, progress, owner, keyResults }: { title: string; progress: number; owner: string; keyResults: Array<{ label: string; current: string | number; target: string | number; status: string }> }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-secondary p-2 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              <p className="text-xs text-muted-foreground">Responsable: {owner}</p>
            </div>
          </div>
          <div className="min-w-[220px]">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-semibold text-primary">{progress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.max(4, progress)}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3 p-4">
        {keyResults.map((result) => (
          <div key={`${title}-${result.label}`} className="rounded-xl border border-border/60 bg-secondary/20 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{result.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">Actual: {result.current} · Meta: {result.target}</p>
              </div>
              <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${result.status === "done" ? "border-blue-500/30 bg-blue-500/10 text-blue-500" : result.status === "on-track" ? "border-primary/30 bg-primary/10 text-primary" : result.status === "at-risk" ? "border-amber-500/30 bg-amber-500/10 text-amber-500" : "border-destructive/30 bg-destructive/10 text-destructive"}`}>
                {result.status === "done" ? "done" : result.status === "on-track" ? "on track" : result.status === "at-risk" ? "at risk" : "behind"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
