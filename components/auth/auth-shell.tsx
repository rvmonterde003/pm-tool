import { Logo } from '@/components/brand/logo'

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-page flex items-center justify-center">
      <div className="w-full max-w-sm space-y-8 px-6">
        <div className="text-center">
          <Logo href="/" size="lg" className="inline-block" />
          <p className="mt-2 text-sm text-text-muted">{subtitle}</p>
        </div>
        <div className="space-y-6">
          <h2 className="text-center text-lg font-semibold text-text-primary">{title}</h2>
          {children}
        </div>
      </div>
    </main>
  )
}
