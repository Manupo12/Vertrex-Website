 'use client'

// Importaciones principales
// React y hooks
import React, { useState, useCallback } from 'react'
// Framer Motion para animaciones
import { motion, AnimatePresence, Variants } from 'framer-motion'
// Componentes de Next: enlaces e imágenes optimizadas
import Link from 'next/link'
import Image from 'next/image'
// Carrusel (Embla) y animación de texto
import useEmblaCarousel from 'embla-carousel-react'
import { TypeAnimation } from 'react-type-animation'
// Iconos utilizados en la UI
import { HiOutlineChevronDown, HiArrowLeft, HiArrowRight, HiOutlineDevicePhoneMobile, HiOutlineSparkles } from 'react-icons/hi2'
import { HiOutlineDesktopComputer } from 'react-icons/hi'
import { FaReact, FaNodeJs } from 'react-icons/fa'
import { SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si'
// Datos estáticos: proyectos y demos
import { projects } from '@/lib/projects-data'
import { demos, Demo } from '@/lib/demos-data'
// Componentes reutilizables para tarjetas de proyecto
import { AppProjectCard, WebProjectCard } from '@/components/ProjectCards'

// --- Componente HeroSection ---
// Encabezado principal de la home. Muestra un título animado, iconos que cambian
// y botones CTA. Conserva animaciones con Framer Motion y TypeAnimation.
const HeroSection = () => {
  // Estado local para controlar qué servicio/texto/icono se muestra en el hero
  const [activeService, setActiveService] = useState(0);

  // Lista de servicios que se ciclan dentro del título animado
  const services = [
    { text: 'tu página web', icon: <HiOutlineDesktopComputer className="w-10 h-10 lg:w-16 lg:h-16 text-primary" /> },
    { text: 'tu app nativa', icon: <HiOutlineDevicePhoneMobile className="w-10 h-10 lg:w-16 lg:h-16 text-primary" /> },
    { text: 'tu automatización con IA', icon: <HiOutlineSparkles className="w-10 h-10 lg:w-16 lg:h-16 text-primary" /> },
  ];

  return (
    <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-background px-4 sm:px-6">
      {/* Fondos decorativos animados (solo visual) */}
      <div className="absolute inset-0 z-0">
        <div className="animate-subtle-pulse absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(0,255,127,0.5),rgba(255,255,255,0))]"></div>
        <div className="animate-subtle-pulse [animation-delay:-4s] absolute bottom-[-10%] right-[-20%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,255,255,0.4),rgba(255,255,255,0))]"></div>
      </div>
      
      {/* Contenido principal con animaciones en cascada */}
      <motion.div 
        className="z-10 mx-auto max-w-4xl text-center"
        initial="hidden"
        animate="visible"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }}
      >
        <motion.p variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="font-display uppercase tracking-widest text-primary">
          Tecnología con alma humana.
        </motion.p>
        
        {/* Icono grande que cambia según la palabra animada */}
        <div className="relative mt-4 h-20 lg:h-32 flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeService}
                    initial={{ opacity: 0, y: -20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="absolute"
                >
                    {services[activeService].icon}
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Título con texto que se escribe y cambia (TypeAnimation) */}
        <motion.h1 variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="font-display text-4xl font-bold text-secondary sm:text-5xl lg:text-6xl">
          Creamos{' '}
          <TypeAnimation
            sequence={[
              services[0].text, 2000, () => setActiveService(1),
              services[1].text, 2000, () => setActiveService(2),
              services[2].text, 2000, () => setActiveService(0),
            ]}
            wrapper="span"
            speed={50}
            className="text-primary"
            repeat={Infinity}
          />
          <br /> a la medida.
        </motion.h1>

        {/* Descripción y CTA principal */}
        <motion.p variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80">
           Transformamos tu visión en una{' '}
          <span className="font-bold text-primary">demo visual interactiva</span>
          . Completa nuestro breve cuestionario y déjanos mostrarte el potencial de tu idea,{' '}
          <span className="font-bold text-primary">totalmente gratis</span>.
        </motion.p>

        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="mt-10 flex flex-col items-center justify-center gap-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                {/* Botones CTA: cuestionario y ver servicios */}
                <Link href="/cuestionario" className="w-full sm:w-auto rounded-md bg-primary px-5 py-3 text-sm font-semibold text-background shadow-lg transition-all duration-300 hover:bg-primary/80 hover:shadow-[0_0_25px_theme(colors.primary.DEFAULT)]">
                    Obtener mi Demo Gratuita
                </Link>
                <Link href="/servicios" className="w-full sm:w-auto rounded-md bg-white/5 px-5 py-3 text-sm font-semibold leading-6 text-foreground/80 transition-colors hover:bg-white/10 hover:text-primary">
                    Ver servicios
                </Link>
            </div>
            <p className="text-xs text-foreground/60">*No se requiere tarjeta de crédito. Solo tu visión.</p>
        </motion.div>
        
        {/* Logos de tecnologías usadas */}
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="mt-12">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-foreground/50">Construimos con tecnología de punta</p>
            <div className="mt-6 flex justify-center items-center gap-x-6 lg:gap-x-8 text-foreground/60">
                <SiNextdotjs size={24} title="Next.js" /> <FaReact size={24} title="React" /> <SiTypescript size={24} title="TypeScript" /> <SiTailwindcss size={24} title="Tailwind CSS" /> <FaNodeJs size={24} title="Node.js" />
            </div>
        </motion.div>
      </motion.div>

      {/* Ícono animado que indica desplazamiento hacia abajo */}
      <motion.div
        variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <HiOutlineChevronDown className="h-8 w-8 animate-bounce text-foreground/30" />
      </motion.div>
    </div>
  );
};

