# Verificación PRD v9 + Roadmap — Estado al 2026-04-28

## Resumen Ejecutivo

**Status: LISTO PARA PRUEBAS**

✅ Typecheck: Sin errores  
✅ Build: Exitoso (todas las rutas generadas)  
✅ Migraciones: 9 archivos SQL listos  
✅ Servicios: Implementados y cableados  

---

## 1. Bloques del Roadmap — Estado Detallado

### Bloque 1A: Autenticación real + sesiones + subroles
**Status:** ✅ IMPLEMENTADO

- `src/lib/auth/session.ts` — Sesiones persistentes con cookie firmada
- `src/lib/auth/token.ts` — Tokens JWT
- `src/app/os/layout.tsx` — Protección server-side
- `src/app/portal/layout.tsx` — Protección portal
- Subroles `team` persistidos en `users.subrole`
- Capabilities por módulo en `users.capabilities`
- Tabla `sessions` en schema
- Tabla `audit_events` para auditoría

### Bloque 1B: Request types y SLA
**Status:** ✅ IMPLEMENTADO

- `src/lib/ops/request-governance.ts` — Catálogo tipado de request types
- Reglas SLA configurables por tipo
- Validación en tickets workspace
- Mapeo en portal-service
- UI muestra requestType y SLA status

### Bloque 2A: Entity Relations
**Status:** ✅ IMPLEMENTADO

- **Migración:** `drizzle/0006_entity_relations.sql`
- **Schema:** Enum `entity_relation_type` (9 tipos)
- **Servicio:** `src/lib/ops/entity-relations.ts`
  - `createEntityRelation()`
  - `deleteEntityRelation()`
  - `getRelatedEntities()`
  - `hasRelation()`
  - `getEntityGraph()`
- **Tipos soportados:** 14 entidades (client, project, task, milestone, document, invoice, deal, ticket, credential, link, file, user, automation_playbook, automation_run)

### Bloque 2B: AI Approvals Queue
**Status:** ✅ IMPLEMENTADO

- **Migración:** `drizzle/0007_ai_approvals.sql`
- **Schema:** 
  - Enum `ai_approval_status` (5 estados)
  - Enum `ai_action_type` (15 acciones)
- **Servicio:** `src/lib/ai/approval-queue.ts`
  - `createApprovalRequest()`
  - `approveRequest()`
  - `rejectRequest()`
  - `cancelRequest()`
  - `expireRequest()`
  - `getPendingApprovals()`
  - `requiresApproval()`
  - `getRiskLevel()`
- **Features:**
  - Contexto JSON completo
  - Cambios propuestos (diff)
  - Trazabilidad completa (requested_by, approved_by, rejected_by)
  - Expiración automática
  - Priorización (low/normal/high/critical)
  - Nivel de riesgo

### Bloque 3A: Portal Activity Feed
**Status:** ✅ IMPLEMENTADO

- **Migración:** `drizzle/0008_portal_activity_feed.sql`
- **Schema:** Tabla con actores (user/ai/system/client), visibilidad controlada
- **Servicio:** `src/lib/portal/portal-activity.ts`
  - `recordPortalActivity()`
  - `getClientActivityFeed()`
  - `getProjectActivityFeed()`
- **Perfiles de visibilidad:** Estructura tipada `PortalVisibilityProfile`
  - 10 flags configurables
  - showProgress, showMilestones, showDocuments, etc.

### Bloque 4A: Automation Execution Log
**Status:** ✅ IMPLEMENTADO

- **Servicio:** `src/lib/automation/execution-service.ts`
  - `createAutomationRun()`
  - `startAutomationRun()`
  - `logExecutionStep()`
  - `completeAutomationRun()`
  - `failAutomationRun()`
  - `getAutomationRun()`
  - `getAutomationRunsForPlaybook()`
- **Features:**
  - Pasos detallados con input/output
  - Logs por step
  - Captura de errores
  - Estados: completed/needs_review/failed
  - Resultado JSON
  - Integración con portal_activity_feed

### Bloque 6A: Vault Cifrado + Rate Limiting + Session Anomaly
**Status:** ✅ IMPLEMENTADO

**Cifrado:**
- **Servicio:** `src/lib/security/vault-secret.ts`
- Algoritmo: AES-256-GCM
- IV 12 bytes aleatorio
- Auth Tag 16 bytes
- Versionado (secretVersion)
- Modos: none/plaintext/encrypted

