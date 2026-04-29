import React from "react";
import { 
  FolderKanban, Activity, Clock, AlertTriangle, 
  CheckCircle2, Users, FileText, Link2, Zap, 
  MoreHorizontal, Play, Plus, GitCommit, Image as ImageIcon,
  ArrowRight, ShieldCheck, Database, LayoutGrid
} from "lucide-react";

export default function ProjectOverviewPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background animate-fade-in relative overflow-hidden">
      
      {/* ÁREA PRINCIPAL (Scrollable) */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
        
        {/* 1. PROJECT HEADER */}
        <header className="px-8 py-6 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground mb-3">
            <span className="hover:text-foreground cursor-pointer transition-colors">Proyectos</span>
            <span>/</span>
            <span className="text-foreground">NEX</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Migración Core Bancario v2</h1>
                <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> Activo
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Refactorización completa de la capa de datos hacia Neon Serverless y actualización del frontend a Tailwind v4 para el cliente GlobalBank.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-secondary border border-border px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-secondary/80 hover:text-foreground transition-colors">
                <LayoutGrid className="w-3.5 h-3.5" /> Ver Kanban
              </button>
              <button className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all shadow-sm">
                <Plus className="w-3.5 h-3.5" /> Nueva Tarea
              </button>
              <button className="p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-md transition-colors ml-1">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* 2. DASHBOARD CONTENT */}
        <main className="p-8 space-y-8 pb-32">
          
          {/* A. MÉTRICAS CORE (KPIs) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ProjectMetricCard 
              icon={Activity} label="Progreso Total" value="65%" 
              subtext="45/68 Tareas completadas" color="text-primary" 
              progress={65} 
            />
            <ProjectMetricCard 
              icon={Clock} label="Tiempo Trackeado" value="124h" 
              subtext="Estimado total: 180h" color="text-blue-400" 
            />
            <ProjectMetricCard 
              icon={Database} label="Presupuesto Consumido" value="$4,200" 
              subtext="De $15,000 (Burn Rate Ok)" color="text-foreground" 
            />
            <ProjectMetricCard 
              icon={AlertTriangle} label="Bloqueadores" value="1" 
              subtext="Riesgo en la ruta crítica" color="text-destructive" alert
            />
          </div>

          {/* B. IA COO INSIGHT (Proactivo) */}
          <div className="bg-gradient-to-r from-amber-500/5 to-transparent border border-amber-500/20 rounded-xl p-5 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 mt-0.5">
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  Atención Requerida (IA COO)
                  <span className="text-[10px] uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded font-bold">Cuello de botella</span>
                </h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  La tarea <span className="font-mono text-foreground font-medium bg-secondary px-1 rounded">NEX-140</span> lleva 3 días atascada y está bloqueando a todo el equipo de seguridad. Carlos M. tiene sobrecarga.
                </p>
                <div className="mt-3 flex gap-2">
                  <button className="text-xs font-semibold bg-amber-500 text-amber-950 border border-amber-500 px-3 py-1.5 rounded-md hover:bg-amber-400 transition-colors">
                    Reasignar a Sarah R. (Libre)
                  </button>
                  <button className="text-xs font-medium text-muted-foreground bg-background border border-border px-3 py-1.5 rounded-md hover:bg-secondary hover:text-foreground transition-colors">
                    Ignorar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* C. TAREAS CRÍTICAS (Preview) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <FolderKanban className="w-4 h-4" /> Tareas en Progreso
                </h2>
                <button className="text-xs text-primary hover:underline font-medium">Ver todas</button>
              </div>
              <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden">
                <TaskListItem id="NEX-140" title="Implementar Omni-Switcher" assignee="CM" status="En Progreso" isAlert />
                <TaskListItem id="NEX-142" title="Configurar Webhooks Stripe" assignee="JM" status="En Progreso" />
                <TaskListItem id="NEX-145" title="Revisión de QA Inicial" assignee="SR" status="Por Hacer" />
              </div>
            </div>

            {/* D. ENTIDADES VINCULADAS (Docs & Assets) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Link2 className="w-4 h-4" /> Conocimiento Vinculado
                </h2>
                <button className="p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground rounded transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <EntityCard type="doc" title="PRD - Migración v2.0" meta="Actualizado hoy" />
                <EntityCard type="asset" title="Arquitectura_DB.png" meta="2.4 MB • Neon Storage" />
                <EntityCard type="link" title="Documentación Tailwind v4" meta="Knowledge Hub" />
                <EntityCard type="doc" title="Minutas Kickoff" meta="Hace 2 semanas" />
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* 3. SIDEBAR DERECHO: ACTIVIDAD Y EQUIPO */}
      <aside className="hidden xl:flex w-[320px] border-l border-border bg-card/30 flex-col overflow-hidden shrink-0">
        
        {/* Equipo */}
        <div className="p-6 border-b border-border">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users className="w-3.5 h-3.5" /> Equipo (3)
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-background flex items-center justify-center text-xs text-white font-bold" title="Sarah R.">SR</div>
            <div className="w-8 h-8 rounded-full bg-primary border-2 border-background flex items-center justify-center text-xs text-primary-foreground font-bold" title="Juan M.">JM</div>
            <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-background flex items-center justify-center text-xs text-white font-bold" title="Carlos M.">CM</div>
            <button className="w-8 h-8 rounded-full bg-secondary border border-dashed border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors ml-auto">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Timeline de Actividad */}
        <div className="p-6 flex-1 overflow-y-auto no-scrollbar">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
            <GitCommit className="w-3.5 h-3.5" /> Actividad Reciente
          </h3>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/50 before:to-transparent">
            
            {/* Log IA */}
            <ActivityLog 
              icon={Zap} color="bg-primary/20 text-primary" border="border-primary/30"
              title="Alerta de retraso generada" time="Hace 10 min" user="IA COO"
            />
            
            {/* Log Asset */}
            <ActivityLog 
              icon={ImageIcon} color="bg-secondary text-muted-foreground" border="border-border"
              title="Subió Arquitectura_DB.png" time="Ayer 16:45" user="Sarah R."
            />
            
            {/* Log Task Complete */}
            <ActivityLog 
              icon={CheckCircle2} color="bg-blue-500/20 text-blue-400" border="border-blue-500/30"
              title="Completó NEX-135" time="Hace 2 días" user="Carlos M."
            />
            
            {/* Log Doc Created */}
            <ActivityLog 
              icon={FileText} color="bg-secondary text-muted-foreground" border="border-border"
              title="Creó el PRD Inicial" time="Hace 2 semanas" user="Juan M."
            />
          </div>
        </div>
      </aside>

    </div>
  );
}

