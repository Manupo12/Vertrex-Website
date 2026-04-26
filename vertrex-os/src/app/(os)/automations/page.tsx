"use client";

import { useUIStore } from "@/lib/store/ui";
import { 
  Play, Save, MousePointer2, Hand, ZoomIn, 
  ZoomOut, Maximize, Zap, ArrowRight, MoreHorizontal,
  Users, FolderKanban, Sparkles, MessageSquare, 
  Plus, CheckCircle2, AlertCircle
} from "lucide-react";

export default function AutomationsCanvasPage() {
  const open = useUIStore((store) => store.open);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#050505] animate-fade-in relative overflow-hidden">
      
      {/* 1. HEADER (Controles del Flujo) */}
      <header className="h-14 px-6 flex items-center justify-between shrink-0 bg-background/80 backdrop-blur-md border-b border-border/50 z-20 absolute top-0 w-full">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <h1 className="text-sm font-semibold text-foreground">Onboarding Cliente Enterprise</h1>
          </div>
          <div className="h-4 w-px bg-border"></div>
          <span className="text-xs font-mono text-muted-foreground">Última ejecución: Hace 12 min</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-secondary/50 rounded-lg p-1 border border-border mr-2">
            <button className="p-1.5 bg-background shadow-sm rounded-md text-foreground"><MousePointer2 className="w-4 h-4" /></button>
            <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"><Hand className="w-4 h-4" /></button>
          </div>
          <button className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-secondary/50 border border-border hover:border-border/80 rounded-md transition-colors flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5" /> Testear Flujo
          </button>
          <button className="px-4 py-1.5 text-xs font-semibold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 rounded-md transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,135,0.1)]" onClick={() => open("createAutomation")}>
            <Save className="w-3.5 h-3.5" /> Publicar
          </button>
        </div>
      </header>

      {/* 2. NODE CANVAS (El Lienzo con Dot Grid) */}
      {/* Usamos un patrón de puntos CSS puro para alto rendimiento */}
      <div 
        className="flex-1 relative w-full h-full"
        style={{
          backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '-12px -12px'
        }}
      >
        {/* SVG PATHS (Simulando las conexiones entre nodos) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <path d="M 300 200 C 400 200, 400 200, 500 200" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
          <path d="M 800 200 C 900 200, 900 100, 1000 100" fill="none" stroke="var(--color-border)" strokeWidth="2" />
          <path d="M 800 200 C 900 200, 900 350, 1000 350" fill="none" stroke="var(--color-border)" strokeWidth="2" />
        </svg>

        {/* CONTENEDOR DE NODOS (Posicionamiento Absoluto Simulado) */}
        <div className="absolute inset-0 pt-24 px-12 z-10 overflow-auto">
          
          {/* NODO 1: TRIGGER */}
          <div className="absolute left-[50px] top-[150px]">
            <FlowNode 
              type="trigger"
              icon={Users}
              title="Trato Movido a Ganado"
              app="CRM"
              color="text-emerald-400"
              bg="bg-emerald-500/10"
              status="active"
            />
          </div>

          {/* NODO 2: LOGIC / AI */}
          <div className="absolute left-[500px] top-[150px]">
            <FlowNode 
              type="ai"
              icon={Sparkles}
              title="Extraer Entregables"
              app="IA Autónoma"
              color="text-purple-400"
              bg="bg-purple-500/10"
              description="Analiza el contrato adjunto y extrae las 5 tareas clave."
            />
          </div>

          {/* NODO 3: ACTION 1 */}
          <div className="absolute left-[1000px] top-[50px]">
            <FlowNode 
              type="action"
              icon={FolderKanban}
              title="Crear Proyecto y Tareas"
              app="Proyectos"
              color="text-blue-400"
              bg="bg-blue-500/10"
            />
          </div>

          {/* NODO 4: ACTION 2 */}
          <div className="absolute left-[1000px] top-[300px]">
            <FlowNode 
              type="action"
              icon={MessageSquare}
              title="Aviso a Operaciones"
              app="Chat Hub"
              color="text-amber-400"
              bg="bg-amber-500/10"
              description="Notifica en el canal #general-ops."
            />
          </div>

          {/* NODO GHOST (Sugerencia de la IA) */}
          <div className="absolute left-[1000px] top-[500px] opacity-60 hover:opacity-100 transition-opacity cursor-pointer group" onClick={() => open("createAutomation")}>
            <div className="absolute -top-6 left-0 flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wider">
              <Zap className="w-3 h-3" /> IA Sugiere añadir:
            </div>
            <div className="w-[280px] bg-card/50 border border-dashed border-primary/50 rounded-xl p-4 flex items-center justify-center gap-3 backdrop-blur-sm hover:bg-primary/5 transition-colors">
              <Plus className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Agendar Kick-off Meeting</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. CONTROLES DE ZOOM FLOTANTES */}
      <div className="absolute bottom-6 right-6 flex items-center bg-card border border-border rounded-lg shadow-2xl z-20">
        <button className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-l-lg transition-colors border-r border-border"><ZoomOut className="w-4 h-4" /></button>
        <span className="px-3 text-xs font-mono text-foreground font-medium">100%</span>
        <button className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border-l border-border"><ZoomIn className="w-4 h-4" /></button>
        <button className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-r-lg transition-colors border-l border-border"><Maximize className="w-4 h-4" /></button>
      </div>

      {/* CSS para la animación del path */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }
      `}} />
    </div>
  );
}

// ==========================================
// SUB-COMPONENTES DEL CANVAS
// ==========================================

function FlowNode({ type, icon: Icon, title, app, description, color, bg, status }: any) {
  return (
    <div className={`w-[280px] bg-card border rounded-xl shadow-lg relative group transition-all hover:shadow-xl ${status === 'active' ? 'border-primary/50 shadow-[0_0_20px_rgba(0,255,135,0.05)]' : 'border-border hover:border-primary/30'}`}>
      
      {/* Puntos de Conexión (Sockets) */}
      {type !== 'trigger' && (
        <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-5 h-5 rounded-full bg-background border-2 border-border flex items-center justify-center group-hover:border-primary transition-colors cursor-crosshair z-10">
          <div className="w-2 h-2 rounded-full bg-border group-hover:bg-primary transition-colors"></div>
        </div>
      )}
      {type !== 'action' && (
        <div className="absolute top-1/2 -right-2.5 -translate-y-1/2 w-5 h-5 rounded-full bg-background border-2 border-border flex items-center justify-center group-hover:border-primary transition-colors cursor-crosshair z-10">
          <div className="w-2 h-2 rounded-full bg-primary/50 group-hover:bg-primary transition-colors animate-pulse"></div>
        </div>
      )}

      {/* Header del Nodo */}
      <div className="p-4 border-b border-border/50 flex items-start gap-3">
        <div className={`p-2 rounded-lg shrink-0 ${bg} ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">{app}</p>
          <h3 className="text-sm font-semibold text-foreground leading-tight">{title}</h3>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors p-1 -mr-1 rounded hover:bg-secondary">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Cuerpo del Nodo */}
      {description && (
        <div className="p-4 bg-secondary/10">
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
      )}

      {/* Footer / Estado */}
      <div className="px-4 py-2 bg-secondary/30 rounded-b-xl border-t border-border/50 flex items-center justify-between text-[10px] font-medium">
        {status === 'active' ? (
          <span className="flex items-center gap-1.5 text-primary">
            <CheckCircle2 className="w-3 h-3" /> Evento Escuchando
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <ArrowRight className="w-3 h-3" /> Configurado
          </span>
        )}
      </div>

    </div>
  );
}