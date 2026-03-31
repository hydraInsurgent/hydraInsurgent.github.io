# Product Design

This document describes what the site is and the principles behind it.

---

## What This Is

A personal website and blog for Manu Dubey. A place to share writing,
link to projects, and have a home on the internet. Hosted at manudubey.in.

---

## Design Principles

- **Readability first** - typography, spacing, and contrast matter more than visual flair
- **Minimal by default** - only add complexity when there's a clear reason
- **Mobile-friendly** - works well on phones without extra effort
- **Fast** - static HTML, minimal JS, no heavy frameworks
- **Easy to maintain** - adding a blog post should be as simple as writing a Markdown file

---

## Writing Style

- Personal, first-person tone
- Honest and reflective
- Not overly formal or corporate
- No unnecessary jargon

---

## Current Scope

This is v1. The site currently includes:

- Homepage with a brief intro
- Blog section with a list of posts
- Individual blog post pages rendered from Markdown
- Static deployment via GitHub Pages

Things explicitly out of scope for v1:

- Tags or categories
- RSS feed
- Comments or interaction
- Analytics
- Authentication or backend logic
- Complex design system

---

## How It Works

### Homepage
A simple landing page with a brief intro about Manu. Links to the blog.

### Blog listing
Shows all blog posts sorted by date (newest first). Each entry shows
the title, date, and a short description.

### Blog post
Renders a Markdown file as a full page with readable typography.
