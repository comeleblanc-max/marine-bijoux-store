import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'new' | 'promo' | 'soldout' | 'featured'
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'new', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide',
        {
          'bg-[#4DB8D4] text-white': variant === 'new',
          'bg-[#F08080] text-white': variant === 'promo',
          'bg-gray-400 text-white': variant === 'soldout',
          'bg-[#C9A84C] text-white': variant === 'featured',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
