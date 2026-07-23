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

## Hook mode: `useTilt`

The same effect as a behavior hook, applied to **your** element (a card from your design system, your own `div`) with no wrapper. The hook returns a callback ref; it works with any component that forwards `ref` to a DOM node, and restores the element to its original state on unmount. Perspective is applied inside the element's own `transform`.

```tsx
import { useTilt } from '@fethabo/animated-ui/tilt-card'

function MyCard() {
  const tiltRef = useTilt({ maxAngle: 10 })
  return <Card ref={tiltRef}>Tilts toward the mouse.</Card>
}
```

Options: `maxAngle` (default `15`), `perspective` (default `1000`), `respectReducedMotion` (default `true`). `glare` and the render prop are component-only.

## Limitations

- The tilt is a hover effect: on touch devices there is no interaction (the card renders flat).
- With `prefers-reduced-motion` enabled, `tiltX`/`tiltY` stay at `0` but `isHovering` keeps working.
- Hook mode has no `glare` (it needs an overlay child and a `preserve-3d` context) and no render prop.
