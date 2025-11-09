import { useNavigate } from 'react-router-dom'
import {
  FunnelIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  Squares2X2Icon,
  StarIcon,
  AdjustmentsHorizontalIcon,
  InboxStackIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

const filterHighlights = [
  { label: 'Positions', value: 'Forward · Midfielder · Defender' },
  { label: 'GPA range', value: '3.0 – 4.0' },
  { label: 'Budget match', value: '$20k · $40k · $60k' },
  { label: 'Verification', value: 'Verified · Stats pending' },
]

const comparisonPoints = [
  {
    title: 'Without Sportall',
    items: [
      'Manual spreadsheets & endless DMs',
      'Unverified stats and outdated GPA info',
      'Hard to track which coach is vouching for each athlete',
    ],
  },
  {
    title: 'With Sportall',
    items: [
      'Filter-ready directory with live data',
      'JUCO coach notes + admin verification history',
      'Shared context, messaging, and billing in one workspace',
    ],
  },
]

const perks = [
  {
    title: 'Favorites & shortlists',
    description: 'Tag players as Immediate Impact, Hidden Gem, or Redshirt Target. Leave context for your staff.',
    Icon: StarIcon,
  },
  {
    title: 'Message center',
    description: 'Reach out with film requests or loop in JUCO coaches with one click.',
    Icon: InboxStackIcon,
  },
  {
    title: 'Billing perks',
    description: 'Active subscribers unlock alerts, priority messaging, and customer portal access.',
    Icon: CurrencyDollarIcon,
  },
]

const workflow = [
  { step: 'Search', detail: 'Apply filters for position, GPA, budget, and verification.' },
  { step: 'Assess', detail: 'Read JUCO coach notes, watch film, and review stats.' },
  { step: 'Favorite', detail: 'Tag prospects Immediate Impact, Hidden Gem, or Redshirt Target.' },
  { step: 'Message', detail: 'Reach out with film requests or invite JUCO staff into the thread.' },
  { step: 'Commit', detail: 'Sync billing + alerts so your staff never misses a signal.' },
]

export default function Recruiters() {
  const navigate = useNavigate()

  return (
    <main className="bg-white text-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-900 text-white">
        <div aria-hidden className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/40 via-gray-900 to-blue-500/40" />
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 80% 0%, rgba(255,255,255,0.35), transparent 45%)' }} />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(120deg, rgba(255,255,255,0.08) 0%, transparent 50%)' }} />
        </div>
        <div className="relative mx-auto flex max-w-5xl flex-col gap-6 px-6 py-16 text-center md:py-24 md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200">NCAA / NAIA recruiters</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Recruit smarter, faster, with higher certainty.</h1>
          <p className="text-sm leading-relaxed text-gray-100 sm:text-base md:text-lg">
            Scout verified NJCAA talent with trusted data, JUCO coach validation, and workflow tools designed for college staffs.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate('/signup/coach')}
              className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
            >
              Join Sportall
            </button>
            <button
              type="button"
              onClick={() => navigate('/players/directory')}
              className="inline-flex items-center justify-center rounded-md border border-white/40 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/10"
            >
              Preview directory
            </button>
          </div>
          <div className="grid gap-4 text-sm text-white/80 sm:grid-cols-3">
            {[
              { label: 'Verified players', value: '1,200+', detail: 'Updated weekly with new film' },
              { label: 'Active JUCO programs', value: '80+', detail: 'Coach-to-coach intros' },
              { label: 'Staff hours saved', value: '12 hrs / week', detail: 'vs manual outreach' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/30 bg-white/10 px-4 py-4 shadow-inner backdrop-blur transition hover:border-white/60">
                <p className="text-xl font-semibold text-white">{stat.value}</p>
                <p>{stat.label}</p>
                <p className="text-xs text-white/70">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-gray-50 py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-[1.1fr,0.9fr] md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
                <AdjustmentsHorizontalIcon className="h-4 w-4 text-orange-500" aria-hidden />
                Filters built for recruiting
              </div>
              <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">Zero in on fit within minutes.</h2>
              <p className="mt-2 text-sm text-gray-600">
                Sportall mirrors the filters teams actually use: position groups, GPA, budget, and verification status.
                Save views for your staff or export shortlists to share with assistants.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-700">
                <li>Tap into GPA brackets, eligibility notes, and coach-backed ratings.</li>
                <li>Budget chips keep scholarship math front and center.</li>
                <li>One click to view highlights, JUCO notes, and contact info.</li>
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white p-6 shadow-xl ring-1 ring-black/5">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(16,185,129,0.3), transparent 50%)' }} />
              <div className="relative space-y-4">
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Filter preview</p>
                  <div className="mt-3 rounded-xl bg-white px-3 py-3">
                    <span className="text-xs uppercase tracking-wide text-gray-400">Positions</span>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-gray-700">
                      {['Forward', 'Midfielder', 'Defender'].map((chip) => (
                        <span key={chip} className="rounded-full bg-gray-100 px-3 py-1">{chip}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 rounded-xl bg-white px-3 py-3">
                    <span className="text-xs uppercase tracking-wide text-gray-400">GPA</span>
                    <div className="mt-2">
                      <div className="h-2 rounded-full bg-gray-200">
                        <div className="h-2 rounded-full bg-emerald-500" style={{ width: '70%' }} />
                      </div>
                      <p className="mt-1 text-sm font-semibold text-gray-900">3.0 – 4.0</p>
                    </div>
                  </div>
                  <div className="mt-3 rounded-xl bg-white px-3 py-3">
                    <span className="text-xs uppercase tracking-wide text-gray-400">Budget</span>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-gray-700">
                      {['$20k', '$40k', '$60k'].map((chip) => (
                        <span key={chip} className="rounded-full border border-gray-200 px-3 py-1">{chip}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 rounded-xl bg-white px-3 py-3">
                    <span className="text-xs uppercase tracking-wide text-gray-400">Verification</span>
                    <p className="mt-1 text-sm font-semibold text-gray-900">Verified · Stats pending</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Results</span>
                    <span>48 matches</span>
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-gray-800">
                    {['Jordan Reyes · Immediate Impact', 'Trinity Miles · Hidden Gem', 'Andre Valdez · Redshirt Target'].map((player) => (
                      <div key={player} className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
                        {player}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-14 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Workflow</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">From search to signing in five steps.</h2>
            <p className="mt-3 text-sm text-gray-300 sm:text-base">Every stage keeps your staff aligned with JUCO coaches and Sportall verification.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {workflow.map((item, idx) => (
              <div key={item.step} className="rounded-3xl border border-white/15 bg-white/5 p-4 shadow-sm transition hover:-translate-y-1">
                <span className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-400">{String(idx + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 text-lg font-semibold text-white">{item.step}</h3>
                <p className="mt-2 text-sm text-gray-200">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Validation stack */}
      <section className="py-14">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-[32px] border border-gray-900 bg-gray-950/95 p-8 text-white shadow-2xl ring-1 ring-white/10">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
              <ShieldCheckIcon className="h-4 w-4" aria-hidden />
              Validation stack
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white">Know who’s vouching for each athlete.</h2>
            <p className="mt-2 text-sm text-gray-300">
              Sportall links PlayerProfile + CoachProfile + verification history so you can see exactly how solid the intel is before you pick up the phone.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                { title: 'Profile', description: 'Academic + athletic data, film, budget, preferences.' },
                { title: 'JUCO coach note', description: 'Ratings, eligibility status, and projections tied to real people.' },
                { title: 'Admin verification', description: 'Sportall reviewers confirm stats and documentation.' },
              ].map((layer) => (
                <div key={layer.title} className="rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-gray-100">
                  <h3 className="text-base font-semibold text-white">{layer.title}</h3>
                  <p className="mt-1">{layer.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Favorites and perks */}
      <section className="bg-gradient-to-br from-white via-gray-50 to-emerald-50 py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Shortlists & messaging</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">Keep your board organized and actionable.</h2>
          </div>
          <div className="mt-10 space-y-6">
            <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6 shadow-inner">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500">
                <p>Favorites</p>
                <p>Pin tags like Immediate Impact, Hidden Gem, Redshirt.</p>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {[{ name: 'Jaylen M. · Forward', tag: 'Immediate Impact' }, { name: 'Trinity Miles · Defender', tag: 'Hidden Gem' }, { name: 'Andre V. · Goalkeeper', tag: 'Redshirt Target' }].map((fav) => (
                  <div key={fav.name} className="rounded-xl border border-white bg-white px-4 py-3 text-sm text-gray-800 shadow-sm">
                    <p className="font-semibold">{fav.name}</p>
                    <p className="text-xs text-gray-500">Tag: {fav.tag}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {perks.map((perk) => (
                <article key={perk.title} className="rounded-3xl border border-white bg-white/90 p-6 shadow-lg ring-1 ring-black/5">
                  <span className="inline-flex rounded-2xl bg-orange-50/80 p-3 text-orange-600 shadow-inner">
                    <perk.Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">{perk.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{perk.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison strip */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {comparisonPoints.map((block) => (
              <article key={block.title} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
                  {block.title === 'Without Sportall' ? <Squares2X2Icon className="h-4 w-4" aria-hidden /> : <FunnelIcon className="h-4 w-4 text-orange-500" aria-hidden />}
                  {block.title}
                </div>
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircleIcon className={`mt-0.5 h-5 w-5 ${block.title === 'Without Sportall' ? 'text-gray-300' : 'text-orange-500'}`} aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Billing tie-in */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-[32px] border border-gray-900 bg-gray-950/95 p-8 text-white shadow-2xl ring-1 ring-white/15">
            <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
              <CurrencyDollarIcon className="h-4 w-4 text-orange-500" aria-hidden />
              Subscription perks
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white">Active subscribers stay steps ahead.</h2>
            <p className="mt-2 text-sm text-gray-300">
              Sync your Stripe subscription via Sportall’s billing endpoints to enable alerts, priority messaging, and the customer portal for your staff.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-gray-200">
              <li>Real-time notifications when athletes favorite you back.</li>
              <li>Billing portal access to update cards or change plans anytime.</li>
              <li>Usage reports so you can show ROI to your athletic department.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-emerald-500 via-orange-400 to-emerald-400 py-12 text-white">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/80">Run your board like a pro</p>
          <h2 className="text-3xl font-bold tracking-tight">Ready to upgrade your recruiting workflow?</h2>
          <p className="text-sm text-white/90 sm:text-base">
            Sportall keeps verified data, messaging, and billing in sync so your staff can focus on fit—not admin work.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => navigate('/pricing')}
              className="inline-flex items-center justify-center rounded-md bg-white px-5 py-2 text-sm font-semibold text-emerald-600 shadow-sm transition hover:bg-white/90"
            >
              View pricing
            </button>
            <button
              type="button"
              onClick={() => navigate('/announcements')}
              className="inline-flex items-center justify-center rounded-md border border-white px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/10"
            >
              Book a walkthrough
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
