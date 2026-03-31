# Ideation Brief

## The Idea
A personal website at manudubey.in that serves as Manu's home on the internet.
Portfolio, projects, tech blog, personal blog - all under one roof. Built with
Astro, Markdown content, deployed via GitHub Pages. Minimal, readable, fully owned.

## The Problem
Having your online presence scattered across Medium, LinkedIn, GitHub, etc. means
you don't own your content or control how it's presented. A personal site puts
everything in one place, structured the way you want.

## What Already Exists
- **AstroPaper** - popular minimal blog theme with dark mode, search, SEO. Well-maintained but blog-only, not a full personal space.
- **Astro Blog (official)** - bare-bones starter following best practices. Blog-focused.
- **Various Astro starters** (Hydrogen, Astroplate, SkyScript) - lightweight templates, mostly blog-oriented with Tailwind.

Gap: most templates are blog-first. A personal space with portfolio + projects + multiple content types needs custom structure.

## Our Angle
This is a personal space, not just a blog. It houses portfolio, projects, tech writing,
and personal writing. The value is ownership and having all output in one place,
presented with clarity and simplicity.

## Feasibility
- **Complexity:** Low - Astro is built for this exact use case
- **Effort to v1:** Small (a day or two with tight scope)
- **Key risks:**
  - GitHub Pages base path / custom domain DNS config
  - Content Collections learning curve (Zod schemas)
  - Scope creep - temptation to build the full portfolio/project system before shipping
- **Stack leanings:**
  - Astro with Content Collections
  - Plain CSS (scoped) or consider a template's styling
  - withastro/action for GitHub Pages deployment

## v1 Must-Have
Display all kinds of content clearly - portfolio, projects, tech blog, personal blog.
Readability and clean presentation above everything else.

## Decision
Build. Proceed to /initiate-project.
