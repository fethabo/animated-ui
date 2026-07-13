---
title: TiltCard
description: Card with a mouse-following 3D tilt effect and real momentum via the Web Animations API.
---

## Features

- Animated with the native Web Animations API (`element.animate()`): interpolation between states preserves momentum on direction changes, without the "snap" of CSS transitions.
- Optional specular glare overlay (`glare`) that moves inversely to the tilt.
- Exposes its state via render prop — `{ tiltX, tiltY, isHovering }` — to build derived effects (inner parallax, color shifts).
- Accepts any valid `<div>` HTML prop (aria attributes, handlers, etc.).

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-tilt-perspective` | `1000px` | 3D perspective depth; overrides the `perspective` prop. |

## Limitations

- The tilt is a hover effect: on touch devices there is no interaction (the card renders flat).
- With `prefers-reduced-motion` enabled, `tiltX`/`tiltY` stay at `0` but `isHovering` keeps working.
