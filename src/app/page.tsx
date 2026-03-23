'use client'

// --- Importaciones ---
import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
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
    HiOutlineChartBar,
    HiOutlineCodeBracket,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineShoppingCart,
  HiOutlineQrCode,
  HiOutlineCalendar,
  HiOutlineUserGroup,
  HiOutlineLightBulb,
  HiOutlineMegaphone, 
  HiOutlineBell,      
  HiOutlineIdentification, 
  HiOutlineHeart,
    HiOutlinePlay,
    HiOutlinePencilSquare
} from 'react-icons/hi2'
import { FaWhatsapp, FaAndroid, FaNutritionix, FaBed, FaGlobe, FaExternalLinkAlt, FaRobot } from 'react-icons/fa'
import { AiOutlineUserAdd, AiOutlineCloudUpload } from 'react-icons/ai'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'
import { RiFileSearchLine } from 'react-icons/ri'
import { TbBell } from 'react-icons/tb'
import { BiShield } from 'react-icons/bi'
import { FiRefreshCw, FiPrinter } from 'react-icons/fi'
import { HiOutlineSearch } from 'react-icons/hi'
import { demos } from '@/lib/demos-data'

// Tipo de dato ligero para los proyectos de esta página
type ProjectLite = {
    id: string;
    title: string;
    subtitle?: string;
    category?: string;
    shortDescription?: string;
    description?: string;
    tags?: string[];
    link?: string;
    buttonText?: string;
    images: { desktop: string; mobile: string };
    features: { icon: React.ReactNode; title?: string; desc?: string; text?: string }[];
    color?: string;
    accent?: string;
    bgBtn?: string;
    isMobileOnly?: boolean; // Bandera para forzar solo vista móvil
}

