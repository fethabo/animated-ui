---
title: HorizontalScrollSection
description: Panels traversed horizontally as you scroll vertically.
---

## Features

- Turns vertical scroll into horizontal travel of its child panels (sticky track).
- `speed` multiplies the vertical travel needed; `easing` maps the progress.
- Exposes `--aui-hscroll-progress` (0–1) for linked effects.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-hscroll-progress` | `0` | Horizontal travel progress (0–1). |

## Limitations

- Defines its own travel height (tall): use it as a full-page section.
- Uses `position: sticky`: cannot live inside an ancestor with `overflow: hidden`.
- With `prefers-reduced-motion` panels stack vertically like normal sections.
