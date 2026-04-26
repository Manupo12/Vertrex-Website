# Master handoff técnico para implementar todo Vertrex OS funcional

## 1. Objetivo general

Continuar el desarrollo de `vertrex-os` sin perder lo ya construido, sin romper la arquitectura actual del App Router y con un objetivo mucho más amplio que solo `portal` o `docs/generator`.

La meta real de este documento es dejar una guía para convertir **todo lo que ya existe visualmente en Vertrex OS** en una experiencia funcional, navegable y consistente.

Eso incluye:

- Consolidar el frontend completo de Vertrex OS.
- Completar la integración del sistema global de overlays/modales/details.
- Hacer funcionales las pantallas ya construidas del OS, evitando botones muertos y rutas huérfanas.
- Terminar el `portal` de cliente con subviews reales y navegación funcional.
- Terminar `docs/generator` con plantillas reales y flujo usable.
- Integrar Vertrex OS con la página principal de forma segura, sin mezclar indebidamente las dos apps del workspace.
- Validar que todo compile y que las rutas, triggers y pantallas clave tengan un comportamiento coherente.

## 2. Regla más importante: no tocar lo que no corresponde

Este workspace tiene dos apps distintas:

- Landing/site principal en la raíz del workspace.
- App OS separada en `vertrex-os/`.

**No modificar la landing** salvo petición explícita.

Todo el trabajo pendiente de este handoff está concentrado en:

- `vertrex-os/`

### 2.1 Si el objetivo incluye “implementar Vertrex OS en la página”

Interpretación correcta y segura:

- No fusionar a la fuerza la landing y `vertrex-os` en una sola app sin una decisión arquitectónica explícita.
- Tratar la integración como **entrypoints y navegación entre apps**:
  - landing -> login de OS
  - landing -> portal cliente
  - landing -> dashboard OS, si aplica por rol
- Cualquier integración con la página principal debe hacerse sin romper la separación actual del workspace.
- Primero estabilizar `vertrex-os`; después, si hace falta, exponer puntos de entrada desde la landing.

## 3. Reglas arquitectónicas obligatorias del repo

Antes de escribir código en `vertrex-os`, respetar estas reglas:

- Leer siempre la documentación local de Next incluida en:
  - `vertrex-os/node_modules/next/dist/docs/`
- Seguir App Router moderno del repo, no asumir APIs viejas por memoria.
- En este repo, las `page.tsx` del App Router deben tratar `params` y `searchParams` como `Promise` cuando aplique en server components.
- Preferir:
  - `page.tsx` server-side
  - componentes interactivos separados con `"use client"`
- No reintroducir `zustand` para stores simples ya resueltos con `useSyncExternalStore`.
- No inventar nuevas claves de overlays si no están definidas en el store global.
- Hacer cambios mínimos y precisos.

## 4. Estado real actual ya implementado

### 4.1 Base global del sistema UI

Ya existe una base funcional global de overlays y shortcuts.

Archivo clave:

- `src/lib/store/ui.ts`

Qué resuelve:

- Store global UI con `useSyncExternalStore`.
- Apertura/cierre/toggle/closeAll.
- Manejo de overlays booleanos, overlays con `id`, y overlays con payload.

Claves reales del store que sí existen:

### Overlays booleanos

- `commandCenter`
- `omniCreator`
- `universalInbox`
- `importDocument`
- `connectCredential`
- `createDeal`
- `createEvent`
- `createTicket`
- `createAutomation`

### Overlays detail con `id`

- `taskDetail`
- `clientDetail`
- `dealDetail`
- `eventDetail`
- `assetDetail`
- `vaultEntry`
- `threadDetail`
- `contractDetail`
- `ticketDetail`

### Overlays con objeto/payload

- `uploadFile` con `{ context }`
- `registerTransaction` con `{ type }`
- `templateSelector` con `{ onSelect }`

**No usar claves fuera de esta lista** sin antes ampliar explícitamente el store y el manager global.

## 5. Componentes/core ya integrados

Estos archivos ya fueron trabajados y no deben rehacerse desde cero:

- `src/components/overlays/os-overlay-manager.tsx`
- `src/components/providers.tsx`
- `src/store/use-os-store.ts`
- `src/app/(os)/layout.tsx`

Qué quedó listo ahí:

