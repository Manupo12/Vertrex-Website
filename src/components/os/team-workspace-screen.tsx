"use client";

import { Activity, AlertTriangle, Briefcase, ListTodo, Users } from "lucide-react";

import {
  EmptyWorkspacePanel,
  ErrorWorkspacePanel,
  LoadingWorkspacePanel,
  formatNumber,
} from "@/components/os/workspace-ui";
import { dealPipelineGroups, getDealPipelineGroup } from "@/lib/ops/deal-stages";
import { isOpenTaskStatus } from "@/lib/ops/status-catalog";
import { useWorkspaceSnapshot } from "@/lib/ops/use-workspace-snapshot";
import { useUIStore } from "@/lib/store/ui";

export default function TeamWorkspaceScreen() {
  const open = useUIStore((store) => store.open);
  const { snapshot, loading, error, refresh } = useWorkspaceSnapshot();

  const activeMembers = [...snapshot.tasks]
    .reduce((members, task) => {
      if (!task.owner || !isOpenTaskStatus(task.status)) return members;
      members.set(task.owner, (members.get(task.owner) ?? 0) + 1);
      return members;
    }, new Map<string, number>());

  const ownerStats = Array.from(
    snapshot.tasks.reduce<
      Map<
        string,
        {
          name: string;
          total: number;
          active: number;
          review: number;
          done: number;
          projects: Set<string>;
          clients: Set<string>;
          taskIds: string[];
        }
      >
    >((accumulator, task) => {
      const key = task.owner?.trim() || "Sin owner";
      const current = accumulator.get(key) ?? {
        name: key,
        total: 0,
        active: 0,
        review: 0,
        done: 0,
        projects: new Set<string>(),
        clients: new Set<string>(),
        taskIds: [],
      };

      current.total += 1;
      current.active += task.status === "in_progress" ? 1 : 0;
      current.review += task.status === "review" ? 1 : 0;
      current.done += task.status === "done" ? 1 : 0;
      if (task.projectName) current.projects.add(task.projectName);
      if (task.clientName) current.clients.add(task.clientName);
      current.taskIds.push(task.id);
      accumulator.set(key, current);
      return accumulator;
    }, new Map()),
  )
    .map(([, value]) => value)
    .sort((left, right) => right.active - left.active || right.total - left.total);

  const unassignedTasks = snapshot.tasks.filter((task) => !task.owner);
  const overloadedOwners = ownerStats.filter((owner) => owner.active >= 3 || owner.total >= 6);

  if (loading) {
    return <LoadingWorkspacePanel label="Cargando operación de equipo real..." />;
  }

  if (error) {
    return <ErrorWorkspacePanel message={error} onRetry={refresh} />;
  }

  if (snapshot.tasks.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyWorkspacePanel
          title="Team todavía no tiene carga operacional"
          description="Asigna owners reales a las tareas para que el escuadrón y la capacidad del equipo se puedan medir desde el OS."
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
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Team</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Capacidad y reparto operativo calculados desde owners reales de tareas, clientes y proyectos del workspace.
          </p>
        </div>
        <button className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80" onClick={refresh}>
          Actualizar
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Operadores detectados" value={String(ownerStats.length)} subtitle="Owners con carga registrada" icon={Users} />
        <MetricCard title="Trabajo activo" value={String(snapshot.tasks.filter((task) => task.status === "in_progress").length)} subtitle={`${formatNumber(snapshot.summary.openTasks)} tareas abiertas`} icon={Activity} />
        <MetricCard title="En revisión" value={String(snapshot.tasks.filter((task) => task.status === "review").length)} subtitle="QA o feedback pendiente" icon={Briefcase} />
        <MetricCard title="Sin owner" value={String(unassignedTasks.length)} subtitle="Brecha de asignación" icon={ListTodo} />
      </div>

      {overloadedOwners.length > 0 ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <div>
              <p className="font-semibold text-foreground">Sobrecarga potencial detectada</p>
              <p className="mt-1">
                {overloadedOwners.map((owner) => owner.name).join(", ")} tienen la mayor carga visible del sistema y deberían entrar en el radar de redistribución.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold text-foreground">Carga por owner</h2>
          </div>
          <div className="space-y-3 p-4">
            {ownerStats.map((owner) => (
              <div key={owner.name} className="rounded-xl border border-border/60 bg-secondary/20 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{owner.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {owner.projects.size} proyectos · {owner.clients.size} clientes · {owner.done} tareas cerradas
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>{owner.active} activas</span>
                    <span>{owner.review} review</span>
                    <span>{owner.total} total</span>
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.max(8, Math.min(100, owner.total * 12))}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold text-foreground">Tareas sin asignar</h2>
          </div>
          <div className="space-y-3 p-4">
            {unassignedTasks.length > 0 ? (
              unassignedTasks.map((task) => (
                <button
                  key={task.id}
                  className="w-full rounded-xl border border-border/60 bg-secondary/20 p-4 text-left transition-colors hover:border-primary/30 hover:bg-primary/5"
                  onClick={() => open("taskDetail", task.id)}
                >
                  <p className="text-sm font-semibold text-foreground">{task.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {task.projectName ?? task.clientName ?? "Sin contexto"}
                  </p>
                </button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Todas las tareas visibles tienen owner asignado.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon }: { title: string; value: string; subtitle: string; icon: typeof Users }) {
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
