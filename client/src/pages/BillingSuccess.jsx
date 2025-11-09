import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

export default function BillingSuccess() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const roleParam = (searchParams.get('role') || '').toLowerCase()
  const isCoach = roleParam === 'coach' || roleParam === 'recruiter'

  useEffect(() => {
    if (sessionId) {
      console.info('[Stripe] Checkout session completed', sessionId)
    }
  }, [sessionId])

  return (
    <main className="min-h-[100dvh] bg-gradient-to-br from-orange-50 via-white to-emerald-50 px-4 py-16">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-[40px] border border-white bg-white/90 p-10 text-center shadow-2xl backdrop-blur">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-orange-400 text-white shadow-lg">
          <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" aria-hidden />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-orange-500">Welcome to the premium sideline</p>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">Thank you for trusting Sportall.</h1>
          <p className="mt-3 text-sm text-gray-600">
            You just unlocked the fastest way to move between NJCAA and NCAA/NAIA programs. We’ll keep working behind the scenes while you focus on performance.
          </p>
          {sessionId && (
            <p className="mt-2 text-xs text-gray-400">
              Checkout session ID: <span className="font-mono">{sessionId}</span>
            </p>
          )}
        </div>
        <div className="grid gap-4 text-left text-sm text-gray-600 sm:grid-cols-3">
          {[
            { title: 'Priority discovery', body: 'Appear at the top of recruiter filters with verified badges.' },
            { title: 'Concierge access', body: 'Need help? Our team will answer within one business day.' },
            { title: 'Billing portal', body: 'Manage invoices, switch plans, or update cards anytime.' },
          ].map((perk) => (
            <article key={perk.title} className="rounded-3xl border border-gray-100 bg-gray-50/80 p-4 shadow-inner">
              <h3 className="text-base font-semibold text-gray-900">{perk.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{perk.body}</p>
            </article>
          ))}
        </div>
        <div className="rounded-3xl border border-orange-100 bg-gradient-to-r from-orange-100 to-emerald-100 p-6 text-left text-sm text-gray-700">
          <p className="font-semibold text-gray-900">What’s next?</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {(isCoach
              ? [
                  { title: 'Set filters', copy: 'Head to the player directory and save your new premium views.' },
                  { title: 'Loop in staff', copy: 'Invite assistants so shortlists and notes stay in sync.' },
                  { title: 'Stay informed', copy: 'Follow announcements for product drops & sponsor updates.' },
                ]
              : [
                  { title: 'Update profile', copy: 'Add new film and stats so recruiters see your latest work.' },
                  { title: 'Get verified', copy: 'Finish the verification checklist to surface in premium filters.' },
                  { title: 'Track progress', copy: 'Use the dashboard timeline to plan outreach with your coach.' },
                ]).map((item) => (
              <article key={item.title} className="rounded-2xl border border-white/70 bg-white/70 p-3 text-gray-800 shadow-inner">
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="text-xs text-gray-600">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to={isCoach ? '/players/directory' : '/dashboard'}
            className="inline-flex justify-center rounded-md bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            {isCoach ? 'Open player directory' : 'Open my dashboard'}
          </Link>
          <Link
            to={isCoach ? '/settings' : '/profile'}
            className="inline-flex justify-center rounded-md border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            {isCoach ? 'Manage subscription' : 'Update profile'}
          </Link>
        </div>
      </div>
    </main>
  )
}
