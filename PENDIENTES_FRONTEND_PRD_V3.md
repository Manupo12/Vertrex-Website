# PENDIENTES FRONTEND — VERTREX OS (PRD v3.0)

## Objetivo
Este documento reaudita el frontend actual después de nuevas incorporaciones relevantes, especialmente:

- índice de documentos
- generador de documentos
- librería de plantillas HTML
- portal de cliente
- nuevas pantallas operativas y analíticas

Clasificación usada:

- **Existe**
- **Existe embebido**
- **Existe pero no conectado**
- **Falta real**

---

## Resumen ejecutivo corregido

La base visual del sistema creció bastante. El documento anterior quedó desactualizado porque varias piezas que antes faltaban **ya existen**, aunque muchas siguen siendo de una sola pantalla o todavía no están conectadas.

### Lo más importante
- **Ya no faltan** `/docs`, `/projects/[id]`, `/login` ni `Deal Detail`.
- **Ya existe** un **portal de cliente base** y un **generador de documentos** con vista previa en vivo.
- **Ya existe** una **librería amplia de plantillas HTML** en `src/app/(os)/docs/generator/plantillas`, pero todavía no está cableada al generador.
- Lo que más falta ahora es:
  - terminar y conectar el **portal de cliente**
  - convertir el **generador de documentos** en flujo real
  - agregar algunos **details/modals** que siguen ausentes

---

## 1. Mapa de pantallas principales y nuevas superficies actuales

| Pantalla | Archivo / Ruta esperada | Estado real en repo | Clasificación |
|---|---|---|---|
| Dashboard / CEO Mode | `/` o `/dashboard` | Existe como `/` | Existe, con decisión pendiente de alias |
| Proyectos lista | `/projects` | Existe | Existe |
| Proyecto detalle | `/projects/[id]` | Existe como overview real | Existe |
| Projects Timeline | `/projects/timeline` | Existe | Existe |
| Projects Graph | `/projects/graph` | Existe | Existe |
| Documentos índice | `/docs` | Existe | Existe |
| Documento editor | `/docs/[id]` | Existe | Existe |
| Generador de documentos | `/docs/generator` | Existe | Existe pero incompleto |
| Legal / contratos | `/legal` | Existe | Existe |
| CRM | `/crm` | Existe | Existe |
| Finanzas | `/finance` | Existe | Existe |
| Assets | `/assets` | Existe | Existe |
| Calendar | `/calendar` | Existe | Existe |
| Chat | `/chat` | Existe | Existe |
| Consola IA | `/ai` o `/ai-assistant` | Existe como `/ai` | Existe, con decisión pendiente de alias |
| Automatizaciones | `/automations` | Existe | Existe |
| Vault | `/vault` | Existe | Existe |
| Settings | `/settings` | Existe | Existe |
| Analytics / BI | `/analytics` | Existe | Existe |
| Marketing / Growth | `/marketing` | Existe | Existe |
| Strategy / OKRs | `/strategy` | Existe | Existe |
| Team Management | `/team` | Existe | Existe |
| Time Tracking | `/time` | Existe | Existe |
| Login | `/login` | Existe | Existe |
| Portal de cliente | `src/app/(portal)/[clientId]/page.tsx` | Existe como pantalla base única | Existe pero incompleto |

---

## 2. Lo que ya existe de verdad

## 2.1 Pantallas principales existentes

- **Dashboard**
- **Projects**
- **Projects Timeline**
- **Projects Graph**
- **Project Detail**
- **CRM**
- **Finance**
- **Assets**
- **Calendar**
- **Chat**
- **AI**
- **Automations**
- **Vault**
- **Settings**
- **Docs Index**
- **Docs Editor**
- **Docs Generator**
- **Legal**
- **Analytics**
- **Marketing**
- **Strategy**
- **Team**
- **Time**
- **Login**
- **Portal de cliente base**

## 2.2 Overlays existentes

