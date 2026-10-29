import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const reviews = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reviews' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    image: z.string().optional(),
    platforms: z.array(z.string()).default([]),
    genre: z.string().optional(),
    youtube: z.string().nullish(),
    draft: z.boolean().default(false)
  })
});
export const collections = { reviews };
