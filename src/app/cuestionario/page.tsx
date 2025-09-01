'use client'

import { useState, useMemo, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUser, FaEnvelope, FaBuilding, FaCheckCircle, FaLink } from 'react-icons/fa'

// --- Componentes de UI ---

const ProgressBar = ({ current, total }: { current: number; total: number }) => (
  <div className="w-full bg-white/10 rounded-full h-2.5 mb-12">
    <motion.div
      className="bg-primary h-2.5 rounded-full"
      initial={{ width: '0%' }}
      animate={{ width: `${(current / total) * 100}%` }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    />
  </div>
);

const StepWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.5, type: 'spring' }}
  >
    {children}
  </motion.div>
);

const InputField = ({ icon, ...props }: { icon: ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            {icon}
        </div>
        <input {...props} className="block w-full rounded-md border-0 bg-white/5 py-3 pl-10 text-foreground ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary transition" />
    </div>
);


// --- Componente Principal del Cuestionario ---

export default function QuestionnairePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessName: '',
    projectType: '',
    ideaDescription: '',
    styleAdjectives: [] as string[],
    otherStyle: '',
    references: '',
    logo: null as File | null,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, logo: e.target.files![0] }));
    }
  };
  
  const handleAdjectiveToggle = (adjective: string) => {
    setFormData(prev => {
      const isSelected = prev.styleAdjectives.includes(adjective);
      let newAdjectives;

      if (isSelected) {
        newAdjectives = prev.styleAdjectives.filter(a => a !== adjective);
      } else {
        if (prev.styleAdjectives.length < 3) {
          newAdjectives = [...prev.styleAdjectives, adjective];
        } else {
          newAdjectives = prev.styleAdjectives;
        }
      }
      return { ...prev, styleAdjectives: newAdjectives };
    });
  };

  const isStepValid = useMemo(() => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== '' && formData.email.trim() !== '' && formData.businessName.trim() !== '';
      case 2:
        return formData.projectType.trim() !== '' && formData.ideaDescription.trim() !== '';
      case 3:
        if (formData.styleAdjectives.length === 0) return false;
        if (formData.styleAdjectives.includes('Otro') && formData.otherStyle.trim() === '') return false;
        return true;
      default:
        return true;
    }
  }, [formData, currentStep]);

  const nextStep = () => setCurrentStep(prev => prev < 4 ? prev + 1 : prev);
  const prevStep = () => setCurrentStep(prev => prev > 1 ? prev - 1 : prev);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentStep !== 4) return;
    setStatus('submitting');
    
    const submissionData = new FormData();
    submissionData.append('access_key', process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY!);
    submissionData.append('subject', `Nuevo Cuestionario de Proyecto: ${formData.businessName || formData.name}`);

    const finalAdjectives = formData.styleAdjectives.filter(adj => adj !== 'Otro');
    if (formData.styleAdjectives.includes('Otro') && formData.otherStyle.trim() !== '') {
        finalAdjectives.push(formData.otherStyle.trim());
    }
    submissionData.append('Estilos Seleccionados', finalAdjectives.join(', '));

    Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'styleAdjectives' && key !== 'otherStyle') {
             if (key === 'logo' && value) {
                submissionData.append(key, value as File);
            } else if (value && typeof value === 'string' && value.trim() !== '') {
                submissionData.append(key, value);
            }
        }
    });

    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: submissionData });
      const result = await res.json();
      if (result.success) setStatus('success'); else setStatus('error');
    } catch (error) {
  console.error('Error al enviar el cuestionario:', error);
  setStatus('error'); 
    }
  };

  if (status === 'success') {
    return (
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-32 pb-16 flex items-center justify-center text-center" style={{ minHeight: 'calc(100vh - 100px)'}}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <FaCheckCircle className="mx-auto h-16 w-16 text-primary" />
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-primary sm:text-4xl font-display">¡Cuestionario Enviado!</h2>
              <p className="mt-4 text-lg leading-8 text-foreground/80">Gracias por compartir tu visión. Hemos recibido toda la información y nos pondremos a trabajar en tu demo. Te contactaremos pronto.</p>
            </motion.div>
        </div>
    );
  }

  const adjectiveOptions = ['Moderno', 'Elegante', 'Minimalista', 'Divertido', 'Serio', 'Tecnológico', 'Otro'];

  return (
    <div className="mx-auto max-w-2xl px-6 lg:px-8 pt-28 pb-24 sm:pt-32">
      <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl font-display text-center">Cuestionario de Proyecto</h1>
      <p className="mt-4 text-center text-foreground/80">Completa estos 4 pasos para que podamos entender tu visión y preparar tu demo gratuita.</p>

      <div className="mt-12">
        <ProgressBar current={currentStep} total={4} />
        <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <StepWrapper key={1}>
                <h2 className="text-xl font-semibold font-display text-secondary mb-6">Paso 1: Sobre ti</h2>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">Tu Nombre</label>
                        <InputField icon={<FaUser className="h-4 w-4 text-foreground/40"/>} type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Ej: Juan Pérez" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">Tu Email</label>
                        <InputField icon={<FaEnvelope className="h-4 w-4 text-foreground/40"/>} type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="juan.perez@email.com" />
                    </div>
                    <div>
                        <label htmlFor="businessName" className="block text-sm font-semibold text-foreground mb-2">Nombre de tu Negocio/Proyecto</label>
                        <InputField icon={<FaBuilding className="h-4 w-4 text-foreground/40"/>} type="text" id="businessName" name="businessName" value={formData.businessName} onChange={handleChange} required placeholder="Ej: Cafetería El Aroma" />
                    </div>
                </div>
              </StepWrapper>
            )}

            {currentStep === 2 && (
              <StepWrapper key={2}>
                  <h2 className="text-xl font-semibold font-display text-secondary mb-6">Paso 2: Sobre tu Proyecto</h2>
                  <div className="space-y-6">
                      <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">¿Qué tipo de proyecto necesitas?</label>
                          <select name="projectType" value={formData.projectType} onChange={handleChange} required className="block w-full rounded-md border-0 bg-white/5 p-3 text-foreground ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary">
                              <option value="" disabled className="bg-background text-foreground/50">Selecciona una opción...</option>
                              <option value="Pagina Web" className="bg-background text-foreground">Página Web</option>
                              <option value="App Movil" className="bg-background text-foreground">App Móvil (Android)</option>
                              <option value="E-commerce" className="bg-background text-foreground">Tienda en Línea (E-commerce)</option>
                              <option value="Otro" className="bg-background text-foreground">Otro</option>
                          </select>
                      </div>
                      <div>
                          <label htmlFor="ideaDescription" className="block text-sm font-semibold text-foreground mb-2">Cuéntanos tu idea principal</label>
                          <textarea id="ideaDescription" name="ideaDescription" value={formData.ideaDescription} onChange={handleChange} rows={5} required placeholder="Describe el propósito de tu proyecto, a quién va dirigido y qué problema resuelve." className="block w-full rounded-md border-0 bg-white/5 p-3 text-foreground ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary" />
                      </div>
                  </div>
              </StepWrapper>
            )}

            {currentStep === 3 && (
               <StepWrapper key={3}>
                    <h2 className="text-xl font-semibold font-display text-secondary mb-6">Paso 3: Estilo y Referencias</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-3">¿Qué palabras describen el estilo que buscas? (elige hasta 3)</label>
                            <div className="flex flex-wrap gap-2">
                                {adjectiveOptions.map(adj => (
                                    <button key={adj} type="button" onClick={() => handleAdjectiveToggle(adj)} disabled={!formData.styleAdjectives.includes(adj) && formData.styleAdjectives.length >= 3} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${formData.styleAdjectives.includes(adj) ? 'bg-primary text-background' : 'bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed'}`}>{adj}</button>
                                ))}
                            </div>
                        </div>
                        <AnimatePresence>
                        {formData.styleAdjectives.includes('Otro') && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                <label htmlFor="otherStyle" className="block text-sm font-semibold text-foreground mb-2">Por favor, especifica el otro estilo</label>
                                <input type="text" id="otherStyle" name="otherStyle" value={formData.otherStyle} onChange={handleChange} required={formData.styleAdjectives.includes('Otro')} className="block w-full rounded-md border-0 bg-white/5 p-3 text-foreground ring-1 ring-inset ring-white/10 focus:ring-primary" />
                            </motion.div>
                        )}
                        </AnimatePresence>
                        <div>
                            <label htmlFor="references" className="block text-sm font-semibold text-foreground mb-2">Añade enlaces de referencia (Opcional)</label>
                            <InputField icon={<FaLink className="h-4 w-4 text-foreground/40"/>} type="text" id="references" name="references" value={formData.references} onChange={handleChange} placeholder="https://instagram.com/tu_negocio" />
                        </div>
                        <div>
                            <label htmlFor="logo" className="block text-sm font-semibold text-foreground">Sube el logo de tu empresa (Opcional)</label>
                            <input type="file" id="logo" name="logo" onChange={handleFileChange} className="mt-2 block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"/>
                            {formData.logo && <p className="mt-2 text-xs text-foreground/60">Archivo seleccionado: <span className="font-medium text-primary">{formData.logo.name}</span></p>}
                        </div>
                    </div>
                </StepWrapper>
            )}

            {currentStep === 4 && (
                <StepWrapper key={4}>
                     <h2 className="text-xl font-semibold font-display text-secondary mb-6">Paso 4: Revisa y Envía</h2>
                     <dl className="space-y-4 text-sm bg-white/5 p-6 rounded-lg border border-white/10 divide-y divide-white/10">
                        <div className="flex justify-between pt-2 first:pt-0"><dt className="font-semibold text-primary pr-2">Nombre:</dt><dd className="text-right truncate">{formData.name}</dd></div>
                        <div className="flex justify-between pt-2"><dt className="font-semibold text-primary pr-2">Email:</dt><dd className="text-right truncate">{formData.email}</dd></div>
                        <div className="flex justify-between pt-2"><dt className="font-semibold text-primary pr-2">Negocio:</dt><dd className="text-right truncate">{formData.businessName}</dd></div>
                        <div className="flex justify-between pt-2"><dt className="font-semibold text-primary pr-2">Tipo:</dt><dd className="text-right truncate">{formData.projectType}</dd></div>
                        <div className="flex justify-between pt-2"><dt className="font-semibold text-primary pr-2">Estilo:</dt><dd className="text-right truncate">{(() => {
                          const adjectives = formData.styleAdjectives.filter(a => a !== 'Otro').join(', ');
                          const other = formData.otherStyle ? `, ${formData.otherStyle}` : '';
                          const result = `${adjectives}${other}`.trim();
                          return result ? result : 'N/A';
                        })()}</dd></div>
                        <div className="flex justify-between pt-2"><dt className="font-semibold text-primary pr-2">Logo:</dt><dd className="text-right truncate">{formData.logo?.name || 'No adjuntado'}</dd></div>
                     </dl>
                     {status === 'error' && <p className="mt-4 text-center text-red-400">Hubo un error. Por favor, vuelve atrás y revisa tus datos.</p>}
                </StepWrapper>
            )}
        </AnimatePresence>

            <div className="mt-12 flex justify-between items-center">
              <button type="button" onClick={prevStep} disabled={currentStep === 1} className="rounded-md px-4 py-2 text-sm font-semibold text-foreground/80 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Anterior</button>
              {currentStep < 4 && <button type="button" onClick={nextStep} disabled={!isStepValid} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-background shadow-sm hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Siguiente</button>}
              {currentStep === 4 && <button type="submit" disabled={status === 'submitting'} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-background shadow-sm hover:bg-primary/80 disabled:opacity-50 transition-colors">{status === 'submitting' ? 'Enviando...' : 'Confirmar y Enviar'}</button>}
            </div>
        </form>
      </div>
    </div>
  );
}