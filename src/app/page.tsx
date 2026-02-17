'use client'

// --- Importaciones ---
import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import { TypeAnimation } from 'react-type-animation'

// Iconos
import { 
  HiArrowRight, 
  HiOutlineSparkles, 
  HiOutlineDevicePhoneMobile,
  HiOutlineCpuChip,
  HiOutlineComputerDesktop, 
  HiOutlineCloudArrowDown,
  HiMap, 
  HiOutlineGlobeAlt,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineShoppingCart,
  HiOutlineQrCode,
  HiOutlineCalendar,
  HiOutlineUserGroup,
  HiOutlineCubeTransparent,
  HiOutlineLightBulb,
  HiOutlineMegaphone, 
  HiOutlineBell,      
  HiOutlineChartBar,  
  HiOutlineIdentification, 
    HiOutlineHeart
} from 'react-icons/hi2'
import { FaWhatsapp, FaAndroid, FaNutritionix, FaBed, FaInstagram, FaFacebookF, FaGlobe, FaGraduationCap, FaExternalLinkAlt } from 'react-icons/fa'

// Datos de Demos
import { demos } from '@/lib/demos-data'

// Local lightweight project type used by this page (matches the inline `projectsData` shape)
type ProjectLite = {
    id: string;
    title: string;
    subtitle?: string;
    category?: string;
    description?: string;
    tags?: string[];
    link?: string;
    buttonText?: string;
    images: { desktop: string; mobile: string };
    features: { icon: React.ReactNode; title?: string; desc?: string; text?: string }[];
    color?: string;
    accent?: string;
    bgBtn?: string;
}

// --- 1. DATOS DE PROYECTOS REALES (CLIENTES DE PAGO) ---
const projectsData = [
  {
    id: 'ser-deseable',
    title: 'Ser Deseable',
    subtitle: 'Salud, Nutrición & Longevidad',
    category: 'Plataforma Web & E-commerce',
    description: 'Transformamos un método de entrenamiento en un ecosistema digital completo. Una plataforma moderna diseñada para guiar a los usuarios hacia una vida más saludable con herramientas interactivas y comercio integrado.',
    tags: ['En Producción', 'Web App', 'Bilingüe'],
    link: 'https://www.serdeseable.site/',
    buttonText: 'Visitar Plataforma',
    images: { desktop: "/images/pagados/serdeseable/serdeseablepc.png", mobile: "/images/pagados/serdeseable/serdeseablemv.png" },
    features: [
      { icon: <FaNutritionix/>, title: "Calculadora Nutricional", desc: "Herramienta interactiva personalizada" },
      { icon: <HiOutlineShoppingCart/>, title: "Tienda Integrada", desc: "Carrito dinámico y gestión de pedidos" },
      { icon: <HiOutlineGlobeAlt/>, title: "Multi-Idioma", desc: "Experiencia fluida en Español e Inglés" },
      { icon: <HiOutlineCpuChip/>, title: "Panel Administrativo", desc: "Gestión total de usuarios e inventario" }
    ],
        color: "from-primary/20 to-primary/20",
        accent: "text-primary"
  }
];