// ==========================================
// SUB-COMPONENTES DEL OVERVIEW
// ==========================================

function ProjectMetricCard({ icon: Icon, label, value, subtext, color, alert, progress }: any) {
  return (
    <div className={`bg-card border rounded-xl p-4 transition-all ${alert ? 'border-destructive/50 shadow-[0_0_15px_rgba(239,68,68,0.05)]' : 'border-border hover:border-primary/30'}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
        <div className={`p-1.5 rounded-md ${alert ? 'bg-destructive/10' : 'bg-secondary'}`}>
          <Icon className={`w-3.5 h-3.5 ${color}`} />
        </div>
      </div>
      <div className="mb-1">
        <span className={`text-2xl font-bold font-mono tracking-tight ${alert ? 'text-destructive' : 'text-foreground'}`}>{value}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{subtext}</span>
      </div>
      {/* Progress Bar (Opcional) */}
      {progress !== undefined && (
        <div className="w-full h-1 bg-background rounded-full overflow-hidden border border-border mt-3">
          <div className="h-full bg-primary" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  );
}

function TaskListItem({ id, title, assignee, status, isAlert }: any) {
  return (
    <div className="flex items-center justify-between p-3 border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${isAlert ? 'bg-destructive animate-pulse' : status === 'Por Hacer' ? 'bg-muted-foreground' : 'bg-primary'}`}></div>
        <div>
          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted-foreground bg-background px-1 rounded border border-border">{id}</span>
            {title}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-[10px] uppercase font-bold text-muted-foreground">{status}</span>
        <div className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-[9px] font-bold text-foreground">
          {assignee}
        </div>
      </div>
    </div>
  );
}

function EntityCard({ type, title, meta }: any) {
  const getStyle = () => {
    switch(type) {
      case 'doc': return { icon: FileText, bg: 'bg-primary/10', color: 'text-primary' };
      case 'asset': return { icon: ImageIcon, bg: 'bg-blue-400/10', color: 'text-blue-400' };
      case 'link': return { icon: Link2, bg: 'bg-purple-400/10', color: 'text-purple-400' };
      default: return { icon: FileText, bg: 'bg-secondary', color: 'text-muted-foreground' };
    }
  };
  const style = getStyle();
  const Icon = style.icon;

  return (
    <div className="flex items-start gap-3 p-3 bg-secondary/20 border border-border rounded-xl hover:border-primary/40 transition-colors cursor-pointer group">
      <div className={`p-2 rounded-lg ${style.bg} shrink-0`}>
        <Icon className={`w-4 h-4 ${style.color}`} />
      </div>
      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">{title}</h4>
        <p className="text-[10px] font-mono text-muted-foreground mt-0.5 truncate">{meta}</p>
      </div>
    </div>
  );
}

function ActivityLog({ icon: Icon, color, border, title, time, user }: any) {
  return (
    <div className="relative flex items-start gap-4 z-10 group">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 bg-card ${border}`}>
        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${color}`}>
          <Icon className="w-2.5 h-2.5" />
        </div>
      </div>
      <div className="flex-1 pb-1">
        <p className="text-xs text-foreground/90 leading-tight">
          <span className="font-semibold text-foreground mr-1">{user}</span>
          <span className="text-muted-foreground">{title}</span>
        </p>
        <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-mono">{time}</p>
      </div>
    </div>
  );
}