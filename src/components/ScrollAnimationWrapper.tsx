'use client'

import { motion } from 'framer-motion'

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollAnimationWrapper({ children, className, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }} 
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }} 
      transition={{ duration: 0.6, delay, ease: "easeOut" }} 
      className={className}
    >
      {children}
    </motion.div>
  )
}