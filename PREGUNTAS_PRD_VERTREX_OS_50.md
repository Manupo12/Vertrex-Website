# 50 preguntas estructuradas para PRD v9.0 — Vertrex OS

## Cómo usar este documento

Este archivo está diseñado para convertir la auditoría técnica en un PRD v9.0 serio.

Cada pregunta busca cerrar una decisión que hoy sigue ambigua entre:

- lo que el código ya hace realmente
- lo que el PRD promete a nivel aspiracional
- lo que todavía no está definido como producto, política o límite operativo

Formato sugerido para la entrevista posterior:

- una pregunta a la vez
- registrar respuesta concreta
- evitar respuestas abstractas si la pregunta exige un límite operacional
- si la respuesta depende de una fase, anotar explícitamente: `MVP`, `v1`, `v2` o `exploración`

---

# 1. Alcance del producto y frontera del sistema

## Pregunta 1/50 — Módulo: Producto base

**Pregunta**
¿Cuál es la promesa exacta de Vertrex OS para la siguiente fase: sistema operativo interno de la software house, plataforma compartida con clientes, o ambos como producto inseparable?

R: SERA UNA PLATAFORMA COMPARTIDA CON CLIENTES SOLO PARA EL PORTAL Y LO DEMAS PARA SISTEMA OPERATIVO INTERNO

**Por qué importa**
Hoy el código ya sostiene ambos mundos, pero el PRD mezcla visión interna, portal cliente y capa AI como si fueran una sola apuesta sin priorización explícita.

**Señal del sistema real**
La app unificada ya expone `/os`, `/portal/[clientId]`, `/login` y `/api` en un solo host.

**Lo que desbloquea**
Define el scope maestro del PRD y evita que v9 vuelva a mezclar plataforma interna con promesa SaaS externa sin distinguir prioridades.

## Pregunta 2/50 — Módulo: Producto base

**Pregunta**
¿Qué módulos son “core obligatorios” para considerar que Vertrex OS ya sirve para operar día a día y cuáles quedan explícitamente fuera del MVP real?

R:TODOS SON OBLIGATORIOS, TODOS LOS DIAS CREAMOS UN CLIENTE NUEVO AUNQUE NI SIQUIERA LE HABLAMOS TODAVIDA, TODOS LOS DIAS ENCUENTRO LINKS INTERESANTES, TODOS LOS DIAS SUBO AFICHES POST (PARA GUARDAR EN MARKETING), TODOS LOS DIAS HAGO DOCUMENTOS ETC TODO TIENE QUE ESTAR Y RELACIONADO CON TODO PERO A LA VEZ INDEPENDIENTE NO SE SI ME EXPLICO

**Por qué importa**
El código ya tiene demasiadas superficies. Sin jerarquía, el PRD corre el riesgo de tratar todas como igualmente críticas.

**Señal del sistema real**
Hoy CRM, Projects, Finance, Documents, Portal, Access y Storage tienen más operación real que Analytics, Strategy, Time o Automations.

**Lo que desbloquea**
Permite separar producto operativo de producto aspiracional.

## Pregunta 3/50 — Módulo: Modelo operativo

**Pregunta**
¿Cuál es la entidad canónica del negocio dentro del sistema: cliente, proyecto, deal o contrato?

R: NO ENTIENDO LA PREGUNTA CREO QUE ES CLIENTE REVISA BIEN O UNIFICA

**Por qué importa**
El código relaciona casi todo por `clientId`/`clientSlug`, pero el PRD a veces habla como si el deal o el contrato fueran el centro del negocio.

**Señal del sistema real**
Portal, credenciales, tickets, files, messages e invoices se agrupan principalmente alrededor del cliente.

**Lo que desbloquea**
Ordena el modelo relacional del PRD y la navegación futura.

## Pregunta 4/50 — Módulo: Modelo operativo

**Pregunta**
¿La transición comercial correcta es siempre `lead -> deal -> proyecto -> portal -> billing`, o hay rutas válidas alternativas que el sistema debe soportar oficialmente?

R: COMO TE DIJE ANTES SI HAY RUTAS ALTERNATIVAS DEBE SER COMO UN GRAFO TIPO COMO OBSIDIAN ALGO ASI

**Por qué importa**
Hoy el código permite varias entradas parciales, pero el PRD no define cuál es el camino recomendado.

**Señal del sistema real**
Desde Projects ya se puede crear cliente y provisionar portal, saltándose parte del relato comercial clásico.

**Lo que desbloquea**
Aclara automatizaciones, permisos y diseño de onboarding.

## Pregunta 5/50 — Módulo: Roadmap

**Pregunta**
¿Qué porcentaje del valor de Vertrex OS en v9 debe provenir de operación confiable y qué porcentaje de IA/autonomía diferenciadora?

