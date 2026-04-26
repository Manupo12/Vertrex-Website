# Vertrex OS

Sistema operativo interno y portal de clientes de Vertrex sobre Next.js, Neon PostgreSQL y Drizzle.

## Stack

- Next.js App Router
- Neon PostgreSQL
- Drizzle ORM
- Auth por sesión con cookies firmadas
- Generador documental HTML → PDF
- Portal de clientes con subvistas reales
- API OpenClaw para integración del agente local

## Setup rápido

1. Copia el archivo de entorno.

```bash
cp .env.local.example .env.local
```

2. Completa como mínimo estas variables:

- `DATABASE_URL`
- `AUTH_SECRET`
- `OPENCLAW_API_KEY` si vas a probar la API OpenClaw

3. Inicializa base de datos, seed y validación:

```bash
npm run setup:neon
```

4. Levanta el proyecto:

```bash
npm run dev
```

## Scripts útiles

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
npm run db:push
npm run db:seed
npm run setup:neon
```

## Credenciales sembradas

- Equipo
  - usuario: `admin`
  - email real: `admin@vertrex.co`
  - password: `vertrex123`

- Clientes
  - usuario: `<slug-del-cliente>`
  - email real: `<slug>@client.vertrex.co`
  - password: `vertrex123`

- Ejemplo
  - `budaphone` / `vertrex123`

## Rutas clave

- ` /login `
- ` /docs/generator `
- ` /portal/budaphone `
- ` /portal/budaphone/documents `
- ` /portal/budaphone/payments `
- ` /portal/budaphone/chat `
- ` /api/openclaw/status `

## OpenClaw API

Todos los endpoints bajo ` /api/openclaw/* ` requieren:

```http
Authorization: Bearer <OPENCLAW_API_KEY>
```

Endpoints principales:

- `GET /api/openclaw/status`
- `GET /api/openclaw/projects`
- `POST /api/openclaw/projects`
- `GET /api/openclaw/tasks`
- `POST /api/openclaw/tasks`
- `GET /api/openclaw/clients`
- `POST /api/openclaw/clients`
- `GET /api/openclaw/finance/summary`
- `POST /api/openclaw/finance`
- `GET /api/openclaw/documents`
- `POST /api/openclaw/documents`
- `GET /api/openclaw/memory`
- `POST /api/openclaw/memory`
- `DELETE /api/openclaw/memory/[id]`
- `POST /api/openclaw/ai/chat`
- `POST /api/openclaw/webhooks`

## Notas de activación

- Si no configuras `DATABASE_URL`, auth real, OpenClaw y persistencia quedan deshabilitados.
- Si tu entorno necesita Chromium del sistema para PDF, define `PUPPETEER_EXECUTABLE_PATH`.
- El workflow `.windsurf/workflows/activar-neon.md` resume el proceso de activación.
