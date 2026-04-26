# MEGA-PROMPT — VERTREX OS INTEGRATION
## Para GPT-5.4 (xhigh) — Modo agente autónomo, cero interrupciones

---

## ROL Y CONTEXTO

Eres el arquitecto de software principal de Vertrex, una startup colombiana de SaaS vertical. Tu trabajo es ejecutar una integración completa, autónoma y sin interrupciones. No haces preguntas. No pides confirmaciones. Tomas las decisiones de arquitectura correctas basándote en el contexto dado y ejecutas.

**Propiedad:** Todo el código que produzcas pertenece a Vertrex. Estilo visual: dark, premium, minimalista profesional — consistente con el OS existente (Next.js 15, Tailwind, shadcn/ui).

---

## MISIÓN COMPLETA

Tienes dos repos existentes de Next.js 15:

1. **`vertrex-landing`** — la página web pública de Vertrex (landing con secciones de marketing)
2. **`vertrex-os`** — el sistema operativo interno de Vertrex (dashboard tipo Linear/Notion para el equipo y clientes)

Tu misión tiene **6 fases** que ejecutas en orden, sin pausar entre ellas:

---

## FASE 1 — UNIFICACIÓN DE REPOS

### Objetivo
Convertir los dos repos separados en **un solo monorepo Next.js 15** donde:
- La landing vive en `/` (rutas públicas)
- El OS vive bajo `/os` (rutas protegidas para el equipo)
- El portal de cliente vive bajo `/portal/[clientId]` (rutas protegidas para clientes)

### Estructura de carpetas resultante

```
vertrex/                          ← raíz del monorepo (renombrar vertrex-landing)
├── src/
│   ├── app/
│   │   ├── (public)/             ← grupo de rutas públicas (landing)
│   │   │   ├── page.tsx          ← landing principal
│   │   │   ├── layout.tsx
│   │   │   └── [...secciones de la landing existente]
│   │   ├── (os)/                 ← grupo rutas OS (team)
│   │   │   ├── layout.tsx        ← shell del OS (sidebar, topbar, overlays)
│   │   │   ├── dashboard/
│   │   │   ├── projects/
│   │   │   ├── crm/
│   │   │   ├── finance/
│   │   │   ├── docs/
│   │   │   ├── legal/
│   │   │   ├── assets/
│   │   │   ├── calendar/
│   │   │   ├── chat/
│   │   │   ├── ai/
│   │   │   ├── automations/
│   │   │   ├── vault/
│   │   │   ├── settings/
│   │   │   ├── analytics/
│   │   │   ├── marketing/
│   │   │   ├── strategy/
│   │   │   ├── team/
│   │   │   └── time/
│   │   ├── (portal)/             ← grupo rutas portal cliente
│   │   │   ├── layout.tsx
│   │   │   └── portal/
│   │   │       └── [clientId]/
│   │   │           ├── page.tsx
│   │   │           ├── progress/
│   │   │           ├── documents/
│   │   │           ├── payments/
│   │   │           ├── files/
│   │   │           ├── access/
│   │   │           ├── support/
│   │   │           └── chat/
│   │   ├── (auth)/               ← login/register
│   │   │   ├── login/
│   │   │   │   └── page.tsx      ← login unificado con selector de tipo
│   │   │   └── register/
│   │   └── api/
│   │       ├── auth/
│   │       ├── os/               ← endpoints del OS
│   │       ├── portal/           ← endpoints del portal
│   │       └── openclaw/         ← endpoints para OpenClaw
│   ├── components/
│   │   ├── landing/              ← componentes de la landing
│   │   ├── os/                   ← componentes del OS
│   │   │   ├── layout/
│   │   │   ├── overlays/
│   │   │   └── [módulo]/
│   │   ├── portal/               ← componentes del portal
│   │   └── shared/               ← compartidos entre todos
│   ├── lib/
│   │   ├── db/                   ← Neon + Drizzle
│   │   ├── auth/                 ← Auth.js v5
│   │   ├── ai/                   ← capa de IA (Vercel AI SDK)
│   │   └── openclaw/             ← cliente y handlers de OpenClaw
│   └── middleware.ts             ← protección de rutas
├── drizzle/
│   └── schema.ts
├── .env.local.example
├── drizzle.config.ts
└── package.json
```

### Proceso de migración
1. Clona el contenido de `vertrex-os/src/app/(os)` dentro de `vertrex-landing/src/app/(os)`
2. Clona los componentes del OS en `src/components/os/`
3. Clona las utilidades del OS en `src/lib/`
4. Unifica `package.json` — mantén todas las dependencias de ambos repos sin duplicados
5. Unifica `tailwind.config.ts` — mantén todos los tokens de diseño
6. Unifica `globals.css`

