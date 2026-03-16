// --- 4. PLANTILLAS DE NEGOCIO (CATÁLOGO EXPANDIDO - REDISEÑO FULL PAGE) ---
const TemplatesShowcase = ({ templatesData: passedTemplates }: { templatesData?: any[] } = {}) => {
    const templates = (passedTemplates && passedTemplates.length) ? passedTemplates : templatesData;
    if (!templates || templates.length === 0) return null;

    const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
    const [view, setView] = useState<'desktop' | 'mobile'>('desktop');

    return (
        <section className="py-24 lg:py-32 bg-neutral-950 relative border-t border-white/5">
            {/* Fondo Técnico Expandido */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,black,transparent)] pointer-events-none"></div>

            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* HEADER DE LA SECCIÓN */}
                <div className="mb-16 text-center lg:text-left max-w-3xl">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 inline-block bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Acelera tu Negocio</span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white tracking-tight mb-6">
                        Catálogo de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Software</span>
                    </h2>
                    <p className="text-neutral-400 text-lg md:text-xl leading-relaxed">
                        Arquitecturas pre-construidas y probadas en entornos operativos reales. Despliega hoy una solución a la medida de tu industria.
                    </p>
                </div>

                {/* LAYOUT STICKY SIDEBAR + CONTENIDO FLUIDO */}
                <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
                    
                    {/* --- LADO IZQUIERDO: MENÚ STICKY --- */}
                    <div className="w-full lg:w-[350px] shrink-0 lg:sticky lg:top-32 flex flex-col gap-3 z-20">
                        {templates.map((template) => {
                            const isActive = selectedTemplate.id === template.id;
                            return (
                                <button
                                    key={template.id}
                                    onClick={() => {
                                        setSelectedTemplate(template);
                                        setView('desktop');
                                    }}
                                    className={`group text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden
                                        ${isActive 
                                            ? 'bg-neutral-900 border-primary/40 shadow-[0_0_30px_rgba(0,255,127,0.1)] -translate-y-1' 
                                            : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/20'
                                        }
                                    `}
                                >
                                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-emerald-500"></div>}
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${isActive ? 'text-primary' : 'text-neutral-500'}`}>
                                                {template.category}
                                            </p>
                                            <h4 className={`font-bold text-xl leading-tight ${isActive ? 'text-white' : 'text-neutral-300 group-hover:text-white'}`}>
                                                {template.title}
                                            </h4>
                                        </div>
                                        <div className={`p-2.5 rounded-full transition-colors ${isActive ? 'bg-primary text-black shadow-lg' : 'bg-white/5 text-neutral-500 group-hover:bg-white/10 group-hover:text-white'}`}>
                                            <HiArrowRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-1' : ''}`}/>
                                        </div>
                                    </div>
                                    <p className={`text-sm leading-relaxed ${isActive ? 'text-neutral-300' : 'text-neutral-500 line-clamp-2'}`}>
                                        {template.shortDescription}
                                    </p>
                                </button>
                            )
                        })}
                    </div>

                    {/* --- LADO DERECHO: CONTENIDO EXPANDIDO SIN LÍMITE DE ALTURA --- */}
                    <div className="w-full flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedTemplate.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="flex flex-col gap-10"
                            >
                                {/* HEADER DE LA PLANTILLA */}
                                <div>
                                    <div className="flex flex-wrap items-end justify-between gap-6 mb-6">
                                        <div>
                                            <h3 className="text-4xl md:text-5xl font-bold text-white font-display tracking-tight mb-3">
                                                {selectedTemplate.title}
                                            </h3>
                                            <p className="text-xl text-primary font-medium">{selectedTemplate.subtitle}</p>
                                        </div>
                                        
                                        {/* Metadatos Técnicos */}
                                        {selectedTemplate.meta && (
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="px-4 py-1.5 bg-white/5 border border-white/10 text-neutral-400 text-xs font-bold font-mono rounded-full flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    {selectedTemplate.meta.status.replace('-', ' ')}
                                                </span>
                                                <span className="px-4 py-1.5 bg-white/5 text-neutral-400 border border-white/10 text-xs font-bold font-mono rounded-full">
                                                    v{selectedTemplate.meta.version}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-neutral-300 text-lg leading-relaxed max-w-4xl">
                                        {selectedTemplate.description}
                                    </p>
                                    
                                    {/* Notas Críticas */}
                                    {selectedTemplate.notes && (
                                        <div className="mt-8 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-4 items-start relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                                            <div className="mt-1 w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0"></div>
                                            <p className="text-sm text-amber-100/90 leading-relaxed">
                                                <strong className="text-amber-400 font-bold block mb-1 tracking-wider uppercase text-xs">A tener en cuenta</strong> 
                                                {selectedTemplate.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* VISUALIZADOR MULTIMEDIA GIGANTE */}
                                <div className="relative w-full rounded-[2.5rem] bg-neutral-900 border border-white/10 py-12 px-4 md:px-12 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
                                    {/* Resplandor de fondo */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none"></div>

                                    {/* Controles de Vista */}
                                    <div className="absolute top-6 right-6 z-30 flex gap-2 bg-black/60 backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-xl">
                                        <button onClick={() => setView('desktop')} className={`p-3 rounded-full transition-all ${view === 'desktop' ? 'bg-white text-black scale-105' : 'text-white/50 hover:text-white hover:bg-white/10'}`}>
                                            <HiOutlineComputerDesktop size={20} />
                                        </button>
                                        <button onClick={() => setView('mobile')} className={`p-3 rounded-full transition-all ${view === 'mobile' ? 'bg-white text-black scale-105' : 'text-white/50 hover:text-white hover:bg-white/10'}`}>
                                            <HiOutlineDevicePhoneMobile size={20} />
                                        </button>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        <motion.div 
                                            key={view}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.4 }}
                                            className="w-full flex justify-center relative z-10"
                                        >
                                            {view === 'desktop' ? (
                                                <div className="w-full max-w-5xl aspect-video bg-black rounded-xl md:rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
                                                    <div className="h-8 bg-neutral-900 border-b border-white/5 flex items-center px-4 gap-2 absolute top-0 w-full z-10">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                                                        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                                                        <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
                                                        <div className="ml-4 h-4 w-64 bg-white/5 rounded-full hidden sm:block"></div>
                                                    </div>
                                                    <div className="w-full h-full bg-cover bg-top pt-8" style={{ backgroundImage: `url('${selectedTemplate.images.desktop}')` }}></div>
                                                </div>
                                            ) : (
                                                <div className="relative w-[280px] sm:w-[320px] aspect-[9/19] bg-black rounded-[3rem] border-[8px] border-neutral-800 shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden">
                                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-neutral-900 rounded-b-2xl z-20"></div>
                                                    <div className="w-full h-full bg-cover bg-top" style={{ backgroundImage: `url('${selectedTemplate.images.mobile}')` }}></div>
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* CARACTERÍSTICAS TÉCNICAS (GRILLA MÁS AMPLIA) */}
                                <div>
                                    <h4 className="text-white font-bold mb-8 text-sm uppercase tracking-widest flex items-center gap-4">
                                        <span className="w-8 h-px bg-primary"></span> Arquitectura y Módulos
                                    </h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                        {selectedTemplate.features.map((feature: any, idx: number) => (
                                            <div key={idx} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl hover:bg-white/5 hover:border-white/10 transition-all duration-300 flex flex-col gap-4 group">
                                                <div className={`text-3xl ${selectedTemplate.accent} p-3 bg-white/5 rounded-xl w-fit group-hover:scale-110 transition-transform`}>
                                                    {feature.icon}
                                                </div>
                                                <div>
                                                    <h5 className="text-white font-bold text-base mb-2">{feature.title}</h5>
                                                    <p className="text-neutral-400 text-sm leading-relaxed">{feature.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* FOOTER DE LA PLANTILLA: TAGS Y CTA */}
                                <div className="mt-6 flex flex-wrap items-center justify-between gap-6 p-8 bg-neutral-900/50 rounded-3xl border border-white/5">
                                    <div className="flex flex-wrap gap-2 flex-1">
                                        {selectedTemplate.tags.map((tag: string) => (
                                            <span key={tag} className="px-3 py-1.5 bg-black/50 border border-white/5 text-neutral-300 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <Link href={selectedTemplate.link} target="_blank" className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-sm hover:bg-primary hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] whitespace-nowrap">
                                        {selectedTemplate.buttonText} <FaExternalLinkAlt size={14} />
                                    </Link>
                                </div>
                                
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};


// --- 6. DEMOS / LABORATORIO DE CONCEPTOS (CON SELECTOR DE VARIANTES) ---
// --- 6. DEMOS / LABORATORIO DE CONCEPTOS (CONTEXTO EXPANDIDO Y STICKY VIDEO) ---
const LabShowcase = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [view, setView] = useState<'desktop' | 'mobile'>('desktop');
    const [activeVariantIndex, setActiveVariantIndex] = useState(0); 
    
    if (!demos || demos.length === 0) return null;

    const nextDemo = () => { 
        setCurrentIndex((prev) => (prev + 1) % demos.length); 
        setView('desktop'); 
        setActiveVariantIndex(0); 
    };
    const prevDemo = () => { 
        setCurrentIndex((prev) => (prev - 1 + demos.length) % demos.length); 
        setView('desktop'); 
        setActiveVariantIndex(0); 
    };
    
    const demo = demos[currentIndex];
    const variant = demo.variants[activeVariantIndex]; 

    return (
        <section className="py-24 bg-neutral-950 relative border-t border-white/5">
            {/* Brillo ambiental */}
            <div className="absolute right-0 top-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* HEADER Y NAVEGACIÓN GLOBAL */}
                <div className="mb-16 flex flex-col md:flex-row items-end justify-between gap-6 border-b border-white/5 pb-8">
                    <div className="max-w-3xl">
                        <span className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs mb-3">
                            <HiOutlineLightBulb className="w-4 h-4 animate-pulse" /> Laboratorio de Conceptos
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white tracking-tight">Visiones de Futuro</h2>
                        <p className="mt-4 text-neutral-400 text-lg">
                            Prototipos interactivos y arquitecturas de negocio diseñadas proactivamente. Descubre el potencial oculto de tu marca.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-6 bg-black/40 p-2 rounded-full border border-white/10">
                        <span className="text-sm font-mono text-neutral-500 font-bold pl-4">
                            <span className="text-white">{String(currentIndex + 1).padStart(2, '0')}</span> / {String(demos.length).padStart(2, '0')}
                        </span>
                        <div className="flex gap-1">
                            <button onClick={prevDemo} className="p-3 rounded-full hover:bg-white/10 transition-all text-white"><HiChevronLeft size={20} /></button>
                            <button onClick={nextDemo} className="p-3 rounded-full hover:bg-white/10 transition-all text-white"><HiChevronRight size={20} /></button>
                        </div>
                    </div>
                </div>

                {/* LAYOUT PRINCIPAL: TEXTO SCROLL (IZQ) + VIDEO STICKY (DER) */}
                <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16 relative">
                    
                    {/* --- COLUMNA IZQUIERDA: INFORMACIÓN A DETALLE --- */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-10">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={currentIndex} 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                exit={{ opacity: 0, y: -20 }} 
                                transition={{ duration: 0.4 }}
                                className="flex flex-col gap-10"
                            >
                                {/* 1. TÍTULO Y CONTEXTO DEL NEGOCIO */}
                                <div>
                                    <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-4">
                                        {demo.businessType}
                                    </div>
                                    <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-display leading-tight">{demo.businessName}</h3>
                                    <p className="text-lg leading-relaxed text-neutral-300">
                                        {demo.businessDescription}
                                    </p>
                                </div>

                                {/* 2. LA SOLUCIÓN VERTREX */}
                                <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 border-l-2 border-l-primary p-6 lg:p-8 rounded-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                    <div className="relative z-10">
                                        <strong className="text-primary flex items-center gap-2 mb-3 uppercase tracking-widest text-xs font-bold">
                                            <HiOutlineSparkles className="w-4 h-4"/> El Concepto Vertrex
                                        </strong>
                                        <p className="text-base leading-relaxed text-neutral-300 mb-4">
                                            {demo.vertrexConcept}
                                        </p>
                                        <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">
                                            * Prototipo proactivo diseñado para @{demo.businessName.replace(/\s+/g, '').toLowerCase()}.
                                        </p>
                                    </div>
                                </div>

                                {/* 3. SELECTOR DE VARIANTES Y SU DESCRIPCIÓN */}
                                {demo.variants.length > 0 && (
                                    <div className="bg-black/30 p-6 rounded-2xl border border-white/5">
                                        <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-4">Módulos del Sistema:</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {demo.variants.map((v: any, idx: number) => (
                                                <button
                                                    key={v.label}
                                                    onClick={() => setActiveVariantIndex(idx)}
                                                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                                                        activeVariantIndex === idx
                                                        ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(0,255,127,0.2)]'
                                                        : 'bg-white/5 text-neutral-400 border-white/5 hover:border-white/20 hover:text-white hover:bg-white/10'
                                                    }`}
                                                >
                                                    {activeVariantIndex === idx && <HiOutlinePlay className="w-3 h-3"/>}
                                                    {v.label}
                                                </button>
                                            ))}
                                        </div>
                                        {/* Descripción específica de la variante (si existe) */}
                                        {variant.description && (
                                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                                <p className="text-sm text-neutral-300 leading-relaxed">
                                                    <strong className="text-white font-bold mr-1">Viendo ahora:</strong> 
                                                    {variant.description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* 4. DESGLOSE DE VALOR (Beneficios, Vistas) */}
                                <div className="flex flex-col gap-6">
                                    {/* Beneficios Clave */}
                                    {demo.keyBenefits && demo.keyBenefits.length > 0 && (
                                        <div>
                                            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest flex items-center gap-3">
                                                <span className="w-6 h-px bg-primary"></span> Beneficios Clave
                                            </h4>
                                            <ul className="flex flex-col gap-3">
                                                {demo.keyBenefits.map((item: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-3 text-sm text-neutral-400 leading-relaxed">
                                                        <HiOutlineSparkles className="text-primary mt-1 shrink-0 w-4 h-4" /> {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                                        {/* Lo que ve el cliente */}
                                        {demo.whatClientsSee && demo.whatClientsSee.length > 0 && (
                                            <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                                                <h5 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                                                    <HiOutlineDevicePhoneMobile className="text-primary w-4 h-4"/> Experiencia del Cliente
                                                </h5>
                                                <ul className="flex flex-col gap-3">
                                                    {demo.whatClientsSee.map((item: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2 text-xs text-neutral-400 leading-relaxed">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 shrink-0"></div> {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Lo que gestiona el administrador */}
                                        {demo.whatPartnersManage && demo.whatPartnersManage.length > 0 && (
                                            <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                                                <h5 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                                                    <HiOutlineComputerDesktop className="text-primary w-4 h-4"/> Panel Administrativo
                                                </h5>
                                                <ul className="flex flex-col gap-3">
                                                    {demo.whatPartnersManage.map((item: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2 text-xs text-neutral-400 leading-relaxed">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5 shrink-0"></div> {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 5. CTA Y REDES SOCIALES */}
                                <div className="flex flex-col gap-6 border-t border-white/10 pt-8 mt-4">
                                    <div className="flex flex-wrap gap-4">
                                        <Link href="/contacto" className="bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-primary hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                            Reclamar este Sistema <HiArrowRight />
                                        </Link>
                                    </div>
                                    <div className="flex items-center gap-4 text-neutral-500 text-sm">
                                        <span className="text-xs uppercase tracking-widest font-bold opacity-70">Conectar:</span>
                                        <div className="flex flex-wrap gap-4">
                                            <a href={demo.socials?.instagram || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary cursor-pointer transition-colors"><FaInstagram /> @{demo.businessName.replace(/\s+/g, '').toLowerCase()}</a>
                                            <a href={demo.socials?.website || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary cursor-pointer transition-colors"><FaGlobe /> Website</a>
                                        </div>
                                    </div>
                                </div>
                                
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* --- COLUMNA DERECHA: VISUALIZADOR MULTIMEDIA STICKY --- */}
                    <div className="w-full lg:w-1/2 lg:sticky lg:top-32 relative h-[500px] lg:h-[700px] flex items-center justify-center rounded-[3rem] bg-black/20 border border-white/5 p-4 lg:p-8">
                        
                        {/* Controles de Vista PC/Móvil */}
                        <div className="absolute top-6 right-6 z-30 bg-black/80 backdrop-blur-md p-1.5 rounded-full border border-white/10 flex gap-2 shadow-xl">
                            <button onClick={() => setView('desktop')} className={`p-2.5 rounded-full transition-all duration-300 ${view === 'desktop' ? 'bg-primary text-black scale-105' : 'text-white/50 hover:text-white'}`}><HiOutlineComputerDesktop className="w-5 h-5" /></button>
                            <button onClick={() => setView('mobile')} className={`p-2.5 rounded-full transition-all duration-300 ${view === 'mobile' ? 'bg-primary text-black scale-105' : 'text-white/50 hover:text-white'}`}><HiOutlineDevicePhoneMobile className="w-5 h-5" /></button>
                        </div>

                        {/* Reproductor de Video */}
                        <AnimatePresence mode="wait">
                            <motion.div key={`${currentIndex}-${activeVariantIndex}-${view}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }} className="relative w-full h-full flex items-center justify-center">
                                {view === 'desktop' ? (
                                    <div className="w-full aspect-video bg-neutral-900 rounded-xl md:rounded-2xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden relative group">
                                        <div className="absolute top-0 left-0 right-0 h-6 md:h-8 bg-neutral-950 border-b border-white/5 flex items-center px-4 gap-2 z-20">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
                                            <div className="ml-4 w-1/3 h-4 bg-white/5 rounded-full hidden sm:block"></div>
                                        </div>
                                        <div className="pt-6 md:pt-8 h-full"><video key={variant.videoDesktop} src={variant.videoDesktop} className="w-full h-full object-cover" muted loop autoPlay playsInline /></div>
                                    </div>
                                ) : (
                                    <div className="relative z-10 w-[240px] sm:w-[320px] aspect-[9/19] bg-black rounded-[3rem] border-[8px] border-neutral-800 shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-neutral-900 rounded-b-xl z-20"></div>
                                        <video key={variant.videoMobile} src={variant.videoMobile} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </section>
    );
};



// --- 2. PROJECTS SHOWCASE (CARRUSEL PROYECTOS REALES - PREMIUM REDESIGN) ---
const ProjectsShowcase = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Auto-play y tracking del slide activo
    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
        emblaApi.on('select', onSelect);
        
        const interval = setInterval(() => {
            if (emblaApi.canScrollNext()) emblaApi.scrollNext();
        }, 8000); 

        return () => {
            clearInterval(interval);
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    if (!projectsData || projectsData.length === 0) return null;

    return (
        <section id="portafolio" className="py-16 lg:py-20 bg-neutral-950 relative overflow-hidden">
            {/* Patrón de fondo sutil */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* HEADER Y NAVEGACIÓN FLOTANTE */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b border-white/5 pb-6">
                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs mb-3 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                            <HiOutlineSparkles className="w-4 h-4" /> Casos de Éxito
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
                            Impacto <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Real</span>
                        </h2>
                    </div>
                    
                    {/* Botones de Navegación del Carrusel */}
                    <div className="flex items-center gap-2 bg-white/[0.02] p-1.5 rounded-full border border-white/10 backdrop-blur-md">
                        <button onClick={scrollPrev} className="p-3 rounded-full border border-transparent text-neutral-400 hover:text-white hover:bg-white/10 transition-all"><HiChevronLeft size={22} /></button>
                        <div className="w-px h-5 bg-white/10"></div>
                        <button onClick={scrollNext} className="p-3 rounded-full border border-transparent text-neutral-400 hover:text-white hover:bg-white/10 transition-all"><HiChevronRight size={22} /></button>
                    </div>
                </div>

                {/* CONTENEDOR DEL CARRUSEL */}
                <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-neutral-900/20 shadow-2xl relative" ref={emblaRef}>
                    
                    <div className="flex touch-pan-y">
                        {projectsData.map((project) => (
                            <div key={project.id} className="flex-[0_0_100%] min-w-0 relative">
                                
                                {/* SLIDE INDIVIDUAL */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center p-6 sm:p-8 lg:p-12 relative overflow-hidden group h-auto lg:h-[520px]">
                                    
                                    {/* Resplandor dinámico de fondo */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl pointer-events-none"></div>

                                    {/* --- INFORMACIÓN DEL PROYECTO (IZQUIERDA) --- */}
                                    <div className="lg:col-span-5 relative z-10 flex flex-col justify-center h-full">
                                        <div className="mb-4 lg:mb-6">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">{project.category || 'Proyecto Real'}</p>
                                            <h3 className="text-3xl sm:text-4xl font-bold text-white font-display leading-tight mb-3">
                                                {project.title}
                                            </h3>
                                            <p className="text-base text-primary font-medium mb-3">
                                                {project.subtitle}
                                            </p>
                                            <p className="text-neutral-400 leading-relaxed text-sm">
                                                {project.description}
                                            </p>
                                        </div>

                                        {/* Tags Tecnológicos */}
                                        {project.tags && (
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {project.tags.slice(0, 4).map((tag: string) => (
                                                    <span key={tag} className="px-2.5 py-1 bg-black/40 border border-white/5 text-neutral-300 text-[10px] font-bold uppercase tracking-wider rounded-md">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Botón de Acción (FIX: Se quitó mt-auto, ahora se usa mt-2 para no empujarlo fuera) */}
                                        <div className="mt-2 pt-5 border-t border-white/5">
                                            <Link href={project.link || '#'} target="_blank" className="inline-flex items-center gap-2 bg-white text-black px-7 py-3 rounded-full font-bold text-xs hover:bg-primary hover:scale-105 transition-all shadow-lg group/btn w-fit">
                                                Ver Proyecto <FaExternalLinkAlt size={11} className="group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* --- COMPOSICIÓN VISUAL ADAPTATIVA (DERECHA) --- */}
                                    <div className="lg:col-span-7 relative z-10 w-full flex items-center justify-center mt-8 lg:mt-0 h-[350px] sm:h-[400px] lg:h-full">
                                        
                                        <div className="relative w-full h-full">
                                            
                                            {/* --- CASO 1: DESKTOP + MOBILE (HÍBRIDO CALIBRADO) --- */}
                                            {project.images?.desktop && project.images?.mobile ? (
                                                <div className="relative w-full h-full">
                                                    {/* Desktop anclado Arriba-Derecha */}
                                                    <div className="absolute top-[8%] right-0 w-[85%] lg:w-[80%] aspect-video bg-neutral-950 rounded-xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.7)] overflow-hidden group-hover:-translate-y-2 group-hover:scale-[1.02] transition-all duration-700">
                                                        <div className="h-5 md:h-6 bg-neutral-900 border-b border-white/5 flex items-center px-3 gap-1.5">
                                                            <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
                                                            <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
                                                            <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
                                                        </div>
                                                        <div className="w-full h-full bg-cover bg-top" style={{ backgroundImage: `url('${project.images.desktop}')` }}></div>
                                                    </div>
                                                    {/* Mobile anclado Abajo-Izquierda (Controlado por alto para no salirse) */}
                                                    <div className="absolute bottom-[2%] lg:bottom-[8%] left-[5%] lg:left-4 h-[75%] lg:h-[80%] aspect-[9/19] bg-black rounded-3xl border-[5px] lg:border-[6px] border-neutral-800 shadow-[10px_20px_40px_rgba(0,0,0,0.9)] overflow-hidden group-hover:-translate-y-4 group-hover:rotate-[-3deg] transition-all duration-700 delay-100">
                                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-3 md:h-4 bg-neutral-900 rounded-b-lg z-20"></div>
                                                        <div className="w-full h-full bg-cover bg-top" style={{ backgroundImage: `url('${project.images.mobile}')` }}></div>
                                                    </div>
                                                </div>
                                            ) 

                                            // --- CASO 2: SOLO MOBILE (FIX: CONTROLADO POR ALTURA EN VEZ DE ANCHO) ---
                                            : !project.images?.desktop && project.images?.mobile ? (
                                                <div className="relative w-full h-full flex items-center justify-center">
                                                    <div className="absolute inset-0 bg-primary/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none w-1/2 left-1/2 -translate-x-1/2"></div>
                                                    
                                                    {/* Mobile Principal (Ahora usa h-[90%] en lugar de w-[Xpx], garantizando que nunca se corte por arriba/abajo) */}
                                                    <div className="relative z-20 h-[85%] lg:h-[90%] aspect-[9/19] bg-black rounded-[2.5rem] border-[6px] lg:border-[8px] border-neutral-800 shadow-[0_20px_40px_rgba(0,0,0,0.8)] shadow-primary/10 overflow-hidden transform group-hover:-translate-y-3 group-hover:rotate-2 transition-all duration-700">
                                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-neutral-900 rounded-b-xl z-20"></div>
                                                        <div className="w-full h-full bg-cover bg-top" style={{ backgroundImage: `url('${project.images.mobile}')` }}></div>
                                                    </div>

                                                    {/* Mobile Desenfoque (Usa h-[75%]) */}
                                                    <div className="absolute z-10 right-[5%] lg:right-[15%] top-1/2 -translate-y-[45%] h-[70%] lg:h-[75%] aspect-[9/19] bg-black rounded-3xl border-[5px] border-neutral-800 shadow-[0_20px_40px_rgba(0,0,0,0.6)] overflow-hidden opacity-40 blur-[2px] transform rotate-[-5deg] transition-all duration-700 delay-100 group-hover:-translate-y-[48%] group-hover:rotate-[-7deg]">
                                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-4 bg-neutral-900 rounded-b-lg z-20"></div>
                                                        <div className="w-full h-full bg-cover bg-top" style={{ backgroundImage: `url('${project.images.mobile}')` }}></div>
                                                    </div>
                                                </div>
                                            ) 

                                            // --- CASO 3: SOLO PC (Modo Heroico Centrado) ---
                                            : project.images?.desktop && !project.images?.mobile ? (
                                                <div className="relative w-full h-full flex items-center justify-center">
                                                    <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none w-2/3 left-1/2 -translate-x-1/2"></div>
                                                    
                                                    {/* PC Heroica */}
                                                    <div className="relative z-20 w-[95%] lg:w-[90%] aspect-video bg-neutral-950 rounded-xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden transform group-hover:scale-[1.02] group-hover:-translate-y-2 transition-all duration-700">
                                                        <div className="h-5 md:h-6 bg-neutral-900 border-b border-white/5 flex items-center px-3 gap-1.5">
                                                            <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
                                                            <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
                                                            <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
                                                            <div className="ml-3 w-32 h-2 bg-white/5 rounded-full hidden sm:block"></div>
                                                        </div>
                                                        <div className="w-full h-full bg-cover bg-top" style={{ backgroundImage: `url('${project.images.desktop}')` }}></div>
                                                    </div>
                                                </div>
                                            ) : null}

                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PAGINACIÓN INFERIOR (PUNTOS) */}
                <div className="flex justify-center gap-2 mt-8">
                    {projectsData.map((_, index) => (
                        <button 
                            key={index} 
                            onClick={() => emblaApi && emblaApi.scrollTo(index)} 
                            className={`h-1.5 rounded-full transition-all duration-500 ${index === selectedIndex ? 'w-10 bg-primary shadow-[0_0_8px_rgba(0,255,127,0.5)]' : 'w-2 bg-white/20 hover:bg-white/40'}`} 
                            aria-label={`Ir al proyecto ${index + 1}`} 
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

// --- 3. COMMUNITY SHOWCASE (SISTEMA HÍBRIDO WEB/APPS NATIVAS) ---
const CommunityShowcase = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    
    // Inicializar la vista dependiendo del primer proyecto
    const [view, setView] = useState<'desktop' | 'mobile'>(communityProjects[0]?.isNativeApp ? 'mobile' : 'desktop');
    
    const activeProject = communityProjects[activeIndex];

    // Efecto para forzar la vista móvil si el proyecto lo requiere al cambiar de pestaña
    useEffect(() => {
        if (activeProject.isNativeApp) {
            setView('mobile');
        } else {
            setView('desktop');
        }
    }, [activeProject.isNativeApp, activeIndex]);

    return (
        <section className="py-24 bg-neutral-950 relative overflow-hidden border-t border-white/5">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            <div className="mx-auto max-w-[1400px] px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">Responsabilidad Social & Laboratorio</span>
                    <h2 className="text-3xl font-bold font-display text-white sm:text-5xl">Tecnología para la Comunidad</h2>
                    <p className="mt-4 text-neutral-400 text-lg">
                        Plataformas web y aplicaciones nativas creadas por Vertrex para resolver problemas reales en nuestra ciudad y entornos sin conexión.
                    </p>
                </div>

                {/* --- PESTAÑAS DE NAVEGACIÓN --- */}
                <div className="flex justify-center mb-12">
                    <div className="flex gap-2 overflow-x-auto pb-4 max-w-full px-4 no-scrollbar">
                        {communityProjects.map((project, index) => (
                            <button
                                key={project.id}
                                onClick={() => setActiveIndex(index)}
                                className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border flex items-center gap-2 ${
                                    activeIndex === index 
                                    ? `bg-white text-black border-white scale-105 shadow-lg shadow-white/10` 
                                    : 'bg-neutral-900 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {project.isNativeApp && <FaAndroid className={activeIndex === index ? "text-primary" : "text-neutral-500"} />}
                                {project.title}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeProject.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
                    >
                        {/* --- LADO IZQUIERDO: VISUALIZADOR --- */}
                        <div className="w-full relative group order-2 lg:order-1 flex justify-center">
                            {/* Brillo ambiental dinámico */}
                            <div className={`absolute ${activeProject.isNativeApp ? 'inset-10' : '-inset-4'} bg-gradient-to-r ${activeProject.color} rounded-full opacity-30 blur-3xl group-hover:opacity-60 transition-opacity duration-700`}></div>
                            
                            <div className={`relative ${activeProject.isNativeApp ? 'w-auto' : 'w-full rounded-[2rem] border border-white/10 bg-neutral-900 overflow-hidden shadow-2xl'}`}>
                                
                                {/* Controles de vista (Solo se muestran si NO es una app nativa/PWA móvil) */}
                                {!activeProject.isNativeApp && (
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/10 flex gap-2">
                                        <button 
                                            onClick={() => setView('desktop')} 
                                            className={`p-2 rounded-full transition-all ${view === 'desktop' ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
                                            title="Vista Escritorio"
                                        >
                                            <HiOutlineComputerDesktop className="w-4 h-4"/>
                                        </button>
                                        <button 
                                            onClick={() => setView('mobile')} 
                                            className={`p-2 rounded-full transition-all ${view === 'mobile' ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}
                                            title="Vista Móvil"
                                        >
                                            <HiOutlineDevicePhoneMobile className="w-4 h-4"/>
                                        </button>
                                    </div>
                                )}

                                {/* Contenedor de la Imagen */}
                                <div className={`relative ${activeProject.isNativeApp ? 'py-4' : view === 'desktop' ? 'w-full aspect-video' : 'aspect-[4/3] flex items-center justify-center bg-neutral-900 py-8'}`}>
                                    <AnimatePresence mode="wait">
                                        <motion.div 
                                            key={view}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-full h-full flex items-center justify-center"
                                        >
                                            {/* RENDERIZADO CONDICIONAL: App Nativa vs Web */}
                                            {activeProject.isNativeApp ? (
                                                <div className="relative z-10 h-[500px] lg:h-[600px] aspect-[9/19] bg-black rounded-[3rem] border-[8px] border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-500">
                                                    {/* Notch / Cámara del celular simulada */}
                                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-neutral-900 rounded-b-2xl z-20"></div>
                                                    <div className="w-full h-full bg-cover bg-top" style={{ backgroundImage: `url('${activeProject.images.mobile}')` }}></div>
                                                </div>
                                            ) : view === 'desktop' ? (
                                                <div className="w-full h-full bg-cover bg-top" style={{ backgroundImage: `url('${activeProject.images.desktop}')` }}></div>
                                            ) : (
                                                <div className="h-[90%] aspect-[9/19] rounded-[2rem] border-[6px] border-neutral-800 overflow-hidden relative shadow-2xl">
                                                    <div className="w-full h-full bg-cover bg-top" style={{ backgroundImage: `url('${activeProject.images.mobile}')` }}></div>
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* --- LADO DERECHO: INFORMACIÓN --- */}
                        <div className="w-full order-1 lg:order-2">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="p-2 rounded-lg bg-white/5 text-white border border-white/5">
                                    {activeProject.isNativeApp ? <FaAndroid className="w-5 h-5 text-primary" /> : <HiOutlineHeart className="w-5 h-5 text-primary"/>}
                                </span>
                                <span className={`text-xs font-bold uppercase tracking-widest ${activeProject.accent}`}>
                                    {activeProject.isNativeApp ? 'Ingeniería Móvil Avanzada' : 'Iniciativa Propia'}
                                </span>
                            </div>
                            
                            <h3 className="text-4xl font-bold text-white font-display mb-2">{activeProject.title}</h3>
                            <p className="text-xl text-white/60 mb-6">{activeProject.subtitle}</p>
                            
                            <div className="bg-white/5 border border-white/5 rounded-xl p-6 mb-8 relative overflow-hidden">
                                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${activeProject.color}`}></div>
                                <p className="text-neutral-300 italic mb-2">&quot;{activeProject.mission}&quot;</p>
                                <p className="text-sm text-neutral-500 leading-relaxed">{activeProject.description}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                {activeProject.features.map((feature: { icon: React.ReactNode; title: string; desc?: string }, i: number) => (
                                    <div key={i} className="flex items-start gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/5 hover:bg-white/5 transition-colors">
                                        <div className={`mt-1 text-lg ${activeProject.accent}`}>{feature.icon}</div>
                                        <div>
                                            <h5 className="text-white font-bold text-sm">{feature.title}</h5>
                                            <p className="text-xs text-neutral-500 mt-1">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5">
                                <Link href={activeProject.link} target="_blank" className={`rounded-xl px-8 py-3.5 font-bold text-black ${activeProject.bgBtn} hover:brightness-110 transition-all flex items-center gap-2 shadow-lg`}>
                                    {activeProject.buttonText} <FaExternalLinkAlt size={14} />
                                </Link>
                                <div className="flex flex-wrap gap-2">
                                    {(activeProject.tags ?? []).map((tag: string) => (
                                        <span key={tag} className="px-3 py-1.5 rounded-lg border border-white/10 bg-black/50 text-[10px] uppercase tracking-wider text-neutral-400 font-bold">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    )
}