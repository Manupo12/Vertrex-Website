// Catálogo central de proyectos: tipado e información completa usada en listados y detalle dinámico.
import React from 'react';

import {
  HiOutlineShoppingCart,
  HiOutlineGlobeAlt,
  HiOutlineCpuChip,
  HiOutlineDevicePhoneMobile,
  HiMap,
  HiOutlineIdentification,
  HiOutlineCalendar,
  HiOutlineCloudArrowDown,
  HiOutlineUserGroup,
  HiOutlineQrCode,
  HiOutlineChartBar,
  HiOutlineMegaphone,
  HiOutlineHeart,
  HiOutlineSparkles,
  HiOutlinePlay,
  HiOutlineComputerDesktop
} from 'react-icons/hi2';
import {
  FaNutritionix,
  FaBed,
  FaWhatsapp,
  FaGlobe,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { FiRefreshCw, FiPrinter } from 'react-icons/fi';
import { AiOutlineUserAdd, AiOutlineCloudUpload } from 'react-icons/ai';
import { BiShield } from 'react-icons/bi';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { TbBell } from 'react-icons/tb';
import { RiFileSearchLine } from 'react-icons/ri';

export interface Project {
  slug: string;
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  shortDescription?: string;
  client?: string;
  year: string;
  link: string;
  repoLink?: string;
  buttonText?: string;
  images: {
    desktop: string;
    mobile: string;
  };
  appLogo?: string;
  coverImage?: string;
  galleryImages?: { imageUrl: string; caption?: string }[];
  color: string;
  accent: string;
  border: string;
  stack: string[];
  tags: string[];
  features: {
    icon: React.ReactNode;
    text: string;
    detail?: string;
  }[];
}

export const projects: Project[] = [
  {
    slug: 'ser-deseable',
    id: 'ser-deseable',
    title: 'Ser Deseable',
    subtitle: 'Salud, Nutrición & Longevidad',
    category: 'Plataforma Web & E-commerce',
    client: 'Marca Personal Fitness',
    year: '2024',
    description: 'Transformamos un método de entrenamiento en un ecosistema digital completo. Una plataforma moderna diseñada para guiar a los usuarios hacia una vida más saludable con herramientas interactivas y comercio integrado.',
    link: 'https://www.serdeseable.site/',
    buttonText: 'Visitar Plataforma',
    images: { desktop: '/images/pagados/serdeseable/1.webp', mobile: '/images/pagados/serdeseable/serdeseablemv.webp' },
    color: 'from-rose-600/20 to-orange-500/20',
    accent: 'text-rose-400',
    border: 'border-rose-500/30',
    stack: ['Next.js', 'Tailwind CSS', 'PostgreSQL', 'Stripe', 'Framer Motion'],
    tags: ['En Producción', 'Web App', 'Bilingüe'],
    features: [
      { icon: <FaNutritionix />, text: 'Calculadora Nutricional', detail: 'Herramienta interactiva personalizada' },
      { icon: <HiOutlineShoppingCart />, text: 'Tienda Integrada', detail: 'Carrito dinámico y gestión de pedidos' },
      { icon: <HiOutlineGlobeAlt />, text: 'Multi-Idioma', detail: 'Experiencia fluida en Español e Inglés' },
      { icon: <HiOutlineCpuChip />, text: 'Panel Administrativo', detail: 'Gestión total de usuarios e inventario' }
    ]
  },
  {
    slug: 'principerfum',
    id: 'principerfum',
    title: 'Principerfum',
    subtitle: 'E-commerce & Panel de Control',
    category: 'Plataforma Web Full-Stack',
    client: 'Principerfum',
    year: '2024',
    description: 'Tienda online premium de fragancias con catálogo dinámico y filtros avanzados. Cuenta con un dashboard administrativo privado para gestionar inventario, monitorear métricas de ventas y moderar reseñas de clientes en tiempo real.',
    link: '#',
    buttonText: 'Visitar Tienda',
    images: { desktop: '/images/pagados/principerfum/escritorio.webp', mobile: '/images/pagados/principerfum/celular.webp' },
    color: 'from-zinc-500/20 to-neutral-500/20',
    accent: 'text-zinc-400',
    border: 'border-zinc-500/30',
    stack: ['Next.js', 'Tailwind CSS', 'PostgreSQL', 'Prisma'],
    tags: ['E-commerce', 'Panel Admin', 'Base de Datos'],
    features: [
      { icon: <HiOutlineShoppingCart />, text: 'Catálogo Dinámico', detail: 'Filtros por marca, género y búsqueda inteligente.' },
      { icon: <FaWhatsapp />, text: 'WhatsApp Checkout', detail: 'Pedidos y consultas directas sin pasarelas complejas.' },
      { icon: <HiOutlineCpuChip />, text: 'Dashboard Admin', detail: 'Creación/edición de productos y métricas del negocio.' },
      { icon: <HiOutlineHeart />, text: 'Sistema de Reseñas', detail: 'Valoraciones de usuarios con moderación administrativa.' }
    ]
  },
  {
    slug: 'sorpresa-maria',
    id: 'sorpresa-maria',
    title: 'Sorpresa Interactiva',
    subtitle: 'Experiencia Web Mobile-First',
    category: 'Detalle Especial / Interactivo',
    client: 'Proyecto Especial',
    year: '2024',
    description: 'Un proyecto especial creado como regalo de cumpleaños. Una experiencia web móvil donde un sobre 3D reacciona al tacto, se abre con efectos de sonido, lanza confeti y revela una tarjeta holográfica con un código de regalo oculto.',
    link: '#',
    buttonText: 'Ver Experiencia',
    images: { desktop: '/images/pagados/cumpleanos/celular.webp', mobile: '/images/pagados/cumpleanos/celular.webp' },
    color: 'from-fuchsia-500/20 to-pink-500/20',
    accent: 'text-fuchsia-400',
    border: 'border-fuchsia-500/30',
    stack: ['React', 'CSS 3D', 'Framer Motion', 'Web Audio API'],
    tags: ['Mobile First', 'Animaciones CSS', 'Multimedia'],
    features: [
      { icon: <HiOutlineSparkles />, text: 'Interacción 3D', detail: 'El sobre reacciona al movimiento del dedo.' },
      { icon: <HiOutlineMegaphone />, text: 'Audio & Confeti', detail: 'Efectos multimedia al abrir el regalo.' },
      { icon: <HiOutlineIdentification />, text: 'Tarjeta Holográfica', detail: 'Efecto visual brillante avanzado.' },
      { icon: <HiOutlineQrCode />, text: 'Código Dinámico', detail: 'Animación de descifrado y tap-to-copy.' }
    ]
  },
  {
    slug: 'felicitacion-sandra',
    id: 'felicitacion-sandra',
    title: 'Felicitación Interactiva',
    subtitle: 'Experiencia Web Mobile-First',
    category: 'Detalle Especial / Interactivo',
    client: 'Proyecto Especial',
    year: '2024',
    description: 'Página de felicitación personalizada. Inicia con una pantalla de bienvenida que, al interactuar, revela un mensaje emotivo, una galería de fotos estilo "bento" y música de fondo sincronizada con controles anti-superposición.',
    link: '#',
    buttonText: 'Ver Experiencia',
    images: { desktop: '/images/pagados/regalo madre/celular.webp', mobile: '/images/pagados/regalo madre/celular.webp' },
    color: 'from-teal-500/20 to-emerald-500/20',
    accent: 'text-teal-400',
    border: 'border-teal-500/30',
    stack: ['React', 'Framer Motion', 'CSS Grid Bento', 'Multimedia API'],
    tags: ['Mobile First', 'Audio Web', 'Multimedia'],
    features: [
      { icon: <HiOutlineSparkles />, text: 'Abrazo Virtual', detail: 'Botón interactivo que lanza confeti de celebración.' },
      { icon: <HiOutlinePlay />, text: 'Control de Audio', detail: 'Música de fondo optimizada para no superponerse.' },
      { icon: <HiOutlineComputerDesktop />, text: 'Galería Bento', detail: 'Mosaico fotográfico dinámico y adaptativo.' },
      { icon: <HiOutlineHeart />, text: 'Transición Fluida', detail: 'Efectos visuales desde la pantalla de bienvenida.' }
    ]
  },

  {
    slug: 'zap-mesh',
    id: 'zap-mesh',
    title: 'Zap',
    subtitle: 'Red de Comunicación Offline (Android)',
    category: 'Ingeniería Social',
    client: 'Iniciativa Comunitaria',
    year: '2025',
    description: 'Aplicación nativa para Android (Jetpack Compose). Crea redes locales P2P (malla) mediante Bluetooth y Wi-Fi Nearby. Permite chat grupal, envío de archivos, un radar GPS suavizado (Filtro Kalman) para ubicar amigos y un modo "Pánico" que alerta a todos los conectados. Todo sin usar internet.',
    link: '#',
    buttonText: 'Ver Proyecto',
    images: { desktop: '/images/social/zap/celular.jpeg', mobile: '/images/social/zap/celular.jpeg' },
    color: 'from-amber-500/20 to-yellow-600/20',
    accent: 'text-amber-400',
    border: 'border-amber-500/30',
    stack: ['Android Native', 'Kotlin', 'Bluetooth Low Energy', 'Wi-Fi Direct'],
    tags: ['Gratuito', 'Conexión Offline', 'Cifrado'],
    features: [
      { icon: <HiOutlineCloudArrowDown />, text: '100% Offline', detail: 'Conexión P2P por Bluetooth y Wi-Fi Direct.' },
      { icon: <HiMap />, text: 'Radar Inteligente', detail: 'GPS con Filtro Kalman para evitar saltos.' },
      { icon: <HiOutlineMegaphone />, text: 'Modo Pánico', detail: 'Alerta crítica con bloqueo de pantalla.' },
      { icon: <HiOutlineIdentification />, text: 'Cifrado Local', detail: 'Mensajes protegidos con llaves AES-256.' }
    ]
  },
  {
    slug: 'opita-go',
    id: 'opita-go',
    title: 'Opita Go',
    subtitle: 'Movilidad Inteligente para Neiva',
    category: 'Ingeniería Social',
    client: 'Iniciativa Vertrex (Acceso gratis)',
    year: '2024 - Presente',
    description: 'Una iniciativa de Vertrex para la ciudad. Opita Go resuelve la falta de información del sistema SETP mediante algoritmos propios de enrutamiento. Es una herramienta gratuita que ahorra tiempo y dinero a miles de neivanos.',
    link: 'https://opita-go-web.vercel.app/',
    buttonText: 'Usar Opita Go',
    images: { desktop: '/images/social/opitago/movil.jpeg', mobile: '/images/social/opitago/movil.jpeg' },
    color: 'from-cyan-500/20 to-blue-600/20',
    accent: 'text-cyan-400',
    border: 'border-cyan-500/30',
    stack: ['React', 'Leaflet Maps', 'PWA Workbox', 'GeoJSON', 'Algoritmos de Grafos'],
    tags: ['Conexion Offline', 'Gratuito', 'Planificador de viajes'],
    features: [
      { icon: <HiMap />, text: 'Algoritmos GPS Offline', detail: 'Funciona sin datos móviles.' },
      { icon: <HiOutlineGlobeAlt />, text: 'PWA Multiplataforma', detail: 'Instalable en Android e iOS desde el navegador.' },
      { icon: <HiOutlineDevicePhoneMobile />, text: 'UX Accesible', detail: 'Diseño para todas las edades.' },
      { icon: <HiOutlineQrCode />, text: 'Sin Anuncios', detail: 'Enfoque 100% en la utilidad.' }
    ]
  },
  {
    slug: 'campus-usco',
    id: 'campus-usco',
    title: 'Marketplace USCO',
    subtitle: 'Marketplace Universitario & Directorio',
    category: 'Ingeniería Social',
    client: 'Comunidad Estudiantil USCO',
    year: '2025',
    description: 'Una app móvil (PWA) que conecta estudiantes y vendedores. Funciona como un mercado virtual con feed de productos, perfiles de tiendas y un directorio de profesores. Todo optimizado para pantallas móviles con interacciones rápidas e inicio de sesión seguro.',
    link: '#',
    buttonText: 'Abrir App',
    images: { desktop: '/images/social/proyectousco/celular.jpeg', mobile: '/images/social/proyectousco/celular.jpeg' },
    color: 'from-emerald-500/20 to-green-600/20',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/30',
    stack: ['Next.js', 'Firebase Auth', 'Firestore', 'Vercel Edge Functions'],
    tags: ['Marketplace', 'Login Google', 'Comunidad USCO'],
    features: [
      { icon: <HiOutlineShoppingCart />, text: 'Marketplace en Vivo', detail: "Filtro 'Comprar YA' para ocultar tiendas cerradas." },
      { icon: <HiOutlineHeart />, text: 'Favoritos Guardados', detail: 'Marca productos con un toque y míralos en tu carrusel.' },
      { icon: <HiOutlineIdentification />, text: 'Perfiles de Tienda', detail: 'Páginas públicas con horarios, pagos y redes.' },
      { icon: <FaGlobe />, text: 'Login Institucional', detail: 'Acceso con Google y asignación de rol a correos USCO.' },
      { icon: <HiOutlineDevicePhoneMobile />, text: 'Panel de Vendedores', detail: 'Gestión de inventario y subida de fotos desde el celular.' },
      { icon: <HiOutlineUserGroup />, text: 'Directorio Académico', detail: 'Lista de espera y perfiles de información de docentes.' }
    ]
  },

  {
    slug: 'hotel-pro',
    id: 'hotel-pro',
    title: 'HotelPro',
    subtitle: 'Sistema de Reservas Hotelero',
    category: 'Plantilla para Hoteles',
    client: 'Disponible para Licenciamiento',
    year: '2025',
    description: 'HotelPro permite a huéspedes y staff gestionar reservas de forma segura y rápida: búsqueda por fecha, vista de disponibilidad, bloqueo/limpieza de habitaciones, gestión de tarifas, calendario operativo y panel administrativo con roles y métricas.',
    shortDescription: 'Motor de reservas en tiempo real con panel administrativo y herramientas operativas.',
    link: '#',
    buttonText: 'Ver Demo',
    images: { desktop: '/images/plantillas/hotelpro/pc.png', mobile: '/images/plantillas/hotelpro/movil.jpeg' },
    color: 'from-indigo-600/10 to-purple-600/10',
    accent: 'text-indigo-400',
    border: 'border-indigo-500/30',
    stack: ['Next.js', 'Supabase', 'Stripe Connect', 'Tailwind UI'],
    tags: ['Motor Reservas', 'Panel Admin', 'Calendario', 'Gestión Habitaciones'],
    features: [
      { icon: <HiOutlineCalendar />, text: 'Búsqueda y Disponibilidad', detail: 'Busca por fechas y muestra disponibilidad en tiempo real con reglas de ocupación y bloqueos.' },
      { icon: <FaBed />, text: 'Gestión de Habitaciones', detail: 'Crear/editar habitaciones, asignar tipos, controlar estado (Disponible/Reservada/Limpieza) y precios por habitación.' },
      { icon: <AiOutlineUserAdd />, text: 'Control de Usuarios y Roles', detail: 'Usuarios con roles (ADMIN/SUPERADMIN/HUESPED), permisos granulares para panel y endpoints.' },
      { icon: <MdOutlineAdminPanelSettings />, text: 'Panel Administrativo', detail: 'Dashboard con métricas clave, últimas reservas, calendario operativo y acciones rápidas (check-in/out, cancelar, marcar limpieza).' },
      { icon: <RiFileSearchLine />, text: 'Reservas y Gestión', detail: 'Crear reservas manuales, gestión de pagos (placeholder) y estados, modificar fechas y aplicar descuentos.' },
      { icon: <TbBell />, text: 'Notificaciones y Emails', detail: 'Plantillas de correo para confirmación, recordatorios y cancelaciones; logs de envíos y reintentos.' },
      { icon: <BiShield />, text: 'Seguridad y Robustez', detail: 'Autenticación segura por token, protección de rutas admin y manejo fiable de CORS/preflight en serverless.' },
      { icon: <FiRefreshCw />, text: 'Operaciones y Cron', detail: 'Cron controlado (deshabilitado por defecto en serverless) para tareas periódicas: liberación automática de habitaciones, recordatorios y reportes.' },
      { icon: <RiFileSearchLine />, text: 'Filtrado y Búsqueda', detail: 'Filtra por tipo de habitación, precio, capacidad y estados; paginación y cache para respuestas rápidas.' },
      { icon: <AiOutlineCloudUpload />, text: 'Gestión de Medios', detail: 'Subida y servicio de imágenes para habitaciones con ruta estática /uploads y control de tamaños.' }
    ]
  },
  {
    slug: 'motel-pro',
    id: 'motel-pro',
    title: 'MotelPro',
    subtitle: 'Gestión Operativa para Moteles',
    category: 'Sistema SaaS',
    client: 'Disponible para Licenciamiento',
    year: '2025',
    description: 'MotelPro centraliza y agiliza todas las operaciones diarias de un motel: desde el check‑in rápido y la gestión de habitaciones hasta comandas al bar, control de minibar, cierres de turno y facturación electrónica. Está pensado para entornos con alta rotación y conexiones inestables: la interfaz es táctil y operativa para recepción, patios y aseo, y el sistema sincroniza cambios cuando recupera conexión.',
    shortDescription: 'Plataforma operativa para moteles de alta rotación: control de habitaciones, minibar, pedidos, turnos y facturación electrónica, con modo offline.',
    link: '#',
    buttonText: 'Ver Demo',
    images: { desktop: '/images/plantillas/motelpro/pc.png', mobile: '/images/plantillas/motelpro/movil.jpeg' },
    color: 'from-red-600/10 to-pink-600/10',
    accent: 'text-red-400',
    border: 'border-red-500/30',
    stack: ['Electron', 'React', 'SQLite (Local First)', 'Socket.io'],
    tags: ['Control Turnos', 'Facturación DIAN', 'Modo Offline', 'Minibar', 'PWA'],
    features: [
      { icon: <AiOutlineUserAdd />, text: 'Check‑in y Gestión de Sesiones', detail: 'Registro rápido de entradas, control del tiempo de estadía, prepagos y flujos de salida que reducen filas y errores en recepción.' },
      { icon: <RiFileSearchLine />, text: 'Facturación Electrónica', detail: 'Generación de factura/ticket con cálculo de impuestos y preparación para integración con proveedores de facturación electrónica.' },
      { icon: <HiOutlineShoppingCart />, text: 'Minibar & Comandas', detail: 'Registro de consumos de nevera y pedidos al bar integrados a la sesión del cliente para facturar automáticamente y controlar inventario.' },
      { icon: <HiOutlineCloudArrowDown />, text: 'Modo Offline y Sincronización', detail: 'Opera sin internet guardando acciones localmente y sincronizando cuando hay conexión, evitando interrupciones de servicio.' },
      { icon: <FiRefreshCw />, text: 'Turnos y Cierres de Caja', detail: 'Apertura/cierre de turnos con arqueos, reportes de ventas por método de pago y generación de resúmenes imprimibles para auditoría.' },
      { icon: <TbBell />, text: 'Notificaciones Operativas', detail: 'Mensajería interna por rol (patios, aseo, recepción) para solicitudes de salida, pedidos listos y tareas de limpieza, reduciendo tiempos de coordinación.' },
      { icon: <FaBed />, text: 'Gestión de Habitaciones', detail: 'Control de estados (Disponible/Ocupada/Limpieza/Mantenimiento), asignación por categorías y reglas de precios por tipo de habitación.' },
      { icon: <HiOutlineChartBar />, text: 'Informes y Analíticas', detail: 'Reportes diarios, estadísticas por turno y hora pico, exportación de registros para conciliación y toma de decisiones.' },
      { icon: <FaExternalLinkAlt />, text: 'Inventario y Alertas', detail: 'Gestión de productos, control de stock y alertas de mínimos para minimizar pérdidas en minibar y bar.' },
      { icon: <FiPrinter />, text: 'Impresión y Tickets', detail: 'Generación de tickets y facturas en formato para impresoras fiscales/matriciales y tickets de cliente.' },
      { icon: <BiShield />, text: 'Control de Usuarios y Seguridad', detail: 'Roles predefinidos (ADMIN/RECEPCION/PATIO/ASEO) con permisos, cambios de contraseña y protección de sesiones.' },
      { icon: <AiOutlineCloudUpload />, text: 'Personalización e Integraciones', detail: 'Capacidad para adaptar tarifas, reglas promocionales (por ejemplo, descuentos por día) e integrar datáfonos o sistemas de facturación externos.' }
    ]
  },
  {
    slug: 'fiest-pro',
    id: 'fiest-pro',
    title: 'FiestPro',
    subtitle: 'Ticketing y Gestión de Eventos',
    category: 'Plataforma para Eventos',
    client: 'Disponible para Licenciamiento',
    year: '2025',
    description: 'FiestPro centraliza todo el ciclo de un evento: venta de entradas con códigos QR, control de acceso en puertas, tienda de merchandising y un panel para organizar eventos, ver ventas y gestionar equipos. Diseñada para promotores, festivales y salas, permite crear eventos, definir tipos de entradas, asignar comisiones a promotores, y operar control de puertas de forma rápida y fiable. Incluye herramientas para reportes en tiempo real, exportes y flujos pensados para facilitar la operación el día del evento.',
    shortDescription: 'Solución integral para vender entradas, gestionar el acceso y vender merchandising, con herramientas para promotores y equipo operativo.',
    link: '#',
    buttonText: 'Ver Demo',
    images: { desktop: '/images/plantillas/fiestapro/pc.png', mobile: '/images/plantillas/fiestapro/movil.png' },
    color: 'from-yellow-500/10 to-orange-500/10',
    accent: 'text-yellow-400',
    border: 'border-yellow-500/30',
    stack: ['Next.js', 'QR Code Lib', 'Redis', 'AWS Lambda'],
    tags: ['Venta Entradas', 'Control de Acceso', 'Promotores', 'Tienda Merch'],
    features: [
      { icon: <HiOutlineQrCode />, text: 'Scanner QR y Control de Acceso', detail: 'Lectura rápida de entradas con validación, estados claros (válido/duplicado/cancelado) y modo offline para puertas sin conexión.' },
      { icon: <HiOutlineCalendar />, text: 'Gestión de Entradas y Tipos', detail: 'Crear y editar tipos de entrada (anticipada, VIP, promo), límites de aforo, precios y reglas de acceso por prioridad.' },
      { icon: <HiOutlineUserGroup />, text: 'Panel para Promotores', detail: 'Asignación de promotores con códigos o links, seguimiento de ventas por RRPP y cálculo automático de comisiones y pagos.' },
      { icon: <HiOutlineShoppingCart />, text: 'Tienda de Merchandising', detail: 'Catálogo de productos con gestión de stock, variantes de tallas, y proceso de compra integrado con la venta de entradas.' },
      { icon: <HiOutlineDevicePhoneMobile />, text: 'Checkout y Flujo de Compra Sencillo', detail: 'Experiencia de compra optimizada para móvil y desktop, resumen de pedidos claro y pasos guiados hasta la confirmación.' },
      { icon: <HiOutlineChartBar />, text: 'Panel Administrativo y Reportes', detail: 'Dashboard con ventas en tiempo real, lista de asistentes, resumen por evento, exportes CSV y métricas clave para la toma de decisiones.' },
      { icon: <HiOutlineIdentification />, text: 'Gestión de Asistentes', detail: 'Lista de entradas vendidas, búsqueda y filtros por nombre o código, marcación de asistencia y reimpresión de tickets.' },
      { icon: <HiOutlineMegaphone />, text: 'Workflows Operativos', detail: 'Herramientas para el día del evento: creación de turnos, control de accesos, y acciones rápidas para resolver incidencias.' },
      { icon: <TbBell />, text: 'Notificaciones y Mensajería', detail: 'Envío de confirmaciones y recordatorios a compradores; plantillas para comunicaciones y registro de envíos.' },
      { icon: <FaExternalLinkAlt />, text: 'Exportes y Recuperación de Datos', detail: 'Exportes de ventas y listas de asistentes para contabilidad o control; historial de transacciones y acciones.' },
      { icon: <BiShield />, text: 'Seguridad y Privacidad', detail: 'Gestión responsable de datos de asistentes con controles de acceso al panel administrativo y prácticas mínimas de protección de información.' },
      { icon: <FaGlobe />, text: 'Modo Feria / Eventos Multiescena', detail: 'Soporta varios puntos de venta y puertas simultáneas, con control centralizado y sincronización de aforos.' },
      { icon: <HiOutlineUserGroup />, text: 'Soporte Operativo y Herramientas de Puerta', detail: 'Interfaz clara para personal de puerta con indicadores visuales y acciones simples para atender incidencias rápidamente.' },
      { icon: <HiOutlineCpuChip />, text: 'Escalabilidad Operativa', detail: 'Pensada para pequeños shows y eventos medianos; facilita la configuración rápida y la operación por equipos sin experiencia técnica.' }
    ]
  }
];
