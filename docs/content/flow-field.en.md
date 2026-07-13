---
title: FlowField
description: Particles tracing a noise flow field, leaving trails — on canvas.
---

## Features

- Hundreds of particles follow a deterministic noise field and leave fading trails (`fade`).
- Deterministic: the same `seed` + dimensions produce the same evolution (no `Math.random`), stable across renders and SSR-safe.
- The component paints its own background (`background`): it is opaque, required for the trail fade (unlike ParticleField).
- `scale` controls the field zoom: higher values ⇒ wider, smoother curves.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-flow-color-<i>` | default palette | Trail palette color `i` (1-indexed). |
| `--aui-flow-background` | `#0a0a12` | Background color the canvas paints. |

## Limitations

- It is a decorative background: absolutely positioned inside a `position: relative` container.
- With `prefers-reduced-motion` it draws a static composition of pre-simulated trails, no RAF.
- Many particles + large containers raise the per-frame cost.
