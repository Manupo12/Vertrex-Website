// Página legal: define términos y condiciones de uso, propiedad intelectual y alcance del servicio.
import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper";
import type { Metadata } from 'next';
import Link from 'next/link';
import { HiOutlineDocumentText, HiArrowRight } from 'react-icons/hi2';

// Metadata de la página
export const metadata: Metadata = {
  title: 'Términos de Servicio | Vertrex',
  description: 'Condiciones de uso y acuerdos de servicio para los proyectos y plataformas desarrolladas por Vertrex S.C.',
};

// Componente de Sección (Diseño Editorial Asimétrico - Mantiene consistencia)
const Section = ({ number, title, children }: { number: string, title: string; children: React.ReactNode }) => (
  <ScrollAnimationWrapper className="mb-16 md:mb-24 relative group">
    <div className="flex flex-col md:flex-row gap-4 md:gap-16 items-start">
        {/* Lado Izquierdo: Número y Título Sticky */}
        <div className="md:w-1/3 shrink-0 md:sticky md:top-32">
            <span className="text-primary font-mono font-bold text-sm tracking-widest block mb-3 opacity-80">{number}</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-display leading-tight">{title}</h2>
        </div>
        
        {/* Lado Derecho: Contenido Legal */}
        <div className="md:w-2/3 text-neutral-400 text-base md:text-lg leading-relaxed space-y-6">
            {children}
        </div>
    </div>
    {/* Línea divisoria sutil inferior */}
    <div className="hidden md:block absolute -bottom-12 left-1/3 right-0 h-px bg-white/5 group-hover:bg-white/10 transition-colors"></div>
  </ScrollAnimationWrapper>
);

