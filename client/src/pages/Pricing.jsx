import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { getToken, createCheckoutSession, fetchSubscriptionInfo } from '../lib/api'

function PlanCard({ name, price, period, highlight, perks, onSelect, loading, badge }) {
  return (
    <div className={`relative flex h-full flex-col rounded-3xl border bg-white/90 p-6 shadow-xl ring-1 ring-black/5 backdrop-blur ${highlight ? 'border-orange-200' : 'border-gray-100'}`}>
      {highlight && (
        <span className="absolute -top-3 right-5 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {badge || 'Most popular'}
        </span>
      )}
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
        <p className="mt-1 text-sm text-gray-500">Everything you need to stay visible and in control.</p>
        <div className="mt-5 flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-gray-900">${price}</span>
          <span className="text-sm text-gray-500">/{period}</span>
        </div>
      </div>
      <ul className="mt-6 space-y-3 text-sm text-gray-700">
        {perks.map((perk) => (
          <li key={perk} className="flex items-start gap-3">
            <CheckCircleIcon className="mt-0.5 h-5 w-5 text-orange-500" aria-hidden />
            <span>{perk}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onSelect}
        disabled={loading}
        className={`mt-8 inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition ${
          highlight ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-900 hover:bg-gray-950'
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {loading ? 'Redirecting…' : 'Continue'}
      </button>
    </div>
  )
}

export default function Pricing() {
  const navigate = useNavigate()
  const authed = Boolean(getToken())
  const [loadingPlan, setLoadingPlan] = useState('')
  const [error, setError] = useState('')
  const [subscription, setSubscription] = useState(null)
  const [subscriptionError, setSubscriptionError] = useState('')
  const [checkingSubscription, setCheckingSubscription] = useState(false)
  const monthlyPriceId = import.meta.env.VITE_STRIPE_PRICE_MONTHLY || undefined
  const annualPriceId = import.meta.env.VITE_STRIPE_PRICE_ANNUAL || undefined

  useEffect(() => {
    if (!authed) {
      setSubscription(null)
      setSubscriptionError('')
      return
    }
    let active = true
    setCheckingSubscription(true)
    setSubscriptionError('')
    fetchSubscriptionInfo()
      .then((info) => {
        if (!active) return
        setSubscription(info || null)
      })
      .catch((err) => {
        if (!active) return
        setSubscriptionError(err?.message || 'Failed to load subscription status')
      })
      .finally(() => {
        if (active) setCheckingSubscription(false)
      })
    return () => { active = false }
  }, [authed])

  const activeStatuses = new Set(['active', 'trialing'])
  const hasActiveSubscription = authed && activeStatuses.has((subscription?.status || '').toLowerCase())

  const startCheckout = async (priceId, label) => {
    if (!authed) {
      navigate('/login')
      return
    }
    if (!priceId && label === 'annual') {
      setError('Annual plan is not available at the moment. Please try again later.')
      return
    }
    setLoadingPlan(label)
    setError('')
    try {
      const url = await createCheckoutSession(priceId)
      if (url) {
        window.location.href = url
      } else {
        throw new Error('Missing checkout URL')
      }
    } catch (err) {
      setError(err?.message || 'Failed to start checkout')
      setLoadingPlan('')
    }
  }

  const tiers = [
    {
      name: 'Monthly',
      price: '29.99',
      period: 'month',
      highlight: false,
      key: 'monthly',
      perks: [
        'Full profile with video, stats, academics',
        'Visibility across NCAA, NAIA, and JUCO staffs',
        'Interest alerts + messaging inbox',
        'Track transfer readiness milestones',
      ],
      action: () => startCheckout(monthlyPriceId, 'monthly'),
    },
    {
      name: 'Annual',
      price: '79.99',
      period: 'year',
      highlight: true,
      key: 'annual',
      badge: 'Save 55%',
      perks: [
        'All monthly benefits',
        'Priority placement in recruiter boards',
        'Coach-to-coach introductions',
        'Concierge support during transfer windows',
      ],
      action: () => startCheckout(annualPriceId, 'annual'),
    },
  ]

  return (
    <main className="bg-white text-gray-900">
      <section className="relative overflow-hidden bg-gray-900 text-white">
        <div aria-hidden className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/40 via-gray-900 to-emerald-500/40" />
          <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.2), transparent 45%)' }} />
        </div>
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-orange-200">Simple plans</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Invest in the transfer you want</h1>
          <p className="mt-4 max-w-2xl text-sm text-white/80 sm:text-base">
            Every subscription unlocks verified exposure, recruiter analytics, and season-long support. Upgrade or cancel anytime.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-left text-sm text-white/80">
            <div>
              <p className="text-2xl font-semibold text-white">1,200+</p>
              <p>Verified athletes</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">300+</p>
              <p>Programs recruiting</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">97%</p>
              <p>Renewal satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        {checkingSubscription && (
          <div className="mb-8 rounded-2xl border border-white/60 bg-white px-5 py-4 text-sm text-gray-600 shadow-sm">
            Checking your subscription status…
          </div>
        )}

        {hasActiveSubscription ? (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-6 py-8 text-center shadow-inner">
            <h2 className="text-2xl font-semibold text-gray-900">You already have an active subscription</h2>
            <p className="mt-2 text-sm text-gray-700">Manage your billing preferences anytime from settings.</p>
            <Link
              to="/settings"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Go to settings
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {tiers.map((tier) => (
              <PlanCard
                key={tier.name}
                name={tier.name}
                price={tier.price}
                period={tier.period}
                highlight={tier.highlight}
                badge={tier.badge}
                perks={tier.perks}
                onSelect={tier.action}
                loading={loadingPlan === tier.key}
              />
            ))}
          </div>
        )}

        {subscriptionError && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{subscriptionError}</div>
        )}
        {error && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        )}

        <div className="mt-10 flex flex-col gap-4 rounded-3xl border border-gray-100 bg-gray-50 p-6 text-sm text-gray-700 shadow-inner sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="h-8 w-8 text-emerald-600" aria-hidden />
            <div>
              <p className="text-base font-semibold text-gray-900">Transfer-ready guarantee</p>
              <p>If you don’t receive meaningful recruiter feedback within 60 days, we’ll credit a month free.</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Prices in USD · Cancel anytime</p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Questions</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Your billing questions, answered</h2>
          </div>
          <div className="mt-10 space-y-4">
            {[
              {
                q: 'Can I switch plans later?',
                a: 'Yes. Upgrading or downgrading happens instantly and any unused time is pro-rated automatically through Stripe.',
              },
              {
                q: 'Do coaches need to pay?',
                a: 'JUCO coaches can evaluate and invite their roster at no cost. NCAA/NAIA staffs pay for recruiter plans separately.',
              },
              {
                q: 'Is payment information secure?',
                a: 'All transactions are processed via Stripe. We never store full card numbers or sensitive billing data on Portal servers.',
              },
              {
                q: 'What happens after I subscribe?',
                a: 'You’ll receive a confirmation email, unlock premium filters, and gain access to concierge support inside the dashboard.',
              },
            ].map(({ q, a }) => (
              <details key={q} className="group rounded-3xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-gray-900">
                  {q}
                  <span className="ml-3 text-gray-500 transition group-open:rotate-45">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-gray-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
