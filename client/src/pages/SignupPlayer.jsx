import { useEffect, useMemo, useState } from 'react'

const steps = [
  { key: 'account', title: 'Account', desc: 'Create your account' },
  { key: 'personal', title: 'Personal', desc: 'Basic player details' },
  { key: 'background', title: 'Background', desc: 'School & stats' },
  { key: 'preferences', title: 'Preferences', desc: 'Recruitment goals' },
  { key: 'review', title: 'Review', desc: 'Confirm & submit' },
]

const initialData = {
  // account
  email: '', password: '', confirmPassword: '', acceptTerms: false,
  // personal
  fullName: '', dob: '', city: '', state: '', country: '', height: '', weight: '',
  // background
  school: '', gpa: '', positions: '', keyStats: '',
  // preferences
  division: '', budget: '', preferredLocation: '',
}

function usePersistedForm(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : defaultValue } catch { return defaultValue }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)) } catch {} }, [key, value])
  return [value, setValue]
}

function Stepper({ current }) {
  const pct = Math.round(((current + 1) / steps.length) * 100)
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700">
          Step {current + 1} of {steps.length}
        </div>
        <div className="text-sm text-gray-500">{pct}%</div>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div className="h-2 rounded-full bg-orange-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-3 grid grid-cols-5 gap-2 text-center text-xs text-gray-600">
        {steps.map((s, i) => (
          <div key={s.key} className={`truncate ${i === current ? 'font-semibold text-gray-900' : ''}`}>{s.title}</div>
        ))}
      </div>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}{required && ' *'}</span>
      {children}
    </label>
  )
}

function Section({ title, desc, children }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      {desc && <p className="mt-1 text-sm text-gray-600">{desc}</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  )
}

