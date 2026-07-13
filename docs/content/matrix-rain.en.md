---
title: MatrixRain
description: Matrix-style glyph rain with bright heads — on canvas.
---

## Features

- Columns of falling glyphs, each column head highlighted (`headColor`).
- Deterministic: the same `seed` + dimensions produce the same layout and sequence.
- The component paints its own background (required for the trail fade overlay).
- Configurable `charset`; `fontSize` defines the grid (larger = fewer columns, a performance lever).

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-matrix-color` | `#22c55e` | Trail color. |
| `--aui-matrix-head-color` | `#d9ffe3` | Column head color. |
| `--aui-matrix-background` | `#040905` | Background color. |

## Limitations

- Decorative background: absolute inside a `position: relative` container by default.
- With `prefers-reduced-motion` a static frame of columns is painted, no RAF.
