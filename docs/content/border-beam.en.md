---
title: BorderBeam
description: Light comet that travels the container's border perimeter in a continuous loop.
---

## Features

- Almost pure CSS (`offset-path: border-box` + animated `offset-distance`), no per-frame JS: a bright head with a gradient tail travels the border in a loop.
- Follows the `border-radius` you give the component, including rounded corners.
- The comet layer is `pointer-events: none`: clicks pass through to the content.
- `delay` (negative starts "already advanced") lets you desynchronize multiple instances.
- Accepts any valid `<div>` HTML prop (put the `border-radius` here).

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-beam-color-from` | `#7c3aed` | Head color. Takes precedence over `colorFrom`. |
| `--aui-beam-color-to` | `#0ea5e9` | Tail color. |
| `--aui-beam-size` | `96px` | Comet length. |
| `--aui-beam-duration` | `6s` | Seconds per lap. |
| `--aui-beam-delay` | `0s` | Initial offset. |
| `--aui-beam-border-width` | `2px` | Stroke width. |

## Limitations

- In browsers without `offset-path: border-box` the comet is hidden with no side effects (`@supports`).
- With `prefers-reduced-motion` it shows a subtle static border highlight, with no motion.
