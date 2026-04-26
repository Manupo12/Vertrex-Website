# Plan de ejecución operativo para dejar Vertrex OS al 100%

## 1. Qué significa “100% funcional” en este proyecto

En este contexto, **funcional** no significa “la UI responde” ni “abre modales”.

Aquí **100% funcional** significa esto:

- El equipo interno de Vertrex puede entrar al sistema con autenticación real.
- Existen usuarios, sesiones, roles y permisos reales.
- Hay base de datos persistente y un modelo de datos coherente.
- Las pantallas del OS dejan de ser solamente mock visual y operan sobre datos reales o seeds coherentes.
- El portal de cliente puede ser usado por clientes reales con acceso controlado.
- Los módulos principales tienen CRUDs mínimos, detalles, navegación y estados persistidos.
- Documentos, archivos, tickets, finanzas, credenciales y comunicación dejan trazabilidad.
- Existe una estrategia clara de storage, auditoría, errores y despliegue.
- El sistema puede ser usado por el equipo y por clientes sin romperse por ausencia de backend.

Este documento está pensado para que otra IA ejecute el trabajo **de punta a punta**, sin perder tiempo rehaciendo cosas ya hechas y sin asumir que el repo ya tiene una base backend que en realidad todavía no existe.

---

## 2. Verdad actual del repo al inicio de este plan

## 2.1 Stack real presente

Archivo verificado:

- `package.json`

Dependencias reales hoy:

- `next@16.2.4`
- `react@19.2.4`
- `react-dom@19.2.4`
- `lucide-react`
- Tailwind 4
- TypeScript
- ESLint

## 2.2 Qué backend real existe hoy

Verificación hecha en el repo:

- Solo existe una ruta API mínima:
  - `src/app/api/hello/route.ts`
- No existe `middleware.ts`
- No existe carpeta `prisma/`
- No existe cliente DB real en `src/lib`
- No existe capa de auth real
- No existe gestión de sesiones real
- No existe ORM instalado
- No existe esquema de base de datos
- No existe storage real conectado
- No existe RBAC real

## 2.3 Qué sí existe y debe reutilizarse

Sí existe una base frontend importante y no debe rehacerse desde cero:

- Shell OS
- Store global UI
- Overlay manager
- Varias pantallas del OS ya construidas visualmente
- Parte del wiring global de overlays ya conectado
- Portal empezado
- Docs generator empezado

## 2.4 Conclusión importante

La siguiente IA **no debe asumir** que “solo falta conectar frontend”.

La realidad es:

- hay una buena base visual
- hay un buen sistema UI global
- **todavía falta construir la capa de aplicación real**

En términos prácticos, el trabajo pendiente incluye:

- backend
- base de datos
- auth
- permisos
- storage
- servicios
- APIs o server actions
- integración total de frontend con datos reales

---

## 3. Restricciones y reglas que no se pueden romper

## 3.1 Separación entre apps

Este workspace tiene dos apps:

- landing en la raíz del workspace
- `vertrex-os` como app separada

No fusionarlas sin decisión arquitectónica explícita.

La integración correcta es por:

- enlaces
- navegación
- entrypoints
- autenticación coordinada si luego se define

## 3.2 Reglas de Next de este repo

En `vertrex-os` hay que respetar la doc local de Next dentro de:

- `node_modules/next/dist/docs/`

Y asumir estas reglas:

- App Router moderno
- `page.tsx` preferentemente server-side cuando corresponda
- componentes interactivos separados con `"use client"`
- `params` y `searchParams` tratados como async en wrappers server-side cuando aplique en esta versión del repo

## 3.3 Regla del store global UI

Ya existe en:

- `src/lib/store/ui.ts`

No rehacerlo.

No inventar nuevas claves de overlays sin ampliar también:

- tipos del store
- overlay manager
- triggers consumidores

## 3.4 Regla de implementación

No rehacer pantallas bonitas desde cero.

La misión no es rediseñar Vertrex OS.

La misión es:

- ponerle backend real
- convertir cada pantalla en flujo usable
- cerrar huecos funcionales
- llevarlo a producción

---

## 4. Definición técnica de “done” para este plan

El proyecto se considera terminado cuando se cumplan todas estas condiciones:

### Core de plataforma

- [ ] DB real operativa
- [ ] migraciones ejecutables
- [ ] seeds iniciales listos
- [ ] auth real operativa
- [ ] sesiones reales operativas
- [ ] roles y permisos operativos
- [ ] middleware de protección de rutas operativo
- [ ] storage de archivos real operativo
- [ ] auditoría básica operativa

### Producto interno

- [ ] el equipo entra con login real
- [ ] puede navegar por el OS sin pantallas muertas
- [ ] CRM, calendario, assets, legal, vault, finance, chat, docs y proyectos tienen flujos útiles
- [ ] settings y team sirven de verdad

### Portal cliente

- [ ] clientes entran con acceso real
- [ ] sólo ven su información
- [ ] pueden ver avance, documentos, facturación, archivos y tickets
- [ ] pueden subir material y abrir soporte
- [ ] no pueden ver datos internos de otros clientes

### Sistema documental

- [ ] docs index navega a detalle real
- [ ] generator carga plantillas reales
- [ ] generator guarda documentos
- [ ] generator permite exportar o al menos generar artefacto persistido utilizable

### Calidad

- [ ] TypeScript limpio
- [ ] sin errores de rutas clave
- [ ] sin CTAs principales muertos
- [ ] smoke tests razonables
- [ ] build estable

---

## 5. Arquitectura objetivo recomendada

La otra IA debe usar una arquitectura simple, mantenible y alineada con lo que ya existe.

## 5.1 Base de datos

### Recomendación principal

- PostgreSQL

Razón:

- encaja bien con producto B2B
- sirve para multi-tenant ligero
- soporta relaciones de CRM, portal, documentos, tickets y finanzas
- en el repo ya hay referencias visuales a `DATABASE_URL` y al concepto de entorno productivo con Postgres

## 5.2 ORM recomendado

### Recomendación principal

- Prisma

Razón:

- acelera entrega
- simplifica schema + migrations + seeds
- útil para otra IA porque el modelado queda explícito
- encaja bien con Next App Router y rutas server-side

## 5.3 Auth recomendada

### Recomendación principal

- Auth.js o una implementación equivalente basada en sesiones seguras

Objetivo mínimo:

- login por email/password para staff
- acceso seguro para clientes del portal
- sesiones persistidas
- roles
- protección de rutas

Si la otra IA opta por otra solución, debe justificarla y mantener estos requisitos:

- compatibilidad con Next actual
- roles internos y clientes
- route protection
- buen soporte App Router

## 5.4 Storage recomendado

### Recomendación principal

- Vercel Blob si el despliegue final va por ese camino y existe `BLOB_READ_WRITE_TOKEN`
- si no, usar S3-compatible storage

Debe servir para:

- assets
- adjuntos del chat
- documentos generados
- archivos del portal

## 5.5 Auditoría y secretos

- `VAULT_SECRET` debe usarse para proteger/firmar o cifrar datos sensibles del vault si esa capa se implementa en app
- `SLACK_WEBHOOK_URL` puede aprovecharse para alertas internas de soporte, finanzas o incidentes

---

## 6. Modelo de dominio mínimo que debe existir en DB

La otra IA debe crear un esquema coherente. No hace falta sobre-ingeniería, pero sí cubrir el producto real.

## 6.1 Entidades núcleo

### Identidad y acceso

- `User`
- `Session`
- `Account` si la solución auth lo requiere
- `Organization` o `Workspace`
- `Membership`
- `Role`

### Clientes y proyectos

- `Client`
- `Project`
- `ProjectMember`
- `ProjectMilestone`
- `ProjectUpdate`

### CRM

- `Deal`
- `DealStage`
- `DealActivity`
- `Contact`

