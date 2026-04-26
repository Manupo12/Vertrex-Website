import React from "react";
import { 
  CalendarDays, ChevronLeft, ChevronRight, Filter, 
  Search, Plus, Sparkles, LayoutGrid, List, Network,
  AlertTriangle, Clock, Zap, CheckCircle2, User,
  MoreHorizontal, Play, Columns
} from "lucide-react";

export default function ProjectTimelineViewPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in bg-card border border-border rounded-2xl overflow-hidden relative shadow-sm">
      
      {/* 1. HEADER & CONTROLES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 shrink-0 bg-background/80 backdrop-blur-md border-b border-border z-20">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            Desarrollo Nexus
            <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
              Q2 - 2026
            </span>
          </h1>
          <div className="h-5 w-px bg-border hidden sm:block"></div>
          
          {/* View Switcher */}
          <div className="hidden sm:flex bg-secondary border border-border p-1 rounded-lg">
            <ViewButton icon={List} label="Lista" />
            <ViewButton icon={LayoutGrid} label="Tablero" />
            <ViewButton icon={CalendarDays} label="Timeline" active />
            <ViewButton icon={Network} label="Graph" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Alerta IA: Rebalanceo de Carga */}
          <button className="hidden md:flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-amber-500/20 transition-colors">
            <Sparkles className="w-3.5 h-3.5" /> IA: Solapamiento detectado
          </button>
          
          <div className="flex items-center bg-secondary/50 border border-border rounded-lg p-1">
            <button className="px-3 py-1 text-xs font-medium bg-background text-foreground shadow-sm rounded-md border border-border">Mes</button>
            <button className="px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Trimestre</button>
          </div>
          
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-primary-foreground bg-primary rounded-md shadow-[0_0_15px_rgba(0,255,135,0.2)] hover:shadow-[0_0_25px_rgba(0,255,135,0.4)] transition-all">
            <Plus className="w-3.5 h-3.5" /> Añadir Tarea
          </button>
        </div>
      </div>

      {/* 2. CONTENEDOR PRINCIPAL: SPLIT VIEW (Lista + Timeline) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* PANEL IZQUIERDO: Lista de Tareas (Fijo) */}
        <div className="w-[300px] shrink-0 border-r border-border bg-background/30 flex flex-col z-10">
          {/* Header Lista */}
          <div className="h-10 border-b border-border flex items-center px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-secondary/20">
            <div className="flex-1">Nombre de la Tarea</div>
            <div className="w-12 text-center">Asign.</div>
          </div>
          
          {/* Filas de Tareas */}
          <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
            <TaskRow id="NEX-135" title="Setup Inicial Repo" assignee="JM" done />
            <TaskRow id="NEX-140" title="Implementar Omni-Switcher" assignee="SR" active />
            <TaskRow id="NEX-141" title="Migración a Tailwind v4" assignee="CM" />
            <TaskRow id="NEX-138" title="Auditoría RBAC" assignee="SR" alert />
            <TaskRow id="NEX-145" title="Despliegue Prod (Fase 1)" assignee="JM" />
            <TaskRow id="NEX-146" title="QA & Testing Final" assignee="CM" />
          </div>
        </div>

        {/* PANEL DERECHO: TIMELINE / GANTT CHART (Scrolleable Horizontal y Vertical) */}
        <div className="flex-1 overflow-auto no-scrollbar relative bg-[#050505]">
          
          {/* Línea "Hoy" (Sync Time) */}
          <div className="absolute top-0 bottom-0 left-[380px] w-px bg-primary/50 z-20 pointer-events-none flex flex-col items-center">
            <div className="bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-b shadow-[0_0_10px_rgba(0,255,135,0.5)]">HOY</div>
          </div>

          <div className="min-w-[1200px]">
            {/* Header del Calendario (Días/Meses) */}
            <div className="h-10 flex border-b border-border/50 bg-secondary/10 sticky top-0 z-30 backdrop-blur-md">
              {/* Bloque: Abril */}
              <div className="flex-1 border-r border-border/50">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-0.5 border-b border-border/50 bg-background/50">
                  Abril 2026
                </div>
                <div className="flex text-[9px] text-muted-foreground/60 text-center">
                  {[13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30].map(day => (
                    <div key={day} className={`flex-1 py-1 border-r border-border/30 ${day === 23 ? 'text-primary font-bold bg-primary/5' : ''}`}>
                      {day}
                    </div>
                  ))}
                </div>
              </div>
              {/* Bloque: Mayo (Simulado cortado) */}
              <div className="w-[300px] bg-secondary/5">
                 <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-0.5 border-b border-border/50 bg-background/50">Mayo 2026</div>
                 <div className="flex text-[9px] text-muted-foreground/60 text-center">
                   {[1,2,3,4,5,6].map(day => <div key={`m${day}`} className="flex-1 py-1 border-r border-border/30">{day}</div>)}
                 </div>
              </div>
            </div>

            {/* Grid de Barras (Gantt) */}
            <div className="relative w-full pb-10 pt-2">
              
              {/* Background Grid Lines */}
              <div className="absolute inset-0 flex z-0 pointer-events-none opacity-20">
                 {/* Creando las líneas verticales divisorias */}
                 {Array.from({length: 24}).map((_, i) => (
                   <div key={i} className="flex-1 border-r border-border/50 h-full"></div>
                 ))}
              </div>

              {/* Fila 1: NEX-135 */}
              <TimelineRow>
                <GanttBar start="left-[2%]" width="w-[15%]" color="bg-secondary text-muted-foreground" progress={100} isDone />
              </TimelineRow>

              {/* Fila 2: NEX-140 */}
              <TimelineRow>
                <GanttBar start="left-[15%]" width="w-[25%]" color="bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,255,135,0.2)]" progress={65} isTracking />
              </TimelineRow>

              {/* Fila 3: NEX-141 */}
              <TimelineRow>
                <GanttBar start="left-[25%]" width="w-[20%]" color="bg-blue-500/80 text-white" progress={30} />
              </TimelineRow>

              {/* Fila 4: NEX-138 (Bloqueada/Solapada) */}
              <TimelineRow>
                <GanttBar start="left-[28%]" width="w-[18%]" color="bg-destructive/80 text-white border border-destructive shadow-[0_0_15px_rgba(239,68,68,0.3)]" isAlert />
                
                {/* SVG Overlay: Dependency Arrow (NEX-140 -> NEX-138) */}
                <svg className="absolute top-[-30px] left-[38%] w-[100px] h-[50px] pointer-events-none z-10 overflow-visible">
                  <path d="M 0 0 L 10 0 C 20 0, 20 40, 30 40 L 40 40" fill="none" stroke="var(--color-destructive)" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow-blocked)" />
                </svg>
              </TimelineRow>

              {/* Fila 5: NEX-145 */}
              <TimelineRow>
                <GanttBar start="left-[48%]" width="w-[22%]" color="bg-secondary text-muted-foreground" />
              </TimelineRow>

              {/* Fila 6: NEX-146 */}
              <TimelineRow>
                <GanttBar start="left-[70%]" width="w-[20%]" color="bg-secondary text-muted-foreground" />
              </TimelineRow>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTES DEL GANTT
