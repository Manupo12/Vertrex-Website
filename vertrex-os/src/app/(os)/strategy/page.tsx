import React from "react";
import { 
  Target, TrendingUp, Zap, ArrowUpRight, 
  Plus, ChevronRight, Activity, PieChart, 
  Layers, BarChart3, AlertCircle
} from "lucide-react";

export default function OKRPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in pb-4">
      
      {/* 1. HEADER ESTRATÉGICO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" /> Dirección Estratégica
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Objetivos y Resultados Clave (OKRs) • Trimestre Q2 2026
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium bg-secondary text-foreground hover:bg-secondary/80 rounded-lg border border-border flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Reporte de Impacto
          </button>
          <button className="px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg shadow-[0_0_15px_rgba(0,255,135,0.2)] hover:shadow-[0_0_25px_rgba(0,255,135,0.4)] transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nuevo Objetivo
          </button>
        </div>
      </div>

      {/* 2. AI STRATEGY INSIGHT (La explosión diferencial) */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary shadow-[0_0_15px_rgba(0,255,135,0.5)]"></div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-xl text-primary animate-pulse">
            <Zap className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Análisis de Impacto IA</h3>
            <p className="text-white/90 text-sm leading-relaxed max-w-4xl">
              Detectado desvío en el objetivo <strong className="text-white">"Escalabilidad SaaS"</strong>. El 65% de las tareas completadas esta semana están ligadas a "Mantenimiento", que no impacta en los resultados clave definidos. 
              <span className="text-primary ml-1 font-medium cursor-pointer hover:underline">Sugerencia: Priorizar épica NEX-200.</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. GRID DE OKRs */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
        
        {/* Objetivo 1: Crecimiento */}
        <OKRCard 
          title="Dominar el mercado SaaS Enterprise"
          progress={72}
          owner="Juan M."
          keyResults={[
            { label: "Cerrar 3 contratos de +$150k", current: 2, target: 3, status: "on-track" },
            { label: "Reducir el Churn Rate al 2%", current: "3.5%", target: "2%", status: "at-risk" }
          ]}
        />

        {/* Objetivo 2: Producto */}
        <OKRCard 
          title="Optimización de Infraestructura & IA"
          progress={45}
          owner="Sarah R."
          keyResults={[
            { label: "Reducir latencia de respuesta IA a < 1s", current: "1.8s", target: "0.8s", status: "behind" },
            { label: "Implementar Sandbox de Testing Interno", current: 1, target: 1, status: "done" }
          ]}
        />

      </div>
    </div>
  );
}

// Sub-componente OKRCard
function OKRCard({ title, progress, owner, keyResults }: any) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all group">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-xl font-bold border border-border group-hover:border-primary/30 transition-colors">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                Responsable: <span className="text-foreground font-medium">{owner}</span>
              </p>
            </div>
          </div>
          
          {/* Progress Circle/Bar */}
          <div className="flex flex-col items-end gap-2">
            <span className="text-2xl font-mono font-bold text-primary">{progress}%</span>
            <div className="w-48 h-2 bg-secondary rounded-full overflow-hidden border border-border">
              <div className="h-full bg-primary shadow-[0_0_10px_rgba(0,255,135,0.4)]" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Key Results Table */}
        <div className="space-y-3">
          {keyResults.map((kr: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  kr.status === 'on-track' ? 'bg-primary shadow-[0_0_8px_rgba(0,255,135,0.6)]' : 
                  kr.status === 'at-risk' ? 'bg-amber-500' : 
                  kr.status === 'done' ? 'bg-blue-400' : 'bg-destructive'
                }`}></div>
                <span className="text-sm text-foreground/90">{kr.label}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-xs font-mono text-muted-foreground">Actual: <span className="text-white">{kr.current}</span></span>
                <span className="text-xs font-mono text-muted-foreground">Meta: <span className="text-white">{kr.target}</span></span>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}