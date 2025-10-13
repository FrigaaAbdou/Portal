import { useEffect, useMemo, useState } from 'react'
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import AccountLayout from '../components/layout/AccountLayout'
import { searchPlayers, fetchFavorites, saveFavorite, removeFavorite } from '../lib/api'

function initialsFrom(text = '') {
  const parts = String(text).trim().split(/\s+/)
  const a = parts[0]?.[0] || ''
  const b = parts[1]?.[0] || ''
  return (a + b).toUpperCase() || 'U'
}

function Avatar({ player }) {
  const initials = useMemo(() => initialsFrom(player.fullName || 'Player'), [player.fullName])
  if (player.avatarUrl) {
    return <img src={player.avatarUrl} alt={player.fullName || 'Player'} className="h-14 w-14 rounded-full object-cover shadow-sm" />
  }
  return (
    <div className="grid h-14 w-14 place-items-center rounded-full bg-orange-500 text-base font-semibold text-white shadow-sm">
      {initials}
    </div>
  )
}

function Indicator({ label, value, helper, variant = 'standard' }) {
  const variants = {
    standard: 'min-w-[120px] px-3 py-2 text-sm',
    budget: 'min-w-[160px] px-4 py-3 text-base',
  }
  const applied = variants[variant] || variants.standard
  return (
    <div className={`rounded-xl border border-gray-200 bg-gray-50 text-left ${applied}`}>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 font-semibold text-gray-900">{value}</div>
      {helper && <p className="mt-1 text-[11px] text-gray-500">{helper}</p>}
    </div>
  )
}

function StatIndicator({ label, value }) {
  return (
    <div className="min-w-[60px] rounded-xl border border-orange-100 bg-orange-50/70 px-2.5 py-1.5 text-center">
      <div className="text-[9px] font-semibold uppercase tracking-wide text-orange-600">{label}</div>
      <div className="mt-1 text-base font-bold text-gray-900">{value ?? 0}</div>
    </div>
  )
}

function formatBudget(budget) {
  if (budget === null || budget === undefined || Number.isNaN(Number(budget))) return '—'
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(budget))
  } catch {
    return `$${budget}`
  }
}

