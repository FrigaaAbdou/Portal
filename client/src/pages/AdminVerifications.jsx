import { useEffect, useMemo, useState } from 'react'
import AccountLayout from '../components/layout/AccountLayout'
import InlineBanner from '../components/ui/InlineBanner'
import {
  listAdminVerifications,
  getAdminVerification,
  approveAdminVerification,
  rejectAdminVerification,
} from '../lib/api'
import { notify } from '../lib/notify'

const STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'In review', value: 'in_review' },
  { label: 'Needs updates', value: 'needs_updates' },
  { label: 'Verified', value: 'verified' },
  { label: 'Stats pending', value: 'stats_pending' },
  { label: 'Phone pending', value: 'phone_pending' },
  { label: 'Email pending', value: 'email_pending' },
]

const STATUS_LABELS = {
  none: 'Not started',
  email_pending: 'Email pending',
  phone_pending: 'Phone pending',
  stats_pending: 'Stats pending',
  in_review: 'In review',
  needs_updates: 'Needs updates',
  verified: 'Verified',
}

function formatDate(value, withTime = false) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return withTime ? date.toLocaleString() : date.toLocaleDateString()
}

function formatValue(value) {
  if (value === undefined || value === null || value === '') return '—'
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export default function AdminVerifications() {
  const [filters, setFilters] = useState({ status: 'in_review', search: '', page: 1 })
  const [data, setData] = useState([])
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [detailOpen, setDetailOpen] = useState(false)
  const [detailId, setDetailId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')
  const [note, setNote] = useState('')
  const [actionError, setActionError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const statusLabel = useMemo(() => {
    const option = STATUS_OPTIONS.find((item) => item.value === filters.status)
    return option?.label || 'All'
  }, [filters.status])

  const load = async (nextFilters) => {
    setLoading(true)
    setError('')
    try {
      const res = await listAdminVerifications({ ...nextFilters, limit: 20 })
      setData(res?.data || [])
      setMeta(res?.meta || { page: 1, limit: 20, total: 0, totalPages: 1 })
    } catch (err) {
      setError(err?.message || 'Failed to load verifications')
      setData([])
      setMeta({ page: 1, limit: 20, total: 0, totalPages: 1 })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page, filters.status])

  const onSearch = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const search = form.search.value
    const next = { ...filters, search, page: 1 }
    setFilters(next)
    load(next)
  }

  const onStatusChange = (value) => {
    setFilters((prev) => ({ ...prev, status: value, page: 1 }))
  }

  const nextPage = () => {
    if (filters.page < meta.totalPages) {
      const page = filters.page + 1
      const nextFilters = { ...filters, page }
      setFilters(nextFilters)
      load(nextFilters)
    }
  }

  const prevPage = () => {
    if (filters.page > 1) {
      const page = filters.page - 1
      const nextFilters = { ...filters, page }
      setFilters(nextFilters)
      load(nextFilters)
    }
  }

  const loadDetail = async (id) => {
    if (!id) return
    setDetailId(id)
    setDetailOpen(true)
    setDetailLoading(true)
    setDetailError('')
    setActionError('')
    setNote('')
    try {
      const res = await getAdminVerification(id)
      setDetail(res?.data || null)
    } catch (err) {
      setDetailError(err?.message || 'Failed to load verification detail')
      setDetail(null)
    } finally {
      setDetailLoading(false)
    }
  }

  const closeDetail = () => {
    setDetailOpen(false)
    setDetail(null)
    setDetailId(null)
    setDetailError('')
    setActionError('')
    setNote('')
  }

  const handleApprove = async () => {
    if (!detailId) return
    setActionLoading(true)
    setActionError('')
    try {
      await approveAdminVerification(detailId, note.trim())
      notify.success('Verification approved')
      closeDetail()
      load(filters)
    } catch (err) {
      setActionError(err?.message || 'Failed to approve verification')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!detailId) return
    const trimmed = note.trim()
    if (!trimmed) {
      setActionError('Rejection note is required.')
      return
    }
    setActionLoading(true)
    setActionError('')
    try {
      await rejectAdminVerification(detailId, trimmed)
      notify.success('Verification marked as needs updates')
      closeDetail()
      load(filters)
    } catch (err) {
      setActionError(err?.message || 'Failed to request updates')
    } finally {
      setActionLoading(false)
    }
  }

  const detailStatus = detail?.verification?.status || detail?.verificationStatus || 'none'
  const statusText = STATUS_LABELS[detailStatus] || detailStatus
  const statsSnapshot = detail?.verification?.stats?.snapshot || null
  const statsValues = statsSnapshot?.stats || {}
  const statsFields = [
    { label: 'Games', value: statsValues.games },
    { label: 'Games started', value: statsValues.gamesStarted },
    { label: 'Goals', value: statsValues.goals },
    { label: 'Assists', value: statsValues.assists },
    { label: 'Points', value: statsValues.points },
  ].filter((item) => item.value !== undefined && item.value !== null && item.value !== '')
  const positionsValue = Array.isArray(statsSnapshot?.positions) ? statsSnapshot.positions.join(', ') : statsSnapshot?.positions
  const snapshotMeta = [
    { label: 'GPA', value: statsSnapshot?.gpa },
    { label: 'Positions', value: positionsValue },
    { label: 'Snapshot updated', value: statsSnapshot?.updatedAt ? formatDate(statsSnapshot.updatedAt, true) : '' },
  ].filter((item) => item.value !== undefined && item.value !== null && item.value !== '')
  const supportingFiles = detail?.verification?.stats?.supportingFiles || []
  const phoneVerifiedAt = detail?.phoneVerifiedAt || detail?.verification?.phone?.verifiedAt || null
  const emailVerifiedAt = detail?.verification?.email?.verifiedAt || null

  const isVerified = detailStatus === 'verified'

  return (
    <AccountLayout title="Verification Inbox">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">Review player submissions, approve, or request updates.</p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Page {meta.page} of {meta.totalPages}</span>
        </div>
      </div>

      <form onSubmit={onSearch} className="mt-4 mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          name="search"
          defaultValue={filters.search}
          placeholder="Search name or school"
          className="w-full flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0 sm:w-auto"
        />
        <select
          value={filters.status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value || 'all'} value={opt.value}>{opt.label}</option>
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
        <InlineBanner variant="error" className="mb-4">
          {error}
        </InlineBanner>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="grid grid-cols-6 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
          <span>Player</span>
          <span>School</span>
          <span>Division</span>
          <span>Status</span>
          <span>Updated</span>
          <span className="text-right">Actions</span>
        </div>
        {loading ? (
          <div className="space-y-2 p-4">
            {[1, 2, 3].map((key) => (
              <div key={key} className="h-12 animate-pulse rounded-md bg-gray-100" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="p-4 text-sm text-gray-600">No verifications found.</div>
        ) : (
          <ul>
            {data.map((item) => {
              const id = item._id || item.id
              const status = item?.verification?.status || item?.verificationStatus || 'none'
              return (
                <li key={id} className="grid grid-cols-6 items-center gap-2 border-t border-gray-100 px-4 py-3 text-sm text-gray-800">
                  <span className="truncate font-semibold">{item.fullName || 'Unnamed player'}</span>
                  <span className="truncate">{item.school || '—'}</span>
                  <span className="truncate">{item.division || '—'}</span>
                  <span className="capitalize">{STATUS_LABELS[status] || status}</span>
                  <span>{formatDate(item?.verification?.updatedAt || item.updatedAt, true)}</span>
                  <button
                    type="button"
                    onClick={() => loadDetail(id)}
                    className="text-right text-xs font-semibold text-orange-600 hover:text-orange-700"
                  >
                    View
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-700">
        <div>{meta.total} total</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevPage}
            disabled={filters.page <= 1}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-xs text-gray-600">{statusLabel}</span>
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
          <div className="absolute inset-0 bg-black/30" onClick={closeDetail} />
          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Verification detail</h2>
                  <p className="text-xs text-gray-500">Review stats and finalize the verification.</p>
                </div>
                <button
                  type="button"
                  onClick={closeDetail}
                  className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                  aria-label="Close"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 text-sm text-gray-700">
                {detailLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                    <div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" />
                  </div>
                ) : detailError ? (
                  <InlineBanner variant="error">{detailError}</InlineBanner>
                ) : !detail ? (
                  <div className="text-sm text-gray-600">No detail loaded.</div>
                ) : (
                  <div className="space-y-5">
                    <div className="grid gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">Player</p>
                          <p className="font-semibold text-gray-900">{detail.fullName || 'Unnamed player'}</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                          {statusText}
                        </span>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">Email</p>
                          <p className="font-semibold text-gray-900 break-all">{detail?.user?.email || '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">Division</p>
                          <p className="font-semibold text-gray-900">{detail.division || '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">School</p>
                          <p className="font-semibold text-gray-900">{detail.school || '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">JUCO Coach</p>
                          <p className="font-semibold text-gray-900">{detail.jucoCoach ? 'Linked' : '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">Email verified</p>
                          <p className="font-semibold text-gray-900">{formatDate(emailVerifiedAt, true)}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">Phone verified</p>
                          <p className="font-semibold text-gray-900">{formatDate(phoneVerifiedAt, true)}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Stats submission</h3>
                      <p className="text-xs text-gray-500">Submitted {formatDate(detail?.verification?.stats?.submittedAt, true)}.</p>
                      {statsSnapshot ? (
                        <div className="mt-3 space-y-3">
                          <div className="rounded-xl border border-gray-200 bg-white p-4">
                            <div className="grid gap-3 sm:grid-cols-3">
                              {statsFields.length ? (
                                statsFields.map((field) => (
                                  <div key={field.label} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{field.label}</p>
                                    <p className="mt-1 text-base font-semibold text-gray-900">{formatValue(field.value)}</p>
                                  </div>
                                ))
                              ) : (
                                <div className="text-xs text-gray-500">No stat totals provided.</div>
                              )}
                            </div>
                          </div>
                          <div className="rounded-xl border border-gray-200 bg-white p-4">
                            <div className="grid gap-3 sm:grid-cols-2">
                              {snapshotMeta.length ? (
                                snapshotMeta.map((field) => (
                                  <div key={field.label} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{field.label}</p>
                                    <p className="mt-1 text-sm font-semibold text-gray-900">{formatValue(field.value)}</p>
                                  </div>
                                ))
                              ) : (
                                <div className="text-xs text-gray-500">No snapshot details provided.</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4 text-xs text-gray-500">No stats snapshot available.</div>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Attestation</h4>
                        <p className="mt-1 text-sm text-gray-800">
                          {detail?.verification?.stats?.attested ? 'Attested by player' : 'Not attested'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Supporting files</h4>
                        {supportingFiles.length ? (
                          <ul className="mt-2 space-y-1 text-xs text-orange-600">
                            {supportingFiles.map((file, idx) => (
                              <li key={`${file}-${idx}`}>
                                <a href={file} target="_blank" rel="noreferrer" className="hover:underline">
                                  {file}
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-1 text-sm text-gray-500">None uploaded.</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500" htmlFor="reviewer-note">Reviewer note</label>
                      <textarea
                        id="reviewer-note"
                        rows="3"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Optional for approval. Required to request updates."
                        className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0"
                      />
                      {actionError && (
                        <InlineBanner variant="error" className="mt-3">
                          {actionError}
                        </InlineBanner>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 bg-white px-5 py-3">
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-gray-500">
                    Approve to mark verified. A note is required to request updates.
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                    <button
                      type="button"
                      onClick={closeDetail}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 sm:w-auto"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={handleReject}
                      disabled={actionLoading || isVerified}
                      className="w-full whitespace-nowrap rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                      Request updates
                    </button>
                    <button
                      type="button"
                      onClick={handleApprove}
                      disabled={actionLoading || isVerified}
                      className="w-full rounded-md bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AccountLayout>
  )
}
