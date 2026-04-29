# Roadmap de implementación — PRD v9 vs sistema actual

Fecha: 2026-04-27
Base comparada:

- `PRD_V9_VERTREX_OS.md`
- `AUDITORIA_VERTREX_OS_REAL.md`
- implementación actual en `src/`

---

# 1. Resumen ejecutivo

El sistema actual ya tiene un núcleo operativo real y usable:

- auth y sesiones reales
- clientes, proyectos, tareas y deals persistidos
- documentos y generación real
- finanzas operativas
- portal cliente funcional
- vault/hub/IA con base parcial

La brecha principal frente al PRD v9 no es “falta total de producto”, sino **falta de formalización canónica** en cuatro capas:

- estados y vocabulario oficial del negocio
- permisos/gobierno/auditoría
- entidades nuevas del PRD que hoy viven implícitas en metadata o vistas derivadas
- reglas de handoff comercial → operación → portal

Tomando `VERTREX_OS_MEJORAS_V1.md` como insumo complementario, el roadmap adopta solo mejoras que:

- fortalecen el software real sin romper el contrato actual
- no duplican modelos ya elegidos en el código
- pueden ordenarse por cortes ejecutables y verificables

Quedan fuera, por ahora, propuestas demasiado destructivas o prematuras como soft delete universal inmediato, reemplazo del modelo actual de capacidades por una tabla paralela distinta, o superficies visuales complejas sin la base relacional previa.

---

# 2. Hallazgos por módulo

## 2.1 Access / Auth

### Estado actual

- existe `user_role = team|client`
- existe subrol formal persistido para `team`
- existe modelo explícito de capacidades por módulo persistido en `users.capabilities`
- hay sesiones reales y revocación
- existe tabla base `audit_events` y auditoría inicial para auth, access y varias mutaciones operativas

### Gap contra PRD

- falta enforcement centralizado tipo `can()` en todos los módulos sensibles
- faltan permisos finos por verbo/acción crítica más allá del primer corte
- faltan tokens temporales delegados de portal y superficies admin de revisión de auditoría

### Decisión técnica

- el primer corte estructural ya fue implementado con migración real
- el siguiente paso debe concentrarse en enforcement, no en rediseñar otra vez el modelo persistido

---

## 2.2 CRM / Deals

### Estado actual

- `deals.stage` es `text`
- el sistema usa stages libres; el overlay crea deals con `lead`
- CRM visual agrupa por `discovery/proposal/negotiation/won`
- no existe canon oficial alineado al PRD

### Gap contra PRD

- faltan etapas oficiales:
  - `sin_contactar`
  - `contactado`
  - `pendiente`
  - `interesado`
  - `propuesta_enviada`
  - `pendiente_anticipo_50`
  - `cliente_activo`
  - `pausado`
  - `perdido`

### Decisión técnica

- **sí puede iniciarse ya sin migración** porque `stage` ya es texto
- hay que centralizar constantes, normalización, labels y agrupación

---

## 2.3 Projects / Delivery

### Estado actual

- existen `projects` y `tasks`
- estados de tarea reales: `todo`, `in_progress`, `review`, `done`
- no existen `blocked` ni `archived` en el enum real
- no existen `milestones` como entidad

### Gap contra PRD

- faltan milestones
- faltan estados extendidos de tarea
- falta regla explícita de activación formal y kickoff como señal operativa
- falta perfil de visibilidad del proyecto en portal

### Decisión técnica

- milestones y estados nuevos requieren **cambio de esquema**
- reglas de activación/kickoff y perfiles visibles pueden empezar vía metadata compatible

---

## 2.4 Documents / Legal

### Estado actual

- `documents` es canónico y real
- estados actuales: `draft`, `review`, `approved`, `sent`, `signed`
- no existen `published`, `archived`, `expired`, `void` en enum real
- existe `document_requests`, pero solo para solicitudes documentales

### Gap contra PRD

