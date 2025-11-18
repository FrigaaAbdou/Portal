import { useEffect, useMemo, useState } from 'react'
import { listAdminUsers, getAdminUser } from '../lib/api'
import AccountLayout from '../components/layout/AccountLayout'

const ROLE_OPTIONS = [
  { label: 'All roles', value: '' },
  { label: 'Player', value: 'player' },
  { label: 'Coach', value: 'coach' },
  { label: 'Admin', value: 'admin' },
]

export default function AdminUsers() {
  const [filters, setFilters] = useState({ search: '', role: '', page: 1 })
  const [data, setData] = useState([])
  const [meta, setMeta] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [detail, setDetail] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')

  const fetchUsers = async (nextFilters) => {
    setLoading(true)
    setError('')
    try {
      const res = await listAdminUsers({ ...nextFilters, limit: 15 })
      setData(res?.data || [])
      setMeta(res?.meta || { page: 1, limit: 15, total: 0, totalPages: 1 })
    } catch (err) {
      setError(err?.message || 'Failed to load users')
      setData([])
      setMeta({ page: 1, limit: 15, total: 0, totalPages: 1 })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page, filters.role])

  const onSearch = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const search = form.search.value
    setFilters((prev) => ({ ...prev, search, page: 1 }))
    fetchUsers({ ...filters, search, page: 1 })
  }

  const onRoleChange = (value) => {
    setFilters((prev) => ({ ...prev, role: value, page: 1 }))
  }

  const nextPage = () => {
    if (filters.page < meta.totalPages) {
      const page = filters.page + 1
      setFilters((prev) => ({ ...prev, page }))
      fetchUsers({ ...filters, page })
    }
  }

  const prevPage = () => {
    if (filters.page > 1) {
      const page = filters.page - 1
      setFilters((prev) => ({ ...prev, page }))
      fetchUsers({ ...filters, page })
    }
  }

  const roleLabel = useMemo(() => {
    const found = ROLE_OPTIONS.find((opt) => opt.value === filters.role)
    return found?.label || 'All roles'
  }, [filters.role])

  const loadDetail = async (userId) => {
    if (!userId) return
    setDetailLoading(true)
    setDetailError('')
    try {
      const res = await getAdminUser(userId)
      setDetail(res?.data || null)
      setDetailOpen(true)
    } catch (err) {
      setDetailError(err?.message || 'Failed to load user')
      setDetail(null)
      setDetailOpen(true)
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <AccountLayout title="Users">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">View and filter users. Showing 15 per page.</p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Page {meta.page} of {meta.totalPages}</span>
        </div>
      </div>

      <form onSubmit={onSearch} className="mt-4 mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          name="search"
          defaultValue={filters.search}
          placeholder="Search email"
          className="w-full flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0 sm:w-auto"
        />
        <select
          value={filters.role}
          onChange={(e) => onRoleChange(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0"
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
        >
          Search
        </button>
      </form>

      {error && (
        <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="grid grid-cols-5 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
          <span>Email</span>
          <span>Role</span>
          <span>Subscription</span>
          <span>Created</span>
          <span className="text-right">Actions</span>
        </div>
        {loading ? (
          <div className="space-y-2 p-4">
            {[1, 2, 3].map((key) => (
              <div key={key} className="h-12 animate-pulse rounded-md bg-gray-100" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="p-4 text-sm text-gray-600">No users found.</div>
        ) : (
          <ul>
            {data.map((user) => (
              <li key={user._id || user.id || user.email} className="grid grid-cols-5 items-center px-4 py-3 text-sm text-gray-800 border-t border-gray-100">
                <span className="truncate">{user.email}</span>
                <span className="capitalize">{user.role}</span>
                <span className="capitalize">{user.subscriptionStatus || 'none'}</span>
                <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</span>
                <button
                  type="button"
                  onClick={() => loadDetail(user._id || user.id)}
                  className="text-right text-xs font-semibold text-orange-600 hover:text-orange-700"
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-700">
        <div>{meta.total} total users</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevPage}
            disabled={filters.page <= 1}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-xs text-gray-600">{roleLabel}</span>
          <button
            type="button"
            onClick={nextPage}
            disabled={filters.page >= meta.totalPages}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {detailOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDetailOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <h2 className="text-base font-semibold text-gray-900">User Detail</h2>
              <button
                type="button"
                onClick={() => setDetailOpen(false)}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 text-sm text-gray-800">
              {detailLoading ? (
                <div className="space-y-2">
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" />
                </div>
              ) : detailError ? (
                <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">{detailError}</div>
              ) : detail ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Email</p>
                    <p className="font-semibold">{detail.email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">Role</p>
                      <p className="font-semibold capitalize">{detail.role}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">Subscription</p>
                      <p className="font-semibold capitalize">{detail.subscriptionStatus || 'none'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">Created</p>
                      <p className="font-semibold">{detail.createdAt ? new Date(detail.createdAt).toLocaleString() : '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">Updated</p>
                      <p className="font-semibold">{detail.updatedAt ? new Date(detail.updatedAt).toLocaleString() : '—'}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Stripe IDs</p>
                    <p className="font-mono text-xs text-gray-700">Customer: {detail.stripeCustomerId || '—'}</p>
                    <p className="font-mono text-xs text-gray-700">Subscription: {detail.stripeSubscriptionId || '—'}</p>
                    <p className="font-mono text-xs text-gray-700">Price: {detail.subscriptionPriceId || '—'}</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Actions</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Reset password (coming soon)
                      </button>
                      <button
                        type="button"
                        disabled
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Suspend user (coming soon)
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600">Select a user to view details.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </AccountLayout>
  )
}
