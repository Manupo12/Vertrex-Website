import type { Metadata } from 'next'
import { Inter, Chakra_Petch } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton' 

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})
const chakraPetch = Chakra_Petch({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-chakra-petch',
})

export const metadata: Metadata = {
  title: 'Vertrex | Soluciones Digitales que te Entienden',
  description: 'Desarrollo de páginas web, apps para Android y marketing digital en Neiva. Obtén una demo gratuita de tu proyecto. Calidad profesional a precios justos.',
  themeColor: '#0A0A0A',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1, 
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="h-full scroll-smooth">
      <body className={`${inter.variable} ${chakraPetch.variable} h-full flex flex-col bg-background font-sans text-foreground`}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppButton /> 
      </body>
    </html>
  )
}