---
title: TextHighlighter
description: A hand-drawn marker over inline text: underline, highlight, circle, strike or box with a procedural stroke.
---

## Features

- Marks inline text with a procedural stroke that "draws" itself when triggered (line-drawing via `stroke-dashoffset`, zero JS per frame): underline, highlight, circle, strike or box.
- Six shapes: `underline`, `wavy-underline`, `circle`, `highlight`, `strike`, `box`.
- The path is generated with seedable jitter for the measured text size (same `seed` ⇒ same wobble) and regenerated when the size changes.
- The text stays intact: real, selectable and readable by screen readers — the SVG is an absolute `aria-hidden` overlay with no events.
- Three triggers (`trigger`): `'in-view'`, `'mount'` and `'hover'`, with optional re-drawing (`once={false}`).
- Accepts any valid `<span>` HTML prop.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-highlighter-color` | `currentColor` | Stroke color. Overrides `color`. |
| `--aui-highlighter-stroke-width` | `3` (`highlight`: `1em`) | Stroke width. Overrides `strokeWidth`. |
| `--aui-highlighter-duration` | `0.9s` | Drawing duration. Overrides `duration`. |
| `--aui-highlighter-delay` | `0s` | Delay before drawing. Overrides `delay`. |
| `--aui-highlighter-easing` | `cubic-bezier(0.45, 0, 0.35, 1)` | Drawing curve. |
| `--aui-highlighter-opacity` | `0.45` | Opacity of the `highlight` band. |

## Limitations

- The shape is drawn over the span's full bounding box; on text that wraps across several lines it can look rough — best applied to short words or phrases.
- On SSR only the text is served; the overlay appears after hydration.
- With `prefers-reduced-motion` enabled the shape appears fully drawn immediately when triggered, without animation.