### Modales existentes
- `Command Center`
- `Omni Creator`
- `Universal Inbox`

### Slide-overs existentes
- `Task Detail`
- `Client Detail`
- `Deal Detail`

## 2.3 Librerías y activos UI existentes

### Generador de documentos
- existe `src/app/(os)/docs/generator/page.tsx`
- tiene:
  - panel de metadatos
  - selección visual de plantilla activa
  - edición de contenido
  - vista previa A4 en vivo
  - CTA de exportación

### Plantillas HTML
- existe `src/app/(os)/docs/generator/plantillas`
- hay plantillas por cliente y plantillas universales
- esto cuenta como **librería existente**, no como faltante total de diseño

---

## 3. Lo que existe embebido dentro de otras pantallas

Estas piezas **no deben contarse como faltantes totales**, porque ya están representadas dentro de archivos más grandes.

## 3.1 Finance
- `Visión General`
- `Ingresos & MRR`
- `Gastos Operativos`
- `Suscripciones SaaS`
- `Flujo reciente`

## 3.2 Client Detail
- `Resumen & Datos`
- `Historial (Timeline)`
- `Contratos & Docs`
- `Finanzas & Pagos`

## 3.3 Deal Detail
- `Resumen del trato`
- `Timeline & Actividad`
- `Documentos & Cotizaciones`
- `Contactos`

## 3.4 AI
- navegación visual para:
  - consola
  - operaciones autónomas
  - memoria empresarial
  - historial

## 3.5 Chat
- hilos representados visualmente
- creación rápida de tarea desde mensaje
- bandejas tipo inbox/canales/DMs

## 3.6 Assets
- origen `Vertrex / Drive`
- categorías
- tags IA
- OCR indexado

## 3.7 Vault
- entornos `.env`
- shared accounts
- TOTP

## 3.8 Settings
- miembros y roles
- auditoría reciente

## 3.9 Legal
- alertas de vencimiento
- repositorio maestro de contratos
- tarjetas de plantillas/versionado

## 3.10 Portal de cliente
- dashboard general
- progreso resumido
- pagos resumidos
- próximos entregables
- documentos recientes
- CTA para subir material
- CTA para credenciales
- entrada visual a chatbot IA

---

## 4. Lo que existe pero no está conectado o está incompleto

## 4.1 Rutas y estructura

### Dashboard
- existe como `/`
- falta decidir si crear `/dashboard` o dejar `/` como canonical

### IA
- existe como `/ai`
- falta decidir si crear `/ai-assistant` o unificar naming

### Vault
- existe como pantalla separada
- falta decisión arquitectónica sobre si vivir dentro de `/settings` o separado

## 4.2 Docs Index y Docs Editor
- `/docs` ya existe
- filtros, importación, nuevo documento y toggles siguen siendo principalmente visuales
- el editor existe
- historial, compartir y permisos siguen sin resolverse como flujo funcional real

## 4.3 Generador de documentos
- existe `/docs/generator`
- hoy está centrado en una sola experiencia hardcodeada
- faltan:
  - selector real de plantillas
  - conexión de la UI con `plantillas/`
  - cambio real entre plantillas universales y por cliente
  - guardar documento
  - enviar documento
  - versionado
  - generación desde cliente/proyecto/deal
  - persistencia dentro de Docs/Legal
  - exportación real a PDF

## 4.4 Projects
- el detalle `/projects/[id]` ya existe
- falta conexión real entre board, timeline, graph y detail
- botones y accesos rápidos siguen sin abrir flujos completos
- tareas, docs y assets vinculados todavía no abren detalles profundos

## 4.5 CRM
- pipeline existe
- client detail existe
- deal detail existe
- falta apertura real desde cards, estado global de entidad seleccionada y flujo de creación/avance de trato

## 4.6 Legal
- existe `/legal`
- ya hay repositorio, alertas y templates
- falta:
  - detail real de contrato
  - flujo de firma
  - sync con el generador de documentos
  - sync con portal de cliente

