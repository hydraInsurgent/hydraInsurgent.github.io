---
kind: linkedin
status: draft
article: src/content/tech/poor-mans-blue-green-deployment.md
---

You deploy something. It breaks. Now you have to rebuild and re-upload just to get back to where you were.

For a side project on a single VM that can take 10-15 minutes. Not ideal.

The fix I use for Tasklog: every deploy keeps the previous build in a `-old` directory. If something in the new deployment breaks, one script swaps it back in seconds. No rebuild, no re-upload.

It is basically the cheap version of a pattern called blue/green deployment. Two versions on disk, swap between them. You skip the load balancer and second server, just keep the extra folder.

Costs a bit of disk space. That is the whole trade-off.

How the deploy and rollback scripts work: [link]
