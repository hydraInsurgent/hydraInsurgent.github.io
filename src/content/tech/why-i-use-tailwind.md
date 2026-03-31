---
title: "Why I Use Tailwind CSS"
date: 2026-03-25
description: "Tailwind gets a lot of opinions. Here is why it works well for small, solo-built sites."
---

I resisted Tailwind for a long time. Writing `text-sm font-medium text-gray-700` in HTML felt wrong - wasn't this just inline styles with extra steps?

After using it for a while, I changed my mind. Here is why.

## The problem with traditional CSS

On a solo project, the real danger with CSS isn't specificity or the cascade. It's the slow accumulation of classes you're not sure are still used.

You add `.hero-title` for a component. Later you refactor the component. The class stays in the stylesheet. Over time, the CSS grows and you stop trusting it.

## What Tailwind changes

With utility classes, the styles live in the HTML. When you delete the component, the styles go with it. The stylesheet never grows out of sync with the markup.

There's also a cognitive simplicity to it: you're not naming things. Naming things is surprisingly hard, and skipping it reduces a lot of small decisions.

## When it's not great

Tailwind adds noise to markup. For complex components, the class strings get long. There are patterns to manage this (`@apply`, component files) but it's a real trade-off.

For a simple static site, the trade-off is worth it. For a large application with a design system, I'd think harder about it.