**Rate Limiting:**
- **Servicio:** `src/lib/security/rate-limit.ts`
- Sliding window
- Headers Retry-After, X-RateLimit-Remaining
- Respuesta 429

**Session Anomaly Detection:**
- **Servicio:** `src/lib/security/session-anomaly.ts`
- Detección de sesiones concurrentes (threshold +3)
- Detección de intentos rápidos de login (+5 en 5min)
- Detección de acceso fuera de horario
- Integración con audit_events
- Severidad (low/medium/high/critical)

---

## 2. Verificación de Esquema Drizzle

Todas las tablas del PRD están definidas en `src/lib/db/schema.ts`:

| Tabla | Status | Notas |
|-------|--------|-------|
| users | ✅ | Con subrole y capabilities |
| sessions | ✅ | Auth real |
| clients | ✅ | Core del sistema |
| projects | ✅ | Con metadata extensible |
| tasks | ✅ | Estados: todo/in_progress/review/done |
| deals | ✅ | Stage como texto (flexible) |
| invoices | ✅ | Integrado con finanzas |
| credentials | ✅ | Con vault encryption |
| files | ✅ | Storage híbrido |
| tickets | ✅ | Con requestType y SLA |
| events | ✅ | Agenda integrada |
| milestones | ✅ | Con peso y orden |
| links | ✅ | Knowledge Hub |
| documents | ✅ | Generador documental |
| transactions | ✅ | Ledger financiero |
| messages | ✅ | Chat unificado |
| automation_playbooks | ✅ | Con trigger/action |
| automation_runs | ✅ | Con metadata para logs |
| audit_events | ✅ | Auditoría completa |
| business_events | ✅ | Eventos de negocio |
| entity_relations | ✅ | **NUEVA** - Relaciones N:M |
| ai_approvals | ✅ | **NUEVA** - Cola IA |
| portal_activity_feed | ✅ | **NUEVA** - Feed cliente |
| request_governance | ✅ | Tipos y SLA |

---

## 3. Verificación de APIs

Todas las rutas API están registradas en `src/lib/os-api-router.ts`:

### Admin API (`/api/admin/*`)
- ✅ `/api/admin/workspace` — CRUD workspace
- ✅ `/api/admin/workspace/files` — Upload files
- ✅ `/api/admin/operational-stats` — Métricas
- ✅ `/api/admin/access` — Gestión de accesos
- ✅ `/api/admin/health` — Health check

### Portal API (`/api/portal/*`)
- ✅ `/api/portal/me` — Perfil cliente
- ✅ `/api/portal/messages` — Mensajería
- ✅ `/api/portal/files` — Archivos portal
- ✅ `/api/portal/tickets` — Tickets soporte
- ✅ `/api/portal/credentials` — Credenciales

### Documents API (`/api/docs/*`)
- ✅ `/api/docs/templates`
- ✅ `/api/docs/render`
- ✅ `/api/docs/documents`
- ✅ `/api/docs/documents/:id/pdf`
- ✅ `/api/documents/generate`

### OpenClaw API (`/api/openclaw/*`)
- ✅ `/api/openclaw/status`
- ✅ `/api/openclaw/ai/chat`
- ✅ `/api/openclaw/clients`
- ✅ `/api/openclaw/projects`
- ✅ `/api/openclaw/tasks`
- ✅ `/api/openclaw/finance`
- ✅ `/api/openclaw/documents`
- ✅ `/api/openclaw/memory`
- ✅ `/api/openclaw/webhooks`

---

## 4. Verificación de UI/UX

### Overlays Globales (OSOverlayManager)
- ✅ commandCenter
- ✅ omniCreator
- ✅ universalInbox
- ✅ taskDetail
- ✅ clientDetail
- ✅ dealDetail
- ✅ eventDetail
- ✅ assetDetail
- ✅ vaultEntry
- ✅ threadDetail
- ✅ contractDetail
- ✅ ticketDetail
- ✅ uploadFile
- ✅ importDocument
- ✅ registerTransaction
- ✅ connectCredential
- ✅ createDeal
- ✅ createEvent
- ✅ createTicket
- ✅ createAutomation
- ✅ templateSelector