---

## FASE 2 — AUTH Y BASE DE DATOS

### Auth.js v5 — dos tipos de usuario

Implementa autenticación completa con Auth.js v5 y Neon PostgreSQL.

#### Tipos de usuario
```typescript
// Dos roles distintos con flujos separados
type UserRole = 'team' | 'client'

// team → redirige a /dashboard después del login
// client → redirige a /portal/[clientId] después del login
```

#### Esquema Drizzle (Neon PostgreSQL)

```typescript
// drizzle/schema.ts — esquema completo

import { pgTable, uuid, text, timestamp, boolean, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core'

// Enums
export const userRoleEnum = pgEnum('user_role', ['team', 'client'])
export const projectStatusEnum = pgEnum('project_status', ['active', 'paused', 'completed', 'cancelled'])
export const dealStageEnum = pgEnum('deal_stage', ['lead', 'proposal', 'negotiation', 'won', 'lost'])
export const ticketStatusEnum = pgEnum('ticket_status', ['open', 'in_progress', 'resolved', 'closed'])
export const documentStatusEnum = pgEnum('document_status', ['draft', 'review', 'approved', 'sent', 'signed'])
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'paid', 'overdue', 'cancelled'])
export const automationStatusEnum = pgEnum('automation_status', ['active', 'paused', 'error'])

// Users
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: userRoleEnum('role').notNull().default('team'),
  clientId: uuid('client_id').references(() => clients.id),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Clients (empresas/personas que son clientes de Vertrex)
export const clients = pgTable('clients', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  company: text('company'),
  slug: text('slug').notNull().unique(), // para URL del portal
  avatarUrl: text('avatar_url'),
  status: text('status').default('active'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Projects
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  clientId: uuid('client_id').references(() => clients.id),
  status: projectStatusEnum('status').default('active'),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  progress: integer('progress').default(0),
  budget: integer('budget'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Tasks
export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  projectId: uuid('project_id').references(() => projects.id),
  assigneeId: uuid('assignee_id').references(() => users.id),
  status: text('status').default('todo'), // todo | in_progress | review | done
  priority: text('priority').default('medium'), // low | medium | high | urgent
  dueDate: timestamp('due_date'),
  order: integer('order').default(0),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Deals (CRM)
export const deals = pgTable('deals', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  clientId: uuid('client_id').references(() => clients.id),
  stage: dealStageEnum('stage').default('lead'),
  value: integer('value'),
  probability: integer('probability').default(0),
  closingDate: timestamp('closing_date'),
  notes: text('notes'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Documents
export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  templateId: text('template_id'),
  status: documentStatusEnum('status').default('draft'),
  projectId: uuid('project_id').references(() => projects.id),
  clientId: uuid('client_id').references(() => clients.id),
  dealId: uuid('deal_id').references(() => deals.id),
  createdById: uuid('created_by_id').references(() => users.id),
  sharedWithClient: boolean('shared_with_client').default(false),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Finance
export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: text('type').notNull(), // income | expense
  amount: integer('amount').notNull(), // en centavos COP
  description: text('description'),
  category: text('category'),
  clientId: uuid('client_id').references(() => clients.id),
  projectId: uuid('project_id').references(() => projects.id),
  date: timestamp('date').defaultNow(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Invoices (para el portal de cliente)
export const invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  projectId: uuid('project_id').references(() => projects.id),
  amount: integer('amount').notNull(),
  status: paymentStatusEnum('status').default('pending'),
  dueDate: timestamp('due_date'),
  paidAt: timestamp('paid_at'),
  description: text('description'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Assets
export const assets = pgTable('assets', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  type: text('type'), // image | pdf | video | doc | other
  size: integer('size'),
  projectId: uuid('project_id').references(() => projects.id),
  clientId: uuid('client_id').references(() => clients.id),
  uploadedById: uuid('uploaded_by_id').references(() => users.id),
  tags: jsonb('tags'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Events (Calendar)
export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  startAt: timestamp('start_at').notNull(),
  endAt: timestamp('end_at'),
  allDay: boolean('all_day').default(false),
  clientId: uuid('client_id').references(() => clients.id),
  projectId: uuid('project_id').references(() => projects.id),
  createdById: uuid('created_by_id').references(() => users.id),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Messages (Chat)
export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  senderId: uuid('sender_id').references(() => users.id).notNull(),
  channelId: uuid('channel_id').references(() => channels.id),
  threadId: uuid('thread_id').references(() => messages.id),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const channels = pgTable('channels', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  type: text('type').default('channel'), // channel | dm | portal
  clientId: uuid('client_id').references(() => clients.id),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Support Tickets
export const tickets = pgTable('tickets', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  status: ticketStatusEnum('status').default('open'),
  priority: text('priority').default('medium'),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  projectId: uuid('project_id').references(() => projects.id),
  assigneeId: uuid('assignee_id').references(() => users.id),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Vault Entries
export const vaultEntries = pgTable('vault_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(), // env | credential | totp | note
  encryptedData: text('encrypted_data').notNull(),
  projectId: uuid('project_id').references(() => projects.id),
  clientId: uuid('client_id').references(() => clients.id),
  createdById: uuid('created_by_id').references(() => users.id),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Automations
export const automations = pgTable('automations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  status: automationStatusEnum('status').default('paused'),
  trigger: jsonb('trigger').notNull(),
  actions: jsonb('actions').notNull(),
  lastRunAt: timestamp('last_run_at'),
  runCount: integer('run_count').default(0),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const automationLogs = pgTable('automation_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  automationId: uuid('automation_id').references(() => automations.id).notNull(),
  status: text('status').notNull(), // success | error
  output: jsonb('output'),
  error: text('error'),
  durationMs: integer('duration_ms'),
  createdAt: timestamp('created_at').defaultNow(),
})

// AI Memory (para la capa de IA del OS)
export const aiMemory = pgTable('ai_memory', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: text('key').notNull(),
  content: text('content').notNull(),
  category: text('category'), // project | client | global | openclaw
  projectId: uuid('project_id').references(() => projects.id),
  clientId: uuid('client_id').references(() => clients.id),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// OpenClaw Sessions
export const openclawSessions = pgTable('openclaw_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionKey: text('session_key').notNull().unique(),
  status: text('status').default('active'), // active | revoked
  lastSeenAt: timestamp('last_seen_at').defaultNow(),
  permissions: jsonb('permissions'), // qué puede leer/escribir
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
})
```

