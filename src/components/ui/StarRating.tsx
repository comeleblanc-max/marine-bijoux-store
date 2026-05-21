import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  count?: number
  size?: 'sm' | 'md'
  className?: string
}

export function StarRating({ rating, count, size = 'sm', className }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'fill-current',
            i < rating ? 'text-[#C9A84C]' : 'text-gray-200',
            size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5'
          )}
        />
      ))}
      {count !== undefined && (
        <span className="text-xs text-gray-500 ml-1">({count})</span>
      )}
    </div>
  )
}
