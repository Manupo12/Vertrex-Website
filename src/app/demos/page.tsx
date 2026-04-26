'use client'

// Página de demos: presenta demostraciones navegables para mostrar capacidades antes de una venta.

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { demos } from '@/lib/demos-data'
import type { DemoVariant } from '@/lib/demos-data'

import {
    HiOutlineComputerDesktop,
    HiOutlineDevicePhoneMobile,
    HiOutlineSparkles,
    HiArrowRight,
    HiOutlinePlay,
    HiChevronLeft,
    HiChevronRight
} from 'react-icons/hi2'
import { FaInstagram } from 'react-icons/fa'

export default function DemosPage() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [view, setView] = useState<'desktop' | 'mobile'>('desktop')
    const [activeVariantIndex, setActiveVariantIndex] = useState(0)

    if (!demos || demos.length === 0) return null

    const nextDemo = () => {
        setCurrentIndex((prev) => (prev + 1) % demos.length)
        setView('desktop')
        setActiveVariantIndex(0)
    }

    const prevDemo = () => {
        setCurrentIndex((prev) => (prev - 1 + demos.length) % demos.length)
        setView('desktop')
        setActiveVariantIndex(0)
    }

    const demo = demos[currentIndex]
    const variant: DemoVariant = demo.variants[activeVariantIndex]

    return (
        <main className="bg-background selection:bg-primary selection:text-background">
            <section className="pt-32 pb-24 bg-neutral-950 relative border-t border-white/5">
                <div className="absolute right-0 top-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="mb-16 flex flex-col md:flex-row items-end justify-between gap-6 border-b border-white/5 pb-8">
                        <div className="max-w-3xl">
                            <span className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs mb-3">
                                <HiOutlineSparkles className="w-4 h-4 animate-pulse" /> Demos Interactivas
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white tracking-tight">Sistemas en Acción</h1>
                            <p className="mt-4 text-neutral-400 text-lg">
                                Sumérgete en nuestros prototipos. Explora cómo transformamos problemas complejos en interfaces intuitivas y descubre la próxima herramienta para potenciar tu negocio.
                            </p>
                        </div>

                        <div className="flex items-center gap-6 bg-black/40 p-2 rounded-full border border-white/10">
                            <span className="text-sm font-mono text-neutral-500 font-bold pl-4">
                                <span className="text-white">{String(currentIndex + 1).padStart(2, '0')}</span> / {String(demos.length).padStart(2, '0')}
                            </span>
                            <div className="flex gap-1">
                                <button onClick={prevDemo} className="p-3 rounded-full hover:bg-white/10 transition-all text-white"><HiChevronLeft size={20} /></button>
                                <button onClick={nextDemo} className="p-3 rounded-full hover:bg-white/10 transition-all text-white"><HiChevronRight size={20} /></button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16 relative">
                        <div className="w-full lg:w-1/2 flex flex-col gap-10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="flex flex-col gap-10"
                                >
                                    <div>
                                        <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-4">
                                            {demo.businessType}
                                        </div>
                                        <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-display leading-tight">{demo.businessName}</h3>
                                        <p className="text-lg leading-relaxed text-neutral-300">{demo.businessDescription}</p>
                                    </div>

                                    <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 border-l-2 border-l-primary p-6 lg:p-8 rounded-2xl relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                        <div className="relative z-10">
                                            <strong className="text-primary flex items-center gap-2 mb-3 uppercase tracking-widest text-xs font-bold">
                                                <HiOutlineSparkles className="w-4 h-4" /> El Concepto Vertrex
                                            </strong>
                                            <p className="text-base leading-relaxed text-neutral-300 mb-4">{demo.vertrexConcept}</p>
                                            <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">
                                                * Prototipo proactivo diseñado para @{demo.businessName.replace(/\s+/g, '').toLowerCase()}.
                                            </p>
                                        </div>
                                    </div>

                                    {demo.variants.length > 0 && (
                                        <div className="bg-black/30 p-6 rounded-2xl border border-white/5">
                                            <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-4">Módulos del Sistema:</p>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {demo.variants.map((v: DemoVariant, idx: number) => (
                                                    <button
                                                        key={v.label}
                                                        onClick={() => setActiveVariantIndex(idx)}
                                                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                                                            activeVariantIndex === idx
                                                                ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(0,255,127,0.2)]'
                                                                : 'bg-white/5 text-neutral-400 border-white/5 hover:border-white/20 hover:text-white hover:bg-white/10'
                                                        }`}
                                                    >
                                                        {activeVariantIndex === idx && <HiOutlinePlay className="w-3 h-3" />}
                                                        {v.label}
                                                    </button>
                                                ))}
                                            </div>
                                            {variant.description && (
                                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                                    <p className="text-sm text-neutral-300 leading-relaxed">
                                                        <strong className="text-white font-bold mr-1">Viendo ahora:</strong>
                                                        {variant.description}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-6">
                                        {demo.keyBenefits && demo.keyBenefits.length > 0 && (
                                            <div>
                                                <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest flex items-center gap-3">
                                                    <span className="w-6 h-px bg-primary"></span> Beneficios Clave
                                                </h4>
                                                <ul className="flex flex-col gap-3">
                                                    {demo.keyBenefits.map((item: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-3 text-sm text-neutral-400 leading-relaxed">
                                                            <HiOutlineSparkles className="text-primary mt-1 shrink-0 w-4 h-4" /> {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                                            {demo.whatClientsSee && demo.whatClientsSee.length > 0 && (
                                                <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                                                    <h5 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                                                        <HiOutlineDevicePhoneMobile className="text-primary w-4 h-4" /> Experiencia del Cliente
                                                    </h5>
                                                    <ul className="flex flex-col gap-3">
                                                        {demo.whatClientsSee.map((item: string, i: number) => (
                                                            <li key={i} className="flex items-start gap-2 text-xs text-neutral-400 leading-relaxed">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 shrink-0"></div> {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {demo.whatPartnersManage && demo.whatPartnersManage.length > 0 && (
                                                <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                                                    <h5 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                                                        <HiOutlineComputerDesktop className="text-primary w-4 h-4" /> Panel Administrativo
                                                    </h5>
                                                    <ul className="flex flex-col gap-3">
                                                        {demo.whatPartnersManage.map((item: string, i: number) => (
                                                            <li key={i} className="flex items-start gap-2 text-xs text-neutral-400 leading-relaxed">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5 shrink-0"></div> {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-6 border-t border-white/10 pt-8 mt-4">
                                        <div className="flex flex-wrap gap-4">
                                            <Link href="/contacto" className="bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-primary hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                                Reclamar este Sistema <HiArrowRight />
                                            </Link>
                                        </div>
                                        <div className="flex items-center gap-4 text-neutral-500 text-sm">
                                            <span className="text-xs uppercase tracking-widest font-bold opacity-70">Conectar:</span>
                                            <div className="flex flex-wrap gap-4">
                                                <a href={demo.socials?.instagram || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary cursor-pointer transition-colors"><FaInstagram /> @{demo.businessName.replace(/\s+/g, '').toLowerCase()}</a>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="w-full lg:w-1/2 lg:sticky lg:top-32 relative h-[500px] lg:h-[700px] flex items-center justify-center rounded-[3rem] bg-black/20 border border-white/5 p-4 lg:p-8">
                            <div className="absolute top-6 right-6 z-30 bg-black/80 backdrop-blur-md p-1.5 rounded-full border border-white/10 flex gap-2 shadow-xl">
                                <button onClick={() => setView('desktop')} className={`p-2.5 rounded-full transition-all duration-300 ${view === 'desktop' ? 'bg-primary text-black scale-105' : 'text-white/50 hover:text-white'}`}><HiOutlineComputerDesktop className="w-5 h-5" /></button>
                                <button onClick={() => setView('mobile')} className={`p-2.5 rounded-full transition-all duration-300 ${view === 'mobile' ? 'bg-primary text-black scale-105' : 'text-white/50 hover:text-white'}`}><HiOutlineDevicePhoneMobile className="w-5 h-5" /></button>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div key={`${currentIndex}-${activeVariantIndex}-${view}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }} className="relative w-full h-full flex items-center justify-center">
                                    {view === 'desktop' ? (
                                        <div className="w-full aspect-video bg-neutral-900 rounded-xl md:rounded-2xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden relative group">
                                            <div className="absolute top-0 left-0 right-0 h-6 md:h-8 bg-neutral-950 border-b border-white/5 flex items-center px-4 gap-2 z-20">
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
                                                <div className="ml-4 w-1/3 h-4 bg-white/5 rounded-full hidden sm:block"></div>
                                            </div>
                                            <div className="pt-6 md:pt-8 h-full"><video key={variant.videoDesktop} src={variant.videoDesktop} className="w-full h-full object-cover" muted loop autoPlay playsInline /></div>
                                        </div>
                                    ) : (
                                        <div className="relative z-10 w-[240px] sm:w-[320px] aspect-[9/19] bg-black rounded-[3rem] border-[8px] border-neutral-800 shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden">
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-neutral-900 rounded-b-xl z-20"></div>
                                            <video key={variant.videoMobile} src={variant.videoMobile} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}