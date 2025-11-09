import {
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  BoltIcon,
  UserCircleIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline'

export const pillars = [
  {
    title: 'Performance',
    Icon: ArrowTrendingUpIcon,
    description: 'Verified academic and athletic data keeps every conversation grounded in facts, not guesswork.',
  },
  {
    title: 'Trust',
    Icon: ShieldCheckIcon,
    description: 'NJCAA coaches vouch for their players with ratings and notes so recruiters know who stands behind the profile.',
  },
  {
    title: 'Speed',
    Icon: BoltIcon,
    description: 'Smart filters and shared context help NCAA and NAIA staffs move from discovery to outreach in hours, not weeks.',
  },
]

export const personas = [
  {
    title: 'NJCAA Player',
    subtitle: 'Take your next step with confidence.',
    description: 'Your verified digital profile follows you everywhere — highlight videos, transcripts, feedback, and transfer readiness in one link.',
    bullets: [
      'Build a verified athletic + academic profile that coaches trust.',
      'Receive direct feedback from your NJCAA coach to strengthen your story.',
      'Get discovered by NCAA and NAIA programs recruiting your position.',
      'Track progress toward a four-year transfer with clarity.',
    ],
    accent: 'from-orange-50 via-white to-orange-100',
    Icon: UserCircleIcon,
    cta: { label: 'Build your profile', to: '/signup/player' },
  },
  {
    title: 'NJCAA Coach',
    subtitle: 'Showcase your program and open doors.',
    description: 'Promote your athletes, verify their readiness, and stay top-of-mind with four-year staffs nationwide.',
    bullets: [
      'Put your roster on the map for top NCAA and NAIA recruiters.',
      'Evaluate players with structured notes, ratings, and eligibility signals.',
      'Grow relationships with college staffs across the country.',
      'Become the trusted reference that speeds up every transfer conversation.',
    ],
    accent: 'from-blue-50 via-white to-blue-100',
    Icon: AcademicCapIcon,
    cta: { label: 'Support your roster', to: '/signup/coach' },
  },
  {
    title: 'NCAA / NAIA Coach',
    subtitle: 'Recruit smarter, faster, with higher certainty.',
    description: 'Scout NJCAA talent backed by coach validation and live data so you can make confident offers.',
    bullets: [
      'Search verified NJCAA players by position, GPA, budget, and eligibility.',
      'Review coach ratings and notes that reduce recruiting risk.',
      'Watch video, evaluate academics, and contact the right people instantly.',
      'Collaborate directly with NJCAA coaches to accelerate the pipeline.',
    ],
    accent: 'from-emerald-50 via-white to-emerald-100',
    Icon: ClipboardDocumentListIcon,
    cta: { label: 'Browse the directory', to: '/players/directory' },
  },
]

export const workflow = [
  {
    step: '01',
    title: 'Profile built',
    detail: 'Players publish highlight reels, academics, and preferences in minutes.',
  },
  {
    step: '02',
    title: 'Coach validates',
    detail: 'NJCAA staff add ratings, eligibility notes, and transfer guidance.',
  },
  {
    step: '03',
    title: 'Recruiters scout',
    detail: 'NCAA and NAIA programs filter, shortlist, and request context.',
  },
  {
    step: '04',
    title: 'Transfers accelerate',
    detail: 'Shared context keeps everyone aligned through offers and commitments.',
  },
]

export const trustStats = [
  { label: 'Verified athletes', value: '1,200+' },
  { label: 'Programs recruiting', value: '300+' },
  { label: 'Avg. staff hours saved', value: '12 hrs / week' },
]

export const values = [
  {
    title: 'Athlete-first transparency',
    description: 'Players always control their data and see who is engaging with their profile.',
  },
  {
    title: 'Coach-certified data',
    description: 'Every stat, note, and rating is backed by someone on the sideline — no anonymous scouting reports.',
  },
  {
    title: 'Recruiter-grade tooling',
    description: 'Filters, saved boards, and communication workflows match the expectations of elite recruiting staffs.',
  },
  {
    title: 'Security by design',
    description: 'From verified logins to monitored integrations, Sportall keeps sensitive information protected.',
  },
]
