---
title: "Getting Started with Astro"
date: 2026-03-20
description: "A quick look at why Astro is a solid choice for building static sites and how to get up and running."
---

Astro is a static site generator that does something refreshingly simple: it ships zero JavaScript by default.

## Why this matters

Most modern frameworks send a full JavaScript bundle to the browser even for pages that have no interactivity. Astro flips this. Everything is rendered at build time, and only the components that explicitly need JavaScript get it.

For a personal site or blog, this is exactly right. You don't need a reactive framework to display text and images.

## How it works

Astro uses `.astro` files - a format that looks like HTML with a frontmatter block at the top for logic. That logic runs at build time, not in the browser.

```astro
---
const greeting = "Hello";
---
<h1>{greeting}, world</h1>
```

The `---` block is just JavaScript/TypeScript that runs during the build. Simple and readable.

## Content Collections

For blog posts, Astro has a built-in system called Content Collections. You put your Markdown files in `src/content/`, define a schema with Zod, and Astro validates your frontmatter at build time.

If you forget a required field, the build fails with a clear error. Much better than discovering a missing title at runtime.

More on this in a future post.
