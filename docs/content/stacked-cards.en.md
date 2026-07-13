---
title: StackedCards
description: Cards that stack and shrink as you scroll.
---

## Features

- Each child pins (sticky) and shrinks/darkens by its depth in the stack as scroll advances.
- `scaleStep` and `opacityStep` control the per-level shrink and darkening.
- `cardTravel` sets the scroll px per card.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-stack-offset` | `0` | Px from the top where the stack pins. |
| `--aui-stack-scale-step` | `0.05` | Per-level shrink. |
| `--aui-stack-opacity-step` | `0` | Per-level darkening. |
| `--aui-stack-travel` | `400px` | Scroll px per card. |

## Limitations

- Uses `position: sticky`: cannot live inside an ancestor with `overflow: hidden`.
- With `prefers-reduced-motion` the cards stay in a static, readable sticky layout, without the scroll-linked transforms.
