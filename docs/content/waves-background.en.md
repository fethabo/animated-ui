---
title: WavesBackground
description: Background of lines waved by a deterministic noise field, on canvas.
---

## Features

- Deterministic noise field: the same `seed` + dimensions always produce the same waves (no `Math.random`), stable across renders and SSR-safe.
- Interpolated palette: with more than one color, each line takes its color from its vertical position between the palette's endpoints.
- A single canvas with RAF; `speed={0}` freezes the waving without unmounting anything.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-waves-color-<i>` | default palette | Palette color `i` (1-indexed). |
| `--aui-waves-line-width` | `1.5px` | Line thickness. |

## Limitations

- It is a decorative background: absolutely positioned inside its container (`position: relative` on the parent).
- With `prefers-reduced-motion` the lines render curved but static, with no RAF.
- Many lines + large containers raise the per-frame cost (2D canvas).
