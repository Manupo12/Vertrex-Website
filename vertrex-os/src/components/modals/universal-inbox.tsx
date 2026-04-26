import React, { useState } from "react";
import { 
  X, Bell, AtSign, Zap, Archive, CheckCircle2, 
  MessageSquare, FolderKanban, AlertTriangle, 
  ArrowRight, FileText, Bot, Clock, ChevronRight, Search
} from "lucide-react";

export default function UniversalInboxPanel() {
  // Estado simulado para las pestañas
  const [activeTab, setActiveTab] = useState<"inbox" | "ai" | "archived">("inbox");

  return (
    <>
      {/* 1. BACKDROP OVERLAY (Transparente para poder ver el fondo pero capturar clics) */}
      <div className="fixed inset-0 z-[80]" />

      {/* 2. PANEL DESPLEGABLE (Slide-in desde la derecha) */}
      <div className="fixed top-14 right-4 h-[calc(100vh-4.5rem)] w-full max-w-[400px] bg-card border border-border shadow-2xl rounded-2xl z-[90] flex flex-col transform transition-transform duration-300 animate-fade-in overflow-hidden">
        
        {/* HEADER: Título y Acciones Globales */}
        <header className="px-4 py-3 border-b border-border flex items-center justify-between bg-background/50 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              Inbox Unificado
            </h2>
            <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-md">
              4 Nuevas
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-muted-foreground">
            <button className="text-[10px] font-medium uppercase tracking-wider hover:text-foreground hover:bg-secondary px-2 py-1.5 rounded transition-colors">
              Marcar Leídas
            </button>
            <div className="w-px h-3 bg-border mx-1"></div>
            <button className="p-1.5 hover:bg-secondary hover:text-foreground rounded-md transition-colors"><X className="w-4 h-4" /></button>
          </div>
        </header>

        {/* NAVEGACIÓN INTERNA (Tabs) */}
        <div className="flex px-2 pt-2 border-b border-border bg-secondary/20 shrink-0">
          <TabButton 
            active={activeTab === "inbox"} 
            onClick={() => setActiveTab("inbox")} 
            icon={AtSign} 
            label="Para ti" 
            count={2} 
          />
          <TabButton 
            active={activeTab === "ai"} 
            onClick={() => setActiveTab("ai")} 
            icon={Zap} 
            label="Alertas IA" 
            count={2} 
            alert 
          />
          <TabButton 
            active={activeTab === "archived"} 
            onClick={() => setActiveTab("archived")} 
            icon={Archive} 
            label="Archivo" 
          />
        </div>

        {/* ÁREA SCROLLEABLE DE NOTIFICACIONES */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2 bg-[#080808]">
          
          {activeTab === "inbox" && (
            <>
              {/* Notificación 1: Mención en Chat */}
              <NotificationCard 
                type="mention"
                icon={MessageSquare}
                iconColor="text-blue-400"
                iconBg="bg-blue-400/10 border-blue-400/20"
                title="Sarah R. te mencionó en #dev-nexus"
                time="Hace 5 min"
                content="¿Revisaste el PR de la migración a Tailwind v4? El cliente está preguntando por las fechas."
                actionLabel="Responder en hilo"
                isUnread
              />

              {/* Notificación 2: Asignación de Tarea */}
              <NotificationCard 
                type="task"
                icon={FolderKanban}
                iconColor="text-purple-400"
                iconBg="bg-purple-400/10 border-purple-400/20"
                title="Te han asignado a NEX-145"
                time="Hace 1 hora"
                content="Despliegue a Producción (Fase 1)"
                metadata="Proyecto Nexus Core"
                actionLabel="Ver Tarea"
                isUnread
              />

              {/* Divisor de Fecha */}
              <div className="flex items-center justify-center relative py-2">
                <div className="absolute w-full h-px bg-border/50"></div>
                <span className="bg-[#080808] px-2 text-[10px] font-bold uppercase text-muted-foreground relative z-10">Ayer</span>
              </div>

              {/* Notificación 3: Documento Compartido */}
              <NotificationCard 
                type="doc"
                icon={FileText}
                iconColor="text-foreground"
                iconBg="bg-secondary border-border"
                title="Carlos M. compartió un documento"
                time="Ayer"
                content="PRD_Vertrex_Automatizaciones_v1.md"
                actionLabel="Abrir Documento"
              />
            </>
          )}

          {activeTab === "ai" && (
            <>
              {/* Notificación IA Crítica (Resolución en 1 clic) */}
              <div className="bg-amber-500/5 border border-amber-500/30 rounded-xl p-3 relative group">
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground pr-4">Riesgo Financiero (CFO IA)</h4>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 mb-2">
                      <Clock className="w-3 h-3" /> Hace 10 min
                    </p>
                    <p className="text-xs text-foreground/80 leading-relaxed mb-3">
                      La factura <span className="font-mono text-muted-foreground">#INV-042</span> de GlobalBank ($45,000) vence hoy y no tiene evento de cobro programado.
                    </p>
                    <div className="flex gap-2">
                      <button className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-amber-950 px-3 py-1.5 rounded hover:bg-amber-400 transition-colors">
                        Generar Recordatorio
                      </button>
                      <button className="text-[10px] font-bold uppercase tracking-wider bg-secondary text-muted-foreground px-3 py-1.5 rounded hover:bg-secondary/80 hover:text-foreground transition-colors">
                        Ignorar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notificación IA Insight */}
              <NotificationCard 
                type="ai-insight"
                icon={Bot}
                iconColor="text-primary"
                iconBg="bg-primary/10 border-primary/20"
                title="Resumen Automático Listo"
                time="Hace 2 horas"
                content="He generado las minutas y extraído 3 tareas de tu última reunión de Meet con Acme Corp."
                actionLabel="Revisar Tareas"
                isUnread
              />
            </>
          )}

        </div>

        {/* FOOTER: Atajo al Command Center */}
        <div className="p-3 border-t border-border bg-background shrink-0">
          <button className="w-full flex items-center justify-between px-3 py-2 bg-secondary/50 hover:bg-secondary rounded-lg border border-border transition-colors group">
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground flex items-center gap-2">
              <Search className="w-3.5 h-3.5" /> Buscar en todo el Inbox
            </span>
            <kbd className="text-[10px] font-mono text-muted-foreground bg-background px-1.5 rounded border border-border">Cmd+I</kbd>
          </button>
        </div>

      </div>
    </>
  );
}

// ==========================================
// SUB-COMPONENTES DEL INBOX
// ==========================================

function TabButton({ active, onClick, icon: Icon, label, count, alert }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 flex justify-center items-center gap-2 pb-2 border-b-2 text-xs font-semibold transition-colors relative ${
        active ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border/50"
      }`}
    >
      <Icon className={`w-3.5 h-3.5 ${active ? "text-primary" : ""}`} />
      {label}
      {count && (
        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${active ? "bg-primary/20 text-primary" : "bg-background border border-border text-muted-foreground"}`}>
          {count}
        </span>
      )}
      {alert && <span className="absolute top-0 right-2 w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
    </button>
  );
}

