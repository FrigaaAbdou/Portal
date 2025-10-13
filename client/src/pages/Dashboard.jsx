import AccountLayout from '../components/layout/AccountLayout'

export default function Dashboard() {
  return (
    <AccountLayout title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900">Profile Completion</h3>
          <p className="mt-2 text-sm text-gray-600">Coming soon: show what’s missing in your profile.</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
          <p className="mt-2 text-sm text-gray-600">Recent sign-ins and updates will appear here.</p>
        </div>
      </div>
    </AccountLayout>
  )
}

