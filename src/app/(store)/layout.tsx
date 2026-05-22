import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { CookieConsent } from '@/components/layout/CookieConsent'
import { PageTransition } from '@/components/ui/motion'
import { ToastContainer } from '@/components/ui/Toast'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <CartDrawer />
      <CookieConsent />
      <ToastContainer />
    </>
  )
}
