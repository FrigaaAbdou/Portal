import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AdjustmentsHorizontalIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
  MegaphoneIcon,
  PlayCircleIcon,
  PresentationChartBarIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import AccountLayout from '../components/layout/AccountLayout'
import { getMyPlayerProfile, getMyCoachProfile, savePlayerProfile, saveCoachProfile, listMyJucoPlayers } from '../lib/api'

function SectionCard({ title, subtitle, icon: Icon, children, canEdit = false, onEdit, className = '' }) {
  return (
    <div className={`group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-[1px] hover:border-orange-200 hover:shadow-md ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {Icon && (
            <span className="mt-0.5">
              <Icon className="h-5 w-5 text-orange-500" aria-hidden="true" />
            </span>
          )}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {canEdit && (
          <button
            type="button"
            aria-label={`Edit ${title}`}
            onClick={onEdit}
            className="rounded-full border border-gray-200 bg-white p-2 text-gray-500 transition hover:border-orange-200 hover:text-orange-600 md:opacity-0 md:group-hover:opacity-100"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
          </button>
        )}
      </div>
      <div className="mt-4 flex-1 text-sm text-gray-800">{children}</div>
    </div>
  )
}

function KeyValue({ label, value }) {
  if (!value && value !== 0) return null
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  )
}

function StatusBadge({ status = 'none' }) {
  const config = {
    verified: { label: 'Verified', className: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
    requested: { label: 'Pending review', className: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
    rejected: { label: 'Needs update', className: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500' },
    none: { label: 'Not verified', className: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
  }
  const { label, className, dot } = config[status] || config.none
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {label}
    </span>
  )
}

function initialsFrom(text = '') {
  const parts = String(text).trim().split(/\s+/)
  const a = parts[0]?.[0] || ''
  const b = parts[1]?.[0] || ''
  return (a + b).toUpperCase() || 'U'
}

function HeaderPanel({ name, subtitle, coverUrl, avatarUrl, fallbackInitials, role }) {
  return (
    <section className="relative mb-10 overflow-hidden rounded-3xl border border-transparent bg-gradient-to-br from-orange-50 via-white to-emerald-50 shadow-sm">
      {/* Cover panel */}
      <div
        className="relative h-32 w-full md:h-40"
        style={coverUrl ? { backgroundImage: `url(${coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: 'linear-gradient(135deg, rgba(251,146,60,0.5) 0%, rgba(16,185,129,0.45) 100%)' }}
      >
        {/* Avatar anchored to bottom-center of the cover */}
        <div className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2">
          <div className="pointer-events-auto grid h-24 w-24 place-items-center rounded-full border-4 border-white bg-orange-500 text-white shadow-xl md:h-28 md:w-28">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="h-full w-full rounded-full object-cover" />
            ) : (
              <span className="text-2xl font-semibold md:text-3xl">{fallbackInitials}</span>
            )}
          </div>
        </div>
      </div>
      {/* Name + subtitle + actions */}
      <div className="px-6 pb-6 pt-16 text-center md:px-10 md:pt-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 md:flex-row md:items-end md:justify-between">
          <div className="text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              {role && <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600 shadow-sm">{role}</span>}
            </div>
            <h2 className="mt-2 text-2xl font-semibold leading-tight text-gray-900 md:text-3xl">{name}</h2>
            {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
          </div>
          <div className="flex gap-2 text-xs">
            <button type="button" className="rounded-md border border-orange-200 bg-white px-3 py-1.5 font-medium text-orange-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-50">Change Photo</button>
            <button type="button" className="rounded-md border border-emerald-200 bg-white px-3 py-1.5 font-medium text-emerald-600 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50">Change Cover</button>
          </div>
        </div>
      </div>
    </section>
  )
}

function VerifyModal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            <button onClick={onClose} aria-label="Close" className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">×</button>
          </div>
          <div className="px-5 py-4 text-sm text-gray-700">{children}</div>
          <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-3">{footer}</div>
        </div>
      </div>
    </div>
  )
}

