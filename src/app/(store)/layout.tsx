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

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-section="store" className="flex flex-col flex-1">
      <ScrollToTop />
      <CustomCursor />
      <FloatingParticles count={12} />
      <AnnouncementBar />
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
