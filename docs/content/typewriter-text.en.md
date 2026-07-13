---
title: TypewriterText
description: Reveals text character by character (typewriter effect), with a multi-string loop mode.
---

## Features

- Same engine as `ScrambleText`: a `requestAnimationFrame` loop mutates the text via ref (no re-renders per frame), with timestamp-based progression — the same speed on 60 and 144 Hz displays.
- Passing a `string[]` with `loop`, it cycles typing → pausing → deleting → next.
- Optional cursor that blinks via a CSS animation (no per-frame JS); `true` uses `|`, a string uses that glyph, `false` disables it.
- Accessible: the root exposes `aria-label` with the full text and the intermediate characters are hidden from screen readers.
- Accepts any valid `<span>` HTML prop.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-typewriter-cursor-speed` | `1s` | Cursor blink speed (CSS only). |

## Limitations

- `text` is plain text (not `children`): the engine operates character by character.
- The cursor is an inline element; with proportional fonts the text may "jump" while typing. For layout-sensitive text use monospace.
- With `prefers-reduced-motion` enabled it shows the full final text immediately, with no typing or cursor blink.
