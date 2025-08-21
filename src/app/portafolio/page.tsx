'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { IoLogoGooglePlaystore } from "react-icons/io5";
import { VscTools } from "react-icons/vsc";
import { GiTShirt } from "react-icons/gi";
import { FaBookOpen } from "react-icons/fa";

const vertrexProjects = [
  {
    title: 'Opita GO',
    status: 'Publicado',
    statusColor: 'text-primary',
    description: 'La guía definitiva para las rutas de bus en Neiva. Una app Android nativa que facilita la movilidad urbana.',
    icon: <IoLogoGooglePlaystore size={32} />,
    url: 'https://play.google.com/store/apps/details?id=com.opitago.app',
  },
  {
    title: 'IVON (Información Vial de Neiva)',
    status: 'En Desarrollo',
    statusColor: 'text-yellow-400',
    description: 'Plataforma con mapa en vivo para reportar y visualizar el estado de las vías en Neiva: huecos, retenes y arreglos.',
    icon: <VscTools size={32} />,
  },
  {
    title: 'Marca de Ropa Vertrex',
    status: 'Próximamente',
    statusColor: 'text-sky-400',
    description: 'Línea de ropa con diseños únicos para nichos específicos: tecno, rave, cultura cannábica y más.',
    icon: <GiTShirt size={32} />,
  },
  {
    title: 'Libro de Ficción',
    status: 'Próximamente',
    statusColor: 'text-sky-400',
    description: 'Publicación de una novela de ficción bajo el sello editorial de Vertrex, explorando nuevos mundos narrativos.',
    icon: <FaBookOpen size={32} />,
  },
];

const ProjectCard = ({ project }: { project: (typeof vertrexProjects)[0] }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative flex flex-col rounded-2xl border border-white/10 p-6 bg-white/5 overflow-hidden h-full"
    >
      <div className="flex-grow">
        <div className="flex items-center gap-x-4">
          <div className="flex-none text-primary">{project.icon}</div>
          <div className="text-sm font-medium leading-6 text-foreground/80">
            <span className={project.statusColor}>{project.status}</span>
          </div>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground font-display">{project.title}</h3>
        <p className="mt-1 text-sm text-foreground/70">{project.description}</p>
      </div>
      {project.url && (
        <Link href={project.url} target="_blank" rel="noopener noreferrer" className="mt-4 text-sm font-semibold text-primary hover:text-primary/80 transition-colors self-start">
          Ver en Play Store &rarr;
        </Link>
      )}
    </motion.div>
  );

const FirstClientCard = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="group relative flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-primary/30 p-8 h-full overflow-hidden transition-all duration-300 hover:border-primary/80"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_80%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      
      <div className="relative z-10">
          <h3 className="text-xl font-bold text-foreground font-display transition-transform duration-300 group-hover:scale-105">
            Tu Visión, Nuestro Próximo Gran Proyecto
          </h3>
          <p className="mt-2 text-sm text-foreground/70">
            Buscamos socios visionarios para ser nuestros primeros casos de éxito. Obtén atención prioritaria y un desarrollo excepcional para llevar tu idea al siguiente nivel.
          </p>
          <div className="mt-6 transition-transform duration-300 group-hover:scale-110">
            <Link href="/contacto" className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-background shadow-sm hover:bg-primary/80 transition-all duration-300 hover:shadow-[0_0_20px_theme(colors.primary.DEFAULT)]">
              Conviértete en un Caso de Éxito
            </Link>
          </div>
      </div>
    </motion.div>
  );

export default function PortafolioPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-32 pb-16">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl font-display">
          Nuestro Trabajo y Creaciones
        </h2>
        <p className="mt-6 text-lg leading-8 text-foreground/80">
          Explora los proyectos que hemos desarrollado y el espacio que hemos reservado para nuestro próximo gran socio.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-x-16">
        
        {/* Columna 1: Proyectos Vertrex */}
        <div className="flex flex-col">
          <h3 className="text-2xl font-semibold text-center text-foreground font-display mb-8">Proyectos Vertrex</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {vertrexProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </div>

        {/* Columna 2: Invitación para Clientes */}
        <div className="flex flex-col">
          <h3 className="text-2xl font-semibold text-center text-foreground font-display mb-8">Proyectos para Clientes</h3>
          <div className="flex-grow">
            <FirstClientCard />
          </div>
        </div>
      </div>
      
      {/* Sección de Precios */}
      <div className="mt-24 text-center p-8 border border-dashed border-primary/20 rounded-lg bg-white/5">
        <h3 className="font-display text-2xl text-primary">Soluciones de Alto Impacto a Precios Competitivos</h3>
        <p className="mt-4 max-w-2xl mx-auto text-foreground/80">Creemos que la tecnología de punta no debería ser un lujo inalcanzable. Ofrecemos planes y precios flexibles diseñados para startups, emprendedores y negocios en crecimiento en Neiva y toda Colombia.</p>
        <Link href="/contacto" className="mt-6 inline-block rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-background shadow-sm hover:bg-primary/80">
            Solicita una Cotización
        </Link>
      </div>
    </div>
  )
}