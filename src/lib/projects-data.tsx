import React from 'react';

// Importación de Iconos para las características
import { 
  HiOutlineShoppingCart,
  HiOutlineGlobeAlt,
  HiOutlineCpuChip,
  HiMap,
  HiOutlineDevicePhoneMobile,
  HiOutlineIdentification,
  HiOutlineCalendar,
  HiOutlineKey,
  HiOutlineCloudArrowDown,
  HiOutlineTicket,
  HiOutlineUserGroup,
  HiOutlineQrCode,
  HiOutlineChartBar,
  HiOutlineMegaphone,
  HiOutlineBell
} from 'react-icons/hi2';
import { 
  FaNutritionix, 
  FaAndroid, 
  FaBed
} from 'react-icons/fa';

// Definición de la interfaz del Proyecto para TypeScript
export interface Project {
  slug: string; // ID único para la URL (ej: /portafolio/ser-deseable)
  id: string;   // ID interno (puede ser igual al slug)
  title: string;
  subtitle: string;
  category: string; // Ej: "Caso de Éxito", "Ingeniería Social", "Plantilla SaaS"
  description: string; // Descripción larga para el detalle
  shortDescription?: string; // Descripción corta para tarjetas (opcional)
  client?: string; // Nombre del cliente o "Propiedad Intelectual Vertrex"
  year: string;
  
  // Links
  link: string; // URL del proyecto en vivo
  repoLink?: string; // URL del código (opcional)
  buttonText?: string;
  
  // Recursos Visuales
  images: {
    desktop: string;
    mobile: string;
  };
  // Optional legacy/alternate visual fields
  appLogo?: string;
  coverImage?: string;
  galleryImages?: { imageUrl: string; caption?: string }[];
  
  // Estilos (Tema de color del proyecto)
  color: string; // Gradiente de fondo (ej: "from-rose-500 to-orange-500")
  accent: string; // Color de texto acentuado (ej: "text-rose-400")
  border: string; // Color de borde (ej: "border-rose-500/30")
  
  // Datos Técnicos
  stack: string[]; // Tecnologías usadas
  tags: string[];  // Etiquetas para filtros (ej: "PWA", "E-commerce")
  
  // Características destacadas (Array con Icono y Texto)
  features: {
    icon: React.ReactNode;
    text: string;
    detail?: string; // Explicación extra si se necesita
  }[];
}

