---
title: TopographicBackground
description: Contour lines of a terrain from noise that deforms slowly — on canvas.
---

## Features

- Contour lines (level curves) of a noise field that evolves gradually.
- Deterministic: the same `seed` + dimensions produce the same map (no `Math.random`), SSR-safe.
- `speed={0}` keeps the terrain fixed and runs no RAF.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-topo-color` | `#38bdf8` | Contour color. |
| `--aui-topo-line-width` | `1px` | Contour thickness. |

## Limitations

- Decorative background: absolute inside a `position: relative` container.
- With `prefers-reduced-motion` the map is drawn once, static.