- Mount centralizado de overlays.
- Shortcuts globales.
- Integración del shell OS con overlay state.
- Eliminación de dependencia rota a Zustand en el store antiguo del shell.

## 6. Módulos del OS ya cableados al sistema global

Estos módulos ya tienen wiring principal hacia overlays:

- `src/app/(os)/crm/page.tsx`
- `src/app/(os)/calendar/page.tsx`
- `src/app/(os)/assets/page.tsx`
- `src/app/(os)/legal/page.tsx`
- `src/app/(os)/vault/page.tsx`
- `src/app/(os)/finance/page.tsx`
- `src/app/(os)/automations/page.tsx`
- `src/app/(os)/chat/page.tsx`
- `src/app/(os)/docs/page.tsx`

Resumen funcional:

- CTAs y cards principales ya disparan overlays reales en casi todos esos módulos.
- `docs/page.tsx` ya quedó convertido a client component y tiene conectados:
  - `Nuevo Documento` -> `templateSelector`
  - `Importar` -> `importDocument`

## 6.1 Qué significa realmente “hacer funcional todo Vertrex OS”

Una pantalla se considera funcional cuando cumple la mayoría de estas condiciones:

- La ruta abre correctamente.
- No hay errores de TypeScript o hydration obvios asociados a esa vista.
- Sus CTAs principales disparan una acción real:
  - navegación
  - overlay
  - detail view
  - cambio de estado visible
- No existen botones importantes que no hagan nada.
- Las cards, filas o módulos interactivos tienen un comportamiento consistente.
- La vista se conecta con el shell global y con el store UI cuando corresponde.
- El usuario puede entender qué hacer a continuación sin quedarse en un mock muerto.

Para este proyecto, “funcional” no significa necesariamente backend completo en todos los casos; sí significa que la experiencia debe sentirse coherente, navegable y operable con datos mock estructurados o estado real cuando exista.

## 6.2 Inventario real de rutas y pantallas existentes

### Auth

- `src/app/(auth)/login/page.tsx`

### Portal

- `src/app/(portal)/[clientId]/page.tsx`

### OS: dashboard, shell y módulos principales

- `src/app/(os)/page.tsx`
- `src/app/(os)/hub/page.tsx`
- `src/app/(os)/crm/page.tsx`
- `src/app/(os)/calendar/page.tsx`
- `src/app/(os)/assets/page.tsx`
- `src/app/(os)/legal/page.tsx`
- `src/app/(os)/vault/page.tsx`
- `src/app/(os)/finance/page.tsx`
- `src/app/(os)/automations/page.tsx`
- `src/app/(os)/chat/page.tsx`
- `src/app/(os)/docs/page.tsx`
- `src/app/(os)/docs/[id]/page.tsx`
- `src/app/(os)/docs/generator/page.tsx`

### OS: proyectos

- `src/app/(os)/projects/page.tsx`
- `src/app/(os)/projects/[id]/page.tsx`
- `src/app/(os)/projects/graph/page.tsx`
- `src/app/(os)/projects/timeline/page.tsx`

### OS: vistas adicionales existentes que también deben quedar útiles

- `src/app/(os)/ai/page.tsx`
- `src/app/(os)/analytics/page.tsx`
- `src/app/(os)/marketing/page.tsx`
- `src/app/(os)/strategy/page.tsx`
- `src/app/(os)/team/page.tsx`
- `src/app/(os)/time/page.tsx`
- `src/app/(os)/settings/page.tsx`
- `src/app/(os)/sandbox/page.tsx`

### Estado de auditoría al momento de este handoff

#### Ya revisadas y parcialmente cableadas en esta sesión

- CRM
- Calendar
- Assets
- Legal
- Vault
- Finance
- Automations
- Chat
- Docs index
- Shell global OS

#### Ya empezadas pero no terminadas

- Portal cliente
- Docs generator

#### Existen en el repo pero no fueron auditadas en profundidad en esta sesión

- `page.tsx` raíz del OS
- `hub`
- `ai`
- `analytics`
- `marketing`
- `strategy`
- `team`
- `time`
- `settings`
- `projects`
- `projects/[id]`
- `projects/graph`
- `projects/timeline`
- `docs/[id]`
- `sandbox`

La siguiente IA debe asumir que esas vistas **pueden estar visualmente avanzadas pero todavía no están garantizadas como funcionales** hasta ser auditadas una por una.

