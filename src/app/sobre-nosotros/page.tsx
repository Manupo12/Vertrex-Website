'use client'

import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper";
import Link from "next/link";
import { 
  HiOutlineUserGroup, 
  HiOutlineLightBulb, 
  HiOutlineScale, 
  HiOutlineHeart,
  HiOutlineCodeBracketSquare,
  HiOutlineRocketLaunch
} from "react-icons/hi2";

// Datos de valores actualizados
const values = [
    {
        name: "Accesibilidad Real",
        description: "La tecnología no debe ser un lujo. Democratizamos el acceso a software de calidad para que desde el vendedor ambulante hasta el gran empresario tengan las mismas armas digitales.",
        icon: <HiOutlineScale className="w-6 h-6"/>
    },
    {
        name: "Código con Propósito",
        description: "No escribimos líneas por escribir. Cada proyecto tiene una misión: resolver un problema humano, facilitar un trabajo o conectar a una comunidad.",
        icon: <HiOutlineCodeBracketSquare className="w-6 h-6"/>
    },
    {
        name: "Innovación Local",
        description: "Creemos en el talento de nuestra región. Construimos soluciones desde Neiva para el mundo, demostrando que aquí también se crea tecnología de punta.",
        icon: <HiOutlineLightBulb className="w-6 h-6"/>
    },
    {
        name: "Empatía Digital",
        description: "Entendemos tus miedos y tus sueños. No te hablamos en binario, te hablamos de negocio a negocio, de persona a persona.",
        icon: <HiOutlineHeart className="w-6 h-6"/>
    },
];

