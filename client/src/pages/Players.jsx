import { useNavigate } from 'react-router-dom'
import {
  AcademicCapIcon,
  CheckCircleIcon,
  VideoCameraIcon,
  ArrowTrendingUpIcon,
  ClipboardDocumentListIcon,
  InboxStackIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  TrophyIcon,
  SparklesIcon,
  FaceSmileIcon,
} from '@heroicons/react/24/outline'

const profileHighlights = [
  {
    title: 'Profile studio',
    Icon: VideoCameraIcon,
    description: 'Add highlight films, position clips, and measurable stats so recruiters see more than a single reel.',
  },
  {
    title: 'Academic snapshot',
    Icon: AcademicCapIcon,
    description: 'Track GPA, eligibility, and budget expectations to guide the right schools your way.',
  },
  {
    title: 'Verified badges',
    Icon: ShieldCheckIcon,
    description: 'Progress through Sportall verification—email, phone, stats—to unlock recruiter-only filters.',
  },
]

const trustPillars = [
  'NJCAA coach feedback is linked directly to your profile.',
  'Each note is tied to a program so recruiters know who stands behind the evaluation.',
  'Admin reviewers add another layer of validation for high-visibility transfers.',
]

const readinessSteps = [
  { label: 'Profile basics', detail: 'Complete your athletic + academic summary.' },
  { label: 'Coach validation', detail: 'Your JUCO coach links and confirms fit.' },
  { label: 'Stats & media', detail: 'Upload season stats, key metrics, and film.' },
  { label: 'Verification', detail: 'Clear Sportall’s checklist to earn the verified badge.' },
  { label: 'Recruiter outreach', detail: 'Show up in advanced searches with context-rich notes.' },
]

const toolkit = [
  {
    title: 'Interest alerts',
    copy: 'Know when NCAA/NAIA staffs favorite or view your profile so you can prep film and responses.',
    Icon: InboxStackIcon,
  },
  {
    title: 'Transfer planning',
    copy: 'Set target timelines, note scholarship needs, and keep progress visible for coaches and family.',
    Icon: ArrowTrendingUpIcon,
  },
  {
    title: 'Network bridge',
    copy: 'Message recruiters with full context or let your JUCO coach introduce you directly.',
    Icon: UserGroupIcon,
  },
  {
    title: 'Recruiter-facing dossier',
    copy: 'Export a clean PDF snapshot for official visits, compliance packets, or boosters.',
    Icon: ClipboardDocumentListIcon,
  },
]

const spotlightStories = [
  {
    name: 'Jaylen Martin',
    role: 'Forward · Class of 2024',
    transfer: 'NJCAA → NCAA D2',
    highlight: '3 official visits after coach validation went live.',
  },
  {
    name: 'Coach Ramirez',
    role: 'Head Coach · Coastal JUCO',
    transfer: '18 athletes verified on Sportall',
    highlight: 'Shared JUCO notes cut recruiter follow-up by 50%.',
  },
  {
    name: 'Coach Ellis',
    role: 'Recruiting Coordinator · NCAA D2',
    transfer: 'Favorited 75+ Sportall profiles',
    highlight: 'Advanced filters surfaced ready-to-transfer midfielders.',
  },
]

