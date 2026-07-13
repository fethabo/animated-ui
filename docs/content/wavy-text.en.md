---
title: WavyText
description: Characters waving in a continuous loop: a wave travels across the text without breaking the line.
---

## Features

- A wave travels across the text from left to right in a continuous loop. Pure CSS (keyframes + per-index staggered `animation-delay`, set inline once), with no per-frame JS.
- Animates only `transform: translateY` (composited), so the surrounding line metrics don't change and normal text around it doesn't shift.
- Reuses the package's per-character split: the full text goes in `aria-label` and the characters are `aria-hidden`, with spaces preserved.
- Configurable `amplitude`, `speed` and `stagger`.
- Renders the element you pass via `as`, and accepts any valid HTML prop of that root.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-wavy-amplitude` | `6px` | Maximum vertical offset. Overrides `amplitude`. |
| `--aui-wavy-speed` | `1.6s` | Wave cycle duration. Overrides `speed`. |
| `--aui-wavy-stagger` | `0.06s` | Offset between characters. Overrides `stagger`. |

## Limitations

- Accepts plain text only (`children: string`): it splits per character and cannot wave markup.
- With `prefers-reduced-motion` enabled the text stays static on its baseline.
