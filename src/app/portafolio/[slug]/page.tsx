// Ruta dinámica de detalle: renderiza la información completa de un proyecto según su slug.
import { projects } from '@/lib/projects-data'; // Asegúrate de que esta ruta sea correcta
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProjectDetailClient from '@/components/ProjectDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Función auxiliar para buscar proyecto
async function getProject(slug: string) {
  // Simulamos una pequeña latencia o búsqueda directa
  return projects.find((p) => p.slug === slug);
}

// Generación de Metadata SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: 'Proyecto no encontrado' };
  }

  return {
    title: `${project.title} | Ingeniería Vertrex`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [project.coverImage ?? project.galleryImages?.[0]?.imageUrl ?? '/images/proximamente.jpeg'],
    },
  };
}

// Componente de Página
export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  // Pasamos los datos al componente cliente interactivo
  return <ProjectDetailClient project={project} />;
}