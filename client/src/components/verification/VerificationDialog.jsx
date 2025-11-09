import { useEffect, useMemo, useState } from 'react'
import PhoneInput from '../ui/PhoneInput'
import {
  fetchVerificationStatus,
  startEmailVerification,
  confirmEmailVerification,
  sendPhoneVerification,
  confirmPhoneVerification,
  submitVerificationStats,
} from '../../lib/api'

const STEP_ORDER = ['email_pending', 'phone_pending', 'stats_pending', 'in_review', 'verified', 'needs_updates', 'none']

function statusToStep(status = 'none') {
  switch (status) {
    case 'email_pending':
    case 'none':
      return 0
    case 'phone_pending':
      return 1
    case 'stats_pending':
    case 'needs_updates':
      return 2
    case 'in_review':
      return 3
    case 'verified':
      return 4
    default:
      return 0
  }
}

function StepBadge({ step, current }) {
  const states = ['Email', 'Phone', 'Stats']
  const state = states[step]
  const done = step < current
  const active = step === current && current < 3
  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
          done ? 'bg-emerald-500 text-white' : active ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
        }`}
      >
        {done ? '✓' : step + 1}
      </span>
      <span className={done ? 'text-gray-600 line-through' : 'text-gray-800'}>{state}</span>
    </div>
  )
}

export default function VerificationDialog({ open, onClose, player }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('none')

  const [emailCode, setEmailCode] = useState('')
  const [emailSending, setEmailSending] = useState(false)
  const [emailConfirming, setEmailConfirming] = useState(false)
  const [emailCooldown, setEmailCooldown] = useState(0)

  const [phoneValue, setPhoneValue] = useState('')
  const [phoneCode, setPhoneCode] = useState('')
  const [phoneSending, setPhoneSending] = useState(false)
  const [phoneConfirming, setPhoneConfirming] = useState(false)
  const [phoneCooldown, setPhoneCooldown] = useState(0)

  const [statsForm, setStatsForm] = useState({
    attested: false,
    supportingFiles: '',
  })
  const [statsSubmitting, setStatsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    let active = true
    setLoading(true)
    fetchVerificationStatus()
      .then((res) => {
        if (!active) return
        const verification = res?.verification || null
        setStatus(verification?.status || 'none')
        if (verification?.phone?.number) {
          setPhoneValue(res.verification.phone.number)
        }
      })
      .catch((err) => {
        if (active) setError(err?.message || 'Failed to load verification')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      setEmailCooldown(0)
      setPhoneCooldown(0)
      return
    }
    const interval = setInterval(() => {
      setEmailCooldown((prev) => (prev > 0 ? prev - 1 : 0))
      setPhoneCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [open])

  const currentStep = useMemo(() => statusToStep(status), [status])

  const handleSendEmail = async () => {
    setEmailSending(true)
    setError('')
    try {
      await startEmailVerification()
      setStatus('email_pending')
      setEmailCooldown(60)
    } catch (err) {
      setError(err?.message || 'Failed to send code')
      if (err?.status === 429) {
        const retry = err?.data?.retryAfter ? Number(err.data.retryAfter) : 60
        setEmailCooldown(retry)
      }
    } finally {
      setEmailSending(false)
    }
  }

  const handleConfirmEmail = async () => {
    setEmailConfirming(true)
    setError('')
    try {
      await confirmEmailVerification(emailCode)
      setStatus('phone_pending')
      setEmailCode('')
    } catch (err) {
      setError(err?.message || 'Invalid code')
    } finally {
      setEmailConfirming(false)
    }
  }

  const handleSendPhone = async () => {
    setPhoneSending(true)
    setError('')
    try {
      await sendPhoneVerification(phoneValue)
      setStatus('phone_pending')
      setPhoneCooldown(60)
    } catch (err) {
      setError(err?.message || 'Failed to send SMS')
      if (err?.status === 429) {
        const retry = err?.data?.retryAfter ? Number(err.data.retryAfter) : 60
        setPhoneCooldown(retry)
      }
    } finally {
      setPhoneSending(false)
    }
  }

  const handleConfirmPhone = async () => {
    setPhoneConfirming(true)
    setError('')
    try {
      await confirmPhoneVerification(phoneCode)
      setStatus('stats_pending')
      setPhoneCode('')
    } catch (err) {
      setError(err?.message || 'Invalid SMS code')
    } finally {
      setPhoneConfirming(false)
    }
  }

  const buildStatsSnapshot = () => {
    return {
      stats: player?.stats || {},
      gpa: player?.gpa || '',
      positions: player?.positions || [],
      updatedAt: new Date().toISOString(),
    }
  }

  const handleSubmitStats = async () => {
    if (!statsForm.attested) {
      setError('You must certify your stats are accurate.')
      return
    }
    setStatsSubmitting(true)
    setError('')
    try {
      const files = statsForm.supportingFiles
        ? statsForm.supportingFiles
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
        : []
      await submitVerificationStats({
        statsSnapshot: buildStatsSnapshot(),
        attested: true,
        supportingFiles: files,
      })
      setStatus('in_review')
    } catch (err) {
      setError(err?.message || 'Failed to submit stats')
    } finally {
      setStatsSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Profile verification</h2>
              <p className="text-sm text-gray-600">Complete each step to unlock verified status.</p>
            </div>
            <button onClick={onClose} className="rounded-md p-2 text-gray-500 hover:bg-gray-100" aria-label="Close dialog">
              ×
            </button>
          </div>
          <div className="px-5 py-4">
            <div className="flex flex-wrap gap-4">
              {[0, 1, 2].map((step) => (
                <StepBadge key={step} step={step} current={Math.min(currentStep, 3)} />
              ))}
              <div className="ml-auto text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status: {status.replace('_', ' ')}
              </div>
            </div>
            {loading ? (
              <div className="mt-6 animate-pulse rounded-xl bg-gray-100 p-8" />
            ) : (
              <>
                {error && (
                  <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {error}
                  </div>
                )}
                {currentStep === 0 && (
                  <div className="mt-4 space-y-4">
                    <p className="text-sm text-gray-600">We’ve sent a code to your account email. Didn’t get it?</p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleSendEmail}
                        disabled={emailSending || emailCooldown > 0}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-60"
                      >
                        {emailSending ? 'Sending…' : 'Resend code'}
                      </button>
                      {emailCooldown > 0 && (
                        <span className="text-xs text-gray-500 self-center">{emailCooldown}s before retry</span>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Enter the 6-digit code</label>
                      <input
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-400 focus:ring-0"
                        value={emailCode}
                        onChange={(e) => setEmailCode(e.target.value)}
                        placeholder="123456"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleConfirmEmail}
                        disabled={emailConfirming || emailCode.length === 0}
                        className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60"
                      >
                        {emailConfirming ? 'Verifying…' : 'Confirm email'}
                      </button>
                    </div>
                  </div>
                )}
                {currentStep === 1 && (
                  <div className="mt-4 space-y-4">
                    <PhoneInput value={phoneValue} onChange={setPhoneValue} label="Mobile number" required />
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleSendPhone}
                        disabled={phoneSending || !phoneValue || phoneCooldown > 0}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-60"
                      >
                        {phoneSending ? 'Sending…' : 'Send SMS code'}
                      </button>
                      {phoneCooldown > 0 && (
                        <span className="text-xs text-gray-500 self-center">{phoneCooldown}s before retry</span>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Enter SMS code</label>
                      <input
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-400 focus:ring-0"
                        value={phoneCode}
                        onChange={(e) => setPhoneCode(e.target.value)}
                        placeholder="123456"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleConfirmPhone}
                        disabled={phoneConfirming || phoneCode.length === 0}
                        className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60"
                      >
                        {phoneConfirming ? 'Verifying…' : 'Confirm phone'}
                      </button>
                    </div>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="mt-4 space-y-4">
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                      <p className="font-semibold text-gray-900">Stats snapshot</p>
                      <ul className="mt-2 grid gap-1 text-sm text-gray-600">
                        <li>Games: {player?.stats?.games ?? '—'}</li>
                        <li>Goals: {player?.stats?.goals ?? '—'}</li>
                        <li>Assists: {player?.stats?.assists ?? '—'}</li>
                        <li>GPA: {player?.gpa ?? '—'}</li>
                      </ul>
                    </div>
                    <label className="flex items-start gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600"
                        checked={statsForm.attested}
                        onChange={(e) => setStatsForm((prev) => ({ ...prev, attested: e.target.checked }))}
                      />
                      <span>I certify that the stats above are accurate and can be reviewed by Portal staff.</span>
                    </label>
                    <label className="block text-sm text-gray-700">
                      <span className="font-medium">Supporting file URLs (optional)</span>
                      <textarea
                        rows={3}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-400 focus:ring-0"
                        placeholder="Paste any highlight links, transcripts, or proof (one per line)"
                        value={statsForm.supportingFiles}
                        onChange={(e) => setStatsForm((prev) => ({ ...prev, supportingFiles: e.target.value }))}
                      />
                    </label>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleSubmitStats}
                        disabled={statsSubmitting}
                        className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60"
                      >
                        {statsSubmitting ? 'Submitting…' : 'Submit for review'}
                      </button>
                    </div>
                  </div>
                )}
                {currentStep >= 3 && (
                  <div className="mt-4 space-y-3 text-sm text-gray-700">
                    {status === 'in_review' && (
                      <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                        Your stats are under review. We’ll notify you once they’re approved.
                      </div>
                    )}
                    {status === 'verified' && (
                      <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        Congrats! Your profile is verified. Keep your stats current to maintain this badge.
                      </div>
                    )}
                    {status === 'needs_updates' && (
                      <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        Reviewers requested updates. Please update your stats and resubmit.
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex justify-end border-t border-gray-100 px-5 py-3">
            <button onClick={onClose} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
