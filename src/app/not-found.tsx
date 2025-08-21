import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-screen bg-background -mt-24"> 
      <p className="text-base font-semibold text-primary font-display tracking-widest">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Página No Encontrada</h1>
      <p className="mt-6 text-base leading-7 text-foreground/70">Lo sentimos, no pudimos encontrar la página que estás buscando.</p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Link
          href="/"
          className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-background shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Volver al Inicio
        </Link>
        <Link href="/contacto" className="text-sm font-semibold text-foreground">
          Contactar Soporte <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  )
}