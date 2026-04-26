"use client";

import { useUIStore } from "@/lib/store/ui";
import { 
  Calendar as CalendarIcon, Clock, Users, Video, 
  Sparkles, Plus, ChevronLeft, ChevronRight, 
  ListTodo, ArrowUpRight, Building2, AlignLeft,
  CalendarDays, Zap, CheckSquare
} from "lucide-react";

export default function AgendaPage() {
  const open = useUIStore((store) => store.open);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6 animate-fade-in pb-4">
      
      {/* 1. SIDEBAR DE AGENDA (Mini-calendario & IA Follow-ups) */}
      <aside className="w-[280px] shrink-0 flex flex-col gap-6 overflow-y-auto no-scrollbar">
        
        {/* Controles y Mini-Calendario */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              Agenda
            </h1>
            <button className="p-1.5 text-muted-foreground hover:bg-secondary rounded-md hover:text-foreground transition-colors">
              <CalendarDays className="w-5 h-5" />
            </button>
          </div>
          
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 mb-6 text-sm font-semibold text-primary-foreground bg-primary rounded-lg shadow-[0_0_15px_rgba(0,255,135,0.2)] hover:shadow-[0_0_25px_rgba(0,255,135,0.4)] transition-all" onClick={() => open("createEvent")}>
            <Plus className="w-4 h-4" />
            Nuevo Evento
          </button>

          {/* Mini Calendario UI (Simulado visualmente) */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-foreground">Abril 2026</span>
              <div className="flex gap-1">
                <button className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded"><ChevronLeft className="w-4 h-4" /></button>
                <button className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
              <span className="text-muted-foreground font-medium">Lu</span>
              <span className="text-muted-foreground font-medium">Ma</span>
              <span className="text-muted-foreground font-medium">Mi</span>
              <span className="text-muted-foreground font-medium">Ju</span>
              <span className="text-muted-foreground font-medium">Vi</span>
              <span className="text-muted-foreground font-medium">Sa</span>
              <span className="text-muted-foreground font-medium">Do</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {/* Row 1 */}
              <span className="p-1.5 text-muted-foreground/30">30</span>
              <span className="p-1.5 text-muted-foreground/30">31</span>
              <span className="p-1.5 text-foreground hover:bg-secondary rounded cursor-pointer">1</span>
              <span className="p-1.5 text-foreground hover:bg-secondary rounded cursor-pointer">2</span>
              <span className="p-1.5 text-foreground hover:bg-secondary rounded cursor-pointer">3</span>
              <span className="p-1.5 text-foreground hover:bg-secondary rounded cursor-pointer">4</span>
              <span className="p-1.5 text-foreground hover:bg-secondary rounded cursor-pointer">5</span>
              {/* Row 2 */}
              <span className="p-1.5 text-foreground hover:bg-secondary rounded cursor-pointer">6</span>
              <span className="p-1.5 text-foreground hover:bg-secondary rounded cursor-pointer relative">
                7<div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500"></div>
              </span>
              <span className="p-1.5 text-foreground hover:bg-secondary rounded cursor-pointer relative">
                8<div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></div>
              </span>
              <span className="p-1.5 text-foreground hover:bg-secondary rounded cursor-pointer">9</span>
              <span className="p-1.5 text-foreground hover:bg-secondary rounded cursor-pointer">10</span>
              <span className="p-1.5 text-foreground hover:bg-secondary rounded cursor-pointer">11</span>
              <span className="p-1.5 text-foreground hover:bg-secondary rounded cursor-pointer">12</span>
              {/* Row 3 (Current Week) */}
              <span className="p-1.5 text-foreground hover:bg-secondary rounded cursor-pointer">13</span>
              <span className="p-1.5 text-foreground hover:bg-secondary rounded cursor-pointer">14</span>
              <span className="p-1.5 text-foreground hover:bg-secondary rounded cursor-pointer">15</span>
              <span className="p-1.5 text-foreground hover:bg-secondary rounded cursor-pointer relative">
                16<div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></div>
              </span>
              <span className="p-1.5 text-foreground hover:bg-secondary rounded cursor-pointer relative">
                17<div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-500"></div>
              </span>
              <span className="p-1.5 text-foreground hover:bg-secondary rounded cursor-pointer">18</span>
              <span className="p-1.5 text-foreground hover:bg-secondary rounded cursor-pointer">19</span>
              {/* Row 4 (Current Day) */}
              <span className="p-1.5 bg-primary text-primary-foreground font-bold rounded cursor-pointer shadow-[0_0_10px_rgba(0,255,135,0.3)]">20</span>
              <span className="p-1.5 text-foreground hover:bg-secondary rounded cursor-pointer relative">
                21<div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500"></div>
              </span>
              <span className="p-1.5 text-foreground hover:bg-secondary rounded cursor-pointer">22</span>
            </div>
          </div>
        </div>

        {/* Listas de Calendarios (Filtros) */}
        <div>
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">Mis Calendarios</h3>
          <div className="space-y-2">
            <CalendarToggle label="Principal" color="bg-primary" active />
            <CalendarToggle label="Llamadas de Ventas" color="bg-blue-500" active />
            <CalendarToggle label="Reuniones Internas" color="bg-purple-500" active />
            <CalendarToggle label="Bloqueos de Trabajo" color="bg-muted-foreground" active />
          </div>
        </div>

        {/* IA COO: SUGERENCIAS DE FOLLOW-UP */}
        <div className="mt-2 bg-card border border-primary/20 rounded-xl p-4 shadow-[0_0_20px_rgba(0,255,135,0.02)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-semibold text-foreground">Acciones Pendientes (IA)</h3>
          </div>
          <div className="space-y-3">
            <AIFollowUpCard 
              client="TechFlow Inc." 
              reason="La reunión de ayer terminó sin próximos pasos." 
              action="Agendar Follow-up" 
              onClick={() => open("createEvent")}
            />
            <AIFollowUpCard 
              client="Proyecto Nexus" 
              reason="El sprint termina mañana, no hay review programada." 
              action="Crear Evento" 
              onClick={() => open("eventDetail", "nexus-review")}
            />
          </div>
        </div>

      </aside>

      {/* 2. ÁREA PRINCIPAL (TIMELINE DEL DÍA/SEMANA) */}
      <main className="flex-1 bg-card border border-border rounded-2xl flex flex-col overflow-hidden relative">
        
        {/* Topbar del Calendario */}
        <header className="h-16 px-6 border-b border-border flex items-center justify-between bg-background/50 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-foreground">Lunes, 20 de Abril</h2>
            <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-1 border border-border">
              <button className="px-3 py-1 text-xs font-medium bg-background text-foreground shadow-sm rounded-md border border-border">Día</button>
              <button className="px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Semana</button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 border border-border px-3 py-1.5 rounded-lg bg-secondary/50 transition-colors">
              <AlignLeft className="w-3.5 h-3.5" /> Hoy
            </button>
          </div>
        </header>

        {/* TIMELINE GRID (Área scrolleable) */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative p-4">
          
          {/* Línea de tiempo actual (Sync Live) */}
          <div className="absolute left-0 w-full flex items-center z-20 pointer-events-none top-[380px]">
            <div className="w-16 text-right pr-4 text-xs font-bold text-primary">10:47 AM</div>
            <div className="flex-1 border-t border-primary relative">
              <div className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,135,0.8)]"></div>
            </div>
          </div>

          {/* Grilla de horas */}
          <div className="relative">
            <TimeRow hour="08:00 AM" />
            <TimeRow hour="09:00 AM" />
            <TimeRow hour="10:00 AM" />
            <TimeRow hour="11:00 AM" />
            <TimeRow hour="12:00 PM" />
            <TimeRow hour="01:00 PM" />
            <TimeRow hour="02:00 PM" />
            <TimeRow hour="03:00 PM" />
            <TimeRow hour="04:00 PM" />

            {/* EVENTOS (Posicionamiento Absoluto Simulado sobre el grid) */}
            
            {/* Evento Pasado (Con resumen IA) */}
            <div className="absolute top-[60px] left-16 right-4">
              <EventBlock 
                title="Sync Diario - Equipo Nexus" 
                time="09:00 AM - 09:45 AM" 
                type="internal"
                color="border-purple-500/50 bg-purple-500/10 text-purple-400"
                hasAIReport={true}
                isPast={true}
                onOpen={() => open("eventDetail", "nexus-review")}
              />
            </div>

            {/* Evento Actual / Inminente */}
            <div className="absolute top-[360px] left-16 right-4">
              <EventBlock 
                title="Presentación Propuesta (GlobalBank)" 
                time="11:00 AM - 12:30 PM" 
                type="client"
                entityLink="GlobalBank"
                color="border-primary bg-primary/10 text-primary"
                isNext={true}
                participants={["JM", "SR", "CL"]}
                onOpen={() => open("eventDetail", "globalbank-presentation")}
              />
            </div>

            {/* Evento Futuro (Bloqueo de Trabajo) */}
            <div className="absolute top-[600px] left-16 right-[50%]">
              <EventBlock 
                title="Deep Work: Migración DB" 
                time="02:00 PM - 04:00 PM" 
                type="focus"
                entityLink="NEX-140"
                color="border-border bg-secondary/50 text-foreground"
                onOpen={() => open("eventDetail", "deep-work-migration")}
              />
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}

// ==========================================
// SUB-COMPONENTES DE AGENDA
// ==========================================

function CalendarToggle({ label, color, active }: any) {
  return (
    <label className="flex items-center gap-3 px-2 py-1.5 hover:bg-secondary/50 rounded-lg cursor-pointer transition-colors group">
      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${active ? `bg-background ${color.replace('bg-', 'border-')}` : 'border-border'}`}>
        {active && <div className={`w-2 h-2 rounded-sm ${color}`}></div>}
      </div>
      <span className={`text-sm ${active ? 'text-foreground font-medium' : 'text-muted-foreground'} group-hover:text-foreground`}>
        {label}
      </span>
    </label>
  );
}

function AIFollowUpCard({ client, reason, action, onClick }: any) {
  return (
    <div className="bg-background border border-border rounded-lg p-3 group hover:border-primary/30 transition-colors">
      <p className="text-xs font-semibold text-foreground mb-1">{client}</p>
      <p className="text-[10px] text-muted-foreground mb-2 leading-relaxed">{reason}</p>
      <button className="text-[10px] font-bold uppercase text-primary hover:text-primary-foreground hover:bg-primary border border-primary/20 px-2 py-1 rounded transition-colors w-full text-center" onClick={onClick}>
        {action}
      </button>
    </div>
  );
}

function TimeRow({ hour }: { hour: string }) {
  return (
    <div className="flex items-start h-[120px] border-b border-border/30 group">
      <div className="w-16 shrink-0 text-right pr-4">
        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors relative top-[-8px]">
          {hour}
        </span>
      </div>
      <div className="flex-1 h-full border-l border-border/30"></div>
    </div>
  );
}

function EventBlock({ title, time, type, entityLink, color, participants, hasAIReport, isNext, isPast, onOpen }: any) {
  return (
    <div className={`rounded-xl border p-3 flex flex-col gap-2 transition-all cursor-pointer group ${color} ${isPast ? 'opacity-60 hover:opacity-100' : 'shadow-sm hover:shadow-md'} ${isNext ? 'shadow-[0_0_20px_rgba(0,255,135,0.05)]' : ''}`} onClick={onOpen}>
      
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-semibold leading-tight mb-1 group-hover:underline decoration-current underline-offset-2">
            {title}
          </h4>
          <span className="text-xs font-mono opacity-80 flex items-center gap-1.5">
            <Clock className="w-3 h-3" /> {time}
          </span>
        </div>
        
        {/* Entidades vinculadas (El superpoder del OS) */}
        {entityLink && (
          <div className="flex items-center gap-1 bg-background/50 px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-current/20 backdrop-blur-sm">
            {type === 'client' ? <Building2 className="w-3 h-3" /> : <ListTodo className="w-3 h-3" />}
            {entityLink}
          </div>
        )}
      </div>

      {/* Footer del Evento (IA y Participantes) */}
      <div className="mt-auto pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {type !== 'focus' && (
            <div className="flex items-center gap-1 text-[10px] bg-background/50 px-1.5 py-0.5 rounded border border-current/20 font-medium">
              <Video className="w-3 h-3" /> Meet
            </div>
          )}
          
          {/* Botones de IA Dinámicos */}
          {hasAIReport && (
            <button className="flex items-center gap-1 text-[10px] bg-background/80 px-1.5 py-0.5 rounded border border-current/30 font-bold hover:bg-current hover:text-background transition-colors" onClick={(event) => event.stopPropagation()}>
              <CheckSquare className="w-3 h-3" /> Tareas Generadas (3)
            </button>
          )}
          {isNext && (
            <button className="flex items-center gap-1 text-[10px] bg-background/80 px-1.5 py-0.5 rounded border border-current/30 font-bold hover:bg-current hover:text-background transition-colors animate-pulse" onClick={(event) => event.stopPropagation()}>
              <Zap className="w-3 h-3" /> Brief Preparado (IA)
            </button>
          )}
        </div>

        {/* Avatares */}
        {participants && (
          <div className="flex -space-x-1">
            {participants.map((p: string, i: number) => (
              <div key={i} className="w-5 h-5 rounded-full bg-background border border-current flex items-center justify-center text-[8px] font-bold z-10 relative">
                {p}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}