---
title: ScrambleText
description: Text that "decrypts" character by character (decrypt/Matrix effect), with an accessible reveal.
---

## Features

- A `requestAnimationFrame` loop mutates the text directly via ref, with no React re-renders per frame; timestamp-based progression guarantees the same duration on 60 and 144 Hz displays.
- Accessible during the animation: the root exposes `aria-label` with the final text and the intermediate random characters are hidden from screen readers.
- Three trigger modes (`trigger`): `'mount'` (on mount and when `text` changes), `'hover'` (re-animates on each `mouseenter`), and `'both'`.
- Configurable `charset` and `scrambleColor`.
- Accepts any valid `<span>` HTML prop.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-scramble-color` | `currentColor` | Color of the characters while the scramble lasts; once finished, the text inherits its color again. |

## Limitations

- `text` is a plain string (not `children`): it operates character by character and cannot scramble elements or markup.
- With proportional fonts the random characters measure differently from the final ones and the width may "jitter" during the scramble. For layout-sensitive text use a monospace font or `font-variant-numeric: tabular-nums`.
- With `prefers-reduced-motion` enabled it shows the final text directly; the `hover` trigger keeps working (it responds to direct user input).
