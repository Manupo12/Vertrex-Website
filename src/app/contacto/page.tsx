// Tipos de Next.js para metadata de la página
import type { Metadata } from 'next'
// Componente del formulario de contacto reutilizable
import ContactForm from '@/components/ContactForm' 

// Metadata que Next usa para <head> (título y descripción)
export const metadata: Metadata = {
  title: 'Contacto | Vertrex',
  description: '¿Listo para empezar tu proyecto? Contáctanos para discutir tus ideas y obtener una cotización. Transformamos visiones en realidad digital.',
}

// Página de contacto que renderiza el componente ContactForm
// Mantiene la responsabilidad simple: delegar la UI y la lógica al componente importado
export default function ContactoPage() {
  return (
    <ContactForm />
  )
}