// Página principal de Términos de Servicio
export default function TerminosDeServicioPage() {
  return (
    <div className="bg-neutral-950 text-white min-h-screen selection:bg-primary selection:text-black font-sans pb-32">
      
      {/* --- HEADER EDITORIAL --- */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden border-b border-white/5">
        {/* Resplandor sutil de fondo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

        <div className="mx-auto max-w-[1200px] relative z-10 text-center">
            <ScrollAnimationWrapper>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
                    <HiOutlineDocumentText className="w-4 h-4" /> Acuerdos Claros
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white font-display mb-6">
                    Términos de Servicio
                </h1>
                <p className="text-lg text-neutral-500 font-mono">
                    Última actualización: 15 de Marzo de 2026
                </p>
            </ScrollAnimationWrapper>
        </div>
      </section>

      {/* --- CONTENIDO LEGAL --- */}
      <section className="mx-auto max-w-[1200px] px-6 lg:px-8 pt-20">
        
        <Section number="01" title="Aceptación de los Términos">
          <p>
            Al acceder a nuestro sitio web, utilizar nuestros servicios de consultoría, o contratar a Vertrex S.C. para el desarrollo de software, sitios web, aplicaciones móviles o automatizaciones, aceptas estar sujeto a estos Términos de Servicio.
          </p>
          <p>
            Si estás aceptando estos términos en nombre de una empresa u otra entidad legal, declaras que tienes la autoridad para obligar a dicha entidad a estos términos. Si no estás de acuerdo con alguna parte de los términos, no podrás acceder a los servicios.
          </p>
        </Section>

        <Section number="02" title="Nuestros Servicios">
          <p>
            Vertrex S.C. es una agencia de ingeniería de software enfocada en soluciones a medida. Nuestros servicios principales incluyen, pero no se limitan a:
          </p>
          <ul className="space-y-3 mt-4">
            <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0"></div>
                <span>Desarrollo de Sitios Web y Plataformas E-commerce.</span>
            </li>
            <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0"></div>
                <span>Creación de Web Apps (PWA) y Aplicaciones Nativas.</span>
            </li>
            <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0"></div>
                <span>Desarrollo de Sistemas de Gestión (SaaS) y paneles administrativos.</span>
            </li>
            <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0"></div>
                <span>Automatización de procesos e integración de Inteligencia Artificial.</span>
            </li>
          </ul>
        </Section>

        <Section number="03" title="Propiedad Intelectual, Mockups y Código">
          <p>
            A diferencia del estándar de la industria, en Vertrex creemos en la transparencia y la propiedad de la tecnología por parte del cliente, pero protegemos rigurosamente nuestro trabajo creativo inicial.
          </p>
          <div className="mt-6 p-5 bg-white/5 border border-white/10 rounded-xl mb-6">
            <p className="text-white text-sm font-medium m-0 leading-relaxed">
              <strong className="block text-base mb-1 text-primary">Protección de Mockups y Prototipos:</strong> 
              Durante la fase de descubrimiento y diseño, Vertrex presentará maquetas visuales (mockups) y prototipos interactivos. Estos activos son propiedad intelectual exclusiva de Vertrex S.C. <strong>Queda estrictamente prohibido copiar, replicar, distribuir o utilizar estos diseños con otras agencias o desarrolladores independientes</strong> sin la autorización expresa por escrito y la liquidación del costo total de la fase de diseño.
            </p>
          </div>
          <div className="p-5 bg-primary/5 border border-primary/20 rounded-xl">
            <p className="text-primary text-sm font-medium m-0 leading-relaxed">
              <strong className="block text-base mb-1">Propiedad del Cliente (Entregable Final):</strong> 
              Una vez liquidado el 100% del pago acordado en el contrato o cotización, el código fuente, las bases de datos y todos los activos digitales desarrollados para el proyecto pasan a ser propiedad exclusiva de tu empresa. No cobramos mensualidades por &quot;alquiler de código&quot; a menos que se trate explícitamente de un servicio SaaS de suscripción propia.
            </p>
          </div>
          <p className="mt-6">
            Vertrex se reserva el derecho de utilizar componentes genéricos de código abierto (Open Source) y librerías preexistentes necesarias para el funcionamiento del proyecto. Asimismo, nos reservamos el derecho de mostrar el proyecto finalizado en nuestro portafolio y materiales de marketing, a menos que se firme un Acuerdo de Confidencialidad (NDA) previo.
          </p>
        </Section>

        <Section number="04" title="Pagos, Cotizaciones y Entregas">
          <p>
            Todos los proyectos se rigen por una cotización formal y un acuerdo de alcance de proyecto.
          </p>
          <ul className="space-y-3 mt-4">
            <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2.5 shrink-0"></div>
                <span><strong>Estructura de Pagos:</strong> Trabajamos bajo esquemas de hitos (sprints) o anticipos acordados mutuamente. El inicio de cualquier desarrollo requiere un anticipo formal.</span>
            </li>
            <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2.5 shrink-0"></div>
                <span><strong>Tiempos de Entrega:</strong> Los tiempos estimados se basan en la recepción oportuna de información, recursos y feedback por parte del cliente. Retrasos en la entrega de material por parte del cliente pueden modificar las fechas de lanzamiento.</span>
            </li>
            <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2.5 shrink-0"></div>
                <span><strong>Mantenimiento:</strong> El soporte y mantenimiento post-lanzamiento se rigen bajo pólizas independientes o garantías especificadas en el contrato de tu proyecto.</span>
            </li>
          </ul>
        </Section>

        <Section number="05" title="Responsabilidades del Cliente">
          <p>
            Para garantizar el éxito del ecosistema digital, el cliente se compromete a:
          </p>
          <ul className="space-y-3 mt-4">
            <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2.5 shrink-0"></div>
                <span>Proporcionar requerimientos claros, materiales gráficos y textos necesarios en los tiempos acordados.</span>
            </li>
            <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2.5 shrink-0"></div>
                <span>Asegurar que todo el material proporcionado (imágenes, textos, logos) no infringe derechos de autor de terceros.</span>
            </li>
            <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2.5 shrink-0"></div>
                <span>Participar activamente en las revisiones de las maquetas y prototipos interactivos.</span>
            </li>
          </ul>
        </Section>

        <Section number="06" title="Limitación de Responsabilidad">
            <p>
                Nuestros ecosistemas se desarrollan bajo los más altos estándares de calidad y seguridad. Sin embargo, Vertrex no se hace responsable por daños indirectos, pérdida de datos, interrupciones de negocio o pérdidas de beneficios resultantes de fallos en servidores de terceros (como AWS o Vercel), pasarelas de pago externas o hackeos derivados de una mala gestión de contraseñas por parte del cliente.
            </p>
        </Section>
        
        <Section number="07" title="Legislación Aplicable">
            <p>
                Estos Términos de Servicio se regirán e interpretarán de acuerdo con las leyes de la República de Colombia. Cualquier disputa relacionada con estos términos, la política de privacidad o los servicios prestados será sometida a la jurisdicción de los tribunales competentes.
            </p>
        </Section>

        <Section number="08" title="Información de Contacto">
            <p>
                Si tienes preguntas sobre nuestras metodologías, contratos o estos Términos de Servicio, estamos para ayudarte de manera transparente:
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Link href="/contacto" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors">
                    Ir al Formulario de Contacto
                </Link>
                <a href="mailto:vertrexsc@gmail.com" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold hover:bg-primary hover:text-black transition-colors group">
                    vertrexsc@gmail.com <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </a>
            </div>
        </Section>

      </section>
    </div>
  );
}