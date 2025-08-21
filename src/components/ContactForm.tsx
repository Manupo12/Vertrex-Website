'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCheckCircle } from 'react-icons/fa'

// --- Componente Reutilizable para los Campos del Formulario ---
interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  isTextArea?: boolean;
  isSelect?: boolean;
  options?: string[];
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({ id, label, type = 'text', name, value, onChange, required = false, isTextArea = false, isSelect = false, options = [], className = '' }) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    className={className}
  >
    <label htmlFor={id} className="block text-sm font-semibold leading-6 text-foreground">
      {label}
    </label>
    <div className="mt-2.5">
      {isTextArea ? (
        <textarea id={id} name={name} value={value} onChange={onChange} required={required} rows={4} className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-foreground shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition" />
      ) : isSelect ? (
        <select id={id} name={name} value={value} onChange={onChange} required={required} className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-foreground shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition">
          <option value="" disabled>Selecciona un servicio...</option>
          {options.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : (
        <input type={type} id={id} name={name} value={value} onChange={onChange} required={required} className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-foreground shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition" />
      )}
    </div>
  </motion.div>
);

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    
    const data = {
      ...formData,
      access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
      subject: `Nuevo Mensaje de ${formData.name} - Interesado en ${formData.service}`,
    };

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setStatus('success');
      } else {
        console.error('Error Response:', result);
        setStatus('error');
      }
    } catch (error) {
      console.error('Submit Error:', error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-32 pb-16 flex items-center justify-center text-center" style={{ minHeight: 'calc(100vh - 100px)'}}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <FaCheckCircle className="mx-auto h-16 w-16 text-primary" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-primary sm:text-4xl font-display">¡Mensaje Enviado!</h2>
          <p className="mt-4 text-lg leading-8 text-foreground/80">Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos a la brevedad.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="mx-auto max-w-7xl px-6 lg:px-8 pt-32 pb-24">
      <div className="mx-auto max-w-2xl text-center">
        <motion.h1 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-4xl font-bold tracking-tight text-primary sm:text-6xl font-display">
          Hablemos de tu Proyecto
        </motion.h1>
        <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="mt-6 text-lg leading-8 text-foreground/80">
          Estamos listos para transformar tu idea en una realidad digital. Completa el formulario y empecemos a construir el futuro.
        </motion.p>
      </div>

      <motion.form onSubmit={handleSubmit} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } } }} className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <FormField id="name" label="Nombre Completo" name="name" value={formData.name} onChange={handleChange} required className="sm:col-span-1" />
          <FormField id="email" label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required className="sm:col-span-1" />
          <FormField
            id="service"
            label="Servicio de Interés"
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            isSelect
            options={[ 'Desarrollo de Software', 'Marketing Digital', 'Productos Vertrex', 'Servicios Físicos', 'Otro' ]}
            className="sm:col-span-2"
          />
          <FormField id="message" label="¿Cómo podemos ayudarte?" name="message" value={formData.message} onChange={handleChange} required isTextArea className="sm:col-span-2" />
        </div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="mt-10">
          <button type="submit" disabled={status === 'submitting'} className="block w-full rounded-md bg-primary px-3.5 py-2.5 text-center text-sm font-semibold text-background shadow-sm hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[0_0_20px_theme(colors.primary.DEFAULT)]">
            {status === 'submitting' ? 'Enviando...' : 'Enviar Mensaje'}
          </button>
        </motion.div>
        {status === 'error' && (
          <p className="mt-4 text-center text-red-400">Hubo un error al enviar el mensaje. Por favor, revisa tus datos o inténtalo de nuevo más tarde.</p>
        )}
      </motion.form>
    </motion.div>
  );
}