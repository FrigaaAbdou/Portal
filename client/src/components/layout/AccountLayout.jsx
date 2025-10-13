export default function AccountLayout({ title, children }) {
  const navigate = useNavigate()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [coachProfile, setCoachProfile] = useState(null)

  const role = coachProfile?.coachType || ''
  const isRecruiter = role === 'NCAA'

  useEffect(() => {
    let active = true
    getMyCoachProfile()
      .then((profile) => {
        if (active && profile) setCoachProfile(profile)
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  const nav = useMemo(() => {
    const items = [
      { label: 'Dashboard', to: '/dashboard', icon: 'dashboard' },
      { label: 'Profile', to: '/profile', icon: 'profile' },
    ]
    if (isRecruiter) {
      items.push({ label: 'Player Directory', to: '/players/directory', icon: 'players' })
    }
    items.push({ label: 'Settings', to: '/settings', icon: 'settings' })
    items.push({ label: 'Billing', to: '/pricing', icon: 'billing' })
    return items
  }, [isRecruiter])

  return () => { active = false }
  }, [])\n
  const baseNav = [
    { label: 'Dashboard', to: '/dashboard', icon: 'dashboard' },
    { label: 'Profile', to: '/profile', icon: 'profile' },
    { label: 'Settings', to: '/settings', icon: 'settings' },
    { label: 'Billing', to: '/pricing', icon: 'billing' }, // reuse Pricing as Billing for now
  ]
  const nav = isRecruiter
    ? [...baseNav.slice(0, 2), { label: 'Player Directory', to: '/players/directory', icon: 'players' }, ...baseNav.slice(2)]
    : baseNav

  return (
    <main className="min-h-[100dvh] bg-gray-50">
      {/* Full-width grid, no outer margins/padding to keep sections attached */}
      <div className="grid gap-0 md:grid-cols-[240px,1fr]">
        {/* Sidebar */}
        <aside className="border-b border-gray-200 bg-white p-3 md:sticky md:top-[64px] md:h-[calc(100dvh-64px)] md:border-b-0 md:border-r">
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
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <path d="M16 17l5-5-5-5"/>
                <path d="M21 12H9"/>
              </svg>
              <span>Log Out</span>
            </button>
          </div>
          </div>
        </aside>

        {/* Content */}
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
                >Log out</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
