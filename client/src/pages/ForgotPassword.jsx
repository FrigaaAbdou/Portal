import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import AuthShell from '../components/layout/AuthShell'
import PasswordResetSide from '../components/layout/PasswordResetSide'
import { requestPasswordReset } from '../lib/api'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const search = new URLSearchParams(location.search)
  const [email, setEmail] = useState(search.get('email') || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(event) {
    event.preventDefault()
    if (!email.trim()) {
      setError('Email is required')
      return
    }
    try {
      setLoading(true)
      setError('')
      await requestPasswordReset(email.trim())
      navigate(`/forgot-password/verify?email=${encodeURIComponent(email.trim())}`)
    } catch (err) {
      setError(err.message || 'Failed to request reset code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Password Recovery"
      title="Reset your password"
      subtitle="We will send a 6-digit code if the email matches an account."
      side={<PasswordResetSide step={1} />}
      footer="Need more help? Contact your Sportall administrator."
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@program.edu"
            autoComplete="email"
            className="block w-full"
          />
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Sending code...' : 'Send reset code'}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-600">
        Remembered your password?{' '}
        <Link to="/login" className="font-medium text-orange-600 hover:text-orange-700">Return to login</Link>
      </div>
    </AuthShell>
  )
}