export default function PlayersDirectory() {
  const [players, setPlayers] = useState([])
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [favorites, setFavorites] = useState({})
  const [filters, setFilters] = useState({
    search: '',
    positions: [],
    division: '',
    location: '',
    verificationStatus: [],
    gpaMin: '',
    gpaMax: '',
    budgetMin: '',
    budgetMax: '',
    page: 1,
  })

  function updateFilters(updates) {
    setFilters((prev) => ({ ...prev, page: 1, ...updates }))
  }

  useEffect(() => {
    let active = true
    async function run() {
      setLoading(true)
      setError('')
      try {
        const response = await searchPlayers(filters)
        if (!active) return
        if (response?.data) {
          setPlayers(response.data)
          setMeta(response.meta || { page: 1, limit: filters.limit || 20, total: response.data.length, totalPages: 1 })
        } else if (Array.isArray(response)) {
          // fallback to legacy listPlayers response shape
          setPlayers(response)
          setMeta({ page: 1, limit: response.length, total: response.length, totalPages: 1 })
        } else {
          setPlayers([])
          setMeta({ page: 1, limit: 20, total: 0, totalPages: 1 })
        }
      } catch (err) {
        if (active) setError(err?.message || 'Failed to load players')
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => { active = false }
  }, [filters])

  useEffect(() => {
    let active = true
    fetchFavorites()
      .then((list) => {
        if (!active) return
        if (Array.isArray(list)) {
          const map = {}
          list.forEach((fav) => {
            if (fav?.player?._id) map[fav.player._id] = fav
          })
          setFavorites(map)
        }
      })
      .catch((err) => {
        console.error(err)
      })
    return () => { active = false }
  }, [])

  const isFavorited = (playerId) => Boolean(favorites[playerId])

  async function toggleFavorite(playerId) {
    try {
      if (isFavorited(playerId)) {
        await removeFavorite(playerId)
        setFavorites((prev) => {
          const next = { ...prev }
          delete next[playerId]
          return next
        })
      } else {
        const fav = await saveFavorite({ playerId })
        if (fav?.player?._id) {
          setFavorites((prev) => ({ ...prev, [fav.player._id]: fav }))
        }
      }
    } catch (err) {
      console.error(err)
      alert(err?.message || 'Failed to update favorites')
    }
  }

  return (
    <AccountLayout title="Player Directory">
      <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-emerald-50 px-6 py-7 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 md:text-2xl">Discover verified talent</h2>
        <p className="mt-2 text-sm text-gray-600 md:max-w-2xl">
          Browse the latest player profiles and refine by position, academics, budget, or geography to build your recruiting playlist.
        </p>
      </div>

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[2fr,1fr,1fr] md:items-end">
          <div className="flex flex-col gap-2">
            <label htmlFor="search" className="text-xs font-semibold uppercase tracking-wide text-gray-500">Keyword</label>
            <input
              id="search"
              type="search"
              placeholder="Search by name, school, city…"
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Division</label>
            <select
              value={filters.division}
              onChange={(e) => updateFilters({ division: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0"
            >
              <option value="">All divisions</option>
              <option value="NCAA D1">NCAA D1</option>
              <option value="NCAA D2">NCAA D2</option>
              <option value="NCAA D3">NCAA D3</option>
              <option value="NAIA">NAIA</option>
              <option value="NJCAA">NJCAA</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Location</label>
            <select
              value={filters.location}
              onChange={(e) => updateFilters({ location: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0"
            >
              <option value="">Any location</option>
              {['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming','Other / International'].map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[2fr,1fr,1fr] md:items-end">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Positions</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'CB', 'S', 'K/P'].map((pos) => {
                const active = filters.positions.includes(pos)
                return (
                  <button
                    type="button"
                    key={pos}
                    onClick={() => {
                      if (active) {
                        updateFilters({ positions: filters.positions.filter((p) => p !== pos) })
                      } else {
                        updateFilters({ positions: [...filters.positions, pos] })
                      }
                    }}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      active ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-300 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-500'
                    }`}
                  >
                    {pos}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">GPA range</label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="4"
                step="0.1"
                placeholder="Min"
                value={filters.gpaMin}
                onChange={(e) => updateFilters({ gpaMin: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0"
              />
              <span className="text-xs text-gray-400">to</span>
              <input
                type="number"
                min="0"
                max="4"
                step="0.1"
                placeholder="Max"
                value={filters.gpaMax}
                onChange={(e) => updateFilters({ gpaMax: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Budget range (USD)</label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="500"
                placeholder="Min"
                value={filters.budgetMin}
                onChange={(e) => updateFilters({ budgetMin: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0"
              />
              <span className="text-xs text-gray-400">to</span>
              <input
                type="number"
                min="0"
                step="500"
                placeholder="Max"
                value={filters.budgetMax}
                onChange={(e) => updateFilters({ budgetMax: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-gray-600">
          {['verified', 'requested', 'none'].map((status) => {
            const active = filters.verificationStatus.includes(status)
            const labels = { verified: 'Verified', requested: 'Pending', none: 'Not verified' }
            return (
              <button
                type="button"
                key={status}
                onClick={() => {
                  if (active) {
                    updateFilters({ verificationStatus: filters.verificationStatus.filter((s) => s !== status) })
                  } else {
                    updateFilters({ verificationStatus: [...filters.verificationStatus, status] })
                  }
                }}
                className={`rounded-full border px-3 py-1 font-semibold transition ${
                  active ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-300 bg-white text-gray-600 hover:border-emerald-300 hover:text-emerald-500'
                }`}
              >
                {labels[status]}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() =>
              setFilters({
                search: '',
                positions: [],
                division: '',
                location: '',
                verificationStatus: [],
                gpaMin: '',
                gpaMax: '',
                budgetMin: '',
                budgetMax: '',
                page: 1,
              })
            }
            className="ml-auto rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
          >
            Reset filters
          </button>
        </div>
      </section>


      {loading && (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
          Loading players…
        </div>
      )}

      {error && !loading && (
        <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">
          {error}
        </div>
      )}

      {!loading && !error && players.length === 0 && (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
          No player profiles found yet.
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="grid grid-cols-[2fr,1.4fr,1.4fr,2.6fr] items-center gap-4 border-b border-gray-200 bg-gray-50 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <span>Player</span>
          <span>Academics</span>
          <span>Budget</span>
          <span>Season stats</span>
        </div>
        <div className="divide-y divide-gray-100">
          {players.map((player) => {
            const stats = player.stats || {}
            return (
              <div key={player._id || player.user} className="grid grid-cols-[2fr,1.4fr,1.4fr,2.6fr] items-center gap-4 px-6 py-5 transition hover:bg-orange-50/60">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(player._id)}
                    className={`rounded-full border px-2 py-2 text-orange-500 transition hover:bg-orange-50 ${
                      isFavorited(player._id) ? 'border-orange-400 bg-orange-50' : 'border-gray-300 text-gray-400'
                    }`}
                    aria-label={isFavorited(player._id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {isFavorited(player._id) ? <HeartSolid className="h-5 w-5" /> : <HeartOutline className="h-5 w-5" />}
                  </button>
                  <Avatar player={player} />
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-gray-900">{player.fullName || 'Unnamed Player'}</h3>
                    <p className="truncate text-xs text-gray-500">{player.school || 'School not provided'}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-medium text-gray-500">
                      {Array.isArray(player.positions) && player.positions.length > 0
                        ? player.positions.map((pos) => (
                          <span key={pos} className="rounded-full bg-orange-100 px-2 py-0.5 text-orange-700">{pos}</span>
                        ))
                        : <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-500">No position</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <Indicator label="GPA" value={player.gpa || '—'} />
                  <Indicator label="Division" value={player.division || '—'} />
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <Indicator label="Budget" value={formatBudget(player.budget)} helper={player.preferredLocation || 'Anywhere'} variant="budget" />
                </div>
                <div className="flex items-center gap-2">
                  <StatIndicator label="Games" value={stats.games} />
                  <StatIndicator label="Starts" value={stats.gamesStarted} />
                  <StatIndicator label="Goals" value={stats.goals} />
                  <StatIndicator label="Assists" value={stats.assists} />
                  <StatIndicator label="Points" value={stats.points} />
                </div>
              </div>
            )
          })}
       </div>
     </div>

      {/* Pagination summary */}
      {!loading && !error && players.length > 0 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-gray-500 sm:flex-row">
          <span>
            Showing {(meta.page - 1) * meta.limit + 1}
            –
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} players
          </span>
          <div className="flex gap-2">
            <button
              type="button"
            onClick={() => setFilters((prev) => ({ ...prev, page: Math.max((prev.page || 1) - 1, 1) }))}
              disabled={meta.page <= 1 || loading}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
            onClick={() => setFilters((prev) => ({ ...prev, page: Math.min((prev.page || 1) + 1, meta.totalPages || 1) }))}
              disabled={meta.page >= meta.totalPages || loading}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </AccountLayout>
  )
}
