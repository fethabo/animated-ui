---
title: PixelBackground
description: Canvas pixel grid with combinable behaviors — hover, idle and reveal — in a single paint pass per frame.
---

## Features

- Pixel grid on `<canvas>`: a single paint pass per frame, no thousands of DOM nodes. The canvas auto-fits its container size.
- Freely combinable behaviors: `hover` lights up cells near the mouse with a gaussian falloff, `idle` makes them flicker autonomously and asynchronously, and `reveal` materializes them on mount with ordered dithering (Bayer matrix).
- Static color for all cells (`color`), or dynamic per-cell color via the `cellColor` callback, which receives the cell position and the `hover` and `idle` contributions.
- Grid configurable via `cellSize` and `gap`; resting base alpha via `baseOpacity`.
- Accepts any valid `<div>` HTML prop.

## The `cellColor` callback

```ts
type CellColorFn = (x: number, y: number, proximity: number, idlePhase: number) => string
```

| Parameter | Description |
| --- | --- |
| `x` | Cell column in the grid (integer, from 0). |
| `y` | Cell row in the grid (integer, from 0). |
| `proximity` | `hover` behavior contribution (0 to 1, 1 = under the cursor); `0` if not active. |
| `idlePhase` | `idle` behavior contribution (between `-idleIntensity` and `+idleIntensity`); `0` if not active. |

Returns any valid CSS color.

## CSS Custom Properties

Exposes no CSS custom properties: appearance is controlled via props (`color`, `cellColor`, `cellSize`, `gap`, `baseOpacity`).

## Limitations

- The `hover` behavior depends on the mouse: on touch devices it adds no lighting (`idle`/`reveal` remain, depending on which you enable).
- It is a decorative background: mount it inside a `position: relative` container and layer your content on top.
- With `prefers-reduced-motion`, `idle` and `reveal` are disabled; `hover` stays active because it responds to direct user input (unless you set `respectReducedMotion={false}`).
