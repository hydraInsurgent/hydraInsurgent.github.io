# Workflow Post and Starter Kit Plan

**Overall Progress:** `0%`

## TLDR

Ship part-two of the TaskLog price-change post: a tech piece on the actual Claude Code workflow that turned a weekend MVP into v2.9 in 38 days. Pair it with a sanitized GitHub template repo of the workflow scaffolding (`.claude/` commands + `docs/` skeleton) and a simple Buttondown signup form at the post footer. Target: weekend of May 2 to 3, 2026.

This file is the working brief. Update it as thinking evolves. Open questions live here, not in a separate doc.

---

## Goal State

**Current State:** Part-one ("When a Price Change Made Me Build My Own To-Do App") is published. The TaskLog repo contains a full, lived-in workflow (18 slash commands, doc skeleton, lifecycle integrated with GitHub) but it is not extracted or documented for reuse. No newsletter exists. No starter kit exists.

**Goal State:**
- Tech post published at `/tech/<slug>` linking back to part-one and forward to the kit
- Public GitHub template repo with sanitized `.claude/` + `docs/` scaffold, configured as a "Use this template" repo
- Buttondown signup form embedded at the bottom of the post (and on the kit README)
- All cross-links resolve in both directions

---

## Scope

### What this IS

- Part-two of part-one. The "how" the previous post promised.
- Structurally about the named lifecycle: `/start-feature` to `/explore` to `/create-plan` to `/ui-spec` to `/execute` to `/unit-test` to `/review` to `/document` to `/ship`.
- Anchored in the actual TaskLog git history: v1 on Jan 31, 6-week pause, v2.0 to v2.9 from Mar 11 to Apr 18 (100 commits, 9 minor releases, multiple patch versions).
- One worked example from the TaskLog CHANGELOG showing the full trail: issue, plan, execute, ship.
- An honest pass: the v2.0 full rewrite, multi-day CI fights in v2.7, the empty `LESSONS.md` tension, the moments Claude got stuck.
- A copy-able GitHub template repo. Sanitized version of TaskLog's `.claude/` + `docs/` skeleton, with placeholders where TaskLog-specific content lives.
- A footer signup form. Buttondown. One field, no verification gate, no zip download.

### What this ISN'T

- Not "AI will build your app for you." Explicit counter-frame.
- Not a gated lead magnet. No email verification flow, no zip delivery, no token endpoints.
- Not a self-hosted newsletter project. Listmonk and custom SMTP are deferred to a future round.
- Not a rewrite of part-one. Assumes the reader has the why.
- Not a beginner Claude Code tutorial. Assumes basic familiarity with the CLI and slash commands.
- Not a feature-by-feature retrospective of every TaskLog version.
- Not "anyone can derive this in a weekend." It is "anyone can copy this scaffold and start."

---

## Critical Decisions

- **Frame: workflow as the lead.** Not AI hype. The post argues that the workflow was the unlock, not the model.
- **Starter kit = public GitHub template repo.** Not a gated zip. One-click "Use this template." More credible than a gated download and removes infrastructure from the critical path.
- **Newsletter = Buttondown footer form.** Free tier or $9/mo if needed. No verification, no double-opt-in custom flow, no zip delivery. Defer Listmonk and self-hosting.
- **One worked example, not a tour.** Pick a single TaskLog feature from the CHANGELOG and walk through it end-to-end. Candidate features below in Open Questions.
- **Publish kit and post together.** Cross-linking only works if both are live.

---

## Open Questions

Update this list as decisions are made. Move resolved items into Critical Decisions.

- **Title.** Leaning toward something specific to the TaskLog story, not generic. Candidates:
  - "From v1 to v2.9: The Workflow That Made TaskLog Real"
  - "How I Build with Claude Code: The TaskLog Workflow"
  - "Why I Wrote the Workflow Before the Code"
  - The third option matches the actual git history (the toolkit commit landed before the migration commits) and is the most contrarian.
- **Worked example feature.** Three candidates from the CHANGELOG:
  - **v2.4 Labels and Filtering.** Most full-stack (DB, API, UI, tests). Best showcase of the workflow producing a real feature.
  - **v2.6 Background Auto-Refresh.** Cleaner scope, demonstrates a custom hook pattern, shows how `usePolling` got documented in engineering-guidelines.
  - **v2.7 CI and Cross-Platform.** Most honest about pain (Mac runner discontinued, hidden `.next` dir bug, missing hook). Best fit for the "what takes time" beat.
- **`LESSONS.md`.** Currently empty in the TaskLog repo despite the toolkit instructing Claude to update it. Two options:
  - (a) Backfill 5 to 10 real lessons before the post goes live, then point to it as part of the system.
  - (b) Address the empty file in the post itself as an honest beat ("I built a lesson-tracking system and never used it; here's what I think went wrong").
