---
title: StickyScenes
description: Sequence of pinned scenes that transition with scroll.
---

## Features

- Scenes (`StickyScenes.Scene`) that pin and transition into each other as you scroll.
- Each scene exposes `--aui-scene-progress` (0–1) to interpolate transforms/colors via pure `calc()`.
- `sceneDuration` sets the scroll px per scene; total height is `100dvh + nScenes × sceneDuration`.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-scene-progress` | `0` | Active scene progress (0–1), injected by the component. |

## Limitations

- Manages its own scroll height (tall by design): use it as a full-page section, not inside a small container.
- Uses `position: sticky`: cannot live inside an ancestor with `overflow: hidden`.
- With `prefers-reduced-motion` it tracks scroll but without transitions (shows each scene directly).
