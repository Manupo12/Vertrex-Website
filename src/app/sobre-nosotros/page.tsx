'use client'

import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper";
import Link from "next/link";
import { 
  HiOutlineUserGroup, 
  HiOutlineLightBulb, 
  HiOutlineScale, 
  HiOutlineHeart,
  HiOutlineCodeBracketSquare,
  HiOutlineRocketLaunch,
  HiArrowRight,
  HiOutlineGlobeAmericas,
  HiOutlineSparkles
} from "react-icons/hi2";

// Datos de valores (El ADN)
const values = [
    {
        name: "Accesibilidad Real",
        description: "La tecnología no debe ser un lujo. Democratizamos el acceso a software de calidad para que desde el vendedor local hasta la gran empresa compitan con las mismas armas digitales.",
        icon: <HiOutlineScale className="w-8 h-8"/>,
        colSpan: "col-span-1 lg:col-span-2" // Tarjeta ancha
    },
    {
        name: "Código con Propósito",
        description: "No escribimos líneas por escribir. Cada ecosistema tiene una misión clara: resolver un problema humano, eliminar fricción o conectar a una comunidad entera.",
        icon: <HiOutlineCodeBracketSquare className="w-8 h-8"/>,
        colSpan: "col-span-1"
    },
    {
        name: "Innovación desde Neiva",
        description: "Creemos en el talento de nuestra región. Construimos soluciones desde Colombia para el mundo, demostrando que aquí también se crea tecnología de punta.",
        icon: <HiOutlineGlobeAmericas className="w-8 h-8"/>,
        colSpan: "col-span-1"
    },
    {
        name: "Empatía Digital",
        description: "Entendemos tus miedos y el riesgo de invertir. No te hablamos en código binario ni tecnicismos; te hablamos de negocio a negocio, cuidando tu rentabilidad.",
        icon: <HiOutlineHeart className="w-8 h-8"/>,
        colSpan: "col-span-1 lg:col-span-2" // Tarjeta ancha
    },
];

