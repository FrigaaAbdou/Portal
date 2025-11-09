export function formatDistanceToNowStrict(iso) {
  if (!iso) return ''
  try {
    const date = new Date(iso)
    const diff = Math.max(0, Date.now() - date.getTime())
    const units = [
      { label: 'year', value: 1000 * 60 * 60 * 24 * 365 },
      { label: 'month', value: 1000 * 60 * 60 * 24 * 30 },
      { label: 'day', value: 1000 * 60 * 60 * 24 },
      { label: 'hour', value: 1000 * 60 * 60 },
      { label: 'minute', value: 1000 * 60 },
    ]
    for (const unit of units) {
      const count = Math.floor(diff / unit.value)
      if (count >= 1) {
        return `${count} ${unit.label}${count > 1 ? 's' : ''}`
      }
    }
    return 'just now'
  } catch {
    return ''
  }
}
