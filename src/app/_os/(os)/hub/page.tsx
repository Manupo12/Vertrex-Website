import React from "react";
import { 
  Link2, Search, Plus, Sparkles, Globe, 
  LayoutGrid, List, MoreVertical, ExternalLink, 
  Tag, Folder, Star, Zap, Cpu, ArrowUpRight,
  Bookmark, CheckCircle2
} from "lucide-react";
import HubWorkspaceScreen from "@/components/os/hub-workspace-screen";

const useWorkspaceSnapshot = process.env.NEXT_PUBLIC_USE_WORKSPACE_SNAPSHOT !== "false";

export default function KnowledgeHubPage() {
  if (useWorkspaceSnapshot) {
    return <HubWorkspaceScreen />;
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6 animate-fade-in pb-4">
      
      {/* 1. SIDEBAR: CATEGORÍAS Y ETIQUETAS */}
      <aside className="w-[260px] shrink-0 flex flex-col gap-6 overflow-y-auto no-scrollbar">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2 mb-1">
            Knowledge Hub
          </h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-primary" /> IA Auto-Scraping Activo
          </p>
        </div>

        <nav className="space-y-6">
          {/* Navegación Principal */}
          <div className="space-y-1">
            <HubNavItem icon={LayoutGrid} label="Todos los Links" count={142} active />
            <HubNavItem icon={Star} label="Favoritos" count={12} color="text-amber-400" />
            <HubNavItem icon={Bookmark} label="Leer más tarde" count={5} />
          </div>

          {/* Categorías Generadas por IA */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Categorías (IA)</span>
              <Plus className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-foreground" />
            </div>
            <HubNavItem icon={Folder} label="Desarrollo & APIs" count={45} />
            <HubNavItem icon={Folder} label="Diseño UI/UX" count={28} />
            <HubNavItem icon={Folder} label="Modelos de IA" count={14} />
            <HubNavItem icon={Folder} label="Marketing B2B" count={34} />
          </div>

          {/* Tags Populares */}
          <div className="space-y-2 px-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Tags Inteligentes</span>
            <div className="flex flex-wrap gap-1.5">
              <SmartTag label="React" />
              <SmartTag label="Inspiración" />
              <SmartTag label="SaaS" />
              <SmartTag label="Docs" />
              <SmartTag label="Competencia" />
            </div>
          </div>
        </nav>
      </aside>

      {/* 2. ÁREA PRINCIPAL: SMART INPUT & GRID DE LINKS */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Magic Input (Auto-Scraping Trigger) */}
        <div className="bg-card border border-primary/30 shadow-[0_0_20px_rgba(0,255,135,0.05)] rounded-2xl p-2 mb-6 shrink-0 relative overflow-hidden group focus-within:border-primary/60 transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
          <div className="flex items-center">
            <div className="pl-4 pr-3">
              <Link2 className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Pega cualquier URL aquí. La IA extraerá el título, descripción y lo categorizará por ti..." 
              className="flex-1 bg-transparent border-none outline-none text-sm text-foreground py-3 placeholder:text-muted-foreground/60"
            />
            <button className="bg-primary text-primary-foreground text-xs font-semibold px-5 py-2.5 rounded-xl hover:shadow-[0_0_15px_rgba(0,255,135,0.4)] transition-all flex items-center gap-2 mr-1">
              <Zap className="w-3.5 h-3.5" /> Guardar Link
            </button>
          </div>
        </div>

        {/* Toolbar de Vista */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input type="text" placeholder="Buscar en Hub..." className="w-full bg-card border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary transition-all" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-card border border-border rounded-lg p-1">
              <button className="p-1.5 bg-secondary text-foreground rounded-md shadow-sm"><LayoutGrid className="w-3.5 h-3.5" /></button>
              <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><List className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>

        {/* Grid de Links (Scrollable) */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            
            {/* Link 1: Herramienta de Dev */}
            <HubCard 
              url="https://stripe.com/docs/api"
              domain="stripe.com"
              title="Stripe API Reference"
              description="Complete documentation for the Stripe API. Includes code snippets and webhooks setup."
              imageUrl="bg-gradient-to-br from-indigo-500 to-purple-600"
              iconText="S"
              category="Desarrollo & APIs"
              aiInsight="Fundamental para la pasarela de pagos. Relacionado con tareas del Backend."
              entityLink="NEX-143"
              tags={["Docs", "Payments"]}
              isNew
            />

            {/* Link 2: Inspiración UI */}
            <HubCard 
              url="https://linear.app/features"
              domain="linear.app"
              title="Linear — Issue Tracking for Teams"
              description="Meet the new standard for modern software development. Streamline issues, sprints, and product roadmaps."
              imageUrl="bg-gradient-to-br from-gray-800 to-black"
              iconText="L"
              category="Diseño UI/UX"
              aiInsight="Excelente referencia visual para el diseño del Kanban en Vertrex OS."
              entityLink="Proyecto Nexus"
              tags={["Inspiración", "SaaS"]}
            />

            {/* Link 3: Modelo IA (Autocategorizado) */}
            <HubCard 
              url="https://huggingface.co/models"
              domain="huggingface.co"
              title="Models - Hugging Face"
              description="Discover and train the best open-source machine learning models."
              imageUrl="bg-gradient-to-br from-yellow-400 to-orange-500"
              iconText="🤗"
              category="Modelos de IA"
              aiInsight="Posible proveedor de modelos LLM locales para reemplazar a OpenAI."
              entityLink="IA Automations"
              tags={["LLM", "OpenSource"]}
              isAutoScraped
            />

            {/* Link 4: Artículo / Blog */}
            <HubCard 
              url="https://vercel.com/blog/nextjs-15"
              domain="vercel.com"
              title="Next.js 15 Release: App Router Updates"
              description="Learn about the new features in Next.js 15 including React Compiler support and turbopack."
              imageUrl="bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80')] bg-cover bg-center"
              iconText="▲"
              category="Desarrollo & APIs"
              aiInsight="Actualización crítica. Sugerido leer antes de iniciar el refactor de Fase 2."
              tags={["React", "Update"]}
            />

          </div>
        </div>

      </main>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTES DEL HUB
// ==========================================

function HubNavItem({ icon: Icon, label, count, active, color }: any) {
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

function SmartTag({ label }: { label: string }) {
  return (
    <span className="text-[10px] font-semibold text-muted-foreground bg-card border border-border px-2 py-1 rounded-md cursor-pointer hover:border-primary/50 hover:text-primary transition-colors flex items-center gap-1">
      <Tag className="w-2.5 h-2.5" /> {label}
    </span>
  );
}

function HubCard({ url, domain, title, description, imageUrl, iconText, category, aiInsight, entityLink, tags, isNew, isAutoScraped }: any) {
  return (
    <div className="bg-card border border-border hover:border-primary/40 rounded-2xl overflow-hidden group transition-all flex flex-col h-[340px] relative shadow-sm hover:shadow-md">
      
      {/* Indicadores Top */}
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        {isNew && (
          <span className="bg-primary text-primary-foreground text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm">
            Nuevo
          </span>
        )}
        {isAutoScraped && (
          <span className="bg-background/90 backdrop-blur text-primary border border-primary/20 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
            <CheckCircle2 className="w-2.5 h-2.5" /> Auto-Scraped
          </span>
        )}
      </div>

      {/* Visual Preview (WhatsApp style cover) */}
      <div className={`h-32 w-full ${imageUrl.startsWith('bg-') ? imageUrl : 'bg-secondary'} relative flex items-center justify-center overflow-hidden shrink-0`}>
        {/* Fallback pattern si no hay imagen de fondo */}
        {imageUrl.startsWith('bg-gradient') && (
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
        )}
        <div className="w-12 h-12 rounded-xl bg-background/90 backdrop-blur-md shadow-lg border border-border/50 flex items-center justify-center text-xl font-bold text-foreground z-10">
          {iconText}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 flex flex-col flex-1 min-h-0">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono mb-1.5">
          <Globe className="w-3 h-3" /> {domain}
        </div>
        
        <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-1 mb-1.5 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
          {description}
        </p>

        {/* AI Insight Block (El core de esta feature) */}
        {aiInsight && (
          <div className="mt-auto bg-primary/5 border border-primary/10 rounded-lg p-2.5 flex gap-2">
            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] text-primary/90 leading-snug">
              <span className="font-bold block mb-0.5">IA COO:</span>
              {aiInsight}
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2.5 bg-secondary/30 border-t border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 overflow-hidden">
          {tags?.slice(0, 2).map((tag: string) => (
            <span key={tag} className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground bg-background border border-border px-1.5 py-0.5 rounded truncate">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          {entityLink && (
            <div className="flex items-center gap-1 bg-background px-1.5 py-0.5 rounded text-[9px] uppercase font-bold text-foreground border border-border transition-colors hover:border-primary">
              <ArrowUpRight className="w-2.5 h-2.5 text-muted-foreground" /> {entityLink}
            </div>
          )}
          <a href={url} target="_blank" rel="noreferrer" className="p-1 text-muted-foreground hover:text-primary transition-colors bg-background border border-border rounded cursor-pointer">
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

    </div>
  );
}