import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm' 

export const metadata: Metadata = {
  title: 'Contacto | Vertrex',
  description: '¿Listo para empezar tu proyecto? Contáctanos para discutir tus ideas y obtener una cotización. Transformamos visiones en realidad digital.',
}

export default function ContactoPage() {
  return (
    <ContactForm />
  )
}