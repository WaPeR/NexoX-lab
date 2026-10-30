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
  const entries = (await getCollection('reviews', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: 'NexoX',
    description: 'Videojuegos, historias y mundos por descubrir.',
    site: context.site,
    xmlns: { media: 'http://search.yahoo.com/mrss/' },
    items: entries.map(({ id, data }) => {
      const image = data.image ? new URL(withBase(data.image), context.site).href : undefined;
      return {
        title: data.title,
        description: image
          ? `<p><img src="${escapeXml(image)}" alt="${escapeXml(data.title)}" /></p><p>${escapeXml(data.description)}</p>`
          : data.description,
        pubDate: data.date,
        link: withBase(`/reviews/${id}/`),
        customData: image
          ? `<media:content url="${escapeXml(image)}" medium="image" /><media:thumbnail url="${escapeXml(image)}" />`
          : ''
      };
    }),
    customData: '<language>es-ES</language>'
  });
}
