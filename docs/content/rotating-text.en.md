---
title: RotatingText
description: Base text + a word that cycles through a list, with a stable-width layout.
---

## Features

- Optional base text (`children`) plus a word that cycles through a list with an animated transition. Advancing uses timers (no RAF) and the transition is injected CSS.
- The word container's width transitions smoothly between words of different lengths (measured on change, not per frame).
- Three transition presets: `slide-up`, `fade`, `flip`.
- Accessible without spam: the root exposes a static `aria-label` with the base text + the full list, and the animated word is `aria-hidden` (no `aria-live`).
- Accepts any valid `<span>` HTML prop.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-rotating-color` | inherits | Color of the rotating word. Overrides `color`. |
| `--aui-rotating-duration` | `0.4s` | Transition duration. |

## Limitations

- To remove even the width adjustment, set a `width` via CSS on `.aui-rotating-box`.
- With `prefers-reduced-motion` enabled it shows the first word statically.