## 6.3 Estrategia general para convertir todo el OS en funcional

No abordar el trabajo como pantallas aisladas. Abordarlo como estos frentes paralelos pero ordenados:

### Frente A. Estabilidad base

- TypeScript limpio.
- Shell OS estable.
- Store global UI respetado.
- Rutas del App Router correctas.

### Frente B. Interactividad real del producto

- Todo CTA principal debe abrir algo útil o navegar a algo útil.
- Toda lista/card relevante debe tener detail o acción clara.
- Toda vista del shell debe tener al menos un flujo principal operable.

### Frente C. Integración entre vistas

- El shell debe llevar a rutas reales.
- Los overlays deben abrir desde múltiples módulos sin inconsistencias.
- El portal, docs y generator no deben vivir aislados del resto del OS.

### Frente D. Integración con la página principal

- Definir puntos de entrada desde la landing a `vertrex-os`.
- No mezclar routers ni mover carpetas sin necesidad.
- Si se crea acceso desde la web principal, debe llevar a rutas reales como:
  - login
  - portal
  - demo del OS

### Frente E. Saneamiento final

- eliminar botones muertos
- corregir imports sobrantes
- revisar estados hardcodeados inconsistentes
- validar experiencia de navegación end-to-end

## 7. Detalle fino de lo que sí quedó pendiente o incompleto

### 7.1 CRM

Archivo:

- `src/app/(os)/crm/page.tsx`

Situación:

- Hubo un intento fallido de parchear el botón principal `Nuevo Trato` del header superior.
- El parche falló por no-op y **ese cambio no quedó aplicado en esa línea concreta**.
- Muy probablemente el CTA principal visible del header sigue sin `onClick` aunque otras partes del CRM ya quedaron cableadas.

Qué debe hacerse:

- Revisar el botón superior de `Nuevo Trato`.
- Conectarlo a:
  - `open("createDeal")`
- Hacerlo con diff mínimo.
- No tocar el resto del CRM si no hace falta.

### 7.2 Docs index

Archivo:

- `src/app/(os)/docs/page.tsx`

Estado:

- Ya está en `"use client"`.
- Ya usa `useUIStore`.
- Ya tiene wiring en los CTAs principales.

Posible trabajo faltante:

- Decidir si además las `DocumentCard` deben abrir overlays/detalles reales.
- Si se hace, usar solo claves válidas del store.
- Evitar inventar un detail no existente para documentos genéricos si no hay overlay definido.

## 8. Portal de cliente: estado real exacto

Este es ahora el frente principal pendiente.

### 8.1 Archivo original aún existente y aún no migrado

Archivo actual del route:

- `src/app/(portal)/[clientId]/page.tsx`

Estado real:

- Sigue siendo la versión estática anterior.
- Aún no fue reemplazada por el wrapper nuevo.
- Todavía no consume la nueva pantalla dinámica.

### 8.2 Archivos nuevos ya creados para el portal

#### Dataset nuevo

- `src/lib/portal/client-portal-data.ts`

Qué contiene:

- Tipos de portal.
- `PortalView`
- timeline, tasks, documents, invoices, credentials, files, tickets.
- Datos mock estructurados para:
  - `budaphone`
  - `globalbank`
- `resolvePortalClient(clientId)` con fallback.

#### Pantalla interactiva nueva

- `src/components/portal/client-portal-screen.tsx`

Qué intenta resolver:

- Sidebar con subviews reales.
- Navegación por `?view=`.
- Vistas:
  - `overview`
  - `progress`
  - `documents`
  - `billing`
  - `credentials`
  - `files`
  - `support`
- Integración de varias acciones con overlays globales.

### 8.3 Problema actual abierto en portal

El archivo nuevo del portal **todavía no está terminado ni conectado**.

Errores conocidos:

- `src/components/portal/client-portal-screen.tsx`
- TypeScript marca múltiples errores tipo:
  - `'open' is of type 'unknown'`

Causa:

- Se usó `ReturnType<typeof useUIStore>` para tipar el callback `open`.
- Eso no representa el tipo correcto de `store.open`.

Solución esperada:

- Importar el tipo del store o derivar el tipo correcto desde `UIStore`.
- Ejemplo conceptual:
  - usar `type UIStore` desde `@/lib/store/ui`
  - tipar `open` como `UIStore["open"]`
