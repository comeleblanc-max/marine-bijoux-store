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
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { isLaunched, PREVIEW_COOKIE, LAUNCH_DATE } from '@/lib/launch'
import { ComingSoon } from '@/components/ComingSoon'

export const dynamic = 'force-dynamic'

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  /* Verrou "Bientôt disponible" — actif tant que le lancement n'a pas eu lieu
     et qu'aucun code d'accès anticipé n'a été validé. L'admin et les API
     (paiements, webhooks…) ne sont PAS concernés, ils continuent de tourner. */
  if (!isLaunched()) {
    const unlocked = (await cookies()).get(PREVIEW_COOKIE)?.value === '1'
    if (!unlocked) {
      const products = await db.product.findMany({
        where:   { inStock: true },
        select:  { name: true, images: true },
        orderBy: { createdAt: 'desc' },
        take:    16,
      })
      const tiles = products
        .filter((p) => p.images?.[0])
        .map((p) => ({ name: p.name, image: p.images[0] }))
      return <ComingSoon targetIso={LAUNCH_DATE} tiles={tiles} />
    }
  }

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
