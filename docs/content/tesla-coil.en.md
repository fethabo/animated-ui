---
title: TeslaCoil
description: A Tesla coil on canvas: a central node emitting jagged bolts, with arcs that jump toward the cursor.
---

## Features

- A central node emits `boltCount` bolts (jagged electric arcs) outward, regenerating to feel like a continuous discharge. The jagged stroke is generated with midpoint-displacement subdivision seeded by the internal PRNG.
- With `followCursor` (default) and the cursor over it, it aims `cursorBolts` bolts at the pointer — thicker, brighter and with a white core compared to the ambient ones —, regenerated each frame so they crackle as they follow it. Tracking is by ref, **with no per-frame re-renders**.
- With `cursorTrigger="click"` those bolts only fire while the pointer is pressed.
- The canvas has `pointer-events: none`: overlaid `children` (a button, a title) stay interactive.
- Accepts any valid `<div>` HTML prop.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-tesla-color` | `#7dd3fc` | Bolt color. Takes precedence over the `color` prop. |
| `--aui-tesla-line-width` | `2px` | Bolt thickness. |
| `--aui-tesla-reach` | `160` | Bolt reach in px (numeric, no unit). |
| `--aui-tesla-jitter` | `18` | Jitter magnitude in px (numeric, no unit). |
| `--aui-tesla-frequency` | `12` | Regenerations per second (numeric, no unit). |

## Limitations

- The container needs a defined height: the canvas covers the root's space, which collapses without a height.
- On touch devices (no hover) only the ambient bolts are emitted.
- With `prefers-reduced-motion` the ambient bolts are drawn once without regenerating.
