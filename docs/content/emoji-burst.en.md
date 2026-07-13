---
title: EmojiBurst
description: One-shot emoji burst via ref.
---

## Features

- Imperative API: `ref.current?.fire(options?)` fires a fan of emojis with physics (fan spread, gravity).
- Configurable emoji list; rendered with the system emoji font (no assets).
- Shots accumulate on the same canvas.

## Limitations

- Emoji look varies by operating system (uses `fillText`).
- Conservative default `count` (30): `fillText` per particle is costlier than confetti shapes.
- With `prefers-reduced-motion` enabled (default), `fire()` is a no-op.
