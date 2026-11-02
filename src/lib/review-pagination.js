export const PAGE_SIZE = 6;
export function pagePath(page) { return page <= 1 ? '/' : `/pagina/${page}/`; }
export function filterEntries(entries, query = '', platform = '') {
  const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
  const terms = normalize(query).split(' ').filter(Boolean);
  return entries.filter(entry => terms.every(term => normalize(`${entry.title} ${entry.description}`).includes(term)) && (!platform || entry.platforms.includes(platform)));
}
export function getPage(entries, requestedPage = 1) {
  const total = entries.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const number = Math.floor(Number(requestedPage));
  const page = Math.min(totalPages, Math.max(1, Number.isFinite(number) ? number : 1));
  return { items: entries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), page, total, totalPages };
}
export function getArchiveState(entries, requestedPage = 1, query = '', platform = '') {
  const featured = entries.filter(entry => entry.featured === true).sort((a, b) => Date.parse(b.date) - Date.parse(a.date) || String(a.href).localeCompare(String(b.href)))[0];
  const filtered = Boolean(query.trim() || platform);
  const candidates = filtered ? filterEntries(entries, query, platform) : entries.filter(entry => entry.href !== featured?.href);
  const state = getPage(candidates, requestedPage);
  return { ...state, featured, filtered, showFeatured: Boolean(featured && !filtered && state.page === 1) };
}
