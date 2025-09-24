import { useEffect, useMemo, useState } from 'react'

const JUCO_STEPS = [
  { key: 'role', title: 'Role', desc: 'Choose your coach type' },
  { key: 'account', title: 'Account', desc: 'Create your account' },
  { key: 'professional', title: 'Professional', desc: 'Program & contact' },
  { key: 'verification', title: 'Verification', desc: 'Optional certification' },
  { key: 'review', title: 'Review', desc: 'Confirm & submit' },
]

const NCAA_STEPS = [
  { key: 'role', title: 'Role', desc: 'Choose your coach type' },
  { key: 'account', title: 'Account', desc: 'Create your account' },
  { key: 'program', title: 'Program', desc: 'University & division' },
  { key: 'preferences', title: 'Preferences', desc: 'Recruitment goals' },
  { key: 'review', title: 'Review', desc: 'Confirm & submit' },
]

const initialData = {
  coachType: '', // 'JUCO' | 'NCAA'
  // account
  email: '', password: '', confirmPassword: '', firstName: '', lastName: '',
  // professional JUCO
  jucoRole: '', jucoProgram: '', jucoLeague: '', jucoCity: '', jucoState: '', jucoPhone: '', jucoEmail: '', jucoExperience: '',
  // verification JUCO
  hasCertification: '', verifyNote: '', acceptAccuracy: false, acceptLegal: false,
  // program NCAA
  uniProgram: '', division: '', conference: '', position: '', uniAddress: '', uniPhone: '',
  // preferences NCAA
  priorityPositions: '', minGpa: '', otherCriteria: '',
}

function usePersistedForm(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : defaultValue } catch { return defaultValue }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)) } catch {} }, [key, value])
  return [value, setValue]
}

