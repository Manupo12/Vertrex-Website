'use client'

// Página de portafolio: organiza casos reales, proyectos comunitarios y plantillas en una vista comercial.

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
    HiOutlineCloudArrowDown,
    HiOutlineCalendar,
    HiOutlineUserGroup,
    HiOutlineSparkles,
    HiOutlineMegaphone,
    HiOutlineIdentification,
    HiOutlineQrCode,
    HiOutlinePlay,
    HiOutlineChartBar
} from 'react-icons/hi2'
import { FaNutritionix, FaBed, FaWhatsapp, FaExternalLinkAlt, FaGlobe } from 'react-icons/fa'
import { AiOutlineUserAdd, AiOutlineCloudUpload } from 'react-icons/ai'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'
import { RiFileSearchLine } from 'react-icons/ri'
import { TbBell } from 'react-icons/tb'
import { BiShield } from 'react-icons/bi'
import { FiRefreshCw, FiPrinter } from 'react-icons/fi'
// --- 1. DATOS DE CASOS DE ÉXITO (PRODUCCIÓN) ---
const clientsData = [
    {
        id: 'ser-deseable',
        title: 'Ser Deseable',
        subtitle: 'Salud, Nutrición & Longevidad',
        category: 'Plataforma Web & E-commerce',
        description: 'Transformamos un método de entrenamiento en un ecosistema digital completo. Una plataforma moderna diseñada para guiar a los usuarios hacia una vida más saludable con herramientas interactivas y comercio integrado.',
        tags: ['En Producción', 'Web App', 'Bilingüe'],
        link: 'https://www.serdeseable.site/',
        buttonText: 'Visitar Plataforma',
        images: { desktop: '/images/pagados/serdeseable/1.webp', mobile: '/images/pagados/serdeseable/serdeseablemv.webp' },
        features: [
            { icon: <FaNutritionix/>, title: 'Calculadora Nutricional', desc: 'Herramienta interactiva personalizada' },
            { icon: <HiOutlineShoppingCart/>, title: 'Tienda Integrada', desc: 'Carrito dinámico y gestión de pedidos' },
            { icon: <HiOutlineGlobeAlt/>, title: 'Multi-Idioma', desc: 'Experiencia fluida en Español e Inglés' },
            { icon: <HiOutlineCpuChip/>, title: 'Panel Administrativo', desc: 'Gestión total de usuarios e inventario' }
        ],
        color: 'from-primary/20 to-primary/20',
        accent: 'text-primary'
    },
    {
        id: 'principerfum',
        title: 'Principerfum',
        subtitle: 'E-commerce & Panel de Control',
        category: 'Plataforma Web Full-Stack',
        description: 'Tienda online premium de fragancias con catálogo dinámico y filtros avanzados. Cuenta con un dashboard administrativo privado para gestionar inventario, monitorear métricas de ventas y moderar reseñas de clientes en tiempo real.',
        tags: ['E-commerce', 'Panel Admin', 'Base de Datos'],
        link: 'https://pinciperfum-web.vercel.app/',
        buttonText: 'Visitar Tienda',
        images: { desktop: '/images/pagados/principerfum/escritorio.webp', mobile: '/images/pagados/principerfum/celular.webp' },
        features: [
            { icon: <HiOutlineShoppingCart/>, title: 'Catálogo Dinámico', desc: 'Filtros por marca, género y búsqueda inteligente.' },
            { icon: <FaWhatsapp/>, title: 'WhatsApp Checkout', desc: 'Pedidos y consultas directas sin pasarelas complejas.' },
            { icon: <HiOutlineCpuChip/>, title: 'Dashboard Admin', desc: 'Creación/edición de productos y métricas del negocio.' },
            { icon: <HiOutlineHeart/>, title: 'Sistema de Reseñas', desc: 'Valoraciones de usuarios con moderación administrativa.' }
        ],
        color: 'from-primary/20 to-primary/20',
        accent: 'text-primary'
    },
    {
        id: 'sorpresa-maria',
        title: 'Sorpresa Interactiva',
        subtitle: 'Experiencia Web Mobile-First',
        category: 'Detalle Especial / Interactivo',
        description: 'Un proyecto especial creado como regalo de cumpleaños. Una experiencia web móvil donde un sobre 3D reacciona al tacto, se abre con efectos de sonido, lanza confeti y revela una tarjeta holográfica con un código de regalo oculto.',
        tags: ['Mobile First', 'Animaciones CSS', 'Multimedia'],
        link: 'https://cumple-anos.vercel.app/',
        buttonText: 'Ver Experiencia',
        images: { desktop: '', mobile: '/images/pagados/cumpleanos/celular.webp' },
        features: [
            { icon: <HiOutlineSparkles/>, title: 'Interacción 3D', desc: 'El sobre reacciona al movimiento del dedo.' },
            { icon: <HiOutlineMegaphone/>, title: 'Audio & Confeti', desc: 'Efectos multimedia al abrir el regalo.' },
            { icon: <HiOutlineIdentification/>, title: 'Tarjeta Holográfica', desc: 'Efecto visual brillante avanzado.' },
            { icon: <HiOutlineQrCode/>, title: 'Código Dinámico', desc: 'Animación de descifrado y tap-to-copy.' }
        ],
        color: 'from-primary/20 to-primary/20',
        accent: 'text-primary',
        isMobileOnly: true
    },
    {
        id: 'felicitacion-sandra',
        title: 'Felicitación Interactiva',
        subtitle: 'Experiencia Web Mobile-First',
        category: 'Detalle Especial / Interactivo',
        description: 'Página de felicitación personalizada. Inicia con una pantalla de bienvenida que, al interactuar, revela un mensaje emotivo, una galería de fotos estilo "bento" y música de fondo sincronizada con controles anti-superposición.',
        tags: ['Mobile First', 'Audio Web', 'Multimedia'],
        link: 'https://mama-six-kappa.vercel.app/',
        buttonText: 'Ver Experiencia',
        images: { desktop: '', mobile: '/images/pagados/regalo madre/celular.webp' },
        features: [
            { icon: <HiOutlineSparkles/>, title: 'Abrazo Virtual', desc: 'Botón interactivo que lanza confeti de celebración.' },
            { icon: <HiOutlinePlay/>, title: 'Control de Audio', desc: 'Música de fondo optimizada para no superponerse.' },
            { icon: <HiOutlineComputerDesktop/>, title: 'Galería Bento', desc: 'Mosaico fotográfico dinámico y adaptativo.' },
            { icon: <HiOutlineHeart/>, title: 'Transición Fluida', desc: 'Efectos visuales desde la pantalla de bienvenida.' }
        ],
        color: 'from-primary/20 to-primary/20',
        accent: 'text-primary',
        isMobileOnly: true
    }
];

