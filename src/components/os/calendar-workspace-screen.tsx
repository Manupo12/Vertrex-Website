"use client";

import { useMemo } from "react";
import { CalendarDays, Clock3, MapPin, Plus, Users, Video } from "lucide-react";

import {
  EmptyWorkspacePanel,
  ErrorWorkspacePanel,
  LoadingWorkspacePanel,
  formatDate,
  formatDateTime,
  formatNumber,
} from "@/components/os/workspace-ui";
import { useWorkspaceSnapshot } from "@/lib/ops/use-workspace-snapshot";
import type { WorkspaceEventRecord } from "@/lib/ops/workspace-service";
import type { UIStore } from "@/lib/store/ui";

type CalendarWorkspaceScreenProps = {
  open: UIStore["open"];
};

type EventGroup = {
  label: string;
  dateKey: string;
  events: WorkspaceEventRecord[];
};

export default function CalendarWorkspaceScreen({ open }: CalendarWorkspaceScreenProps) {
  const { snapshot, loading, error, refresh } = useWorkspaceSnapshot();

  const sortedEvents = [...snapshot.events].sort(
    (left, right) => new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime(),
  );
  const upcomingEvents = sortedEvents.slice(0, 4);
  const groupedEvents = useMemo<EventGroup[]>(() => groupEventsByDate(sortedEvents), [sortedEvents]);
  const nextWindow = buildNextWindow(sortedEvents);

  if (loading) {
    return <LoadingWorkspacePanel label="Cargando agenda operativa real..." />;
  }

  if (error) {
    return <ErrorWorkspacePanel message={error} onRetry={refresh} />;
  }

  if (snapshot.events.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyWorkspacePanel
          title="No hay eventos reales en la agenda"
          description="Crea reuniones, follow-ups o sesiones internas para activar el calendario operativo sincronizado."
        />
        <div className="flex gap-3">
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" onClick={() => open("createEvent")}>
            Crear evento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Agenda</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatNumber(snapshot.events.length)} eventos sincronizados en el calendario operativo del workspace.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80" onClick={refresh}>
            Actualizar
          </button>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_0_15px_rgba(0,255,135,0.2)] transition-all hover:shadow-[0_0_25px_rgba(0,255,135,0.35)]" onClick={() => open("createEvent")}>
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Nuevo evento
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Eventos próximos" value={String(snapshot.summary.upcomingEvents)} subtitle={upcomingEvents[0] ? upcomingEvents[0].title : "Sin eventos"} icon={CalendarDays} />
        <MetricCard title="Esta semana" value={String(nextWindow.thisWeek)} subtitle="Eventos en los próximos 7 días" icon={Clock3} />
        <MetricCard title="Con cliente" value={String(sortedEvents.filter((event) => Boolean(event.clientId)).length)} subtitle="Sesiones vinculadas a cuentas" icon={Users} />
        <MetricCard title="Con videollamada" value={String(sortedEvents.filter((event) => Boolean(event.meetUrl)).length)} subtitle="Eventos listos para acceso remoto" icon={Video} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <section className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-lg font-semibold text-foreground">Próximos hitos</h2>
            </div>
            <div className="space-y-3 p-4">
              {upcomingEvents.map((event) => (
                <button key={event.id} className="w-full rounded-xl border border-border/60 bg-secondary/20 p-4 text-left transition-colors hover:border-primary/30 hover:bg-primary/5" onClick={() => open("eventDetail", event.id)}>
                  <p className="text-sm font-semibold text-foreground">{event.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(event.startsAt)}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{event.clientName ?? "Interno"}</span>
                    <span>·</span>
                    <span>{event.kind}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-lg font-semibold text-foreground">Radar semanal</h2>
            </div>
            <div className="space-y-4 p-5">
              <RadarItem label="Hoy" value={nextWindow.today} />
              <RadarItem label="Mañana" value={nextWindow.tomorrow} />
              <RadarItem label="Próx. 7 días" value={nextWindow.thisWeek} />
            </div>
          </section>
        </aside>

        <section className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold text-foreground">Timeline de agenda</h2>
          </div>
          <div className="space-y-8 p-5">
            {groupedEvents.map((group) => (
              <div key={group.dateKey} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border"></div>
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {group.label}
                  </span>
                  <div className="h-px flex-1 bg-border"></div>
                </div>
                <div className="space-y-3">
                  {group.events.map((event) => (
                    <button key={event.id} className="w-full rounded-xl border border-border/60 bg-secondary/20 p-4 text-left transition-colors hover:border-primary/30 hover:bg-primary/5" onClick={() => open("eventDetail", event.id)}>
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <p className="text-base font-semibold text-foreground">{event.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{event.description ?? "Sin descripción"}</p>
                        </div>
                        <span className="rounded-full border border-border bg-background px-3 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                          {event.kind}
                        </span>
                      </div>
                      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4" />
                          <span>{formatEventWindow(event.startsAt, event.endsAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{event.attendees.length > 0 ? `${event.attendees.length} asistentes` : "Sin asistentes"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location ?? event.clientName ?? "Interno"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          <span>{event.meetUrl ? "Meet disponible" : "Sin videollamada"}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function groupEventsByDate(events: WorkspaceEventRecord[]) {
  const groups = new Map<string, WorkspaceEventRecord[]>();

  for (const event of events) {
    const dateKey = new Date(event.startsAt).toISOString().slice(0, 10);
    const existing = groups.get(dateKey) ?? [];
    existing.push(event);
    groups.set(dateKey, existing);
  }

  return Array.from(groups.entries()).map(([dateKey, grouped]) => ({
    dateKey,
    label: formatDate(grouped[0]?.startsAt ?? dateKey),
    events: grouped,
  }));
}

function buildNextWindow(events: WorkspaceEventRecord[]) {
  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowKey = tomorrow.toISOString().slice(0, 10);
  const limit = new Date(now);
  limit.setDate(now.getDate() + 7);

  let today = 0;
  let tomorrowCount = 0;
  let thisWeek = 0;

  for (const event of events) {
    const eventDate = new Date(event.startsAt);
    const dateKey = eventDate.toISOString().slice(0, 10);

    if (dateKey === todayKey) {
      today += 1;
    }

    if (dateKey === tomorrowKey) {
      tomorrowCount += 1;
    }

    if (eventDate <= limit) {
      thisWeek += 1;
    }
  }

  return {
    today,
    tomorrow: tomorrowCount,
    thisWeek,
  };
}

function formatEventWindow(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "Horario pendiente";
  }

  const startLabel = new Intl.DateTimeFormat("es-CO", {
    hour: "numeric",
    minute: "2-digit",
  }).format(start);
  const endLabel = new Intl.DateTimeFormat("es-CO", {
    hour: "numeric",
    minute: "2-digit",
  }).format(end);

  return `${startLabel} - ${endLabel}`;
}

function MetricCard({ title, value, subtitle, icon: Icon }: { title: string; value: string; subtitle: string; icon: typeof CalendarDays }) {
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

function RadarItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-secondary/20 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-base font-semibold text-foreground">{value}</span>
    </div>
  );
}
