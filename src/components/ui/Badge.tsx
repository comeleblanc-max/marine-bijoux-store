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
          'bg-[#A7D5E6] text-white': variant === 'new',
          'bg-[#E89B6F] text-white': variant === 'promo',
          'bg-gray-400 text-white': variant === 'soldout',
          'bg-[#C9A45F] text-white': variant === 'featured',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
