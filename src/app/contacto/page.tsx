import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm' // Importamos nuestro componente de cliente que contiene el formulario

// Exportamos los metadatos desde el componente de servidor, como recomienda Next.js
export const metadata: Metadata = {
  title: 'Contacto | Vertrex',
  description: '¿Listo para empezar tu proyecto? Contáctanos para discutir tus ideas y obtener una cotización. Transformamos visiones en realidad digital.',
}

// Este es un componente de servidor simple que renderiza el componente de cliente
export default function ContactoPage() {
  return (
    <ContactForm />
  )
}