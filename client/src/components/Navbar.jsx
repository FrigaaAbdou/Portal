import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const toggleRef = useRef(null)
  const location = useLocation()

  // Lock body scroll when the mobile menu is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [open])

  // Close menu when route changes
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Close when clicking anywhere outside the drawer or toggle button
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e) => {
      const panel = panelRef.current
      const toggle = toggleRef.current
      if (!panel || !toggle) return
      const target = e.target
      if (panel.contains(target) || toggle.contains(target)) return
      setOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown, true)
    return () => window.removeEventListener('pointerdown', onPointerDown, true)
  }, [open])

  return (
    <nav className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Left: Logo + Brand */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="FootballRecruit logo" className="h-8 w-8 rounded-full object-cover" />
          <span className="text-lg font-semibold tracking-tight sm:hidden">Portal</span>
          <span className="hidden text-lg font-semibold tracking-tight sm:inline">FootballRecruit</span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
          aria-expanded={open}
          aria-controls="mobile-menu"
          ref={toggleRef}
        >
          <svg
            className={`h-6 w-6 ${open ? 'hidden' : 'block'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
          <svg
            className={`h-6 w-6 ${open ? 'block' : 'hidden'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 text-sm font-medium text-gray-700 md:flex">
          <a href="#players" className="hover:text-gray-900">Players</a>
          <a href="#recruiters" className="hover:text-gray-900">Recruiters</a>
          <a href="#about" className="hover:text-gray-900">About</a>
        </div>

        {/* Right: Auth (desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">Log In</Link>
          <Link to="/login" className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600">Sign Up</Link>
        </div>
      </div>

      {createPortal(
        <>
          {/* Backdrop (click anywhere outside to close) */}
          <div
            className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            onClick={() => setOpen(false)}
          />

          {/* Mobile slide-over (right drawer, narrower width) */}
          <div
            id="mobile-menu"
            className={`fixed right-0 top-0 z-50 h-[100dvh] w-64 max-w-[85vw] transform border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden ${
              open ? 'translate-x-0' : 'translate-x-full'
            }`}
            role="dialog"
            aria-modal="true"
            ref={panelRef}
          >
            <div className="flex h-full flex-col px-4 py-4 sm:px-6">
              <div className="mb-3 text-right">
                <button
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <nav className="flex flex-col gap-2 text-sm font-medium text-gray-800">
                <a href="#players" className="rounded-md px-2 py-2 hover:bg-gray-50" onClick={() => setOpen(false)}>Players</a>
                <a href="#recruiters" className="rounded-md px-2 py-2 hover:bg-gray-50" onClick={() => setOpen(false)}>Recruiters</a>
                <a href="#about" className="rounded-md px-2 py-2 hover:bg-gray-50" onClick={() => setOpen(false)}>About</a>
              </nav>
              <div className="mt-3 border-t border-gray-200 pt-3">
                <div className="flex flex-col gap-2">
                  <Link to="/login" className="w-full rounded-md border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-900 hover:bg-gray-50">Log In</Link>
                  <Link to="/login" className="w-full rounded-md bg-orange-500 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-orange-600">Sign Up</Link>
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </nav>
  )
}