#### Middleware de rutas

```typescript
// middleware.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Rutas del OS — solo para role: 'team'
  if (pathname.startsWith('/dashboard') || 
      pathname.startsWith('/projects') ||
      pathname.startsWith('/crm') ||
      pathname.startsWith('/finance') ||
      pathname.startsWith('/docs') ||
      pathname.startsWith('/legal') ||
      pathname.startsWith('/assets') ||
      pathname.startsWith('/calendar') ||
      pathname.startsWith('/chat') ||
      pathname.startsWith('/ai') ||
      pathname.startsWith('/automations') ||
      pathname.startsWith('/vault') ||
      pathname.startsWith('/settings') ||
      pathname.startsWith('/analytics') ||
      pathname.startsWith('/marketing') ||
      pathname.startsWith('/strategy') ||
      pathname.startsWith('/team') ||
      pathname.startsWith('/time')) {
    if (!session) return NextResponse.redirect(new URL('/login?type=team', req.url))
    if (session.user.role !== 'team') return NextResponse.redirect(new URL('/portal/' + session.user.clientId, req.url))
  }

  // Rutas del portal — solo para role: 'client'
  if (pathname.startsWith('/portal')) {
    if (!session) return NextResponse.redirect(new URL('/login?type=client', req.url))
    if (session.user.role !== 'client') return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})
```

---

## FASE 3 — ADAPTAR LA LANDING

### Objetivo
La landing existente de Vertrex debe tener:

1. **Header actualizado** con dos CTAs de acceso:
   - `"Acceder al OS"` → `/login?type=team` (visible solo si no hay sesión de team)
   - `"Portal de cliente"` → `/login?type=client` (siempre visible)
   - Si hay sesión activa: botón `"Ir al dashboard"` o `"Ver mi portal"`

2. **Sección nueva al final de la landing** (antes del footer): 
   - Título: `"¿Ya trabajas con nosotros?"`
   - Dos cards: una para el equipo (acceso al OS) y otra para clientes (acceso al portal)
   - Diseño consistente con el resto de la landing

3. **Página de login unificada** (`/login`):
   - Detecta `?type=team` o `?type=client` y muestra UI ligeramente diferente
   - Team: logo de Vertrex, formulario email/password, opción OAuth (Google)
   - Client: saludo más cálido, solo email/password por defecto
   - Después del login redirige según el rol

No modifiques el diseño ni el contenido actual de la landing. Solo agrega estos elementos.