// --- 1. DATOS DE PROYECTOS REALES (CLIENTES DE PAGO & ESPECIALES) ---
const projectsData: ProjectLite[] = [
  {
    id: 'ser-deseable',
    title: 'Ser Deseable',
    subtitle: 'Salud, Nutrición & Longevidad',
    category: 'Plataforma Web & E-commerce',
    description: 'Transformamos un método de entrenamiento en un ecosistema digital completo. Una plataforma moderna diseñada para guiar a los usuarios hacia una vida más saludable con herramientas interactivas y comercio integrado.',
    tags: ['En Producción', 'Web App', 'Bilingüe'],
    link: 'https://www.serdeseable.site/',
    buttonText: 'Visitar Plataforma',
    images: { desktop: "/images/pagados/serdeseable/1.webp", mobile: "/images/pagados/serdeseable/serdeseablemv.webp" },
    features: [
      { icon: <FaNutritionix/>, title: "Calculadora Nutricional", desc: "Herramienta interactiva personalizada" },
      { icon: <HiOutlineShoppingCart/>, title: "Tienda Integrada", desc: "Carrito dinámico y gestión de pedidos" },
      { icon: <HiOutlineGlobeAlt/>, title: "Multi-Idioma", desc: "Experiencia fluida en Español e Inglés" },
      { icon: <HiOutlineCpuChip/>, title: "Panel Administrativo", desc: "Gestión total de usuarios e inventario" }
    ],
    color: "from-primary/20 to-primary/20",
    accent: "text-primary"
  },
  {
    id: 'Boutique de Perfumes',
    title: 'Principerfum',
    subtitle: 'E-commerce & Panel de Control',
    category: 'Plataforma Web Full-Stack',
    description: 'Tienda online premium de fragancias con catálogo dinámico y filtros avanzados. Cuenta con un dashboard administrativo privado para gestionar inventario, monitorear métricas de ventas y moderar reseñas de clientes en tiempo real.',
    tags: ['E-commerce', 'Panel Admin', 'Base de Datos'],
    link: '#', // Reemplazar con el link real
    buttonText: 'Visitar Tienda',
    images: { desktop: "/images/pagados/principerfum/escritorio.webp", mobile: "/images/pagados/principerfum/celular.webp" }, // Reemplazar con rutas reales
    features: [
      { icon: <HiOutlineShoppingCart/>, title: "Catálogo Dinámico", desc: "Filtros por marca, género y búsqueda inteligente." },
      { icon: <FaWhatsapp/>, title: "WhatsApp Checkout", desc: "Pedidos y consultas directas sin pasarelas complejas." },
      { icon: <HiOutlineCpuChip/>, title: "Dashboard Admin", desc: "Creación/edición de productos y métricas del negocio." },
      { icon: <HiOutlineHeart/>, title: "Sistema de Reseñas", desc: "Valoraciones de usuarios con moderación administrativa." }
    ],
    color: "from-primary/20 to-primary/20",
    accent: "text-primary"
  },
  {
    id: 'sorpresa-maria',
    title: 'Sorpresa Interactiva',
    subtitle: 'Experiencia Web Mobile-First',
    category: 'Detalle Especial / Interactivo',
    description: 'Un proyecto especial creado como regalo de cumpleaños. Una experiencia web móvil donde un sobre 3D reacciona al tacto, se abre con efectos de sonido, lanza confeti y revela una tarjeta holográfica con un código de regalo oculto.',
    tags: ['Mobile First', 'Animaciones CSS', 'Multimedia'],
    link: '#', 
    buttonText: 'Ver Experiencia',
    images: { desktop: "", mobile: "/images/pagados/cumpleanos/celular.webp" }, // desktop vacío intencionalmente
    features: [
      { icon: <HiOutlineSparkles/>, title: "Interacción 3D", desc: "El sobre reacciona al movimiento del dedo." },
      { icon: <HiOutlineMegaphone/>, title: "Audio & Confeti", desc: "Efectos multimedia al abrir el regalo." },
      { icon: <HiOutlineIdentification/>, title: "Tarjeta Holográfica", desc: "Efecto visual brillante avanzado." },
      { icon: <HiOutlineQrCode/>, title: "Código Dinámico", desc: "Animación de descifrado y tap-to-copy." }
    ],
    color: "from-primary/20 to-primary/20", 
    accent: "text-primary",
    isMobileOnly: true
  },
  {
    id: 'refugio-dannita',
    title: 'Refugio Personal',
    subtitle: 'Experiencia Web Mobile-First',
    category: 'Detalle Especial / Interactivo',
    description: 'Un espacio digital íntimo diseñado para consolar y acompañar. Cuenta con cartas selladas que guardan en memoria cuáles has leído, un oráculo interactivo "Piscis" nocturno, galería de recuerdos revelable y un entorno inmersivo con flores que reaccionan al tacto.',
    tags: ['Mobile First', 'Web App', 'Inmersivo'],
    link: '#', 
    buttonText: 'Ver Experiencia',
    images: { desktop: "", mobile: "/images/pagados/novia/celular.webp" }, 
    features: [
      { icon: <HiOutlineSparkles/>, title: "Entorno Reactivo", desc: "Flores flotantes que aparecen donde tocas la pantalla." },
      { icon: <HiOutlineHeart/>, title: "Cartas con Memoria", desc: "Mensajes sellados que recuerdan tu lectura en el dispositivo." },
      { icon: <HiOutlineLightBulb/>, title: "Oráculo Interactivo", desc: "Sección nocturna con frases aleatorias al toque." },
      { icon: <HiOutlineBell/>, title: "Notificaciones", desc: "Avisos silenciosos vía Formspree al interactuar." }
    ],
    color: "from-primary/20 to-primary/20", 
    accent: "text-primary",
    isMobileOnly: true
  },
  {
    id: 'felicitacion-sandra',
    title: 'Felicitación Interactiva',
    subtitle: 'Experiencia Web Mobile-First',
    category: 'Detalle Especial / Interactivo',
    description: 'Página de felicitación personalizada. Inicia con una pantalla de bienvenida que, al interactuar, revela un mensaje emotivo, una galería de fotos estilo "bento" y música de fondo sincronizada con controles anti-superposición.',
    tags: ['Mobile First', 'Audio Web', 'Multimedia'],
    link: '#', 
    buttonText: 'Ver Experiencia',
    images: { desktop: "", mobile: "/images/pagados/regalo madre/celular.webp" }, 
    features: [
      { icon: <HiOutlineSparkles/>, title: "Abrazo Virtual", desc: "Botón interactivo que lanza confeti de celebración." },
      { icon: <HiOutlinePlay/>, title: "Control de Audio", desc: "Música de fondo optimizada para no superponerse." },
      { icon: <HiOutlineComputerDesktop/>, title: "Galería Bento", desc: "Mosaico fotográfico dinámico y adaptativo." },
      { icon: <HiOutlineHeart/>, title: "Transición Fluida", desc: "Efectos visuales desde la pantalla de bienvenida." }
    ],
    color: "from-primary/20 to-primary/20", 
    accent: "text-primary",
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
        images: { desktop: "", mobile: "/images/social/zap/celular.jpeg" }, // Solo necesita móvil
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
        isNativeApp: true // ¡NUEVO! Esta bandera activa el diseño especial para Apps
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
        images: { desktop: "", mobile: "/images/social/opitago/movil.jpeg" }, // Imagen desktop eliminada
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
        isNativeApp: true // ¡AÑADIDO! Ahora se mostrará como app flotante
    },
    {
        id: 'campus-usco',
        title: 'Marketplace USCO',
        subtitle: 'Marketplace Universitario & Directorio',
        mission: 'Facilitar el comercio local y centralizar la información académica para la comunidad de la universidad.',
        description: 'Una app móvil (PWA) que conecta estudiantes y vendedores. Funciona como un mercado virtual con feed de productos, perfiles de tiendas y un directorio de profesores. Todo optimizado para pantallas móviles con interacciones rápidas e inicio de sesión seguro.',
        tags: ['Marketplace', 'Login Google', 'Comunidad USCO'],
        link: '#', // Pon aquí el link real si lo tienes
        buttonText: 'Abrir App',
        images: { desktop: "", mobile: "/images/social/proyectousco/celular.jpeg" }, 
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
        isNativeApp: true // Mantiene el diseño holográfico móvil
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
            { icon: <HiOutlineCalendar/>, title: "Búsqueda y Disponibilidad", desc: "Busca por fechas y muestra disponibilidad en tiempo real con reglas de ocupación y bloqueos." },
            { icon: <FaBed/>, title: "Gestión de Habitaciones", desc: "Crear/editar habitaciones, asignar tipos, controlar estado (Disponible/Reservada/Limpieza) y precios por habitación." },
            { icon: <AiOutlineUserAdd/>, title: "Control de Usuarios y Roles", desc: "Usuarios con roles (ADMIN/SUPERADMIN/HUESPED), permisos granulares para panel y endpoints." },
            { icon: <MdOutlineAdminPanelSettings/>, title: "Panel Administrativo", desc: "Dashboard con métricas clave, últimas reservas, calendario operativo y acciones rápidas (check-in/out, cancelar, marcar limpieza)." },
            { icon: <RiFileSearchLine/>, title: "Reservas y Gestión", desc: "Crear reservas manuales, gestión de pagos (placeholder) y estados, modificar fechas y aplicar descuentos." },
            { icon: <TbBell/>, title: "Notificaciones y Emails", desc: "Plantillas de correo para confirmación, recordatorios y cancelaciones; logs de envíos y reintentos." },
            { icon: <BiShield/>, title: "Seguridad y Robustez", desc: "Autenticación segura por token, protección de rutas admin y manejo fiable de CORS/preflight en serverless." },
            { icon: <FiRefreshCw/>, title: "Operaciones y Cron", desc: "Cron controlado (deshabilitado por defecto en serverless) para tareas periódicas: liberación automática de habitaciones, recordatorios y reportes." },
            { icon: <HiOutlineSearch/>, title: "Filtrado y Búsqueda", desc: "Filtra por tipo de habitación, precio, capacidad y estados; paginación y cache para respuestas rápidas." },
            { icon: <AiOutlineCloudUpload/>, title: "Gestión de Medios", desc: "Subida y servicio de imágenes para habitaciones con ruta estática /uploads y control de tamaños." }
        ],
        color: "from-primary/10 to-primary/10",
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
            { icon: <AiOutlineUserAdd/>, title: "Check‑in y Gestión de Sesiones", desc: "Registro rápido de entradas, control del tiempo de estadía, prepagos y flujos de salida que reducen filas y errores en recepción." },
            { icon: <RiFileSearchLine/>, title: "Facturación Electrónica", desc: "Generación de factura/ticket con cálculo de impuestos y preparación para integración con proveedores de facturación electrónica." },
            { icon: <HiOutlineShoppingCart/>, title: "Minibar & Comandas", desc: "Registro de consumos de nevera y pedidos al bar integrados a la sesión del cliente para facturar automáticamente y controlar inventario." },
            { icon: <HiOutlineCloudArrowDown/>, title: "Modo Offline y Sincronización", desc: "Opera sin internet guardando acciones localmente y sincronizando cuando hay conexión, evitando interrupciones de servicio." },
            { icon: <FiRefreshCw/>, title: "Turnos y Cierres de Caja", desc: "Apertura/cierre de turnos con arqueos, reportes de ventas por método de pago y generación de resúmenes imprimibles para auditoría." },
            { icon: <TbBell/>, title: "Notificaciones Operativas", desc: "Mensajería interna por rol (patios, aseo, recepción) para solicitudes de salida, pedidos listos y tareas de limpieza, reduciendo tiempos de coordinación." },
            { icon: <FaBed/>, title: "Gestión de Habitaciones", desc: "Control de estados (Disponible/Ocupada/Limpieza/Mantenimiento), asignación por categorías y reglas de precios por tipo de habitación." },
            { icon: <HiOutlineChartBar/>, title: "Informes y Analíticas", desc: "Reportes diarios, estadísticas por turno y hora pico, exportación de registros para conciliación y toma de decisiones." },
            { icon: <FaExternalLinkAlt/>, title: "Inventario y Alertas", desc: "Gestión de productos, control de stock y alertas de mínimos para minimizar pérdidas en minibar y bar." },
            { icon: <FiPrinter/>, title: "Impresión y Tickets", desc: "Generación de tickets y facturas en formato para impresoras fiscales/matriciales y tickets de cliente." },
            { icon: <BiShield/>, title: "Control de Usuarios y Seguridad", desc: "Roles predefinidos (ADMIN/RECEPCION/PATIO/ASEO) con permisos, cambios de contraseña y protección de sesiones." },
            { icon: <AiOutlineCloudUpload/>, title: "Personalización e Integraciones", desc: "Capacidad para adaptar tarifas, reglas promocionales (por ejemplo, descuentos por día) e integrar datáfonos o sistemas de facturación externos." }
        ],
        color: "from-primary/10 to-primary/10",
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
            { icon: <HiOutlineQrCode/>, title: "Scanner QR y Control de Acceso", desc: "Lectura rápida de entradas con validación, estados claros (válido/duplicado/cancelado) y modo offline para puertas sin conexión." },
            { icon: <HiOutlineCalendar/>, title: "Gestión de Entradas y Tipos", desc: "Crear y editar tipos de entrada (anticipada, VIP, promo), límites de aforo, precios y reglas de acceso por prioridad." },
            { icon: <HiOutlineUserGroup/>, title: "Panel para Promotores", desc: "Asignación de promotores con códigos o links, seguimiento de ventas por RRPP y cálculo automático de comisiones y pagos." },
            { icon: <HiOutlineShoppingCart/>, title: "Tienda de Merchandising", desc: "Catálogo de productos con gestión de stock, variantes de tallas, y proceso de compra integrado con la venta de entradas." },
            { icon: <HiOutlineDevicePhoneMobile/>, title: "Checkout y Flujo de Compra Sencillo", desc: "Experiencia de compra optimizada para móvil y desktop, resumen de pedidos claro y pasos guiados hasta la confirmación." },
            { icon: <HiOutlineChartBar/>, title: "Panel Administrativo y Reportes", desc: "Dashboard con ventas en tiempo real, lista de asistentes, resumen por evento, exportes CSV y métricas clave para la toma de decisiones." },
            { icon: <HiOutlineIdentification/>, title: "Gestión de Asistentes", desc: "Lista de entradas vendidas, búsqueda y filtros por nombre o código, marcación de asistencia y reimpresión de tickets." },
            { icon: <HiOutlineMegaphone/>, title: "Workflows Operativos", desc: "Herramientas para el día del evento: creación de turnos, control de accesos, y acciones rápidas para resolver incidencias." },
            { icon: <TbBell/>, title: "Notificaciones y Mensajería", desc: "Envío de confirmaciones y recordatorios a compradores; plantillas para comunicaciones y registro de envíos." },
            { icon: <FaExternalLinkAlt/>, title: "Exportes y Recuperación de Datos", desc: "Exportes de ventas y listas de asistentes para contabilidad o control; historial de transacciones y acciones." },
            { icon: <BiShield/>, title: "Seguridad y Privacidad", desc: "Gestión responsable de datos de asistentes con controles de acceso al panel administrativo y prácticas mínimas de protección de información." },
            { icon: <FaGlobe/>, title: "Modo Feria / Eventos Multiescena", desc: "Soporta varios puntos de venta y puertas simultáneas, con control centralizado y sincronización de aforos." },
            { icon: <HiOutlineUserGroup/>, title: "Soporte Operativo y Herramientas de Puerta", desc: "Interfaz clara para personal de puerta con indicadores visuales y acciones simples para atender incidencias rápidamente." },
            { icon: <HiOutlineCpuChip/>, title: "Escalabilidad Operativa", desc: "Pensada para pequeños shows y eventos medianos; facilita la configuración rápida y la operación por equipos sin experiencia técnica." }
        ],
        color: "from-primary/10 to-primary/10",
        accent: "text-primary",
        meta: { status: "Demo funcional", version: "1.0", updatedAt: "2026-03-15" },
        notes: "FiestPro está pensado como una plataforma lista para demo y pruebas operativas. Para despliegue en producción se recomiendan integrar pasarela de pagos, sistema de respaldo de datos, políticas de cumplimiento de privacidad y un plan de soporte para el día del evento. Se aconseja validar los flujos de puerta en condiciones reales antes de eventos críticos."
    },
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
            
            <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/70 leading-relaxed">
              Transformamos tu visión en tecnología real. Sitios web, sistemas de gestión y aplicaciones móviles (Android & PWA).
            </p>

            {/* --- BANNER DE MOCKUPS GRATIS (VIP EDITION) --- */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-12 mx-auto max-w-3xl relative group cursor-default"
            >
                {/* Brillo trasero animado (Aura) */}
                <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/30 via-primary/30 to-primary/30 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-300 animate-gradient-x"></div>
                
                {/* Contenedor Principal (Vidrio Esmerilado) */}
                <div className="relative flex flex-col sm:flex-row items-center gap-5 sm:gap-6 bg-neutral-950/80 backdrop-blur-2xl px-6 py-6 sm:px-8 sm:py-7 rounded-[2rem] border border-white/10 group-hover:border-primary/30 transition-all duration-500">
                    
                    {/* Icono Flotante */}
                    <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-primary/20 blur-md rounded-full animate-pulse"></div>
                        <div className="relative h-14 w-14 bg-neutral-900 border border-white/10 rounded-full flex items-center justify-center text-primary shadow-[0_0_20px_rgba(0,255,127,0.15)] group-hover:scale-110 transition-transform duration-500">
                            <HiOutlineLightBulb className="w-7 h-7" />
                        </div>
                    </div>

                    {/* Contenido de Texto */}
                    <div className="flex-1 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                                Cero Riesgo
                            </span>
                            <h3 className="text-white font-bold text-lg font-display tracking-wide">
                                Prototipo Visual Gratuito
                            </h3>
                        </div>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            ¿Tienes una idea en mente? Diseñamos el <strong className="text-white font-medium">mockup interactivo</strong> de tu App o Web totalmente <strong className="text-primary uppercase tracking-wider text-xs">gratis y sin compromiso</strong>. Descubre cómo se verá tu negocio en el futuro.
                        </p>
                    </div>

                    {/* Indicador visual (Flecha sutil apuntando a los botones de abajo) */}
                    <div className="hidden sm:flex flex-shrink-0 items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/30 group-hover:text-primary transition-colors">
                        <HiArrowRight className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    </div>
                </div>
            </motion.div>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="https://wa.me/573000000000?text=Hola,%20tengo%20una%20idea%20y%20quiero%20mi%20mockup%20gratuito!" 
                  target="_blank"
                  className="group relative inline-flex h-14 w-full sm:w-auto items-center justify-center overflow-hidden rounded-full bg-primary px-8 font-bold text-background transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-[0_0_30px_theme(colors.primary.DEFAULT)]"
                >
                  <span className="mr-2"><FaWhatsapp size={22} /></span>
                  Reclamar Mockup Gratis
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

// --- 2. PROJECTS SHOWCASE (CARRUSEL PROYECTOS REALES - PREMIUM REDESIGN) ---
const ProjectsShowcase = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Auto-play y tracking del slide activo
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

    if (!projectsData || projectsData.length === 0) return null;

    // Mostrar solo los primeros 3 proyectos en el carrusel
    const visibleProjects = projectsData.slice(0, 3);

    return (
        <section id="portafolio" className="py-16 lg:py-20 bg-neutral-950 relative overflow-hidden">
            {/* Patrón de fondo sutil */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* HEADER Y NAVEGACIÓN FLOTANTE */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b border-white/5 pb-6">
                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs mb-3 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                            <HiOutlineSparkles className="w-4 h-4" /> Casos de Éxito
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
                            Impacto <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Real</span>
                        </h2>
                    </div>
                    
                    {/* Botones de Navegación del Carrusel */}
                    <div className="flex items-center gap-2 bg-white/[0.02] p-1.5 rounded-full border border-white/10 backdrop-blur-md">
                        <button onClick={scrollPrev} className="p-3 rounded-full border border-transparent text-neutral-400 hover:text-white hover:bg-white/10 transition-all"><HiChevronLeft size={22} /></button>
                        <div className="w-px h-5 bg-white/10"></div>
                        <button onClick={scrollNext} className="p-3 rounded-full border border-transparent text-neutral-400 hover:text-white hover:bg-white/10 transition-all"><HiChevronRight size={22} /></button>
                    </div>
                </div>

                {/* CONTENEDOR DEL CARRUSEL */}
                <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-neutral-900/20 shadow-2xl relative" ref={emblaRef}>
                    
                    <div className="flex touch-pan-y">
                        {visibleProjects.map((project) => (
                            <div key={project.id} className="flex-[0_0_100%] min-w-0 relative">
                                
                                {/* SLIDE INDIVIDUAL */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center p-6 sm:p-8 lg:p-12 relative overflow-hidden group h-auto lg:h-[520px]">
                                    
                                    {/* Resplandor dinámico de fondo */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl pointer-events-none"></div>

                                    {/* --- INFORMACIÓN DEL PROYECTO (IZQUIERDA) --- */}
                                    <div className="lg:col-span-5 relative z-10 flex flex-col justify-center h-full">
                                        <div className="mb-4 lg:mb-6">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">{project.category || 'Proyecto Real'}</p>
                                            <h3 className="text-3xl sm:text-4xl font-bold text-white font-display leading-tight mb-3">
                                                {project.title}
                                            </h3>
                                            <p className="text-base text-primary font-medium mb-3">
                                                {project.subtitle}
                                            </p>
                                            <p className="text-neutral-400 leading-relaxed text-sm">
                                                {project.description}
                                            </p>
                                        </div>

                                        {/* Tags Tecnológicos */}
                                        {project.tags && (
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {project.tags.slice(0, 4).map((tag: string) => (
                                                    <span key={tag} className="px-2.5 py-1 bg-black/40 border border-white/5 text-neutral-300 text-[10px] font-bold uppercase tracking-wider rounded-md">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Botón de Acción (FIX: Se quitó mt-auto, ahora se usa mt-2 para no empujarlo fuera) */}
                                        <div className="mt-2 pt-5 border-t border-white/5">
                                            <Link href="/portafolio" className="inline-flex items-center gap-2 bg-white text-black px-7 py-3 rounded-full font-bold text-xs hover:bg-primary hover:scale-105 transition-all shadow-lg group/btn w-fit">
                                                Ver Portafolio <FaExternalLinkAlt size={11} className="group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* --- COMPOSICIÓN VISUAL ADAPTATIVA (DERECHA) --- */}
                                    <div className="lg:col-span-7 relative z-10 w-full flex items-center justify-center mt-8 lg:mt-0 h-[350px] sm:h-[400px] lg:h-full">
                                        
                                        <div className="relative w-full h-full">
                                            
                                            {/* --- CASO 1: DESKTOP + MOBILE (HÍBRIDO CALIBRADO) --- */}
                                            {project.images?.desktop && project.images?.mobile ? (
                                                <div className="relative w-full h-full">
                                                    {/* Desktop anclado Arriba-Derecha */}
                                                    <div className="absolute top-[8%] right-0 w-[85%] lg:w-[80%] aspect-video bg-neutral-950 rounded-xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.7)] overflow-hidden group-hover:-translate-y-2 group-hover:scale-[1.02] transition-all duration-700">
                                                        <div className="h-5 md:h-6 bg-neutral-900 border-b border-white/5 flex items-center px-3 gap-1.5">
                                                            <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
                                                            <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
                                                            <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
                                                        </div>
                                                        <div className="w-full h-full bg-cover bg-top" style={{ backgroundImage: `url('${project.images.desktop}')` }}></div>
                                                    </div>
                                                    {/* Mobile anclado Abajo-Izquierda (Controlado por alto para no salirse) */}
                                                    <div className="absolute bottom-[2%] lg:bottom-[8%] left-[5%] lg:left-4 h-[75%] lg:h-[80%] aspect-[9/19] bg-black rounded-3xl border-[5px] lg:border-[6px] border-neutral-800 shadow-[10px_20px_40px_rgba(0,0,0,0.9)] overflow-hidden group-hover:-translate-y-4 group-hover:rotate-[-3deg] transition-all duration-700 delay-100">
                                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-3 md:h-4 bg-neutral-900 rounded-b-lg z-20"></div>
                                                        <div className="w-full h-full bg-cover bg-top" style={{ backgroundImage: `url('${project.images.mobile}')` }}></div>
                                                    </div>
                                                </div>
                                            ) 

                                            // --- CASO 2: SOLO MOBILE (FIX: CONTROLADO POR ALTURA EN VEZ DE ANCHO) ---
                                            : !project.images?.desktop && project.images?.mobile ? (
                                                <div className="relative w-full h-full flex items-center justify-center">
                                                    <div className="absolute inset-0 bg-primary/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none w-1/2 left-1/2 -translate-x-1/2"></div>
                                                    
                                                    {/* Mobile Principal (Ahora usa h-[90%] en lugar de w-[Xpx], garantizando que nunca se corte por arriba/abajo) */}
                                                    <div className="relative z-20 h-[85%] lg:h-[90%] aspect-[9/19] bg-black rounded-[2.5rem] border-[6px] lg:border-[8px] border-neutral-800 shadow-[0_20px_40px_rgba(0,0,0,0.8)] shadow-primary/10 overflow-hidden transform group-hover:-translate-y-3 group-hover:rotate-2 transition-all duration-700">
                                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-neutral-900 rounded-b-xl z-20"></div>
                                                        <div className="w-full h-full bg-cover bg-top" style={{ backgroundImage: `url('${project.images.mobile}')` }}></div>
                                                    </div>

                                                    {/* Mobile Desenfoque (Usa h-[75%]) */}
                                                    <div className="absolute z-10 right-[5%] lg:right-[15%] top-1/2 -translate-y-[45%] h-[70%] lg:h-[75%] aspect-[9/19] bg-black rounded-3xl border-[5px] border-neutral-800 shadow-[0_20px_40px_rgba(0,0,0,0.6)] overflow-hidden opacity-40 blur-[2px] transform rotate-[-5deg] transition-all duration-700 delay-100 group-hover:-translate-y-[48%] group-hover:rotate-[-7deg]">
                                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-4 bg-neutral-900 rounded-b-lg z-20"></div>
                                                        <div className="w-full h-full bg-cover bg-top" style={{ backgroundImage: `url('${project.images.mobile}')` }}></div>
                                                    </div>
                                                </div>
                                            ) 

                                            // --- CASO 3: SOLO PC (Modo Heroico Centrado) ---
                                            : project.images?.desktop && !project.images?.mobile ? (
                                                <div className="relative w-full h-full flex items-center justify-center">
                                                    <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none w-2/3 left-1/2 -translate-x-1/2"></div>
                                                    
                                                    {/* PC Heroica */}
                                                    <div className="relative z-20 w-[95%] lg:w-[90%] aspect-video bg-neutral-950 rounded-xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden transform group-hover:scale-[1.02] group-hover:-translate-y-2 transition-all duration-700">
                                                        <div className="h-5 md:h-6 bg-neutral-900 border-b border-white/5 flex items-center px-3 gap-1.5">
                                                            <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
                                                            <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
                                                            <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
                                                            <div className="ml-3 w-32 h-2 bg-white/5 rounded-full hidden sm:block"></div>
                                                        </div>
                                                        <div className="w-full h-full bg-cover bg-top" style={{ backgroundImage: `url('${project.images.desktop}')` }}></div>
                                                    </div>
                                                </div>
                                            ) : null}

                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PAGINACIÓN INFERIOR (PUNTOS) */}
                <div className="flex justify-center gap-2 mt-8">
                    {visibleProjects.map((_, index) => (
                        <button 
                            key={index} 
                            onClick={() => emblaApi && emblaApi.scrollTo(index)} 
                            className={`h-1.5 rounded-full transition-all duration-500 ${index === selectedIndex ? 'w-10 bg-primary shadow-[0_0_8px_rgba(0,255,127,0.5)]' : 'w-2 bg-white/20 hover:bg-white/40'}`} 
                            aria-label={`Ir al proyecto ${index + 1}`} 
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

// --- 3. COMMUNITY SHOWCASE (SISTEMA HÍBRIDO WEB/APPS NATIVAS) ---
const CommunityShowcase = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    
    // Inicializar la vista dependiendo del primer proyecto
    const [view, setView] = useState<'desktop' | 'mobile'>(communityProjects[0]?.isNativeApp ? 'mobile' : 'desktop');
    
    const activeProject = communityProjects[activeIndex];

    // Efecto para forzar la vista móvil si el proyecto lo requiere al cambiar de pestaña
    useEffect(() => {
        if (activeProject.isNativeApp) {
            setView('mobile');
        } else {
            setView('desktop');
        }
    }, [activeProject.isNativeApp, activeIndex]);

    return (
        <section className="py-24 lg:py-32 bg-neutral-950 relative overflow-hidden border-t border-white/5">
            {/* Brillo ambiental para unificar con LabShowcase y Services */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="mx-auto max-w-[1400px] px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs mb-4 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                        <HiOutlineHeart className="w-4 h-4 animate-pulse" /> Responsabilidad Social
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white tracking-tight leading-tight">Tecnología con Propósito</h2>
                    <p className="mt-6 text-neutral-400 text-lg leading-relaxed">
                        Plataformas web y aplicaciones nativas creadas por Vertrex para resolver problemas reales en nuestra ciudad y entornos sin conexión.
                    </p>
                </div>

                {/* --- PESTAÑAS DE NAVEGACIÓN --- */}
                <div className="flex justify-center mb-12">
                    <div className="flex gap-2 overflow-x-auto py-4 max-w-full px-4 no-scrollbar">
                        {communityProjects.map((project, index) => (
                            <button
                                key={project.id}
                                onClick={() => setActiveIndex(index)}
                                className={`px-6 py-3.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-500 border flex items-center gap-2 ${
                                    activeIndex === index 
                                    ? 'bg-primary/10 text-primary border-primary/30 scale-105 shadow-[0_0_20px_rgba(0,255,127,0.15)]' 
                                    : 'bg-white/5 text-neutral-400 border-white/5 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {project.isNativeApp && (project.platform === 'pwa'
                                    ? <HiOutlineGlobeAlt className={activeIndex === index ? "text-primary" : "text-neutral-500"} />
                                    : <FaAndroid className={activeIndex === index ? "text-primary" : "text-neutral-500"} />)}
                                {project.title}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-neutral-900/30 border border-white/5 rounded-[2.5rem] p-6 sm:p-10 lg:p-12 backdrop-blur-xl">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeProject.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
                    >
                        {/* --- LADO IZQUIERDO: VISUALIZADOR --- */}
                        <div className="w-full relative group order-2 lg:order-1 flex justify-center">
                            {/* Brillo ambiental dinámico */}
                            <div className={`absolute ${activeProject.isNativeApp ? 'inset-10' : '-inset-4'} bg-gradient-to-r ${activeProject.color} rounded-full opacity-30 blur-3xl group-hover:opacity-60 transition-opacity duration-700`}></div>
                            
                            <div className={`relative ${activeProject.isNativeApp ? 'w-auto' : 'w-full rounded-[2rem] border border-white/10 bg-neutral-900 overflow-hidden shadow-2xl'}`}>
                                
                                {/* Controles de vista (Solo se muestran si NO es una app nativa/PWA móvil) */}
                                {!activeProject.isNativeApp && (
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
                                )}

                                {/* Contenedor de la Imagen */}
                                <div className={`relative ${activeProject.isNativeApp ? 'py-4' : view === 'desktop' ? 'w-full aspect-video' : 'aspect-[4/3] flex items-center justify-center bg-neutral-900 py-8'}`}>
                                    <AnimatePresence mode="wait">
                                        <motion.div 
                                            key={view}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-full h-full flex items-center justify-center"
                                        >
                                            {/* RENDERIZADO CONDICIONAL: App Nativa vs Web */}
                                            {activeProject.isNativeApp ? (
                                                <div className="relative z-10 h-[500px] lg:h-[600px] aspect-[9/19] bg-black rounded-[3rem] border-[8px] border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-500">
                                                    {/* Notch / Cámara del celular simulada */}
                                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-neutral-900 rounded-b-2xl z-20"></div>
                                                    <div className="w-full h-full bg-cover bg-top" style={{ backgroundImage: `url('${activeProject.images.mobile}')` }}></div>
                                                </div>
                                            ) : view === 'desktop' ? (
                                                <div className="w-full h-full bg-cover bg-top" style={{ backgroundImage: `url('${activeProject.images.desktop}')` }}></div>
                                            ) : (
                                                <div className="h-[90%] aspect-[9/19] rounded-[2rem] border-[6px] border-neutral-800 overflow-hidden relative shadow-2xl">
                                                    <div className="w-full h-full bg-cover bg-top" style={{ backgroundImage: `url('${activeProject.images.mobile}')` }}></div>
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* --- LADO DERECHO: INFORMACIÓN --- */}
                        <div className="w-full order-1 lg:order-2">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="p-2 rounded-lg bg-white/5 text-white border border-white/5">
                                    {activeProject.isNativeApp
                                        ? (activeProject.platform === 'pwa'
                                            ? <HiOutlineGlobeAlt className="w-5 h-5 text-primary" />
                                            : <FaAndroid className="w-5 h-5 text-primary" />)
                                        : <HiOutlineHeart className="w-5 h-5 text-primary"/>}
                                </span>
                                <span className={`text-xs font-bold uppercase tracking-widest ${activeProject.accent}`}>
                                    {activeProject.isNativeApp
                                        ? (activeProject.platform === 'pwa' ? 'PWA Multiplataforma' : 'Desarrollo Móvil Avanzado')
                                        : 'Iniciativa Propia'}
                                </span>
                            </div>
                            
                            <h3 className="text-4xl font-bold text-white font-display mb-2">{activeProject.title}</h3>
                            <p className="text-xl text-white/60 mb-6">{activeProject.subtitle}</p>
                            
                            <div className="bg-white/5 border border-white/5 rounded-xl p-6 mb-8 relative overflow-hidden">
                                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${activeProject.color}`}></div>
                                <p className="text-neutral-300 italic mb-2">&quot;{activeProject.mission}&quot;</p>
                                <p className="text-sm text-neutral-500 leading-relaxed">{activeProject.description}</p>
                            </div>

                            {/* Características técnicas eliminadas por petición del cliente */}

                            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5">
                                <Link href="/portafolio" className={`rounded-xl px-8 py-3.5 font-bold text-black ${activeProject.bgBtn} hover:brightness-110 transition-all flex items-center gap-2 shadow-lg`}>
                                    Ver Portafolio <HiArrowRight size={14} />
                                </Link>
                                <div className="flex flex-wrap gap-2">
                                    {(activeProject.tags ?? []).map((tag: string) => (
                                        <span key={tag} className="px-3 py-1.5 rounded-lg border border-white/10 bg-black/50 text-[10px] uppercase tracking-wider text-neutral-400 font-bold">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
                </div>
            </div>
        </section>
    )
}

// --- 4. PLANTILLAS DE NEGOCIO (CATÁLOGO EXPANDIDO - REDISEÑO FULL PAGE) ---
const TemplatesShowcase = ({ templatesData: passedTemplates }: { templatesData?: ProjectLite[] } = {}) => {
    const templates = (passedTemplates && passedTemplates.length) ? passedTemplates : templatesData;
    if (!templates || templates.length === 0) return null;

    // Solo mostramos un "Teaser" de 3 plantillas en el Home para no saturar
    const featuredTemplates = templates.slice(0, 3);

    return (
        <section className="py-24 lg:py-32 bg-neutral-950 relative border-t border-white/5 overflow-hidden">
            {/* Fondo Técnico */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,black,transparent)] pointer-events-none"></div>

            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* HEADER CON BOTÓN HACIA LA SUBPÁGINA */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16 border-b border-white/5 pb-8">
                    <div className="max-w-3xl">
                        <span className="flex items-center w-fit gap-2 text-primary font-bold tracking-widest uppercase text-xs mb-4 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                            <HiOutlineCodeBracket className="w-4 h-4" /> Acelera tu Despliegue
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white tracking-tight mb-4">
                            Catálogo de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Software</span>
                        </h2>
                        <p className="text-neutral-400 text-lg md:text-xl leading-relaxed">
                            Arquitecturas pre-construidas y probadas en el mundo real. No reinventes la rueda, lanza tu ecosistema hoy mismo.
                        </p>
                    </div>

                    <Link href="/portafolio" className="hidden md:flex shrink-0 items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-full font-bold transition-all hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,255,127,0.1)] group">
                        Ver Catálogo Completo <HiArrowRight className="group-hover:translate-x-1 text-primary transition-transform" />
                    </Link>
                </div>

                {/* GRID DE TEASERS (3 Columnas) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {featuredTemplates.map((template) => (
                        <Link href="/portafolio" key={template.id} className="group flex flex-col bg-neutral-900/40 backdrop-blur-sm border border-white/5 rounded-[2rem] overflow-hidden hover:bg-neutral-800/60 hover:border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                            
                            {/* VENTANA VISUAL (Estilo Peeking / Anclado abajo) */}
                            <div className="h-64 w-full bg-neutral-950 relative overflow-hidden border-b border-white/5 flex items-end justify-center pt-8">
                                {/* Resplandor en Hover */}
                                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl z-0 pointer-events-none"></div>
                                
                                {/* --- CASO 1: Híbrido (PC + Celular) --- */}
                                {template.images?.desktop && template.images?.mobile ? (
                                    <>
                                        {/* PC anclada abajo a la derecha */}
                                        <div className="absolute -bottom-8 -right-8 w-[90%] sm:w-[85%] aspect-video bg-neutral-900 rounded-t-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] group-hover:-translate-y-4 group-hover:-translate-x-2 transition-all duration-500 z-10 overflow-hidden">
                                            <div className="h-5 bg-neutral-950 border-b border-white/5 flex items-center px-3 gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500/80"></div>
                                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/80"></div>
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500/80"></div>
                                            </div>
                                            <div className="relative w-full h-[calc(100%-1.25rem)] bg-neutral-950">
                                                <Image
                                                    src={template.images.desktop}
                                                    alt={`${template.title} desktop preview`}
                                                    fill
                                                    className="object-contain object-center"
                                                    sizes="(max-width: 640px) 90vw, 45vw"
                                                />
                                            </div>
                                        </div>
                                        {/* Celular anclado abajo a la izquierda */}
                                        <div className="absolute -bottom-16 left-4 sm:left-6 w-[35%] sm:w-[30%] aspect-[9/19] bg-black rounded-t-[2rem] border-[5px] border-b-0 border-neutral-800 shadow-[10px_0_30px_rgba(0,0,0,0.9)] group-hover:-translate-y-6 group-hover:rotate-[-2deg] transition-all duration-500 delay-75 z-20 overflow-hidden">
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-3 bg-neutral-900 rounded-b-lg z-20"></div>
                                            <div className="relative w-full h-full bg-neutral-950">
                                                <Image
                                                    src={template.images.mobile}
                                                    alt={`${template.title} mobile preview`}
                                                    fill
                                                    className="object-contain object-top"
                                                    sizes="(max-width: 640px) 35vw, 20vw"
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) 
                                
                                
                                : !template.images?.desktop && template.images?.mobile ? (
                                    <>
                                        {/* Celular Secundario (Fondo/Derecha) */}
                                        <div className="absolute -bottom-20 right-10 w-[40%] aspect-[9/19] bg-black rounded-t-[2rem] border-[4px] border-b-0 border-neutral-800 shadow-2xl opacity-60 blur-[2px] group-hover:-translate-y-4 group-hover:rotate-[4deg] transition-all duration-500 z-10 overflow-hidden">
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-3 bg-neutral-900 rounded-b-lg z-20"></div>
                                            <div className="relative w-full h-full bg-neutral-950">
                                                <Image
                                                    src={template.images.mobile}
                                                    alt={`${template.title} mobile preview`}
                                                    fill
                                                    className="object-contain object-top"
                                                    sizes="(max-width: 640px) 40vw, 18vw"
                                                />
                                            </div>
                                        </div>
                                        {/* Celular Principal (Frente/Centro) */}
                                        <div className="absolute -bottom-10 left-[20%] w-[45%] aspect-[9/19] bg-black rounded-t-[2rem] border-[6px] border-b-0 border-neutral-800 shadow-[0_0_40px_rgba(0,0,0,0.8)] group-hover:-translate-y-8 transition-all duration-500 delay-75 z-20 overflow-hidden">
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-4 bg-neutral-900 rounded-b-xl z-20"></div>
                                            <div className="relative w-full h-full bg-neutral-950">
                                                <Image
                                                    src={template.images.mobile}
                                                    alt={`${template.title} mobile preview`}
                                                    fill
                                                    className="object-contain object-top"
                                                    sizes="(max-width: 640px) 45vw, 22vw"
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) 
                                
                                
                                : template.images?.desktop && !template.images?.mobile ? (
                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] aspect-video bg-neutral-900 rounded-t-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] group-hover:-translate-y-6 transition-all duration-500 z-10 overflow-hidden">
                                        <div className="h-5 bg-neutral-950 border-b border-white/5 flex items-center px-4 gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
                                            <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
                                            <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
                                            <div className="ml-2 w-24 h-1.5 bg-white/5 rounded-full"></div>
                                        </div>
                                        <div className="relative w-full h-[calc(100%-1.25rem)] bg-neutral-950">
                                            <Image
                                                src={template.images.desktop}
                                                alt={`${template.title} desktop preview`}
                                                fill
                                                className="object-contain object-center"
                                                sizes="(max-width: 640px) 90vw, 50vw"
                                            />
                                        </div>
                                    </div>
                                ) : null}
                            </div>

                            {/* Información Teaser */}
                            <div className="p-8 flex flex-col flex-1 relative z-20">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
                                    {template.category}
                                </p>
                                <h3 className="text-2xl font-bold text-white mb-3 font-display">
                                    {template.title}
                                </h3>
                                <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                                    {template.shortDescription || template.description}
                                </p>
                                
                                {/* Footer de Tarjeta */}
                                <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                                    <div className="flex gap-2">
                                        {(template.tags ?? []).slice(0, 2).map((tag: string) => (
                                            <span key={tag} className="px-2.5 py-1 bg-black/40 border border-white/5 text-neutral-400 text-[9px] font-bold uppercase tracking-wider rounded-md">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:bg-primary group-hover:text-black transition-colors">
                                        <HiArrowRight size={16} className="group-hover:-rotate-45 transition-transform duration-300" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* BOTÓN MOBILE (Visible solo en pantallas pequeñas) */}
                <div className="mt-10 flex justify-center md:hidden">
                    <Link href="/portafolio" className="flex items-center justify-center gap-3 w-full bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all">
                        Ver Catálogo Completo <HiArrowRight className="text-primary" />
                    </Link>
                </div>

            </div>
        </section>
    );
};


// --- 5. SERVICES SECTION (REDISEÑO PREMIUM + IA + HOVER BUTTONS) ---
const ServicesSection = () => {
    return (
        <section className="py-32 px-6 bg-neutral-950 relative overflow-hidden border-y border-white/5">
            {/* Fondo ambiental sutil */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="mx-auto max-w-[1400px] relative z-10">
                {/* Cabecera de la Sección */}
                <div className="text-center mb-20">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">Nuestras Soluciones</span>
                    <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-6 tracking-tight">
                        Ingeniería a tu medida
                    </h2>
                    <p className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                        No usamos plantillas genéricas. Desarrollamos herramientas tecnológicas de alto rendimiento adaptadas a la etapa exacta de tu negocio.
                    </p>
                </div>

                {/* Grid de Servicios (4 Columnas en Desktop) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* SERVICIO 1: Web Profesional */}
                    <div className="group relative p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/[0.07] hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 flex flex-col overflow-hidden">
                        {/* Brillo interno hover */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="w-14 h-14 bg-neutral-900 border border-white/5 rounded-2xl flex items-center justify-center mb-8 text-primary shadow-lg group-hover:scale-110 transition-transform duration-500">
                            <HiOutlineComputerDesktop size={26} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 font-display">Páginas Web Premium</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-grow">
                            Sitios web estéticos, ultrarrápidos y optimizados para SEO. El escaparate digital perfecto para que tu marca destaque y convierta visitantes en clientes.
                        </p>

                        {/* Botón Flotante en Hover */}
                        <div className="mt-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                            <Link href="/servicios" className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3 rounded-xl font-bold text-sm transition-all duration-300 group/btn">
                                Ver Servicios <HiArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* SERVICIO 2: Apps & PWA */}
                    <div className="group relative p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/[0.07] hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 flex flex-col overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="w-14 h-14 bg-neutral-900 border border-white/5 rounded-2xl flex items-center justify-center mb-8 text-primary shadow-lg group-hover:scale-110 transition-transform duration-500">
                            <HiOutlineDevicePhoneMobile size={26} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 font-display">Apps Móviles & PWA</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-grow">
                            Llevamos tu negocio al bolsillo de tus clientes. Aplicaciones nativas para Android y Web Apps Progresivas instalables directamente desde el navegador sin pasar por tiendas, instalables y utilizables tanto para Iphone como para Android.
                        </p>

                        {/* Botón Flotante en Hover */}
                        <div className="mt-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                            <Link href="/servicios" className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3 rounded-xl font-bold text-sm transition-all duration-300 group/btn">
                                Ver Servicios <HiArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* SERVICIO 3: Sistemas de Gestión (Destacado) */}
                    <div className="group relative p-8 rounded-[2rem] bg-gradient-to-b from-primary/10 to-transparent border border-primary/30 hover:shadow-[0_10_40px_rgba(0,255,127,0.15)] transition-all duration-500 hover:-translate-y-2 flex flex-col overflow-hidden">
                        {/* Etiqueta Destacada */}
                        <div className="absolute top-4 right-4 bg-primary text-black text-[10px] font-black px-3 py-1.5 rounded-full tracking-wider shadow-lg">
                            MÁS SOLICITADO
                        </div>
                        
                        <div className="w-14 h-14 bg-primary/20 border border-primary/30 rounded-2xl flex items-center justify-center mb-8 text-primary group-hover:scale-110 transition-transform duration-500">
                            <HiOutlineCpuChip size={26} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 font-display">Sistemas de Gestión</h3>
                        <p className="text-neutral-300 text-sm leading-relaxed mb-6 flex-grow">
                            El cerebro de tu empresa. Desarrollamos software a medida para controlar inventarios, ventas, facturación y usuarios desde un panel administrativo centralizado.
                        </p>

                        {/* Botón Flotante en Hover (Versión Primaria Resaltada) */}
                        <div className="mt-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                            <Link href="/servicios" className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-black shadow-[0_0_20px_rgba(0,255,127,0.3)] py-3 rounded-xl font-bold text-sm transition-all duration-300 group/btn">
                                Ver Servicios <HiArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* SERVICIO 4: IA & Automatizaciones */}
                    <div className="group relative p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/[0.07] hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 flex flex-col overflow-hidden">
                        {/* Etiqueta Nuevo */}
                        <div className="absolute top-4 right-4 bg-primary/20 text-primary border border-primary/30 text-[10px] font-black px-3 py-1.5 rounded-full tracking-wider">
                            TENDENCIA
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="w-14 h-14 bg-neutral-900 border border-white/5 rounded-2xl flex items-center justify-center mb-8 text-primary shadow-lg group-hover:scale-110 transition-transform duration-500">
                            <FaRobot size={26} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 font-display">Automatización & IA</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-grow">
                            Ponemos tu negocio en piloto automático. Chatbots inteligentes para WhatsApp (24/7), integraciones con ChatGPT y automatización de tareas operativas y repetitivas.
                        </p>

                        {/* Botón Flotante en Hover */}
                        <div className="mt-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                            <Link href="/servicios" className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3 rounded-xl font-bold text-sm transition-all duration-300 group/btn">
                                Ver Servicios <HiArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

const LabShowcase = () => {
    // Mantenemos tus variables de estado intactas para no romper nada
    const [currentIndex, setCurrentIndex] = useState(0);
    const [view, setView] = useState<'desktop' | 'mobile'>('desktop');
    const [activeVariantIndex, setActiveVariantIndex] = useState(0);

    if (!demos || demos.length === 0) return null;

    const nextDemo = () => {
        setCurrentIndex((prev) => (prev + 1) % demos.length);
        setView('desktop');
        setActiveVariantIndex(0);
    };
    const prevDemo = () => {
        setCurrentIndex((prev) => (prev - 1 + demos.length) % demos.length);
        setView('desktop');
        setActiveVariantIndex(0);
    };

    const demo = demos[currentIndex];
    const variant = demo.variants[activeVariantIndex];

    return (
        <section className="py-24 lg:py-32 bg-neutral-950 relative border-t border-white/5 overflow-hidden">
            {/* Brillo ambiental */}
            <div className="absolute right-0 top-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* HEADER Y NAVEGACIÓN GLOBAL */}
                <div className="mb-12 flex flex-col md:flex-row items-end justify-between gap-6 border-b border-white/5 pb-8">
                    <div className="max-w-2xl">
                        <span className="flex items-center w-fit gap-2 text-primary font-bold tracking-widest uppercase text-xs mb-4 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                            <HiOutlineLightBulb className="w-4 h-4 animate-pulse" /> Laboratorio de Conceptos
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white tracking-tight">Visiones de Futuro</h2>
                        <p className="mt-4 text-neutral-400 text-lg">
                            Prototipos interactivos y arquitecturas de negocio diseñadas proactivamente. 
                        </p>
                    </div>
                    
                    {/* Controles del Carrusel y Enlace a Demos */}
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <Link href="/demos" className="hidden sm:flex items-center gap-2 text-white font-bold text-sm hover:text-primary transition-colors group">
                            Ver todos los conceptos <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        
                        <div className="flex items-center gap-6 bg-black/40 p-2 rounded-full border border-white/10 backdrop-blur-md">
                            <span className="text-sm font-mono text-neutral-500 font-bold pl-4">
                                <span className="text-white">{String(currentIndex + 1).padStart(2, '0')}</span> / {String(demos.length).padStart(2, '0')}
                            </span>
                            <div className="flex gap-1">
                                <button onClick={prevDemo} className="p-3 rounded-full hover:bg-white/10 transition-all text-white"><HiChevronLeft size={20} /></button>
                                <button onClick={nextDemo} className="p-3 rounded-full hover:bg-white/10 transition-all text-white"><HiChevronRight size={20} /></button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTENEDOR PRINCIPAL DEL DEMO (Vitrina Ligera) */}
                <div className="bg-neutral-900/30 border border-white/5 rounded-[2.5rem] p-4 sm:p-8 lg:p-10 backdrop-blur-xl">
                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                        
                        {/* --- COLUMNA IZQUIERDA: INFORMACIÓN ESENCIAL --- */}
                        <div className="w-full lg:w-[45%] flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.4 }}
                                    className="flex flex-col"
                                >
                                    <div className="mb-6">
                                        <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-4">
                                            {demo.businessType}
                                        </div>
                                        <h3 className="text-4xl lg:text-5xl font-bold text-white mb-4 font-display leading-tight">{demo.businessName}</h3>
                                        <p className="text-base leading-relaxed text-neutral-300 line-clamp-3">
                                            {demo.businessDescription}
                                        </p>
                                    </div>

                                    {/* Concepto Vertrex (Resumido para el Home) */}
                                    <div className="bg-white/[0.02] border border-white/5 border-l-2 border-l-primary p-5 rounded-2xl mb-8">
                                        <strong className="text-primary flex items-center gap-2 mb-2 uppercase tracking-widest text-xs font-bold">
                                            <HiOutlineSparkles className="w-4 h-4" /> La Visión
                                        </strong>
                                        <p className="text-sm leading-relaxed text-neutral-400 line-clamp-3">
                                            {demo.vertrexConcept}
                                        </p>
                                    </div>

                                    {/* Call to Action hacia la vista detallada */}
                                    <div className="pt-2">
                                        <Link href="/demos" className="inline-flex items-center gap-3 bg-white text-black px-8 py-3.5 rounded-full font-bold text-sm hover:bg-primary hover:scale-105 transition-all shadow-lg group">
                                            Explorar Demos <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                    
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* --- COLUMNA DERECHA: REPRODUCTOR MULTIMEDIA --- */}
                        <div className="w-full lg:w-[55%] relative h-[400px] sm:h-[450px] lg:h-[500px] flex items-center justify-center rounded-[2rem] bg-black/40 border border-white/5 p-4 sm:p-8">
                            
                            {/* Selector de Vista (PC / Móvil) */}
                            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 bg-black/80 backdrop-blur-md p-1.5 rounded-full border border-white/10 flex gap-2 shadow-xl">
                                <button onClick={() => setView('desktop')} className={`p-2.5 rounded-full transition-all duration-300 ${view === 'desktop' ? 'bg-primary text-black scale-105' : 'text-white/50 hover:text-white'}`}><HiOutlineComputerDesktop className="w-5 h-5" /></button>
                                <button onClick={() => setView('mobile')} className={`p-2.5 rounded-full transition-all duration-300 ${view === 'mobile' ? 'bg-primary text-black scale-105' : 'text-white/50 hover:text-white'}`}><HiOutlineDevicePhoneMobile className="w-5 h-5" /></button>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div key={`${currentIndex}-${activeVariantIndex}-${view}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }} className="relative w-full h-full flex items-center justify-center">
                                    
                                    {view === 'desktop' ? (
                                        <div className="w-full max-w-2xl aspect-video bg-neutral-900 rounded-xl md:rounded-2xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden relative group">
                                            <div className="absolute top-0 left-0 right-0 h-6 md:h-8 bg-neutral-950 border-b border-white/5 flex items-center px-4 gap-2 z-20">
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
                                                <div className="ml-4 w-1/3 h-3 bg-white/5 rounded-full hidden sm:block"></div>
                                            </div>
                                            <div className="pt-6 md:pt-8 h-full">
                                                {/* Usamos video Desktop de la primera variante */}
                                                <video key={variant.videoDesktop} src={variant.videoDesktop} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative z-10 h-[90%] sm:h-full aspect-[9/19] bg-black rounded-[2.5rem] sm:rounded-[3rem] border-[6px] sm:border-[8px] border-neutral-800 shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden">
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 sm:h-6 bg-neutral-900 rounded-b-xl z-20"></div>
                                            {/* Usamos video Mobile de la primera variante */}
                                            <video key={variant.videoMobile} src={variant.videoMobile} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                                        </div>
                                    )}

                                </motion.div>
                            </AnimatePresence>
                        </div>

                    </div>
                </div>

                {/* BOTÓN MOBILE (Para ir a la página de Demos si el usuario está en celular) */}
                <div className="mt-8 flex justify-center sm:hidden">
                    <Link href="/demos" className="flex items-center justify-center gap-3 w-full bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all">
                        Ver todos los conceptos <HiArrowRight className="text-primary" />
                    </Link>
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
                        href="/contacto" 
                        className="bg-transparent text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-colors border border-white/20"
                    >
                        Solicitar Presupuesto
                    </Link>
                </div>
            </div>
        </section>
    )
}

const ImpactMetrics = () => {
    return (
        <section className="py-20 bg-neutral-950 relative border-t border-white/5 overflow-hidden">
            {/* Fondo de cuadrícula tecnológica */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] pointer-events-none"></div>
            
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 relative z-10">
                
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-16">
                    {/* Textos de la sección */}
                    <div className="max-w-2xl text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                            </span>
                            <span className="text-primary font-bold tracking-widest uppercase text-xs">
                                Vertrex Activo
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight mb-4">
                            El peso de nuestra <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">ingeniería</span>
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed">
                            No medimos nuestro éxito solo en líneas de código, sino en negocios transformados, ideas validadas y el impacto real de nuestra tecnología en la comunidad.
                        </p>
                    </div>
                </div>

                {/* Grid de Métricas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* Métrica 1: Proyectos */}
                    <div className="relative group bg-neutral-900/30 backdrop-blur-sm border border-white/5 p-8 rounded-[2rem] hover:bg-neutral-800/50 hover:border-white/10 transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <HiOutlineCodeBracket className="w-8 h-8 text-neutral-500 mb-6 group-hover:text-primary transition-colors duration-300" />
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-5xl font-black text-white font-display tracking-tighter">11</span>
                                <span className="text-2xl font-bold text-primary">+</span>
                            </div>
                            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Proyectos Activos</h4>
                            <p className="text-neutral-500 text-xs leading-relaxed">
                                Plataformas web, PWA y paneles administrativos operando en tiempo real.
                            </p>
                        </div>
                    </div>

                    {/* Métrica 2: Clientes */}
                    <div className="relative group bg-neutral-900/30 backdrop-blur-sm border border-white/5 p-8 rounded-[2rem] hover:bg-neutral-800/50 hover:border-white/10 transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <HiOutlineUserGroup className="w-8 h-8 text-neutral-500 mb-6 group-hover:text-primary transition-colors duration-300" />
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-5xl font-black text-white font-display tracking-tighter">2</span>
                                <span className="text-2xl font-bold text-primary">+</span>
                            </div>
                            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Marcas Transformadas</h4>
                            <p className="text-neutral-500 text-xs leading-relaxed">
                                Empresas locales y emprendedores que han escalado con nuestra tecnología.
                            </p>
                        </div>
                    </div>

                    {/* Métrica 3: Comunidad (Reemplaza "Horas Automatizadas") */}
                    <div className="relative group bg-neutral-900/30 backdrop-blur-sm border border-white/5 p-8 rounded-[2rem] hover:bg-neutral-800/50 hover:border-white/10 transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <HiOutlineHeart className="w-8 h-8 text-neutral-500 mb-6 group-hover:text-primary transition-colors duration-300" />
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-5xl font-black text-white font-display tracking-tighter">450</span>
                                <span className="text-2xl font-bold text-primary">+</span>
                            </div>
                            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Impacto Comunitario</h4>
                            <p className="text-neutral-500 text-xs leading-relaxed">
                                Personas beneficiadas por nuestras apps sociales gratuitas como Opita Go.
                            </p>
                        </div>
                    </div>

                    {/* Métrica 4: Mockups (Reemplaza "Uptime Operativo") */}
                    <div className="relative group bg-neutral-900/30 backdrop-blur-sm border border-white/5 p-8 rounded-[2rem] hover:bg-neutral-800/50 hover:border-white/10 transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <HiOutlinePencilSquare className="w-8 h-8 text-neutral-500 mb-6 group-hover:text-primary transition-colors duration-300" />
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-5xl font-black text-white font-display tracking-tighter">5</span>
                                <span className="text-2xl font-bold text-primary">+</span>
                            </div>
                            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Prototipos Interactivos</h4>
                            <p className="text-neutral-500 text-xs leading-relaxed">
                                Mockups y arquitecturas diseñadas a medida para validar ideas antes de programar.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

// --- MAIN PAGE COMPONENT ---
export default function HomePage() {
  return (
    <main className="flex flex-col w-full selection:bg-primary selection:text-background">
      <HeroSection />
      <ServicesSection />
        <ImpactMetrics />
      <ProjectsShowcase /> {/* 1. Clientes Reales & Especiales */}
      <CommunityShowcase /> {/* 2. Impacto Social */}
      <TemplatesShowcase /> {/* 3. Plantillas */}
            <LabShowcase /> {/* 4. Conceptos */}
      <CtaSection />
    </main>
  )
}