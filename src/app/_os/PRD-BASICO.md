1. Visión y Estrategia Core

Vertrex OS es el "Cerebro Central" de la agencia de desarrollo/software house. Elimina la fragmentación (Drive, Notion, Jira, Slack, Toggl, HubSpot) unificando Operaciones, Finanzas, Recursos Humanos, Marketing, Gestión de Conocimiento y la Experiencia del Cliente bajo una sola interfaz inmersiva y oscura.

El sistema actúa como un C-Level Virtual (CEO, CFO, COO). No solo registra datos; cruza variables en tiempo real para predecir rentabilidad, mitigar el burnout del equipo, ejecutar marketing, y simular decisiones de negocio antes de ejecutarlas.
🗄️ 2. Capa de Conocimiento y Activos (Vault & Hub)
💾 2.1 Storage Vault (Drive + Neon Hybrid) (/vault)

El sistema de archivos de la agencia.

    Arquitectura Híbrida: Los archivos pesados (diseños, videos, zips) se suben directamente a la cuenta corporativa de Google Drive (vertrexsc@gmail.com) vía API para no saturar la base de datos. Neon DB solo guarda el link, el nombre y a qué proyecto pertenece para cargarlo súper rápido en la interfaz.

🔑 2.2 Secrets, .env & Accounts Vault

Gestión de accesos críticos y cuentas compartidas con una UI hermosa y minimalista.

    Features: Lista limpia de credenciales organizadas por categorías. Botones interactivos de "Ojo" para revelar la contraseña/llave y botón de "Copiar al portapapeles".

    Tipos de Cuentas y Accesos:

        Dev & Infraestructura: Variables de entorno (.env), API Keys (Stripe, OpenAI, Vercel), bases de datos.

        Operaciones & Clientes: Accesos a servidores, Hosting, Meta Ads, TikTok Ads, cuentas de redes sociales de clientes.

        Servicios & Entretenimiento (Suscripciones): Cuentas de plataformas de streaming (Netflix, Spotify, Prime), cuentas de plataformas de videojuegos (Steam, Epic Games), licencias de software de diseño/edición.

    🔥 Seguridad: Absolutamente TODO encriptado en la base de datos de Neon (AES-256) con visibilidad controlada por permisos (ej: el equipo de Devs no puede ver las cuentas de Streaming o Finanzas).

🌐 2.3 Knowledge Hub & Smart Links (/hub)

El cerebro de referencias y repositorios.

    Features: Repositorio visual de links. Aquí viven los enlaces a repositorios de GitHub, programas de TikTok, artículos técnicos, y referencias de la competencia.

    🔥 Diferencial IA (Auto-Scraping): Pegas una URL cruda y la IA visita la web, extrae el título, hace un resumen, genera tags automáticamente y te sugiere a qué proyecto activo pertenece el link. (Vista de tarjetas tipo "WhatsApp Preview").

🦅 3. Capa Estratégica & C-Level (God-Mode)
📈 3.1 Analytics & Business Intelligence (/analytics)

Dashboard cruzado que lee y procesa todos los data points del sistema.

    Features: KPIs estratégicos: Margen Operativo Neto, Revenue per Employee, CAC (Costo de Adquisición), LTV de Clientes, Gráfico de Esfuerzo vs. Rentabilidad.

    🔥 Diferencial IA (Deep Insight): Detecta oportunidades estructurales. Ej: "Los contratos Anuales (ARR) dejan 2.5x más margen y consumen 40% menos horas. Sugerimos estandarizar este modelo."

🎯 3.2 Dirección Estratégica & OKRs (/strategy)

Vincula el trabajo diario con las metas corporativas.

    Features: Objetivos trimestrales (OKRs), KPIs asociados, mapeo visual de "Proyectos vs. Impacto".

    🔥 Diferencial IA (Desviación): Detecta "Busy Work". Alerta si el 60% de las tareas de la semana no impactan el OKR principal y sugiere reasignar esfuerzos urgentemente.

🧪 3.3 El Oráculo / Decision Sandbox (/sandbox)

