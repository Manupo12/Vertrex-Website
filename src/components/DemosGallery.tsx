'use client'

import { demos } from '@/lib/demos-data'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { ScrollAnimationWrapper } from '@/components/ScrollAnimationWrapper'

// Componente para cada tarjeta de demo en la galería
const DemoCard = ({ demo }: { demo: typeof demos[0] }) => {
  const [activeView, setActiveView] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 overflow-hidden h-full transition-all duration-300 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10">
      <div className="p-4 bg-background">
        {activeView === 'desktop' ? (
          <div className="rounded-md border-2 border-neutral-800 bg-neutral-900 p-1">
            <div className="p-1 bg-neutral-800 rounded-sm">
              <video src={demo.videoDesktop} autoPlay loop muted playsInline className="w-full h-full rounded-sm aspect-video" />
            </div>
          </div>
        ) : (
          <div className="flex justify-center p-4">
            <div className="w-full max-w-[200px] rounded-[24px] border-4 border-neutral-800 bg-black p-1">
              <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[18px]">
                <video src={demo.videoMobile} autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover" />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col p-6 pt-4 flex-grow">
        <div>
          <p className="text-sm font-semibold text-primary">{demo.businessType}</p>
          <h3 className="mt-1 font-display text-xl font-bold text-secondary">{demo.businessName}</h3>
        </div>
        <div className="mt-auto pt-4 flex items-center gap-2">
          <button onClick={() => setActiveView('desktop')} className={`px-3 py-1.5 text-xs rounded-md font-semibold transition ${activeView === 'desktop' ? 'bg-primary text-background' : 'bg-white/10 hover:bg-white/20'}`}>Escritorio</button>
          <button onClick={() => setActiveView('mobile')} className={`px-3 py-1.5 text-xs rounded-md font-semibold transition ${activeView === 'mobile' ? 'bg-primary text-background' : 'bg-white/10 hover:bg-white/20'}`}>Móvil</button>
        </div>
      </div>
    </div>
  )
}

export default function DemosGallery() {
  // Ordenamos las demos por fecha, de la más nueva a la más vieja
  const sortedDemos = [...demos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {sortedDemos.map((demo, index) => (
            <ScrollAnimationWrapper key={index} delay={index * 0.1}>
                <DemoCard demo={demo} />
            </ScrollAnimationWrapper>
        ))}
      </div>
  )
}