# manudubey.in Site Design

This document describes what the site is and the principles behind it.
It is a reference point, not a constraint. If a proposed feature or direction
differs from what is written here, that is a signal to have a conversation
and update this document - not to automatically reject the idea.

---

## What This Is

A personal website for Manu Dubey - a single place to house projects,
technical writing, and personal writing. The problem it solves: online presence
scattered across Medium, LinkedIn, GitHub, and other platforms means you don't
own your content or control how it's presented. This site puts everything
under one roof at manudubey.in.

---

## The User

Manu Dubey - the sole author and maintainer. Wants a space that feels personal,
is easy to update (just write Markdown and push), and presents different types of
content cleanly without fighting a platform's constraints.

---

## Design Principles

- **Readability over decoration** - typography, spacing, and contrast do the heavy lifting. No visual noise.
- **One Markdown file = one piece of content** - adding a post or project should never require touching more than one file
- **Ship plain, improve later** - a working page with good text beats a beautiful page that doesn't exist yet
- **Mobile-first, not mobile-also** - design for small screens first, let larger screens benefit naturally
- **No dependencies without a reason** - every added library must justify its weight

---

## Writing Style

- Personal, first-person tone
- Honest and reflective
- Not overly formal or corporate
- No unnecessary jargon

---

## Current Scope

What v1 includes:

- Homepage with intro and navigation to all sections
- Tech blog at `/tech` (listing + individual posts from Markdown)
- Personal blog at `/blog` (listing + individual posts from Markdown)
- Projects section at `/projects` (list of projects with title, description, link)
- Static deployment via GitHub Pages with custom domain

What v1 does NOT include:

- Separate portfolio/resume page
- Tag or category filtering
- RSS feed
- Comments or interaction
- Analytics
- Dark mode
- Search
- Contact form or backend logic

---

## Routes

| Path | Description |
|------|-------------|
| `/` | Homepage - intro, navigation to all sections |
| `/tech` | Tech blog listing (tutorials, dev notes, learnings) |
| `/tech/[slug]` | Individual tech post |
| `/blog` | Personal blog listing (literature, ideas, reflections) |
| `/blog/[slug]` | Individual personal post |
| `/projects` | Projects listing |

---

## How Features Currently Work

### Homepage
A landing page with a brief intro about Manu. Clear navigation to tech,
blog, and projects sections. Sets the tone for the whole site.

### Tech blog
Technical writing - tutorials, learnings, dev notes, how-tos.
Posts sorted by date (newest first). Each entry shows title, date,
and short description.

### Personal blog
Literature, ideas, reflections, creative writing.
Posts sorted by date (newest first). Same layout as tech blog
but separate section so the audience and tone don't clash.

### Projects
A simple list of projects. Each entry has a title, short description,
and a link (to GitHub, a live demo, or a writeup).