// --- 2. DATOS DE PROYECTOS COMUNITARIOS (SOCIAL IMPACT) ---
const communityProjects = [
    {
        id: 'opita-go',
        title: 'Opita Go',
        subtitle: 'Movilidad Inteligente para Neiva',
        mission: 'Ayudar a los ciudadanos a navegar el caos del transporte público sin costo alguno.',
        description: 'Una iniciativa de Vertrex para la ciudad. Opita Go resuelve la falta de información del sistema SETP mediante algoritmos propios de enrutamiento. Es una herramienta gratuita que ahorra tiempo y dinero a miles de neivanos.',
        tags: ['Impacto Social', 'Gratuito', 'Propiedad Vertrex'],
        link: 'https://opita-go-web.vercel.app/', 
        buttonText: 'Usar Opita Go',
        images: { desktop: "/images/social/opitago/escritorio.png", mobile: "/images/social/opitago/movil.png" },
        features: [
            { icon: <HiMap/>, title: "Algoritmos GPS Offline", desc: "Funciona sin datos móviles." },
            { icon: <FaAndroid/>, title: "Nativa & PWA", desc: "Instalable en cualquier celular." },
            { icon: <HiOutlineDevicePhoneMobile/>, title: "UX Accesible", desc: "Diseño para todas las edades." },
            { icon: <HiOutlineQrCode/>, title: "Sin Anuncios", desc: "Enfoque 100% en la utilidad." }
        ],
        color: "from-primary/20 to-primary/20",
        accent: "text-primary",
        bgBtn: "bg-primary"
    },
    {
        id: 'campus-usco',
        title: 'Campus USCO Digital',
        subtitle: 'Ecosistema Universitario Integral',
        mission: 'Centralizar la vida académica y comercial de la Universidad Surcolombiana.',
        description: 'Una super-app diseñada para conectar a la comunidad universitaria. Desde vender productos en el marketplace seguro hasta encontrar objetos perdidos y calcular promedios académicos. Todo lo que un estudiante necesita en un solo lugar.',
        tags: ['Comunidad USCO', 'Herramienta Estudiantil', 'Ecosistema'],
        link: '#',
        buttonText: 'Ver Proyecto',
        images: { desktop: "/images/usco-desktop.png", mobile: "/images/usco-mobile.png" },
        features: [
            { icon: <HiOutlineShoppingCart/>, title: "Marketplace USCO", desc: "Comercio seguro entre estudiantes." },
            { icon: <HiOutlineChartBar/>, title: "Dashboard Académico", desc: "Cálculo de promedios y créditos." },
            { icon: <HiOutlineIdentification/>, title: "Objetos Perdidos", desc: "Sistema de reporte comunitario." },
            { icon: <HiOutlineUserGroup/>, title: "Profesores y Reseñas", desc: "Directorio colaborativo." },
            { icon: <HiOutlineMegaphone/>, title: "Anuncios Oficiales", desc: "Eventos y convocatorias." },
            { icon: <HiOutlineBell/>, title: "Notificaciones Push", desc: "Alertas inteligentes." }
        ],
        color: "from-primary/20 to-primary/20",
        accent: "text-primary",
        bgBtn: "bg-primary"
    }
];

// --- 3. DATOS DE PLANTILLAS (SOLUCIONES DE NEGOCIO) ---
const templatesData = [
    {
        id: 'hotel-pro',
        title: 'HotelPro',
        subtitle: 'Sistema de Reservas Hotelero',
        category: 'Plantilla para Hoteles',
        description: 'Web completa con motor de reservas propio. Permite a los huéspedes ver disponibilidad en tiempo real y reservar.',
        tags: ['Motor Reservas', 'Admin Panel'],
        link: '#',
        buttonText: 'Ver Demo',
        images: { desktop: "/images/hotelpro-desktop.png", mobile: "/images/hotelpro-mobile.png" },
        features: [
            { icon: <HiOutlineCalendar/>, title: "Motor de Reservas", desc: "Disponibilidad en tiempo real" },
            { icon: <FaBed/>, title: "Gestión Habitaciones", desc: "Control de estados y limpieza" }
        ],
        color: "from-primary/10 to-primary/10",
        accent: "text-primary"
    },
    {
        id: 'motel-pro',
        title: 'MotelPro',
        subtitle: 'Gestión Operativa para Moteles',
        category: 'Sistema SaaS',
        description: 'Software para alta rotación. Controla tiempos, minibar, lavandería y facturación electrónica. Interfaz táctil.',
        tags: ['Control Turnos', 'Facturación DIAN'],
        link: '#', 
        buttonText: 'Ver Demo',
        images: { desktop: "/images/motelpro-desktop.png", mobile: "/images/motelpro-mobile.png" },
        features: [
            { icon: <HiOutlineShoppingCart/>, title: "Minibar & Cocina", desc: "Inventario y comandas" },
            { icon: <HiOutlineCloudArrowDown/>, title: "Modo Offline", desc: "Funciona sin internet" }
        ],
        color: "from-primary/10 to-primary/10",
        accent: "text-primary"
    },
    {
        id: 'fiest-pro',
        title: 'FiestPro',
        subtitle: 'Ticketing & Eventos',
        category: 'Plataforma Eventos',
        description: 'Plataforma "All-in-One". Venta de entradas QR, tienda merch y control de acceso.',
        tags: ['QR Tickets', 'Control Acceso'],
        link: '#', 
        buttonText: 'Ver Demo',
        images: { desktop: "/images/fiestpro-desktop.png", mobile: "/images/fiestpro-mobile.png" },
        features: [
            { icon: <HiOutlineQrCode/>, title: "Scanner QR", desc: "Control de acceso rápido" },
            { icon: <HiOutlineUserGroup/>, title: "Promotores", desc: "Métricas por RRPP" }
        ],
        color: "from-primary/10 to-primary/10",
        accent: "text-primary"
    },
    {
        id: 'campus-template',
        title: 'LMS Corporativo',
        subtitle: 'Plataforma de Cursos',
        category: 'Educación',
        description: 'Sistema para vender y gestionar cursos online. Incluye reproductor de video, quizzes y certificados.',
        tags: ['E-learning', 'Certificados'],
        link: '#', 
        buttonText: 'Ver Demo',
        images: { desktop: "/images/lms-desktop.png", mobile: "/images/lms-mobile.png" }, // Placeholder
        features: [
            { icon: <FaGraduationCap/>, title: "Cursos Online", desc: "Gestión de contenido" },
            { icon: <HiOutlineCpuChip/>, title: "Progreso", desc: "Tracking de estudiantes" }
        ],
        color: "from-primary/10 to-primary/10",
        accent: "text-primary"
    }
];

