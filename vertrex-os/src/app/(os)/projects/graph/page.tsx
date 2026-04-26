import React from "react";
import { 
  Network, LayoutGrid, List, Filter, Plus, 
  ZoomIn, ZoomOut, Maximize, AlertTriangle, 
  CheckCircle2, Circle, GitCommit, Clock, 
  ArrowRight, Zap, GripHorizontal
} from "lucide-react";

export default function ProjectGraphViewPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in bg-[#050505] rounded-2xl border border-border overflow-hidden relative">
      
      {/* 1. HEADER & CONTROLES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 shrink-0 bg-background/80 backdrop-blur-md border-b border-border/50 z-20 absolute top-0 w-full">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Desarrollo Nexus
          </h1>
          <div className="h-5 w-px bg-border hidden sm:block"></div>
          {/* View Switcher */}
          <div className="hidden sm:flex bg-secondary border border-border p-1 rounded-lg">
            <ViewButton icon={List} label="Lista" />
            <ViewButton icon={LayoutGrid} label="Tablero" />
            <ViewButton icon={Network} label="Dependencias" active={true} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Alerta IA en la barra superior */}
          <div className="hidden md:flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive px-3 py-1.5 rounded-lg text-xs font-semibold mr-2">
            <AlertTriangle className="w-3.5 h-3.5" /> Riesgo en Ruta Crítica
          </div>
          
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground bg-card border border-border rounded-md hover:text-foreground hover:bg-secondary transition-colors">
            <Filter className="w-3.5 h-3.5" />
            Filtros
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-primary-foreground bg-primary rounded-md shadow-[0_0_15px_rgba(0,255,135,0.2)] hover:shadow-[0_0_25px_rgba(0,255,135,0.4)] transition-all">
            <Plus className="w-3.5 h-3.5" />
            Vincular
          </button>
        </div>
      </div>

      {/* 2. GRAPH CANVAS (Dot Grid Background) */}
      <div 
        className="flex-1 relative w-full h-full cursor-grab active:cursor-grabbing overflow-auto"
        style={{
          backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '-12px -12px'
        }}
      >
        {/* SVG PATHS (Las líneas de dependencia) */}
        <svg className="absolute inset-0 w-[1500px] h-[800px] pointer-events-none z-0">
          <defs>
            {/* Flecha final estándar */}
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-muted-foreground)" opacity="0.5" />
            </marker>
            {/* Flecha final bloqueada */}
            <marker id="arrow-blocked" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-destructive)" />
            </marker>
            {/* Flecha final completada */}
            <marker id="arrow-done" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-primary)" opacity="0.5" />
            </marker>
          </defs>

          {/* Rutas Completadas */}
          <path d="M 320 200 C 400 200, 400 200, 480 200" fill="none" stroke="var(--color-primary)" strokeWidth="2" opacity="0.3" markerEnd="url(#arrow-done)" />
          
          {/* Rutas Activas */}
          <path d="M 720 200 C 800 200, 800 120, 880 120" fill="none" stroke="var(--color-border)" strokeWidth="2" markerEnd="url(#arrow)" />
          
          {/* RUTA CRÍTICA BLOQUEADA (Alerta) */}
          <path d="M 720 200 C 800 200, 800 320, 880 320" fill="none" stroke="var(--color-destructive)" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" markerEnd="url(#arrow-blocked)" />
          
          <path d="M 1120 320 C 1200 320, 1200 200, 1280 200" fill="none" stroke="var(--color-destructive)" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" markerEnd="url(#arrow-blocked)" />
        </svg>

        {/* CONTENEDOR DE NODOS DE TAREA (Posicionamiento Absoluto) */}
        <div className="absolute inset-0 pt-24 px-12 z-10 w-[1500px] h-[800px]">
          
          {/* Columna 1: Completados */}
          <div className="absolute left-[80px] top-[160px]">
            <TaskNode 
              id="NEX-135" title="Setup inicial del repositorio" 
              status="done" assignee="JM"
            />
          </div>

          {/* Columna 2: En Progreso (El Cuello de Botella) */}
          <div className="absolute left-[480px] top-[160px]">
            <TaskNode 
              id="NEX-140" title="Implementar Omni-Switcher" 
              status="in-progress" assignee="SR" isTracking
              blockedBy={false}
            />
          </div>

          {/* Columna 3: Bloqueados o Pendientes */}
          <div className="absolute left-[880px] top-[80px]">
            <TaskNode 
              id="NEX-141" title="Migración a Tailwind v4" 
              status="todo" assignee="CM"
            />
          </div>

          {/* LA TAREA BLOQUEADA (Critical Path) */}
          <div className="absolute left-[880px] top-[280px]">
            <TaskNode 
              id="NEX-138" title="Auditoría de Seguridad RBAC" 
              status="blocked"
            />
            {/* IA Tooltip Contextual */}
            <div className="absolute -top-12 left-0 w-full bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-bold uppercase tracking-wider px-2 py-1.5 rounded-lg flex items-center justify-center gap-1.5 shadow-lg backdrop-blur-md">
              <Zap className="w-3 h-3" /> Bloqueado por NEX-140
            </div>
          </div>

          {/* Columna 4: Futuro */}
          <div className="absolute left-[1280px] top-[160px]">
            <TaskNode 
              id="NEX-145" title="Despliegue a Producción" 
              status="todo"
            />
          </div>

        </div>
      </div>

      {/* 3. CONTROLES DE ZOOM FLOTANTES */}
      <div className="absolute bottom-6 right-6 flex items-center bg-card border border-border rounded-lg shadow-2xl z-20">
        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-l-lg transition-colors border-r border-border"><ZoomOut className="w-4 h-4" /></button>
        <span className="px-3 text-xs font-mono text-foreground font-medium">100%</span>
        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border-l border-border"><ZoomIn className="w-4 h-4" /></button>
        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-r-lg transition-colors border-l border-border"><Maximize className="w-4 h-4" /></button>
      </div>

      {/* Animación CSS para la ruta crítica bloqueada */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }
      `}} />
    </div>
  );
}

// ==========================================
// SUB-COMPONENTES DEL GRAPH
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

function TaskNode({ id, title, status, assignee, isTracking }: any) {
  
  // Configuración visual según el estado
  const getConfig = () => {
    switch(status) {
      case 'done': 
        return { border: 'border-primary/30', bg: 'bg-card', text: 'text-muted-foreground line-through', icon: <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> };
      case 'in-progress': 
        return { border: 'border-primary shadow-[0_0_15px_rgba(0,255,135,0.1)]', bg: 'bg-card', text: 'text-foreground', icon: <Clock className="w-3.5 h-3.5 text-primary" /> };
      case 'blocked': 
        return { border: 'border-destructive shadow-[0_0_15px_rgba(239,68,68,0.15)]', bg: 'bg-destructive/5', text: 'text-destructive', icon: <AlertTriangle className="w-3.5 h-3.5 text-destructive" /> };
      default: 
        return { border: 'border-border', bg: 'bg-card', text: 'text-foreground', icon: <Circle className="w-3.5 h-3.5 text-muted-foreground" /> };
    }
  };

  const cfg = getConfig();

  return (
    <div className={`w-[240px] ${cfg.bg} border ${cfg.border} rounded-xl p-3 relative group transition-all hover:border-primary/50 cursor-pointer`}>
      
      {/* Sockets de conexión (Nodos de entrada/salida) */}
      <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-2 border-border flex items-center justify-center cursor-crosshair z-10 group-hover:border-primary transition-colors">
        <div className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary transition-colors"></div>
      </div>
      <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-2 border-border flex items-center justify-center cursor-crosshair z-10 group-hover:border-primary transition-colors">
        <div className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary transition-colors"></div>
      </div>

      {/* Contenido del Nodo */}
      <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono mb-2">
        <span className="flex items-center gap-1.5">
          <GripHorizontal className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />
          {id}
        </span>
        {isTracking && <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>}
      </div>

      <h4 className={`text-xs font-semibold leading-snug mb-3 ${cfg.text}`}>
        {title}
      </h4>

      <div className="flex items-center justify-between border-t border-border/50 pt-2 mt-auto">
        <div className="flex items-center gap-1.5">
          {cfg.icon}
          <span className="text-[10px] uppercase font-bold text-muted-foreground">
            {status === 'done' ? 'Completado' : status === 'blocked' ? 'Bloqueado' : status === 'in-progress' ? 'En Progreso' : 'Pendiente'}
          </span>
        </div>
        
        {assignee ? (
          <div className="w-5 h-5 rounded-full bg-secondary border border-border flex items-center justify-center text-[9px] font-bold text-foreground">
            {assignee}
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full border border-dashed border-border flex items-center justify-center opacity-50">
            <Plus className="w-3 h-3 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}