'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { projects } from '@/lib/projects-data'
import { AppProjectCard, WebProjectCard } from '@/components/ProjectCards'

const FilterButtons = ({ categories, activeFilter, setActiveFilter }: { categories: string[], activeFilter: string, setActiveFilter: (filter: string) => void }) => {
    if (categories.length <= 1) {
        return null;
    }
    return (
        <div className="mb-8 flex justify-center flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
                  activeFilter === category 
                  ? 'bg-primary text-background shadow-md shadow-primary/30' 
                  : 'bg-white/10 text-foreground/80 hover:bg-white/20'
                }`}
              >
                {category}
              </button>
            ))}
        </div>
    );
};

export default function PortafolioPage() {
  const [internalFilter, setInternalFilter] = useState('Todos');
  const [clientFilter, setClientFilter] = useState('Todos');

  const filterCategories = ['Todos', 'App', 'Web'];

  const internalProjects = useMemo(() => projects.filter(p => p.developer === 'Vertrex S.C.'), []);
  const clientProjects = useMemo(() => projects.filter(p => p.developer === 'Cliente'), []);

  const filteredInternal = useMemo(() => internalProjects.filter(p => internalFilter === 'Todos' || p.type.toLowerCase() === internalFilter.toLowerCase()), [internalProjects, internalFilter]);
  const filteredClient = useMemo(() => clientProjects.filter(p => clientFilter === 'Todos' || p.type.toLowerCase() === clientFilter.toLowerCase()), [clientProjects, clientFilter]);

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-28 pb-16 sm:pt-32">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl font-display">
          Donde las Ideas Toman Forma
        </h1>
        <p className="mt-6 text-lg leading-8 text-foreground/80">
          Cada proyecto es una prueba de cómo una inversión inteligente en tecnología puede generar un crecimiento real para negocios en Neiva y más allá.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-16">
        
        {/* === Columna 1: Proyectos Vertrex === */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold text-center text-foreground font-display mb-6">Proyectos Vertrex</h2>
          <FilterButtons categories={filterCategories} activeFilter={internalFilter} setActiveFilter={setInternalFilter} />
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <AnimatePresence>
              {filteredInternal.map((project) => (
                project.type === 'app'
                    ? <AppProjectCard key={project.slug} project={project} />
                    : <WebProjectCard key={project.slug} project={project} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* === Columna 2: Proyectos para Clientes === */}
        <div className="flex flex-col border-t border-white/10 pt-16 lg:border-t-0 lg:pt-0">
          <h2 className="text-2xl font-semibold text-center text-foreground font-display mb-6">Proyectos para Clientes</h2>
          <FilterButtons categories={clientProjects.length > 0 ? filterCategories : []} activeFilter={clientFilter} setActiveFilter={setClientFilter} />
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-8">
             <AnimatePresence>
              {filteredClient.map((project) => (
                project.type === 'app'
                    ? <AppProjectCard key={project.slug} project={project} />
                    : <WebProjectCard key={project.slug} project={project} />
              ))}
            </AnimatePresence>
            
            <motion.div 
              layout 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className={`group relative flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-primary/30 p-6 min-h-[350px] overflow-hidden transition-all duration-300 hover:border-primary/80 ${
                clientProjects.length === 0 ? 'sm:col-span-2' : ''
              }`}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_80%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative z-10">
                    <h3 className="text-xl font-bold text-foreground font-display transition-transform duration-300 group-hover:scale-105">Tu Visión, Nuestro Próximo Caso de Éxito</h3>
                    <div className="mt-6 transition-transform duration-300 group-hover:scale-110">
                        <Link href="/contacto" className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-background shadow-sm hover:bg-primary/80 transition-all duration-300 hover:shadow-[0_0_20px_theme(colors.primary.DEFAULT)]">
                            Convierte tu Idea en Realidad
                        </Link>
                    </div>
                </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Sección de Precios */}
      <div className="mt-24 text-center p-8 border border-dashed border-primary/20 rounded-lg bg-white/5">
        <h3 className="font-display text-2xl text-primary">Soluciones de Alto Impacto a Precios Competitivos</h3>
        <p className="mt-4 max-w-2xl mx-auto text-foreground/80">Ofrecemos planes flexibles diseñados para startups, emprendedores y negocios en crecimiento en Neiva y toda Colombia.</p>
        <Link href="/contacto" className="mt-6 inline-block rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-background shadow-sm hover:bg-primary/80">
            Solicita una Cotización
        </Link>
      </div>
    </div>
  )
}