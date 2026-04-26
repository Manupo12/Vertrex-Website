import React from "react";
import AIControlCenterScreen from "@/components/ai/ai-control-center-screen";
import { coerceAITab, getAIControlCenterData } from "@/lib/ai/control-center";
import { 
  Sparkles, Terminal, History, Settings, 
  Search, Plus, Zap, Cpu, Database, 
  CheckSquare, AlertTriangle, Send,
  Mic, Play, Activity, ToggleRight
} from "lucide-react";

type AIConsolePageProps = {
  searchParams?: Promise<{ tab?: string | string[] }>;
};

export default async function AIConsolePage({ searchParams }: AIConsolePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const rawTab = resolvedSearchParams?.tab;
  const tab = Array.isArray(rawTab) ? rawTab[0] : rawTab;
  const data = await getAIControlCenterData();

  return <AIControlCenterScreen activeTab={coerceAITab(tab)} data={data} />;
}

export function LegacyAIConsolePage() {
  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4 animate-fade-in pb-4">
      
      {/* 1. SIDEBAR: MODELOS, HISTORIAL Y MEMORIA */}
      <aside className="w-[280px] shrink-0 bg-card border border-border rounded-2xl flex flex-col overflow-hidden">
        
        {/* Cabecera & Nuevo Prompt */}
        <div className="p-4 border-b border-border bg-secondary/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> IA Central
            </h2>
            <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors bg-background border border-border rounded-md shadow-sm">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {/* Selector de Modelo (Local vs Cloud) - PRD 2.11 */}
          <div className="bg-background border border-border rounded-lg p-1 flex items-center text-xs font-medium">
            <button className="flex-1 py-1.5 px-2 rounded-md bg-secondary text-foreground shadow-sm flex items-center justify-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-primary" /> OpenClaw (Local)
            </button>
            <button className="flex-1 py-1.5 px-2 rounded-md text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> GPT-4o (Cloud)
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-5 mt-2">
          
          {/* Vistas Core */}
          <div>
            <div className="flex items-center justify-between px-2 mb-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Centro de Control</span>
            </div>
            <SidebarItem icon={Terminal} label="Consola Interactiva" active />
            <SidebarItem icon={Activity} label="Operaciones Autónomas" alert />
            <SidebarItem icon={Database} label="Memoria Empresarial" />
          </div>

          {/* Historial de Prompts */}
          <div>
            <div className="flex items-center justify-between px-2 mb-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Historial de Prompts</span>
              <Search className="w-3 h-3 text-muted-foreground cursor-pointer" />
            </div>
            <HistoryItem title="Auditoría Nexus Q2" date="Hoy" />
            <HistoryItem title="Resumen Llamada GlobalBank" date="Ayer" />
            <HistoryItem title="Generar PRD Automatizaciones" date="Hace 3 días" />
            <HistoryItem title="Análisis de Churn Rate" date="Hace 1 semana" />
          </div>

          {/* Estado del Motor RAG */}
          <div className="px-3 py-3 mt-auto mb-2 mx-2 bg-secondary/30 border border-border rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                <Database className="w-3 h-3" /> Motor RAG
              </span>
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            </div>
            <p className="text-xs text-muted-foreground font-mono">Indexados: 45,201 nodos</p>
            <p className="text-xs text-muted-foreground font-mono">Última sync: Hace 2 min</p>
          </div>
        </div>
      </aside>

      {/* 2. ÁREA PRINCIPAL: LA CONSOLA (CHAT INTERACTIVO) */}
      <main className="flex-1 bg-card border border-border rounded-2xl flex flex-col relative overflow-hidden shadow-sm">
        
        {/* Topbar de la Consola */}
        <header className="h-16 px-6 border-b border-border flex items-center justify-between bg-background/50 backdrop-blur-md z-10 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              Auditoría Nexus Q2
            </h2>
            <p className="text-xs text-muted-foreground">Contexto inyectado: 3 Documentos, 45 Tareas, 1 Canal de Chat.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
              <span className="text-xs font-semibold text-amber-500">Modo Autónomo Activo</span>
              <ToggleRight className="w-5 h-5 text-amber-500" />
            </div>
            <button className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-secondary"><Settings className="w-4 h-4" /></button>
          </div>
        </header>

        {/* FEED DE LA CONSOLA (Scrollable) */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
          
          {/* Mensaje del Usuario */}
          <div className="flex gap-4 max-w-4xl mx-auto">
            <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0 mt-1 text-xs font-bold text-foreground">
              JM
            </div>
            <div className="flex-1 pt-1.5">
              <h4 className="text-sm font-semibold text-foreground mb-1">Juan M.</h4>
              <p className="text-sm text-foreground/90 leading-relaxed">
                Ejecuta una auditoría profunda del estado actual del <span className="bg-secondary px-1.5 py-0.5 rounded border border-border text-xs font-mono">Proyecto Nexus</span>. Busca cuellos de botella y si encuentras tareas críticas atrasadas, reasígnalas al equipo disponible.
              </p>
            </div>
          </div>

          {/* Respuesta de la IA (El superpoder del OS) */}
          <div className="flex gap-4 max-w-4xl mx-auto relative group">
            {/* Action Bar Flotante (Copy, Regenerate, etc) */}
            <div className="absolute -top-3 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-lg flex items-center p-0.5 z-10">
              <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md text-xs font-medium">Copiar</button>
              <div className="w-px h-4 bg-border mx-1"></div>
              <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md text-xs font-medium flex items-center gap-1"><History className="w-3.5 h-3.5"/> Regenerar</button>
            </div>

            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 mt-1 relative">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            
            <div className="flex-1 pt-1.5">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-sm font-semibold text-primary">IA COO</h4>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Activity className="w-3 h-3"/> Analizando 45 nodos...</span>
              </div>
              
              <div className="text-sm text-foreground/90 leading-relaxed space-y-4">
                <p>He completado la auditoría del proyecto <strong>Nexus</strong>. El proyecto se encuentra al 68% de completitud, pero he detectado un riesgo severo en el flujo de entrega frontend.</p>
                
                {/* Embedded OS Action Results */}
                <div className="bg-secondary/30 border border-border rounded-xl p-1 font-sans">
                  
                  {/* Entity 1: Report */}
                  <div className="p-3 border-b border-border flex items-start gap-3 hover:bg-secondary/50 transition-colors">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Cuello de Botella Detectado</p>
                      <p className="text-xs text-muted-foreground mt-0.5">La tarea <span className="underline cursor-pointer hover:text-primary">NEX-140 (Omni-Switcher)</span> lleva 3 días en &quot;En Progreso&quot;. Carlos M. tiene sobrecarga de tickets (8 activos).</p>
                    </div>
                  </div>

                  {/* Entity 2: Autonomous Action Taken */}
                  <div className="p-3 flex items-start gap-3 bg-primary/5 rounded-b-xl hover:bg-primary/10 transition-colors">
                    <CheckSquare className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-primary flex items-center gap-2">
                        Acción Autónoma Ejecutada
                        <span className="bg-primary/20 border border-primary/30 text-primary px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold">Auto-Mode</span>
                      </p>
                      <p className="text-xs text-foreground/80 mt-1">
                        He reasignado <strong>NEX-140</strong> a Sarah R. (quien acaba de terminar su sprint) y he notificado a Carlos M. en el canal <span className="font-mono text-muted-foreground">#dev-nexus</span>.
                      </p>
                    </div>
                  </div>
                </div>

                <p>¿Deseas que genere el reporte formal en PDF y lo envíe al cliente <span className="bg-secondary px-1.5 py-0.5 rounded text-xs cursor-pointer border border-border hover:border-primary">Acme Corp</span>?</p>
                
                {/* Smart Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button className="text-xs font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(0,255,135,0.2)] hover:shadow-[0_0_20px_rgba(0,255,135,0.4)] transition-all flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 fill-current" /> Sí, generar reporte
                  </button>
                  <button className="text-xs font-medium bg-background border border-border text-foreground hover:bg-secondary px-3 py-1.5 rounded-lg transition-colors">
                    Mostrar detalles del código
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 3. INPUT AREA (El Terminal del Usuario) */}
        <div className="p-4 bg-background/50 border-t border-border shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="bg-secondary/40 border border-border rounded-xl p-2 focus-within:border-primary/50 focus-within:bg-secondary/80 transition-all focus-within:shadow-[0_0_20px_rgba(0,255,135,0.05)] relative">
              <textarea 
                placeholder="Pide un análisis, solicita una acción o haz una pregunta a la base de conocimiento..."
                className="w-full bg-transparent text-sm text-foreground resize-none outline-none min-h-[56px] max-h-[200px] p-2 placeholder:text-muted-foreground/60"
                rows={2}
              ></textarea>
              
              <div className="flex items-center justify-between px-2 pt-2 border-t border-border/50">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <button className="p-1.5 hover:text-foreground hover:bg-background rounded-md transition-colors" title="Adjuntar Contexto (Archivo/Proyecto)"><Plus className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:text-foreground hover:bg-background rounded-md transition-colors" title="Vincular Entidad"><Database className="w-4 h-4" /></button>
                  <div className="w-px h-4 bg-border mx-1"></div>
                  <button className="p-1.5 hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Dictado por Voz"><Mic className="w-4 h-4" /></button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground font-mono hidden sm:inline-block mr-2">
                    <kbd className="bg-background border border-border px-1 rounded">↵</kbd> para enviar
                  </span>
                  <button className="bg-primary text-primary-foreground p-2 rounded-lg hover:shadow-[0_0_15px_rgba(0,255,135,0.4)] transition-all">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTES DE LA CONSOLA IA
// ==========================================

function SidebarItem({
  icon: Icon,
  label,
  active,
  alert,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  active?: boolean;
  alert?: boolean;
}) {
  return (
    <button className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${
      active 
        ? "bg-secondary text-foreground font-medium" 
        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
    }`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${active ? "text-foreground" : "opacity-70 group-hover:opacity-100"}`} />
        <span className="text-sm">{label}</span>
      </div>
      {alert && (
        <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
      )}
    </button>
  );
}

function HistoryItem({ title, date }: { title: string; date: string }) {
  return (
    <button className="w-full flex flex-col gap-1 px-3 py-2 rounded-lg transition-colors hover:bg-secondary/50 text-left group">
      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground truncate w-full">
        {title}
      </span>
      <span className="text-[10px] text-muted-foreground/60 font-mono">
        {date}
      </span>
    </button>
  );
}