export default function Players() {
  const navigate = useNavigate()

  return (
    <main className="bg-white text-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-900 text-white">
        <div aria-hidden className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/40 via-gray-900 to-emerald-500/40" />
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25), transparent 55%)' }} />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 80% 0%, rgba(255,255,255,0.3), transparent 45%)' }} />
        </div>
        <div className="relative mx-auto flex max-w-5xl flex-col gap-6 px-6 py-16 text-center md:py-24 md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-orange-200">NJCAA players</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Take your next step with confidence.</h1>
          <p className="text-sm leading-relaxed text-gray-100 sm:text-base md:text-lg">
            Build a verified profile, get real feedback from your JUCO coach, and appear in NCAA / NAIA searches the moment you’re ready.
            Sportall keeps your story polished and your transfer plan on track.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate('/signup/player')}
              className="inline-flex items-center justify-center rounded-md bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              Build my profile
            </button>
            <button
              type="button"
              onClick={() => navigate('/players/directory')}
              className="inline-flex items-center justify-center rounded-md border border-white/40 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/10"
            >
              Preview directory
            </button>
          </div>
          <div className="grid gap-4 text-left text-sm text-white/80 sm:grid-cols-3">
            {[
              { label: 'Verified player profiles', value: '1,200+' },
              { label: 'Programs scouting', value: '300+' },
              { label: 'Average time to offers', value: '≈ 60 days' },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/20 bg-white/10 px-4 py-3 shadow-inner backdrop-blur transition hover:border-white/40">
                <p className="text-xl font-semibold text-white">{item.value}</p>
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Peek inside */}
      <section className="bg-gray-50 py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-[1.2fr,0.8fr] md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
                <SparklesIcon className="h-4 w-4 text-orange-500" aria-hidden />
                Recruiter view
              </div>
              <h2 className="mt-4 text-3xl font-bold text-gray-900">Show recruiters exactly what they need.</h2>
              <p className="mt-2 text-sm text-gray-600">
                Sportall’s player dossier mirrors the data points NCAA/NAIA staffs use when vetting transfers. Highlighted
                sections refresh as soon as you update film, GPA, or notes, so you never re-send PDFs.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 text-orange-500" aria-hidden />
                  <span>Snapshot: academic status, eligibility clock, scholarship budget.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 text-orange-500" aria-hidden />
                  <span>Coaches tab: JUCO evaluations, strength notes, and response logs.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 text-orange-500" aria-hidden />
                  <span>Film stack: prioritized reels with context (opponent, date, result).</span>
                </li>
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-[28px] border border-gray-100 bg-gray-900/90 p-6 text-white shadow-2xl">
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.4), transparent 50%)' }} />
              <div className="relative space-y-4">
                <div className="rounded-2xl bg-white/10 p-4 shadow-inner">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-gray-300">
                    <span>Player dossier</span>
                    <span>Verified</span>
                  </div>
                  <h3 className="mt-1 text-xl font-semibold text-white">Jordan Reyes · Midfielder</h3>
                  <p className="text-sm text-gray-200">GPA 3.4 · Immediate Impact · Budget $40k</p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-300">JUCO coach note</p>
                  <p className="mt-1 text-sm text-gray-100">
                    “Leader on and off the field—first touch and vision stand out. Ready for NCAA tempo.”
                  </p>
                  <p className="mt-2 text-xs text-gray-400">Coach Ramirez · Coastal JUCO</p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-xs text-gray-300">
                    <span>Film queue</span>
                    <span>Updated 2d ago</span>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-gray-100">
                    {['vs North Ridge (2 goals)', 'Combine highlights', 'Training session clips'].map((clip) => (
                      <div key={clip} className="rounded-lg bg-black/30 px-3 py-2">{clip}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile highlights */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-emerald-50 py-14">
        <div aria-hidden className="pointer-events-none absolute -left-20 top-10 h-40 w-40 rounded-full bg-orange-200/40 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Build it once</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Your verified digital showcase</h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm text-gray-600 sm:text-base">
              Sportall pulls together the details recruiters ask for—film, academics, budget, and goals—so you can send a single link with everything.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {profileHighlights.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-white/50 bg-white/90 p-6 shadow-lg ring-1 ring-black/5 backdrop-blur"
              >
                <span className="inline-flex rounded-2xl bg-orange-50/80 p-3 text-orange-600 shadow-inner">
                  <item.Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Trust network */}
      <section className="py-14">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-[32px] border border-gray-900 bg-gray-950/95 p-8 text-white shadow-2xl ring-1 ring-white/10">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
              <ShieldCheckIcon className="h-4 w-4" aria-hidden />
              Coach-backed trust
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white">Let your coaches speak for you</h2>
            <p className="mt-2 text-sm text-gray-300">
              When your JUCO coach updates your Sportall profile, their notes, ratings, and eligibility confirmations follow you everywhere.
              Recruiters know exactly who is vouching for your game.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-gray-200">
              {trustPillars.map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 text-emerald-400" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Readiness steps */}
      <section className="bg-gradient-to-br from-white via-gray-50 to-gray-100 py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Transfer readiness</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">Know exactly what’s next</h2>
            <p className="mt-3 text-sm text-gray-600 sm:text-base">
              Your dashboard shows each step toward recruiter-ready status. No spreadsheets, no guesswork.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {readinessSteps.map((step, index) => (
              <div key={step.label} className="rounded-3xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-200">
                <span className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 text-base font-semibold text-gray-900">{step.label}</h3>
                <p className="mt-1 text-sm text-gray-600">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Toolkit */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Player toolkit</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">Everything you need in one workspace</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {toolkit.map((tool) => (
              <article key={tool.title} className="relative overflow-hidden rounded-3xl border border-white bg-white/90 p-6 shadow-lg ring-1 ring-black/5">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(255,165,0,0.4), transparent 50%)' }} />
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex rounded-2xl bg-orange-50/80 p-3 text-orange-600 shadow-inner">
                      <tool.Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">{tool.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">{tool.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Spotlight stories */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Spotlight</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">Proof the process works</h2>
            <p className="mt-3 text-sm text-gray-600 sm:text-base">
              Athletes and coaches across every division are already using Sportall to speed up transfers.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {spotlightStories.map((story) => (
              <article key={story.name} className="rounded-3xl border border-gray-100 bg-gray-50 p-6 shadow-inner">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
                  <TrophyIcon className="h-4 w-4 text-orange-500" aria-hidden />
                  {story.transfer}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-orange-50 text-orange-500">
                    <FaceSmileIcon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{story.name}</h3>
                    <p className="text-sm text-gray-500">{story.role}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-700">{story.highlight}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-orange-500 via-orange-400 to-emerald-400 py-12 text-white">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/80">Ready when you are</p>
          <h2 className="text-3xl font-bold tracking-tight">Turn your JUCO season into four-year offers.</h2>
          <p className="text-sm text-white/90 sm:text-base">
            Join Sportall to stay organized, prove your value, and match with programs actively recruiting your position.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => navigate('/signup/player')}
              className="inline-flex items-center justify-center rounded-md bg-white px-5 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:bg-white/90"
            >
              Create my account
            </button>
            <button
              type="button"
              onClick={() => navigate('/announcements')}
              className="inline-flex items-center justify-center rounded-md border border-white px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/10"
            >
              See recent updates
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
