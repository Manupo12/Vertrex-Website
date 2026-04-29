"use client";

import { useUIStore } from "@/lib/store/ui";
import { 
  FileText, Search, Plus, Filter, Folder, 
  Sparkles, Clock, MoreVertical, Building2, 
  UploadCloud, Star, LayoutGrid, List,
  FolderOpen, FileCode2, Users
} from "lucide-react";
import DocumentsWorkspaceScreen from "@/components/os/documents-workspace-screen";

const useWorkspaceSnapshot = process.env.NEXT_PUBLIC_USE_WORKSPACE_SNAPSHOT !== "false";

export default function DocumentsIndexPage() {
  const open = useUIStore((store) => store.open);

  if (useWorkspaceSnapshot) {
    return <DocumentsWorkspaceScreen />;
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6 animate-fade-in pb-4">
      
      {/* 1. SIDEBAR: CARPETAS INTELIGENTES Y NAVEGACIÓN */}
      <aside className="w-[260px] shrink-0 flex flex-col gap-6 overflow-y-auto no-scrollbar">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2 mb-1">
            Documentos
          </h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            Base de conocimiento viva
          </p>
        </div>

        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg shadow-[0_0_15px_rgba(0,255,135,0.2)] hover:shadow-[0_0_25px_rgba(0,255,135,0.4)] transition-all" onClick={() => open("templateSelector")}>
          <Plus className="w-4 h-4" />
          Nuevo Documento
        </button>

        <nav className="space-y-6 flex-1">
          {/* Navegación Base */}
          <div className="space-y-1">
            <NavItem icon={FileText} label="Todos los documentos" active count={128} />
            <NavItem icon={Clock} label="Recientes" />
            <NavItem icon={Star} label="Favoritos" count={4} color="text-amber-400" />
          </div>

          {/* Carpetas Inteligentes (Generadas y organizadas por IA) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-primary" /> Carpetas Inteligentes
              </span>
            </div>
            <FolderItem icon={FolderOpen} label="PRDs & Specs" count={12} />
            <FolderItem icon={Users} label="Minutas de Clientes" count={45} />
            <FolderItem icon={FileCode2} label="Documentación API" count={8} />
            <FolderItem icon={Folder} label="Borradores" count={3} />
          </div>
        </nav>
      </aside>

      {/* 2. ÁREA PRINCIPAL: BÚSQUEDA Y LISTADO */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-card border border-border rounded-2xl shadow-sm">
        
        {/* Topbar: Buscador, Filtros e Importación */}
        <header className="p-4 border-b border-border flex items-center justify-between gap-4 bg-background/50 backdrop-blur-md shrink-0">
          
          {/* Barra de Búsqueda */}
          <div className="relative flex-1 max-w-xl group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Buscar documentos, palabras clave o preguntar a la IA..." 
              className="w-full bg-secondary/50 border border-border rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground bg-secondary/50 border border-border rounded-lg hover:text-foreground hover:bg-secondary transition-colors">
              <Filter className="w-3.5 h-3.5" /> Filtros
            </button>
            <div className="w-px h-4 bg-border mx-1"></div>
            <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground border border-border rounded-lg hover:text-foreground hover:bg-secondary transition-colors" title="Importar desde Notion/Word" onClick={() => open("importDocument")}>
              <UploadCloud className="w-3.5 h-3.5" /> Importar
            </button>
            <div className="flex bg-secondary border border-border rounded-lg p-1 ml-1">
              <button className="p-1.5 bg-background text-foreground rounded-md shadow-sm"><LayoutGrid className="w-3.5 h-3.5" /></button>
              <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><List className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </header>

        {/* LISTADO DE DOCUMENTOS (Grid View) */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
          
          <h2 className="text-sm font-semibold text-foreground mb-4">Editados Recientemente</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <DocumentCard 
              title="PRD - Vertrex OS v6.0"
              excerpt="Este documento define la arquitectura y requisitos para el desarrollo del nuevo panel de control..."
              date="Hace 10 min"
              icon="🚀"
              authors={["JM", "SR"]}
              entityLink="Proyecto Nexus"
              entityType="project"
            />
            <DocumentCard 
              title="Minuta: Kickoff GlobalBank"
              excerpt="Acuerdos principales de la reunión de hoy. El cliente solicita que el módulo de seguridad sea prioridad..."
              date="Ayer, 16:30"
              icon="🏦"
              authors={["JM"]}
              entityLink="GlobalBank"
              entityType="client"
            />
            <DocumentCard 
              title="Guía de Estilos de Marca"
              excerpt="Códigos de color, tipografías y reglas de uso para el logotipo en fondos oscuros y claros."
              date="Hace 3 días"
              icon="🎨"
              authors={["CL"]}
            />
          </div>

          <h2 className="text-sm font-semibold text-foreground mb-4">Todos los Documentos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DocumentCard title="Onboarding Nuevos Empleados" excerpt="Pasos a seguir para configurar el entorno local..." date="Hace 1 semana" icon="👋" authors={["SR"]} />
            <DocumentCard title="Arquitectura de Base de Datos" excerpt="Esquemas y relaciones en Neon Serverless..." date="Hace 2 semanas" icon="🗄️" authors={["JM"]} entityLink="Proyecto Nexus" entityType="project" />
            <DocumentCard title="Propuesta Comercial Q3" excerpt="Borrador de precios para clientes enterprise..." date="Hace 1 mes" icon="📄" authors={["JM"]} />
            <DocumentCard title="Políticas de Vacaciones" excerpt="Actualización 2026 de días libres y compensaciones..." date="Hace 2 meses" icon="🌴" authors={["HR"]} />
          </div>

        </div>
      </main>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTES DEL INDEX
// ==========================================

function NavItem({ icon: Icon, label, active, count, color }: any) {
  return (
    <button className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${
      active 
        ? "bg-secondary text-foreground font-medium" 
        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
    }`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${color || (active ? "text-foreground" : "opacity-70 group-hover:opacity-100")}`} />
        <span className="text-sm">{label}</span>
      </div>
      {count && (
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${active ? "bg-background text-foreground border border-border" : "bg-secondary text-muted-foreground"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function FolderItem({ icon: Icon, label, count }: any) {
  return (
    <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors hover:bg-secondary/50 text-muted-foreground hover:text-foreground group">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:text-primary transition-colors" />
        <span className="text-sm">{label}</span>
      </div>
      {count && <span className="text-[10px] font-mono opacity-50">{count}</span>}
    </button>
  );
}

function DocumentCard({ title, excerpt, date, icon, authors, entityLink, entityType }: any) {
  return (
    <div className="bg-background border border-border hover:border-primary/40 rounded-xl p-4 flex flex-col group cursor-pointer transition-all shadow-sm hover:shadow-md">
      
      {/* Cabecera de la Tarjeta */}
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-secondary/50 border border-border flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
          {icon}
        </div>
        <button className="p-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Contenido */}
      <h3 className="text-sm font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors line-clamp-1">
        {title}
      </h3>
      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4 flex-1">
        {excerpt}
      </p>

      {/* Footer: Metadatos y Entidades Vinculadas */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
        <div className="flex items-center gap-3">
          {/* Autores */}
          <div className="flex -space-x-1">
            {authors.map((author: string, idx: number) => (
              <div key={idx} className="w-5 h-5 rounded-full bg-secondary border border-background flex items-center justify-center text-[8px] font-bold text-foreground z-10 relative">
                {author}
              </div>
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
            <Clock className="w-3 h-3" /> {date}
          </span>
        </div>

        {/* Entity Link (El poder del OS) */}
        {entityLink && (
          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold border transition-colors ${
            entityType === 'client' 
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
              : 'bg-primary/10 text-primary border-primary/20'
          }`}>
            {entityType === 'client' ? <Building2 className="w-2.5 h-2.5" /> : <Folder className="w-2.5 h-2.5" />}
            <span className="truncate max-w-[80px]">{entityLink}</span>
          </div>
        )}
      </div>
    </div>
  );
}