## 4.7 Portal de cliente
- existe una sola pantalla base con menú lateral
- el menú no cambia a subvistas reales
- progreso, pagos y documentos están solo como widgets resumidos
- soporte, accesos, comunicación y chatbot no existen todavía como flujo completo
- no hay `layout.tsx` específico en `(portal)`

## 4.8 Finance
- las tabs existen visualmente
- falta navegación real entre tabs
- falta crear/editar/ver movimiento
- falta facturación operativa

## 4.9 Assets
- grid y filtros existen
- falta detalle/preview del asset
- falta upload/import funcional

## 4.10 Chat
- existe experiencia principal
- falta navegación real por canal/DM
- falta thread panel real
- falta notas rápidas como flujo independiente

## 4.11 AI
- sidebar interna existe
- falta que `Memoria empresarial` y `Operaciones autónomas` cambien el contenido real

## 4.12 Automations
- canvas existe
- falta listado de automatizaciones
- falta historial de ejecuciones
- falta selector / librería de triggers y acciones
- falta inspector real de nodo

## 4.13 Settings + Vault
- solo parte de settings cambia realmente el contenido principal
- vault sigue sin detail dedicado por credencial y sin vista clara de accesos/auditoría

## 4.14 Analytics / Marketing / Strategy / Team / Time
- estas pantallas ya existen visualmente
- hoy parecen más dashboards únicos que módulos conectados
- faltan drill-downs, acciones funcionales y navegación hacia entidades relacionadas

## 4.15 Overlays globales
- existen como componentes, pero no como sistema global montado
- falta:
  - store UI global
  - open/close centralizado
  - keyboard shortcuts reales
  - entidad seleccionada
  - render en layout/provider real

---

## 5. Faltantes reales confirmados

## 5.1 Portal de cliente — lo que falta o está por completar

| Área del portal | Estado actual | Qué falta realmente |
|---|---|---|
| Dashboard principal | Existe base visual | conectar datos reales, drill-downs y acciones |
| Progreso del proyecto | Existe como widget | subvista real con completadas / en progreso / pendientes |
| Documentos | Existe como widget | centro documental real con contrato, propuesta, SOW, acta, manual, preview y descarga |
| Pagos | Existe como resumen | vista real con total, pagado, pendiente, porcentaje e historial |
| Comunicación | Casi no existe | chat real, CTA WhatsApp + historial |
| Archivos | Solo CTA de subida | gestor real de archivos compartidos |
| Accesos | Solo nav/CTA | vista real de credenciales, hosting, admin web |
| Soporte / tickets | Solo nav | listado, creación, detalle y estado de tickets |
| IA chatbot | Solo botón flotante y tooltip | panel conversacional real y respuestas contextuales |

## 5.2 Pantallas o subvistas que faltan fuera del portal

### Generador de documentos — gestor de plantillas
- falta una subvista o flujo real para explorar y seleccionar `plantillas`
- falta conectar plantillas universales y plantillas por cliente

### Automatizaciones
- falta listado de automatizaciones
- falta historial de ejecuciones

## 5.3 Slide-overs o details que sí faltan

### Event Detail
- Calendar

### Asset Detail / Preview
- Assets

### Vault Entry Detail
- Vault

### Thread Detail
- Chat

### Ticket Detail
- Portal / soporte

### Contract Detail
- Legal

## 5.4 Modales que sí faltan

### Subir Archivo
- Assets / Docs / Portal

### Importar Documento
- Docs

### Registrar Ingreso/Gasto
- Finance

### Conectar Servicio / Credencial
- Vault / Settings / Portal

### Crear Flujo de Automatización
- entry flow rápido para Automations

### Crear Deal
- CRM

### Crear Evento
- Calendar

### Crear Ticket de Soporte
- Portal / soporte

### Selector o creador de plantilla
- Docs Generator / Legal

---

