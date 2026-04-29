'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

import { MarketingChrome } from '@/components/chrome/MarketingChrome'
import { OperationalChrome } from '@/components/chrome/OperationalChrome'

type AppChromeProps = {
  children: ReactNode
}

function isOperationalPath(pathname: string) {
  return pathname === '/login' || pathname.startsWith('/os') || pathname.startsWith('/portal')
}

export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname() ?? '/'

  if (isOperationalPath(pathname)) {
    return <OperationalChrome>{children}</OperationalChrome>
  }

  return <MarketingChrome>{children}</MarketingChrome>
}