export default function SobreNosotrosPage() {
    return (
        <div className="bg-background text-foreground overflow-hidden">
            
            {/* --- 1. HERO MANIFIESTO (Sin Imágenes, Pura Tipografía) --- */}
            <section className="relative pt-32 pb-20 px-6 sm:pt-40 sm:pb-24">
                {/* Fondo abstracto con código/ruido */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415-.828-.828-.828.828-1.415-1.415.828-.828-.828-.828 1.415-1.415.828.828.828-.828 1.415 1.415-.828.828zM22.485 0l.83.828-1.415 1.415-.828-.828-.828.828-1.415-1.415.828-.828-.828-.828 1.415-1.415.828.828.828-.828 1.415 1.415-.828.828zM0 22.485l.828.83-1.415 1.415-.828-.828-.828.828L-3.658 22.485l.828-.828-.828-.828 1.415-1.415.828.828.828-.828 1.415 1.415-.828.828zM0 54.627l.828.83-1.415 1.415-.828-.828-.828.828L-3.658 54.627l.828-.828-.828-.828 1.415-1.415.828.828.828-.828 1.415 1.415-.828.828zM54.627 60l.83-.828-1.415-1.415-.828.828-.828-.828-1.415 1.415.828.828-.828.828 1.415 1.415-.828-.828-.828.828 1.415-1.415.828-.828zM22.485 60l.83-.828-1.415-1.415-.828.828-.828-.828-1.415 1.415.828.828-.828.828 1.415 1.415-.828-.828-.828.828 1.415-1.415.828-.828z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="mx-auto max-w-5xl text-center relative z-10">
                    <ScrollAnimationWrapper>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-primary text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
                            <HiOutlineUserGroup /> Manifiesto Vertrex
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white font-display leading-none mb-8">
                            El Software como <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">Motor de Progreso.</span>
                        </h1>
                        <p className="mt-6 text-xl leading-relaxed text-neutral-400 max-w-3xl mx-auto">
                            No somos solo una agencia de desarrollo. Somos ingenieros con una convicción: <strong className="text-white">la tecnología iguala el terreno de juego.</strong> Queremos que tu idea, sea pequeña o gigante, tenga las mismas herramientas digitales que las grandes corporaciones.
                        </p>
                    </ScrollAnimationWrapper>
                </div>
            </section>

            {/* --- 2. FILOSOFÍA "PARA TODOS" (Diseño Grid Conceptual) --- */}
            <section className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Tarjeta 1: Concepto */}
                    <ScrollAnimationWrapper className="bg-neutral-900/50 border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all duration-500"></div>
                        <h3 className="text-3xl font-bold text-white font-display mb-4">Sin Excepciones.</h3>
                        <p className="text-neutral-400 text-lg leading-relaxed mb-8">
                            Hemos visto cómo grandes ideas mueren por falta de acceso a tecnología. En Vertrex rompemos esa barrera. 
                            <br/><br/>
                            ¿Tienes una tienda de barrio? Te hacemos un sistema de inventario. ¿Eres una universidad? Creamos tu campus digital. ¿Tienes una startup unicornio? Escalamos tu arquitectura.
                        </p>
                        <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                            <div className="flex -space-x-4">
                                <div className="w-12 h-12 rounded-full bg-neutral-800 border-2 border-neutral-900 flex items-center justify-center text-xl">👩‍🍳</div>
                                <div className="w-12 h-12 rounded-full bg-neutral-800 border-2 border-neutral-900 flex items-center justify-center text-xl">👨‍💻</div>
                                <div className="w-12 h-12 rounded-full bg-neutral-800 border-2 border-neutral-900 flex items-center justify-center text-xl">🧑‍🌾</div>
                                <div className="w-12 h-12 rounded-full bg-neutral-800 border-2 border-neutral-900 flex items-center justify-center text-xl">👷</div>
                            </div>
                            <span className="text-sm font-medium text-white">Construimos para todos.</span>
                        </div>
                    </ScrollAnimationWrapper>

                    {/* Tarjeta 2: La Realidad (Estadística Visual) */}
                    <ScrollAnimationWrapper delay={0.2} className="bg-white text-black rounded-[2.5rem] p-10 relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute bottom-[-10%] right-[-10%] opacity-10">
                            <HiOutlineRocketLaunch className="w-64 h-64" />
                        </div>
                        <h3 className="text-6xl font-bold font-display mb-2 tracking-tighter">100%</h3>
                        <p className="text-xl font-medium mb-6">Compromiso con tu visión.</p>
                        <p className="text-black/70 text-lg leading-relaxed">
                            No nos importa el tamaño de tu presupuesto inicial, nos importa el tamaño de tu visión. Si tu idea ayuda a la comunidad o hace crecer tu negocio, encontraremos la forma técnica de hacerla realidad.
                        </p>
                    </ScrollAnimationWrapper>

                </div>
            </section>

            {/* --- 3. NUESTROS PRINCIPIOS (Grid de Valores) --- */}
             <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-24 lg:px-8 mb-32">
                <ScrollAnimationWrapper className="mx-auto max-w-2xl text-center mb-16">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs">Nuestro ADN</span>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl font-display">Principios Inquebrantables</h2>
                </ScrollAnimationWrapper>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((value, idx) => (
                        <ScrollAnimationWrapper key={value.name} delay={idx * 0.1} className="bg-neutral-900 border border-white/5 p-8 rounded-2xl hover:border-primary/30 transition-colors group">
                            <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                {value.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{value.name}</h3>
                            <p className="text-sm text-neutral-400 leading-relaxed">
                                {value.description}
                            </p>
                        </ScrollAnimationWrapper>
                    ))}
                </div>
            </div>

            {/* --- 4. CTA FINAL (Enfoque en la acción) --- */}
            <div className="relative border-t border-white/10">
                <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 text-center">
                     <ScrollAnimationWrapper>
                        <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
                            Tu idea merece existir.
                        </h2>
                         <p className="mx-auto max-w-2xl text-xl leading-8 text-neutral-400 mb-10">
                            Deja de pensar que el software a medida es solo para grandes corporaciones. 
                            Hablemos hoy mismo y descubramos cómo la tecnología puede transformar tu realidad.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                             <Link href="/contacto" className="inline-block rounded-full bg-primary px-8 py-4 text-lg font-bold text-black shadow-[0_0_30px_theme(colors.primary.DEFAULT)] hover:shadow-[0_0_50px_theme(colors.primary.DEFAULT)] hover:scale-105 transition-all duration-300">
                                Iniciar Conversación
                            </Link>
                            <Link href="/portafolio" className="inline-block rounded-full px-8 py-4 text-lg font-bold text-white border border-white/20 hover:bg-white/10 transition-all">
                                Ver Lo Que Hacemos
                            </Link>
                        </div>
                     </ScrollAnimationWrapper>
                </div>
            </div>
        </div>
    )
}