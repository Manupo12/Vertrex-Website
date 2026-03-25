'use client'

// Página de servicios: explica la oferta comercial, beneficios, proceso y llamado final a contacto.

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

// Iconos enfocados a NEGOCIO
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
  HiOutlineShoppingBag,
  HiOutlineShieldCheck,
  HiOutlineKey
} from 'react-icons/hi2'
import { FaRobot, FaAndroid } from 'react-icons/fa'

// --- DATOS DE SERVICIOS (Los 6 originales, enfocados en negocio y con el verde Vertrex) ---
const servicesList = [
    {
        title: "Sitios Web Corporativos",
        subtitle: "Presencia Digital de Alto Impacto",
        description: "El rostro digital de tu empresa. Diseñamos sitios web ultra-rápidos que actúan como tu mejor vendedor 24/7. No usamos plantillas; creamos una arquitectura a medida para que Google te posicione y tus clientes confíen en ti a primera vista.",
        icon: <HiOutlineComputerDesktop className="w-10 h-10"/>,
        idealFor: "Firmas legales, consultoras, agencias y empresas B2B.",
        features: ["Carga Instantánea (<1s)", "Estructura persuasiva para captar Leads", "Optimización SEO nativa", "Panel de administración intuitivo"],
        color: "from-primary/10 to-transparent",
        accent: "text-primary"
    },
    {
        title: "Webs para Negocios Locales",
        subtitle: "Ventas y Reservas en Automático",
        description: "Soluciones específicas para negocios físicos. Convertimos tu presencia digital en una máquina de atraer clientes a tu local. Facilitamos que te encuentren, te compren y reserven sin que tengas que contestar el teléfono.",
        icon: <HiOutlineShoppingBag className="w-10 h-10"/>,
        idealFor: "Restaurantes, gimnasios, clínicas, barberías y tiendas.",
        features: ["Catálogos y Menús QR Digitales", "Sistemas de Reservas y Citas online", "Integración directa con Google Maps", "Redirección de pedidos a WhatsApp"],
        color: "from-primary/10 to-transparent",
        accent: "text-primary"
    },
    {
        title: "Web Apps (PWA)",
        subtitle: "La Evolución de las Aplicaciones",
        description: "La alternativa inteligente a las apps tradicionales. Una sola aplicación que se abre desde un link pero se instala en celulares (iOS y Android) como una app nativa. Evitas las comisiones de Apple/Google y las esperas de aprobación.",
        icon: <HiOutlineDevicePhoneMobile className="w-10 h-10"/>,
        idealFor: "E-commerce, plataformas de contenido, herramientas de uso diario.",
        features: ["Se instala directo desde el navegador", "Funciona sin conexión a internet", "No pagas 30% de comisión a las tiendas", "Actualizaciones en tiempo real para todos"],
        color: "from-primary/10 to-transparent",
        accent: "text-primary"
    },
    {
        title: "Automatización & IA",
        subtitle: "Tu negocio en Piloto Automático",
        description: "Delega las tareas repetitivas a la tecnología. Integramos Inteligencia Artificial y Chatbots que atienden clientes, califican prospectos, agendan citas y responden dudas las 24 horas del día sin cometer errores.",
        icon: <FaRobot className="w-10 h-10"/>,
        idealFor: "Equipos de ventas saturados, atención al cliente masiva, inmobiliarias.",
        features: ["Chatbots inteligentes de WhatsApp 24/7", "Integración con motores como ChatGPT", "Calificación automática de prospectos", "Ahorro drástico en costos operativos"],
        color: "from-primary/10 to-transparent",
        accent: "text-primary"
    },
    {
        title: "Apps Nativas Android",
        subtitle: "Potencia Máxima en Google Play",
        description: "Desarrollo de aplicaciones móviles robustas para Google Play. Ideal cuando tu operación requiere acceso profundo al teléfono: mapas, algoritmos de enrutamiento urbano, GPS en segundo plano o hardware específico. Ponemos tu marca directamente en el bolsillo de tu cliente.",
        icon: <FaAndroid className="w-10 h-10"/>,
        idealFor: "Plataformas de movilidad, ecosistemas de delivery, comunidades.",
        features: ["Acceso a Hardware Nativo (Sensores, NFC)", "Geolocalización y mapas en tiempo real", "Notificaciones Push para retención", "Publicación oficial en Google Play Store"],
        color: "from-primary/10 to-transparent",
        accent: "text-primary"
    },
    {
        title: "Sistemas de Gestión (SaaS)",
        subtitle: "El Cerebro Operativo de tu Empresa",
        description: "Digitalizamos y centralizamos tus procesos manuales o de Excel. Creamos software a medida para controlar inventarios, finanzas, CRMs o logística. Toda la información de tu negocio segura y accesible desde cualquier lugar del mundo.",
        icon: <HiOutlineCpuChip className="w-10 h-10"/>,
        idealFor: "Empresas en crecimiento, logística, hotelería, fábricas.",
        features: ["Dashboards financieros en tiempo real", "Control de accesos para empleados (Roles)", "Generación de reportes automáticos", "Bases de datos privadas y escalables"],
        color: "from-primary/10 to-transparent",
        accent: "text-primary"
    }
];

