import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <main className="min-h-[100dvh] bg-gray-50">
      <div className="mx-auto flex min-h-[100dvh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:p-8">
          {/* Brand */}
          <div className="mb-6 flex items-center gap-3">
            <img src={logo} className="h-9 w-9 rounded-lg object-cover" alt="Logo" />
            <div>
              <h1 className="text-lg font-semibold">Portal</h1>
              <p className="text-xs text-gray-500">Welcome back</p>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <input id="email" type="email" required placeholder="you@example.com" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-gray-400 focus:ring-0" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs font-medium text-orange-600 hover:text-orange-700">Forgot?</a>
              </div>
              <input id="password" type="password" required placeholder="••••••••" className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-gray-400 focus:ring-0" />
            </div>
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-xs text-gray-600">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600" />
                Remember me
              </label>
            </div>

            <button type="submit" className="mt-2 w-full rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600">Log In</button>

            <div className="relative py-2 text-center text-xs text-gray-400">
              <span className="bg-white px-2">or</span>
              <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gray-200" />
            </div>

            <button type="button" className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50">
              Continue with Google
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-600">
            Don&apos;t have an account?{' '}
            <Link to="#" className="font-medium text-orange-600 hover:text-orange-700">Sign up</Link>
          </p>
        </div>
      </div>
    </main>
  )
}

