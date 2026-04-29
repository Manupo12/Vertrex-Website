import React from "react";
import { 
  Clock, Play, Pause, Zap, DollarSign, 
  TrendingDown, TrendingUp, AlertTriangle, 
  Activity, CheckCircle2, History, Briefcase,
  User, ShieldAlert, BarChart3
} from "lucide-react";
import TimeWorkspaceScreen from "@/components/os/time-workspace-screen";

const useWorkspaceSnapshot = process.env.NEXT_PUBLIC_USE_WORKSPACE_SNAPSHOT !== "false";

export default function IntelligentTimeTrackingPage() {
  if (useWorkspaceSnapshot) {
    return <TimeWorkspaceScreen />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in bg-[#0A0A0A]">
      
      {/* 1. HEADER & PERSONAL TIMER */}
      <div className="px-8 py-6 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0 bg-[#050505]">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Cronometría & Rentabilidad
            <span className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] uppercase font-bold text-gray-400">
              <Clock className="w-3 h-3" /> Hoy: 42h Registradas
            </span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Auditoría de tiempo cruzada con márgenes de contratos comerciales.
          </p>
        </div>
        
        {/* Tu propio tracker rápido */}
        <div className="flex items-center gap-3 bg-[#111] border border-[#00FA82]/30 rounded-xl p-2 pl-4 shadow-[0_0_15px_rgba(0,250,130,0.05)]">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#00FA82] uppercase tracking-widest">Tracking Activo</span>
            <span className="text-sm font-mono text-white font-black">01:24:05</span>
          </div>
          <div className="w-px h-6 bg-white/10 mx-2"></div>
          <button className="w-10 h-10 bg-amber-500 hover:bg-amber-400 text-black rounded-lg flex items-center justify-center transition-colors">
            <Pause className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">

        {/* 2. IA PROFITABILITY ALERT (Fuga de Dinero) */}
        <div className="bg-[#111] border border-destructive/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group">
          <div className="absolute top-0 left-0 w-1 h-full bg-destructive"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-destructive/10 rounded-full blur-3xl"></div>
          
          <div className="flex items-start gap-4 relative z-10">
            <div className="p-3 bg-destructive/10 rounded-xl border border-destructive/20 text-destructive shrink-0">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                Fuga de Rentabilidad Detectada (IA Auditor)
                <span className="text-[10px] uppercase bg-destructive/20 text-destructive px-1.5 py-0.5 rounded font-black tracking-widest">Crítico</span>
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-3xl">
                El proyecto <strong className="text-white">Wayne Enterprises</strong> tiene un presupuesto de $30k, pero el costo interno del equipo ya superó los <span className="text-destructive font-mono font-bold">$28,500</span> (850 horas trackeadas). El margen actual es solo del <span className="text-destructive font-mono font-bold">5%</span>. 
                Sugerimos detener nuevos desarrollos y negociar un Adendum al contrato (SOW extra).
              </p>
            </div>
          </div>
          <button className="shrink-0 text-xs font-bold text-black bg-white hover:bg-gray-200 px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 relative z-10">
            <Zap className="w-4 h-4" /> Generar Adendum (IA)
          </button>
        </div>

        {/* 3. LIVE SQUAD RADAR (Quién está haciendo qué AHORA MISMO) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Radar en Vivo (Equipo Activo)
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <LiveTrackerCard user="Juan M." avatar="JM" project="GlobalBank" task="Migración DB" time="02:15:30" />
            <LiveTrackerCard user="Carlos M." avatar="CM" project="Acme Corp" task="API Endpoints" time="00:45:12" />
            <LiveTrackerCard user="Sarah R." avatar="SR" project="Vertrex OS" task="UI Design" time="04:20:05" />
            
            {/* Empleado inactivo / offline */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 flex items-center gap-4 opacity-50 grayscale">
              <div className="w-10 h-10 rounded-xl bg-[#111] border border-white/10 flex items-center justify-center font-black text-gray-600">LR</div>
              <div>
                <p className="text-sm font-bold text-gray-500">Luis R.</p>
                <p className="text-[10px] text-gray-600 font-mono">Offline / Sin Tracking</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. MATRIZ DE RENTABILIDAD POR PROYECTO (El Core de Negocio) */}
        <div className="bg-[#111] border border-white/10 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#050505]">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#00FA82]" /> Salud Financiera de Proyectos
            </h2>
            <select className="bg-[#1A1A1A] border border-white/10 rounded-md text-xs px-3 py-1.5 text-gray-400 outline-none cursor-pointer hover:border-[#00FA82]/50 transition-colors font-mono">
              <option>Q2 2026</option>
              <option>Q1 2026</option>
            </select>
          </div>
          
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5">
                <tr>
                  <th className="px-6 py-4">Proyecto / Cliente</th>
                  <th className="px-6 py-4">Presupuesto (TCV)</th>
                  <th className="px-6 py-4">Horas Trackeadas</th>
                  <th className="px-6 py-4">Costo Interno</th>
                  <th className="px-6 py-4">Margen Actual</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                
                {/* Proyecto Saludable */}
                <ProfitabilityRow 
                  project="Budaphone Ecommerce" 
                  budget={15000} 
                  hours={145} 
                  internalCost={3625} 
                  margin={75.8} 
                  status="healthy" 
                />
                
                {/* Proyecto Enterprise / Massive */}
                <ProfitabilityRow 
                  project="GlobalBank OS" 
                  budget={180000} 
                  hours={1250} 
                  internalCost={45000} 
                  margin={75.0} 
                  status="healthy" 
                />

                {/* Proyecto en Riesgo */}
                <ProfitabilityRow 
                  project="Stark Ind. Dashboard" 
                  budget={8000} 
                  hours={280} 
                  internalCost={7000} 
                  margin={12.5} 
                  status="warning" 
                />

                {/* Proyecto Sangrando Dinero (Pérdida) */}
                <ProfitabilityRow 
                  project="Wayne Ent. Auditoría" 
                  budget={30000} 
                  hours={1200} 
                  internalCost={32000} 
                  margin={-6.6} 
                  status="danger" 
                />

              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTES DE TIME TRACKING
// ==========================================

function LiveTrackerCard({ user, avatar, project, task, time }: any) {
  return (
    <div className="bg-[#111] border border-[#00FA82]/20 rounded-2xl p-4 relative overflow-hidden group">
      <div className="absolute -right-2 -top-2 w-12 h-12 bg-[#00FA82]/10 rounded-full blur-xl"></div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center font-black text-white shadow-sm">
          {avatar}
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-tight">{user}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FA82] animate-pulse"></span>
            <p className="text-[10px] font-mono text-[#00FA82]">Trackeando</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 rounded-lg p-3">
        <p className="text-[10px] uppercase font-bold text-gray-500 truncate mb-1">
          <Briefcase className="w-3 h-3 inline mr-1" /> {project}
        </p>
        <p className="text-xs text-gray-300 truncate mb-3">{task}</p>
        <div className="flex justify-between items-end border-t border-white/5 pt-2">
          <span className="text-lg font-black font-mono text-white tracking-wider">{time}</span>
        </div>
      </div>
    </div>
  );
}

function ProfitabilityRow({ project, budget, hours, internalCost, margin, status }: any) {
  const getStatusConfig = () => {
    switch(status) {
      case 'healthy': return { color: 'text-[#00FA82]', bg: 'bg-[#00FA82]/10 border-[#00FA82]/20', label: 'Óptimo' };
      case 'warning': return { color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20', label: 'Riesgo' };
      case 'danger': return { color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/20', label: 'Pérdida' };
      default: return { color: 'text-gray-500', bg: 'bg-white/5 border-white/10', label: 'N/A' };
    }
  };

  const cfg = getStatusConfig();
  const isNegative = margin < 0;

  return (
    <tr className="hover:bg-white/5 transition-colors cursor-pointer group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#0A0A0A] rounded-lg border border-white/10 group-hover:border-[#00FA82]/50 transition-colors">
            <Briefcase className="w-4 h-4 text-gray-400" />
          </div>
          <span className="text-sm font-bold text-white group-hover:text-[#00FA82] transition-colors">{project}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-mono font-bold text-white">${budget.toLocaleString()}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-mono text-gray-300">{hours} <span className="text-[10px] text-gray-500">hrs</span></span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-mono font-medium text-amber-500/80">${internalCost.toLocaleString()}</span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-mono font-black ${isNegative ? 'text-destructive' : 'text-[#00FA82]'}`}>
            {margin}%
          </span>
          <div className="w-16 h-1.5 bg-[#0A0A0A] rounded-full overflow-hidden border border-white/5 hidden sm:block">
            <div className={`h-full ${isNegative ? 'bg-destructive' : 'bg-[#00FA82]'}`} style={{ width: `${Math.max(0, Math.min(100, margin))}%` }}></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border ${cfg.bg} ${cfg.color}`}>
          {cfg.label}
        </span>
      </td>
    </tr>
  );
}