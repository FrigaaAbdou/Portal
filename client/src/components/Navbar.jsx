import logo from '../assets/logo.png'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Left: Logo + Brand */}
        <a href="#" className="flex items-center gap-3">
          <img src={logo} alt="FootballRecruit logo" className="h-8 w-8 rounded-full object-cover" />
          <span className="text-lg font-semibold tracking-tight">FootballRecruit</span>
        </a>

        {/* Center: Links */}
        <div className="hidden gap-8 text-sm font-medium text-gray-700 md:flex">
          <a href="#players" className="hover:text-gray-900">Players</a>
          <a href="#recruiters" className="hover:text-gray-900">Recruiters</a>
          <a href="#about" className="hover:text-gray-900">About</a>
        </div>

        {/* Right: Auth */}
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-gray-700 hover:text-gray-900">Log In</button>
          <button className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  )
}

