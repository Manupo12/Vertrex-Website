'use client'

import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper";
import Link from "next/link";
import Image from "next/image"; 


const values = [
    { name: 'Innovación Constante', description: 'No seguimos tendencias, las creamos. Buscamos constantemente nuevas formas de resolver problemas.' },
    { name: 'Calidad y Excelencia', description: 'Cada línea de código y cada estrategia están diseñadas con un compromiso absoluto con la calidad.' },
    { name: 'Colaboración Transparente', description: 'Eres nuestro socio. Mantenemos una comunicación abierta y honesta en cada paso del proyecto.' },
    { name: 'Impacto Local', description: 'Creemos en el potencial de Neiva y la región, y buscamos impulsar el talento y los negocios locales.' },
]

export default function SobreNosotrosPage() {
    return (
        <div className="bg-background text-foreground">
            {/* Sección Hero */}
            <main className="isolate">
                <div className="relative pt-14">
                    <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
                    </div>
                    <div className="py-24 sm:py-32">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <ScrollAnimationWrapper className="mx-auto max-w-2xl text-center">
                                <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl font-display">Innovación con Propósito</h1>
                                <p className="mt-6 text-lg leading-8 text-foreground/80">
                                    Vertrex nació de la convicción de que la tecnología de punta puede y debe ser accesible. Somos más que una empresa de desarrollo; somos arquitectos de soluciones digitales con un profundo compromiso con el ingenio humano y el impacto local.
                                </p>
                            </ScrollAnimationWrapper>
                        </div>
                    </div>
                </div>
            </main>

            {/* Sección Misión y Visión */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
                 <ScrollAnimationWrapper className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-16 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                    <div className="lg:pr-8 lg:pt-4">
                        <div className="lg:max-w-lg">
                            <h2 className="text-base font-semibold leading-7 text-primary font-display tracking-wider">NUESTRA MISIÓN</h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Crear, no solo construir</p>
                            <p className="mt-6 text-lg leading-8 text-foreground/80">
                                Nuestra misión es fusionar la creatividad humana con herramientas tecnológicas avanzadas para desarrollar soluciones digitales que no solo funcionen, sino que inspiren, optimicen y generen un valor real y medible para nuestros clientes y la comunidad.
                            </p>
                        </div>
                    </div>
                    
                    <div className="relative w-full h-80 rounded-xl overflow-hidden">
                        <Image
                            src="/images/sobre-nosotros-mision.webp" 
                            alt="Miembros del equipo de Vertrex colaborando en un proyecto de innovación"
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                        />
                    </div>
                </ScrollAnimationWrapper>
            </div>

            {/* Sección de Valores */}
             <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
                <ScrollAnimationWrapper className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl font-display">Nuestros Principios</h2>
                    <p className="mt-6 text-lg leading-8 text-foreground/80">
                        Estos son los pilares que guían cada decisión, cada línea de código y cada proyecto que emprendemos.
                    </p>
                </ScrollAnimationWrapper>
                <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
                    {values.map((value) => (
                        <ScrollAnimationWrapper key={value.name} className="relative pl-9" delay={0.2}>
                            <dt className="inline font-semibold text-foreground">
                                <div className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-lg bg-primary">
                                <svg className="h-3 w-3 text-background" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                                </div>
                                {value.name}
                            </dt>
                            <dd className="inline text-foreground/70"> {value.description}</dd>
                        </ScrollAnimationWrapper>
                    ))}
                </dl>
            </div>

            {/* Sección CTA */}
            <div className="text-center py-24 sm:py-32">
                 <ScrollAnimationWrapper>
                    <h2 className="font-display text-2xl sm:text-3xl text-foreground">¿Listo para ser parte de la historia?</h2>
                    <div className="mt-8">
                         <Link href="/contacto" className="inline-block rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-background shadow-sm hover:bg-primary/80 transition-all duration-300 hover:shadow-[0_0_20px_theme(colors.primary.DEFAULT)]">
                            Contáctanos
                        </Link>
                    </div>
                 </ScrollAnimationWrapper>
            </div>
        </div>
    )
}