// --- DATOS DEL PROCESO (Transparencia para el cliente) ---
const processSteps = [
    {
        number: "01",
        title: "Descubrimiento & Estrategia",
        desc: "Nos sentamos contigo a entender tu dolor operativo. No empezamos a programar hasta tener claro cómo esta herramienta te va a hacer ganar dinero o ahorrar tiempo.",
        icon: <HiOutlineChatBubbleBottomCenterText/>
    },
    {
        number: "02",
        title: "Diseño & Prototipo Interactivo",
        desc: "Creamos una maqueta visual. Podrás hacer clic y navegar por tu futura aplicación en tu celular antes de que escribamos una sola línea de código. Cero sorpresas.",
        icon: <HiOutlinePencilSquare/>
    },
    {
        number: "03",
        title: "Ingeniería Ágil",
        desc: "Construimos el sistema en fases. Te mostramos avances funcionales cada semana para que tengas control total del progreso y puedas dar retroalimentación.",
        icon: <HiOutlineCodeBracket/>
    },
    {
        number: "04",
        title: "Despliegue & Capacitación",
        desc: "Lanzamos tu sistema al mundo. Lo conectamos a tus dominios, aseguramos los servidores y le enseñamos a tu equipo exactamente cómo utilizar su nueva herramienta.",
        icon: <HiOutlineRocketLaunch/>
    }
];

