import logo from '../../assets/logo.png'

const steps = [
  {
    title: 'Request a code',
    desc: 'Send a 6-digit code to your account email.',
  },
  {
    title: 'Verify access',
    desc: 'Confirm the code to unlock your reset session.',
  },
  {
    title: 'Reset password',
    desc: 'Choose a fresh password to secure the account.',
  },
]

export default function PasswordResetSide({ step = 1 }) {
  return (
    <div className="flex h-full flex-col justify-between gap-10">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <img src={logo} className="h-10 w-10 rounded-xl object-cover" alt="Sportall logo" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Sportall</p>
            <p className="text-sm text-slate-600">Secure recovery workflow.</p>
          </div>
        </div>
        <div>
          <h2 className="auth-display text-4xl font-semibold text-slate-900 sm:text-5xl">
            Reset access with confidence.
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Short-lived codes, verified steps, and one-time reset tokens keep accounts protected.
          </p>
        </div>
        <div className="space-y-3">
          {steps.map((item, index) => {
            const active = index + 1 === step
            return (
              <div
                key={item.title}
                className={`rounded-2xl border p-4 shadow-sm backdrop-blur ${active ? 'border-orange-200/80 bg-orange-50/80' : 'border-white/70 bg-white/70'}`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <span className={`text-[11px] font-semibold ${active ? 'text-orange-600' : 'text-slate-400'}`}>
                    Step {index + 1}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
      <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/80 p-4 text-xs text-emerald-900 shadow-sm">
        <p className="font-semibold">Security guardrails</p>
        <p className="mt-1 text-xs text-emerald-700">
          Codes expire quickly, attempts are limited, and resets invalidate older sessions.
        </p>
      </div>
    </div>
  )
}
