---
title: "Building This Site: Next.js + Tailwind CSS in Practice"
date: "2026-06-10"
excerpt: "How I built this pixel-terminal personal site from scratch with Next.js 15 and Tailwind CSS — the architecture trade-offs, the theme system, and shipping to Vercel."
tags: ["Next.js", "TypeScript", "Blog"]
---

This site is its own best demo. It started from a blank `create-next-app` — no template — and slowly grew into the single-phosphor amber CRT you're looking at.

## Why Next.js 15

I didn't want just a static blog; I wanted an **interactive personal space**: type commands on the home page to navigate, a live status bar, a boot animation. The Next.js 15 App Router lets static prerendering and client interactivity coexist cleanly — most pages are HTML at build time, while the terminal and command palette become client components only where needed.

> The rule: server by default, client only where it earns it. Fast first paint, friendly to crawlers, no compromise on interaction.

## The theme system

The whole palette is described by one set of CSS variables:

```css
:root {
  --bg: #0c0a06;
  --fg: #f1dcab;
  --amber: #ffb000;
  --border: #3a2b12;
}
```

Switching themes only flips the `data-theme` attribute; every component adapts through semantic classes like `bg-surface` and `text-amber` — **no need to write two stylesheets per component**. That's restraint, made into engineering.

## Deploying

Push to GitHub, Vercel builds and deploys, bound to `yamiker.cloud`. The loop is:

1. Edit locally, get `next build` green
2. `git push`
3. Live on Vercel in under a minute

No fancy CI — plenty for a personal site. **The expensive part was never the stack; it's every small decision along the way.**
