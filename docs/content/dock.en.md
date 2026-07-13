---
title: Dock
description: macOS-style bar: items magnify by cursor proximity.
---

## Features

- Items (`Dock.Item`) grow by cursor proximity, like the macOS Dock.
- Horizontal or vertical (`orientation`); `magnification` and `radius` control the effect.
- Items stay interactive (clickable buttons, links).

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-dock-gap` | `8px` | Gap between items. |
| `--aui-dock-return` | `0.25s` | Duration of the return to base scale. |

## Limitations

- It is a mouse effect: on touch the row stays static (items still work).
- With `prefers-reduced-motion` the row stays static.
