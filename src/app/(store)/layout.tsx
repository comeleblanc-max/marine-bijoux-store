import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { CookieConsent } from '@/components/layout/CookieConsent'
import { PageTransition } from '@/components/ui/motion'
import { ToastContainer } from '@/components/ui/Toast'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { FloatingParticles } from '@/components/ui/FloatingParticles'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import { getSettings } from '@/lib/settings'

/* Le verrou "Bientôt disponible" est désormais géré par la middleware (Edge),
   ce qui permet à toutes les pages de la boutique de profiter du cache ISR.
   Les paramètres du site (bandeau, etc.) sont revalidés toutes les minutes. */
export const revalidate = 60

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <div
      data-section="store"
      className="flex flex-col flex-1 pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0"
    >
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
      <MobileBottomNav />
    </div>
  )
}
