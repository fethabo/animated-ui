---
title: GuidingBranches
description: Branches growing from the pointer after idle.
---

## Features

- After `idleDelay` ms without pointer movement, branches grow (roots, lightning or circuit) from its position.
- Ambient mode (no `target`): branches 360° around the pointer; with `target` the dominant branch biases toward it.
- `aesthetic`, `density`, `depth` and `curl` shape the stroke.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-branches-color` | `#34d399` | Branch color. |
| `--aui-branches-speed` | `320` | Growth speed (px/s). |
| `--aui-branches-max-distance` | `260` | Max distance from the pointer. |
| `--aui-branches-curl` | `0.6` | Stroke curvature. |

## Limitations

- The overlay does not intercept clicks of the content it wraps.
- With `prefers-reduced-motion` the branches (autonomous timer-driven effect) are NOT drawn.
