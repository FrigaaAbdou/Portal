import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import AuthShell from '../components/layout/AuthShell'
import PasswordResetSide from '../components/layout/PasswordResetSide'
import PasswordField from '../components/PasswordField'
import { confirmPasswordReset } from '../lib/api'

const MIN_PASSWORD_LENGTH = 8

function resolveResetError(err) {
  const code = err?.data?.code
  if (code === 'RESET_TOKEN_EXPIRED') return 'Your reset session expired. Request a new code to continue.'
  if (code === 'RESET_TOKEN_INVALID') return 'This reset link is invalid. Request a new code to continue.'
  return err?.message || 'Failed to reset password'
}

export default function ResetPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  const search = new URLSearchParams(location.search)
  const token = search.get('token') || ''
  const email = search.get('email') || ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const tokenMissing = !token
  const formDisabled = loading || tokenMissing || success

  async function onSubmit(event) {
    event.preventDefault()
    if (!token) {
      setError('Missing reset token. Request a new code to continue.')
      return
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    try {
      setLoading(true)
      setError('')
      await confirmPasswordReset(token, password)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(resolveResetError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Password Recovery"
      title="Create a new password"
      subtitle="Your reset link stays active for 5 minutes."
      side={<PasswordResetSide step={3} />}
      footer="Passwords must be at least 8 characters long."
    >
      {tokenMissing && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
          This reset link is missing or expired. Request a new code to continue.
        </div>
      )}

      {email && (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
          Resetting access for <span className="font-semibold text-slate-900">{email}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
          Password updated. Redirecting you to login...
        </div>
      )}

      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">New password</label>
          <PasswordField
            id="password"
            name="password"
            required
            autoComplete="new-password"
            disabled={formDisabled}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a new password"
            className="block w-full"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-slate-700">Confirm password</label>
          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            required
            autoComplete="new-password"
            disabled={formDisabled}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Re-enter password"
            toggleLabels={{ show: 'Show confirm password', hide: 'Hide confirm password' }}
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
          disabled={formDisabled}
          className="w-full rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Updating...' : 'Reset password'}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-600">
        Need a new code?{' '}
        <Link to={`/forgot-password?email=${encodeURIComponent(email)}`} className="font-medium text-orange-600 hover:text-orange-700">
          Start over
        </Link>
      </div>
    </AuthShell>
  )
}
