import React from "react";
import { 
  Plus, Filter, SlidersHorizontal, LayoutGrid, List, 
  AlertTriangle, GitCommit, Network, MoreHorizontal, MessageSquare, 
  Paperclip, Clock, CheckCircle2, Circle, ArrowUpRight
} from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      {/* 1. HEADER & CONTROLES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Desarrollo Nexus
          </h1>
          <div className="h-6 w-px bg-border hidden sm:block"></div>
          {/* View Switcher (List, Kanban, Graph) */}
          <div className="hidden sm:flex bg-secondary border border-border p-1 rounded-lg">
            <ViewButton icon={List} label="Lista" />
            <ViewButton icon={LayoutGrid} label="Tablero" active={true} />
            <ViewButton icon={Network} label="Dependencias" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground bg-card border border-border rounded-md hover:text-foreground hover:bg-muted transition-colors">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground bg-card border border-border rounded-md hover:text-foreground hover:bg-muted transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            Vista
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-primary-foreground bg-primary rounded-md shadow-[0_0_15px_rgba(0,255,135,0.2)] hover:shadow-[0_0_25px_rgba(0,255,135,0.4)] transition-all">
            <Plus className="w-4 h-4" />
            Nueva Tarea
          </button>
        </div>
      </div>

      {/* 2. KANBAN BOARD (Scrollable Area) */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden no-scrollbar pb-4">
        <div className="flex h-full gap-4 min-w-max px-1">
          
          {/* COLUMNA: TODO */}
          <KanbanColumn title="Por Hacer" count={3} color="text-slate-400">
            <TaskCard 
              id="NEX-142" 
              title="Diseñar arquitectura de Entity Linking" 
              priority="high"
              labels={["Arquitectura", "Backend"]}
              entityLink="Docs"
            />
            <TaskCard 
              id="NEX-143" 
              title="Configurar Webhooks de Stripe" 
              priority="medium"
              labels={["Finanzas", "API"]}
              comments={2}
            />
            <TaskCard 
              id="NEX-145" 
              title="Redactar PRD de la Fase 2" 
              priority="low"
              labels={["Producto"]}
              entityLink="Cliente Y"
            />
          </KanbanColumn>

          {/* COLUMNA: IN PROGRESS */}
          <KanbanColumn title="En Progreso" count={2} color="text-primary">
            <TaskCard 
              id="NEX-140" 
              title="Implementar Omni-Switcher en Next.js" 
              priority="urgent"
              labels={["Frontend", "UX"]}
              assignee="JM"
              attachments={3}
              isTracking={true}
            />
            <TaskCard 
              id="NEX-141" 
              title="Migración a Tailwind v4 y Variables CSS" 
              priority="high"
              labels={["Frontend", "Infra"]}
              assignee="JM"
            />
          </KanbanColumn>

          {/* COLUMNA: IN REVIEW */}
          <KanbanColumn title="En Revisión" count={1} color="text-amber-400">
            <TaskCard 
              id="NEX-138" 
              title="Auditoría de seguridad (RBAC)" 
              priority="high"
              labels={["Seguridad"]}
              assignee="SR"
              comments={5}
            />
          </KanbanColumn>

          {/* COLUMNA: DONE */}
          <KanbanColumn title="Completado" count={12} color="text-muted-foreground">
            <TaskCard 
              id="NEX-135" 
              title="Setup inicial del repositorio" 
              priority="low"
              labels={["Infra"]}
              isDone={true}
            />
          </KanbanColumn>

          {/* ADD COLUMN GHOST */}
          <div className="w-[320px] shrink-0 rounded-xl border border-dashed border-border/50 bg-card/10 flex items-center justify-center text-muted-foreground hover:bg-card/30 hover:text-foreground hover:border-border cursor-pointer transition-colors h-[100px] mt-10">
            <Plus className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Añadir Estado</span>
          </div>

        </div>
      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTES DEL KANBAN
// ==========================================

function ViewButton({ icon: Icon, label, active }: any) {
  return (
    <button className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${
      active ? "bg-background text-foreground shadow-sm border border-border/50" : "text-muted-foreground hover:text-foreground hover:bg-muted"
    }`} title={label}>
      <Icon className="w-4 h-4" />
    </button>
  );
}

function KanbanColumn({ title, count, color, children }: any) {
  return (
    <div className="w-[320px] shrink-0 flex flex-col h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1 sticky top-0 bg-background/95 backdrop-blur z-10 py-2">
        <div className="flex items-center gap-2">
          <Circle className={`w-3.5 h-3.5 ${color} fill-current/20`} />
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <span className="text-xs font-medium text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-md">
            {count}
          </span>
        </div>
        <button className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      
      {/* Column Content (Scrollable Independiente si es necesario) */}
      <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar pb-10">
        {children}
      </div>
    </div>
  );
}

function TaskCard({ 
  id, title, priority, labels = [], assignee, 
  comments, attachments, isTracking, isDone, entityLink 
}: any) {
  
  // Iconos y colores de prioridad estilo Linear
  const priorityStyles: Record<string, any> = {
    urgent: { icon: AlertTriangle, color: "text-destructive" }, // Asume que importarías AlertTriangle si se usa
    high: { icon: GitCommit, color: "text-amber-500" },
    medium: { icon: GitCommit, color: "text-blue-400" },
    low: { icon: GitCommit, color: "text-muted-foreground" }
  };
  
  const pStyle = priorityStyles[priority] || priorityStyles.low;
  const PriorityIcon = pStyle.icon;

  return (
    <div className={`group bg-card border border-border rounded-xl p-3.5 cursor-pointer shadow-sm transition-all hover:border-primary/40 hover:shadow-[0_4px_20px_rgba(0,255,135,0.03)] flex flex-col gap-3 relative overflow-hidden ${isDone ? "opacity-60" : ""}`}>
      
      {/* Tracking indicator (Borde superior luminoso) */}
      {isTracking && (
        <div className="absolute top-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_8px_rgba(0,255,135,0.8)]"></div>
      )}

      {/* Top row: ID & Entity Link */}
      <div className="flex justify-between items-center text-xs text-muted-foreground font-mono">
        <span>{id}</span>
        {entityLink && (
          <div className="flex items-center gap-1 bg-secondary/50 px-1.5 py-0.5 rounded text-[10px] uppercase font-sans font-medium text-foreground border border-border/50 group-hover:border-primary/30 transition-colors">
            <ArrowUpRight className="w-3 h-3" />
            {entityLink}
          </div>
        )}
      </div>

      {/* Task Title */}
      <h4 className={`text-sm font-medium leading-snug ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}>
        {title}
      </h4>

      {/* Labels */}
      {labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {labels.map((label: string) => (
            <span key={label} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Bottom row: Meta & Assignee */}
      <div className="flex items-center justify-between mt-1 pt-3 border-t border-border/30">
        <div className="flex items-center gap-3 text-muted-foreground">
          <PriorityIcon className={`w-3.5 h-3.5 ${pStyle.color}`} />
          
          {(comments || attachments || isTracking) && (
            <div className="flex items-center gap-2">
              {comments && <span className="flex items-center gap-1 text-xs"><MessageSquare className="w-3 h-3"/> {comments}</span>}
              {attachments && <span className="flex items-center gap-1 text-xs"><Paperclip className="w-3 h-3"/> {attachments}</span>}
              {isTracking && <span className="flex items-center gap-1 text-xs text-primary animate-pulse"><Clock className="w-3 h-3"/></span>}
            </div>
          )}
        </div>

        {assignee ? (
          <div className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-[10px] font-bold text-foreground">
            {assignee}
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full border border-dashed border-border flex items-center justify-center opacity-50 hover:opacity-100">
            <Plus className="w-3 h-3 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}