function NotificationCard({ icon: Icon, iconColor, iconBg, title, time, content, metadata, actionLabel, isUnread }: any) {
  return (
    <div className={`p-3 rounded-xl border transition-all group relative ${
      isUnread ? 'bg-card border-border hover:border-primary/30' : 'bg-card/50 border-transparent hover:border-border hover:bg-card'
    }`}>
      {isUnread && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary"></div>}
      
      <div className="flex items-start gap-3">
        <div className={`p-1.5 rounded-lg border shrink-0 mt-0.5 ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        
        <div className="flex-1 min-w-0 pr-4">
          <p className={`text-sm leading-tight mb-0.5 ${isUnread ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'}`}>
            {title}
          </p>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1 mb-1.5">
            <Clock className="w-3 h-3" /> {time}
          </p>
          
          <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2">
            {content}
          </div>
          
          {metadata && (
            <span className="inline-block bg-secondary px-1.5 py-0.5 rounded text-[9px] uppercase font-bold text-muted-foreground border border-border mb-2">
              {metadata}
            </span>
          )}
          
          {/* Quick Actions (Aparecen on hover o si es Unread) */}
          <div className={`flex items-center gap-2 mt-1 ${isUnread ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
            <button className="text-[10px] font-bold uppercase tracking-wider text-primary hover:text-primary-foreground hover:bg-primary border border-primary/20 px-2 py-1 rounded transition-colors flex items-center gap-1">
              {actionLabel} <ChevronRight className="w-3 h-3" />
            </button>
            <button className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors" title="Archivar">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}