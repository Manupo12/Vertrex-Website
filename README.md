# Vertrex Website

Sitio web oficial de **Vertrex S.C.** orientado a presentación de servicios, demostración de portafolio y captación de clientes.

## Workspace actual

La aplicación raíz ya unifica en un solo host y puerto:

- `/login?type=team`
- `/login?type=client`
- `/os`
- `/portal/[clientId]`

Además, la raíz expone las APIs operativas reales bajo `/api/*`.

El directorio `./vertrex-os` sigue existiendo como fuente del dominio operativo, pero ahora sus vistas, auth, portal y APIs se integran y compilan desde la app raíz.

## 🌍 Demo en vivo

- [https://vertrex-website.vercel.app/](https://vertrex-website.vercel.app/)

## 🎯 Propósito del proyecto

Esta web está construida para:

- Comunicar qué hace Vertrex y cómo trabaja.
- Mostrar casos reales, demos y plantillas.
- Convertir visitantes en clientes por medio de formularios y CTA.
- Mantener una experiencia visual moderna en desktop y móvil.

## 🧩 Secciones principales

- `/` Inicio (hero, propuesta de valor, demos y bloques de conversión).
- `/login` Acceso unificado para equipo y clientes.
- `/os` Sistema operativo interno de Vertrex.
- `/portal/[clientId]` Portal de clientes.
- `/servicios` Servicios y metodología de trabajo.
- `/portafolio` Proyectos y catálogo.
- `/portafolio/[slug]` Detalle dinámico por proyecto.
- `/demos` Galería de demostraciones visuales.
- `/cuestionario` Formulario guiado multi-paso.
- `/contacto` Contacto directo y formulario.
- `/sobre-nosotros` Historia, visión y cultura.
- `/terminos` Términos y condiciones.
- `/politica-de-privacidad` Política de privacidad.

## 🏗️ Estructura del código

```text
src/
  app/                # Rutas del App Router (páginas)
  components/         # Componentes reutilizables de UI
  lib/                # Datos estáticos, renderers y router API del OS
```

- `src/app/layout.tsx`: layout raíz, fuentes globales y metadata base.
- `src/app/globals.css`: estilos globales y variables de tema.
- `src/app/os/*`: rutas operativas reales bajo `/os`.
- `src/app/portal/*`: portal de clientes real bajo `/portal`.
- `src/app/api/[...slug]/route.ts`: router unificado para exponer auth, docs y OpenClaw.
- `src/components/AppChrome.tsx`: separa chrome comercial vs operativo dentro de la misma app.
- `src/lib/os-route-renderer.tsx`: enruta vistas del OS reutilizando el código operativo existente.
- `src/lib/os-api-router.ts`: despacha las rutas API reales del OS desde la raíz.
- `src/lib/*-data.ts`: contenido desacoplado para servicios, demos, portafolio y about.

## ⚙️ Stack

- **Next.js 15** (App Router)
- **React + TypeScript**
- **Tailwind CSS v4**
- **Framer Motion**
- **React Icons**
- **Embla Carousel**
- **Drizzle ORM + PostgreSQL/Neon**
- **Lucide React**
- **Puppeteer**
- **Zod**

## 🚀 Desarrollo local

### Requisitos

- Node.js 18+ (recomendado Node.js 20+)
- npm

### Variables

La app raíz usa:

- `NEXT_PUBLIC_APP_URL`
- `DATABASE_URL`
- `AUTH_SECRET`
- `OPENCLAW_API_KEY`
- `OPENCLAW_WEBHOOK_SECRET`
- `PUPPETEER_EXECUTABLE_PATH` (opcional)

Ejemplo:

```bash
cp .env.local.example .env.local
```

La unificación local corre completa en:

- app pública + OS + portal + APIs: `http://localhost:3000`

### Pasos

```bash
git clone https://github.com/Manupo12/Vertrex-Website.git
npm install
```

1. Copia las variables locales:

```bash
cp .env.local.example .env.local
```

2. Levanta la app unificada en la raíz:

```bash
npm run dev
```

3. Abre [http://localhost:3000](http://localhost:3000).

4. Desde la misma app puedes entrar por:

- `Acceder al OS`
- `Portal de cliente`
- `/os`
- `/portal/budaphone`

5. Para activar persistencia real, completa `.env.local` y ejecuta:

```bash
npm run setup:neon
```

## 📜 Scripts

```bash
npm run dev      # desarrollo
npm run build    # build de producción
npm run start    # correr build
npm run lint     # lint del proyecto
npm run typecheck
npm run db:generate
npm run db:push
npm run db:studio
npm run db:seed
npm run setup:neon
```

## 🛰️ Despliegue

Preparado para desplegar como **una sola app Next.js**. La navegación pública, el OS, el portal y las APIs viven bajo el mismo host y puerto.

## 📝 Notas de mantenimiento

- Mantén actualizados los datos en `src/lib` cuando cambie el contenido comercial.
- Si tocas el dominio operativo, prioriza `src/lib/os-route-renderer.tsx`, `src/lib/os-api-router.ts` y `src/components/AppChrome.tsx`.
- Si agregas nuevas páginas, incluye su metadata y revisa consistencia visual móvil.
- Antes de desplegar, ejecutar:
```bash
npm run typecheck
npm run lint
npm run build
```