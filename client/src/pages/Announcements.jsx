import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MegaphoneIcon, SparklesIcon, StarIcon, FlagIcon } from '@heroicons/react/24/outline'
import AccountLayout from '../components/layout/AccountLayout'
import { fetchAnnouncements, logEngagement, getToken } from '../lib/api'
import fallbackAnnouncements, { getAnnouncements as getFallbackAnnouncements, TYPE_LABELS } from '../data/announcements'

const TYPE_META = {
  product_update: {
    Icon: SparklesIcon,
    badgeClass: 'bg-orange-50 text-orange-700',
    accent: 'from-orange-500/20 via-transparent to-orange-500/5',
    iconBg: 'bg-orange-500/15 text-orange-600',
  },
  sponsor_spotlight: {
    Icon: StarIcon,
    badgeClass: 'bg-emerald-50 text-emerald-700',
    accent: 'from-emerald-500/20 via-transparent to-emerald-500/5',
    iconBg: 'bg-emerald-500/15 text-emerald-600',
  },
  program_news: {
    Icon: FlagIcon,
    badgeClass: 'bg-blue-50 text-blue-700',
    accent: 'from-blue-500/20 via-transparent to-blue-500/5',
    iconBg: 'bg-blue-500/15 text-blue-600',
  },
  default: {
    Icon: MegaphoneIcon,
    badgeClass: 'bg-gray-100 text-gray-600',
    accent: 'from-gray-400/20 via-transparent to-gray-400/5',
    iconBg: 'bg-gray-200 text-gray-700',
  },
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return iso
  }
}

function AudienceTags({ tags = [] }) {
  if (!Array.isArray(tags) || tags.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
      {tags.map((tag) => (
        <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-gray-600">
          {tag.replace(/_/g, ' ')}
        </span>
      ))}
    </div>
  )
}

