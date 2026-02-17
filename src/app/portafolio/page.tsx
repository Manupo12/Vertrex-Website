'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

// Iconos
import { 
    HiArrowRight,
    HiOutlineComputerDesktop,
    HiOutlineDevicePhoneMobile,
    HiOutlineGlobeAlt,
    HiOutlineShoppingCart,
    HiOutlineCpuChip,
    HiOutlineHeart,
    HiMap,
    HiOutlineAcademicCap,
    HiOutlineKey,
    HiOutlineTicket,
    HiOutlineCubeTransparent,
    HiOutlineCloudArrowDown,
    HiOutlineCalendar,
    HiOutlineUserGroup,
    HiCheckCircle
} from 'react-icons/hi2'
import { FaAndroid, FaNutritionix, FaBed, FaWhatsapp, FaExternalLinkAlt } from 'react-icons/fa'

// --- DATOS ---

const clientsData = [
  {
    id: 'ser-deseable',
    title: 'Ser Deseable',
    subtitle: 'Salud, Nutrición & Longevidad',
    category: 'Caso de Éxito',
    description: 'Transformamos un método de entrenamiento personal en una plataforma digital escalable globalmente. Integra herramientas interactivas (calculadoras), tienda online con gestión de inventario y un área de usuarios privada. Diseño enfocado en la conversión y retención.',
    link: 'https://www.serdeseable.site/',
    images: { desktop: "/images/serdeseablepc.png", mobile: "/images/serdeseablemv.png" },
    color: "from-rose-600/20 to-orange-500/20",
    accent: "text-rose-400",
    border: "border-rose-500/30",
    features: [
      { icon: <FaNutritionix/>, text: "Calculadoras Interactivas" },
      { icon: <HiOutlineShoppingCart/>, text: "E-commerce Integrado" },
      { icon: <HiOutlineGlobeAlt/>, text: "Bilingüe (ES/EN)" }
    ]
  }
];

const communityData = [
    {
        id: 'opita-go',
        title: 'Opita Go',
        subtitle: 'Movilidad Urbana Gratuita',
        category: 'Ingeniería Social',
        description: 'Una iniciativa propia de Vertrex para Neiva. Desarrollamos esta aplicación para resolver el caos del transporte público (SETP). Utiliza algoritmos de grafos para calcular rutas sin necesidad de internet, ayudando a miles de ciudadanos diariamente.',
        link: 'https://github.com/Manupo12/opita-go',
        images: { desktop: "/images/opitago-desktop.png", mobile: "/images/opitago-mobile.png" },
        color: "from-cyan-500/20 to-blue-600/20",
        accent: "text-cyan-400",
        border: "border-cyan-500/30",
        features: [
            { icon: <HiMap/>, text: "GPS Offline Propio" },
            { icon: <FaAndroid/>, text: "App Nativa Android" },
            { icon: <HiOutlineDevicePhoneMobile/>, text: "PWA Instalable" }
        ]
    },
    {
        id: 'campus-usco',
        title: 'Campus USCO',
        subtitle: 'Ecosistema Universitario',
        category: 'Ingeniería Social',
        description: 'Plataforma integral para estudiantes de la Surcolombiana. Centraliza un Marketplace seguro para comercio estudiantil, sistema de reporte de objetos perdidos y herramientas académicas como simuladores de promedio.',
        link: '#',
        images: { desktop: "/images/usco-desktop.png", mobile: "/images/usco-mobile.png" },
        color: "from-emerald-500/20 to-green-600/20",
        accent: "text-emerald-400",
        border: "border-emerald-500/30",
        features: [
            { icon: <HiOutlineShoppingCart/>, text: "Marketplace Seguro" },
            { icon: <HiOutlineAcademicCap/>, text: "Dashboard Académico" },
            { icon: <HiOutlineHeart/>, text: "Comunidad & Objetos Perdidos" }
        ]
    }
];

