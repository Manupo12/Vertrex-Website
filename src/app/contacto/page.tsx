'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

// Iconos
import { 
    HiOutlineEnvelope, 
    HiOutlinePhone, 
    HiMap, 
    HiArrowRight,
    HiOutlineCheckCircle,
    HiOutlineSparkles,
    HiOutlineQuestionMarkCircle
} from 'react-icons/hi2'
import { FaInstagram, FaTiktok, FaFacebookF } from 'react-icons/fa'

// Servicios (Sincronizados con la página de Servicios)
const servicesOptions = [
    "Sitios Web Corporativos",
    "Webs para Negocios Locales", // Restaurantes, gimnasios, etc.
    "Web Apps (PWA)",
    "Automatización & IA",
    "Apps Nativas Android",
    "Sistemas de Gestión (SaaS)"
];

export default function ContactoPage() {
  // Estado del formulario
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

    // Manejador de cambios
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

  // Selección de servicio
  const handleServiceSelect = (service: string) => {
    setFormState({ ...formState, service: service === formState.service ? '' : service });
  };

  // Simulación de envío
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    setIsSubmitting(true);
    
    // Simulación de API call
    setTimeout(() => {
        setIsSubmitting(false);
        setIsSent(true);
        // Resetear form
        setFormState({ name: '', email: '', phone: '', service: '', message: '' });
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-neutral-950 selection:bg-primary selection:text-background relative overflow-hidden">
      
      {/* Fondo Ambiental */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* Header */}
        <div className="text-center mb-16">
            <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-bold text-white font-display mb-6"
            >
                Hablemos de tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">Futuro</span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-lg text-neutral-400 max-w-2xl mx-auto"
            >
                Tienes la visión, nosotros la ingeniería. Cuéntanos sobre tu proyecto y construyamos algo extraordinario.
            </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            
            {/* --- COLUMNA IZQUIERDA: INFORMACIÓN & REDES --- */}
            <motion.div 
                initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="lg:col-span-5 flex flex-col justify-between h-full"
            >
                <div>
                    <h3 className="text-2xl font-bold text-white mb-8 border-l-4 border-primary pl-4">Información de Contacto</h3>
                    
                    <div className="space-y-8 mb-12">
                        <div className="flex items-start gap-4 group">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-primary group-hover:bg-primary group-hover:text-black transition-all">
                                <HiOutlineEnvelope size={24}/>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-500 font-bold uppercase tracking-wider mb-1">Email</p>
                                <a href="mailto:hola@vertrex.com" className="text-lg text-white hover:text-primary transition-colors">hola@vertrex.com</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 group">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-primary group-hover:bg-primary group-hover:text-black transition-all">
                                <HiOutlinePhone size={24}/>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-500 font-bold uppercase tracking-wider mb-1">Teléfono / WhatsApp</p>
                                <a href="https://wa.me/573000000000" target="_blank" className="text-lg text-white hover:text-primary transition-colors">+57 300 000 0000</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 group">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-primary group-hover:bg-primary group-hover:text-black transition-all">
                                <HiMap size={24}/>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-500 font-bold uppercase tracking-wider mb-1">Ubicación</p>
                                <p className="text-lg text-white">Neiva, Huila, Colombia</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Redes Sociales */}
                <div>
                    <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                        <HiOutlineSparkles className="text-primary"/> Síguenos en Redes
                    </h4>
                    <div className="flex gap-4">
                        <Link href="https://instagram.com" target="_blank" className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-white hover:bg-gradient-to-tr hover:from-purple-500 hover:to-orange-500 hover:border-transparent transition-all duration-300 shadow-lg group" title="Instagram">
                            <FaInstagram size={28} className="group-hover:scale-110 transition-transform"/>
                        </Link>
                        <Link href="https://tiktok.com" target="_blank" className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-white hover:bg-black hover:border-white/50 transition-all duration-300 shadow-lg group" title="TikTok">
                            <FaTiktok size={26} className="group-hover:scale-110 transition-transform"/>
                        </Link>
                        <Link href="https://facebook.com" target="_blank" className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-white hover:bg-blue-600 hover:border-transparent transition-all duration-300 shadow-lg group" title="Facebook">
                            <FaFacebookF size={26} className="group-hover:scale-110 transition-transform"/>
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* --- COLUMNA DERECHA: FORMULARIO INTERACTIVO --- */}
            <motion.div 
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                className="lg:col-span-7 bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden"
            >
                {isSent ? (
                    // ESTADO DE ÉXITO
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="h-full flex flex-col items-center justify-center text-center py-20"
                    >
                        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-6">
                            <HiOutlineCheckCircle size={48} />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">¡Mensaje Recibido!</h3>
                        <p className="text-neutral-400 max-w-md">
                            Gracias por contactarnos. Nuestro equipo de ingeniería revisará tu solicitud y te contactará en menos de 24 horas.
                        </p>
                        <button
                            onClick={() => setIsSent(false)}
                            className="mt-8 text-sm font-bold text-white underline hover:text-primary"
                        >
                            Enviar otro mensaje
                        </button>
                    </motion.div>
                ) : (
                    // FORMULARIO
                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider ml-1">Tu Nombre</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formState.name} onChange={handleChange} 
                                    placeholder="Ej: Juan Pérez"
                                    required
                                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-neutral-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider ml-1">Tu Email</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formState.email} onChange={handleChange} 
                                    placeholder="juan@empresa.com"
                                    required
                                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-neutral-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* SELECTOR DE SERVICIOS (CHIPS) */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">¿Qué estás buscando?</label>
                            </div>
                            
                            <div className="flex flex-wrap gap-3">
                                {servicesOptions.map((service) => (
                                    <button
                                        key={service}
                                        type="button"
                                        onClick={() => handleServiceSelect(service)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                                            formState.service === service 
                                            ? 'bg-primary text-black border-primary shadow-[0_0_15px_theme(colors.primary.DEFAULT)]' 
                                            : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        {service}
                                    </button>
                                ))}
                            </div>

                            {/* Link de Ayuda Solicitado */}
                            <div className="flex items-center gap-2 mt-2 ml-1">
                                <HiOutlineQuestionMarkCircle className="text-neutral-500 w-4 h-4"/>
                                <span className="text-xs text-neutral-500">
                                    ¿No sabes qué servicio pedir?{' '}
                                    <Link href="/servicios" className="text-primary hover:underline font-bold transition-all">
                                        Mira nuestros servicios
                                    </Link>
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider ml-1">Cuéntanos sobre el proyecto</label>
                            <textarea 
                                name="message" 
                                value={formState.message} onChange={handleChange} 
                                placeholder="Tengo una idea para una app que..."
                                rows={4}
                                required
                                className="w-full bg-neutral-950 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-neutral-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                            ></textarea>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-white text-black font-bold text-lg py-4 rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <span className="animate-pulse">Enviando...</span>
                                ) : (
                                    <>Enviar Solicitud <HiArrowRight/></>
                                )}
                            </button>
                            <p className="text-center text-neutral-500 text-xs mt-4">
                                Respondemos generalmente en menos de 24 horas.
                            </p>
                        </div>

                    </form>
                )}
            </motion.div>

        </div>
      </div>
    </main>
  )
}