## 6. Reclasificación de falsos positivos del documento anterior

Estas piezas **no deben volver a marcarse como “faltan”**:

- `/docs`
- `/projects/[id]`
- `/login`
- `Deal Detail`
- `Projects Timeline`
- `Projects Graph`
- `Tracker de Suscripciones`
- `Flujo reciente en Finance`
- `Contratos & Docs` dentro de `Client Detail`
- `Finanzas & Pagos` dentro de `Client Detail`
- `RBAC + auditoría` en `Settings`
- `Historial` y navegación interna de `AI`
- `.env + shared accounts + TOTP` en `Vault`
- `Legal / contratos` como módulo base
- `Docs Generator` como pantalla base
- librería `plantillas/` como activo existente
- `Portal de cliente` como pantalla base
- `Analytics`, `Marketing`, `Strategy`, `Team` y `Time`

La etiqueta correcta para casi todas esas es:

- **Existe embebido**
o
- **Existe pero no conectado**

---

## 7. Checklist corregida por módulo

## 7.1 Core
- [ ] decidir `/dashboard` vs `/`
- [ ] inbox global conectado
- [ ] command center conectado
- [ ] store UI global para overlays

## 7.2 Docs
- [ ] conectar acciones reales en `/docs`
- [ ] share modal
- [ ] permissions modal
- [ ] version history panel
- [ ] conectar `/docs/generator` desde Docs/Legal
- [ ] selector visual de plantillas
- [ ] bind real entre plantillas HTML y generador
- [ ] guardar / enviar / exportar documento de forma real

## 7.3 Legal
- [ ] contract detail
- [ ] firma / aprobación
- [ ] sync con generador
- [ ] sync con portal de cliente

## 7.4 Projects
- [ ] conexión entre Kanban / Timeline / Graph / Detail
- [ ] apertura de tarea
- [ ] apertura de docs/assets vinculados
- [ ] project detail panel opcional
- [ ] sprint/bug/roadmap si se quiere mayor paridad con Linear

## 7.5 CRM
- [ ] create deal modal
- [ ] apertura real de client detail
- [ ] apertura real de deal detail
- [ ] avance de stage y acciones del trato
- [ ] contratos/pagos funcionales

## 7.6 Portal de cliente
- [ ] dashboard conectado
- [ ] progreso real
- [ ] documentos reales
- [ ] pagos + historial
- [ ] comunicación / WhatsApp / chat
- [ ] uploads de archivos
- [ ] accesos / credenciales
- [ ] soporte / tickets
- [ ] chatbot IA real

## 7.7 Finance
- [ ] registrar ingreso/gasto modal
- [ ] detalle de movimiento
- [ ] facturación operativa
- [ ] tabs funcionales

## 7.8 Assets
- [ ] asset detail/preview
- [ ] upload modal
- [ ] import modal o flujo de ingestión
- [ ] edición de metadata

## 7.9 Calendar
- [ ] event detail
- [ ] create/edit event modal
- [ ] cambio real día/semana

## 7.10 Chat
- [ ] navegación real canal/DM
- [ ] thread panel
- [ ] notas rápidas
- [ ] convertir mensaje a entidad de forma real

## 7.11 IA
- [ ] contenido real para memoria empresarial
- [ ] contenido real para operaciones autónomas
- [ ] ruta final `/ai` o `/ai-assistant`

## 7.12 Vault / Settings
- [ ] vault entry detail
- [ ] connect credential modal
- [ ] rotation flow
- [ ] access/audit view dedicada
- [ ] Perfil
- [ ] Preferencias
- [ ] General
- [ ] Seguridad & Auditoría separada
- [ ] Facturación
- [ ] Integraciones
- [ ] Motor de IA

## 7.13 Automatizaciones
- [ ] listado de automatizaciones
- [ ] create automation modal
- [ ] node inspector
- [ ] execution history
- [ ] trigger/action library

