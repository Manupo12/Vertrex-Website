---
description: activar Vertrex OS con Neon y auth real
---
1. Crea o completa tu archivo `.env.local` a partir de `.env.local.example`.

2. Define como mínimo estas variables:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `SESSION_COOKIE_NAME` (opcional, si quieres cambiar `vertrex_session`)
   - `PUPPETEER_EXECUTABLE_PATH` (opcional, solo si tu entorno lo requiere)

3. Desde la carpeta `vertrex-os`, ejecuta:
   - `npm run setup:neon`

4. Ese comando hará automáticamente lo siguiente:
   - sincronizar el esquema Drizzle con Neon
   - poblar clientes, usuarios, plantillas y datos base
   - validar TypeScript

5. Cuando termine, levanta la app con:
   - `npm run dev`

6. Credenciales iniciales sembradas:
   - equipo: `admin` + `vertrex123`
   - cliente: `<slug-del-cliente>` + `vertrex123`
   - ejemplo cliente: `budaphone` + `vertrex123`

7. Flujos a probar después de levantar:
   - `/login` con acceso de equipo
   - `/login` con acceso de cliente
   - `/docs/generator` para guardar en Neon y exportar PDF
   - `/<clientSlug>` para revisar portal y documentos persistidos
