import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const entriesById = new Map<string, string>();

function generateReviewId({ entry }: { entry: string }): string {
  const id = entry
    .replace(/\\/g, '/')
    .replace(/\.md$/i, '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9/]+/g, '-')
    .replace(/-+/g, '-')
    .split('/')
    .map(part => part.replace(/^-+|-+$/g, ''))
    .join('/');

  if (!id || id.split('/').some(part => !part)) {
    throw new Error(`No se puede generar una URL válida para ${entry}.`);
  }
  const previous = entriesById.get(id);
  if (previous && previous !== entry) {
    throw new Error(`URL duplicada: ${previous} y ${entry} generarían /reviews/${id}/.`);
  }
  entriesById.set(id, entry);
  return id;
}

const reviews = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/reviews',
    generateId: generateReviewId
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    featured: z.boolean().default(false),
    description: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().nullish(),
    platforms: z.array(z.string()).default([]),
    genre: z.string().optional(),
    developer: z.string().nullish(),
    publisher: z.string().nullish(),
    releaseDate: z.union([z.string(), z.date()]).nullish(),
    releaseNote: z.string().nullish(),
    gameStatus: z.string().nullish(),
    languages: z.string().nullish(),
    youtube: z.string().nullish(),
    purchasePc: z.string().nullish(),
    purchaseXbox: z.string().nullish(),
    purchasePlaystation: z.string().nullish(),
    purchaseSwitch: z.string().nullish(),
    draft: z.boolean().default(false)
  })
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({})
});

export const collections = { reviews, pages };
