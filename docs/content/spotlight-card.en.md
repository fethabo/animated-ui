---
title: SpotlightCard
description: Container with a radial spotlight that follows the cursor and lights up the area under the mouse.
---

## Features

- Tracking writes CSS custom properties directly on the element (no React state): moving the mouse does not re-render the children.
- The overlay has `pointer-events: none`, so links and buttons in the content stay interactive.
- The spotlight stays active with `prefers-reduced-motion` because it responds to direct input and does not shift content.
- Accepts any valid `<div>` HTML prop (aria attributes, handlers, etc.).

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-spotlight-color` | `rgba(255, 255, 255, 0.15)` | Spotlight gradient color. |
| `--aui-spotlight-radius` | `250px` | Spotlight radius. |
| `--aui-spotlight-opacity` | `1` | Overlay opacity on hover. |

`--aui-spotlight-x` / `--aui-spotlight-y` are runtime variables written by the component; do not set them by hand.

## Hook mode: `useSpotlight`

The same effect on **your** element, with no wrapper: the hook returns a callback ref, injects the spotlight overlay as a child of the element (with `border-radius: inherit` and `pointer-events: none`) and removes it on unmount. Works with any component that forwards `ref` to a DOM node.

```tsx
import { useSpotlight } from '@fethabo/animated-ui/spotlight-card'

function MyCard() {
  const spotlightRef = useSpotlight({ radius: 300 })
  return <Card ref={spotlightRef}>The light follows the cursor.</Card>
}
```

Options: `color`, `radius` (default `250`), `opacity` (default `1`), `respectReducedMotion` (accepted for consistency; the spotlight stays active either way).

## Limitations

- The spotlight is a hover effect: on touch devices there is no interaction.
- `respectReducedMotion` is accepted for API consistency, but the spotlight stays active in both cases (it is direct input, with no content movement).
