# Vertrex S.C.

> Tecnología con alma humana.

Este repositorio contiene el código fuente del sitio web oficial de **Vertrex S.C.**, una empresa de soluciones digitales con sede en Neiva, Colombia. Este proyecto va más allá de un simple sitio informativo; es una plataforma de marketing y captación de clientes diseñada para ser moderna, persuasiva y de alto rendimiento.

---

## 🚀 Demo en Vivo

Puedes ver la última versión desplegada del proyecto en Vercel:

**[https://vertrex-website.vercel.app/](https://vertrex-website.vercel.app/)**

*(¡Esta es la URL de tu proyecto en Vercel! Si usas un dominio personalizado, actualízala aquí.)*

## 📸 Captura de Pantalla

*Te recomiendo usar una herramienta como [ScreenToGif](https://www.screentogif.com/) para grabar un GIF del nuevo Hero animado y reemplazar esta imagen.*

![Captura de pantalla del sitio Vertrex](https://via.placeholder.com/800x450.png?text=Homepage+de+Vertrex)

## ✨ Características Principales

- **Hero Section Dinámica:** Encabezado con texto animado (`react-type-animation`) e íconos que cambian de forma sincronizada, presentando una oferta de valor clara: una demo visual gratuita.
- **Showcase de Demos Funcionales:** Un carrusel interactivo (`embla-carousel`) que muestra videos de demos de proyectos en maquetas de dispositivos (móvil y escritorio), ofreciendo una prueba visual inmediata de las capacidades de la empresa.
- **Arquitectura de Portafolio Avanzada:**
    - **Páginas de Detalle Dinámicas:** Rutas generadas programáticamente (`/portafolio/[slug]`) para mostrar "casos de estudio" detallados para cada proyecto, con un diseño inspirado en la Play Store.
    - **Galería Filtrable:** La página principal del portafolio presenta los proyectos en dos columnas distintas ("Proyectos Vertrex" y "Proyectos para Clientes") con filtros interactivos independientes.
    - **Tarjetas Polimórficas:** El sistema utiliza diferentes diseños de tarjeta (`AppProjectCard` vs. `WebProjectCard`) según el tipo de proyecto.
- **Cuestionario Interactivo Multi-paso:** Una herramienta de captación de clientes de 4 pasos con barra de progreso, validación por paso, lógica condicional y capacidad para subir archivos.
- **Experiencia Móvil de Primer Nivel:** Cada página y componente ha sido meticulosamente refinado para una experiencia de usuario impecable en dispositivos móviles, con animaciones fluidas (`framer-motion`), bloqueo de scroll en menús y layouts totalmente adaptativos.
- **Código y Datos Desacoplados:** La información de proyectos, servicios y demos está centralizada en archivos de datos en `src/lib`, siguiendo el principio DRY (Don't Repeat Yourself) para un mantenimiento sencillo y escalable.

## 💻 Pila Tecnológica (Tech Stack)

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Animaciones:** [Framer Motion](https://www.framer.com/motion/), [React Type Animation](https://www.npmjs.com/package/react-type-animation)
- **Componentes:** [React Icons](https://react-icons.github.io/react-icons/), [Embla Carousel React](https://www.embla-carousel.com/)
- **Formularios:** [Web3Forms](https://web3forms.com/)
- **Despliegue:** [Vercel](https://vercel.com/)

## 🛠️ Cómo Empezar (Desarrollo Local)

Sigue estos pasos para levantar una copia del proyecto en tu máquina local.

### Prerrequisitos

Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18.x o superior).

### Instalación y Configuración

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/Manupo12/Vertrex-Website.git](https://github.com/Manupo12/Vertrex-Website.git)
    ```

2.  **Navega al directorio del proyecto:**
    ```bash
    cd Vertrex-Website
    ```

3.  **Instala las dependencias:**
    ```bash
    npm install
    ```

4.  **Configura las Variables de Entorno:**
    Este proyecto necesita una clave de API para que los formularios funcionen.
    - Crea una copia del archivo `.env.example` y renómbrala a `.env.local`.
    ```bash
    cp .env.example .env.local
    ```
    - Abre el nuevo archivo `.env.local` y añade tu clave de acceso de Web3Forms.

5.  **Ejecuta el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

6.  Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

## 🌐 Despliegue

Este proyecto está configurado para un despliegue continuo en [Vercel](https://vercel.com/). Cualquier `push` a la rama `main` iniciará un nuevo despliegue automáticamente. No olvides configurar las variables de entorno en el panel de tu proyecto en Vercel.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.