export default function FeatureCard({ icon, title, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-colors hover:border-gray-300">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-gray-600">{children}</p>
    </div>
  )
}