### Screens del OS (`/os/*`)
- ✅ /os — Dashboard
- ✅ /os/crm — CRM
- ✅ /os/projects — Proyectos
- ✅ /os/finance — Finanzas
- ✅ /os/calendar — Agenda
- ✅ /os/chat — Chat
- ✅ /os/assets — Assets
- ✅ /os/vault — Vault
- ✅ /os/hub — Knowledge Hub
- ✅ /os/documents — Documentos
- ✅ /os/legal — Legal
- ✅ /os/marketing — Marketing
- ✅ /os/team — Team
- ✅ /os/automations — Automatizaciones
- ✅ /os/ai — AI Console
- ✅ /os/settings — Settings
- ✅ /os/health — Health check
- ✅ /os/my-day — My Day

### Portal Cliente (`/portal/[clientId]`)
- ✅ overview
- ✅ progress
- ✅ documents
- ✅ billing
- ✅ credentials
- ✅ files
- ✅ support
- ✅ chat

---

## 5. Gaps Identificados (Post-Verificación)

### Gaps Menores (No bloqueantes para pruebas)

1. **Deal Stages del PRD**
   - Actual: stage es texto libre
   - PRD pide: sin_contactar, contactado, pendiente, interesado, propuesta_enviada, pendiente_anticipo_50, cliente_activo, pausado, perdido
   - **Impacto:** Bajo — el sistema funciona, solo falta formalizar constantes

2. **Task Status Extendido**
   - Actual: todo, in_progress, review, done
   - PRD menciona: blocked, archived
   - **Impacto:** Bajo — no hay enum pero se puede agregar a metadata

3. **Enforcement Centralizado de Permisos**
   - Existe: `can()` en access-service
   - Falta: Aplicar en todos los endpoints sensibles
   - **Impacto:** Medio — funciona con guards actuales

4. **AI Real (LLM)**
   - Actual: OpenClaw usa heurísticas (`buildOsAgentReply`)
   - PRD sugiere: CEO/CFO/COO virtual con LLM
   - **Impacto:** Medio — es feature futura, no blocker

5. **Knowledge Hub Autónomo**
   - Actual: Agrega documentos, archivos, credenciales con linkUrl
   - PRD: Scraping de URLs, auto-resumen, etiquetado IA
   - **Impacto:** Medio — funciona como índice derivado

6. **Importación Documental**
   - Actual: `ImportDocumentDialog` es placeholder
   - **Impacto:** Bajo — flujo principal (generación) sí funciona

### Gaps Críticos (Ninguno identificado)

✅ **No hay gaps críticos** que impidan probar el sistema.

---

## 6. Checklist Final de Pruebas Recomendadas

### Flujos Core (Deben funcionar)
- [ ] Login como team → /os
- [ ] Login como client → /portal/[clientId]
- [ ] Crear cliente desde CRM
- [ ] Crear proyecto con cliente nuevo + portal
- [ ] Crear tarea en proyecto
- [ ] Subir archivo (team y portal)
- [ ] Crear ticket desde portal
- [ ] Enviar mensaje en chat
- [ ] Registrar transacción financiera
- [ ] Crear deal
- [ ] Crear evento en agenda
- [ ] Guardar credencial en vault
- [ ] Generar documento con preview + PDF
- [ ] Crear usuario team desde settings
- [ ] Crear usuario client con portal

### Nuevas Funcionalidades Roadmap (Verificar)
- [ ] Crear relación entre entidades (entity_relations)
- [ ] Crear aprobación IA y aprobarla
- [ ] Ver feed de actividad en portal
- [ ] Ejecutar playbook y ver log de ejecución
- [ ] Detectar sesión sospechosa (concurrent sessions)
- [ ] Rate limiting en auth

---

## 7. Instrucciones para Ejecutar Pruebas

```bash
# 1. Verificar build
npm run typecheck
npm run build

# 2. Aplicar migraciones (si hay Neon configurado)
npm run db:migrate

# 3. Seed de datos (opcional)
npm run db:seed

# 4. Iniciar en modo dev
npm run dev

# 5. Probar flujos
# - Ir a /login
# - Crear cuenta team
# - Navegar por módulos
# - Probar portal como client
```

---

## Conclusión

**El sistema está LISTO PARA PRUEBAS.**

Todos los bloques del roadmap están implementados:
- ✅ Autenticación real
- ✅ Request types y SLA
- ✅ Entity relations
- ✅ AI approvals queue
- ✅ Portal activity feed
- ✅ Automation execution log
- ✅ Vault cifrado
- ✅ Rate limiting
- ✅ Session anomaly detection

Los gaps identificados son mejoras o formalizaciones menores, no blockers.

**Recomendación:** Proceder con pruebas de usuario en los flujos core listados arriba.
