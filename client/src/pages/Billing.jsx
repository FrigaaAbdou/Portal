import { useEffect, useMemo, useState } from 'react'
import AccountLayout from '../components/layout/AccountLayout'
import { createBillingPortalSession, fetchSubscriptionInfo } from '../lib/api'
import {
  ShieldCheckIcon,
  ClockIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

const ACTIVE_STATUSES = new Set(['active', 'trialing'])

export default function Billing() {
  const [loadingPortal, setLoadingPortal] = useState(false)
  const [portalError, setPortalError] = useState('')
  const [subscription, setSubscription] = useState(null)
  const [loadingSubscription, setLoadingSubscription] = useState(false)
  const [subscriptionError, setSubscriptionError] = useState('')

  useEffect(() => {
    let active = true
    setLoadingSubscription(true)
    setSubscriptionError('')
    fetchSubscriptionInfo()
      .then((info) => {
        if (!active) return
        setSubscription(info || null)
      })
      .catch((err) => {
        if (!active) return
        setSubscriptionError(err?.message || 'Failed to load billing info')
      })
      .finally(() => {
        if (active) setLoadingSubscription(false)
      })
    return () => { active = false }
  }, [])

  const planLabels = useMemo(() => {
    const labels = {}
    if (import.meta.env.VITE_STRIPE_PRICE_MONTHLY) {
      labels[import.meta.env.VITE_STRIPE_PRICE_MONTHLY] = 'Monthly plan'
    }
    if (import.meta.env.VITE_STRIPE_PRICE_ANNUAL) {
      labels[import.meta.env.VITE_STRIPE_PRICE_ANNUAL] = 'Annual plan'
    }
    return labels
  }, [])

  const subscriptionStatus = (subscription?.status || 'none').toLowerCase()
  const planLabel = subscription?.priceId
    ? planLabels[subscription.priceId] || `Price ${subscription.priceId}`
    : 'No active plan'
  const nextRenewal = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, { dateStyle: 'medium' })
    : '—'
  const statusLabelMap = {
    active: 'Active',
    trialing: 'Trialing',
    past_due: 'Past due',
    canceled: 'Canceled',
    unpaid: 'Unpaid',
    none: 'No subscription',
  }
  const statusLabel = statusLabelMap[subscriptionStatus] || subscriptionStatus || 'N/A'
  const hasActiveSubscription = ACTIVE_STATUSES.has(subscriptionStatus)

  const openPortal = async () => {
    setPortalError('')
    setLoadingPortal(true)
    try {
      const url = await createBillingPortalSession()
      if (url) {
        window.location.href = url
      } else {
        throw new Error('Portal link missing')
      }
    } catch (err) {
      setPortalError(err?.message || 'Failed to open billing portal')
      setLoadingPortal(false)
    }
  }

  const planCard = (
    <div className="rounded-[32px] border border-white bg-white/90 p-6 shadow-xl ring-1 ring-black/5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Subscription overview</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">{planLabel}</h2>
          <p className="text-sm text-gray-600">Use the Stripe customer portal to change plans or download invoices.</p>
        </div>
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${hasActiveSubscription ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
          <ShieldCheckIcon className="mr-1 h-4 w-4" />
          {statusLabel}
        </span>
      </div>
      <div className="mt-6 grid gap-4 text-sm text-gray-700 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">Next renewal</p>
          <p className="mt-1 flex items-center gap-2 text-base font-semibold text-gray-900">
            <ClockIcon className="h-5 w-5 text-orange-500" />
            {nextRenewal}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">Customer ID</p>
          <p className="mt-1 font-mono text-xs text-gray-600">{subscription?.stripeCustomerId || '—'}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 text-sm text-gray-700 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">Support contact</p>
          <p className="mt-1 text-base font-semibold text-gray-900">billing@sportall.app</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">Portal link</p>
          <p className="mt-1 text-xs text-gray-500">Open Stripe portal to download invoices or update cards.</p>
        </div>
      </div>
      {subscriptionError && (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <ExclamationTriangleIcon className="mr-2 inline h-4 w-4" />
          {subscriptionError}
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={openPortal}
          disabled={loadingPortal || !hasActiveSubscription}
          className="inline-flex items-center rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingPortal ? 'Opening portal…' : 'Manage subscription'}
        </button>
        <a
          href="/pricing"
          className="inline-flex items-center rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          Change plan
        </a>
      </div>
    </div>
  )

  const quickActionsCard = (
    <div className="rounded-[32px] border border-white bg-white/90 p-6 shadow-xl ring-1 ring-black/5">
      <div className="flex items-center gap-2 text-gray-900">
        <SparklesIcon className="h-5 w-5 text-orange-500" />
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Quick actions</p>
      </div>
      <ul className="mt-4 space-y-3 text-sm text-gray-700">
        <li className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
          <p className="font-semibold text-gray-900">Share invoices</p>
          <p className="text-xs text-gray-500">Forward billing emails to finance or export from the portal.</p>
        </li>
        <li className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
          <p className="font-semibold text-gray-900">Invite teammates</p>
          <p className="text-xs text-gray-500">Keep assistants informed so shortlists and payments stay aligned.</p>
        </li>
        <li className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
          <p className="font-semibold text-gray-900">Bookmark support</p>
          <p className="text-xs text-gray-500">billing@sportall.app responds within 1 business day.</p>
        </li>
      </ul>
      <p className="mt-4 text-xs text-gray-500">Need a walkthrough? Reach out at hello@sportall.app.</p>
    </div>
  )

  return (
    <AccountLayout title="Billing">
      {loadingSubscription && !subscription ? (
        <p className="text-sm text-gray-600">Loading subscription details…</p>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            {planCard}
            {quickActionsCard}
          </div>
          <div className="rounded-[32px] border border-white bg-white/90 p-6 shadow-xl ring-1 ring-black/5">
            <div className="flex items-center gap-3 text-gray-900">
              <CreditCardIcon className="h-6 w-6 text-orange-500" />
              <h3 className="text-lg font-semibold">Need help with billing?</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">Use the Stripe portal to update payment methods, or email billing@sportall.app if something looks off.</p>
            {portalError && (
              <p className="mt-2 text-sm text-rose-600">
                <ExclamationTriangleIcon className="mr-2 inline h-4 w-4" />
                {portalError}
              </p>
            )}
          </div>
        </div>
      )}
    </AccountLayout>
  )
}
