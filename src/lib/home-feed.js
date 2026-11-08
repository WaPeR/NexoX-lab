export const HOME_PAGE_SIZE = 6;
export function getHomeFeed(entries) {
  const sorted = entries.filter(({ entry }) => !entry.data.draft).slice().sort((a, b) => new Date(b.entry.data.date).valueOf() - new Date(a.entry.data.date).valueOf() || `${a.type}/${a.entry.id}`.localeCompare(`${b.type}/${b.entry.id}`));
  const featured = sorted.find(({ entry }) => entry.data.featured === true);
  const items = sorted.filter(item => item !== featured);
  return { featured, items, total: sorted.length, totalPages: Math.max(1, Math.ceil(items.length / HOME_PAGE_SIZE)) };
}
