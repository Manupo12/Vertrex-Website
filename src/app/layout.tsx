import type { Metadata } from 'next'
// Fuentes importadas desde Google Fonts (Next.js): Inter y Chakra Petch
import { Inter, Chakra_Petch } from 'next/font/google'
// Estilos globales del proyecto
import './globals.css'
// Componentes principales del layout
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton' 

// Configuración de las fuentes para poder usarlas como variables CSS
// `inter.variable` y `chakraPetch.variable` se inyectan en la clase del body
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})
const chakraPetch = Chakra_Petch({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-chakra-petch',
})

// Metadata global de la aplicación: título, descripción y viewport
// Next utiliza este objeto para rellenar <head> en el layout raíz
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

// RootLayout: componente que envuelve todas las páginas
// - Incluye Header y Footer persistentes
// - Aplica las variables de fuente en el <body>
// - Renderiza `children` dentro de <main>
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="h-full scroll-smooth">
      {/* Aplicamos las variables de fuente y clases globales en el body */}
      <body className={`${inter.variable} ${chakraPetch.variable} h-full flex flex-col bg-background font-sans text-foreground`}>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        {/* Botón flotante de WhatsApp (componente reutilizable) */}
        <WhatsAppButton /> 
      </body>
    </html>
  )
}