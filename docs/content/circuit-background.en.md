---
title: CircuitBackground
description: Circuit traces with light pulses traveling along them — on canvas.
---

## Features

- Deterministic circuit layout (same `seed` + size + `density` ⇒ same circuit), stable SSR↔hydration.
- Light pulses travel along the traces; `pulseCount` and `pulseSpeed` control them.
- Separate colors for traces (`trackColor`) and pulses (`pulseColor`).

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-circuit-track-color` | `#1e3a5f` | Traces and pads color. |
| `--aui-circuit-pulse-color` | `#22d3ee` | Pulse color. |
| `--aui-circuit-pulse-speed` | `90` | Pulse speed (px/s). |
| `--aui-circuit-line-width` | `2px` | Trace thickness. |

## Limitations

- Decorative background: absolute inside a `position: relative` container.
- With `prefers-reduced-motion` traces are drawn static and pulses do not animate.
