import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Schema shared by both blog types - title, date, and a short description
// for the listing page. The body content comes from the Markdown file itself.
const postSchema = z.object({
  title: z.string(),
  date: z.coerce.date(), // coerce accepts both Date objects and date strings
  description: z.string(),
  ogImage: z.string().optional(),
  liveDemo: z.string().url().optional(),
});

// Tech blog: tutorials, dev notes, learnings
const tech = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tech' }),
  schema: postSchema,
});

// Personal blog: literature, ideas, reflections
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: postSchema,
});

// Projects: title, one-line description, GitHub URL, and optional live demo URL
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

export const collections = { tech, blog, projects };
