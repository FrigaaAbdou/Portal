import AccountLayout from '../components/layout/AccountLayout'

export default function Settings() {
  return (
    <AccountLayout title="Settings">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Account preferences</h2>
        <p className="mt-2 text-sm text-gray-600">
          Profile controls and notification preferences are coming soon. In the meantime you can manage your subscription from the Billing tab in the sidebar.
        </p>
      </div>
    </AccountLayout>
  )
}
