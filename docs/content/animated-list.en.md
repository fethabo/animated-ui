---
title: AnimatedList
description: List that animates entrance, exit and reordering (FLIP) of its items.
---

## Features

- New keys animate their entrance, removed keys their exit (clone), and persistent keys their reordering (FLIP).
- Entrance presets (`fade`/`scale-in`/`slide`/`none`) and exit (`fade`/`scale-out`/`none`).
- Works with flex and grid layouts (2D FLIP); `stagger` staggers simultaneous entrances.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-animated-list-easing` | `ease` | Animation easing. |

## Limitations

- Each child needs a stable React `key` (as in any list).
- With `prefers-reduced-motion` changes apply immediately: no FLIP, no enters/exits, no clones.
