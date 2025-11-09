import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Link to="/" className="text-lg font-semibold text-gray-900">Portal</Link>
          <p className="mt-1 text-sm text-gray-500">Connecting players and recruiters.</p>
        </div>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <Link to="/pricing" className="hover:text-gray-900">Pricing</Link>
          <Link to="/players" className="hover:text-gray-900">Players</Link>
          <Link to="/recruiters" className="hover:text-gray-900">Recruiters</Link>
          <Link to="/signup/player" className="hover:text-gray-900">Join as Player</Link>
          <Link to="/signup/coach" className="hover:text-gray-900">Join as Recruiter</Link>
          <Link to="/about" className="hover:text-gray-900">About</Link>
        </nav>
        <p className="text-sm text-gray-400">© {year} Portal. All rights reserved.</p>
      </div>
    </footer>
  )
}
