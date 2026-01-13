import { toast } from 'sonner'

const DEFAULT_DURATION_MS = 4000
const DEDUPE_WINDOW_MS = 2000
const recent = new Map()

function shouldDedupe(key) {
  const now = Date.now()
  const last = recent.get(key)
  if (last && now - last < DEDUPE_WINDOW_MS) return true
  recent.set(key, now)
  setTimeout(() => {
    if (recent.get(key) === now) recent.delete(key)
  }, DEDUPE_WINDOW_MS)
  return false
}

function emit(type, message, options = {}) {
  if (!message) return null
  const key = options.id || `${type}:${message}`
  if (options.dedupe !== false && shouldDedupe(key)) return null

  const payload = {
    duration: DEFAULT_DURATION_MS,
    ...options,
  }

  const fn = toast[type] || toast
  return fn(message, payload)
}

export const notify = {
  success: (message, options) => emit('success', message, options),
  info: (message, options) => emit('info', message, options),
  warning: (message, options) => emit('warning', message, options),
  error: (message, options) => emit('error', message, options),
}
