import { getPage } from './review-pagination.js';

export function normalizeSearch(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

export function filterSearchEntries(entries, query = '', platform = '', type = '') {
  const terms = normalizeSearch(query).split(' ').filter(Boolean);
  const section = ['reviews', 'noticias'].includes(type) ? type : '';
  return entries.filter(entry => {
    if (entry.draft === true) return false;
    if (section && entry.type !== section) return false;
    if (platform && !(entry.platforms ?? []).includes(platform)) return false;
    const text = normalizeSearch(`${entry.title} ${entry.description}`);
    return terms.every(term => text.includes(term));
  });
}

export function getSearchState(entries, page = 1, query = '', platform = '', type = '') {
  return getPage(filterSearchEntries(entries, query, platform, type), page);
}
