# Auditoría del sistema real de Vertrex OS

Corte de auditoría: 2026-04-28 (actualizado post-implementación roadmap)

## Objetivo

Este documento aterriza cómo funciona **hoy** Vertrex OS en el código real del repo unificado, para separar con precisión:

- lo que ya es operativo
- lo que es operativo pero parcial
- lo que sigue siendo diagnóstico o derivado del snapshot
- lo que sigue siendo promesa del PRD y todavía no aparece cableado end-to-end

El foco no es evaluar el diseño visual, sino el **comportamiento operativo real**, las rutas vivas, el modelo de datos, los flujos ejecutables desde UI y las contradicciones frente al PRD superficial.

## Fuentes auditadas

La auditoría se basó principalmente en:

- `src/lib/os-route-renderer.tsx`
- `src/lib/os-api-router.ts`
- `src/app/api/[...slug]/route.ts`
- `src/lib/auth/session.ts`
- `src/lib/db/schema.ts`
- `src/lib/ops/workspace-service.ts`
- `src/lib/ops/use-workspace-snapshot.ts`
- `src/lib/ops/workspace-client.ts`
- `src/lib/ops/workspace-schemas.ts`
- `src/lib/ops/entity-relations.ts` (nuevo: relaciones N:M genéricas)
- `src/lib/portal/portal-service.ts`
- `src/lib/portal/client-portal-data.ts`
- `src/lib/portal/portal-activity.ts` (nuevo: feed de actividad)
- `src/lib/docs/document-service.ts`
- `src/lib/docs/template-renderer.ts`
- `src/lib/docs/generated-document-service.ts`
- `src/lib/ai/control-center.ts`
- `src/lib/ai/os-agent.ts`
- `src/lib/ai/approval-queue.ts` (nuevo: cola de aprobaciones IA)
- `src/lib/openclaw/service.ts`
- `src/lib/openclaw/auth.ts`
- `src/lib/admin/access-service.ts`
- `src/lib/storage/asset-storage.ts`
- `src/lib/security/vault-secret.ts` (cifrado AES-256-GCM)
- `src/lib/security/session-anomaly.ts` (nuevo: detección de sesiones sospechosas)
- `src/lib/automation/execution-service.ts` (nuevo: log de ejecución de automatizaciones)
- `src/components/overlays/os-overlay-manager.tsx`
- `src/components/providers.tsx`
- `src/components/os/*-workspace-screen.tsx`
- `src/components/portal/client-portal-screen.tsx`
- `src/components/settings/access-settings-panel.tsx`
- `src/app/_os/PRD-BASICO.md`
- `PENDIENTES_FRONTEND_PRD_V3.md`
- `PRD_V9_VERTREX_OS.md`
- `ROADMAP_IMPLEMENTACION_PRD_V9.md`

## Resumen ejecutivo

## Qué sí existe ya como operación real

- **App unificada real** sobre el repo raíz, con entrypoints visibles en `/os`, `/portal/[clientId]`, `/login` y `/api/[...slug]`.
- **Autenticación real** con usuarios, sesiones persistidas en base de datos, cookie firmada y redirección por rol.
- **Backbone operacional real** con `WorkspaceSnapshot`, que consolida clientes, proyectos, tareas, deals, eventos, archivos, credenciales, tickets, invoices, documentos, transacciones y mensajes.
- **Mutaciones reales desde UI** para:
  - crear clientes
  - crear proyectos
  - crear tareas
  - crear deals
  - crear eventos
  - registrar transacciones
  - subir archivos
  - guardar credenciales
  - crear tickets
  - enviar mensajes
  - crear y administrar accesos
  - guardar overrides de métricas operativas
- **Portal cliente real** con autenticación separada por rol `client`, lectura real por `clientSlug` y escritura real para mensajes, archivos, tickets y credenciales.
- **Generador documental real** con preview HTML, guardado/versionado en Neon, exportación PDF y flujo alterno para plantillas universales generadas vía Handlebars + Playwright + Vercel Blob.
- **OpenClaw real como capa API protegida**, con CRUD de clientes, proyectos, tareas, finanzas, documentos, memoria y webhooks.
- **Capa relacional avanzada** con `entity_relations` para relaciones N:M genéricas entre cualquier par de entidades (depends_on, blocks, relates_to, etc.).
- **Cola persistida de aprobaciones IA** con tabla `ai_approvals`, catálogo de acciones (create_task, update_invoice, send_document, etc.) y flujo completo de aprobación/rechazo/ejecución.
- **Feed de actividad del portal** con tabla `portal_activity_feed`, visibilidad configurable por cliente/proyecto y actor (user/ai/system/client).
- **Log de ejecución de automatizaciones** con pasos detallados, input/output por step y trazabilidad completa en metadata.
- **Cifrado server-side de secretos del vault** con AES-256-GCM, auth tag, versioning y rotación soportada.
- **Detección de sesiones sospechosas** con análisis de: sesiones concurrentes, intentos rápidos de login, acceso fuera de horario, integrado con auditoría.
- **Rate limiting** en auth, vault y acciones sensibles (sliding window, configurable por endpoint).

