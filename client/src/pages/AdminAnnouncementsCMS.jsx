import { useEffect, useState } from 'react'
import AccountLayout from '../components/layout/AccountLayout'
import {
  createAdminAnnouncement,
  deleteAdminAnnouncement,
  listAdminAnnouncements,
  updateAdminAnnouncement,
} from '../lib/api'

const TYPES = [
  { label: 'Product update', value: 'product_update' },
  { label: 'Sponsor spotlight', value: 'sponsor_spotlight' },
  { label: 'Program news', value: 'program_news' },
  { label: 'Default', value: 'default' },
]

const STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Drafts', value: 'draft' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Published', value: 'published' },
]

const EMPTY_DRAFT = {
  title: '',
  type: 'product_update',
  summary: '',
  publishedAt: '',
  expiresAt: '',
  ctaLabel: '',
  ctaUrl: '',
  badge: '',
  status: 'draft',
}

export default function AdminAnnouncementsCMS() {
  const [items, setItems] = useState([])
  const [filters, setFilters] = useState({ status: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [editingId, setEditingId] = useState(null)

  const typeLabel = (type) => TYPES.find((t) => t.value === type)?.label || type

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await listAdminAnnouncements(filters)
      setItems(res?.data || [])
    } catch (err) {
      setError(err?.message || 'Failed to load announcements')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status])

  const onChange = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setDraft(EMPTY_DRAFT)
    setEditingId(null)
  }

  const onEdit = (item) => {
    setEditingId(item._id || item.id)
    setDraft({
      title: item.title || '',
      type: item.type || 'default',
      summary: item.summary || '',
      publishedAt: item.publishedAt ? String(item.publishedAt).slice(0, 10) : '',
      expiresAt: item.expiresAt ? String(item.expiresAt).slice(0, 10) : '',
      ctaLabel: item.cta?.label || '',
      ctaUrl: item.cta?.url || '',
      badge: item.badge || '',
      status: item.status || 'draft',
    })
  }

  const onDelete = async (id) => {
    if (!id) return
    const confirmed = window.confirm('Delete this announcement?')
    if (!confirmed) return
    try {
      await deleteAdminAnnouncement(id)
      await load()
    } catch (err) {
      alert(err?.message || 'Delete failed')
    }
  }

  const onSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        title: draft.title,
        type: draft.type,
        summary: draft.summary,
        publishedAt: draft.publishedAt || undefined,
        expiresAt: draft.expiresAt || undefined,
        badge: draft.badge,
        status: draft.status || 'draft',
        cta: (draft.ctaLabel || draft.ctaUrl) ? { label: draft.ctaLabel, url: draft.ctaUrl } : undefined,
      }
      if (editingId) {
        await updateAdminAnnouncement(editingId, payload)
      } else {
        await createAdminAnnouncement(payload)
      }
      resetForm()
      await load()
    } catch (err) {
      alert(err?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AccountLayout title="Announcements CMS">
      <p className="text-sm text-gray-600">Draft, schedule, and publish announcements.</p>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr,1fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Filters:</span>
              <select
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                className="rounded-md border border-gray-300 px-2 py-1 text-xs shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <span className="text-xs text-gray-500">{items.length} items</span>
          </div>
          {error && (
            <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
          )}
          {loading ? (
            <div className="mt-3 space-y-2">
              {[1, 2, 3].map((key) => (
                <div key={key} className="h-12 animate-pulse rounded-md bg-gray-100" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="mt-3 text-sm text-gray-600">No announcements yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item._id || item.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500">{typeLabel(item.type)} • {item.summary}</p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <p className="capitalize">{item.status}</p>
                      <p>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : '—'}</p>
                      <div className="mt-1 flex justify-end gap-2 text-orange-600">
                        <button type="button" className="text-xs font-semibold" onClick={() => onEdit(item)}>Edit</button>
                        <button type="button" className="text-xs font-semibold" onClick={() => onDelete(item._id || item.id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900">{editingId ? 'Edit announcement' : 'New announcement'}</h2>
          <form className="mt-3 space-y-3" onSubmit={onSave}>
            <label className="block text-sm text-gray-700">
              <span className="mb-1 block font-medium">Title</span>
              <input
                type="text"
                value={draft.title}
                onChange={(e) => onChange('title', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0"
                required
              />
            </label>
            <label className="block text-sm text-gray-700">
              <span className="mb-1 block font-medium">Type</span>
              <select
                value={draft.type}
                onChange={(e) => onChange('type', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0"
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm text-gray-700">
              <span className="mb-1 block font-medium">Summary</span>
              <textarea
                value={draft.summary}
                onChange={(e) => onChange('summary', e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0"
                required
              />
            </label>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
              <label className="block">
                <span className="mb-1 block font-medium">Publish at</span>
                <input
                  type="date"
                  value={draft.publishedAt}
                  onChange={(e) => onChange('publishedAt', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0"
                />
              </label>
              <label className="block">
                <span className="mb-1 block font-medium">Expires at</span>
                <input
                  type="date"
                  value={draft.expiresAt}
                  onChange={(e) => onChange('expiresAt', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0"
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
              <label className="block">
                <span className="mb-1 block font-medium">CTA label</span>
                <input
                  type="text"
                  value={draft.ctaLabel}
                  onChange={(e) => onChange('ctaLabel', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0"
                />
              </label>
              <label className="block">
                <span className="mb-1 block font-medium">CTA URL</span>
                <input
                  type="url"
                  value={draft.ctaUrl}
                  onChange={(e) => onChange('ctaUrl', e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0"
                />
              </label>
            </div>
            <label className="block text-sm text-gray-700">
              <span className="mb-1 block font-medium">Badge (optional)</span>
              <input
                type="text"
                value={draft.badge}
                onChange={(e) => onChange('badge', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0"
              />
            </label>
            <label className="block text-sm text-gray-700">
              <span className="mb-1 block font-medium">Status</span>
              <select
                value={draft.status}
                onChange={(e) => onChange('status', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0"
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
              </select>
            </label>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving…' : editingId ? 'Update' : 'Save draft'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AccountLayout>
  )
}