- Después reemplazar todas las props auxiliares que hoy están como:
  - `open: ReturnType<typeof useUIStore>`
- por algo equivalente a:
  - `open: UIStore["open"]`

Además:

- Revisar imports no usados en ese archivo.
- Es muy probable que haya que quitar alguno como `Receipt` si no se utiliza.

### 8.4 Qué debe hacerse para terminar portal correctamente

Orden recomendado:

#### Paso 1

Arreglar `src/components/portal/client-portal-screen.tsx` hasta dejarlo sin errores de tipos.

#### Paso 2

Reemplazar `src/app/(portal)/[clientId]/page.tsx` por un wrapper server-side.

Debe seguir App Router moderno del repo.

Recomendación estructural:

- Mantener `page.tsx` como server component.
- Recibir y `await`:
  - `params`
  - `searchParams`
- Pasar `clientId` y `view` al client component.

Comportamiento deseado del wrapper:

- `clientId` sale de route dynamic segment.
- `view` sale de query string.
- Si `view` es array, tomar primer valor.
- Si no existe, que el screen use `overview` por defecto.

#### Paso 3

Revisar que cada subview abra solo overlays válidos.

Checklist de mapping esperado en el portal:

- documentos legales -> `contractDetail`
- assets compartidos -> `assetDetail`
- tickets/soporte -> `ticketDetail`
- chat IA -> `threadDetail`
- credenciales -> `connectCredential`
- subida de archivos -> `uploadFile`
- creación de ticket -> `createTicket`
- tareas -> `taskDetail`

#### Paso 4

Verificar navegación real entre subviews.

Aceptable:

- `/${clientId}` para `overview`
- `/${clientId}?view=progress`
- `/${clientId}?view=documents`
- etc.

#### Paso 5

Probar con al menos:

- `/budaphone`
- `/globalbank`
- un `clientId` desconocido para validar fallback visual.

### 8.5 Qué no hacer en portal

- No rehacerlo desde cero otra vez si el screen nuevo ya sirve como base.
- No mezclar datos del portal directo dentro del route file si ya existe `client-portal-data.ts`.
- No usar stores nuevos innecesarios.
- No meter lógica server compleja dentro del client screen.

## 9. Docs generator: estado real exacto

Archivo principal:

- `src/app/(os)/docs/generator/page.tsx`

Estado actual:

- Existe UI del generador.
- Ya renderiza una vista previa viva con estado local `docState`.
- Sigue hardcodeado a una versión tipo “Oficio de Presentación”.
- No está conectado todavía a un catálogo real de plantillas.
- No está sincronizado todavía con el overlay global `templateSelector`.

Plantillas reales presentes en el repo:

- `src/app/(os)/docs/generator/plantillas/universales/oficio.html`
- `src/app/(os)/docs/generator/plantillas/budaphone-oficio.html`
- `src/app/(os)/docs/generator/plantillas/index.html`

### 9.1 Objetivo de la siguiente IA en generator

No rehacer la vista: **conectarla bien**.

Debe lograr:

- catálogo real de plantillas
- selección de plantilla
- carga del contenido base según plantilla
- edición de campos sin romper preview
- flujo funcional desde `templateSelector`

### 9.2 Enfoque recomendado para generator

#### A. Extraer catálogo y defaults

Crear una librería tipo:

- `src/lib/docs/template-catalog.ts`

Debe contener:

- ids de plantillas
- labels
- business owner / familia
- ruta de archivo html base
- schema mínimo de campos editables
- estado inicial por plantilla

#### B. Separar modelo del documento

Crear algo tipo:

- `src/lib/docs/document-generator.ts`

Debe centralizar:

- tipo del state del documento
- factory de estado inicial por plantilla
- helpers de actualización
- si hace falta, serialización para preview/export

#### C. Unir overlay y página

La otra IA debe revisar cómo `templateSelector` ya existe en el store y en el overlay manager.

Objetivo:

- que seleccionar una plantilla desde overlay pueda:
  - abrir generator con esa plantilla
  - o hidratar el estado actual del generator

Si se usa navegación:

- hacerlo con parámetros claros
- no inventar flujo roto

Opciones válidas:

- query param en generator
- estado derivado desde selección
- callback `onSelect` ya soportado por `templateSelector`

