"use client";

import CRMWorkspaceScreen from "@/components/os/crm-workspace-screen";
import { useUIStore } from "@/lib/store/ui";
import { 
  Building2, Phone, Mail, Sparkles, TrendingUp, 
  AlertTriangle, Plus, Filter, MoreHorizontal, 
  DollarSign, Clock, CalendarHeart, ChevronRight,
  ShieldAlert, Repeat
} from "lucide-react";

// Helper: colores distintivos para tags CRM
const tagColorMap: Record<string, string> = {
  Legal: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Revisión DPA": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Urgente: "bg-destructive/10 text-destructive border-destructive/20",
  Caliente: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Enterprise: "bg-primary/10 text-primary border-primary/20",
};

function getTagColor(tag: string) {
  return tagColorMap[tag] || "bg-secondary border border-border text-muted-foreground";
}

export default function CRMPage() {
  const open = useUIStore((store) => store.open);

  if (process.env.NEXT_PUBLIC_USE_WORKSPACE_SNAPSHOT !== "false") {
    return <CRMWorkspaceScreen open={open} />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      
      {/* 1. HEADER & AI SUMMARY STRIP */}
      <div className="flex flex-col gap-4 mb-6 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              Pipeline de Ventas
              <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full border border-primary/20">
                Q2 - 2026
              </span>
            </h1>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-sm text-muted-foreground">
                Total Pipeline (TCV): <span className="text-foreground font-mono font-medium">$845,000</span>
              </p>
              <div className="w-px h-3 bg-border"></div>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-blue-400" /> MRR Proyectado: <span className="text-blue-400 font-mono font-medium">$15,400/mes</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground bg-card border border-border rounded-md hover:text-foreground hover:bg-muted transition-colors">
              <Filter className="w-4 h-4" />
              Filtrar
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-primary-foreground bg-primary rounded-md shadow-[0_0_15px_rgba(0,255,135,0.2)] hover:shadow-[0_0_25px_rgba(0,255,135,0.4)] transition-all">
              <Plus className="w-4 h-4" />
              Nuevo Trato
            </button>
          </div>
        </div>

        {/* AI PREDICTIVE BANNER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AIBannerItem 
            icon={TrendingUp}
            title="Cierre Probable (7 días)"
            value="$12k MRR"
            description="GlobalBank y Stark Industries con >80% prob."
            color="text-primary"
            bg="bg-primary/5 border-primary/20"
          />
          <AIBannerItem 
            icon={CalendarHeart}
            title="Sugerencias de Follow-up"
            value="4 Clientes"
            description="Detectado enfriamiento en comunicaciones."
            color="text-amber-400"
            bg="bg-amber-400/5 border-amber-400/20"
          />
          <AIBannerItem 
            icon={ShieldAlert}
            title="Riesgo de Churn"
            value="TechFlow Inc."
            description="Uso del producto cayó un 40% este mes."
            color="text-destructive"
            bg="bg-destructive/5 border-destructive/20"
            action="Ver detalles"
            onAction={() => open("clientDetail", "techflow")}
          />
        </div>
      </div>

      {/* 2. PIPELINE BOARD (Kanban de Ventas) */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden no-scrollbar pb-4">
        <div className="flex h-full gap-4 min-w-max px-1">
          
          {/* COLUMNA: LEADS / DESCUBRIMIENTO */}
          <PipelineColumn title="Descubrimiento" value="$45,000 TCV" count={3}>
            <DealCard 
              company="Stark Industries"
              dealName="Licencia Standard"
              value={1500}
              billingModel="monthly"
              probability={20}
              lastContact="Hace 2 días"
              aiSuggestion="Sugerencia: Ofrecer 10% dcto por pago anual."
              onOpen={() => open("dealDetail", "stark-standard")}
            />
            <DealCard 
              company="Wayne Enterprises"
              dealName="Auditoría de Seguridad"
              value={30000}
              billingModel="one-time"
              probability={35}
              lastContact="Hoy"
              onOpen={() => open("dealDetail", "wayne-security")}
            />
          </PipelineColumn>

          {/* COLUMNA: PROPUESTA ENVIADA */}
          <PipelineColumn title="Propuesta Enviada" value="$250,000 TCV" count={2} isActive>
            <DealCard 
              company="GlobalBank"
              dealName="Vertrex OS - Enterprise"
              value={180000}
              billingModel="annual"
              probability={65}
              lastContact="Hace 4 días"
              aiSuggestion="Riesgo de enfriamiento. Enviar follow-up."
              aiAlert={true}
              onOpen={() => open("dealDetail", "globalbank-enterprise")}
            />
            <DealCard 
              company="Acme Corp"
              dealName="Renovación + Upsell"
              value={5000}
              billingModel="monthly"
              probability={85}
              lastContact="Ayer"
              onOpen={() => open("dealDetail", "acme-renewal")}
            />
          </PipelineColumn>

          {/* COLUMNA: NEGOCIACIÓN */}
          <PipelineColumn title="Negociación (Legal)" value="$550,000 TCV" count={1}>
            <DealCard 
              company="Cyberdyne Systems"
              dealName="Integración IA Personalizada"
              value={550000}
              billingModel="one-time"
              probability={90}
              lastContact="Hace 1 hora"
              tags={["Legal", "Revisión DPA"]}
              isHot={true}
              onOpen={() => open("dealDetail", "cyberdyne-ai")}
            />
          </PipelineColumn>

          {/* COLUMNA: CERRADO GANADO */}
          <PipelineColumn title="Cerrado (Ganado)" value="$1.2M TCV" count={24} isWon>
            <div className="flex flex-col items-center justify-center h-32 bg-secondary/20 border border-dashed border-border rounded-xl text-muted-foreground text-sm">
              <TrendingUp className="w-6 h-6 mb-2 opacity-50" />
              24 tratos este trimestre
            </div>
          </PipelineColumn>

        </div>
      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTES DEL CRM
// ==========================================

function AIBannerItem({ icon: Icon, title, value, description, color, bg, action, onAction }: any) {
  return (
    <div className={`p-4 rounded-xl border flex items-start gap-4 ${bg}`}>
      <div className={`p-2 rounded-lg bg-background/50 border border-border ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{title}</h4>
        <div className="flex items-baseline gap-2">
          <span className={`text-xl font-bold ${color}`}>{value}</span>
        </div>
        <p className="text-sm text-foreground/80 mt-1">{description}</p>
        {action && (
          <button className={`text-xs font-medium mt-2 hover:underline flex items-center gap-1 ${color}`} onClick={onAction}>
            {action} <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

function PipelineColumn({ title, value, count, isActive, isWon, children }: any) {
  return (
    <div className="w-[340px] shrink-0 flex flex-col h-full">
      <div className="flex flex-col mb-3 px-1 sticky top-0 bg-background/95 backdrop-blur z-10 py-2 border-b border-border/50">
        <div className="flex items-center justify-between mb-1">
          <h3 className={`text-sm font-semibold flex items-center gap-2 ${isWon ? "text-primary" : "text-foreground"}`}>
            {title}
          </h3>
          <span className="text-xs font-medium text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-md">
            {count}
          </span>
        </div>
        <div className="text-xs font-mono text-muted-foreground flex items-center gap-1">
          <DollarSign className="w-3 h-3" /> {value}
        </div>
        {isActive && <div className="absolute bottom-0 left-0 w-full h-[1px] bg-primary/50 shadow-[0_0_10px_rgba(0,255,135,0.5)]"></div>}
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar pb-10 pt-2">
        {children}
      </div>
    </div>
  );
}

function DealCard({ company, dealName, value, billingModel, probability, lastContact, aiSuggestion, aiAlert, tags = [], isHot, onOpen }: any) {
  // Lógica de formateo según el modelo de negocio
  const getBillingFormat = () => {
    switch(billingModel) {
      case 'monthly': return { text: '/mes', color: 'text-blue-400', badge: 'MRR' };
      case 'annual': return { text: '/año', color: 'text-primary', badge: 'ARR' };
      case 'one-time': return { text: ' Único', color: 'text-foreground', badge: 'Setup' };
      default: return { text: '', color: 'text-foreground', badge: 'Pago' };
    }
  };

  const billing = getBillingFormat();

  return (
    <div className={`group bg-card border rounded-xl p-4 cursor-pointer shadow-sm transition-all hover:shadow-md flex flex-col gap-3 relative overflow-hidden ${
      isHot ? "border-primary/50 shadow-[0_0_15px_rgba(0,255,135,0.05)]" : "border-border hover:border-primary/30"
    }`} onClick={onOpen}>
      
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center border border-border">
            <Building2 className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{company}</h4>
            <p className="text-xs text-muted-foreground">{dealName}</p>
          </div>
        </div>
        <div className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border bg-background ${
          billingModel === 'monthly' ? 'text-blue-400 border-blue-400/20' : 
          billingModel === 'annual' ? 'text-primary border-primary/20' : 
          'text-muted-foreground border-border'
        }`}>
          {billing.badge}
        </div>
      </div>

      <div className="flex items-end justify-between mt-1">
        <div className="flex items-baseline gap-0.5">
          <span className={`text-lg font-mono font-bold ${billing.color}`}>
            ${value.toLocaleString()}
          </span>
          <span className="text-xs font-mono text-muted-foreground">{billing.text}</span>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-medium text-muted-foreground">{probability}% Cierre</span>
          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${probability}%` }}></div>
          </div>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag: string) => (
            <span key={tag} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getTagColor(tag)}`}>
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-1 pt-3 border-t border-border/50 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lastContact}</span>
          <div className="flex gap-1">
            <button className="p-1 hover:bg-secondary rounded hover:text-foreground transition-colors" onClick={(event) => event.stopPropagation()}><Mail className="w-3 h-3" /></button>
            <button className="p-1 hover:bg-secondary rounded hover:text-foreground transition-colors" onClick={(event) => event.stopPropagation()}><Phone className="w-3 h-3" /></button>
          </div>
        </div>
        
        {aiSuggestion && (
          <div className={`flex items-start gap-1.5 p-2 rounded-md border text-xs mt-1 ${
            aiAlert ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/5 border-primary/20 text-primary"
          }`}>
            <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span className="leading-tight">{aiSuggestion}</span>
          </div>
        )}
      </div>
    </div>
  );
}