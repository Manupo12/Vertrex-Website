# Vertrex OS — Documento de Mejoras para Software Empresarial Real
**Versión:** 1.0  
**Fecha:** 2026-04-27  
**Base:** PRD v9.0 + Roadmap de implementación  
**Propósito:** Especificación completa de mejoras para elevar Vertrex OS a nivel de software empresarial de producción

---

## Índice

1. [Modelo de datos y arquitectura relacional](#1-modelo-de-datos-y-arquitectura-relacional)
2. [Sistema de permisos y gobierno de acceso](#2-sistema-de-permisos-y-gobierno-de-acceso)
3. [Auditoría y trazabilidad completa](#3-auditoría-y-trazabilidad-completa)
4. [CRM y gobierno comercial](#4-crm-y-gobierno-comercial)
5. [Projects y delivery operativo](#5-projects-y-delivery-operativo)
6. [Portal cliente premium](#6-portal-cliente-premium)
7. [Documents y Legal](#7-documents-y-legal)
8. [Finance y Billing](#8-finance-y-billing)
9. [Vault empresarial](#9-vault-empresarial)
10. [Knowledge Hub autónomo](#10-knowledge-hub-autónomo)
11. [IA supervisada y aprobaciones](#11-ia-supervisada-y-aprobaciones)
12. [Automatizaciones auditables](#12-automatizaciones-auditables)
13. [Analytics y observabilidad del negocio](#13-analytics-y-observabilidad-del-negocio)
14. [Experiencia interna del equipo](#14-experiencia-interna-del-equipo)
15. [Infraestructura y resiliencia](#15-infraestructura-y-resiliencia)
16. [Notificaciones y comunicación](#16-notificaciones-y-comunicación)
17. [Onboarding y activación de cliente](#17-onboarding-y-activación-de-cliente)
18. [Búsqueda global y navegación](#18-búsqueda-global-y-navegación)
19. [Accesibilidad y UX avanzado](#19-accesibilidad-y-ux-avanzado)
20. [Seguridad empresarial](#20-seguridad-empresarial)

---

## 1. Modelo de datos y arquitectura relacional

### 1.1 Entidad `entity_relations` polimórfica universal

**Problema actual:** las relaciones entre entidades son FKs directas y rígidas. Un ticket no puede vincularse a un documento sin cambiar el esquema. Un link no puede alimentar simultáneamente un proyecto y una propuesta.

**Mejora:**

```sql
CREATE TABLE entity_relations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_type    TEXT NOT NULL,  -- 'client' | 'project' | 'document' | 'ticket' | 'deal' | 'link' | ...
  from_id      UUID NOT NULL,
  to_type      TEXT NOT NULL,
  to_id        UUID NOT NULL,
  relation_type TEXT NOT NULL, -- 'originated_from' | 'depends_on' | 'feeds_into' | 'supersedes' | 'blocks'
  inverse_label TEXT,          -- label de la relación vista desde el otro lado
  metadata     JSONB,
  created_by   UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(from_type, from_id, to_type, to_id, relation_type)
);
```

**Impacto:** cualquier entidad del sistema puede relacionarse con cualquier otra sin migraciones adicionales. Un ticket puede convertirse en proyecto, un link puede alimentar conocimiento, un documento puede derivar de múltiples deals.

---

### 1.2 Entidad `events` como log de negocio estructurado

**Problema actual:** los cambios de estado importantes (deal ganado, portal activado, documento publicado) no tienen un registro estructurado de negocio separado del log técnico.

**Mejora:**

```sql
CREATE TABLE business_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type   TEXT NOT NULL,  -- 'deal.won' | 'portal.activated' | 'invoice.paid' | 'doc.published'
  entity_type  TEXT NOT NULL,
  entity_id    UUID NOT NULL,
  actor_type   TEXT NOT NULL CHECK (actor_type IN ('user', 'ai', 'system', 'automation')),
  actor_id     UUID,
  payload      JSONB NOT NULL DEFAULT '{}',
  snapshot_before JSONB,      -- estado antes del cambio
  snapshot_after  JSONB,      -- estado después del cambio
  client_id    UUID REFERENCES clients(id),
  project_id   UUID REFERENCES projects(id),
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX ON business_events(entity_type, entity_id);
CREATE INDEX ON business_events(event_type);
CREATE INDEX ON business_events(client_id);
CREATE INDEX ON business_events(created_at DESC);
```

**Impacto:** base real para auditoría, analytics, replay de estado, feed de actividad y alertas.

---

### 1.3 Entidad `milestones` como ciudadano de primera clase

**Problema actual:** los milestones no existen como entidad, o viven como tareas especiales con metadata.

**Mejora:**

```sql
CREATE TABLE milestones (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id     UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  description    TEXT,
  status         milestone_status NOT NULL DEFAULT 'pending',
  target_date    DATE,
  completed_at   TIMESTAMPTZ,
  approved_by    UUID REFERENCES users(id),
  client_visible BOOLEAN DEFAULT true,
  weight         INTEGER DEFAULT 1,   -- peso para cálculo de progreso
  order_index    INTEGER DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

CREATE TYPE milestone_status AS ENUM (
  'pending', 'in_progress', 'under_review', 'approved', 'completed', 'blocked', 'skipped'
);
```

**Impacto:** progreso real del proyecto basado en milestones, visibilidad configurable al cliente, cálculo ponderado de avance.

---

### 1.4 Entidad `links` canónica

**Problema actual:** los links viven mezclados en credenciales con `linkUrl`, sin estructura propia.

**Mejora:**

```sql
CREATE TABLE links (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url          TEXT NOT NULL,
  title        TEXT,
  description  TEXT,
  image_url    TEXT,
  domain       TEXT GENERATED ALWAYS AS (
    regexp_replace(url, '^https?://([^/]+).*', '\1')
  ) STORED,
  link_type    link_type NOT NULL DEFAULT 'url_general',
  client_id    UUID REFERENCES clients(id),
  project_id   UUID REFERENCES projects(id),
  tags         TEXT[],
  metadata     JSONB,
  preview_fetched_at TIMESTAMPTZ,
  created_by   UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TYPE link_type AS ENUM (
  'url_general', 'perfil_social', 'repo_github', 'cuenta_tiktok',
  'streaming_comunidad', 'dashboard_externo', 'saas', 'referencia_documental'
);
```

---

### 1.5 Columna `metadata` estructurada con validación por tipo de entidad

En lugar de JSONB libre en todas las tablas, definir schemas de metadata por tipo usando `CHECK` constraints o validación a nivel de servicio.

Ejemplo para `documents`:
```json
{
  "visibility_profile": "resumen | hitos | entregables | completo",
  "recurrence": { "enabled": true, "interval": "monthly", "next_due": "2026-05-27" },
  "signed_at": "2026-04-01T10:00:00Z",
  "signed_by_client": true,
  "portal_pinned": false
}
```

---

## 2. Sistema de permisos y gobierno de acceso

### 2.1 Modelo de subroles con capacidades por módulo

**Problema actual:** solo existe `team` y `client`. El equipo pequeño opera con permisos uniformes.

**Mejora — tabla `team_capabilities`:**

```sql
CREATE TYPE team_subrole AS ENUM (
  'admin', 'ops', 'dev', 'growth', 'finance_legal', 'support'
);

ALTER TABLE users ADD COLUMN subrole team_subrole;

CREATE TABLE team_capabilities (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id),
  module       TEXT NOT NULL,   -- 'vault' | 'finance' | 'ai_actions' | 'portal_manage' | ...
  can_read     BOOLEAN DEFAULT false,
  can_write    BOOLEAN DEFAULT false,
  can_delete   BOOLEAN DEFAULT false,
  can_approve  BOOLEAN DEFAULT false,
  granted_by   UUID REFERENCES users(id),
  granted_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, module)
);
```

**Capacidades por subrole por defecto:**

| Módulo | admin | ops | dev | growth | finance_legal | support |
|--------|-------|-----|-----|--------|---------------|---------|
| vault.reveal | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ |
| finance.write | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| portal.manage | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| ai.approve | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| clients.delete | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| docs.publish | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |

---

### 2.2 Middleware de autorización centralizado

**Problema actual:** los guards de ruta están dispersos o son inconsistentes entre módulos.

**Mejora — helper canónico:**

```typescript
// lib/auth/can.ts
export async function can(
  userId: string,
  action: 'read' | 'write' | 'delete' | 'approve',
  module: string,
  context?: { clientId?: string; projectId?: string }
): Promise<boolean>

// Uso en server actions
const allowed = await can(session.user.id, 'approve', 'ai_actions')
if (!allowed) throw new ForbiddenError('No tienes permiso para aprobar acciones de IA')
```

---

### 2.3 Tokens de acceso temporal para portal

Para casos donde el cliente necesita compartir acceso temporal con terceros (ej: su contador revisa billing):

```sql
CREATE TABLE portal_access_tokens (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id    UUID NOT NULL REFERENCES clients(id),
  token        TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  scope        TEXT[] NOT NULL,   -- ['billing', 'documents']
  created_by   UUID REFERENCES users(id),
  expires_at   TIMESTAMPTZ NOT NULL,
  used_at      TIMESTAMPTZ,
  revoked_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT now()
);
```

---

## 3. Auditoría y trazabilidad completa

### 3.1 Tabla de auditoría transversal

```sql
CREATE TABLE audit_log (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action       TEXT NOT NULL,        -- 'vault.credential.revealed' | 'doc.published' | 'invoice.status_changed'
  actor_type   TEXT NOT NULL,        -- 'user' | 'ai' | 'system' | 'automation'
  actor_id     UUID,
  actor_label  TEXT,                 -- nombre del usuario o 'OpenClaw' para IA
  entity_type  TEXT NOT NULL,
  entity_id    UUID NOT NULL,
  entity_label TEXT,
  client_id    UUID,
  project_id   UUID,
  ip_address   INET,
  user_agent   TEXT,
  diff         JSONB,               -- { before: {...}, after: {...} }
  metadata     JSONB,
  severity     TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX ON audit_log(entity_type, entity_id);
CREATE INDEX ON audit_log(actor_id);
CREATE INDEX ON audit_log(client_id);
CREATE INDEX ON audit_log(action);
CREATE INDEX ON audit_log(created_at DESC);
CREATE INDEX ON audit_log(severity) WHERE severity != 'info';
```

### 3.2 Eventos mínimos que DEBEN auditarse

| Evento | Severidad | Notas |
|--------|-----------|-------|
| `auth.login` | info | IP + user agent |
| `auth.logout` | info | |
| `auth.failed_attempt` | warning | IP + count |
| `vault.credential.revealed` | critical | campo, user, IP |
| `vault.credential.copied` | critical | |
| `vault.credential.exported` | critical | |
| `vault.credential.rotated` | warning | |
| `doc.published` | warning | snapshot del doc |
| `doc.status_changed` | info | diff de estado |
| `deal.stage_changed` | info | diff de etapa + valor |
| `invoice.status_changed` | warning | diff completo |
| `invoice.paid` | warning | monto + método |
| `portal.activated` | warning | quién lo activó |
| `portal.access_token.created` | critical | scope + expiry |
| `ai.action.proposed` | info | acción + confianza |
| `ai.action.approved` | warning | quién aprobó |
| `ai.action.rejected` | info | quién rechazó |
| `ai.action.executed` | warning | resultado |
| `user.permission_changed` | critical | diff de capacidades |
| `client.deleted` | critical | snapshot completo |

---

### 3.3 Diff documental — snapshots históricos

Cuando un documento cambia de estado a `published`, `signed` o `archived`, guardar snapshot:

```sql
CREATE TABLE document_snapshots (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id    UUID NOT NULL REFERENCES documents(id),
  status_at_time document_status NOT NULL,
  content_hash   TEXT,              -- SHA-256 del contenido
  content_json   JSONB,             -- snapshot del contenido
  triggered_by   UUID REFERENCES users(id),
  created_at     TIMESTAMPTZ DEFAULT now()
);
```

**Uso real:** si hay disputa sobre qué decía un contrato cuando fue firmado, tienes el snapshot exacto.

---

### 3.4 Panel de auditoría para admins

Vista `/os/audit` con:
- Filtros: por tipo de acción, severidad, actor, entidad, rango de fechas
- Alertas de severidad `critical` no revisadas
- Export CSV/JSON por rango
- Agrupación por cliente o proyecto
- Indicador "N acciones críticas sin revisar" en el sidebar

---

## 4. CRM y gobierno comercial

### 4.1 Stages canónicos con transiciones válidas

```typescript
// lib/crm/stages.ts
export const DEAL_STAGES = {
  sin_contactar:       { label: 'Sin contactar',        order: 0, group: 'prospecto' },
  contactado:          { label: 'Contactado',            order: 1, group: 'prospecto' },
  pendiente:           { label: 'Pendiente',             order: 2, group: 'prospecto' },
  interesado:          { label: 'Interesado',            order: 3, group: 'calificado' },
  propuesta_enviada:   { label: 'Propuesta enviada',     order: 4, group: 'propuesta' },
  pendiente_anticipo_50: { label: 'Pendiente anticipo',  order: 5, group: 'cierre' },
  cliente_activo:      { label: 'Cliente activo',        order: 6, group: 'ganado' },
  pausado:             { label: 'Pausado',               order: 7, group: 'especial' },
  perdido:             { label: 'Perdido',               order: 8, group: 'cerrado' },
} as const

// Transiciones válidas — no todo puede ir a cualquier lado
export const VALID_TRANSITIONS: Record<string, string[]> = {
  sin_contactar:     ['contactado', 'perdido'],
  contactado:        ['pendiente', 'interesado', 'perdido'],
  pendiente:         ['interesado', 'contactado', 'perdido'],
  interesado:        ['propuesta_enviada', 'perdido'],
  propuesta_enviada: ['pendiente_anticipo_50', 'interesado', 'perdido'],
  pendiente_anticipo_50: ['cliente_activo', 'perdido', 'pausado'],
  cliente_activo:    ['pausado', 'perdido'],
  pausado:           ['cliente_activo', 'perdido'],
  perdido:           [],  // terminal
}
```

---

### 4.2 Deal score automático

Calcular un score de probabilidad de cierre basado en señales del sistema:

| Señal | Puntos |
|-------|--------|
| Deal con propuesta enviada | +20 |
| Respuesta del cliente en < 48h | +15 |
| Cliente tiene interacciones en portal | +10 |
| Tiene documento SOW generado | +10 |
| Valor del deal > promedio histórico | -5 |
| Deal lleva más de 30 días sin avanzar | -20 |
| Deal estuvo en `perdido` antes | -10 |

Score visible como indicador en el kanban del CRM, no como promesa de ML sino como señal operativa rápida.

---

### 4.3 Regla de activación comercial con enforcement real

**Mejora — trigger en el backend:**

```typescript
// Antes de crear portal o activar proyecto pago, validar:
async function validateActivationEligibility(dealId: string) {
  const deal = await getDeal(dealId)
  const invoices = await getInvoicesByDeal(dealId)
  
  const anticipo = invoices.find(i => 
    i.type === 'anticipo' && 
    i.status === 'paid' &&
    i.amount >= deal.value * 0.5
  )
  
  if (!anticipo) {
    throw new ActivationBlockedError(
      'El proyecto no puede activarse formalmente hasta recibir el anticipo del 50%.',
      { dealId, currentPaid: getTotalPaid(invoices), required: deal.value * 0.5 }
    )
  }
  
  return { eligible: true, anticoId: anticipo.id }
}
```

Los admins pueden crear una `activation_exception` auditada para bypass.

---

### 4.4 Timeline de deal visible en el OS

Vista lateral al abrir un deal con:
- Línea de tiempo de cambios de etapa
- Tiempo en cada etapa
- Todas las interacciones relacionadas (mensajes, documentos, archivos, notas)
- Velocidad de avance vs promedio histórico
- Valor y probabilidad editables con historial

---

### 4.5 Notas internas de deal con visibilidad controlada

```sql
CREATE TABLE deal_notes (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id   UUID NOT NULL REFERENCES deals(id),
  author_id UUID NOT NULL REFERENCES users(id),
  content   TEXT NOT NULL,
  is_private BOOLEAN DEFAULT true,    -- nunca al cliente
  pinned    BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 5. Projects y delivery operativo

### 5.1 Progress score real con perfiles configurables

**Fórmula oficial:**

```typescript
type ProgressProfile = 'milestones' | 'deliverables' | 'tasks' | 'balanced' | 'custom'

interface ProgressWeights {
  milestones: number      // default: 0.40
  deliverables: number    // default: 0.30
  tasks: number           // default: 0.20
  billing: number         // default: 0.10
}

function calculateProjectProgress(
  projectId: string,
  profile: ProgressProfile = 'balanced'
): number {
  const weights = getWeightsForProfile(profile)
  
  const milestoneScore = completedMilestones / totalMilestones
  const deliverableScore = approvedDeliverables / totalDeliverables
  const taskScore = doneTasks / (totalTasks - blockedTasks)
  const billingScore = paidAmount / totalProjectValue
  
  return (
    milestoneScore * weights.milestones +
    deliverableScore * weights.deliverables +
    taskScore * weights.tasks +
    billingScore * weights.billing
  ) * 100
}
```

El perfil es configurable por proyecto desde el OS, y el cliente ve el resultado sin ver los pesos.

---

### 5.2 Dependencias entre tareas

```sql
CREATE TABLE task_dependencies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id       UUID NOT NULL REFERENCES tasks(id),
  depends_on_id UUID NOT NULL REFERENCES tasks(id),
  dependency_type TEXT DEFAULT 'finish_to_start',
  CHECK (task_id != depends_on_id)
);
```

En la UI, mostrar tareas bloqueadas con indicador visual y referencia a la tarea bloqueante.

---

### 5.3 Kickoff como evento formal

Al activar un proyecto, crear automáticamente:
- Evento de `project.kickoff` en `business_events`
- Tarea de kickoff con checklist pre-configurada
- Documento de bienvenida en `draft`
- Notificación interna al equipo asignado
- Registro en el timeline del deal como `cliente_activo` confirmado

---

### 5.4 Estados extendidos de tarea con semántica clara

```sql
CREATE TYPE task_status AS ENUM (
  'backlog',       -- existe pero no está priorizada
  'todo',          -- priorizada y lista para iniciar
  'in_progress',   -- alguien está trabajando en esto
  'review',        -- ejecutada, esperando revisión interna
  'client_review', -- enviada al cliente para aprobación
  'done',          -- revisada y cerrada formalmente
  'blocked',       -- bloqueada por dependencia explícita
  'archived'       -- cerrada sin completar, no afecta métricas
);
```

**Regla de negocio:** `client_review` activa notificación automática al cliente si el portal está activo.

---

### 5.5 Estimaciones y velocidad del equipo

```sql
ALTER TABLE tasks ADD COLUMN estimated_points INTEGER;
ALTER TABLE tasks ADD COLUMN actual_points INTEGER;
ALTER TABLE tasks ADD COLUMN estimated_hours DECIMAL(5,2);
ALTER TABLE tasks ADD COLUMN actual_hours DECIMAL(5,2);
ALTER TABLE tasks ADD COLUMN started_at TIMESTAMPTZ;
ALTER TABLE tasks ADD COLUMN completed_at TIMESTAMPTZ;
```

Con estos datos, calcular velocidad promedio por usuario y por tipo de tarea, y usar eso para estimar cuándo quedará listo el proyecto.

---

### 5.6 Entregables como entidad separada

```sql
CREATE TABLE deliverables (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID NOT NULL REFERENCES projects(id),
  milestone_id UUID REFERENCES milestones(id),
  title        TEXT NOT NULL,
  description  TEXT,
  status       TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'in_progress', 'ready_for_review', 'approved', 'rejected', 'archived'
  )),
  file_url     TEXT,
  document_id  UUID REFERENCES documents(id),
  client_visible BOOLEAN DEFAULT true,
  approved_by_client BOOLEAN DEFAULT false,
  approved_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT now()
);
```

---

## 6. Portal cliente premium

### 6.1 Request channels diferenciados

**Problema actual:** todos los requests son tickets con metadata, sin UI diferenciada.

**Mejora — tipos de request con flujo propio:**

```sql
CREATE TYPE portal_request_type AS ENUM (
  'documento',    -- "necesito el contrato firmado en PDF"
  'acceso',       -- "necesito acceso a Google Analytics"
  'asset',        -- "necesito el logo en vector"
  'aprobacion',   -- "necesito aprobar este diseño"
  'cambio',       -- "quiero modificar algo del proyecto"
  'soporte',      -- "algo no está funcionando"
  'consulta'      -- "tengo una pregunta"
);

CREATE TABLE portal_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     UUID NOT NULL REFERENCES clients(id),
  request_type  portal_request_type NOT NULL,
  subject       TEXT NOT NULL,
  description   TEXT,
  priority      TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status        TEXT DEFAULT 'open' CHECK (status IN (
    'open', 'acknowledged', 'in_progress', 'waiting_client', 'resolved', 'closed'
  )),
  assigned_to   UUID REFERENCES users(id),
  sla_deadline  TIMESTAMPTZ,
  resolved_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);
```

---

### 6.2 SLA con tracking en tiempo real

```typescript
const SLA_RULES: Record<PortalRequestType, { ack: number; resolution: number }> = {
  documento:   { ack: 24, resolution: 48 },   // horas hábiles
  acceso:      { ack: 24, resolution: 48 },
  asset:       { ack: 24, resolution: 72 },
  aprobacion:  { ack: 4,  resolution: 24 },
  cambio:      { ack: 24, resolution: 96 },
  soporte:     { ack: 4,  resolution: 48 },
  consulta:    { ack: 8,  resolution: 24 },
}

// Estado visual del SLA
type SlaStatus = 'on_track' | 'at_risk' | 'breached'

function getSlaStatus(request: PortalRequest): SlaStatus {
  const hoursElapsed = getBusinessHoursElapsed(request.created_at)
  const threshold = SLA_RULES[request.request_type].ack
  if (hoursElapsed < threshold * 0.7) return 'on_track'
  if (hoursElapsed < threshold) return 'at_risk'
  return 'breached'
}
```

En el portal del cliente, cada request muestra un indicador visual verde/amarillo/rojo según SLA. En el OS interno, un panel muestra requests en riesgo o incumplidos.

---

### 6.3 Feed de actividad del cliente

En la home del portal, un feed cronológico de todo lo que pasó en la cuenta:

- Documento publicado
- Tarea completada
- Milestone alcanzado
- Invoice emitida
- Acceso compartido
- Mensaje del equipo
- Entregable listo para revisar

Con filtros por tipo y rango de fechas.

---

### 6.4 Aprobaciones desde el portal

El cliente puede aprobar/rechazar desde el portal:
- Entregables marcados como `client_review`
- Documentos enviados para firma
- Propuestas de cambio

Cada aprobación queda registrada con timestamp y crea un evento en `business_events`.

```sql
CREATE TABLE client_approvals (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     UUID NOT NULL REFERENCES clients(id),
  entity_type   TEXT NOT NULL,   -- 'deliverable' | 'document' | 'proposal'
  entity_id     UUID NOT NULL,
  decision      TEXT NOT NULL CHECK (decision IN ('approved', 'rejected', 'revision_requested')),
  comment       TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);
```

---

### 6.5 Vista de credenciales/accesos en portal con control fino

El cliente ve solo las credenciales publicadas explícitamente para él. Mejoras:
- Botón "copiar" con confirmación y registro de uso
- Estado de vigencia (activo/expirado/revocado)
- Fecha de última rotación visible
- Sección "accesos pendientes de entrega" para accesos comprometidos pero no publicados aún

---

### 6.6 Modo "presentación" del portal

Para reuniones de avance, el cliente puede ver su portal en modo presentación:
- Progress bar grande y visual
- Milestones como timeline horizontal
- Próximos hitos con fecha estimada
- Resumen financiero simple

---

## 7. Documents y Legal

### 7.1 Estados documentales completos con transiciones válidas

```sql
CREATE TYPE document_status AS ENUM (
  'draft',      -- borrador editable
  'review',     -- en revisión interna
  'sent',       -- enviado al cliente
  'approved',   -- aprobado (sin firma requerida)
  'signed',     -- firmado formalmente
  'published',  -- publicado en portal
  'archived',   -- archivado, no activo
  'expired',    -- venció (contratos, SOW con vigencia)
  'void'        -- anulado explícitamente
);
```

**Transiciones válidas:**

```
draft → review → sent → approved → signed → published → archived
                                           ↓
                              (con vigencia) → expired
                     ↓
                   void (desde cualquier estado)
```

---

### 7.2 Sistema de vigencia y renovación para contratos

```sql
ALTER TABLE documents ADD COLUMN valid_from DATE;
ALTER TABLE documents ADD COLUMN valid_until DATE;
ALTER TABLE documents ADD COLUMN auto_renew BOOLEAN DEFAULT false;
ALTER TABLE documents ADD COLUMN renewal_notice_days INTEGER DEFAULT 30;
ALTER TABLE documents ADD COLUMN renewed_from UUID REFERENCES documents(id);
ALTER TABLE documents ADD COLUMN version_number INTEGER DEFAULT 1;
ALTER TABLE documents ADD COLUMN superseded_by UUID REFERENCES documents(id);
```

**Jobs de vigencia (pg_cron):**
- Diariamente: detectar documentos que vencen en `renewal_notice_days` días y crear alerta
- Al vencer: cambiar estado a `expired` automáticamente
- Con `auto_renew`: crear nueva versión del documento en `draft` para revisión

---

### 7.3 Enforcement de invoice → documento

Validación al crear o emitir una invoice:

```typescript
async function validateInvoiceDocumentCoverage(invoiceId: string) {
  const invoice = await getInvoice(invoiceId)
  
  if (invoice.status === 'issued' && !invoice.document_id) {
    const warnings = ['Esta invoice no tiene documento soporte ligado.']
    
    // Buscar documentos relacionados del mismo cliente/proyecto como sugerencia
    const suggestions = await findRelatedDocuments(invoice.client_id, invoice.project_id)
    
    return {
      valid: false,
      warnings,
      suggestions,
      canOverride: await userHasCapability(currentUser, 'finance.override')
    }
  }
  
  return { valid: true }
}
```

---

### 7.4 Editor de documentos con variables

Para el generador documental, soportar variables contextuales:

```
{{cliente.nombre}}
{{cliente.nit}}
{{proyecto.titulo}}
{{proyecto.valor_total}}
{{deal.fecha_firma}}
{{usuario.nombre}}
{{fecha_hoy}}
```

Al generar el documento, las variables se resuelven desde el estado real del sistema. Si falta un valor, se marca como `[PENDIENTE: cliente.nit]` en el draft.

---

### 7.5 Firma digital simple

Para documentos que requieren firma del cliente, implementar firma simple dentro del portal:
- El cliente recibe notificación cuando un documento está listo para firmar
- Hace clic en "Firmar" → confirma con su contraseña o código de 6 dígitos enviado a email
- Se registra `client_approvals` con tipo `document.signed`, timestamp e IP
- El documento pasa a estado `signed` y se genera snapshot inmutable

Esto no es firma electrónica con validez legal plena (para eso necesitarías Certicámara u otro proveedor), pero es un registro auditable que demuestra intención del cliente.

---

## 8. Finance y Billing

### 8.1 Estados completos de invoice

```sql
CREATE TYPE invoice_status AS ENUM (
  'draft',           -- creada pero no emitida
  'issued',          -- emitida formalmente
  'pending',         -- pendiente de pago
  'partially_paid',  -- pago parcial recibido
  'overdue',         -- vencida sin pagar
  'paid',            -- pagada completa
  'disputed',        -- en disputa
  'canceled',        -- cancelada antes de pago
  'waived'           -- condonada explícitamente
);
```

---

### 8.2 Separación clara revenue atribuido vs realizado

```sql
-- En el dashboard financiero, calcular siempre por separado:
-- Revenue atribuido: valor total de deals en estado cliente_activo
SELECT SUM(d.value) as revenue_attributed
FROM deals d
WHERE d.stage = 'cliente_activo'

-- Revenue realizado: suma de invoices paid en el período
SELECT SUM(i.amount) as revenue_realized
FROM invoices i
WHERE i.status = 'paid'
  AND i.paid_at BETWEEN :start AND :end
```

Mostrar ambas métricas siempre juntas en el dashboard, nunca una sola.

---

### 8.3 Widget de runway con proyección

```typescript
interface RunwayProjection {
  available_cash: number
  monthly_burn_rate: number      // promedio últimos 3 meses
  runway_months: number          // available_cash / monthly_burn_rate
  zero_date: Date                // fecha estimada de caja en 0
  pending_collections: number    // cuentas por cobrar no vencidas
  adjusted_runway_months: number // si se cobran las pendientes
}
```

El widget muestra:
- Barra de runway con color (verde > 6 meses, amarillo 3-6, rojo < 3)
- Fecha de runway 0
- Impacto de cobros pendientes si se normalizan
- Actualización automática con cada transacción nueva

---

### 8.4 Proyecciones de caja a 3 meses

Basado en:
- Transacciones recurrentes conocidas (contratos mensuales)
- Invoices emitidas con fecha de vencimiento
- Historial de pagos del cliente (tasa de pago en término)
- Egresos fijos conocidos

Mostrar como gráfico de línea con banda de confianza.

---

### 8.5 Alertas financieras automáticas

| Alerta | Trigger | Destinatario |
|--------|---------|--------------|
| Invoice próxima a vencer | 7 días antes | finance_legal + ops |
| Invoice vencida sin pago | día 1 de vencimiento | admin + finance_legal |
| Invoice en disputa | al marcarla disputed | admin |
| Runway < 3 meses | en cada recálculo | admin |
| Deal sin invoice después de activación | 5 días después | ops |
| Cliente sin cobro en 60+ días | recurrente | growth |

---

### 8.6 Registro de promesas de pago

```sql
CREATE TABLE payment_promises (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id   UUID NOT NULL REFERENCES invoices(id),
  client_id    UUID NOT NULL REFERENCES clients(id),
  promised_date DATE NOT NULL,
  promised_amount DECIMAL(12,2),
  channel      TEXT,   -- 'portal' | 'chat' | 'whatsapp' | 'llamada'
  notes        TEXT,
  fulfilled    BOOLEAN,
  fulfilled_at TIMESTAMPTZ,
  created_by   UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ DEFAULT now()
);
```

Visible tanto en el OS interno como en la sección de billing del portal del cliente.

---

## 9. Vault empresarial

### 9.1 Categorías oficiales con íconos y color

```typescript
export const VAULT_CATEGORIES = {
  portal_cliente:      { label: 'Portal cliente',        icon: 'user-circle',    color: '#3B82F6' },
  redes_sociales:      { label: 'Redes sociales',        icon: 'share-2',        color: '#8B5CF6' },
  ads_platforms:       { label: 'Plataformas de ads',    icon: 'bar-chart-2',    color: '#F59E0B' },
  dominio_dns:         { label: 'Dominio y DNS',         icon: 'globe',          color: '#10B981' },
  hosting_cloud:       { label: 'Hosting y cloud',       icon: 'cloud',          color: '#06B6D4' },
  repositorio_devops:  { label: 'Repos y DevOps',        icon: 'git-branch',     color: '#6366F1' },
  pagos_finanzas:      { label: 'Pagos y finanzas',      icon: 'credit-card',    color: '#EF4444' },
  email_workspace:     { label: 'Email y workspace',     icon: 'mail',           color: '#F97316' },
  saas_productividad:  { label: 'SaaS y productividad',  icon: 'layout',         color: '#84CC16' },
  ai_tools:            { label: 'Herramientas IA',       icon: 'cpu',            color: '#A855F7' },
  streaming_comunidad: { label: 'Streaming y comunidad', icon: 'radio',          color: '#EC4899' },
  legal_compliance:    { label: 'Legal y compliance',    icon: 'shield',         color: '#14B8A6' },
  webhook_integracion: { label: 'Webhooks e integraciones', icon: 'link',        color: '#F59E0B' },
  otra:                { label: 'Otra',                  icon: 'more-horizontal', color: '#6B7280' },
} as const
```

---

### 9.2 Separación metadata / secreto

**Problema actual:** las credenciales exponen todo o nada.

**Mejora — modelo de dos capas:**

```sql
CREATE TABLE vault_credentials (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id    UUID REFERENCES clients(id),
  project_id   UUID REFERENCES projects(id),
  category     vault_category NOT NULL,
  label        TEXT NOT NULL,
  service_name TEXT,
  service_url  TEXT,
  username     TEXT,           -- visible con permiso read
  notes        TEXT,           -- visible con permiso read
  -- Secretos encriptados — solo con permiso vault.reveal
  password_enc TEXT,           -- encriptado en reposo
  api_key_enc  TEXT,
  secret_enc   TEXT,
  -- Gobierno
  last_rotated_at TIMESTAMPTZ,
  rotation_reminder_days INTEGER DEFAULT 90,
  published_to_portal BOOLEAN DEFAULT false,
  created_by   UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);
```

**Regla:** `username`, `service_url`, `label` y `notes` son visibles con permiso `vault.read`. Los campos `*_enc` requieren `vault.reveal` y generan evento de auditoría `critical`.

---

### 9.3 Rotación con historial

```sql
CREATE TABLE vault_rotation_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credential_id   UUID NOT NULL REFERENCES vault_credentials(id),
  rotated_by      UUID NOT NULL REFERENCES users(id),
  rotation_reason TEXT,
  previous_hash   TEXT,      -- hash del valor anterior (no el valor)
  rotated_at      TIMESTAMPTZ DEFAULT now()
);
```

Vista en el vault: "Última rotación: 45 días. Próxima rotación recomendada en 45 días."

---

### 9.4 Health check del vault

Panel que muestra:
- Credenciales sin rotar en más de 90 días (configurable)
- Credenciales sin categoría
- Credenciales sin client/project asociado
- Credenciales con `published_to_portal=true` de clientes sin portal activo
- Credenciales de clientes churned/perdidos

---

## 10. Knowledge Hub autónomo

### 10.1 Preview automático de links (tipo OG)

Al guardar un link, hacer fetch del `og:title`, `og:description`, `og:image` y favicon:

```typescript
async function fetchLinkPreview(url: string): Promise<LinkPreview> {
  // En un edge function o job background
  const html = await fetch(url, { headers: { 'User-Agent': 'VertrexOS/1.0' } })
  const og = parseOpenGraph(html)
  
  return {
    title: og.title || extractTitleFromUrl(url),
    description: og.description?.slice(0, 160),
    image_url: og.image,
    favicon_url: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
    domain: extractDomain(url),
    fetched_at: new Date(),
  }
}
```

Preview guardado en `links.metadata`. Re-fetch opcional por el usuario o automático cada 30 días.

---

### 10.2 Colecciones de links

```sql
CREATE TABLE link_collections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  client_id   UUID REFERENCES clients(id),
  project_id  UUID REFERENCES projects(id),
  is_public   BOOLEAN DEFAULT false,  -- visible en portal
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE link_collection_items (
  collection_id UUID REFERENCES link_collections(id),
  link_id       UUID REFERENCES links(id),
  order_index   INTEGER DEFAULT 0,
  added_by      UUID REFERENCES users(id),
  added_at      TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (collection_id, link_id)
);
```

Uso típico: "Recursos del proyecto X para el cliente Y" → colección publicada en portal.

---

### 10.3 Hub como base de conocimiento

El Hub debe agregar y hacer buscable:
- Links guardados con preview
- Documentos internos (tipo `manual_usuario`, `procedimiento`)
- Archivos marcados como "recurso reutilizable"
- Snippets de conocimiento guardados desde chats con la IA

Con búsqueda full-text sobre título, descripción, tags y contenido.

---

## 11. IA supervisada y aprobaciones

### 11.1 Cola de aprobaciones persistida

**Problema actual:** las confirmaciones de IA son modales en el momento, no persisten si el admin no estaba disponible.

**Mejora — entidad `pending_ai_actions`:**

```sql
CREATE TABLE pending_ai_actions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type    TEXT NOT NULL,    -- 'doc.publish' | 'invoice.status_change' | 'portal.activate'
  description    TEXT NOT NULL,    -- descripción en lenguaje natural de lo que va a hacer
  entity_type    TEXT NOT NULL,
  entity_id      UUID NOT NULL,
  proposed_diff  JSONB NOT NULL,   -- qué va a cambiar exactamente
  confidence     DECIMAL(3,2),     -- 0.0 a 1.0
  sources        JSONB,            -- qué información usó para proponer esto
  status         TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'approved', 'rejected', 'expired', 'executed'
  )),
  requested_at   TIMESTAMPTZ DEFAULT now(),
  expires_at     TIMESTAMPTZ DEFAULT now() + INTERVAL '48 hours',
  reviewed_by    UUID REFERENCES users(id),
  reviewed_at    TIMESTAMPTZ,
  review_comment TEXT,
  executed_at    TIMESTAMPTZ,
  execution_result JSONB
);
```

**Panel en el OS:** `N acciones de IA pendientes de aprobación` en el sidebar, con vista de todas las acciones pendientes, sus diffs y opciones de aprobar/rechazar.

---

### 11.2 Catálogo explícito de capacidades IA

```typescript
// lib/ai/capabilities.ts
export const AI_CAPABILITIES = {
  // Sin aprobación
  'summarize.document':     { requiresApproval: false },
  'detect.gaps':            { requiresApproval: false },
  'classify.ticket':        { requiresApproval: false },
  'recommend.next_action':  { requiresApproval: false },
  'draft.document':         { requiresApproval: false },
  'organize.knowledge':     { requiresApproval: false },
  'explain.system_state':   { requiresApproval: false },
  
  // Con aprobación obligatoria
  'invoice.change_status':  { requiresApproval: true, severity: 'high' },
  'doc.publish':            { requiresApproval: true, severity: 'high' },
  'message.send_client':    { requiresApproval: true, severity: 'high' },
  'access.create':          { requiresApproval: true, severity: 'critical' },
  'access.revoke':          { requiresApproval: true, severity: 'critical' },
  'vault.reveal':           { requiresApproval: true, severity: 'critical' },
  'portal.activate':        { requiresApproval: true, severity: 'high' },
  'automation.trigger':     { requiresApproval: true, severity: 'high' },
} as const
```

---

### 11.3 Memoria estructurada por namespace

```sql
CREATE TABLE ai_memory (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  namespace  TEXT NOT NULL,  -- 'global' | 'client:{id}' | 'project:{id}' | 'procedure' | 'legal'
  key        TEXT NOT NULL,
  value      TEXT NOT NULL,
  tags       TEXT[],
  source     TEXT,           -- 'user_input' | 'system_inference' | 'document'
  confidence DECIMAL(3,2),
  expires_at TIMESTAMPTZ,
  created_by TEXT,           -- user_id o 'ai'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(namespace, key)
);
```

La IA solo puede acceder a memoria del cliente en contexto — nunca a memoria de otros clientes.

---

### 11.4 Explicabilidad en la UI

Cuando la IA genera algo (borrador, clasificación, recomendación), mostrar siempre:

```
┌─────────────────────────────────────────────────────┐
│ 🤖 OpenClaw generó este borrador                     │
│                                                     │
│ Basado en:                                          │
│  • Documento "SOW Cliente X" (memoria de proyecto)  │
│  • Contrato firmado el 2026-03-01                   │
│  • Historial de mensajes del cliente                │
│                                                     │
│ Confianza: 87%    [Ver diff]  [Aprobar] [Rechazar]  │
└─────────────────────────────────────────────────────┘
```

---

## 12. Automatizaciones auditables

### 12.1 Playbooks como entidad configurada

```sql
CREATE TABLE automation_playbooks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  trigger_type TEXT NOT NULL,   -- 'deal.stage_changed' | 'invoice.overdue' | 'doc.expired'
  trigger_conditions JSONB,    -- { "stage": "cliente_activo", "previous_stage": "pendiente_anticipo_50" }
  actions     JSONB NOT NULL,  -- array de acciones a ejecutar
  is_active   BOOLEAN DEFAULT false,
  requires_approval BOOLEAN DEFAULT true,
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

---

### 12.2 Casos de automatización preparados (no activos por defecto)

| Trigger | Acción sugerida | Requiere aprobación |
|---------|-----------------|---------------------|
| Deal → `cliente_activo` sin proyecto | Crear proyecto en borrador + alertar ops | No |
| Anticipo del 50% pagado | Proponer activación de portal | Sí |
| Proyecto activo sin kickoff en 3 días | Alertar admin + crear tarea de kickoff | No |
| Invoice emitida sin documento | Bloquear emisión y pedir documento | No |
| Documento con vigencia expira en 30 días | Crear tarea de renovación | No |
| Credencial sin rotación en 90 días | Alertar vault manager | No |
| Ticket sin respuesta en 24h hábiles | Escalar a admin | No |

---

### 12.3 Log de ejecución de automatizaciones

```sql
CREATE TABLE automation_executions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playbook_id     UUID REFERENCES automation_playbooks(id),
  trigger_event   JSONB NOT NULL,
  actions_taken   JSONB NOT NULL,
  result          TEXT CHECK (result IN ('success', 'partial', 'failed', 'skipped')),
  error_message   TEXT,
  approval_id     UUID REFERENCES pending_ai_actions(id),
  executed_at     TIMESTAMPTZ DEFAULT now()
);
```

---

## 13. Analytics y observabilidad del negocio

### 13.1 Dashboard ejecutivo con métricas canónicas

**Métricas de primera clase — siempre visibles:**

| Métrica | Fórmula |
|---------|---------|
| Clientes activos | COUNT deals WHERE stage = 'cliente_activo' |
| Prospectos calificados | COUNT deals WHERE stage IN ('interesado', 'propuesta_enviada') |
| Conversión comercial | deals ganados / deals totales (últimos 90 días) |
| Revenue atribuido | SUM deal.value WHERE stage = 'cliente_activo' |
| Revenue realizado (mes) | SUM invoice.amount WHERE paid = true AND mes = actual |
| Cuentas por cobrar | SUM invoice.amount WHERE status IN ('pending', 'overdue') |
| Caja disponible | ingresos liquidados - egresos liquidados |
| Runway | caja / burn_rate_mensual |
| Proyectos activos | COUNT projects WHERE status = 'active' |
| Tareas abiertas | COUNT tasks WHERE status IN ('todo', 'in_progress', 'blocked') |
| SLA breaches (7 días) | COUNT requests WHERE sla_breached = true |
| Cobertura invoice-doc | invoices con doc / total invoices emitidas |

---

### 13.2 Funnel comercial visual

Visualización del pipeline de deals agrupado por stage con:
- Número de deals por etapa
- Valor total en cada etapa
- Tiempo promedio en cada etapa
- Tasa de conversión entre etapas adyacentes
- Comparación período actual vs anterior

---

### 13.3 Capacidad del equipo por proyecto

```typescript
interface TeamCapacityView {
  user_id: string
  user_name: string
  active_projects: number
  open_tasks: number
  estimated_hours_pending: number
  velocity: number        // puntos/tareas completadas por semana (últimas 4)
  capacity_status: 'available' | 'normal' | 'at_risk' | 'overloaded'
}
```

Vista de tabla + barras de carga por usuario. Ayuda a asignar tareas nuevas a quien tiene capacidad real.

---

### 13.4 Health score por cliente

Score compuesto de 0-100 que indica qué tan saludable está la relación con el cliente:

| Factor | Peso |
|--------|------|
| Invoices al día (sin overdue) | 25% |
| Tickets respondidos en SLA | 20% |
| Portal activo y con actividad | 15% |
| Progreso del proyecto normal | 20% |
| Última interacción reciente | 10% |
| Documentos sin vencer | 10% |

Score visible en el listado de clientes como indicador visual. Clientes con score bajo generan alerta.

---

### 13.5 Adopción del portal por cliente

```
Cliente X: Portal activo desde hace 45 días
  Último acceso: hace 3 días
  Sesiones este mes: 12
  Requests enviados: 3
  Documentos descargados: 5
  Mensajes enviados: 8
  Aprobaciones pendientes: 1
```

Panel agregado: tasa de adopción general, clientes con portal activo pero sin acceso en 14+ días (en riesgo de churn).

---

## 14. Experiencia interna del equipo

### 14.1 WorkspaceSnapshot como panel de salud del sistema

Vista `/os/health` que muestra el estado real del sistema ahora:

**Secciones:**

- **Operación en riesgo:** proyectos sin kickoff, clientes activos sin portal, tareas bloqueadas sin owner
- **Finanzas en riesgo:** invoices overdue, invoices sin documento, runway < 3 meses
- **Vault en riesgo:** credenciales sin rotar, categorías faltantes
- **Portal pendiente:** aprobaciones del cliente sin revisar, requests SLA breached
- **IA pendiente:** acciones propuestas sin aprobar desde hace más de 24h

Cada ítem es clickable y lleva directamente a la entidad.

---

### 14.2 Command palette global (Cmd+K)

Buscador global tipo Spotlight que permite:
- Navegar a cualquier cliente, proyecto, deal, documento
- Ejecutar acciones rápidas: "crear tarea", "nuevo deal", "ir a portal de [cliente]"
- Buscar en todos los módulos simultáneamente
- Accesos recientes y frecuentes

---

### 14.3 Sidebar contextual de cliente

Al estar en cualquier vista relacionada con un cliente, sidebar colapsable que muestra:
- Health score del cliente
- Deal stage actual
- Próxima fecha de vencimiento (invoice o documento)
- Último mensaje del cliente
- Tareas abiertas del proyecto activo
- Acciones rápidas: nuevo mensaje, nueva tarea, ver portal

---

### 14.4 Vista "Mi día" para cada usuario del equipo

Home personalizada al iniciar sesión con:
- Tareas asignadas a mí ordenadas por prioridad
- Tickets/requests asignados a mí
- Reuniones o kickoffs del día (si se integra calendario)
- Aprobaciones pendientes que me competen
- Alertas de SLA en mis responsabilidades

---

### 14.5 Historial de acciones recientes en el OS

Feed de actividad del equipo en la barra lateral derecha:
- "Manu publicó el contrato de Cliente X"
- "OpenClaw propuso cambiar stage de Deal Y"
- "Cliente Z dejó un nuevo mensaje"
- "Invoice #001 fue pagada"

Con opción de silenciar tipos de evento específicos.

---

## 15. Infraestructura y resiliencia

### 15.1 Soft delete universal

Todas las entidades críticas deben tener `deleted_at TIMESTAMPTZ` en lugar de eliminación real. Nunca usar `DELETE` en tablas de negocio desde la aplicación.

```sql
-- Patrón universal
ALTER TABLE clients ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE projects ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE documents ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE invoices ADD COLUMN deleted_at TIMESTAMPTZ;
-- etc.

-- Todos los queries por defecto filtran:
WHERE deleted_at IS NULL
```

---

### 15.2 Optimistic locking para cambios concurrentes

Para entidades editadas frecuentemente (documentos, deals, tareas):

```sql
ALTER TABLE documents ADD COLUMN version INTEGER DEFAULT 1 NOT NULL;
```

```typescript
// Al guardar:
const result = await db.update(documents)
  .set({ ...changes, version: document.version + 1, updated_at: new Date() })
  .where(and(
    eq(documents.id, documentId),
    eq(documents.version, document.version)  // si alguien más editó, falla
  ))
  .returning()

if (result.length === 0) {
  throw new ConflictError('Este documento fue modificado por otro usuario. Refresca y vuelve a intentar.')
}
```

---

### 15.3 Rate limiting por usuario en acciones sensibles

```typescript
// Límites en acciones críticas del vault y auth
const RATE_LIMITS = {
  'vault.reveal':        { max: 10, windowMs: 60_000 },
  'auth.login_attempt':  { max: 5,  windowMs: 300_000 },
  'doc.export_bulk':     { max: 20, windowMs: 3_600_000 },
  'api.ai_queries':      { max: 50, windowMs: 60_000 },
}
```

---

### 15.4 Backups exportables

Vista `/os/settings/backups` donde un admin puede exportar:
- Snapshot completo de todos los datos en JSON
- Export por módulo (clientes, proyectos, documentos, finanzas)
- Export en formato CSV para módulos tabulares

Generado como job background con descarga cuando esté listo.

---

## 16. Notificaciones y comunicación

### 16.1 Sistema de notificaciones persistido

```sql
CREATE TABLE notifications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id),
  type         TEXT NOT NULL,       -- 'sla_breach' | 'approval_needed' | 'invoice_overdue'
  title        TEXT NOT NULL,
  body         TEXT,
  entity_type  TEXT,
  entity_id    UUID,
  action_url   TEXT,
  is_read      BOOLEAN DEFAULT false,
  read_at      TIMESTAMPTZ,
  severity     TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  created_at   TIMESTAMPTZ DEFAULT now()
);
```

Con badge en el sidebar y panel de notificaciones con filtros por severidad.

---

### 16.2 Preferencias de notificación por usuario

Cada usuario configura qué notificaciones recibe y por qué canal:
- In-app (siempre)
- Email (configurable por tipo)
- En el futuro: Telegram (ya integrado con OpenClaw)

---

### 16.3 Digest diario para admins

Email/Telegram diario a las 8am con:
- Resumen financiero del día anterior
- Nuevos tickets y requests
- Próximas fechas críticas (invoices, documentos que vencen)
- Acciones IA pendientes de aprobación
- Clientes con actividad notable

---

## 17. Onboarding y activación de cliente

### 17.1 Flujo de activación como wizard guiado

```
Paso 1: Datos completos del cliente verificados ✅
Paso 2: Deal marcado como cliente_activo ✅
Paso 3: Invoice de anticipo emitida ✅
Paso 4: Anticipo del 50% pagado ✅
Paso 5: Proyecto creado con kickoff ⬜
Paso 6: Usuario de portal provisionado ⬜
Paso 7: Documento de bienvenida generado y publicado ⬜
Paso 8: Primer mensaje de bienvenida enviado ⬜
Paso 9: Accesos iniciales cargados en vault ⬜
```

Cada paso es clickable y lleva a la acción correspondiente. Estado guardado en la base como progreso real.

---

### 17.2 Checklist de offboarding también

Cuando un cliente termina o pausa, wizard de cierre:
- Entregables finales marcados como aprobados
- Documento de entrega publicado
- Accesos del cliente revocados
- Credenciales del cliente transferidas o archivadas
- Invoice final emitida y pagada
- Portal desactivado
- Deal marcado como `perdido` o cliente archivado

---

## 18. Búsqueda global y navegación

### 18.1 Full-text search con vector de PostgreSQL

```sql
-- Índice de búsqueda full-text para las entidades principales
ALTER TABLE clients ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('spanish', coalesce(name, '') || ' ' || coalesce(company_name, '') || ' ' || coalesce(email, ''))
  ) STORED;

CREATE INDEX ON clients USING GIN(search_vector);

-- Similar para documents, projects, tasks, links
```

---

### 18.2 Vista de grafo relacional por cliente

Al abrir un cliente, pestaña "Grafo" que muestra visualmente:
- El cliente en el centro
- Todos los proyectos conectados
- Deals, documentos, invoices, tickets como nodos
- Links entre ellos con labels del tipo de relación
- Colores por estado (verde = activo/paid, rojo = bloqueado/overdue)

Implementable con una librería de grafos ligera (Cytoscape.js, D3 force graph).

---

## 19. Accesibilidad y UX avanzado

### 19.1 Keyboard shortcuts documentados

| Shortcut | Acción |
|----------|--------|
| `Cmd+K` | Command palette |
| `Cmd+N` | Nueva entidad contextual |
| `Cmd+S` | Guardar |
| `Cmd+/` | Mostrar shortcuts |
| `G C` | Ir a Clientes |
| `G P` | Ir a Proyectos |
| `G F` | Ir a Finanzas |
| `G V` | Ir a Vault |
| `G H` | Ir a Health |

---

### 19.2 Estados de carga con skeleton screens

En lugar de spinners genéricos, cada sección tiene un skeleton que coincide con la forma real del contenido. Reduce percepción de lentitud.

---

### 19.3 Modo offline parcial con optimistic updates

Para acciones simples (cambiar status de tarea, marcar notificación como leída), aplicar cambio localmente inmediato y sincronizar en background. Si falla, revertir con toast de error.

---

### 19.4 Confirmaciones inteligentes con previsualización

Antes de acciones destructivas o críticas, mostrar un modal con:
- Qué va a pasar exactamente (diff visual)
- Qué entidades se ven afectadas
- Advertencias si hay dependencias
- Campo de confirmación (escribir "ELIMINAR") para acciones irreversibles

---

## 20. Seguridad empresarial

### 20.1 Encriptación de secretos en vault

Los campos `*_enc` del vault se encriptan usando AES-256-GCM antes de llegar a la base de datos:

```typescript
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const VAULT_KEY = Buffer.from(process.env.VAULT_ENCRYPTION_KEY!, 'hex') // 32 bytes

export function encryptSecret(plaintext: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', VAULT_KEY, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, encrypted]).toString('base64')
}

export function decryptSecret(ciphertext: string): string {
  const data = Buffer.from(ciphertext, 'base64')
  const iv = data.subarray(0, 12)
  const tag = data.subarray(12, 28)
  const encrypted = data.subarray(28)
  const decipher = createDecipheriv('aes-256-gcm', VAULT_KEY, iv)
  decipher.setAuthTag(tag)
  return decipher.update(encrypted) + decipher.final('utf8')
}
```

La clave de encriptación nunca toca la base de datos y vive solo en variables de entorno del servidor.

---

### 20.2 Content Security Policy estricta

Headers en `next.config.js`:

```javascript
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]
```

---

### 20.3 Validación de inputs con Zod en todos los endpoints

Sin excepción. Todo server action y route handler valida su input con un schema Zod antes de tocar la DB. Nunca confiar en el frontend para la validación.

```typescript
// Patrón obligatorio en todo server action
const schema = z.object({
  clientId: z.string().uuid(),
  stage: z.enum(['sin_contactar', 'contactado', /* ... */]),
  value: z.number().min(0).optional(),
})

export async function updateDealStage(input: unknown) {
  const parsed = schema.safeParse(input)
  if (!parsed.success) throw new ValidationError(parsed.error)
  // ...
}
```

---

### 20.4 Detección de sesiones concurrentes sospechosas

Si un usuario tiene sesión activa en más de N dispositivos simultáneos, o si una sesión cambia de IP abruptamente, mostrar alerta y opción de revocar todas las sesiones excepto la actual.

---

## Orden de implementación recomendado

### Prioridad 1 — Fundacional (implementar primero)

1. `entity_relations` polimórfico
2. `audit_log` transversal con cobertura de vault y docs
3. `pending_ai_actions` — cola de aprobaciones IA
4. Subroles y `team_capabilities`
5. `document_snapshots` en estados críticos

### Prioridad 2 — Operativo (alto impacto en operación diaria)

6. `milestones` como entidad con progress score real
7. Progress score configurable en portal
8. SLA tracking con estados visuales
9. Request channels diferenciados en portal
10. Dashboard de salud del sistema (`/os/health`)

### Prioridad 3 — Madurez empresarial

11. Vault con encriptación y categorías oficiales
12. Knowledge Hub con entidad `link` y previews
13. Alertas financieras automáticas y runway projection
14. Client health score
15. Command palette global

### Prioridad 4 — Diferenciación premium

16. Firma digital simple en portal
17. Grafo relacional visual por cliente
18. Digest diario para admins
19. Modo presentación en portal
20. Wizard de onboarding/offboarding guiado

---

*Vertrex OS — Documento interno de mejoras v1.0 — Vertrex 2026*
