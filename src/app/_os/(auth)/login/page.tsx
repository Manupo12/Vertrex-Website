import React from "react";
import { redirect } from "next/navigation";
import LoginScreen from "@/components/auth/login-screen";
import { getCurrentSession, getLoginRedirectPath } from "@/lib/auth/session";
import { getOperationalStatsSnapshot } from "@/lib/dashboard/operational-stats";
import { 
  Command, Fingerprint, ArrowRight, ShieldCheck, 
  FolderKanban, Users, Rocket, 
  TrendingUp, Heart
} from "lucide-react";

export default async function InternalLoginPage() {
  const session = await getCurrentSession();

  if (session) {
    redirect(getLoginRedirectPath(session.user));
  }

  const statsSnapshot = await getOperationalStatsSnapshot();

  return <LoginScreen statsSnapshot={statsSnapshot} />;
}

export function LegacyInternalLoginPage() {
  return (
    <div className="flex min-h-screen bg-[#020202] overflow-hidden selection:bg-primary/30">
      
      {/* 1. PANEL IZQUIERDO: Estatus de Impacto Vertrex */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative border-r border-border bg-[#050505]">
        
        {/* Sutil gradiente de profundidad */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_var(--color-primary)_0%,_transparent_25%)] opacity-10"></div>
        </div>

        {/* Top: Branding Corporativo */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <Command className="w-6 h-6 text-black" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tighter text-white block leading-none">VERTREX</span>
              <span className="text-[10px] font-medium text-muted-foreground tracking-[0.2em] uppercase mt-1 block">Internal Hub</span>
            </div>
          </div>
          <div className="px-3 py-1 bg-secondary/50 border border-border rounded-md text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Acceso Nivel 1
          </div>
        </div>

        {/* Middle: El Corazón de la Empresa (4 Cards Estratégicas) */}
        <div className="relative z-10 w-full max-w-xl">
          <header className="mb-10">
            <h1 className="text-4xl font-semibold tracking-tight text-white mb-2">
              Bienvenido a Casa.
            </h1>
            <p className="text-muted-foreground text-sm">
              Tu acceso al ecosistema unificado de Vertrex.
            </p>
          </header>

          <div className="grid grid-cols-2 gap-4">
            
            {/* Card 1: Proyectos Activos (Internos/Clientes) */}
            <StatusCard 
              icon={FolderKanban} 
              label="Proyectos Activos" 
              value="24" 
              detail="Operaciones en curso"
              color="text-primary"
            />

            {/* Card 2: Usuarios Activos (SaaS/Apps/Webs) */}
            <StatusCard 
              icon={Users} 
              label="Usuarios Activos" 
              value="14.2k" 
              detail="En SaaS, Apps y Webs"
              color="text-blue-400"
              trend="+12%"
            />

            {/* Card 3: Proyectos activos para la comunidad */}
            <StatusCard 
              icon={Heart} 
              label="Para la Comunidad" 
              value="15" 
              detail="Proyectos activos (Open Source)"
              color="text-purple-400"
            />

            {/* Card 4: Proyectos planeados */}
            <StatusCard 
              icon={Rocket} 
              label="Proyectos Planeados" 
              value="06" 
              detail="Pipeline a futuro"
              color="text-amber-400"
            />

          </div>
        </div>

        {/* Bottom: Seguridad y Auditoría */}
        <div className="relative z-10 flex items-center gap-4 text-[10px] text-muted-foreground font-medium uppercase tracking-widest border-t border-border/50 pt-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            Sesión Auditada
          </div>
          <div className="w-1 h-1 rounded-full bg-border"></div>
          <span>Vertrex Tech © 2026</span>
        </div>
      </div>

      {/* 2. PANEL DERECHO: Identificación de Personal */}
      <div className="w-full lg:w-[55%] flex flex-col items-center justify-center p-8 sm:p-12 relative animate-fade-in">
        
        {/* Mobile Header */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
          <Command className="w-6 h-6 text-white" />
          <span className="text-xl font-bold tracking-tighter text-white">VERTREX</span>
        </div>

        <div className="w-full max-w-[360px] space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-white">Identificación</h2>
            <p className="text-sm text-muted-foreground">Ingresa tus credenciales para autorizar el acceso.</p>
          </div>

          <div className="space-y-4">
            {/* Input Usuario @vertrex.com */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">ID de Empleado</label>
              <div className="relative flex items-center bg-card border border-border rounded-xl overflow-hidden focus-within:border-primary transition-all">
                <input 
                  type="text" 
                  placeholder="nombre.apellido" 
                  className="w-full bg-transparent pl-4 py-3 text-sm text-white outline-none placeholder:text-muted-foreground/30"
                />
                <div className="pr-4 py-3 text-muted-foreground/40 text-xs font-bold font-mono">
                  @vertrex.com
                </div>
              </div>
            </div>

            {/* Input Contraseña */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Contraseña</label>
              <input 
                type="password" 
                placeholder="••••••••••••" 
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-primary transition-all tracking-widest"
              />
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-white text-black text-sm font-bold py-3 rounded-xl hover:bg-primary hover:text-white transition-all active:scale-[0.98] group mt-2">
              Autorizar Acceso <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="relative py-2 flex items-center">
              <div className="flex-grow border-t border-border/50"></div>
              <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">O usa</span>
              <div className="flex-grow border-t border-border/50"></div>
            </div>

            {/* Passkey / Hardware Key */}
            <button className="w-full flex items-center justify-center gap-3 bg-secondary/30 border border-border hover:bg-secondary/50 text-white text-sm font-semibold py-3 rounded-xl transition-all group">
              <Fingerprint className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              Identificación Biométrica
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTE: StatusCard
// ==========================================

function StatusCard({
  icon: Icon,
  label,
  value,
  detail,
  color,
  trend,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  detail: string;
  color: string;
  trend?: string;
}) {
  return (
    <div className="bg-card/40 border border-border p-5 rounded-2xl backdrop-blur-sm hover:border-white/20 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg bg-background border border-border ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            <TrendingUp className="w-3 h-3" /> {trend}
          </div>
        )}
      </div>
      <div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
        <div className="text-[10px] text-muted-foreground/60">{detail}</div>
      </div>
    </div>
  );
}