// --- Componente: FeaturedDemos  ---
// Slide individual que muestra una demo con variantes (escritorio/móvil) y controles
const DemoSlide = ({ demo }: { demo: Demo }) => {
  // Estado para alternar vista entre 'desktop' y 'mobile'
  const [activeView, setActiveView] = useState<'desktop' | 'mobile'>('desktop');
  // Estado para la variante seleccionada de esta demo (videos, etiquetas)
  const [activeVariant, setActiveVariant] = useState(demo.variants[0]);

  // Variantes de animación para el cambio de vista
  const viewVariants: Variants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center p-6 bg-white/5 rounded-2xl border border-white/10">
      {/* Zona de visualización (video dentro de un marco tipo dispositivo) */}
      <div className="lg:col-span-3 flex items-center justify-center min-h-[420px]">
        <AnimatePresence mode="wait">
          <motion.div 
              key={`${activeVariant.label}-${activeView}`} 
              variants={viewVariants} 
              initial="initial" 
              animate="animate" 
              exit="exit"
              className="w-full flex justify-center"
          >
            {activeView === 'desktop' ? (
              <div className="w-full rounded-lg border-4 border-neutral-800 bg-neutral-900 p-1 shadow-2xl shadow-primary/10">
                <div className="p-1.5 bg-neutral-800 rounded-sm">
                  {/* Video de la variante en escritorio */}
                  <video key={activeVariant.videoDesktop} src={activeVariant.videoDesktop} autoPlay loop muted playsInline className="w-full h-full rounded-sm" />
                </div>
              </div>
            ) : (
              <div className="w-full max-w-[250px] rounded-[28px] border-8 border-neutral-800 bg-black p-1.5 shadow-2xl shadow-primary/10">
                <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[20px]">
                  {/* Video de la variante en móvil */}
                  <video key={activeVariant.videoMobile} src={activeVariant.videoMobile} autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover" />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Información lateral: título, descripción y controles */}
      <div className="lg:col-span-2 text-center lg:text-left">
        <p className="text-sm font-semibold text-primary">{demo.businessType}</p>
        <h3 className="mt-1 font-display text-3xl font-bold text-secondary">{demo.businessName}</h3>
        <p className="mt-4 text-foreground/70 text-sm">
          { demo.variants.length > 1 
            ? `Esta demo tiene ${demo.variants.length} variantes que muestran su hero dinámico. ¡Selecciona una!` 
            : 'Una demo visual creada para mostrar el potencial del proyecto.'
          }
        </p>
        {demo.variants.length > 1 && (
            <div className="mt-4 flex flex-wrap justify-center lg:justify-start gap-2">
                {demo.variants.map(variant => (
                    <button 
                        key={variant.label} 
                        onClick={() => setActiveVariant(variant)} 
                        className={`px-3 py-1.5 text-xs rounded-md font-semibold transition ${activeVariant.label === variant.label ? 'bg-primary text-background' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                        {variant.label}
                    </button>
                ))}
            </div>
        )}
        <div className="mt-6 flex items-center justify-center lg:justify-start gap-2 border-t border-white/10 pt-4">
          {/* Botones para alternar la vista de la demo */}
          <button onClick={() => setActiveView('desktop')} className={`px-4 py-2 text-sm rounded-md font-semibold transition ${activeView === 'desktop' ? 'bg-primary text-background' : 'bg-white/10 hover:bg-white/20'}`}>Escritorio</button>
          <button onClick={() => setActiveView('mobile')} className={`px-4 py-2 text-sm rounded-md font-semibold transition ${activeView === 'mobile' ? 'bg-primary text-background' : 'bg-white/10 hover:bg-white/20'}`}>Móvil</button>
        </div>
      </div>
    </div>
  );
};

// Contenedor que muestra las demos destacadas en un carrusel (Embla)
const FeaturedDemos = () => {
  // Ref y API de Embla para controlar el carrusel
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  // Ordenamos por fecha y tomamos las 3 más recientes
  const sortedDemos = [...demos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const featuredDemos = sortedDemos.slice(0, 3);
  
  // Handlers para navegar el carrusel
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }} className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl font-display text-primary">Demos Recientes</h2>
          <p className="mt-4 text-lg text-foreground/80">
            Esto es lo que podemos crear para ti. Cada demo es un punto de partida; el diseño final se ajusta 100% a tu visión y necesidades.
          </p>
        </motion.div>
        <div className="mt-16">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {featuredDemos.map((demo, index) => (
                <div key={index} className="relative flex-[0_0_100%] min-w-0 md:pl-4">
                  <DemoSlide demo={demo} />
                </div>
              ))}
            </div>
          </div>
           <div className="flex justify-center gap-4 mt-8">
              <button onClick={scrollPrev} aria-label="Demo anterior" className="p-3 rounded-full bg-white/10 hover:bg-primary hover:text-background transition-all"><HiArrowLeft className="h-5 w-5"/></button>
              <button onClick={scrollNext} aria-label="Siguiente demo" className="p-3 rounded-full bg-white/10 hover:bg-primary hover:text-background transition-all"><HiArrowRight className="h-5 w-5"/></button>
          </div>
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }} transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="mt-8 text-sm text-foreground/60 italic max-w-3xl mx-auto">
              Nota: Los logos y videos utilizados en estas demos son puramente ilustrativos. En tu proyecto final, trabajaremos con los materiales de tu marca.
            </p>
             <div className="mt-8">
                <Link href="/demos" className="text-sm font-semibold leading-6 text-primary/80 transition-colors hover:text-primary">
                    Ver todas las demos <span aria-hidden="true">→</span>
                </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Componente ServicesSection ---
// Sección que lista los servicios principales ofrecidos
const ServiceCard = ({ title, description }: { title: string; description: string }) => (
    <div className="block rounded-xl border border-white/10 p-8 shadow-xl transition hover:border-primary/20 hover:shadow-primary/10 bg-white/5">
      <h3 className="mt-4 text-xl font-bold text-foreground font-display">{title}</h3>
      <p className="mt-1 text-sm text-foreground/70">{description}</p>
    </div>
);
  
const ServicesSection = () => (
    <section id="servicios" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl font-display text-primary">Lo que podemos construir para ti</h2>
          <p className="mt-4 text-lg text-foreground/80">
            Desde una idea simple hasta un sistema complejo, cubrimos todo el espectro digital para que no tengas que preocuparte por la tecnología.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
          <ServiceCard title="Páginas Web de Alto Impacto" description="Sitios web económicos y profesionales para negocios y emprendedores." />
          <ServiceCard title="Apps Nativas y Software" description="Soluciones a medida que resuelven problemas reales y optimizan procesos." />
          <ServiceCard title="Estrategia Digital" description="Potenciamos tu marca en redes sociales para que llegues a más clientes." />
        </div>
      </div>
    </section>
);

// --- Componente FeaturedProjectsSection ---
// Presenta proyectos destacados (filtrados por slug) usando las tarjetas reutilizables
const FeaturedProjectsSection = () => {
    const featuredProjects = projects.filter(p => p.slug === 'opita-go' || p.slug === 'ivon');
    return (
        <section className="py-16 sm:py-24 bg-white/5">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold sm:text-4xl font-display text-primary">Nuestro Trabajo en Acción</h2>
                    <p className="mt-4 text-lg text-foreground/80">
                        No solo hablamos de tecnología, la construimos. Estos son algunos de nuestros proyectos insignia.
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                    {featuredProjects.map((project) => (
                        project.type === 'app' 
                            ? <AppProjectCard key={project.slug} project={project} />
                            : <WebProjectCard key={project.slug} project={project} />
                    ))}
                </div>
                <div className="mt-16 text-center">
                    <Link href="/portafolio" className="text-sm font-semibold leading-6 text-foreground/80 transition-colors hover:text-primary">
                        Ver todos los proyectos <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

// --- Componente Principal ---
// Página principal que compone las secciones definidas arriba
export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedDemos />
      <ServicesSection />
      <FeaturedProjectsSection />
    </main>
  );
}