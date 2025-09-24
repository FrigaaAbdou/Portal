import { useNavigate } from 'react-router-dom'
import playerImg from '../player-img.jpg'
import coachImg from '../coach-img.jpg'

function Feature({ children }) {
  return (
    <li className="flex items-start gap-2 text-sm text-gray-700">
      <span className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-orange-500" />
      <span className="leading-6">{children}</span>
    </li>
  )
}

export default function SignupLanding() {
  const navigate = useNavigate()

  return (
    <main className="min-h-[100dvh] bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <header className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Choose Your Path</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
            Portal helps players gain visibility and coaches recruit efficiently. Pick the option that matches your role to get started.
          </p>
        </header>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {/* Player card */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate('/signup/player')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate('/signup/player')}
            className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-0 text-left shadow-sm ring-1 ring-transparent transition hover:shadow-md focus:outline-none focus:ring-orange-500"
          >
            <img src={playerImg} alt="Player features" className="aspect-[16/9] w-full rounded-t-2xl object-cover" />
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">I’m a Player</h2>
                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">Get Started</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">Create a profile, get discovered, and message coaches.</p>
              <ul className="mt-4 space-y-2">
                <Feature>Create and update a profile with videos, stats, academics, and budget.</Feature>
                <Feature>Subscribe for visibility to NCAA/NAIA/JUCO recruiters.</Feature>
                <Feature>Get notified when a coach expresses interest.</Feature>
                <Feature>Smart messaging: coaches are notified only after they show interest.</Feature>
                <Feature>Search universities by division (NCAA D1/D2/D3, NAIA) and location.</Feature>
              </ul>
              <div className="mt-auto pt-3">
                <button
                  type="button"
                  onClick={() => navigate('/signup/player')}
                  className="w-full rounded-lg bg-orange-500 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
                >
                  Continue as Player
                </button>
              </div>
            </div>
          </div>

          {/* Recruiter/Coach card */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate('/signup/coach')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate('/signup/coach')}
            className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-0 text-left shadow-sm ring-1 ring-transparent transition hover:shadow-md focus:outline-none focus:ring-orange-500"
          >
            <img src={coachImg} alt="Coach features" className="aspect-[16/9] w-full rounded-t-2xl object-cover" />
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">I’m a Coach / Recruiter</h2>
                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">Get Started</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">Evaluate players, search with advanced filters, and recruit smarter.</p>
              <ul className="mt-4 space-y-2">
                <Feature>Advanced search with filters for position, GPA, budget, stats and distinctions.</Feature>
                <Feature>Access athletes across NCAA, NAIA, NJCAA, CCCAA, and NWAC.</Feature>
                <Feature>Create playlists/favorites and save recruitment requests.</Feature>
                <Feature>JUCO coaches: evaluate players, validate NCAA eligibility, publish reports.</Feature>
                <Feature>Smart messaging: get notified when interested; reduce noise.</Feature>
              </ul>
              <div className="mt-auto pt-3">
                <button
                  type="button"
                  onClick={() => navigate('/signup/coach')}
                  className="w-full rounded-lg bg-orange-500 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
                >
                  Continue as Coach
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
