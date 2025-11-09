import { Link, useSearchParams } from 'react-router-dom'

export default function BillingCanceled() {
  const [searchParams] = useSearchParams()
  const roleParam = (searchParams.get('role') || '').toLowerCase()
  const isCoach = roleParam === 'coach' || roleParam === 'recruiter'

  const recoverySteps = isCoach
    ? [
        'Your card was not charged. Reopen checkout from Pricing when you’re ready.',
        'Need another approval? Invite your compliance or ops lead into Sportall so they can review before paying.',
        'Still deciding? Talk to our team for a walkthrough that fits your staff.',
      ]
    : [
        'No payment was taken. You can resume checkout any time from Pricing.',
        'Double-check your card or talk with your coach if you need help covering the subscription.',
        'Want to see what’s new before trying again? Head to Announcements.',
      ]

  return (
    <main className="min-h-[100dvh] bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-16">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-[40px] border border-white bg-white/90 p-10 text-center shadow-2xl backdrop-blur">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600 shadow-lg">
          <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="absolute inset-0 animate-ping rounded-full bg-gray-300/40" aria-hidden />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-500">Checkout paused</p>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">We saved your spot.</h1>
          <p className="mt-3 text-sm text-gray-600">
            Whether you’re double-checking budgets or just need more time, you can always pick up right where you left off.
          </p>
        </div>
        <div className="rounded-3xl border border-gray-100 bg-gradient-to-r from-white to-gray-50 p-6 text-left text-sm text-gray-700">
          <p className="font-semibold text-gray-900">Next steps</p>
          <ul className="mt-3 space-y-2">
            {recoverySteps.map((step) => (
              <li key={step} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gray-400" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/pricing"
            className="inline-flex justify-center rounded-md bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            Resume checkout
          </Link>
          <Link
            to={isCoach ? '/announcements' : '/profile'}
            className="inline-flex justify-center rounded-md border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            {isCoach ? 'See product updates' : 'Review my profile'}
          </Link>
        </div>
      </div>
    </main>
  )
}