// --- 2. DATOS DE PROYECTOS COMUNITARIOS (SOCIAL IMPACT & APPS NATIVAS) ---
const communityProjects = [
    {
        id: 'zap-mesh',
        title: 'Zap',
        subtitle: 'Red de Comunicación Offline (Android)',
        mission: 'Conectar personas en tiempo real en eventos o zonas sin señal, de forma privada y resiliente.',
        description: 'Aplicación nativa para Android (Jetpack Compose). Crea redes locales P2P (malla) mediante Bluetooth y Wi-Fi Nearby. Permite chat grupal, envío de archivos, un radar GPS suavizado (Filtro Kalman) para ubicar amigos y un modo "Pánico" que alerta a todos los conectados. Todo sin usar internet.',
        tags: ['Gratuito', 'Conexión Offline', 'Cifrado'],
        link: '#', 
        buttonText: 'Ver Proyecto',
        images: { mobile: "/images/social/zap/celular.jpeg" },
        features: [
            { icon: <HiOutlineCloudArrowDown/>, title: "100% Offline", desc: "Conexión P2P por Bluetooth y Wi-Fi Direct." },
            { icon: <HiMap/>, title: "Radar Inteligente", desc: "GPS con Filtro Kalman para evitar saltos." },
            { icon: <HiOutlineMegaphone/>, title: "Modo Pánico", desc: "Alerta crítica con bloqueo de pantalla." },
            { icon: <HiOutlineIdentification/>, title: "Cifrado Local", desc: "Mensajes protegidos con llaves AES-256." }
        ],
        color: "from-primary/20 to-primary/20",
        accent: "text-primary",
        bgBtn: "bg-primary",
        platform: 'android',
        isNativeApp: true
    },
    {
        id: 'opita-go',
        title: 'Opita Go',
        subtitle: 'Movilidad Inteligente para Neiva',
        mission: 'Ayudar a los ciudadanos a navegar el caos del transporte público sin costo alguno.',
        description: 'Una iniciativa de Vertrex para la ciudad. Opita Go resuelve la falta de información del sistema SETP mediante algoritmos propios de enrutamiento. Es una herramienta gratuita que ahorra tiempo y dinero a miles de neivanos.',
        tags: ['Conexion Offline', 'Gratuito', 'Planificador de viajes'],
        link: 'https://opita-go-web.vercel.app/', 
        buttonText: 'Usar Opita Go',
        images: { mobile: "/images/social/opitago/movil.jpeg" },
        features: [
            { icon: <HiMap/>, title: "Algoritmos GPS Offline", desc: "Funciona sin datos móviles." },
            { icon: <HiOutlineGlobeAlt/>, title: "PWA Multiplataforma", desc: "Instalable en Android e iOS desde el navegador." },
            { icon: <HiOutlineDevicePhoneMobile/>, title: "UX Accesible", desc: "Diseño para todas las edades." },
            { icon: <HiOutlineQrCode/>, title: "Sin Anuncios", desc: "Enfoque 100% en la utilidad." }
        ],
        color: "from-primary/20 to-primary/20",
        accent: "text-primary",
        bgBtn: "bg-primary",
        platform: 'pwa',
        isNativeApp: true
    },
    {
        id: 'campus-usco',
        title: 'Campus USCO Digital',
        subtitle: 'Marketplace Universitario & Directorio',
        mission: 'Facilitar el comercio local y centralizar la información académica para la comunidad de la universidad.',
        description: 'Una app móvil (PWA) que conecta estudiantes y vendedores. Funciona como un mercado virtual con feed de productos, perfiles de tiendas y un directorio de profesores. Todo optimizado para pantallas móviles con interacciones rápidas e inicio de sesión seguro.',
        tags: ['Marketplace', 'Login Google', 'Comunidad USCO'],
        link: 'https://proyecto-usco-2-0.vercel.app/',
        buttonText: 'Abrir App',
        images: { mobile: "/images/social/proyectousco/celular.jpeg" }, 
        features: [
            { icon: <HiOutlineShoppingCart/>, title: "Marketplace en Vivo", desc: "Filtro 'Comprar YA' para ocultar tiendas cerradas." },
            { icon: <HiOutlineHeart/>, title: "Favoritos Guardados", desc: "Marca productos con un toque y míralos en tu carrusel." },
            { icon: <HiOutlineIdentification/>, title: "Perfiles de Tienda", desc: "Páginas públicas con horarios, pagos y redes." },
            { icon: <FaGlobe/>, title: "Login Institucional", desc: "Acceso con Google y asignación de rol a correos USCO." },
            { icon: <HiOutlineDevicePhoneMobile/>, title: "Panel de Vendedores", desc: "Gestión de inventario y subida de fotos desde el celular." },
            { icon: <HiOutlineUserGroup/>, title: "Directorio Académico", desc: "Lista de espera y perfiles de información de docentes." }
        ],
        color: "from-primary/20 to-primary/20",
        accent: "text-primary",
        bgBtn: "bg-primary",
        platform: 'pwa',
        isNativeApp: true
    }
];
 

