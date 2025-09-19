export default function FeatureCard({ icon, title, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-colors hover:border-gray-300 sm:p-7 md:p-8">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500 sm:mb-4 sm:h-12 sm:w-12">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-gray-900 sm:text-lg">{title}</h3>
      <p className="mt-1.5 text-sm leading-6 text-gray-600 sm:mt-2">{children}</p>
    </div>
  )
}
