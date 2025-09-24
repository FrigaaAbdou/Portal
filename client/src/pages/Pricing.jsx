import { useNavigate } from 'react-router-dom'

function CheckItem({ children }) {
  return (
    <li className="flex items-start gap-2 text-sm text-gray-700">
      <svg className="mt-1 h-4 w-4 flex-none text-orange-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 12.75l6 6 9-13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      <span className="leading-6">{children}</span>
    </li>
  )
}

function PlanCard({ title, price, period, highlight = false, cta, onSelect }) {
  return (
    <div className={`flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm ring-1 ${highlight ? 'border-orange-300 ring-orange-200' : 'border-gray-200 ring-gray-200'}`}>
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {highlight && <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">Best Value</span>}
      </div>
      <div className="mt-3 flex items-end gap-1">
        <div className="text-3xl font-extrabold text-gray-900">${price}</div>
        <div className="pb-1 text-sm text-gray-500">/{period}</div>
      </div>
      <ul className="mt-4 space-y-2">
        <CheckItem>Full player profile with videos, stats and academics</CheckItem>
        <CheckItem>Visibility to NCAA/NAIA/JUCO recruiters</CheckItem>
        <CheckItem>Smart messaging and interest notifications</CheckItem>
        <CheckItem>Search universities and get matched</CheckItem>
      </ul>
      <div className="mt-auto pt-3">
        <button
          type="button"
          onClick={onSelect}
          className={`w-full rounded-lg py-2.5 text-sm font-semibold text-white shadow-sm transition ${highlight ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-500 hover:bg-orange-600'}`}
        >
          {cta}
        </button>
      </div>
    </div>
  )
}

export default function Pricing() {
  const navigate = useNavigate()
  return (
    <main className="min-h-[100dvh] bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <header className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Pricing</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
            Choose a plan that fits your journey. Upgrade or cancel anytime.
          </p>
        </header>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <PlanCard
            title="Monthly"
            price="29.99"
            period="month"
            cta="Choose Monthly"
            onSelect={() => navigate('/signup/player')}
          />
          <PlanCard
            title="Annual"
            price="79.99"
            period="year"
            highlight
            cta="Choose Annual"
            onSelect={() => navigate('/signup/player')}
          />
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">Prices in USD. Taxes may apply. Selecting a plan will take you to sign up.</p>
      </div>
    </main>
  )
}
