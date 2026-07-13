---
title: TextScrollReveal
description: Text lighting up word by word as it travels the viewport.
---

## Features

- Words go from dimmed to lit as the container travels through the viewport.
- Optional start/end colors (`fromColor`/`toColor`); without them it uses `currentColor`.
- `offset` sets the travel span in which the light-up happens.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-text-scroll-from-opacity` | `0.15` | Dimmed words opacity. |
| `--aui-text-scroll-to-opacity` | `1` | Lit words opacity. |
| `--aui-text-scroll-from-color` | `—` | Dimmed words color. |
| `--aui-text-scroll-to-color` | `—` | Lit words color. |

## Limitations

- Linked to the window scroll; plain text (split by word).
- With `prefers-reduced-motion` the text is shown fully lit, static.
