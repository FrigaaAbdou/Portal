import { Link, useNavigate } from 'react-router-dom'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { pillars, personas, workflow, trustStats, values } from '../data/about'

export default function About() {
  const navigate = useNavigate()

  return (
    <main className="bg-white text-gray-900">
      {/* Hero */}
      <section id="about" className="relative overflow-hidden bg-gray-900 text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-5xl flex-col gap-6 px-6 py-16 text-center md:py-24 md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-200">About Sportall</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Connecting the entire college soccer ecosystem.
          </h1>
          <p className="text-sm leading-relaxed text-gray-100 sm:text-base md:text-lg">
            Sportall unites NJCAA players, NJCAA coaches, and NCAA / NAIA recruiters on one secure, data-driven platform.
            We make recruitment faster, safer, and more transparent so everyone can focus on what matters most: performance
            and trust.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate('/signup/player')}
              className="inline-flex items-center justify-center rounded-md bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              Join as Player
            </button>
            <button
              type="button"
              onClick={() => navigate('/signup/coach')}
              className="inline-flex items-center justify-center rounded-md border border-white/40 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/10"
            >
              Join as Coach
            </button>
            <a
              href="#personas"
              className="inline-flex items-center justify-center rounded-md bg-white/10 px-5 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur transition hover:bg-white/20 sm:ml-auto"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="relative overflow-hidden bg-gray-50 py-14 md:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/70 to-transparent" />
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">Why Sportall</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Built for performance, trust, and speed</h2>
            <p className="mx-auto mt-3 max-w-3xl text-sm text-gray-600 sm:text-base">
              Every feature is designed to remove friction between NJCAA programs and NCAA / NAIA recruiters while keeping players in control of their journey.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pillars.map((pillar, idx) => (
              <div
                key={pillar.title}
                className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white p-6 shadow-lg ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div
                  aria-hidden
                  className={`absolute inset-x-0 -top-24 h-48 rounded-full blur-3xl transition-opacity duration-300 ${
                    idx === 0 ? 'bg-orange-200/50 group-hover:opacity-80' : idx === 1 ? 'bg-blue-200/40 group-hover:opacity-80' : 'bg-emerald-200/50 group-hover:opacity-80'
                  }`}
                />
                <div className="relative">
                  <div className="inline-flex rounded-2xl bg-orange-50/80 p-3 text-orange-600 shadow-inner">
                    <pillar.Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">{pillar.title}</h3>
                  <p className="mt-3 text-sm text-gray-600">{pillar.description}</p>
                  <div className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    <span className="h-px w-8 bg-gray-200" />
                    <span>Sportall pillar</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personas */}
      <section id="personas" className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">One platform, three experiences</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Sportall meets every role where they are</h2>
          </div>
          <div className="mt-10 space-y-8">
            {personas.map((persona) => (
              <article
                key={persona.title}
                className={`grid gap-6 rounded-3xl bg-gradient-to-br ${persona.accent} p-6 shadow-sm md:grid-cols-2 md:items-center`}
              >
                <div>
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-white/70 text-orange-600">
                    <persona.Icon className="h-7 w-7" aria-hidden />
                  </span>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-orange-500">{persona.subtitle}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-gray-900">{persona.title}</h3>
                  <p className="mt-3 text-sm text-gray-700">{persona.description}</p>
                  <Link
                    to={persona.cta.to}
                    className="mt-5 inline-flex items-center text-sm font-semibold text-orange-600 hover:text-orange-700"
                  >
                    {persona.cta.label}
                    <svg className="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
                <ul className="space-y-3 rounded-2xl bg-white/80 p-6 text-sm text-gray-700 shadow-inner">
                  {persona.bullets.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-500" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">Simple, transparent flow</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">From profile to placement in four steps</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {workflow.map((item) => (
              <div key={item.step} className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-6 text-left shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-orange-500">{item.step}</p>
                <h3 className="mt-3 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="bg-gray-900 py-14 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-200">Proof in the numbers</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Verified profiles, trusted transfers</h2>
            <p className="mt-3 text-sm text-gray-200 sm:text-base">
              Every data point is backed by NJCAA coaches and secured with enterprise-grade infrastructure.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {trustStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-center backdrop-blur">
                <p className="text-2xl font-bold sm:text-3xl">{stat.value}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">What guides us</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Principles behind the product</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">{value.title}</h3>
                <p className="mt-3 text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-orange-500 via-orange-400 to-emerald-400 py-12 text-white">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Ready to build the future of college soccer recruiting?</h2>
          <p className="text-sm text-white/90 sm:text-base">
            Join Sportall today or book a walkthrough with our team to see how verified data and shared trust accelerate every recruiting conversation.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => navigate('/signup/player')}
              className="inline-flex items-center justify-center rounded-md bg-white px-5 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:bg-white/90"
            >
              Join as Player
            </button>
            <button
              type="button"
              onClick={() => navigate('/signup/coach')}
              className="inline-flex items-center justify-center rounded-md border border-white px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/10"
            >
              Join as Coach
            </button>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center rounded-md border border-white/60 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/20"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
