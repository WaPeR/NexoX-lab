import rss from '@astrojs/rss';
import { withBase } from '../lib/paths';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const entries = (await getCollection('reviews', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: 'NexoX',
    description: 'Videojuegos, historias y mundos por descubrir.',
    site: context.site,
    items: entries.map(({ id, data }) => ({
      title: data.title,
      description: data.description,
      pubDate: data.date,
      link: withBase(`/reviews/${id}/`)
    })),
    customData: '<language>es-ES</language>'
  });
}
