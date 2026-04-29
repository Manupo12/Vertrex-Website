"use client";

import FinanceWorkspaceScreen from "@/components/os/finance-workspace-screen";
import { useUIStore } from "@/lib/store/ui";
import { 
  DollarSign, TrendingUp, TrendingDown, ArrowUpRight, 
  ArrowDownRight, CreditCard, Receipt, FileText, 
  Download, Zap, AlertTriangle, Building2, Wallet,
  CalendarDays, PieChart, Scissors, Activity, BarChart3,
  Repeat, ChevronDown, DownloadCloud, FileSpreadsheet,
  MoreVertical, Send, User, Clock,
  Search,
  ShieldCheck
} from "lucide-react";

export default function FinanceDashboardPage() {
  const open = useUIStore((store) => store.open);

  if (process.env.NEXT_PUBLIC_USE_WORKSPACE_SNAPSHOT !== "false") {
    return <FinanceWorkspaceScreen open={open} />;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      
      {/* 1. HEADER & CONTROLES GLOBALES */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-3">
              Finanzas Operativas
              <span className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 border border-primary/20 rounded text-[10px] uppercase font-bold text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> Sync Live
              </span>
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-muted-foreground text-sm flex items-center gap-2">
                <Wallet className="w-4 h-4" /> Caja Disponible: <span className="text-foreground font-mono font-medium">$342,850.00</span>
              </p>
              <div className="w-px h-4 bg-border"></div>
              <p className="text-muted-foreground text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" /> Runway Proyectado: <span className="text-foreground font-medium">12.5 Meses</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Dropdown de Exportación (Simulado) */}
            <div className="relative group">
              <button className="px-4 py-2 text-sm font-medium bg-secondary text-foreground hover:bg-secondary/80 rounded-lg border border-border flex items-center gap-2 transition-colors">
                <DownloadCloud className="w-4 h-4" /> Exportar <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <div className="absolute top-full right-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-1">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors">
                  <FileText className="w-4 h-4" /> Reporte PDF (Q2)
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors">
                  <FileSpreadsheet className="w-4 h-4" /> Ledger CSV
                </button>
              </div>
            </div>

            <button className="px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg shadow-[0_0_15px_rgba(0,255,135,0.2)] hover:shadow-[0_0_25px_rgba(0,255,135,0.4)] transition-all flex items-center gap-2" onClick={() => open("registerTransaction", { type: "income" })}>
              <Receipt className="w-4 h-4" /> Nueva Factura
            </button>
          </div>
        </div>

        {/* Módulo Tabs (Navegación Interna) */}
        <div className="flex items-center gap-2 border-b border-border/50 pb-px overflow-x-auto no-scrollbar">
          <TabButton active icon={PieChart} label="Visión General" />
          <TabButton icon={Repeat} label="Ingresos Recurrentes (MRR/ARR)" />
          <TabButton icon={DollarSign} label="Pagos Únicos" />
          <TabButton icon={TrendingDown} label="Gastos y Nómina" />
          <TabButton icon={CreditCard} label="Suscripciones SaaS" alert />
        </div>
      </div>

      {/* 2. IA CFO PREDICTION BANNER (Estrategia de Liquidez & Riesgo) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* IA Insight 1: Estrategia de Liquidez */}
        <div className="bg-gradient-to-r from-card to-card border border-primary/20 rounded-xl p-5 relative overflow-hidden shadow-sm flex flex-col justify-between gap-4">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary mt-0.5 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-1">
                Oportunidad de Flujo de Caja (IA CFO)
                <span className="text-[10px] uppercase bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded font-bold">Estrategia</span>
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                El cliente <strong>Stark Industries</strong> lleva 12 meses pagando su licencia MRR sin retrasos. 
                Sugerimos ofrecer un 15% de descuento por cambiar a ARR, inyectando <span className="text-primary font-mono font-medium">$15,300</span> de liquidez este mes.
              </p>
            </div>
          </div>
          <button className="self-start text-xs font-semibold bg-secondary/50 border border-border px-4 py-2 rounded-lg hover:border-primary/50 hover:text-primary transition-colors flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" /> Generar Propuesta ARR
          </button>
        </div>

        {/* IA Insight 2: Optimización de Gastos */}
        <div className="bg-gradient-to-r from-card to-card border border-amber-500/20 rounded-xl p-5 relative overflow-hidden shadow-sm flex flex-col justify-between gap-4">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 mt-0.5 shrink-0">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-1">
                Optimización de Burn Rate
                <span className="text-[10px] uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded font-bold">Auditoría</span>
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Existen <strong>3 licencias de Figma</strong> inactivas (&gt;45 días) y solapamiento entre Notion y el módulo Docs de Vertrex. 
                Cancelar estos asientos ahorrará <span className="text-amber-500 font-mono font-medium">$1,450/año</span>.
              </p>
            </div>
          </div>
          <button className="self-start text-xs font-semibold bg-secondary/50 border border-border px-4 py-2 rounded-lg hover:border-amber-500/50 hover:text-amber-500 transition-colors flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Revocar Licencias Automáticamente
          </button>
        </div>
      </div>

      {/* 3. KPI GRID (Desglose por Modelo de Negocio con Sparklines) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinanceKPI 
          title="Recurrente Mensual (MRR)" 
          value="$15,400" 
          trend="+5.2%" 
          isPositive={true} 
          icon={Repeat} 
          highlight="text-blue-400"
          sparklineData={[30, 40, 35, 50, 49, 60, 70]}
        />
        <FinanceKPI 
          title="Recurrente Anual (ARR)" 
          value="$184,800" 
          trend="+12.0%" 
          isPositive={true} 
          icon={TrendingUp} 
          highlight="text-primary"
          sparklineData={[40, 40, 40, 80, 80, 80, 95]}
        />
        <FinanceKPI 
          title="Pagos Únicos (Setup/Serv.)" 
          value="$45,000" 
          trend="-2.1%" 
          isPositive={false} 
          icon={DollarSign} 
          trendText="vs Q1"
          sparklineData={[80, 60, 90, 40, 30, 50, 45]}
        />
        <FinanceKPI 
          title="Gastos (Burn Rate)" 
          value="$28,450" 
          trend="+1.2%" 
          isPositive={false} 
          icon={TrendingDown} 
          trendText="mensual"
          sparklineData={[20, 22, 25, 24, 26, 28, 28]}
        />
      </div>

      {/* 4. MAIN LAYOUT: GASTOS VS TRANSACCIONES */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA: Distribución de Gastos */}
        <div className="bg-card border border-border rounded-xl flex flex-col">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-muted-foreground" /> Análisis de Gastos
            </h2>
            <select className="bg-secondary/50 border border-border rounded-md text-xs px-2 py-1 text-muted-foreground outline-none cursor-pointer hover:border-primary/50 transition-colors">
              <option>Este Mes</option>
              <option>Trimestre</option>
              <option>Año Fiscal</option>
            </select>
          </div>
          
          <div className="p-5 space-y-6">
            <div className="w-full h-3 rounded-full flex overflow-hidden shadow-inner">
              <div className="bg-blue-500 h-full hover:opacity-80 transition-opacity cursor-pointer" style={{ width: '55%' }} title="Nómina: 55%"></div>
              <div className="bg-purple-500 h-full hover:opacity-80 transition-opacity cursor-pointer" style={{ width: '25%' }} title="Infra: 25%"></div>
              <div className="bg-amber-500 h-full hover:opacity-80 transition-opacity cursor-pointer" style={{ width: '15%' }} title="Marketing: 15%"></div>
              <div className="bg-muted h-full hover:opacity-80 transition-opacity cursor-pointer" style={{ width: '5%' }} title="SaaS: 5%"></div>
            </div>

            <div className="space-y-4">
              <ExpenseCategory category="Nómina & Contractors" amount="$15,647" percent="55%" color="bg-blue-500" trend="estable" />
              <ExpenseCategory category="Infra (AWS/Neon DB)" amount="$7,112" percent="25%" color="bg-purple-500" trend="subiendo" />
              <ExpenseCategory category="Marketing & Ads" amount="$4,267" percent="15%" color="bg-amber-500" trend="bajando" />
              <ExpenseCategory category="Suscripciones (SaaS)" amount="$1,424" percent="5%" color="bg-muted" trend="estable" />
            </div>

            {/* Runaway Indicator Card */}
            <div className="mt-4 p-4 bg-secondary/20 border border-border rounded-lg flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Pista de Aterrizaje</p>
                <p className="text-sm font-medium text-foreground">Con el burn rate actual:</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold font-mono text-emerald-500">12.5</span>
                <span className="text-xs text-muted-foreground ml-1">Meses</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Transacciones Mixtas & SaaS */}
        <div className="xl:col-span-2 space-y-6 flex flex-col">
          
          {/* MÓDULO DE SUSCRIPCIONES (SaaS Tracker Avanzado) */}
          <div className="bg-card border border-border rounded-xl">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-muted-foreground" /> Licencias y Suscripciones Activas
              </h2>
              <button className="text-sm text-primary hover:underline font-medium">Auditoría de TI</button>
            </div>
            <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <SubscriptionItem 
                name="GitHub Enterprise" cost="$850.00" 
                owner="Juan M." ownerAvatar="JM"
                nextBilling="15 May, 2026" status="good"
              />
              <SubscriptionItem 
                name="Figma Organization" cost="$360.00" 
                owner="Sarah R." ownerAvatar="SR"
                nextBilling="02 May, 2026" status="warning" alertText="3 asientos inactivos"
              />
              <SubscriptionItem 
                name="OpenAI API (GPT-4o)" cost="$1,450.00" 
                owner="Carlos M." ownerAvatar="CM"
                nextBilling="Uso Variable" status="info" isVariable
              />
              <SubscriptionItem 
                name="Notion Team" cost="$160.00" 
                owner="HR Dept" ownerAvatar="HR"
                nextBilling="10 May, 2026" status="danger" alertText="Migrar a Vertrex Docs"
              />
            </div>
          </div>

          {/* ÚLTIMAS TRANSACCIONES / LEDGER */}
          <div className="bg-card border border-border rounded-xl flex-1 flex flex-col">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Ledger Transaccional</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="text" placeholder="Buscar factura..." className="bg-secondary/50 border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-primary transition-colors w-48" />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto no-scrollbar flex-1">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-secondary/10 border-b border-border/50">
                  <tr>
                    <th className="px-5 py-3">Entidad / Concepto</th>
                    <th className="px-5 py-3">Fecha</th>
                    <th className="px-5 py-3">Estado</th>
                    <th className="px-5 py-3 text-right">Importe</th>
                    <th className="px-5 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <TransactionRow entity="GlobalBank" concept="Licencia Enterprise v6" date="Hoy, 09:30 AM" status="Cobrado" amount="+$180,000" type="income" billingModel="annual" onOpen={() => open("registerTransaction", { type: "income" })} />
                  <TransactionRow entity="Wayne Enterprises" concept="Auditoría Seguridad" date="Ayer, 14:15 PM" status="Cobrado" amount="+$30,000" type="income" billingModel="one-time" onOpen={() => open("registerTransaction", { type: "income" })} />
                  <TransactionRow entity="AWS Web Services" concept="Infraestructura (Abril)" date="Ayer, 08:00 AM" status="Pagado" amount="-$3,200" type="expense" onOpen={() => open("registerTransaction", { type: "expense" })} />
                  <TransactionRow entity="Acme Corp" concept="Renovación Plataforma" date="Hace 3 días" status="Vencido" amount="+$1,500" type="pending" billingModel="monthly" onOpen={() => open("registerTransaction", { type: "income" })} />
                  <TransactionRow entity="Vercel Inc." concept="Hosting Frontend" date="Hace 5 días" status="Pagado" amount="-$150" type="expense" onOpen={() => open("registerTransaction", { type: "expense" })} />
                  <TransactionRow entity="Stark Industries" concept="Consultoría Arquitectura" date="Hace 1 semana" status="Cobrado" amount="+$15,000" type="income" billingModel="one-time" onOpen={() => open("registerTransaction", { type: "income" })} />
                </tbody>
              </table>
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

function TabButton({ active, icon: Icon, label, alert }: any) {
  return (
    <button className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors relative whitespace-nowrap ${
      active ? "border-primary text-foreground font-medium bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border hover:bg-secondary/20"
    }`}>
      <Icon className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
      {label}
      {alert && <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>}
    </button>
  );
}

function FinanceKPI({ title, value, trend, isPositive, icon: Icon, highlight, trendText, sparklineData }: any) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all shadow-sm hover:shadow-md group flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={`p-2 rounded-lg transition-colors ${highlight ? highlight.replace('text-', 'bg-').concat('/10') : 'bg-secondary'} group-hover:scale-110`}>
          <Icon className={`w-4 h-4 ${highlight || 'text-muted-foreground'}`} />
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <h3 className={`text-2xl font-semibold tracking-tight font-mono ${highlight || 'text-foreground'}`}>
            {value}
          </h3>
          <p className={`text-xs mt-1 flex items-center gap-1 ${isPositive ? "text-emerald-500" : "text-destructive"} ${highlight && isPositive ? highlight : ''}`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            <span className="font-bold">{trend}</span>
            {trendText && <span className="text-muted-foreground font-medium ml-0.5">{trendText}</span>}
          </p>
        </div>
        
        {/* SVG Sparkline Integrado */}
        <div className="w-16 h-8 opacity-60 group-hover:opacity-100 transition-opacity">
          <MiniSparkline data={sparklineData} color={isPositive ? (highlight ? 'var(--color-primary)' : '#10b981') : '#ef4444'} />
        </div>
      </div>
    </div>
  );
}

function MiniSparkline({ data, color }: { data: number[], color: string }) {
  // Simulación matemática simple para dibujar la línea
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (((val - min) / range) * 100);
    return `${x},${y}`;
  }).join(' L ');

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
      <path d={`M ${points}`} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function ExpenseCategory({ category, amount, percent, color, trend }: any) {
  return (
    <div className="flex items-center justify-between group cursor-pointer hover:bg-secondary/40 p-2.5 -mx-2.5 rounded-lg transition-colors border border-transparent hover:border-border/50">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-sm ${color} shadow-sm`}></div>
        <p className="text-sm font-medium text-foreground">{category}</p>
      </div>
      <div className="text-right flex items-center gap-5">
        {trend === 'subiendo' && <TrendingUp className="w-3 h-3 text-destructive opacity-70" />}
        {trend === 'bajando' && <TrendingDown className="w-3 h-3 text-emerald-500 opacity-70" />}
        {trend === 'estable' && <div className="w-3 h-0.5 bg-muted-foreground opacity-50"></div>}
        <span className="text-xs text-muted-foreground font-mono w-8 text-right">{percent}</span>
        <span className="text-sm font-mono font-bold text-foreground w-20 text-right">{amount}</span>
      </div>
    </div>
  );
}

