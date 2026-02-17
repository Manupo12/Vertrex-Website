'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { demos } from '@/lib/demos-data' // Asegúrate de que esta ruta existe
import type { Demo, DemoVariant } from '@/lib/demos-data'

// Iconos
import { 
  HiOutlineComputerDesktop, 
  HiOutlineDevicePhoneMobile,
  HiOutlineSparkles,
  HiArrowRight,
  HiOutlineLightBulb,
    HiOutlinePlay
} from 'react-icons/hi2'
import { FaInstagram, FaFacebookF, FaGlobe, FaWhatsapp } from 'react-icons/fa'

// --- COMPONENTE INTERNO: DEMO ITEM (Tarjeta Individual) ---
const DemoItem = ({ demo, index }: { demo: Demo; index: number }) => {
    const [view, setView] = useState<'desktop' | 'mobile'>('desktop');
    const [activeVariant, setActiveVariant] = useState<DemoVariant>(demo.variants[0]);

    // Alternar lado de la imagen según índice (Zig-Zag)
    const isEven = index % 2 === 0;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative bg-neutral-900/40 border border-white/5 rounded-[3rem] overflow-hidden"
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 p-8 lg:p-12 items-center">
                
                {/* --- COLUMNA DE INFORMACIÓN --- */}
                <div className={`lg:col-span-5 flex flex-col gap-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    
                    {/* Header */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider mb-4">
                            <HiOutlineLightBulb className="text-sm"/> {demo.businessType}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white font-display leading-tight">
                            {demo.businessName}
                        </h2>
                    </div>

                    {/* Disclaimer / Pitch Box */}
                    <div className="bg-neutral-950/50 border-l-4 border-primary p-5 rounded-r-xl backdrop-blur-sm relative overflow-hidden">
                        {/* Brillo sutil animado */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50"></div>
                        
                        <p className="text-sm text-neutral-400 leading-relaxed relative z-10">
                            <strong className="text-white block mb-1 text-xs uppercase tracking-wide">Concepto de Diseño Proactivo</strong>
                            Visualizado por <strong>Vertrex</strong> para <span className="text-white font-semibold">@{demo.businessName.replace(/\s+/g, '').toLowerCase()}</span>. 
                            Este es un ejercicio de ingeniería creado para captar la atención de la marca. 
                            <span className="block mt-2 text-primary/80 italic">Disponible para desarrollo y personalización inmediata.</span>
                        </p>
                    </div>

                    {/* Selector de Variantes (Si tiene más de una) */}
                    {demo.variants.length > 1 && (
                        <div className="flex flex-wrap gap-2">
                            <span className="text-xs text-neutral-500 uppercase font-bold tracking-wider w-full mb-1">Explorar Vistas:</span>
                            {demo.variants.map((variant: DemoVariant) => (
                                <button
                                    key={variant.label}
                                    onClick={() => setActiveVariant(variant)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 ${
                                        activeVariant.label === variant.label
                                        ? 'bg-white text-black border-white'
                                        : 'bg-transparent text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'
                                    }`}
                                >
                                    <HiOutlinePlay className="w-3 h-3"/> {variant.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Barra de Redes Sociales Simulada */}
                    <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                        <div className="flex gap-4 text-neutral-500">
                            <FaInstagram className="hover:text-primary cursor-pointer transition-colors" />
                            <FaGlobe className="hover:text-primary cursor-pointer transition-colors" />
                            <FaFacebookF className="hover:text-primary cursor-pointer transition-colors" />
                        </div>
                        <Link 
                            href="/contacto" 
                            className="ml-auto flex items-center gap-2 text-white font-bold text-sm hover:text-primary transition-colors group/link"
                        >
                            Reclamar Diseño <HiArrowRight className="group-hover/link:translate-x-1 transition-transform"/>
                        </Link>
                    </div>
                </div>

                {/* --- COLUMNA VISUALIZADOR (STAGE) --- */}
                <div className={`lg:col-span-7 h-[450px] lg:h-[600px] relative flex flex-col items-center justify-center bg-neutral-900/50 rounded-[2.5rem] border border-white/5 overflow-hidden ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    
                    {/* Fondo Ambiental */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-20 pointer-events-none"></div>

                    {/* Controles de Vista Flotantes */}
                    <div className="absolute top-6 right-6 z-30 flex gap-2 bg-black/60 backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-xl">
                        <button 
                            onClick={() => setView('desktop')} 
                            className={`p-2.5 rounded-full transition-all duration-300 ${view === 'desktop' ? 'bg-white text-black scale-105' : 'text-white/50 hover:text-white'}`}
                            title="Vista Escritorio"
                        >
                            <HiOutlineComputerDesktop size={18} />
                        </button>
                        <button 
                            onClick={() => setView('mobile')} 
                            className={`p-2.5 rounded-full transition-all duration-300 ${view === 'mobile' ? 'bg-white text-black scale-105' : 'text-white/50 hover:text-white'}`}
                            title="Vista Móvil"
                        >
                            <HiOutlineDevicePhoneMobile size={18} />
                        </button>
                    </div>

                    {/* Renderizado del Video */}
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={`${activeVariant.label}-${view}`} // Key compuesta para forzar re-render al cambiar variante o vista
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="relative w-full h-full flex items-center justify-center p-8"
                        >
                            {view === 'desktop' ? (
                                // MARCO DESKTOP
                                <div className="w-full aspect-video max-w-2xl bg-neutral-950 rounded-xl border border-white/10 shadow-2xl overflow-hidden relative group/video">
                                    {/* Barra Browser */}
                                    <div className="h-8 bg-neutral-900 border-b border-white/5 flex items-center px-3 gap-1.5 absolute top-0 w-full z-10">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                                    </div>
                                    <video 
                                        src={activeVariant.videoDesktop} 
                                        className="w-full h-full object-cover pt-8" 
                                        muted loop autoPlay playsInline 
                                    />
                                </div>
                            ) : (
                                // MARCO MÓVIL
                                <div className="relative w-[240px] sm:w-[280px] aspect-[9/19] bg-black rounded-[3rem] border-[8px] border-neutral-800 shadow-2xl overflow-hidden">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-neutral-900 rounded-b-xl z-20"></div>
                                    <video 
                                        src={activeVariant.videoMobile} 
                                        className="w-full h-full object-cover" 
                                        muted loop autoPlay playsInline 
                                    />
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                </div>
            </div>
        </motion.div>
    )
}

// --- PÁGINA PRINCIPAL ---
export default function DemosPage() {
  // Ordenar demos por fecha si tuvieran campo fecha, si no, usa el orden del array
  const demosList = demos; 

  return (
    <main className="bg-background selection:bg-primary selection:text-background pb-32">
      
      {/* 1. HEADER */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="mx-auto max-w-4xl text-center relative z-10">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-primary text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md"
            >
                <HiOutlineSparkles /> Laboratorio Vertrex
            </motion.div>
            
            <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold tracking-tight text-white font-display leading-tight"
            >
              Galería de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">Conceptos</span>
            </motion.h1>
            
            <motion.p 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="mt-6 text-lg text-neutral-400 max-w-2xl mx-auto"
            >
              Explora nuestra biblioteca de prototipos de alta fidelidad. 
              Ideas proactivas listas para convertirse en el próximo caso de éxito de tu negocio.
            </motion.p>
        </div>
      </section>

      {/* 2. LISTA DE DEMOS (Diseño Vertical) */}
      <section className="mx-auto max-w-[1400px] px-4 md:px-6">
        <div className="flex flex-col gap-24">
            {demosList.map((demo, index) => (
                <DemoItem key={demo.businessName} demo={demo} index={index} />
            ))}
        </div>
      </section>

      {/* 3. CTA FINAL */}
      <section className="mt-32 text-center px-6">
        <div className="p-1 rounded-[2.5rem] bg-gradient-to-br from-neutral-800 to-black max-w-3xl mx-auto">
            <div className="bg-neutral-950 rounded-[2.4rem] p-12 border border-white/5">
                <h2 className="text-3xl font-bold text-white font-display mb-4">¿No encuentras tu industria?</h2>
                <p className="text-neutral-400 mb-8 max-w-xl mx-auto">
                    Podemos crear una demo conceptual personalizada para tu marca sin compromiso. Déjanos sorprenderte.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link href="https://wa.me/573000000000" target="_blank" className="inline-flex items-center justify-center gap-2 bg-primary text-black px-8 py-3.5 rounded-full font-bold text-lg hover:shadow-[0_0_30px_theme(colors.primary.DEFAULT)] transition-all">
                        <FaWhatsapp size={22}/> Solicitar Demo
                    </Link>
                </div>
            </div>
        </div>
      </section>

    </main>
  )
}