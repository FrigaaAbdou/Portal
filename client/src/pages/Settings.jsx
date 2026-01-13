import { useEffect, useMemo, useState } from 'react'
import AccountLayout from '../components/layout/AccountLayout'
import PhoneInput from '../components/ui/PhoneInput'
import {
  confirmPhoneVerification,
  fetchVerificationStatus,
  sendPhoneVerification,
} from '../lib/api'

export default function Settings() {
  const role = (localStorage.getItem('role') || '').toLowerCase()
  const isPlayer = role === 'player'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [phoneValue, setPhoneValue] = useState('')
  const [phoneCode, setPhoneCode] = useState('')
  const [phoneVerifiedAt, setPhoneVerifiedAt] = useState(null)
  const [lastSentTo, setLastSentTo] = useState('')
  const [sent, setSent] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [sendLoading, setSendLoading] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    if (!isPlayer) {
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    fetchVerificationStatus()
      .then((res) => {
        if (!active) return
        const verification = res?.verification || null
        const phone = verification?.phone?.number || ''
        const verifiedAt = res?.phoneVerifiedAt || verification?.phone?.verifiedAt || null
        setPhoneValue(phone)
        setLastSentTo(phone)
        setSent(Boolean(verification?.phone?.lastSentAt && !verifiedAt))
        setPhoneVerifiedAt(verifiedAt)
      })
      .catch((err) => {
        if (!active) return
        if (err?.status === 404) {
          setError('Finish your player profile to enable phone verification.')
          return
        }
        setError(err?.message || 'Failed to load verification status')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [isPlayer])

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const statusLabel = phoneVerifiedAt ? 'Verified' : 'Optional'
  const statusTone = phoneVerifiedAt ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
  const verifiedDate = useMemo(() => {
    if (!phoneVerifiedAt) return ''
    return new Date(phoneVerifiedAt).toLocaleDateString()
  }, [phoneVerifiedAt])

  const handleSend = async () => {
    if (!phoneValue) {
      setError('Phone number is required.')
      return
    }
    setSendLoading(true)
    setError('')
    try {
      await sendPhoneVerification(phoneValue)
      setLastSentTo(phoneValue)
      setSent(true)
      setCooldown(60)
    } catch (err) {
      setError(err?.message || 'Failed to send SMS code')
      if (err?.status === 429) {
        const retry = err?.data?.retryAfter ? Number(err.data.retryAfter) : 60
        setCooldown(retry)
      }
    } finally {
      setSendLoading(false)
    }
  }

  const handleConfirm = async () => {
    if (!phoneCode) {
      setError('Enter the 6-digit code we sent you.')
      return
    }
    setConfirmLoading(true)
    setError('')
    try {
      await confirmPhoneVerification(phoneCode)
      setPhoneVerifiedAt(new Date().toISOString())
      setPhoneCode('')
      setSent(false)
    } catch (err) {
      setError(err?.message || 'Invalid or expired code')
    } finally {
      setConfirmLoading(false)
    }
  }

  return (
    <AccountLayout title="Settings">
      <div className="space-y-6">
        {isPlayer && (
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Phone verification</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Optional, but verifying unlocks direct contact features and adds trust signals for recruiters.
                </p>
              </div>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusTone}`}>
                {statusLabel}
              </span>
            </div>

            {loading ? (
              <div className="mt-4 h-24 animate-pulse rounded-lg bg-gray-100" />
            ) : (
              <div className="mt-4 space-y-4">
                {error && (
                  <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {error}
                  </div>
                )}
                {phoneVerifiedAt ? (
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    Phone verified {verifiedDate ? `on ${verifiedDate}` : ''}. You can update your number anytime.
                  </div>
                ) : (
                  <div className="rounded-md border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-700">
                    Verify later if you are traveling. You can still use Sportall while unverified, but direct contact is locked until verification.
                  </div>
                )}

                <div className="grid gap-4 lg:grid-cols-[1.3fr,1fr]">
                  <div className="space-y-4">
                    <PhoneInput
                      label="Phone number"
                      value={phoneValue}
                      onChange={(val) => setPhoneValue(val)}
                      name="phoneVerification"
                    />
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleSend}
                        disabled={sendLoading || cooldown > 0 || !phoneValue}
                        className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60"
                      >
                        {sendLoading ? 'Sending...' : phoneVerifiedAt ? 'Send new code' : 'Send code'}
                      </button>
                      {cooldown > 0 && (
                        <span className="text-xs text-gray-500">{cooldown}s before retry</span>
                      )}
                    </div>
                    {sent && lastSentTo && (
                      <p className="text-xs text-gray-500">Code sent to {lastSentTo}. Enter it to finish verification.</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm text-gray-700">
                      <span className="font-medium">SMS code</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-400 focus:ring-0"
                        placeholder="123456"
                        value={phoneCode}
                        onChange={(e) => setPhoneCode(e.target.value)}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      disabled={confirmLoading || phoneCode.length === 0}
                      className="w-full rounded-md border border-gray-900 bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black disabled:opacity-60"
                    >
                      {confirmLoading ? 'Confirming...' : 'Confirm phone'}
                    </button>
                    <p className="text-xs text-gray-500">
                      You can verify later; the rest of Sportall stays available.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Account preferences</h2>
          <p className="mt-2 text-sm text-gray-600">
            Profile controls and notification preferences are coming soon. In the meantime you can manage your subscription from the Billing tab in the sidebar.
          </p>
        </div>
      </div>
    </AccountLayout>
  )
}
