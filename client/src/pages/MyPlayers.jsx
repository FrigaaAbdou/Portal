import { useEffect, useMemo, useState } from 'react'
import AccountLayout from '../components/layout/AccountLayout'
import { listMyJucoPlayers, updateJucoPlayerNote } from '../lib/api'

function initialsFrom(name = '') {
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 2) || 'PL'
}

export default function MyPlayers() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [noteDraft, setNoteDraft] = useState('')
  const [saving, setSaving] = useState(false)

  const wordsUsed = useMemo(() => noteDraft.trim().split(/\s+/).filter(Boolean).length, [noteDraft])

  useEffect(() => {
    loadPlayers()
  }, [])

  async function loadPlayers() {
    setLoading(true)
    setError('')
    try {
      const res = await listMyJucoPlayers()
      if (res?.data) {
        setPlayers(res.data)
      } else if (Array.isArray(res)) {
        setPlayers(res)
      } else {
        setPlayers([])
      }
    } catch (err) {
      setError(err?.message || 'Failed to load roster')
    } finally {
      setLoading(false)
    }
  }

  function onEdit(player) {
    setEditingId(player._id)
    setNoteDraft(player.jucoCoachNote || '')
    setError('')
  }

  function cancelEdit() {
    setEditingId(null)
    setNoteDraft('')
    setSaving(false)
  }

  async function saveNote(player) {
    if (!player?._id) return
    if (wordsUsed > 200) {
      setError('Note exceeds 200-word limit')
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await updateJucoPlayerNote(player._id, noteDraft)
      setPlayers((prev) =>
        prev.map((p) =>
          p._id === player._id
            ? {
                ...p,
                jucoCoachNote: res?.note || '',
                jucoCoachNoteUpdatedAt: res?.updatedAt || null,
              }
            : p
        )
      )
      cancelEdit()
    } catch (err) {
      setError(err?.message || 'Failed to save note')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AccountLayout title="My Players">
      <div className="space-y-4">
        <div className="rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">JUCO roster</h2>
              <p className="mt-1 text-sm text-gray-600">
                Players linked to your program automatically appear here. Add context notes for NCAA recruiters.
              </p>
            </div>
            <button
              type="button"
              onClick={loadPlayers}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((key) => (
              <div key={key} className="h-28 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        ) : players.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white px-5 py-10 text-center text-sm text-gray-600">
            No players are linked to your program yet. Make sure athletes list your school during signup.
          </div>
        ) : (
          <ul className="space-y-3">
            {players.map((player) => {
              const updatedAt = player.jucoCoachNoteUpdatedAt
                ? new Date(player.jucoCoachNoteUpdatedAt)
                : null
              const isEditing = editingId === player._id
              return (
                <li key={player._id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-orange-500 text-base font-semibold text-white">
                        {initialsFrom(player.fullName)}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{player.fullName || 'Player'}</h3>
                        <p className="text-xs text-gray-600">
                          {[player.school, player.city, player.state].filter(Boolean).join(' • ') || 'No school info yet'}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-gray-500">
                          {player.positions?.length ? (
                            <span>
                              Positions:{' '}
                              <span className="font-medium text-gray-800">{player.positions.join(', ')}</span>
                            </span>
                          ) : null}
                          {player.gpa ? (
                            <span>
                              GPA: <span className="font-medium text-gray-800">{player.gpa}</span>
                            </span>
                          ) : null}
                          {player.stats?.goals || player.stats?.assists ? (
                            <span>
                              Stats:{' '}
                              <span className="font-medium text-gray-800">
                                {['Goals', player.stats?.goals || 0].join(' ')} | {['Assists', player.stats?.assists || 0].join(' ')}
                              </span>
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {updatedAt ? `Note updated ${updatedAt.toLocaleDateString()}` : 'Note not added yet'}
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                    {isEditing ? (
                      <>
                        <textarea
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          rows={3}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:outline-none focus:ring-0"
                          placeholder="Add context for four-year coaches: strengths, work ethic, ideal fit..."
                        />
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className={wordsUsed > 200 ? 'text-rose-600' : 'text-gray-500'}>
                            {wordsUsed} / 200 words
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
                              disabled={saving}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => saveNote(player)}
                              disabled={saving || wordsUsed > 200}
                              className="rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {saving ? 'Saving…' : 'Save note'}
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <p className={`text-sm ${player.jucoCoachNote ? 'text-gray-800' : 'text-gray-500'}`}>
                          {player.jucoCoachNote || 'No note added yet.'}
                        </p>
                        <div>
                          <button
                            type="button"
                            onClick={() => onEdit(player)}
                            className="inline-flex items-center gap-2 rounded-md border border-orange-200 bg-white px-3 py-1.5 text-xs font-medium text-orange-600 hover:border-orange-300 hover:bg-orange-50"
                          >
                            {player.jucoCoachNote ? 'Edit note' : 'Add note'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </AccountLayout>
  )
}
