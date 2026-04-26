'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

import Providers from '@os/components/providers'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { WhatsAppButton } from '@/components/WhatsAppButton'

type AppChromeProps = {
  children: ReactNode
}

function isOperationalPath(pathname: string) {
  return pathname === '/login' || pathname.startsWith('/os') || pathname.startsWith('/portal')
}

export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname() ?? '/'

  if (isOperationalPath(pathname)) {
    return (
      <div className="vertrex-os-theme flex min-h-full flex-1 flex-col bg-background font-sans text-foreground">
        <Providers>{children}</Providers>
      </div>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-grow pb-12">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