- faltan estados documentales extendidos
- falta gobierno de publicación al portal
- falta clasificación fuerte de tipos documentales y vigencia/renovación

### Decisión técnica

- estados nuevos requieren **migración de enum**
- publicación/vigencia/visibilidad pueden empezar vía metadata

---

## 2.5 Finance / Billing

### Estado actual

- invoices reales con estados: `pending`, `paid`, `overdue`, `cancelled`
- no existen `draft`, `issued`, `partially_paid`, `disputed`, `canceled`, `waived`
- el portal ya muestra billing real

### Gap contra PRD

- falta modelo completo de estados de invoice
- falta separar mejor activación comercial vs activación operativa
- falta enforcement fuerte de invoice-documento

### Decisión técnica

- estados completos requieren **migración de enum**
- reglas de negocio y validaciones pueden empezar ya en servicio/UI

---

## 2.6 Portal cliente

### Estado actual

- portal real con overview, progress, documents, billing, credentials, files, support y chat
- existen endpoints reales para tickets, mensajes, archivos y credenciales
- no existe capa formal de `requests` estructurados más allá de ticket/message

### Gap contra PRD

- faltan request types explícitos:
  - documental
  - acceso
  - asset
  - aprobación
- faltan SLA visibles modelados
- falta perfil configurable de transparencia por proyecto

### Decisión técnica

- request types pueden empezar **sin migración** usando metadata en tickets y/o `document_requests`
- SLA y perfiles pueden empezar por configuración/metadata

---

## 2.7 Storage / Assets

### Estado actual

- existe storage híbrido y upload real
- el sistema ya resuelve asset href y soporta distintos targets
- no hay política formal visible de tamaño → Drive

### Gap contra PRD

- falta política explícita 5 MB / Drive
- faltan indicadores de capacidad visibles integrados a UI

### Decisión técnica

- se puede avanzar **sin migración**

---

## 2.8 Vault

### Estado actual

- las credenciales viven en `portal_credentials`
- hoy manejan `title`, `scope`, `status` y metadata
- no existe categoría formal del vault
- ya existe auditoría fundacional sobre creación y publicación operativa, pero no sobre reveal/copy/export/rotate

### Gap contra PRD

- faltan categorías oficiales
- faltan permisos finos y separación explícita metadata/secreto
- falta historial fuerte de acciones sensibles y rotación

### Decisión técnica

- categorías pueden empezar **sin migración** usando metadata
- la auditoría base ya existe; el siguiente corte debe ampliar cobertura y separación de secretos

---

## 2.9 Knowledge Hub

### Estado actual

- el Hub agrega `documents`, `files` y `credentials.linkUrl`
- no existe entidad `link`
- hoy es una vista derivada, no un módulo autónomo

### Gap contra PRD

- falta entidad canónica `link`
- faltan previews ricos y metadata formal

### Decisión técnica

- transición inicial puede empezar **sin migración** enriqueciendo metadata de credenciales/link
- versión correcta final requiere **tabla `links`**

---

## 2.10 IA / OpenClaw / Automatizaciones

### Estado actual

- IA responde con snapshot real
- hay memoria empresarial y panel AI
- hay señales relacionales útiles
- no hay modelo formal de aprobación/ejecución auditada

### Gap contra PRD

- falta política explícita de acciones con/sin aprobación
- falta historial de acciones de IA como evento auditable
- faltan playbooks formales de automatización

### Decisión técnica

- política y UI pueden iniciar **sin migración**
- auditoría completa requiere **modelo persistente de eventos**

---

# 3. Restricción técnica clave

El repo ya tiene migraciones SQL materializadas en `drizzle/`, incluyendo el corte fundacional reciente de acceso/auditoría (`0001_strong_bullseye.sql`).

Por lo tanto, la implementación debe dividirse en dos carriles:

- **Carril A — compatible sin migración**
- **Carril B — requiere migración Drizzle/Neon**

 No mezclar ambos en un solo salto reduce riesgo de romper el sistema actual.

## Actualización autorizada por el usuario

