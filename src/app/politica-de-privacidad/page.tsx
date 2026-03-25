// Página legal: define política de privacidad y tratamiento de datos para usuarios del sitio.
import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper";
import type { Metadata } from 'next';
import Link from 'next/link';
import { HiOutlineShieldCheck, HiArrowRight } from 'react-icons/hi2';

// Metadata de la página
export const metadata: Metadata = {
  title: 'Política de Privacidad | Vertrex',
  description: 'Conoce cómo Vertrex maneja y protege tus datos personales. Tu privacidad es nuestro compromiso.',
};

// Componente de Sección (Diseño Editorial Asimétrico)
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

// Página principal de Política de Privacidad
export default function PoliticaDePrivacidadPage() {
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
                    <HiOutlineShieldCheck className="w-4 h-4" /> Transparencia y Seguridad
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white font-display mb-6">
                    Política de Privacidad
                </h1>
                <p className="text-lg text-neutral-500 font-mono">
                    Última actualización: 15 de Marzo de 2026
                </p>
            </ScrollAnimationWrapper>
        </div>
      </section>

      {/* --- CONTENIDO LEGAL --- */}
      <section className="mx-auto max-w-[1200px] px-6 lg:px-8 pt-20">
        
        <Section number="01" title="Introducción">
          <p>
            Bienvenido a Vertrex S.C. (&quot;nosotros&quot;, &quot;nuestro&quot;). Nos comprometemos a proteger tu privacidad y a manejar tus datos personales de manera transparente y segura, en estricto cumplimiento con la <strong>Ley 1581 de 2012 de Habeas Data</strong> en Colombia.
          </p>
          <p>
            Esta Política de Privacidad explica qué información recopilamos a través de nuestro ecosistema digital, cómo la procesamos y los mecanismos que utilizamos para protegerla.
          </p>
        </Section>

        <Section number="02" title="Información que Recopilamos">
          <p>
            Recopilamos información que nos proporcionas directamente cuando interactúas con nosotros (por ejemplo, al utilizar nuestro formulario de contacto o agendar una consulta). Esta información incluye:
          </p>
          <ul className="space-y-3 mt-4">
            <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0"></div>
                <span><strong>Datos de Identificación:</strong> Nombre completo y nombre de tu empresa o proyecto.</span>
            </li>
            <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0"></div>
                <span><strong>Datos de Contacto:</strong> Dirección de correo electrónico y número de teléfono (WhatsApp).</span>
            </li>
            <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0"></div>
                <span><strong>Datos Operativos:</strong> Cualquier información técnica, modelos de negocio o datos financieros que nos envíes voluntariamente para cotizar tu ecosistema digital.</span>
            </li>
          </ul>
        </Section>

        <Section number="03" title="Uso de la Información">
          <p>
            La información que nos proporcionas es tratada como confidencial y se utiliza exclusivamente para los siguientes propósitos operativos:
          </p>
          <ul className="space-y-3 mt-4">
            <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2.5 shrink-0"></div>
                <span>Responder a tus consultas, auditar tus necesidades y generar presupuestos técnicos precisos.</span>
            </li>
            <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2.5 shrink-0"></div>
                <span>Coordinar reuniones, demos y entregar avances de los ecosistemas en desarrollo.</span>
            </li>
          </ul>
          <div className="mt-6 p-5 bg-primary/5 border border-primary/20 rounded-xl">
            <p className="text-primary text-sm font-medium m-0">
              <strong>Garantía Vertrex:</strong> Nunca venderemos, alquilaremos ni compartiremos tu información corporativa, secretos de negocio o datos personales con terceros para fines comerciales sin tu consentimiento explícito.
            </p>
          </div>
        </Section>
        
        <Section number="04" title="Seguridad de los Datos">
            <p>
                Implementamos medidas de seguridad técnicas, físicas y administrativas de alto nivel para proteger tu información contra el acceso no autorizado, la alteración, divulgación o destrucción. 
            </p>
            <p>
                Nuestras bases de datos están encriptadas y el acceso a la información de clientes está estrictamente limitado a los ingenieros y diseñadores asignados a tu proyecto. Sin embargo, debes comprender que ningún método de transmisión por Internet es 100% infalible.
            </p>
        </Section>

        {/* NUEVA SECCIÓN DE PROTECCIÓN INTELECTUAL PARA MOCKUPS */}
        <Section number="05" title="Protección de Propiedad Intelectual e Información Confidencial">
            <p>
                La relación con nuestros clientes se basa en la confianza mutua y el respeto por el trabajo intelectual.
            </p>
            <div className="mt-6 p-5 bg-white/5 border border-white/10 rounded-xl mb-6">
                <p className="text-white text-sm font-medium m-0 leading-relaxed">
                <strong className="block text-base mb-1 text-primary">Protección de Diseños Previos:</strong> 
                Toda maqueta visual (mockup), arquitectura de software, propuesta técnica o prototipo interactivo compartido contigo durante la fase de consultoría o cotización <strong>es propiedad intelectual exclusiva de Vertrex S.C.</strong> La recopilación de tus datos para enviarte estas propuestas <strong>NO</strong> otorga derecho alguno a copiar, distribuir o entregar estos diseños a agencias de terceros o desarrolladores externos sin nuestra autorización explícita o la liquidación de la fase de diseño.
                </p>
            </div>
            <p>
                Del mismo modo, Vertrex S.C. se compromete a mantener estricta confidencialidad sobre las ideas de negocio, lógicas operativas o estrategias que el cliente nos comparta durante estas fases previas, actuando bajo principios de secreto profesional incluso si el proyecto no llega a concretarse.
            </p>
        </Section>

        <Section number="06" title="Tus Derechos (Habeas Data)">
            <p>
                De acuerdo con la legislación colombiana, como titular legítimo de los datos, tienes el control absoluto sobre ellos y el derecho a:
            </p>
            <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2.5 shrink-0"></div>
                    <span>Conocer, actualizar y rectificar tus datos personales en nuestras bases.</span>
                </li>
                <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2.5 shrink-0"></div>
                    <span>Solicitar prueba de la autorización otorgada para el tratamiento de los mismos.</span>
                </li>
                <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2.5 shrink-0"></div>
                    <span>Revocar tu autorización y/o solicitar la supresión inmediata de tus datos de nuestros servidores.</span>
                </li>
                <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-2.5 shrink-0"></div>
                    <span>Presentar quejas ante la Superintendencia de Industria y Comercio por infracciones a la ley.</span>
                </li>
            </ul>
        </Section>
        
        <Section number="07" title="Cambios a esta Política">
            <p>
            La tecnología y la legislación evolucionan, por lo que podemos actualizar esta Política de Privacidad ocasionalmente para reflejar mejoras en nuestros procesos de seguridad. La fecha de &quot;Última actualización&quot; en la cabecera indicará cuándo se realizaron los últimos cambios.
            </p>
        </Section>

        <Section number="08" title="Información de Contacto">
            <p>
                Si tienes alguna pregunta técnica o legal sobre cómo manejamos tus datos, o si deseas ejercer tus derechos de Habeas Data, nuestro equipo está a tu disposición:
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