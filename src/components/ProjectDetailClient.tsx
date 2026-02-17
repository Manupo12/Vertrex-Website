'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

// Iconos
import {
    HiArrowLeft,
    HiOutlineComputerDesktop,
    HiOutlineDevicePhoneMobile,
    HiOutlineCalendar,
    HiOutlineUserGroup,
    HiCheckCircle,
    HiOutlineCodeBracketSquare,
    HiOutlineCubeTransparent,
    HiOutlineSparkles
} from 'react-icons/hi2'
import { FaGithub, FaWhatsapp, FaExternalLinkAlt, FaTag } from 'react-icons/fa'

// Importamos la interfaz del tipo de dato
import { Project } from '@/lib/projects-data'

export default function ProjectDetailClient({ project }: { project: Project }) {
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop');

  // Colores y estilos dinámicos
  const gradientColor = project.color || "from-primary/20 to-emerald-500/20";
  const accentColorClass = project.accent || "text-primary";
    // Robust image sources (support different project shapes)
    const desktopImage = project.images?.desktop ?? project.coverImage ?? project.galleryImages?.[0]?.imageUrl ?? '/images/proximamente.jpeg';
    const mobileImage = project.images?.mobile ?? project.coverImage ?? project.galleryImages?.[1]?.imageUrl ?? desktopImage;
  
    // Animaciones variantes
        const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    })
  };

  return (
    <main className="min-h-screen bg-neutral-950 selection:bg-primary selection:text-background pb-32 relative overflow-x-hidden">
      
      {/* FONDOS AMBIENTALES GLOBALES */}
      <div className="fixed inset-0 pointer-events-none">
          <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-r ${gradientColor} opacity-10 blur-[150px] rounded-full`}></div>
          <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gradient-to-l ${gradientColor} opacity-5 blur-[180px] rounded-full`}></div>
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay"></div> {/* Opcional: textura de ruido */}
      </div>

      {/* --- NAVEGACIÓN FLOTANTE MINIMALISTA --- */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
        className="fixed top-8 left-8 z-50"
      >
        <Link 
            href="/portafolio" 
            className="group flex items-center gap-3 px-4 py-2 rounded-full bg-neutral-900/50 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-neutral-800 hover:border-white/30 transition-all shadow-lg"
        >
            <HiArrowLeft className="group-hover:-translate-x-1 transition-transform text-lg"/>
            <span className="text-sm font-medium tracking-wide">Portafolio</span>
        </Link>
      </motion.div>

      {/* --- HERO & VISUALIZADOR CENTRAL --- */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center relative z-10 mb-16">
            
            {/* Metadata Superior */}
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={0} className="flex items-center justify-center gap-4 mb-6">
                <span className={`px-4 py-1.5 rounded-full border border-white/5 bg-white/5 ${accentColorClass} text-xs font-bold uppercase tracking-widest backdrop-blur-sm flex items-center gap-2`}>
                    <HiOutlineCubeTransparent className="text-lg"/> {project.category}
                </span>
                {project.year && (
                    <span className="text-neutral-500 text-sm font-mono border-l border-white/10 pl-4">{project.year}</span>
                )}
            </motion.div>
            
            {/* Título Gigante */}
            <motion.h1 
                variants={fadeInUp} initial="hidden" animate="visible" custom={1}
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-white font-display leading-none tracking-tight mb-6"
            >
                {project.title}
            </motion.h1>
            
            {/* Subtítulo */}
            <motion.p 
                variants={fadeInUp} initial="hidden" animate="visible" custom={2}
                className="text-xl md:text-3xl text-neutral-400 font-medium max-w-3xl mx-auto leading-relaxed"
            >
                {project.subtitle}
            </motion.p>

            {/* Links de Acción */}
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={3} className="flex items-center justify-center gap-4 mt-10">
                <a href={project.link} target="_blank" rel="noreferrer" className={`group flex items-center gap-3 px-8 py-4 rounded-full font-bold text-black bg-white hover:bg-neutral-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] hover:scale-105`}>
                    Visitar Live Site <FaExternalLinkAlt className="text-lg group-hover:rotate-45 transition-transform duration-300" />
                </a>
                {project.repoLink && (
                    <a href={project.repoLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-8 py-4 rounded-full border border-white/10 bg-neutral-900/50 text-white hover:bg-white hover:text-black transition-all backdrop-blur-md font-medium">
                        <FaGithub className="text-xl" /> Código
                    </a>
                )}
            </motion.div>
        </div>

        {/* === EL VISUALIZADOR FLOTANTE (THE STAGE) === */}
        <motion.div 
            initial={{ opacity: 0, y: 60, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="relative max-w-6xl mx-auto"
        >
            {/* Glow Intenso detrás del dispositivo */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-r ${gradientColor} opacity-30 blur-[120px] -z-10 rounded-full transition-opacity duration-1000`}></div>

             {/* Controles de Vista Flotantes Centrados */}
            <div className="flex justify-center mb-8">
                <div className="inline-flex gap-1 bg-neutral-900/80 backdrop-blur-xl p-1.5 rounded-full border border-white/10 shadow-2xl">
                    <button 
                        onClick={() => setView('desktop')} 
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${view === 'desktop' ? 'bg-white text-black shadow-lg' : 'text-white/50 hover:text-white'}`}
                    >
                        <HiOutlineComputerDesktop className="text-lg" /> Escritorio
                    </button>
                    <button 
                        onClick={() => setView('mobile')} 
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${view === 'mobile' ? 'bg-white text-black shadow-lg' : 'text-white/50 hover:text-white'}`}
                    >
                        <HiOutlineDevicePhoneMobile className="text-lg" /> Móvil
                    </button>
                </div>
            </div>

            {/* Área de Renderizado del Dispositivo */}
            <div className="w-full flex justify-center items-center min-h-[400px] lg:min-h-[600px] perspective-1000">
                <AnimatePresence mode="wait">
                    {view === 'desktop' ? (
                        <motion.div 
                            key="desktop"
                            initial={{ opacity: 0, rotateX: 10, y: 40 }} animate={{ opacity: 1, rotateX: 0, y: 0 }} exit={{ opacity: 0, rotateX: -10, y: 40 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="w-full aspect-[16/10] bg-neutral-950 rounded-2xl border-[6px] border-neutral-900 shadow-2xl overflow-hidden relative group hover:scale-[1.01] transition-transform duration-500"
                        >
                            {/* Barra Navegador Simulada Estilo macOS Dark */}
                            <div className="h-10 bg-[#1a1a1a] flex items-center px-4 gap-2 relative z-10 border-b border-white/5">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]"/>
                                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"/>
                                    <div className="w-3 h-3 rounded-full bg-[#27c93f]"/>
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-1/3 h-6 bg-[#2a2a2a] rounded-md text-neutral-500 text-xs font-mono overflow-hidden px-2">
                                    <HiCheckCircle className="mr-1 text-emerald-500"/> {project.link.replace('https://', '')}
                                </div>
                            </div>
                            {/* Imagen con Scroll */}
                            <div className="relative w-full h-full overflow-y-auto custom-scrollbar bg-neutral-950">
                                <Image 
                                    src={desktopImage} 
                                    alt={`${project.title} Desktop View`} 
                                    width={1920} height={1080} 
                                    className="w-full h-auto" priority
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="mobile"
                            initial={{ opacity: 0, scale: 0.85, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.85, y: 40 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="relative w-[320px] md:w-[360px] aspect-[9/19] bg-black rounded-[3.5rem] border-[10px] border-neutral-900 shadow-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-500"
                        >
                            {/* Dynamic Island / Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-b-3xl z-20 flex items-center justify-center">
                                <div className="w-16 h-1.5 bg-neutral-800 rounded-full"></div>
                            </div>
                            {/* Barra Status iOS */}
                            <div className="absolute top-0 inset-x-0 h-12 bg-black/80 backdrop-blur-sm z-10 flex justify-between items-center px-6 pt-2 text-white text-xs font-medium">
                                <span>9:41</span>
                                <div className="flex gap-1">
                                    <div className="w-4 h-3 bg-white rounded-sm"></div><div className="w-0.5 h-3 bg-white rounded-sm"></div>
                                </div>
                            </div>
                            <div className="relative w-full h-full overflow-y-auto custom-scrollbar no-scrollbar bg-neutral-900 pt-12">
                                <Image 
                                    src={mobileImage} 
                                    alt={`${project.title} Mobile View`} 
                                    width={1080} height={1920} 
                                    className="w-full h-auto" priority
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
      </section>

      {/* --- BARRA DE ESPECIFICACIONES TÉCNICAS (Estilo Apple Specs) --- */}
      <section className="border-y border-white/5 bg-neutral-900/30 backdrop-blur-sm py-10">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x divide-white/5 text-center">
              <div className="px-4">
                  <HiOutlineUserGroup className={`text-2xl mb-3 mx-auto ${accentColorClass}`}/>
                  <p className="text-xs text-neutral-500 uppercase font-bold tracking-widest mb-1">Cliente / Tipo</p>
                  <p className="text-white font-bold text-lg">{project.client || 'Confidencial'}</p>
              </div>
              <div className="px-4 border-l border-white/5">
                  <HiOutlineCalendar className={`text-2xl mb-3 mx-auto ${accentColorClass}`}/>
                  <p className="text-xs text-neutral-500 uppercase font-bold tracking-widest mb-1">Año</p>
                  <p className="text-white font-bold text-lg">{project.year || 'N/A'}</p>
              </div>
              <div className="px-4 border-l border-white/5">
                  <HiOutlineCodeBracketSquare className={`text-2xl mb-3 mx-auto ${accentColorClass}`}/>
                  <p className="text-xs text-neutral-500 uppercase font-bold tracking-widest mb-1">Core Stack</p>
                  <p className="text-white font-bold text-lg truncate">{project.stack?.[0] || 'Next.js'}</p>
              </div>
              <div className="px-4 border-l border-white/5">
                  <FaTag className={`text-2xl mb-3 mx-auto ${accentColorClass}`}/>
                  <p className="text-xs text-neutral-500 uppercase font-bold tracking-widest mb-1">Categoría</p>
                  <p className="text-white font-bold text-lg truncate">{project.tags?.[0] || 'Web App'}</p>
              </div>
          </div>
      </section>

      {/* --- NARRATIVA Y FEATURES (Contenido Centralizado) --- */}
      <section className="max-w-4xl mx-auto px-6 mt-24">
        
        {/* Narrativa Principal */}
        <div className="mb-20">
            <h3 className="text-sm text-neutral-500 font-bold uppercase tracking-widest mb-6 flex items-center gap-2 before:w-8 before:h-px before:bg-neutral-700 after:w-full after:h-px after:bg-neutral-700">
                <span className="whitespace-nowrap">La Historia</span>
            </h3>
            <div className="prose prose-invert prose-xl md:prose-2xl text-neutral-300 leading-relaxed font-serif max-w-none first-letter:text-5xl first-letter:font-bold first-letter:text-white first-letter:mr-3 first-letter:float-left">
                <p>{project.description}</p>
            </div>
        </div>

        {/* Stack Completo (Tags) */}
        {project.stack && (
             <div className="mb-20 text-center">
                <h3 className="text-sm text-neutral-500 font-bold uppercase tracking-widest mb-6">Stack Tecnológico Completo</h3>
                <div className="flex flex-wrap justify-center gap-3">
                    {project.stack.map(tech => (
                        <span key={tech} className="px-4 py-2 rounded-lg bg-neutral-900 border border-white/10 text-sm text-white font-mono">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        )}

        {/* Grid de Features (Diseño más limpio) */}
        <div>
            <h3 className="text-sm text-neutral-500 font-bold uppercase tracking-widest mb-10 text-center flex items-center justify-center gap-2 before:w-12 before:h-px before:bg-neutral-700 after:w-12 after:h-px after:bg-neutral-700">
                <span className="whitespace-nowrap flex items-center gap-2"><HiOutlineSparkles className={accentColorClass}/> Highlights</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {project.features.map((feature, idx) => (
                    <div 
                        key={idx} 
                        className="group p-8 rounded-3xl bg-neutral-900/50 border border-white/5 hover:border-white/20 transition-all hover:bg-neutral-900 flex flex-col items-center text-center"
                    >
                        <div className={`mb-6 p-4 rounded-2xl bg-white/5 ${accentColorClass} text-3xl group-hover:scale-110 transition-transform shadow-lg shadow-black/20 border border-white/5`}>
                            {feature.icon}
                        </div>
                        <h4 className="text-white font-bold text-lg mb-3">{feature.text}</h4>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                            {feature.detail || "Funcionalidad clave diseñada para alto rendimiento y experiencia de usuario óptima."}
                        </p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- BANNER FINAL CTA --- */}
      <section className="mt-32 px-6">
          <div className="max-w-5xl mx-auto relative overflow-hidden rounded-[3rem] border border-white/10">
              <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-20`}></div>
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay"></div>
              
              <div className="relative z-10 p-12 md:p-24 text-center">
                  <h2 className="text-3xl md:text-5xl font-bold text-white font-display mb-6 leading-tight">
                      ¿Listo para construir<br/> tu próximo caso de éxito?
                  </h2>
                  <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
                      Llevamos la misma ingeniería y pasión a cada proyecto. Hablemos de tu visión.
                  </p>
                  <Link 
                    href="https://wa.me/573000000000" 
                    target="_blank"
                    className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform shadow-xl hover:shadow-2xl"
                >
                    <FaWhatsapp className="text-2xl text-green-500"/> Iniciar Conversación
                  </Link>
              </div>
          </div>
      </section>

      {/* FOOTER SIMPLE */}
      <footer className="mt-20 py-8 text-center text-neutral-600 text-sm border-t border-white/5">
          <p>© {new Date().getFullYear()} Vertrex Engineering. Todos los derechos reservados.</p>
      </footer>

    </main>
  )
}