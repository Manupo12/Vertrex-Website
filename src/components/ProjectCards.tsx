'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Project } from '@/lib/projects-data'
import { HiOutlineSparkles } from 'react-icons/hi2'

// ProjectCards.tsx
// Comentarios en español: este archivo exporta dos componentes reutilizables
// para mostrar proyectos en la interfaz:
// - AppProjectCard: tarjeta pensada para proyectos tipo APP (muestra un logo/appLogo o un icono fallback).
// - WebProjectCard: tarjeta pensada para proyectos tipo WEB (usa `coverImage` como fondo).
// Ambos componentes mantienen animaciones con Framer Motion y usan `next/image`
// para optimizar imágenes. No se modifica la lógica, sólo se documenta.

/**
 * Tarjeta de Proyecto diseñada específicamente para mostrar APPS.
 */
export const AppProjectCard = ({ project }: { project: Project }) => {
    // Icono por defecto si el proyecto no tiene `appLogo`
    const FallbackIcon = HiOutlineSparkles;
    
    return (
        <Link href={`/portafolio/${project.slug}`} className="block group h-full">
            <motion.div 
                whileTap={{ scale: 0.98 }}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/5 h-full overflow-hidden transition-all duration-300 group-hover:border-primary/20 group-hover:shadow-2xl group-hover:shadow-primary/10"
            >
                {/* Cabecera con fondo y logo de la app (o fallback) */}
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-6">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="relative w-24 h-24"
                    >
                        {project.appLogo ? (
                            // Si hay logo de la app, se usa next/image con `fill` para optimizar
                            <Image
                                src={project.appLogo}
                                alt={`Logo de ${project.title}`}
                                fill
                                sizes="96px"
                                className="object-contain"
                            />
                        ) : (
                            // Si no hay logo, mostramos un icono fallback
                            <FallbackIcon size={72} className="text-primary/80" />
                        )}
                    </motion.div>
                </div>
                <div className="flex flex-col p-6 flex-grow">
                    <div>
                        <p className="text-sm font-medium text-foreground/70">{project.category}</p>
                        <h3 className="mt-1 text-lg font-semibold text-white font-display">{project.title}</h3>
                    </div>
                    <p className="mt-4 text-sm text-foreground/80 flex-grow">{project.description}</p>
                    <div className="mt-6 font-semibold text-primary">
                        Ver caso de estudio <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">→</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

/**
 * Tarjeta de Proyecto diseñada específicamente para mostrar WEBS.
 */
export const WebProjectCard = ({ project }: { project: Project }) => {
    // Tarjeta para proyectos web: usa `coverImage` como fondo y aplica overlay
    return (
        <Link href={`/portafolio/${project.slug}`} className="block group h-full">
            <motion.div
                whileTap={{ scale: 0.98 }}
                className="relative rounded-2xl overflow-hidden h-full min-h-[350px]"
            >
                {/* Imagen de portada optimizada con next/image */}
                <Image
                    src={project.coverImage}
                    alt={`Imagen del proyecto ${project.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
                {/* Overlay para asegurar legibilidad del texto */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                    <p className="text-sm font-medium text-foreground/70">{project.category}</p>
                    <h3 className="mt-1 text-xl font-semibold text-white font-display transition-colors duration-300 group-hover:text-primary">{project.title}</h3>
                </div>
            </motion.div>
        </Link>
    );
};