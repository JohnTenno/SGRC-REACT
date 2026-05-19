import { CardHomeGrid } from '@/components/CardHome'
import { HeroHeader } from '@/components/HeroHeader'
import { Navbar } from '@/components/Navbar'

export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col gap-8 bg-white">
        <HeroHeader />

        <div className="page-shell pb-8">
          <CardHomeGrid />
        </div>
      </main>
    </div>
  )
}