## 7.14 Analytics / Marketing / Strategy / Team / Time
- [ ] drill-downs reales
- [ ] acciones funcionales
- [ ] links a entidades relacionadas

---

## 8. Prioridad sugerida para construir con Gemini

## Prioridad 1
- `Portal de cliente` completo
- `Docs Generator` conectado a `plantillas`
- `Event Detail`
- `Asset Detail`
- `Vault Entry Detail`
- `Contract Detail`
- `Ticket Detail`
- `Registrar Ingreso/Gasto Modal`
- `Upload / Import Document Modal`
- `Connect Service / Credential Modal`
- `Create Ticket Modal`

## Prioridad 2
- `Thread Detail`
- `Version History Panel`
- `Permissions Modal`
- `Create Deal Modal`
- `Create Event Modal`
- `Automation List View`
- `Automation Execution History`
- `Template Selector / Template Manager`

## Prioridad 3
- `Sprint View`
- `Bug View`
- `Roadmap View`
- `Trigger/Action Library`
- `Notas rápidas`
- drill-downs de `Analytics / Marketing / Strategy / Team / Time`

---

## 9. Contrato recomendado para lo nuevo

### Pantallas
- ruta clara
- sin shell duplicado
- sin mocks gigantes inline
- export default limpio

### Modales / slide-overs
- `open`
- `onOpenChange`
- `id` o `entityId`
- `mode`
- `initialData`
- `onSubmit`

### Tabs internas
- controlables por props o `searchParams`
- no hardcodear la lógica solo en JSX

---

## 10. Conclusión corregida

El frontend **está bastante más avanzado** que en la auditoría anterior. Ya no faltan varias piezas que antes aparecían como ausentes, pero todavía hay dos focos claros de trabajo:

### Foco 1 — Portal de cliente
- hoy existe una base visual potente
- pero falta convertirla en producto real con progreso, documentos, pagos, soporte, accesos y chatbot funcional

### Foco 2 — Generador de documentos
- la pantalla existe
- las plantillas existen
- lo que falta es la conexión real entre ambos y el flujo operativo de guardar/enviar/exportar

### Faltantes reales más importantes
- `Portal de cliente` completo
- `Docs Generator` conectado a plantillas
- `Event Detail`
- `Asset Detail`
- `Vault Entry Detail`
- `Thread Detail`
- `Contract Detail`
- `Ticket Detail`
- modales de upload/import/finance/credential/ticket/automation

### Mayor deuda actual
- conexión entre vistas
- overlays globales
- tabs funcionales
- navegación real
- estado UI compartido
- convertir pantallas visuales en flujos operativos

---

## 11. Referencia rápida final

### Ya existen
- Dashboard
- Projects
- Project Detail
- Projects Timeline
- Projects Graph
- CRM
- Finance
- Calendar
- Chat
- Assets
- Hub
- AI
- Automations
- Vault
- Settings
- Analytics
- Marketing
- Strategy
- Team
- Time
- Legal
- Docs Index
- Docs Editor
- Docs Generator
- Login
- Portal de cliente base
- Command Center
- Omni Creator
- Universal Inbox
- Task Detail
- Client Detail
- Deal Detail

### Existen, pero no conectados o incompletos
- Dashboard alias `/dashboard`
- AI alias `/ai-assistant`
- Docs Index actions
- Docs Generator
- Legal
- Portal de cliente base
- tabs internas de Finance
- navegación interna de Settings
- submódulos de AI
- client detail tabs
- deal detail tabs
- hilos de Chat
- filtros y switchers de Projects
- Analytics / Marketing / Strategy / Team / Time
- overlays globales

### Faltan de verdad
- `Portal de cliente` completo
- gestor/selector real de `plantillas`
- `Event Detail`
- `Asset Detail`
- `Vault Entry Detail`
- `Thread Detail`
- `Contract Detail`
- `Ticket Detail`
- `Upload / Import / Finance / Credential / Ticket / Automation modals`