const templatesData = [
    {
        id: 'hotel-pro',
        title: 'HotelPro',
        category: 'Plantilla Hotelera',
        description: 'Web con motor de reservas propio. Permite gestionar disponibilidad, tarifas y limpieza desde un panel admin.',
        images: { desktop: "/images/hotelpro-desktop.png", mobile: "/images/hotelpro-mobile.png" },
        color: "from-indigo-600/10 to-purple-600/10",
        accent: "text-indigo-400",
        features: [{ icon: <HiOutlineCalendar/>, text: "Motor Reservas" }, { icon: <FaBed/>, text: "Gestión Cuartos" }]
    },
    {
        id: 'motel-pro',
        title: 'MotelPro',
        category: 'Sistema SaaS',
        description: 'Software especializado para alta rotación. Controla tiempos, minibar, lavandería y facturación POS.',
        images: { desktop: "/images/motelpro-desktop.png", mobile: "/images/motelpro-mobile.png" },
        color: "from-red-600/10 to-pink-600/10",
        accent: "text-red-400",
        features: [{ icon: <HiOutlineKey/>, text: "Control Turnos" }, { icon: <HiOutlineCloudArrowDown/>, text: "Modo Offline" }]
    },
    {
        id: 'fiest-pro',
        title: 'FiestPro',
        category: 'Eventos & Tickets',
        description: 'Plataforma para promotores. Venta de entradas QR, tienda de merch y app de portero para escanear accesos.',
        images: { desktop: "/images/fiestpro-desktop.png", mobile: "/images/fiestpro-mobile.png" },
        color: "from-yellow-500/10 to-orange-500/10",
        accent: "text-yellow-400",
        features: [{ icon: <HiOutlineTicket/>, text: "Venta QR" }, { icon: <HiOutlineUserGroup/>, text: "App Portero" }]
    },
    {
        id: 'campus-template',
        title: 'LMS Corporativo',
        category: 'Educación',
        description: 'Sistema para vender y gestionar cursos online. Reproductor de video privado, quizzes y certificados.',
        images: { desktop: "/images/lms-desktop.png", mobile: "/images/lms-mobile.png" },
        color: "from-blue-500/10 to-cyan-500/10",
        accent: "text-blue-400",
        features: [{ icon: <HiOutlineComputerDesktop/>, text: "Cursos Online" }, { icon: <HiOutlineCpuChip/>, text: "Progreso Alumno" }]
    }
];