---

## FASE 4 — COMPLETAR EL OS (todas las piezas faltantes)

Lee el PRD adjunto completo. Implementa todo lo que está marcado como `Falta real` o `Existe pero no conectado`. A continuación las instrucciones precisas por módulo:

### 4.1 Sistema global de overlays

Crea `src/lib/store/ui.ts` con Zustand:

```typescript
interface UIStore {
  // Overlays activos
  commandCenter: boolean
  omniCreator: boolean
  universalInbox: boolean
  
  // Slide-overs con entidad seleccionada
  taskDetail: { open: boolean; id: string | null }
  clientDetail: { open: boolean; id: string | null }
  dealDetail: { open: boolean; id: string | null }
  eventDetail: { open: boolean; id: string | null }
  assetDetail: { open: boolean; id: string | null }
  vaultEntry: { open: boolean; id: string | null }
  threadDetail: { open: boolean; id: string | null }
  contractDetail: { open: boolean; id: string | null }
  ticketDetail: { open: boolean; id: string | null }

  // Modales
  uploadFile: { open: boolean; context: string | null }
  importDocument: boolean
  registerTransaction: { open: boolean; type: 'income' | 'expense' | null }
  connectCredential: boolean
  createDeal: boolean
  createEvent: boolean
  createTicket: boolean
  createAutomation: boolean
  templateSelector: { open: boolean; onSelect: ((id: string) => void) | null }

  // Acciones
  open: (key: string, payload?: any) => void
  close: (key: string) => void
  toggle: (key: string) => void
}
```

Monta todos los overlays en `src/app/(os)/layout.tsx`. Conecta keyboard shortcuts:
- `Cmd+K` → Command Center
- `Cmd+N` → Omni Creator  
- `Cmd+I` → Universal Inbox

### 4.2 Slide-overs faltantes (crea todos)

Cada slide-over debe recibir `{ open, onOpenChange, id }` y cargar sus datos via SWR/React Query desde la API:

**EventDetail** (`/calendar`)
- Título, descripción, fecha/hora, duración
- Cliente y proyecto vinculados
- Asistentes
- Botones: Editar, Eliminar, Agregar a calendario

**AssetDetail** (`/assets`)
- Preview del archivo (imagen inline, PDF embed, icono para otros tipos)
- Metadata: nombre, tipo, tamaño, fecha de subida, subido por
- Tags IA (campo editable)
- Proyectos/clientes vinculados
- Botones: Descargar, Compartir con cliente, Eliminar

**VaultEntryDetail** (`/vault`)
- Tipo de entrada (env, credential, totp, note)
- Campos según tipo:
  - `env`: key/value pairs en textarea monospace con botón "Copiar todo"
  - `credential`: usuario, contraseña (oculta por defecto), URL, notas
  - `totp`: código TOTP en tiempo real (actualizable cada 30s), QR
  - `note`: texto libre
- Historial de accesos
- Botones: Copiar, Editar, Revocar

**ThreadDetail** (`/chat`)
- Mensajes del hilo
- Responder inline
- Convertir a tarea (abre TaskDetail en modo create)
- Menciones y reactions

**ContractDetail** (`/legal`)
- Vista del documento (HTML preview o PDF embed)
- Estado, fechas clave, partes firmantes
- Timeline de versiones
- Botones: Enviar a firma, Descargar PDF, Compartir con cliente, Nueva versión

**TicketDetail** (`/portal` y `/support`)
- Título, descripción, estado, prioridad
- Cliente y proyecto vinculados
- Historial de actividad/comentarios
- Asignación
- Botones: Cambiar estado, Asignar, Responder

### 4.3 Modales faltantes (crea todos)

**UploadFile**
- Drag & drop + selector
- Contexto: Assets, Docs, Portal
- Preview antes de subir
- Tags opcionales
- Upload a Vercel Blob (configura con `BLOB_READ_WRITE_TOKEN`)

**ImportDocument**
- Input de URL o subida de archivo
- Tipos: PDF, DOCX, TXT, Markdown
- Nombre del documento resultante
- A qué proyecto/cliente vincularlo

**RegisterTransaction**
- Tipo: Ingreso / Gasto (toggle)
- Monto en COP
- Categoría (select con opciones predefinidas + "Otro")
- Descripción
- Cliente y proyecto opcionales
- Fecha (default: hoy)

**ConnectCredential**
- Nombre de la credencial
- Tipo: env | credential | totp | note
- Campos dinámicos según tipo
- Encripta con `VAULT_SECRET` antes de guardar en DB

