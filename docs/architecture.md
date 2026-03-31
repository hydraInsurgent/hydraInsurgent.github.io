# Site Architecture

This document describes how the site is structured, built, and deployed.

---

## Overview

A static site built with Astro. Markdown files go in, HTML pages come out.
No backend, no database, no runtime server.

```
Markdown content --> Astro build --> Static HTML/CSS/JS --> GitHub Pages
```

---

## Repository Layout

```
hydraInsurgent.github.io/
├── src/
│   ├── content/
│   │   └── blog/            Markdown blog posts
│   ├── layouts/             Page layouts (base, blog post)
│   ├── pages/
│   │   ├── index.astro      Homepage
│   │   └── blog/
│   │       ├── index.astro  Blog listing page
│   │       └── [slug].astro Individual blog post pages
│   └── components/          Reusable UI components
├── public/                  Static assets (images, favicon, etc.)
├── docs/                    Project documentation
├── astro.config.mjs         Astro configuration
├── CLAUDE.md                Instructions for AI assistants
└── README.md                Human-facing project overview
```

---

## Routes

| Path | Source | Description |
|------|--------|-------------|
| `/` | `src/pages/index.astro` | Homepage |
| `/blog` | `src/pages/blog/index.astro` | Blog listing |
| `/blog/[slug]` | `src/pages/blog/[slug].astro` | Individual blog post |

---

## Content Model

Blog posts are Markdown files in `src/content/blog/` with frontmatter:

```markdown
---
title: "Post title"
date: 2026-03-31
description: "Short summary for the blog listing"
---

Post content here...
```

---

## Build and Deploy

1. Push to `main` branch
2. GitHub Actions runs `astro build`
3. Output goes to GitHub Pages
4. Served at manudubey.in (custom domain)

---

## What Does Not Exist Yet

- Tag/category system for posts
- RSS feed
- Custom design system
- Analytics
