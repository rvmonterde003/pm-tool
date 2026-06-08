import { cn } from '@/lib/utils/cn'

export const authInputClass = cn(
  'w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-text-primary',
  'placeholder:text-text-muted outline-none',
  'focus:border-orange focus:shadow-orange transition-all duration-150'
)

export const authButtonClass = cn(
  'w-full bg-orange text-black font-semibold text-sm py-3 rounded-lg',
  'hover:brightness-110 transition-all duration-150',
  'disabled:opacity-50 disabled:cursor-not-allowed'
)

export const authLinkClass = 'text-xs text-orange hover:brightness-110 transition-all'
