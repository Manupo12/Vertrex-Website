'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FaWhatsapp, FaInstagram, FaFacebookF, FaTiktok, FaArrowRight } from 'react-icons/fa' // Cambié FaFacebook por FaFacebookF para uniformidad
import { IoMail } from 'react-icons/io5'
import type { IconType } from 'react-icons'

// --- DATOS ---
const navigation = {
  main: [
    { name: 'Servicios', href: '/servicios' },
    { name: 'Demos', href: '/demos' },
    { name: 'Portafolio', href: '/portafolio' },
    { name: 'Sobre Nosotros', href: '/sobre-nosotros' },
  ],
  legal: [
    { name: 'Política de Privacidad', href: '/politica-de-privacidad' },
    { name: 'Términos de Servicio', href: '/terminos' }, // Agregado por simetría
  ],
}

const socialLinks: { name: string; href: string; icon: IconType }[] = [
  { name: 'WhatsApp', href: 'https://wa.me/573202070445', icon: FaWhatsapp },
  { name: 'Instagram', href: 'https://www.instagram.com/vertrexsc?igsh=MTZxa3VtMTB2ajJzMQ==', icon: FaInstagram },
  { name: 'Facebook', href: 'https://www.facebook.com/share/16zm37auix/', icon: FaFacebookF },
  { name: 'TikTok', href: 'https://www.tiktok.com/@vertrex.s.c?_t=ZS-8zG6DbhZHZV&_r=1', icon: FaTiktok },
  { name: 'Email', href: 'mailto:vertrexsc@gmail.com', icon: IoMail },
];

export function Footer() {
  return (
    <footer className="relative z-10 bg-gradient-to-t from-neutral-950 via-neutral-950/95 to-neutral-900 border-t border-white/10 shadow-2xl" aria-labelledby="footer-heading">
      
      {/* Fondo decorativo sutil (altura reducida para evitar espacios extras) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[220px] bg-primary/5 blur-[120px] pointer-events-none rounded-full"></div>

      <h2 id="footer-heading" className="sr-only">Footer</h2>
      
      <div className="mx-auto max-w-7xl px-6 py-4 sm:py-6 lg:px-8">
        
        {/* SECCIÓN SUPERIOR: BRANDING & CTA */}
          <div className="xl:grid xl:grid-cols-3 xl:gap-8 mb-8">
          
          {/* Columna 1: Marca y Misión */}
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="inline-block group" aria-label="Inicio">
              <div className="flex items-center gap-x-3">
                <div className="relative w-10 h-10 overflow-hidden rounded-lg bg-white/5 border border-white/10 p-1">
                    <Image
                        className="object-cover w-full h-full"
                        src="/images/logo.png"
                        alt="Logo Vertrex"
                        width={40}
                        height={40}
                    />
                </div>
                <span className="font-display text-2xl font-bold tracking-widest text-white group-hover:text-primary transition-colors">
                  VERTREX
                </span>
              </div>
            </Link>
            <p className="text-sm leading-6 text-neutral-400 max-w-xs">
              Ingeniería de software con propósito. Transformamos negocios en Neiva y Colombia con tecnología accesible y de alto impacto.
            </p>
            
            {/* Redes Sociales (Botones más grandes) */}
            <div className="flex gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/5 text-neutral-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1"
                    aria-label={item.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
          
          {/* Columna 2 y 3: Navegación y CTA Rápido */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            
            {/* Mapa del Sitio */}
            <div>
              <h3 className="text-sm font-bold leading-6 text-white uppercase tracking-wider">Explorar</h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.main.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm leading-6 text-neutral-400 hover:text-primary transition-colors flex items-center gap-2 group">
                      <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 opacity-0 group-hover:opacity-100 text-primary">
                        <FaArrowRight className="w-2 h-2"/>
                      </span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Integrado en Footer */}
            <div>
                <h3 className="text-sm font-bold leading-6 text-white uppercase tracking-wider">¿Listo para empezar?</h3>
                <p className="mt-6 text-sm text-neutral-400 mb-6">
                    No dejes tu idea en el papel. Hablemos hoy y hazla realidad.
                </p>
                <Link 
                    href="/contacto" 
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-black shadow-lg hover:bg-white transition-all w-full sm:w-auto"
                >
                    Cotizar Ahora
                </Link>
            </div>
          </div>
        </div>
        
        {/* SECCIÓN INFERIOR: LEGAL & COPYRIGHT */}
        <div className="mt-4 border-t border-white/10 pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs leading-5 text-neutral-500">
            &copy; {new Date().getFullYear()} Vertrex S.C. Todos los derechos reservados.
          </p>
          
          <div className="flex items-center gap-6">
             <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                📍 Hecho en Neiva, Huila
             </span>
             <div className="flex gap-4">
                {navigation.legal.map((item) => (
                    <Link key={item.name} href={item.href} className="text-xs text-neutral-500 hover:text-white transition-colors">
                        {item.name}
                    </Link>
                ))}
             </div>
          </div>
        </div>

      </div>
    </footer>
  )
}