---
title: StarfieldBackground
description: Star field with twinkle and shooting stars — on canvas.
---

## Features

- Deterministic sky: the same `seed` + dimensions produce the same field (no `Math.random`).
- Shooting stars with configurable frequency (`shootingStars` per minute; `0` disables them).
- `fixed` mode to cover the full viewport (`position: fixed`).

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-starfield-color-<i>` | `palette` | Star palette color `i`. |
| `--aui-starfield-background` | `#050514` | Base sky color. |

## Limitations

- Decorative background: absolute inside a `position: relative` container by default.
- With `prefers-reduced-motion` the static field is painted, no twinkle or shooting stars.