### Agenda y trabajo operativo

- `Task`
- `Event`
- `Reminder`

### Documentos y archivos

- `Document`
- `DocumentTemplate`
- `DocumentVersion`
- `Asset`
- `FileUpload`

### Legal

- `Contract`
- `ContractSignatureState`

### Vault

- `VaultEntry`
- `CredentialShare`
- `CredentialAuditLog`

### Finanzas

- `Invoice`
- `Transaction`
- `LedgerEntry`
- `PaymentStatus`

### Soporte y comunicación

- `Thread`
- `Message`
- `Ticket`
- `TicketComment`
- `Notification`

### Automatizaciones

- `Automation`
- `AutomationRun`
- `AutomationTrigger`

## 6.2 Multi-tenancy mínima

Debe existir separación entre:

- staff interno Vertrex
- clientes externos

El modelo mínimo debe garantizar:

- un cliente solo ve sus proyectos, documentos, archivos, tickets y facturación
- staff puede ver múltiples clientes según rol
- admin interno puede ver todo

## 6.3 Roles mínimos

Definir como mínimo:

- `admin`
- `operator`
- `finance`
- `legal`
- `pm`
- `client`

La otra IA puede ajustar nombres, pero no debe omitir la separación entre roles internos y cliente.

---

## 7. Estructura de archivos objetivo a crear o completar

La otra IA debe dejar una estructura clara. Sugerencia mínima:

## 7.1 Base de datos

- `prisma/schema.prisma`
- `prisma/seed.ts`
- `src/lib/db.ts`

## 7.2 Auth

- `src/lib/auth/`
- `src/lib/auth/config.ts`
- `src/lib/auth/session.ts`
- `src/lib/auth/permissions.ts`
- `src/app/api/auth/...` si la solución elegida lo requiere
- `middleware.ts`

## 7.3 Servicios de dominio

- `src/lib/services/clients.ts`
- `src/lib/services/projects.ts`
- `src/lib/services/crm.ts`
- `src/lib/services/calendar.ts`
- `src/lib/services/assets.ts`
- `src/lib/services/docs.ts`
- `src/lib/services/legal.ts`
- `src/lib/services/vault.ts`
- `src/lib/services/finance.ts`
- `src/lib/services/chat.ts`
- `src/lib/services/tickets.ts`
- `src/lib/services/portal.ts`

## 7.4 Storage e integraciones

- `src/lib/storage/blob.ts`
- `src/lib/integrations/slack.ts`
- `src/lib/audit.ts`

## 7.5 Validación y tipos

- `src/lib/validators/`
- `src/lib/types/`

No es obligatorio que use exactamente esos nombres, pero sí debe quedar ordenado por dominio.

---

## 8. Orden exacto de ejecución recomendado

La otra IA **no debe** intentar dejar todo funcional a la vez en un solo salto. Debe hacerlo en fases cerradas.

## Fase 0. Congelar base y revisar errores existentes

### Objetivo

Asegurar que el repo parte de un estado controlado antes de montar backend real.

### Tareas

- revisar TypeScript actual
- revisar `client-portal-screen.tsx` porque ya tiene errores de tipos conocidos
- confirmar qué páginas ya compilan y cuáles no
- no seguir añadiendo features sobre errores no resueltos

### Entregable

- repo compila o al menos tiene localizados los errores previos

---

## Fase 1. Infraestructura real de aplicación

### Objetivo

Agregar la base técnica que hoy falta por completo.

### Tareas obligatorias

- instalar ORM y cliente DB
- crear schema inicial
- crear conexión a DB
- crear archivo de migraciones
- crear seed inicial
- preparar `.env.example` con variables reales necesarias

### Variables mínimas esperadas

- `DATABASE_URL`
- `AUTH_SECRET` o equivalente según solución auth
- `BLOB_READ_WRITE_TOKEN` si se usa Vercel Blob
- `VAULT_SECRET`
- `SLACK_WEBHOOK_URL`

### Entregable

