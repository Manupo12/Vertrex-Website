'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { TypeAnimation } from 'react-type-animation'
import { HiOutlineDesktopComputer } from 'react-icons/hi'
import { HiOutlineDevicePhoneMobile, HiOutlineSparkles, HiOutlineChevronDown } from 'react-icons/hi2' 
import { FaReact, FaNodeJs } from 'react-icons/fa'
import { SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si'
import { projects } from '@/lib/projects-data'
import { AppProjectCard, WebProjectCard } from '@/components/ProjectCards'

const HeroSection = () => {
  const [activeService, setActiveService] = useState(0);

  const services = [
    { text: 'tu página web', icon: <HiOutlineDesktopComputer className="w-10 h-10 lg:w-16 lg:h-16 text-primary" /> },
    { text: 'tu app nativa', icon: <HiOutlineDevicePhoneMobile className="w-10 h-10 lg:w-16 lg:h-16 text-primary" /> },
    { text: 'tu automatización con IA', icon: <HiOutlineSparkles className="w-10 h-10 lg:w-16 lg:h-16 text-primary" /> },
  ];

  return (
    <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-background px-4 sm:px-6">
      <div className="absolute inset-0 z-0">
        <div className="animate-subtle-pulse absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(0,255,127,0.5),rgba(255,255,255,0))]"></div>
        <div className="animate-subtle-pulse [animation-delay:-4s] absolute bottom-[-10%] right-[-20%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,255,255,0.4),rgba(255,255,255,0))]"></div>
      </div>
      
      <motion.div 
        className="z-10 mx-auto max-w-4xl text-center"
        initial="hidden"
        animate="visible"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }}
      >
        <motion.p variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="font-display uppercase tracking-widest text-primary">
          Tecnología con alma humana.
        </motion.p>
        
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

        <motion.p variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80">
           Transformamos tu visión en una{' '}
          <span className="font-bold text-primary">demo visual interactiva</span>
          . Completa nuestro breve cuestionario y déjanos mostrarte el potencial de tu idea,{' '}
          <span className="font-bold text-primary">totalmente gratis</span>.
        </motion.p>

        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="mt-10 flex flex-col items-center justify-center gap-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                <Link href="/cuestionario" className="w-full sm:w-auto rounded-md bg-primary px-5 py-3 text-sm font-semibold text-background shadow-lg transition-all duration-300 hover:bg-primary/80 hover:shadow-[0_0_25px_theme(colors.primary.DEFAULT)]">
                    Obtener mi Demo Gratuita
                </Link>
                <Link href="/servicios" className="w-full sm:w-auto rounded-md bg-white/5 px-5 py-3 text-sm font-semibold leading-6 text-foreground/80 transition-colors hover:bg-white/10 hover:text-primary">
                    Ver servicios
                </Link>
            </div>
            <p className="text-xs text-foreground/60">*No se requiere tarjeta de crédito. Solo tu visión.</p>
        </motion.div>
        
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="mt-12">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-foreground/50">Construimos con tecnología de punta</p>
            <div className="mt-6 flex justify-center items-center gap-x-6 lg:gap-x-8 text-foreground/60">
                <SiNextdotjs size={24} title="Next.js" /> <FaReact size={24} title="React" /> <SiTypescript size={24} title="TypeScript" /> <SiTailwindcss size={24} title="Tailwind CSS" /> <FaNodeJs size={24} title="Node.js" />
            </div>
        </motion.div>
      </motion.div>

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

// --- Componente ServicesSection ---
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
export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <FeaturedProjectsSection />
    </main>
  );
}