---
title: MouseParallax
description: Layers following the mouse with independent depths.
---

## Features

- Layers (`MouseParallax.Layer`) that shift with the mouse, each with its `depth`.
- Positive `depth` follows the mouse; negative opposes it (inverted depth).
- `ease` smooths the tracking.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-parallax-ease` | `0.2` | Tracking smoothing. |
| `--aui-parallax-depth` | `20` | Max layer offset (px). |

## Limitations

- It is a mouse effect: without a cursor (touch) the layers stay put.
- With `prefers-reduced-motion` the layers stay static (the effect moves real content).
