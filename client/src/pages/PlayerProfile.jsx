import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AccountLayout from '../components/layout/AccountLayout'
import { usePlayerProfile } from '../hooks/usePlayerProfile'
import { fetchFavorites, removeFavorite, saveFavorite } from '../lib/api'

function StatBlock({ label, value }) {
  if (value === undefined || value === null) return null
  return (
    <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-center shadow-sm">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{label}</span>
      <span className="mt-1 text-lg font-bold text-gray-900">{value}</span>
    </div>
  )
}

function PositionChips({ positions }) {
  if (!Array.isArray(positions) || positions.length === 0) {
    return <span className="text-xs text-gray-500">No positions listed</span>
  }
  return (
    <div className="flex flex-wrap gap-2">
      {positions.map((pos) => (
        <span key={pos} className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">{pos}</span>
      ))}
    </div>
  )
}

export default function PlayerProfile() {
  const { playerId } = useParams()
  const navigate = useNavigate()
  const { profile, loading, error, refresh } = usePlayerProfile(playerId)
  const [favoriteMap, setFavoriteMap] = useState({})
  const [favLoading, setFavLoading] = useState(false)
  const isFavorited = Boolean(playerId && favoriteMap[playerId])

  useEffect(() => {
    let active = true
    fetchFavorites()
      .then((list) => {
        if (!active || !Array.isArray(list)) return
        const map = {}
        list.forEach((fav) => {
          if (fav?.player?._id) map[fav.player._id] = fav
        })
        setFavoriteMap(map)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const toggleFavorite = async () => {
    if (!playerId) return
    setFavLoading(true)
    try {
      if (isFavorited) {
        await removeFavorite(playerId)
        setFavoriteMap((prev) => {
          const next = { ...prev }
          delete next[playerId]
          return next
        })
      } else {
        const fav = await saveFavorite({ playerId })
        if (fav?.player?._id) {
          setFavoriteMap((prev) => ({ ...prev, [fav.player._id]: fav }))
        }
      }
    } catch (err) {
      alert(err?.message || 'Failed to update favorites')
    } finally {
      setFavLoading(false)
    }
  }

  const headerTitle = useMemo(() => profile?.fullName || 'Player profile', [profile?.fullName])

  const heightText = useMemo(() => {
    if (!profile) return ''
    const feet = Number(profile.heightFeet)
    const inches = Number(profile.heightInches)
    if (!Number.isFinite(feet) && !Number.isFinite(inches)) return ''
    return `${Number.isFinite(feet) ? feet : 0}' ${Number.isFinite(inches) ? inches : 0}"`
  }, [profile])

  const weightText = useMemo(() => {
    if (!profile) return ''
    const lbs = Number(profile.weightLbs)
    if (!Number.isFinite(lbs)) return ''
    return `${lbs} lbs`
  }, [profile])

  if (!playerId) {
    return (
      <AccountLayout title="Player profile">
        <p className="text-sm text-gray-600">No player selected.</p>
      </AccountLayout>
    )
  }

  if (loading) {
    return (
      <AccountLayout title="Player profile">
        <div className="space-y-4">
          <div className="h-20 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-40 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-40 animate-pulse rounded-xl bg-gray-100" />
        </div>
      </AccountLayout>
    )
  }

  if (error) {
    return (
      <AccountLayout title="Player profile">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
          {error}
        </div>
      </AccountLayout>
    )
  }

  if (!profile) {
    return (
      <AccountLayout title="Player profile">
        <div className="text-sm text-gray-500">Player profile not found.</div>
      </AccountLayout>
    )
  }

  const stats = profile.stats || {}
  const highlights = Array.isArray(profile.highlightUrls) ? profile.highlightUrls.filter(Boolean) : []

  return (
    <AccountLayout title={headerTitle}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-orange-600 hover:text-orange-700"
      >
        <span aria-hidden>←</span>
        Back to directory
      </button>

      <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-orange-50 via-white to-emerald-50 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex flex-wrap items-start gap-4">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-orange-500 text-3xl font-semibold text-white">
              {(profile.fullName || 'Player').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'PL'}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{profile.fullName || 'Unnamed Player'}</h1>
              <p className="text-sm text-gray-600">{[profile.city, profile.state, profile.country].filter(Boolean).join(', ') || 'Location not specified'}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                {profile.school && <span>School: <span className="font-semibold text-gray-800">{profile.school}</span></span>}
                {profile.gpa && <span>GPA: <span className="font-semibold text-gray-800">{profile.gpa}</span></span>}
                {heightText && <span>Height: <span className="font-semibold text-gray-800">{heightText}</span></span>}
                {weightText && <span>Weight: <span className="font-semibold text-gray-800">{weightText}</span></span>}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
              {profile.verificationStatus ? `Status: ${profile.verificationStatus}` : 'Not verified'}
            </span>
            <button
              type="button"
              onClick={toggleFavorite}
              disabled={favLoading}
              className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition ${
                isFavorited ? 'bg-orange-600 text-white hover:bg-orange-700' : 'border border-orange-500 text-orange-600 hover:bg-orange-50'
              }`}
            >
              {isFavorited ? 'Remove from watchlist' : 'Add to watchlist'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr,1fr]">
        <section className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Positions</h2>
            <div className="mt-3">
              <PositionChips positions={profile.positions} />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Bio</h2>
              <button type="button" onClick={refresh} className="text-xs font-semibold text-orange-600 hover:text-orange-700">Refresh</button>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm text-gray-700">{profile.bio || 'No bio provided yet.'}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Highlights</h2>
            {highlights.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">No highlight links shared.</p>
            ) : (
              <ul className="mt-3 space-y-3 text-sm">
                {highlights.map((url) => (
                  <li key={url}>
                    <a href={url} target="_blank" rel="noreferrer" className="text-orange-600 hover:text-orange-700 hover:underline">
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Season stats</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
              <StatBlock label="Games" value={stats.games} />
              <StatBlock label="Starts" value={stats.gamesStarted} />
              <StatBlock label="Goals" value={stats.goals} />
              <StatBlock label="Assists" value={stats.assists} />
              <StatBlock label="Points" value={stats.points} />
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Academics & preferences</h2>
            <dl className="mt-3 space-y-3 text-sm text-gray-700">
              <div className="flex justify-between gap-3">
                <dt className="text-gray-500">GPA</dt>
                <dd className="font-semibold text-gray-900">{profile.gpa || '—'}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-gray-500">Division</dt>
                <dd className="font-semibold text-gray-900">{profile.division || '—'}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-gray-500">Budget</dt>
                <dd className="font-semibold text-gray-900">{profile.budget ? `$${profile.budget.toLocaleString()}` : '—'}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-gray-500">Preferred location</dt>
                <dd className="font-semibold text-gray-900">{profile.preferredLocation || '—'}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Verification note</h2>
            <p className="mt-3 text-sm text-gray-700">{profile.verificationNote || 'No verification note provided yet.'}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">JUCO coach note</h2>
            <p className="mt-3 whitespace-pre-line text-sm text-gray-700">
              {profile.jucoCoachNote || 'JUCO coach has not added a note for this athlete yet.'}
            </p>
            {profile.jucoCoachNoteUpdatedAt && (
              <p className="mt-2 text-xs text-gray-500">
                Updated {new Date(profile.jucoCoachNoteUpdatedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </aside>
      </div>
    </AccountLayout>
  )
}
