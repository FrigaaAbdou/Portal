import { Link, useSearchParams } from 'react-router-dom'

const playerAdvantages = [
  {
    title: 'Recruiter visibility',
    body: 'Profiles with complete data surface higher in filters and shortlists.',
  },
  {
    title: 'Verified credibility',
    body: 'Email verification builds trust. Phone verification can be added later.',
  },
  {
    title: 'Highlight showcase',
    body: 'Share film links and updates so coaches see your best moments.',
  },
]

const coachAdvantages = [
  {
    title: 'Targeted search',
    body: 'Filter by position, GPA, budget, and division to find matches faster.',
  },
  {
    title: 'Favorites workflow',
    body: 'Save prospects, organize notes, and keep your pipeline clear.',
  },
  {
    title: 'JUCO collaboration',
    body: 'Exchange verified notes and reports across programs.',
  },
]

const playerNextSteps = [
  {
    title: 'Complete your profile',
    copy: 'Double-check academics, stats, and highlight links before sharing.',
  },
  {
    title: 'Finish verification',
    copy: 'Confirm your email now. Add phone verification later in Settings to boost trust.',
  },
  {
    title: 'Track interest',
    copy: 'Use your dashboard to monitor coach engagement and updates.',
  },
]

const coachNextSteps = [
  {
    title: 'Set recruiting filters',
    copy: 'Dial in positions, GPA, and budget to save targeted searches.',
  },
  {
    title: 'Build a shortlist',
    copy: 'Save top prospects and share notes with staff.',
  },
  {
    title: 'Invite teammates',
    copy: 'Bring assistants into your workflow with controlled access.',
  },
]

export default function SignupSuccess() {
  const [searchParams] = useSearchParams()
  const roleParam = (searchParams.get('role') || '').toLowerCase()
  const isCoach = roleParam === 'coach' || roleParam === 'recruiter'
  const roleLabel = isCoach ? 'Coach' : 'Player'
  const advantages = isCoach ? coachAdvantages : playerAdvantages
  const nextSteps = isCoach ? coachNextSteps : playerNextSteps

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
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-orange-500">Account created</p>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">Welcome to Sportall, {roleLabel}.</h1>
          <p className="mt-3 text-sm text-gray-600">
            Your account is ready. Log in to continue and unlock the tools designed for your role.
          </p>
        </div>
        <div className="grid gap-4 text-left text-sm text-gray-600 sm:grid-cols-3">
          {advantages.map((perk) => (
            <article key={perk.title} className="rounded-3xl border border-gray-100 bg-gray-50/80 p-4 shadow-inner">
              <h3 className="text-base font-semibold text-gray-900">{perk.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{perk.body}</p>
            </article>
          ))}
        </div>
        <div className="rounded-3xl border border-orange-100 bg-gradient-to-r from-orange-100 to-emerald-100 p-6 text-left text-sm text-gray-700">
          <p className="font-semibold text-gray-900">Recommended next steps</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {nextSteps.map((item) => (
              <article key={item.title} className="rounded-2xl border border-white/70 bg-white/70 p-3 text-gray-800 shadow-inner">
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="text-xs text-gray-600">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <Link
            to="/login"
            className="inline-flex justify-center rounded-md bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            Go to login
          </Link>
        </div>
      </div>
    </main>
  )
}
