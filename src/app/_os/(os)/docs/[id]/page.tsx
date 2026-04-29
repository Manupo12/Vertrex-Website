import React from "react";
import { notFound } from "next/navigation";
import { 
  FileText, Share2, History, MoreHorizontal, 
  MessageSquare, Star, ArrowUpRight, Zap, 
  Database, Image as ImageIcon, ChevronRight, Check
} from "lucide-react";

import DocumentDetailScreen from "@/components/os/document-detail-screen";
import { getDocumentById } from "@/lib/docs/document-service";

export default async function DocumentEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const document = await getDocumentById(id);

  if (!document) {
    notFound();
  }

  return <DocumentDetailScreen document={document} />;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background animate-fade-in relative">
      
      {/* 1. DOCUMENT HEADER (Fijo) */}
      <header className="h-14 px-8 flex items-center justify-between shrink-0 bg-background/95 backdrop-blur-md sticky top-0 z-20 border-b border-border/50">
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground font-mono">
            <span className="hover:text-foreground cursor-pointer transition-colors">Producto</span>
            <span>/</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">PRDs</span>
            <span>/</span>
          </div>
          <span className="text-foreground font-medium flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            PRD - Vertrex OS v6.0
          </span>
          <span className="ml-2 px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-secondary/50 text-muted-foreground border border-border">
            Guardado
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <div className="hidden md:flex -space-x-2 mr-4">
            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-background flex items-center justify-center text-[10px] text-white font-bold z-10">SR</div>
            <div className="w-6 h-6 rounded-full bg-primary border-2 border-background flex items-center justify-center text-[10px] text-primary-foreground font-bold z-20 shadow-[0_0_10px_rgba(0,255,135,0.3)]">JM</div>
          </div>
          <button className="px-3 py-1.5 text-xs font-medium hover:bg-muted hover:text-foreground rounded-md transition-colors flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" /> Historial
          </button>
          <button className="px-3 py-1.5 text-xs font-semibold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 rounded-md transition-all flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5" /> Compartir
          </button>
          <button className="p-1.5 hover:bg-muted hover:text-foreground rounded-md transition-colors ml-1">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. EDITOR CANVAS (Scrollable) */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex justify-center">
        <main className="w-full max-w-[850px] px-8 py-12 md:py-20 pb-32">
          
          {/* Cover & Icon Area */}
          <div className="group relative mb-12">
            <div className="w-20 h-20 text-6xl mb-6 hover:bg-secondary/50 rounded-xl flex items-center justify-center cursor-pointer transition-colors border border-transparent hover:border-border">
              🚀
            </div>
            {/* Controles On-Hover (Aparecen al pasar el ratón) */}
            <div className="absolute -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-2 py-1 rounded bg-secondary/50">
                <ImageIcon className="w-3 h-3" /> Añadir portada
              </button>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/50 leading-tight" contentEditable suppressContentEditableWarning>
              GEMS SUPREMO: Product Requirements Document
            </h1>
          </div>

          {/* Bloques de Contenido (Rich Text Simulado) */}
          <article className="text-base text-foreground/90 leading-relaxed space-y-5 outline-none" contentEditable suppressContentEditableWarning>
            
            <p>
              Este documento define la arquitectura y requisitos para el desarrollo del nuevo panel de control. El objetivo principal es reducir la fricción cognitiva del usuario y unificar las fuentes de verdad.
            </p>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-foreground flex items-center group">
              1. Visión Estratégica
              <a href="#" className="opacity-0 group-hover:opacity-100 ml-2 text-muted-foreground hover:text-primary transition-opacity"><LinkIcon className="w-4 h-4" /></a>
            </h2>

            <p>
              Para este trimestre, el esfuerzo principal estará enfocado en el cliente 
              {/* Entity Link en línea */}
              <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 mx-1 rounded text-sm font-medium cursor-pointer hover:bg-blue-500/20 transition-colors" contentEditable={false}>
                <Building2 className="w-3 h-3" /> Acme Corp
              </span> 
              ya que su renovación depende de la entrega exitosa del módulo de automatizaciones.
            </p>

            {/* AI Generated Block */}
            <div className="my-6 p-4 rounded-xl border border-primary/20 bg-primary/5 flex gap-4 relative" contentEditable={false}>
              <div className="absolute left-0 top-0 w-1 h-full bg-primary rounded-l-xl"></div>
              <div className="mt-0.5">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary mb-1 flex items-center gap-2">
                  Resumen Ejecutivo Generado por IA
                  <button className="text-muted-foreground hover:text-primary transition-colors"><History className="w-3 h-3" /></button>
                </p>
                <p className="text-sm text-foreground/80">
                  El proyecto exige una integración total de la capa de datos. Las tareas bloqueantes actuales son el diseño del Omni-Switcher y la migración a Tailwind v4. Se recomienda reasignar 2 desarrolladores de Infraestructura al equipo de Frontend.
                </p>
                <div className="mt-3 flex gap-2">
                  <button className="text-xs font-medium bg-background border border-border px-3 py-1.5 rounded-md hover:border-primary/50 hover:text-primary transition-colors flex items-center gap-1.5">
                    <Check className="w-3 h-3" /> Insertar como texto
                  </button>
                  <button className="text-xs font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 transition-colors">
                    Re-generar
                  </button>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-3 text-foreground">
              Tareas Relacionadas
            </h3>

            {/* Task Embed (Base de datos embebida) */}
            <div className="border border-border rounded-xl bg-card overflow-hidden my-4 select-none" contentEditable={false}>
              <div className="bg-secondary/30 px-4 py-2 border-b border-border flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                  <Database className="w-3.5 h-3.5" /> Tabla Sincronizada
                </span>
                <span className="text-xs text-primary font-mono bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Live</span>
              </div>
              <div className="p-2 space-y-1">
                <EmbeddedTask id="NEX-140" title="Implementar Omni-Switcher" status="En Progreso" assignee="JM" />
                <EmbeddedTask id="NEX-141" title="Migración a Tailwind v4" status="Por Hacer" assignee="SR" />
              </div>
            </div>

            {/* Simulación del Slash Command Menu Activo */}
            <div className="text-muted-foreground relative">
              El equipo de marketing deberá /

              {/* SLASH COMMAND POPOVER */}
              <div className="absolute top-8 left-0 w-64 bg-card border border-border rounded-xl shadow-2xl z-50 flex flex-col p-1 animate-fade-in" contentEditable={false}>
                <div className="text-[10px] font-semibold text-muted-foreground uppercase px-2 py-1.5 tracking-wider">Bloques Básicos</div>
                <CommandMenuOption icon={FileText} label="Texto" description="Comienza a escribir" active />
                <CommandMenuOption icon={Zap} label="Preguntar a la IA" description="Generar o modificar texto" color="text-primary" />

                <div className="text-[10px] font-semibold text-muted-foreground uppercase px-2 py-1.5 tracking-wider mt-1 border-t border-border/50 pt-2">Vincular Entidades</div>
                <CommandMenuOption icon={Building2} label="Mencionar Cliente" description="@Acme Corp" />
                <CommandMenuOption icon={Database} label="Embeber Tarea" description="#NEX-142" />
              </div>
            </div>

          </article>
        </main>
      </div>

      {/* 3. SIDEBAR DE RELACIONES (Contexto del Documento) */}
      <aside className="hidden xl:block w-[300px] border-l border-border bg-card/30 p-6 overflow-y-auto no-scrollbar absolute right-0 top-14 h-[calc(100vh-3.5rem)]">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Información de Entidad</h4>
        
        <div className="space-y-6">
          <div>
            <span className="text-xs text-muted-foreground block mb-2">Viculado a (2)</span>
            <div className="space-y-2">
              <EntityPill icon={Building2} title="Acme Corp" subtitle="Cliente" />
              <EntityPill icon={Zap} title="Proyecto Nexus" subtitle="Iniciativa" />
            </div>
          </div>

          <div>
            <span className="text-xs text-muted-foreground block mb-2">Autores</span>
            <div className="flex items-center gap-2 bg-secondary/50 p-2 rounded-lg border border-border">
              <div className="w-8 h-8 rounded bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs">JM</div>
              <div className="text-sm">
                <p className="font-medium">Juan M.</p>
                <p className="text-xs text-muted-foreground">Última edición hoy a las 10:45 AM</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTES DEL EDITOR
