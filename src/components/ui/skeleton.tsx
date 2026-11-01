import { L } from '@/localization/elements';
import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <L.div
      data-slot='skeleton'
      className={cn('animate-pulse motion-reduce:animate-none rounded-md bg-accent', className)}
      {...props}
    />
  )
}

export { Skeleton }