## Qué existe pero no es tan “autónomo” como promete el PRD

- La mayoría de módulos de IA, automations, strategy, analytics, marketing, team y time son **capas de lectura, diagnóstico o recomendación** construidas sobre el snapshot, no motores autónomos que ya ejecuten decisiones complejas.
- Varias detail sheets y CTAs existen y abren overlays globales, pero sus botones internos siguen siendo **consultivos o placeholder**.
- El `Knowledge Hub` hoy **no es una base independiente de links scrapeados**; más bien indexa documentos, archivos y credenciales con `linkUrl`.
- El chatbot/IA actual de OpenClaw **no usa un LLM real en el código auditado**; responde con lógica heurística (`buildOsAgentReply`) basada en conteos, memoria reciente y palabras clave.

## Qué partes del documento de pendientes ya quedó desactualizado

`PENDIENTES_FRONTEND_PRD_V3.md` acierta en varias brechas, pero ya está atrasado en varios puntos importantes:

- El sistema global de overlays **sí existe** y **sí está montado** globalmente en `src/components/providers.tsx` mediante `OSOverlayManager`.
- El portal cliente **sí tiene subvistas reales** (`overview`, `progress`, `documents`, `billing`, `credentials`, `files`, `support`, `chat`) y no solo una pantalla única visual.
- El generador documental **sí guarda**, **sí versiona** y **sí exporta PDF**.
- Settings **sí tiene** gestión real de accesos y overrides operativos.
- Assets, chat, CRM, proyectos, finanzas y parte del portal ya no son solo UI estática: consumen endpoints reales.

Aun así, el documento de pendientes sigue teniendo razón en que varias capas siguen **incompletas**, especialmente automatizaciones, AI fuerte, importación documental, playbooks profundos y acciones internas de muchos detail views.

---

# 1. Arquitectura real observada

## 1.1 App y rutas públicas reales

Vertrex OS ya no vive como app separada en la práctica auditada. El flujo real está unificado así:

- `/login`
- `/os`
- `/portal/[clientId]`
- `/api/[...slug]`

La app raíz decide chrome de navegación mediante `AppChrome`:

- rutas de marketing usan `MarketingChrome`
- rutas operativas (`/login`, `/os`, `/portal`) usan `OperationalChrome`

La resolución de vistas OS ocurre en `src/lib/os-route-renderer.tsx`, que mapea segmentos a páginas privadas bajo `src/app/_os/(os)`.

La resolución de API ocurre en `src/lib/os-api-router.ts`, que registra manualmente módulos `route.ts` privados y los expone por el catch-all público `src/app/api/[...slug]/route.ts`.

## 1.2 Protección y autenticación

La seguridad observada en el repo auditado se apoya en:

- `src/app/os/layout.tsx`
- `src/app/portal/layout.tsx`
- guards server-side en rutas API (`requireTeamSession`, `requireClientSession`)

El flujo real de autenticación es:

- `POST /api/auth/login`
- validación contra `users` + `bcrypt.compare`
- creación de fila en tabla `sessions`
- firma de cookie con token de sesión
- redirección por rol:
  - `team` -> `/os`
  - `client` -> `/portal/[clientSlug]`

Puntos relevantes:

- **No encontré `proxy.ts`, `middleware.ts` ni otra capa perimetral equivalente en el árbol actual auditado**.
- La protección visible hoy es principalmente **server-side desde layouts** y **guards explícitos en API**.
- El login acepta `identifier` flexible:
  - si incluye `@`, usa email completo
  - si no incluye `@`, completa con `@vertrex.co` para equipo o `@client.vertrex.co` para portal

## 1.3 Toggle entre operación real y demo visual

Gran parte de las páginas OS usan:

- `process.env.NEXT_PUBLIC_USE_WORKSPACE_SNAPSHOT !== "false"`

Si ese flag no está en `false`, cargan sus `*-workspace-screen.tsx`, que sí consumen `useWorkspaceSnapshot()` y por ende `/api/admin/workspace`.

Conclusión práctica:

- **modo real es el default efectivo**
- el modo visual legacy sigue existiendo como fallback en varias páginas

## 1.4 Backbone operacional: `WorkspaceSnapshot`

`WorkspaceSnapshot` es el verdadero core operativo auditado.

Hoy consolida al menos:

- clientes
- proyectos
- tareas
- deals
- eventos
- archivos
- credenciales
- tickets
- invoices
- documentos
- transacciones
- mensajes
- summary agregado
- estado de storage