- la base actual no tiene operación productiva cargada
- solo existen credenciales/admin base y una cuenta demo de cliente
- quedan autorizadas migraciones de esquema cuando ayuden a alinear el sistema con el PRD

La implementación debe seguir cuidando dos cosas:

- preservar el acceso admin existente
- no depender de resets destructivos si el cambio puede hacerse de forma incremental

## 3.1 Curación adoptada desde `VERTREX_OS_MEJORAS_V1.md`

Se aceptan como backlog formal del roadmap estas líneas:

- capa relacional extensible (`entity_relations`) cuando toque formalizar cruces complejos
- `business_events` y snapshots históricos como segunda capa sobre la auditoría técnica
- milestones, dependencias y deliverables como delivery real de primer nivel
- requests tipados, SLA visibles, feed de actividad y aprobaciones del portal
- vigencia/renovación documental, promesas de pago y alertas financieras
- vault en dos capas (metadata vs secreto), rotación y health checks
- cola persistida de acciones IA, playbooks y logs de ejecución
- dashboards de salud, health score de cliente y vistas operativas como `/os/health` y `Mi día`
- endurecimiento selectivo: optimistic locking, rate limits, detección de sesiones sospechosas y cifrado de secretos

Se difieren hasta tener base suficiente:

- soft delete universal en todas las entidades
- grafo visual complejo antes de consolidar la capa relacional
- offline/optimistic UI generalizada antes de cerrar contratos server-side

## 3.2 Curación adoptada desde `VERTREX_OS_MEJORAS_V2.md`

Se aceptan como backlog formal y compatible con la visión actual estas líneas:

- plantillas operativas/comerciales de proyecto, deal y onboarding cuando ya exista base relacional mínima reutilizable
- perfil operativo del cliente, contactos por cuenta e interacciones offline estructuradas
- historial unificado por cliente y changelog visible al cliente sobre cambios de alcance
- versionado formal de propuestas/SOW y diff visual como evolución del pipeline documental
- `billing_schedules` manual-first y lectura de revenue recurrente
- salud modular por módulo, `risk registry` y API de health compatible con snapshot actual
- onboarding guiado del cliente en portal y resumen de reentrada
- soporte multiproyecto por cuenta y vista de portafolio por cliente
- delivery checklists, QA de cierre y preparación de margen real por proyecto
- `settings` centralizado, exports por módulo y webhooks outbound configurables

Se aceptan de forma más tardía o condicionada:

- threads internos por entidad después de consolidar timeline/anotaciones internas y notificaciones
- task creation desde menciones o comandos internos solo cuando exista mejor gobernanza de comentarios
- múltiples portal users como baseline por defecto; por ahora se mantiene un solo usuario cliente real por cuenta y contactos adicionales desacoplados del acceso
- vendors, costos internos avanzados y diff documental rico cuando la capa financiera/legal esté más estable

---

# 4. Fases de implementación

## Fase 0 — Canon operacional sin migración

Objetivo: alinear el lenguaje del producto con el PRD sin romper el esquema actual.

### Entregables

- centralizar constantes canónicas de negocio
- normalizar stages comerciales del PRD en servicios y UI
- ajustar el CRM y el overlay de deals al vocabulario oficial
- preparar request channels estructurados sobre metadata compatible
- preparar categorías de vault y links enriquecidos sobre metadata
- preparar helpers de política IA/aprobación visibles en UI/backend

### Riesgo

- bajo a medio

### Dependencia

- ninguna migración DB

---

## Fase 1 — Gobierno comercial-operativo compatible

Objetivo: empezar a aplicar reglas del PRD usando validaciones y metadata.

### Entregables

- regla de activación comercial por anticipo del 50% como señal de negocio
- freno/control sobre provisionamiento temprano de portal
- signals de kickoff pendiente y gap operativo
- enforcement lógico de invoice-documento cuando aplique
- request types visibles en portal/OS usando tickets + metadata
- SLA visibles sobre requests compatibles
- primer checklist/wizard de activación compatible
- primera capa de onboarding guiado del cliente en portal
- primeras señales de salud/riesgo derivadas sin migración