// --- 3. DATOS DE PLANTILLAS (SOLUCIONES DE NEGOCIO) ---
const templatesData = [
    {
        id: 'hotel-pro',
        title: 'HotelPro',
        subtitle: 'Sistema de Reservas Hotelero',
        category: 'Plantilla para Hoteles',
        shortDescription: 'Motor de reservas en tiempo real con panel administrativo y herramientas operativas.',
        description: 'HotelPro permite a huéspedes y staff gestionar reservas de forma segura y rápida: búsqueda por fecha, vista de disponibilidad, bloqueo/limpieza de habitaciones, gestión de tarifas, calendario operativo y panel administrativo con roles y métricas.',
        tags: ['Motor Reservas', 'Panel Admin', 'Calendario', 'Gestión de Habitaciones'],
        link: '#',
        buttonText: 'Ver Demo',
        images: { desktop: "/images/plantillas/hotelpro/pc.png", mobile: "/images/plantillas/hotelpro/movil.jpeg" },
        features: [
            { icon: <HiOutlineCalendar/>, title: "Búsqueda y Disponibilidad", text: "Busca por fechas y muestra disponibilidad en tiempo real con reglas de ocupación y bloqueos." },
            { icon: <FaBed/>, title: "Gestión de Habitaciones", text: "Crear/editar habitaciones, asignar tipos, controlar estado (Disponible/Reservada/Limpieza) y precios por habitación." },
            { icon: <AiOutlineUserAdd/>, title: "Control de Usuarios y Roles", text: "Usuarios con roles (ADMIN/SUPERADMIN/HUESPED), permisos granulares para panel y endpoints." },
            { icon: <MdOutlineAdminPanelSettings/>, title: "Panel Administrativo", text: "Dashboard con métricas clave, últimas reservas, calendario operativo y acciones rápidas (check-in/out, cancelar, marcar limpieza)." },
            { icon: <RiFileSearchLine/>, title: "Reservas y Gestión", text: "Crear reservas manuales, gestión de pagos (placeholder) y estados, modificar fechas y aplicar descuentos." },
            { icon: <TbBell/>, title: "Notificaciones y Emails", text: "Plantillas de correo para confirmación, recordatorios y cancelaciones; logs de envíos y reintentos." },
            { icon: <BiShield/>, title: "Seguridad y Robustez", text: "Autenticación segura por token, protección de rutas admin y manejo fiable de CORS/preflight en serverless." },
            { icon: <FiRefreshCw/>, title: "Operaciones y Cron", text: "Cron controlado (deshabilitado por defecto en serverless) para tareas periódicas: liberación automática de habitaciones, recordatorios y reportes." },
            { icon: <RiFileSearchLine/>, title: "Filtrado y Búsqueda", text: "Filtra por tipo de habitación, precio, capacidad y estados; paginación y cache para respuestas rápidas." },
            { icon: <AiOutlineCloudUpload/>, title: "Gestión de Medios", text: "Subida y servicio de imágenes para habitaciones con ruta estática /uploads y control de tamaños." }
        ],
        accent: "text-primary",
        meta: { status: "Produccion lista", version: "1.0", updatedAt: "2026-03-15" },
        notes: "Motor de reservas, calendario, panel admin y flujos de notificación. Mantén variables de entorno críticas para producción y habilita cron solo en entornos dedicados."
    },
    {
        id: 'motel-pro',
        title: 'MotelPro',
        subtitle: 'Gestión Operativa para Moteles',
        category: 'Sistema SaaS',
        shortDescription: 'Plataforma operativa para moteles de alta rotación: control de habitaciones, minibar, pedidos, turnos y facturación electrónica, con modo offline.',
        description: 'MotelPro centraliza y agiliza todas las operaciones diarias de un motel: desde el check‑in rápido y la gestión de habitaciones hasta comandas al bar, control de minibar, cierres de turno y facturación electrónica. Está pensado para entornos con alta rotación y conexiones inestables: la interfaz es táctil y operativa para recepción, patios y aseo, y el sistema sincroniza cambios cuando recupera conexión.',
        tags: ['Control Turnos', 'Facturación DIAN', 'Modo Offline', 'Minibar', 'PWA'],
        link: '#', 
        buttonText: 'Ver Demo',
        images: { desktop: "/images/plantillas/motelpro/pc.png", mobile: "/images/plantillas/motelpro/movil.jpeg" },
        features: [
            { icon: <AiOutlineUserAdd/>, title: "Check‑in y Gestión de Sesiones", text: "Registro rápido de entradas, control del tiempo de estadía, prepagos y flujos de salida que reducen filas y errores en recepción." },
            { icon: <RiFileSearchLine/>, title: "Facturación Electrónica", text: "Generación de factura/ticket con cálculo de impuestos y preparación para integración con proveedores de facturación electrónica." },
            { icon: <HiOutlineShoppingCart/>, title: "Minibar & Comandas", text: "Registro de consumos de nevera y pedidos al bar integrados a la sesión del cliente para facturar automáticamente y controlar inventario." },
            { icon: <HiOutlineCloudArrowDown/>, title: "Modo Offline y Sincronización", text: "Opera sin internet guardando acciones localmente y sincronizando cuando hay conexión, evitando interrupciones de servicio." },
            { icon: <FiRefreshCw/>, title: "Turnos y Cierres de Caja", text: "Apertura/cierre de turnos con arqueos, reportes de ventas por método de pago y generación de resúmenes imprimibles para auditoría." },
            { icon: <TbBell/>, title: "Notificaciones Operativas", text: "Mensajería interna por rol (patios, aseo, recepción) para solicitudes de salida, pedidos listos y tareas de limpieza, reduciendo tiempos de coordinación." },
            { icon: <FaBed/>, title: "Gestión de Habitaciones", text: "Control de estados (Disponible/Ocupada/Limpieza/Mantenimiento), asignación por categorías y reglas de precios por tipo de habitación." },
            { icon: <HiOutlineChartBar/>, title: "Informes y Analíticas", text: "Reportes diarios, estadísticas por turno y hora pico, exportación de registros para conciliación y toma de decisiones." },
            { icon: <FaExternalLinkAlt/>, title: "Inventario y Alertas", text: "Gestión de productos, control de stock y alertas de mínimos para minimizar pérdidas en minibar y bar." },
            { icon: <FiPrinter/>, title: "Impresión y Tickets", text: "Generación de tickets y facturas en formato para impresoras fiscales/matriciales y tickets de cliente." },
            { icon: <BiShield/>, title: "Control de Usuarios y Seguridad", text: "Roles predefinidos (ADMIN/RECEPCION/PATIO/ASEO) con permisos, cambios de contraseña y protección de sesiones." },
            { icon: <AiOutlineCloudUpload/>, title: "Personalización e Integraciones", text: "Capacidad para adaptar tarifas, reglas promocionales (por ejemplo, descuentos por día) e integrar datáfonos o sistemas de facturación externos." }
        ],
        accent: "text-primary",
        meta: { status: "Demo disponible · Listo para producción con configuración", version: "1.0", updatedAt: "2026-03-15" },
        notes: "Solución enfocada en operaciones: ideal para moteles con alta rotación y conexiones inestables. Para pasar a producción se requiere configurar base de datos, credenciales de facturación electrónica y probar impresión/datáfono en el sitio."
    },
    {
        id: 'fiest-pro',
        title: 'FiestPro',
        subtitle: 'Ticketing y Gestión de Eventos',
        category: 'Plataforma para Eventos',
        shortDescription: 'Solución integral para vender entradas, gestionar el acceso y vender merchandising, con herramientas para promotores y equipo operativo.',
        description: 'FiestPro centraliza todo el ciclo de un evento: venta de entradas con códigos QR, control de acceso en puertas, tienda de merchandising y un panel para organizar eventos, ver ventas y gestionar equipos. Diseñada para promotores, festivales y salas, permite crear eventos, definir tipos de entradas, asignar comisiones a promotores, y operar control de puertas de forma rápida y fiable. Incluye herramientas para reportes en tiempo real, exportes y flujos pensados para facilitar la operación el día del evento.',
        tags: ['Venta Entradas', 'Control de Acceso', 'Promotores', 'Tienda Merch'],
        link: '#', 
        buttonText: 'Ver Demo',
        images: { desktop: "/images/plantillas/fiestapro/pc.png", mobile: "/images/plantillas/fiestapro/movil.png" },
        features: [
            { icon: <HiOutlineQrCode/>, title: "Scanner QR y Control de Acceso", text: "Lectura rápida de entradas con validación, estados claros (válido/duplicado/cancelado) y modo offline para puertas sin conexión." },
            { icon: <HiOutlineCalendar/>, title: "Gestión de Entradas y Tipos", text: "Crear y editar tipos de entrada (anticipada, VIP, promo), límites de aforo, precios y reglas de acceso por prioridad." },
            { icon: <HiOutlineUserGroup/>, title: "Panel para Promotores", text: "Asignación de promotores con códigos o links, seguimiento de ventas por RRPP y cálculo automático de comisiones y pagos." },
            { icon: <HiOutlineShoppingCart/>, title: "Tienda de Merchandising", text: "Catálogo de productos con gestión de stock, variantes de tallas, y proceso de compra integrado con la venta de entradas." },
            { icon: <HiOutlineDevicePhoneMobile/>, title: "Checkout y Flujo de Compra Sencillo", text: "Experiencia de compra optimizada para móvil y desktop, resumen de pedidos claro y pasos guiados hasta la confirmación." },
            { icon: <HiOutlineChartBar/>, title: "Panel Administrativo y Reportes", text: "Dashboard con ventas en tiempo real, lista de asistentes, resumen por evento, exportes CSV y métricas clave para la toma de decisiones." },
            { icon: <HiOutlineIdentification/>, title: "Gestión de Asistentes", text: "Lista de entradas vendidas, búsqueda y filtros por nombre o código, marcación de asistencia y reimpresión de tickets." },
            { icon: <HiOutlineMegaphone/>, title: "Workflows Operativos", text: "Herramientas para el día del evento: creación de turnos, control de accesos, y acciones rápidas para resolver incidencias." },
            { icon: <TbBell/>, title: "Notificaciones y Mensajería", text: "Envío de confirmaciones y recordatorios a compradores; plantillas para comunicaciones y registro de envíos." },
            { icon: <FaExternalLinkAlt/>, title: "Exportes y Recuperación de Datos", text: "Exportes de ventas y listas de asistentes para contabilidad o control; historial de transacciones y acciones." },
            { icon: <BiShield/>, title: "Seguridad y Privacidad", text: "Gestión responsable de datos de asistentes con controles de acceso al panel administrativo y prácticas mínimas de protección de información." },
            { icon: <FaGlobe/>, title: "Modo Feria / Eventos Multiescena", text: "Soporta varios puntos de venta y puertas simultáneas, con control centralizado y sincronización de aforos." },
            { icon: <HiOutlineUserGroup/>, title: "Soporte Operativo y Herramientas de Puerta", text: "Interfaz clara para personal de puerta con indicadores visuales y acciones simples para atender incidencias rápidamente." },
            { icon: <HiOutlineCpuChip/>, title: "Escalabilidad Operativa", text: "Pensada para pequeños shows y eventos medianos; facilita la configuración rápida y la operación por equipos sin experiencia técnica." }
        ],
        accent: "text-primary",
        meta: { status: "Demo funcional", version: "1.0", updatedAt: "2026-03-15" },
        notes: "FiestPro está pensado como una plataforma lista para demo y pruebas operativas. Para despliegue en producción se recomiendan integrar pasarela de pagos, sistema de respaldo de datos, políticas de cumplimiento de privacidad y un plan de soporte para el día del evento. Se aconseja validar los flujos de puerta en condiciones reales antes de eventos críticos."
    }
];

