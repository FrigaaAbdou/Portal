import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register as apiRegister, login as apiLogin, setToken, setRole, clearToken, savePlayerProfile } from '../lib/api'
import { soccerPositions } from '../lib/positions'
import positionGraphic from '../assets/playerPosition.png'
import PasswordField from '../components/PasswordField'

const steps = [
  { key: 'account', title: 'Account', desc: 'Create your account' },
  { key: 'personal', title: 'Personal', desc: 'Basic player details' },
  { key: 'background', title: 'Background', desc: 'School & profile' },
  { key: 'stats', title: 'Stats', desc: 'Season statistics' },
  { key: 'preferences', title: 'Preferences', desc: 'Recruitment goals' },
  { key: 'review', title: 'Review', desc: 'Confirm & submit' },
]

const POSITION_LIMIT = 2

const initialData = {
  // account
  email: '', password: '', confirmPassword: '', acceptTerms: false,
  // personal
  fullName: '', dob: '', city: '', state: '', country: '', heightFeet: '', heightInches: '', weightLbs: '',
  // background
  school: '', gpa: '',
  positions: [], // multi-select
  highlightUrl1: '', highlightUrl2: '',
  // stats
  games: '', gamesStarted: '', goals: '', assists: '', points: '',
  // preferences
  division: '', budget: '', preferredLocation: '',
}

function usePersistedForm(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : defaultValue
    } catch (err) {
      console.warn('Failed to read persisted form data', err)
      return defaultValue
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.warn('Failed to persist form data', err)
    }
  }, [key, value])
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
      <div className="mt-3 grid grid-cols-6 gap-2 text-center text-xs text-gray-600">
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

// Bio editing moved to Profile page after login

