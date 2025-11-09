import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UserCircleIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  VideoCameraIcon,
  ClipboardDocumentCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import Hero from '../components/Hero'
import Dialog from '../components/ui/Dialog'
import Footer from '../components/Footer'

const API_BASE = import.meta.env.VITE_API_URL || ''

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      <main>
        <Hero
          onJoinRecruiter={() => navigate('/signup/coach')}
          onJoinPlayer={() => navigate('/signup/player')}
        />

        {/* Audience */}
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-white py-14">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-orange-50/40 to-transparent" />
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Built for every role</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">One platform, three winning experiences</h2>
              <p className="mx-auto mt-4 max-w-3xl text-sm text-gray-600 sm:text-base">
                Portal empowers players, JUCO coaches, and NCAA/NAIA recruiters with workflows tailored to their goals. Shared data keeps everyone aligned.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: 'Players',
                  Icon: UserCircleIcon,
                  description: 'Showcase videos, stats, academics, and transfer goals in a profile recruiters can trust.',
                  action: () => navigate('/signup/player'),
                  actionLabel: 'Create profile',
                  accent: 'from-orange-500/15 to-orange-500/5',
                  button: 'bg-orange-500 hover:bg-orange-600',
                },
                {
                  title: 'JUCO Coaches',
                  Icon: AcademicCapIcon,
                  description: 'Evaluate rosters, validate NCAA eligibility, and spotlight your athletes nationwide.',
                  action: () => navigate('/signup/coach'),
                  actionLabel: 'Support your roster',
                  accent: 'from-blue-500/15 to-blue-500/5',
                  button: 'bg-blue-500 hover:bg-blue-600',
                },
                {
                  title: 'NCAA/NAIA Coaches',
                  Icon: ClipboardDocumentListIcon,
                  description: 'Filter by position, GPA, budget, and impact level to make confident recruiting decisions.',
                  action: () => navigate('/signup/coach'),
                  actionLabel: 'Recruit smarter',
                  accent: 'from-emerald-500/15 to-emerald-500/5',
                  button: 'bg-emerald-500 hover:bg-emerald-600',
                },
              ].map(({ title, Icon, description, action, actionLabel, accent, button }) => (
                <div
                  key={title}
                  className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg ring-1 ring-black/5 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div aria-hidden className={`absolute inset-0 opacity-0 blur-3xl transition group-hover:opacity-100 bg-gradient-to-br ${accent}`} />
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex rounded-2xl bg-white p-3 text-orange-500 shadow-inner ring-1 ring-black/5">
                        <Icon className="h-6 w-6" aria-hidden />
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    </div>
                    <p className="mt-4 flex-1 text-sm text-gray-600">{description}</p>
                    <button
                      type="button"
                      onClick={action}
                      className={`mt-6 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition ${button}`}
                    >
                      {actionLabel}
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Simple workflow</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">From profile to placement in four steps</h2>
              <p className="mx-auto mt-3 max-w-3xl text-sm text-gray-600 sm:text-base">
                Each stage keeps NJCAA players, coaches, and NCAA/NAIA recruiters aligned with transparent checkpoints.
              </p>
            </div>
            <div className="relative mt-12 grid gap-6 md:grid-cols-4">
              <div aria-hidden className="pointer-events-none absolute inset-x-12 top-1/2 hidden h-px bg-gradient-to-r from-orange-200 via-gray-200 to-emerald-200 md:block" />
              {[
                {
                  step: '01',
                  title: 'Player builds profile',
                  copy: 'Videos, stats, academics, and budget bring their story to life.',
                },
                {
                  step: '02',
                  title: 'JUCO coach validates',
                  copy: 'Strength reports and NCAA-eligibility badges add credibility.',
                },
                {
                  step: '03',
                  title: 'Recruiters discover',
                  copy: 'Advanced filters and smart matching surface the right athletes.',
                },
                {
                  step: '04',
                  title: 'Connection happens',
                  copy: 'Interest-based messaging keeps communication focused and relevant.',
                },
              ].map(({ step, title, copy }) => (
                <div key={step} className="relative rounded-3xl border border-gray-100 bg-gray-50 p-6 text-left shadow-sm">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/10 text-sm font-semibold text-orange-600">
                    {step}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Proof */}
        <section className="bg-gray-900 py-14 text-white">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col items-center gap-10 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-orange-500">Why coaches trust Portal</span>
                <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Verified profiles, faster decisions</h2>
                <p className="mt-3 max-w-xl text-sm text-gray-200 sm:text-base">
                  JUCO evaluations and NCAA-eligible status give recruiters confidence. Players stay in control of their journey while coaches save hours each week.
                </p>
              </div>
              <div className="grid w-full gap-4 text-center sm:grid-cols-3 md:w-auto md:text-left">
                {[
                  { label: 'Verified athletes', value: '1,200+' },
                  { label: 'Programs recruiting', value: '300+' },
                  { label: 'Average time saved', value: '12 hrs / week' },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
                    <p className="text-xl font-bold sm:text-2xl">{value}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-gray-300">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-emerald-50 py-16">
          <div aria-hidden className="pointer-events-none absolute -left-16 top-16 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6">
            <div className="text-center md:text-left">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Why it works</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Tools that respect the process</h2>
              <p className="mt-3 max-w-3xl text-sm text-gray-600 sm:text-base">
                Portal blends athlete storytelling, JUCO validation, and recruiter efficiency into one collaborative hub with clear ownership at every step.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                {
                  title: 'Profile studio',
                  Icon: VideoCameraIcon,
                  copy: 'Upload highlight reels, break down stats, track academics, and share budget expectations in one polished profile.',
                  accent: 'bg-orange-500/10 text-orange-600',
                },
                {
                  title: 'Evaluation suite',
                  Icon: ClipboardDocumentCheckIcon,
                  copy: 'JUCO coaches log strengths, projections, and eligibility so recruiters trust what they see.',
                  accent: 'bg-blue-500/10 text-blue-600',
                },
                {
                  title: 'Smart matching',
                  Icon: SparklesIcon,
                  copy: 'Automatic tiers like Immediate Impact or Hidden Gem guide recruiters to the right athletes fast.',
                  accent: 'bg-emerald-500/10 text-emerald-600',
                },
              ].map(({ title, Icon, copy, accent }) => (
                <div key={title} className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-lg ring-1 ring-black/5 backdrop-blur">
                  <span className={`inline-flex rounded-2xl p-3 ${accent} shadow-inner`}>
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-gray-900">{title}</h3>
                  <p className="mt-3 text-sm text-gray-600">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Real voices</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">What our community is saying</h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                {
                  quote: 'Portal gave me the structure to present myself professionally. Within weeks I had three coaches ask for film.',
                  name: 'Jaylen M.',
                  role: 'Wide Receiver, 2024 class',
                },
                {
                  quote: 'The evaluation flow keeps our staff organized. NCAA coaches respect our reports because they’re consistent.',
                  name: 'Coach Ramirez',
                  role: 'Head Coach, Coastal JUCO',
                },
                {
                  quote: 'Being able to filter by GPA, budget, and level of impact cut my research time in half.',
                  name: 'Coach Ellis',
                  role: 'Recruiting Coordinator, NCAA D2',
                },
              ].map(({ quote, name, role }) => (
                <figure key={name} className="relative flex h-full flex-col rounded-3xl border border-white/80 bg-white p-6 shadow-lg ring-1 ring-black/5">
                  <div aria-hidden className="absolute -top-6 right-6 text-6xl text-orange-100">”</div>
                  <p className="text-sm text-gray-700">“{quote}”</p>
                  <figcaption className="mt-6">
                    <p className="text-sm font-semibold text-gray-900">{name}</p>
                    <p className="text-xs uppercase tracking-wide text-gray-500">{role}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-emerald-600 py-12 text-white">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready to move faster this season?</h2>
              <p className="mt-2 text-sm text-emerald-100 sm:text-base">
                Join thousands of athletes and coaches already transforming their recruiting workflow with Portal.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/signup/player')}
                className="rounded-md bg-white px-5 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
              >
                Start as Player
              </button>
              <button
                type="button"
                onClick={() => navigate('/signup/coach')}
                className="rounded-md border border-white px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/10"
              >
                Start as Coach
              </button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-14 md:py-16">
          <div className="mx-auto max-w-4xl px-6">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-wide text-orange-500">Questions</span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">All the essentials, answered</h2>
            </div>
            <div className="mt-8 space-y-4">
              {[
                {
                  q: 'How much does visibility cost for players?',
                  a: 'Players can create a profile for free. Upgraded visibility plans unlock advanced analytics, recruiter insights, and placement support.',
                },
                {
                  q: 'Can JUCO coaches invite their roster?',
                  a: 'Absolutely. Upload your roster, complete evaluations, and Portal will automatically notify four-year programs once athletes are marked NCAA-eligible.',
                },
                {
                  q: 'What information do recruiters see?',
                  a: 'Recruiters access validated profiles, academic data, budget expectations, highlight tapes, and coach contact details. Messaging alerts trigger only when both parties show interest.',
                },
                {
                  q: 'Do you support international athletes?',
                  a: 'Yes. Portal helps international players surface academic and visa readiness, and highlights programs actively recruiting abroad.',
                },
              ].map(({ q, a }) => (
                <details key={q} className="group rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm">
                  <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-gray-900">
                    {q}
                    <span className="ml-3 text-gray-500 transition group-open:rotate-45">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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

        <section className="bg-white py-6">
          <div className="mx-auto max-w-6xl px-6 text-center text-xs text-gray-400">
            API base: {API_BASE || 'dev proxy (/api)'}
          </div>
        </section>
      </main>

      <Footer />

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Recruiter Sign Up"
        size="md"
        footer={(
          <>
            <button onClick={() => setDialogOpen(false)} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-50">Close</button>
            <button onClick={() => setDialogOpen(false)} className="rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-600">Continue</button>
          </>
        )}
      >
        Thanks for your interest! This is a demo dialog triggered by “Join as Recruiter”. Replace this content with your recruiter sign-up flow when ready.
      </Dialog>
    </>
  )
}
