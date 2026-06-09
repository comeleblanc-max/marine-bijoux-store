import { Truck, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react'

const ITEMS = [
  { icon: Truck,       label: 'Livraison offerte', sub: 'dès 60 €' },
  { icon: ShieldCheck, label: 'Paiement sécurisé', sub: '100% protégé' },
  { icon: RefreshCw,   label: 'Retours gratuits',  sub: 'sous 14 jours' },
  { icon: Sparkles,    label: 'Acier inoxydable',  sub: 'hypoallergénique' },
]

export function ReassuranceBar() {
  return (
    <section className="border-y border-[#E8E2D5] bg-[#FAF5EA]">
      <div className="container-x py-8 sm:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4">
          {ITEMS.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center text-center gap-2">
              <Icon className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.3} />
              <p className="text-[11px] tracking-[0.2em] uppercase font-medium text-[#0E4F5E]">
                {label}
              </p>
              <p className="text-[10px] text-[#6B6B6B]">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