#### D. Preview real de plantilla

Idealmente:

- no recrear a mano cada template completo si ya existe el HTML base
- aprovechar los `.html` existentes como source de preview o como referencia estructural

Si el HTML se usa como string o `srcDoc`:

- mantener sanitización razonable
- no romper estilos del preview A4

#### E. Export / acciones

Antes de tocar exportación real a PDF:

- primero asegurar consistencia visual y selección de plantilla
- luego revisar si el export actual es placeholder

## 10. Pantallas restantes del OS que deben auditarse para dejarlas funcionales

Estas vistas existen en el repo y forman parte del objetivo de “hacer funcional todo Vertrex OS”, pero no fueron trabajadas en profundidad en esta sesión. La siguiente IA debe revisarlas una por una y asignarles una definición mínima de funcionalidad.

### 10.1 Dashboard raíz del OS y Hub

Archivos:

- `src/app/(os)/page.tsx`
- `src/app/(os)/hub/page.tsx`

Objetivo:

- convertirlas en punto de entrada real al sistema
- enlazar widgets a módulos reales
- evitar KPIs o tarjetas completamente muertas

### 10.2 Proyectos

Archivos:

- `src/app/(os)/projects/page.tsx`
- `src/app/(os)/projects/[id]/page.tsx`
- `src/app/(os)/projects/graph/page.tsx`
- `src/app/(os)/projects/timeline/page.tsx`

Objetivo:

- que listado, detalle, grafo y timeline se relacionen entre sí
- que el usuario pueda entrar a un proyecto desde el listado
- que las vistas alternas no sean callejones sin salida

### 10.3 IA, analytics, marketing, strategy

Archivos:

- `src/app/(os)/ai/page.tsx`
- `src/app/(os)/analytics/page.tsx`
- `src/app/(os)/marketing/page.tsx`
- `src/app/(os)/strategy/page.tsx`

Objetivo:

- determinar la acción principal de cada módulo
- conectar CTAs a overlays o subrutas existentes
- eliminar sensación de mock estático

### 10.4 Team, time y settings

Archivos:

- `src/app/(os)/team/page.tsx`
- `src/app/(os)/time/page.tsx`
- `src/app/(os)/settings/page.tsx`

Objetivo:

- dejar flujos administrativos mínimos usables
- conectar acciones principales a detail overlays, toggles o navegación real
- asegurar que settings tenga secciones operables y no solo layout decorativo

### 10.5 Docs detail y sandbox

Archivos:

- `src/app/(os)/docs/[id]/page.tsx`
- `src/app/(os)/sandbox/page.tsx`

Objetivo:

- usar `docs/[id]` como detalle real o página de lectura si su estructura lo permite
- decidir si `sandbox` es una vista interna de pruebas o una demo; en cualquier caso, que no rompa navegación ni arquitectura

## 11. Errores y riesgos abiertos ahora mismo

### Error abierto 1

- `src/components/portal/client-portal-screen.tsx`
- `open is of type unknown`

Prioridad:

- alta

### Error abierto 2

- `src/app/(portal)/[clientId]/page.tsx` no usa aún la nueva arquitectura creada

Prioridad:

- alta

### Error abierto 3

- `CRM` header principal probablemente aún sin trigger final de `createDeal`

Prioridad:

- media

### Riesgo abierto 4

- `docs/page.tsx` puede requerir wiring adicional en cards si se busca una experiencia más completa

Prioridad:

- media

### Riesgo abierto 5

- si la siguiente IA inventa nuevas claves de overlay, romperá tipos o integración del manager

Prioridad:

- crítica

## 12. Orden de ejecución recomendado para la siguiente IA

### Fase 0: establecer línea base de estabilidad

1. Revisar errores TS actuales del repo.
2. Corregir primero los errores ya introducidos en portal.
3. Confirmar que el shell y el store global siguen sanos.

### Fase 1: terminar lo ya empezado y no dejar trabajo a medias

4. Arreglar typings e imports del portal screen.
5. Conectar el nuevo portal screen desde `src/app/(portal)/[clientId]/page.tsx` con wrapper server-side.
6. Verificar subviews y overlay triggers del portal.
7. Parchear el CTA principal pendiente de CRM si sigue sin cablear.

### Fase 2: consolidar el sistema documental