export default function SobreNosotrosPage() {
    return (
        <div className="bg-neutral-950 text-white min-h-screen selection:bg-primary selection:text-black font-sans">
            
            {/* --- 1. HERO MANIFIESTO EDITORIAL --- */}
            <section className="relative pt-40 pb-24 px-6 lg:pt-56 lg:pb-32 overflow-hidden border-b border-white/5">
                {/* Iluminación dramática */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

                <div className="mx-auto max-w-[1400px] relative z-10">
                    <ScrollAnimationWrapper>
                        <div className="flex flex-col lg:flex-row items-end justify-between gap-12 lg:gap-24">
                            
                            <div className="w-full lg:w-3/5">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
                                    <HiOutlineSparkles className="w-3 h-3" /> Manifiesto Vertrex
                                </div>
                                <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-bold tracking-tighter text-white font-display leading-[1.05] mb-6">
                                    El software no es un lujo.<br/>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Es tu derecho a competir.</span>
                                </h1>
                            </div>

                            <div className="w-full lg:w-2/5 pb-4">
                                <div className="border-l-2 border-primary/40 pl-6">
                                    <p className="text-xl leading-relaxed text-neutral-400 font-light">
                                        No somos una agencia tradicional. Somos ingenieros con una convicción: <strong className="text-white font-normal">la tecnología nivela el terreno de juego.</strong> Queremos que tu idea tenga el mismo poder digital que una corporación.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </ScrollAnimationWrapper>
                </div>
            </section>

            {/* --- 2. EL PROBLEMA Y NUESTRA RESPUESTA (Contraste Visual) --- */}
            <section className="py-32 relative overflow-hidden">
                <div className="mx-auto max-w-[1400px] px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        
                        {/* La Declaración (Texto Inmenso) */}
                        <div className="lg:col-span-7">
                            <ScrollAnimationWrapper>
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display leading-tight text-white mb-8">
                                    Hemos visto grandes ideas morir <span className="text-neutral-600 line-through decoration-primary decoration-4">por falta de presupuesto.</span>
                                </h2>
                                <p className="text-lg text-neutral-400 leading-relaxed mb-6">
                                    Históricamente, el desarrollo de software a medida ha estado reservado para élites. Si no tenías miles de dólares, te conformabas con plantillas lentas o sistemas que no se adaptaban a tu operación real.
                                </p>
                                <p className="text-lg text-neutral-300 leading-relaxed font-medium">
                                    En Vertrex rompemos esa barrera. Optimizamos nuestra ingeniería para construir ecosistemas robustos, rápidos y escalables para <span className="text-primary underline decoration-primary/30 underline-offset-4">cualquier etapa de negocio</span>.
                                </p>
                            </ScrollAnimationWrapper>
                        </div>

                        {/* La Prueba (Tarjeta de Impacto) */}
                        <div className="lg:col-span-5">
                            <ScrollAnimationWrapper delay={0.2} className="bg-gradient-to-br from-neutral-900 to-black border border-white/10 rounded-[3rem] p-10 sm:p-12 relative overflow-hidden shadow-2xl">
                                {/* Resplandor interno */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>
                                
                                <div className="relative z-10">
                                    <HiOutlineRocketLaunch className="w-12 h-12 text-primary mb-8" />
                                    <h3 className="text-7xl font-display font-black text-white tracking-tighter mb-2">100%</h3>
                                    <p className="text-xl font-bold text-primary tracking-widest uppercase text-[12px] mb-6">Compromiso con tu visión</p>
                                    
                                    <p className="text-neutral-400 text-sm leading-relaxed mb-8">
                                        ¿Una tienda de barrio? Hacemos tu inventario. ¿Una universidad? Tu campus digital. No importa el tamaño inicial, encontraremos la ruta técnica para hacerlo realidad.
                                    </p>

                                    {/* Representación visual de "Para Todos" */}
                                    <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                                        <div className="flex -space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-neutral-800 border-2 border-neutral-900 flex items-center justify-center text-sm shadow-lg">👨‍🍳</div>
                                            <div className="w-10 h-10 rounded-full bg-neutral-800 border-2 border-neutral-900 flex items-center justify-center text-sm shadow-lg">👩‍💻</div>
                                            <div className="w-10 h-10 rounded-full bg-neutral-800 border-2 border-neutral-900 flex items-center justify-center text-sm shadow-lg">🧑‍🎓</div>
                                            <div className="w-10 h-10 rounded-full bg-neutral-800 border-2 border-neutral-900 flex items-center justify-center text-sm shadow-lg">👷</div>
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Ingeniería sin exclusión</span>
                                    </div>
                                </div>
                            </ScrollAnimationWrapper>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- 3. NUESTRO ADN (Bento Grid Arquitectónico) --- */}
             <section className="py-24 bg-neutral-900/20 border-y border-white/5">
                <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
                    <ScrollAnimationWrapper className="max-w-3xl mb-16">
                        <span className="text-primary font-bold tracking-widest uppercase text-xs flex items-center gap-2 mb-4">
                            <HiOutlineUserGroup className="w-4 h-4"/> Nuestra Cultura
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-display mb-6">Principios Inquebrantables</h2>
                        <p className="text-lg text-neutral-400">Las reglas bajo las cuales escribimos cada línea de código y cerramos cada trato.</p>
                    </ScrollAnimationWrapper>
                    
                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                        {values.map((value, idx) => (
                            <ScrollAnimationWrapper 
                                key={value.name} 
                                delay={idx * 0.1} 
                                className={`bg-black border border-white/5 p-8 sm:p-10 rounded-[2.5rem] hover:border-primary/30 transition-colors group flex flex-col justify-between ${value.colSpan}`}
                            >
                                <div>
                                    <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4 font-display tracking-tight">{value.name}</h3>
                                </div>
                                <p className="text-base text-neutral-400 leading-relaxed">
                                    {value.description}
                                </p>
                            </ScrollAnimationWrapper>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- 4. CTA FINAL (Minimalista y Directo) --- */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

                <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
                     <ScrollAnimationWrapper>
                        <h2 className="font-display text-5xl sm:text-6xl font-bold text-white mb-6 tracking-tight">
                            Tu idea merece existir.
                        </h2>
                         <p className="mx-auto max-w-2xl text-xl leading-relaxed text-neutral-400 mb-12">
                            Deja de pensar que el software a medida es solo para los gigantes de Silicon Valley. 
                            Hablemos hoy mismo y descubramos cómo la ingeniería puede transformar tu realidad.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                             <Link href="/contacto" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-black hover:bg-primary transition-all duration-300 group">
                                Iniciar Conversación <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/portafolio" className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-bold text-white border border-white/20 hover:bg-white/10 transition-all">
                                Ver Lo Que Hacemos
                            </Link>
                        </div>
                     </ScrollAnimationWrapper>
                </div>
            </section>

        </div>
    )
}