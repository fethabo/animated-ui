---
title: DrawPath
description: Animates the line-drawing of the SVGs it wraps.
---

## Features

- Measures the stroked elements of the child SVG and applies the draw animation, respecting existing `stroke`/`stroke-width`.
- Does not restructure the consumer SVG; elements with `data-aui-no-draw` stay visible without animating.
- `stagger` staggers strokes in document order; `trigger` in-view or mount.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-draw-duration` | `1.2s` | Duration of each stroke. |
| `--aui-draw-stagger` | `0.15s` | Incremental delay between strokes. |
| `--aui-draw-delay` | `0s` | Wait before the first stroke. |

## Limitations

- Operates on stroked elements (paths, lines, etc.): fills are not animated.
- With `prefers-reduced-motion` the SVG is shown fully drawn instantly.
