import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper";
import type { Metadata } from 'next';
import Link from 'next/link';

// Metadata de la página: título y descripción que usa Next.js para el head
export const metadata: Metadata = {
  title: 'Política de Privacidad | Vertrex',
  description: 'Conoce cómo Vertrex maneja y protege tus datos personales. Tu privacidad es nuestro compromiso.',
};

// Componente auxiliar: Section
// Usa ScrollAnimationWrapper para animar la entrada de cada sección y aplica estilos de contenido
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <ScrollAnimationWrapper className="mb-10">
    {/* Título de sección */}
    <h2 className="text-2xl font-bold text-primary mb-4 font-display">{title}</h2>
    {/* Contenedor de contenido con clases de 'prose' para formato tipográfico */}
    <div className="prose prose-invert max-w-none prose-p:text-foreground/80 prose-li:text-foreground/80 prose-a:text-primary hover:prose-a:text-primary/80 prose-headings:font-display">
      {children}
    </div>
  </ScrollAnimationWrapper>
);

// Página principal de Política de Privacidad
// Renderiza varias secciones que explican cómo se manejan los datos y los derechos del usuario
export default function PoliticaDePrivacidadPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-8 pt-28 pb-16 sm:pt-32">
      {/* Encabezado principal con animación */}
      <ScrollAnimationWrapper>
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl font-display text-center">
          Política de Privacidad
        </h1>
        {/* Fecha de última actualización (texto estático por ahora) */}
        <p className="mt-4 text-center text-foreground/70">Última actualización: 28 de Agosto de 2025</p>
      </ScrollAnimationWrapper>
      
      <div className="mt-16">
        {/* 1. Introducción: propósito y cumplimiento legal */}
        <Section title="1. Introducción">
          <p>
            Bienvenido a Vertrex S.C. (&quot;nosotros&quot;, &quot;nuestro&quot;). Nos comprometemos a proteger tu privacidad y a manejar tus datos personales de manera transparente y segura, en cumplimiento con la Ley 1581 de 2012 de Habeas Data en Colombia. Esta Política de Privacidad explica qué información recopilamos a través de nuestro sitio web y cómo la usamos.
          </p>
        </Section>

        {/* 2. Información que Recopilamos: campos típicos recogidos por formularios */}
        <Section title="2. Información que Recopilamos">
          <p>
            Recopilamos información que nos proporcionas directamente cuando utilizas nuestro formulario de contacto o cuestionario de proyecto. Esta información puede incluir:
          </p>
          <ul>
            <li>Nombre Completo</li>
            <li>Dirección de correo electrónico</li>
            <li>Nombre de tu negocio o proyecto</li>
            <li>Cualquier otra información que nos envíes voluntariamente en tu mensaje.</li>
          </ul>
        </Section>

        {/* 3. Uso de la información: finalidades del tratamiento */}
        <Section title="3. Cómo Usamos tu Información">
          <p>
            La información que nos proporcionas se utiliza exclusivamente para los siguientes propósitos:
          </p>
          <ul>
            <li>Para responder a tus consultas, preguntas y solicitudes de cotización o demos.</li>
            <li>Para comunicarnos contigo acerca de los servicios en los que has mostrado interés.</li>
            <li>Para mejorar la calidad de nuestros servicios y la experiencia en nuestro sitio web.</li>
          </ul>
          <p>
            Nunca venderemos, alquilaremos ni compartiremos tu información personal con terceros para fines de marketing sin tu consentimiento explícito.
          </p>
        </Section>
        
        {/* 4. Seguridad de los datos: medidas generales y limitaciones */}
        <Section title="4. Seguridad de los Datos">
            <p>
                Tomamos medidas de seguridad técnicas y administrativas razonables para proteger tu información contra el acceso no autorizado, la alteración o la destrucción. Sin embargo, ningún método de transmisión por Internet es 100% seguro.
            </p>
        </Section>

        {/* 5. Derechos del titular: listado de derechos según la legislación */}
        <Section title="5. Tus Derechos (Habeas Data)">
            <p>
                De acuerdo con la legislación colombiana, como titular de los datos, tienes derecho a:
            </p>
            <ul>
                <li>Conocer, actualizar y rectificar tus datos personales.</li>
                <li>Solicitar prueba de la autorización otorgada para el tratamiento de tus datos.</li>
                <li>Ser informado sobre el uso que se le ha dado a tus datos personales.</li>
                <li>Presentar quejas ante la Superintendencia de Industria y Comercio por infracciones a la ley.</li>
                <li>Revocar la autorización y/o solicitar la supresión de tus datos.</li>
            </ul>
        </Section>
        
        {/* 6. Cambios: aviso sobre actualizaciones de la política */}
        <Section title="6. Cambios a esta Política">
            <p>
                Podemos actualizar esta Política de Privacidad ocasionalmente. La fecha de &quot;Última actualización&quot; en la parte superior de esta página indicará cuándo se realizaron los últimos cambios. Te recomendamos revisarla periódicamente.
            </p>
        </Section>

        {/* 7. Contacto: cómo comunicarse para consultas o ejercer derechos */}
        <Section title="7. Contacto">
            <p>
                Si tienes alguna pregunta sobre esta Política de Privacidad o deseas ejercer tus derechos, puedes contactarnos a través de nuestro <Link href="/contacto">formulario de contacto</Link> o escribiéndonos directamente a <a href="mailto:vertrexsc@gmail.com">vertrexsc@gmail.com</a>.
            </p>
        </Section>
      </div>
    </div>
  );
}