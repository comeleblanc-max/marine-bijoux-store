/* Badges des moyens de paiement acceptés — SVG légers, sans dépendance externe. */

function Card({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="w-11 h-7 bg-white rounded-md flex items-center justify-center shadow-sm"
    >
      {children}
    </div>
  )
}

export function PaymentBadges() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Visa */}
      <Card label="Visa">
        <span className="text-[#1A1F71] font-bold italic text-xs tracking-tight">
          VISA
        </span>
      </Card>

      {/* Mastercard */}
      <Card label="Mastercard">
        <svg width="28" height="18" viewBox="0 0 28 18" aria-hidden="true">
          <circle cx="11" cy="9" r="7" fill="#EB001B" />
          <circle cx="17" cy="9" r="7" fill="#F79E1B" fillOpacity="0.9" />
        </svg>
      </Card>

      {/* American Express */}
      <Card label="American Express">
        <span className="text-[#2E77BC] font-bold text-[8px] leading-none text-center">
          AMERICAN
          <br />
          EXPRESS
        </span>
      </Card>

      {/* Carte Bleue */}
      <Card label="Carte Bleue">
        <span className="text-[#1A1A1A] font-bold text-xs tracking-tight">CB</span>
      </Card>

      {/* Klarna */}
      <Card label="Klarna">
        <span className="text-[#0B051D] font-semibold text-[10px]">
          Klarna<span className="text-[#FFB3C7]">.</span>
        </span>
      </Card>

      {/* PayPal */}
      <Card label="PayPal">
        <span className="text-[#003087] font-bold italic text-[9px]">
          Pay<span className="text-[#009CDE]">Pal</span>
        </span>
      </Card>
    </div>
  )
}