Esto le da al sistema una arquitectura clara:

- **una sola lectura agregada** para muchos módulos
- **múltiples mutaciones especializadas** por tipo de entidad
- UI reactivas que se refrescan desde el mismo snapshot

## 1.5 Estado global de UI y overlays

El store `src/lib/store/ui.ts` ya implementa overlays globales para:

- `commandCenter`
- `omniCreator`
- `universalInbox`
- `taskDetail`
- `clientDetail`
- `dealDetail`
- `eventDetail`
- `assetDetail`
- `vaultEntry`
- `threadDetail`
- `contractDetail`
- `ticketDetail`
- `uploadFile`
- `importDocument`
- `registerTransaction`
- `connectCredential`
- `createDeal`
- `createEvent`
- `createTicket`
- `createAutomation`
- `templateSelector`

Y `OSOverlayManager` **sí está montado globalmente** desde `src/components/providers.tsx`.

Esto corrige una conclusión antigua: el sistema de overlays ya no es hipotético.

El matiz importante es otro:

- **el montaje global existe**
- **los forms transaccionales importantes existen**
- **varios detail sheets todavía son principalmente consultivos**

---

# 2. Topología real de API

## 2.1 API administrativa interna (`team`)

Rutas principales:

- `GET /api/admin/workspace`
- `POST /api/admin/workspace`
- `POST /api/admin/workspace/files`
- `GET /api/admin/operational-stats`
- `PATCH /api/admin/operational-stats`
- `GET /api/admin/access`
- `POST /api/admin/access`
- `PATCH /api/admin/access/users/:id`

Estas rutas son la base real de operaciones internas.

## 2.2 API de portal (`client`)

Rutas principales:

- `GET /api/portal/me`
- `GET /api/portal/messages`
- `POST /api/portal/messages`
- `POST /api/portal/files`
- `POST /api/portal/tickets`
- `POST /api/portal/credentials`

Estas rutas no son mocks: terminan escribiendo sobre el mismo backend operativo que usa el equipo.

## 2.3 API documental

Rutas principales:

- `GET /api/docs/templates`
- `POST /api/docs/render`
- `GET /api/docs/documents`
- `POST /api/docs/documents`
- `GET /api/docs/documents/:id`
- `GET /api/docs/documents/:id/pdf`
- `POST /api/documents/generate`

Aquí conviven dos pipelines:

- pipeline legacy HTML/PDF
- pipeline nuevo de plantillas universales generadas

## 2.4 API OpenClaw

Rutas principales:

- `GET /api/openclaw/status`
- `POST /api/openclaw/ai/chat`
- `GET/POST /api/openclaw/clients`
- `GET /api/openclaw/clients/:id`
- `GET/POST /api/openclaw/projects`
- `GET/PATCH /api/openclaw/projects/:id`
- `GET/POST /api/openclaw/tasks`
- `PATCH /api/openclaw/tasks/:id`
- `POST /api/openclaw/finance`
- `GET /api/openclaw/finance/summary`
- `GET/POST /api/openclaw/documents`
- `GET/POST /api/openclaw/memory`
- `DELETE /api/openclaw/memory/:id`
- `POST /api/openclaw/webhooks`

Toda esta capa está protegida con `OPENCLAW_API_KEY` y opcionalmente `OPENCLAW_WEBHOOK_SECRET`.

---

# 3. Flujos end-to-end confirmados en el código

## 3.1 Crear cliente desde CRM

Flujo observado:

- UI en `crm-workspace-screen.tsx`
- `postWorkspaceCommand("client", payload)`
- `POST /api/admin/workspace`
- validación Zod por `workspaceAdminCommandSchema`
- ejecución vía `createWorkspaceClient()`
- refresh del snapshot

Conclusión:

- **flujo real y operativo**

## 3.2 Crear proyecto y opcionalmente crear cliente + provisionar portal

Flujo observado:

- UI en `projects-workspace-screen.tsx`
- `postWorkspaceCommand("project", payload)`
- el payload permite:
  - usar cliente existente
  - crear cliente nuevo
  - provisionar acceso portal
  - capturar datos del usuario portal
- backend en `createWorkspaceProject()`

Conclusión:

- **es uno de los flujos más valiosos y más reales del sistema actual**
- aquí ya existe un puente real entre ventas, delivery y acceso cliente

## 3.3 Crear tarea operativa

Flujo observado:

- UI en `projects-workspace-screen.tsx`
- `postWorkspaceCommand("task", payload)`
- persistencia real

Conclusión:

- **flujo real y simple**

## 3.4 Subir archivos desde equipo o portal

Flujo observado:

- overlay global `UploadFileDialog`
- si `portalMode`:
  - `POST /api/portal/files`
- si modo interno:
  - `POST /api/admin/workspace/files`