**CreateDeal**
- Título, cliente (autocomplete), valor en COP
- Stage inicial
- Fecha de cierre estimada
- Notas

**CreateEvent**
- Título, descripción
- Fecha/hora inicio y fin
- Todo el día (toggle)
- Cliente y proyecto opcionales
- Repetición (nunca, diario, semanal, mensual)

**CreateTicket**
- Título, descripción
- Prioridad
- Cliente (pre-seleccionado si viene del portal)
- Proyecto
- Asignado a

**CreateAutomation** (modal de entrada rápida)
- Nombre
- Trigger type (select): nuevo proyecto creado, nueva tarea, nuevo cliente, mensaje recibido, etc.
- Acción principal (select): enviar email, crear tarea, notificar Slack, llamar webhook
- El canvas completo se abre después

**TemplateSelector**
- Grid de plantillas con preview thumbnail
- Filtros: universales / por cliente / por tipo de documento
- Búsqueda por nombre
- Preview en hover
- Botón "Usar esta plantilla"

### 4.4 Generador de documentos — conectar a plantillas

```
src/app/(os)/docs/generator/
├── page.tsx              ← conectar con el store de plantillas
├── components/
│   ├── TemplatePanel.tsx ← panel izquierdo de selección
│   ├── MetaPanel.tsx     ← metadatos del documento
│   ├── EditorPanel.tsx   ← editor de contenido
│   └── PreviewPanel.tsx  ← preview A4 en vivo
└── plantillas/           ← ya existe, conectar al generador
    ├── universales/
    └── [clientId]/
```

Implementa:
1. Al entrar al generador, si viene de `?template=id` preselecciona esa plantilla
2. El `TemplatePanel` lee las plantillas de `plantillas/` y las muestra como cards
3. Al seleccionar una plantilla, carga su HTML en el `EditorPanel` con variables `{{nombre_cliente}}` etc.
4. El `MetaPanel` tiene campos para las variables de la plantilla
5. El `PreviewPanel` renderiza el HTML con las variables reemplazadas en tiempo real
6. Botón `"Guardar"` → crea documento en la tabla `documents` y redirige a `/docs/[id]`
7. Botón `"Exportar PDF"` → llama a `/api/docs/export` que usa Puppeteer o `@react-pdf/renderer`
8. Botón `"Enviar al cliente"` → abre modal de confirmación, marca `shared_with_client: true`

### 4.5 Portal de cliente — completar todas las subvistas

`/portal/[clientId]` debe tener un layout con sidebar y las siguientes rutas funcionales:

**Dashboard** (`/portal/[clientId]`)
- Resumen general: proyectos activos, pagos pendientes, próximos entregables, documentos recientes
- Cards con estado real desde la DB

**Progreso** (`/portal/[clientId]/progress`)
- Lista de proyectos del cliente
- Por proyecto: nombre, progreso (%), tareas completadas / total, fechas
- Al hacer click en un proyecto: detalle de tareas visible para el cliente (sin datos internos)

**Documentos** (`/portal/[clientId]/documents`)
- Lista de documentos compartidos (`shared_with_client: true`)
- Tipos: propuesta, SOW, contrato, acta, manual, otro
- Preview y descarga de cada documento
- Sin acceso a documentos no compartidos

**Pagos** (`/portal/[clientId]/payments`)
- Total contratado, pagado, pendiente con barra de progreso
- Tabla de facturas: fecha, descripción, monto, estado, CTA de pago
- Historial de transacciones pagadas

**Archivos** (`/portal/[clientId]/files`)
- Archivos compartidos por el equipo de Vertrex
- Subida de archivos por parte del cliente
- Organización por categoría/proyecto
- Vista grid o lista

**Accesos** (`/portal/[clientId]/access`)
- Credenciales que el equipo Vertrex compartió con este cliente
- Tipo de acceso: hosting, admin web, repositorio, etc.
- Cada credencial muestra nombre, tipo, y botón "Revelar" (autenticado)

**Soporte** (`/portal/[clientId]/support`)
- Lista de tickets del cliente con estado y prioridad
- Botón "Nuevo ticket"
- Al hacer click: detalle del ticket con historial de mensajes

**Chat** (`/portal/[clientId]/chat`)
- Chat directo entre el cliente y el equipo Vertrex
- Historial de mensajes
- Notificaciones de mensajes nuevos
- Indicador de "en línea"

**Chatbot IA** (botón flotante en todas las páginas del portal)
- Panel lateral deslizable
- Responde preguntas del cliente sobre su proyecto usando contexto de la DB:
  - Estado del proyecto
  - Próximos entregables
  - Facturas pendientes
  - Contacto del equipo