export const projects: Project[] = [
  // --- 1. CASOS DE ÉXITO (PRODUCCIÓN) ---
  {
    slug: 'ser-deseable',
    id: 'ser-deseable',
    title: 'Ser Deseable',
    subtitle: 'Salud, Nutrición & Longevidad',
    category: 'Caso de Éxito',
    client: 'Marca Personal Fitness',
    year: '2024',
    description: 'Transformamos un método de entrenamiento personal exitoso en un ecosistema digital escalable globalmente. El reto principal fue digitalizar procesos complejos como la asignación de macros y la venta de planes personalizados. Desarrollamos una plataforma moderna diseñada para guiar a los usuarios hacia una vida más saludable con herramientas interactivas, un e-commerce propio con gestión de inventario y un área de usuarios privada segura.',
    link: 'https://www.serdeseable.site/',
    images: { 
      desktop: "/images/serdeseablepc.png", 
      mobile: "/images/serdeseablemv.png" 
    },
    color: "from-rose-600/20 to-orange-500/20",
    accent: "text-rose-400",
    border: "border-rose-500/30",
    stack: ['Next.js 14', 'Tailwind CSS', 'PostgreSQL', 'Stripe', 'Framer Motion'],
    tags: ['Web App', 'E-commerce', 'Bilingüe'],
    features: [
      { icon: <FaNutritionix/>, text: "Calculadora Nutricional Interactiva" },
      { icon: <HiOutlineShoppingCart/>, text: "E-commerce con Gestión de Pedidos" },
      { icon: <HiOutlineGlobeAlt/>, text: "Experiencia Bilingüe (ES/EN)" },
      { icon: <HiOutlineCpuChip/>, text: "Panel Administrativo CMS" }
    ]
  },

  // --- 2. INGENIERÍA SOCIAL (COMUNIDAD) ---
  {
    slug: 'opita-go',
    id: 'opita-go',
    title: 'Opita Go',
    subtitle: 'Movilidad Urbana Gratuita',
    category: 'Ingeniería Social',
    client: 'Iniciativa Vertrex (Acceso gratis)',
    year: '2024 - Presente',
    description: 'Una iniciativa filantrópica de Vertrex para la ciudad de Neiva. Ante el caos del transporte público (SETP) y la falta de información oficial centralizada, desarrollamos esta aplicación gratuita. Opita Go utiliza algoritmos de grafos y datos geoespaciales para calcular las mejores rutas de autobús sin necesidad de conexión a internet, ayudando a miles de ciudadanos a ahorrar tiempo y dinero diariamente.',
    link: 'https://github.com/Manupo12/opita-go', // Link al repo o descarga
    
    images: { 
      desktop: "/images/opitago-desktop.png", 
      mobile: "/images/opitago-mobile.png" 
    },
    color: "from-cyan-500/20 to-blue-600/20",
    accent: "text-cyan-400",
    border: "border-cyan-500/30",
    stack: ['React', 'Leaflet Maps', 'PWA Workbox', 'GeoJSON', 'Algoritmos de Grafos'],
    tags: ['Next.js', 'PWA', 'Offline First', 'Android'],
    features: [
      { icon: <HiMap/>, text: "Algoritmo GPS 100% Offline" },
      { icon: <FaAndroid/>, text: "App Nativa Android Ligera" },
      { icon: <HiOutlineDevicePhoneMobile/>, text: "PWA Instalable en iOS/Desktop" },
      { icon: <HiOutlineQrCode/>, text: "Sin Publicidad ni Rastreo" }
    ]
  },
  {
    slug: 'campus-usco',
    id: 'campus-usco',
    title: 'Campus USCO',
    subtitle: 'Ecosistema Universitario',
    category: 'Ingeniería Social',
    client: 'Comunidad Estudiantil USCO',
    year: '2025',
    description: 'Mucho más que una página web académica. Campus USCO es una super-app diseñada para centralizar y potenciar la vida universitaria. Integra un Marketplace seguro donde los estudiantes pueden emprender, un sistema colaborativo de "Objetos Perdidos" geolocalizado, y herramientas académicas vitales como simuladores de promedio y directorio de docentes con reseñas.',
    link: '#', // Link de la demo o sitio
    images: { 
      desktop: "/images/usco-desktop.png", 
      mobile: "/images/usco-mobile.png" 
    },
    color: "from-emerald-500/20 to-green-600/20",
    accent: "text-emerald-400",
    border: "border-emerald-500/30",
    stack: ['Next.js', 'Firebase Auth', 'Firestore', 'Vercel Edge Functions'],
    tags: ['Comunidad', 'Marketplace', 'Social'],
    features: [
      { icon: <HiOutlineShoppingCart/>, text: "Marketplace Estudiantil Seguro" },
      { icon: <HiOutlineIdentification/>, text: "Reporte de Objetos Perdidos" },
      { icon: <HiOutlineChartBar/>, text: "Dashboard Académico Personal" },
      { icon: <HiOutlineUserGroup/>, text: "Directorio Docente & Reseñas" },
      { icon: <HiOutlineMegaphone/>, text: "Tablón de Anuncios Oficiales" },
      { icon: <HiOutlineBell/>, text: "Notificaciones Push Inteligentes" }
    ]
  },

  // --- 3. PLANTILLAS DE NEGOCIO (SOLUCIONES) ---
  {
    slug: 'hotel-pro',
    id: 'hotel-pro',
    title: 'HotelPro',
    subtitle: 'Sistema de Reservas Hotelero',
    category: 'Plantilla de Negocio',
    client: 'Disponible para Licenciamiento',
    year: '2025',
    description: 'La solución definitiva para hoteles independientes que quieren dejar de pagar comisiones abusivas a las OTAs (Booking/Expedia). HotelPro ofrece una web pública impresionante optimizada para SEO y conversión, conectada a un motor de reservas propio. Incluye un panel administrativo robusto para que el personal gestione el calendario, bloqueos por mantenimiento, limpieza y tarifas dinámicas.',
    link: '#',
    images: { 
      desktop: "/images/hotelpro-desktop.png", 
      mobile: "/images/hotelpro-mobile.png" 
    },
    color: "from-indigo-600/10 to-purple-600/10",
    accent: "text-indigo-400",
    border: "border-indigo-500/30",
    stack: ['Next.js', 'Supabase', 'Stripe Connect', 'Tailwind UI'],
    tags: ['Reservas', 'SaaS', 'Admin Panel'],
    features: [
      { icon: <HiOutlineCalendar/>, text: "Motor de Reservas en Tiempo Real" },
      { icon: <FaBed/>, text: "Gestión de Estados de Habitación" },
      { icon: <HiOutlineCpuChip/>, text: "Dashboard de Ocupación e Ingresos" },
      { icon: <HiOutlineGlobeAlt/>, text: "Web Pública SEO-Optimized" }
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
    description: 'Software especializado para la alta rotación y privacidad que requieren los moteles. A diferencia de un hotel tradicional, MotelPro se centra en el control de tiempos exactos, alertas de vencimiento de turno, gestión de inventario de minibar/cocina y facturación electrónica rápida. Su interfaz está diseñada para ser usada en pantallas táctiles en recepción, minimizando errores humanos.',
    link: '#',
    images: { 
      desktop: "/images/motelpro-desktop.png", 
      mobile: "/images/motelpro-mobile.png" 
    },
    color: "from-red-600/10 to-pink-600/10",
    accent: "text-red-400",
    border: "border-red-500/30",
    stack: ['Electron', 'React', 'SQLite (Local First)', 'Socket.io'],
    tags: ['POS', 'Offline', 'Control de Inventario'],
    features: [
      { icon: <HiOutlineKey/>, text: "Control de Turnos y Caja" },
      { icon: <HiOutlineShoppingCart/>, text: "Inventario de Minibar y Cocina" },
      { icon: <HiOutlineCloudArrowDown/>, text: "Modo Offline (Sin Internet)" },
      { icon: <HiOutlineTicket/>, text: "Facturación POS Integrada" }
    ]
  },
  {
    slug: 'fiest-pro',
    id: 'fiest-pro',
    title: 'FiestPro',
    subtitle: 'Ticketing & Gestión de Eventos',
    category: 'Plataforma de Eventos',
    client: 'Disponible para Licenciamiento',
    year: '2025',
    description: 'Plataforma "All-in-One" para promotores de eventos y discotecas. Permite crear eventos, vender entradas con códigos QR únicos (anti-fraude), gestionar listas de invitados y vender merchandising. Incluye una App de Portero para escanear accesos en milisegundos y un panel para RRPP (promotores) donde pueden ver sus ventas y comisiones en tiempo real.',
    link: '#',
    images: { 
      desktop: "/images/fiestpro-desktop.png", 
      mobile: "/images/fiestpro-mobile.png" 
    },
    color: "from-yellow-500/10 to-orange-500/10",
    accent: "text-yellow-400",
    border: "border-yellow-500/30",
    stack: ['Next.js', 'QR Code Lib', 'Redis', 'AWS Lambda'],
    tags: ['Eventos', 'QR', 'RRPP'],
    features: [
      { icon: <HiOutlineTicket/>, text: "Venta de Entradas QR Seguras" },
      { icon: <HiOutlineQrCode/>, text: "App de Control de Acceso (Scanner)" },
      { icon: <HiOutlineUserGroup/>, text: "Panel de Promotores y Métricas" },
      { icon: <HiOutlineShoppingCart/>, text: "Tienda de Merchandising" }
    ]
  }
];