---
title: ParticleField
description: Interactive particle field with drift modes and links.
---

## Features

- Particles react to the cursor (`repel`/`attract`/`none`) within a radius.
- Five drift modes: `bounce`, `snow`, `embers`, `bubbles`, `warp`.
- Opt-in constellation effect (`links`): connects nearby particles with lines (introduces an O(N²) computation; without `links` the cost stays O(N)).

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-particle-radius` | `2px` | Radius of each particle. |
| `--aui-particle-color` | `#7c3aed` | Particle color. |
| `--aui-particle-link-distance` | `120px` | Max connection distance. |
| `--aui-particle-link-color` | `derived` | Line color. |

## Limitations

- Decorative background/overlay: absolute inside a `position: relative` container (transparent background).
- `links` enables an O(N²) computation: heavy with many particles.
- With `prefers-reduced-motion` the RAF stops and the canvas shows static particles.
