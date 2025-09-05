 'use client'

// Este componente es la vista cliente de detalle de un proyecto.
// Contiene subcomponentes pequeños para mantener la UI organizada
// (ProjectHeader, MediaGallery) y un CTA que adapta su contenido según el proyecto.
import { Project } from '@/lib/projects-data';
import Image from 'next/image';
import Link from 'next/link';
import { FaGooglePlay, FaExternalLinkAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

// --- Sub-componente para el encabezado  ---
// Muestra el logo (si aplica), la categoría, el título y desarrollador del proyecto.
// Diseñado para usarse tanto en la columna principal como en la barra lateral sticky.
const ProjectHeader = ({ project }: { project: Project }) => (
    <header className="flex items-center gap-x-6">
        {project.type === 'app' && project.appLogo && (
            <div className="relative h-20 w-20 flex-none">
                <Image src={project.appLogo} alt={`Logo de ${project.title}`} fill sizes="80px" className="rounded-2xl object-contain shadow-lg" />
            </div>
        )}
        <div>
            <p className="text-sm font-semibold text-primary">{project.category}</p>
            <h1 className="mt-1 font-display text-3xl font-bold text-secondary sm:text-4xl">{project.title}</h1>
            <p className="text-md font-semibold text-foreground/80">{project.developer}</p>
        </div>
    </header>
);

// --- Sub-componente para la Galería de Funcionalidades ---
// Recorre `project.galleryImages` y muestra pares (media + texto).
// - Si el proyecto es tipo 'app' renderiza las imágenes dentro de un mock de dispositivo móvil.
// - Si es web, usa una caja con `aspect-video`.
// Se aplican animaciones en la entrada con Framer Motion y alternancia de orden para variedad visual.
const MediaGallery = ({ project }: { project: Project }) => (
    <section className="mt-16">
        <h2 className="font-display text-3xl font-bold text-primary mb-8">Funcionalidades Clave</h2>
        <div className="space-y-16">
            {project.galleryImages.length > 0 ? (
                project.galleryImages.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6 }}
                            className={`flex w-full justify-center ${index % 2 === 1 ? 'lg:order-last' : ''}`}
                        >
                            {project.type === 'app' ? (
                                <div className="mx-auto w-full max-w-[280px] rounded-[32px] border-8 border-neutral-800 bg-black p-2 shadow-2xl shadow-primary/20">
                                    <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[24px]">
                                        <Image src={item.imageUrl} alt={item.caption} fill className="object-cover" />
                                    </div>
                                </div>
                            ) : (
                                <div className="relative w-full overflow-hidden rounded-xl aspect-video shadow-2xl shadow-primary/20">
                                    <Image src={item.imageUrl} alt={item.caption} fill className="object-cover" />
                                </div>
                            )}
                        </motion.div>
                        <motion.div
                             initial={{ opacity: 0, y: 50 }}
                             whileInView={{ opacity: 1, y: 0 }}
                             viewport={{ once: true, amount: 0.3 }}
                             transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <p className="text-lg text-foreground/80 leading-relaxed">{item.caption}</p>
                        </motion.div>
                    </div>
                ))
            ) : ( <p className="text-foreground/60 italic">Próximamente, más detalles visuales de este proyecto.</p> )}
        </div>
    </section>
);


// --- Componente de Cliente Principal ---
export default function ProjectDetailClient({ project }: { project: Project }) {
  // Determina el texto y icono del CTA según el proyecto
  const getCtaContent = () => {
    if (project.category.includes('Android')) { return { text: 'Disponible en Play Store', icon: <FaGooglePlay size={20} /> }; }
    if (project.type === 'web') { return { text: 'Visitar Sitio Web', icon: <FaExternalLinkAlt className="h-4 w-4" /> }; }
    return { text: 'Ver Proyecto en Vivo', icon: <FaExternalLinkAlt className="h-4 w-4" /> };
  };
  const cta = getCtaContent();

  // Botón CTA reutilizable. Abre `project.liveUrl` en una nueva pestaña.
  const CtaButton = () => (
    <Link href={project.liveUrl!} target="_blank" rel="noopener noreferrer" className="mt-8 flex w-full items-center justify-center gap-x-3 rounded-lg bg-primary py-3 px-4 text-md font-bold text-background shadow-lg transition-all duration-300 hover:bg-primary/80 hover:shadow-[0_0_20px_theme(colors.primary.DEFAULT)]">
        {cta.icon}
        {cta.text}
    </Link>
  );

  // Estructura principal de la página de detalle:
  // - Columna principal (lg:col-span-2): reto, solución, resultado y galería.
  // - Aside (lg:col-span-1): resumen sticky con CTA y tecnologías.
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-28 pb-16 sm:pt-32">
        <div className="lg:grid lg:grid-cols-3 lg:gap-x-16">
            
            {/* --- Columna Principal de Contenido (Izquierda en PC) --- */}
            <main className="lg:col-span-2">
                {/* En mobile mostramos el header antes del contenido */}
                <div className="lg:hidden mb-12"> <ProjectHeader project={project} /> </div>

                <div className="space-y-12 text-base lg:text-lg text-foreground/80 leading-relaxed">
                    <motion.section initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{delay: 0.1}}>
                        <h2 className="font-display text-2xl font-semibold text-primary">El Reto</h2>
                        <p className="mt-2">{project.details.challenge}</p>
                    </motion.section>
                    
                    <motion.section initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{delay: 0.2}}>
                        <h2 className="font-display text-2xl font-semibold text-primary">La Solución</h2>
                        <p className="mt-2">{project.details.solution}</p>
                    </motion.section>
                    
                    <motion.section initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{delay: 0.3}}>
                        <h2 className="font-display text-2xl font-semibold text-primary">El Resultado</h2>
                        <p className="mt-2">{project.details.outcome}</p>
                    </motion.section>
                </div>

                <div className="mt-16 border-t border-white/10 pt-12">
                    <MediaGallery project={project} />
                </div>
            </main>

            {/* --- Columna Fija de Resumen (Derecha en PC) --- */}
            <aside className="hidden lg:block lg:col-span-1">
                <div className="sticky top-28">
                    <ProjectHeader project={project} />
                    {project.liveUrl && <CtaButton />}
                    <div className="mt-8 border-t border-white/10 pt-6">
                        <h3 className="font-display text-lg font-semibold text-primary">Tecnologías</h3>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {project.technologies.map(tech => (
                                <span key={tech} className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-foreground">
                                {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>
            
            {/* Botón de acción para móvil, aparece después del texto principal */}
            {project.liveUrl && ( <div className="lg:hidden mt-12"> <CtaButton /> </div> )}
        </div>
    </div>
  );
}