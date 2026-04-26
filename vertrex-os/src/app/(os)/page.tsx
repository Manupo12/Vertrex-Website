import React from "react";
import { 
  Activity, AlertTriangle, ArrowUpRight, CheckCircle2, 
  Clock, DollarSign, FileText, Sparkles, TrendingUp, 
  Users, Zap, ChevronRight, Target
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in pb-24">
      {/* 1. HEADER & SALUDO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Visión General
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Lunes, 20 de Abril 2026 • El sistema opera a capacidad óptima.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
            Sync: Tiempo Real
          </span>
        </div>
      </div>

      {/* 2. KPI GRID (Métricas de Alto Nivel) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Flujo de Caja (Abril)" 
          value="$124,500.00" 
          trend="+12.5%" 
          isPositive={true} 
          icon={DollarSign} 
        />
        <KPICard 
          title="Proyectos Activos" 
          value="24" 
          trend="+3 esta semana" 
          isPositive={true} 
          icon={Target} 
        />
        <KPICard 
          title="Salud del Portafolio" 
          value="92/100" 
          trend="Estable" 
          isPositive={true} 
          icon={Activity} 
          highlight="text-primary"
        />
        <KPICard 
          title="Riesgo de Churn (IA)" 
          value="1 Cliente" 
          trend="Acción requerida" 
          isPositive={false} 
          icon={AlertTriangle} 
          highlight="text-destructive"
        />
      </div>

      {/* 3. CORE SPLIT: TIMELINE VS IA COO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA: Timeline Global (Ancho: 2/3) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              Timeline Global
            </h2>
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center">
              Ver histórico <ChevronRight className="w-3 h-3 ml-1" />
            </button>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="relative border-l border-border/50 ml-3 space-y-8 pb-4">
              
              <TimelineEvent 
                time="Hace 10 min"
                type="finance"
                title="Pago Recibido: Suscripción Anual"
                description="Acme Corp ha completado el pago de la factura #INV-2026-042."
                entity="Acme Corp"
                icon={DollarSign}
                color="text-primary"
                bgColor="bg-primary/10"
              />

              <TimelineEvent 
                time="Hace 45 min"
                type="ai"
                title="IA generó: Resumen de Reunión"
                description="La IA procesó la llamada con el equipo de diseño y extrajo 4 tareas accionables."
                entity="Proyecto Polaris"
                icon={Sparkles}
                color="text-amber-400"
                bgColor="bg-amber-400/10"
              />

              <TimelineEvent 
                time="Hace 2 horas"
                type="task"
                title="Fase 2 Completada"
                description="Carlos M. movió el ticket 'Migración DB' a Completado."
                entity="Infraestructura"
                icon={CheckCircle2}
                color="text-blue-400"
                bgColor="bg-blue-400/10"
              />

              <TimelineEvent 
                time="Ayer"
                type="doc"
                title="Nuevo PRD Publicado"
                description="Se ha publicado la versión final de los requisitos para Q3."
                entity="Producto"
                icon={FileText}
                color="text-purple-400"
                bgColor="bg-purple-400/10"
              />

            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: IA COO & Recomendaciones (Ancho: 1/3) */}
        <div className="space-y-6">
          
          {/* Tarjeta de IA COO */}
          <div className="bg-card border border-primary/30 rounded-xl overflow-hidden relative shadow-[0_0_30px_rgba(0,255,135,0.05)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-700"></div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-primary/10 rounded-md">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-md font-semibold">IA COO Insights</h2>
              </div>
              
              <div className="space-y-4">
                <AlertItem 
                  level="critical"
                  message="El proyecto 'Nexus' está consumiendo un 30% más de horas estimadas."
                  action="Reasignar recursos"
                />
                <AlertItem 
                  level="warning"
                  message="No has contactado a 'TechFlow Inc.' en 45 días. Riesgo de enfriamiento."
                  action="Redactar email"
                />
                <AlertItem 
                  level="success"
                  message="Simulación: Si contratas un Dev Senior hoy, tu delivery rate sube 18% en Q3."
                  action="Ver escenario"
                />
              </div>
            </div>
          </div>

          {/* Mini-CRM Summary */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Próximos Cierres (CRM)</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">GlobalBank API</span>
                <span className="text-primary font-mono">$45k</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-1.5">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground text-right">80% probabilidad</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTES
// ==========================================

function KPICard({ title, value, trend, isPositive, icon: Icon, highlight }: any) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 transition-all hover:border-primary/30 hover:shadow-[0_0_15px_rgba(0,255,135,0.05)]">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="p-2 bg-secondary rounded-lg">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      <div className="mt-2">
        <h3 className={`text-2xl font-semibold tracking-tight ${highlight || "text-foreground"}`}>
          {value}
        </h3>
        <p className={`text-xs mt-1 flex items-center gap-1 ${isPositive ? "text-primary" : "text-destructive"}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
          {trend}
        </p>
      </div>
    </div>
  );
}

function TimelineEvent({ time, title, description, entity, icon: Icon, color, bgColor }: any) {
  return (
    <div className="relative pl-6 sm:pl-8 group">
      <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full border-4 border-card flex items-center justify-center ${bgColor}`}>
        <Icon className={`w-3.5 h-3.5 ${color}`} />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-1">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <span className="text-xs text-muted-foreground font-mono">{time}</span>
      </div>
      <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
        {description}
      </p>
      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary text-xs font-medium text-foreground border border-border/50 hover:border-primary/50 cursor-pointer transition-colors">
        <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
        {entity}
      </div>
    </div>
  );
}

function AlertItem({ level, message, action }: any) {
  const getLevelStyles = () => {
    switch(level) {
      case 'critical': return 'border-l-destructive bg-destructive/5 text-destructive';
      case 'warning': return 'border-l-amber-500 bg-amber-500/5 text-amber-500';
      case 'success': return 'border-l-primary bg-primary/5 text-primary';
      default: return 'border-l-border bg-secondary text-foreground';
    }
  };

  return (
    <div className={`border-l-2 pl-3 py-2 rounded-r-md ${getLevelStyles()}`}>
      <p className="text-sm leading-snug text-foreground/90">{message}</p>
      <button className={`mt-2 text-xs font-medium hover:underline flex items-center gap-1`}>
        {action} <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
}