// ==========================================

function ViewButton({ icon: Icon, label, active }: any) {
  return (
    <button className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${
      active ? "bg-background text-foreground shadow-sm border border-border/50" : "text-muted-foreground hover:text-foreground hover:bg-transparent"
    }`} title={label}>
      <Icon className="w-4 h-4" />
    </button>
  );
}

function TaskRow({ id, title, assignee, done, active, alert }: any) {
  return (
    <div className={`h-12 border-b border-border/30 flex items-center px-4 transition-colors group cursor-pointer hover:bg-secondary/20 ${active ? 'bg-primary/5' : ''}`}>
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-sm font-medium text-foreground truncate flex items-center gap-2">
          {done && <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground" />}
          {active && <Play className="w-3 h-3 text-primary fill-current animate-pulse" />}
          {alert && <AlertTriangle className="w-3.5 h-3.5 text-destructive" />}
          <span className={done ? 'text-muted-foreground line-through' : ''}>{title}</span>
        </p>
        <p className="text-[10px] text-muted-foreground font-mono">{id}</p>
      </div>
      <div className="w-12 flex justify-center shrink-0">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border border-background ${
          alert ? 'bg-destructive text-white ring-2 ring-destructive/30' : 
          done ? 'bg-secondary text-muted-foreground' : 'bg-blue-500 text-white'
        }`}>
          {assignee}
        </div>
      </div>
    </div>
  );
}

function TimelineRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-12 border-b border-border/10 relative group hover:bg-secondary/5 transition-colors">
      {children}
    </div>
  );
}

function GanttBar({ start, width, color, progress, isDone, isTracking, isAlert }: any) {
  return (
    <div className={`absolute top-1/2 -translate-y-1/2 ${start} ${width} h-7 rounded-md cursor-pointer group/bar transition-transform hover:scale-[1.02] z-10`}>
      {/* Barra base */}
      <div className={`w-full h-full rounded-md flex items-center px-2 relative overflow-hidden ${color}`}>
        
        {/* Barra de Progreso Interna */}
        {progress !== undefined && !isDone && (
          <div className="absolute left-0 top-0 bottom-0 bg-background/20 z-0" style={{ width: `${progress}%` }}></div>
        )}

        {/* Indicadores visuales */}
        <div className="relative z-10 flex items-center justify-between w-full">
          {isTracking && <Zap className="w-3 h-3 fill-current opacity-80" />}
          {isAlert && <AlertTriangle className="w-3 h-3 text-white fill-current" />}
          {isDone && <CheckCircle2 className="w-3 h-3 opacity-50" />}
          
          {progress !== undefined && (
             <span className="text-[9px] font-mono opacity-80 ml-auto">{progress}%</span>
          )}
        </div>
      </div>

      {/* Handles de resize (Aparecen on hover) */}
      <div className="absolute top-0 bottom-0 left-0 w-2 cursor-ew-resize opacity-0 group-hover/bar:opacity-100 bg-background/50 rounded-l-md"></div>
      <div className="absolute top-0 bottom-0 right-0 w-2 cursor-ew-resize opacity-0 group-hover/bar:opacity-100 bg-background/50 rounded-r-md"></div>
    </div>
  );
}