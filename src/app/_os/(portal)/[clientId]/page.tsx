import React from "react";
import { redirect } from "next/navigation";
import { coercePortalView, getPortalPath } from "@/lib/portal/routing";
import { 
  LayoutDashboard, CheckCircle2, FileText, CreditCard, 
  UploadCloud, Key, LifeBuoy, Bot, 
  ArrowRight, Clock, Zap, CircleDashed,
  Building2, ArrowUpRight, Check
} from "lucide-react";

type ClientPortalPageProps = {
  params: Promise<{ clientId: string }>;
  searchParams?: Promise<{ view?: string | string[] }>;
};

export default async function ClientPortalPage({ params, searchParams }: ClientPortalPageProps) {
  const { clientId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const rawView = resolvedSearchParams?.view;
  const view = Array.isArray(rawView) ? rawView[0] : rawView;
  redirect(getPortalPath(clientId, coercePortalView(view)));
}

export function LegacyClientPortalPage() {
  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white overflow-hidden selection:bg-[#00FA82]/30 font-sans">
      
      {/* =========================================================
          1. SIDEBAR DEL CLIENTE (Navegación)
          ========================================================= */}
      <aside className="w-[280px] shrink-0 border-r border-white/10 bg-[#050505] flex flex-col relative z-20">
        
        {/* Branding Cliente x Vertrex */}
        <div className="p-6 border-b border-white/10">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Portal de Cliente</div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shrink-0">
              <Building2 className="w-full h-full text-black" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight leading-none">BUDAPHONE</h2>
              <p className="text-xs text-[#00FA82] mt-1 font-mono">Proyecto Activo</p>
            </div>
          </div>
        </div>

        {/* Menú */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
          <NavItem icon={LayoutDashboard} label="Dashboard General" active />
          <NavItem icon={CheckCircle2} label="Progreso & Tareas" />
          <NavItem icon={FileText} label="Documentos Legales" />
          <NavItem icon={CreditCard} label="Pagos & Facturación" alert="Pago Pendiente" />
          <NavItem icon={Key} label="Credenciales & Accesos" />
          <NavItem icon={UploadCloud} label="Archivos Compartidos" />
          <div className="pt-4 mt-4 border-t border-white/10">
            <NavItem icon={LifeBuoy} label="Soporte Técnico" />
          </div>
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-white/10 bg-[#111]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
              <Zap className="w-3.5 h-3.5 text-[#00FA82]" /> Powered by Vertrex
            </div>
          </div>
        </div>
      </aside>

      {/* =========================================================
          2. MAIN DASHBOARD (Visión General)
          ========================================================= */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        
        {/* Gradiente de fondo sutil */}
        <div className="absolute top-0 left-0 w-full h-[300px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00FA82]/5 via-[#0A0A0A] to-[#0A0A0A] -z-10"></div>

        <div className="p-8 md:p-12 max-w-[1200px] mx-auto space-y-8 pb-32">
          
          {/* Header & Fase Actual */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight mb-2">Bienvenido de nuevo.</h1>
              <p className="text-gray-400 text-sm">Resumen en tiempo real del desarrollo de tu plataforma web.</p>
            </div>
            <div className="flex items-center gap-3 bg-[#111] border border-white/10 rounded-xl p-2 pr-4">
              <div className="p-2 bg-[#00FA82]/10 text-[#00FA82] rounded-lg">
                <CircleDashed className="w-5 h-5 animate-[spin_4s_linear_infinite]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Fase Actual</p>
                <p className="text-sm font-bold text-white">2. Desarrollo Core</p>
              </div>
            </div>
          </header>

          {/* Grid de Widgets (Progreso, Finanzas, Siguientes Pasos) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Widget 1: Progreso */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FA82]/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="p-2.5 bg-black rounded-xl border border-white/10">
                  <Activity className="w-5 h-5 text-[#00FA82]" />
                </div>
                <span className="text-3xl font-black font-mono">65%</span>
              </div>
              <div className="relative z-10">
                <h3 className="text-sm font-bold text-white mb-1">Progreso del Proyecto</h3>
                <p className="text-xs text-gray-400 mb-4">24 de 38 tareas completadas</p>
                <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/10">
                  <div className="h-full bg-[#00FA82] shadow-[0_0_10px_rgba(0,250,130,0.5)]" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>

            {/* Widget 2: Finanzas (Pagos) */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-2.5 bg-black rounded-xl border border-white/10">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Total Inversión</span>
                  <span className="text-xl font-black font-mono">$15,000</span>
                </div>
              </div>
              <div className="space-y-3 relative z-10 pt-2 border-t border-white/10">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#00FA82]" /> Anticipo Pagado</span>
                  <span className="font-mono font-bold">$7,500</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-500" /> Saldo Pendiente</span>
                  <span className="font-mono font-bold text-amber-500">$7,500</span>
                </div>
              </div>
            </div>

            {/* Widget 3: Acciones Rápidas (El cliente necesita hacer cosas) */}
            <div className="bg-[#111] border border-[#00FA82]/30 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#00FA82] uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Requiere tu acción
                </h3>
                <p className="text-sm text-gray-400 mt-2">Necesitamos los accesos al dominio para configurar el servidor de producción.</p>
              </div>
              <button className="w-full mt-4 bg-[#00FA82] text-black text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#00FA82]/90 transition-colors">
                Subir Credenciales <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Tablas Inferiores: Documentos y Últimas Tareas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Próximos Pasos (Timeline) */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Próximos Entregables</h3>
              <div className="space-y-5 relative before:absolute before:inset-0 before:ml-[11px] before:h-full before:w-px before:bg-white/10">
                <TimelineItem status="done" title="Diseño UI/UX Aprobado" date="Hace 1 semana" />
                <TimelineItem status="active" title="Integración Pasarela de Pagos" date="En progreso (Semana actual)" />
                <TimelineItem status="pending" title="Migración de Inventario" date="Próxima semana" />
                <TimelineItem status="pending" title="Pase a Producción" date="15 de Mayo, 2026" />
              </div>
            </div>

            {/* Documentos Recientes */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Archivos & Legal</h3>
                <button className="text-[10px] text-[#00FA82] hover:underline font-bold uppercase">Ver todos</button>
              </div>
              <div className="space-y-3">
                <DocRow icon={FileText} name="Contrato_Servicios_Firmado.pdf" date="01/04/2026" type="Legal" />
                <DocRow icon={FileText} name="SOW_Alcance_Proyecto.pdf" date="01/04/2026" type="Legal" />
                <DocRow icon={UploadCloud} name="Logos_Alta_Resolucion.zip" date="Hace 3 días" type="Assets" highlight />
              </div>
              <button className="w-full mt-4 border border-dashed border-white/20 text-gray-400 text-xs font-bold py-3 rounded-xl hover:bg-white/5 hover:text-white transition-colors flex items-center justify-center gap-2">
                <UploadCloud className="w-4 h-4" /> Subir material nuevo
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* =========================================================
          3. IA CHATBOT FLOTANTE (Soporte 24/7 para el cliente)
          ========================================================= */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
        {/* Tooltip Popup */}
        <div className="bg-[#111] border border-white/10 shadow-2xl p-3 rounded-2xl rounded-br-none max-w-[250px] animate-fade-in-up">
          <p className="text-xs text-gray-300 leading-relaxed">
            ¡Hola! Soy el asistente IA de Vertrex. Puedo explicarte el avance técnico o recibir tus dudas.
          </p>
        </div>
        {/* Botón Flotante (Brutalista) */}
        <button className="w-14 h-14 bg-[#00FA82] text-black rounded-none border border-[#00FA82] shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center justify-center">
          <Bot className="w-7 h-7" />
        </button>
      </div>

    </div>
  );
}

// ==========================================
// SUB-COMPONENTES
// ==========================================

function NavItem({
  icon: Icon,
  label,
  active,
  alert,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  active?: boolean;
  alert?: string;
}) {
  return (
    <button className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${
      active ? 'bg-[#111] text-white border border-white/10' : 'text-gray-500 hover:text-white hover:bg-[#111]/50'
    }`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${active ? 'text-[#00FA82]' : 'group-hover:text-white'}`} />
        <span className="text-sm font-semibold">{label}</span>
      </div>
      {alert && (
        <span className="text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded">
          {alert}
        </span>
      )}
    </button>
  );
}

function Activity(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
}

function TimelineItem({ status, title, date }: { status: "done" | "active" | "pending"; title: string; date: string }) {
  const getStatusInfo = () => {
    switch(status) {
      case 'done': return { color: 'bg-[#00FA82]', dot: 'border-transparent', icon: <Check className="w-2.5 h-2.5 text-black" /> };
      case 'active': return { color: 'bg-[#0A0A0A]', dot: 'border-[#00FA82] border-2 shadow-[0_0_8px_rgba(0,250,130,0.5)]', icon: null };
      case 'pending': return { color: 'bg-[#0A0A0A]', dot: 'border-white/20 border-2', icon: null };
      default: return { color: 'bg-transparent', dot: '', icon: null };
    }
  };
  const config = getStatusInfo();

  return (
    <div className="relative flex items-start gap-4 z-10">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${config.color} ${config.dot} mt-0.5`}>
        {config.icon}
      </div>
      <div className="pb-2">
        <p className={`text-sm font-bold ${status === 'pending' ? 'text-gray-500' : 'text-white'}`}>{title}</p>
        <p className="text-xs text-gray-500 font-mono mt-1">{date}</p>
      </div>
    </div>
  );
}

function DocRow({
  icon: Icon,
  name,
  date,
  type,
  highlight,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  name: string;
  date: string;
  type: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-black/50 hover:bg-[#111] transition-colors cursor-pointer group">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className={`p-2 rounded-lg ${highlight ? 'bg-[#00FA82]/10 text-[#00FA82]' : 'bg-white/5 text-gray-400'}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate group-hover:text-[#00FA82] transition-colors">{name}</p>
          <p className="text-[10px] text-gray-500 font-mono mt-0.5">{date}</p>
        </div>
      </div>
      <span className="text-[9px] uppercase font-bold text-gray-500 bg-white/5 px-2 py-1 rounded hidden sm:block">
        {type}
      </span>
      <ArrowUpRight className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </div>
  );
}