R: LA IA DEBE TENER LA SUFICIENTE AUTONOMIA COMO UNA PERSONA PERO SIEMPRE PIDIENDO PERMISO AL USUARIO PARA ACCIONES CRITICAS.

**Por qué importa**
El PRD básico vende una capa AI muy ambiciosa, pero el sistema real ya aporta valor sin necesitar autonomía fuerte todavía.

**Señal del sistema real**
La operación real hoy ya existe; la autonomía profunda todavía no.

**Lo que desbloquea**
Evita que v9 subestime la base operativa ya construida.

---

# 2. Autenticación, sesiones y gobierno de accesos

## Pregunta 6/50 — Módulo: Auth

**Pregunta**
¿El sistema debe seguir operando con solo dos roles globales (`team` y `client`) o el PRD v9 debe introducir subroles formales dentro de cada dominio?

R: PUES SI PERO RECUERDA QUE DENTRO DE TEAM ABRAN DEVS, MARKETING ETC POR AHORA SOLO SOMOS 3 DEVS Y YO SOY EL ADMIN

**Por qué importa**
Hoy la autenticación real ya funciona con dos roles, pero el PRD habla de permisos más finos en varias áreas.

**Señal del sistema real**
`requireTeamSession()` y `requireClientSession()` son la frontera efectiva hoy.

**Lo que desbloquea**
Define si el siguiente salto es estabilidad o RBAC granular.

## Pregunta 7/50 — Módulo: Auth

**Pregunta**
¿Qué permisos específicos deberían existir dentro del equipo interno: owner, socio, operaciones, PM, finanzas, legal, growth, soporte, dev?

R: LA VERDAD NO LO TENGO MUY CLARO DISEÑALO TU

**Por qué importa**
Sin mapa de permisos, varios módulos seguirán mostrando información sensible a todos los usuarios de `team`.

**Señal del sistema real**
Settings ya administra accesos, pero no un árbol de permisos finos por módulo o acción.

**Lo que desbloquea**
Una política de autorización real para v9.

## Pregunta 8/50 — Módulo: Auth / Portal

**Pregunta**
¿Cada cliente debe tener un solo usuario de portal, múltiples usuarios por cuenta cliente, o ambos esquemas deben coexistir?

R: SI CADA CLIENTE UN SOLO USUARIO

**Por qué importa**
La arquitectura de portal afecta onboarding, credenciales, soporte y trazabilidad.

**Señal del sistema real**
Hoy el provisioning de acceso cliente existe, pero el modelo todavía parece girar alrededor de un acceso principal por cliente.

**Lo que desbloquea**
Define la estructura futura de `users`, permisos y experiencia portal.

## Pregunta 9/50 — Módulo: Seguridad

**Pregunta**
¿Cuál es la política de ciclo de vida de sesiones: duración, revocación remota, expiración por inactividad, cierre forzado por cambio de contraseña?

R: CIERRE FORZADO POR CAMBIO, REVOVACION REMOTA

**Por qué importa**
El sistema ya persiste sesiones reales y permite revocarlas, pero la política de seguridad todavía no está formalizada en el PRD.

**Señal del sistema real**
Settings ya permite revocar sesiones y desactivar usuarios.

**Lo que desbloquea**
Requisitos de seguridad y compliance.

## Pregunta 10/50 — Módulo: Seguridad / Auditoría

**Pregunta**
¿Qué eventos deben quedar auditados obligatoriamente en v9: login, logout, creación de accesos, revocaciones, descargas, revelado de secretos, generación de documentos, cambios de estado?

R: TODO DEBE QUEDAR AUDITADO DE MANERA ORGANIZADA Y ESCALABLE

**Por qué importa**
El PRD habla de control y seguridad, pero la capa de auditoría formal todavía no está declarada con precisión.

**Señal del sistema real**
Hay señales parciales de administración, pero no una especificación completa de audit trail transversal.

**Lo que desbloquea**
Base para políticas legales, seguridad y trazabilidad interna.

---

# 3. Portal cliente y experiencia client-facing

## Pregunta 11/50 — Módulo: Portal

**Pregunta**
¿Cuál es el objetivo principal del portal en v9: transparencia de delivery, autoservicio documental, soporte, upsell, o reducción de carga operativa del equipo?

R: QUIERO QUE SEA UN PORTAL COMPLETO DONDE EL CLIENTE PUEDA VISUALIZAR PRGORESO VER SUS DOCUMENTOS LEGALES, SUBIRNOS CONTENIDO DE SU MARCA O DE LO QUE SEA QUE NECESITEMOS DE ELLOS, NOTIFICAR COSAS, ETC QUIERO QUE SEA MUY COMPLETO 

**Por qué importa**
El portal ya hace varias cosas, pero todavía no está claro cuál es su KPI rector.

**Señal del sistema real**
El portal ya tiene overview, progress, documents, billing, credentials, files, support y chat.

