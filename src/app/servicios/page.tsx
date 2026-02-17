'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

// Iconos
import { 
  HiOutlineComputerDesktop, 
  HiOutlineDevicePhoneMobile, 
  HiOutlineCpuChip, 
  HiOutlineRocketLaunch,
  HiOutlineChatBubbleBottomCenterText,
    HiOutlinePencilSquare,
    HiOutlineCodeBracket,
    HiOutlineCheckBadge,
  HiArrowRight,
  
  HiOutlineBolt,
  HiOutlineShoppingBag
} from 'react-icons/hi2'
import { FaReact, FaNodeJs, FaAws, FaAndroid, FaApple, FaRobot, FaWhatsapp, FaInstagram } from 'react-icons/fa'
import { SiNextdotjs, SiTailwindcss, SiPostgresql, SiTypescript, SiFirebase, SiStripe, SiOpenai, SiPython } from 'react-icons/si'

// --- DATOS DE SERVICIOS (Actualizado con nuevos servicios) ---
const servicesList = [
    {
        title: "Sitios Web Corporativos",
        subtitle: "Presencia Digital de Alto Impacto",
        description: "El rostro digital de tu empresa. Diseñamos sitios web ultra-rápidos y optimizados para SEO. No usamos plantillas lentas; creamos arquitectura digital a medida para que Google te ame y tus clientes confíen en ti.",
        icon: <HiOutlineComputerDesktop className="w-8 h-8"/>,
        features: ["Carga Instantánea (<1s)", "SEO Técnico Avanzado", "Diseño UI/UX Premium", "Panel Autoadministrable"],
        stack: [<SiNextdotjs key="next"/>, <SiTailwindcss key="tail"/>, <FaReact key="react"/>],
        color: "from-blue-600/20 to-indigo-500/20",
        accent: "text-blue-400"
    },
    {
        title: "Webs para Negocios Locales",
        subtitle: "Restaurantes, Gimnasios, Tiendas",
        description: "Soluciones específicas para negocios físicos. Menús digitales, sistemas de reserva para gimnasios, catálogos para perfumerías. Hacemos que tu negocio local venda mientras duermes.",
        icon: <HiOutlineShoppingBag className="w-8 h-8"/>,
        features: ["Menús QR Digitales", "Sistemas de Reservas/Citas", "Integración con Google Maps", "Botón de Pedido WhatsApp"],
        stack: [<FaInstagram key="ig"/>, <FaWhatsapp key="wa"/>, <SiNextdotjs key="next"/>],
        color: "from-pink-600/20 to-rose-500/20",
        accent: "text-rose-400"
    },
    {
        title: "Web Apps (PWA)",
        subtitle: "Instalable en iPhone & Android",
        description: "La alternativa inteligente a las apps tradicionales. Una sola aplicación que funciona en la web y se instala en celulares (iOS y Android) como una app nativa. Sin pasar por las tiendas, sin comisiones y funcionando offline.",
        icon: <HiOutlineDevicePhoneMobile className="w-8 h-8"/>,
        features: ["Funciona en iOS y Android", "Modo Offline (Sin Internet)", "Sin Comisiones de Apple/Google", "Actualizaciones Inmediatas"],
        stack: [<SiTypescript key="ts"/>, <FaApple key="apple"/>, <FaAndroid key="droid"/>],
        color: "from-violet-600/20 to-fuchsia-500/20",
        accent: "text-fuchsia-400"
    },
    {
        title: "Automatización & IA",
        subtitle: "Chatbots y Procesos Inteligentes",
        description: "Tu negocio funcionando en piloto automático. Integramos Inteligencia Artificial y Chatbots de WhatsApp que atienden clientes 24/7, agendan citas y responden dudas sin intervención humana.",
        icon: <FaRobot className="w-8 h-8"/>,
        features: ["Chatbots de WhatsApp 24/7", "Integración con ChatGPT/OpenAI", "Respuestas Automáticas", "Reducción de Costos Operativos"],
        stack: [<SiOpenai key="ai"/>, <SiPython key="py"/>, <FaWhatsapp key="wa"/>],
        color: "from-emerald-500/20 to-teal-500/20",
        accent: "text-emerald-400"
    },
    {
        title: "Apps Nativas Android",
        subtitle: "Potencia Máxima en Google Play",
        description: "Cuando necesitas acceso total al hardware (Bluetooth, NFC, Sensores) o máximo rendimiento gráfico. Desarrollamos aplicaciones nativas robustas listas para ser publicadas en la Google Play Store.",
        icon: <FaAndroid className="w-8 h-8"/>,
        features: ["Acceso a Hardware Nativo", "Geolocalización en Segundo Plano", "Notificaciones Push Avanzadas", "Publicación en Tienda"],
        stack: [<FaAndroid key="and"/>, <SiFirebase key="fire"/>, <FaNodeJs key="node"/>],
        color: "from-green-600/20 to-lime-500/20",
        accent: "text-lime-400"
    },
    {
        title: "Sistemas de Gestión (SaaS)",
        subtitle: "El Cerebro de tu Empresa",
        description: "Digitalizamos tus procesos manuales. Desde inventarios complejos, CRMs a medida, hasta sistemas de facturación. Centraliza la data de tu negocio en una plataforma segura y accesible desde cualquier lugar.",
        icon: <HiOutlineCpuChip className="w-8 h-8"/>,
        features: ["Dashboards en Tiempo Real", "Roles y Permisos Granulares", "Reportes Automáticos", "Bases de Datos Escalables"],
        stack: [<SiPostgresql key="pg"/>, <SiStripe key="stripe"/>, <FaAws key="aws"/>],
        color: "from-orange-600/20 to-red-500/20",
        accent: "text-orange-400"
    }
];

