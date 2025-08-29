
export interface GalleryItem {
  imageUrl: string;
  caption: string;
}

export interface Project {
  slug: string;
  title: string;
  developer: string;
  type: 'app' | 'web';
  category: string;
  coverImage: string;
  appLogo?: string; 
  status: 'Publicado' | 'En Desarrollo' | 'Próximamente';
  statusColor: string;
  description: string;
  details: {
    challenge: string;
    solution: string;
    outcome: string;
  };
  technologies: string[];
  promoVideoUrl?: string | null;
  galleryImages: GalleryItem[]; 
  liveUrl: string | null;
}

export const projects: Project[] = [
  {
    slug: 'opita-go',
    title: 'Opita GO',
    developer: 'Vertrex S.C.',
    type: 'app',
    category: 'App Móvil Nativa (Android)',
    coverImage: '/images/opitago.png',
    appLogo: '/images/logo-opitago.webp',
    status: 'Publicado',
    statusColor: 'text-primary',
    description: 'La guía definitiva para el sistema de transporte público de Neiva, con un enfoque en el funcionamiento offline y una experiencia de usuario intuitiva.',
    details: {
      challenge: 'La información sobre las rutas de transporte público en Neiva estaba fragmentada y era inaccesible digitalmente, lo que generaba incertidumbre y dificultaba la movilidad. El reto era crear una herramienta nativa, rápida, que funcionara offline y centralizara todos los datos de forma intuitiva.',
      solution: 'Se desarrolló una aplicación nativa 100% en Kotlin con arquitectura MVVM. La solución se centra en una base de datos local (Room) que se sincroniza desde archivos GeoJSON, garantizando un rendimiento óptimo. Incluye un planificador de viajes de punto A a B, visualización de rutas en un motor de mapas open-source (MapLibre), y un sistema de monetización dual con anuncios (AdMob) y un plan Premium (Google Play Billing).',
      outcome: 'Opita GO se ha posicionado como una herramienta clave para la movilidad en Neiva, con una calificación sólida en la Play Store y feedback positivo de los usuarios. Técnicamente, el proyecto culminó en una migración exitosa de Google Maps a MapLibre, optimizando costos y demostrando una gran capacidad de adaptación. La app ahora sirve como una plataforma estable y escalable, lista para futuras mejoras.',
    },
    technologies: [
      'Kotlin', 'MVVM (Arquitectura)', 'Hilt (Inyección de Dependencias)', 'Coroutines & Flow', 'Room (Base de Datos SQLite)', 'MapLibre GL', 'Google Play Billing', 'Google AdMob', 'ViewBinding', 'Material Design'
    ],
    promoVideoUrl: null,
    galleryImages: [
        { imageUrl: '/images/captura1opita.jpg', caption: 'Visualización clara de todas las rutas disponibles, fácil de usar.'},
        { imageUrl: '/images/captura3opita.jpg', caption: 'Planificador de viajes inteligente que te sugiere la mejor ruta de un punto A a un punto B.'},
        { imageUrl: '/images/captura2opita.jpg', caption: 'Detalles completos de cada ruta, incluyendo paradas clave y horarios de operación.'},
    ],
    liveUrl: 'https://play.google.com/store/apps/details?id=com.manup.opitago',
  },
  {
    slug: 'ivon',
    title: 'I.V.O.N.',
    developer: 'Vertrex S.C.',
    type: 'app',
    category: 'App Móvil Nativa (Android)',
    coverImage: '/images/proximamente.jpeg',
    appLogo: '/images/logodesarrollo.png',
    status: 'En Desarrollo',
    statusColor: 'text-yellow-400',
    description: 'Una aplicación móvil nativa para Android que permite a los ciudadanos de Neiva reportar y visualizar incidentes viales.',
    details: {
      challenge: 'Los ciudadanos en Neiva carecían de una plataforma centralizada y en tiempo real para conocer el estado de las vías, dificultando la planificación de rutas y la notificación de problemas a la comunidad.',
      solution: 'Se desarrolló una aplicación nativa para Android usando Kotlin y Jetpack Compose, con un sistema de autenticación híbrido (anónimo y Google) y un mapa interactivo basado en OpenStreetMap para reportes geolocalizados.',
      outcome: 'El proyecto busca crear una comunidad ciudadana colaborativa que mejore la movilidad en Neiva, incentivando la participación con un sistema de perfiles y reputación para mantener la información vial fiable.',
    },
    technologies: [
      'Kotlin', 'Jetpack Compose', 'Android Studio', 'Arquitectura MVVM', 'Coroutines & Flow', 'Hilt', 'Firebase', 'OpenStreetMap (osmdroid)',
    ],
    promoVideoUrl: null,
    galleryImages: [
        { imageUrl: '/images/proximamentecel.png', caption: 'En Desarrollo.'},
    ],
    liveUrl: null,
  },
  
];