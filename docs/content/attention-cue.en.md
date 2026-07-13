---
title: AttentionCue
description: Light cue that appears after idle and points to an element.
---

## Features

- After `idleDelay` ms without pointer movement, draws a light stroke (or footprints) toward a `target`.
- Directed mode (with `target`) or ambient (without it).
- `marker` chooses between light beam (`beam`) or footprints; `head` sets the tip.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-cue-color` | `#fbbf24` | Stroke color. |
| `--aui-cue-duration` | `700` | Draw duration (ms). |
| `--aui-cue-speed` | `420` | Stroke speed (px/s). |
| `--aui-cue-max-distance` | `220` | Max distance from the pointer. |

## Limitations

- The overlay does not intercept clicks of the content it wraps.
- With `prefers-reduced-motion` the cue (autonomous timer-driven effect) is NOT drawn.
