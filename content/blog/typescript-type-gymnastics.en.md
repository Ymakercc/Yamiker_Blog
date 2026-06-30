---
title: "TypeScript Type Gymnastics: From Basics to Mastery"
date: "2026-05-28"
excerpt: "Conditional types, mapped types, template literal types — a few real examples to understand what type gymnastics actually solves, instead of showing off."
tags: ["TypeScript", "Programming"]
---

"Type gymnastics" gets dismissed as showing off, but its real value is simple: **making illegal states impossible to express at compile time**. A few small examples.

## Conditional types: output depends on input

```ts
type Awaited<T> = T extends Promise<infer U> ? U : T;

type A = Awaited<Promise<string>>; // string
type B = Awaited<number>;          // number
```

`infer` lets us "capture" a piece of a type. It's the most-used tool in the gymnastics toolbox.

## Mapped types: transform in bulk

```ts
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};
```

`-readonly` strips the readonly modifier; `-?` strips optional. Mapped types let you **derive new types from existing ones** instead of hand-writing them again.

## Knowing when to stop

Type gymnastics has a cost: over-clever types slow the editor and scare off the next reader. My test is simple:

- If it helps the caller **make fewer mistakes**, keep it
- If it only makes me look smart, delete it

> Good types are like good comments — the less you notice them, the more they're worth.
