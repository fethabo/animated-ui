---
title: ScrollReveal
description: Reveals its children on entering the viewport, with direction and stagger.
---

## Features

- Animates the entrance (fade + directional shift) on entering the viewport, via IntersectionObserver.
- `stagger` staggers the entrance of direct children.
- With `once={false}` it re-hides on leaving and re-reveals on re-entry.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-reveal-distance` | `24px` | Initial offset. |
| `--aui-reveal-duration` | `0.6s` | Transition duration. |
| `--aui-reveal-stagger` | `0.1s` | Incremental delay between children. |

## Limitations

- SSR-safe: the content exists in the DOM (accessible/SEO); only its appearance animates.
- With `prefers-reduced-motion` the content is shown directly in its final position.
