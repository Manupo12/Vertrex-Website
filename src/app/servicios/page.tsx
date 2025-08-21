'use client'

import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper"
import Link from "next/link";
import Image from "next/image";
import { HiOutlineCodeBracketSquare, HiOutlineMegaphone, HiOutlineSparkles, HiOutlineCube } from "react-icons/hi2";
import { FaSearch, FaDraftingCompass, FaLaptopCode, FaRocket } from "react-icons/fa";

const services = [
  {
    title: 'Desarrollo Digital y de Software',
    icon: <HiOutlineCodeBracketSquare size={28} className="text-primary" />,
    description: 'Transformamos tus ideas en herramientas digitales robustas y escalables, diseñadas para impulsar el crecimiento.',
    offerings: ['Páginas Web y Landing Pages', 'Aplicaciones Web (SaaS)', 'Aplicaciones Nativas para Android', 'Automatización con IA'],
    imageUrl: '/images/servicio-desarrollo.webp',
    imageSide: 'right' as const,
  },
  {
    title: 'Marketing y Estrategia de Contenidos',
    icon: <HiOutlineMegaphone size={28} className="text-primary" />,
    description: 'Aumentamos tu visibilidad y conectamos con tu audiencia a través de estrategias basadas en datos.',
    offerings: ['Gestión de Redes Sociales', 'Campañas en Meta Ads', 'Creación de Contenido de Valor', 'Análisis de Métricas'],
    imageUrl: '/images/servicio-marketing.webp',
    imageSide: 'left' as const,
  },
  {
    title: 'Marcas y Productos Vertrex',
    icon: <HiOutlineSparkles size={28} className="text-primary" />,
    description: 'Creamos nuestros propios productos, lo que nos mantiene a la vanguardia de la tecnología y el diseño.',
    offerings: ['Software Propio (Opita Go, IVON)', 'Videojuegos para Móviles', 'Línea de Ropa y E-commerce', 'Proyectos de Medios'],
    imageUrl: '/images/servicio-productos.webp',
    imageSide: 'right' as const,
  },
  {
    title: 'Servicios Físicos y de Vanguardia',
    icon: <HiOutlineCube size={28} className="text-primary" />,
    description: 'Llevamos la innovación del mundo digital al físico, creando productos y espacios únicos bajo demanda.',
    offerings: ['Impresiones 3D por Encargo', 'Domotización de Casas', 'Proyectos Físicos Especiales'],
    imageUrl: '/images/servicio-fisicos.webp',
    imageSide: 'left' as const,
  },
]

const processSteps = [
    { name: 'Descubrimiento', icon: <FaSearch size={24} />, description: 'Nos sumergimos en tu visión y los objetivos de tu negocio para entender el "porqué" de tu proyecto.' },
    { name: 'Diseño y Estrategia', icon: <FaDraftingCompass size={24} />, description: 'Creamos un plan de acción, diseñando la arquitectura y la experiencia de usuario (UX/UI) a medida.' },
    { name: 'Desarrollo', icon: <FaLaptopCode size={24} />, description: 'Nuestro equipo de ingenieros traduce los diseños en código limpio, eficiente y escalable.' },
    { name: 'Lanzamiento y Crecimiento', icon: <FaRocket size={24} />, description: 'Desplegamos la solución y te acompañamos con estrategias para asegurar su impacto y crecimiento.' }
]

