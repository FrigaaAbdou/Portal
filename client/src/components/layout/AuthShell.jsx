export default function AuthShell({
  title,
  subtitle,
  eyebrow = 'Sportall Access',
  side,
  children,
  footer,
}) {
  return (
    <main className="auth-shell min-h-[100dvh] bg-slate-50 text-slate-900">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 right-0 h-80 w-80 rounded-full bg-orange-200/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-[-80px] h-96 w-96 rounded-full bg-amber-100/70 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_15%_10%,rgba(255,190,120,0.25),transparent_55%)]" />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr,1fr]">
          <aside className="auth-fade">
            {side}
          </aside>

          <section className="auth-fade auth-fade-delay-1">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-orange-100/70 backdrop-blur sm:p-8">
              {title && (
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">{eyebrow}</p>
                  <h1 className="auth-display mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
                    {title}
                  </h1>
                  {subtitle && <p className="mt-2 text-sm text-slate-600">{subtitle}</p>}
                </div>
              )}
              {children}
            </div>

            {footer && (
              <div className="mt-4 text-xs text-slate-500">
                {footer}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
