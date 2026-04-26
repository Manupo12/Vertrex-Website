"use client";

import { useUIStore } from "@/lib/store/ui";
import { 
  ShieldCheck, FileSignature, Clock, AlertCircle, 
  Plus, Search, Filter, MoreVertical, FileText, 
  CheckCircle2, Download, Eye, History, Briefcase,
  Building2, Zap, ArrowRight, Lock
} from "lucide-react";

export default function LegalVaultPage() {
  const open = useUIStore((store) => store.open);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in bg-[#0A0A0A]">
      
      {/* 1. HEADER: CENTRO DE CUMPLIMIENTO */}
      <div className="px-8 py-6 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0 bg-[#050505] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[100px] bg-emerald-500/5 blur-[80px] pointer-events-none"></div>

        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Bóveda Legal & Contratos
            <span className="flex items-center gap-1.5 px-2 py-1 bg-[#111] border border-[#00FA82]/20 rounded text-[10px] uppercase font-bold text-[#00FA82]">
              <Lock className="w-3 h-3" /> Encriptación AES-256
            </span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00FA82]" /> Auditoría de cumplimiento y firmas en tiempo real.
          </p>
        </div>
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar contrato o NIT..." 
              className="bg-[#111] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white outline-none focus:border-[#00FA82] transition-colors w-64"
            />
          </div>
          <button className="px-5 py-2.5 text-xs font-black text-black bg-[#00FA82] border border-[#00FA82] hover:bg-[#00FA82]/90 rounded-none shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all flex items-center gap-2" onClick={() => open("templateSelector")}>
            <Plus className="w-4 h-4" /> Nuevo Documento
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">

        {/* 2. ALERTAS DE VENCIMIENTO & FIRMAS (IA Legal Guard) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-amber-500/5 border border-amber-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 shrink-0">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Próximos Vencimientos (IA Monitor)</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  El contrato de prestación de servicios con <strong className="text-white">Budaphone</strong> vence en 15 días. No se ha detectado una cláusula de renovación automática activa.
                </p>
              </div>
            </div>
            <button className="shrink-0 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2">
              <Zap className="w-4 h-4" /> Notificar Renovación
            </button>
          </div>

          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pendientes de Firma</span>
              <FileSignature className="w-5 h-5 text-[#00FA82]" />
            </div>
            <div className="text-3xl font-black text-white font-mono">03</div>
            <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-tighter">Documentos enviados en espera</p>
          </div>
        </div>

        {/* 3. TABLA DE GESTIÓN DE CONTRATOS (Ledger Legal) */}
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/10 bg-[#050505] flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#00FA82]" /> Repositorio Maestro
            </h3>
            <div className="flex gap-2">
               <button className="p-2 bg-white/5 rounded border border-white/10 text-gray-400 hover:text-white transition-colors"><Filter className="w-4 h-4" /></button>
            </div>
          </div>
          
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5">
                <tr>
                  <th className="px-6 py-4">Documento / Tipo</th>
                  <th className="px-6 py-4">Cliente / Entidad</th>
                  <th className="px-6 py-4">Fecha de Firma</th>
                  <th className="px-6 py-4">Vencimiento</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                
                <ContractRow 
                  name="Contrato Marco de Servicios" 
                  type="MSA" 
                  client="GlobalBank Corp" 
                  signedDate="12 Ene, 2026" 
                  expiryDate="12 Ene, 2027" 
                  status="active" 
                  onOpen={() => open("contractDetail", "globalbank-contract")}
                />
                
                <ContractRow 
                  name="SOW: Migración Core v2" 
                  type="Alcance" 
                  client="Budaphone" 
                  signedDate="01 Abr, 2026" 
                  expiryDate="01 May, 2026" 
                  status="expiring" 
                  onOpen={() => open("contractDetail", "budaphone-contract")}
                />

                <ContractRow 
                  name="NDA Confidencialidad" 
                  type="Legal" 
                  client="Stark Industries" 
                  signedDate="--" 
                  expiryDate="--" 
                  status="pending" 
                  onOpen={() => open("contractDetail", "stark-nda")}
                />

                <ContractRow 
                  name="Licencia Software Enterprise" 
                  type="SaaS" 
                  client="Wayne Enterprises" 
                  signedDate="20 Dic, 2025" 
                  expiryDate="20 Dic, 2026" 
                  status="active" 
                  onOpen={() => open("contractDetail", "wayne-license")}
                />

              </tbody>
            </table>
          </div>
        </div>

        {/* 4. SECCIÓN DE PLANTILLAS Y VERSIONADO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TemplateCard label="Contrato Servicios" version="v2.4" lastEdit="Hace 2 días" onOpen={() => open("templateSelector")} />
          <TemplateCard label="Acuerdo de Alcance (SOW)" version="v1.8" lastEdit="Hace 1 mes" onOpen={() => open("templateSelector")} />
          <TemplateCard label="NDA Estándar" version="v3.0" lastEdit="Hace 3 meses" onOpen={() => open("templateSelector")} />
          <TemplateCard label="Acta de Entrega" version="v1.2" lastEdit="Hace 1 semana" onOpen={() => open("templateSelector")} />
        </div>

      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTES LEGALES
// ==========================================

function ContractRow({ name, type, client, signedDate, expiryDate, status, onOpen }: any) {
  const getStatusStyle = () => {
    switch(status) {
      case 'active': return 'bg-[#00FA82]/10 text-[#00FA82] border-[#00FA82]/20';
      case 'expiring': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'pending': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-white/5 text-gray-400 border-white/10';
    }
  };

  return (
    <tr className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={onOpen}>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#0A0A0A] rounded-lg border border-white/10 group-hover:border-[#00FA82]/50 transition-colors">
            <FileText className="w-4 h-4 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white group-hover:text-[#00FA82] transition-colors">{name}</p>
            <p className="text-[10px] text-gray-500 font-mono uppercase">{type}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-gray-300">
          <Building2 className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-sm font-medium">{client}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-400 font-mono text-xs">{signedDate}</td>
      <td className="px-6 py-4 text-gray-400 font-mono text-xs">
        <span className={status === 'expiring' ? 'text-amber-500 font-bold' : ''}>{expiryDate}</span>
      </td>
      <td className="px-6 py-4 text-center">
        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border ${getStatusStyle()}`}>
          {status === 'active' ? 'Vigente' : status === 'expiring' ? 'Vence Pronto' : 'Pendiente Firma'}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white" onClick={(event) => event.stopPropagation()}><Eye className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white" onClick={(event) => event.stopPropagation()}><Download className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white" onClick={(event) => event.stopPropagation()}><MoreVertical className="w-4 h-4" /></button>
        </div>
      </td>
    </tr>
  );
}

function TemplateCard({ label, version, lastEdit, onOpen }: any) {
  return (
    <div className="bg-[#111] border border-white/5 p-4 rounded-xl hover:border-white/20 transition-all cursor-pointer group" onClick={onOpen}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-black rounded-lg border border-white/10">
          <Briefcase className="w-4 h-4 text-gray-500" />
        </div>
        <span className="text-[10px] font-mono text-gray-600 font-bold uppercase tracking-tighter">Template</span>
      </div>
      <p className="text-sm font-bold text-white mb-1 group-hover:text-[#00FA82] transition-colors">{label}</p>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
        <span className="text-[10px] font-black text-[#00FA82] bg-[#00FA82]/10 px-1.5 py-0.5 rounded">{version}</span>
        <span className="text-[9px] text-gray-600 font-mono italic">{lastEdit}</span>
      </div>
    </div>
  );
}