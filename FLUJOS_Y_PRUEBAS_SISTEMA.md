# Flujos y Pruebas del Sistema — Vertrex OS

**Fecha:** 2026-04-28  
**Versión:** PRD v9 Implementado Completo  

---

## Resumen de Implementación

### Gaps Completados ✅

| Gap | Solución | Archivos |
|-----|----------|----------|
| **Deal Stages** | Enum formal 9 etapas | `drizzle/0009_deal_stages.sql`, `schema.ts` |
| **Task Status** | blocked + archived ya existen | `status-catalog.ts` |
| **Permisos can()** | Función creada + enforcement | `access-governance.ts` |
| **AI LLM** | Servicio OpenAI integrado | `llm-service.ts` |
| **Knowledge Hub** | Scraping URLs + resumen IA | `url-scraper.ts` |
| **Import Document** | Dialog completo + API endpoint | `os-overlay-manager.tsx`, `import/route.ts` |

---

## 1. Flujos Core (Obligatorios)

### 1.1 Autenticación

```gherkin
Feature: Autenticación de usuarios

Scenario: Login como team member
  Given estoy en /login
  When ingreso "admin@vertrex.co" y password
  Then soy redirigido a /os
  And veo el dashboard del OS

Scenario: Login como cliente
  Given estoy en /login
  When ingreso "cliente@client.vertrex.co" y password
  Then soy redirigido a /portal/[clientSlug]
  And veo el portal del cliente

Scenario: Logout
  Given estoy logueado
  When clickeo "Cerrar sesión"
  Then soy redirigido a /login
  And la cookie de sesión se elimina
```

**Pruebas manuales:**
- [ ] Login con email completo
- [ ] Login con identifier corto (sin @)
- [ ] Redirección correcta por rol
- [ ] Sesión persiste en DB
- [ ] Revocación de sesiones desde settings

### 1.2 CRM — Clientes y Deals

```gherkin
Feature: Gestión de CRM

Scenario: Crear cliente
  Given estoy en /os/crm
  When clickeo "Nuevo cliente"
  And completo nombre, brand, email, teléfono
  Then el cliente aparece en la lista
  And tiene slug autogenerado

Scenario: Crear deal con etapas PRD
  Given estoy en /os/crm
  When clickeo "Nuevo deal"
  And selecciono stage "sin_contactar" (u otra de las 9)
  Then el deal aparece en el pipeline
  And puede moverse entre etapas:
    - sin_contactar → contactado → interesado → propuesta_enviada → pendiente_anticipo_50 → cliente_activo
    - o a: pausado, perdido
```

**Pruebas manuales:**
- [ ] Crear cliente con todos los campos
- [ ] Crear deal con cada uno de los 9 stages
- [ ] Transición entre etapas
- [ ] Filtro de deals por stage
- [ ] Vincular deal a cliente existente
- [ ] Vincular deal a proyecto

### 1.3 Proyectos y Tareas

```gherkin
Feature: Gestión de Proyectos

Scenario: Crear proyecto con cliente nuevo
  Given estoy en /os/projects
  When clickeo "Nuevo proyecto"
  And selecciono "Crear cliente nuevo"
  And completo datos del cliente + proyecto
  Then se crean ambos (cliente y proyecto)
  And el proyecto tiene clientId vinculado

Scenario: Crear tarea con estados extendidos
  Given estoy en un proyecto
  When creo tarea
  Then puedo cambiar status a:
    - todo, in_progress, review, done (originales)
    - blocked, archived (nuevos)

Scenario: Vincular entidades con relations
  Given existen tareas A y B
  When creo relación "A blocks B"
  Then B aparece como blocked por A
  And la relación es bidireccional (B blocked_by A)
```

**Pruebas manuales:**
- [ ] Crear proyecto con cliente existente
- [ ] Crear proyecto + cliente nuevo
- [ ] Crear tarea en cada columna
- [ ] Mover tarea entre estados
- [ ] Crear relación entre tareas (depends_on, blocks, etc.)
- [ ] Ver grafo de relaciones

### 1.4 Portal Cliente

