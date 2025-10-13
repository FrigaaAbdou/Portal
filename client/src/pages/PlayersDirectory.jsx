import { useEffect, useMemo, useState } from 'react'
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import { Link } from 'react-router-dom'
import AccountLayout from '../components/layout/AccountLayout'
import { searchPlayers, fetchFavorites, saveFavorite, removeFavorite } from '../lib/api'
import { soccerPositions } from '../lib/positions'

const INITIAL_FILTERS = {
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
  limit: 15,
}

function initialsFrom(text = '') {
  const parts = String(text).trim().split(/\s+/)
  const a = parts[0]?.[0] || ''
  const b = parts[1]?.[0] || ''
  return (a + b).toUpperCase() || 'U'
}

function Avatar({ player }) {
  const initials = useMemo(() => initialsFrom(player.fullName || 'Player'), [player.fullName])
  if (player.avatarUrl) {
    return <img src={player.avatarUrl} alt={player.fullName || 'Player'} className="h-12 w-12 rounded-full object-cover shadow-sm" />
  }
  return (
    <div className="grid h-12 w-12 place-items-center rounded-full bg-orange-500 text-sm font-semibold text-white shadow-sm">
      {initials}
    </div>
  )
}

function statEntries(stats = {}) {
  return [
    ['G', 'Games', stats.games],
    ['S', 'Starts', stats.gamesStarted],
    ['GLS', 'Goals', stats.goals],
    ['AST', 'Assists', stats.assists],
    ['PTS', 'Points', stats.points],
  ]
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
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [filters, setFilters] = useState({ ...INITIAL_FILTERS })

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
          setMeta(response.meta || { page: 1, limit: filters.limit || 15, total: response.data.length, totalPages: 1 })
        } else if (Array.isArray(response)) {
          // fallback to legacy listPlayers response shape
          setPlayers(response)
          setMeta({ page: 1, limit: filters.limit || response.length, total: response.length, totalPages: 1 })
        } else {
          setPlayers([])
          setMeta({ page: 1, limit: filters.limit || 15, total: 0, totalPages: 1 })
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
  const favoriteCount = useMemo(() => Object.keys(favorites).length, [favorites])
  const displayedPlayers = useMemo(() => {
    if (!favoritesOnly) return players
    return players.filter((player) => {
      const key = player?._id || player?.user
      if (!key) return false
      return Boolean(favorites[key])
    })
  }, [favoritesOnly, favorites, players])
  const hasPlayers = displayedPlayers.length > 0
  const emptyMessage = favoritesOnly
    ? (favoriteCount === 0
      ? "You haven't added any favorites yet."
      : 'No favorites match your current filters.')
    : 'No player profiles found yet.'

  async function toggleFavorite(playerId) {
    if (!playerId) return
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

  const Spinner = () => (
    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
      <svg className="h-5 w-5 animate-spin text-orange-500" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      Loading players…
    </div>
  )

  return (
    <AccountLayout title="Player Directory">
      <div className="rounded-lg border border-gray-200 bg-white px-6 py-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Player directory</h2>
        <p className="mt-1 text-sm text-gray-600">Filter for fit, capture favorites, and export insights faster.</p>
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
              {Object.values(soccerPositions).flat().map(({ code }) => {
                const active = filters.positions.includes(code)
                return (
                  <button
                    type="button"
                    key={code}
                    onClick={() => {
                      if (active) {
                        updateFilters({ positions: filters.positions.filter((p) => p !== code) })
                      } else {
                        updateFilters({ positions: [...filters.positions, code] })
                      }
                    }}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      active ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-300 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-500'
                    }`}
                  >
                    {code}
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
            onClick={() => setFavoritesOnly((prev) => !prev)}
            className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
              favoritesOnly
                ? 'border-orange-500 bg-orange-500 text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:border-orange-300 hover:text-orange-500'
            }`}
          >
            Favorites only{favoriteCount ? ` (${favoriteCount})` : ''}
          </button>
          <button
            type="button"
            onClick={() =>
              setFilters({ ...INITIAL_FILTERS })
            }
            className="ml-auto rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
          >
            Reset filters
          </button>
        </div>
      </section>


      {loading && (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
          <Spinner />
        </div>
      )}

      {error && !loading && (
        <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">
          {error}
        </div>
      )}

      {!loading && !error && !hasPlayers && (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
          {emptyMessage}
        </div>
      )}

      {hasPlayers && (
        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full table-fixed">
          <colgroup>
            <col className="w-[28%]" />
            <col className="w-[18%]" />
            <col className="w-[10%]" />
            <col className="w-[6%]" />
            <col className="w-[12%]" />
            <col className="w-[28%]" />
          </colgroup>
          <thead>
            <tr className="bg-gray-50 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              <th scope="col" className="px-4 py-3 text-left">Player</th>
              <th scope="col" className="px-4 py-3 text-left">School / Team</th>
              <th scope="col" className="px-4 py-3 text-left">Division</th>
              <th scope="col" className="px-4 py-3 text-left">GPA</th>
              <th scope="col" className="px-4 py-3 text-left">Budget</th>
              <th scope="col" className="px-4 py-3 text-left">Stats</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {displayedPlayers.map((player) => {
              const stats = player.stats || {}
              const playerId = player._id || player.user
              const favorited = isFavorited(playerId)
              const positions = Array.isArray(player.positions) && player.positions.length
                ? player.positions.join(', ')
                : '—'
              const location =
                [player.city, player.state].filter(Boolean).join(', ') ||
                player.country ||
                '—'
              return (
                <tr
                  key={playerId || player._id || player.user}
                  className="border-b border-gray-100 transition hover:bg-orange-50/60"
                >
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleFavorite(playerId)}
                        className={`rounded-md border px-2 py-1.5 text-orange-500 transition ${
                          favorited ? 'border-orange-400 bg-orange-50' : 'border-gray-300 text-gray-400 hover:border-orange-300'
                        }`}
                        aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        {favorited ? <HeartSolid className="h-4 w-4" /> : <HeartOutline className="h-4 w-4" />}
                      </button>
                      <Avatar player={player} />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-gray-900">
                          <Link to={`/players/${playerId}`} className="hover:text-orange-600">{player.fullName || 'Unnamed Player'}</Link>
                        </div>
                        <div className="truncate text-xs text-gray-500">{positions}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div className="truncate text-sm font-medium text-gray-800">
                      {player.school || '—'}
                    </div>
                    <div className="truncate text-xs text-gray-500">{location}</div>
                  </td>
                  <td className="px-4 py-3 align-middle text-sm font-medium text-gray-800">
                    {player.division || '—'}
                  </td>
                  <td className="px-4 py-3 align-middle text-sm font-medium text-gray-800">
                    {player.gpa ? Number(player.gpa).toFixed(2) : '—'}
                  </td>
                  <td className="px-4 py-3 align-middle text-sm font-medium text-gray-800">
                    <div>{formatBudget(player.budget)}</div>
                    {player.preferredLocation && (
                      <div className="text-xs text-gray-500">Pref: {player.preferredLocation}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 align-middle text-sm font-medium text-gray-800">
                    <div className="flex flex-wrap gap-0.5">
                      {statEntries(stats).map(([code, label, value]) => (
                        <div
                          key={code}
                          className="flex h-[38px] w-[46px] flex-col items-center justify-center rounded-lg border border-orange-100 bg-orange-50 text-center shadow-sm"
                        >
                          <span className="text-[8px] font-semibold uppercase tracking-wide text-orange-500">{code}</span>
                          <span className="mt-0.5 text-xs font-bold text-gray-900">{value ?? 0}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
          </table>
        </div>
      )}

      {/* Pagination summary */}
      {!favoritesOnly && !loading && !error && hasPlayers && (
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
