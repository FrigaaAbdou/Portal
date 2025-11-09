import announcementData from './announcements.json'

export const TYPE_LABELS = {
  product_update: 'Product updates',
  sponsor_spotlight: 'Sponsor spotlights',
  program_news: 'Program news',
};

export function getAnnouncements({ includeExpired = false } = {}) {
  const now = Date.now();
  return announcementData
    .filter((item) => includeExpired || !item.expiresAt || new Date(item.expiresAt).getTime() >= now)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getFeaturedAnnouncement() {
  const [first] = getAnnouncements();
  return first || null;
}

export default announcementData;
