"use client";

import { Activity, FlaskConical, Play, Target, TrendingUp, Wallet } from "lucide-react";
import { useMemo, useState } from "react";

import {
  EmptyWorkspacePanel,
  ErrorWorkspacePanel,
  LoadingWorkspacePanel,
  formatMoney,
  formatNumber,
} from "@/components/os/workspace-ui";
import { useWorkspaceSnapshot } from "@/lib/ops/use-workspace-snapshot";
import { dealPipelineGroups, getDealPipelineGroup } from "@/lib/ops/deal-stages";
import { isOpenTaskStatus } from "@/lib/ops/status-catalog";

export default function SandboxWorkspaceScreen() {
  const { snapshot, loading, error, refresh } = useWorkspaceSnapshot();
  const [scenario, setScenario] = useState<"new-project" | "portal-rollout" | "support-surge">("new-project");
  const [valueCents, setValueCents] = useState(4500000);
  const [durationWeeks, setDurationWeeks] = useState(8);
  const [extraTasks, setExtraTasks] = useState(6);

  const baseIncome = snapshot.transactions.filter((transaction) => transaction.type === "income").reduce((total, transaction) => total + transaction.amountCents, 0);
  const baseExpenses = snapshot.transactions.filter((transaction) => transaction.type === "expense").reduce((total, transaction) => total + transaction.amountCents, 0);
  const baseOpenTasks = snapshot.tasks.filter((task) => isOpenTaskStatus(task.status)).length;
  const basePortalCoverage = snapshot.clients.length > 0
    ? Math.round((snapshot.clients.filter((client) => client.portalUserId).length / snapshot.clients.length) * 100)
    : 0;

  const simulation = useMemo(() => {
    const operationalMultiplier = scenario === "new-project" ? 1.2 : scenario === "portal-rollout" ? 0.6 : 1.5;
    const projectedIncome = baseIncome + valueCents;
    const projectedExpenses = baseExpenses + Math.round(valueCents * (scenario === "portal-rollout" ? 0.12 : 0.28));
    const projectedNet = projectedIncome - projectedExpenses;
    const projectedTasks = baseOpenTasks + Math.round(extraTasks * operationalMultiplier);
    const projectedPortalCoverage = scenario === "portal-rollout"
      ? Math.min(100, basePortalCoverage + Math.max(10, Math.round(100 / Math.max(snapshot.clients.length, 1))))
      : basePortalCoverage;
    const viabilityScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          55
            + (projectedNet > 0 ? 15 : -10)
            + (projectedPortalCoverage > basePortalCoverage ? 10 : 0)
            - Math.max(0, projectedTasks - baseOpenTasks - 10) * 2,
        ),
      ),
    );

    return {
      projectedIncome,
      projectedExpenses,
      projectedNet,
      projectedTasks,
      projectedPortalCoverage,
      viabilityScore,
    };
  }, [baseExpenses, baseIncome, baseOpenTasks, basePortalCoverage, extraTasks, scenario, snapshot.clients.length, valueCents]);

  if (loading) {
    return <LoadingWorkspacePanel label="Cargando sandbox sobre la operación real..." />;
  }

  if (error) {
    return <ErrorWorkspacePanel message={error} onRetry={refresh} />;
  }

  if (snapshot.clients.length === 0 && snapshot.projects.length === 0 && snapshot.transactions.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyWorkspacePanel
          title="Sandbox necesita datos reales para simular"
          description="Registra clientes, proyectos y transacciones para ejecutar escenarios sobre la misma empresa que vive en el OS."
        />
        <button className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground" onClick={refresh}>
          Actualizar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Sandbox & Simulación</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Escenarios calculados sobre caja, carga operativa, proyectos y cobertura portal del mismo workspace empresarial.
          </p>
        </div>
        <button className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80" onClick={refresh}>
          Actualizar base
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <FlaskConical className="h-5 w-5 text-primary" /> Variables del escenario
            </h2>
          </div>
          <div className="space-y-4 p-4">
            <Field label="Tipo de decisión">
              <select
                value={scenario}
                onChange={(event) => setScenario(event.target.value as typeof scenario)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/40"
              >
                <option value="new-project">Aceptar nuevo proyecto</option>
                <option value="portal-rollout">Acelerar rollout de portal</option>
                <option value="support-surge">Absorber pico de soporte</option>
              </select>
            </Field>
            <Field label="Valor incremental (centavos)">
              <input
                type="number"
                value={valueCents}
                onChange={(event) => setValueCents(Number.parseInt(event.target.value || "0", 10) || 0)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/40"
              />
            </Field>
            <Field label="Duración estimada (semanas)">
              <input
                type="number"
                value={durationWeeks}
                onChange={(event) => setDurationWeeks(Number.parseInt(event.target.value || "0", 10) || 0)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/40"
              />
            </Field>
            <Field label="Tareas adicionales estimadas">
              <input
                type="number"
                value={extraTasks}
                onChange={(event) => setExtraTasks(Number.parseInt(event.target.value || "0", 10) || 0)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/40"
              />
            </Field>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 text-foreground">
                <Play className="h-4 w-4 text-primary" />
                <span className="font-semibold">Base viva del sistema</span>
              </div>
              <p className="mt-2">
                {formatNumber(snapshot.summary.projects)} proyectos, {formatNumber(baseOpenTasks)} tareas abiertas y {formatMoney(baseIncome - baseExpenses)} de caja neta actual.
              </p>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard title="Viabilidad" value={`${simulation.viabilityScore}/100`} subtitle={`${durationWeeks} semanas`} icon={Target} />
            <MetricCard title="Ingreso proyectado" value={formatMoney(simulation.projectedIncome)} subtitle="Base + escenario" icon={Wallet} />
            <MetricCard title="Caja neta proyectada" value={formatMoney(simulation.projectedNet)} subtitle="Después del impacto estimado" icon={TrendingUp} />
            <MetricCard title="Carga proyectada" value={String(simulation.projectedTasks)} subtitle="Tareas abiertas esperadas" icon={Activity} />
          </div>

          <section className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-lg font-semibold text-foreground">Impacto multidimensional</h2>
            </div>
            <div className="grid gap-4 p-4 md:grid-cols-3">
              <ImpactCard label="Finanzas" current={formatMoney(baseIncome - baseExpenses)} projected={formatMoney(simulation.projectedNet)} />
              <ImpactCard label="Operación" current={`${formatNumber(baseOpenTasks)} abiertas`} projected={`${formatNumber(simulation.projectedTasks)} abiertas`} />
              <ImpactCard label="Portal" current={`${basePortalCoverage}%`} projected={`${simulation.projectedPortalCoverage}%`} />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-lg font-semibold text-foreground">Lectura del OS</h2>
            </div>
            <div className="space-y-3 p-4 text-sm text-muted-foreground">
              <p>
                {simulation.viabilityScore >= 75
                  ? "El sistema considera el escenario saludable: mejora caja y no tensiona en exceso la operación actual."
                  : simulation.viabilityScore >= 55
                    ? "El escenario es viable con reservas: revisa carga operativa y secuencia de ejecución antes de comprometerlo."
                    : "El escenario presiona demasiado la estructura actual: conviene reforzar capacidad o renegociar alcance antes de ejecutarlo."}
              </p>
              <p>
                La simulación usa como base clientes, proyectos, tareas, eventos y transacciones vivas del workspace, no un mock separado.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2 text-sm text-muted-foreground">
      <span>{label}</span>
      {children}
    </label>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon }: { title: string; value: string; subtitle: string; icon: typeof FlaskConical }) {
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

function ImpactCard({ label, current, projected }: { label: string; current: string; projected: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-secondary/20 p-4">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <p className="mt-2 text-xs text-muted-foreground">Actual</p>
      <p className="text-sm font-medium text-foreground">{current}</p>
      <p className="mt-3 text-xs text-muted-foreground">Proyectado</p>
      <p className="text-sm font-medium text-primary">{projected}</p>
    </div>
  );
}
