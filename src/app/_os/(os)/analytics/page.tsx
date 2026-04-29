import React from "react";
import { 
  BarChart4, BrainCircuit, TrendingUp, Target, 
  Activity, Users, DollarSign, Clock, Download,
  Filter, Zap, ArrowUpRight, ArrowDownRight,
  Crosshair, Layers, LineChart, PieChart,
  AlertTriangle
} from "lucide-react";
import AnalyticsWorkspaceScreen from "@/components/os/analytics-workspace-screen";

const useWorkspaceSnapshot = process.env.NEXT_PUBLIC_USE_WORKSPACE_SNAPSHOT !== "false";

export default function AnalyticsBIPage() {
  if (useWorkspaceSnapshot) {
    return <AnalyticsWorkspaceScreen />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in bg-[#0A0A0A]">
      
      {/* 1. HEADER (GOD-MODE) */}
      <div className="px-8 py-6 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0 bg-[#050505] relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[100px] bg-[#00FA82]/5 blur-[100px] pointer-events-none"></div>

        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3 relative z-10">
            Inteligencia de Negocio
            <span className="flex items-center gap-1.5 px-2 py-1 bg-[#111] border border-[#00FA82]/30 rounded text-[10px] uppercase font-bold text-[#00FA82] shadow-[0_0_10px_rgba(0,250,130,0.1)]">
              <BrainCircuit className="w-3 h-3" /> CEO God-Mode
            </span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm flex items-center gap-2 font-mono">
            <Activity className="w-4 h-4 text-[#00FA82]" /> Analizando 1.2M+ data points en tiempo real.
          </p>
        </div>
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-[#111] border border-white/10 rounded-lg p-1 flex">
            <button className="px-3 py-1.5 text-xs font-bold text-black bg-white rounded-md shadow-sm">Trimestre</button>
            <button className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-white transition-colors">Año Fiscal</button>
          </div>
          <button className="px-4 py-2.5 text-xs font-bold text-[#00FA82] bg-[#00FA82]/10 border border-[#00FA82]/30 hover:bg-[#00FA82] hover:text-black rounded-lg transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> Exportar Board
          </button>
        </div>
      </div>

      {/* 2. ÁREA SCROLLEABLE */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">

        {/* 3. MACRO-CRUCE DE IA (El Insight Multidimensional) */}
        <div className="bg-[#111] border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-start gap-4 relative z-10">
            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400 shrink-0">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                Descubrimiento Estratégico (Deep AI)
                <span className="text-[10px] uppercase bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded font-black tracking-widest border border-purple-500/30">Insight Cruzado</span>
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-4xl">
                Al cruzar los datos del CRM, Time Tracking y Finanzas, detectamos que los proyectos vendidos con el modelo <strong className="text-white">"Suscripción Anual + Setup"</strong> consumen <span className="text-[#00FA82] font-mono font-bold">40% menos horas de desarrollo</span> y generan un margen de ganancia <span className="text-[#00FA82] font-mono font-bold">2.5x mayor</span> que los proyectos de pago único. 
                Sugerimos estandarizar este modelo en todas las nuevas propuestas de la Fase 1.
              </p>
            </div>
          </div>
          <button className="shrink-0 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 relative z-10 shadow-lg border border-purple-400">
            <Zap className="w-4 h-4" /> Aplicar regla en Ventas
          </button>
        </div>

        {/* 4. GOD-MODE KPIs (Métricas Compuestas) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <GodKPI 
            title="Margen Operativo Neto" value="68.4%" trend="+4.1%" isPositive={true} 
            subtitle="Ingresos - (Nómina + Infra)" icon={Target} color="text-[#00FA82]" 
          />
          <GodKPI 
            title="Revenue Per Employee" value="$14,250" trend="+2.5%" isPositive={true} 
            subtitle="Ingresos Totales / Tamaño Equipo" icon={Users} color="text-white" 
          />
          <GodKPI 
            title="Client Acquisition Cost" value="$1,850" trend="-15%" isPositive={true} 
            subtitle="CAC (Gastos MKT / Nuevos Clientes)" icon={Crosshair} color="text-blue-400" 
          />
          <GodKPI 
            title="Time-to-Value (TTV)" value="42 Días" trend="+5 Días" isPositive={false} 
            subtitle="Desde firma hasta primer entregable" icon={Clock} color="text-amber-500" 
          />
        </div>

        {/* 5. ANÁLISIS DE ESFUERZO VS RENTABILIDAD (El Cuadrante Visual) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Gráfico de Esfuerzo (Izquierda) */}
          <div className="lg:col-span-2 bg-[#111] border border-white/10 rounded-2xl flex flex-col p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart4 className="w-5 h-5 text-gray-500" /> Rendimiento de Servicios
                </h3>
                <p className="text-xs text-gray-400 mt-1">Margen financiero vs. Horas invertidas por tipo de producto.</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#00FA82]"></div> Alto Margen</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Alto Esfuerzo</span>
              </div>
            </div>

            {/* Simulación de Gráfico de Barras Cruzadas con Tailwind */}
            <div className="flex-1 flex flex-col justify-end gap-6 pb-2">
              <ServiceBar name="Vertrex OS (Enterprise)" margin={85} effort={40} color="bg-[#00FA82]" />
              <ServiceBar name="E-Commerce Custom" margin={45} effort={90} color="bg-amber-500" />
              <ServiceBar name="Auditorías de Seguridad" margin={95} effort={15} color="bg-[#00FA82]" />
              <ServiceBar name="Mantenimiento Legacy" margin={20} effort={75} color="bg-destructive" />
            </div>
          </div>

          {/* Resumen de Tiempos Muertos (Derecha) */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 flex flex-col">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
              <Layers className="w-4 h-4" /> Distribución de Horas
            </h3>
            
            {/* Donut Chart Simulado */}
            <div className="flex justify-center mb-8 relative">
              <div className="w-40 h-40 rounded-full border-[16px] border-[#0A0A0A] relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-[16px] border-[#00FA82] border-t-transparent border-r-transparent -rotate-45"></div>
                <div className="absolute inset-0 rounded-full border-[16px] border-blue-500 border-b-transparent border-l-transparent rotate-[15deg]"></div>
                <div className="absolute inset-0 rounded-full border-[16px] border-amber-500 border-b-transparent border-r-transparent border-t-transparent -rotate-[75deg]"></div>
                <div className="text-center">
                  <span className="text-2xl font-black text-white block">1.8k</span>
                  <span className="text-[10px] font-mono text-gray-500">Horas Mes</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-auto">
              <LegendItem color="bg-[#00FA82]" label="Trabajo Facturable (Billable)" value="65%" />
              <LegendItem color="bg-blue-500" label="I+D / Internal Lab" value="20%" />
              <LegendItem color="bg-amber-500" label="Reuniones / Gestión" value="15%" alert />
            </div>
          </div>
        </div>

        {/* 6. LEADERBOARD DE CLIENTES (¿Quién paga las cuentas?) */}
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#00FA82]" /> Top Clientes por Rentabilidad Neta
            </h3>
            <button className="text-[10px] text-[#00FA82] hover:underline font-bold uppercase tracking-widest">Ver todos</button>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5">
                <tr>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4 text-right">LTV (Life Time Value)</th>
                  <th className="px-6 py-4 text-right">Costo Atención</th>
                  <th className="px-6 py-4 text-center">Score de IA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <ClientRankRow name="GlobalBank Corp" ltv="$240,000" cost="$45,000" score="A+" trend="up" />
                <ClientRankRow name="Stark Industries" ltv="$85,000" cost="$12,000" score="A" trend="up" />
                <ClientRankRow name="Acme Corp" ltv="$35,000" cost="$28,000" score="C-" trend="down" alert />
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTES DE BI
// ==========================================

function GodKPI({ title, subtitle, value, trend, isPositive, icon: Icon, color }: any) {
  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl p-5 hover:border-[#00FA82]/30 transition-all shadow-sm hover:shadow-md group flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-bold text-white">{title}</p>
          <p className="text-[10px] text-gray-500 font-mono mt-0.5">{subtitle}</p>
        </div>
        <div className="p-2 rounded-lg bg-[#0A0A0A] border border-white/10 group-hover:border-white/20 transition-colors">
          <Icon className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <h3 className={`text-3xl font-black tracking-tight font-mono ${color}`}>
          {value}
        </h3>
        <p className={`text-xs font-bold font-mono px-2 py-1 rounded border ${isPositive ? 'bg-[#00FA82]/10 text-[#00FA82] border-[#00FA82]/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
          {trend}
        </p>
      </div>
    </div>
  );
}

function ServiceBar({ name, margin, effort, color }: any) {
  return (
    <div className="relative">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-bold text-white">{name}</span>
        <span className="text-[10px] font-mono text-gray-400">Margen: <span className="text-white font-bold">{margin}%</span> | Esfuerzo: {effort}%</span>
      </div>
      
      {/* Doble barra superpuesta para simular cruce de datos */}
      <div className="h-3 w-full bg-[#0A0A0A] rounded-full overflow-hidden border border-white/5 relative">
        {/* Barra base (Esfuerzo - Opacidad baja) */}
        <div className="absolute top-0 left-0 h-full bg-white/20" style={{ width: `${effort}%` }}></div>
        {/* Barra principal (Margen - Color vivo) */}
        <div className="absolute top-0 left-0 h-full shadow-[0_0_10px_currentColor] z-10 opacity-90" style={{ width: `${margin}%`, backgroundColor: color.replace('bg-', '').replace('[', '').replace(']', '') || 'var(--color-primary)' }}></div>
      </div>
    </div>
  );
}

function LegendItem({ color, label, value, alert }: any) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-default">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-sm ${color} shadow-sm`}></div>
        <span className="text-xs font-bold text-gray-300">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {alert && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
        <span className="text-sm font-black font-mono text-white">{value}</span>
      </div>
    </div>
  );
}

function ClientRankRow({ name, ltv, cost, score, trend, alert }: any) {
  return (
    <tr className={`hover:bg-white/5 transition-colors group cursor-pointer ${alert ? 'bg-destructive/5' : ''}`}>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-xs font-black text-gray-500 group-hover:text-[#00FA82] transition-colors">
            {name.charAt(0)}
          </div>
          <span className="text-sm font-bold text-white group-hover:text-[#00FA82] transition-colors">{name}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <span className="text-sm font-black font-mono text-[#00FA82]">{ltv}</span>
      </td>
      <td className="px-6 py-4 text-right">
        <span className={`text-sm font-mono font-bold ${alert ? 'text-destructive' : 'text-gray-400'}`}>{cost}</span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-2">
          <span className={`text-sm font-black font-mono px-2 py-0.5 rounded border ${
            score.includes('A') ? 'bg-[#00FA82]/10 text-[#00FA82] border-[#00FA82]/20' : 
            'bg-destructive/10 text-destructive border-destructive/20'
          }`}>
            {score}
          </span>
          {trend === 'up' ? <ArrowUpRight className="w-4 h-4 text-[#00FA82]" /> : <ArrowDownRight className="w-4 h-4 text-destructive" />}
        </div>
      </td>
    </tr>
  );
}