// --- 1. HERO SECTION ---
const HeroSection = () => {
  const [activeService, setActiveService] = useState(0);

  const services = [
    { text: 'tu página web', icon: <HiOutlineComputerDesktop className="w-16 h-16 sm:w-20 sm:h-20 text-primary" /> },
    { text: 'tu app Android', icon: <FaAndroid className="w-16 h-16 sm:w-20 sm:h-20 text-primary" /> },
    { text: 'tu Web PWA', icon: <HiOutlineCloudArrowDown className="w-16 h-16 sm:w-20 sm:h-20 text-primary" /> },
    { text: 'tu sistema de gestión', icon: <HiOutlineCpuChip className="w-16 h-16 sm:w-20 sm:h-20 text-primary" /> },
  ];

  return (
    <section className="relative flex min-h-[95svh] items-center justify-center overflow-hidden bg-background px-4 sm:px-6 pt-20">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-white/5 blur-[100px]"></div>
      </div>
      
      <div className="z-10 mx-auto max-w-5xl text-center">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-8 backdrop-blur-md hover:bg-white/10 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Desarrollo de Software en Neiva
            </span>

            <div className="h-24 sm:h-28 mb-4 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeService}
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="drop-shadow-[0_0_15px_rgba(0,255,127,0.3)]"
                    >
                        {services[activeService].icon}
                    </motion.div>
                </AnimatePresence>
            </div>
            
            <h1 className="font-display text-4xl font-bold text-foreground sm:text-6xl lg:text-7xl leading-[1.1]">
              Creamos{' '}
              <br className="block sm:hidden" />
              <TypeAnimation
                sequence={[
                  services[0].text, 2000, () => setActiveService(1),
                  services[1].text, 2000, () => setActiveService(2),
                  services[2].text, 2000, () => setActiveService(3),
                  services[3].text, 2000, () => setActiveService(0),
                ]}
                wrapper="span"
                speed={50}
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary"
                repeat={Infinity}
              />
              <br />
              a la medida.
            </h1>
            
            <p className="mx-auto mt-8 max-w-2xl text-lg text-foreground/70 leading-relaxed">
              Transformamos tu visión en tecnología real. Sitios web, sistemas de gestión y aplicaciones móviles (Android & PWA).
              <br className="hidden sm:block"/> Potencia, diseño y estrategia en un solo lugar.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="https://wa.me/573000000000?text=Hola,%20quiero%20cotizar%20un%20proyecto" 
                  target="_blank"
                  className="group relative inline-flex h-14 w-full sm:w-auto items-center justify-center overflow-hidden rounded-full bg-primary px-8 font-bold text-background transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-[0_0_30px_theme(colors.primary.DEFAULT)]"
                >
                  <span className="mr-2"><FaWhatsapp size={22} /></span>
                  Cotizar mi Proyecto
                </Link>
                <Link 
                  href="#portafolio" 
                  className="inline-flex h-14 w-full sm:w-auto items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 font-medium text-foreground transition-all hover:bg-white/10 hover:border-white/20"
                >
                  Ver Casos de Éxito
                </Link>
            </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- COMPONENTE TARJETA DE PROYECTO (REUTILIZABLE) ---
const ProjectCard = ({ project, variant = 'default' }: { project: ProjectLite, variant?: 'default' | 'template' }) => {
    const [view, setView] = useState<'desktop' | 'mobile'>('desktop');

    // Estilos dinámicos según la variante
    const cardBgClass = variant === 'default' ? 'bg-neutral-900 border-white/10' : 'bg-neutral-800/50 border-white/10';
    const infoBgClass = variant === 'default' ? 'bg-neutral-900' : 'bg-transparent';
    const visualizerBgClass = variant === 'default' ? 'bg-neutral-950/50' : 'bg-neutral-900/30';

    return (
        <div className="h-full">
            <div className={`rounded-[2rem] ${cardBgClass} border overflow-hidden shadow-2xl relative h-full flex flex-col lg:flex-row group transition-colors duration-300`}>
                
                {/* BADGE PARA PLANTILLAS */}
                {variant === 'template' && (
                    <div className="absolute top-4 left-4 z-30 flex items-center gap-1.5 bg-primary text-black text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                        <HiOutlineCubeTransparent className="w-4 h-4" />
                        Solución Lista
                    </div>
                )}

                {/* Fondo ambiental */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-10 pointer-events-none`}></div>

                {/* --- LADO A: VISUALIZADOR --- */}
                <div className={`relative w-full lg:w-[55%] min-h-[350px] lg:min-h-[500px] ${visualizerBgClass} flex flex-col items-center justify-center p-6 overflow-hidden`}>
                    
                    {/* Botones de Vista */}
                    <div className={`absolute ${variant === 'template' ? 'top-4 right-4' : 'top-6'} z-30 bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/10 flex gap-2 shadow-xl`}>
                        <button onClick={() => setView('desktop')} className={`p-2 rounded-full transition-all duration-300 ${view === 'desktop' ? 'bg-white text-black shadow-lg scale-105' : 'text-white/50 hover:text-white hover:bg-white/10'}`}><HiOutlineComputerDesktop className="w-5 h-5" /></button>
                        <button onClick={() => setView('mobile')} className={`p-2 rounded-full transition-all duration-300 ${view === 'mobile' ? 'bg-white text-black shadow-lg scale-105' : 'text-white/50 hover:text-white hover:bg-white/10'}`}><HiOutlineDevicePhoneMobile className="w-5 h-5" /></button>
                    </div>

                    {/* Imagen */}
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={view}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }} 
                            className={`relative z-20 shadow-2xl transition-all duration-500
                                ${view === 'desktop' ? 'w-full max-w-xl aspect-[16/10] rounded-xl border border-white/5' : 'h-[380px] aspect-[9/19] rounded-[2rem] border-8 border-neutral-800 bg-neutral-800'}
                            `}
                        >
                             <div className="w-full h-full bg-cover bg-top rounded-[inherit] overflow-hidden" style={{ backgroundImage: `url('${view === 'desktop' ? project.images.desktop : project.images.mobile}')` }}>
                                <div className={`absolute inset-0 bg-gradient-to-t ${variant === 'default' ? 'from-black/50' : 'from-black/20'} to-transparent opacity-60`}></div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* --- LADO B: INFORMACIÓN --- */}
                <div className={`relative w-full lg:w-[45%] ${infoBgClass} p-8 lg:p-10 flex flex-col lg:border-l border-white/5`}>
                    <div className="mb-4">
                        <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${project.accent} flex items-center gap-2`}>
                            {variant === 'default' && <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>}
                            {project.category}
                        </div>
                        <h3 className={`font-bold text-white mb-2 font-display leading-tight ${variant === 'default' ? 'text-3xl lg:text-4xl' : 'text-2xl lg:text-3xl'}`}>
                            {project.title}
                        </h3>
                        <p className="text-base text-white/70 font-medium">{project.subtitle}</p>
                    </div>

                    <p className={`text-neutral-400 text-sm leading-relaxed mb-6 border-l-2 border-white/10 pl-4 ${variant === 'template' ? 'line-clamp-3 lg:line-clamp-none' : ''}`}>
                        {project.description}
                    </p>

                    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 ${variant === 'template' ? 'lg:grid-cols-1 lg:gap-2' : ''}`}>
                        {project.features.map((feature: { icon: React.ReactNode; text?: string; detail?: string; title?: string; desc?: string }, i: number) => (
                            <div key={i} className={`flex items-start gap-3 ${variant === 'template' ? 'p-2' : 'bg-white/5 p-3 rounded-xl border border-white/5'} transition-colors group/feature`}>
                                <div className={`text-lg mt-0.5 ${project.accent} group-hover/feature:scale-110 transition-transform origin-left`}>{feature.icon}</div>
                                <div>
                                    <h5 className="text-white font-bold text-xs mb-0.5">{feature.title}</h5>
                                    {variant === 'default' && <p className="text-neutral-500 text-[10px] leading-tight">{feature.desc}</p>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/5 flex flex-wrap gap-4 items-center justify-between">
                        {variant === 'default' && (
                            <div className="flex flex-wrap gap-2">
                                {(project.tags ?? []).map((tag: string, idx: number) => (
                                    <span key={idx} className="bg-black/40 border border-white/10 text-white/70 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <Link href={project.link ?? '#'} target="_blank" className={`group/btn flex items-center gap-3 ${variant === 'default' ? 'bg-white text-black hover:bg-neutral-200' : 'bg-primary text-black hover:bg-primary/90'} font-bold py-3 px-6 rounded-xl transition-all ml-auto`}>
                            <span>{project.buttonText}</span>
                            <HiArrowRight className="group-hover/btn:translate-x-1 transition-transform"/>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- 2. PROJECTS SHOWCASE (CARRUSEL PROYECTOS REALES) ---
const ProjectsShowcase = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
        emblaApi.on('select', onSelect);
        
        const interval = setInterval(() => {
            if (emblaApi.canScrollNext()) emblaApi.scrollNext();
        }, 8000); 

        return () => {
            clearInterval(interval);
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    return (
        <section id="portafolio" className="py-24 bg-neutral-950 relative overflow-hidden">
            <div className="mx-auto max-w-[1400px] px-4 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 px-4">
                    <div className="max-w-2xl">
                         <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">Casos de Éxito</span>
                        <h2 className="text-3xl font-bold font-display text-white sm:text-5xl">Impacto Real</h2>
                        <p className="mt-4 text-neutral-400 text-lg">
                            Ecosistemas digitales a medida que transforman negocios y generan ingresos.
                        </p>
                    </div>
                    
                    <div className="flex gap-2 mt-6 md:mt-0">
                        <button onClick={scrollPrev} className="p-3 rounded-full border border-white/10 text-white hover:bg-white hover:text-black transition-all"><HiChevronLeft size={20} /></button>
                        <button onClick={scrollNext} className="p-3 rounded-full border border-white/10 text-white hover:bg-white hover:text-black transition-all"><HiChevronRight size={20} /></button>
                    </div>
                </div>

                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex -ml-4 touch-pan-y">
                        {projectsData.map((project) => (
                            <div key={project.id} className="flex-[0_0_100%] min-w-0 px-4">
                                <ProjectCard project={project} variant="default" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center gap-2 mt-8">
                    {projectsData.map((_, index) => (
                        <button key={index} onClick={() => emblaApi && emblaApi.scrollTo(index)} className={`h-1.5 rounded-full transition-all duration-500 ${index === selectedIndex ? 'w-12 bg-white' : 'w-2 bg-white/20'}`} aria-label={`Ir al proyecto ${index + 1}`} />
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- 3. COMMUNITY SHOWCASE (REDISEÑADO: SISTEMA DE PESTAÑAS ESCALABLE) ---
const CommunityShowcase = () => {
    // Estado para la pestaña (proyecto) activo
    const [activeIndex, setActiveIndex] = useState(0);
    const [view, setView] = useState<'desktop' | 'mobile'>('desktop');
    
    const activeProject = communityProjects[activeIndex];

    // Resetear vista al cambiar de pestaña
    useEffect(() => {
        setView('desktop');
    }, [activeIndex]);

    return (
        <section className="py-24 bg-neutral-950 relative overflow-hidden border-t border-white/5">
            {/* Patrón de puntos para diferenciar */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            <div className="mx-auto max-w-[1400px] px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">Responsabilidad Social</span>
                    <h2 className="text-3xl font-bold font-display text-white sm:text-5xl">Tecnología para la Comunidad</h2>
                    <p className="mt-4 text-neutral-400 text-lg">
                        Herramientas gratuitas creadas por Vertrex para mejorar la vida en nuestra ciudad y universidad.
                    </p>
                </div>

                {/* --- NAVEGACIÓN DE PESTAÑAS (SCROLL HORIZONTAL) --- */}
                <div className="flex justify-center mb-12">
                    <div className="flex gap-2 overflow-x-auto pb-4 max-w-full px-4 no-scrollbar">
                        {communityProjects.map((project, index) => (
                            <button
                                key={project.id}
                                onClick={() => setActiveIndex(index)}
                                className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border ${
                                    activeIndex === index 
                                    ? `bg-white text-black border-white scale-105 shadow-lg shadow-white/10` 
                                    : 'bg-neutral-900 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {project.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- CONTENIDO DEL PROYECTO ACTIVO (ANIMADO) --- */}
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeProject.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
                    >
                        {/* LADO VISUALIZADOR */}
                        <div className="w-full relative group order-2 lg:order-1">
                            <div className={`absolute -inset-4 bg-gradient-to-r ${activeProject.color} rounded-[3rem] opacity-30 blur-2xl group-hover:opacity-50 transition-opacity duration-500`}></div>
                            
                            <div className="relative rounded-[2rem] border border-white/10 bg-neutral-900 overflow-hidden shadow-2xl">
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/10 flex gap-2">
                                    <button 
                                        onClick={() => setView('desktop')} 
                                        className={`p-2 rounded-full transition-all ${view === 'desktop' ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
                                        title="Vista Escritorio"
                                    >
                                        <HiOutlineComputerDesktop className="w-4 h-4"/>
                                    </button>
                                    <button 
                                        onClick={() => setView('mobile')} 
                                        className={`p-2 rounded-full transition-all ${view === 'mobile' ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
                                        title="Vista Móvil"
                                    >
                                        <HiOutlineDevicePhoneMobile className="w-4 h-4"/>
                                    </button>
                                </div>

                                <div className={`relative w-full ${view === 'desktop' ? 'aspect-video' : 'aspect-[4/3] flex items-center justify-center bg-neutral-900 py-8'}`}>
                                    <AnimatePresence mode="wait">
                                        <motion.div 
                                            key={view}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-full h-full flex items-center justify-center"
                                        >
                                            {view === 'desktop' ? (
                                                <div className="w-full h-full bg-cover bg-top" style={{ backgroundImage: `url('${activeProject.images.desktop}')` }}></div>
                                            ) : (
                                                <div className="h-[90%] aspect-[9/19] rounded-2xl border-4 border-neutral-700 overflow-hidden relative shadow-xl">
                                                    <div className="w-full h-full bg-cover bg-top" style={{ backgroundImage: `url('${activeProject.images.mobile}')` }}></div>
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* LADO INFO */}
                        <div className="w-full order-1 lg:order-2">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="p-2 rounded-lg bg-white/5 text-white border border-white/5"><HiOutlineHeart className="w-5 h-5 text-rose-500"/></span>
                                <span className={`text-xs font-bold uppercase tracking-widest ${activeProject.accent}`}>Iniciativa Propia</span>
                            </div>
                            
                            <h3 className="text-4xl font-bold text-white font-display mb-2">{activeProject.title}</h3>
                            <p className="text-xl text-white/60 mb-6">{activeProject.subtitle}</p>
                            
                            <div className="bg-white/5 border border-white/5 rounded-xl p-6 mb-8 relative overflow-hidden">
                                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${activeProject.color}`}></div>
                                <p className="text-neutral-300 italic mb-2">&quot;{activeProject.mission}&quot;</p>
                                <p className="text-sm text-neutral-500">{activeProject.description}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                {activeProject.features.map((feature: { icon: React.ReactNode; title: string; desc?: string }, i: number) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className={`mt-1 text-lg ${activeProject.accent}`}>{feature.icon}</div>
                                        <div>
                                            <h5 className="text-white font-bold text-sm">{feature.title}</h5>
                                            <p className="text-xs text-neutral-500">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                <Link href={activeProject.link} target="_blank" className={`rounded-full px-8 py-3 font-bold text-black ${activeProject.bgBtn || 'bg-white'} hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-white/10`}>
                                    {activeProject.buttonText} <FaExternalLinkAlt />
                                </Link>
                                {(activeProject.tags ?? []).map((tag: string) => (
                                    <span key={tag} className="px-3 py-1 rounded-full border border-white/10 text-xs text-neutral-400 font-medium">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    )
}

// --- 4. PLANTILLAS DE NEGOCIO (MASTER-DETAIL) ---
const TemplatesShowcase = () => {
    const [selectedTemplate, setSelectedTemplate] = useState(templatesData[0]);

    return (
        <section className="py-24 bg-background relative border-t border-white/5 overflow-hidden">
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)] pointer-events-none"></div>

            <div className="mx-auto max-w-[1400px] px-6 lg:px-8 relative z-10">
                
                <div className="mb-12 text-center lg:text-left">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">Acelera tu Negocio</span>
                    <h2 className="text-3xl font-bold font-display text-foreground sm:text-5xl">Catálogo de Software</h2>
                    <p className="mt-4 text-foreground/70 text-lg max-w-2xl">
                        Soluciones pre-construidas, probadas y listas para desplegar. Elige tu industria y empieza hoy.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-[600px]">
                    <div className="w-full lg:w-1/3 flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {templatesData.map((template) => {
                            const isActive = selectedTemplate.id === template.id;
                            return (
                                <button
                                    key={template.id}
                                    onClick={() => setSelectedTemplate(template)}
                                    className={`group text-left p-5 rounded-xl border transition-all duration-300 relative overflow-hidden
                                        ${isActive 
                                            ? 'bg-neutral-800 border-primary/50 shadow-lg shadow-primary/5' 
                                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                                        }
                                    `}
                                >
                                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className={`font-bold text-lg mb-1 ${isActive ? 'text-white' : 'text-neutral-300 group-hover:text-white'}`}>{template.title}</h4>
                                            <p className="text-xs text-primary font-medium uppercase tracking-wider mb-2">{template.category}</p>
                                        </div>
                                        <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/20 text-primary' : 'bg-white/5 text-neutral-500'}`}>
                                            <HiArrowRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-1' : ''}`}/>
                                        </div>
                                    </div>
                                    <p className="text-sm text-neutral-500 line-clamp-2 group-hover:text-neutral-400">{template.description}</p>
                                </button>
                            )
                        })}
                    </div>

                    <div className="w-full lg:w-2/3 relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedTemplate.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                <ProjectCard project={selectedTemplate} variant="template" />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- 5. SERVICES SECTION ---
const ServicesSection = () => {
    return (
        <section className="py-24 px-6 bg-neutral-950 border-t border-white/5">
            <div className="mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold font-display text-white sm:text-4xl">¿Qué construimos?</h2>
                    <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
                        Soluciones tecnológicas adaptadas a la etapa de tu negocio.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Servicio 1 */}
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group">
                        <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform shadow-lg shadow-black/50">
                            <HiOutlineSparkles size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 font-display">Página Web Profesional</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                            Diseño estético y presentación impecable. Ideal para marcas personales y negocios que buscan destacar visualmente.
                        </p>
                    </div>

                    {/* Servicio 2 */}
                    <div className="p-8 rounded-2xl bg-gradient-to-b from-primary/10 to-transparent border border-primary/20 hover:shadow-[0_0_30px_rgba(0,255,127,0.1)] transition-all group relative">
                        <div className="absolute top-0 right-0 bg-primary text-background text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                            MÁS SOLICITADO
                        </div>
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                            <HiOutlineCpuChip size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 font-display">Sistemas de Gestión</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                            Automatizamos tu negocio. Controla inventarios, ventas y usuarios desde un panel administrativo centralizado.
                        </p>
                    </div>

                    {/* Servicio 3 */}
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors group">
                        <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform shadow-lg shadow-black/50">
                            <HiOutlineCloudArrowDown size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 font-display">Apps Android & Web PWA</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                            Soluciones móviles inteligentes. Desarrollamos <strong>Apps Nativas para Android</strong> y <strong>Web Apps Progresivas (PWA)</strong> instalables.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

// --- 6. DEMOS / LABORATORIO DE CONCEPTOS (REDISEÑADO & MEJORADO) ---
const LabShowcase = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [view, setView] = useState<'desktop' | 'mobile'>('desktop');
    
    const nextDemo = () => { setCurrentIndex((prev) => (prev + 1) % demos.length); setView('desktop'); };
    const prevDemo = () => { setCurrentIndex((prev) => (prev - 1 + demos.length) % demos.length); setView('desktop'); };
    
    const demo = demos[currentIndex];
    const variant = demo.variants[0];

    return (
        <section className="py-24 bg-background relative overflow-hidden border-t border-white/5">
            <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="mx-auto max-w-[1400px] px-6 lg:px-8 relative z-10">
                
                <div className="mb-16 flex flex-col md:flex-row items-end justify-between gap-6">
                    <div className="max-w-2xl">
                        <span className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs mb-2">
                            <HiOutlineLightBulb className="w-4 h-4" /> Laboratorio de Conceptos
                        </span>
                        <h2 className="text-3xl font-bold font-display text-foreground sm:text-5xl">Visiones de Futuro</h2>
                        <p className="mt-4 text-foreground/70 text-lg">
                            Conceptos de ingeniería diseñados proactivamente. Demostraciones visuales de lo que tu marca podría llegar a ser.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-mono text-foreground/40">{String(currentIndex + 1).padStart(2, '0')} / {String(demos.length).padStart(2, '0')}</span>
                        <div className="flex gap-2">
                            <button onClick={prevDemo} className="p-4 rounded-full border border-white/10 hover:bg-primary hover:text-black transition-all text-foreground"><HiChevronLeft size={20} /></button>
                            <button onClick={nextDemo} className="p-4 rounded-full border border-white/10 hover:bg-primary hover:text-black transition-all text-foreground"><HiChevronRight size={20} /></button>
                        </div>
                    </div>
                </div>

                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 order-2 lg:order-1">
                        <AnimatePresence mode="wait">
                            <motion.div key={currentIndex} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.4 }}>
                                <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-4">{demo.businessType}</div>
                                <h3 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 font-display">{demo.businessName}</h3>
                                <div className="bg-white/5 backdrop-blur-md border-l-4 border-primary p-6 rounded-r-xl mb-8 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <p className="text-sm leading-relaxed text-foreground/80 relative z-10">
                                        <strong className="text-primary block mb-2 uppercase tracking-wide text-xs">Concepto de Diseño Proactivo</strong>
                                        Visualizado por Vertrex para <span className="text-white font-bold">@{demo.businessName.replace(/\s+/g, '').toLowerCase()}</span>. Nota: Este es un ejercicio de ingeniería independiente diseñado para captar la atención de la marca. No tenemos afiliación oficial (aún).
                                    </p>
                                </div>
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-wrap gap-3">
                                        <Link href="/contacto" className="bg-foreground text-background font-bold px-8 py-3 rounded-full hover:bg-primary hover:text-black transition-all flex items-center gap-2">Reclamar este Diseño <HiArrowRight /></Link>
                                    </div>
                                    <div className="flex items-center gap-4 text-foreground/40 text-sm border-t border-white/5 pt-6">
                                        <span className="text-xs uppercase tracking-widest font-bold opacity-50">Conectar:</span>
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-2 hover:text-primary cursor-pointer transition-colors"><FaInstagram /> @{demo.businessName.replace(/\s+/g, '').toLowerCase()}</div>
                                            <div className="flex items-center gap-2 hover:text-primary cursor-pointer transition-colors"><FaGlobe /> Website</div>
                                            <div className="flex items-center gap-2 hover:text-primary cursor-pointer transition-colors"><FaFacebookF /> Facebook</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="lg:col-span-7 order-1 lg:order-2 relative h-[500px] lg:h-[600px] flex items-center justify-center">
                        <div className="absolute top-4 right-4 z-30 bg-black/60 backdrop-blur-md p-1.5 rounded-full border border-white/10 flex gap-2 shadow-xl">
                            <button onClick={() => setView('desktop')} className={`p-2 rounded-full transition-all duration-300 ${view === 'desktop' ? 'bg-primary text-black shadow-lg' : 'text-white/50 hover:text-white'}`}><HiOutlineComputerDesktop className="w-5 h-5" /></button>
                            <button onClick={() => setView('mobile')} className={`p-2 rounded-full transition-all duration-300 ${view === 'mobile' ? 'bg-primary text-black shadow-lg' : 'text-white/50 hover:text-white'}`}><HiOutlineDevicePhoneMobile className="w-5 h-5" /></button>
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div key={`${currentIndex}-${view}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.4 }} className="relative w-full h-full flex items-center justify-center">
                                {view === 'desktop' ? (
                                    <div className="w-full aspect-video bg-neutral-900 rounded-xl border border-white/10 shadow-2xl overflow-hidden relative group">
                                        <div className="absolute top-0 left-0 right-0 h-8 bg-neutral-800 border-b border-white/5 flex items-center px-4 gap-2 z-20">
                                            <div className="w-3 h-3 rounded-full bg-primary/50"></div>
                                            <div className="w-3 h-3 rounded-full bg-primary/50"></div>
                                            <div className="w-3 h-3 rounded-full bg-primary/50"></div>
                                            <div className="ml-4 w-2/3 h-4 bg-black/20 rounded-md"></div>
                                        </div>
                                        <div className="pt-8 h-full"><video src={variant.videoDesktop} className="w-full h-full object-cover" muted loop autoPlay playsInline /></div>
                                    </div>
                                ) : (
                                    <div className="relative z-10 w-[280px] sm:w-[300px] aspect-[9/19] bg-black rounded-[3rem] border-[8px] border-neutral-800 shadow-2xl shadow-primary/10 overflow-hidden">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-neutral-900 rounded-b-xl z-20"></div>
                                        <video src={variant.videoMobile} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- 7. CTA SECTION ---
const CtaSection = () => {
    return (
        <section className="py-24 px-6 relative overflow-hidden bg-neutral-900/50">
            <div className="absolute inset-0 bg-primary/5"></div>
            <div className="mx-auto max-w-4xl text-center relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-6">
                    ¿Hablamos de tu idea?
                </h2>
                <p className="text-xl text-foreground/70 mb-10 max-w-2xl mx-auto">
                    Ya sea un sitio web impactante, una PWA innovadora o una app Android nativa, tenemos la ingeniería para hacerlo realidad.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                        href="https://wa.me/573000000000" 
                        target="_blank"
                        className="bg-primary text-background font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(0,255,127,0.3)] flex items-center justify-center gap-2"
                    >
                        <FaWhatsapp size={24} />
                        Iniciar Chat en WhatsApp
                    </Link>
                    <Link 
                        href="/cuestionario" 
                        className="bg-transparent text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-colors border border-white/20"
                    >
                        Solicitar Presupuesto
                    </Link>
                </div>
            </div>
        </section>
    )
}

// --- MAIN PAGE COMPONENT ---
export default function HomePage() {
  return (
    <main className="flex flex-col w-full selection:bg-primary selection:text-background">
    <HeroSection />
    <ServicesSection />
    <ProjectsShowcase /> {/* 1. Clientes Reales */}
    <CommunityShowcase /> {/* 2. Impacto Social (Opita Go / USCO) */}
    <TemplatesShowcase /> {/* 3. Plantillas */}
    <LabShowcase /> {/* 4. Conceptos */}
      <CtaSection />
    </main>
  )
}