import React, { useState } from "react";
import { 
  Search, Sparkles, FolderKanban, Building2, 
  FileText, ArrowRight, Command, Zap, 
  CheckSquare, Settings, CreditCard, Clock,
  Hash, CornerDownLeft, Globe
} from "lucide-react";

export default function CommandCenterModal() {
  // En producción, esto se controlaría con un gestor de estado global (Zustand/Redux) y atajos de teclado
  const [query, setQuery] = useState("");

  return (
    <>
      {/* 1. BACKDROP OVERLAY */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100] animate-fade-in" />

      {/* 2. COMMAND CENTER CONTAINER */}
      <div className="fixed top-[12vh] left-1/2 -translate-x-1/2 w-full max-w-3xl bg-card border border-border shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl z-[101] overflow-hidden flex flex-col transform transition-all animate-fade-in-up">
        
        {/* INPUT PRINCIPAL (La Barra Mágica) */}
        <div className="relative flex items-center px-4 py-4 border-b border-border bg-background/50">
          <div className="p-2 bg-primary/10 rounded-lg text-primary mr-3 shrink-0">
            {query.startsWith('/') ? <Command className="w-5 h-5" /> : 
             query.length > 5 ? <Sparkles className="w-5 h-5 animate-pulse" /> : 
             <Search className="w-5 h-5" />}
          </div>
          
          <input 
            autoFocus
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca entidades, escribe un comando (/) o pregúntale a la IA..." 
            className="flex-1 bg-transparent text-lg text-foreground placeholder:text-muted-foreground/50 outline-none border-none"
          />
          
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono text-muted-foreground bg-secondary border border-border px-1.5 py-0.5 rounded">ESC</span>
          </div>
        </div>

        {/* CONTENIDO DINÁMICO (Resultados) */}
        <div className="flex-1 max-h-[55vh] overflow-y-auto no-scrollbar p-2">
          
          {/* ESTADO VACÍO (Sugerencias predeterminadas) */}
          {query === "" && (
            <div className="space-y-4 p-2">
              
              {/* Sugerencias de IA (Basadas en contexto actual) */}
              <div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-primary" /> Sugerencias de IA para ti hoy
                </div>
                <CommandResult 
                  icon={FileText} 
                  title="Resumir la reunión con GlobalBank" 
                  subtitle="Terminaste una llamada hace 15 min. ¿Generar minuta?" 
                  type="ai-action"
                  shortcut="↵"
                />
                <CommandResult 
                  icon={CheckSquare} 
                  title="Actualizar estado de NEX-140" 
                  subtitle="La tarea lleva 3 días en progreso. ¿Marcar como bloqueada?" 
                  type="ai-action"
                />
              </div>

              {/* Acciones Rápidas (CRUD) */}
              <div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-2">Acciones Rápidas</div>
                <CommandResult icon={FolderKanban} title="Crear nuevo Proyecto" subtitle="Abre el asistente de proyectos" type="action" shortcut="P" />
                <CommandResult icon={Building2} title="Añadir Cliente" subtitle="CRM" type="action" shortcut="C" />
                <CommandResult icon={Settings} title="Ir a Configuración" subtitle="Administración" type="action" shortcut="S" />
              </div>
              
              {/* Búsquedas Recientes */}
              <div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Recientes
                </div>
                <CommandResult icon={Building2} title="Acme Corp" subtitle="Cliente" type="entity" />
                <CommandResult icon={FileText} title="PRD_Vertrex_Draft.pdf" subtitle="Documento (Drive)" type="entity" />
              </div>
            </div>
          )}

          {/* ESTADO DE BÚSQUEDA (Simulado) */}
          {query !== "" && (
            <div className="space-y-4 p-2">
              
              {/* Acción IA prioritaria */}
              <div>
                <div className="text-[10px] font-bold text-primary uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                  <Zap className="w-3 h-3" /> Acción Inteligente
                </div>
                <CommandResult 
                  icon={Sparkles} 
                  title={`Preguntar a la IA sobre "${query}"`} 
                  subtitle="Busca en la base de conocimiento usando el motor RAG" 
                  type="ai-action"
                  active
                  shortcut={<CornerDownLeft className="w-3 h-3" />}
                />
              </div>

              {/* Resultados exactos */}
              <div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-2">Proyectos y Tareas</div>
                <CommandResult 
                  icon={FolderKanban} 
                  title="Migración Core Bancario v2" 
                  subtitle="Proyecto • En progreso (65%)" 
                  type="entity"
                  match="Core Bancario"
                />
                <CommandResult 
                  icon={CheckSquare} 
                  title="NEX-140: Implementar Omni-Switcher" 
                  subtitle="Tarea • Asignado a Sarah R." 
                  type="entity"
                />
              </div>

              {/* Resultados en la web/hub */}
              <div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-2">Knowledge Hub</div>
                <CommandResult 
                  icon={Globe} 
                  title="Documentación de la API" 
                  subtitle="stripe.com/docs • Guardado hace 2 días" 
                  type="entity" 
                />
              </div>
            </div>
          )}
        </div>

        {/* FOOTER: Atajos de teclado e info */}
        <div className="px-4 py-3 border-t border-border bg-background/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-mono">
            <span className="flex items-center gap-1.5">
              <kbd className="bg-secondary border border-border px-1.5 py-0.5 rounded">↑↓</kbd> Navegar
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="bg-secondary border border-border px-1.5 py-0.5 rounded">↵</kbd> Seleccionar
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="bg-secondary border border-border px-1.5 py-0.5 rounded">/</kbd> Comandos
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground">
            <Sparkles className="w-3 h-3 text-primary" /> Motor de Búsqueda Neural
          </div>
        </div>

      </div>
    </>
  );
}

