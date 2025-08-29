'use client'

import Link from 'next/link'
import { FaWhatsapp, FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa'
import { IoMail } from 'react-icons/io5'
import type { IconType } from 'react-icons'

const navigation = {
  solutions: [
    { name: 'Servicios', href: '/servicios' },
    { name: 'Portafolio', href: '/portafolio' },
  ],
  company: [
    { name: 'Sobre Nosotros', href: '/sobre-nosotros' },
    { name: 'Contacto', href: '/contacto' },
    { name: 'Política de Privacidad', href: '/politica-de-privacidad' },
  ],
}

const socialLinks: { name: string; href: string; icon: IconType }[] = [
  { name: 'WhatsApp', href: 'https://wa.me/573202070445', icon: FaWhatsapp },
  { name: 'Instagram', href: 'https://www.instagram.com/vertrexsc?igsh=MTZxa3VtMTB2ajJzMQ==', icon: FaInstagram },
  { name: 'Facebook', href: 'https://www.facebook.com/share/16zm37auix/', icon: FaFacebook },
  { name: 'TikTok', href: 'https://www.tiktok.com/@vertrex.s.c?_t=ZS-8zG6DbhZHZV&_r=1', icon: FaTiktok },
  { name: 'Email', href: 'mailto:vertrexsc@gmail.com', icon: IoMail },
];

export function Footer() {
  return (
    <footer className="bg-background border-t border-primary/10" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-4">
            <Link href="/" className="font-display text-2xl font-bold tracking-wider text-primary">
              VERTREX S.C.
            </Link>
            <p className="text-sm leading-6 text-foreground/70">
              Soluciones digitales que te entienden. Creamos la tecnología que tu negocio en Neiva necesita para crecer, a un precio justo.
            </p>
            <div className="flex space-x-6 pt-2">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/60 transition-colors hover:text-primary"
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-foreground">Soluciones</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.solutions.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-foreground/60 hover:text-primary">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-foreground">Compañía</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-foreground/60 hover:text-primary">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-foreground/50">&copy; 2025 Vertrex S.C. Todos los derechos reservados. Hecho en Neiva, Huila.</p>
        </div>
      </div>
    </footer>
  )
}