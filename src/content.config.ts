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

const drafts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/drafts' }),
  schema: z.object({
    kind: z.enum(['tech', 'blog', 'linkedin']),
    title: z.string().optional(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    article: z.string().optional(),
    status: z.enum(['draft', 'posted']).optional(),
    postedDate: z.coerce.date().optional(),
    ogImage: z.string().optional(),
    liveDemo: z.string().url().optional(),
  }),
});

export const collections = { tech, blog, projects, drafts };
