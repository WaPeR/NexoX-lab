export const NEWS_PAGE_SIZE = 6;
export function newsPagePath(page) {
  return page <= 1 ? '/noticias/' : `/noticias/pagina/${page}/`;
}
export function getNewsPage(entries, requestedPage = 1) {
  const total = entries.length;
  const totalPages = Math.max(1, Math.ceil(total / NEWS_PAGE_SIZE));
  const requested = Math.floor(Number(requestedPage));
  const page = Math.min(totalPages, Math.max(1, Number.isFinite(requested) ? requested : 1));
  return { items: entries.slice((page - 1) * NEWS_PAGE_SIZE, page * NEWS_PAGE_SIZE), page, total, totalPages };
}