- backend usa `createWorkspaceFile()` y `storeAssetFile()`
- storage target:
  - `local`
  - `drive`
  - `auto`

Conclusión:

- **flujo real**
- storage híbrido **sí existe**
- depende de configuración de Google Drive para su modo full

## 3.5 Compartir credenciales / links

Flujo observado:

- overlay `ConnectCredentialDialog`
- modo portal:
  - `POST /api/portal/credentials`
- modo interno:
  - `POST /api/admin/workspace` con `kind: "credential"`

Efecto sistémico importante:

- una credencial con `linkUrl` también termina alimentando el `Knowledge Hub`

Conclusión:

- **flujo real**
- Vault y Hub comparten materia prima operacional

## 3.6 Crear ticket desde portal o equipo

Flujo observado:

- overlay `CreateTicketDialog`
- modo portal:
  - `POST /api/portal/tickets`
- modo interno:
  - `POST /api/admin/workspace` con `kind: "ticket"`

Conclusión:

- **flujo real**
- el PRD de soporte conectado al OS ya tiene base operativa

## 3.7 Mensajería entre equipo, cliente y autorespuesta

Flujo observado:

- equipo interno desde `chat-workspace-screen.tsx`
- portal cliente desde `client-portal-screen.tsx`
- ambos escriben sobre mensajes operativos reales
- tanto en portal como en OS aparece `autoReply: true` en varios puntos

Conclusión:

- **hay base real de conversación unificada**
- pero no se observa aún una IA sofisticada entrenada por cliente; la capa actual es más básica

## 3.8 Registrar transacción financiera

Flujo observado:

- overlay `RegisterTransactionDialog`
- `POST /api/admin/workspace` con `kind: "transaction"`
- usada desde finance para ingresos y gastos

Conclusión:

- **flujo real**
- finanzas ya no es solo dashboard

## 3.9 Crear deal y crear evento

Flujos observados:

- `CreateDealDialog` -> `kind: "deal"`
- `CreateEventDialog` -> `kind: "event"`

Conclusión:

- CRM y Agenda sí tienen mutación real desde overlay global

## 3.10 Crear acceso y administrar usuarios

Flujo observado:

- UI en `AccessSettingsPanel`
- `POST /api/admin/access`
- `PATCH /api/admin/access/users/:id`
- backend crea usuario `team` o `client`
- si es `client`, puede crear/actualizar cliente asociado
- revocar sesiones y activar/desactivar es real

Conclusión:

- Settings ya es una superficie operativa real, no solo administrativa visual

## 3.11 Generar, guardar, versionar y exportar documentos

Flujo observado:

- `DocumentGeneratorScreen`
- preview HTML por `POST /api/docs/render`
- guardado/versionado por `POST /api/docs/documents`
- exportación PDF:
  - pipeline legacy vía `/api/docs/render` o `/api/docs/documents/:id/pdf`
  - pipeline universal vía `/api/documents/generate`

Conclusión:

- **este flujo ya es muy real**
- el documento de pendientes quedó corto frente a la implementación actual

---

# 4. Auditoría por módulo

## 4.1 Dashboard / métricas operativas

Estado real:

- real
- lee `getOperationalStatsSnapshot()` y `getWorkspaceSnapshot()`
- existe override manual por settings

Hallazgo clave:

- las cards públicas del sistema ya tienen gobernanza real entre cálculo automático y override manual

## 4.2 CRM

Estado real:

- real y transaccional

Qué hace hoy:

- lista clientes y deals desde snapshot
- crea clientes
- abre `clientDetail`
- abre `dealDetail`
- crea deals vía overlay global

Limitación actual:

- los details sirven más como consulta que como workflow comercial completo
- no se observó un pipeline de seguimiento avanzado con múltiples acciones internas cableadas

## 4.3 Projects

Estado real:

- real y transaccional

Qué hace hoy:

- crea proyectos
- crea tareas
- soporta creación de cliente desde proyecto
- soporta provisionamiento de portal desde proyecto
- lista tareas por columnas reales
- abre `taskDetail`

Limitación actual:

- graph/timeline/detail avanzado no fueron auditados como flujo de edición fuerte
- buena base operativa, pero todavía no es un “Linear killer” completo

## 4.4 Finance

Estado real:

- real híbrido: lectura fuerte + mutación real

Qué hace hoy:

- calcula caja, runway, burn, ledger y cobranza desde transacciones e invoices reales
- registra ingresos/gastos
- usa el mismo snapshot operativo

Limitación actual:

- no observé reconciliación bancaria, impuestos, multi-moneda ni estados avanzados de factura más allá del modelo actual

## 4.5 Calendar

Estado real:

- real híbrido

Qué hace hoy:

- lee eventos reales del workspace
- crea eventos reales desde overlay global
- detail event existe

