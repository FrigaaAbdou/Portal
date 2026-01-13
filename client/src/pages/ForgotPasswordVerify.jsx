import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import AuthShell from '../components/layout/AuthShell'
import PasswordResetSide from '../components/layout/PasswordResetSide'
import { requestPasswordReset, verifyPasswordResetCode } from '../lib/api'

function resolveOtpError(err) {
  const code = err?.data?.code
  if (code === 'OTP_EXPIRED') return 'That code expired. Request a new one to continue.'
  if (code === 'OTP_LOCKED') return 'Too many attempts. Request a new code to continue.'
  if (code === 'OTP_INVALID') return 'That code is incorrect. Try again.'
  return err?.message || 'Verification failed'
}

export default function ForgotPasswordVerify() {
  const location = useLocation()
  const navigate = useNavigate()
  const search = new URLSearchParams(location.search)
  const email = search.get('email') || ''
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function onSubmit(event) {
    event.preventDefault()
    if (!email) {
      setError('Missing email. Return to the request page.')
      return
    }
    const trimmedCode = code.trim()
    if (!trimmedCode || trimmedCode.length !== 6) {
      setError('Enter the 6-digit code')
      return
    }
    try {
      setLoading(true)
      setError('')
      const res = await verifyPasswordResetCode(email, trimmedCode)
      if (!res?.resetToken) {
        throw new Error('Reset token unavailable')
      }
      navigate(`/forgot-password/reset?token=${encodeURIComponent(res.resetToken)}&email=${encodeURIComponent(email)}`)
    } catch (err) {
      setError(resolveOtpError(err))
    } finally {
      setLoading(false)
    }
  }

  async function onResend() {
    if (!email) {
      setError('Missing email. Return to the request page.')
      return
    }
    try {
      setResending(true)
      setError('')
      await requestPasswordReset(email)
      setNotice('If an account exists for this email, a new code is on the way.')
    } catch (err) {
      setError(err.message || 'Failed to resend code')
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Password Recovery"
      title="Verify your code"
      subtitle="Enter the 6-digit code to continue."
      side={<PasswordResetSide step={2} />}
      footer="If you did not request a reset, you can ignore the message."
    >
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
        If an account exists for <span className="font-semibold text-slate-900">{email || 'this email'}</span>, we sent a code
        that expires in 10 minutes.
      </div>

      {notice && (
        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
          {notice}
        </div>
      )}

      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label htmlFor="code" className="mb-1 block text-sm font-medium text-slate-700">6-digit code</label>
          <input
            id="code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={6}
            value={code}
            onChange={(event) => {
              const next = event.target.value.replace(/\D/g, '')
              setCode(next)
            }}
            placeholder="000000"
            className="block w-full text-center tracking-[0.3em]"
          />
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Verifying...' : 'Verify code'}
        </button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-2 text-xs text-slate-600 sm:flex-row sm:justify-between">
        <Link to={`/forgot-password?email=${encodeURIComponent(email)}`} className="font-medium text-orange-600 hover:text-orange-700">
          Change email
        </Link>
        <button
          type="button"
          onClick={onResend}
          disabled={resending || !email}
          className="font-medium text-orange-600 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {resending ? 'Resending...' : 'Resend code'}
        </button>
      </div>
    </AuthShell>
  )
}
