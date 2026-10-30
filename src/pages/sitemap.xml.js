import { getCollection } from 'astro:content';

export const prerender = true;

function escapeXml(value) {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
  })[character]);
}

export async function GET({ site }) {
  if (!site) throw new Error('Configura site en astro.config.mjs para generar el sitemap.');
  const reviews = await getCollection('reviews', ({ data }) => !data.draft);
  const urls = [...new Set([
    new URL('/', site).href,
    new URL('/sobre-nexox/', site).href,
    ...reviews.map(({ id }) => new URL(`/reviews/${id}/`, site).href)
  ])].sort();
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(url => `  <url><loc>${escapeXml(url)}</loc></url>`),
    '</urlset>'
  ].join('\n') + '\n';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
