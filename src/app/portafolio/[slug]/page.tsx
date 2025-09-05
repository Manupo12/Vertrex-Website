// Datos de proyectos (array con información estática o cargada desde /src/lib)
import { projects } from '@/lib/projects-data';
// Utilidad de Next.js para devolver 404 desde el servidor cuando el recurso no existe
import { notFound } from 'next/navigation';
// Componente cliente que renderiza el detalle completo del proyecto
import ProjectDetailClient from '@/components/ProjectDetailClient';
// Tipos de Metadata para Next.js
import type { Metadata } from 'next';

// Tipado simple para los parámetros de la página (ruta dinámica /portafolio/[slug])
interface PageParams {
  slug: string;
}

// Función auxiliar: obtener un proyecto por su slug
// Retorna el objeto del proyecto si lo encuentra o undefined si no existe
function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

// generateMetadata se ejecuta en el servidor para generar metadatos dinámicos
// según el proyecto solicitado. Recibe props con los params de la ruta.
export async function generateMetadata(
  props: unknown  
): Promise<Metadata> {
  const { params } = props as { params: PageParams };

  // Buscar el proyecto por slug
  const project = getProject(params.slug);
  if (!project) {
    // Si no existe, devolver metadata genérica de "no encontrado"
    return { title: 'Proyecto no encontrado' };
  }

  // Si existe, devolver título y descripción específicos para SEO/Head
  return {
    title: `${project.title} | Portafolio Vertrex`,
    description: project.description,
  };
}

// Componente de la página de detalle del proyecto
// Recibe `props` con `params.slug`, busca el proyecto y renderiza
// el componente cliente que muestra todo el contenido.
export default function ProjectDetailPage(props: unknown) {
  const { params } = props as { params: PageParams };

  // Buscar el proyecto correspondiente al slug de la ruta
  const project = getProject(params.slug);
  if (!project) {
    // Si no se encuentra, Next hará un 404 usando notFound()
    notFound();
  }

  // Render del componente cliente que maneja la UI completa del detalle
  return <ProjectDetailClient project={project} />;
}
