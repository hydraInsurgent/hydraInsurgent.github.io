# Feature Implementation Plan

**Overall Progress:** `80%`

## TLDR
Scaffold and build the full v1 of manudubey.in - an Astro + Tailwind static site
with a homepage, tech blog, personal blog, projects page, and GitHub Actions deploy
to GitHub Pages with a custom domain.

## Goal State

**Current State:** Docs-only repo. No Astro project, no src/, no package.json.

**Goal State:** Fully working static site running locally and deployed to manudubey.in
via GitHub Pages. All pages render with dummy content. Visual direction: Option B
(white background, near-black text, system sans-serif, single-column).

## Critical Decisions

- **Astro Content Collections** - all content (tech posts, blog posts, projects) managed
  via Content Collections with Zod schemas. Validates frontmatter at build time.
- **Tailwind CSS** - utility-first styling. Typography plugin for post content.
- **System font stack** - no external font loading in v1. Fast, no extra dependency.
- **Dummy content** - 2 sample posts per blog, 2 sample projects. Real content added later.
- **No individual project pages** - projects link out externally. `/projects` is listing only.

---

## Tasks

- [x] 🟩 **Step 1: Scaffold Astro + Tailwind project** `[sequential]`
  - [x] 🟩 Created `package.json` with Astro 5, @astrojs/tailwind, @tailwindcss/typography
  - [x] 🟩 Created `astro.config.mjs` and `tailwind.config.mjs`
  - [x] 🟩 Created `tsconfig.json`, `src/env.d.ts`, `src/styles/global.css`
  - [x] 🟩 Build confirmed successful

- [x] 🟩 **Step 2: Configure Content Collections** `[sequential]`
  - [x] 🟩 Created `src/content.config.ts` with Zod schemas for `tech`, `blog`, `projects`
  - [x] 🟩 Added 2 dummy tech posts, 2 dummy personal posts, 2 dummy projects
  - [x] 🟩 Build confirmed clean with no deprecation warnings

- [x] 🟩 **Step 3: Build layouts** `[sequential]`
  - [x] 🟩 Created `src/layouts/BaseLayout.astro` - HTML shell, nav, footer
  - [x] 🟩 Created `src/layouts/PostLayout.astro` - prose typography for Markdown
  - [x] 🟩 `src/styles/global.css` with Tailwind base + system font + near-black ink color

- [x] 🟩 **Step 4: Build pages** `[sequential]`
  - [x] 🟩 `src/pages/index.astro` - homepage with bio and section links
  - [x] 🟩 `src/pages/tech/index.astro` - listing sorted by date
  - [x] 🟩 `src/pages/tech/[slug].astro` - individual post via PostLayout
  - [x] 🟩 `src/pages/blog/index.astro` - listing sorted by date
  - [x] 🟩 `src/pages/blog/[slug].astro` - individual post via PostLayout
  - [x] 🟩 `src/pages/projects/index.astro` - listing with external links
  - [x] 🟩 Build confirmed: 8 pages generated cleanly

- [ ] 🟨 **Step 5: GitHub Actions deploy** `[sequential]`
  - [x] 🟩 Created `.github/workflows/deploy.yml` using `withastro/action@v3`
  - [x] 🟩 `site: https://manudubey.in` set in `astro.config.mjs`
  - [x] 🟩 `public/CNAME` created with `manudubey.in`
  - [ ] 🟥 Enable GitHub Pages in repo settings (source: GitHub Actions) - manual step
  - [ ] 🟥 Push to `main` and confirm deploy succeeds - manual step

## Outcomes
<!-- Fill in after execution -->
