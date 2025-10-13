import { useEffect, useMemo, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { clearToken, getMyCoachProfile } from '../../lib/api'

function Icon({ name }) {
  const common = 'h-4 w-4'
  switch (name) {
    case 'dashboard':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      )
    case 'profile':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20 21a8 8 0 10-16 0" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    case 'settings':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06A2 2 0 016.04 3.3l.06.06c.46.46 1.12.6 1.7.33.52-.24 1.06-.37 1.62-.37H9a2 2 0 014 0h.09c.56 0 1.1.13 1.62.37.58.27 1.24.13 1.7-.33l.06-.06a2 2 0 012.83 2.83l-.06.06c-.46.46-.6 1.12-.33 1.7.24.52.37 1.06.37 1.62V9a2 2 0 010 4h-.09c-.56 0-1.1.13-1.62.37-.58.27-1.24.13-1.7-.33l-.06-.06A1.65 1.65 0 0019.4 15z" />
        </svg>
      )
    case 'billing':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
        </svg>
      )
    case 'players':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M16 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M8 21v-2a4 4 0 0 1 3-3.87" />
          <circle cx="12" cy="7" r="4" />
          <path d="M18 3a2 2 0 1 1-2 2" />
          <path d="M6 3a2 2 0 1 0 2 2" />
        </svg>
      )
    case 'roster':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 4h16v16H4z" />
          <path d="M9 4v16" />
          <path d="M4 9h16" />
        </svg>
      )
    default:
      return null
  }
}

export default function AccountLayout({ title, children }) {
  const navigate = useNavigate()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [coachProfile, setCoachProfile] = useState(null)

  const role = coachProfile?.coachType || ''
  const isRecruiter = role === 'NCAA'
  const isJucoCoach = role === 'JUCO'

  useEffect(() => {
    let active = true
    getMyCoachProfile()
      .then((profile) => {
        if (active) setCoachProfile(profile || null)
      })
      .catch(() => {
        if (active) setCoachProfile(null)
      })
    return () => { active = false }
  }, [])

  const nav = useMemo(() => {
    const items = [
      { label: 'Dashboard', to: '/dashboard', icon: 'dashboard' },
      { label: 'Profile', to: '/profile', icon: 'profile' },
    ]
    if (isJucoCoach) {
      items.push({ label: 'My Players', to: '/players/my', icon: 'roster' })
    }
    if (isRecruiter) {
      items.push({ label: 'Player Directory', to: '/players/directory', icon: 'players' })
    }
    items.push({ label: 'Settings', to: '/settings', icon: 'settings' })
    items.push({ label: 'Billing', to: '/pricing', icon: 'billing' })
    return items
  }, [isJucoCoach, isRecruiter])

  return (
    <main className="min-h-[100dvh] bg-gray-50">
      <div className="grid gap-0 md:grid-cols-[240px,1fr]">
        <aside className="border-b border-gray-200 bg-white p-3 md:sticky md:top-[64px] md:h-[calc(100dvh-64px)] md:border-b-0 md:border-r md:overflow-hidden">
          <div className="flex h-full flex-col">
            <nav className="flex flex-col gap-1">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-50'}`
                  }
                >
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="mt-auto mb-3 pt-3">
              <button
                onClick={() => setLogoutOpen(true)}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="M16 17l5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </aside>

        <section className="bg-white p-6">
          {title && (
            <header className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            </header>
          )}
          {children}
        </section>
      </div>

      {logoutOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setLogoutOpen(false)} />
          <div className="absolute inset-0 grid place-items-center p-4">
            <div className="w-full max-w-sm rounded-xl bg-white shadow-2xl">
              <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="text-base font-semibold text-gray-900">Log out?</h2>
              </div>
              <div className="px-5 py-4 text-sm text-gray-700">
                <p>You’ll need to sign in again to access your dashboard.</p>
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-3">
                <button onClick={() => setLogoutOpen(false)} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50">Cancel</button>
                <button
                  onClick={() => {
                    clearToken()
                    setLogoutOpen(false)
                    navigate('/login')
                  }}
                  className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-600"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