export default function ServiciosPage() {
  return (
    <div className="bg-neutral-950 text-white overflow-hidden pb-32">
        
        {/* --- 1. HERO SECTION (Enfoque en Negocio) --- */}
        <div className="relative pt-36 pb-24 sm:pt-48 sm:pb-32 px-6 overflow-hidden border-b border-white/5">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,black,transparent)] pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="mx-auto max-w-5xl text-center relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md"
                >
                    <HiOutlineBolt className="w-4 h-4"/> Soluciones de Alto Rendimiento
                </motion.div>
                
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white font-display leading-[1.1]"
                >
                  Construimos el <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Motor Digital</span> de tu Empresa
                </motion.h1>
                
                <motion.p 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="mt-8 text-xl leading-relaxed text-neutral-400 max-w-3xl mx-auto"
                >
                  No vendemos páginas web genéricas; diseñamos ecosistemas a medida que automatizan procesos, atraen clientes de alto valor y escalan la facturación de tu negocio.
                </motion.p>
            </div>
        </div>
        
        {/* --- 2. CATÁLOGO DE SERVICIOS (Grid 3 Columnas - Tipografía Equilibrada) --- */}
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 mb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {servicesList.map((service, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative bg-neutral-900/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 overflow-hidden hover:border-white/20 transition-all duration-500 hover:-translate-y-1 shadow-xl flex flex-col"
                    >
                        {/* Gradiente de fondo sutil al hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}></div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                            {/* Cabecera del Servicio */}
                            <div className="flex items-start gap-5 mb-8">
                                <div className={`p-3.5 rounded-2xl bg-black/50 border border-white/10 ${service.accent} group-hover:scale-110 transition-transform duration-500 shadow-inner shrink-0`}>
                                    <div className="[&>svg]:w-8 [&>svg]:h-8">{service.icon}</div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2 font-display tracking-tight leading-tight">{service.title}</h3>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${service.accent}`}>{service.subtitle}</p>
                                </div>
                            </div>
                            
                            {/* Descripción Principal (Aumentada a text-base) */}
                            <p className="text-neutral-300 leading-relaxed mb-8 text-base">
                                {service.description}
                            </p>

                            {/* Foco de Negocio */}
                            <div className="mb-8 p-5 bg-black/40 rounded-xl border border-white/5 border-l-2 border-l-white/20">
                                <p className="text-sm text-neutral-300 leading-relaxed">
                                    <strong className="text-white font-bold block mb-1.5 uppercase tracking-wider text-[10px]">Ideal para:</strong>
                                    {service.idealFor}
                                </p>
                            </div>

                            {/* Características / Beneficios (Aumentado a text-sm) */}
                            <div className="mt-auto mb-10">
                                <ul className="flex flex-col gap-4">
                                    {service.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-neutral-400">
                                            <HiOutlineCheckBadge className={`flex-shrink-0 w-5 h-5 ${service.accent} mt-0.5`}/> 
                                            <span className="leading-relaxed">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Botón CTA del Servicio (Más grande y clickeable) */}
                            <div className="pt-6 border-t border-white/5 mt-auto">
                                <Link href="/contacto" className="flex items-center justify-between w-full bg-white/5 hover:bg-primary border border-white/10 hover:border-primary px-6 py-4 rounded-xl text-white hover:text-black font-bold transition-all duration-300 group/link text-sm uppercase tracking-widest">
                                    Cotizar Sistema <HiArrowRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform"/>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* --- 3. GARANTÍAS VERTREX --- */}
        <div className="py-24 bg-neutral-900/30 border-y border-white/5 relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">Nuestro Compromiso</span>
                    <h2 className="text-3xl md:text-5xl font-bold font-display text-white">Ingeniería de Confianza</h2>
                    <p className="mt-4 text-neutral-400 text-lg">No te atamos con contratos ocultos ni te entregamos un sistema que no puedes mantener. Jugamos a tu favor.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-black/40 p-8 rounded-3xl border border-white/5">
                        <HiOutlineBolt className="w-10 h-10 text-primary mb-6" />
                        <h4 className="text-xl font-bold text-white mb-3">Velocidad Extrema</h4>
                        <p className="text-neutral-400 text-sm leading-relaxed">Cada segundo de carga en tu web te cuesta clientes. Nuestras arquitecturas aseguran tiempos de respuesta instantáneos para maximizar tus ventas.</p>
                    </div>
                    <div className="bg-black/40 p-8 rounded-3xl border border-white/5">
                        <HiOutlineShieldCheck className="w-10 h-10 text-primary mb-6" />
                        <h4 className="text-xl font-bold text-white mb-3">Seguridad y Respaldo</h4>
                        <p className="text-neutral-400 text-sm leading-relaxed">Protegemos los datos de tu empresa con encriptación de alto nivel. Tu información y la de tus clientes siempre estará blindada contra ataques.</p>
                    </div>
                    <div className="bg-black/40 p-8 rounded-3xl border border-white/5">
                        <HiOutlineKey className="w-10 h-10 text-primary mb-6" />
                        <h4 className="text-xl font-bold text-white mb-3">Propiedad Absoluta</h4>
                        <p className="text-neutral-400 text-sm leading-relaxed">Código fuente y bases de datos son tuyas desde el día uno. Sin mensualidades abusivas por &quot;alquiler de plataforma&quot;. Eres dueño de tu tecnología.</p>
                    </div>
                </div>
            </div>
        </div>
        
        {/* --- 4. PROCESO DE TRABAJO (REDISEÑO: STICKY SCROLL & TARJETAS HORIZONTALES) --- */}
        <div className="py-24 lg:py-32 relative border-t border-white/5 bg-neutral-950 overflow-hidden">
            {/* Resplandor de fondo sutil */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                    
                    {/* --- LADO IZQUIERDO: TÍTULO FIJO (STICKY) --- */}
                    <div className="lg:w-1/3 lg:sticky lg:top-40 h-fit">
                        <span className="inline-flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs mb-6 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                            <HiOutlineBolt className="w-4 h-4" /> Nuestro Método
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-display mb-6 leading-tight">
                            Cero <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Incertidumbre.</span>
                        </h2>
                        <p className="text-lg text-neutral-400 leading-relaxed">
                            Un proceso transparente diseñado para que siempre sepas qué estamos haciendo, por qué lo hacemos y cuándo estará listo tu ecosistema.
                        </p>
                    </div>

                    {/* --- LADO DERECHO: TARJETAS DE PASOS --- */}
                    <div className="lg:w-2/3 flex flex-col gap-6">
                        {processSteps.map((step, index) => (
                            <motion.div 
                                key={step.number}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-neutral-900/40 backdrop-blur-sm border border-white/5 p-8 sm:p-10 rounded-[2.5rem] flex flex-col sm:flex-row gap-6 sm:gap-8 items-start hover:bg-neutral-800/80 hover:border-white/10 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-500"
                            >
                                {/* Número Grande (Tipografía de Impacto) */}
                                <div className="shrink-0 relative">
                                    <span className="text-5xl md:text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/5 group-hover:from-primary group-hover:to-primary/20 transition-all duration-500">
                                        {step.number}
                                    </span>
                                </div>

                                {/* Contenido del Paso */}
                                <div className="mt-1 sm:mt-2">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 rounded-2xl bg-black/50 border border-white/5 text-primary shadow-inner group-hover:scale-110 group-hover:border-primary/20 transition-all duration-500">
                                            {step.icon}
                                        </div>
                                        <h3 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">{step.title}</h3>
                                    </div>
                                    <p className="text-neutral-400 leading-relaxed text-base sm:text-lg">
                                        {step.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </div>

        {/* --- 5. CTA FINAL --- */}
        <div className="mx-auto max-w-5xl px-6 lg:px-8 mt-10">
            <div className="relative rounded-[3rem] bg-gradient-to-b from-neutral-900 to-black border border-white/10 px-6 py-20 sm:px-16 sm:py-24 overflow-hidden text-center shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
                
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white relative z-10 mb-6">
                    ¿Listo para actualizar tu empresa?
                </h2>
                <p className="mx-auto max-w-2xl text-lg md:text-xl text-neutral-400 relative z-10 leading-relaxed">
                    Hablemos de tus objetivos de negocio. Te daremos un diagnóstico claro, un presupuesto honesto y <strong className="text-white">cero tecnicismos confusos</strong>.
                </p>
                <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 relative z-10">
                    <Link href="/contacto" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm sm:text-base font-bold text-black shadow-xl hover:bg-neutral-200 transition-all hover:scale-105">
                        Solicitar Consulta Gratuita <HiArrowRight />
                    </Link>
                    <Link href="/portafolio" className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm sm:text-base font-bold text-white border border-white/20 hover:bg-white/10 transition-all">
                        Ver Casos de Éxito
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}