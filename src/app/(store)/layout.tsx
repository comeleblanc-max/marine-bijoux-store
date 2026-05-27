import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { CookieConsent } from '@/components/layout/CookieConsent'
import { PageTransition } from '@/components/ui/motion'
import { ToastContainer } from '@/components/ui/Toast'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { FloatingParticles } from '@/components/ui/FloatingParticles'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import { getSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <div data-section="store" className="flex flex-col flex-1">
      <ScrollToTop />
      <CustomCursor />
      <FloatingParticles count={12} />
      <AnnouncementBar
        enabled={settings.announcement.enabled}
        messages={settings.announcement.messages}
      />
      <Header />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <CartDrawer />
      <CookieConsent />
      <ToastContainer />
    </div>
  )
}
