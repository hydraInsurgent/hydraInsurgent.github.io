---
title: "The workflow that helped me build my own to-do app (Tasklog)"
status: published
date: 2026-07-03
description: "How I set up Claude as a teammate: the orientation docs, the slash-command loop, and the repo memory that carried Tasklog through twenty-plus versions."
---

*Building Tasklog · Part 2*

A few months ago I wrote about why I built [Tasklog](https://manudubey.in/tech/when-a-price-change-made-me-build-my-own-todo-app/), a self-hosted task app I made after my Todoist subscription jumped 3x.

That post was the *why*. This one is the *how*.

Not the code. The workflow.

---

## What Tasklog is, in one paragraph

If you missed the last post, Tasklog is a small task manager that runs on my own machine. Tasks, projects, labels, deadlines. No account, no subscription, no cloud. A .NET API, a Next.js frontend, and a SQLite file. Two services, one database, my data. It has grown a lot since v1: bulk operations, recurrence, habit tracking, inbuilt time tracking, and an MCP server I can text from Claude on my phone. More on that last one later.

The interesting thing was never the app. The interesting thing was that I shipped twenty-plus minor versions of it without losing the thread.

That part needed a workflow.

---

## The trap I almost fell into

The default way to use AI for coding is what people call vibe coding.

Open a chat. Describe what you want. Copy the code into your editor. Run it. If it breaks, paste the error back. Repeat.

It feels fast. The first session does feel fast.

The trouble starts around session three. The AI has forgotten what we decided last week. You have forgotten what you decided last week. Two functions do the same thing in slightly different ways. The folder structure has drifted. You are answering the same questions you already answered, in a slightly different shape, and the code is starting to look like a quilt sewn by four different people.

I did not want a demo. I wanted something I could come back to in six months.

So I stopped treating Claude like a chatbox and started treating it like a teammate.

---

## A teammate needs three things

When you onboard a new teammate, you give them three things without thinking about it:

1. **Orientation:** what is this project, what are we building, what are the rules
2. **The workflow:** how do we work here, and what does "done" mean
3. **Memory:** what did we decide last month and why

A chat window has none of those. They have to live somewhere else, in the repo, so the next session inherits them.

That is all of it. Three things, in three places.

---

## Orientation: the docs the AI reads first

The root of the repo has a file called `CLAUDE.md`. It is the first thing Claude reads in any session. It is opinionated, and the rule that mattered most is near the top:

```markdown
### Propose Before Implementing

For non-trivial changes:

1. Explain the proposed approach briefly.
2. Outline the implementation plan.
3. Then generate code if appropriate.
```

That single rule changed more than any prompt trick I ever tried. It is one of four collaboration rules, and they sit alongside the rest of what `CLAUDE.md` carries: what Tasklog is and why it exists, the development philosophy, the docs to read before touching anything, and my coding preferences. Taken together it is the project's character and conduct, the how-to-behave-here layer the AI reads before it does anything else.

One section in it does outsized work, though: a map. Near the bottom is a table that tells Claude, and me, where every kind of knowledge lives and which command keeps it current:

```markdown
| Folder / file          | Purpose                       | Updated by    |
|------------------------|-------------------------------|---------------|
| docs/architecture.md   | how the system is structured  | /document     |
| docs/plans/            | what we're going to do        | /create-plan  |
| guides/                | how specific things were done | /guides       |
| docs/learnings/        | timeless concepts             | /learnings    |
| CHANGELOG.md           | user-facing changes           | /ship         |
```

That map is what makes `CLAUDE.md` the front door. The first file the AI reads already knows the other layers exist, what goes in each one, and which command keeps it honest. But the map only points at the workflow. It does not contain it. The workflow lives one folder over.

Alongside the map sit three system docs, each with one job:

- `docs/architecture.md`: how the system is structured today
- `docs/product-design.md`: what the product is, who it is for, what is in scope
- `docs/engineering-guidelines.md`: patterns to follow, patterns to avoid, known issues

Before any new feature, Claude reads those files. So do I. They are the source of truth, not the chat history.

When I ask for a change that contradicts something in those docs, Claude pushes back. That is the point.

---

## The workflow: one file, and the loops it runs

A teammate also needs to know how the work gets done. That is not in `CLAUDE.md`. It lives one folder over, in `.claude/rules/toolkit.md`.

That file is the workflow itself. It defines the critical rules Claude never breaks (never auto-fix, report before changing, ask before assuming), the two lifecycles a change can follow, the index of every command, and how those commands get invoked. If `CLAUDE.md` is the front door, `toolkit.md` is the house rules.

You set the project up once: `CLAUDE.md`, the system docs, the toolkit. After that, every change runs the same short loop.

For a feature, the loop is plan, build, ship:

```
  +--> plan    /start-feature -> /explore -> /create-plan -> /ui-spec
  |    build   /execute -> /unit-test -> /review
  |    ship    /document -> /guides -> /learnings -> /ship
  +--------------------------- and back around
```

Each step is a skill in `.claude/commands/`, invoked as a slash command so the template runs the same way every time. And each has exactly one job. `/explore` reads the codebase and asks questions until the scope is clear. It is not allowed to write code. `/create-plan` writes a numbered plan with a status marker on every step. `/review` reports issues but is not allowed to fix them. I read the report and say "fix it" before anything moves.

The constraint is the point. When each command can only do one thing, nothing wanders.

When something breaks instead of getting built, there is a tighter loop:

```
fix    /create-issue -> /pair-debug -> /fix
```

Same idea, fewer steps.

Here is what has shifted lately. I used to drive every step by hand. Now I let Claude run most of the loop on its own, through exploration, planning, the decision calls, the build, and its own first review. I step in to verify and ship. There is still a human in the loop. There is just a lot less of me in it than there used to be.

---

## Memory: plans, learnings, guides

This is the part that compounds.

Every feature gets a plan file in `docs/plans/`, named after the GitHub issue:

```
docs/plans/_archive/
  P9-task-completion.md
  P12-projects-inbox.md
  P22-mobile-task-cards.md
  P30-labels-and-filtering.md
  P50-mcp-server.md
  ...
```

Each one has a TLDR, a list of critical decisions with rationale, and a checklist that gets ticked off during `/execute`. When the feature ships, the file moves to `_archive/`. Months later, when I am wondering why I hand-rolled the OAuth server instead of pulling in a library, the answer is sitting there with the date next to it.

Two other folders catch the rest of what gets learned:

- `docs/learnings/` is for timeless concepts. CORS. DNS and nameservers. OAuth 2.1. The MCP protocol. Things that will be true in any project, not just this one. I write each one *as I learn it*, while it is still fresh.
- `guides/` is for end-to-end walkthroughs. How I set up the Cloudflare Tunnel. How I deployed to GCP. How I registered the GitHub OAuth App. Project-specific recipes, in case I need to do it again.

The frame: the AI's context window is small. The repo's memory is permanent. Anything worth knowing goes in the repo.

I write these things alongside the work, not at the end. By the time the feature ships, the documentation has already shipped with it.

---

## The boring developer stuff that came back

Somewhere along the way I noticed something.

The workflow was not really about AI. It was about the developer practices that don't usually make it into side projects.

Plans before code. Tests as part of "done", not a follow-up. Real commits with real messages. A branch when the work is risky, main when it is small. A changelog that actually changes. A `LESSONS.md` for things I want to not repeat.

These are not new ideas. They are the things you do at work. They rarely come along on weekends.

AI made me faster. The workflow made the speed worth keeping.

---

## The workflow that evolves itself

The last piece is the one I am most proud of.

There is a file called `docs/workflow-notes.md`. It is a living scratchpad. When something about the workflow surprises me, I write it down there with a date. A step that did not fit. A rule that needed bending. A new pattern that worked well.

When the feature ships, I review what is in `workflow-notes.md`. The keepers get codified back into the toolkit. The rejects get marked as such with a one-line reason. The file itself is never deleted. It is an append-only log of how the workflow learned to work better.

The workflow is also a thing that has versions. It evolves the same way the app does.

---

## What it added up to

Tasklog is at v2.20 now, with v2.21 in progress. It is the .NET API and Next.js frontend you would expect, plus a few less-usual pieces: an inbuilt time tracker, recurring tasks and habits, and a custom MCP server I built so I can text Claude from my phone ("add a task: review PR by Friday") and watch the task appear in the app a second later.

None of that would have shipped without the scaffolding. The first weekend I built Tasklog, I had a working MVP and no path forward. Everything since then has been the workflow doing its job.

The lesson, if there is one, is small. AI is not the multiplier. The system you build around it is.

---

## What is next

The piece of this I am most excited to write about is the MCP server. It runs on an old Android phone I turned into a home server, sitting in my house, always on, on my Wi-Fi. A custom Claude connector reaches it over a Cloudflare Tunnel, so from anywhere I can tell Claude what I need in plain words and let it manage my tasks for me.

No cloud, no monthly bill, just a phone I already owned. A fitting place to land, for a project that started when I walked away from a subscription.

That is the next post.

---

*The repo is open: [github.com/manucompiles/Tasklog](https://github.com/manucompiles/Tasklog). If you want to look at the workflow itself, the `CLAUDE.md`, `.claude/commands/`, `docs/`, and `guides/` folders are where the scaffolding lives.*
