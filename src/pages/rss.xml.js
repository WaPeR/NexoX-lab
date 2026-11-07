import rss from '@astrojs/rss';
import { withBase } from '../lib/paths';
import { getCollection } from 'astro:content';

function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
  })[character]);
}

export async function GET(context) {
  if (!context.site) throw new Error('Falta configurar site en Astro.');
  const [reviews, news] = await Promise.all([
    getCollection('reviews', ({ data }) => !data.draft),
    getCollection('news', ({ data }) => !data.draft)
  ]);
  const entries = [
    ...reviews.map(entry => ({ ...entry, section: 'reviews', category: 'Reviews' })),
    ...news.map(entry => ({ ...entry, section: 'noticias', category: 'Noticias' }))
  ].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || `${a.section}/${a.id}`.localeCompare(`${b.section}/${b.id}`));
  return rss({
    title: 'NexoX',
    description: 'Reviews, noticias y mundos por descubrir.',
    site: context.site,
    xmlns: { media: 'http://search.yahoo.com/mrss/' },
    items: entries.map(({ id, data, section, category }) => {
      const image = data.image ? new URL(withBase(data.image), context.site).href : undefined;
      return {
        title: data.title,
        categories: [category],
        description: image
          ? `<p><img src="${escapeXml(image)}" alt="${escapeXml(data.imageAlt?.trim() || data.title)}" /></p><p>${escapeXml(data.description)}</p>`
          : data.description,
        pubDate: data.date,
        link: withBase(`/${section}/${id}/`),
        customData: image
          ? `<media:content url="${escapeXml(image)}" medium="image" /><media:thumbnail url="${escapeXml(image)}" />`
          : ''
      };
    }),
    customData: '<language>es-ES</language>'
  });
}
