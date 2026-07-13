---
title: Marquee
description: Seamless infinite ribbon, horizontal or vertical.
---

## Features

- Continuous seamless scroll in 4 directions (`left`/`right`/`up`/`down`).
- `pauseOnHover` pauses on hover; `fadeEdges` fades the edges with a mask.
- Opt-in `scrollVelocity` mode: speed and a subtle skew respond to the page scroll velocity.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-marquee-gap` | `24px` | Gap between items and repetitions. |

## Limitations

- Duplicates content for the seamless loop: heavy content mounts several times.
- With `prefers-reduced-motion` the content stays static in a single pass, no duplicates.