function SubscriptionItem({ name, cost, owner, ownerAvatar, nextBilling, status, isVariable, alertText }: any) {
  const getStatusStyles = () => {
    switch(status) {
      case 'warning': return 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50';
      case 'danger': return 'border-destructive/30 bg-destructive/5 hover:border-destructive/50';
      default: return 'border-border bg-secondary/20 hover:border-primary/40';
    }
  };

  return (
    <div className={`flex flex-col p-4 border rounded-xl transition-all cursor-pointer group ${getStatusStyles()}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center font-bold text-xs text-muted-foreground shadow-sm">
            {name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-tight">{name}</p>
            <p className="text-[10px] text-muted-foreground font-mono mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {nextBilling}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-end justify-between mt-auto">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-secondary border border-border flex items-center justify-center text-[8px] font-bold text-foreground" title={`Responsable: ${owner}`}>
            {ownerAvatar}
          </div>
          {alertText && (
            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${status === 'warning' ? 'bg-amber-500/20 text-amber-500' : 'bg-destructive/20 text-destructive'}`}>
              {alertText}
            </span>
          )}
        </div>
        
        <p className="text-sm font-mono text-foreground font-bold flex items-center gap-1">
          {isVariable && <Zap className="w-3.5 h-3.5 text-amber-500" />} 
          {cost}
        </p>
      </div>
    </div>
  );
}

