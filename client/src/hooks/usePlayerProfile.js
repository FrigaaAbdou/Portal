import { useEffect, useState } from 'react'
import { getPlayerProfileById } from '../lib/api'

export function usePlayerProfile(playerId) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(Boolean(playerId))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!playerId) {
      setProfile(null)
      setLoading(false)
      setError('')
      return
    }

    let active = true
    setLoading(true)
    setError('')
    getPlayerProfileById(playerId)
      .then((res) => {
        if (!active) return
        setProfile(res?.data || null)
      })
      .catch((err) => {
        if (!active) return
        setError(err?.message || 'Failed to load player profile')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [playerId])

  const refresh = async () => {
    if (!playerId) return
    setLoading(true)
    setError('')
    try {
      const res = await getPlayerProfileById(playerId)
      setProfile(res?.data || null)
    } catch (err) {
      setError(err?.message || 'Failed to load player profile')
    } finally {
      setLoading(false)
    }
  }

  return { profile, loading, error, refresh }
}
