"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import DocumentGeneratorScreen from "@/components/docs/document-generator-screen";
import { 
  FileText, Briefcase, Zap, Download,
  Settings2,
  Building2, AlignLeft, ListChecks, FileSignature
} from "lucide-react";

export default function DocumentGeneratorPage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  const clientId = searchParams.get("client");
  const source = searchParams.get("source");

  return (
    <DocumentGeneratorScreen
      key={`${templateId ?? "default"}:${clientId ?? "default"}:${source ?? "generator"}`}
      templateId={templateId}
      clientId={clientId}
      source={source}
    />
  );
}

export function LegacyDocumentGeneratorPro() {
  // Estado que alimenta el documento en tiempo real
  const [docState, setDocState] = useState({
    code: "VTX-OFC-BDP-001",
    date: "24 de abril de 2026",
    city: "Neiva, Huila",
    client: {
      name: "BUDAPHONE",
      nit: "1082215711-1",
      address: "Calle 3 #6-46 Centro, Yaguará – Huila",
      phone: "3144618379",
      email: "distribuidorabudaphone@gmail.com"
    },
    subject: "Presentación y formalización de servicio de desarrollo de plataforma web.",
    scope: [
      "Tienda virtual (ecommerce) con catálogo.",
      "Panel administrativo completo.",
      "Sistema de carrito y proceso de pago.",
      "Gestión de inventario centralizado.",
      "Integración con pasarela de pagos (Wompi).",
      "Control operativo y contable básico.",
      "Sistema de gestión de órdenes.",
      "Sistema de notificaciones internas."
    ]
  });

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-0 animate-fade-in bg-[#0A0A0A] border border-border/30 rounded-2xl overflow-hidden shadow-2xl">
      
      {/* =========================================================
          PANEL IZQUIERDO: INPUTS Y CONTROLES (VERTREX OS)
          ========================================================= */}
      <div className="w-[450px] shrink-0 flex flex-col border-r border-border/30 bg-[#0A0A0A] relative z-10">
        
        {/* Header del Panel */}
        <div className="p-5 border-b border-border/30 shrink-0 bg-[#050505]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 tracking-tight">
            <Zap className="w-5 h-5 text-[#00FA82]" /> Motor de Documentos
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Generación automatizada de plantillas VTX.</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          
          {/* SECCIÓN 1: Selección */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-[#00FA82] uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" /> 1. Plantilla Activa
            </label>
            <div className="bg-[#111] border border-[#222] p-3 rounded-xl flex items-center justify-between cursor-pointer hover:border-[#00FA82]/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#00FA82]/10 rounded-lg text-[#00FA82]">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Oficio de Presentación</p>
                  <p className="text-[10px] text-muted-foreground font-mono">Fase 1 / Comercial</p>
                </div>
              </div>
              <Settings2 className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* SECCIÓN 2: Metadatos del Documento */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-[#00FA82] uppercase tracking-widest flex items-center gap-2 border-b border-border/30 pb-2">
              <Building2 className="w-3.5 h-3.5" /> 2. Datos del Cliente & Metadatos
            </label>
            
            <div className="grid grid-cols-2 gap-4">
              <VtxInput label="Código Doc" value={docState.code} onChange={(e) => setDocState({...docState, code: e.target.value})} />
              <VtxInput label="Ciudad" value={docState.city} onChange={(e) => setDocState({...docState, city: e.target.value})} />
            </div>
            
            <VtxInput label="Empresa / Cliente" value={docState.client.name} onChange={(e) => setDocState({...docState, client: {...docState.client, name: e.target.value}})} />
            
            <div className="grid grid-cols-2 gap-4">
              <VtxInput label="NIT" value={docState.client.nit} onChange={(e) => setDocState({...docState, client: {...docState.client, nit: e.target.value}})} />
              <VtxInput label="Teléfono" value={docState.client.phone} onChange={(e) => setDocState({...docState, client: {...docState.client, phone: e.target.value}})} />
            </div>
          </div>

          {/* SECCIÓN 3: Contenido Dinámico */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-[#00FA82] uppercase tracking-widest flex items-center gap-2 border-b border-border/30 pb-2">
              <AlignLeft className="w-3.5 h-3.5" /> 3. Contenido
            </label>
            
            <VtxInput label="Asunto" value={docState.subject} isTextArea onChange={(e) => setDocState({...docState, subject: e.target.value})} />
            
            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Alcance (Viñetas)</label>
              <div className="bg-[#111] border border-[#222] rounded-xl p-3 space-y-2">
                {docState.scope.slice(0,4).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00FA82]"></div>
                    <span className="truncate">{item}</span>
                  </div>
                ))}
                <button className="text-[10px] text-[#00FA82] font-bold uppercase mt-2 w-full text-left flex items-center gap-1">
                  <ListChecks className="w-3 h-3" /> Editar 8 Elementos
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================
          PANEL DERECHO: RENDERIZADOR A4 (ESTILO VERTREX ORIGINAL)
          ========================================================= */}
      <div className="flex-1 bg-[#1A1A1A] flex flex-col relative overflow-hidden">
        
        {/* Toolbar del Visor PDF */}
        <div className="h-16 border-b border-border/20 bg-[#0A0A0A]/80 backdrop-blur-md flex items-center justify-between px-8 z-20 shrink-0 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-mono text-[#00FA82] font-bold">VISTA PREVIA EN VIVO</span>
              <span className="text-[10px] text-muted-foreground">{docState.code}.pdf</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 text-xs font-bold text-black bg-[#00FA82] hover:bg-[#00FA82]/90 rounded-none border border-[#00FA82] shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all flex items-center gap-2">
              <Download className="w-4 h-4" /> Exportar a PDF
            </button>
          </div>
        </div>

        {/* Canvas del PDF (Centrado y Scrolleable) */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 flex justify-center custom-scrollbar bg-[#1A1A1A]">
          
          {/* EL DOCUMENTO A4 EXACTO */}
          <div className="w-[210mm] min-h-[297mm] bg-[#F4F5F7] shadow-2xl shrink-0 text-gray-900 flex flex-col relative transform origin-top transition-all"
               style={{
                 backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.02) 1px, transparent 1px)',
                 backgroundSize: '20px 20px'
               }}>
            
            {/* HEADER EXACTO */}
            <header className="relative w-full h-[136px] flex justify-between items-center px-12 z-20 shrink-0">
              <div className="flex items-center gap-2 relative z-30 pt-2">
                <div className="w-20 h-20 bg-[#0A0A0A] flex flex-col items-center justify-center rounded">
                  <Zap className="w-8 h-8 text-[#00FA82]" />
                </div>
                <div className="flex flex-col ml-2">
                  <span className="text-3xl font-black tracking-tighter text-[#0A0A0A] leading-none">VERTREX</span>
                  <span className="text-[10px] font-bold text-gray-500 tracking-widest mt-1 uppercase">Desarrollo de Software</span>
                </div>
              </div>

              {/* Polígonos CSS */}
              <div className="absolute top-0 right-0 w-[55%] h-full bg-[#0A0A0A] z-10" style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}></div>
              <div className="absolute top-0 right-0 w-[55%] h-full bg-[#00FA82] translate-y-2 -translate-x-2 z-0 opacity-80" style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}></div>
              
              <div className="relative z-30 text-right font-mono text-[10px] leading-loose text-white pt-6 pr-2">
                <p className="flex justify-end gap-4"><span className="text-gray-400">FECHA:</span> <span>{docState.date}</span></p>
                <p className="flex justify-end gap-4"><span className="text-gray-400">CÓDIGO:</span> <span className="text-[#00FA82] font-bold">{docState.code}</span></p>
                <p className="flex justify-end gap-4"><span className="text-gray-400">CIUDAD:</span> <span className="font-bold">{docState.city}</span></p>
              </div>
            </header>

            {/* CUERPO DEL DOCUMENTO */}
            <main className="px-12 py-10 flex flex-col flex-1 z-10">
              
              {/* Bloque Destinatario */}
              <div className="mb-10 text-[13px]">
                <p className="font-semibold text-gray-800 mb-1">Señores:</p>
                <h2 className="font-black text-2xl text-[#0A0A0A] uppercase tracking-tight">{docState.client.name}</h2>
                <div className="mt-3 text-gray-800 space-y-1">
                  <p><span className="font-bold text-gray-500 w-24 inline-block">NIT:</span> {docState.client.nit}</p>
                  <p><span className="font-bold text-gray-500 w-24 inline-block">Dirección:</span> {docState.client.address}</p>
                  <p><span className="font-bold text-gray-500 w-24 inline-block">Teléfono:</span> {docState.client.phone}</p>
                  <p><span className="font-bold text-gray-500 w-24 inline-block">Correo:</span> {docState.client.email}</p>
                </div>
              </div>

              {/* Asunto */}
              <div className="mb-8 border-l-4 border-[#0A0A0A] pl-5 py-2 bg-white shadow-sm">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Asunto:</p>
                <h1 className="text-lg font-bold text-[#0A0A0A] tracking-tight leading-snug">{docState.subject}</h1>
              </div>

              {/* Texto Base */}
              <div className="space-y-4 text-gray-900 leading-relaxed text-[14px] text-justify">
                <p>Cordial saludo,</p>
                <p>Por medio del presente documento, nosotros, en calidad de desarrolladores independientes bajo la marca comercial <strong className="font-bold text-[#0A0A0A]">Vertrex</strong>, nos permitimos presentar formalmente la propuesta de desarrollo e implementación de una solución tecnológica integral para su negocio.</p>
                <p>El proyecto consiste en el diseño, desarrollo e implementación de una plataforma web completa que permitirá optimizar y digitalizar los procesos comerciales y operativos de <strong className="font-bold text-[#0A0A0A]">{docState.client.name}</strong>, incluyendo la siguiente arquitectura tecnológica:</p>

                {/* Grid de Características / Alcance */}
                <div className="bg-white border border-gray-300 p-6 rounded shadow-sm border-t-4 border-t-[#0A0A0A] my-8">
                  <p className="font-bold text-[13px] text-[#0A0A0A] mb-4 uppercase tracking-wider border-b border-gray-200 pb-2">Alcance del Proyecto</p>
                  <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-[13px] text-gray-800 font-medium">
                    {docState.scope.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#0A0A0A] font-black mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Firma */}
              <div className="mt-auto pt-12 pb-4">
                <p className="block w-full text-[14px] text-gray-900 mb-16 font-medium">Atentamente,</p>
                <div className="w-[300px]">
                  <div className="w-[200px] border-b border-gray-800 mb-4 relative">
                    <FileSignature className="w-12 h-12 text-[#0A0A0A] absolute bottom-1 right-4 opacity-20" />
                  </div>
                  <h3 className="font-black text-[#0A0A0A] tracking-tight text-lg uppercase">Manuel A. Villanueva</h3>
                  <p className="text-xs font-bold text-gray-600 mt-1 mb-2">Representante de Vertrex</p>
                  <div className="text-[11px] text-gray-700 space-y-1 font-mono">
                    <p><span className="font-bold text-gray-500">C.C:</span> 1077720099</p>
                    <p><span className="font-bold text-gray-500">Tel:</span> 3209586388</p>
                  </div>
                </div>
              </div>

            </main>

            {/* FOOTER EXACTO */}
            <footer className="bg-[#0A0A0A] text-white shrink-0 z-20">
              <div className="h-1.5 w-full bg-[#00FA82]"></div>
              <div className="px-12 py-8 flex justify-between items-center text-xs">
                <div className="flex flex-col gap-1 text-gray-400">
                  <p className="flex items-center gap-2 text-white font-black tracking-widest mb-1 text-sm">
                    VERTREX
                  </p>
                  <p className="font-mono">Neiva, Huila - Colombia</p>
                </div>
                
                <div className="flex flex-col items-end gap-2 text-gray-400 font-mono text-[10px]">
                  <a href="#" className="hover:text-[#00FA82] transition-colors">vertrexsc@gmail.com</a>
                  <a href="#" className="hover:text-[#00FA82] transition-colors">+57 320 207 0445</a>
                  <a href="#" className="hover:text-[#00FA82] transition-colors">@vertrexsc</a>
                </div>
              </div>
            </footer>

          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTES DE UI
// ==========================================

function VtxInput({
  label,
  value,
  onChange,
  isTextArea,
}: {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isTextArea?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{label}</label>
      {isTextArea ? (
        <textarea 
          value={value}
          onChange={onChange}
          className="w-full bg-[#111] border border-[#222] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#00FA82] transition-colors resize-none h-16 font-sans"
        />
      ) : (
        <input 
          type="text" 
          value={value}
          onChange={onChange}
          className="w-full bg-[#111] border border-[#222] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#00FA82] transition-colors font-sans"
        />
      )}
    </div>
  );
}