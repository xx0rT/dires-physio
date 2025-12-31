import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/navbar'
import { FooterSection } from '@/components/layout/sections/footer'

export default function MarketingLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <FooterSection />
    </div>
  )
}
