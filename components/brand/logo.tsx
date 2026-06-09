import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

export function Logo({
  href = '/dashboard',
  className,
  size = 'md',
}: {
  href?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-4xl',
  }

  return (
    <Link
      href={href}
      className={cn(
        'font-orbitron font-bold tracking-[0.25em] text-orange hover:brightness-110 transition-all',
        sizes[size],
        className
      )}
    >
      PM
    </Link>
  )
}