Limitación actual:

- muchas acciones del detail siguen pareciendo más de consulta que de orchestration avanzada

## 4.6 Chat

Estado real:

- real híbrido

Qué hace hoy:

- unifica mensajes y tickets por cliente
- permite respuesta del equipo
- se nutre también de mensajes provenientes del portal
- puede adjuntar mediante `uploadFile`

Limitación actual:

- no vi hilos profundos, canales persistentes independientes, ni un motor de IA redactor realmente conectado a LLM

## 4.7 Assets

Estado real:

- real

Qué hace hoy:

- lee archivos reales
- filtra por fuente/proveedor
- abre archivo por `href`
- sube archivo real vía overlay

Limitación actual:

- el asset detail existe, pero el nivel de gestión DAM sigue siendo básico

## 4.8 Vault

Estado real:

- real híbrido

Qué hace hoy:

- lista credenciales reales
- abre `vaultEntry`
- permite crear nueva credencial
- relaciona credenciales con cliente/proyecto
- combina trail documental y archivos sensibles

Limitación actual:

- en el barrido realizado no quedó demostrada una capa explícita de revelado granular, TOTP robusto o permisos finos tipo categoría sensible
- el PRD promete cifrado y visibilidad por permisos; eso debe confirmarse/expandirse en PRD v9

## 4.9 Knowledge Hub

Estado real:

- real como **índice derivado**, no como sistema autónomo de scraping

Qué hace hoy:

- agrega:
  - documentos
  - archivos
  - credenciales con `linkUrl`
- permite buscar y navegar activos recientes
- “Nuevo link” en la práctica reaprovecha el flujo de credenciales

Limitación crítica:

- no encontré tabla propia de links, ni endpoint de pegado de URL cruda, ni autoscraping, ni clasificación IA real

Conclusión:

- hoy el Hub es **una vista agregada del workspace**, no el “cerebro de referencias” descrito en el PRD

## 4.10 Documents

Estado real:

- real

Qué hace hoy:

- lista documentos reales
- busca por cliente/proyecto/categoría/código
- muestra archivos soporte relacionados
- abre documentos por `href`
- dispara nuevo documento por selector de plantilla
- `Importar` todavía abre un diálogo no cableado

Limitación actual:

- importación documental sigue placeholder

## 4.11 Legal

Estado real:

- real híbrido

Qué hace hoy:

- usa documentos e invoices reales
- visibiliza brechas de portal provisioning
- muestra cobertura documento-factura
- navega al cliente con brecha operativa
- crea documento vía selector

Limitación actual:

- no observé firma electrónica real ni workflow legal complejo de aprobaciones/renovaciones

## 4.12 Portal cliente

Estado real:

- real y bastante más maduro que lo que decían los pendientes

Qué hace hoy:

- autenticación por rol `client`
- lectura por `clientSlug`
- subviews reales:
  - overview
  - progress
  - documents
  - billing
  - credentials
  - files
  - support
  - chat
- logout real
- envío real de mensajes
- subida real de archivos
- creación real de tickets
- envío real de credenciales
- apertura de documentos/activos/contratos/tickets por overlay o `href`

Limitación actual:

- el “chatbot 24/7 entrenado en SOW y manuales” del PRD no está demostrado en esta auditoría
- la lógica de “next action” existe, pero es inferida por reglas y datos operativos, no por un agente sofisticado

## 4.13 Settings / Access

Estado real:

- real y transaccional

Qué hace hoy:

- gestiona usuarios `team` y `client`
- crea clientes asociados al acceso de portal
- activa/desactiva usuarios
- revoca sesiones
- gobierna overrides manuales de métricas

Limitación actual:

- la navegación lateral de settings sigue mayormente visual; el panel fuerte real está concentrado en acceso y métricas

## 4.14 Marketing

Estado real:

- real como tablero derivado

Qué hace hoy:

- calcula pipeline total y ponderado desde deals
- estima ROAS operativo cruzando deals con gasto categorizado como marketing
- abre `dealDetail` y `clientDetail`
- crea deals

Limitación actual:

- no hay conectores reales a Meta/Google/LinkedIn en el código auditado
- es un tablero de inteligencia comercial basado en el snapshot, no un hub de campañas conectado a plataformas

## 4.15 Team

Estado real:

- real como tablero analítico derivado

Qué hace hoy:

- mide carga por owner real de tareas
- detecta sobrecarga simple
- lista tareas sin owner
- abre `taskDetail`

Limitación actual:

- no hay HR real, skills matrix ni predicción de burnout más allá de reglas de conteo

## 4.16 Automations

Estado real:

- real como tablero de recomendaciones, no como motor ejecutor completo

Qué hace hoy:

- detecta gaps relacionales reales:
  - deals ganados sin proyecto
  - clientes con proyecto sin portal
  - proyectos sin kickoff
  - invoices sin documento
  - tickets sin proyecto
- ofrece sugerencias y “playbooks listos”

Limitación crítica:

- `CreateAutomationDialog` sigue siendo placeholder
- no vi DSL, scheduler, ejecución ni historial real de automatizaciones internas

## 4.17 AI Console

Estado real:

- real como consola de observabilidad operativa

Qué hace hoy:

- resume proyectos, tareas, tickets, invoices, clientes, documentos y mensajes
- expone señales relacionales
- muestra memoria y sesiones OpenClaw
- convierte snapshot + `aiMemory` + `openclawSessions` en panel de control

Limitación crítica:

- no vi ejecución autónoma sofisticada ni planeación multi-step real desde esta UI

## 4.18 OpenClaw

Estado real:

- real como API externa autenticada

Qué hace hoy:

- CRUD de entidades operativas
- memoria persistente
- registro de sesiones activas
- webhooks
- chat heurístico con persistencia opcional de memoria

Limitación crítica:

- el chat de OpenClaw actual no evidencia uso de modelo externo ni tool-calling real; responde desde `buildOsAgentReply()` con selección heurística de “tools sugeridas”
- es más una **interfaz de integración y automatización preparada** que una capa AI-first terminada

---

# 5. Clasificación real de módulos por nivel de madurez

## 5.1 Módulos operativos transaccionales

- CRM
- Projects
- Finance
- Calendar
- Assets
- Vault
- Documents generator
- Portal cliente
- Settings / access
- Mensajería OS + portal

## 5.2 Módulos operativos de lectura + acciones puntuales

- Legal
- Marketing
- Team
- Chat workspace
- Dashboard
- Operational stats

## 5.3 Módulos diagnósticos o aspiracionales sobre snapshot

- Automations
- Strategy
- Analytics
- Time
- parte de AI Console
- gran parte de los detail sheets

## 5.4 Componentes placeholder detectados claramente

- `ImportDocumentDialog`
- `CreateAutomationDialog`
- varias acciones internas de details (`Responder`, `Asignar`, `Cambiar estado`, etc.) sin evidencia en esta auditoría de mutación real adicional

---

# 6. Contraste con `PRD-BASICO.md`

## 6.1 Lo que el PRD describe y sí tiene base real hoy

- app unificada tipo OS
- storage híbrido local/Drive
- CRM con deals y detail overlays
- portal cliente con progreso, documentos, billing, archivos, soporte y chat
- legal/documentos con versionado y repositorio
- finanzas con ledger y cobranza
- project management real
- acceso operativo centralizado

## 6.2 Lo que el PRD sobrepromete frente al código auditado

### IA C-Level / predicción fuerte

El PRD habla de:

- CEO/CFO/COO virtual
- predicción de rentabilidad
- mitigación de burnout
- ejecución de marketing
- simulación de decisiones

Lo observado hoy es:

- dashboards y señales relacionales
- conteos, ratios y recomendaciones
- heurísticas de texto en OpenClaw
- ausencia visible de un motor predictivo/agentic profundo en el código auditado

### Knowledge Hub con autoscraping

El PRD habla de:

- pegar URL cruda
- visitar la web
- resumir
- etiquetar
- sugerir proyecto

Lo observado hoy es:

- agregación de documentos, archivos y credenciales enlazadas
- sin endpoint o tabla específica de link ingestion en el barrido realizado

### Generador documental con IA desde notas crudas

El PRD habla de:

- pegar notas crudas y extraer variables automáticamente

Lo observado hoy es:

- edición manual estructurada del draft
- preview real
- save/version/PDF real
- pero sin parsing IA de notas en este barrido

### Vault con cifrado y permisos finos prometidos

El PRD habla de:

- AES-256
- visibilidad controlada por permisos
- separación fuerte por dominios

Lo observado hoy es:

- credenciales reales y relación con cliente/proyecto
- pero no quedó demostrada en esta auditoría la capa completa de cifrado/permisos finos prometida por el PRD

### Marketing conectado a ad platforms

El PRD habla de:

- tracking Meta/Google/LinkedIn
- AI Ad Studio

Lo observado hoy es:

- tablero de growth apoyado en deals + transacciones categorizadas
- sin conectores reales a plataformas en el código auditado

### Team anti-burnout / HR avanzada

El PRD habla de:

- skills matrix
n- predicción de sobrecarga

Lo observado hoy es:

- carga por owner desde tareas reales
- alertas simples por volumen
- sin HR avanzada visible en el barrido

---

# 7. Contraste con `PENDIENTES_FRONTEND_PRD_V3.md`

## Afirmaciones del documento de pendientes que ya no son correctas del todo