// ==========================================

function LinkIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
}
function Building2(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
}

function EmbeddedTask({ id, title, status, assignee }: any) {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-secondary rounded-lg cursor-pointer transition-colors group">
      <div className="flex items-center gap-3">
        <Check className={`w-4 h-4 ${status === 'Completado' ? 'text-primary' : 'text-muted-foreground'}`} />
        <div>
          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{title}</p>
          <p className="text-xs font-mono text-muted-foreground">{id}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium px-2 py-0.5 bg-background border border-border rounded-md text-muted-foreground">
          {status}
        </span>
        <div className="w-6 h-6 rounded bg-secondary border border-border flex items-center justify-center text-[10px] font-bold">
          {assignee}
        </div>
      </div>
    </div>
  );
}

function CommandMenuOption({ icon: Icon, label, description, active, color = "text-muted-foreground" }: any) {
  return (
    <div className={`flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${active ? "bg-secondary" : "hover:bg-secondary/50"}`}>
      <div className={`p-1.5 rounded border border-border bg-background ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
    </div>
  );
}

function EntityPill({ icon: Icon, title, subtitle }: any) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg border border-border bg-secondary/30 hover:border-primary/40 cursor-pointer transition-colors group">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-background rounded-md text-muted-foreground group-hover:text-primary transition-colors">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}