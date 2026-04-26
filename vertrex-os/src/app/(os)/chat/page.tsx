"use client";

import { useUIStore } from "@/lib/store/ui";
import { 
  Hash, Search, Plus, MoreHorizontal, MessageSquare, 
  Smile, Paperclip, Send, Zap, CheckSquare, 
  FileText, Bot, ArrowUpRight, GitCommit,
  AtSign, MessageCircle, Bookmark, ExternalLink,
  CornerDownRight
} from "lucide-react";

export default function AsyncChatPage() {
  const open = useUIStore((store) => store.open);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4 animate-fade-in pb-4">
      
      {/* 1. SIDEBAR: BANDEJA DE ENTRADA Y CANALES */}
      <aside className="w-[260px] shrink-0 bg-card border border-border rounded-2xl flex flex-col overflow-hidden">
        
        {/* Cabecera y Búsqueda */}
        <div className="p-4 border-b border-border bg-secondary/20 shrink-0">
          <h2 className="text-lg font-semibold text-foreground flex items-center justify-between mb-4">
            Comunicaciones
            <button className="p-1 text-muted-foreground hover:text-foreground transition-colors bg-secondary/50 rounded hover:bg-secondary" onClick={() => open("universalInbox")}><Plus className="w-4 h-4" /></button>
          </h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input type="text" placeholder="Buscar en mensajes..." className="w-full bg-background border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary transition-all" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-5 mt-2">
          
          {/* BANDEJA DE ENTRADA (Slack Style) */}
          <div>
            <InboxItem icon={AtSign} label="Menciones" unread={2} active onClick={() => open("threadDetail", "dev-thread")} />
            <InboxItem icon={MessageCircle} label="Hilos (Threads)" onClick={() => open("threadDetail", "support-thread")} />
            <InboxItem icon={Bookmark} label="Guardados" onClick={() => open("taskDetail", "thread-task")} />
          </div>

          {/* CANALES DE PROYECTO */}
          <div>
            <div className="flex items-center justify-between px-2 mb-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Proyectos</span>
            </div>
            <ChannelItem icon={Hash} label="dev-nexus" unread={5} onClick={() => open("threadDetail", "dev-thread")} />
            <ChannelItem icon={Hash} label="marketing-q2" onClick={() => open("threadDetail", "marketing-thread")} />
          </div>

          {/* BRIDGE A DISCORD (El atajo inteligente) */}
          <div>
            <div className="flex items-center justify-between px-2 mb-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Voz (Externa)</span>
            </div>
            <a href="discord://server_id/channel_id" className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors group hover:bg-[#5865F2]/10 text-muted-foreground hover:text-[#5865F2]">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                <span className="text-sm">Abrir Discord</span>
              </div>
            </a>
          </div>

          {/* MENSAJES DIRECTOS */}
          <div>
            <div className="flex items-center justify-between px-2 mb-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Directos</span>
              <Plus className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-foreground" />
            </div>
            <DMItem name="Sarah R." status="online" onClick={() => open("threadDetail", "dev-thread")} />
            <DMItem name="IA COO" status="bot" onClick={() => open("threadDetail", "support-thread")} />
          </div>
        </div>
      </aside>

      {/* 2. ÁREA PRINCIPAL: FEED DEL CANAL */}
      <main className="flex-1 bg-card border border-border rounded-2xl flex flex-col relative overflow-hidden">
        
        {/* Topbar del Canal */}
        <header className="h-16 px-6 border-b border-border flex items-center justify-between bg-background/50 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-3">
            <AtSign className="w-5 h-5 text-muted-foreground" />
            <div>
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                Menciones y Tareas
              </h2>
              <p className="text-xs text-muted-foreground">Tu bandeja de entrada unificada de notificaciones y chats.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-xs font-medium text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-lg bg-secondary/50 transition-colors">
              Marcar todo como leído
            </button>
          </div>
        </header>

        {/* FEED DE MENSAJES ASÍNCRONOS */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
          
          {/* Mensaje 1: Con Hilo de Respuestas */}
          <ChatMessage 
            channel="#dev-nexus"
            avatar="SR" 
            name="Sarah R." 
            time="Ayer, 16:30"
            message="He actualizado el diseño del Omni-Switcher. @Juan M., ¿puedes darle una mirada a la implementación de Tailwind v4 antes de hacer merge?"
            hasThread
            threadCount={3}
            lastReplyTime="18:45"
            onOpenThread={() => open("threadDetail", "dev-thread")}
            onCreateTask={() => open("taskDetail", "nex-147")}
          />

          {/* Mensaje 2: Acción Automática / Tarea Asignada */}
          <div className="flex gap-4 group relative px-4 py-3 bg-secondary/20 border border-primary/20 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mt-1">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-foreground">IA COO</span>
                <span className="text-xs text-muted-foreground">Hoy, 09:15 AM</span>
              </div>
              <div className="text-sm text-foreground/90 leading-relaxed">
                Detecté un retraso en la revisión del PR. He creado una tarea de recordatorio.
              </div>
              {/* Tarea Embebida */}
              <div className="mt-3 flex items-center justify-between p-2 bg-background border border-border rounded-lg max-w-md hover:border-primary/50 transition-colors cursor-pointer" onClick={() => open("taskDetail", "nex-147")}>
                <div className="flex items-center gap-3">
                  <CheckSquare className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Revisar PR Tailwind v4</p>
                    <p className="text-[10px] text-muted-foreground font-mono">NEX-147 • Asignado a ti</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Mensaje 3: Mensaje Directo con Acción Rápida */}
          <ChatMessage 
            channel="Mensaje Directo"
            avatar="CM" 
            name="Carlos M." 
            time="Hace 10 min"
            isHighlight
            message="El cliente acaba de mandar los assets del logo en un ZIP, te los dejo por aquí. ¿Me avisas cuando estén subidos al Hub?"
            quickActions={true}
            onCreateTask={() => open("taskDetail", "upload-assets")}
            onUpload={() => open("uploadFile", { context: "Chat" })}
          />

        </div>

        {/* 3. INPUT AREA (Editor Rich Text) */}
        <div className="p-4 bg-background/50 border-t border-border shrink-0">
          <div className="bg-secondary/40 border border-border rounded-xl p-2 focus-within:border-primary/50 focus-within:bg-secondary/80 transition-all focus-within:shadow-[0_0_15px_rgba(0,255,135,0.05)]">
            <textarea 
              placeholder="Escribe una respuesta o usa '/' para mencionar una tarea..."
              className="w-full bg-transparent text-sm text-foreground resize-none outline-none min-h-[44px] max-h-[200px] p-2 placeholder:text-muted-foreground/70"
              rows={1}
            ></textarea>
            
            <div className="flex items-center justify-between px-2 pt-2 border-t border-border/50">
              <div className="flex items-center gap-1 text-muted-foreground">
                <button className="p-1.5 hover:text-foreground hover:bg-background rounded-md transition-colors" title="Adjuntar" onClick={() => open("uploadFile", { context: "Chat" })}><Paperclip className="w-4 h-4" /></button>
                <button className="p-1.5 hover:text-foreground hover:bg-background rounded-md transition-colors" title="Mencionar Tarea"><Hash className="w-4 h-4" /></button>
                <div className="w-px h-4 bg-border mx-1"></div>
                <button className="flex items-center gap-1 p-1.5 hover:text-primary hover:bg-primary/10 rounded-md transition-colors text-[10px] font-bold uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5" /> IA Redactar
                </button>
              </div>
              
              <button className="bg-primary text-primary-foreground p-1.5 rounded-lg hover:shadow-[0_0_15px_rgba(0,255,135,0.4)] transition-all">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTES ACTUALIZADOS
// ==========================================

function InboxItem({ icon: Icon, label, unread, active, onClick }: any) {
  return (
    <button className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors group ${active ? "bg-primary/10 text-primary" : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"}`} onClick={onClick}>
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${active ? "text-primary" : "opacity-70 group-hover:opacity-100"}`} />
        <span className={`text-sm ${active ? 'font-medium' : ''}`}>{label}</span>
      </div>
      {unread && <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 rounded-md min-w-[18px] text-center">{unread}</span>}
    </button>
  );
}

function ChannelItem({ icon: Icon, label, unread, onClick }: any) {
  return (
    <button className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors group hover:bg-secondary/50 text-muted-foreground hover:text-foreground" onClick={onClick}>
      <div className="flex items-center gap-2"><Icon className="w-4 h-4 opacity-70 group-hover:opacity-100" /><span className="text-sm">{label}</span></div>
      {unread && <span className="text-[10px] font-bold px-1.5 rounded-md bg-secondary text-foreground">{unread}</span>}
    </button>
  );
}

function DMItem({ name, status, onClick }: any) {
  return (
    <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary/50 transition-colors group text-muted-foreground hover:text-foreground" onClick={onClick}>
      <div className="relative">
        <div className="w-5 h-5 rounded bg-secondary flex items-center justify-center text-[10px] font-bold text-foreground">
          {status === 'bot' ? <Bot className="w-3 h-3 text-primary" /> : name.charAt(0)}
        </div>
        <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-card ${status === 'online' ? 'bg-primary' : status === 'bot' ? 'bg-purple-500' : 'bg-transparent'}`}></div>
      </div>
      <span className="text-sm">{name}</span>
    </button>
  );
}

function ChatMessage({ channel, avatar, name, time, message, hasThread, threadCount, lastReplyTime, isHighlight, quickActions, onOpenThread, onCreateTask, onUpload }: any) {
  return (
    <div className={`flex gap-4 group relative -mx-4 px-4 py-2 hover:bg-secondary/10 transition-colors rounded-lg ${isHighlight ? 'bg-primary/5' : ''}`}>
      
      {/* Action Bar Flotante */}
      <div className="absolute -top-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-card border border-border rounded-lg shadow-lg flex items-center p-0.5 z-10">
        <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md"><Smile className="w-4 h-4" /></button>
        <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md"><Bookmark className="w-4 h-4" /></button>
        <div className="w-px h-4 bg-border mx-1"></div>
        <button className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 rounded-md transition-colors" onClick={onCreateTask}>
          <CheckSquare className="w-3.5 h-3.5" /> Tarea
        </button>
      </div>

      <div className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center mt-1 text-sm font-bold text-foreground shrink-0">
        {avatar}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-foreground">{name}</span>
          <span className="text-[10px] font-medium text-muted-foreground bg-secondary/50 px-1.5 rounded">{channel}</span>
          <span className="text-xs text-muted-foreground ml-1">{time}</span>
        </div>
        
        <div className="text-sm text-foreground/90 leading-relaxed pr-8">
          {message}
        </div>

        {/* Hilo de Respuestas (Estilo Slack) */}
        {hasThread && (
          <div className="mt-2 flex items-center gap-2 group/thread cursor-pointer" onClick={onOpenThread}>
            <div className="flex -space-x-1">
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[8px] text-primary-foreground font-bold border border-background">JM</div>
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white font-bold border border-background">SR</div>
            </div>
            <span className="text-xs font-semibold text-primary group-hover/thread:underline">{threadCount} respuestas</span>
            <span className="text-[10px] text-muted-foreground">Última a las {lastReplyTime}</span>
            <CornerDownRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover/thread:opacity-100 transition-opacity" />
          </div>
        )}

        {/* Botones rápidos */}
        {quickActions && (
          <div className="mt-3 flex gap-2">
            <button className="text-[10px] uppercase font-bold text-muted-foreground hover:text-primary bg-background border border-border px-2 py-1 rounded transition-colors flex items-center gap-1" onClick={onCreateTask}>
              <CheckSquare className="w-3 h-3" /> Crear Tarea
            </button>
            <button className="text-[10px] uppercase font-bold text-muted-foreground hover:text-primary bg-background border border-border px-2 py-1 rounded transition-colors flex items-center gap-1" onClick={onUpload}>
              <Paperclip className="w-3 h-3" /> Subir al Hub
            </button>
          </div>
        )}
      </div>
    </div>
  );
}