export default function ServiciosPage() {
  return (
    <div className="bg-background text-foreground overflow-hidden">
        {/* HERO SECTION */}
        <div className="relative pt-32 pb-24 sm:pt-40 sm:pb-32">
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
            </div>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <ScrollAnimationWrapper className="mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl font-display">
                      Un Ecosistema de Soluciones a Medida
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-foreground/80">
                      Desde el código hasta la estrategia de mercado, creamos soluciones integrales que entregan resultados tangibles. Explora cómo podemos potenciar tu visión.
                    </p>
                </ScrollAnimationWrapper>
            </div>
        </div>
        
        {/* CONTENEDOR DE SERVICIOS CON DOBLE LAYOUT */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24 sm:pb-32">
            <div className="space-y-24">
                {services.map(service => (
                    <ScrollAnimationWrapper key={service.title}>
                        {/* ----- LAYOUT PARA MÓVIL (Se añade el botón) ----- */}
                        <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 overflow-hidden lg:hidden">
                            <div className="relative w-full h-48">
                                <Image src={service.imageUrl} alt={`Imagen para ${service.title}`} fill sizes="100vw" className="object-cover" />
                            </div>
                            <div className="flex flex-col p-6 flex-grow">
                                <div className="flex items-center gap-x-3">
                                    {service.icon}
                                    <h3 className="text-xl font-bold text-foreground font-display">{service.title}</h3>
                                </div>
                                <p className="mt-4 text-sm text-foreground/80 flex-grow">{service.description}</p>
                                <ul className="mt-6 space-y-2 text-xs text-foreground/70">
                                    {service.offerings.map(offering => ( <li key={offering} className="flex items-center gap-x-2"> <svg className="h-4 w-4 flex-none text-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg> {offering} </li> ))}
                                </ul>
                                {/* BOTÓN AÑADIDO A LA VISTA MÓVIL */}
                                <div className="mt-8">
                                    <Link href="/contacto" className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-background shadow-sm hover:bg-primary/80 transition-colors">
                                        Cotizar este servicio &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* ----- LAYOUT PARA PC (Se añade marco y botón) ----- */}
                        <div className="hidden lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-24">
                            <div className={`lg:order-${service.imageSide === 'left' ? '2' : '1'}`}>
                                <div className="flex items-center gap-x-3">
                                    {service.icon}
                                    <h3 className="text-2xl font-bold text-foreground font-display">{service.title}</h3>
                                </div>
                                <p className="mt-4 text-lg text-foreground/80">{service.description}</p>
                                <ul className="mt-6 space-y-3 text-sm text-foreground/90">
                                    {service.offerings.map(offering => ( <li key={offering} className="flex items-start gap-x-3"> <svg className="h-5 w-5 flex-none text-primary mt-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg> <span>{offering}</span> </li> ))}
                                </ul>
                                {/* BOTÓN AÑADIDO A LA VISTA DE PC */}
                                <div className="mt-8">
                                    <Link href="/contacto" className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-background shadow-sm hover:bg-primary/80 transition-colors">
                                        Cotizar este servicio &rarr;
                                    </Link>
                                </div>
                            </div>
                            {/* MARCO AÑADIDO A LA IMAGEN DE PC */}
                            <div className={`relative w-full h-96 rounded-2xl overflow-hidden lg:order-${service.imageSide === 'left' ? '1' : '2'} lg:ring-1 lg:ring-white/10 lg:ring-offset-8 lg:ring-offset-background`}>
                                <Image src={service.imageUrl} alt={`Imagen para ${service.title}`} fill sizes="50vw" className="object-cover" />
                            </div>
                        </div>
                    </ScrollAnimationWrapper>
                ))}
            </div>
        </div>

        {/* OUR PROCESS SECTION */}
        <div className="bg-white/5 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <ScrollAnimationWrapper className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl font-display">Nuestro Proceso Simplificado</h2>
                    <p className="mt-4 text-lg text-foreground/80">De la idea al lanzamiento, nuestro proceso está diseñado para ser transparente, colaborativo y enfocado en la excelencia.</p>
                </ScrollAnimationWrapper>
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {processSteps.map(step => ( <ScrollAnimationWrapper key={step.name} className="text-center"> <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"> {step.icon} </div> <h3 className="mt-5 text-lg font-semibold text-foreground">{step.name}</h3> <p className="mt-2 text-sm text-foreground/70">{step.description}</p> </ScrollAnimationWrapper> ))}
                </div>
            </div>
        </div>

        {/* FINAL CTA SECTION */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32 text-center">
            <ScrollAnimationWrapper>
                <h2 className="font-display text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
                    ¿Tienes una idea que necesita <span className="text-primary">despegar</span>?
                </h2>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-foreground/80">
                    No dejes que tu visión se quede en el papel. Conversemos sobre cómo podemos transformarla en una solución digital exitosa. La primera consulta no tiene costo.
                </p>
                <div className="mt-10">
                    <Link href="/contacto" className="inline-block rounded-md bg-primary px-6 py-3 text-lg font-semibold text-background shadow-lg transition-all duration-300 hover:bg-primary/80 hover:shadow-[0_0_25px_theme(colors.primary.DEFAULT)]">
                        Iniciar una Conversación
                    </Link>
                </div>
            </ScrollAnimationWrapper>
        </div>
    </div>
  )
}