// ==========================================
// SUB-COMPONENTES DEL COMMAND CENTER
// ==========================================

function CommandResult({ icon: Icon, title, subtitle, type, shortcut, active, match }: any) {
  // Colores dinámicos basados en el tipo de resultado
  const getColors = () => {
    switch(type) {
      case 'ai-action': return 'text-primary bg-primary/10 border-primary/20';
      case 'action': return 'text-foreground bg-secondary/50 border-border';
      case 'entity': return 'text-muted-foreground bg-background border-border';
      default: return 'text-muted-foreground bg-secondary border-border';
    }
  };

  const colors = getColors();

  return (
    <button className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer group border ${
      active 
        ? "bg-secondary/80 border-primary/50 shadow-[0_0_15px_rgba(0,255,135,0.05)]" 
        : "border-transparent hover:bg-secondary/50 hover:border-border"
    }`}>
      <div className="flex items-center gap-3 overflow-hidden">
        <div className={`p-2 rounded-lg border flex items-center justify-center shrink-0 transition-colors group-hover:bg-background ${colors}`}>
          <Icon className={`w-4 h-4 ${type === 'ai-action' ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
        </div>
        <div className="flex flex-col items-start text-left truncate">
          <span className={`text-sm font-medium truncate ${type === 'ai-action' ? 'text-primary' : 'text-foreground'}`}>
            {match ? (
              // Simulador de Highlight de búsqueda
              <>
                Migración <span className="text-primary underline decoration-primary/50 underline-offset-2">{match}</span> v2
              </>
            ) : title}
          </span>
          <span className="text-xs text-muted-foreground truncate">{subtitle}</span>
        </div>
      </div>
      
      {/* Indicador de atajo o flecha de acción */}
      <div className="shrink-0 flex items-center ml-2">
        {shortcut ? (
          <kbd className="text-[10px] font-mono text-muted-foreground bg-background border border-border px-1.5 py-0.5 rounded opacity-50 group-hover:opacity-100 transition-opacity">
            {shortcut}
          </kbd>
        ) : (
          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
        )}
      </div>
    </button>
  );
}