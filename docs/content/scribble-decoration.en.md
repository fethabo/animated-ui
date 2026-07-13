---
title: ScribbleDecoration
description: Hand-drawn scribbles (arrow, circle, underline…) over text.
---

## Features

- Draws a hand-drawn scribble: `arrow`, `asterisk`, `spiral`, `underline`, `circle`, or a custom function.
- Deterministic jitter by `seed`: same seed + shape + size ⇒ same scribble.
- `trigger` in-view or mount; `repeat` to draw/fade in a loop.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-scribble-color` | `currentColor` | Stroke color. |
| `--aui-scribble-stroke-width` | `3px` | Thickness. |
| `--aui-scribble-duration` | `0.9s` | Draw duration. |
| `--aui-scribble-delay` | `0s` | Wait before drawing. |

## Limitations

- It is decoration: rendered as a `<span>` with an overlaid SVG.
- With `prefers-reduced-motion` the scribble is shown complete and static, without drawing or loop.