Entorno de simulación de impacto multidimensional.

    Features: Interfaz para ingresar hipótesis (Ej: ¿Qué pasa si acepto este cliente por $45k con 8 semanas de plazo?).

    🔥 Diferencial IA: Simula el futuro. Muestra si la decisión inyecta caja pero destruye la capacidad del equipo de Backend (Burnout Alert).

💰 4. Capa de Growth & Revenue (Motor de Dinero)
📢 4.1 Marketing & Acquisition Hub (/marketing)

Centro de mando para Media Buyers y Growth Hackers.

    Features: Tracking unificado de campañas (Meta, Google, LinkedIn), Funnel de Conversión.

    🔥 Diferencial IA: ROAS Real (Cruza el gasto publicitario con los contratos cobrados en Finanzas). AI Ad Studio (Redacta copys imitando tu tono comercial).

🤝 4.2 CRM B2B Enterprise (/crm)

Manejo de pipeline adaptado a Software Houses.

    Features: Kanban de ventas, diferenciador visual de modelos de negocio (MRR, ARR, Setup Único). Deal Detail Slide-over con mapeo del "Comité de Compras".

    🔥 Diferencial IA (Deal Coach): Alerta de enfriamiento de tratos y redacta follow-ups estratégicos.

📄 4.3 Generador de Documentos (/docs/generator)

Automatización del ciclo de Captación.

    Features: Renderizado en tiempo real a PDF A4 con la estética agresiva de Vertrex (@react-pdf/renderer). Genera: Propuestas, SOW, Contratos y Oficios de Inicio.

    🔥 Diferencial IA: Pegas notas de reunión "crudas". La IA extrae variables y maqueta instantáneamente la plantilla legal oficial.

💵 4.4 Finanzas Corporativas (/finance)

Control absoluto del flujo de caja.

    Features: Ledger transaccional mixto, cálculo de Runway (pista de aterrizaje en meses).

    🔥 Diferencial IA (CFO Virtual): Audita licencias SaaS inactivas. Recomienda estrategias de liquidez inmediata.

⚙️ 5. Capa de Operaciones & Talento (Motor de Ejecución)
👨‍💻 5.1 Gestión de Equipo y HR (/team)

Protege el talento y maximiza la eficiencia.

    Features: Perfiles avanzados, matriz de Skills vs. Demanda de proyectos.

    🔥 Diferencial IA (Anti-Burnout): Predice sobrecarga. Si un Dev pasa del 100% de capacidad, sugiere reasignar tareas a un operador libre.

⏱️ 5.2 Time Tracking Inteligente (/time)

Convierte el tiempo en un KPI financiero real.

    Features: Cronómetro brutalista integrado.

    🔥 Diferencial IA (Auditor de Rentabilidad): Multiplica las horas por el sueldo del Dev (Costo Interno) y lo resta del contrato. Alerta si el margen de ganancia de un proyecto baja a zona de peligro.

📂 5.3 Gestión de Proyectos (/projects)

El núcleo de desarrollo ("Linear Killer").

    Features: Kanban, dependencias gráficas, Timeline/Gantt. Editor tipo bloques.

🔒 6. Capa de Cumplimiento & Legal
🧾 6.1 Bóveda Legal (/legal)

Orden absoluto para escalar B2B.

    Features: Repositorio maestro encriptado (MSA, SOW, NDAs), versionado de plantillas oficiales.

    🔥 Diferencial IA (Monitor de Riesgo): Notifica 15 días antes de que un contrato expire sin renovación automática.

👔 7. Capa Client-Facing (La Experiencia del Cliente)
💼 7.1 Client Hub (Portal B2B Premium) (/portal/[id])

Eleva el servicio de Agencia a la categoría de SaaS Enterprise.

    Features: Dashboard de progreso (%), Línea de tiempo de entregables, Finanzas (Pagado vs Pendiente), Descarga de Facturas y Contratos, Bandeja de subida de assets.

    🔥 Diferencial IA (Chatbot 24/7): Asistente anclado al portal, entrenado exclusivamente con el SOW y manuales de ese cliente. Responde dudas técnicas sin que tu equipo intervenga.

🎫 7.2 Soporte Técnico y Tickets

    Features: El cliente reporta bugs desde su portal. Ingresa directo al Kanban de desarrollo interno respetando el SLA firmado.