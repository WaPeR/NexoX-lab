export const PAGE_SIZE = 5;

export function pagePath(page) {
  return page <= 1 ? '/' : `/pagina/${page}/`;
}

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
