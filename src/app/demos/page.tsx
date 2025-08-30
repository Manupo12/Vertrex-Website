'use client'

import { demos } from '@/lib/demos-data'
// 1. IMPORTAMOS 'Variants' JUNTO AL RESTO
import { motion, AnimatePresence, Variants } from 'framer-motion' 
import React, { useState } from 'react'
import { ScrollAnimationWrapper } from '@/components/ScrollAnimationWrapper'

// --- Componente de Tarjeta de Demo (ACTUALIZADO CON EL TIPO CORRECTO) ---
const DemoCard = ({ demo, activeView }: { demo: typeof demos[0]; activeView: 'desktop' | 'mobile' }) => {

  // 2. AÑADIMOS LA ANOTACIÓN DE TIPO ': Variants'
  const viewVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 overflow-hidden h-full">
      <div className="p-4 bg-background">
        <AnimatePresence mode="wait">
          {activeView === 'desktop' ? (
            <motion.div
              key="desktop"
              variants={viewVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="rounded-md border-2 border-neutral-800 bg-neutral-900 p-1">
                <div className="p-1 bg-neutral-800 rounded-sm">
                  <video src={demo.videoDesktop} autoPlay loop muted playsInline className="w-full h-full rounded-sm aspect-video" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="mobile"
              variants={viewVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex justify-center p-4"
            >
              <div className="w-full max-w-[200px] rounded-[24px] border-4 border-neutral-800 bg-black p-1">
                <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[18px]">
                  <video src={demo.videoMobile} autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex flex-col p-6 pt-4 flex-grow">
          <p className="text-sm font-semibold text-primary">{demo.businessType}</p>
          <h3 className="mt-1 font-display text-xl font-bold text-secondary">{demo.businessName}</h3>
      </div>
    </div>
  )
}

export default function DemosPage() {
  const [galleryView, setGalleryView] = useState<'desktop' | 'mobile'>('desktop');
  const sortedDemos = [...demos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-28 pb-16 sm:pt-32">
      <ScrollAnimationWrapper className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl font-display">
          Galería de Demos
        </h1>
        <p className="mt-6 text-lg leading-8 text-foreground/80">
          Explora algunas de las demos visuales que hemos construido. Cada una es un borrador funcional que personalizamos junto al cliente hasta alcanzar la visión perfecta.
        </p>
      </ScrollAnimationWrapper>
      
      <div className="mt-16 mb-8 flex justify-center items-center gap-2">
          <p className="text-sm font-semibold text-foreground/80 mr-2">Ver como:</p>
          <button onClick={() => setGalleryView('desktop')} className={`px-4 py-2 text-sm rounded-md font-semibold transition ${galleryView === 'desktop' ? 'bg-primary text-background' : 'bg-white/10 hover:bg-white/20'}`}>Escritorio</button>
          <button onClick={() => setGalleryView('mobile')} className={`px-4 py-2 text-sm rounded-md font-semibold transition ${galleryView === 'mobile' ? 'bg-primary text-background' : 'bg-white/10 hover:bg-white/20'}`}>Móvil</button>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 items-start">
        {sortedDemos.map((demo, index) => (
            <ScrollAnimationWrapper key={index} delay={index * 0.1}>
                <DemoCard demo={demo} activeView={galleryView} />
            </ScrollAnimationWrapper>
        ))}
      </div>
    </div>
  )
}