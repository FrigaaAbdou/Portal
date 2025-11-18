import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register as apiRegister, login as apiLogin, setToken, setRole, clearToken, saveCoachProfile } from '../lib/api'
import PasswordField from '../components/PasswordField'
import PhoneInput from '../components/ui/PhoneInput'
const JUCO_LEAGUES = ['NJCAA', 'CCCAA', 'NWAC', 'Other']
const DIVISION_OPTIONS = ['NCAA D1', 'NCAA D2', 'NCAA D3', 'NAIA', 'NJCAA']
const BUDGET_OPTIONS = ['<$5k', '$5k-$10k', '$10k-$20k', '$20k-$40k', '>$40k']

const initialData = {
  coachType: '',
  email: '', password: '', confirmPassword: '', acceptTerms: false,
  firstName: '', lastName: '', phone: '', roleTitle: '',
  programName: '', league: '', division: '', conference: '', city: '', state: '', website: '',
  recruitingBudgetRange: '',
}

const getSteps = (type) => {
  const programTitle = type === 'JUCO' ? 'JUCO Program' : 'Program & Division'
  const programDesc = type === 'JUCO'
    ? 'Tell us about your junior college program so NCAA coaches can discover you.'
    : 'Share your university or NAIA program details for better matching.'
  return [
    { key: 'role', title: 'Coach Type', desc: 'Select the type of program you represent.' },
    { key: 'account', title: 'Account & Identity', desc: 'Create your account and tell us who you are.' },
    { key: 'program', title: programTitle, desc: programDesc },
    { key: 'review', title: 'Review & Submit', desc: 'Confirm your information before finishing.' },
  ]
}

function usePersistedForm(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : defaultValue
    } catch {
      return defaultValue
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore persistence errors
    }
  }, [key, value])
  return [value, setValue]
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

