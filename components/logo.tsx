import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({
  className,
  showText = true,
}: {
  className?: string
  showText?: boolean
}) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Heart className="size-4 fill-current" />
      </span>
      {showText && (
        <span className="font-heading text-lg font-semibold tracking-tight">
          Virtual Date
        </span>
      )}
    </span>
  )
}