```gherkin
Feature: Portal del Cliente

Scenario: Cliente ve su dashboard
  Given login como cliente
  Then veo:
    - Overview con métricas
    - Progreso del proyecto
    - Documentos compartidos
    - Billing
    - Credenciales
    - Archivos
    - Soporte (tickets)
    - Chat

Scenario: Cliente crea ticket
  Given estoy en /portal/[id]/support
  When clickeo "Nuevo ticket"
  And completo título, descripción, requestType
  Then el ticket aparece en el sistema
  And el equipo lo ve en el workspace

Scenario: Cliente sube archivo
  Given estoy en /portal/[id]/files
  When subo archivo PDF
  Then aparece en files del portal
  And el equipo lo ve en assets

Scenario: Feed de actividad visible
  Given hay actividad reciente
  When entro al portal
  Then veo timeline con:
    - Documentos compartidos
    - Milestones completados
    - Mensajes del equipo
```

**Pruebas manuales:**
- [ ] Login como cliente
- [ ] Ver cada subvista (overview, progress, documents, billing, credentials, files, support, chat)
- [ ] Crear ticket desde portal
- [ ] Subir archivo desde portal
- [ ] Enviar mensaje en chat
- [ ] Ver feed de actividad
- [ ] Configurar visibilidad de perfil

### 1.5 Documentos y Generación

```gherkin
Feature: Generación e Importación de Documentos

Scenario: Generar documento desde plantilla
  Given estoy en /os/documents
  When clickeo "Generar documento"
  And selecciono plantilla universal (SOW, contrato, etc.)
  And completo variables
  Then veo preview HTML
  And puedo guardar en Neon
  And puedo exportar PDF

Scenario: Importar documento por URL
  Given estoy en /os/documents
  When clickeo "Importar"
  And pego URL de PDF
  And completo metadatos (cliente, proyecto)
  Then el documento se importa
  And queda vinculado al cliente/proyecto

Scenario: Importar documento por archivo
  Given abro ImportDocumentDialog
  When arrastro archivo PDF
  Then se carga el archivo
  And se crea registro en documents
```

**Pruebas manuales:**
- [ ] Generar SOW
- [ ] Generar contrato
- [ ] Preview HTML antes de guardar
- [ ] Exportar PDF
- [ ] Versionado de documentos
- [ ] Importar por URL
- [ ] Importar por drag & drop

### 1.6 Finanzas

```gherkin
Feature: Gestión Financiera

Scenario: Registrar ingreso
  Given estoy en /os/finance
  When clickeo "Registrar transacción"
  And selecciono tipo "income"
  And completo monto, categoría, descripción
  Then aparece en el ledger
  And actualiza métricas (runway, burn rate)

Scenario: Registrar gasto
  Given estoy en /os/finance
  When registro transacción tipo "expense"
  Then aparece en ledger
  And afecta cálculos de runway
```

**Pruebas manuales:**
- [ ] Registrar ingreso
- [ ] Registrar gasto
- [ ] Ver caja actual
- [ ] Ver runway calculado
- [ ] Ver burn rate
- [ ] Filtrar por categoría

### 1.7 Vault y Credenciales

```gherkin
Feature: Vault de Credenciales

Scenario: Guardar credencial cifrada
  Given estoy en /os/vault
  When creo nueva credencial
  And ingreso usuario/contraseña
  Then se guarda cifrada con AES-256-GCM
  And se registra en audit_events

Scenario: Revelar credencial
  Given existen credenciales guardadas
  When clickeo "Ver"
  Then se descifra y muestra valor
  And se registra acceso en auditoría
```

**Pruebas manuales:**
- [ ] Crear credencial
- [ ] Ver credencial (descifrado)
- [ ] Ver que está cifrada en DB
- [ ] Asociar a cliente/proyecto
- [ ] Revisar auditoría de acceso

### 1.8 Automatizaciones

```gherkin
Feature: Automatizaciones y Playbooks

Scenario: Crear playbook
  Given estoy en /os/automations
  When creo nuevo playbook
  And defino trigger y acción
  Then queda guardado

Scenario: Ejecutar playbook con log
  Given existe playbook
  When se dispara ejecución
  Then se crea automation_run
  And se loguea cada step con:
    - input/output
    - timestamps
    - errores si falla
  And al completar, status = completed/failed/needs_review
  And se registra en portal_activity_feed
```

