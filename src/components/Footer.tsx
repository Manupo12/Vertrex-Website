import Link from 'next/link'
import { FaWhatsapp, FaLinkedin, FaGithub } from 'react-icons/fa'
import { IoMail } from 'react-icons/io5'

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

const socialLinks = [
  { 
    name: 'WhatsApp', 
    href: 'https://wa.me/573202070445', 
    icon: <FaWhatsapp size={24} /> 
  },
  { 
    name: 'LinkedIn', 
    href: 'https://www.linkedin.com/in/villanueva-kotlin', 
    icon: <FaLinkedin size={24} /> 
  },
  { 
    name: 'GitHub', 
    href: 'https://github.com/Manupo12', 
    icon: <FaGithub size={24} /> 
  },
  { 
    name: 'Email', 
    href: 'mailto:vertrexsc@gmail.com', 
    icon: <IoMail size={24} /> 
  },
];


export function Footer() {
  return (
    <footer className="bg-background border-t border-primary/10" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Logo y lema */}
          <div className="space-y-4">
            <Link href="/" className="font-display text-2xl font-bold tracking-wider text-primary">
              VERTREX
            </Link>
            <p className="text-sm leading-6 text-foreground/70">
              Fusionando ingenio humano y tecnología de vanguardia para crear soluciones digitales excepcionales.
            </p>
            {/*  Mapeo el array de socialLinks para generar los íconos dinámicamente */}
            <div className="flex space-x-6 pt-2">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/60 hover:text-primary transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
          {/* Links de navegación */}
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
        {/* Copyright */}
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-foreground/50">&copy; 2025 Vertrex. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}