// --- COMPONENTE VISUALIZADOR (CORE) ---
const DeviceVisualizer = ({ images, color, className = "" }: { images: { desktop: string, mobile: string }, color: string, className?: string }) => {
    const [view, setView] = useState<'desktop' | 'mobile'>('desktop');

    return (
        <div className={`relative w-full h-full min-h-[350px] bg-neutral-900/50 flex flex-col items-center justify-center p-6 overflow-hidden rounded-2xl border border-white/5 ${className}`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-20 pointer-events-none`}></div>

            <div className="absolute top-4 right-4 z-30 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/10 flex gap-2 shadow-xl">
                <button onClick={() => setView('desktop')} className={`p-2 rounded-full transition-all duration-300 ${view === 'desktop' ? 'bg-white text-black scale-105' : 'text-white/50 hover:text-white'}`} title="Ver en Escritorio">
                    <HiOutlineComputerDesktop className="w-4 h-4"/>
                </button>
                <button onClick={() => setView('mobile')} className={`p-2 rounded-full transition-all duration-300 ${view === 'mobile' ? 'bg-white text-black scale-105' : 'text-white/50 hover:text-white'}`} title="Ver en Móvil">
                    <HiOutlineDevicePhoneMobile className="w-4 h-4"/>
                </button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div 
                    key={view}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`relative z-20 shadow-2xl transition-all duration-500 flex justify-center items-center w-full h-full`}
                >
                    {view === 'desktop' ? (
                        <div className="w-full aspect-[16/10] max-w-2xl rounded-lg border border-white/10 bg-neutral-950 overflow-hidden relative group">
                            <div className="h-6 bg-neutral-900 border-b border-white/5 flex items-center px-3 gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                            </div>
                            <div className="relative w-full h-full">
                                <Image src={images.desktop} alt="Desktop View" fill className="object-cover object-top" />
                            </div>
                        </div>
                    ) : (
                        <div className="h-[320px] sm:h-[400px] aspect-[9/19] bg-black rounded-[2.5rem] border-[6px] border-neutral-800 shadow-xl overflow-hidden relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-neutral-900 rounded-b-xl z-20"></div>
                            <div className="relative w-full h-full">
                                <Image src={images.mobile} alt="Mobile View" fill className="object-cover object-top" />
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

// --- BARRA DE NAVEGACIÓN INTELIGENTE (SCROLL SPY) ---
const PortfolioNav = () => {
    const [activeSection, setActiveSection] = useState('produccion');

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['produccion', 'comunidad', 'plantillas'];
            // Offset de 250px para que detecte la sección un poco antes de que llegue arriba del todo
            const scrollPosition = window.scrollY + 250; 

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const height = element.offsetHeight;
                    
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
                        setActiveSection(section);
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            // Offset para el sticky header
            const y = element.getBoundingClientRect().top + window.scrollY - 120;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <div className="sticky top-20 z-40 w-full flex justify-center px-4 mb-16">
            <div className="bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-full p-1.5 flex items-center gap-1 shadow-2xl transition-all">
                {[
                    { id: 'produccion', label: 'Producción' },
                    { id: 'comunidad', label: 'Comunidad' },
                    { id: 'plantillas', label: 'Plantillas' }
                ].map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                            activeSection === item.id 
                            ? 'bg-white text-black shadow-lg scale-105' 
                            : 'text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

// --- PÁGINA PRINCIPAL ---
export default function PortafolioPage() {
  return (
    <main className="bg-background selection:bg-primary selection:text-background pb-32">
      
      {/* HEADER */}
      <section className="relative pt-36 pb-8 px-6 overflow-hidden">
        <div className="mx-auto max-w-4xl text-center relative z-10">
            <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-bold tracking-tight text-white font-display"
            >
              Nuestro Trabajo <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">Habla</span>
            </motion.h1>
            <p className="mt-6 text-lg text-neutral-400 max-w-2xl mx-auto">
              Resultados reales, impacto social y soluciones de negocio listas para usar.
            </p>
        </div>
      </section>

      {/* BARRA DE NAVEGACIÓN INTELIGENTE */}
      <PortfolioNav />

      {/* 1. SECCIÓN: CASOS DE ÉXITO (CLIENTES) */}
      <section id="produccion" className="mx-auto max-w-[1400px] px-6 mb-32 scroll-mt-32">
        <div className="flex items-center gap-4 mb-10">
            <span className="h-px flex-1 bg-white/10"></span>
            <span className="text-primary font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <FaExternalLinkAlt/> En Producción
            </span>
            <span className="h-px flex-1 bg-white/10"></span>
        </div>

        <div className="flex flex-col gap-20">
            {clientsData.map(project => (
                <div key={project.id} className="group relative bg-neutral-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 p-8 lg:p-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className={`inline-block px-3 py-1 rounded-full border bg-neutral-950/50 ${project.border} ${project.accent} text-[10px] font-bold uppercase tracking-wider mb-6`}>
                                {project.category}
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white font-display mb-4">{project.title}</h2>
                            <p className="text-xl text-neutral-300 mb-6">{project.subtitle}</p>
                            <p className="text-neutral-400 leading-relaxed mb-8 text-sm md:text-base border-l-2 border-white/10 pl-6">
                                {project.description}
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                                {project.features.map((f, i) => (
                                    <div key={i} className="flex items-center gap-3 text-neutral-300 text-sm">
                                        <div className={`p-2 rounded-lg bg-white/5 ${project.accent}`}>{f.icon}</div>
                                        <span>{f.text}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href={`/portafolio/${project.id}`} className="inline-flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-full font-bold hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                Ver Proyecto <HiArrowRight />
                            </Link>
                        </div>

                        <div className="order-1 lg:order-2 h-[400px] lg:h-[500px]">
                            <DeviceVisualizer images={project.images} color={project.color} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* 2. SECCIÓN: IMPACTO SOCIAL (COMUNIDAD) */}
      <section id="comunidad" className="mx-auto max-w-[1400px] px-6 mb-32 scroll-mt-32">
        <div className="flex items-center gap-4 mb-10">
            <span className="h-px flex-1 bg-white/10"></span>
            <span className="text-rose-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <HiOutlineHeart/> Tecnología para la Comunidad
            </span>
            <span className="h-px flex-1 bg-white/10"></span>
        </div>

        <div className="space-y-24">
            {communityData.map((project, index) => (
                <div key={project.id} className={`flex flex-col lg:flex-row gap-12 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                    <div className="w-full lg:w-3/5 h-[400px] lg:h-[550px]">
                        <DeviceVisualizer images={project.images} color={project.color} className="shadow-2xl" />
                    </div>

                    <div className="w-full lg:w-2/5">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-2 py-1 rounded-md bg-white/5 text-neutral-400 text-[10px] font-bold uppercase border border-white/10">Sin Ánimo de Lucro</span>
                            <span className={`px-2 py-1 rounded-md bg-white/5 text-[10px] font-bold uppercase border border-white/10 ${project.accent}`}>Propiedad Vertrex</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white font-display mb-2">{project.title}</h3>
                        <p className={`text-lg font-medium mb-6 ${project.accent}`}>{project.subtitle}</p>
                        
                        <div className="bg-white/5 border border-white/5 rounded-xl p-6 mb-8">
                            <p className="text-neutral-400 text-sm leading-relaxed">{project.description}</p>
                        </div>
                        
                        <div className="space-y-3 mb-8">
                            {project.features.map((f, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-neutral-300">
                                    <HiCheckCircle className={`w-5 h-5 ${project.accent}`}/>
                                    <span>{f.text}</span>
                                </div>
                            ))}
                        </div>

                        <Link href={`/portafolio/${project.id}`} className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold border transition-all hover:scale-105 ${project.id === 'opita-go' ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-emerald-500 text-black border-emerald-500'}`}>
                            {project.id === 'opita-go' ? 'Usar Opita Go' : 'Ver Proyecto'} <FaExternalLinkAlt/>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* 3. SECCIÓN: PLANTILLAS DE NEGOCIO (CATÁLOGO) */}
      <section id="plantillas" className="mx-auto max-w-[1400px] px-6 mb-20 scroll-mt-32">
        <div className="flex items-center gap-4 mb-12">
            <span className="h-px flex-1 bg-white/10"></span>
            <span className="text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <HiOutlineCubeTransparent className="text-primary"/> Soluciones Listas para Usar
            </span>
            <span className="h-px flex-1 bg-white/10"></span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {templatesData.map(template => (
                <div key={template.id} className="bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden hover:border-primary/30 transition-all duration-300 flex flex-col">
                    {/* Visualizador Integrado */}
                    <div className="h-[350px] w-full border-b border-white/5">
                        <DeviceVisualizer images={template.images} color={template.color} className="rounded-none border-0 bg-transparent" />
                    </div>
                    
                    <div className="p-8 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${template.accent}`}>{template.category}</div>
                                <h3 className="text-2xl font-bold text-white">{template.title}</h3>
                            </div>
                            <span className="bg-white/5 text-neutral-400 p-2 rounded-lg border border-white/5">
                                <HiOutlineCubeTransparent className="w-5 h-5"/>
                            </span>
                        </div>
                        
                        <p className="text-neutral-400 text-sm mb-6 flex-1">{template.description}</p>
                        
                        <div className="flex gap-4 mb-6 pt-6 border-t border-white/5">
                            {template.features.map((f, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-xs font-medium text-neutral-300">
                                    <span className={template.accent}>{f.icon}</span>
                                    <span>{f.text}</span>
                                </div>
                            ))}
                        </div>

                        <Link href={`/portafolio/${template.id}`} className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
                            Ver Detalles <HiArrowRight/>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
        
        <div className="mt-12 text-center">
            <p className="text-sm text-neutral-500 italic">
                * Estas soluciones incluyen panel administrativo y bases de datos configuradas. Se personalizan con tu marca.
            </p>
        </div>
      </section>

      {/* CTA FINAL */}
      <div className="mt-32 mx-auto max-w-3xl text-center px-6">
        <h2 className="text-3xl font-bold text-white font-display mb-6">¿Listo para empezar?</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="https://wa.me/573000000000" className="inline-flex items-center justify-center gap-2 bg-primary text-background px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_30px_theme(colors.primary.DEFAULT)] transition-all">
                <FaWhatsapp size={24}/> Cotizar Proyecto
            </Link>
            <Link href="/contacto" className="inline-flex items-center justify-center gap-2 bg-neutral-800 text-white px-8 py-4 rounded-full font-bold text-lg border border-white/10 hover:bg-neutral-700 transition-all">
                Ver Planes
            </Link>
        </div>
      </div>

    </main>
  )
}