- Usa la API de IA configurada (ver Fase 5)

### 4.6 Tabs y navegación funcional en todos los módulos

Implementa navegación real (no visual) en:

**Finance** — tabs como `searchParams`:
- `?tab=overview` (default)
- `?tab=income`
- `?tab=expenses`  
- `?tab=subscriptions`
- `?tab=transactions`

**Settings** — tabs:
- `?tab=profile`
- `?tab=preferences`
- `?tab=team`
- `?tab=security`
- `?tab=billing`
- `?tab=integrations`
- `?tab=ai-engine`

**AI** — tabs:
- `?tab=console`
- `?tab=autonomous`
- `?tab=memory`
- `?tab=history`

**Vault** — tabs:
- `?tab=env`
- `?tab=credentials`
- `?tab=totp`
- `?tab=notes`

**Projects/[id]** — tabs:
- `?tab=overview`
- `?tab=board`
- `?tab=timeline`
- `?tab=graph`
- `?tab=docs`
- `?tab=assets`

### 4.7 Automations — completar el módulo

**Lista de automatizaciones** (`/automations`):
- Tabla con nombre, status (toggle activo/pausado), trigger, última ejecución, # de ejecuciones
- Botón "Nueva automatización" → `CreateAutomation` modal de entrada → lleva al canvas

**Canvas** (`/automations/[id]`):
- El canvas existente debe cargar la automatización real desde la DB
- Inspector de nodo: al hacer click en cualquier nodo, abre panel lateral derecho con configuración
- Librería de triggers (panel izquierdo):
  - Nuevo proyecto creado
  - Nueva tarea asignada
  - Factura creada
  - Mensaje de cliente recibido
  - Ticket creado
  - Formulario completado
  - Webhook recibido
  - Schedule (cron)
- Librería de acciones:
  - Enviar email
  - Crear tarea
  - Crear documento
  - Notificar por Slack (`SLACK_WEBHOOK_URL`)
  - Llamar webhook externo
  - Enviar mensaje al cliente
  - Actualizar campo en DB

**Historial de ejecuciones** (`?tab=history`):
- Tabla: automatización, fecha, duración, resultado (éxito/error)
- Al hacer click: detalle del output/error

---

## FASE 5 — CAPA DE INTELIGENCIA ARTIFICIAL

### Stack de IA
- **Vercel AI SDK** (`ai` package) para streaming
- **Modelo configurable** desde `Settings > Motor de IA` (guardado en `ai_memory` table con key `config:ai-model`)
- Por defecto usa `gpt-4o` si no hay configuración guardada

### 5.1 Consola IA del OS (`/ai`)

La consola es un chat completo donde el agente tiene acceso a herramientas (tools):

```typescript
// src/lib/ai/os-agent.ts
const osTools = {
  getProjects: { /* lista proyectos con filtros */ },
  getProject: { /* detalle de un proyecto específico */ },
  createTask: { /* crea tarea en un proyecto */ },
  updateTask: { /* actualiza estado/asignación de tarea */ },
  getClients: { /* lista clientes */ },
  getClient: { /* detalle de cliente */ },
  createDocument: { /* crea documento */ },
  getFinanceSummary: { /* resumen financiero */ },
  createTransaction: { /* registra transacción */ },
  getCalendarEvents: { /* eventos próximos */ },
  createEvent: { /* crea evento */ },
  getTickets: { /* lista tickets */ },
  updateTicket: { /* actualiza ticket */ },
  searchMemory: { /* busca en ai_memory */ },
  saveMemory: { /* guarda en ai_memory */ },
  // OpenClaw tool (si está conectado)
  callOpenClaw: { /* llama a una skill de OpenClaw */ },
}
```

El agente tiene un **system prompt** que incluye:
- Contexto de Vertrex (empresa, proyectos activos, clientes)
- Fecha y hora actual
- Usuario que está usando el OS
- Memoria persistente (últimas 20 entradas de `ai_memory` con category = 'global')

### 5.2 Operaciones autónomas (`/ai?tab=autonomous`)

Panel donde el usuario puede:
- Ver tareas que el agente está ejecutando o ejecutó
- Iniciar una operación larga (ej: "Resume el estado de todos los proyectos y envía un email a cada cliente")
- Ver el log de ejecución en tiempo real via streaming

### 5.3 Memoria empresarial (`/ai?tab=memory`)

