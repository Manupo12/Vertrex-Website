# Vertrex Website

Sitio web oficial de **Vertrex S.C.** orientado a presentación de servicios, demostración de portafolio y captación de clientes.

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
  lib/                # Datos estáticos y tipos de dominio
```

- `src/app/layout.tsx`: layout raíz, fuentes globales y metadata base.
- `src/app/globals.css`: estilos globales y variables de tema.
- `src/lib/*-data.ts`: contenido desacoplado para servicios, demos, portafolio y about.

## ⚙️ Stack

- **Next.js 15** (App Router)
- **React + TypeScript**
- **Tailwind CSS v4**
- **Framer Motion**
- **React Icons**
- **Embla Carousel**

## 🚀 Desarrollo local

### Requisitos

- Node.js 18+ (recomendado Node.js 20+)
- npm

### Pasos

```bash
git clone https://github.com/Manupo12/Vertrex-Website.git
cd Vertrex-Website
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## 📜 Scripts

```bash
npm run dev      # desarrollo
npm run build    # build de producción
npm run start    # correr build
npm run lint     # lint del proyecto
```

## 🛰️ Despliegue

Preparado para **Vercel**. Cada push a `main` puede desplegar automáticamente si el proyecto está vinculado.

## 📝 Notas de mantenimiento

- Mantén actualizados los datos en `src/lib` cuando cambie el contenido comercial.
- Si agregas nuevas páginas, incluye su metadata y revisa consistencia visual móvil.
- Antes de desplegar, ejecutar:

```bash
npm run lint
npm run build
```