**Lo que desbloquea**
Permite priorizar mejoras sin dispersión.

## Pregunta 12/50 — Módulo: Portal

**Pregunta**
¿Qué información del workspace interno puede ver el cliente y cuál nunca debería quedar expuesta aunque exista relación con su cuenta?

R: TIENE QUE SOLO ESTAR DISPONIBLE LA INFORMACION EXACTA DEL CLIENTE NADA MAS NI NADA MENOS

**Por qué importa**
El portal comparte dataset con el OS. Sin definición de frontera, el PRD puede sobreexponer datos internos.

**Señal del sistema real**
`portal-service.ts` ya deriva tareas, documentos, invoices, credentials, files, tickets y mensajes del mismo backend.

**Lo que desbloquea**
Política de visibilidad cliente vs. equipo.

## Pregunta 13/50 — Módulo: Portal / Progreso

**Pregunta**
¿Cómo debe calcularse oficialmente el progreso que ve el cliente: por tareas completadas, hitos, entregables aprobados, facturación o una mezcla ponderada?

R: UNA MEZLCA DE TODO Y MAS VE UN PASO MAS ALLA LLENA LAS MULTIPLES SITUACIONES

**Por qué importa**
El portal ya muestra progreso, pero el PRD debe declarar la fórmula como criterio de confianza.

**Señal del sistema real**
El cliente ve `progress`, fase y timeline, pero la semántica de negocio sigue abierta.

**Lo que desbloquea**
Alinea delivery, expectativa cliente y reporting.

## Pregunta 14/50 — Módulo: Portal / Soporte

**Pregunta**
¿Qué diferencia funcional debe existir entre un ticket de portal, un mensaje en chat y una solicitud documental o de accesos?

R: EL TICKET ES PARA UNA PROPUESTA DE DESARROLLO SI SE LA ACEPTAMOS SE SUMA AL PROGRESO GLOBAL, MENSAJE DE CHAT ES PARA PREGUNTARNOS ALGO TIPO WHATSAPP, Y SOLICITUD DOCUMENTAL Y DE ACCSEOS NO ENTIENDO PERO SI ASI ESTA MAS COMPLETO IMPLEMENTALO

**Por qué importa**
Si todo se parece al mismo canal, el sistema pierde SLA, priorización y claridad operativa.

**Señal del sistema real**
Portal ya permite crear tickets, enviar mensajes, subir archivos y compartir credenciales, pero la taxonomía de intención todavía no está cerrada.

**Lo que desbloquea**
Diseño futuro de soporte, routing y reporting.

## Pregunta 15/50 — Módulo: Portal / SLA

**Pregunta**
¿Qué compromisos de respuesta o SLA deben quedar visibles para el cliente dentro del portal?

R: NO ESTOY SEGURO ENCARGATE TU QUE QUEDE SUPER BIEN

**Por qué importa**
El PRD menciona soporte enterprise, pero no define tiempos, escalamiento ni señales visibles.

**Señal del sistema real**
Hoy el portal ya puede abrir soporte real, pero no comunica una política formal de servicio.

**Lo que desbloquea**
Un módulo de soporte con expectativas medibles.

---

# 4. CRM, ventas y handoff comercial-operativo

## Pregunta 16/50 — Módulo: CRM

**Pregunta**
¿Cuáles son las etapas comerciales oficiales de un deal en v9 y qué cambia operativamente cuando un deal entra a cada etapa?

R: SERIA, SIN CONTACTAR, CONTACTADO, PENDIENTE, INTERESADO, CLIENTE, PEDIENTE A PAGAR LA MITAD DEL VALOR QUE ESO ES LO QUE COBRAMOS PARA EMPEZAR

**Por qué importa**
El código tolera distintos labels de stage, pero el PRD necesita un vocabulario estable.

**Señal del sistema real**
Marketing, CRM y Automations ya interpretan `won` de varias maneras equivalentes.

**Lo que desbloquea**
Normalización de pipeline, reporting y automatizaciones.

## Pregunta 17/50 — Módulo: CRM / Handoff

**Pregunta**
¿Qué debe ocurrir automáticamente cuando un deal se gana: crear proyecto, evento kickoff, portal, documentos iniciales, factura, workspace, credenciales, o no siempre?

R: EL USUARIO DEL PORTAL UNICAMENTE SE CREA CJANDO EL CLIENTE PAGA LA MITAD DEL VAMLR TOTAL DEL PROYETO , ANTERIOR A ESO YA SE LE HABRAN CREADO DOCUMENTOS COMO EL OFICIO  PROUESSTA ETC, HASTS QUE NO PAGUEN LA MITAD NO TRABAJAMOS OFICIALMENTE CON ELLOS PERO ESO NO SIGNIFICA QUE HAYAMOS HECHO CONTENIDO PARA ELLOS COMO DOCUMENTOS, AFICHES, PROPUESTAS ETC

