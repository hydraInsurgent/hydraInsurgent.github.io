---
kind: tech
title: "The workflow that made Tasklog possible"
description: "How a self-hosted task app shipped 10+ versions in four months: the slash commands, docs, and discipline that turned AI from a vending machine into a teammate."
date: 2026-05-24
---

A few weeks ago I wrote about [why I built Tasklog](https://manudubey.in/tech/when-a-price-change-made-me-build-my-own-todo-app/) - a self-hosted task app I made after my Todoist subscription jumped 3x.

That post was the *why*. This is the *how*.

Tasklog is a small task manager that runs on my own machine. Tasks, projects, labels, deadlines. No account, no subscription, no cloud. A .NET API, a Next.js frontend, a SQLite file. Two services, one database, my data. As of v2.10 it also has a connector I can text from Claude on my phone - more on that in a minute.

The interesting thing was never the app. The interesting thing was that I shipped 10+ versions of it in four months, alongside a full-time job, without losing the thread.

That part needed a workflow.

---

## What two days of building actually looked like

Last week I added an MCP server to Tasklog. The end result: I can text Claude from my phone, ask it to add a task, and watch the task appear in the web UI a second later. About 1500 lines of code, two days, no rewrites needed.

I want to walk through what those two days actually looked like, because the answer to "how do you ship that fast?" lives in the walkthrough, not in the lines of code.

It started with this:

```
> /start-feature
```

Which created a tracking issue and a branch. Nothing impressive. The interesting thing was what came next.

```
> /explore
```

The AI is not allowed to write code during `/explore`. It can only read. It reads four files first: the project's architecture doc, the product-design doc, the engineering guidelines, the backlog. Then it asks me questions. For this feature it asked three: what's the auth model, what hosts the MCP server, what's out of scope.

Two of the three were good questions. The third caught me off guard - I had not decided on the hosting shape. I would have started building on the wrong foundation if I had just typed "build me an MCP server."

Because this was a new external spec (the Model Context Protocol), `/explore` did something extra: it populated three research files. Verified excerpts from the MCP spec, claude.ai's connector docs, Cloudflare's tunnel docs. Each one dated, sourced, with the critical bits quoted. Not paraphrased from training data. The plan that came next cited those files instead of restating facts.

Then:

```
> /create-plan
```

A markdown file appeared with a TLDR, a list of critical decisions with rationale, and a numbered checklist. The decisions block looked like this:

```
Decision 3: OAuth implementation
  Options considered: mcp-auth library, Cloudflare workers-oauth-provider, hand-roll
  Chosen: hand-roll
  Why: OAuth is something I want to study. Hand-rolling makes
       every spec requirement visible in our code with no vendored
       opaqueness.
  Trade-offs accepted: ~500-800 lines of TypeScript to maintain.
  Research citation: docs/research/claude-ai-connector-oauth.md
```

Two months from now I will not have to guess why I made that choice. The reasoning is sitting in the repo with the date next to it.

`/execute` built the thing, ticking off each step in the plan as it went. When the build hit a surprise - claude.ai sent a protocol version newer than the public spec - the AI wrote one paragraph into a file called `workflow-notes.md` so we could deal with it deliberately instead of inventing on the fly. By the end of day two the connector was live. `/ship` tagged v2.10 and the deploy went out.

That is the workflow. Most of it is not visible in the code. All of it is in the repo.

---

## Why this beats the obvious way

The obvious way to use AI for coding is what people call vibe coding.

Open a chat. Describe what you want. Copy the code into your editor. Run it. If it breaks, paste the error back. Repeat.

The first session does feel fast. The trouble starts around session three. The AI has forgotten what we decided last week. You have forgotten what you decided last week. Two functions do the same thing in slightly different ways. The folder structure has drifted. You are answering the same questions you already answered, in a slightly different shape, and the code is starting to look like a quilt sewn by four different people.

The Claude window has no memory between sessions. The repo does. The workflow is the trick of making sure everything important lives in the repo, not the chat.

If you want to look at the actual scaffolding, the repo is open: [github.com/manucompiles/Tasklog](https://github.com/manucompiles/Tasklog). The `.claude/commands/` folder is where the slash commands live. `docs/` is where the memory lives. There's nothing magic in there - it is short files, written in plain language, that the AI reads first in every new session.

The boring developer stuff came back with the workflow too. Plans before code. Tests as part of "done", not a follow-up. Real commits with real messages. A branch when the work is risky, main when it is small. A `LESSONS.md` for things I want to not repeat. These are not new ideas. They are the things you do at work and skip on weekends.

AI made me faster. The workflow made the speed worth keeping.

---

## The workflow that evolves itself

The last piece is the one I am most proud of.

There is a file called `docs/workflow-notes.md`. It is a living scratchpad. When something about the workflow surprises me - a step that did not fit, a rule that needed bending, a pattern that worked well - I write it down there with a date.

The MCP build produced four entries. The most interesting one: claude.ai sends a protocol version (`2025-11-25`) that did not exist in the published spec at the time I built. My middleware was hardcoded to reject anything else, because that's what my training-data memory said the supported versions were. Every claude.ai request returned 400. We spent an hour debugging before I realized I had baked an assumption from training data into the code.

The fix was small. The lesson was bigger: don't enumerate "supported versions" of a moving spec. Validate the format only, and let the underlying library decide what it actually accepts.

That lesson went into `workflow-notes.md`. When the feature shipped, I reviewed what had accumulated there. The keepers got codified back into the toolkit. The rejects got marked as such with a one-line reason. The lesson about evolving specs became a permanent rule in `/explore`: if the work touches an external protocol, write research files first, before any code.

Most posts about AI tooling treat the workflow as static. It cannot be. The interesting failures are the ones that change how you work next time. The workflow is also a v-numbered thing. It evolves the same way the app does.

---

## What it added up to

Tasklog is at v2.10 now. .NET API, Next.js frontend, a custom MCP server on an old Android phone sitting in my house. Sixteen tools that claude.ai can call. I can text my tasks from anywhere - "add a task: review PR by Friday" - and they land on a device I own.

None of that would have shipped without the scaffolding. The first weekend I built Tasklog, I had a working MVP and no path forward. Everything since then has been the workflow doing its job, one feature at a time.

AI is not the multiplier. The system you build around it is.

---

*The next post is about the MCP server itself: what it took to run a small home server on an old Android phone, how the claude.ai connector finds it, and what actually crosses the wire when you type "add a task" into the app.*
