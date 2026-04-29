import type { ReactNode } from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { WhatsAppButton } from '@/components/WhatsAppButton'

type MarketingChromeProps = {
  children: ReactNode
}

export function MarketingChrome({ children }: MarketingChromeProps) {
  return (
    <>
      <Header />
      <main className="flex-grow pb-12">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
