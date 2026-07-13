---
title: SparkleBurst
description: One-shot burst of sparkles (stars) via ref.
---

## Features

- Imperative API: `ref.current?.fire(options?)` fires a burst of stars.
- `options` override the props for that shot only; shots accumulate on the same canvas.
- Configurable scatter (`spread`), size (`size`) and palette.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-sparkle-color-<i>` | `golds + white` | Default palette color `i`. |

## Limitations

- `fire()` is a no-op before hydration.
- With `prefers-reduced-motion` enabled (default), `fire()` is a no-op: the sparkle is autonomous celebration with no useful static version.
