import { getCollection } from 'astro:content';
import { PAGE_SIZE, pagePath } from '../lib/review-pagination.js';
import { NEWS_PAGE_SIZE, newsPagePath } from '../lib/news-pagination.js';

export const prerender = true;

function escapeXml(value) {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
  })[character]);
}

export async function GET({ site }) {
  if (!site) throw new Error('Configura site en astro.config.mjs para generar el sitemap.');
  const [reviews, news] = await Promise.all([
    getCollection('reviews', ({ data }) => !data.draft),
    getCollection('news', ({ data }) => !data.draft)
  ]);
  const listedCount = reviews.length - (reviews.some(({ data }) => data.featured === true) ? 1 : 0);
  const totalPages = Math.ceil(listedCount / PAGE_SIZE);
  const newsPages = Math.max(1, Math.ceil(news.length / NEWS_PAGE_SIZE));
  const urls = [...new Set([
    new URL('/', site).href,
    new URL('/noticias/', site).href,
    new URL('/sobre-nexox/', site).href,
    new URL('/privacidad/', site).href,
    ...Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => new URL(pagePath(index + 2), site).href),
    ...Array.from({ length: newsPages - 1 }, (_, index) => new URL(newsPagePath(index + 2), site).href),
    ...reviews.map(({ id }) => new URL(`/reviews/${id}/`, site).href),
    ...news.map(({ id }) => new URL(`/noticias/${id}/`, site).href)
  ])].sort();
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(url => `  <url><loc>${escapeXml(url)}</loc></url>`),
    '</urlset>'
  ].join('\n') + '\n';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
