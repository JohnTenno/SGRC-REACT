import { CardHomeGrid } from '@/components/cards/CardHome'
import { HeroHeader } from '@/components/layout/HeroHeader'
import { Navbar } from '@/components/layout/Navbar'

export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col gap-8 bg-white">
        <HeroHeader showQuickMenu />

        <div className="page-shell pb-8">
          <CardHomeGrid />
        </div>
      </main>
    </div>
  )
}
