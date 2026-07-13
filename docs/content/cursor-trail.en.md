---
title: CursorTrail
description: A particle or fluid-line trail that follows the pointer inside its container, drawn on an overlay canvas.
---

## Features

- Trail drawn on an overlay canvas with `pointer-events: none`: children stay interactive (clicks pass through the trail).
- Two modes: `particles` (particles with lifetime, fade and slight drift) and `line` (a fluid line through the latest points, with thickness and alpha decreasing toward the tail).
- Emission is throttled by travelled distance (`emitEvery` px): a still pointer emits nothing. The RAF runs only while there is a live trail — zero cost at rest.
- Optional multicolor palette (`colors`): each particle picks its color at random (only in `mode="particles"`; in `line` the first one is used).
- Scoped to its container: no document-level effects.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-cursor-trail-color` | `#7c3aed` | Trail color. Overrides the `color` prop. |
| `--aui-cursor-trail-size` | `8px` | Base trail size. Overrides the `size` prop. |

## Limitations

- With `prefers-reduced-motion` enabled the effect is fully disabled (no drawing, no RAF): the trail is decorative motion, not functional feedback.
- On touch devices it degrades to a no-op: there is no persistent pointer to follow.