- “falta sistema global de overlays”: **ya existe y está montado globalmente**
- “portal solo tiene pantalla base”: **ya tiene subvistas reales y mutaciones reales**
- “generador no guarda ni versiona ni exporta real”: **ya lo hace**
- “settings solo cambia visualmente”: **hoy administra accesos y overrides reales**
- “assets upload falta funcional”: **hoy es funcional**
- “chat casi no existe real”: **hoy persiste mensajes reales**

## Afirmaciones del documento de pendientes que siguen siendo válidas

- siguen faltando workflows profundos en varios detail views
- importación documental sigue sin cablearse real
- automatizaciones aún no son motor ejecutor completo
- AI fuerte sigue más cerca de observabilidad/recomendación que de autonomía real
- analytics/strategy/time siguen siendo módulos más interpretativos que operativos

---

# 8. Dependencias y riesgos de despliegue reales

## Dependencias críticas observadas

- `DATABASE_URL`
- `AUTH_SECRET`
- `BLOB_READ_WRITE_TOKEN`
- `OPENCLAW_API_KEY`
- `OPENCLAW_WEBHOOK_SECRET` (opcional si se usa validación extendida)
- `GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_DRIVE_PRIVATE_KEY`
- `GOOGLE_DRIVE_ROOT_FOLDER_ID`
- `GOOGLE_DRIVE_SHARED_ACCOUNT`
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` o binario local compatible
- `PUPPETEER_EXECUTABLE_PATH` para pipeline legacy si aplica
- `OWNER_EMAIL` para reglas de administración de accesos

## Riesgos funcionales derivados

- si no hay base configurada, gran parte del sistema real cae a vacío o fallback
- OpenClaw no puede operar sin Neon activo
- generación documental universal no puede subir PDF sin Blob
- storage híbrido queda en modo local si Drive no está configurado
- parte de la experiencia “real” depende del flag `NEXT_PUBLIC_USE_WORKSPACE_SNAPSHOT`

---

# 9. Implicaciones para un PRD v9.0 serio

## 9.1 Qué debe declararse como “ya construido”

- app unificada root
- autenticación real por roles
- snapshot operativo compartido
- mutaciones administrativas y portal principales
- settings de accesos
- generación documental real con versionado
- OpenClaw como API protegida
- overlays globales montados

## 9.2 Qué debe declararse como “construido pero parcial”

- legal workflow completo
- marketing conectado a ad platforms
- hub de conocimiento autónomo
- automations como motor ejecutor
- AI console agentic
- detail workflows internos

## 9.3 Qué debe dejar de venderse como ya resuelto

- chatbot 24/7 entrenado por SOW/manuales por cliente
- autoscraping IA de links en producción
- CFO/COO/CEO virtual realmente autónomo
- anti-burnout predictivo real
- growth conectado de punta a punta con plataformas externas
- firma/legal ops avanzada como workflow completo

## 9.4 Qué decisiones de producto siguen abiertas

- qué módulos entran al MVP operativo real
- qué alcance exacto tendrá la IA en v9
- qué storage será canonical por tipo de activo
- qué relación exacta debe existir entre deal, proyecto, portal y billing
- qué grado de autonomía se permitirá a OpenClaw
- qué flujos legales y documentales necesitan aprobación, firma y auditabilidad formal

---

# 10. Conclusión

Vertrex OS **ya superó la etapa de demo puramente visual**.

Hoy existe un núcleo real y coherente con estas propiedades:

- autenticación real
- snapshot operacional central
- CRUD relevante para operación interna y portal
- documentos con persistencia/versionado/exportación
- storage real
- accesos reales
- API unificada

Pero también es claro que el sistema actual todavía se divide en dos capas:

- **capa operativa real**: CRM, Projects, Finance, Assets, Vault, Portal, Access, Messaging, Document Generator
- **capa de inteligencia/diagnóstico/aspiración**: AI, Automations, Strategy, Analytics, Team avanzado, Hub IA, OpenClaw autónomo

La mejor lectura para PRD v9.0 no es "todo está incompleto" ni "todo ya está listo". La lectura correcta es:

**ya existe un OS operativo real con un backbone serio**, y el siguiente PRD debe formalizar exactamente qué parte de la promesa futurista se convierte en compromiso de producto para la próxima fase.

---

# 11. Implementaciones completadas del Roadmap PRD v9

## 11.1 Fase 2: Capa Relacional Avanzada (entity_relations)

**Tabla:** `entity_relations`  
**Migración:** `drizzle/0006_entity_relations.sql`

Implementa relaciones N:M genéricas entre cualquier par de entidades del sistema:

- **Tipos de relación:** depends_on, blocks, relates_to, duplicates, parent_of, child_of, references, member_of, has_member
- **Entidades soportadas:** client, project, task, milestone, document, invoice, deal, ticket, credential, link, file, user, automation_playbook, automation_run
- **Servicio:** `src/lib/ops/entity-relations.ts` con funciones CRUD y bidireccionalidad automática
- **Índices:** source_type+source_id, target_type+target_id, unique constraint compuesto

## 11.2 Fase 2: Cola Persistida de Aprobaciones IA (ai_approvals)

**Tabla:** `ai_approvals`  
**Migración:** `drizzle/0007_ai_approvals.sql`

Sistema completo de gobierno de acciones IA:

- **Catálogo de acciones:** create_task, update_task, delete_task, create_invoice, update_invoice, send_document, update_deal_stage, create_project, add_milestone, update_milestone, send_message, provision_portal, rotate_credential, execute_playbook, modify_budget
- **Estados:** pending, approved, rejected, expired, cancelled
- **Contexto:** JSON con contexto operativo completo
- **Cambios propuestos:** JSON con diff de la acción propuesta
- **Trazabilidad:** requested_by, approved_by, rejected_by con timestamps
- **Priorización:** priority (low/normal/high/critical), risk_level (low/medium/high/critical)
- **Expiración:** expires_at para auto-rechazo temporal
- **Ejecución:** executed_at + execution_result para trazabilidad post-aprobación
- **Servicio:** `src/lib/ai/approval-queue.ts`
- **Helpers:** requiresApproval(), getRiskLevel() para lógica de decisión

## 11.3 Fase 3: Feed de Actividad del Portal (portal_activity_feed)

**Tabla:** `portal_activity_feed`  
**Migración:** `drizzle/0008_portal_activity_feed.sql`

Sistema de timeline/auditabilidad visible al cliente:

- **Actores:** user, ai, system, client
- **Entidades:** cualquier tipo + id + nombre legible
- **Acciones:** create, update, delete, approve, reject, complete, etc.
- **Visibilidad:** client_visible boolean para controlar qué aparece en portal
- **Contexto:** metadata JSON extensible
- **Servicio:** `src/lib/portal/portal-activity.ts`
- **Perfiles de visibilidad:** Estructura tipada PortalVisibilityProfile con 10 flags configurables:
  - showProgress, showMilestones, showDocuments, showInvoices, showLinks
  - showTeam, showTimeline, allowDocumentRequests, allowTicketCreation, showHealthScore

## 11.4 Fase 4: Log de Ejecución de Automatizaciones

**Servicio:** `src/lib/automation/execution-service.ts`

Trazabilidad completa de ejecución de playbooks:

- **Pasos detallados:** stepNumber, action, status, timestamps
- **Input/Output:** por cada step
- **Logs:** array de mensajes por step
- **Errores:** captura y almacenamiento de errores por step
- **Resultado final:** status (completed/needs_review/failed) + result JSON
- **Integración:** Registra automáticamente en portal_activity_feed cuando aplica

## 11.5 Fase 6: Cifrado Server-Side del Vault

**Servicio:** `src/lib/security/vault-secret.ts`

Cifrado real de secretos en reposo:

- **Algoritmo:** AES-256-GCM
- **IV:** 12 bytes aleatorios por operación
- **Auth Tag:** 16 bytes para integridad/autenticidad
- **Versionado:** secretVersion para rotación de esquemas futura
- **Modos:** none, plaintext (legacy), encrypted (actual)
- **Metadata:** stripVaultSecretMetadata() para limpieza segura

## 11.6 Fase 6: Detección de Sesiones Sospechosas

**Servicio:** `src/lib/security/session-anomaly.ts`

Detección de patrones de seguridad:

- **Concurrent sessions:** Detecta +3 sesiones activas simultáneas (threshold configurable)
- **Rapid login attempts:** Detecta +5 intentos en 5 minutos desde auditoría
- **Off-hours access:** Detecta accesos fuera de 7am-8pm o fines de semana
- **Integración:** Graba automáticamente en audit_events como session_anomaly_detected
- **Severidad:** low/medium/high/critical según el patrón
- **Metadata:** Contexto completo para investigación forense

## 11.7 Fase 6: Rate Limiting

**Servicio:** `src/lib/security/rate-limit.ts`

Protección contra abuso:

- **Sliding window:** Lógica de ventana deslizante
- **Endpoints protegidos:** auth/login, vault/reveal, acciones sensibles de API
- **Configurable:** Límites por endpoint y por usuario/IP
- **Headers:** Retry-After, X-RateLimit-Remaining
- **Respuesta:** 429 Too Many Requests con mensaje claro

---

# 12. Estado del Build y Typecheck

- `npm run typecheck` — Sin errores
- `npm run build` — Build exitoso, todas las rutas generadas
- Migraciones SQL — 0006, 0007, 0008 creadas y listas para aplicar
- Esquemas Drizzle — Actualizados con enums y tablas nuevas
