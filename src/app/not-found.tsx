import Link from 'next/link'

// Página 404 personalizada
// Este componente se muestra cuando Next no encuentra una ruta solicitada.
// No modifica el router: simplemente ofrece opciones para volver al inicio
// o contactar soporte. Los comentarios añadidos explican la estructura.
export default function NotFound() {
  return (
    // Contenedor centralizado que ocupa toda la pantalla
    <div className="flex flex-col items-center justify-center text-center h-screen bg-background -mt-24"> 
      {/* Código de estado grande */}
      <p className="text-base font-semibold text-primary font-display tracking-widest">404</p>
      {/* Título principal explicando que la página no fue encontrada */}
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Página No Encontrada</h1>
      {/* Mensaje explicativo breve */}
      <p className="mt-6 text-base leading-7 text-foreground/70">Lo sentimos, no pudimos encontrar la página que estás buscando.</p>

      {/* Acciones recomendadas: volver al inicio o contactar soporte */}
      <div className="mt-10 flex items-center justify-center gap-x-6">
        {/* Botón primario para regresar al home */}
        <Link
          href="/"
          className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-background shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Volver al Inicio
        </Link>

        {/* Enlace secundario para contactar al soporte o al equipo */}
        <Link href="/contacto" className="text-sm font-semibold text-foreground">
          Contactar Soporte <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  )
}