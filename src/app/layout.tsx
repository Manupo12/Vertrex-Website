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

export const metadata = {
  title: 'Vertrex | Ingenio Humano, Tecnología de Vanguardia',
  description: 'Fusionamos código experto, estrategia creativa y diseño minimalista.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.variable} ${chakraPetch.variable} h-full flex flex-col`}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppButton /> {/*  Se añade el botón aquí */}
      </body>
    </html>
  )
}