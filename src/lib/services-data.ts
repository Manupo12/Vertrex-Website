import { FaSearch, FaDraftingCompass, FaLaptopCode, FaRocket } from 'react-icons/fa';
import { HiOutlineCodeBracketSquare, HiOutlineMegaphone, HiOutlineSparkles, HiOutlineCube } from "react-icons/hi2";
import type { IconType } from 'react-icons';

export interface Service {
  title: string;
  icon: IconType;
  description: string;
  offerings: string[];
  imageUrl: string;
  imageSide: 'left' | 'right';
}

export const services: Service[] = [
  {
    title: 'Desarrollo Digital y de Software',
    icon: HiOutlineCodeBracketSquare,
    description: 'Creamos la web o app que tu negocio necesita para vender más y operar mejor. Soluciones rápidas, modernas y optimizadas para tu presupuesto.',
    offerings: ['Páginas Web para Negocios', 'Tiendas en Línea (E-commerce)', 'Apps Nativas para Android', 'Software a Medida'],
    imageUrl: '/images/servicio-desarrollo.webp',
    imageSide: 'right',
  },
  {
    title: 'Marketing y Estrategia de Contenidos',
    icon: HiOutlineMegaphone,
    description: 'Hacemos que más clientes te encuentren en redes sociales. Nos encargamos de la estrategia digital para que tú te dediques a tu negocio.',
    offerings: ['Gestión de Instagram y Facebook', 'Campañas de Anuncios Pagados', 'Creación de Contenido Atractivo', 'Análisis de Resultados'],
    imageUrl: '/images/servicio-marketing.webp',
    imageSide: 'left',
  },
  {
    title: 'Marcas y Productos Vertrex',
    icon: HiOutlineSparkles,
    description: 'Nuestra pasión es crear. Este laboratorio de ideas nos permite aplicar las últimas tendencias directamente en tu proyecto, dándote una ventaja competitiva.',
    offerings: ['Apps Propias (Opita Go, IVON)', 'Desarrollo de Videojugos', 'Líneas de Ropa (E-commerce)', 'Nuevos Emprendimientos'],
    imageUrl: '/images/servicio-productos.webp',
    imageSide: 'right',
  },
  {
    title: 'Servicios Físicos y de Vanguardia',
    icon: HiOutlineCube,
    description: 'Llevamos la innovación más allá de la pantalla. Desde prototipos en 3D hasta espacios inteligentes, materializamos tus ideas más audaces.',
    offerings: ['Impresión 3D por Encargo', 'Automatización de Hogares', 'Proyectos Físicos Especiales'],
    imageUrl: '/images/servicio-fisicos.webp',
    imageSide: 'left',
  },
]

export const processSteps = [
    { name: 'Descubrimiento', icon: FaSearch, description: 'Nos sumergimos en tu visión y los objetivos de tu negocio para entender el "porqué" de tu proyecto.' },
    { name: 'Diseño y Estrategia', icon: FaDraftingCompass, description: 'Creamos un plan de acción, diseñando la arquitectura y la experiencia de usuario (UX/UI) a medida.' },
    { name: 'Desarrollo', icon: FaLaptopCode, description: 'Nuestro equipo de ingenieros traduce los diseños en código limpio, eficiente y escalable.' },
    { name: 'Lanzamiento y Crecimiento', icon: FaRocket, description: 'Desplegamos la solución y te acompañamos con estrategias para asegurar su impacto y crecimiento.' }
]