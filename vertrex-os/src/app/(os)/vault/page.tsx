"use client";

import { useUIStore } from "@/lib/store/ui";
import { 
  Lock, Key, Globe, Plus, Search, ShieldCheck, 
  Copy, EyeOff, MoreHorizontal, Terminal, 
  LayoutGrid, Share2, ShieldAlert, 
  MonitorPlay, Hash, FolderKanban, Smartphone,
  CheckCircle2
} from "lucide-react";

export default function VaultHubPage() {
  const open = useUIStore((store) => store.open);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6 animate-fade-in">
      
      {/* 1. SIDEBAR INTERNO DEL VAULT (Navegación de Categorías) */}
      <aside className="w-64 shrink-0 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2 mb-1">
            Vault <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </h1>
          <p className="text-xs text-muted-foreground">Cifrado AES-256 E2E</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Buscar credencial..." className="w-full bg-secondary/50 border border-border rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary transition-all" />
        </div>

        <nav className="space-y-1 flex-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">Categorías</p>
          <VaultNavItem icon={LayoutGrid} label="Todo el Vault" count={124} active />
          <VaultNavItem icon={FolderKanban} label="Entornos & .env" count={12} />
          <VaultNavItem icon={Key} label="API Keys & Tokens" count={45} />
          <VaultNavItem icon={MonitorPlay} label="Cuentas Streaming" count={8} />
          <VaultNavItem icon={Hash} label="Redes Sociales" count={15} />
          <VaultNavItem icon={Globe} label="Herramientas SaaS" count={44} />
        </nav>

        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg shadow-[0_0_15px_rgba(0,255,135,0.2)] hover:shadow-[0_0_25px_rgba(0,255,135,0.4)] transition-all" onClick={() => open("connectCredential")}>
          <Plus className="w-4 h-4" />
          Nueva Entrada
        </button>
      </aside>

      {/* 2. ÁREA PRINCIPAL (Contenido dinámico) */}
      <main className="flex-1 overflow-y-auto no-scrollbar space-y-8 pb-20 pr-2">
        
        {/* IA ALERT - Contextual */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Rotación Recomendada (IA)</p>
              <p className="text-xs text-muted-foreground">La contraseña de <strong>Netflix (Oficina)</strong> no ha sido cambiada en 8 meses y ha sido vista por 14 empleados.</p>
            </div>
          </div>
          <button className="text-xs font-semibold text-amber-500 hover:text-amber-400 border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 rounded-md transition-colors" onClick={() => open("connectCredential")}>
            Forzar Rotación
          </button>
        </div>

        {/* SECCIÓN A: ENTORNOS Y VARIABLES (.ENV) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Entornos de Proyecto (.env)
            </h2>
            <button className="text-xs text-primary hover:underline">Ver todos los proyectos</button>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <EnvProjectCard 
              project="Proyecto Nexus" 
              environment="Production" 
              isProd={true}
              keysCount={24}
              lastUpdated="Ayer por SR"
              onOpen={() => open("vaultEntry", "nexus-production-env")}
            />
            <EnvProjectCard 
              project="Proyecto Nexus" 
              environment="Staging" 
              isProd={false}
              keysCount={26}
              lastUpdated="Hace 2 horas por JM"
              onOpen={() => open("vaultEntry", "nexus-staging-env")}
            />
            <EnvProjectCard 
              project="Landing Client X" 
              environment="Production" 
              isProd={true}
              keysCount={8}
              lastUpdated="Hace 1 semana por IA"
              onOpen={() => open("vaultEntry", "landing-client-production-env")}
            />
          </div>
        </section>

        {/* SECCIÓN B: CUENTAS DE EQUIPO (Redes, Streaming, SaaS) */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-4">
            <MonitorPlay className="w-4 h-4" /> Cuentas Compartidas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AccountCard 
              platform="Netflix" 
              category="Streaming" 
              username="team@vertrex.com" 
              has2FA={false}
              iconBg="bg-red-500/10"
              iconColor="text-red-500"
              onOpen={() => open("vaultEntry", "netflix-office")}
            />
            <AccountCard 
              platform="X (Twitter) Corporativo" 
              category="Redes Sociales" 
              username="@VertrexOS" 
              has2FA={true}
              totp="845 102"
              iconBg="bg-blue-500/10"
              iconColor="text-blue-400"
              onOpen={() => open("vaultEntry", "twitter-totp")}
            />
            <AccountCard 
              platform="Figma Enterprise" 
              category="SaaS Design" 
              username="design@vertrex.com" 
              has2FA={true}
              totp="129 482"
              iconBg="bg-purple-500/10"
              iconColor="text-purple-400"
              onOpen={() => open("vaultEntry", "figma-account")}
            />
          </div>
        </section>

      </main>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTES DEL VAULT
// ==========================================

function VaultNavItem({ icon: Icon, label, count, active }: any) {
  return (
    <button className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${
      active ? "bg-primary/10 text-primary" : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
    }`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
        active ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
      }`}>
        {count}
      </span>
    </button>
  );
}

function EnvProjectCard({ project, environment, isProd, keysCount, lastUpdated, onOpen }: any) {
  return (
    <div className="bg-card border border-border hover:border-primary/40 rounded-xl overflow-hidden transition-all group flex flex-col cursor-pointer" onClick={onOpen}>
      {/* Header del Proyecto */}
      <div className="bg-secondary/30 px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-background border border-border rounded-md">
            <FolderKanban className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{project}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${isProd ? "bg-emerald-500" : "bg-amber-400"}`}></span>
              <span className="text-[10px] font-mono uppercase text-muted-foreground">{environment}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md" title="Sincronizar a Vercel" onClick={(event) => event.stopPropagation()}><Share2 className="w-4 h-4" /></button>
          <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md" onClick={(event) => event.stopPropagation()}><MoreHorizontal className="w-4 h-4" /></button>
        </div>
      </div>
      
      {/* Cuerpo del .ENV (Terminal Look) */}
      <div className="p-4 bg-[#0a0a0a] flex-1 font-mono text-xs flex flex-col justify-center relative group/terminal cursor-pointer">
        {/* Capa Overlay de Copiar */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] opacity-0 group-hover/terminal:opacity-100 transition-opacity flex items-center justify-center z-10">
          <button className="bg-primary text-primary-foreground font-sans text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transform translate-y-2 group-hover/terminal:translate-y-0 transition-all" onClick={(event) => event.stopPropagation()}>
            <Copy className="w-4 h-4" /> Copiar .env
          </button>
        </div>

        {/* Simulación de código */}
        <div className="text-muted-foreground/60 space-y-1">
          <p><span className="text-blue-400">DATABASE_URL</span>="postgresql://***"</p>
          <p><span className="text-blue-400">NEXT_PUBLIC_API_KEY</span>="vrx_live_***"</p>
          <p><span className="text-blue-400">STRIPE_SECRET</span>="sk_live_***"</p>
          <p className="text-muted-foreground/40 italic">... {keysCount - 3} variables más</p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border bg-background flex items-center justify-between text-[10px] text-muted-foreground">
        <span>{keysCount} Variables</span>
        <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary" /> {lastUpdated}</span>
      </div>
    </div>
  );
}

function AccountCard({ platform, category, username, has2FA, totp, iconBg, iconColor, onOpen }: any) {
  return (
    <div className="bg-card border border-border hover:border-primary/30 rounded-xl p-4 transition-all group relative cursor-pointer" onClick={onOpen}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg} ${iconColor}`}>
            <span className="font-bold text-lg">{platform.charAt(0)}</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{platform}</h3>
            <span className="text-[10px] font-medium text-muted-foreground uppercase">{category}</span>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground" onClick={(event) => event.stopPropagation()}><MoreHorizontal className="w-4 h-4" /></button>
      </div>

      <div className="space-y-3">
        {/* Username Field */}
        <div className="bg-secondary/40 border border-border rounded-lg p-2 flex items-center justify-between group/field">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground">Usuario / Email</span>
            <span className="text-sm font-medium text-foreground">{username}</span>
          </div>
          <button className="p-1.5 text-muted-foreground hover:text-primary opacity-0 group-hover/field:opacity-100 transition-all" onClick={(event) => event.stopPropagation()}><Copy className="w-3.5 h-3.5" /></button>
        </div>

        {/* Password Field */}
        <div className="bg-secondary/40 border border-border rounded-lg p-2 flex items-center justify-between group/field">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground">Contraseña</span>
            <span className="text-lg tracking-[0.2em] font-mono text-foreground mt-0.5 leading-none">••••••••</span>
          </div>
          <div className="flex gap-1 opacity-0 group-hover/field:opacity-100 transition-all">
            <button className="p-1.5 text-muted-foreground hover:text-foreground" onClick={(event) => event.stopPropagation()}><EyeOff className="w-3.5 h-3.5" /></button>
            <button className="p-1.5 text-muted-foreground hover:text-primary" onClick={(event) => event.stopPropagation()}><Copy className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        {/* 2FA / TOTP Integrado */}
        {has2FA && (
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
              <Smartphone className="w-3 h-3" /> 2FA Activo
            </div>
            {totp ? (
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-foreground tracking-widest">{totp}</span>
                <button className="text-primary hover:text-primary-foreground hover:bg-primary p-1 rounded transition-colors" onClick={(event) => event.stopPropagation()}><Copy className="w-3 h-3" /></button>
              </div>
            ) : (
              <span className="text-[10px] text-muted-foreground">Requiere App</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}