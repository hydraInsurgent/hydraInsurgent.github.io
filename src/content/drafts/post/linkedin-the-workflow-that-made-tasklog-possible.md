---
kind: linkedin
status: draft
article: src/content/tech/the-workflow-that-made-tasklog-possible.md
---

Three months ago I was excited about how fast Claude could help me build things.

A few weeks in, I noticed something quieter. Every project I had started with Claude was hitting a wall by the third feature. The first one or two came fast. By the third, Claude had forgotten what we decided, I had forgotten what I decided, and the code looked like a quilt sewn by four people.

I had been assuming the fix was a better prompt or a smaller scope. The actual fix was less interesting: structure. Actual development practice, the kind I do at work, applied to a side project. Plans before code. Tests as part of "done". Real commits with real messages. A `LESSONS.md` for things I want to not repeat.

All of it living in the repo, not in chat. A chat window forgets between sessions. The repo is the only thing that doesn't.

What it looks like in my repos now: a workflow file that defines named single-purpose commands. A `CLAUDE.md` at the root with the project's rules. A folder that archives every decision with the date next to it.

Tasklog, my self-hosted task app, is on its twentieth release because of that scaffolding.

Full story: 👉 [link]

Last week I texted Tasklog while walking to a meeting: "add a task: review PR by Friday." A second later it was in the app. The app runs on a home server I built on an old Android phone, reachable through a Cloudflare Tunnel, with a custom MCP server in between. That is the next post.
