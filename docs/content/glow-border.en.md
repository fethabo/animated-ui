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

## Limitations

- With `prefers-reduced-motion` the loop stops and the gradient stays static; `followCursor` stays active since it responds to direct input.
- The content background goes on the inner container (`contentStyle`/`contentClassName`): putting it on the root covers the ring.