// --- BARRA DE NAVEGACIÓN INTELIGENTE (INTACTA) ---
const PortfolioNav = () => {
    const [activeSection, setActiveSection] = useState('produccion');

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['produccion', 'comunidad', 'plantillas'];
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
                            ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-105' 
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
    const [selectedTemplateId, setSelectedTemplateId] = useState(templatesData[0]?.id ?? '')
    const [templateView, setTemplateView] = useState<'desktop' | 'mobile'>('desktop')
    const selectedTemplate = templatesData.find((template) => template.id === selectedTemplateId) ?? templatesData[0]

  return (
    <main className="bg-neutral-950 text-white selection:bg-primary selection:text-black pb-32 min-h-screen font-sans">
      
      {/* HEADER EDITORIAL */}
      <section className="relative pt-36 pb-12 px-6 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="mx-auto max-w-5xl text-center relative z-10">
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-6"
            >
                <HiOutlineSparkles className="w-3 h-3"/> Portafolio Vertrex
            </motion.div>
            <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold tracking-tight text-white font-display mb-6"
            >
              Nuestro Trabajo <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Habla por Sí Solo.</span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed"
            >
              Ecosistemas digitales facturando en producción, plataformas de impacto social y arquitecturas listas para acelerar tu negocio.
            </motion.p>
        </div>
      </section>

      {/* BARRA DE NAVEGACIÓN INTELIGENTE (INTACTA) */}
      <PortfolioNav />

      {/* 1. SECCIÓN: CASOS DE ÉXITO (DISEÑO INMERSIVO PREMIUM) */}
      <section id="produccion" className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 mb-40 scroll-mt-32">
        <div className="flex items-center gap-4 mb-20">
            <span className="h-px flex-1 bg-white/10"></span>
            <span className="text-primary font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <FaExternalLinkAlt/> Proyectos en Producción
            </span>
            <span className="h-px flex-1 bg-white/10"></span>
        </div>

        <div className="flex flex-col gap-24 lg:gap-32">
            {clientsData.map((project, index) => {
                const isEven = index % 2 === 0;
                return (
                    <div key={project.id} className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center`}>
                        
                        {/* Información Editorial */}
                        <div className={`lg:col-span-5 flex flex-col justify-center ${isEven ? 'lg:order-1 lg:pr-8' : 'lg:order-2 lg:pl-8'}`}>
                            <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-3">
                                {project.category}
                            </p>
                            <h2 className="text-4xl sm:text-5xl font-bold text-white font-display mb-4 tracking-tight">
                                {project.title}
                            </h2>
                            <p className="text-xl text-neutral-300 font-medium mb-6">
                                {project.subtitle}
                            </p>
                            <p className="text-neutral-400 leading-relaxed mb-10 text-base">
                                {project.description}
                            </p>
                            
                            {/* Grid de Features Bento-Style */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                {project.features.map((f, i) => (
                                    <div key={i} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-start gap-3 hover:bg-white/5 transition-colors">
                                        <div className="text-primary mt-1 shrink-0">{f.icon}</div>
                                        <div>
                                            <strong className="block text-white text-sm mb-1">{f.title}</strong>
                                            <span className="text-neutral-500 text-xs leading-snug block">{f.desc}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                <Link href={project.link} target="_blank" className="inline-flex items-center gap-3 bg-white text-black px-8 py-3.5 rounded-full font-bold hover:bg-primary transition-all shadow-lg text-sm uppercase tracking-widest group">
                                    {project.buttonText} <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        {/* Vitrina Visual de Alta Gama */}
                        <div className={`lg:col-span-7 relative h-[450px] sm:h-[550px] lg:h-[650px] w-full rounded-[3rem] bg-neutral-900/30 backdrop-blur-md border border-white/10 flex items-center justify-center overflow-hidden group ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                            {/* Resplandor ambiental dinámico */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none blur-3xl"></div>
                            
                            {/* Composición Visual */}
                            <div className="relative w-full h-full flex items-center justify-center">
                                {project.isMobileOnly ? (
                                    // Escenario Solo Móvil (Profundidad 3D)
                                    <>
                                        <div className="relative z-20 w-[60%] sm:w-[45%] lg:w-[35%] xl:w-[30%] aspect-[9/19] bg-black rounded-[2.5rem] lg:rounded-[3rem] border-[6px] lg:border-[8px] border-neutral-800 shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden group-hover:-translate-y-4 group-hover:rotate-2 transition-transform duration-700">
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 lg:h-6 bg-neutral-900 rounded-b-xl z-20"></div>
                                            <div className="relative w-full h-full">
                                                <Image src={project.images.mobile} alt={`Vista móvil de ${project.title}`} fill className="object-cover object-top" />
                                            </div>
                                        </div>
                                        <div className="absolute z-10 right-[5%] sm:right-[15%] lg:right-[20%] top-1/2 -translate-y-[45%] w-[50%] sm:w-[35%] lg:w-[25%] xl:w-[20%] aspect-[9/19] bg-black rounded-3xl border-[4px] lg:border-[6px] border-neutral-800 shadow-2xl opacity-40 blur-[2px] rotate-[-6deg] group-hover:-translate-y-[50%] group-hover:rotate-[-8deg] transition-all duration-700 delay-100">
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-4 bg-neutral-900 rounded-b-lg z-20"></div>
                                            <div className="relative w-full h-full">
                                                <Image src={project.images.mobile} alt={`Fondo móvil de ${project.title}`} fill className="object-cover object-top" />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    // Escenario Híbrido (Mac + iPhone Perfect Math)
                                    <>
                                        <div className="absolute top-1/2 -translate-y-[60%] sm:-translate-y-[55%] right-[2%] sm:right-[5%] w-[95%] sm:w-[85%] lg:w-[85%] aspect-video bg-neutral-950 rounded-xl lg:rounded-2xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.7)] overflow-hidden group-hover:-translate-y-[60%] group-hover:scale-[1.02] transition-transform duration-700">
                                            <div className="h-5 lg:h-6 bg-neutral-900 border-b border-white/5 flex items-center px-3 gap-1.5 z-30 relative">
                                                <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
                                                <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
                                                <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
                                            </div>
                                            <div className="relative w-full h-[calc(100%-1.25rem)] lg:h-[calc(100%-1.5rem)]">
                                                <Image src={project.images.desktop} alt={`Vista desktop de ${project.title}`} fill className="object-cover object-top" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-[2%] sm:bottom-[5%] lg:bottom-[8%] left-[2%] sm:left-[5%] lg:left-[10%] w-[35%] sm:w-[30%] lg:w-[25%] xl:w-[22%] aspect-[9/19] bg-black rounded-[2rem] lg:rounded-[2.5rem] border-[5px] lg:border-[6px] border-neutral-800 shadow-[20px_30px_60px_rgba(0,0,0,0.9)] overflow-hidden group-hover:-translate-y-5 group-hover:rotate-[-3deg] transition-transform duration-700 delay-100 z-10">
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-4 lg:h-5 bg-neutral-900 rounded-b-xl z-20"></div>
                                            <div className="relative w-full h-full">
                                                <Image src={project.images.mobile} alt={`Vista móvil secundaria de ${project.title}`} fill className="object-cover object-top" />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
      </section>

      {/* 2. SECCIÓN: IMPACTO SOCIAL (DISEÑO SHOWCASE ALTERNADO) */}
      <section id="comunidad" className="py-32 bg-neutral-900/20 border-y border-white/5 mb-32 scroll-mt-20 overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
                <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 flex justify-center items-center gap-2">
                    <HiOutlineHeart className="w-4 h-4" /> Para la Ciudad
                </span>
                <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-6">Ingeniería Social</h2>
                <p className="text-neutral-400 text-lg">Desarrollo de alto nivel sin ánimo de lucro, creado para resolver problemas críticos en nuestra comunidad.</p>
            </div>

            <div className="flex flex-col gap-12">
                {communityProjects.map((project, index) => {
                    const isEven = index % 2 === 0;
                    return (
                        <div key={project.id} className={`flex flex-col lg:flex-row items-center gap-10 bg-black border border-white/5 rounded-[3rem] p-8 lg:p-12 overflow-hidden hover:border-white/10 transition-colors group ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                            
                            {/* Showcase Móvil de la App */}
                            <div className="w-full lg:w-1/2 h-[400px] sm:h-[500px] relative flex justify-center items-center">
                                {/* Resplandor de App */}
                                <div className="absolute inset-0 bg-primary/10 rounded-full blur-[80px] opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                                
                                <div className="relative z-10 h-[90%] aspect-[9/19] bg-black rounded-[2.5rem] sm:rounded-[3rem] border-[6px] sm:border-[8px] border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden group-hover:-translate-y-3 transition-transform duration-700">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 sm:h-6 bg-neutral-900 rounded-b-xl z-20"></div>
                                    <div className="relative w-full h-full">
                                        <Image src={project.images.mobile} alt={`Vista de app ${project.title}`} fill className="object-cover object-top" />
                                    </div>
                                </div>
                            </div>

                            {/* Datos de la App */}
                            <div className="w-full lg:w-1/2 flex flex-col justify-center">
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1.5 bg-white/5 border border-white/10 text-neutral-400 text-[10px] font-bold uppercase tracking-wider rounded-md">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-display">{project.title}</h3>
                                <p className="text-primary font-bold text-sm uppercase tracking-widest mb-6">{project.subtitle}</p>
                                
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 mb-8 border-l-2 border-l-primary">
                                    <strong className="block text-white text-xs uppercase tracking-widest mb-2">Misión del Proyecto:</strong>
                                    <p className="text-neutral-400 text-sm leading-relaxed">{project.mission}</p>
                                </div>
                                
                                <p className="text-neutral-300 text-base leading-relaxed mb-8">
                                    {project.description}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                    {project.features.map((f, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="text-primary mt-1">{f.icon}</div>
                                            <div>
                                                <strong className="block text-white text-sm mb-0.5">{f.title}</strong>
                                                <span className="text-neutral-500 text-xs block">{f.desc}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <Link href={project.link} className="inline-flex items-center gap-2 bg-white/5 hover:bg-primary border border-white/10 hover:border-primary px-8 py-3.5 rounded-full text-white hover:text-black font-bold transition-all text-sm uppercase tracking-widest group/btn">
                                        {project.buttonText} <HiArrowRight className="group-hover/btn:translate-x-1 transition-transform"/>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
      </section>

      {/* 3. SECCIÓN: PLANTILLAS DE NEGOCIO (INTACTA SEGÚN INSTRUCCIONES) */}
      <section id="plantillas" className="mx-auto max-w-[1400px] px-6 mb-20 scroll-mt-32">
          <div className="mb-16 text-center lg:text-left max-w-3xl">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white tracking-tight mb-6">
                  Catálogo de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Software</span>
              </h2>
              <p className="text-neutral-400 text-lg md:text-xl leading-relaxed">
                  Arquitecturas pre-construidas y probadas en entornos operativos reales. Despliega hoy una solución a la medida de tu industria.
              </p>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
              <div className="w-full lg:w-[350px] shrink-0 lg:sticky lg:top-32 flex flex-col gap-3 z-20">
                  {templatesData.map((template) => {
                      const isActive = selectedTemplate?.id === template.id
                      return (
                          <button
                              key={template.id}
                              onClick={() => {
                                  setSelectedTemplateId(template.id)
                                  setTemplateView('desktop')
                              }}
                              className={`group text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden
                                  ${isActive
                                      ? 'bg-neutral-900 border-primary/40 shadow-[0_0_30px_rgba(0,255,127,0.1)] -translate-y-1'
                                      : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/20'
                                  }
                              `}
                          >
                              {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-emerald-500"></div>}
                              <div className="flex items-start justify-between mb-3">
                                  <div>
                                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${isActive ? template.accent : 'text-neutral-500'}`}>
                                          {template.category}
                                      </p>
                                      <h4 className={`font-bold text-xl leading-tight ${isActive ? 'text-white' : 'text-neutral-300 group-hover:text-white'}`}>
                                          {template.title}
                                      </h4>
                                  </div>
                                  <div className={`p-2.5 rounded-full transition-colors ${isActive ? 'bg-primary text-black shadow-lg' : 'bg-white/5 text-neutral-500 group-hover:bg-white/10 group-hover:text-white'}`}>
                                      <HiArrowRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-1' : ''}`} />
                                  </div>
                              </div>
                              <p className={`text-sm leading-relaxed ${isActive ? 'text-neutral-300' : 'text-neutral-500 line-clamp-2'}`}>
                                  {template.shortDescription}
                              </p>
                          </button>
                      )
                  })}
              </div>

              {selectedTemplate && (
                  <div className="w-full flex-1 min-w-0">
                      <AnimatePresence mode="wait">
                          <motion.div
                              key={selectedTemplate.id}
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -30 }}
                              transition={{ duration: 0.4, ease: 'easeOut' }}
                              className="flex flex-col gap-10"
                          >
                              <div>
                                  <div className="flex flex-wrap items-end justify-between gap-6 mb-6">
                                      <div>
                                          <h3 className="text-4xl md:text-5xl font-bold text-white font-display tracking-tight mb-3">
                                              {selectedTemplate.title}
                                          </h3>
                                          <p className={`text-xl font-medium ${selectedTemplate.accent}`}>{selectedTemplate.category}</p>
                                      </div>
                                  </div>
                                  <p className="text-neutral-300 text-lg leading-relaxed max-w-4xl">
                                      {selectedTemplate.description}
                                  </p>
                              </div>

                              <div className="relative w-full rounded-[2.5rem] bg-neutral-900 border border-white/10 py-12 px-4 md:px-12 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
                                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none"></div>

                                  <div className="absolute top-6 right-6 z-30 flex gap-2 bg-black/60 backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-xl">
                                      <button onClick={() => setTemplateView('desktop')} className={`p-3 rounded-full transition-all ${templateView === 'desktop' ? 'bg-white text-black scale-105' : 'text-white/50 hover:text-white hover:bg-white/10'}`}>
                                          <HiOutlineComputerDesktop size={20} />
                                      </button>
                                      <button onClick={() => setTemplateView('mobile')} className={`p-3 rounded-full transition-all ${templateView === 'mobile' ? 'bg-white text-black scale-105' : 'text-white/50 hover:text-white hover:bg-white/10'}`}>
                                          <HiOutlineDevicePhoneMobile size={20} />
                                      </button>
                                  </div>

                                  <AnimatePresence mode="wait">
                                      <motion.div
                                          key={templateView}
                                          initial={{ opacity: 0, scale: 0.95 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          exit={{ opacity: 0, scale: 0.95 }}
                                          transition={{ duration: 0.4 }}
                                          className="w-full flex justify-center relative z-10"
                                      >
                                          {templateView === 'desktop' ? (
                                              <div className="w-full max-w-5xl aspect-video bg-black rounded-xl md:rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
                                                  <div className="h-8 bg-neutral-900 border-b border-white/5 flex items-center px-4 gap-2 absolute top-0 w-full z-10">
                                                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                                                      <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                                                      <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
                                                      <div className="ml-4 h-4 w-64 bg-white/5 rounded-full hidden sm:block"></div>
                                                  </div>
                                                  <div className="w-full h-full bg-cover bg-top pt-8" style={{ backgroundImage: `url('${selectedTemplate.images.desktop}')` }}></div>
                                              </div>
                                          ) : (
                                              <div className="relative w-[280px] sm:w-[320px] aspect-[9/19] bg-black rounded-[3rem] border-[8px] border-neutral-800 shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden">
                                                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-neutral-900 rounded-b-2xl z-20"></div>
                                                  <div className="w-full h-full bg-cover bg-top" style={{ backgroundImage: `url('${selectedTemplate.images.mobile}')` }}></div>
                                              </div>
                                          )}
                                      </motion.div>
                                  </AnimatePresence>
                              </div>

                              <div>
                                  <h4 className="text-white font-bold mb-8 text-sm uppercase tracking-widest flex items-center gap-4">
                                      <span className="w-8 h-px bg-primary"></span> Arquitectura y Módulos
                                  </h4>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                      {selectedTemplate.features.map((feature, idx) => (
                                          <div key={idx} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl hover:bg-white/5 hover:border-white/10 transition-all duration-300 flex flex-col gap-4 group">
                                              <div className={`text-3xl ${selectedTemplate.accent} p-3 bg-white/5 rounded-xl w-fit group-hover:scale-110 transition-transform`}>
                                                  {feature.icon}
                                              </div>
                                              <div>
                                                  <h5 className="text-white font-bold text-base mb-2">{feature.title}</h5>
                                                  <p className="text-neutral-400 text-sm">{feature.text}</p>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              </div>

                              <div className="mt-6 flex flex-wrap items-center justify-between gap-6 p-8 bg-neutral-900/50 rounded-3xl border border-white/5">
                                  <p className="text-sm text-neutral-500 italic">
                                      * Estas soluciones incluyen panel administrativo y bases de datos configuradas. Se personalizan con tu marca.
                                  </p>
                                  <Link href={`/contacto`} className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-sm hover:bg-primary hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] whitespace-nowrap">
                                      Adquirir Sistema <HiArrowRight size={14} />
                                  </Link>
                              </div>
                          </motion.div>
                      </AnimatePresence>
                  </div>
              )}
          </div>
      </section>

      {/* CTA FINAL MÁS ELEGANTE */}
      <div className="mx-auto max-w-5xl px-6 lg:px-8 mt-10">
          <div className="relative rounded-[3rem] bg-gradient-to-b from-neutral-900 to-black border border-white/10 px-6 py-20 sm:px-16 sm:py-24 overflow-hidden text-center shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
              
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white relative z-10 mb-6">
                  ¿Listo para ser el siguiente?
              </h2>
              <p className="mx-auto max-w-2xl text-lg md:text-xl text-neutral-400 relative z-10 leading-relaxed mb-12">
                  Cuéntanos tu idea. Te orientamos sobre qué tecnología usar y cómo hacerla rentable desde el primer día.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="https://wa.me/573000000000" className="inline-flex items-center justify-center gap-2 bg-primary text-black px-8 py-4 rounded-full font-bold text-base hover:shadow-[0_0_20px_rgba(0,255,127,0.4)] transition-all">
                      <FaWhatsapp size={20}/> Cotizar Proyecto
                  </Link>
                  <Link href="/servicios" className="inline-flex items-center justify-center gap-2 bg-neutral-800 text-white px-8 py-4 rounded-full font-bold text-base border border-white/10 hover:bg-neutral-700 transition-all">
                      Ver Servicios
                  </Link>
              </div>
          </div>
      </div>

    </main>
  )
}