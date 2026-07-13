---
title: ImageDissolve
description: Dithered transition between images on `src` change — on canvas.
---

## Features

- On `src` change, transitions between the previous and the new image with a dithered dissolve.
- `duration` controls the transition in ms.
- Requires `alt` for accessibility.

## Limitations

- Works on loaded images: the dissolve happens on `src` change.
- With `prefers-reduced-motion` the `src` swaps instantly without animating the canvas.