**Pruebas manuales:**
- [ ] Crear playbook
- [ ] Ejecutar manualmente
- [ ] Ver log de ejecución
- [ ] Ver steps detallados
- [ ] Ver resultado final

### 1.9 Aprobaciones IA

```gherkin
Feature: Cola de Aprobaciones IA

Scenario: IA solicita aprobación
  Given el sistema detecta acción que requiere aprobación
  When crea approval_request
  Then aparece en cola de aprobaciones
  And notifica a usuarios con capability correspondiente

Scenario: Aprobar acción IA
  Given hay request pendiente
  When un admin la aprueba
  Then se ejecuta la acción
  And se registra resultado
  And se notifica a la IA

Scenario: Rechazar acción IA
  Given hay request pendiente
  When se rechaza con motivo
  Then no se ejecuta
  And se registra rechazo en auditoría
```

**Pruebas manuales:**
- [ ] Crear approval request
- [ ] Ver pending approvals
- [ ] Aprobar request
- [ ] Rechazar request
- [ ] Ver que expiran automáticamente

### 1.10 Knowledge Hub

```gherkin
Feature: Hub de Conocimiento

Scenario: Scrapear URL
  Given estoy en /os/hub
  When agrego URL nueva
  Then el sistema:
    - Obtiene título, descripción, imagen
    - Extrae dominio
    - Genera resumen con IA
    - Sugiere categoría

Scenario: Ver recursos agregados
  Given hay URLs/documentos/archivos
  When entro al Hub
  Then veo lista unificada con:
    - Documentos del sistema
    - Archivos subidos
    - URLs scrapeadas
    - Credenciales con linkUrl
```

**Pruebas manuales:**
- [ ] Pegar URL y scrapear
- [ ] Ver resumen generado
- [ ] Ver metadatos extraídos
- [ ] Buscar en el Hub
- [ ] Filtrar por tipo

---

## 2. Flujos de Seguridad

### 2.1 Sesiones y Rate Limiting

```gherkin
Feature: Seguridad de Sesiones

Scenario: Detectar sesiones concurrentes
  Given usuario tiene 3+ sesiones activas
  When intenta login otra vez
  Then se detecta anomalía
  And se registra en audit_events
  And puede alertar al admin

Scenario: Rate limiting en auth
  Given hay +5 intentos fallidos en 5 min
  When hace otro intento
  Then recibe 429 Too Many Requests
  And debe esperar antes de reintentar
```

**Pruebas manuales:**
- [ ] Abrir múltiples sesiones con mismo usuario
- [ ] Revisar alerta de sesiones concurrentes
- [ ] Intentar login 5+ veces fallidas
- [ ] Verificar rate limit (429)

### 2.2 Permisos y Capabilities

```gherkin
Feature: Control de Acceso

Scenario: Verificar can()
  Given usuario con subrole "dev"
  When intenta acceder a finance
  Then can() retorna false (dev no tiene finance)
  And se bloquea acceso

Scenario: Admin tiene acceso total
  Given usuario con subrole "admin"
  When intenta cualquier acción
  Then can() siempre retorna true
```

**Pruebas manuales:**
- [ ] Usuario dev intenta ver finance (debe bloquear)
- [ ] Usuario admin accede a todo
- [ ] Verificar capabilities en settings

---

## 3. Flujos de Integración (API)

### 3.1 OpenClaw API

```bash
# Probar endpoints de OpenClaw
curl -X GET https://[host]/api/openclaw/status \
  -H "Authorization: Bearer $OPENCLAW_API_KEY"

curl -X POST https://[host]/api/openclaw/clients \
  -H "Authorization: Bearer $OPENCLAW_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Client","brand":"Test"}'
```

**Pruebas:**
- [ ] Status endpoint
- [ ] CRUD de clients
- [ ] CRUD de projects
- [ ] CRUD de tasks
- [ ] Chat endpoint
- [ ] Memory persistence

