import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <ScrollAnimationWrapper className="mb-10">
    <h2 className="text-2xl font-bold text-primary mb-4 font-display">{title}</h2>
    <div className="prose prose-invert prose-p:text-foreground/80 prose-li:text-foreground/80 prose-a:text-primary hover:prose-a:text-primary/80">
      {children}
    </div>
  </ScrollAnimationWrapper>
);

export default function PoliticaDePrivacidadPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-8 pt-32 pb-16">
      <ScrollAnimationWrapper>
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl font-display text-center">
          Política de Privacidad
        </h1>
        <p className="mt-4 text-center text-foreground/70">Última actualización: 10 de Agosto de 2025</p>
      </ScrollAnimationWrapper>
      
      <div className="mt-16">
        <Section title="1. Introducción">
          <p>
            Bienvenido a Vertrex. Nos comprometemos a proteger tu privacidad y a manejar tus datos personales de manera transparente y segura. Esta Política de Privacidad explica qué información recopilamos a través de nuestro sitio web (vertrex.co), cómo la usamos y cuáles son tus derechos respecto a ella.
          </p>
        </Section>

        <Section title="2. Información que Recopilamos">
          <p>
            Recopilamos información que nos proporcionas directamente cuando utilizas nuestro formulario de contacto. Esta información incluye:
          </p>
          <ul>
            <li>Nombre Completo</li>
            <li>Dirección de correo electrónico</li>
            <li>El contenido del mensaje que nos envías</li>
          </ul>
        </Section>

        <Section title="3. Cómo Usamos tu Información">
          <p>
            La información que nos proporcionas se utiliza exclusivamente para los siguientes propósitos:
          </p>
          <ul>
            <li>Para responder a tus consultas, preguntas y solicitudes de cotización.</li>
            <li>Para comunicarnos contigo acerca de los servicios en los que has mostrado interés.</li>
            <li>Para mejorar la calidad de nuestros servicios y la experiencia en nuestro sitio web.</li>
          </ul>
          <p>
            Nunca venderemos, alquilaremos ni compartiremos tu información personal con terceros para fines de marketing sin tu consentimiento explícito.
          </p>
        </Section>
        
        <Section title="4. Seguridad de los Datos">
            <p>
                Tomamos medidas de seguridad razonables para proteger tu información contra el acceso no autorizado, la alteración, la divulgación o la destrucción. Sin embargo, ningún método de transmisión por Internet o de almacenamiento electrónico es 100% seguro.
            </p>
        </Section>

        <Section title="5. Tus Derechos (Habeas Data)">
            <p>
                De acuerdo con la legislación colombiana, tienes derecho a:
            </p>
            <ul>
                <li>Conocer, actualizar y rectificar tus datos personales.</li>
                <li>Solicitar prueba de la autorización otorgada para el tratamiento de tus datos.</li>
                <li>Ser informado sobre el uso que se le ha dado a tus datos personales.</li>
                <li>Presentar quejas ante la Superintendencia de Industria y Comercio por infracciones a la ley.</li>
                <li>Revocar la autorización y/o solicitar la supresión de tus datos.</li>
            </ul>
        </Section>
        
        <Section title="6. Cambios a esta Política">
            <p>
                Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos de cualquier cambio publicando la nueva política en esta página. Te recomendamos revisar esta página periódicamente para cualquier cambio.
            </p>
        </Section>

        <Section title="7. Contacto">
            <p>
                Si tienes alguna pregunta sobre esta Política de Privacidad o deseas ejercer tus derechos, puedes contactarnos a través de nuestro <a href="/contacto">formulario de contacto</a>.
            </p>
        </Section>
      </div>
    </div>
  );
}