### Riesgo

- medio

### Dependencia

- Fase 0 completada

---

## Fase 2 — Migraciones estructurales del PRD

Objetivo: llevar el modelo real al nivel de formalidad que exige el PRD.

### Entregables

- subroles de `team` y permisos por capacidad
- tabla/eventos de auditoría transversal
- primera cobertura real sobre auth, access y mutaciones operativas
- estados extendidos de invoice
- estados extendidos de documento
- estados extendidos de tarea
- entidad `milestone`
- entidad `link`
- `entity_relations` y/o `business_events` cuando toque el segundo corte estructural
- snapshots documentales y entidad persistida para aprobaciones IA

### Riesgo

- alto

### Dependencia

- generar/push de Drizzle y revisión de Neon

---

## Fase 3 — Profundización de portal, vault e hub

Objetivo: convertir módulos parciales en módulos premium.

### Entregables

- perfiles de visibilidad por proyecto/cliente
- previews ricos de links
- categorías y acciones avanzadas de vault
- requests documentales/aprobaciones dentro del portal
- SLAs visibles y estados operativos por canal
- feed de actividad del cliente
- onboarding cliente persistido y resumen de reentrada
- selector y resumen multiproyecto por cuenta cliente
- health checks de vault y accesos pendientes
- colecciones publicables del hub

---

## Fase 4 — IA supervisada y automatizaciones auditables

Objetivo: crecer la capa IA sin vender autonomía falsa.

### Entregables

- catálogo explícito de acciones IA con/sin aprobación
- cola persistida de decisiones IA
- playbooks automáticos sugeridos
- confirmaciones humanas para acciones críticas
- log de ejecución de automatizaciones

---

## Fase 5 — Analytics, health operacional y experiencia interna

Objetivo: volver visible el estado real del negocio y del equipo sin depender de intuición manual.

### Entregables

- dashboard ejecutivo con métricas canónicas y health score por cliente
- health score por proyecto y vista de portafolio por cliente
- adopción del portal, funnel comercial y cobertura invoice-documento
- vista `/os/health` con riesgos accionables
- indicadores de salud por módulo en sidebar y shell del OS
- vista `Mi día` y feed de actividad reciente del equipo
- command palette global

---

## Fase 6 — Resiliencia y seguridad empresarial selectiva

Objetivo: endurecer el sistema en puntos críticos sin introducir complejidad destructiva innecesaria.

### Entregables

- cifrado server-side de secretos del vault
- optimistic locking en entidades de edición frecuente
- rate limiting en auth/vault/acciones sensibles
- detección de sesiones concurrentes sospechosas
- exportes y backups operativos por módulo

---

# 5. Orden recomendado de ejecución

## 5.1 Ejecutar ahora

- Fase 0 completa
- sub-bloques compatibles de Fase 1
- bloque inicial de Fase 2 sobre roles/capacidades y auditoría fundacional
- siguiente corte compatible de portal request typing + SLA + señales operativas
- adelantar un corte compatible de Fase 5 para salud modular y risk registry, porque reutiliza snapshot y da visibilidad inmediata

## 5.2 Dejar preparado, no cerrar hoy

- Fase 2 avanzada en adelante
- Fase 5 y Fase 6 como backlog de madurez empresarial

Esto respeta el sistema actual, acelera valor real y evita romper Neon por cambiar enums y tablas demasiado pronto.

---

# 6. Primer bloque a implementar inmediatamente

El primer bloque de ejecución será:

## Bloque 0A — Canon comercial y fundacional

### Incluye

- constantes compartidas para stages del PRD
- helpers de normalización y agrupación de deals
- actualización del overlay `CreateDeal`
- actualización del CRM para usar stages canónicos
- actualización de señales IA/ops que hoy dependen de `won`

### Razón

