const BASE = import.meta.env.VITE_API_URL || '' // if empty, rely on Vite proxy to /api

export function getToken() {
  return localStorage.getItem('token') || ''
}

export function setToken(token) {
  if (token) localStorage.setItem('token', token)
}

export function setRole(role) {
  if (role) {
    localStorage.setItem('role', role)
  }
}

export function clearToken() {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
}

export async function fetchMe() {
  return apiFetch('/auth/me', { auth: true })
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
    const error = new Error(msg)
    error.status = res.status
    error.data = json
    throw error
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

export async function fetchAnnouncements({ includeExpired = false } = {}) {
  const query = includeExpired ? '?includeExpired=true' : ''
  const res = await apiFetch(`/announcements${query}`)
  return res?.data || []
}

// Admin placeholder endpoints to be implemented when server routes exist
export async function listAdminVerifications(params = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    searchParams.append(key, String(value))
  })
  const query = searchParams.toString()
  return apiFetch(`/admin/verifications${query ? `?${query}` : ''}`, { auth: true })
}

export async function listAdminInvites() {
  return apiFetch('/admin/invites', { auth: true })
}

export async function listAdminAnnouncements(params = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    searchParams.append(key, String(value))
  })
  const query = searchParams.toString()
  return apiFetch(`/admin/announcements${query ? `?${query}` : ''}`, { auth: true })
}

export async function createAdminAnnouncement(payload) {
  return apiFetch('/admin/announcements', { method: 'POST', body: payload, auth: true })
}

export async function updateAdminAnnouncement(id, payload) {
  if (!id) throw new Error('Announcement id is required')
  return apiFetch(`/admin/announcements/${id}`, { method: 'PUT', body: payload, auth: true })
}

export async function deleteAdminAnnouncement(id) {
  if (!id) throw new Error('Announcement id is required')
  return apiFetch(`/admin/announcements/${id}`, { method: 'DELETE', auth: true })
}

export async function fetchAdminFinancialSummary(params = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    searchParams.append(key, String(value))
  })
  const query = searchParams.toString()
  return apiFetch(`/admin/finance/summary${query ? `?${query}` : ''}`, { auth: true })
}

export async function fetchAdminFinanceRevenueTimeseries(params = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    searchParams.append(key, String(value))
  })
  const query = searchParams.toString()
  return apiFetch(`/admin/finance/revenue-timeseries${query ? `?${query}` : ''}`, { auth: true })
}

export async function fetchAdminFinanceSubscriptionsTimeseries(params = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    searchParams.append(key, String(value))
  })
  const query = searchParams.toString()
  return apiFetch(`/admin/finance/subscriptions-timeseries${query ? `?${query}` : ''}`, { auth: true })
}

export async function fetchAdminFinanceTransactions(params = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    searchParams.append(key, String(value))
  })
  const query = searchParams.toString()
  return apiFetch(`/admin/finance/transactions${query ? `?${query}` : ''}`, { auth: true })
}

export async function listAdminUsers(params = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    searchParams.append(key, String(value))
  })
  const query = searchParams.toString()
  return apiFetch(`/admin/users${query ? `?${query}` : ''}`, { auth: true })
}

export async function getAdminUser(id) {
  if (!id) throw new Error('User id is required')
  return apiFetch(`/admin/users/${id}`, { auth: true })
}

export function logEngagement(event, payload = {}) {
  try {
    const body = {
      event,
      payload,
      at: new Date().toISOString(),
    }
    const stored = JSON.parse(localStorage.getItem('__portal_announce_log__') || '[]')
    stored.unshift(body)
    localStorage.setItem('__portal_announce_log__', JSON.stringify(stored.slice(0, 50)))
    console.info('[Announcements]', event, payload)
  } catch (err) {
    console.warn('Failed to log announcement engagement', err)
  }
}

export function startEmailVerification() {
  return apiFetch('/verification/start', { method: 'POST', auth: true })
}

export function confirmEmailVerification(code) {
  return apiFetch('/verification/email/confirm', { method: 'POST', body: { code }, auth: true })
}

export function sendPhoneVerification(phone) {
  return apiFetch('/verification/phone/send', { method: 'POST', body: { phone }, auth: true })
}

export function confirmPhoneVerification(code) {
  return apiFetch('/verification/phone/confirm', { method: 'POST', body: { code }, auth: true })
}

export function submitVerificationStats(payload) {
  return apiFetch('/verification/stats', { method: 'POST', body: payload, auth: true })
}

export function fetchVerificationStatus() {
  return apiFetch('/verification/me', { auth: true })
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

export async function createCheckoutSession(priceId) {
  const res = await apiFetch('/payments/checkout', {
    method: 'POST',
    body: { priceId },
    auth: true,
  })
  return res?.url
}

export async function createBillingPortalSession() {
  const res = await apiFetch('/payments/portal', {
    method: 'POST',
    auth: true,
  })
  return res?.url
}

export async function fetchSubscriptionInfo() {
  return apiFetch('/payments/me', { auth: true })
}