CRUD de la tabla `ai_memory`:
- Lista de memorias con categoría, clave, contenido, fecha
- Crear nueva memoria
- Editar/eliminar
- Filtrar por categoría: project | client | global | openclaw

### 5.4 Chatbot del portal de cliente

```typescript
// src/lib/ai/client-agent.ts
// System prompt para el chatbot del portal:
// - Solo tiene acceso a datos del clientId en sesión
// - Responde en español, tono amable y profesional
// - Tools disponibles: getMyProjects, getMyDocuments, getMyInvoices, getMyTickets, createTicket
```

### 5.5 Configuración del motor de IA (`Settings > Motor de IA`)

Formulario que guarda en `ai_memory`:
- Provider: OpenAI / Anthropic / Custom
- API Key (encriptada)
- Modelo seleccionado
- Temperature
- Prompt del sistema (customizable)
- Botón "Probar configuración"

---

## FASE 6 — OPENCLAW INTEGRATION

OpenClaw es una instancia de agente IA que Manu (el founder de Vertrex) tiene corriendo localmente. Necesita poder conectarse al OS para leer, escribir y controlar todo.

### 6.1 API de OpenClaw

Crea `src/app/api/openclaw/` con los siguientes endpoints. Todos requieren `Authorization: Bearer {OPENCLAW_API_KEY}` (variable de entorno):

```
GET  /api/openclaw/status          → estado del OS, métricas básicas
GET  /api/openclaw/projects        → todos los proyectos
GET  /api/openclaw/projects/[id]   → detalle de proyecto + tareas
POST /api/openclaw/projects        → crear proyecto
PATCH /api/openclaw/projects/[id]  → actualizar proyecto

GET  /api/openclaw/tasks           → todas las tareas (con filtros: ?projectId= &status= &assignee=)
POST /api/openclaw/tasks           → crear tarea
PATCH /api/openclaw/tasks/[id]     → actualizar tarea

GET  /api/openclaw/clients         → todos los clientes
GET  /api/openclaw/clients/[id]    → detalle de cliente
POST /api/openclaw/clients         → crear cliente

GET  /api/openclaw/finance/summary → resumen financiero
POST /api/openclaw/finance         → registrar transacción

GET  /api/openclaw/documents       → lista documentos
POST /api/openclaw/documents       → crear documento

GET  /api/openclaw/memory          → leer memoria empresarial
POST /api/openclaw/memory          → guardar en memoria
DELETE /api/openclaw/memory/[id]   → eliminar memoria

POST /api/openclaw/ai/chat         → enviar mensaje al agente del OS y recibir respuesta
POST /api/openclaw/webhooks        → recibir eventos desde OpenClaw hacia el OS
```

### 6.2 Formato estándar de respuestas

```typescript
// Todas las respuestas siguen este formato
interface OpenClawResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
  requestId: string
}
```

### 6.3 Webhooks de OpenClaw → OS

OpenClaw puede enviar eventos al OS via `POST /api/openclaw/webhooks`:

```typescript
interface OpenClawWebhook {
  event: 'task.completed' | 'memory.updated' | 'alert' | 'skill.result' | 'custom'
  payload: any
  sessionKey: string
}
```

Al recibir un webhook:
- `task.completed` → marca la tarea como completada en la DB
- `memory.updated` → guarda en `ai_memory` con category: 'openclaw'
- `alert` → crea una notificación en el OS visible en la topbar
- `skill.result` → guarda el resultado en `ai_memory` y puede crear entidades según el tipo

### 6.4 Panel de OpenClaw en el OS (`/ai?tab=openclaw`)

- Estado de conexión (conectado / desconectado / última vez visto)
- Historial de actividad reciente de OpenClaw
- Botón para revocar el API key y generar uno nuevo
- Logs de webhooks recibidos
- Campo para enviar un mensaje directo a la instancia de OpenClaw

### 6.5 Variables de entorno para OpenClaw

```env
OPENCLAW_API_KEY=        # key que OpenClaw usa para autenticarse al OS
OPENCLAW_WEBHOOK_SECRET= # para verificar webhooks entrantes
```

---

## VARIABLES DE ENTORNO

Crea `.env.local.example` con todas las variables necesarias y comentarios:

```env
# Base de datos (Neon PostgreSQL)
DATABASE_URL=postgresql://...
DATABASE_URL_UNPOOLED=postgresql://...

# Auth.js v5
AUTH_SECRET=                    # genera con: openssl rand -base64 32
AUTH_GOOGLE_ID=                 # opcional, para OAuth con Google
AUTH_GOOGLE_SECRET=

# IA (el usuario configura el proveedor desde la UI también)
OPENAI_API_KEY=                 # OpenAI
ANTHROPIC_API_KEY=              # Anthropic (opcional)

# Storage (Vercel Blob para assets/docs)
BLOB_READ_WRITE_TOKEN=

# Vault (para encriptar credenciales)
VAULT_SECRET=                   # genera con: openssl rand -base64 32

# OpenClaw
OPENCLAW_API_KEY=               # genera con: openssl rand -hex 32
OPENCLAW_WEBHOOK_SECRET=        # genera con: openssl rand -hex 32

# Notificaciones
SLACK_WEBHOOK_URL=              # opcional, para automatizaciones

# App
NEXT_PUBLIC_APP_URL=            # URL pública del app (ej: https://app.vertrex.co)
NEXT_PUBLIC_OS_URL=             # URL del OS (ej: https://os.vertrex.co o /dashboard)
```

---

## REGLAS DE IMPLEMENTACIÓN — OBLIGATORIAS

1. **Nunca dejes TODOs sin implementar.** Si un componente necesita datos, usa datos mock realistas hasta que la API esté lista, pero crea también la API.

2. **Toda pantalla tiene datos.** No dejes pantallas vacías. Si no hay datos en la DB, muestra un estado vacío con mensaje y CTA.

3. **Error boundaries en todos los módulos.** Cada sección del OS tiene su propio error boundary.

4. **Loading states.** Usa Suspense + skeleton loaders consistentes con el diseño del OS.

5. **Mobile responsive del portal de cliente.** El portal debe funcionar perfectamente en móvil. El OS no necesita ser mobile-first pero debe ser usable.

6. **Tipado estricto.** TypeScript strict mode. Sin `any`. Si necesitas escape hatch, usa `unknown` y castea.

7. **Server Components por defecto.** Solo usa `'use client'` cuando sea estrictamente necesario (interactividad, stores, eventos del browser).

8. **API Routes son Route Handlers.** Usa el App Router de Next.js 15 para todo.

9. **Drizzle para todas las queries.** Sin SQL raw excepto para queries complejas de analytics que lo justifiquen.

10. **Consistencia visual.** No inventes componentes nuevos si ya existen en el OS. Reutiliza los existentes.

11. **El `.env.local.example` siempre actualizado.** Toda nueva variable de entorno que agregues debe estar documentada ahí.

12. **Sin secrets en el código.** Todo configurable via variables de entorno.

---

## ORDEN DE EJECUCIÓN

Ejecuta exactamente en este orden:

1. Migración de repos y estructura de carpetas
2. Instalar dependencias unificadas
3. Configurar Drizzle + Neon (schema + migraciones)
4. Configurar Auth.js v5
5. Middleware de rutas
6. Adaptar landing (header + sección + login page)
7. Sistema de overlays global (store Zustand)
8. Todos los slide-overs faltantes
9. Todos los modales faltantes
10. Generador de documentos conectado a plantillas
11. Portal de cliente completo (todas las subvistas)
12. Tabs funcionales en todos los módulos
13. Completar módulo de Automations
14. Capa de IA (consola + tools + memoria)
15. API de OpenClaw (todos los endpoints)
16. Panel de OpenClaw en el OS
17. Chatbot del portal
18. `.env.local.example` final
19. `README.md` con instrucciones de setup

---

## ENTREGABLE FINAL

Un repo Next.js 15 funcional donde:

- [ ] La landing de Vertrex tiene CTAs de acceso al OS y al portal
- [ ] Login unificado redirige según el rol del usuario
- [ ] El OS completo funciona con datos reales desde Neon
- [ ] Todos los modales, slide-overs y details están implementados y conectados
- [ ] El generador de documentos está conectado a las plantillas HTML
- [ ] El portal de cliente tiene todas las subvistas funcionales
- [ ] La capa de IA está integrada en todo el OS con tools reales
- [ ] OpenClaw puede conectarse y controlar todo el OS via API
- [ ] Todas las variables de entorno están documentadas
- [ ] El setup completo tarda < 10 minutos siguiendo el README

**El usuario (Manu) solo debe:** clonar el repo, copiar `.env.local.example` a `.env.local`, rellenar sus credenciales (Neon, OpenAI, etc.), ejecutar `npm run db:push` y `npm run dev`. Nada más.

---

*Prompt generado para Vertrex — Manu Ortiz — Neiva, Colombia*
*Stack: Next.js 15 · Neon PostgreSQL · Drizzle · Auth.js v5 · Tailwind · shadcn/ui · Vercel AI SDK · Zustand*