function TransactionRow({ entity, concept, date, status, amount, type, billingModel, onOpen }: any) {
  const isIncome = type === 'income';
  const isPending = type === 'pending';
  
  const getBillingBadge = () => {
    if (!billingModel) return null;
    switch(billingModel) {
      case 'monthly': return <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border text-blue-400 border-blue-400/20 bg-blue-400/5 ml-2">MRR</span>;
      case 'annual': return <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border text-primary border-primary/20 bg-primary/5 ml-2">ARR</span>;
      case 'one-time': return <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border text-foreground border-border bg-background ml-2">Setup</span>;
      default: return null;
    }
  };

  return (
    <tr className="border-b border-border/30 hover:bg-secondary/30 transition-colors group cursor-pointer" onClick={onOpen}>
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border shrink-0 shadow-sm transition-colors group-hover:bg-background ${isIncome ? 'bg-primary/10 text-primary border-primary/20' : isPending ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-secondary text-muted-foreground border-border'}`}>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors cursor-pointer">{entity}</p>
            <p className="text-xs text-muted-foreground flex items-center truncate mt-0.5">
              {concept}
              {getBillingBadge()}
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3 whitespace-nowrap">
        <span className="text-xs font-mono text-muted-foreground">{date}</span>
      </td>
      <td className="px-5 py-3 whitespace-nowrap">
        <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-md border shadow-sm ${
          isIncome ? 'text-primary border-primary/20 bg-primary/5' : 
          isPending ? 'text-amber-500 border-amber-500/20 bg-amber-500/5' : 
          'text-muted-foreground border-border bg-background'
        }`}>
          {status}
        </span>
      </td>
      <td className="px-5 py-3 text-right whitespace-nowrap">
        <span className={`text-sm font-mono font-bold ${isIncome ? 'text-primary' : isPending ? 'text-amber-500' : 'text-foreground'}`}>
          {amount}
        </span>
      </td>
      <td className="px-5 py-3 w-10">
        {/* Quick Actions On Hover */}
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isPending && (
            <button className="p-1.5 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 rounded transition-colors" title="Enviar Recordatorio" onClick={(event) => event.stopPropagation()}>
              <Send className="w-4 h-4" />
            </button>
          )}
          <button className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Descargar Factura" onClick={(event) => event.stopPropagation()}>
            <DownloadCloud className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors" title="Más opciones" onClick={(event) => event.stopPropagation()}>
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}