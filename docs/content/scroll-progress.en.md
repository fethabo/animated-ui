---
title: ScrollProgress
description: Fixed bar reflecting the page scroll progress.
---

## Features

- Fixed bar (top/bottom of the viewport) mirroring 1:1 the page scroll progress.
- Configurable color, thickness, track and z-index.
- Zero JS per frame beyond the passive scroll listener.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-progress-color` | `#7c3aed` | Bar color. |
| `--aui-progress-height` | `3px` | Thickness. |
| `--aui-progress-bg` | `transparent` | Track color. |
| `--aui-progress-z` | `50` | z-index of the fixed element. |

## Limitations

- It is a global `position: fixed` element: reflects the window scroll, not a container.
- Stays active with `prefers-reduced-motion` (mirrors the scroll the user controls directly, like the native scrollbar).