function CoachTypeCard({ title, subtitle, bullets, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-xl border px-4 py-5 text-left transition hover:border-orange-400 hover:shadow-sm ${active ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-gray-200 bg-white'}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
        {active && <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white">Selected</span>}
      </div>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
        {bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </button>
  )
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
      <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs text-gray-600">
        {steps.map((s, i) => (
          <div key={s.key} className={`truncate ${i === current ? 'font-semibold text-gray-900' : ''}`}>{s.title}</div>
        ))}
      </div>
    </div>
  )
}

export default function SignupCoach() {
  const [step, setStep] = useState(0)
  const [data, setData] = usePersistedForm('signup_coach_v2', initialData)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  const steps = useMemo(() => getSteps(data.coachType || 'JUCO'), [data.coachType])
  const update = (patch) => setData((d) => ({ ...d, ...patch }))

  const handleSelectType = (type) => {
    update({
      coachType: type,
      roleTitle: '',
      league: '',
      division: '',
      conference: '',
      programName: '',
      city: '',
      state: '',
      recruitingBudgetRange: '',
    })
    setTouched({})
    setStep(1)
  }

  const validators = useMemo(() => ({
    role: () => data.coachType === 'JUCO' || data.coachType === 'NCAA',
    account: () => {
      const { email, password, confirmPassword, firstName, lastName, phone, roleTitle, acceptTerms } = data
      return email.includes('@') && password.length >= 6 && confirmPassword === password && firstName.trim() && lastName.trim() && phone.trim() && roleTitle && acceptTerms
    },
    program: () => {
      if (data.coachType === 'JUCO') {
        const { programName, league, city, state } = data
        return !!programName && !!league && !!city && !!state
      }
      if (data.coachType === 'NCAA') {
        const { programName, division, conference, city, state } = data
        return !!programName && !!division && !!conference && !!city && !!state
      }
      return false
    },
    review: () => true,
  }), [data])

  const stepKey = steps[step]?.key
  const canNext = stepKey ? validators[stepKey]?.() : false

  const markTouched = () => {
    if (stepKey) setTouched((prev) => ({ ...prev, [stepKey]: true }))
  }

  const next = () => {
    markTouched()
    if (!canNext) return
    setStep((s) => Math.min(s + 1, steps.length - 1))
  }
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    markTouched()
    if (!validators.account() || !validators.program()) return

    setSubmitting(true)
    setSubmitError('')
    try {
      try {
        const reg = await apiRegister(data.email, data.password, 'coach')
        setToken(reg.token)
        setRole(reg?.user?.role || 'coach')
      } catch (err) {
        if (String(err.message || '').toLowerCase().includes('already')) {
          const lg = await apiLogin(data.email, data.password)
          setToken(lg.token)
          setRole(lg?.user?.role || 'coach')
        } else {
          throw err
        }
      }

      const payload = {
        coachType: data.coachType,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        roleTitle: data.roleTitle,
        website: data.website,
        programName: data.programName,
        programCity: data.city,
        programState: data.state,
      }

      if (data.coachType === 'JUCO') {
        payload.jucoRole = data.roleTitle
        payload.jucoProgram = data.programName
        payload.jucoLeague = data.league
        payload.jucoCity = data.city
        payload.jucoState = data.state
        payload.jucoPhone = data.phone
      } else {
        payload.position = data.roleTitle
        payload.uniProgram = data.programName
        payload.division = data.division
        payload.conference = data.conference
        payload.uniAddress = [data.city, data.state].filter(Boolean).join(', ')
        payload.uniPhone = data.phone
        payload.recruitingBudgetRange = data.recruitingBudgetRange
      }

      const profile = await saveCoachProfile(payload)
      if (profile) {
        setSubmitted(true)
        clearToken()
        navigate('/login')
      }
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-[100dvh] bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Coach Sign Up</h1>
          <p className="mt-1 text-sm text-gray-600">Create your account and configure your program details.</p>
        </div>

        <Stepper current={step} steps={steps} />

        <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 pb-24 shadow-sm ring-1 ring-gray-200 sm:pb-6">
          {stepKey === 'role' && (
            <div className="grid gap-4 md:grid-cols-2">
              <CoachTypeCard
                title="JUCO Program"
                subtitle="Two-year college coaching staff"
                bullets={['Mark players NCAA-eligible', 'Share evaluations with four-year programs', 'Expose your roster to recruiters']}
                active={data.coachType === 'JUCO'}
                onSelect={() => handleSelectType('JUCO')}
              />
              <CoachTypeCard
                title="NCAA / NAIA Program"
                subtitle="Four-year universities recruiting talent"
                bullets={['Set position & GPA filters', 'Track recruiting budget needs', 'Request evaluations from JUCO coaches']}
                active={data.coachType === 'NCAA'}
                onSelect={() => handleSelectType('NCAA')}
              />
            </div>
          )}

          {stepKey === 'account' && (
            <Section title="Your account" desc="Use professional contact details so players and coaches know who you are.">
              <Field label="Professional email" required>
                <input type="email" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.email} onChange={(e)=>update({email:e.target.value})} />
              </Field>
              <Field label="Password" required>
                <PasswordField
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0"
                  value={data.password}
                  onChange={(e) => update({ password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  required
                  autoComplete="new-password"
                />
              </Field>
              <Field label="Confirm password" required>
                <PasswordField
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0"
                  value={data.confirmPassword}
                  onChange={(e) => update({ confirmPassword: e.target.value })}
                  required
                  autoComplete="new-password"
                  toggleLabels={{ show: 'Show confirm password', hide: 'Hide confirm password' }}
                />
              </Field>
              <Field label="First name" required>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.firstName} onChange={(e)=>update({firstName:e.target.value})} />
              </Field>
              <Field label="Last name" required>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.lastName} onChange={(e)=>update({lastName:e.target.value})} />
              </Field>
              <div className="sm:col-span-2">
                <PhoneInput
                  label="Mobile phone"
                  required
                  value={data.phone}
                  onChange={(val) => update({ phone: val })}
                />
              </div>
              <Field label={data.coachType === 'JUCO' ? 'Coaching role' : 'Title'} required>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.roleTitle} onChange={(e)=>update({roleTitle:e.target.value})}>
                  <option value="">Select…</option>
                  {(data.coachType === 'JUCO'
                    ? ['Head Coach', 'Assistant Coach']
                    : ['Head Coach', 'Assistant Coach', 'Recruiter', 'Director of Operations'])
                    .map((opt) => <option key={opt}>{opt}</option>)}
                </select>
              </Field>
              <div className="sm:col-span-2 flex items-center gap-2">
                <input type="checkbox" id="coach-terms" className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600" checked={data.acceptTerms} onChange={(e)=>update({acceptTerms:e.target.checked})} />
                <label htmlFor="coach-terms" className="text-sm text-gray-700">I agree to the Terms of Service and Privacy Policy.</label>
              </div>
              {touched.account && !validators.account() && (
                <div className="sm:col-span-2 text-xs text-rose-600">Fill every required field and accept the terms.</div>
              )}
            </Section>
          )}

          {stepKey === 'program' && (
            <Section
              title={data.coachType === 'JUCO' ? 'Program information' : 'Program details'}
              desc={data.coachType === 'JUCO' ? 'Tell us about your junior college program.' : 'Tell us about your four-year program.'}
            >
              <Field label={data.coachType === 'JUCO' ? 'Program name' : 'University / Program'} required>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.programName} onChange={(e)=>update({programName:e.target.value})} />
              </Field>
              {data.coachType === 'JUCO' ? (
                <Field label="League / Association" required>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.league} onChange={(e)=>update({league:e.target.value})}>
                    <option value="">Select…</option>
                    {JUCO_LEAGUES.map((opt) => <option key={opt}>{opt}</option>)}
                  </select>
                </Field>
              ) : (
                <Field label="Division" required>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.division} onChange={(e)=>update({division:e.target.value})}>
                    <option value="">Select…</option>
                    {DIVISION_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
                  </select>
                </Field>
              )}
              {data.coachType === 'NCAA' && (
                <Field label="Conference / League" required>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.conference} onChange={(e)=>update({conference:e.target.value})} />
                </Field>
              )}
              <Field label="City" required>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.city} onChange={(e)=>update({city:e.target.value})} />
              </Field>
              <Field label="State" required>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.state} onChange={(e)=>update({state:e.target.value})} />
              </Field>
              <Field label="Program website">
                <input type="url" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.website} onChange={(e)=>update({website:e.target.value})} placeholder="https://" />
              </Field>
              {data.coachType === 'NCAA' && (
                <Field label="Recruiting budget range">
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.recruitingBudgetRange} onChange={(e)=>update({recruitingBudgetRange:e.target.value})}>
                    <option value="">Select…</option>
                    {BUDGET_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
                  </select>
                </Field>
              )}
              {touched.program && !validators.program() && (
                <div className="sm:col-span-2 text-xs text-rose-600">Please complete your program details.</div>
              )}
            </Section>
          )}

          {stepKey === 'review' && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900">Review your information</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-900">Account</h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-700">
                    <div>Email: {data.email}</div>
                    <div>Name: {data.firstName} {data.lastName}</div>
                    <div>Phone: {data.phone}</div>
                    <div>Role: {data.roleTitle}</div>
                  </div>
                </div>
                <div className="rounded-md border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-900">Program</h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-700">
                    <div>Type: {data.coachType === 'JUCO' ? 'JUCO' : 'NCAA / NAIA'}</div>
                    <div>Program: {data.programName}</div>
                    <div>Location: {[data.city, data.state].filter(Boolean).join(', ')}</div>
                    {data.coachType === 'JUCO' ? <div>League: {data.league}</div> : <div>Division: {data.division} • Conference: {data.conference}</div>}
                    {data.website && <div>Website: {data.website}</div>}
                    {data.coachType !== 'JUCO' && data.recruitingBudgetRange && <div>Budget range: {data.recruitingBudgetRange}</div>}
                  </div>
                </div>
              </div>
              {submitted && <p className="text-sm text-green-700">Submitted! You can now log in with your credentials.</p>}
            </div>
          )}

          {submitError && <p className="mt-4 text-sm text-rose-600">{submitError}</p>}

          <div className="mt-6 hidden items-center justify-between sm:flex">
            <button type="button" onClick={back} disabled={step===0} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 disabled:opacity-40">Back</button>
            {step < steps.length - 1 ? (
              <button type="button" onClick={next} disabled={!canNext} className="rounded-md bg-orange-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">Next</button>
            ) : (
              <button type="submit" className="rounded-md bg-orange-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit'}</button>
            )}
          </div>
        </form>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:hidden">
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
              disabled={submitting}
              className="w-1/2 rounded-md bg-orange-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
