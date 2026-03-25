// Fuente de datos para demos: define tarjetas, variantes y recursos de video por caso.
export interface DemoVariant {
  label: string; 
  videoMobile: string;
  videoDesktop: string;
  description?: string;
}

export interface Demo {
  businessName: string;
  businessType: string;
  date: string;
  logo?: string; 
  socials?: {    
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  businessDescription: string; // NUEVO: ¿Qué hace el negocio?
  vertrexConcept: string;      // NUEVO: ¿Qué propone Vertrex?
  variants: DemoVariant[];
  keyBenefits?: string[];
  whatClientsSee?: string[];
  whatPartnersManage?: string[];
}

export const demos: Demo[] = [
  {
    businessName: 'Organica 420',
    businessType: 'Gastro Bar Weed‑Friendly (Experiencia Cultural)',
    date: '2025-09-01',
    logo: '/images/logos/organica-logo.jpg',
    socials: {
      instagram: 'https://www.instagram.com/organica420neiva/'
    },
    businessDescription: 'Organica 420 es un gastro bar disruptivo que fusiona gastronomía creativa, coctelería de autor y una propuesta cultural weed‑friendly. Está pensado para ser un punto de encuentro diario: comida cuidadosamente curada, bebidas que sorprenden y programación que transforma cada visita en una experiencia memorable para la comunidad local y visitantes.',
    vertrexConcept: 'Diseñamos una experiencia web dinámica cuyo contenido cambia según el día de la semana para reflejar la programación y la carta del día. El sitio automatiza la exhibición de eventos diarios, menús y material audiovisual, creando un recorrido inmersivo que incentiva la visita física al local cada día. La interfaz actúa como escaparate vivo: muestra la atmósfera real del lugar, facilita la decisión del visitante y convierte curiosos en asistentes frecuentes.',
    variants: [
      { label: 'Principal', videoMobile: '/videos/principalorganicamv.mp4', videoDesktop: '/videos/principalorganicapc.mp4', description: 'Recorrido de alto impacto que presenta la propuesta de valor: ambiente, platos estrella y la programación semanal. Ideal para transmitir la identidad de marca y atraer nuevas visitas.' },
      { label: 'Lunes', videoMobile: '/videos/lunesorganicamv.mp4', videoDesktop: '/videos/lunesorganicapc.mp4', description: 'Enfoque en jornadas tranquilas y experiencias culinarias relajadas: menú del día, promociones y eventos íntimos para comenzar la semana con comunidad.' },
      { label: 'Martes', videoMobile: '/videos/martesorganicamv.mp4', videoDesktop: '/videos/martesorganicapc.mp4', description: 'Promociones temáticas, menús especiales y micro‑eventos (música, catas) pensados para fidelizar a asistentes recurrentes entre semana.' },
      { label: 'Miércoles', videoMobile: '/videos/principalorganicamv.mp4', videoDesktop: '/videos/principalorganicapc.mp4', description: 'Miércoles de experiencia: equilibrio entre buena comida y programación cultural; se prioriza visibilidad de platos destacados y actividades del día.' },
      { label: 'Jueves', videoMobile: '/videos/juevesorganicamv.mp4', videoDesktop: '/videos/juevesorganicapc.mp4', description: 'Tarde‑noche con propuestas más activas: coctelería de autor, DJs o shows íntimos; la web muestra horarios y calls‑to‑action para asistir.' },
      { label: 'Viernes', videoMobile: '/videos/viernesorganicamv.mp4', videoDesktop: '/videos/viernesorganicapc.mp4', description: 'Presentación pensada para la noche de viernes: ambiente vibrante, platos para compartir y programación que maximiza la afluencia.' },
      { label: 'Sábado', videoMobile: '/videos/sabadoorganicamv.mp4', videoDesktop: '/videos/sabadoorganicapc.mp4', description: 'Sábado como punto álgido: se muestra la experiencia completa —música, público, platos emblemáticos— para convertir visitas en recomendaciones y reservas.' }
    ],
    keyBenefits: [
      'Comunica de forma inmediata la personalidad experiential del local: gastronomía, coctelería y ambiente weed‑friendly.',
      'Automatiza la visibilidad de eventos y carta diaria, manteniendo el sitio siempre actualizado sin intervención manual constante.',
      'Aumenta el tráfico físico al local mostrando la experiencia real mediante video y narrativas diarias.',
      'Facilita la decisión del visitante con secciones claras sobre programación, platos destacados y llamadas a la acción para asistir.',
      'Refuerza fidelización: contenidos específicos por día que incentivan visitas repetidas y participación en eventos.'
    ],
    whatClientsSee: [
      'Página inicial inmersiva con video y narrativa que transmite el ambiente del gastro bar.',
      'Secciones por día que muestran la programación, menú del día y eventos especiales.',
      'Información clara sobre promociones y recomendaciones del chef o la barra.',
      'Llamadas a la acción visibles para reservar, visitar o seguir en redes sociales.'
    ],
    whatPartnersManage: [
      'Panel de contenidos que permite actualizar menús, eventos y activos audiovisuales según el calendario.',
      'Publicación automática de variantes diarias para mantener la oferta fresca y coherente con la operación del local.',
      'Control sobre promociones y mensajes destacados que optimizan afluencia en días concretos.',
      'Acceso a métricas básicas de interacción para medir qué días y contenidos generan más tráfico.'
    ]
  },
  {
    businessName: 'Urban Gym',
    businessType: 'Gimnasio y Centro de Fitness',
    date: '2025-08-29',
    logo: '/images/logos/urbangym-logo.jpg',
    socials: {
      instagram: 'https://www.instagram.com/urbangym_neiva/'
    },
    businessDescription: 'Centro de acondicionamiento físico orientado a rendimiento y comunidad. Urban Gym combina instalaciones modernas, entrenadores especializados y programas estructurados para transformar la experiencia del socio: desde iniciarse en el gimnasio hasta preparar competencias. El producto digital actúa como la puerta de entrada principal para captar y convertir clientes mediante mensajes motivacionales, pruebas de servicio y llamadas a la acción directas.',
    vertrexConcept: 'Diseñamos una Landing Page de alta conversión con una estética agresiva y motivacional que se enfoca 100% en captar leads y vender membresías. El recorrido está pensado para impulsar decisiones rápidas: propuesta de valor clara, beneficios por tipo de socio, planes destacados, testimonios reales y CTAs estratégicos (suscripción, prueba gratuita, contacto). Todo el contenido visual y el ritmo de la página están pensados para generar urgencia y confianza simultáneamente.',
    variants: [
        { label: 'Landing Principal — Captación', videoMobile: '/videos/urbangymmv.mp4', videoDesktop: '/videos/urbangympc.mp4', description: 'Recorrido por la página pública: encabezado motivacional con video, bloques de beneficios, secciones de servicios (entrenamiento funcional, musculación, clases dirigidas), precios y formularios de contacto rápidos. Muestra cómo un visitante se convierte en lead: ver plan, elegir prueba gratuita y enviar datos de contacto.' },
        { label: 'Panel Administrativo (Gestión Interna)', videoMobile: '/videos/urbangympanelmv.mp4', videoDesktop: '/videos/urbangympanelpc.mp4', description: 'Interfaz privada para el staff: gestión de leads y membresías, calendario de reservas y clases, control de asistencia, y estadísticas simples de conversión y retención. Optimizado para que recepcionistas y entrenadores actualicen estados rápidamente y coordinen seguimientos comerciales.' }
    ],
    keyBenefits: [
      'Convierte tráfico en clientes con mensajes y CTAs optimizados.',
      'Reduce fricción: formularios cortos y opciones inmediatas para probar o reservar.',
      'Aumenta ventas de membresías mediante rutas predefinidas y ofertas destacadas.',
      'Centraliza gestión operativa en un panel que ahorra tiempo del equipo.',
      'Diseño motivacional que refuerza el posicionamiento de marca y el compromiso del socio.'
    ],
    whatClientsSee: [
      'Inicio impactante con propuesta de valor clara y video motivacional.',
      'Planes y precios visibles, comparables y con llamadas a la acción directas.',
      'Sección de servicios y clases con horarios y beneficios por tipo de usuario.',
      'Testimonios y resultados que inspiran confianza.',
      'Formulario rápido para reservar prueba o recibir asesoría por el canal preferido.'
    ],
    whatPartnersManage: [
      'Buzón de prospectos con filtros y etiquetas (nuevo, en seguimiento, convertido).',
      'Agenda centralizada para clases y reservas con control de cupos y notificaciones.',
      'Resumen ejecutivo con indicadores clave: leads, conversiones, tasa de asistencia.',
      'Acciones rápidas sobre prospectos (marcar contacto, agendar prueba, enviar oferta).',
      'Control de contenido promocional activo (ofertas temporales y mensajes en la landing).'
    ]
  },
  {
    businessName: "Asesores y Consultores MC S.A.S",
    businessType: "Sitio Público + Panel CRM",
    socials: {
      instagram: 'https://www.instagram.com/aconsultores_mc/'
    },
    date: "2025-03-01",
    businessDescription: "Firma de abogados corporativos orientada a clientes de alto perfil. El sitio proyecta autoridad, discreción y profesionalismo, con herramientas pensadas para convertir visitantes en clientes reales: información clara de servicios, testimonios, calculadora legal para captar casos y vías de contacto inmediatas.",
    vertrexConcept: "Proponemos una digitalización total y orientada al negocio: un sitio público de alto nivel que presenta la firma, sus áreas de especialidad y casos de éxito, e integra una calculadora legal que atrae prospectos automáticamente. Detrás, un Panel CRM privado y seguro donde los socios gestionan prospectos, agendan consultas, registran comunicaciones y controlan métricas clave —todo para convertir interés en clientes y reducir el trabajo administrativo.",
    variants: [
      {
        label: "Sitio Público & Calculadora",
        videoDesktop: "/videos/demos/abogados/pc-inicio.mp4",
        videoMobile: "/videos/demos/abogados/publico-mobile.mp4",
        description: "Demo escritorio — recorrido por la página principal, secciones de servicios, calculadora de liquidaciones y flujo de contacto (muestra cómo un visitante genera un prospecto). Demo móvil — mismo flujo optimizado para teléfonos: usar la calculadora, abrir contacto por WhatsApp y agendar una cita desde el celular."
      },
      {
        label: "Panel de Socios (Dashboard)",
        videoDesktop: "/videos/demos/abogados/pc-panel.mp4",
        videoMobile: "/videos/demos/abogados/dashboard-mobile.mp4",
        description: "Demo escritorio — panel privado para socios: resumen ejecutivo (prospectos, conversiones, mensajes), lista de prospectos con acciones rápidas y calendario de citas. Demo móvil — vista administrativa ligera: revisar prospectos recientes, marcar estados (nuevo/contactado/cliente), y opciones rápidas de contacto desde el teléfono."
      }
    ],
    keyBenefits: [
      "Genera confianza inmediata ante clientes de alto perfil.",
      "Captura prospectos automáticamente con una herramienta útil (calculadora legal).",
      "Reduce tiempos de respuesta: contacto directo desde el sitio al canal preferido del cliente.",
      "Panel privado para socios que centraliza gestión de prospectos, agenda y métricas sin exponer datos públicos.",
      "Diseño y mensajes construidos para transmitir autoridad y resultados, facilitando la conversión de visitas en consultas pagadas."
    ],
    whatClientsSee: [
      "Página elegante con la propuesta de valor de la firma y áreas de práctica.",
      "Calculadora práctica que da un estimado inmediato y motiva al visitante a pedir ayuda.",
      "Formulario rápido que abre el canal de comunicación preferido del cliente para confirmar la cita.",
      "Testimonios y datos de confianza que respaldan la experiencia de la firma."
    ],
    whatPartnersManage: [
      "Buzón privado de prospectos con acciones rápidas (contacto, cambio de estado).",
      "Panel de métricas simples para medir conversiones y volumen de consultas.",
      "Agenda centralizada para coordinar citas y evitar solapamientos.",
      "Acceso controlado para socios — información operativa organizada para la toma de decisiones."
    ]
  },
  {
    businessName: "Chill Clay",
    businessType: "E-commerce Surrealista (WhatsApp)",
    date: "2025-03-10",
    socials: {
      instagram: 'https://www.instagram.com/chill.clayshop420/'
    },
    businessDescription: 'Marca creativa que comercializa piezas únicas de arcilla y cerámica con diseño surrealista y alto impacto visual. La web funciona como una galería interactiva donde cada objeto es una obra: los visitantes exploran formas y texturas, conocen la historia detrás de la autora y pueden encargar piezas directamente sin trámites pesados.',
    vertrexConcept: 'E-commerce de Fricción Cero: presentamos el catálogo como una galería artística inmersiva para que el visitante disfrute la experiencia y, sin pedir registros ni formularios largos, convierta su interés en pedido real mediante WhatsApp. El sistema prioriza la experiencia visual y la velocidad de compra, enviando un pedido ya estructurado al canal de la marca para que la comunicación y el cierre ocurran por mensajería directa.',
    variants: [
      {
        label: "Catálogo & Experiencia Visual",
        videoDesktop: "/videos/demos/chill clay/pc.mp4",
        videoMobile: "/videos/demos/chillclay/mobile.mp4",
        description: 'Recorrido de pantalla que muestra la página principal, el fondo animado, la interacción del \"ojo\", la galería de piezas destacadas y el flujo de añadir al carrito hasta generar el pedido por WhatsApp.'
      }
    ],
    keyBenefits: [
      'Compra rápida y sin fricción: el visitante pide por WhatsApp sin crear cuenta.',
      'Catálogo tipo galería que potencia la percepción artística de las piezas.',
      'Control completo de stock visible en cada ficha (Disponible / Sin Stock / Próximamente).',
      'Comunicación directa y humana: pedidos llegan estructurados al WhatsApp de la marca para cerrar ventas por mensaje.',
      'Experiencia visual diferenciada (fondo 3D, animaciones, microinteracciones) que aumenta el interés y la retención.'
    ],
    whatClientsSee: [
      'Página principal inmersiva con arte, título impactante y llamadas a la acción claras.',
      'Galería con piezas destacadas y acceso al catálogo completo.',
      'Fichas de producto con foto, precio, estado y botón para añadir al carrito.',
      'Panel lateral que muestra los artículos agregados y el total, con botón para enviar el pedido por WhatsApp.'
    ],
    whatPartnersManage: [
      'Actualización del catálogo local (títulos, precios, fotos y estado de stock) desde los archivos del sitio.',
      'Recepción de pedidos por WhatsApp con el detalle de artículos y total para coordinar pago y envío.',
      'Gestión manual de disponibilidad: marcar piezas como \"Sin Stock\" o \"Próximamente\" para evitar ventas no deseadas.',
      'Posible mejora futura: conectar a un sistema de inventario o CRM para centralizar pedidos y historiales.'
    ]
  },
  {
    businessName: "Ssystemco Techno",
    businessType: "Plataforma Rave & Ticketing",
    date: "2025-03-20",
    socials: {
      instagram: 'https://www.instagram.com/ssystemco/'
    },
    businessDescription: 'Un colectivo de raves de techno duro que necesita una presencia digital oscura, contundente y diseñada para su comunidad: mostrar eventos, vender acceso, nutrir a su base de seguidores y gestionar la operación en la puerta y detrás del escenario.',
    vertrexConcept: 'Construimos una experiencia inmersiva: un sitio público que comunica la estética del colectivo con posters grandes, agenda visual y tienda, acompañado de una consola privada pensada para operar eventos masivos —venta y control de entradas, panel de promotores y un lector de QR preparado para el ritmo de la entrada a un rave.',
    variants: [
      {
        label: "Sitio Público & Agenda",
        videoDesktop: "/videos/demos/system/pc-inicio.mp4",
        videoMobile: "/videos/demos/system/publico-mobile.mp4",
        description: 'Demo escritorio — recorrido por la página principal: gran flyer en el hero, información del próximo evento, calendario visual de próximos shows, galería y sección de merch. Demo móvil — mismo flujo optimizado para teléfonos: ver flyer, consultar line‑up y acceder al flujo de compra desde el celular.'
      },
      {
        label: "Consola Admin & Escáner QR",
        videoDesktop: "/videos/demos/system/pc-panel.mp4",
        videoMobile: "/videos/demos/system/admin-mobile.mp4",
        description: 'Demo escritorio — panel privado para staff: KPIs rápidos, gestión de promotores, control de ventas y lista de asistentes. Demo móvil — vista ligera para puerta: escanear QR, validar ingresos y ver estadísticas en tiempo real desde el teléfono.'
      }
    ],
    keyBenefits: [
      'Presentación instantánea y fiel a la identidad rave: genera expectación desde el primer vistazo.',
      'Convierte interés en ventas con un flujo de tickets integrado y visual (listados y widget de compra).',
      'Reduce fricción operativa: panel de promotores y lector QR para entrada más rápida y controlada.',
      'Monetiza además con drops de mercancía y promociones dirigidas a la comunidad.',
      'Demostrable y lista para demo: estética, operación y métricas integradas para convencer a promotores y venues.'
    ],
    whatClientsSee: [
      'Página principal con el póster del próximo evento, fecha, hora, lugar y line‑up en primera vista.',
      'Agenda visual de próximos eventos con tarjetas fáciles de revisar y estados claros (preventa, próximamente).',
      'Galería y archivo visual que refuerzan la historia del colectivo y la estética del evento.',
      'Sección de tienda y un formulario de contacto / suscripción para capturar interesados.'
    ],
    whatPartnersManage: [
      'Panel privado con métricas comerciales (ventas, rendimiento de promotores y estadísticas de asistencia).',
      'Gestión de eventos: crear/editar eventos, publicar flyers y cambiar estados de preventa.',
      'Control de acceso en puerta: escaneo y validación de QR, logs de entradas y manejo de incidencias.',
      'Coordinación de promotores y reparto de comisiones: lista de promotores con seguimiento de ventas y desempeño.'
    ]
  }
];