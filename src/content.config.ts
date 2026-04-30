import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  description: z.string(),
  status: z.enum(['draft', 'published']).default('draft'),
  ogImage: z.string().optional(),
  liveDemo: z.string().url().optional(),
});

const tech = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tech' }),
  schema: postSchema,
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: postSchema,
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    url: z.string().url(),
    liveDemo: z.string().url().optional(),
    date: z.coerce.date(),
  }),
});

const linkedin = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/linkedin' }),
  schema: z.object({
    status: z.enum(['draft', 'posted']),
    article: z.string().optional(),
    postedDate: z.coerce.date().optional(),
  }),
});

export const collections = { tech, blog, projects, linkedin };
