const toneMap = {
  error: 'border-rose-200 bg-rose-50 text-rose-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  info: 'border-slate-200 bg-slate-50 text-slate-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

export default function InlineBanner({ variant = 'error', message, children, className = '' }) {
  const content = message || children
  if (!content) return null
  const tone = toneMap[variant] || toneMap.error
  return (
    <div className={`rounded-2xl border px-4 py-3 text-xs ${tone} ${className}`}>
      {content}
    </div>
  )
}
