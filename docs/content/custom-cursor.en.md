---
title: CustomCursor
description: A custom cursor (dot + elastically lagging ring) scoped to its container, with no portals or document-level effects.
---

## Features

- A dot that follows the pointer instantly plus a ring that chases it with elastic lag, **inside its container**.
- Positioning via CSS vars written on `pointermove` (`--aui-cursor-x/y`): zero re-renders per frame. The lag is a CSS transition, with no RAF of its own.
- The ring grows over interactive elements, detected by delegation (`a`, `button`, `[role="button"]` and any element marked with `data-aui-cursor`).
- Exposes state as `data-aui-cursor-state="idle" | "hover" | "down"` on the root, for custom styling.
- With `hideNativeCursor` (default) the native cursor is hidden only inside the container and its descendants.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-cursor-dot-size` | `8px` | Dot diameter. Overrides the `dotSize` prop. |
| `--aui-cursor-ring-size` | `36px` | Ring diameter. Overrides the `ringSize` prop. |
| `--aui-cursor-color` | `#7c3aed` | Dot and ring color. Overrides the `color` prop. |
| `--aui-cursor-lag` | `0.15s` | Ring lag duration. Overrides the `lag` prop. |
| `--aui-cursor-hover-scale` | `1.5` | Ring scale on hover. Overrides the `hoverScale` prop. |

## Limitations

- On devices without `(hover: hover) and (pointer: fine)` (touch, coarse pointers) it mounts no custom nodes and leaves the native cursor untouched — children stay intact.
- With `prefers-reduced-motion` tracking is direct, with no elastic lag or transitions.
- Since `hideNativeCursor` hides the native cursor across the whole container, text inputs lose it too: avoid wrapping full forms.
