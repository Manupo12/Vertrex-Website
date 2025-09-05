'use client'

// Importaciones: datos de demos, utilidades de animación y React
import { demos, Demo } from '@/lib/demos-data'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import React, { useState } from 'react'
import { ScrollAnimationWrapper } from '@/components/ScrollAnimationWrapper'

// ---------------------------------------------------------------------------
// Componente: DemoCard
// Descripción: tarjeta reutilizable que muestra una demo visual (video) en dos vistas
// (escritorio o móvil). Incluye selección de variantes de video y animaciones
// al cambiar la vista o la variante.
// ---------------------------------------------------------------------------
const DemoCard = ({ demo }: { demo: Demo }) => {
  // activeView: controla si se muestra la versión 'desktop' o 'mobile' del demo
  const [activeView, setActiveView] = useState<'desktop' | 'mobile'>('desktop');
  // activeVariant: guarda la variante de video actualmente seleccionada
  // (cada demo puede tener varias variantes, p. ej. Principal, Lunes, Martes, etc.)
  const [activeVariant, setActiveVariant] = useState(demo.variants[0]);

  // Variantes de animación para la vista del video (entrada, visible, salida)
  const viewVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 overflow-hidden h-full transition-all duration-300 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10">
      {/* Contenedor del área visual (video) */}
      <div className="p-4 bg-background">
        {/* AnimatePresence + motion.div permiten animar el cambio entre variantes y vistas */}
        <AnimatePresence mode="wait">
            <motion.div
                // La key incluye la variante y la vista para forzar la animación al cambiar cualquiera
                key={`${activeVariant.label}-${activeView}`}
                variants={viewVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                {activeView === 'desktop' ? (
                    // Vista de escritorio: video con aspecto estándar
                    <div className="rounded-md border-2 border-neutral-800 bg-neutral-900 p-1">
                        <div className="p-1 bg-neutral-800 rounded-sm">
                            <video src={activeVariant.videoDesktop} autoPlay loop muted playsInline className="w-full h-full rounded-sm aspect-video" />
                        </div>
                    </div>
                ) : (
                    // Vista móvil: video con marco de móvil y ratio vertical
                    <div className="flex justify-center p-4">
                        <div className="w-full max-w-[200px] rounded-[24px] border-4 border-neutral-800 bg-black p-1">
                            <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[18px]">
                                <video src={activeVariant.videoMobile} autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
      </div>

      {/* Contenido de texto: tipo de negocio, nombre y opciones de variante */}
      <div className="flex flex-col p-6 pt-4 flex-grow">
          {/* Tipo de negocio (etiqueta pequeña) */}
          <p className="text-sm font-semibold text-primary">{demo.businessType}</p>
          {/* Nombre del negocio (título) */}
          <h3 className="mt-1 font-display text-xl font-bold text-secondary">{demo.businessName}</h3>
          
          {/* Si hay más de una variante, mostrar botones para elegirlas */}
          {demo.variants.length > 1 && (
            <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs font-semibold text-foreground/70 mb-2">Ver variantes:</p>
                <div className="flex flex-wrap gap-2">
                    {demo.variants.map(variant => (
                        <button 
                            key={variant.label} 
                            onClick={() => setActiveVariant(variant)} 
                            className={`px-3 py-1 text-[10px] rounded-md font-semibold transition ${
                                activeVariant.label === variant.label 
                                ? 'bg-primary/80 text-background' 
                                : 'bg-white/10 hover:bg-white/20 text-foreground/80'
                            }`}
                        >
                            {/* Etiqueta de la variante (p. ej. Principal, Lunes) */}
                            {variant.label}
                        </button>
                    ))}
                </div>
            </div>
          )}
      </div>

      {/* Controles inferiores para alternar vista escritorio/móvil */}
      <div className="border-t border-white/10 mt-auto p-4 flex items-center justify-end gap-2">
          <button onClick={() => setActiveView('desktop')} className={`px-3 py-1.5 text-xs rounded-md font-semibold transition ${activeView === 'desktop' ? 'bg-primary text-background' : 'bg-white/10 hover:bg-white/20'}`}>Escritorio</button>
          <button onClick={() => setActiveView('mobile')} className={`px-3 py-1.5 text-xs rounded-md font-semibold transition ${activeView === 'mobile' ? 'bg-primary text-background' : 'bg-white/10 hover:bg-white/20'}`}>Móvil</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Página: DemosPage
// Descripción: muestra una galería de demos ordenadas por fecha y usa
// `ScrollAnimationWrapper` para animar la aparición de secciones.
// ---------------------------------------------------------------------------
export default function DemosPage() {
  // Ordenar las demos por fecha descendente (las más recientes primero)
  const sortedDemos = [...demos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-28 pb-16 sm:pt-32">
      {/* Encabezado y descripción centrados con animación al hacer scroll */}
      <ScrollAnimationWrapper className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl font-display">
          Galería de Demos
        </h1>
        <p className="mt-6 text-lg leading-8 text-foreground/80">
          Explora algunas de las demos visuales que hemos construido. Cada una es un borrador funcional que personalizamos junto al cliente hasta alcanzar la visión perfecta.
        </p>
      </ScrollAnimationWrapper>
      
      {/* Grid responsiva con las tarjetas de demo; cada tarjeta se envuelve en ScrollAnimationWrapper */}
      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 items-start">
        {sortedDemos.map((demo, index) => (
            <ScrollAnimationWrapper key={demo.businessName} delay={index * 0.1}>
                <DemoCard demo={demo} />
            </ScrollAnimationWrapper>
        ))}
      </div>
    </div>
  )
}