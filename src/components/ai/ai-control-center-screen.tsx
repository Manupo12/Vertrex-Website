import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Bot,
  CheckSquare,
  Cpu,
  Database,
  History,
  Sparkles,
  Terminal,
  ToggleRight,
  Zap,
} from "lucide-react";

import type { AIControlCenterData, AITab } from "@/lib/ai/control-center";

type AIControlCenterScreenProps = {
  activeTab: AITab;
  data: AIControlCenterData;
};

const tabs: Array<{ key: AITab; label: string; icon: typeof Terminal; alert?: boolean }> = [
  { key: "console", label: "Consola Interactiva", icon: Terminal },
  { key: "autonomous", label: "Operaciones Autónomas", icon: Activity, alert: true },
  { key: "memory", label: "Memoria Empresarial", icon: Database },
  { key: "history", label: "Historial", icon: History },
  { key: "openclaw", label: "OpenClaw", icon: Cpu },
];

export default function AIControlCenterScreen({ activeTab, data }: AIControlCenterScreenProps) {
  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4 pb-4 animate-fade-in">
      <aside className="flex w-[280px] shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border bg-secondary/20 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Sparkles className="h-5 w-5 text-primary" /> IA Central
            </h2>
            <span className="rounded-md border border-border bg-background px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Vertrex OS
            </span>
          </div>
          <div className="flex items-center rounded-lg border border-border bg-background p-1 text-xs font-medium">
            <div className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-secondary px-2 py-1.5 text-foreground shadow-sm">
              <Cpu className="h-3.5 w-3.5 text-primary" /> OpenClaw
            </div>
            <div className="flex flex-1 items-center justify-center gap-1.5 px-2 py-1.5 text-muted-foreground">
              <Zap className="h-3.5 w-3.5" /> GPT-4o
            </div>
          </div>
        </div>

        <div className="mt-2 flex-1 space-y-5 overflow-y-auto p-2 no-scrollbar">
          <div>
            <div className="mb-1 flex items-center justify-between px-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Centro de Control</span>
            </div>
            {tabs.map((tab) => (
              <SidebarLink key={tab.key} tab={tab.key} label={tab.label} icon={tab.icon} active={activeTab === tab.key} alert={tab.alert} />
            ))}
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between px-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Historial reciente</span>
            </div>
            {data.promptHistory.slice(0, 4).map((item) => (
              <HistoryRow key={item.id} title={item.title} date={item.date} category={item.category} />
            ))}
          </div>

          <div className="mx-2 mb-2 rounded-xl border border-border bg-secondary/30 px-3 py-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-muted-foreground">
                <Database className="h-3 w-3" /> Motor RAG
              </span>
              <span className="h-2 w-2 rounded-full bg-primary"></span>
            </div>
            <p className="font-mono text-xs text-muted-foreground">Proyectos: {data.summary.projects}</p>
            <p className="font-mono text-xs text-muted-foreground">Memorias: {data.memoryEntries.length}</p>
          </div>
        </div>
      </aside>

      <main className="relative flex-1 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background/50 px-6 backdrop-blur-md">
          <div>
            <h2 className="text-base font-semibold text-foreground">{getTabTitle(activeTab)}</h2>
            <p className="text-xs text-muted-foreground">{getTabDescription(activeTab, data)}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1.5">
              <span className="text-xs font-semibold text-amber-500">Modo Autónomo</span>
              <ToggleRight className="h-5 w-5 text-amber-500" />
            </div>
            <Link href="/api/openclaw/status" className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <div className="h-[calc(100%-4rem)] overflow-y-auto p-6 no-scrollbar">
          {activeTab === "console" ? <ConsoleView data={data} /> : null}
          {activeTab === "autonomous" ? <AutonomousView data={data} /> : null}
          {activeTab === "memory" ? <MemoryView data={data} /> : null}
          {activeTab === "history" ? <HistoryView data={data} /> : null}
          {activeTab === "openclaw" ? <OpenClawView data={data} /> : null}
        </div>
      </main>
    </div>
  );
}

