'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { HiXMark } from 'react-icons/hi2'

// --- Componente para el Botón de Menú Animado ---
const MenuButton = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => {
  return (
    <button
      type="button"
      className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground z-50"
      onClick={onClick}
      aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" className="stroke-current">
        <motion.path
          variants={{
            closed: { d: "M 2 6.5 L 22 6.5" },
            open: { d: "M 3 18 L 18 3" },
          }}
          initial="closed" animate={isOpen ? "open" : "closed"} transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <motion.path
          d="M 2 12.5 L 22 12.5"
          variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
          initial="closed" animate={isOpen ? "open" : "closed"} transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <motion.path
          variants={{
            closed: { d: "M 2 18.5 L 22 18.5" },
            open: { d: "M 3 3 L 18 18" },
          }}
          initial="closed" animate={isOpen ? "open" : "closed"} transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </svg>
    </button>
  );
};

// --- Componente Principal del Header ---
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  const links = [
    { href: '/servicios', label: 'Servicios' },
    { href: '/demos', label: 'Demos' },
    { href: '/portafolio', label: 'Portafolio' },
    { href: '/sobre-nosotros', label: 'Sobre Nosotros' },
    { href: '/contacto', label: 'Contacto' },
  ]

  const menuPanelVariants: Variants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
  }
  
  const menuContainerVariants: Variants = {
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
    hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
  };

  const menuItemVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 border-b border-primary/10 backdrop-blur-md bg-background/80">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5" aria-label="Inicio">
            <div className="flex items-center gap-x-3">
              <Image
                className="h-8 w-auto"
                src="/images/logo.png"
                alt="Logo de Vertrex"
                width={32}
                height={32}
                priority
              />
              <span className="font-display text-2xl font-bold tracking-wider text-primary hover:text-secondary transition-colors">
                VERTREX S.C.
              </span>
            </div>
          </Link>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          {links.map((link) => ( <Link key={link.href} href={link.href} className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"> {link.label} </Link> ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link href="/contacto" className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-background shadow-sm hover:bg-primary/80">
            Cotizar Proyecto
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <MenuButton isOpen={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div 
              className="fixed inset-y-0 right-0 z-50 w-full max-w-xs overflow-y-auto bg-background p-6 shadow-xl"
              variants={menuPanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center justify-between">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="-m-1.5 p-1.5" aria-label="Inicio">
                   <div className="flex items-center gap-x-3">
                      <Image className="h-8 w-auto" src="/images/logo-vertrex.svg" alt="Logo de Vertrex" width={32} height={32} />
                      <span className="font-display text-2xl font-bold tracking-wider text-primary">
                        VERTREX S.C.
                      </span>
                   </div>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-foreground transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Cerrar menú"
                >
                  <HiXMark className="h-6 w-6" />
                </button>
              </div>
              <motion.div
                className="mt-12 flow-root"
                variants={menuContainerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="-my-6 divide-y divide-gray-500/25">
                  <div className="space-y-2 py-6">
                    {links.map((link) => (
                      <motion.div key={link.href} variants={menuItemVariants}>
                        <Link href={link.href} onClick={() => setMobileMenuOpen(false)} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground transition-colors hover:bg-primary/10 hover:text-primary">{link.label}</Link>
                      </motion.div>
                    ))}
                  </div>
                  <div className="py-6">
                    <motion.div variants={menuItemVariants}>
                      <Link href="/contacto" onClick={() => setMobileMenuOpen(false)} className="-mx-3 block rounded-lg bg-primary/10 px-3 py-2.5 text-base font-semibold leading-7 text-primary transition-colors hover:bg-primary/20">Cotizar Proyecto</Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}