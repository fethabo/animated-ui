---
title: RippleContainer
description: Container that draws an expanding ripple from the exact point of each click (material ripple).
---

## Features

- Each ripple is an ephemeral node created imperatively on `pointerdown` (the ripple starts on press, not release) and removed from the DOM when its animation ends — no React state per ripple: rapid clicks spawn concurrent ripples with no re-renders or node buildup.
- Ripples live in a `pointer-events: none` layer clipped to the container (inheriting its `border-radius`), so they never intercept clicks or focus from the children.
- Coexists with your own handlers: a consumer `onPointerDown`/`onClick` keeps working alongside the ripple.
- Accepts any valid `<div>` HTML prop.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-ripple-color` | `currentColor` | Ripple color. Takes precedence over `color`. |
| `--aui-ripple-duration` | `600ms` | Duration of each ripple. Takes precedence over `duration`. |
| `--aui-ripple-opacity` | `0.25` | Initial ripple opacity. Takes precedence over `opacity`. |

## Limitations

- With `prefers-reduced-motion`, the expansion is replaced by a brief static fade at the click point: interaction feedback is preserved, not the motion.
