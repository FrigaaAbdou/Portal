import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import AccountLayout from '../components/layout/AccountLayout'

const cards = [
  { title: 'Verification Inbox', to: '/admin/verifications', desc: 'Review pending player submissions and approve or request updates.' },
  { title: 'Users', to: '/admin/users', desc: 'Search users, view status, and help with billing issues.' },
  { title: 'Invites', to: '/admin/invites', desc: 'Send or revoke admin invitations for trusted staff.' },
  { title: 'Announcements', to: '/admin/announcements', desc: 'Draft, schedule, and publish product or program updates.' },
  { title: 'Reports', to: '/admin/reports', desc: 'View metrics and export activity logs.' },
]

export default function AdminHome() {
  const sections = useMemo(() => cards, [])
  return (
    <AccountLayout title="Portal Admin">
      <p className="text-sm text-gray-600">Internal tools for verifications, announcements, and user support.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {sections.map((item) => (
          <Link
            key={item.title}
            to={item.to}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-[1px] hover:border-orange-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
              <span className="text-sm text-orange-600">Open</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
          </Link>
        ))}
      </div>
    </AccountLayout>
  )
}
