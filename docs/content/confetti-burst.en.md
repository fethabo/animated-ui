---
title: ConfettiBurst
description: One-shot confetti bursts fired imperatively via ref.
---

## Features

- Imperative API: `ref.current?.fire(options?)` fires a burst; `options` override the props **for that shot only**.
- Successive shots accumulate on the same canvas, without remounting the component.
- Simple per-piece physics (initial velocity, fan spread, gravity) with `rect`/`circle` shapes and a configurable palette.
- The canvas overlays the container and never intercepts the mouse (`pointer-events: none`).

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-confetti-color-<i>` | festive palette | Color `i` of the default palette (1-indexed). |

## Limitations

- `fire()` is a no-op before hydration.
- With `prefers-reduced-motion` enabled (and the default `respectReducedMotion`), `fire()` is a no-op: confetti is autonomous celebration with no useful static version — alternative feedback is up to the consumer.