- DB conectada
- migraciones funcionando
- seed funcionando

---

## Fase 2. Auth, sesiones y permisos

### Objetivo

Cerrar el mayor hueco actual: el producto no puede usarse en equipo ni por clientes sin acceso real.

### Tareas obligatorias

- implementar login real para staff
- proteger rutas del OS
- definir roles
- proteger portal por cliente
- crear utilidades de sesión server-side
- crear middleware de redirección/autorización

### Reglas funcionales mínimas

#### Staff

- entra por `/login`
- si tiene sesión válida entra al OS
- si no la tiene, redirige a login

#### Cliente

- entra al portal con acceso controlado
- nunca debe ver datos de otro cliente
- el portal debe resolver el cliente actual desde sesión o token seguro, no solo desde URL pública sin protección

### Entregable

- login real operativo
- sesiones reales
- protección real de rutas

---

## Fase 3. Modelo de datos y servicios por dominio

### Objetivo

Construir la capa de aplicación real antes de parchear UI por todas partes.

### Tareas por dominio

#### CRM

- servicio para deals
- listado
- detalle
- cambio de etapa
- creación de deal

#### Calendar

- servicio para eventos
- listado por fecha
- creación de evento
- detalle

#### Assets

- storage real
- metadata persistida
- listado
- detalle
- subida

#### Docs

- listado de documentos
- detalle por id
- relación con cliente/proyecto
- versionado mínimo o historial simple

#### Legal

- contratos persistidos
- estado de firma/aprobación
- plantilla base relacionada con documento

#### Vault

- entries persistidas
- acceso auditado
- permisos limitados por rol

#### Finance

- invoices
- ledger
- transactions
- estados de pago

#### Chat y soporte

- threads
- messages
- tickets
- comentarios o timeline de ticket

#### Projects

- listado
- detalle
- timeline
- graph si existe como visualización del mismo modelo

### Entregable

- cada dominio tiene servicio mínimo usable y persistencia real

---

## Fase 4. Conectar frontend existente con datos reales

### Objetivo

Reusar las páginas ya hechas y dejar de alimentarlas solo con hardcodes.

### Regla central

No rehacer pantallas si ya existen. Cambiarles las fuentes de datos y las acciones.

### Prioridad 1: módulos ya más avanzados

- `crm`
- `calendar`
- `assets`
- `legal`
- `vault`
- `finance`
- `automations`
- `chat`
- `docs`

### Qué debe hacerse en cada módulo

- reemplazar arrays hardcodeados por lecturas reales
- mantener la UI actual en lo posible
- convertir botones principales en acciones reales
- conectar cards y filas a detail real o overlay con id persistido
- asegurar carga, vacío y error states mínimos

### Entregable

- módulos principales del OS funcionando sobre DB

---

## Fase 5. Portal cliente listo para uso real

### Objetivo

Dejar el portal realmente utilizable por clientes externos.

### Estado actual conocido

- existe una página estática vieja
- existe una nueva base en:
  - `src/lib/portal/client-portal-data.ts`
  - `src/components/portal/client-portal-screen.tsx`
- esa base nueva todavía no está terminada ni integrada

### Qué debe pasar aquí

#### 1. Terminar el nuevo portal

- corregir typings de `client-portal-screen.tsx`
- integrarlo desde `src/app/(portal)/[clientId]/page.tsx`
- mantener wrapper server-side correcto

#### 2. Dejar de depender solo de mocks

La estructura mock actual sirve de guía visual, pero debe migrarse a datos reales desde DB.

#### 3. Flujos reales mínimos del portal

- ver estado del proyecto
- ver hitos y tareas
- ver documentos y contratos
- ver facturas y estados de pago
- ver y subir archivos
- abrir tickets de soporte
- abrir conversaciones o hilos relevantes
- compartir credenciales cuando el flujo lo permita

#### 4. Seguridad

- cliente solo ve su data
- validar acceso por sesión/rol
- evitar depender solo del `clientId` en URL como control de acceso