8. Revisar `docs/page.tsx` y decidir si cards/documentos deben abrir detalle.
9. Revisar `docs/[id]` como ruta real de detalle.
10. Implementar catálogo compartido de plantillas para generator.
11. Conectar `templateSelector` con `docs/generator`.
12. Convertir generator en flujo real, no solo demo estática.

### Fase 3: hacer funcionales todas las pantallas existentes del OS

13. Auditar `page.tsx` del OS y `hub`.
14. Auditar `projects`, `projects/[id]`, `projects/graph`, `projects/timeline`.
15. Auditar `ai`, `analytics`, `marketing`, `strategy`.
16. Auditar `team`, `time`, `settings`.
17. Auditar `sandbox` y definir su papel.

### Fase 4: integrar Vertrex OS con la página principal

18. Revisar la landing del workspace raíz solo para exponer entrypoints claros hacia el OS, si el alcance lo requiere.
19. Añadir navegación segura a login, portal o demo del OS sin fusionar las apps.
20. Verificar que el usuario pueda descubrir Vertrex OS desde la web principal.

### Fase 5: saneamiento y cierre

21. Ejecutar chequeo TypeScript.
22. Corregir imports no usados y errores de tipado.
23. Hacer smoke test manual de rutas clave.
24. Revisar coherencia visual y ausencia de botones muertos.

## 13. Checklist técnico concreto

### Integración general Vertrex OS + página

- [ ] existe una estrategia explícita para exponer Vertrex OS desde la página principal
- [ ] la integración no rompe la separación entre landing y `vertrex-os`
- [ ] login, portal o demo del OS son descubribles desde la web principal cuando aplique

### Shell global y arquitectura base

- [ ] shell OS estable
- [ ] shortcuts globales funcionando
- [ ] overlay manager estable
- [ ] `useUIStore` respetado como fuente única de overlays
- [ ] App Router respetado según docs locales del repo

### Portal

- [ ] `client-portal-screen.tsx` sin errores TS
- [ ] `page.tsx` del portal migrado a wrapper server-side
- [ ] `/budaphone` funcional
- [ ] `/globalbank` funcional
- [ ] query param `view` funcional
- [ ] CTAs del portal disparan overlays válidos

### OS docs

- [x] CTA `Nuevo Documento` abre `templateSelector`
- [x] CTA `Importar` abre `importDocument`
- [ ] decidir wiring de cards/documentos individuales

### CRM

- [ ] verificar y arreglar CTA superior `Nuevo Trato`

### Módulos ya cableados que aún deben auditarse a fondo

- [ ] CRM sin CTAs muertos
- [ ] Calendar sin CTAs muertos
- [ ] Assets con detalles operables
- [ ] Legal con repositorio y plantillas operables
- [ ] Vault con entries y credenciales operables
- [ ] Finance con ledger y acciones operables
- [ ] Automations con entrypoint real de creación
- [ ] Chat con inbox, hilos y adjuntos operables
- [ ] Docs index con flujo claro hacia detalle o generator

### Pantallas existentes aún no auditadas en esta sesión

- [ ] dashboard raíz del OS funcional
- [ ] hub funcional
- [ ] projects funcional
- [ ] project detail funcional
- [ ] project graph funcional
- [ ] project timeline funcional
- [ ] ai funcional
- [ ] analytics funcional
- [ ] marketing funcional
- [ ] strategy funcional
- [ ] team funcional
- [ ] time funcional
- [ ] settings funcional
- [ ] sandbox definido y utilizable

### Generator

- [ ] catálogo real de plantillas
- [ ] selección de plantilla integrada
- [ ] estado inicial por plantilla
- [ ] preview consistente
- [ ] flujo usable desde overlay o navegación

### Validación final

- [ ] TypeScript limpio
- [ ] sin imports muertos evidentes
- [ ] sin tocar landing
- [ ] sin overlays inventados
- [ ] sin botones principales muertos
- [ ] navegación coherente entre módulos
- [ ] rutas clave abiertas sin errores

## 14. Rutas y archivos importantes a revisar primero

### Core global

- `src/lib/store/ui.ts`
- `src/components/overlays/os-overlay-manager.tsx`
- `src/components/providers.tsx`
- `src/app/(os)/layout.tsx`

### Portal

- `src/app/(portal)/[clientId]/page.tsx`
- `src/components/portal/client-portal-screen.tsx`
- `src/lib/portal/client-portal-data.ts`

