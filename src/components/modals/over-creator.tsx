import React, { useState } from "react";
import { 
  X, CheckSquare, Building2, FolderKanban, 
  CalendarDays, Zap, FileText, ChevronDown,
  User, GitCommit, Link2, AlignLeft, Send
} from "lucide-react";

export default function OmniCreatorModal() {
  // Estado para controlar qué entidad estamos creando
  const [entityType, setEntityType] = useState<"task" | "client" | "project">("task");

  return (
    <>
      {/* 1. BACKDROP BLUR */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] animate-fade-in" />

      {/* 2. OMNI-MODAL CONTAINER */}
      <div className="fixed top-[15vh] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl z-[101] overflow-hidden flex flex-col transform transition-all animate-fade-in">
        
        {/* HEADER: Selector de Entidad Dinámico */}
        <div className="px-5 py-4 border-b border-border bg-secondary/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Crear nuevo/a</span>
            
            {/* Entity Selector (Mutador de UI) */}
            <div className="relative group">
              <button className="flex items-center gap-2 bg-background border border-border px-3 py-1.5 rounded-lg text-sm font-semibold text-foreground hover:border-primary/50 transition-colors">
                {entityType === "task" && <><CheckSquare className="w-4 h-4 text-primary" /> Tarea</>}
                {entityType === "client" && <><Building2 className="w-4 h-4 text-blue-400" /> Cliente</>}
                {entityType === "project" && <><FolderKanban className="w-4 h-4 text-purple-400" /> Proyecto</>}
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-1" />
              </button>
              
              {/* Dropdown Simulado */}
              <div className="absolute top-full left-0 mt-1 w-40 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                <DropdownItem icon={CheckSquare} label="Tarea" onClick={() => setEntityType("task")} color="text-primary" />
                <DropdownItem icon={Building2} label="Cliente" onClick={() => setEntityType("client")} color="text-blue-400" />
                <DropdownItem icon={FolderKanban} label="Proyecto" onClick={() => setEntityType("project")} color="text-purple-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all">
              <Zap className="w-3.5 h-3.5" /> Auto-completar (IA)
            </button>
            <div className="w-px h-4 bg-border mx-1"></div>
            <button className="text-muted-foreground hover:bg-destructive/20 hover:text-destructive p-1.5 rounded-md transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* BODY: Formulario Mutante */}
        <div className="p-5 overflow-y-auto max-h-[60vh] no-scrollbar">
          
          {/* VARIANTE A: CREAR TAREA */}
          {entityType === "task" && (
            <div className="space-y-4 animate-fade-in">
              <input 
                autoFocus
                type="text" 
                placeholder="Título de la tarea..." 
                className="w-full bg-transparent text-xl font-semibold text-foreground placeholder:text-muted-foreground/50 outline-none border-none px-1"
              />
              
              <div className="flex flex-wrap gap-2 pt-2">
                <PropertyBadge icon={FolderKanban} label="Proyecto Nexus" />
                <PropertyBadge icon={User} label="Asignar a..." isGhost />
                <PropertyBadge icon={GitCommit} label="Prioridad" isGhost />
                <PropertyBadge icon={CalendarDays} label="Hoy" />
              </div>

              <div className="mt-4 bg-secondary/30 border border-border rounded-xl p-3 focus-within:border-primary/50 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-muted-foreground px-1">
                  <AlignLeft className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Descripción</span>
                </div>
                <textarea 
                  placeholder="Añade detalles, enlaces o presiona '/' para comandos..."
                  className="w-full bg-transparent text-sm text-foreground resize-none outline-none min-h-[100px] px-1 placeholder:text-muted-foreground/50"
                ></textarea>
              </div>
            </div>
          )}

          {/* VARIANTE B: CREAR CLIENTE (CRM) */}
          {entityType === "client" && (
            <div className="space-y-5 animate-fade-in">
              <input 
                autoFocus
                type="text" 
                placeholder="Nombre de la Empresa..." 
                className="w-full bg-transparent text-xl font-semibold text-foreground placeholder:text-muted-foreground/50 outline-none border-none px-1"
              />
              
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground px-1">Email Principal</label>
                  <input type="email" placeholder="contacto@empresa.com" className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground px-1">Sitio Web</label>
                  <input type="url" placeholder="https://..." className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground px-1">Pipeline Stage</label>
                  <select className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors appearance-none text-foreground">
                    <option>Descubrimiento</option>
                    <option>Propuesta Enviada</option>
                    <option>Negociación</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground px-1">Valor Estimado (MRR)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input type="number" placeholder="0.00" className="w-full bg-secondary/50 border border-border rounded-lg pl-7 pr-3 py-2 text-sm outline-none focus:border-primary transition-colors font-mono" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VARIANTE C: CREAR PROYECTO */}
          {entityType === "project" && (
            <div className="space-y-5 animate-fade-in text-center py-8">
               <div className="w-16 h-16 mx-auto bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-4">
                 <FolderKanban className="w-8 h-8 text-primary" />
               </div>
               <h3 className="text-lg font-semibold text-foreground">Asistente de Proyectos IA</h3>
               <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                 Describe brevemente el proyecto y la IA generará la estructura completa, los hitos y las tareas iniciales.
               </p>
               <div className="bg-secondary/40 border border-border rounded-xl p-2 max-w-lg mx-auto focus-within:border-primary/50 transition-colors text-left flex items-center">
                 <textarea 
                   placeholder="Ej: Migración de la base de datos a Neon Serverless en 3 sprints..."
                   className="w-full bg-transparent text-sm text-foreground resize-none outline-none h-[40px] px-2 pt-2 placeholder:text-muted-foreground/50"
                 ></textarea>
                 <button className="bg-primary text-primary-foreground p-2 rounded-lg hover:shadow-[0_0_15px_rgba(0,255,135,0.4)] transition-all">
                    <Send className="w-4 h-4" />
                 </button>
               </div>
            </div>
          )}

        </div>

        {/* FOOTER: Atajos de teclado y Action Button */}
        <div className="px-5 py-4 border-t border-border bg-background flex items-center justify-between shrink-0">
          <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1.5">
              <kbd className="bg-secondary border border-border px-1.5 py-0.5 rounded text-[10px]">Tab</kbd> Navegar
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="bg-secondary border border-border px-1.5 py-0.5 rounded text-[10px]">⌘</kbd>
              <kbd className="bg-secondary border border-border px-1.5 py-0.5 rounded text-[10px]">Enter</kbd> Crear
            </span>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Cancelar
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg shadow-[0_0_15px_rgba(0,255,135,0.2)] hover:shadow-[0_0_25px_rgba(0,255,135,0.4)] transition-all">
              Crear {entityType === 'task' ? 'Tarea' : entityType === 'client' ? 'Cliente' : 'Proyecto'}
            </button>
          </div>
        </div>

      </div>
    </>
  );
}

// ==========================================
// SUB-COMPONENTES DEL MODAL
// ==========================================

function DropdownItem({ icon: Icon, label, onClick, color }: any) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg">
      <Icon className={`w-4 h-4 ${color}`} />
      {label}
    </button>
  );
}

function PropertyBadge({ icon: Icon, label, isGhost }: any) {
  return (
    <button className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
      isGhost 
        ? "bg-transparent border-dashed border-border text-muted-foreground hover:border-primary/50 hover:text-foreground" 
        : "bg-secondary border-border text-foreground hover:border-primary/30"
    }`}>
      <Icon className={`w-3.5 h-3.5 ${isGhost ? '' : 'text-muted-foreground'}`} />
      {label}
    </button>
  );
}