### Entregable

- portal usable por clientes reales

---

## Fase 6. Sistema documental completo

### Objetivo

Dejar documentos y generator como parte productiva del sistema, no como demo aislada.

## 6.1 Docs index

Archivo actual:

- `src/app/(os)/docs/page.tsx`

Ya tiene:

- `Nuevo Documento` conectado a `templateSelector`
- `Importar` conectado a `importDocument`

Falta:

- listado real
- navegación a detalle real
- relación con proyectos/clientes

## 6.2 Docs detail

Archivo:

- `src/app/(os)/docs/[id]/page.tsx`

Debe convertirse en:

- vista real de lectura/edición ligera o metadatos del documento
- ruta conectada al listado

## 6.3 Generator

Archivo actual:

- `src/app/(os)/docs/generator/page.tsx`

Estado real:

- preview viva
- estado local hardcodeado
- plantillas HTML existentes
- sin integración de persistencia ni selección real

### Qué debe implementar la otra IA

- catálogo real de plantillas
- carga inicial por plantilla
- persistencia del documento generado
- relación con cliente/proyecto
- exportación o generación utilizable
- integración con `templateSelector`

### Archivos recomendados

- `src/lib/docs/template-catalog.ts`
- `src/lib/docs/document-generator.ts`
- servicios de docs persistidos

### Entregable

- generator útil para crear documentos reales del negocio

---

## Fase 7. Pantallas del OS todavía no auditadas y que deben quedar útiles

Estas rutas existen y forman parte del objetivo “100% funcional”.

### Rutas a auditar y completar

- `src/app/(os)/page.tsx`
- `src/app/(os)/hub/page.tsx`
- `src/app/(os)/projects/page.tsx`
- `src/app/(os)/projects/[id]/page.tsx`
- `src/app/(os)/projects/graph/page.tsx`
- `src/app/(os)/projects/timeline/page.tsx`
- `src/app/(os)/ai/page.tsx`
- `src/app/(os)/analytics/page.tsx`
- `src/app/(os)/marketing/page.tsx`
- `src/app/(os)/strategy/page.tsx`
- `src/app/(os)/team/page.tsx`
- `src/app/(os)/time/page.tsx`
- `src/app/(os)/settings/page.tsx`
- `src/app/(os)/sandbox/page.tsx`

### Regla de auditoría

Para cada una, decidir:

- cuál es su flujo principal
- de dónde obtiene datos
- qué CTA principal debe funcionar
- qué detalle, navegación o acción mínima la vuelve realmente útil

### Criterio mínimo de aceptación por pantalla

- abre sin romper
- no tiene CTA principal muerto
- se conecta con algo real
- el usuario entiende su propósito

---

## Fase 8. Integración con la página principal del workspace

### Objetivo

Permitir descubrir y usar Vertrex OS desde la landing sin romper la separación de apps.

### Esto sí debe hacerse

- exponer entrypoints claros hacia el OS
- exponer login
- exponer acceso al portal si aplica
- exponer demo o dashboard según estrategia

### Esto no debe hacerse

- mover `vertrex-os` dentro de la landing
- mezclar routers de forma improvisada
- romper el despliegue independiente del OS

### Resultado deseado

Un usuario que llega a la web principal puede:

- entrar al login del OS
- entrar a su portal si es cliente
- entender dónde empieza la experiencia del producto

---

## Fase 9. Notificaciones, auditoría y operaciones mínimas

### Objetivo

Que el sistema no solo funcione, sino que sea operable.

### Implementaciones mínimas esperadas

- auditoría de accesos sensibles en vault
- log básico de creación/edición de documentos
- log de tickets y cambios de estado
- alertas internas por Slack para eventos críticos si se usa `SLACK_WEBHOOK_URL`
- trazabilidad mínima de uploads

### Entregable

- sistema operable por equipo real sin ceguera total

---

## Fase 10. Testing y validación final

### Obligatorio antes de dar por terminado

#### Técnico

