 'use client'

// Página de Servicios
// Esta página lista los servicios ofrecidos por la empresa y describe el proceso de trabajo.
// No se modifica la lógica; solo se añaden comentarios en español para aclarar la estructura.
import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper"
import Link from "next/link";
import Image from "next/image";
import { services, processSteps } from "@/lib/services-data";

export default function ServiciosPage() {
  return (
    <div className="bg-background text-foreground overflow-hidden">
        {/* Hero: fondo decorativo y título principal */}
        <div className="relative pt-28 pb-20 sm:pt-40 sm:pb-24">
            {/* Elemento decorativo con gradiente y blur (solo visual) */}
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
            </div>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Encabezado central con descripción */}
                <ScrollAnimationWrapper className="mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl font-display">
                      Tecnología de Punta a Precios que Aterrizan
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-foreground/80">
                      Ofrecemos desarrollo y marketing de nivel profesional sin los costos de una gran agencia. La solución ideal para emprendedores y negocios en Neiva que buscan resultados reales.
                    </p>
                </ScrollAnimationWrapper>
            </div>
        </div>
        
        {/* Sección principal: listado de servicios */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-20 sm:pb-32">
            <div className="space-y-16 sm:space-y-24">
                {/* Iterar sobre los servicios definidos en /lib/services-data */}
                {services.map(service => {
                  // Icono componente por servicio (se extrae para usar en JSX)
                  const Icon = service.icon;
                  return (
                    <ScrollAnimationWrapper key={service.title}>
                        {/* Versión móvil/pequeña: tarjeta apilada con imagen arriba (visible en lg:hidden) */}
                        <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 overflow-hidden lg:hidden">
                            <div className="relative w-full h-48">
                                <Image src={service.imageUrl} alt={`Imagen para ${service.title}`} fill sizes="100vw" className="object-cover" />
                            </div>
                            <div className="flex flex-col p-6 flex-grow">
                                <div className="flex items-center gap-x-3">
                                    <Icon size={28} className="text-primary flex-shrink-0" />
                                    <h3 className="text-xl font-bold text-foreground font-display">{service.title}</h3>
                                </div>
                                <p className="mt-4 text-sm text-foreground/80 flex-grow">{service.description}</p>
                                <div className="mt-6 rounded-lg bg-white/5 p-4">
                                    <ul className="space-y-2 text-xs text-foreground/80">
                                        {/* Lista de ofertas incluidas en cada servicio */}
                                        {service.offerings.map(offering => ( <li key={offering} className="flex items-center gap-x-2.5"> <svg className="h-4 w-4 flex-none text-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg> <span>{offering}</span> </li> ))}
                                    </ul>
                                </div>
                                <div className="mt-6">
                                    <Link href="/contacto" className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-background shadow-sm hover:bg-primary/80 transition-colors">
                                        Cotizar este servicio &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Versión escritorio (lg): diseño con imagen a un lado y texto al otro */}
                        <div className="hidden lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-24">
                            <div className={`lg:order-${service.imageSide === 'left' ? '2' : '1'}`}>
                                <div className="flex items-center gap-x-4">
                                    <Icon size={32} className="text-primary flex-shrink-0" />
                                    <h3 className="text-2xl font-bold text-foreground font-display">{service.title}</h3>
                                </div>
                                <p className="mt-4 text-lg text-foreground/80">{service.description}</p>
                                <ul className="mt-6 space-y-3 text-sm text-foreground/90">
                                    {service.offerings.map(offering => ( <li key={offering} className="flex items-start gap-x-3"> <svg className="h-5 w-5 flex-none text-primary mt-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg> <span>{offering}</span> </li> ))}
                                </ul>
                                <div className="mt-8">
                                    <Link href="/contacto" className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-background shadow-sm hover:bg-primary/80 transition-colors">
                                        Cotizar este servicio &rarr;
                                    </Link>
                                </div>
                            </div>
                            <div className={`relative w-full h-96 rounded-2xl overflow-hidden lg:order-${service.imageSide === 'left' ? '1' : '2'} lg:ring-1 lg:ring-white/10 lg:ring-offset-8 lg:ring-offset-background`}>
                                <Image src={service.imageUrl} alt={`Imagen para ${service.title}`} fill sizes="50vw" className="object-cover" />
                            </div>
                        </div>
                    </ScrollAnimationWrapper>
                  )
                })}
            </div>
        </div>
        
        {/* Sección: proceso de trabajo simplificado */}
        <div className="bg-white/5 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <ScrollAnimationWrapper className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl font-display">Nuestro Proceso Simplificado</h2>
                    <p className="mt-4 text-lg text-foreground/80">De la idea al lanzamiento, nuestro proceso está diseñado para ser transparente, colaborativo y enfocado en la excelencia.</p>
                </ScrollAnimationWrapper>
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Iterar sobre los pasos del proceso y mostrarlos en una cuadrícula */}
                    {processSteps.map(step => {
                        const Icon = step.icon
                        return ( <ScrollAnimationWrapper key={step.name} className="text-center"> <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"> <Icon size={24} /> </div> <h3 className="mt-5 text-lg font-semibold text-foreground">{step.name}</h3> <p className="mt-2 text-sm text-foreground/70">{step.description}</p> </ScrollAnimationWrapper> )
                    })}
                </div>
            </div>
        </div>

        {/* CTA final: invitar al usuario a iniciar una conversación */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32 text-center">
            <ScrollAnimationWrapper>
                <h2 className="font-display text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
                    ¿Tienes una idea que necesita <span className="text-primary">despegar</span>?
                </h2>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-foreground/80">
                  Hablemos de tu proyecto, sin compromiso. Analizaremos tus metas y te daremos un plan claro con un presupuesto honesto. La primera consulta es gratis.
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