**Por qué importa**
El sistema ya detecta gaps entre deal ganado y operación, pero el PRD debe volver eso una política explícita.

**Señal del sistema real**
Automations ya detecta `wonDealsWithoutProject` como brecha relevante.

**Lo que desbloquea**
Define el playbook de cierre comercial a delivery.

## Pregunta 18/50 — Módulo: CRM / Pricing

**Pregunta**
¿Qué modelos comerciales debe soportar oficialmente el sistema: one-time, MRR, ARR, retainer, horas, fee de setup, combinaciones híbridas?

R: COMBINACIONES HIBRIDAS

**Por qué importa**
Deals, invoices, documentos y finanzas dependen de esa taxonomía.

**Señal del sistema real**
Los deals ya almacenan `billingModel`, pero no existe todavía una definición de producto comercial canónica en el PRD.

**Lo que desbloquea**
Consistencia entre ventas, contratos y revenue.

## Pregunta 19/50 — Módulo: CRM / Cliente

**Pregunta**
¿Cuándo se considera que un cliente “existe” oficialmente en el sistema: al crear el lead, al crear el deal, al firmar contrato, al crear proyecto o al provisionar portal?

R: CUANOD SE CONTACTA Y ESTA INTERESADO CUANDO ESTE EN ESE ESTADO AHI SI

**Por qué importa**
Hoy ya se pueden crear clientes desde varios caminos.

**Señal del sistema real**
CRM, Projects, Access Settings y Document generation pueden terminar creando o actualizando cliente.

**Lo que desbloquea**
Evita duplicados conceptuales y problemas de onboarding.

## Pregunta 20/50 — Módulo: CRM / Gobierno comercial

**Pregunta**
¿Quién puede editar valor, probabilidad y owner de un deal, y qué cambios deberían quedar auditados o requerir aprobación?

R: ESO DEBERÍA SER AUTOMATICO/MANUAL Y TOSOS DEBERAN QUEDAR AUDITADOS Y LO MAS CRITICO REQUERIR APROBACIÓN 

**Por qué importa**
El pipeline influye directamente en dashboards, marketing, forecast y handoff.

**Señal del sistema real**
Hay details y creación real, pero la política de modificación sensible no está definida.

**Lo que desbloquea**
Gobierno comercial y confiabilidad del forecast.

---

# 5. Proyectos, tareas y delivery

## Pregunta 21/50 — Módulo: Projects

**Pregunta**
¿Cuál es la unidad de ejecución oficial en delivery: proyecto, epic, milestone, sprint, tarea, bloque de trabajo o combinación?

R: LA VERFAD NO LO TENGO MUY CLARO PERO ME GUSTARÍA QUE QUEDE COMO EN EL PRD ASI DE COMPLETO 

**Por qué importa**
El PRD menciona Kanban, dependencias, timeline y editor tipo bloques, pero el código hoy está más centrado en proyecto y tarea.

**Señal del sistema real**
`projects` y `tasks` son hoy las entidades operativas dominantes.

**Lo que desbloquea**
Define el nivel de profundidad real del módulo de delivery.

## Pregunta 22/50 — Módulo: Projects / Ownership

**Pregunta**
¿Cada tarea debe tener obligatoriamente owner, o el sistema puede tolerar backlog sin asignación durante ciertos estados?

R: SI SI PUEDE TOLERAR BACKLOG SIN ASIGNACUÓN 

**Por qué importa**
Team y carga operativa dependen de esa definición.

**Señal del sistema real**
`TeamWorkspaceScreen` ya detecta `unassignedTasks` como brecha operacional.

**Lo que desbloquea**
Estándar de calidad operativa para backlog y ejecución.

## Pregunta 23/50 — Módulo: Projects / Cliente

**Pregunta**
¿Qué parte del detalle de proyecto debe ver el cliente en portal: tareas completas, solo hitos, solo entregables, o una vista resumida distinta?

R. PUEDE SER CUALQUIERA DE LOS 4 DEPENDE DE COMO LO CONFIGUREMOS NOSOTROS

**Por qué importa**
Portal y OS ya comparten backend, pero no necesariamente deben compartir la misma narrativa de delivery.

**Señal del sistema real**
El portal ya expone tareas y timeline, pero el alcance semántico no está cerrado.

**Lo que desbloquea**
Una definición clara de transparencia de proyecto.

## Pregunta 24/50 — Módulo: Projects / Eventos

**Pregunta**
¿Qué eventos deben considerarse obligatorios para que un proyecto se considere correctamente activado: kickoff, revisiones, demos, entrega, cierre, facturación?

R: LA FACTURA DE COBRO DE LA MITAD DEL VALOR O SI ES UN PROYECTO DE COMUNIDAD PUES NO ES NECESARIO

**Por qué importa**
Hoy Automations ya detecta proyectos sin kickoff futuro.

