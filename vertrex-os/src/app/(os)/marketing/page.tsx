import React from "react";
import { 
  Megaphone, Sparkles, Share2, TrendingUp, 
  Target, MousePointerClick, MessageSquare, Plus,
  BarChart3, PenTool, Globe,
  Zap, ArrowUpRight,
  DollarSign, Activity, Crosshair, Filter,
  Search, Hash
} from "lucide-react";

export default function GrowthAcquisitionPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in bg-[#0A0A0A]">
      
      {/* =========================================================
          1. HEADER: GROWTH COMMAND CENTER
          ========================================================= */}
      <div className="px-8 py-6 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0 bg-[#050505] relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[400px] h-[50px] bg-[#00FA82]/5 blur-[80px] pointer-events-none"></div>

        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3 relative z-10">
            Growth & Acquisition
            <span className="flex items-center gap-1.5 px-2 py-1 bg-[#00FA82]/10 border border-[#00FA82]/30 rounded text-[10px] uppercase font-bold text-[#00FA82] shadow-[0_0_10px_rgba(0,250,130,0.1)]">
              <Activity className="w-3 h-3" /> Multi-Canal Activo
            </span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm font-mono flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-amber-500" /> Sincronizando: Meta, Google, LinkedIn, X.
          </p>
        </div>
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex bg-[#111] border border-white/10 rounded-lg p-1">
            <button className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold text-black bg-white rounded shadow-sm">Q2 2026</button>
            <button className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-white transition-colors">Mes</button>
          </div>
          <button className="px-5 py-2.5 text-xs font-black text-black bg-[#00FA82] border border-[#00FA82] hover:bg-[#00FA82]/90 rounded-none shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Lanzar Campaña
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">

        {/* =========================================================
            2. MACRO KPIs (PAID MEDIA + CRM CRUZADO)
            ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <GrowthKPI title="Ad Spend Total" value="$4,250.00" trend="+12%" isNegative icon={DollarSign} color="text-white" />
          <GrowthKPI title="Blended CPA" value="$185.00" trend="-5%" isNegative={false} subtitle="Costo por Adquisición Global" icon={Target} color="text-[#00FA82]" />
          <GrowthKPI title="ROAS Global" value="8.4x" trend="+1.2x" isNegative={false} subtitle="Retorno de Inversión Real (CRM)" icon={TrendingUp} color="text-[#00FA82]" />
          <GrowthKPI title="Pipeline Generado" value="$35,700" trend="Nuevos MQLs" isNegative={false} icon={Zap} color="text-amber-500" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* =========================================================
              3. IA AD STUDIO (Generador Multi-Plataforma) - (1/3 Width)
              ========================================================= */}
          <div className="bg-[#111] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-xl">
            <div className="p-5 border-b border-white/10 bg-[#050505]">
              <h2 className="text-sm font-bold text-[#00FA82] uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> AI Ad Studio
              </h2>
            </div>
            
            <div className="p-6 space-y-5 flex-1">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Objetivo de Campaña</label>
                <select className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#00FA82] font-sans">
                  <option>Vender Licencias (SaaS B2B)</option>
                  <option>Ofrecer Servicios (Agencia Custom)</option>
                  <option>Lead Magnet (Descarga de PDF)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Plataforma Destino</label>
                <div className="grid grid-cols-2 gap-2">
                  <PlatformToggle icon={Megaphone} label="LinkedIn" active color="hover:border-blue-400 hover:text-blue-400" />
                  <PlatformToggle icon={Share2} label="Meta Ads" color="hover:border-blue-600 hover:text-blue-600" />
                  <PlatformToggle icon={Search} label="Google Search" color="hover:border-red-500 hover:text-red-500" />
                  <PlatformToggle icon={Hash} label="X (Twitter)" color="hover:border-white hover:text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ángulo / Prompt</label>
                <textarea 
                  placeholder="Ej: Enfatizar que Vertrex reduce la fricción operativa en bancos. Tono directo y agresivo..."
                  className="w-full h-24 bg-[#0A0A0A] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-[#00FA82] resize-none"
                ></textarea>
              </div>
            </div>

            <div className="p-5 border-t border-white/10 bg-[#0A0A0A]">
              <button className="w-full bg-white text-black font-black uppercase tracking-widest py-3 rounded-lg hover:bg-[#00FA82] transition-colors flex items-center justify-center gap-2">
                <PenTool className="w-4 h-4" /> Generar Variantes (3)
              </button>
            </div>
          </div>

          {/* =========================================================
              4. ORGANIC SOCIAL COMMAND & FUNNEL - (2/3 Width)
              ========================================================= */}
          <div className="xl:col-span-2 space-y-8 flex flex-col">
            
            {/* Organic Social Stats */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Ecosistema Orgánico
                </h2>
                <button className="text-[10px] font-bold text-[#00FA82] uppercase hover:underline">Auditoría Social</button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SocialStatCard icon={Megaphone} name="LinkedIn" followers="12.4k" growth="+140" color="text-blue-400" />
                <SocialStatCard icon={Share2} name="Instagram" followers="8.2k" growth="+45" color="text-pink-500" />
                <SocialStatCard icon={Hash} name="X (Twitter)" followers="15.1k" growth="+320" color="text-white" />
                <SocialStatCard icon={Share2} name="YouTube" followers="4.5k" growth="+80" color="text-red-500" />
              </div>
            </div>

            {/* IA Recommendation Alert */}
            <div className="bg-gradient-to-r from-blue-600/10 to-[#111] border border-blue-500/30 rounded-2xl p-5 relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 shrink-0">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                    Oportunidad de Arbitraje (IA Media Buyer)
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    El Costo por Clic (CPC) en <strong className="text-white">LinkedIn Ads</strong> para el sector bancario aumentó un 45%. Sin embargo, en <strong className="text-white">Google Search (Keywords long-tail)</strong> el CPA está en mínimos históricos ($45).
                  </p>
                </div>
              </div>
              <button className="shrink-0 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors shadow-lg">
                Migrar Presupuesto
              </button>
            </div>
            
          </div>
        </div>

        {/* =========================================================
            5. PAID MEDIA ACTIVE CAMPAIGNS (El Ledger del Dinero Publicitario)
            ========================================================= */}
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#050505]">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-[#00FA82]" /> Tráfico Pagado (Live)
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#00FA82]"></div> Activas (4)
              </span>
              <button className="p-2 bg-[#0A0A0A] border border-white/10 rounded hover:border-white/30 transition-colors">
                <Filter className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5">
                <tr>
                  <th className="px-6 py-4">Plataforma / Campaña</th>
                  <th className="px-6 py-4 text-right">Inversión (Spend)</th>
                  <th className="px-6 py-4 text-right">CPA Real</th>
                  <th className="px-6 py-4 text-right">ROAS</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-6 py-4 text-center">IA Insight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                
                <CampaignRow 
                  platform="LinkedIn" icon={Megaphone} iconColor="text-blue-400"
                  name="B2B Enterprise SaaS - CTOs" 
                  spend="$1,250" cpa="$250" roas="12.5x" 
                  status="scaling" insight="Aumentar Budget" insightColor="text-[#00FA82]"
                />
                
                <CampaignRow 
                  platform="Google Ads" icon={Search} iconColor="text-red-400"
                  name="Search [Migración Software]" 
                  spend="$850" cpa="$85" roas="25.0x" 
                  status="scaling" insight="Keyword Optimizada" insightColor="text-[#00FA82]"
                />

                <CampaignRow 
                  platform="Meta Ads" icon={Share2} iconColor="text-blue-600"
                  name="Retargeting Base CRM" 
                  spend="$450" cpa="$120" roas="4.2x" 
                  status="stable" insight="Fatiga de Ad Visual" insightColor="text-amber-500"
                />

                <CampaignRow 
                  platform="X (Twitter)" icon={Hash} iconColor="text-white"
                  name="Promo Open Source Tool" 
                  spend="$1,700" cpa="$850" roas="0.5x" 
                  status="danger" insight="Apagar Campaña" insightColor="text-destructive"
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
// SUB-COMPONENTES DE MARKETING
// ==========================================

function GrowthKPI({ title, subtitle, value, trend, isNegative, icon: Icon, color }: any) {
  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl p-5 hover:border-[#00FA82]/30 transition-all shadow-sm group flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mb-0.5">{title}</p>
          {subtitle && <p className="text-[9px] text-gray-600 font-mono">{subtitle}</p>}
        </div>
        <div className="p-2 rounded-lg bg-[#0A0A0A] border border-white/10 group-hover:border-white/20 transition-colors">
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <h3 className={`text-2xl font-black tracking-tight font-mono ${color}`}>
          {value}
        </h3>
        <p className={`text-[10px] font-black font-mono px-2 py-1 rounded border uppercase ${
          !isNegative ? 'bg-[#00FA82]/10 text-[#00FA82] border-[#00FA82]/20' : 
          'bg-destructive/10 text-destructive border-destructive/20'
        }`}>
          {trend}
        </p>
      </div>
    </div>
  );
}

function PlatformToggle({ icon: Icon, label, active, color }: any) {
  return (
    <button className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-xs font-bold ${
      active ? `bg-white/10 border-white text-white` : `bg-[#0A0A0A] border-white/10 text-gray-500 ${color}`
    }`}>
      <Icon className="w-4 h-4" /> {label}
    </button>
  );
}

function SocialStatCard({ icon: Icon, name, followers, growth, color }: any) {
  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4 flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs font-bold text-gray-400">{name}</span>
      </div>
      <div>
        <p className="text-xl font-black font-mono text-white">{followers}</p>
        <p className="text-[10px] font-bold text-[#00FA82] flex items-center gap-1 mt-1">
          <TrendingUp className="w-3 h-3" /> {growth} este mes
        </p>
      </div>
    </div>
  );
}

function CampaignRow({ platform, icon: Icon, iconColor, name, spend, cpa, roas, status, insight, insightColor }: any) {
  const isDanger = status === 'danger';
  
  return (
    <tr className={`hover:bg-white/5 transition-colors group cursor-pointer ${isDanger ? 'bg-destructive/5' : ''}`}>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#0A0A0A] rounded-lg border border-white/10 shadow-inner">
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
          <div>
            <p className="text-sm font-bold text-white font-sans">{name}</p>
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{platform}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <span className="text-sm font-bold text-white">{spend}</span>
      </td>
      <td className="px-6 py-4 text-right">
        <span className={`text-sm font-bold ${isDanger ? 'text-destructive' : 'text-white'}`}>{cpa}</span>
      </td>
      <td className="px-6 py-4 text-right">
        <span className={`text-sm font-black ${isDanger ? 'text-destructive' : 'text-[#00FA82]'}`}>{roas}</span>
      </td>
      <td className="px-6 py-4 text-center">
        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border ${
          status === 'scaling' ? 'bg-[#00FA82]/10 text-[#00FA82] border-[#00FA82]/20' : 
          status === 'stable' ? 'bg-white/10 text-gray-300 border-white/20' :
          'bg-destructive/10 text-destructive border-destructive/20'
        }`}>
          {status === 'scaling' ? 'Escalando' : status === 'stable' ? 'Estable' : 'Apagar'}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <button className={`text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 w-full py-1.5 rounded border border-transparent hover:border-current transition-colors ${insightColor}`}>
          <Zap className="w-3 h-3 fill-current" /> {insight}
        </button>
      </td>
    </tr>
  );
}