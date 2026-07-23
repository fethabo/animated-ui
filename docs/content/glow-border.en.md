---
title: GlowBorder
description: Container with an animated conic-gradient border ring, running as an autonomous loop or pointing at the cursor.
---

## Features

- By default the gradient rotates in a loop; with `followCursor` it points toward the cursor with momentum (the same WAAPI pattern as TiltCard).
- The animation rotates a layer with `transform` (runs on the compositor, universal browser support) instead of animating the gradient angle with `@property`.
- The gradient covers the whole wrapper background and the content masks it with its own background, leaving only the perimeter ring visible. Pass your content background via `contentStyle`/`contentClassName` — putting it on the root via `className` will cover the ring.
- Accepts any valid `<div>` HTML prop.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-glow-color-1` | `#7c3aed` | First conic color (violet). |
| `--aui-glow-color-2` | `#0ea5e9` | Second color (cyan). |
| `--aui-glow-color-3` | `#ec4899` | Third color (pink). |
| `--aui-glow-speed` | `4s` | Duration of one loop rotation. |
| `--aui-glow-width` | `1px` | Border ring width. |
| `--aui-glow-radius` | `12px` | Outer border-radius. |
| `--aui-glow-opacity` | `1` | Glow intensity. |

## Hook mode: `useGlowBorder`

The same ring on **your** element: the hook returns a callback ref, injects the conic layer as a child of the host and applies the `aui-glow` class (perimeter padding = glow width, `overflow: hidden`, `isolation`), restoring everything on unmount.

**Host contract:** its `padding` becomes the ring width, and the content must provide its own background (and a matching border-radius) to cover the gradient's center — the role the inner wrapper plays in the component. If your element cannot give up its padding, use the component.

```tsx
import { useGlowBorder } from '@fethabo/animated-ui/glow-border'

function MyCard() {
  const glowRef = useGlowBorder({ width: 2, radius: 16 })
  return (
    <div ref={glowRef}>
      <div style={{ background: '#12121f', borderRadius: 14, padding: '2rem' }}>My content</div>
    </div>
  )
}
```

Options: `colors`, `speed` (default `4`), `width` (default `1`), `radius` (default `12`), `opacity` (default `1`), `followCursor` (default `false`), `respectReducedMotion` (default `true`).

## Limitations

- With `prefers-reduced-motion` the loop stops and the gradient stays static; `followCursor` stays active since it responds to direct input.
- The content background goes on the inner container (`contentStyle`/`contentClassName`): putting it on the root covers the ring.
- Hook mode has no `contentClassName`/`contentStyle` (the consumer's content plays that role), and the hook drives the host's `padding`/`overflow`/`isolation` while attached.