**Señal del sistema real**
`projectsWithoutKickoff` ya se trata como gap del sistema.

**Lo que desbloquea**
Reglas automáticas y checklist de activación de proyecto.

## Pregunta 25/50 — Módulo: Projects / Calidad

**Pregunta**
¿Qué significa oficialmente que una tarea esté en `review` o `done` y quién tiene autoridad para moverla?

R: REVIEW ES CUANDO ESTA HECHA Y ESTA SIENDO REVISADA DONE ES CUANDO YA ESTA REVISADA

**Por qué importa**
Sin definición formal, las métricas de progreso y carga pierden valor.

**Señal del sistema real**
Las columnas reales hoy ya dependen de `todo`, `in_progress`, `review` y `done`.

**Lo que desbloquea**
Consistencia en reporting y automatizaciones futuras.

---

# 6. Documentos, legal y versionado

## Pregunta 26/50 — Módulo: Documents

**Pregunta**
¿Cuáles tipos documentales son obligatorios en v9 y cuáles pueden seguir siendo opcionales o experimentales?

R: HAY VARIOS TU DECIDIRAS POR SENTIDO COMUN CUALES SON OBLIGATORIOS, ACCESOS FINALES, BIENVENIDA, CONTRATO, CUENTA DE COBRO, ENTREGA, MANTENIMNIENTO, MANUAL DE USUARIO, OFICIO, PROPUESTA-MEJORAS, SOW

**Por qué importa**
El sistema ya genera y versiona documentos, pero el catálogo de negocio todavía necesita jerarquía.

**Señal del sistema real**
Hoy existen templates, save, versioning y pipelines diferenciados para universales y legacy.

**Lo que desbloquea**
Define el alcance real del generador y del repositorio documental.

## Pregunta 27/50 — Módulo: Documents / Origen

**Pregunta**
¿Cuál es la fuente de verdad de un documento comercial/legal: draft del generador, registro en `documents`, PDF generado, blob público o expediente legal?

R: NO ENTIENDO MUY BIEN ESTA HAZLO DE MEJOR FORMA, CREO QUE TODOS O NO SE

**Por qué importa**
Hoy ya coexisten varias representaciones del mismo documento.

**Señal del sistema real**
Hay draft estructurado, HTML versionado, PDF generado y storage externo.

**Lo que desbloquea**
Modelo documental estable para v9.

## Pregunta 28/50 — Módulo: Legal / Flujo

**Pregunta**
¿Qué estados oficiales debe tener un documento legal/comercial: draft, review, sent, signed, archived, expired, void, otros?

R: SI TODOS ESOS TAMBIEN TEN EN CUENTA PARA CUANDO UN CLIENTE TIENE UN CONTRATO DE MENSUALIDAD MENSUAL O CUANDO ALGUN CLIENTE DE UNA SAAS QUE HAGAMOS

**Por qué importa**
Legal y Documents ya muestran estados, pero el PRD no define la máquina de estados completa.

**Señal del sistema real**
Legal trata `draft`, `review` y `sent` como estados que requieren atención.

**Lo que desbloquea**
Automatización futura, reporting y control legal.

## Pregunta 29/50 — Módulo: Legal / Billing

**Pregunta**
¿Toda factura debería requerir un documento soporte ligado, o solo ciertos tipos de operación?

R: SI EXACTO DEBE REQUERIR DOCUMENTO LIGADO

**Por qué importa**
El sistema ya detecta `invoicesWithoutDocument` como gap importante.

**Señal del sistema real**
Legal y Automations usan esa relación como señal de madurez operativa.

**Lo que desbloquea**
Política clara entre finanzas y compliance.

## Pregunta 30/50 — Módulo: Documents / Cliente

**Pregunta**
¿Qué documentos deben ser visibles automáticamente en portal y cuáles requieren aprobación manual antes de compartirse?

R: TU DEFINE ESO: ACCESOS FINALES, BIENVENIDA, CONTRATO, CUENTA DE COBRO, ENTREGA, MANTENIMNIENTO, MANUAL DE USUARIO, OFICIO, PROPUESTA-MEJORAS, SOW

**Por qué importa**
Portal, legal y docs ya están unidos por backend, pero no por política editorial.

**Señal del sistema real**
El portal ya puede abrir documentos/contratos reales por overlay o enlace.

**Lo que desbloquea**
Un flujo serio de publicación documental hacia cliente.

---

# 7. Storage, vault y knowledge hub

## Pregunta 31/50 — Módulo: Storage

**Pregunta**
¿Qué tipos de archivo deben ir obligatoriamente a Drive, cuáles a storage local/propio y cuáles deberían poder vivir en cualquiera según contexto?

R: EN DRIVE DEBEN IR ARCHIVOS SUPERIORES A 5 MB Y ADEMAS PON UN CONTADOR UNA BARRA PARA VER EL ESPACIO USADO Y DISPONIBLE TANTO DE NEON COMO DE DRIVE

