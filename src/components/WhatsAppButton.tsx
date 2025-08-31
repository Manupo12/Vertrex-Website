'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function WhatsAppButton() {
  const phoneNumber = '573202070445';
  const message = 'Hola, estoy interesado en los servicios de Vertrex.';

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="bg-[#25D366] rounded-full p-4 shadow-lg flex items-center justify-center cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.456l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.655 4.398 1.803 6.166l-1.225 4.429 4.505-1.182z" />
          <path d="M15.246 14.232c-.134-.069-1.425-.7-1.648-.781-.222-.082-.383-.134-.544.135-.161.268-.622.781-.763.932-.142.151-.283.168-.525.082-.242-.084-.943-.349-1.8-.795-.668-.349-1.107-.781-1.248-1.03-.142-.248-.013-.383.118-.51.118-.117.264-.306.398-.456.134-.151.183-.248.264-.415.082-.167.042-.318-.042-.434-.084-.117-.544-1.306-.746-1.781-.192-.456-.394-.383-.544-.392-.134-.008-.283-.008-.433-.008-.151 0-.394.05-.595.248-.201.2-.763.748-.763 1.823 0 1.074.781 2.129.896 2.28.115.151 1.549 2.372 3.755 3.323.51.229.932.365 1.248.463.538.169 1.025.143 1.413.084.444-.069 1.425-.583 1.627-1.15.201-.566.201-1.049.134-1.15-.069-.101-.2-.151-.334-.219z" />
        </svg>
      </motion.div>
    </Link>
  )
}