- TypeScript limpio
- lint razonable
- build OK

#### Manual

Probar como mínimo:

- `/login`
- ruta principal del OS
- `/hub`
- `/crm`
- `/calendar`
- `/assets`
- `/legal`
- `/vault`
- `/finance`
- `/automations`
- `/chat`
- `/docs`
- `/docs/[id]`
- `/docs/generator`
- `/projects`
- `/projects/[id]`
- `/budaphone`
- `/globalbank`

#### Flujos reales que deben probarse

- login staff
- acceso cliente
- creación de deal
- creación de evento
- upload de archivo
- apertura de documento
- generación de documento
- apertura de ticket
- visualización de factura
- lectura de thread o soporte

---

## 11. Checklist operativo final para la otra IA

## 11.1 Infra y seguridad

- [ ] instalar y configurar ORM
- [ ] crear schema DB
- [ ] crear migraciones
- [ ] crear seeds
- [ ] crear auth real
- [ ] crear middleware
- [ ] crear RBAC
- [ ] configurar storage

## 11.2 Frontend productivo

- [ ] mantener shell actual
- [ ] no rehacer overlays
- [ ] conectar pantallas a datos reales
- [ ] eliminar CTAs muertos
- [ ] dejar estados empty/error/loading mínimos

## 11.3 Portal

- [ ] terminar nuevo portal
- [ ] protegerlo con auth/rol
- [ ] conectarlo a data real
- [ ] dejarlo usable por cliente real

## 11.4 Docs

- [ ] listado real
- [ ] detail real
- [ ] generator real
- [ ] plantillas reales integradas
- [ ] persistencia documental

## 11.5 Operación real

- [ ] auditoría mínima
- [ ] alertas mínimas
- [ ] soporte y tickets mínimos
- [ ] facturas y transacciones mínimas

## 11.6 Calidad

- [ ] TypeScript limpio
- [ ] build limpia
- [ ] smoke test manual
- [ ] validación de permisos

---

## 12. Archivos clave ya existentes que la otra IA debe leer primero

### Core

- `src/lib/store/ui.ts`
- `src/components/overlays/os-overlay-manager.tsx`
- `src/components/providers.tsx`
- `src/app/(os)/layout.tsx`

### Portal

- `src/app/(portal)/[clientId]/page.tsx`
- `src/components/portal/client-portal-screen.tsx`
- `src/lib/portal/client-portal-data.ts`

### Docs

- `src/app/(os)/docs/page.tsx`
- `src/app/(os)/docs/[id]/page.tsx`
- `src/app/(os)/docs/generator/page.tsx`
- `src/app/(os)/docs/generator/plantillas/universales/oficio.html`
- `src/app/(os)/docs/generator/plantillas/budaphone-oficio.html`
- `src/app/(os)/docs/generator/plantillas/index.html`

### Auth actual visual

- `src/app/(auth)/login/page.tsx`

### Módulos ya tocados visualmente

- `src/app/(os)/crm/page.tsx`
- `src/app/(os)/calendar/page.tsx`
- `src/app/(os)/assets/page.tsx`
- `src/app/(os)/legal/page.tsx`
- `src/app/(os)/vault/page.tsx`
- `src/app/(os)/finance/page.tsx`
- `src/app/(os)/automations/page.tsx`
- `src/app/(os)/chat/page.tsx`

---

## 13. Instrucción final para la otra IA

No tratar este repo como un “frontend casi terminado”.

Tratarlo como esto:

- frontend visual muy adelantado
- capa UI global ya construida
- backend productivo todavía faltante
- portal y generator a medio camino
- necesidad real de llevarlo a uso interno y de clientes

El orden correcto es:

1. estabilizar
2. construir base técnica real
3. conectar dominios
4. convertir pantallas existentes en producto usable
5. terminar portal
6. terminar docs/generator
7. cerrar operación y calidad

Si otra IA sigue este plan con disciplina, puede dejar Vertrex OS realmente listo para el equipo y para clientes.