**Por qué importa**
El backend ya soporta target `local`, `drive` y `auto`, pero el criterio de negocio no está formalizado.

**Señal del sistema real**
`asset-storage.ts` ya implementa storage híbrido.

**Lo que desbloquea**
Política clara de costos, performance y compliance.

## Pregunta 32/50 — Módulo: Vault

**Pregunta**
¿Qué categorías de credenciales deben existir oficialmente y cuál es la política de exposición para cada una?

R: DE TODO TIPO QUIERO UNA BOVEDA SOFISTICADA COMO ESTA EN EL PRD IMPLEMENTALO BIEN

**Por qué importa**
El PRD promete una bóveda sofisticada, pero el modelo real todavía es genérico.

**Señal del sistema real**
Hoy las credenciales guardan `title`, `scope`, `status`, `secret`, `linkUrl` y relación con cliente/proyecto.

**Lo que desbloquea**
Diseño real del vault y futura segmentación por permisos.

## Pregunta 33/50 — Módulo: Vault / Seguridad

**Pregunta**
¿Qué acciones sobre secretos deben quedar restringidas o auditadas: crear, editar, revelar, copiar, exportar, compartir, rotar?

R: RESTRINGIDAS EDITAR AUIDTADAS TODAS

**Por qué importa**
Sin política explícita, el vault seguirá siendo útil pero insuficiente como pieza de seguridad seria.

**Señal del sistema real**
La auditoría confirmó persistencia y relación, pero no una política cerrada de secretos.

**Lo que desbloquea**
Una definición usable de seguridad operacional.

## Pregunta 34/50 — Módulo: Knowledge Hub

**Pregunta**
¿El Hub debe seguir siendo un índice derivado de documentos/archivos/links de credenciales o debe convertirse en un producto independiente con entidad propia de “link” y pipeline de ingestión?

R: LA SEGUNDA UN PRODUCTO INDEPENDIENTE CON CAPACIDAD DE LOS LINKS, CUENTAS DE STREAMING STEAM, LINKS DE TIKTOK, REPOS DE GITHUB ETC

**Por qué importa**
El PRD básico lo describe como una capa propia de conocimiento, pero el código hoy no llega a ese nivel.

**Señal del sistema real**
`HubWorkspaceScreen` agrega documentos, archivos y credenciales con `linkUrl`; no se observó entidad autónoma de link.

**Lo que desbloquea**
Decisión de arquitectura y roadmap realista.

## Pregunta 35/50 — Módulo: Hub / IA

**Pregunta**
¿El autoscraping y resumen IA de URLs es requisito de v9, o debe quedar explícitamente como capacidad futura no comprometida para el release operativo?

R: COMO CAPACIDAD FUTURA PERO AL MENOS SI ME GUSTARIA QUE PUSIERA TIPO DE QUE TRATA EL LINK COMO CUANDO SE ENVIA UN LINK POR WHATSAPP QUE UNO PUEDE VER UNA IMAGEN Y UNA DESCRIPCION CORTA

**Por qué importa**
Es una de las promesas más visibles del PRD, pero no aparece cerrada en el sistema real auditado.

**Señal del sistema real**
No se encontró flujo real de ingestión web con scraping en el barrido principal.

**Lo que desbloquea**
Evita sobreprometer capacidades de conocimiento que aún no existen.

---

# 8. Finanzas, billing y salud del negocio

## Pregunta 36/50 — Módulo: Finance

**Pregunta**
¿Cuál es la definición oficial de “caja disponible” y “runway” dentro de Vertrex OS?

R: NO ENTIENDO LO DEJO A TU CRITERIO

**Por qué importa**
El sistema ya calcula ambas, pero el PRD necesita una fórmula de negocio estable.

**Señal del sistema real**
Finance usa transacciones reales e invoices para métricas visibles.

**Lo que desbloquea**
Confiabilidad del dashboard financiero y futura capa CFO.

## Pregunta 37/50 — Módulo: Finance / Billing

**Pregunta**
¿Qué estados oficiales debe tener una invoice y qué acción cambia cada estado?

R: DEBIENDO, PAGADO, POR PAGAR ETC HAZLO COMPLETO TODO COMPLETO

**Por qué importa**
Billing, portal, legal y OpenClaw dependen de esta taxonomía.

**Señal del sistema real**
Hoy se usan `pending`, `overdue`, `paid` y otros estados relacionados, pero falta política de negocio formal.

**Lo que desbloquea**
Una máquina de estados coherente para cuentas por cobrar.

## Pregunta 38/50 — Módulo: Finance / Portal

**Pregunta**
¿Qué detalle financiero debe ver el cliente: solo totales pagado/pendiente, historial completo, facturas descargables, fechas de vencimiento, métodos de pago, promesas de pago?

