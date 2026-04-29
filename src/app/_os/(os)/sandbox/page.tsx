"use client";

import React, { useState } from "react";
import { 
  FlaskConical, Play, Cpu, DollarSign, Users, 
  Target, Activity, AlertTriangle, CheckCircle2, 
  ArrowRight, ShieldCheck, Zap, Crosshair, 
  Database, GitBranch, CalendarDays
} from "lucide-react";
import SandboxWorkspaceScreen from "@/components/os/sandbox-workspace-screen";

const useWorkspaceSnapshot = process.env.NEXT_PUBLIC_USE_WORKSPACE_SNAPSHOT !== "false";

export default function DecisionSandboxPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(true);

  if (useWorkspaceSnapshot) {
    return <SandboxWorkspaceScreen />;
  }

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setHasSimulated(true);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in bg-[#0A0A0A]">
      
      {/* 1. HEADER (LABORATORIO STRATÉGICO) */}
      <div className="px-8 py-6 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0 bg-[#050505] relative overflow-hidden">
        {/* Ambient Grid Effect */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
             style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Sandbox & Simulador de Escenarios
            <span className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-[10px] uppercase font-bold text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
              <FlaskConical className="w-3 h-3" /> Entorno de Pruebas
            </span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm flex items-center gap-2 font-mono">
            <Cpu className="w-4 h-4 text-amber-500" /> Proyección Multidimensional de Impacto System-Wide.
          </p>
        </div>
        
        <div className="flex items-center gap-3 relative z-10">
          <button className="px-4 py-2 text-sm font-bold text-black bg-white hover:bg-gray-200 rounded-lg transition-all flex items-center gap-2">
            <Database className="w-4 h-4" /> Cargar Snapshot
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-full">
          
          {/* =========================================================
              PANEL IZQUIERDO: CONSTRUCTOR DE HIPÓTESIS
              ========================================================= */}
          <div className="bg-[#111] border border-white/10 rounded-2xl flex flex-col shadow-2xl h-fit">
            <div className="p-5 border-b border-white/10 bg-[#050505] rounded-t-2xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-[#00FA82]" /> Variables del Escenario
              </h2>
              <p className="text-xs text-gray-400 mt-1">Configura la decisión a simular.</p>
            </div>
            
            <div className="p-6 space-y-6">
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tipo de Decisión</label>
                <select className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#00FA82] transition-colors appearance-none cursor-pointer">
                  <option>Aceptar Nuevo Proyecto Cliente</option>
                  <option>Contratar Nuevo Talento (Nómina)</option>
                  <option>Adquirir Suscripción/SaaS Enterprise</option>
                  <option>Pivotar Modelo de Pricing</option>
                </select>
              </div>

              {/* Formulario Dinámico (Ejemplo: Nuevo Proyecto) */}
              <div className="p-4 border border-white/5 bg-[#0A0A0A]/50 rounded-xl space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#00FA82] uppercase tracking-widest">Parámetros</span>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Cliente / Entidad</label>
                  <input type="text" defaultValue="Wayne Enterprises" className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#00FA82]" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Valor (TCV)</label>
                    <div className="relative">
                      <DollarSign className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input type="text" defaultValue="45,000" className="w-full bg-[#111] border border-white/10 rounded-lg pl-8 pr-3 py-2 text-sm text-white outline-none focus:border-[#00FA82] font-mono" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Duración Estimada</label>
                    <input type="text" defaultValue="8 Semanas" className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#00FA82] font-mono" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Skills Requeridos</label>
                  <input type="text" defaultValue="Backend (Node), Seguridad, Frontend" className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#00FA82]" />
                </div>
              </div>

              <button 
                onClick={handleSimulate}
                className="w-full bg-[#00FA82] text-black font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,250,130,0.4)] transition-all active:scale-95"
              >
                {isSimulating ? <Activity className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                {isSimulating ? 'Calculando Nodos...' : 'Ejecutar Simulación'}
              </button>
            </div>
          </div>

          {/* =========================================================
              PANEL DERECHO: RESULTADOS E IMPACTO CRUZADO
              ========================================================= */}
          <div className={`xl:col-span-2 space-y-6 transition-all duration-500 ${isSimulating ? 'opacity-50 blur-sm' : 'opacity-100'}`}>
            
            {hasSimulated && (
              <>
                {/* DICTAMEN DE LA IA (El Veredicto) */}
                <div className="bg-gradient-to-r from-amber-500/10 to-[#111] border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl flex flex-col gap-4">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                  
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-amber-500/20 rounded-xl text-amber-500 shrink-0">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white tracking-tight">Viabilidad: Aprobado con Reservas (72/100)</h3>
                        <p className="text-sm text-gray-400 font-mono mt-0.5">Veredicto del Motor de Inferencia Vertrex</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-white/90 leading-relaxed border-t border-white/10 pt-4">
                    Financieramente, el proyecto es excelente (+38% de margen). Sin embargo, aceptar este proyecto <strong className="text-amber-500">colapsará la capacidad operativa de Backend</strong>. Carlos M. (Node.js) pasará al 125% de carga en la semana 3. Estratégicamente, no alinea con el OKR de "Crecer en SaaS", ya que es un desarrollo a medida (Setup).
                  </p>
                  
                  <div className="flex gap-3 mt-2">
                    <span className="text-xs font-bold text-[#00FA82] bg-[#00FA82]/10 border border-[#00FA82]/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Retrasar inicio 3 semanas
                    </span>
                    <span className="text-xs font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <Users className="w-4 h-4" /> Contratar Freelance Backend
                    </span>
                  </div>
                </div>

                {/* GRID DE IMPACTO MULTIDIMENSIONAL */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Impacto: FINANZAS */}
                  <ImpactCard 
                    title="Impacto Financiero"
                    icon={DollarSign}
                    status="positive"
                    metrics={[
                      { label: "Caja Proyectada", value: "+$45,000", isPos: true },
                      { label: "Costo Interno Est.", value: "-$12,400", isPos: false },
                      { label: "Runway", value: "+0.8 Meses", isPos: true }
                    ]}
                  />

                  {/* Impacto: OPERACIONES/HR */}
                  <ImpactCard 
                    title="Impacto en Equipo (HR)"
                    icon={Users}
                    status="negative"
                    metrics={[
                      { label: "Carga Global Sq.", value: "92% (Riesgo)", isPos: false },
                      { label: "Cuello Botella", value: "Backend (Node)", isPos: false },
                      { label: "Horas Libres", value: "Solo 12h/sem", isPos: false }
                    ]}
                  />

                  {/* Impacto: ESTRATEGIA (OKRs) */}
                  <ImpactCard 
                    title="Impacto Estratégico"
                    icon={Target}
                    status="warning"
                    metrics={[
                      { label: "Alineación OKR", value: "Baja (30%)", isPos: false },
                      { label: "Foco", value: "Servicios/Custom", isPos: false },
                      { label: "Cashflow Alert", value: "Alta Inyección", isPos: true }
                    ]}
                  />
                </div>

                {/* TIMELINE DE ESTRÉS OPERATIVO */}
                <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" /> Proyección de Estrés Operativo (Próximas 8 Semanas)
                  </h3>
                  
                  <div className="relative h-40 w-full flex items-end justify-between px-2 pb-6 border-b border-white/10">
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between border-l border-white/10 pointer-events-none z-0">
                      <div className="w-full border-t border-white/5 border-dashed"></div>
                      <div className="w-full border-t border-amber-500/20 border-dashed relative"><span className="absolute -left-8 -top-2 text-[8px] text-amber-500 font-mono">100%</span></div>
                      <div className="w-full border-t border-white/5 border-dashed"></div>
                      <div className="w-full border-t border-white/5 border-dashed"></div>
                    </div>

                    {/* Bars (Simulando semanas) */}
                    <StressBar week="Sem 1" load={60} />
                    <StressBar week="Sem 2" load={75} />
                    <StressBar week="Sem 3" load={115} isAlert />
                    <StressBar week="Sem 4" load={120} isAlert />
                    <StressBar week="Sem 5" load={95} />
                    <StressBar week="Sem 6" load={80} />
                    <StressBar week="Sem 7" load={70} />
                    <StressBar week="Sem 8" load={65} />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-gray-500">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-[#00FA82] rounded-full"></div> Capacidad Sana (&lt;90%)</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-500 rounded-full"></div> Sobrecarga / Riesgo Burnout (&gt;100%)</span>
                  </div>
                </div>

              </>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTES DEL SANDBOX
// ==========================================

function ImpactCard({ title, icon: Icon, status, metrics }: any) {
  const getStyles = () => {
    switch(status) {
      case 'positive': return { border: 'border-[#00FA82]/30', bg: 'bg-[#00FA82]/5', iconColor: 'text-[#00FA82]' };
      case 'negative': return { border: 'border-destructive/30', bg: 'bg-destructive/5', iconColor: 'text-destructive' };
      case 'warning': return { border: 'border-amber-500/30', bg: 'bg-amber-500/5', iconColor: 'text-amber-500' };
      default: return { border: 'border-white/10', bg: 'bg-[#111]', iconColor: 'text-gray-400' };
    }
  };
  const styles = getStyles();

  return (
    <div className={`bg-[#0A0A0A] border rounded-2xl p-5 ${styles.border}`}>
      <div className="flex items-center gap-3 mb-5 border-b border-white/5 pb-3">
        <div className={`p-2 rounded-lg bg-[#111] border border-white/10 ${styles.iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
        <h4 className="text-sm font-bold text-white tracking-wide">{title}</h4>
      </div>
      
      <div className="space-y-4">
        {metrics.map((m: any, i: number) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">{m.label}</span>
            <span className={`text-sm font-mono font-black ${m.isPos ? 'text-[#00FA82]' : m.isPos === false ? 'text-destructive' : 'text-amber-500'}`}>
              {m.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StressBar({ week, load, isAlert }: any) {
  const height = Math.min(load, 140); // Cap para visualización
  
  return (
    <div className="relative flex flex-col items-center group z-10 w-full">
      {/* Tooltip Hover */}
      <div className="absolute -top-10 bg-white text-black text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Carga: {load}%
      </div>
      
      {/* Bar */}
      <div className="w-8 md:w-12 bg-[#111] border border-white/5 rounded-t-md relative flex items-end justify-center overflow-hidden" style={{ height: '120px' }}>
        <div 
          className={`w-full transition-all duration-1000 ${isAlert ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-[#00FA82]'}`} 
          style={{ height: `${(height / 140) * 100}%` }}
        ></div>
      </div>
      
      {/* Label */}
      <span className="text-[10px] font-mono text-gray-500 mt-2">{week}</span>
    </div>
  );
}