function ConsoleView({ data }: { data: AIControlCenterData }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
        <MetricCard label="Proyectos" value={String(data.summary.projects)} tone="primary" />
        <MetricCard label="Tareas abiertas" value={String(data.summary.openTasks)} tone="warning" />
        <MetricCard label="Tickets activos" value={String(data.summary.pendingTickets)} tone="warning" />
        <MetricCard label="Facturas pendientes" value={String(data.summary.pendingInvoices)} tone="success" />
        <MetricCard label="Clientes" value={String(data.summary.clients)} tone="primary" />
        <MetricCard label="Mensajes" value={String(data.summary.messages)} tone="success" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-border bg-background/40 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Consola operativa</p>
              <p className="text-xs text-muted-foreground">Resumen del estado actual del OS y del contexto que ve el agente.</p>
            </div>
            <div className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
              Contexto activo
            </div>
          </div>

          <div className="space-y-4">
            <ConversationBubble role="user" title="Founder" body="Dame el estado consolidado de clientes, tareas y operaciones OpenClaw con prioridad sobre bloqueos del portal." />
            <ConversationBubble
              role="assistant"
              title="IA COO"
              body={`Snapshot actual: ${data.summary.clients} clientes, ${data.summary.projects} proyectos, ${data.summary.documents} documentos, ${data.summary.messages} mensajes y ${data.openClaw.activeSessions} sesiones OpenClaw en línea.`}
            />
            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <div className="flex items-start gap-3">
                <CheckSquare className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Tools activas del agente</p>
                  <p className="mt-1 text-xs text-muted-foreground">getWorkspaceSnapshot · getPortalState · getFinanceSummary · searchMemory · callOpenClaw</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Panel title="Clientes recientes">
            <div className="space-y-3">
              {data.recentClients.map((client) => (
                <div key={client.id} className="rounded-xl border border-border bg-background/40 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">{client.name}</p>
                    <span className="text-xs font-mono text-primary">{client.projectCount} proyectos</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{client.openTicketCount} tickets abiertos · {client.portalAccessActive ? "Portal activo" : "Portal pendiente"}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Mensajes recientes">
            <div className="space-y-3">
              {data.recentMessages.map((message) => (
                <div key={message.id} className="rounded-xl border border-border bg-background/40 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">{message.clientName ?? "Sin cliente"}</p>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{message.senderRole}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{message.message}</p>
                  <p className="mt-2 text-[10px] font-mono text-muted-foreground">{message.createdAt}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="OpenClaw">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Conexión: <span className="font-semibold text-foreground">{data.openClaw.connected ? "Activa" : "Sin conexión"}</span></p>
              <p>Sesiones activas: <span className="font-semibold text-foreground">{data.openClaw.activeSessions}</span></p>
              <p>Última vez visto: <span className="font-semibold text-foreground">{data.openClaw.lastSeenAt ?? "Sin actividad"}</span></p>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function AutonomousView({ data }: { data: AIControlCenterData }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-black tracking-tight text-foreground">Operaciones autónomas</h3>
            <p className="mt-1 text-sm text-muted-foreground">Ejecuciones recientes del agente sobre tareas, memoria y coordinación operativa.</p>
          </div>
          <button className="rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground transition-colors hover:opacity-90">
            Iniciar operación larga
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Sin portal" value={String(data.relationalSignals.clientsWithoutPortal)} tone="warning" />
        <MetricCard label="Clientes activos sin proyecto" value={String(data.relationalSignals.activeDealsWithoutProject)} tone="warning" />
        <MetricCard label="Tickets sin proyecto" value={String(data.relationalSignals.openTicketsWithoutProject)} tone="warning" />
        <MetricCard label="Docs pendientes" value={String(data.relationalSignals.documentsPendingApproval)} tone="primary" />
      </div>

      <div className="grid gap-4">
        {data.autonomousRuns.map((run) => (
          <div key={run.id} className="rounded-2xl border border-border bg-background/40 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{run.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{run.summary}</p>
              </div>
              <div className="text-right">
                <StatusBadge value={run.status} />
                <p className="mt-2 text-[10px] font-mono text-muted-foreground">{run.updatedAt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MemoryView({ data }: { data: AIControlCenterData }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-black tracking-tight text-foreground">Memoria empresarial</h3>
          <p className="mt-1 text-sm text-muted-foreground">Entradas persistentes de IA, configuración del motor y contexto operativo.</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg border border-border px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground">
            Crear memoria
          </button>
          <Link href="/api/openclaw/memory" className="rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground transition-colors hover:opacity-90">
            Ver API
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-background/40">
        <div className="grid grid-cols-[1.2fr_0.7fr_2fr_0.8fr] border-b border-border px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <span>Key</span>
          <span>Categoría</span>
          <span>Contenido</span>
          <span>Actualizado</span>
        </div>
        {data.memoryEntries.map((entry) => (
          <div key={entry.id} className="grid grid-cols-[1.2fr_0.7fr_2fr_0.8fr] gap-3 border-b border-border/60 px-4 py-4 text-sm last:border-b-0">
            <span className="font-mono text-foreground">{entry.key}</span>
            <span className="text-muted-foreground">{entry.category}</span>
            <span className="text-foreground/90">{entry.content}</span>
            <span className="text-xs text-muted-foreground">{entry.updatedAt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryView({ data }: { data: AIControlCenterData }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-black tracking-tight text-foreground">Historial de prompts</h3>
        <p className="mt-1 text-sm text-muted-foreground">Secuencia reciente de contexto y memoria utilizada por IA/OpenClaw.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {data.promptHistory.map((item) => (
          <div key={item.id} className="rounded-2xl border border-border bg-background/40 p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <span className="rounded-full border border-border px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {item.category}
              </span>
            </div>
            <p className="mt-3 text-xs font-mono text-muted-foreground">{item.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OpenClawView({ data }: { data: AIControlCenterData }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-background/40 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-black tracking-tight text-foreground">
              <Bot className="h-5 w-5 text-primary" /> Panel de OpenClaw
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">Estado de conexión, sesiones recientes, logs y acceso directo a la API del agente local.</p>
          </div>
          <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
            {data.openClaw.connected ? "Conectado" : "Desconectado"}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Panel title="Sesiones">
          <div className="space-y-3">
            {data.openClaw.sessions.length > 0 ? (
              data.openClaw.sessions.map((session) => (
                <div key={session.id} className="rounded-xl border border-border bg-background/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-sm text-foreground">{session.sessionKey}</p>
                    <StatusBadge value={session.status} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Última vez visto: {session.lastSeenAt}</p>
                </div>
              ))
            ) : (
              <EmptyState label="Aún no hay sesiones OpenClaw registradas." />
            )}
          </div>
        </Panel>

        <Panel title="Actividad reciente">
          <div className="space-y-3">
            {data.openClaw.logs.length > 0 ? (
              data.openClaw.logs.map((log) => (
                <div key={log.id} className="rounded-xl border border-border bg-background/30 p-4">
                  <p className="text-sm font-semibold text-foreground">{log.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{log.summary}</p>
                  <p className="mt-2 text-[10px] font-mono text-muted-foreground">{log.updatedAt}</p>
                </div>
              ))
            ) : (
              <EmptyState label="Todavía no hay logs en memoria para OpenClaw." />
            )}
          </div>
        </Panel>
      </div>

      <div className="rounded-2xl border border-border bg-background/40 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Atajos de integración</h4>
            <p className="mt-2 text-sm text-foreground/90">Usa estos endpoints para verificar estado, enviar mensajes o recibir webhooks.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/api/openclaw/status" className="rounded-lg border border-border px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground">
              Status
            </Link>
            <Link href="/api/openclaw/ai/chat" className="rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground transition-colors hover:opacity-90">
              AI Chat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({
  tab,
  label,
  icon: Icon,
  active,
  alert,
}: {
  tab: AITab;
  label: string;
  icon: typeof Terminal;
  active: boolean;
  alert?: boolean;
}) {
  return (
    <Link
      href={tab === "console" ? "/os/ai" : `/os/ai?tab=${tab}`}
      className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors ${
        active ? "bg-secondary font-medium text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`h-4 w-4 ${active ? "text-foreground" : "opacity-70 group-hover:opacity-100"}`} />
        <span className="text-sm">{label}</span>
      </div>
      {alert ? <span className="flex h-2 w-2 rounded-full bg-amber-500"></span> : null}
    </Link>
  );
}

function HistoryRow({ title, date, category }: { title: string; date: string; category: string }) {
  return (
    <div className="rounded-lg px-3 py-2 transition-colors hover:bg-secondary/50">
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-sm font-medium text-muted-foreground">{title}</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">{category}</span>
      </div>
      <span className="font-mono text-[10px] text-muted-foreground/60">{date}</span>
    </div>
  );
}

function ConversationBubble({ role, title, body }: { role: "user" | "assistant"; title: string; body: string }) {
  return (
    <div className="flex gap-4">
      <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${role === "assistant" ? "border-primary/30 bg-primary/20 text-primary" : "border-border bg-secondary text-foreground"}`}>
        {role === "assistant" ? <Sparkles className="h-4 w-4" /> : "VO"}
      </div>
      <div className="flex-1 pt-1.5">
        <h4 className={`mb-1 text-sm font-semibold ${role === "assistant" ? "text-primary" : "text-foreground"}`}>{title}</h4>
        <p className="text-sm leading-relaxed text-foreground/90">{body}</p>
      </div>
    </div>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: string; tone: "primary" | "warning" | "success" }) {
  const toneClassName = tone === "primary" ? "text-foreground" : tone === "warning" ? "text-amber-500" : "text-primary";

  return (
    <div className="rounded-2xl border border-border bg-background/40 p-5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`mt-3 text-3xl font-black ${toneClassName}`}>{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-background/40 p-6">
      <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">{title}</h4>
      {children}
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  const normalized = value.toLowerCase();
  const className =
    normalized === "active" || normalized === "done" || normalized === "resolved"
      ? "border-primary/20 bg-primary/10 text-primary"
      : normalized === "pending" || normalized === "in_progress" || normalized === "review"
        ? "border-amber-500/20 bg-amber-500/10 text-amber-500"
        : "border-border bg-secondary text-muted-foreground";

  return <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${className}`}>{normalized.replace(/_/g, " ")}</span>;
}

function EmptyState({ label }: { label: string }) {
  return <div className="rounded-xl border border-dashed border-border bg-background/20 px-4 py-6 text-sm text-muted-foreground">{label}</div>;
}

function getTabTitle(tab: AITab) {
  switch (tab) {
    case "autonomous":
      return "Operaciones Autónomas";
    case "memory":
      return "Memoria Empresarial";
    case "history":
      return "Historial de Prompts";
    case "openclaw":
      return "Panel OpenClaw";
    default:
      return "Consola Interactiva";
  }
}

function getTabDescription(tab: AITab, data: AIControlCenterData) {
  switch (tab) {
    case "autonomous":
      return `${data.autonomousRuns.length} ejecuciones recientes y ${data.relationalSignals.clientsWithoutPortal + data.relationalSignals.activeDealsWithoutProject + data.relationalSignals.openTicketsWithoutProject} señales operativas listas para automatizar.`;
    case "memory":
      return `${data.memoryEntries.length} memorias persistentes visibles en la base de datos.`;
    case "history":
      return `${data.promptHistory.length} eventos recientes de contexto y memoria.`;
    case "openclaw":
      return `${data.openClaw.activeSessions} sesiones OpenClaw activas y ${data.openClaw.logs.length} logs recientes.`;
    default:
      return `Contexto activo: ${data.summary.clients} clientes, ${data.summary.projects} proyectos, ${data.summary.documents} documentos y ${data.summary.messages} mensajes.`;
  }
}