R: SI TODO

**Por qué importa**
Portal ya expone billing, pero el nivel de transparencia exacto no está fijado.

**Señal del sistema real**
La data financiera ya se consume en portal y en finanzas internas.

**Lo que desbloquea**
Diseño real del módulo Billing en v9.

## Pregunta 39/50 — Módulo: Finance / Revenue attribution

**Pregunta**
¿El PRD v9 debe considerar que marketing atribuye revenue real solo cuando un deal cambia de etapa, cuando una factura se paga o cuando un contrato se firma?

R: AMBAS

**Por qué importa**
El marketing actual ya estima ROAS con heurísticas, pero la atribución de negocio no está cerrada.

**Señal del sistema real**
Marketing hoy cruza deals y gasto categorizado, no necesariamente cobro real confirmado.

**Lo que desbloquea**
Una definición seria de growth intelligence.

## Pregunta 40/50 — Módulo: Finance / Gobernanza

**Pregunta**
¿Qué transacciones puede registrar manualmente el equipo y cuáles deberían venir de integraciones o procesos más controlados?

R: SI POR AHORA SERAN MANUALES PERO DEJA UNA BASE HECHA CUANDO TENGAMOS INTREGRACIONES O PROCESOS CONTROLADOS

**Por qué importa**
Hoy registrar transacciones es un flujo directo y muy útil, pero puede desalinearse si no hay política clara.

**Señal del sistema real**
`RegisterTransactionDialog` ya persiste ingresos/gastos reales.

**Lo que desbloquea**
Gobierno financiero y calidad del ledger.

---

# 9. IA, OpenClaw, memoria y autonomía

## Pregunta 41/50 — Módulo: AI Strategy

**Pregunta**
¿Cuál es el rol real de IA en v9: asistente explicativo, copiloto operativo, ejecutor supervisado o agente autónomo?

R: UNA COMBINACION DE Ejecutor supervisado o agente autónomo PERO POR AHORA COMO NO TENEMOS DINERO NO TENEMOS PARA UN MODELO

**Por qué importa**
El PRD actual y el código real todavía están en niveles muy distintos de autonomía.

**Señal del sistema real**
La base de datos, el snapshot, la memoria y la API OpenClaw existen; la autonomía fuerte todavía no.

**Lo que desbloquea**
Evita que el PRD confunda intención futura con capacidad actual.

## Pregunta 42/50 — Módulo: OpenClaw

**Pregunta**
¿Qué acciones puede ejecutar OpenClaw sin aprobación humana y cuáles siempre deben requerir confirmación?

R: LO DEJO A TU CRITERIO ESTO ES BASTANTE LOGICO SOLO QUE NO RECUERDO CUALES

**Por qué importa**
La API ya permite crear/actualizar entidades reales. Falta la política de control.

**Señal del sistema real**
OpenClaw ya puede mutar clientes, proyectos, tareas, finanzas, documentos y memoria.

**Lo que desbloquea**
Marco de seguridad para agentic operations.

## Pregunta 43/50 — Módulo: Memoria

**Pregunta**
¿Qué tipos de memoria deben existir oficialmente: global, cliente, proyecto, sesión, procedimiento interno, contexto legal, contexto comercial?

R: TODO

**Por qué importa**
Sin taxonomía de memoria, la capa AI tenderá a crecer de forma caótica.

**Señal del sistema real**
`aiMemory` ya existe y OpenClaw puede escribir entradas, pero el modelo semántico es todavía abierto.

**Lo que desbloquea**
Diseño usable de memoria empresarial en v9.

## Pregunta 44/50 — Módulo: AI / Portal

**Pregunta**
¿El chatbot del portal debe responder solo desde material documental aprobado del cliente o también desde contexto operativo interno resumido por el equipo?

R: SOLO DESDE EL MATERIAL DOCUMENTADO Y LOS DATOS QUE NOSOTROS HALLAMOS PERMITIDO ACCEDER A IA DEL PORTAL, A VECES SOLO LE DAMOS ACCESOS A CIERTAS COSAS ENTIENDES?

**Por qué importa**
Esta es una de las promesas más delicadas del PRD por riesgo de alucinación o sobreexposición.

**Señal del sistema real**
No se observó aún un bot entrenado por SOW/manuales; sí existe la infraestructura base para mensajes y documentos.

**Lo que desbloquea**
Una política segura de IA client-facing.

## Pregunta 45/50 — Módulo: AI / Explicabilidad

**Pregunta**
Cuando la IA recomiende o ejecute algo, ¿qué nivel de trazabilidad debe mostrar: fuente de datos, reglas usadas, tools invocadas, confianza, diff propuesto, historial?

R: TODO HAZLO SUPER COMPLETO

**Por qué importa**
El valor de un OS con IA depende tanto de confianza como de capacidad.