function BioSection({ initialBio, onSaved }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(initialBio || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const words = String(value).trim().split(/\s+/).filter(Boolean).length

  useEffect(() => {
    setValue(initialBio || '')
  }, [initialBio])

  async function save() {
    setSaving(true)
    setError('')
    try {
      const updated = await savePlayerProfile({ bio: value })
      onSaved?.(updated || null)
      setEditing(false)
    } catch (e) {
      setError(e?.message || 'Failed to save bio')
    } finally {
      setSaving(false)
    }
  }

  if (!editing && !initialBio) {
    return (
      <SectionCard title="About me" subtitle="Share your story, goals, and personality." icon={DocumentTextIcon}>
        <p className="text-gray-600">Add a short bio (about 150 words) to introduce yourself.</p>
        <div className="mt-3">
          <button onClick={() => setEditing(true)} className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600">Add Bio</button>
        </div>
      </SectionCard>
    )
  }

  if (!editing) {
    return (
      <SectionCard title="About me" subtitle="Share your story, goals, and personality." icon={DocumentTextIcon}>
        <p className="whitespace-pre-line">{initialBio}</p>
        <div className="mt-3">
          <button onClick={() => setEditing(true)} className="rounded-md border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:border-orange-300 hover:bg-orange-100">Edit</button>
        </div>
      </SectionCard>
    )
  }

  return (
    <SectionCard title="About me" subtitle="Share your story, goals, and personality." icon={DocumentTextIcon}>
      <textarea
        rows={5}
        maxLength={2000}
        className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:ring-0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Example: Senior WR from Miami, 3.6 GPA. Team captain, disciplined work ethic, interested in NCAA D2 programs in the Southeast…"
      />
      <div className={`mt-1 text-right text-xs ${words > 150 ? 'text-orange-600' : 'text-gray-500'}`}>{words}/150 words</div>
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
      <div className="mt-3 flex items-center gap-2">
        <button onClick={() => setEditing(false)} className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-300 hover:bg-gray-50">Cancel</button>
        <button onClick={save} disabled={saving} className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </SectionCard>
  )
}

function HighlightsSection({ urls, onSaved }) {
  const [editing, setEditing] = useState(false)
  const [list, setList] = useState(urls || [])
  const [newUrl, setNewUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { setList(urls || []) }, [urls])

  async function persist(next) {
    setSaving(true)
    setError('')
    try {
      const updated = await savePlayerProfile({ highlightUrls: next })
      onSaved?.(updated || null)
      setList((updated?.highlightUrls && Array.isArray(updated.highlightUrls)) ? updated.highlightUrls : next)
      setEditing(false)
      setNewUrl('')
    } catch (e) {
      setError(e?.message || 'Failed to save highlights')
    } finally {
      setSaving(false)
    }
  }

  function addUrl() {
    const u = newUrl.trim()
    if (!u) return
    const next = Array.from(new Set([...(list || []), u]))
    persist(next)
  }

  function removeUrl(u) {
    const next = (list || []).filter((x) => x !== u)
    persist(next)
  }

  if (!editing && (!list || list.length === 0)) {
    return (
      <SectionCard title="Highlights" subtitle="Share your best clips or showcase reels." icon={PlayCircleIcon}>
        <p className="text-gray-600">No highlights added yet. Drop in a YouTube or Hudl link to show coaches what sets you apart.</p>
        <div className="mt-3">
          <button onClick={() => setEditing(true)} className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600">Add highlight</button>
        </div>
      </SectionCard>
    )
  }

  if (!editing) {
    return (
      <SectionCard title="Highlights" subtitle="Share your best clips or showcase reels." icon={PlayCircleIcon}>
        <ul className="space-y-2">
          {list.map((url) => (
            <li key={url} className="flex items-center justify-between gap-3 rounded-xl border border-orange-100 bg-orange-50/70 px-3 py-2">
              <a className="truncate font-medium text-orange-600 hover:underline" href={url} target="_blank" rel="noreferrer">{url}</a>
              <button onClick={() => removeUrl(url)} className="rounded-md border border-orange-200 bg-white px-2 py-1 text-xs font-medium text-orange-600 transition hover:border-orange-300 hover:bg-orange-50">Remove</button>
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <button onClick={() => setEditing(true)} className="rounded-md border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-600 transition hover:border-orange-300 hover:bg-orange-50">Add more</button>
        </div>
      </SectionCard>
    )
  }

  return (
    <SectionCard title="Highlights" subtitle="Share your best clips or showcase reels." icon={PlayCircleIcon}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="url"
          placeholder="https://hudl.com/... or https://youtube.com/..."
          className="flex-1 rounded-md border border-orange-200 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:ring-0"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
        />
        <div className="flex gap-2">
          <button onClick={addUrl} disabled={saving} className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:opacity-50">{saving ? 'Saving…' : 'Add'}</button>
          <button onClick={() => { setEditing(false); setNewUrl('') }} className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-300 hover:bg-gray-50">Cancel</button>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </SectionCard>
  )
}

function CoachBioSection({ initialBio, onSaved }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(initialBio || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const words = String(value || '').trim().split(/\s+/).filter(Boolean).length

  useEffect(() => {
    setValue(initialBio || '')
  }, [initialBio])

  const save = async () => {
    setSaving(true)
    setError('')
    try {
      const updated = await saveCoachProfile({ bio: value })
      onSaved?.(updated)
      setEditing(false)
    } catch (e) {
      setError(e?.message || 'Failed to save bio')
    } finally {
      setSaving(false)
    }
  }

  if (!editing && !initialBio) {
    return (
      <SectionCard title="About me" subtitle="Give programs a sense of your coaching philosophy." icon={DocumentTextIcon} canEdit onEdit={() => setEditing(true)}>
        <p className="text-gray-600">Add a short bio to introduce yourself to players and coaches.</p>
        <div className="mt-3">
          <button onClick={() => setEditing(true)} className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600">Add bio</button>
        </div>
      </SectionCard>
    )
  }

  if (!editing) {
    return (
      <SectionCard title="About me" subtitle="Give programs a sense of your coaching philosophy." icon={DocumentTextIcon} canEdit onEdit={() => setEditing(true)}>
        <p className="whitespace-pre-line">{initialBio}</p>
      </SectionCard>
    )
  }

  return (
    <SectionCard title="About me" subtitle="Give programs a sense of your coaching philosophy." icon={DocumentTextIcon} canEdit={false}>
      <textarea
        rows={5}
        maxLength={2000}
        className="w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:ring-0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Example: Head coach at River CC with 5 years experience developing JUCO talent..."
      />
      <div className={`mt-1 text-right text-xs ${words > 150 ? 'text-orange-600' : 'text-gray-500'}`}>{words}/150 words</div>
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
      <div className="mt-3 flex items-center gap-2">
        <button onClick={() => { setEditing(false); setValue(initialBio || '') }} className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-300 hover:bg-gray-50">Cancel</button>
        <button onClick={save} disabled={saving} className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </SectionCard>
  )
}

export default function Profile() {
  const [loading, setLoading] = useState(true)
  const [player, setPlayer] = useState(null)
  const [coach, setCoach] = useState(null)
  const [error, setError] = useState('')

  // Editing state (defined unconditionally to keep hook order stable)
  const [editingAbout, setEditingAbout] = useState(false)
  const [aboutForm, setAboutForm] = useState({
    fullName: '',
    city: '',
    state: '',
    country: '',
    dob: '',
    heightFeet: '',
    heightInches: '',
    weightLbs: '',
    school: '',
    gpa: '',
    positionsText: '',
  })
  const [savingAbout, setSavingAbout] = useState(false)
  const [editingStats, setEditingStats] = useState(false)
  const [statsForm, setStatsForm] = useState({ games: 0, gamesStarted: 0, goals: 0, assists: 0, points: 0 })
  const [savingStats, setSavingStats] = useState(false)
  const [editingPrefs, setEditingPrefs] = useState(false)
  const [prefsForm, setPrefsForm] = useState({ division: '', budget: 0, preferredLocation: '' })
  const [savingPrefs, setSavingPrefs] = useState(false)
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [verifyNote, setVerifyNote] = useState('')
  const [verifyConfirm, setVerifyConfirm] = useState(false)
  const [verifySaving, setVerifySaving] = useState(false)
  const [editingCoachAbout, setEditingCoachAbout] = useState(false)
  const [coachAboutForm, setCoachAboutForm] = useState({
    firstName: '',
    lastName: '',
    jucoRole: '',
    jucoProgram: '',
    jucoLeague: '',
    jucoCity: '',
    jucoState: '',
    jucoPhone: '',
    jucoEmail: '',
    uniProgram: '',
    division: '',
    conference: '',
    position: '',
    uniAddress: '',
    uniPhone: '',
  })
  const [savingCoachAbout, setSavingCoachAbout] = useState(false)
  const [editingCoachPrefs, setEditingCoachPrefs] = useState(false)
  const [coachPrefsForm, setCoachPrefsForm] = useState({
    priorityPositionsText: '',
    minGpa: '',
    otherCriteria: '',
  })
  const [savingCoachPrefs, setSavingCoachPrefs] = useState(false)
  const [rosterPreview, setRosterPreview] = useState([])
  const [rosterMeta, setRosterMeta] = useState({ page: 1, totalPages: 1, total: 0, limit: 5 })
  const [rosterLoading, setRosterLoading] = useState(false)
  const [rosterError, setRosterError] = useState('')

  useEffect(() => {
    let mounted = true
    async function run() {
      setLoading(true)
      setError('')
      try {
        const [p, c] = await Promise.allSettled([getMyPlayerProfile(), getMyCoachProfile()])
        if (!mounted) return
        setPlayer(p.status === 'fulfilled' ? p.value : null)
        setCoach(c.status === 'fulfilled' ? c.value : null)
      } catch (e) {
        if (mounted) setError(e?.message || 'Failed to load profile')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => { mounted = false }
  }, [])

  const role = useMemo(() => (player ? 'player' : coach ? 'coach' : 'unknown'), [player, coach])

  // Sync edit forms when player data changes
  useEffect(() => {
    if (!player) return
    setAboutForm({
      fullName: player.fullName || '',
      city: player.city || '',
      state: player.state || '',
      country: player.country || '',
      dob: player.dob ? String(player.dob).slice(0, 10) : '',
      heightFeet: player.heightFeet !== undefined && player.heightFeet !== null ? String(player.heightFeet) : '',
      heightInches: player.heightInches !== undefined && player.heightInches !== null ? String(player.heightInches) : '',
      weightLbs: player.weightLbs !== undefined && player.weightLbs !== null ? String(player.weightLbs) : '',
      school: player.school || '',
      gpa: player.gpa || '',
      positionsText: Array.isArray(player.positions) ? player.positions.join(', ') : '',
    })
    setStatsForm({
      games: player.stats?.games || 0,
      gamesStarted: player.stats?.gamesStarted || 0,
      goals: player.stats?.goals || 0,
      assists: player.stats?.assists || 0,
      points: player.stats?.points || 0,
    })
    setPrefsForm({
      division: player.division || '',
      budget: player.budget || 0,
      preferredLocation: player.preferredLocation || '',
    })
  }, [player])

  useEffect(() => {
    if (!coach) return
    setCoachAboutForm({
      firstName: coach.firstName || '',
      lastName: coach.lastName || '',
      jucoRole: coach.jucoRole || '',
      jucoProgram: coach.jucoProgram || '',
      jucoLeague: coach.jucoLeague || '',
      jucoCity: coach.jucoCity || '',
      jucoState: coach.jucoState || '',
      jucoPhone: coach.jucoPhone || '',
      jucoEmail: coach.jucoEmail || '',
      uniProgram: coach.uniProgram || '',
      division: coach.division || '',
      conference: coach.conference || '',
      position: coach.position || '',
      uniAddress: coach.uniAddress || '',
      uniPhone: coach.uniPhone || '',
    })
    setCoachPrefsForm({
      priorityPositionsText: Array.isArray(coach.priorityPositions) ? coach.priorityPositions.join(', ') : '',
      minGpa: coach.minGpa || '',
      otherCriteria: coach.otherCriteria || '',
    })
  }, [coach])

  const loadRosterPreview = useCallback(async (page = 1) => {
    if (!coach || coach.coachType !== 'JUCO') {
      setRosterPreview([])
      setRosterError('')
      setRosterLoading(false)
      setRosterMeta({ page: 1, totalPages: 1, total: 0, limit: 5 })
      return
    }

    setRosterLoading(true)
    setRosterError('')
    try {
      const res = await listMyJucoPlayers({ page, limit: 5 })
      if (Array.isArray(res?.data)) {
        setRosterPreview(res.data)
        setRosterMeta({
          page: res.meta?.page || page,
          totalPages: res.meta?.totalPages || 1,
          total: res.meta?.total || res.data.length,
          limit: res.meta?.limit || 5,
        })
      } else if (Array.isArray(res)) {
        setRosterPreview(res.slice(0, 5))
        setRosterMeta({
          page,
          totalPages: 1,
          total: res.length,
          limit: 5,
        })
      } else {
        setRosterPreview([])
        setRosterMeta({ page, totalPages: 1, total: 0, limit: 5 })
      }
    } catch (err) {
      setRosterError(err?.message || 'Failed to load roster')
      setRosterPreview([])
      setRosterMeta({ page: 1, totalPages: 1, total: 0, limit: 5 })
    } finally {
      setRosterLoading(false)
    }
  }, [coach])

  useEffect(() => {
    loadRosterPreview(1)
  }, [loadRosterPreview])

  const title = role === 'player' ? 'Player Profile' : role === 'coach' ? 'Coach Profile' : 'Profile'

  if (loading) {
    return (
      <>
      <AccountLayout title={title}>
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-1/3 rounded bg-gray-100" />
          <div className="h-24 w-full rounded bg-gray-100" />
          <div className="h-24 w-full rounded bg-gray-100" />
        </div>
      </AccountLayout>
      </>
    )
  }

  if (error) {
    return (
      <AccountLayout title={title}>
        <p className="text-sm text-rose-600">{error}</p>
      </AccountLayout>
    )
  }

  if (!player && !coach) {
    return (
      <AccountLayout title={title}>
        <p className="text-sm text-gray-600">No profile found yet. Complete your sign up to see your profile here.</p>
      </AccountLayout>
    )
  }

  if (player) {
    const p = player
    const height = (p.heightFeet || p.heightInches) ? `${p.heightFeet || 0} ft ${p.heightInches || 0} in` : ''
    const weight = p.weightLbs ? `${p.weightLbs} lbs` : ''
    const canEdit = true // owner view

    const resetAboutForm = () => {
      setAboutForm({
        fullName: p.fullName || '',
        city: p.city || '',
        state: p.state || '',
        country: p.country || '',
        dob: p.dob ? String(p.dob).slice(0, 10) : '',
        heightFeet: p.heightFeet !== undefined && p.heightFeet !== null ? String(p.heightFeet) : '',
        heightInches: p.heightInches !== undefined && p.heightInches !== null ? String(p.heightInches) : '',
        weightLbs: p.weightLbs !== undefined && p.weightLbs !== null ? String(p.weightLbs) : '',
        school: p.school || '',
        gpa: p.gpa || '',
        positionsText: Array.isArray(p.positions) ? p.positions.join(', ') : '',
      })
    }

    const resetStatsForm = () => {
      setStatsForm({
        games: p.stats?.games || 0,
        gamesStarted: p.stats?.gamesStarted || 0,
        goals: p.stats?.goals || 0,
        assists: p.stats?.assists || 0,
        points: p.stats?.points || 0,
      })
    }

    const resetPrefsForm = () => {
      setPrefsForm({
        division: p.division || '',
        budget: p.budget || 0,
        preferredLocation: p.preferredLocation || '',
      })
    }

    async function saveAbout() {
      setSavingAbout(true)
      try {
        const parseNumber = (value) => {
          if (value === '' || value === null || value === undefined) return null
          const num = Number(value)
          return Number.isNaN(num) ? null : num
        }
        const positions = aboutForm.positionsText
          .split(/[,\\n]/)
          .map((item) => item.trim())
          .filter(Boolean)

        const payload = {
          fullName: aboutForm.fullName,
          city: aboutForm.city,
          state: aboutForm.state,
          country: aboutForm.country,
          dob: aboutForm.dob || null,
          heightFeet: parseNumber(aboutForm.heightFeet),
          heightInches: parseNumber(aboutForm.heightInches),
          weightLbs: parseNumber(aboutForm.weightLbs),
          school: aboutForm.school,
          gpa: aboutForm.gpa,
          positions,
        }
        const updated = await savePlayerProfile(payload)
        setPlayer(updated || null)
        setEditingAbout(false)
      } catch (e) {
        alert(e?.message || 'Failed to save')
      } finally {
        setSavingAbout(false)
      }
    }

    async function saveStats() {
      setSavingStats(true)
      try {
        const payload = { ...statsForm }
        const updated = await savePlayerProfile(payload)
        setPlayer(updated || null)
        setEditingStats(false)
      } catch (e) {
        alert(e?.message || 'Failed to save')
      } finally {
        setSavingStats(false)
      }
    }

    async function savePrefs() {
      setSavingPrefs(true)
      try {
        const updated = await savePlayerProfile({ ...prefsForm })
        setPlayer(updated || null)
        setEditingPrefs(false)
      } catch (e) {
        alert(e?.message || 'Failed to save')
      } finally {
        setSavingPrefs(false)
      }
    }
    return (
      <>
      <AccountLayout title={title}>
        <HeaderPanel
          name={p.fullName || 'Player'}
          subtitle={[p.city, p.state].filter(Boolean).join(', ')}
          coverUrl={p.coverUrl}
          avatarUrl={p.avatarUrl}
          fallbackInitials={initialsFrom(p.fullName || 'Player')}
          role="Player"
        />
        <div className="space-y-8">
          <SectionCard
            title="Verification"
            subtitle="Keep your profile trusted by college programs."
            icon={ShieldCheckIcon}
          canEdit
          onEdit={() => setVerifyOpen(true)}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2 text-sm">
              <StatusBadge status={p.verificationStatus} />
              {p.verificationNote && (
                <p className="rounded-lg border border-orange-100 bg-orange-50 px-3 py-2 text-xs text-orange-700">
                  {p.verificationNote}
                </p>
              )}
            </div>
            <button
              onClick={() => setVerifyOpen(true)}
              className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              Request update
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </SectionCard>
          <BioSection initialBio={p.bio} onSaved={(profile) => setPlayer(profile || null)} />
          <div className="grid gap-4 md:grid-cols-2">
            <SectionCard title="About" icon={UserCircleIcon} subtitle="Academic, personal, and physical snapshot." canEdit={canEdit} onEdit={() => { resetAboutForm(); setEditingAbout(true) }}>
            {editingAbout ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block text-gray-600">Full name</span>
                  <input
                    className="w-full rounded-md border border-orange-200 px-3 py-2 text-sm focus:border-orange-400 focus:ring-0"
                    value={aboutForm.fullName}
                    onChange={(e)=>setAboutForm(a=>({...a, fullName:e.target.value}))}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-gray-600">Date of birth</span>
                  <input
                    type="date"
                    className="w-full rounded-md border border-orange-200 px-3 py-2 text-sm focus:border-orange-400 focus:ring-0"
                    value={aboutForm.dob}
                    onChange={(e)=>setAboutForm(a=>({...a, dob:e.target.value}))}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-gray-600">City</span>
                  <input
                    className="w-full rounded-md border border-orange-200 px-3 py-2 text-sm focus:border-orange-400 focus:ring-0"
                    value={aboutForm.city}
                    onChange={(e)=>setAboutForm(a=>({...a, city:e.target.value}))}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-gray-600">State</span>
                  <input
                    className="w-full rounded-md border border-orange-200 px-3 py-2 text-sm focus:border-orange-400 focus:ring-0"
                    value={aboutForm.state}
                    onChange={(e)=>setAboutForm(a=>({...a, state:e.target.value}))}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-gray-600">Country</span>
                  <input
                    className="w-full rounded-md border border-orange-200 px-3 py-2 text-sm focus:border-orange-400 focus:ring-0"
                    value={aboutForm.country}
                    onChange={(e)=>setAboutForm(a=>({...a, country:e.target.value}))}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-gray-600">School / Team</span>
                  <input
                    className="w-full rounded-md border border-orange-200 px-3 py-2 text-sm focus:border-orange-400 focus:ring-0"
                    value={aboutForm.school}
                    onChange={(e)=>setAboutForm(a=>({...a, school:e.target.value}))}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-gray-600">GPA</span>
                  <input
                    className="w-full rounded-md border border-orange-200 px-3 py-2 text-sm focus:border-orange-400 focus:ring-0"
                    value={aboutForm.gpa}
                    onChange={(e)=>setAboutForm(a=>({...a, gpa:e.target.value}))}
                  />
                </label>
                <div className="sm:col-span-2 grid gap-3 sm:grid-cols-3">
                  <label className="block text-sm">
                    <span className="mb-1 block text-gray-600">Height (ft)</span>
                    <input
                      type="number"
                      min="0"
                      max="9"
                      className="w-full rounded-md border border-orange-200 px-3 py-2 text-sm focus:border-orange-400 focus:ring-0"
                      value={aboutForm.heightFeet}
                      onChange={(e)=>setAboutForm(a=>({...a, heightFeet:e.target.value}))}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-gray-600">Height (in)</span>
                    <input
                      type="number"
                      min="0"
                      max="11"
                      className="w-full rounded-md border border-orange-200 px-3 py-2 text-sm focus:border-orange-400 focus:ring-0"
                      value={aboutForm.heightInches}
                      onChange={(e)=>setAboutForm(a=>({...a, heightInches:e.target.value}))}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-gray-600">Weight (lbs)</span>
                    <input
                      type="number"
                      min="0"
                      className="w-full rounded-md border border-orange-200 px-3 py-2 text-sm focus:border-orange-400 focus:ring-0"
                      value={aboutForm.weightLbs}
                      onChange={(e)=>setAboutForm(a=>({...a, weightLbs:e.target.value}))}
                    />
                  </label>
                </div>
                <label className="block text-sm sm:col-span-2">
                  <span className="mb-1 block text-gray-600">Positions (comma separated)</span>
                  <textarea
                    rows={2}
                    className="w-full rounded-md border border-orange-200 px-3 py-2 text-sm focus:border-orange-400 focus:ring-0"
                    value={aboutForm.positionsText}
                    onChange={(e)=>setAboutForm(a=>({...a, positionsText:e.target.value}))}
                    placeholder="QB, WR, KR"
                  />
                </label>
                <div className="sm:col-span-2 mt-2 flex items-center gap-2">
                  <button onClick={()=>{setEditingAbout(false); resetAboutForm()}} className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-300 hover:bg-gray-50">Cancel</button>
                  <button onClick={saveAbout} disabled={savingAbout} className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:opacity-50">{savingAbout?'Saving…':'Save'}</button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
              <KeyValue label="Full name" value={p.fullName} />
              <KeyValue label="Location" value={[p.city, p.state, p.country].filter(Boolean).join(', ')} />
              <KeyValue label="Height" value={height} />
              <KeyValue label="Weight" value={weight} />
              <KeyValue label="Date of birth" value={p.dob ? String(p.dob).slice(0, 10) : ''} />
              <KeyValue label="School / Team" value={p.school} />
              <KeyValue label="GPA" value={p.gpa} />
              {Array.isArray(p.positions) && p.positions.length > 0 && (
                <div className="flex items-start justify-between gap-4">
                  <span className="text-gray-600">Positions</span>
                  <div className="flex flex-wrap gap-2">
                    {p.positions.map((pos) => (
                      <span key={pos} className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">{pos}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            )}
          </SectionCard>

          <HighlightsSection urls={p.highlightUrls || []} onSaved={(profile) => setPlayer(profile || null)} />

          <SectionCard
            title="Stats (season)"
            subtitle="Keep your latest performance metrics up to date."
            icon={PresentationChartBarIcon}
            canEdit={canEdit}
            onEdit={() => { resetStatsForm(); setEditingStats(true) }}
          >
            {editingStats ? (
              <div className="grid grid-cols-5 gap-3 text-center">
                {['games','gamesStarted','goals','assists','points'].map((k)=>(
                  <label key={k} className="text-xs text-gray-600">
                    <div className="mb-1">{k === 'gamesStarted' ? 'Started' : k.charAt(0).toUpperCase()+k.slice(1)}</div>
                    <input type="number" min="0" className="w-16 rounded-md border border-orange-200 px-2 py-1 text-sm focus:border-orange-400 focus:ring-0"
                      value={statsForm[k]} onChange={(e)=>setStatsForm(s=>({...s,[k]: Number(e.target.value||0)}))} />
                  </label>
                ))}
                <div className="col-span-5 mt-2 flex items-center justify-center gap-2">
                  <button onClick={()=>{setEditingStats(false); resetStatsForm()}} className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-300 hover:bg-gray-50">Cancel</button>
                  <button onClick={saveStats} disabled={savingStats} className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:opacity-50">{savingStats?'Saving…':'Save'}</button>
                </div>
              </div>
            ) : p.stats ? (
              <div className="grid grid-cols-5 gap-3 text-center">
                {[
                  { label: 'Games', value: p.stats.games },
                  { label: 'Started', value: p.stats.gamesStarted },
                  { label: 'Goals', value: p.stats.goals },
                  { label: 'Assists', value: p.stats.assists },
                  { label: 'Points', value: p.stats.points },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl border border-orange-100 bg-orange-50/70 px-3 py-3 shadow-sm">
                    <div className="text-xs font-semibold uppercase tracking-wide text-orange-600">{label}</div>
                    <div className="mt-2 text-xl font-bold text-gray-900">{value || 0}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No stats recorded yet.</p>
            )}
          </SectionCard>

          <SectionCard
            title="Preferences"
            subtitle="Let recruiters know where you want to land."
            icon={AdjustmentsHorizontalIcon}
            canEdit={canEdit}
            onEdit={() => { resetPrefsForm(); setEditingPrefs(true) }}
          >
            {editingPrefs ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block text-gray-600">Desired division</span>
                  <select
                    className="w-full rounded-md border border-orange-200 px-3 py-2 text-sm focus:border-orange-400 focus:ring-0"
                    value={prefsForm.division}
                    onChange={(e)=>setPrefsForm(f=>({...f, division:e.target.value}))}
                  >
                    <option value="">Select…</option>
                    <option>NCAA D1</option>
                    <option>NCAA D2</option>
                    <option>NCAA D3</option>
                    <option>NAIA</option>
                    <option>NJCAA</option>
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-gray-600">Budget (USD)</span>
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-md border border-orange-200 px-3 py-2 text-sm focus:border-orange-400 focus:ring-0"
                    value={prefsForm.budget}
                    onChange={(e)=>setPrefsForm(f=>({...f, budget:Number(e.target.value||0)}))}
                  />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="mb-1 block text-gray-600">Preferred location (US state)</span>
                  <select
                    className="w-full rounded-md border border-orange-200 px-3 py-2 text-sm focus:border-orange-400 focus:ring-0"
                    value={prefsForm.preferredLocation}
                    onChange={(e)=>setPrefsForm(f=>({...f, preferredLocation:e.target.value}))}
                  >
                    <option value="">Select…</option>
                    {['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming','Other / International'].map((s)=>(
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <div className="sm:col-span-2 mt-2 flex items-center gap-2">
                  <button onClick={()=>{setEditingPrefs(false); resetPrefsForm()}} className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-300 hover:bg-gray-50">Cancel</button>
                  <button
                    onClick={savePrefs}
                    disabled={savingPrefs}
                    className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:opacity-50"
                  >{savingPrefs?'Saving…':'Save'}</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <KeyValue label="Desired division" value={p.division} />
                <KeyValue label="Budget" value={p.budget ? `$${p.budget}` : '—'} />
                <KeyValue label="Preferred location" value={p.preferredLocation} />
                <p className="text-xs text-gray-500">Recruiters use this information to tailor outreach and scholarship conversations.</p>
              </div>
            )}
          </SectionCard>
        </div>
      </div>
      </AccountLayout>
      <VerifyModal
        open={verifyOpen}
        onClose={() => setVerifyOpen(false)}
        title="Request Verification"
        footer={(
          <>
            <button onClick={() => setVerifyOpen(false)} className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-300 hover:bg-gray-50">Cancel</button>
            <button
              disabled={!verifyConfirm || verifySaving}
              onClick={async()=>{
                setVerifySaving(true)
                try {
                  const updated = await savePlayerProfile({ verificationStatus: 'requested', verificationNote: verifyNote })
                  setPlayer(updated || null)
                  setVerifyOpen(false)
                } catch(e){
                  alert(e?.message||'Failed to request verification')
                } finally {
                  setVerifySaving(false)
                }
              }}
              className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:opacity-50"
            >{verifySaving ? 'Submitting…' : 'Submit'}</button>
          </>
        )}
      >
        <div className="space-y-3 text-sm">
          <p className="text-gray-700">Request profile verification. An admin or coach may review your details before marking you as verified.</p>
          <label className="block">
            <span className="mb-1 block text-gray-700">Optional note</span>
            <textarea rows={3} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0" value={verifyNote} onChange={(e)=>setVerifyNote(e.target.value)} placeholder="Anything we should know for verification…" />
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600" checked={verifyConfirm} onChange={(e)=>setVerifyConfirm(e.target.checked)} />
            <span className="text-gray-700">I confirm my information is accurate.</span>
          </label>
        </div>
      </VerifyModal>
      </>
    )
  }

  // Coach view
  const c = coach
  async function saveCoachAbout() {
    setSavingCoachAbout(true)
    try {
      const payload = {
        firstName: coachAboutForm.firstName,
        lastName: coachAboutForm.lastName,
      }
      if (c.coachType === 'JUCO') {
        Object.assign(payload, {
          jucoRole: coachAboutForm.jucoRole,
          jucoProgram: coachAboutForm.jucoProgram,
          jucoLeague: coachAboutForm.jucoLeague,
          jucoCity: coachAboutForm.jucoCity,
          jucoState: coachAboutForm.jucoState,
          jucoPhone: coachAboutForm.jucoPhone,
          jucoEmail: coachAboutForm.jucoEmail,
        })
      } else {
        Object.assign(payload, {
          uniProgram: coachAboutForm.uniProgram,
          division: coachAboutForm.division,
          conference: coachAboutForm.conference,
          position: coachAboutForm.position,
          uniAddress: coachAboutForm.uniAddress,
          uniPhone: coachAboutForm.uniPhone,
        })
      }
      const updated = await saveCoachProfile(payload)
      setCoach(updated || null)
      setEditingCoachAbout(false)
    } catch (e) {
      alert(e?.message || 'Failed to save')
    } finally {
      setSavingCoachAbout(false)
    }
  }

  async function saveCoachPrefs() {
    setSavingCoachPrefs(true)
    try {
      const positions = coachPrefsForm.priorityPositionsText
        .split(/[,\\n]/)
        .map((item) => item.trim())
        .filter(Boolean)
      const payload = {
        priorityPositions: positions,
        minGpa: coachPrefsForm.minGpa,
        otherCriteria: coachPrefsForm.otherCriteria,
      }
      const updated = await saveCoachProfile(payload)
      setCoach(updated || null)
      setEditingCoachPrefs(false)
    } catch (e) {
      alert(e?.message || 'Failed to save')
    } finally {
      setSavingCoachPrefs(false)
    }
  }

  return (
    <AccountLayout title={title}>
      <HeaderPanel
        name={c.firstName && c.lastName ? `${c.firstName} ${c.lastName}` : (c.coachType === 'JUCO' ? c.jucoProgram : c.uniProgram) || 'Coach'}
        subtitle={c.coachType === 'JUCO' ? [c.jucoCity, c.jucoState].filter(Boolean).join(', ') : c.conference}
        coverUrl={c.coverUrl}
        avatarUrl={c.avatarUrl}
        fallbackInitials={initialsFrom(c.firstName && c.lastName ? `${c.firstName} ${c.lastName}` : (c.coachType === 'JUCO' ? c.jucoProgram : c.uniProgram) || 'Coach')}
        role={`${c.coachType || 'Coach'} Coach`}
      />
      <CoachBioSection initialBio={c.bio} onSaved={(profile) => setCoach(profile || null)} />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <SectionCard title="About" subtitle="Program details and contact information." icon={BuildingLibraryIcon} canEdit onEdit={() => setEditingCoachAbout(true)} className="h-full">
          {editingCoachAbout ? (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block text-gray-600">First name</span>
                  <input
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0"
                    value={coachAboutForm.firstName}
                    onChange={(e) => setCoachAboutForm((prev) => ({ ...prev, firstName: e.target.value }))}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-gray-600">Last name</span>
                  <input
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0"
                    value={coachAboutForm.lastName}
                    onChange={(e) => setCoachAboutForm((prev) => ({ ...prev, lastName: e.target.value }))}
                  />
                </label>
              </div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Program details</p>
              {c.coachType === 'JUCO' ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-1 block text-gray-600">Role</span>
                    <input
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0"
                      value={coachAboutForm.jucoRole}
                      onChange={(e) => setCoachAboutForm((prev) => ({ ...prev, jucoRole: e.target.value }))}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-gray-600">League</span>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0"
                      value={coachAboutForm.jucoLeague}
                      onChange={(e) => setCoachAboutForm((prev) => ({ ...prev, jucoLeague: e.target.value }))}
                    >
                      <option value="">Select…</option>
                      <option value="NJCAA">NJCAA</option>
                      <option value="CCCAA">CCCAA</option>
                      <option value="NWAC">NWAC</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                  <label className="block text-sm sm:col-span-2">
                    <span className="mb-1 block text-gray-600">Program</span>
                    <input
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0"
                      value={coachAboutForm.jucoProgram}
                      onChange={(e) => setCoachAboutForm((prev) => ({ ...prev, jucoProgram: e.target.value }))}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-gray-600">City</span>
                    <input
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0"
                      value={coachAboutForm.jucoCity}
                      onChange={(e) => setCoachAboutForm((prev) => ({ ...prev, jucoCity: e.target.value }))}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-gray-600">State</span>
                    <input
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0"
                      value={coachAboutForm.jucoState}
                      onChange={(e) => setCoachAboutForm((prev) => ({ ...prev, jucoState: e.target.value }))}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-gray-600">Phone</span>
                    <input
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0"
                      value={coachAboutForm.jucoPhone}
                      onChange={(e) => setCoachAboutForm((prev) => ({ ...prev, jucoPhone: e.target.value }))}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-gray-600">Email</span>
                    <input
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0"
                      value={coachAboutForm.jucoEmail}
                      onChange={(e) => setCoachAboutForm((prev) => ({ ...prev, jucoEmail: e.target.value }))}
                    />
                  </label>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm sm:col-span-2">
                    <span className="mb-1 block text-gray-600">Program</span>
                    <input
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0"
                      value={coachAboutForm.uniProgram}
                      onChange={(e) => setCoachAboutForm((prev) => ({ ...prev, uniProgram: e.target.value }))}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-gray-600">Division</span>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0"
                      value={coachAboutForm.division}
                      onChange={(e) => setCoachAboutForm((prev) => ({ ...prev, division: e.target.value }))}
                    >
                      <option value="">Select…</option>
                      <option value="NCAA D1">NCAA D1</option>
                      <option value="NCAA D2">NCAA D2</option>
                      <option value="NCAA D3">NCAA D3</option>
                      <option value="NAIA">NAIA</option>
                    </select>
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-gray-600">Conference</span>
                    <input
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0"
                      value={coachAboutForm.conference}
                      onChange={(e) => setCoachAboutForm((prev) => ({ ...prev, conference: e.target.value }))}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-gray-600">Position</span>
                    <input
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0"
                      value={coachAboutForm.position}
                      onChange={(e) => setCoachAboutForm((prev) => ({ ...prev, position: e.target.value }))}
                    />
                  </label>
                  <label className="block text-sm sm:col-span-2">
                    <span className="mb-1 block text-gray-600">Address</span>
                    <input
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0"
                      value={coachAboutForm.uniAddress}
                      onChange={(e) => setCoachAboutForm((prev) => ({ ...prev, uniAddress: e.target.value }))}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-gray-600">Phone</span>
                    <input
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0"
                      value={coachAboutForm.uniPhone}
                      onChange={(e) => setCoachAboutForm((prev) => ({ ...prev, uniPhone: e.target.value }))}
                    />
                  </label>
                </div>
              )}
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingCoachAbout(false)
                    setCoachAboutForm({
                      firstName: c.firstName || '',
                      lastName: c.lastName || '',
                      jucoRole: c.jucoRole || '',
                      jucoProgram: c.jucoProgram || '',
                      jucoLeague: c.jucoLeague || '',
                      jucoCity: c.jucoCity || '',
                      jucoState: c.jucoState || '',
                      jucoPhone: c.jucoPhone || '',
                      jucoEmail: c.jucoEmail || '',
                      uniProgram: c.uniProgram || '',
                      division: c.division || '',
                      conference: c.conference || '',
                      position: c.position || '',
                      uniAddress: c.uniAddress || '',
                      uniPhone: c.uniPhone || '',
                    })
                  }}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCoachAbout}
                  disabled={savingCoachAbout}
                  className="rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {savingCoachAbout ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          ) : c.coachType === 'JUCO' ? (
            <dl className="grid gap-3">
              <div className="grid gap-1 rounded-xl border border-orange-100 bg-orange-50/60 px-4 py-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-orange-600">Coach type</dt>
                <dd className="text-sm font-semibold text-gray-900">{c.coachType}</dd>
              </div>
              <div className="grid gap-1 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Role</dt>
                <dd className="text-sm font-medium text-gray-900">{c.jucoRole || '—'}</dd>
              </div>
              <div className="grid gap-1 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Program</dt>
                <dd className="text-sm font-medium text-gray-900">{c.jucoProgram || '—'}</dd>
                <dd className="text-xs text-gray-500">{[c.jucoCity, c.jucoState].filter(Boolean).join(', ') || 'Location not set'}</dd>
              </div>
              <div className="grid gap-1 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">League</dt>
                <dd className="text-sm font-medium text-gray-900">{c.jucoLeague || '—'}</dd>
              </div>
              <div className="grid gap-1 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Contact</dt>
                <dd className="text-sm font-medium text-gray-900">{c.jucoPhone || '—'}</dd>
                <dd className="text-xs text-gray-500">{c.jucoEmail || 'Email not added'}</dd>
              </div>
            </dl>
          ) : (
            <dl className="grid gap-3">
              <div className="grid gap-1 rounded-xl border border-orange-100 bg-orange-50/60 px-4 py-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-orange-600">Coach type</dt>
                <dd className="text-sm font-semibold text-gray-900">{c.coachType}</dd>
              </div>
              <div className="grid gap-1 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Program</dt>
                <dd className="text-sm font-medium text-gray-900">{c.uniProgram || '—'}</dd>
                <dd className="text-xs text-gray-500">{c.uniAddress || 'Address not set'}</dd>
              </div>
              <div className="grid gap-1 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Division & conference</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {[c.division, c.conference].filter(Boolean).join(' • ') || '—'}
                </dd>
              </div>
              <div className="grid gap-1 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Role</dt>
                <dd className="text-sm font-medium text-gray-900">{c.position || '—'}</dd>
              </div>
              <div className="grid gap-1 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Contact</dt>
                <dd className="text-sm font-medium text-gray-900">{c.uniPhone || '—'}</dd>
              </div>
            </dl>
          )}
        </SectionCard>
        {c.coachType === 'JUCO' && (
          <SectionCard
            title="Roster snapshot"
            subtitle="Players linked to your program."
            icon={PlayCircleIcon}
            className="h-full"
          >
            {rosterError ? (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                <span>{rosterError}</span>
                <button
                  type="button"
                  onClick={loadRosterPreview}
                  className="rounded-md border border-rose-300 bg-white px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                >
                  Try again
                </button>
              </div>
            ) : rosterLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((key) => (
                  <div key={key} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-32 rounded bg-gray-200" />
                      <div className="h-3 w-24 rounded bg-gray-100" />
                    </div>
                    <div className="h-6 w-20 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full flex-col">
                <div className="flex-1">
                  {rosterPreview.length === 0 ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-5 text-sm text-amber-800">
                      <p className="font-semibold">No players linked yet</p>
                      <p className="mt-1">
                        Ask your athletes to list <span className="font-semibold">{c.jucoProgram || 'your JUCO program'}</span> when they create their Portal profile and they’ll appear here automatically.
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {rosterPreview.map((player) => {
                        const updated = player.updatedAt ? new Date(player.updatedAt) : null
                        const positions = Array.isArray(player.positions) ? player.positions.join(', ') : ''
                        const noteAdded = Boolean(player.jucoCoachNote)
                        return (
                        <li key={player._id} className="flex items-center gap-3 rounded-xl border border-orange-100 bg-gray-50 px-3 py-3 transition hover:border-orange-200">
                            <div className="grid h-11 w-11 flex-none place-items-center rounded-full bg-orange-500 text-sm font-semibold text-white">
                              {initialsFrom(player.fullName || player.school || 'Player')}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-gray-900">{player.fullName || player.school || 'Player'}</p>
                              <p className="mt-0.5 truncate text-xs text-gray-500">
                                {positions || 'No positions listed'}
                                {player.gpa ? ` · GPA ${player.gpa}` : ''}
                                {updated ? ` · Updated ${updated.toLocaleDateString()}` : ''}
                              </p>
                            </div>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                                noteAdded ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {noteAdded ? 'Note added' : 'No note'}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
                <div className="mt-auto space-y-3 pt-4 text-xs text-gray-500">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span>Roster updates sync whenever players list your JUCO program.</span>
                    <div className="flex items-center gap-2">
                      {rosterMeta.totalPages > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() => loadRosterPreview(rosterMeta.page - 1)}
                            disabled={rosterMeta.page <= 1 || rosterLoading}
                            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Previous
                          </button>
                          <span>
                            Page {rosterMeta.page} of {rosterMeta.totalPages}
                          </span>
                          <button
                            type="button"
                            onClick={() => loadRosterPreview(rosterMeta.page + 1)}
                            disabled={rosterMeta.page >= rosterMeta.totalPages || rosterLoading}
                            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Next
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => loadRosterPreview(rosterMeta.page)}
                      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
                    >
                      Refresh
                    </button>
                    <Link
                      to="/players/my"
                      className="inline-flex items-center gap-1 rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
                    >
                      View all players
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </SectionCard>
        )}

        {c.coachType !== 'JUCO' && (
          <SectionCard title="Preferences" subtitle="Share what kind of athletes you need next." icon={MegaphoneIcon} canEdit onEdit={() => setEditingCoachPrefs(true)}>
            {editingCoachPrefs ? (
              <div className="space-y-3">
                <label className="block text-sm">
                  <span className="mb-1 block text-gray-600">Priority positions (comma separated)</span>
                  <textarea
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0"
                    value={coachPrefsForm.priorityPositionsText}
                    onChange={(e) => setCoachPrefsForm((prev) => ({ ...prev, priorityPositionsText: e.target.value }))}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-gray-600">Minimum GPA</span>
                  <input
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0"
                    value={coachPrefsForm.minGpa}
                    onChange={(e) => setCoachPrefsForm((prev) => ({ ...prev, minGpa: e.target.value }))}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-gray-600">Other criteria</span>
                  <textarea
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:ring-0"
                    value={coachPrefsForm.otherCriteria}
                    onChange={(e) => setCoachPrefsForm((prev) => ({ ...prev, otherCriteria: e.target.value }))}
                  />
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingCoachPrefs(false)
                      setCoachPrefsForm({
                        priorityPositionsText: Array.isArray(c.priorityPositions) ? c.priorityPositions.join(', ') : '',
                        minGpa: c.minGpa || '',
                        otherCriteria: c.otherCriteria || '',
                      })
                    }}
                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveCoachPrefs}
                    disabled={savingCoachPrefs}
                    className="rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {savingCoachPrefs ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <KeyValue label="Priority positions" value={Array.isArray(c.priorityPositions) ? c.priorityPositions.join(', ') : c.priorityPositions} />
                <KeyValue label="Min GPA" value={c.minGpa} />
                <KeyValue label="Other criteria" value={c.otherCriteria} />
              </div>
            )}
          </SectionCard>
        )}
      </div>
    </AccountLayout>
  )
}
