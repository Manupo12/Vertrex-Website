# Vertrex OS — Mejoras V2
**Fecha:** 2026-04-27  
**Base:** PRD v9.0 final + Roadmap actualizado + Mejoras V1 ya aplicadas  
**Enfoque:** Lo que no está en ningún documento anterior y eleva el sistema a nivel enterprise real

---

## Índice

1. [Comunicación y mensajería interna](#1-comunicación-y-mensajería-interna)
2. [Sistema de plantillas operativas](#2-sistema-de-plantillas-operativas)
3. [Contexto de cliente enriquecido](#3-contexto-de-cliente-enriquecido)
4. [Versionado y control de cambios](#4-versionado-y-control-de-cambios)
5. [Gestión de dependencias entre proyectos](#5-gestión-de-dependencias-entre-proyectos)
6. [Facturación recurrente automatizada](#6-facturación-recurrente-automatizada)
7. [Sistema de etiquetas universal](#7-sistema-de-etiquetas-universal)
8. [Estado de salud por módulo en tiempo real](#8-estado-de-salud-por-módulo-en-tiempo-real)
9. [Contexto de sesión enriquecido para IA](#9-contexto-de-sesión-enriquecido-para-ia)
10. [Portal: experiencia de onboarding guiado del cliente](#10-portal-experiencia-de-onboarding-guiado-del-cliente)
11. [Sistema de comentarios y anotaciones internas](#11-sistema-de-comentarios-y-anotaciones-internas)
12. [Gestión de contactos dentro del cliente](#12-gestión-de-contactos-dentro-del-cliente)
13. [Presupuestos y propuestas con líneas de ítem](#13-presupuestos-y-propuestas-con-líneas-de-ítem)
14. [Historial unificado por cliente](#14-historial-unificado-por-cliente)
15. [Control de calidad y checklist de entrega](#15-control-de-calidad-y-checklist-de-entrega)
16. [Gestión de proveedores y terceros](#16-gestión-de-proveedores-y-terceros)
17. [Soporte multiproyecto por cliente](#17-soporte-multiproyecto-por-cliente)
18. [Indicadores de riesgo operativo](#18-indicadores-de-riesgo-operativo)
19. [Exportación e interoperabilidad](#19-exportación-e-interoperabilidad)
20. [Gobernanza del sistema y configuración global](#20-gobernanza-del-sistema-y-configuración-global)

---

## 1. Comunicación y mensajería interna

### Qué falta

El PRD y las mejoras V1 cubren el chat con el cliente en el portal y el chat del workspace. Lo que **no existe** es una capa de comunicación interna estructurada del equipo vinculada a entidades específicas.

Hoy si el equipo necesita discutir sobre una tarea, un deal o un documento, esa conversación pasa por WhatsApp o un canal externo y se pierde para siempre del contexto del sistema.

### Mejora: threads contextuales por entidad

```sql
CREATE TABLE internal_threads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,  -- 'task' | 'deal' | 'document' | 'project' | 'invoice'
  entity_id   UUID NOT NULL,
  created_by  UUID NOT NULL REFERENCES users(id),
  resolved    BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE internal_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id   UUID NOT NULL REFERENCES internal_threads(id) ON DELETE CASCADE,
  author_id   UUID NOT NULL REFERENCES users(id),
  content     TEXT NOT NULL,
  mentions    UUID[],          -- user IDs mencionados con @
  attachments JSONB,
  created_at  TIMESTAMPTZ DEFAULT now(),
  edited_at   TIMESTAMPTZ
);
```

**Implementación en UI:** en cualquier entidad del OS (tarea, deal, documento, invoice) aparece un botón "Discutir" que abre un panel lateral con el thread de esa entidad. Las menciones con `@` generan notificación. Los threads no resueltos aparecen como señal en `/os/health`.

**Por qué importa:** elimina la dependencia de canales externos para decisiones que deberían vivir en el sistema. En 6 meses, cuando pregunten "por qué se decidió X en este deal", la respuesta está en el thread, no perdida en WhatsApp.

---

### Mejora: menciones que crean tareas

Cuando en un thread alguien escribe `/tarea` seguido de descripción, el sistema propone crear una tarea vinculada a la entidad del thread con el autor como responsable sugerido. Un clic confirma.

---

## 2. Sistema de plantillas operativas

### Qué falta

El PRD habla del generador documental con variables, pero no existe el concepto de **plantillas de proceso** — configuraciones reutilizables para crear proyectos, deals, checkpoints o secuencias de tareas de forma consistente.

### Mejora: project templates

```sql
CREATE TABLE project_templates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  category    TEXT,           -- 'desarrollo_web' | 'branding' | 'saas' | 'mantenimiento'
  milestone_config  JSONB,   -- milestones predefinidos con orden y pesos
  task_config       JSONB,   -- tareas iniciales por milestone
  document_config   JSONB,   -- qué documentos generar automáticamente
  default_duration_days INTEGER,
  is_active   BOOLEAN DEFAULT true,
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

**Uso:** al crear un proyecto pago, el team puede seleccionar una plantilla. El sistema crea automáticamente:
- los milestones con sus pesos de progreso predefinidos
- las tareas iniciales del kickoff
- los documentos en `draft` que corresponden a ese tipo de proyecto
- la estructura de checklist de entrega

**Por qué importa:** cada proyecto nuevo hoy empieza desde cero. Con templates, un proyecto de desarrollo web siempre tiene los mismos hitos base, las mismas tareas de kickoff y los mismos documentos, reduciendo el tiempo de setup de horas a minutos.

---

### Mejora: deal templates

Similar para deals: al crear un deal de tipo "desarrollo a medida" vs "mantenimiento mensual", la propuesta, el SOW y la estructura de negociación se pre-configuran diferente. El template define qué documentos generar y qué etapas del pipeline son relevantes.

---

### Mejora: onboarding templates por tipo de cliente

Configurable: "cliente nuevo proyecto único", "cliente con retainer mensual", "cliente SaaS". Cada template define qué pasos del wizard de activación son obligatorios, qué documentos de bienvenida se generan y qué credenciales iniciales se solicitan.

---

## 3. Contexto de cliente enriquecido

### Qué falta

El modelo actual de cliente tiene datos básicos. Para que la IA y el equipo puedan operar bien, el cliente necesita un perfil operativo rico que hoy no existe como entidad estructurada.

### Mejora: perfil operativo del cliente

```sql
ALTER TABLE clients ADD COLUMN industry        TEXT;
ALTER TABLE clients ADD COLUMN company_size    TEXT CHECK (company_size IN (
  '1-5', '6-20', '21-100', '101-500', '500+'
));
ALTER TABLE clients ADD COLUMN country         TEXT DEFAULT 'CO';
ALTER TABLE clients ADD COLUMN city            TEXT;
ALTER TABLE clients ADD COLUMN timezone        TEXT DEFAULT 'America/Bogota';
ALTER TABLE clients ADD COLUMN preferred_channel TEXT DEFAULT 'portal'
  CHECK (preferred_channel IN ('portal', 'whatsapp', 'email', 'llamada'));
ALTER TABLE clients ADD COLUMN communication_notes TEXT;  -- "prefiere que le hablen de usted", "responde rápido por WhatsApp"
ALTER TABLE clients ADD COLUMN internal_label  TEXT;     -- apodo interno del equipo
ALTER TABLE clients ADD COLUMN risk_level      TEXT DEFAULT 'normal'
  CHECK (risk_level IN ('low', 'normal', 'high', 'critical'));
ALTER TABLE clients ADD COLUMN strategic_value TEXT DEFAULT 'standard'
  CHECK (strategic_value IN ('standard', 'key_account', 'strategic', 'pilot'));
```

**Por qué importa:** cuando la IA genera un mensaje para el cliente, sabe que prefiere WhatsApp y que hay que hablarle de usted. Cuando el equipo abre el sidebar de cliente, ve de un vistazo si es una cuenta clave o si está en riesgo alto. El `preferred_channel` y `timezone` también alimentan las alertas de SLA (no tiene sentido contar tiempo fuera de su horario hábil).

---

### Mejora: historial de interacciones offline

```sql
CREATE TABLE client_interactions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id    UUID NOT NULL REFERENCES clients(id),
  interaction_type TEXT NOT NULL CHECK (interaction_type IN (
    'llamada', 'reunion', 'whatsapp', 'email', 'demo', 'visita', 'otro'
  )),
  summary      TEXT NOT NULL,
  outcome      TEXT,          -- "interesado en ampliar contrato", "quiere pausa de 1 mes"
  participants UUID[],        -- users del equipo presentes
  happened_at  TIMESTAMPTZ NOT NULL,
  created_by   UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ DEFAULT now()
);
```

Las interacciones fuera del sistema (llamadas, reuniones, WhatsApp) quedan registradas manualmente pero de forma estructurada. Aparecen en el timeline del cliente y alimentan el contexto de la IA.

---

## 4. Versionado y control de cambios

### Qué falta

El PRD menciona versionado histórico para documentos contractuales, pero no existe un modelo de versionado aplicable a otras entidades críticas que cambian con frecuencia.

### Mejora: versionado de propuestas y SOW

Cuando una propuesta o SOW se edita después de haber sido enviada, en lugar de sobreescribir el draft, el sistema crea una nueva versión:

```sql
ALTER TABLE documents ADD COLUMN version_number   INTEGER NOT NULL DEFAULT 1;
ALTER TABLE documents ADD COLUMN parent_version_id UUID REFERENCES documents(id);
ALTER TABLE documents ADD COLUMN superseded_at     TIMESTAMPTZ;
ALTER TABLE documents ADD COLUMN change_summary    TEXT;  -- "Ajuste de precio por cambio de alcance"
```

En el OS, la vista de documento muestra el historial de versiones con fecha, autor del cambio y resumen. El cliente en el portal solo ve la versión actual publicada, no el historial de negociación interno.

---

### Mejora: changelog de proyecto visible para el cliente

Cuando el alcance de un proyecto cambia formalmente (nuevo SOW, addendum), el sistema registra el cambio y lo muestra en el portal del cliente como entrada en el feed de actividad:

```
📋 Alcance actualizado — 15 abril 2026
Se agregó módulo de reportes al proyecto.
Ver documento: SOW v2 →
```

Esto elimina la conversación de "pero yo no sabía que eso cambiaba" que ocurre en proyectos donde el alcance evoluciona.

---

### Mejora: diff visual entre versiones de documento

Al comparar dos versiones de un documento en el OS, mostrar un diff lado a lado similar a GitHub: líneas eliminadas en rojo, líneas nuevas en verde, secciones sin cambio colapsadas. Implementable con `diff-match-patch` en el frontend.

---

## 5. Gestión de dependencias entre proyectos

### Qué falta

Las mejoras V1 cubren dependencias entre tareas dentro de un proyecto. Lo que falta es gestionar dependencias a nivel de **proyecto completo** — algo relevante cuando Vertrex tiene múltiples proyectos con el mismo cliente o cuando un proyecto depende de la entrega de otro.

### Mejora: dependencias entre proyectos

```sql
CREATE TABLE project_dependencies (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects(id),
  depends_on_id   UUID NOT NULL REFERENCES projects(id),
  dependency_type TEXT DEFAULT 'finish_to_start' CHECK (dependency_type IN (
    'finish_to_start',    -- B empieza cuando A termina
    'start_to_start',     -- B empieza cuando A empieza
    'finish_to_finish',   -- B termina cuando A termina
    'informational'       -- relación informativa, no bloqueante
  )),
  notes           TEXT,
  CHECK (project_id != depends_on_id)
);
```

**Caso real:** el cliente tiene un proyecto de branding que debe terminar antes de que empiece el proyecto de desarrollo web. Si el branding se atrasa, el sistema detecta el impacto y alerta sobre el retraso en cadena.

---

### Mejora: vista de portafolio por cliente

Para clientes con múltiples proyectos activos o históricos, una vista de portafolio que muestra:
- todos los proyectos del cliente en una línea de tiempo
- dependencias entre proyectos como flechas
- estado actual de cada proyecto
- valor total del portafolio

Esta vista existe tanto en el OS interno como en el portal del cliente.

---

## 6. Facturación recurrente automatizada

### Qué falta

El PRD menciona soporte para contratos mensuales y SaaS, pero no existe lógica de billing recurrente — actualmente cada invoice se crea manualmente.

### Mejora: billing schedules

```sql
CREATE TABLE billing_schedules (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id         UUID NOT NULL REFERENCES clients(id),
  project_id        UUID REFERENCES projects(id),
  document_id       UUID REFERENCES documents(id),  -- contrato de referencia
  schedule_type     TEXT NOT NULL CHECK (schedule_type IN (
    'monthly', 'quarterly', 'annual', 'milestone_based', 'custom'
  )),
  amount            DECIMAL(12,2) NOT NULL,
  currency          TEXT DEFAULT 'COP',
  next_invoice_date DATE NOT NULL,
  end_date          DATE,
  auto_create       BOOLEAN DEFAULT false,   -- false = solo alertar, true = crear invoice
  document_template_id UUID REFERENCES documents(id),
  is_active         BOOLEAN DEFAULT true,
  created_by        UUID REFERENCES users(id),
  created_at        TIMESTAMPTZ DEFAULT now()
);
```

**Comportamiento con `auto_create = false` (recomendado para empezar):**
- N días antes de `next_invoice_date`, el sistema crea una alerta: "Próxima factura de [cliente] por $X. Crear ahora →"
- El team hace clic, revisa y confirma
- La invoice se crea pre-llenada con todos los datos del schedule

**Comportamiento con `auto_create = true`:**
- La invoice se crea automáticamente en `draft`
- Se notifica al team para revisión y emisión
- Requiere confirmación manual antes de pasar a `issued`

**Por qué importa:** con 5 clientes de mantenimiento mensual, hoy el team tiene que acordarse de crear 5 invoices cada mes. Con billing schedules, el sistema recuerda y pre-llena todo.

---

### Mejora: resumen de billing recurrente en el dashboard financiero

Widget que muestra:
- MRR (Monthly Recurring Revenue) calculado desde schedules activos
- Próximas 4 semanas de invoices a generar
- Schedules que vencen pronto (contratos que terminan)
- Comparativo MRR mes actual vs mes anterior

---

## 7. Sistema de etiquetas universal

### Qué falta

Ningún documento anterior menciona etiquetas (tags). Para una software house que maneja múltiples clientes, proyectos y tipos de trabajo, las etiquetas son la forma más flexible de categorizar y filtrar sin crear nuevas entidades.

### Mejora: tags polimórficos

```sql
CREATE TABLE tags (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  color      TEXT NOT NULL DEFAULT '#6B7280',
  scope      TEXT NOT NULL CHECK (scope IN (
    'global',     -- disponible para todas las entidades
    'client',     -- solo para clientes
    'project',    -- solo para proyectos
    'document',   -- solo para documentos
    'task',       -- solo para tareas
    'deal'        -- solo para deals
  )),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(name, scope)
);

CREATE TABLE entity_tags (
  tag_id      UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id   UUID NOT NULL,
  added_by    UUID REFERENCES users(id),
  added_at    TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (tag_id, entity_type, entity_id)
);
```

**Casos de uso reales para Vertrex:**
- Tag `urgente` en tareas → aparecen primero en "Mi día"
- Tag `Colombia` en clientes → filtrar en CRM
- Tag `diseño` / `dev` / `contenido` en tareas → medir tiempo por tipo de trabajo
- Tag `confidencial` en documentos → advertencia antes de publicar en portal
- Tag `caso-de-exito` en proyectos → filtrar para portfolio o propuestas

**UI:** autocompletado al escribir tags, paleta de colores, vista de todas las entidades con un tag específico (tipo "ver todos los proyectos de diseño").

---

## 8. Estado de salud por módulo en tiempo real

### Qué falta

Las mejoras V1 proponen `/os/health` como panel de riesgos. Lo que falta es el concepto de **module health** — un indicador por módulo que muestre si ese módulo está operando correctamente o tiene problemas pendientes.

### Mejora: health indicators en el sidebar

En el sidebar del OS, junto al nombre de cada módulo, un indicador de punto (verde/amarillo/rojo) que refleja el estado del módulo:

```typescript
interface ModuleHealth {
  module: string
  status: 'healthy' | 'warning' | 'critical'
  issues: ModuleIssue[]
  last_checked: Date
}

interface ModuleIssue {
  severity: 'warning' | 'critical'
  message: string
  entity_type?: string
  entity_id?: string
  action_url?: string
}

// Ejemplos de reglas
const HEALTH_RULES: HealthRule[] = [
  {
    module: 'finance',
    check: async () => {
      const overdue = await countOverdueInvoices()
      if (overdue > 0) return { severity: 'critical', message: `${overdue} invoices vencidas sin pago` }
    }
  },
  {
    module: 'vault',
    check: async () => {
      const stale = await countStaleCredentials(90) // días
      if (stale > 0) return { severity: 'warning', message: `${stale} credenciales sin rotar en 90+ días` }
    }
  },
  {
    module: 'documents',
    check: async () => {
      const expiring = await countExpiringDocuments(30) // días
      if (expiring > 0) return { severity: 'warning', message: `${expiring} documentos vencen en 30 días` }
    }
  },
  {
    module: 'portal',
    check: async () => {
      const breached = await countSlaBreaches()
      if (breached > 0) return { severity: 'critical', message: `${breached} requests con SLA incumplido` }
    }
  },
]
```

**Por qué importa:** el equipo ve de un vistazo en qué módulo hay problemas sin tener que entrar a cada uno. El punto rojo en "Finance" en el sidebar dice todo.

---

### Mejora: health API para OpenClaw

```
GET /api/os/health
→ { modules: ModuleHealth[], overall: 'healthy' | 'warning' | 'critical', issues_count: { critical: N, warning: N } }
```

La IA puede consultar esto y proactivamente informar al admin: "Hay 2 problemas críticos en el sistema: 3 invoices vencidas y 1 request de portal sin responder desde hace 48 horas."

---

## 9. Contexto de sesión enriquecido para IA

### Qué falta

El snapshot operativo actual que recibe la IA incluye estado general del sistema. Lo que falta es un contexto de **sesión de trabajo** — qué está haciendo el usuario en este momento y qué entidad tiene enfocada.

### Mejora: session context para OpenClaw

```typescript
interface AISessionContext {
  // Lo que el usuario tiene abierto ahora mismo
  current_view: string           // '/os/clients/[id]' | '/os/projects/[id]'
  focused_entity?: {
    type: 'client' | 'project' | 'deal' | 'document' | 'invoice'
    id: string
    label: string
    key_data: Record<string, unknown>
  }
  
  // Lo que hizo recientemente en esta sesión
  recent_actions: Array<{
    action: string
    entity_type: string
    entity_id: string
    timestamp: Date
  }>
  
  // Estado relevante para sugerencias proactivas
  pending_approvals_count: number
  my_open_tasks_count: number
  unread_notifications_count: number
}
```

**Impacto real:** si el usuario está en la vista de un cliente con 2 invoices vencidas y le pregunta a la IA "qué hago ahora", la IA responde en contexto de ese cliente específico, no con una respuesta genérica. Si está en una tarea bloqueada, la IA sabe qué la bloquea sin que el usuario tenga que explicarlo.

---

### Mejora: comandos de IA contextuales por vista

En lugar de solo un chat con la IA, cada vista del OS tiene acciones de IA pre-definidas relevantes para esa vista:

- En vista de cliente: "Generar resumen ejecutivo", "Detectar riesgos de cuenta", "Redactar mensaje de seguimiento"
- En vista de proyecto: "¿Qué está bloqueando el progreso?", "Generar reporte de estado", "Estimar fecha de cierre"
- En vista de finance: "Analizar flujo de caja", "Identificar cuentas en riesgo", "Proyectar runway"
- En vista de deal: "Redactar propuesta inicial", "Sugerir siguiente acción", "Evaluar probabilidad de cierre"

Cada comando pre-llena el prompt con el contexto de la entidad actual.

---

## 10. Portal: experiencia de onboarding guiado del cliente

### Qué falta

El wizard de activación del cliente existe para el equipo interno. Lo que falta es la experiencia equivalente **desde el punto de vista del cliente** cuando entra al portal por primera vez.

### Mejora: onboarding flow en el portal

Al entrar por primera vez (o al detectar que nunca completó el onboarding), el portal muestra un flujo guiado:

```typescript
interface ClientOnboardingStep {
  id: string
  title: string
  description: string
  action: string              // qué debe hacer el cliente
  completed: boolean
  required: boolean
}

const ONBOARDING_STEPS: ClientOnboardingStep[] = [
  {
    id: 'welcome_read',
    title: 'Lee el documento de bienvenida',
    description: 'Contiene todo lo que necesitas saber sobre cómo trabajamos juntos.',
    action: 'Ver documento',
    required: true,
  },
  {
    id: 'profile_complete',
    title: 'Completa tu información de contacto',
    description: 'Para coordinación y facturación.',
    action: 'Completar perfil',
    required: true,
  },
  {
    id: 'contract_review',
    title: 'Revisa y firma el contrato',
    description: 'El contrato define el alcance, tiempos y condiciones del proyecto.',
    action: 'Ir al contrato',
    required: true,
  },
  {
    id: 'billing_setup',
    title: 'Revisa el detalle de billing',
    description: 'Confirma el valor del proyecto y las condiciones de pago.',
    action: 'Ver billing',
    required: false,
  },
  {
    id: 'first_message',
    title: 'Envía tu primer mensaje al equipo',
    description: 'Cuéntanos cualquier duda o expectativa que tengas.',
    action: 'Ir al chat',
    required: false,
  },
]
```

**UI:** barra de progreso de onboarding visible hasta completar los pasos requeridos. Después de completar, desaparece y queda solo el estado de la cuenta.

**En el OS interno:** el admin puede ver qué paso del onboarding completó cada cliente y cuánto tiempo tardó en hacerlo.

---

### Mejora: resumen de "Lo que pasó mientras no estabas"

Cuando el cliente entra al portal después de varios días, mostrar un resumen de actividad reciente antes de mostrar la vista normal:

```
Hola, Cliente X. Mientras no estabas (7 días):

✅ Milestone "Diseño UI" completado
📄 2 documentos nuevos disponibles para revisar
💬 3 mensajes del equipo sin leer
🔔 1 entregable esperando tu aprobación
```

---

## 11. Sistema de comentarios y anotaciones internas

### Qué falta

Los threads por entidad (mejora 1) son para conversaciones estructuradas. Las **anotaciones** son algo diferente: notas rápidas, observaciones privadas, contexto que alguien quiere dejar pegado a una entidad sin iniciar una discusión.

### Mejora: anotaciones rápidas

```sql
CREATE TABLE annotations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type  TEXT NOT NULL,
  entity_id    UUID NOT NULL,
  author_id    UUID NOT NULL REFERENCES users(id),
  content      TEXT NOT NULL,
  is_pinned    BOOLEAN DEFAULT false,
  visibility   TEXT DEFAULT 'team' CHECK (visibility IN ('team', 'admin_only')),
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);
```

**Diferencia con threads:** las anotaciones son unidireccionales, no esperan respuesta. Son el post-it del sistema.

**Casos de uso:**
- En un deal: "Este cliente preguntó por descuento el 15 de marzo. No volver a mencionarlo."
- En una tarea: "Validado con el cliente el 3 de abril por llamada."
- En un documento: "Versión aprobada por el contador del cliente, no modificar."
- En un cliente: "Paga siempre tarde pero siempre paga. No escalar."

---

### Mejora: notas de reunión estructuradas

```sql
CREATE TABLE meeting_notes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id    UUID NOT NULL REFERENCES clients(id),
  project_id   UUID REFERENCES projects(id),
  deal_id      UUID REFERENCES deals(id),
  title        TEXT NOT NULL,
  attendees    TEXT[],           -- nombres o user IDs
  happened_at  TIMESTAMPTZ NOT NULL,
  summary      TEXT NOT NULL,
  decisions    JSONB,            -- array de decisiones tomadas
  action_items JSONB,            -- array de { task, owner, due_date }
  created_by   UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ DEFAULT now()
);
```

Los `action_items` pueden convertirse en tareas reales con un clic. Las notas de reunión aparecen en el timeline del cliente y del proyecto.

---

## 12. Gestión de contactos dentro del cliente

### Qué falta

Actualmente un cliente tiene un solo usuario de portal. Pero en el mundo real, Vertrex interactúa con múltiples personas dentro del mismo cliente: el gerente que tomó la decisión, el técnico que coordina el proyecto, el contador que aprueba las facturas.

### Mejora: tabla de contactos por cliente

```sql
CREATE TABLE client_contacts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id    UUID NOT NULL REFERENCES clients(id),
  full_name    TEXT NOT NULL,
  role         TEXT,              -- "Gerente General", "Jefe de Sistemas", "Contador"
  email        TEXT,
  phone        TEXT,
  whatsapp     TEXT,
  is_primary   BOOLEAN DEFAULT false,     -- contacto principal
  is_billing   BOOLEAN DEFAULT false,     -- recibe facturas
  is_technical BOOLEAN DEFAULT false,     -- punto de contacto técnico
  is_portal_user BOOLEAN DEFAULT false,  -- tiene acceso al portal
  portal_user_id UUID REFERENCES users(id),
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);
```

**Por qué importa:** cuando se va a cobrar, el team sabe a quién escribirle. Cuando hay un problema técnico, saben a quién llamar. La IA puede seleccionar el contacto correcto según el contexto del mensaje que va a redactar.

---

### Mejora: contacto visible en sidebar de cliente

El sidebar contextual del cliente (mejora V1) muestra los contactos clave con íconos de canal directo: clic en el ícono de WhatsApp abre el chat con ese número, clic en email abre el cliente de correo.

---

## 13. Presupuestos y propuestas con líneas de ítem

### Qué falta

Las propuestas hoy son documentos de texto. Para una software house, una propuesta real necesita un **desglose de ítems con precios** que pueda conectarse automáticamente a la invoice.

### Mejora: quote_items ligados a deals y propuestas

```sql
CREATE TABLE quote_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id      UUID NOT NULL REFERENCES deals(id),
  document_id  UUID REFERENCES documents(id),  -- propuesta donde aparece
  description  TEXT NOT NULL,
  category     TEXT CHECK (category IN (
    'desarrollo', 'diseño', 'contenido', 'infraestructura',
    'mantenimiento', 'consultoria', 'licencia', 'otro'
  )),
  quantity     DECIMAL(10,2) DEFAULT 1,
  unit         TEXT DEFAULT 'unidad',  -- 'horas' | 'unidad' | 'mes'
  unit_price   DECIMAL(12,2) NOT NULL,
  discount_pct DECIMAL(5,2) DEFAULT 0,
  total        DECIMAL(12,2) GENERATED ALWAYS AS (
    quantity * unit_price * (1 - discount_pct / 100)
  ) STORED,
  is_optional  BOOLEAN DEFAULT false,  -- ítem opcional no incluido en total base
  order_index  INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now()
);
```

**Flujo completo:**
1. Se crea el deal con valor estimado
2. Al preparar la propuesta, se agregan `quote_items` específicos
3. El total del deal se calcula automáticamente desde los ítems
4. Al ganar el deal, los ítems opcionales confirmados pasan a la invoice
5. La invoice se pre-llena con los ítems de la propuesta

**En el portal:** la propuesta muestra tabla de ítems con totales. Los ítems opcionales tienen checkbox que el cliente puede marcar para incluir en el alcance.

---

## 14. Historial unificado por cliente

### Qué falta

Hoy para saber todo lo que pasó con un cliente hay que revisar CRM, projects, documents, finance, vault y portal por separado. No existe una vista que lo muestre todo en orden cronológico.

### Mejora: timeline unificado por cliente

```typescript
interface ClientTimelineEntry {
  id: string
  timestamp: Date
  category: 'commercial' | 'delivery' | 'financial' | 'communication' | 'legal' | 'system'
  event_type: string
  title: string
  description?: string
  entity_type?: string
  entity_id?: string
  actor_label: string      // "Manu", "OpenClaw", "Sistema"
  visibility: 'internal' | 'client_visible'
  metadata?: Record<string, unknown>
}
```

Fuentes que alimentan el timeline:
- `audit_events` filtrados por `client_id`
- `business_events` del cliente
- `deal_notes`
- `meeting_notes`
- `client_interactions`
- `internal_threads` resueltos
- Mensajes del portal
- Cambios de estado en documentos, invoices, proyectos

**Vista:** pestaña "Timeline" en el perfil del cliente. Filtros por categoría, rango de fechas y visibilidad. Toggle para ver solo eventos visibles al cliente (lo que aparecería en su feed de portal) vs. todos los eventos internos.

---

## 15. Control de calidad y checklist de entrega

### Qué falta

No existe un proceso formal de QA antes de entregar un proyecto o un entregable al cliente. Hoy depende de la memoria del desarrollador.

### Mejora: delivery checklists

```sql
CREATE TABLE delivery_checklists (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN (
    'project_delivery',   -- antes de entregar el proyecto completo
    'milestone_review',   -- antes de aprobar un milestone
    'task_done',          -- antes de marcar una tarea como done
    'portal_activation',  -- antes de activar el portal de un cliente
    'document_publish'    -- antes de publicar un documento
  )),
  items       JSONB NOT NULL,  -- array de items con description y required
  is_default  BOOLEAN DEFAULT false,
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE checklist_executions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id   UUID NOT NULL REFERENCES delivery_checklists(id),
  entity_type    TEXT NOT NULL,
  entity_id      UUID NOT NULL,
  items_state    JSONB NOT NULL,  -- { item_id: { checked: bool, notes: string, checked_by: uuid } }
  completed      BOOLEAN DEFAULT false,
  completed_by   UUID REFERENCES users(id),
  completed_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT now()
);
```

**Checklist de entrega de proyecto por defecto:**
- [ ] Todos los entregables aprobados por el cliente
- [ ] Documento de entrega generado y firmado
- [ ] Accesos finales publicados en vault del cliente
- [ ] Manual de usuario publicado en portal
- [ ] Invoice final emitida y pagada (o con plan de pago)
- [ ] Repositorio entregado con documentación
- [ ] Credenciales rotadas y limpias
- [ ] Retroalimentación del cliente solicitada

**Regla de negocio:** un proyecto no puede moverse a estado `completed` si su checklist de entrega no está completo (a menos que admin haga override auditado).

---

## 16. Gestión de proveedores y terceros

### Qué falta

Vertrex trabaja con freelancers, subcontratistas y proveedores de servicios (hosting, herramientas, diseñadores externos). Hoy esa información no existe en el sistema.

### Mejora: tabla de vendors

```sql
CREATE TABLE vendors (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  type         TEXT NOT NULL CHECK (type IN (
    'freelancer', 'agencia', 'proveedor_saas', 'proveedor_infraestructura',
    'consultor', 'proveedor_legal', 'otro'
  )),
  email        TEXT,
  phone        TEXT,
  specialty    TEXT[],           -- ['diseño', 'desarrollo_backend', 'copywriting']
  rate_type    TEXT CHECK (rate_type IN ('hora', 'proyecto', 'mensual', 'variable')),
  rate_amount  DECIMAL(12,2),
  currency     TEXT DEFAULT 'COP',
  notes        TEXT,
  is_active    BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE vendor_project_assignments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id  UUID NOT NULL REFERENCES vendors(id),
  project_id UUID NOT NULL REFERENCES projects(id),
  role       TEXT,               -- "diseñador UI", "dev backend"
  rate       DECIMAL(12,2),
  start_date DATE,
  end_date   DATE,
  notes      TEXT
);
```

**Por qué importa:** cuando se calcula el costo real de un proyecto, los pagos a freelancers y proveedores son parte del egreso. Al tenerlos en el sistema, el dashboard financiero puede mostrar margen real por proyecto (ingresos del cliente - costos de vendors asignados).

---

### Mejora: costo vs revenue por proyecto

```typescript
interface ProjectMargin {
  project_id: string
  total_revenue: number         // invoices paid del cliente
  vendor_costs: number          // pagos a vendors asignados
  internal_hours_cost: number   // opcional si se registran horas
  gross_margin: number          // revenue - vendor_costs
  margin_pct: number            // gross_margin / total_revenue
}
```

Visible en la vista de proyecto para `admin` y `finance_legal`. Alimenta el análisis de rentabilidad por tipo de proyecto en analytics.

---

## 17. Soporte multiproyecto por cliente

### Qué falta

El sistema soporta múltiples proyectos por cliente, pero la experiencia del OS y del portal está optimizada para el caso de un proyecto activo. Para clientes con varios proyectos simultáneos (o retainer + proyecto puntual), la navegación y los indicadores se vuelven confusos.

### Mejora: vista de cuenta cliente con múltiples proyectos

En el OS, cuando un cliente tiene más de 1 proyecto activo:
- La vista principal del cliente muestra los proyectos como "tarjetas" paralelas con su propio progreso y estado
- Los deals, documentos e invoices se agrupan por proyecto cuando tienen relación, o van a una sección "general" si son de cuenta
- Los tickets y mensajes tienen selector de proyecto opcional

En el portal del cliente:
- Selector de proyecto activo en el header del portal
- Dashboard unificado con resumen de todos los proyectos activos
- Posibilidad de ver documentos, billing y archivos filtrados por proyecto o de toda la cuenta

---

### Mejora: health score separado por proyecto

El health score de cuenta (mejora V1) se complementa con un health score por proyecto:

| Factor | Peso |
|--------|------|
| Progreso esperado vs real | 30% |
| Tareas sin owner en estados avanzados | 20% |
| Entregables pendientes de aprobación | 20% |
| Comunicación activa (último mensaje < 7 días) | 15% |
| Invoice al día | 15% |

Clientes con múltiples proyectos muestran el health score más bajo de sus proyectos como señal de alerta.

---

## 18. Indicadores de riesgo operativo

### Qué falta

Las mejoras V1 proponen health score y `/os/health`. Lo que falta es un modelo explícito de **riesgos operativos nombrados** — situaciones específicas que el sistema puede detectar y clasificar como riesgo con severidad y acción recomendada.

### Mejora: risk registry

```typescript
const OPERATIONAL_RISKS = [
  // Riesgos de delivery
  {
    id: 'project_behind_schedule',
    name: 'Proyecto atrasado vs estimado',
    detect: (project) => project.progress < project.expected_progress - 15,
    severity: 'warning',
    recommendation: 'Revisar timeline y comunicar actualización al cliente',
  },
  {
    id: 'milestone_overdue',
    name: 'Milestone vencido sin completar',
    detect: (milestone) => milestone.target_date < now() && milestone.status !== 'completed',
    severity: 'critical',
    recommendation: 'Actualizar fecha o completar milestone urgente',
  },
  {
    id: 'no_client_activity_portal',
    name: 'Cliente sin actividad en portal (14+ días)',
    detect: (client) => client.last_portal_access < daysAgo(14) && client.portal_active,
    severity: 'warning',
    recommendation: 'Contactar cliente para verificar satisfacción',
  },
  {
    id: 'invoice_overdue_critical',
    name: 'Invoice vencida más de 30 días',
    detect: (invoice) => invoice.status === 'overdue' && daysSince(invoice.due_date) > 30,
    severity: 'critical',
    recommendation: 'Escalar gestión de cobro',
  },
  {
    id: 'no_contract_active_project',
    name: 'Proyecto activo sin contrato firmado',
    detect: (project) => project.status === 'active' && !project.signed_contract_id,
    severity: 'critical',
    recommendation: 'Generar y firmar contrato antes de continuar',
  },
  {
    id: 'team_overloaded',
    name: 'Miembro del equipo con carga excesiva',
    detect: (user) => user.open_tasks > 15 && user.in_progress_tasks > 5,
    severity: 'warning',
    recommendation: 'Redistribuir carga o ajustar timelines',
  },
  {
    id: 'vault_credentials_leaked_scope',
    name: 'Credenciales publicadas a cliente con portal inactivo',
    detect: (cred) => cred.published_to_portal && !cred.client.portal_active,
    severity: 'critical',
    recommendation: 'Despublicar credenciales o revisar estado del portal',
  },
] as const
```

**Vista en `/os/health`:** lista de riesgos activos agrupados por severidad. Cada riesgo tiene el cliente/proyecto afectado, la descripción del problema y un botón de acción directa. El número total de riesgos críticos aparece como badge en el ícono de salud del sidebar.

---

## 19. Exportación e interoperabilidad

### Qué falta

El sistema es excelente para capturar y organizar información, pero no tiene estrategia de exportación. Para un sistema que se vende como "software empresarial serio", la capacidad de exportar datos en formatos estándar es no negociable.

### Mejora: exports por módulo

```typescript
const EXPORT_CAPABILITIES = {
  clients: {
    formats: ['csv', 'json'],
    fields: ['nombre', 'email', 'deal_stage', 'health_score', 'revenue_total', 'created_at']
  },
  deals: {
    formats: ['csv', 'json'],
    fields: ['titulo', 'cliente', 'valor', 'etapa', 'probabilidad', 'fecha_creacion', 'fecha_cierre']
  },
  invoices: {
    formats: ['csv', 'json', 'pdf_summary'],
    fields: ['numero', 'cliente', 'proyecto', 'monto', 'estado', 'vencimiento', 'pagado_en']
  },
  tasks: {
    formats: ['csv', 'json'],
    fields: ['titulo', 'proyecto', 'asignado', 'estado', 'estimado', 'real', 'created_at', 'done_at']
  },
  audit_log: {
    formats: ['csv', 'json'],
    fields: ['fecha', 'actor', 'accion', 'entidad', 'severidad', 'ip'],
    requires: 'admin'
  },
}
```

Los exports se generan como jobs en background y se notifica cuando están listos para descarga. Los PDFs de reporte ejecutivo se generan con la misma infraestructura del generador documental.

---

### Mejora: reporte ejecutivo mensual auto-generado

El primer día de cada mes, el sistema genera automáticamente un PDF de "Reporte de operaciones del mes anterior" con:
- Clientes activos y nuevos
- Proyectos entregados y en progreso
- Revenue atribuido vs realizado
- Tickets resueltos y tiempo de respuesta
- Highlights del equipo (tareas completadas, milestones alcanzados)

Entregado como notificación al admin con descarga directa. Opcionalmente enviable al email del equipo.

---

### Mejora: webhook outbound configurable

Para cuando Vertrex quiera conectar Vertrex OS con herramientas externas (Slack, n8n, Zapier, Telegram del equipo):

```sql
CREATE TABLE outbound_webhooks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  url          TEXT NOT NULL,
  events       TEXT[] NOT NULL,   -- ['deal.stage_changed', 'invoice.paid', 'project.activated']
  headers      JSONB,             -- headers adicionales
  is_active    BOOLEAN DEFAULT true,
  last_fired_at TIMESTAMPTZ,
  last_status  INTEGER,           -- HTTP status de la última llamada
  created_by   UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ DEFAULT now()
);
```

Configurables desde `/os/settings/integrations`. Cada evento del sistema puede disparar un webhook si hay uno configurado para ese tipo de evento. Útil para notificar a Telegram del equipo cuando se paga una invoice, o disparar un flujo n8n cuando un deal cambia a `cliente_activo`.

---

## 20. Gobernanza del sistema y configuración global

### Qué falta

No existe un módulo de configuración del sistema como producto. Los ajustes están dispersos o hardcodeados.

### Mejora: `/os/settings` como módulo completo

```typescript
interface SystemSettings {
  // Configuración de negocio
  business: {
    company_name: string
    nit: string
    address: string
    city: string
    country: string
    default_currency: 'COP' | 'USD'
    invoice_prefix: string         // "VTX-" → VTX-001
    invoice_starting_number: number
    vat_rate: number               // 19% por defecto en Colombia
    payment_terms_days: number     // 30 días por defecto
  }
  
  // Configuración de portal
  portal: {
    portal_name: string            // "Portal Vertrex" o personalizado
    support_email: string
    sla_rules: SlaRules
    onboarding_template_id: string
    default_progress_profile: ProgressProfile
    show_billing_to_client: boolean
    allow_client_file_upload: boolean
  }
  
  // Configuración de almacenamiento
  storage: {
    max_file_size_local_mb: number   // default 5
    drive_integration_active: boolean
    drive_folder_id: string
  }
  
  // Configuración de IA
  ai: {
    model_preference: string
    auto_suggest_enabled: boolean
    memory_retention_days: number
    portal_bot_enabled: boolean
  }
  
  // Configuración de notificaciones
  notifications: {
    invoice_due_warning_days: number    // 7
    document_expiry_warning_days: number // 30
    credential_rotation_warning_days: number // 90
    sla_breach_alert_enabled: boolean
    daily_digest_enabled: boolean
    daily_digest_time: string           // "08:00"
  }
}
```

**Por qué importa:** hoy cambiar el prefijo de las invoices requiere cambiar código. Con settings centralizado, el admin puede configurar el comportamiento del sistema sin tocar código. Esto es el mínimo de cualquier software B2B serio.

---

### Mejora: logs del sistema accesibles para admin

Vista `/os/settings/logs` con:
- Últimas N solicitudes a la API de OpenClaw con su costo estimado
- Errores recientes del sistema con stack trace resumido
- Jobs de background en ejecución y completados
- Uso de almacenamiento por módulo
- Sesiones activas en este momento

---

### Mejora: modo mantenimiento

Toggle en settings que activa una pantalla de mantenimiento para clientes del portal mientras el equipo hace actualizaciones. Cuando está activo, el portal muestra un mensaje configurable ("Estamos realizando mejoras. Volvemos pronto.") y las sesiones de clientes se suspenden temporalmente.

---

## Resumen de priorización

### Implementar primero — alto impacto, bajo riesgo

| # | Mejora | Razón |
|---|--------|-------|
| 7 | Sistema de etiquetas universal | Sin migración compleja, impacto inmediato en búsqueda y filtros |
| 2 | Plantillas de proyecto | Reduce setup de nuevos proyectos, usa infraestructura existente |
| 12 | Contactos por cliente | FK simple, impacto en coordinación y IA |
| 20 | Settings centralizado | Elimina hardcoding, base para todo lo demás |
| 8 | Health indicators en sidebar | Reutiliza audit + reglas existentes, alto valor visual |

### Segunda ola — impacto en revenue y operación

| # | Mejora | Razón |
|---|--------|-------|
| 6 | Billing recurrente | Impacto directo en cobranza y finanzas |
| 14 | Timeline unificado por cliente | Consolida datos ya existentes en nueva vista |
| 13 | Quote items | Conecta propuesta → invoice, elimina trabajo manual |
| 18 | Risk registry | Baja complejidad técnica, alto valor operativo |
| 1 | Threads internos por entidad | Elimina dependencia de canales externos |

### Tercera ola — profundidad y madurez

| # | Mejora | Razón |
|---|--------|-------|
| 15 | Delivery checklists | Requiere milestones y deliverables primero |
| 9 | Contexto IA de sesión | Requiere snapshot enriquecido estable |
| 4 | Versionado de propuestas | Requiere quote items primero |
| 19 | Exports y webhooks | Requiere modelo de datos estabilizado |
| 16 | Gestión de vendors | Habilita margen real por proyecto |

---

*Vertrex OS — Mejoras V2 — Vertrex 2026*