function Stepper({ current, steps }) {
  const pct = Math.round(((current + 1) / steps.length) * 100)
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700">Step {current + 1} of {steps.length}</div>
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

export default function SignupCoach() {
  const [step, setStep] = useState(0)
  const [data, setData] = usePersistedForm('signup_coach_v1', initialData)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const steps = useMemo(() => (data.coachType === 'JUCO' ? JUCO_STEPS : data.coachType === 'NCAA' ? NCAA_STEPS : JUCO_STEPS), [data.coachType])
  const update = (patch) => setData((d) => ({ ...d, ...patch }))

  const validators = useMemo(() => ({
    role: () => data.coachType === 'JUCO' || data.coachType === 'NCAA',
    account: () => {
      const { email, password, confirmPassword, firstName, lastName } = data
      return email.includes('@') && password.length >= 6 && confirmPassword === password && firstName.trim() && lastName.trim()
    },
    professional: () => {
      if (data.coachType !== 'JUCO') return true
      const { jucoRole, jucoProgram, jucoLeague, jucoCity, jucoState } = data
      return !!jucoRole && !!jucoProgram && !!jucoLeague && !!jucoCity && !!jucoState
    },
    verification: () => {
      if (data.coachType !== 'JUCO') return true
      return !!data.acceptAccuracy // certification upload optional
    },
    program: () => {
      if (data.coachType !== 'NCAA') return true
      const { uniProgram, division, conference, position } = data
      return !!uniProgram && !!division && !!conference && !!position
    },
    preferences: () => {
      if (data.coachType !== 'NCAA') return true
      return true // optional but allow next; make at least one field present if you prefer
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
    // Minimal submit gating
    if (!validators.account()) return
    if (data.coachType === 'JUCO' && (!validators.professional() || !validators.verification())) return
    if (data.coachType === 'NCAA' && !validators.program()) return
    setSubmitted(true)
  }

  const errorText = () => touched[steps[step].key] && !validators[steps[step].key]() ? (
    <p className="mt-2 text-xs text-rose-600">Please complete required fields to continue.</p>
  ) : null

  return (
    <main className="min-h-[100dvh] bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Coach Sign Up</h1>
          <p className="mt-1 text-sm text-gray-600">Create your account and configure your program preferences.</p>
        </div>

        <Stepper current={step} steps={steps} />

        <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 pb-24 shadow-sm ring-1 ring-gray-200 sm:pb-6">
          {steps[step].key === 'role' && (
            <Section title="Select your coach type">
              <div className="sm:col-span-2 grid grid-cols-2 gap-3">
                <button type="button" onClick={() => update({ coachType: 'JUCO' })}
                  className={`rounded-lg border px-4 py-3 text-sm font-medium ${data.coachType==='JUCO' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-300 hover:bg-gray-50'}`}>JUCO Coach</button>
                <button type="button" onClick={() => update({ coachType: 'NCAA' })}
                  className={`rounded-lg border px-4 py-3 text-sm font-medium ${data.coachType==='NCAA' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-300 hover:bg-gray-50'}`}>NCAA / NAIA</button>
              </div>
              <div className="sm:col-span-2">{errorText()}</div>
            </Section>
          )}

          {steps[step].key === 'account' && (
            <Section title="Account creation" desc="Use your professional email.">
              <Field label="Email" required>
                <input type="email" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.email} onChange={(e)=>update({email:e.target.value})} required />
              </Field>
              <Field label="Password (min 6)" required>
                <input type="password" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.password} onChange={(e)=>update({password:e.target.value})} required />
              </Field>
              <Field label="Confirm password" required>
                <input type="password" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.confirmPassword} onChange={(e)=>update({confirmPassword:e.target.value})} required />
              </Field>
              <Field label="First name" required>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.firstName} onChange={(e)=>update({firstName:e.target.value})} required />
              </Field>
              <Field label="Last name" required>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.lastName} onChange={(e)=>update({lastName:e.target.value})} required />
              </Field>
              <div className="sm:col-span-2">{errorText()}</div>
            </Section>
          )}

          {data.coachType === 'JUCO' && steps[step].key === 'professional' && (
            <Section title="Professional information" desc="Tell us about your program.">
              <Field label="Role" required>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.jucoRole} onChange={(e)=>update({jucoRole:e.target.value})}>
                  <option value="">Select...</option>
                  <option>Head Coach</option>
                  <option>Assistant Coach</option>
                </select>
              </Field>
              <Field label="Program name" required>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={data.jucoProgram} onChange={(e)=>update({jucoProgram:e.target.value})} />
              </Field>
              <Field label="League/Association" required>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={data.jucoLeague} onChange={(e)=>update({jucoLeague:e.target.value})}>
                  <option value="">Select...</option>
                  <option>NJCAA</option>
                  <option>CCCAA</option>
                  <option>NWAC</option>
                </select>
              </Field>
              <Field label="City" required>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={data.jucoCity} onChange={(e)=>update({jucoCity:e.target.value})} />
              </Field>
              <Field label="State" required>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={data.jucoState} onChange={(e)=>update({jucoState:e.target.value})} />
              </Field>
              <Field label="Phone">
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={data.jucoPhone} onChange={(e)=>update({jucoPhone:e.target.value})} />
              </Field>
              <Field label="Professional email">
                <input type="email" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={data.jucoEmail} onChange={(e)=>update({jucoEmail:e.target.value})} />
              </Field>
              <Field label="Years of experience / contract duration (optional)">
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={data.jucoExperience} onChange={(e)=>update({jucoExperience:e.target.value})} />
              </Field>
              <div className="sm:col-span-2">{errorText()}</div>
            </Section>
          )}

          {data.coachType === 'JUCO' && steps[step].key === 'verification' && (
            <Section title="Certification and verification" desc="Optional certification; confirm your data is accurate.">
              <Field label="Do you hold an official certification?">
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={data.hasCertification} onChange={(e)=>update({hasCertification:e.target.value})}>
                  <option value="">Select...</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </Field>
              <Field label="Notes / verification (optional)">
                <textarea rows={3} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={data.verifyNote} onChange={(e)=>update({verifyNote:e.target.value})} />
              </Field>
              <div className="sm:col-span-2">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600" checked={data.acceptAccuracy} onChange={(e)=>update({acceptAccuracy:e.target.checked})} />
                  I confirm the provided information is accurate
                </label>
              </div>
              <div className="sm:col-span-2">{errorText()}</div>
            </Section>
          )}

          {data.coachType === 'NCAA' && steps[step].key === 'program' && (
            <Section title="Program information" desc="University and program details.">
              <Field label="University / Program" required>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={data.uniProgram} onChange={(e)=>update({uniProgram:e.target.value})} />
              </Field>
              <Field label="Division" required>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={data.division} onChange={(e)=>update({division:e.target.value})}>
                  <option value="">Select...</option>
                  <option>NCAA D1</option>
                  <option>NCAA D2</option>
                  <option>NCAA D3</option>
                  <option>NAIA</option>
                </select>
              </Field>
              <Field label="Conference / League" required>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={data.conference} onChange={(e)=>update({conference:e.target.value})} />
              </Field>
              <Field label="Position" required>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={data.position} onChange={(e)=>update({position:e.target.value})}>
                  <option value="">Select...</option>
                  <option>Head Coach</option>
                  <option>Assistant Coach</option>
                  <option>Recruiter</option>
                </select>
              </Field>
              <Field label="Address">
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={data.uniAddress} onChange={(e)=>update({uniAddress:e.target.value})} />
              </Field>
              <Field label="Phone">
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={data.uniPhone} onChange={(e)=>update({uniPhone:e.target.value})} />
              </Field>
              <div className="sm:col-span-2">{errorText()}</div>
            </Section>
          )}

          {data.coachType === 'NCAA' && steps[step].key === 'preferences' && (
            <Section title="Recruitment preferences" desc="What profiles are you prioritising?">
              <Field label="Priority positions / profiles">
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={data.priorityPositions} onChange={(e)=>update({priorityPositions:e.target.value})} placeholder="e.g., forwards, defensive midfielders" />
              </Field>
              <Field label="Minimum GPA">
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={data.minGpa} onChange={(e)=>update({minGpa:e.target.value})} />
              </Field>
              <Field label="Other criteria (budget, height, etc.)">
                <textarea rows={3} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={data.otherCriteria} onChange={(e)=>update({otherCriteria:e.target.value})} />
              </Field>
            </Section>
          )}

          {steps[step].key === 'review' && (
            <div>
              <h2 className="text-base font-semibold text-gray-900">Review and confirm</h2>
              <p className="mt-1 text-sm text-gray-600">Double-check your information before submitting.</p>
              <div className="mt-4 grid gap-3 text-sm text-gray-800 sm:grid-cols-2">
                {Object.entries(data).map(([k,v]) => (
                  <div key={k} className="rounded-md border border-gray-200 px-3 py-2"><span className="font-medium capitalize">{k.replace(/([A-Z])/g,' $1')}:</span> <span className="text-gray-700">{String(v)}</span></div>
                ))}
              </div>
              <div className="mt-4">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600" checked={data.acceptLegal} onChange={(e)=>update({acceptLegal:e.target.checked})} />
                  I accept the Terms of Service and Privacy Policy
                </label>
              </div>
              {submitted && <p className="mt-3 text-sm text-green-700">Submitted! Replace with your API request.</p>}
            </div>
          )}

          {/* Desktop / tablet nav */}
          <div className="mt-6 hidden items-center justify-between sm:flex">
            <button type="button" onClick={back} disabled={step===0} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 disabled:opacity-40">Back</button>
            {step < steps.length - 1 ? (
              <button type="button" onClick={next} disabled={!canNext} className="rounded-md bg-orange-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">Next</button>
            ) : (
              <button type="submit" className="rounded-md bg-orange-500 px-5 py-2 text-sm font-semibold text-white" disabled={!data.acceptLegal}>Submit</button>
            )}
          </div>
        </form>
      </div>

      {/* Mobile sticky nav */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 p-3 backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-3xl gap-3 px-4">
          <button type="button" onClick={back} disabled={step===0} className="w-1/2 rounded-md border border-gray-300 px-4 py-3 text-sm font-medium text-gray-900 disabled:opacity-40">Back</button>
          {step < steps.length - 1 ? (
            <button type="button" onClick={next} disabled={!canNext} className="w-1/2 rounded-md bg-orange-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">Next</button>
          ) : (
            <button type="submit" onClick={onSubmit} className="w-1/2 rounded-md bg-orange-500 px-4 py-3 text-sm font-semibold text-white" disabled={!data.acceptLegal}>Submit</button>
          )}
        </div>
      </div>
    </main>
  )
}

