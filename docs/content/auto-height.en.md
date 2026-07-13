---
title: AutoHeight
description: Smoothly transitions height (and optionally width) on content change.
---

## Features

- When its content changes size, the height transitions instead of jumping.
- On finishing it returns to `height: auto`: follows the normal layout flow (responsive), with no residual fixed height.
- `width` also animates the width; interrupting mid-transition chains without jumps.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-autoheight-easing` | `ease` | Transition easing. |

## Limitations

- Measures content with ResizeObserver: content with unsized images may measure late.
- With `prefers-reduced-motion` the container adjusts immediately keeping `height: auto`.