- **Template repo name.** Candidates: `claude-code-solo-builder-kit`, `solo-dev-claude-kit`, `claude-code-workflow-kit`. Pick something searchable that does not lock to "solo" if teams might use it.
- **Publish ordering.** Kit first, then post linking to it? Or both at the same time? Both at the same time is cleanest if the cross-links are pre-staged.
- **Buttondown tier.** Free tier has limits worth checking. $9/mo Pro may not be needed for v1.
- **Sanitization scope.** Which TaskLog specifics need to come out of the kit (project name, .NET / Next.js references in `architecture.md`, etc.) vs which stay as illustrative placeholders.

---

## Tasks

- [ ] 🟥 **Step 1: Freeze the outline** `[sequential]` -> delivers: chosen title, chosen worked example, decision on `LESSONS.md` approach
  - [ ] 🟥 Pick title from candidates
  - [ ] 🟥 Pick worked example feature from candidates
  - [ ] 🟥 Decide `LESSONS.md` approach (backfill or honest beat)
  - [ ] 🟥 Decide publish ordering (kit-first vs simultaneous)

- [ ] 🟥 **Step 2: Sanitize the starter kit** `[parallel]` -> delivers: clean scaffold ready to push to a new repo
  - [ ] 🟥 Copy `.claude/commands/`, `.claude/rules/toolkit.md` from TaskLog
  - [ ] 🟥 Generalize `CLAUDE.md` into a template with placeholders
  - [ ] 🟥 Generalize `docs/architecture.md`, `docs/product-design.md`, `docs/engineering-guidelines.md` into templates
  - [ ] 🟥 Generalize `docs/backlog.md`, `CHANGELOG.md`, `LESSONS.md` as fillable starting points
  - [ ] 🟥 Write a kit README explaining the lifecycle and how to start
  - [ ] 🟥 MIT license

- [ ] 🟥 **Step 3: Draft the post** `[parallel]` -> delivers: complete markdown ready for self-edit
  - [ ] 🟥 Open with the v1 to v2.9 arc (Jan 31 -> 6-week pause -> Mar 11 toolkit commit -> 38 days)
  - [ ] 🟥 Section: the toolkit (CLAUDE.md + rules) - why I wrote it before the code
  - [ ] 🟥 Section: the lifecycle - the 9-step flow with the worked example
  - [ ] 🟥 Section: the doc skeleton - how the files interact
  - [ ] 🟥 Section: honest beats - rewrite, CI fights, LESSONS.md tension
  - [ ] 🟥 Section: the starter kit - what to copy, link to template repo
  - [ ] 🟥 Closing CTA - subscribe, view kit, link to part-one

- [ ] 🟥 **Step 4: Publish the template repo** `[sequential]` -> depends on: Step 2
  - [ ] 🟥 Create new public repo on GitHub
  - [ ] 🟥 Push sanitized scaffold
  - [ ] 🟥 Configure as a template repo in repo settings
  - [ ] 🟥 Verify "Use this template" button works
  - [ ] 🟥 Add Buttondown signup link to README

- [ ] 🟥 **Step 5: Self-edit pass** `[sequential]` -> depends on: Step 3
  - [ ] 🟥 No em-dashes / en-dashes (regular hyphens only)
  - [ ] 🟥 Voice match check against part-one (honest, direct, first person)
  - [ ] 🟥 Verify every claim against the actual repo (no aspirational features, no rewritten history)
  - [ ] 🟥 Cut anything that reads as AI-marketing register

- [ ] 🟥 **Step 6: Set up Buttondown** `[parallel]` -> delivers: working signup form embed
  - [ ] 🟥 Create Buttondown account
  - [ ] 🟥 Configure newsletter basics (name, sender, welcome message)
  - [ ] 🟥 Create signup form, copy embed snippet
  - [ ] 🟥 Verify deliverability with a self-test

- [ ] 🟥 **Step 7: Wire and publish** `[sequential]` -> depends on: Steps 4, 5, 6
  - [ ] 🟥 Embed Buttondown form on post
  - [ ] 🟥 Cross-link: post -> kit, post -> part-one, kit -> post
  - [ ] 🟥 Add OG / Twitter Card meta to the post
  - [ ] 🟥 Build, deploy, verify live
  - [ ] 🟥 Sanity check signup flow end-to-end

- [ ] 🟥 **Step 8: Close out** `[sequential]` -> depends on: Step 7
  - [ ] 🟥 Move P2 row from Active to Closed in `docs/backlog.md`
  - [ ] 🟥 Archive this plan to `docs/plans/_archive/`
  - [ ] 🟥 Prune Someday/Maybe of items now done (e.g. social meta tags, if confirmed)
  - [ ] 🟥 Update CHANGELOG-style entry if the site adopts one

---

## Dependencies before publishing

- Template repo public, accessible, configured as template
- Buttondown form embedded and tested with a real signup
- All cross-links resolve in both directions (post <-> kit <-> part-one)
- `LESSONS.md` decision implemented (either filled or addressed in post)
- OG image generated for the post

---

## Outcomes

<!-- Fill in after publish: what shipped, what changed vs. plan, what to do differently next time -->
