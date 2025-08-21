'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { stiffness: 100 },
    },
  };

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <div className="animate-subtle-pulse absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(0,255,127,0.5),rgba(255,255,255,0))]"></div>
        <div className="animate-subtle-pulse [animation-delay:-2.5s] absolute bottom-[-10%] right-[-20%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,255,255,0.4),rgba(255,255,255,0))]"></div>
      </div>
      <motion.div
        className="z-10 mx-auto max-w-3xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="font-display text-4xl font-bold uppercase tracking-widest text-secondary sm:text-6xl"
          variants={itemVariants}
        >
          <span className="text-primary">Ingenio</span> Humano,
          <span className="block mt-2">Tecnología de <span className="text-secondary">Vanguardia</span>.</span>
        </motion.h1>
        <motion.p
          className="mx-auto mt-6 max-w-xl text-lg text-foreground/80"
          variants={itemVariants}
        >
          Fusionamos código experto, estrategia creativa y diseño minimalista para construir las soluciones digitales del mañana.
        </motion.p>
      </motion.div>
    </div>
  );
};

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
        <h2 className="text-3xl font-bold sm:text-4xl font-display text-primary">Un Ecosistema de Soluciones</h2>
        <p className="mt-4 text-lg text-foreground/80">
          Cubrimos todo el espectro digital, desde el desarrollo a medida hasta el marketing y la creación de productos propios.
        </p>
      </div>
      <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
        <ServiceCard 
          title="Software a Medida"
          description="Aplicaciones web y móviles que resuelven problemas reales."
        />
        <ServiceCard 
          title="Estrategia Digital"
          description="Gestión de redes y campañas de anuncios para potenciar tu marca."
        />
        <ServiceCard 
          title="Marcas y Productos"
          description="Creamos nuestras propias apps, videojuegos, ropa y más."
        />
      </div>
    </div>
  </section>
);

const FeaturedProjectsSection = () => {
  const featuredProjects = [
    {
      title: 'Opita GO',
      category: 'App Móvil Propia',
      imageUrl: '/images/opitago.png', 
    },
    {
      title: 'IVON (Información Vial Organizada de Neiva)',
      category: 'App Móvil Propia',
      imageUrl: '', 
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl font-display text-primary">Proyectos Destacados</h2>
          <p className="mt-4 text-lg text-foreground/80">
            Un vistazo a las soluciones que hemos construido. Esto es lo que hacemos, no solo lo que decimos.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {featuredProjects.map((project) => (
            <Link href="/portafolio" key={project.title} className="group relative block h-64 rounded-2xl overflow-hidden">
              {project.imageUrl ? (
                <Image
                  src={project.imageUrl}
                  alt={`Imagen del proyecto ${project.title}`}
                  fill
                  className="object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-black/50 border border-white/10">
                  <p className="text-foreground/50 italic">Imagen Próximamente</p>
                </div>
              )}
              
              {/* Overlay con la información del proyecto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-sm font-medium text-foreground/70">{project.category}</p>
                <h3 className="mt-1 text-xl font-semibold text-white font-display transition-colors duration-300 group-hover:text-primary">
                  {project.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link href="/portafolio" className="inline-block rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-background shadow-sm hover:bg-primary/80 transition-all duration-300 hover:shadow-[0_0_20px_theme(colors.primary.DEFAULT)]">
            Ver todos los proyectos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <FeaturedProjectsSection />
    </main>
  );
}