Es el bloque más fundacional, compatible con la base actual y necesario para que el resto del roadmap no siga construyéndose sobre vocabulario inconsistente.

## Bloque 2A — Migraciones fundacionales autorizadas

### Incluye

- expansión de enums canónicos prioritarios del PRD
- columnas base para gobierno de roles/capacidades cuando corresponda
- tablas fundacionales de auditoría o entidades nuevas si quedan en el primer corte
- adaptación de schemas Zod, servicios y UI al nuevo contrato

 ### Razón

El usuario autorizó explícitamente avanzar con migraciones porque la base actual es mínima y no representa una operación productiva cargada.

## Bloque 1B — Requests operativos tipados y SLA compatible

### Incluye

- tipificar requests sobre tickets/metadata sin romper el esquema actual
- mostrar request type y SLA en portal y OS
- añadir señales de activación operativa pendientes
- preparar el salto posterior a requests persistidos como entidad propia si sigue aportando valor

### Razón

Es el siguiente corte útil sin migración: aterriza mejoras del portal y del handoff operativo con impacto visible inmediato y reutiliza la base ya existente.

## Bloque 5A — Salud modular y risk registry compatible

### Incluye

- derivar salud por módulo desde `workspaceSnapshot` y señales compatibles existentes
- exponer una lectura centralizada de riesgos/health para dashboard y shell
- mostrar indicadores de salud en sidebar/OS shell
- construir lista inicial de riesgos accionables sin migración, por ejemplo SLA vencido, invoice overdue, credenciales sin rotación visible o tickets sin proyecto
- preparar el salto posterior a `/os/health` más profundo y health score por proyecto

### Razón

Es el mejor siguiente corte tras 1B: alto impacto visual y operativo, bajo riesgo técnico y alineado con las mejoras V2 aceptadas sin exigir todavía nuevas tablas.

---

 # 7. Estado del roadmap
 
 - **Roadmap documental**: actualizado y alineado con `VERTREX_OS_MEJORAS_V1.md` de forma curada.
 - **Bloque 0A — Canon comercial y fundacional**: completado.
 - **Bloque 0A — detalle**: stages canónicos unificados en helpers compartidos, schemas Zod, `workspace-service`, overlays, CRM, marketing, strategy, automations y señales IA/ops.
 - **Bloque 1A — Activación comercial-operativa compatible**: completado de forma parcial-alta.
 - **Bloque 1A — detalle**: anticipo del 50% como regla real de activación, provisionamiento temprano de portal controlado y base para señales de kickoff/gap operativo.
 - **Bloque 2A — Gobierno de accesos y auditoría fundacional**: completado.
 - **Bloque 2A — detalle**: subroles `team`, capacidades persistidas, tabla `audit_events`, servicios de auditoría en auth/access y mutaciones operativas, migración `drizzle/0001_strong_bullseye.sql`, además de `typecheck` y `build` en verde.
 - **Bloque 1B — Requests operativos tipados y SLA compatible**: completado.
 - **Bloque 1B — detalle**: catálogo canónico de `requestType`, reglas SLA compatibles sin migración, tickets persistiendo metadata tipada, portal/OS mostrando tipo y SLA, creación de tickets tipados y seed demo alineado.
 - **Pendientes mayores de Fase 2**: enums extendidos de invoice/document/task, `milestone`, `link`, snapshots documentales, capa relacional avanzada y cola persistida de aprobaciones IA.
 - **Curación V2 absorbida**: perfil operativo de cliente, templates, timeline unificado, versionado documental formal, billing recurrente, onboarding portal, salud/riesgos, settings, exports y soporte multiproyecto quedan integrados como backlog oficial no destructivo.
 - **Próximo paso en ejecución**: abrir `Bloque 5A — Salud modular y risk registry compatible`.
 - **Siguiente bloque estructural habilitado**: segundo corte de Fase 2 para entidades fundacionales adicionales (`milestone`, `link`, snapshots/business events o aprobaciones IA según impacto real).