### Auth e integración externa

- `src/app/(auth)/login/page.tsx`

### Dashboard y vistas OS no auditadas todavía

- `src/app/(os)/page.tsx`
- `src/app/(os)/hub/page.tsx`
- `src/app/(os)/ai/page.tsx`
- `src/app/(os)/analytics/page.tsx`
- `src/app/(os)/marketing/page.tsx`
- `src/app/(os)/strategy/page.tsx`
- `src/app/(os)/team/page.tsx`
- `src/app/(os)/time/page.tsx`
- `src/app/(os)/settings/page.tsx`
- `src/app/(os)/sandbox/page.tsx`

### Projects

- `src/app/(os)/projects/page.tsx`
- `src/app/(os)/projects/[id]/page.tsx`
- `src/app/(os)/projects/graph/page.tsx`
- `src/app/(os)/projects/timeline/page.tsx`

### Docs

- `src/app/(os)/docs/page.tsx`
- `src/app/(os)/docs/[id]/page.tsx`
- `src/app/(os)/docs/generator/page.tsx`
- `src/app/(os)/docs/generator/plantillas/universales/oficio.html`
- `src/app/(os)/docs/generator/plantillas/budaphone-oficio.html`
- `src/app/(os)/docs/generator/plantillas/index.html`

### Módulos ya cableados

- `src/app/(os)/crm/page.tsx`
- `src/app/(os)/calendar/page.tsx`
- `src/app/(os)/assets/page.tsx`
- `src/app/(os)/legal/page.tsx`
- `src/app/(os)/vault/page.tsx`
- `src/app/(os)/finance/page.tsx`
- `src/app/(os)/automations/page.tsx`
- `src/app/(os)/chat/page.tsx`

## 15. Cómo debería trabajar la siguiente IA para no romper nada

### Sí hacer

- Leer primero los archivos anteriores.
- Reusar el store global existente.
- Respetar el patrón del overlay manager.
- Hacer diffs pequeños.
- Mantener App Router correcto.
- Validar antes de seguir con nuevos features.

### No hacer

- No rehacer store global.
- No meter librerías nuevas sin necesidad clara.
- No tocar la landing.
- No convertir indiscriminadamente todo a client component.
- No inventar claves de overlay.
- No borrar trabajo ya funcional “por limpieza”.
- No asumir que una pantalla “bonita” ya es funcional.
- No tocar la landing más allá de entrypoints si esa integración entra en alcance.

## 16. Sugerencia de validación final

Después de terminar los pendientes, ejecutar algo equivalente a:

1. chequeo de tipos del proyecto
2. revisión de errores TS del portal
3. prueba manual mínima de estas vistas:
   - `/login`
   - ruta principal del OS
   - `/hub`
   - `/budaphone`
   - `/globalbank`
   - `/projects`
   - `/docs`
   - `/docs/generator`
   - `/crm`
   - `/calendar`
   - `/chat`
   - `/finance`
   - `/vault`

Verificar manualmente:

- navegación entre subviews
- apertura de overlays
- ausencia de crashes por hydration o typing
- consistencia visual base
- ausencia de CTAs principales muertos
- continuidad entre pantallas relacionadas

## 17. Resumen ejecutivo para la siguiente IA

Lo más importante es esto:

- La base global de overlays **ya existe y funciona**.
- Una parte importante del OS **ya está parcialmente cableada**, pero todavía no todo el producto es funcional.
- `docs/page.tsx` ya tiene CTAs principales conectados.
- El `portal` ya tiene una base nueva creada en dos archivos, pero **todavía no está integrada ni limpia de tipos**.
- El `generator` sigue siendo la gran pieza pendiente para pasar de demo a flujo real.
- Existen muchas rutas adicionales del OS que aún deben auditarse para que todo el sistema sea operable de punta a punta.
- La prioridad inmediata correcta es:
  - estabilizar portal
  - terminar generator y docs detail
  - auditar todas las pantallas existentes del OS
  - definir integración segura con la página principal
  - validar end-to-end

Si la siguiente IA sigue este orden y respeta el store global, las reglas del App Router y la separación entre landing y `vertrex-os`, debería poder convertir Vertrex OS en una experiencia funcional completa sin perder contexto ni romper arquitectura.
