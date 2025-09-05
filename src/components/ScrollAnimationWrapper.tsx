'use client'

import { motion } from 'framer-motion'

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

// ScrollAnimationWrapper
// Componente pequeño que envuelve cualquier contenido para aplicarle una animación
// de aparición al hacer scroll. Usar cuando quieras que un elemento entre con
// desvanecimiento y desplazamiento vertical desde abajo.
// Props:
// - children: nodo React que se animará.
// - className: clases CSS opcionales para el contenedor.
// - delay: retardo opcional (en segundos) antes de iniciar la animación.
export function ScrollAnimationWrapper({ children, className, delay = 0 }: Props) {
  return (
    <motion.div
      // Estado inicial: invisible y desplazado hacia abajo
      initial={{ opacity: 0, y: 40 }} 
      // Cuando el elemento entra en el viewport, animamos a visible y su posición
      whileInView={{ opacity: 1, y: 0 }}
      // Configuración del viewport: ejecutar una sola vez cuando el 25% sea visible
      viewport={{ once: true, amount: 0.25 }} 
      // Transición: duración fija y posible delay recibido por props
      transition={{ duration: 0.6, delay, ease: "easeOut" }} 
      className={className}
    >
      {children}
    </motion.div>
  )
}