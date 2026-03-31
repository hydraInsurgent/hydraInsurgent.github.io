# manudubey.in Engineering Guidelines

This document describes how the codebase is structured and why.
Read `docs/architecture.md` first to understand the site layout.

---

## Core Principle

Content lives in Markdown. Presentation lives in Astro components.
Never mix content into templates or layout logic into content files.

---

## Astro Components

- One component per file, named in `PascalCase` (e.g. `PostCard.astro`)
- Keep components small - if it's doing two things, split it
- Use Astro's built-in scoped styles when a component needs its own styling
- Minimize client-side JS - default to zero. Only add `client:*` directives when interaction truly requires it

---

## Tailwind CSS

- Use utility classes directly in templates for layout and spacing
- Use `@apply` sparingly - only for repeated patterns that Tailwind can't handle with utilities alone
- Typography plugin (`@tailwindcss/typography`) for rendering Markdown content with the `prose` class
- Keep `global.css` minimal - Tailwind directives and maybe a handful of base overrides

---

## Content Collections

- Every collection has a Zod schema in `content.config.ts` - no unvalidated frontmatter
- Query with `getCollection()`, sort/filter in the page file
- Keep frontmatter lean - only fields that the listing or layout actually uses

---

## When Adding a Feature

- Does it need a new Content Collection? Define the schema first.
- Does it need a new route? Add the page under `src/pages/`.
- Does it need shared UI? Create a component in `src/components/`.
- Is the architecture doc still accurate? Update it if not.
- Is the backlog updated?