export default function SignupPlayer() {
  const [step, setStep] = useState(0)
  const [data, setData] = usePersistedForm('signup_player_v1', initialData)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  const update = (patch) => setData((d) => ({ ...d, ...patch }))
  const selectedPositions = useMemo(() => Array.isArray(data.positions) ? data.positions.slice(0, POSITION_LIMIT) : [], [data.positions])

  const addPosition = (code) => {
    setData((prev) => {
      const current = Array.isArray(prev.positions) ? prev.positions.filter((item) => typeof item === 'string' && item.trim().length > 0) : []
      if (current.includes(code) || current.length >= POSITION_LIMIT) return prev
      return { ...prev, positions: [...current, code] }
    })
  }

  const removePosition = (code) => {
    setData((prev) => {
      const current = Array.isArray(prev.positions) ? prev.positions.filter((item) => typeof item === 'string' && item.trim().length > 0) : []
      if (!current.includes(code)) return prev
      return { ...prev, positions: current.filter((item) => item !== code) }
    })
  }

  const validators = useMemo(() => ({
    account: () => {
      const { email, password, confirmPassword, acceptTerms } = data
      return email.includes('@') && password.length >= 6 && confirmPassword === password && acceptTerms
    },
    personal: () => {
      const {
        fullName,
        dob,
        country,
        city,
        state,
        heightFeet,
        heightInches,
        weightLbs,
      } = data
      return [
        fullName.trim().length >= 2,
        Boolean(dob),
        Boolean(country),
        Boolean(city?.trim()),
        Boolean(state?.trim()),
        String(heightFeet).trim() !== '',
        String(heightInches).trim() !== '',
        String(weightLbs).trim() !== '',
      ].every(Boolean)
    },
    background: () => {
      const { school, positions, gpa, highlightUrl1, highlightUrl2 } = data
      return [
        Boolean(school?.trim()),
        Array.isArray(positions) && positions.length > 0,
        Boolean(gpa?.trim()),
        Boolean(highlightUrl1?.trim()),
        Boolean(highlightUrl2?.trim()),
      ].every(Boolean)
    },
    stats: () => {
      const { games, gamesStarted, goals, assists, points } = data
      return [games, gamesStarted, goals, assists, points].every((value) => String(value).trim() !== '')
    },
    preferences: () => {
      const { division, budget, preferredLocation } = data
      return [
        Boolean(String(division).trim()),
        String(budget).trim() !== '',
        Boolean(String(preferredLocation).trim()),
      ].every(Boolean)
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

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setTouched((t) => ({ ...t, [steps[step].key]: true }))
    if (!validators.preferences() || !validators.background() || !validators.personal() || !validators.account()) return
    setSubmitting(true)
    setSubmitError('')
    try {
      // Try register; if email exists, fallback to login
      try {
        const reg = await apiRegister(data.email, data.password, 'player')
        setToken(reg.token)
        setRole(reg?.user?.role || 'player')
      } catch (err) {
        if (String(err.message || '').toLowerCase().includes('already')) {
          const lg = await apiLogin(data.email, data.password)
          setToken(lg.token)
          setRole(lg?.user?.role || 'player')
        } else {
          throw err
        }
      }

      // Map profile payload
      const payload = {
        fullName: data.fullName,
        dob: data.dob,
        city: data.city,
        state: data.state,
        country: data.country,
        heightFeet: data.heightFeet !== '' ? Number(data.heightFeet) : undefined,
        heightInches: data.heightInches !== '' ? Number(data.heightInches) : undefined,
        weightLbs: data.weightLbs !== '' ? Number(data.weightLbs) : undefined,
        school: data.school,
        gpa: data.gpa,
        positions: data.positions || [],
        highlightUrl1: data.highlightUrl1,
        highlightUrl2: data.highlightUrl2,
        games: Number(data.games) || 0,
        gamesStarted: Number(data.gamesStarted) || 0,
        goals: Number(data.goals) || 0,
        assists: Number(data.assists) || 0,
        points: Number(data.points) || 0,
        division: data.division,
        budget: data.budget !== '' ? Number(data.budget) : undefined,
        preferredLocation: data.preferredLocation,
      }
      await savePlayerProfile(payload)
      setSubmitted(true)
      // Clear auth and send user to login to sign in with the new account
      clearToken()
      navigate('/login')
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }

  const errorText = () => touched[steps[step].key] && !validators[steps[step].key]() ? (
    <p className="mt-2 text-xs text-rose-600">Please complete required fields to continue.</p>
  ) : null

  const reviewItems = () => {
    const items = []
    const push = (label, value) => {
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        items.push([label, value])
      }
    }
    // Account (no passwords)
    push('Email', data.email)
    // Personal
    push('Full name', data.fullName)
    push('Date of birth', data.dob)
    push('City', data.city)
    push('State', data.state)
    push('Country', data.country)
    const height = (data.heightFeet || data.heightInches)
      ? `${data.heightFeet || 0} ft ${data.heightInches || 0} in` : ''
    push('Height', height)
    push('Weight', data.weightLbs ? `${data.weightLbs} lbs` : '')
    // Background
    push('School/Team', data.school)
    push('GPA', data.gpa)
    if (Array.isArray(data.positions) && data.positions.length) {
      push('Positions', data.positions.join(', '))
    }
    push('Highlight URL 1', data.highlightUrl1)
    push('Highlight URL 2', data.highlightUrl2)
    // Stats
    push('Games', data.games)
    push('Games started', data.gamesStarted)
    push('Goals', data.goals)
    push('Assists', data.assists)
    push('Points', data.points)
    // Preferences
    push('Desired division/league', data.division)
    push('Budget (USD)', data.budget)
    push('Preferred location', data.preferredLocation)
    return items
  }

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
                <PasswordField
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0"
                  value={data.password}
                  onChange={(e) => update({ password: e.target.value })}
                  required
                  autoComplete="new-password"
                  placeholder="Minimum 6 characters"
                />
              </Field>
              <Field label="Confirm password" required>
                <PasswordField
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0"
                  value={data.confirmPassword}
                  onChange={(e) => update({ confirmPassword: e.target.value })}
                  required
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  toggleLabels={{ show: 'Show confirm password', hide: 'Hide confirm password' }}
                />
              </Field>
              <div className="sm:col-span-2">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600" checked={data.acceptTerms} onChange={(e)=>update({acceptTerms:e.target.checked})} required />
                  I agree to the Terms and Privacy Policy
                </label>
              </div>
              <div className="sm:col-span-2">{errorText()}</div>
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
              <Field label="City" required>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.city} onChange={(e)=>update({city:e.target.value})} required />
              </Field>
              <Field label="State" required>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.state} onChange={(e)=>update({state:e.target.value})} required />
              </Field>
              <Field label="Country" required>
                <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.country} onChange={(e)=>update({country:e.target.value})} required />
              </Field>
              {/* Height in American system */}
              <div className="grid grid-cols-2 gap-3 sm:col-span-2">
                <Field label="Height (ft)" required>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.heightFeet} onChange={(e)=>update({heightFeet:e.target.value})} required>
                    <option value="">Select</option>
                    {[4,5,6,7].map((ft)=> (
                      <option key={ft} value={ft}>{ft} ft</option>
                    ))}
                  </select>
                </Field>
                <Field label="Height (in)" required>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.heightInches} onChange={(e)=>update({heightInches:e.target.value})} required>
                    <option value="">Select</option>
                    {Array.from({length:12}).map((_,i)=> (
                      <option key={i} value={i}>{i} in</option>
                    ))}
                  </select>
                </Field>
              </div>
              {/* Weight in lbs, from 150 increasing by 5 */}
              <Field label="Weight (lbs)" required>
                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.weightLbs} onChange={(e)=>update({weightLbs:e.target.value})} required>
                  <option value="">Select</option>
                  {Array.from({length:41}).map((_,idx)=> {
                    const val = 150 + idx*5; // 150..350
                    return <option key={val} value={val}>{val} lbs</option>
                  })}
                </select>
              </Field>
              <div className="sm:col-span-2">{errorText()}</div>
            </Section>
          )}

          {step === 2 && (
            <>
              <Section title="Academic background" desc="Your current school and academics.">
                <Field label="Current school or team" required>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.school} onChange={(e)=>update({school:e.target.value})} required />
                </Field>
                <Field label="GPA / average grade" required>
                  <input className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.gpa} onChange={(e)=>update({gpa:e.target.value})} placeholder="e.g., 3.4" required />
                </Field>
              </Section>

              <div className="mt-8" />
              <Section title="Positions" desc="Select all that apply.">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Need a reminder? Hover the pitch map.</span>
                  <div className="relative inline-flex group">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-xs font-semibold text-gray-500">i</span>
                    <div className="absolute right-0 top-8 hidden w-64 rounded-lg border border-gray-200 bg-white p-2 shadow-lg group-hover:block">
                      <img src={positionGraphic} alt="Soccer field positions" className="w-full rounded" />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-2 grid gap-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[0, 1].map((slot) => {
                      const currentCode = selectedPositions[slot] || ''
                      return (
                        <div key={slot} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {slot === 0 ? 'Primary position' : 'Secondary position'}
                          </div>
                          <select
                            value={currentCode}
                            onChange={(e) => {
                              const value = e.target.value
                              if (!value) {
                                if (currentCode) removePosition(currentCode)
                                return
                              }
                              if (selectedPositions.includes(value)) {
                                if (value !== currentCode) {
                                  e.target.value = currentCode
                                }
                                return
                              }
                              if (currentCode) {
                                removePosition(currentCode)
                              }
                              addPosition(value)
                            }}
                            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                          >
                            <option value="">Select position</option>
                            {Object.entries(soccerPositions).map(([group, list]) => (
                              <optgroup key={group} label={group === 'goalkeeper' ? 'Goalkeeper' : group.charAt(0).toUpperCase() + group.slice(1)}>
                                {list.map(({ code, label }) => (
                                  <option key={code} value={code}>
                                    {code} — {label}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                          {currentCode && (
                            <button
                              type="button"
                              onClick={() => removePosition(currentCode)}
                              className="mt-2 inline-flex items-center text-xs font-semibold text-orange-600 hover:text-orange-700"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <div className="text-xs text-gray-500">Select up to {POSITION_LIMIT} positions. Primary should be first.</div>
                </div>
                <div className="sm:col-span-2">{errorText()}</div>
              </Section>

              

              <div className="sm:col-span-2 mt-8" />
              <Section title="Highlights" desc="Links to Hudl/YouTube/Drive clips.">
                <Field label="Highlight URL 1" required>
                  <input type="url" placeholder="https://hudl.com/…" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.highlightUrl1} onChange={(e)=>update({highlightUrl1:e.target.value})} required />
                </Field>
                <Field label="Highlight URL 2" required>
                  <input type="url" placeholder="https://youtube.com/…" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.highlightUrl2} onChange={(e)=>update({highlightUrl2:e.target.value})} required />
                </Field>
              </Section>
            </>
          )}

          {step === 3 && (
            <Section title="Stats" desc="Season performance (numbers only).">
              <Field label="Games" required>
                <input type="number" min="0" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.games} onChange={(e)=>update({games:e.target.value})} required />
              </Field>
              <Field label="Games started" required>
                <input type="number" min="0" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.gamesStarted} onChange={(e)=>update({gamesStarted:e.target.value})} required />
              </Field>
              <Field label="Goals" required>
                <input type="number" min="0" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.goals} onChange={(e)=>update({goals:e.target.value})} required />
              </Field>
              <Field label="Assists" required>
                <input type="number" min="0" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.assists} onChange={(e)=>update({assists:e.target.value})} required />
              </Field>
              <Field label="Points" required>
                <input type="number" min="0" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.points} onChange={(e)=>update({points:e.target.value})} required />
              </Field>
              <div className="sm:col-span-2">{errorText()}</div>
            </Section>
          )}

          {step === 4 && (
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
              <Field label="Budget (USD)" required>
                <input type="number" min="0" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={data.budget} onChange={(e)=>update({budget:e.target.value})} required />
              </Field>
              <div className="sm:col-span-2">
                <span className="mb-1 block text-sm font-medium text-gray-700">Preferred location (US state)</span>
                <div className="grid max-h-64 grid-cols-2 gap-2 overflow-auto rounded-md border border-gray-200 p-3 sm:grid-cols-3">
                  {[
                    'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming','Other / International'
                  ].map((state) => (
                    <label key={state} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-gray-50">
                      <input
                        type="radio"
                        name="preferredState"
                        className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-600"
                        checked={data.preferredLocation === state}
                        onChange={() => update({ preferredLocation: state })}
                        required={data.preferredLocation === ''}
                      />
                      <span className="select-none text-gray-800">{state}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">{errorText()}</div>
            </Section>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-base font-semibold text-gray-900">Review and confirm</h2>
              <p className="mt-1 text-sm text-gray-600">Double-check your information before submitting.</p>
              <div className="mt-4 grid gap-3 text-sm text-gray-800 sm:grid-cols-2">
                {reviewItems().map(([label, value]) => (
                  <div key={label} className="rounded-md border border-gray-200 px-3 py-2">
                    <span className="font-medium">{label}:</span> <span className="text-gray-700">{String(value)}</span>
                  </div>
                ))}
              </div>
              {submitted && <p className="mt-3 text-sm text-green-700">Submitted! Replace with your API request.</p>}
            </div>
          )}

          {submitError && <p className="mt-4 text-sm text-rose-600">{submitError}</p>}

          {/* Desktop/Tablet Nav */}
          <div className="mt-6 hidden items-center justify-between sm:flex">
            <button type="button" onClick={back} disabled={step===0} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 disabled:opacity-40">Back</button>
            {step < steps.length - 1 ? (
              <button type="button" onClick={next} disabled={!canNext} className="rounded-md bg-orange-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">Next</button>
            ) : (
              <button type="submit" disabled={submitting} className="rounded-md bg-orange-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">{submitting ? 'Submitting…' : 'Submit'}</button>
            )}
          </div>
        </form>
      </div>

      {/* Mobile sticky nav */}
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
              onClick={onSubmit}
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
