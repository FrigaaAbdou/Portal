const BASE = import.meta.env.VITE_API_URL || '' // if empty, rely on Vite proxy to /api

export function getToken() {
  return localStorage.getItem('token') || ''
}

export function setToken(token) {
  if (token) localStorage.setItem('token', token)
}

export function clearToken() {
  localStorage.removeItem('token')
}

export async function apiFetch(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let json
  try { json = text ? JSON.parse(text) : null } catch { json = { raw: text } }
  if (!res.ok) {
    const msg = (json && (json.error || json.message)) || `HTTP ${res.status}`
    throw new Error(msg)
  }
  return json
}

export async function register(email, password, role) {
  return apiFetch('/auth/register', { method: 'POST', body: { email, password, role } })
}

export async function login(email, password) {
  return apiFetch('/auth/login', { method: 'POST', body: { email, password } })
}

export async function savePlayerProfile(payload) {
  return apiFetch('/players', { method: 'POST', body: payload, auth: true })
}

export async function saveCoachProfile(payload) {
  return apiFetch('/coaches', { method: 'POST', body: payload, auth: true })
}

export async function getMyPlayerProfile() {
  return apiFetch('/players/me', { auth: true })
}

export async function getMyCoachProfile() {
  return apiFetch('/coaches/me', { auth: true })
}

export async function listPlayers() {
  return apiFetch('/players', { auth: true })
}

export async function searchPlayers(params = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    if (Array.isArray(value)) {
      if (value.length > 0) searchParams.append(key, value.join(','))
    } else {
      searchParams.append(key, String(value))
    }
  })

  const query = searchParams.toString()
  return apiFetch(`/players${query ? `?${query}` : ''}`, { auth: true })
}

export async function fetchFavorites() {
  return apiFetch('/favorites', { auth: true })
}

export async function saveFavorite({ playerId, note, tags }) {
  return apiFetch('/favorites', { method: 'POST', body: { playerId, note, tags }, auth: true })
}

export async function updateFavorite(id, { note, tags }) {
  return apiFetch(`/favorites/${id}`, { method: 'PATCH', body: { note, tags }, auth: true })
}

export async function removeFavorite(playerId) {
  return apiFetch(`/favorites/${playerId}`, { method: 'DELETE', auth: true })
}
export async function getPlayerProfileById(id) {
  if (!id) throw new Error('Player id is required')
  return apiFetch(`/players/${id}`, { auth: true })
}

export async function listMyJucoPlayers(params = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    searchParams.append(key, String(value))
  })
  const query = searchParams.toString()
  return apiFetch(`/players/juco/my-players${query ? `?${query}` : ''}`, { auth: true })
}

export async function updateJucoPlayerNote(playerId, note) {
  if (!playerId) throw new Error('Player id is required')
  return apiFetch(`/players/${playerId}/juco-note`, {
    method: 'PATCH',
    body: { note },
    auth: true,
  })
}
