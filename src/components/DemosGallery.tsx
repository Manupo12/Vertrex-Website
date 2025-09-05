 'use client'

// Importes y hooks
import { useState } from 'react'
import { demos, Demo } from '@/lib/demos-data'
import { ScrollAnimationWrapper } from '@/components/ScrollAnimationWrapper'

// DemoCard: tarjeta individual que muestra una demo.
// - Usa estado local `activeView` para alternar entre la vista de escritorio y móvil.
// - `mainVariant` es la variante principal/metadato de la demo (videos, label, etc.).
const DemoCard = ({ demo }: { demo: Demo }) => {
  // Estado que controla si se muestra la vista 'desktop' o 'mobile'
  const [activeView, setActiveView] = useState<'desktop' | 'mobile'>('desktop');
  // Tomamos la primera variante como la variante principal a mostrar
  const mainVariant = demo.variants[0];

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 overflow-hidden h-full transition-all duration-300 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10">
      {/* Contenedor del video: cambia según `activeView` */}
      <div className="p-4 bg-background">
        {activeView === 'desktop' ? (
          // Marco tipo monitor para la versión de escritorio
          <div className="rounded-md border-2 border-neutral-800 bg-neutral-900 p-1">
            <div className="p-1 bg-neutral-800 rounded-sm">
              <video src={mainVariant.videoDesktop} autoPlay loop muted playsInline className="w-full h-full rounded-sm aspect-video" />
            </div>
          </div>
        ) : (
          // Marco tipo smartphone para la versión móvil
          <div className="flex justify-center p-4">
            <div className="w-full max-w-[200px] rounded-[24px] border-4 border-neutral-800 bg-black p-1">
              <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[18px]">
                <video src={mainVariant.videoMobile} autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover" />
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Información de la demo y controles para alternar vista */}
      <div className="flex flex-col p-6 pt-4 flex-grow">
        <div>
          <p className="text-sm font-semibold text-primary">{demo.businessType}</p>
          <h3 className="mt-1 font-display text-xl font-bold text-secondary">{demo.businessName}</h3>
        </div>
        <div className="mt-auto pt-4 flex items-center gap-2">
          {/* Botones que cambian `activeView` sin afectar otras demos */}
          <button onClick={() => setActiveView('desktop')} className={`px-3 py-1.5 text-xs rounded-md font-semibold transition ${activeView === 'desktop' ? 'bg-primary text-background' : 'bg-white/10 hover:bg-white/20'}`}>Escritorio</button>
          <button onClick={() => setActiveView('mobile')} className={`px-3 py-1.5 text-xs rounded-md font-semibold transition ${activeView === 'mobile' ? 'bg-primary text-background' : 'bg-white/10 hover:bg-white/20'}`}>Móvil</button>
        </div>
      </div>
    </div>
  )
}

// DemosGallery: grid que renderiza todas las demos ordenadas por fecha.
// - Usa `ScrollAnimationWrapper` para animar la entrada de cada tarjeta.
export default function DemosGallery() {
  // Orden descendente por fecha (más recientes primero)
  const sortedDemos = [...demos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {sortedDemos.map((demo, index) => (
            // Delay incremental para un efecto en cascada en la animación
            <ScrollAnimationWrapper key={index} delay={index * 0.1}>
                <DemoCard demo={demo} />
            </ScrollAnimationWrapper>
        ))}
      </div>
  )
}