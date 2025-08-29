import { projects } from '@/lib/projects-data';
import { notFound } from 'next/navigation';
import ProjectDetailClient from '@/components/ProjectDetailClient';
import type { Metadata } from 'next';

interface PageParams {
  slug: string;
}

function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export async function generateMetadata(
  props: unknown // 
): Promise<Metadata> {
  const { params } = props as { params: PageParams };

  const project = getProject(params.slug);
  if (!project) {
    return { title: 'Proyecto no encontrado' };
  }
  return {
    title: `${project.title} | Portafolio Vertrex`,
    description: project.description,
  };
}

export default function ProjectDetailPage(props: unknown) {
  const { params } = props as { params: PageParams };

  const project = getProject(params.slug);
  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
