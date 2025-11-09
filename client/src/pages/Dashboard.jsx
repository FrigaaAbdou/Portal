import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AccountLayout from '../components/layout/AccountLayout'
import { fetchAnnouncements, logEngagement } from '../lib/api'
import { getAnnouncements as getFallbackAnnouncements, TYPE_LABELS } from '../data/announcements'
import { formatDistanceToNowStrict } from '../utils/date'

function AnnouncementPreview({ announcement }) {
  if (!announcement) return null
  const label = TYPE_LABELS[announcement.type] || announcement.type
  const postedAgo = formatDistanceToNowStrict(announcement.publishedAt)
  return (
    <li className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition hover:border-orange-200 hover:bg-orange-50/40">
      <Link
        to="/announcements"
        className="flex flex-col gap-2 text-sm text-gray-800"
        onClick={() => logEngagement('dashboard_announcement_click', { id: announcement.id })}
        onMouseEnter={() => logEngagement('dashboard_announcement_hover', { id: announcement.id })}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-600">
            {label}
          </span>
          <span className="text-[11px] font-medium text-gray-500">{postedAgo} ago</span>
        </div>
        <h4 className="text-sm font-semibold text-gray-900">{announcement.title}</h4>
        <p className="line-clamp-2 text-xs text-gray-600">{announcement.summary}</p>
      </Link>
    </li>
  )
}

export default function Dashboard() {
  const [announcements, setAnnouncements] = useState([])
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true)

  useEffect(() => {
    let active = true
    async function run() {
      setLoadingAnnouncements(true)
      try {
        const list = await fetchAnnouncements()
        if (!active) return
        setAnnouncements(Array.isArray(list) ? list.slice(0, 3) : getFallbackAnnouncements().slice(0, 3))
      } catch (err) {
        console.error(err)
        if (!active) return
        setAnnouncements(getFallbackAnnouncements().slice(0, 3))
      } finally {
        if (active) setLoadingAnnouncements(false)
      }
    }
    run()
    return () => {
      active = false
    }
  }, [])

  return (
    <AccountLayout title="Dashboard">
      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">Profile Completion</h3>
          <p className="mt-2 text-sm text-gray-600">Coming soon: show what’s missing in your profile.</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
          <p className="mt-2 text-sm text-gray-600">Recent sign-ins and updates will appear here.</p>
        </div>
      </div>
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Announcements</h3>
            <p className="text-sm text-gray-600">Latest updates, opportunities, and program news.</p>
          </div>
          <Link
            to="/announcements"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
            onClick={() => logEngagement('dashboard_announcements_view_all')}
          >
            View all
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        {loadingAnnouncements ? (
          <div className="mt-4 space-y-3">
            {[1, 2, 3].map((key) => (
              <div key={key} className="h-16 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-600">
            No announcements yet. We’ll post updates shortly.
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {announcements.map((item) => (
              <AnnouncementPreview key={item.id} announcement={item} />
            ))}
          </ul>
        )}
      </section>
    </AccountLayout>
  )
}