### 3.2 Webhooks

```gherkin
Scenario: Recibir webhook
  Given configuré webhook URL
  When ocurre evento (nuevo cliente, deal ganado, etc.)
  Then se envía POST a mi URL
  Y puedo validar firma con secret
```

**Pruebas:**
- [ ] Configurar webhook
- [ ] Trigger evento
- [ ] Verificar payload recibido
- [ ] Validar firma

---

## 4. Checklist Final de Pruebas

### Pre-requisitos
- [ ] `npm run typecheck` pasa sin errores
- [ ] `npm run build` genera todas las rutas
- [ ] `npm run db:migrate` aplica migraciones
- [ ] Variables de entorno configuradas:
  - [ ] DATABASE_URL
  - [ ] AUTH_SECRET
  - [ ] BLOB_READ_WRITE_TOKEN (opcional)
  - [ ] OPENAI_API_KEY (opcional)
  - [ ] OPENCLAW_API_KEY (opcional)

### Pruebas Core (Mínimo Viable)
- [ ] Login/logout funciona
- [ ] Crear cliente
- [ ] Crear proyecto
- [ ] Crear tarea
- [ ] Crear deal con stages
- [ ] Subir archivo
- [ ] Generar documento
- [ ] Portal cliente accesible
- [ ] Ticket desde portal
- [ ] Mensaje en chat

### Pruebas Roadmap (Nuevas Funcionalidades)
- [ ] Entity relations funcionan
- [ ] AI approvals queue
- [ ] Portal activity feed
- [ ] Automation execution log
- [ ] Vault encryption
- [ ] Session anomaly detection
- [ ] Rate limiting
- [ ] URL scraping en Hub
- [ ] Import document funcional

### Pruebas de Seguridad
- [ ] No puedo acceder a /os sin login
- [ ] No puedo acceder a /portal sin rol client
- [ ] Rate limit funciona
- [ ] Sesiones se revocan
- [ ] Auditoría registra eventos

---

## 5. Comandos de Verificación

```bash
# 1. Verificar tipos
npm run typecheck

# 2. Build de producción
npm run build

# 3. Migraciones
npm run db:migrate

# 4. Seed (opcional)
npm run db:seed

# 5. Iniciar en dev
npm run dev

# 6. Verificar rutas API
open http://localhost:3000/api/admin/workspace

# 7. Verificar portal
open http://localhost:3000/portal/test-client
```

---

## 6. Solución de Problemas Comunes

### Error: "Cannot find module 'openai'"
```bash
npm install openai
```

### Error: "Cannot find module 'cheerio'"
```bash
npm install cheerio
```

### Error: "Typecheck failed"
```bash
# Ver errores detallados
npx tsc --noEmit
# Corregir y reintentar
```

### Error: "Migration failed"
```bash
# Resetear migraciones (cuidado: borra datos)
npm run db:reset
npm run db:migrate
npm run db:seed
```

### Error: "Build failed"
```bash
# Limpiar caché
rm -rf .next
rm -rf node_modules/.cache
npm run build
```

---

## 7. Estado Final del Sistema

### Implementado ✅
- [x] Autenticación real con sesiones
- [x] Roles: team (con subroles) + client
- [x] CRUD completo de entidades core
- [x] Portal cliente funcional
- [x] Generador documental con PDF
- [x] Vault con cifrado AES-256-GCM
- [x] Deal stages formales (9 etapas)
- [x] Task status extendido (blocked, archived)
- [x] Entity relations N:M
- [x] AI approvals queue
- [x] Portal activity feed
- [x] Automation execution log
- [x] Rate limiting
- [x] Session anomaly detection
- [x] Permisos can()
- [x] LLM service (OpenAI)
- [x] URL scraping
- [x] Import document completo

### Pendiente (No bloqueante)
- [ ] Firma electrónica real
- [ ] Conectores a Meta/Google Ads
- [ ] LLM entrenado por cliente
- [ ] Reconciliación bancaria

---

**Conclusión:** El sistema está completo y listo para pruebas de usuario. Todos los gaps identificados han sido implementados.
