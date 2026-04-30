---
title: "Poor Man's Blue/Green Deployment"
status: published
date: 2026-04-25
description: "Full blue/green is overkill for a single small VM. Keep one previous deployment in -old directories and swap back in seconds without rebuilding."
---

Blue/green deployment is the idea that you keep two environments live and flip traffic between them. Deploy breaks something? Switch back instantly, no rebuild needed.

The full version needs two servers, a load balancer, and some orchestration. For a single VM running a side project, that is overkill. But the core idea, keeping a previous version around so you can switch back fast, is worth stealing.

There is a simpler version. Every deploy keeps the previous build around in `-old` directories alongside the current one. If something breaks, a rollback script swaps them back. No rebuild, no re-upload.

## How it works

After each deploy the VM looks like this:

```
tasklog/
  backend/       <- live
  backend-old/   <- previous deploy
  frontend/      <- live
  frontend-old/  <- previous deploy
```

The deploy script stages the new build into `-new` directories, then runs a swap on the VM:

```bash
# rotate backend
rm -rf backend-old
mv backend backend-old
mv backend-new/linux-x64 backend
rm -rf backend-new

# rotate frontend
rm -rf frontend-old
mv frontend frontend-old
mv frontend-new/... frontend/
rm -rf frontend-new

sudo systemctl restart tasklog-api tasklog-frontend
```

The previous live version moves to `-old`. The new build takes its place. Services restart against the new build.

## Rolling back

The rollback script does a symmetric swap. Instead of deleting `-old`, it rotates all three positions:

```bash
# swap backend
mv backend       backend-new-tmp
mv backend-old   backend
mv backend-new-tmp backend-old

# same for frontend
...

sudo systemctl restart ...
```

The previous version goes live. What you just rolled back from moves to `-old`. You can run it again to flip forward. It also checks that `-old` directories exist before touching anything, and asks for confirmation before doing anything.

## The trade-off

You are keeping roughly double the disk space for deployed artifacts. For a small app that is a few hundred MB, that is fine.

What you do not get is zero-downtime deploys. There is a short gap while services restart. For a portfolio project or a personal app that is an acceptable trade. Zero downtime needs a load balancer in front of two live instances, which is a different problem entirely.
