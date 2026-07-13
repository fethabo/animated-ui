---
title: ParallaxLayers
description: Scroll-linked layers with independent depths.
---

## Features

- Layers (`ParallaxLayers.Layer`) that shift with scroll progress, each with its `depth`.
- Positive `depth` moves with the scroll (slower: background feel); negative against it.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-parallax-scroll-depth` | `40` | Max layer offset (px). |

## Limitations

- Linked to the window scroll (uses the package scroll-driver).
- With `prefers-reduced-motion` the layers stay at their layout position (relative scroll motion is the most sensitive kind for vestibular users).