**Señal del sistema real**
OpenClaw ya devuelve `toolsUsed` sugeridas y la consola AI ya agrega señales operativas.

**Lo que desbloquea**
Un diseño serio de interacción humano-agente.

---

# 10. Automatizaciones, analytics, team y gobierno del roadmap

## Pregunta 46/50 — Módulo: Automations

**Pregunta**
¿Cuáles automatizaciones deben ser obligatorias en v9 porque ya responden a gaps visibles del sistema real?

R: NO HAY OBLIGATORIAS POR AHORA, TODO ESO SE CONFIGURA MANUALMENTE PERO EL OS DEBE SER CAPAZ DE SOPORTARLO

**Por qué importa**
Hoy Automations ya detecta problemas concretos, pero aún no ejecuta playbooks completos.

**Señal del sistema real**
Hay señales claras para:
- deal ganado sin proyecto
- cliente con proyecto sin portal
- proyecto sin kickoff
- invoice sin documento
- ticket sin proyecto

**Lo que desbloquea**
Una primera ola realista de automatizaciones de alto impacto.

## Pregunta 47/50 — Módulo: Analytics

**Pregunta**
¿Qué métricas estratégicas deben considerarse “source of truth” en v9 y cuáles pueden seguir siendo indicadores exploratorios?

R: NO SE LO DEJO A TU CRITERIO HAZLO LO MEJOR POSIBLE

**Por qué importa**
El PRD promete BI profunda, pero el sistema real todavía mezcla métricas firmes con señales interpretativas.

**Señal del sistema real**
Ya hay snapshot, operational stats y varios módulos de lectura, pero no un contrato formal de métricas corporativas.

**Lo que desbloquea**
Base para dashboards consistentes y fiables.

## Pregunta 48/50 — Módulo: Team / Capacity

**Pregunta**
¿Cómo quiere Vertrex medir capacidad del equipo en v9: tareas activas, horas, puntos, skill-demand fit, carga por cliente, carga por proyecto o mezcla?

R: DE TODO UN POCO O TODO EN GENERAL

**Por qué importa**
Hoy el sistema ya mide carga por owner de forma simple, pero el PRD promete mucho más.

**Señal del sistema real**
`TeamWorkspaceScreen` trabaja sobre owners y volumen de tareas, no sobre una matriz de capacidad formal.

**Lo que desbloquea**
Una definición seria de team intelligence.

## Pregunta 49/50 — Módulo: Prioridad de roadmap

**Pregunta**
Si solo se pudieran financiar tres grandes incrementos después de la base operativa actual, ¿cuáles serían: portal premium, automatizaciones reales, billing/legal profundo, IA agentic, hub de conocimiento autónomo, integraciones externas?

R: COMO TE DIJE PARA QUE ESTE SISTEMA SE CONSIDERE COMPLETO TODOS LOS MODULOS DEBEN FUNCIONAR 

**Por qué importa**
El sistema ya tiene demasiadas superficies para avanzar todas al mismo tiempo sin diluir impacto.

**Señal del sistema real**
La base actual ya distribuye valor en muchos módulos, pero la siguiente ola necesita foco.

**Lo que desbloquea**
Priorización ejecutiva del PRD v9.

## Pregunta 50/50 — Módulo: Definición de éxito v9

**Pregunta**
¿Qué evidencias concretas demostrarían que Vertrex OS v9 funciona de verdad en negocio real: horas ahorradas, menos fricción con clientes, menos herramientas externas, mejor cobranza, menos gaps de handoff, mayor trazabilidad, mayor velocidad operativa?

R: SI TODO ESO QUE NOS AYUDE A ORGANIZARNOS A NOSOTROS Y AYUDE A NUESTROS CLIENTES Y QUE SE SIENTA COMO UNA SISTEMA PREMIUM CREADO POR UNA COMPAÑIA DE SOFTWARE DE RENOMBRE Y NO QUE SE SIENTA ALGO BASICO

**Por qué importa**
Sin criterio de éxito medible, el PRD volverá a evaluar por estética o ambición, no por impacto operacional.

**Señal del sistema real**
La base actual ya permite medir mejoras reales en varias áreas, especialmente acceso, delivery, documentos, soporte y finanzas.

**Lo que desbloquea**
La sección de objetivos, KPIs y aceptación del PRD v9.0.

---

# Cierre

Estas 50 preguntas no buscan inventar módulos nuevos, sino **cerrar decisiones de producto sobre lo que el sistema ya demuestra parcialmente en código**.

La recomendación para la siguiente etapa es:

- usar primero este documento como entrevista estructurada
- consolidar respuestas por módulo
- después reescribir el PRD v9.0 con tres etiquetas obligatorias por feature:
  - `Existe real`
  - `Existe parcial`
  - `Objetivo futuro`

Así el PRD quedará alineado con la realidad técnica actual y con el roadmap verdadero de Vertrex OS.