export default function SignupPlayer() {
  const [step, setStep] = useState(0)
  const [data, setData] = usePersistedForm('signup_player_v1', initialData)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const update = (patch) => setData((d) => ({ ...d, ...patch }))

  const validators = useMemo(() => ({
    account: () => {
      const { email, password, confirmPassword, acceptTerms } = data
      const ok = email.includes('@') && password.length >= 6 && confirmPassword === password && acceptTerms
      return ok
    },
    personal: () => {
      const { fullName, dob, country } = data
      return fullName.trim().length >= 2 && !!dob && !!country
    },
    background: () => {
      const { school } = data
      return !!school
    },
    preferences: () => {
      const { division } = data
      return !!division
    },
    review: () => true,
  }), [data])

  const canNext = validators[steps[step].key]()

  const next = () => {
    setTouched((t) => ({ ...t, [steps[step].key]: true }))
    if (!canNext) return
    setStep((s) => Math.min(s + 1, steps.length - 1))
  }
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const onSubmit = (e) => {
    e.preventDefault()
    setTouched((t) => ({ ...t, [steps[step].key]: true }))
    if (!validators.preferences() || !validators.background() || !validators.personal() || !validators.account()) return
    setSubmitted(true)
    // TODO: integrate API call
  }

  const errorText = (key) => touched[steps[step].key] && !validators[steps[step].key]() ? (
    <p className="mt-2 text-xs text-rose-600">Please complete required fields to continue.</p>
  ) : null

  return (
    <main className="min-h-[100dvh] bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Player Sign Up</h1>
          <p className="mt-1 text-sm text-gray-600">Create your account and share your profile with recruiters.</p>
        </div>

        <Stepper current={step} />

        <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 pb-24 shadow-sm ring-1 ring-gray-200 sm:pb-6">
          {step === 0 && (
            <Section title="Account creation" desc="Use a valid email and a strong password.">
              <Field label="Email" required>
                <input type="email" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.email} onChange={(e)=>update({email:e.target.value})} required />
              </Field>
              <Field label="Password (min 6)" required>
                <input type="password" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.password} onChange={(e)=>update({password:e.target.value})} required />
              </Field>
              <Field label="Confirm password" required>
                <input type="password" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.confirmPassword} onChange={(e)=>update({confirmPassword:e.target.value})} required />
              </Field>
              <div className="sm:col-span-2">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600" checked={data.acceptTerms} onChange={(e)=>update({acceptTerms:e.target.checked})} />
                  I agree to the Terms and Privacy Policy
                </label>
              </div>
              <div className="sm:col-span-2">{errorText('account')}</div>
            </Section>
          )}

          {step === 1 && (
            <Section title="Personal details" desc="Tell us about you.">
              <Field label="Full name" required>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.fullName} onChange={(e)=>update({fullName:e.target.value})} required />
              </Field>
              <Field label="Date of birth" required>
                <input type="date" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.dob} onChange={(e)=>update({dob:e.target.value})} required />
              </Field>
              <Field label="City">
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.city} onChange={(e)=>update({city:e.target.value})} />
              </Field>
              <Field label="State">
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.state} onChange={(e)=>update({state:e.target.value})} />
              </Field>
              <Field label="Country" required>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.country} onChange={(e)=>update({country:e.target.value})} required />
              </Field>
              <Field label="Height (cm)">
                <input type="number" min="0" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.height} onChange={(e)=>update({height:e.target.value})} />
              </Field>
              <Field label="Weight (kg)">
                <input type="number" min="0" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.weight} onChange={(e)=>update({weight:e.target.value})} />
              </Field>
              <div className="sm:col-span-2">{errorText('personal')}</div>
            </Section>
          )}

          {step === 2 && (
            <Section title="Academic and sports background" desc="Your team, school, and key stats.">
              <Field label="Current school or team" required>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.school} onChange={(e)=>update({school:e.target.value})} required />
              </Field>
              <Field label="GPA / average grade">
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.gpa} onChange={(e)=>update({gpa:e.target.value})} />
              </Field>
              <Field label="Positions played">
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.positions} onChange={(e)=>update({positions:e.target.value})} placeholder="e.g., QB, WR" />
              </Field>
              <Field label="Key statistics">
                <textarea rows={3} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.keyStats} onChange={(e)=>update({keyStats:e.target.value})} placeholder="e.g., 40-yard dash, tackles, yards, etc." />
              </Field>
              <div className="sm:col-span-2">{errorText('background')}</div>
            </Section>
          )}

          {step === 3 && (
            <Section title="Recruitment preferences" desc="Where do you want to play?">
              <Field label="Desired division/league" required>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.division} onChange={(e)=>update({division:e.target.value})} required>
                  <option value="">Select...</option>
                  <option>NCAA D1</option>
                  <option>NCAA D2</option>
                  <option>NCAA D3</option>
                  <option>NAIA</option>
                  <option>NJCAA</option>
                </select>
              </Field>
              <Field label="Budget (USD)">
                <input type="number" min="0" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.budget} onChange={(e)=>update({budget:e.target.value})} />
              </Field>
              <Field label="Preferred location">
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.preferredLocation} onChange={(e)=>update({preferredLocation:e.target.value})} placeholder="city / state / region" />
              </Field>
              <div className="sm:col-span-2">{errorText('preferences')}</div>
            </Section>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-base font-semibold text-gray-900">Review and confirm</h2>
              <p className="mt-1 text-sm text-gray-600">Double-check your information before submitting.</p>
              <div className="mt-4 grid gap-3 text-sm text-gray-800 sm:grid-cols-2">
                {Object.entries(data).map(([k,v]) => (
                  <div key={k} className="rounded-md border border-gray-200 px-3 py-2"><span className="font-medium capitalize">{k.replace(/([A-Z])/g,' $1')}:</span> <span className="text-gray-700">{String(v)}</span></div>
                ))}
              </div>
              {submitted && <p className="mt-3 text-sm text-green-700">Submitted! Replace with your API request.</p>}
            </div>
          )}

          {/* Desktop/Tablet Nav */}
          <div className="mt-6 hidden items-center justify-between sm:flex">
            <button type="button" onClick={back} disabled={step===0} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 disabled:opacity-40">Back</button>
            {step < steps.length - 1 ? (
              <button type="button" onClick={next} disabled={!canNext} className="rounded-md bg-orange-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">Next</button>
            ) : (
              <button type="submit" className="rounded-md bg-orange-500 px-5 py-2 text-sm font-semibold text-white">Submit</button>
            )}
          </div>
        </form>
      </div>

      {/* Mobile sticky nav */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 p-3 backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-3xl gap-3 px-4">
          <button
            type="button"
            onClick={back}
            disabled={step===0}
            className="w-1/2 rounded-md border border-gray-300 px-4 py-3 text-sm font-medium text-gray-900 disabled:opacity-40"
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={next}
              disabled={!canNext}
              className="w-1/2 rounded-md bg-orange-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              form=""
              onClick={onSubmit}
              className="w-1/2 rounded-md bg-orange-500 px-4 py-3 text-sm font-semibold text-white"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