function AnnouncementCard({ item }) {
  if (!item) return null
  const meta = TYPE_META[item.type] || TYPE_META.default
  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white/90 p-5 shadow-lg ring-1 ring-black/5 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl"
      onMouseEnter={() => logEngagement('announcement_card_hover', { id: item.id })}
    >
      <div aria-hidden className={`pointer-events-none absolute inset-0 opacity-0 blur-3xl transition group-hover:opacity-100 bg-gradient-to-br ${meta.accent}`} />
      <div className="relative flex flex-col">
        <div className="flex items-center gap-3">
          <span className={`inline-flex rounded-2xl p-2 ${meta.iconBg}`}>
            <meta.Icon className="h-5 w-5" aria-hidden />
          </span>
          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${meta.badgeClass}`}>
            {TYPE_LABELS[item.type] || item.type}
          </span>
          {item.badge && (
            <span className="rounded-full bg-orange-500/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
              {item.badge}
            </span>
          )}
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
        <p className="mt-2 text-sm text-gray-600">{item.summary}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
          <AudienceTags tags={item.audienceTags} />
          <span>Posted {formatDate(item.publishedAt)}</span>
        </div>
        {item.cta?.url && (
          <div className="mt-5">
            <a
              href={item.cta.url}
              target={item.cta.url.startsWith('http') ? '_blank' : undefined}
              rel={item.cta.url.startsWith('http') ? 'noreferrer' : undefined}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-950"
              aria-label={item.cta.ariaLabel || item.cta.label}
              onClick={() => logEngagement('announcement_cta_click', { id: item.id, url: item.cta.url })}
            >
              {item.cta.label}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </article>
  )
}

function HeroAnnouncement({ item }) {
  if (!item) return null
  const meta = TYPE_META[item.type] || TYPE_META.default
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-gray-100 bg-white/90 shadow-2xl ring-1 ring-black/5">
      <div className={`absolute inset-0 bg-gradient-to-br ${meta.accent}`} aria-hidden />
      <div className="absolute inset-0 opacity-40" aria-hidden>
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_55%)]" />
      </div>
      <div className="relative z-10 grid gap-8 px-6 py-12 md:grid-cols-[3fr,2fr] md:px-10">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-gray-700">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-gray-900 shadow-sm">
              <meta.Icon className="h-4 w-4 text-orange-500" aria-hidden />
              {TYPE_LABELS[item.type] || item.type}
            </span>
            <span className="rounded-full bg-gray-900/80 px-3 py-1 text-white">
              {item.badge || 'Featured announcement'}
            </span>
            <span className="rounded-full bg-white/70 px-3 py-1 text-gray-600">
              Posted {formatDate(item.publishedAt)}
            </span>
          </div>
          <h1 className="mt-5 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">{item.title}</h1>
          <p className="mt-3 text-base text-gray-700 sm:text-lg">{item.summary}</p>
          <div className="mt-4">
            <AudienceTags tags={item.audienceTags} />
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-3xl bg-white/85 p-5 shadow-inner ring-1 ring-white/60 backdrop-blur">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gray-900/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
              <MegaphoneIcon className="h-4 w-4 text-orange-500" aria-hidden />
              Updates feed
            </div>
            <h3 className="mt-3 text-base font-semibold text-gray-900">Never miss a drop</h3>
            <p className="mt-2 text-xs text-gray-600">
              Stay current with sponsor drops, program news, and feature launches curated for your role.
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-gray-600">
              {[
                'Sponsor spotlights geared to your roster needs',
                'Real-time product updates from the Sportall team',
                'Program news alerts filtered by division and position',
              ].map((bullet) => (
                <li key={bullet} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
          {item.cta?.url && (
            <a
              href={item.cta.url}
              target={item.cta.url.startsWith('http') ? '_blank' : undefined}
              rel={item.cta.url.startsWith('http') ? 'noreferrer' : undefined}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-gray-950"
              aria-label={item.cta.ariaLabel || item.cta.label}
              onClick={() => logEngagement('announcement_cta_click', { id: item.id, url: item.cta.url })}
            >
              {item.cta.label}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

const FILTER_OPTIONS = [
  { value: 'all', label: 'All', Icon: MegaphoneIcon },
  { value: 'product_update', label: 'Product updates', Icon: SparklesIcon },
  { value: 'sponsor_spotlight', label: 'Sponsor spotlights', Icon: StarIcon },
  { value: 'program_news', label: 'Program news', Icon: FlagIcon },
]

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const authed = Boolean(getToken())

  useEffect(() => {
    let active = true
    async function run() {
      setLoading(true)
      setError('')
      try {
        const list = await fetchAnnouncements()
        if (!active) return
        const resolved = Array.isArray(list) && list.length > 0 ? list : getFallbackAnnouncements()
        resolved.forEach((item, idx) => {
          logEngagement('announcement_loaded', { id: item.id, position: idx })
        })
        setAnnouncements(resolved)
      } catch (err) {
        console.error(err)
        if (!active) return
        const fallback = getFallbackAnnouncements()
        fallback.forEach((item, idx) => {
          logEngagement('announcement_loaded_fallback', { id: item.id, position: idx })
        })
        setAnnouncements(fallback)
        setError('Showing saved announcements while we reconnect.')
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => {
      active = false
    }
  }, [])

  const featured = announcements[0] || (fallbackAnnouncements.length > 0 ? fallbackAnnouncements[0] : null)

  const filteredAnnouncements = useMemo(() => {
    const remaining = announcements.filter((item) => !featured || item.id !== featured.id)
    if (filter === 'all') return remaining
    return remaining.filter((item) => item.type === filter)
  }, [announcements, featured, filter])

  const content = (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      {loading ? (
        <div className="space-y-6">
          <div className="h-48 animate-pulse rounded-[32px] bg-gradient-to-r from-gray-100 to-gray-200" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((key) => (
              <div key={key} className="h-40 animate-pulse rounded-3xl bg-gradient-to-r from-gray-100 to-gray-200" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <HeroAnnouncement item={featured} />
          {error && (
            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {error}
            </div>
          )}
          <section className="mt-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {FILTER_OPTIONS.map((option) => {
                  const active = filter === option.value
                  const OptionIcon = option.Icon
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFilter(option.value)
                        logEngagement('announcement_filter_change', { filter: option.value })
                      }}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                        active
                          ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                          : 'border-transparent bg-gray-100 text-gray-600 hover:border-gray-200'
                      }`}
                      aria-pressed={active}
                    >
                      {OptionIcon && <OptionIcon className="h-4 w-4" aria-hidden />}
                      {option.label}
                    </button>
                  )
                })}
              </div>
              <Link
                to="#"
                className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:border-orange-300 hover:bg-orange-100"
              >
                Submit announcement
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            {filteredAnnouncements.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-600">
                No announcements in this category yet. Check back soon or explore another filter.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAnnouncements.map((item) => (
                  <AnnouncementCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )

  if (authed) {
    return (
      <AccountLayout title="Announcements">
        <div className="bg-white">
          {content}
        </div>
      </AccountLayout>
    )
  }

  return (
    <main className="bg-gray-50 pb-16">
      {content}
    </main>
  )
}
