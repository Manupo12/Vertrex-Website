'use client'

import type { ReactNode } from 'react'

import Providers from '@/components/providers'

type OperationalChromeProps = {
  children: ReactNode
}

export function OperationalChrome({ children }: OperationalChromeProps) {
  return (
    <div className="vertrex-os-theme flex min-h-full flex-1 flex-col bg-background font-sans text-foreground">
      <Providers>{children}</Providers>
    </div>
  )
}
