import { L } from '@/localization/elements';
import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <L.div
      data-slot='skeleton'
      className={cn('hotel-skeleton-block rounded-md', className)}
      {...props}
    />
  )
}

export { Skeleton }
