---
title: ShinyText
description: Text with a shine stripe sweeping it in a loop — pure CSS, zero JS per frame.
---

## Features

- Pure CSS: the gradient is clipped to the glyphs with `background-clip: text` and moved by animating `background-position` — zero JS per frame.
- With custom base and highlight colors it also works as animated gradient text.
- The text remains real text: selectable, copyable and readable by screen readers.
- Renders a `<span>`; you provide the heading or paragraph wrapping it.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-shiny-color` | `#71717a` | Base text color. |
| `--aui-shiny-highlight` | `#fafafa` | Shine stripe color. |
| `--aui-shiny-speed` | `3s` | Duration of one sweep of the loop. |
| `--aui-shiny-angle` | `120deg` | Gradient/sweep direction. |

## Limitations

- Relies on `background-clip: text` (supported in all modern browsers).
- With `prefers-reduced-motion` the sweep stops and the static gradient remains.
