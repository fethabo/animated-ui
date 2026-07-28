---
title: GlitchText
description: Text with an intermittent RGB-split glitch in pure CSS, designed for headings.
---

## Features

- Intermittent RGB-split glitch (short bursts separated by stable periods) in pure CSS, with no per-frame JS: two layers of the same text in pseudo-elements (`content: attr(data-text)`) offset in opposite directions and clipped with an animated `clip-path`.
- The pseudo-elements stay out of the accessibility tree, so the text is read only once.
- Two trigger modes (`trigger`): `'loop'` (autonomous, intermittent) and `'hover'` (only while the cursor is over it).
- Configurable `intensity`, `frequency`, `burstDuration` and `colors`.
- Renders the element you pass via `as`, and accepts any valid HTML prop of that root.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-glitch-color-1` | `#ff004d` | Channel offset to the left. Overrides `colors[0]`. |
| `--aui-glitch-color-2` | `#00fff9` | Channel offset to the right. Overrides `colors[1]`. |
| `--aui-glitch-intensity` | `3px` | Channel offset. Overrides `intensity`. |
| `--aui-glitch-cycle` | `3s` | Duration of the full burst cycle. |

## CSS Class Mode (Zero-JS)

This component can be consumed without React, by directly applying its native CSS classes.

```html
<link rel="stylesheet" href="node_modules/@fethabo/animated-ui/dist/css/glitch-text.css" />

<h1 class="aui-glitch aui-loop" data-text="Pure CSS Glitch">Pure CSS Glitch</h1>
```

Or registering the CSS dynamically from JS:

```javascript
import { registerGlitchText } from '@fethabo/animated-ui'
// Injects the CSS into the <head> (idempotent)
registerGlitchText()
```

**Note on `data-text`:** In CSS mode, duplicating the text in the `data-text` attribute is mandatory for the pseudo-elements to work (the React component does this automatically).
Trigger variants are controlled with the `aui-loop` (intermittent) or `aui-hover` (on mouse over) modifiers.

**Accessibility (Opt-out):** The native CSS mode applies `prefers-reduced-motion` to stop the animation automatically. You can force its execution by adding `data-aui-motion` to the HTML element: `<h1 class="aui-glitch aui-loop" data-text="..." data-aui-motion>...</h1>`.

## Limitations

- Accepts plain text only (`children: string`): the layers are duplicated via `content: attr(data-text)`, which does not support markup.
- Designed for headings — the animated `clip-path` over long paragraphs has a paint cost.
- With `prefers-reduced-motion` enabled, `loop` stays static; `hover` keeps a dimmed static split, with no jitter.
