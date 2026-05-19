import { Navbar } from '@/components/Navbar'

export function MisReservasPages() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="page-shell flex flex-1 flex-col bg-white py-8">
        <h1 className="font-alverata text-2xl font-semibold text-uach-purple-900">
          Mis reservas
        </h1>
        <p className="font-praxis mt-2 text-uach-purple-900/70">
          Contenido en desarrollo.
        </p>
      </main>
    </div>
  )
}
