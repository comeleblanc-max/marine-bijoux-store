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
          'bg-[#FF7A45] text-white': variant === 'promo',
          'bg-gray-400 text-white': variant === 'soldout',
          'bg-[#D4AF37] text-white': variant === 'featured',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
