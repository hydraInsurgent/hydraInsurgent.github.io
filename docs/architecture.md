# manudubey.in Architecture

This document describes how the site is structured, built, and deployed.

---

## Overview

A static site built with Astro. Three types of Markdown content (tech posts,
personal posts, projects) go through Astro's Content Collections, get styled
with Tailwind CSS, and come out as static HTML deployed to GitHub Pages.

```
Markdown content --> Content Collections (Zod validation) --> Astro build --> Static HTML/CSS --> GitHub Pages
```

---

## Repository Layout

```
hydraInsurgent.github.io/
├── src/
│   ├── content/
│   │   ├── tech/               Tech blog posts (Markdown)
│   │   ├── blog/               Personal blog posts (Markdown)
│   │   └── projects/           Project entries (Markdown)
│   ├── content.config.ts       Content Collection schemas (Zod)
│   ├── layouts/
│   │   ├── BaseLayout.astro    Shared HTML shell (head, nav, footer)
│   │   └── PostLayout.astro    Layout for individual posts (tech + blog)
│   ├── pages/
│   │   ├── index.astro         Homepage
│   │   ├── tech/
│   │   │   ├── index.astro     Tech blog listing
│   │   │   └── [slug].astro    Individual tech post
│   │   ├── blog/
│   │   │   ├── index.astro     Personal blog listing
│   │   │   └── [slug].astro    Individual personal post
│   │   └── projects/
│   │       └── index.astro     Projects listing
│   ├── components/             Reusable UI components
│   └── styles/
│       └── global.css          Tailwind base + any global styles
├── public/                     Static assets (images, favicon, CNAME)
├── docs/                       Project documentation
├── astro.config.mjs            Astro + Tailwind config
├── tailwind.config.mjs         Tailwind configuration
├── CLAUDE.md                   Instructions for AI assistants
└── README.md                   Human-facing project overview
```

---

## Routes

| Path | Source | Description |
|------|--------|-------------|
| `/` | `src/pages/index.astro` | Homepage |
| `/tech` | `src/pages/tech/index.astro` | Tech blog listing |
| `/tech/[slug]` | `src/pages/tech/[slug].astro` | Individual tech post |
| `/blog` | `src/pages/blog/index.astro` | Personal blog listing |
| `/blog/[slug]` | `src/pages/blog/[slug].astro` | Individual personal post |
| `/projects` | `src/pages/projects/index.astro` | Projects listing |

---

## Content Models

Three Content Collections, each with its own Zod schema in `content.config.ts`:

**Tech post** (`src/content/tech/*.md`):
```markdown
---
title: "Post title"
date: 2026-03-31
description: "Short summary for the listing"
---
```

**Personal post** (`src/content/blog/*.md`):
```markdown
---
title: "Post title"
date: 2026-03-31
description: "Short summary for the listing"
---
```

**Project** (`src/content/projects/*.md`):
```markdown
---
title: "Project name"
description: "What it is, one line"
url: "https://github.com/..."
---
```

All three share the same pattern: frontmatter for metadata, body for content.
Tech and blog posts are queried with `getCollection()` and sorted by date.
Projects are queried and displayed as a list (no individual project pages in v1).

---

## Build and Deploy

1. Push to `main` branch
2. GitHub Actions triggers `withastro/action`
3. Astro builds static HTML/CSS to `dist/`
4. Action deploys to GitHub Pages
5. Served at manudubey.in (CNAME file in `public/`)

---

## What Does Not Exist Yet

- Tag/category system for posts
- RSS feed
- Individual project detail pages
- Dark mode
- Search
- Analytics
