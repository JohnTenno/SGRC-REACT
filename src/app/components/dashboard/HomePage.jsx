import { CardHomeGrid } from '@/app/components/layout/CardHome'
import { HeroHeader } from '@/app/components/layout/HeroHeader'
import { Navbar } from '@/app/components/layout/Navbar'

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