// --- DATOS DEL PROCESO ---
const processSteps = [
    {
        number: "01",
        title: "Descubrimiento",
        desc: "Nos reunimos para entender tu dolor. No vendemos código, vendemos soluciones a problemas reales.",
        icon: <HiOutlineChatBubbleBottomCenterText/>
    },
    {
        number: "02",
        title: "Diseño & Prototipo",
        desc: "Creamos una maqueta visual interactiva. Verás cómo quedará tu app antes de escribir una sola línea de código.",
        icon: <HiOutlinePencilSquare/>
    },
    {
        number: "03",
        title: "Desarrollo Ágil",
        desc: "Programamos en sprints. Te mostramos avances cada semana para que tengas control total del progreso.",
        icon: <HiOutlineCodeBracket/>
    },
    {
        number: "04",
        title: "Lanzamiento",
        desc: "Desplegamos en servidores, configuramos dominios o tiendas, y te capacitamos para usar tu nueva herramienta.",
        icon: <HiOutlineRocketLaunch/>
    }
];

export default function ServiciosPage() {
  return (
    <div className="bg-background text-foreground overflow-hidden pb-32">
        
        {/* --- 1. HERO SECTION (Técnico & Directo) --- */}
        <div className="relative pt-36 pb-24 sm:pt-48 sm:pb-32 px-6">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="mx-auto max-w-4xl text-center relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-primary text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md"
                >
                    <HiOutlineBolt className="w-4 h-4"/> Soluciones Integrales
                </motion.div>
                
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight text-white font-display leading-[1.1]"
                >
                  Construimos el <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">Motor Digital</span> de tu Negocio
                </motion.h1>
                
                <motion.p 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="mt-8 text-xl leading-8 text-neutral-400 max-w-2xl mx-auto"
                >
                  Desde sitios web de alto impacto hasta sistemas de gestión e Inteligencia Artificial. Tecnología de punta adaptada al mercado real.
                </motion.p>
            </div>
        </div>
        
        {/* --- 2. SERVICIOS (BENTO GRID) --- */}
        <div className="mx-auto max-w-[1400px] px-6 mb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 auto-rows-fr">
                {servicesList.map((service, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className={`group relative bg-neutral-900 border border-white/10 rounded-[2.5rem] p-8 lg:p-10 overflow-hidden hover:border-white/20 transition-colors flex flex-col`}
                    >
                        {/* Gradiente de fondo al hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 ${service.accent} group-hover:scale-110 transition-transform duration-300`}>
                                    {service.icon}
                                </div>
                                {/* Stack Tecnológico Flotante */}
                                <div className="flex -space-x-2">
                                    {service.stack.map((icon, i) => (
                                        <div key={i} className="w-10 h-10 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-white/50 text-lg shadow-lg">
                                            {icon}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                            <p className={`text-xs font-bold uppercase tracking-wider mb-6 ${service.accent}`}>{service.subtitle}</p>
                            
                            <p className="text-neutral-400 leading-relaxed mb-8 flex-1 text-sm">
                                {service.description}
                            </p>

                            <div className="bg-neutral-950/50 rounded-xl p-5 border border-white/5">
                                <ul className="grid grid-cols-1 gap-3">
                                    {service.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                                            <HiOutlineCheckBadge className={`flex-shrink-0 w-4 h-4 ${service.accent}`}/> 
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5">
                                <Link href="/contacto" className="inline-flex items-center gap-2 text-white font-bold hover:text-primary transition-colors group/link text-sm">
                                    Cotizar este servicio <HiArrowRight className="group-hover/link:translate-x-1 transition-transform"/>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* --- 3. STACK TECNOLÓGICO (MARQUEE) --- */}
        <div className="py-20 bg-neutral-950 border-y border-white/5 overflow-hidden relative">
            <div className="mx-auto max-w-7xl px-6 text-center mb-12">
                <span className="text-primary font-bold tracking-widest uppercase text-xs">Nuestras Herramientas</span>
                <h3 className="text-2xl text-white font-display mt-2">Tecnología de Clase Mundial</h3>
            </div>
            
            {/* Logos Grid */}
            <div className="mx-auto max-w-5xl px-6 flex flex-wrap justify-center gap-12 lg:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <SiNextdotjs className="w-12 h-12 text-white hover:text-white transition-colors" title="Next.js"/>
                <FaReact className="w-12 h-12 text-white hover:text-[#61DAFB] transition-colors" title="React"/>
                <SiTailwindcss className="w-12 h-12 text-white hover:text-[#38BDF8] transition-colors" title="Tailwind"/>
                <SiTypescript className="w-12 h-12 text-white hover:text-[#3178C6] transition-colors" title="TypeScript"/>
                <FaNodeJs className="w-12 h-12 text-white hover:text-[#339933] transition-colors" title="Node.js"/>
                <SiPython className="w-12 h-12 text-white hover:text-[#3776AB] transition-colors" title="Python"/>
                <SiOpenai className="w-12 h-12 text-white hover:text-[#10A37F] transition-colors" title="OpenAI"/>
                <FaAws className="w-12 h-12 text-white hover:text-[#FF9900] transition-colors" title="AWS"/>
            </div>
        </div>
        
        {/* --- 4. PROCESO DE TRABAJO (TIMELINE) --- */}
        <div className="bg-background py-32 relative">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl font-display">Cómo Trabajamos</h2>
                    <p className="mt-4 text-lg text-neutral-400">Eliminamos la incertidumbre. Un proceso transparente desde la primera reunión hasta la entrega final.</p>
                </div>

                <div className="relative">
                    {/* Línea conectora central (Desktop) */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent hidden lg:block"></div>

                    <div className="space-y-12 lg:space-y-24">
                        {processSteps.map((step, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <motion.div 
                                    key={step.number}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${isEven ? '' : 'lg:flex-row-reverse'}`}
                                >
                                    {/* Contenido */}
                                    <div className={`flex-1 text-center ${isEven ? 'lg:text-right' : 'lg:text-left'}`}>
                                        <div className="inline-block p-3 rounded-xl bg-white/5 border border-white/10 text-primary text-2xl mb-4">
                                            {step.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                                        <p className="text-neutral-400 leading-relaxed">{step.desc}</p>
                                    </div>

                                    {/* Número Central */}
                                    <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-neutral-900 border-4 border-neutral-950 shadow-2xl z-10">
                                        <div className="absolute inset-0 rounded-full border border-primary/30"></div>
                                        <span className="text-xl font-bold text-primary font-mono">{step.number}</span>
                                    </div>

                                    {/* Espacio vacío para balancear */}
                                    <div className="flex-1 hidden lg:block"></div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>

        {/* --- 5. CTA FINAL --- */}
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center mt-20">
            <div className="p-1 rounded-[2.5rem] bg-gradient-to-r from-primary/30 to-purple-500/30">
                <div className="bg-neutral-950 rounded-[2.4rem] px-6 py-16 sm:px-16 sm:py-20 overflow-hidden relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[url('/noise.png')] opacity-[0.05] pointer-events-none"></div>
                    
                    <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-5xl relative z-10">
                        ¿Tienes un proyecto en mente?
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg text-neutral-300 relative z-10">
                      Hablemos de tus objetivos. Te daremos un plan claro, un presupuesto honesto y cero tecnicismos confusos.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                        <Link href="/contacto" className="inline-block rounded-full bg-white px-8 py-4 text-lg font-bold text-black shadow-xl hover:bg-neutral-200 transition-all hover:scale-105">
                            Solicitar Cotización Gratis
                        </Link>
                        <Link href="/portafolio" className="inline-block rounded-full px-8 py-4 text-lg font-bold text-white border border-white/20 hover:bg-white/10 transition-all">
                            Ver Nuestro Trabajo
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}