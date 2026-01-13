import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import logo from '../assets/logo.png'
import { login, setToken, setRole, clearToken, getToken } from '../lib/api'
import PasswordField from '../components/PasswordField'
import AuthShell from '../components/layout/AuthShell'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailValue, setEmailValue] = useState('')

  // Optional: allow forced switch by visiting /login?switch=1
  // and make sure user can still use the page when already signed in
  const search = new URLSearchParams(location.search)
  if (search.get('switch') === '1') {
    clearToken()
  }
  async function onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    const email = form.email.value
    const password = form.password.value
    try {
      setLoading(true)
      setError('')
      const res = await login(email, password)
      setToken(res.token)
      setRole(res?.user?.role)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const side = (
    <div className="flex h-full flex-col justify-between gap-10">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <img src={logo} className="h-10 w-10 rounded-xl object-cover" alt="Sportall logo" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Sportall</p>
            <p className="text-sm text-slate-600">Reliability-first recruiting.</p>
          </div>
        </div>
        <div>
          <h2 className="auth-display text-4xl font-semibold text-slate-900 sm:text-5xl">
            Confidence at every login.
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Secure sessions, verified profiles, and audit-ready workflows built for serious programs.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: 'Verified onboarding', desc: 'Email verification protects roster data. Phone verification can be added later.' },
            { title: 'Stripe-ready billing', desc: 'Subscriptions stay in sync with access.' },
            { title: 'Admin-grade controls', desc: 'Roles and invitations stay governed.' },
            { title: 'Audit visibility', desc: 'Actions are logged for accountability.' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur">
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="mt-1 text-xs text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-orange-200/60 bg-orange-50/80 p-4 text-sm text-orange-900 shadow-sm">
        <p className="font-semibold">Need help signing in?</p>
        <p className="mt-1 text-xs text-orange-700">Contact your Sportall admin for account support.</p>
      </div>
    </div>
  )

  return (
    <AuthShell
      title="Log in to Sportall"
      subtitle="Secure access for players, coaches, and admins."
      side={side}
      footer="By continuing you agree to Sportall terms and acknowledge our privacy policy."
    >
      {getToken() && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          You are currently signed in. Submitting this form will replace your session. Or
          <button type="button" onClick={() => { clearToken(); navigate('/login') }} className="ml-1 font-semibold text-orange-700 underline">log out</button> first.
        </div>
      )}

      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@program.edu"
            value={emailValue}
            onChange={(event) => setEmailValue(event.target.value)}
            className="block w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">Password</label>
          <PasswordField
            id="password"
            name="password"
            required
            placeholder="Your password"
            autoComplete="current-password"
            className="block w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <label className="inline-flex items-center gap-2 text-xs text-slate-600">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-600" />
            Remember this device
          </label>
          <div className="flex items-center gap-3">
            <Link
              to={`/forgot-password${emailValue ? `?email=${encodeURIComponent(emailValue)}` : ''}`}
              className="font-medium text-orange-600 hover:text-orange-700"
            >
              Forgot password?
            </Link>
            <span className="text-[11px] text-slate-500">Sessions expire every 24 hours.</span>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Log In'}
        </button>

        <div className="relative py-2 text-center text-xs text-slate-400">
          <span className="bg-white px-2">or continue</span>
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-slate-200" />
        </div>

        <button
          type="button"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          Continue with Google
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-600">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-medium text-orange-600 hover:text-orange-700">Sign up</Link>
      </p>
    </AuthShell>
  )
}
