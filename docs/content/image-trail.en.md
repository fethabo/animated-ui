---
title: ImageTrail
description: Ephemeral images that sprout following the pointer and fade away (agency/portfolio effect).
---

## Features

- The `images` pool rotates in cyclic order: once the array is exhausted, selection restarts from the first one.
- Emission is throttled by travelled distance (`emitEvery` px), with a cap on live nodes (`maxConcurrent`).
- Each image is an ephemeral `<img>` node that removes itself from the DOM when its animation ends — no React state per image.
- URLs are preloaded after mount to avoid decode jank on the first emission.
- The layer is `pointer-events: none`: children stay interactive. Scoped to its container.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-image-trail-size` | `120px` | Maximum image width. Overrides the `size` prop. |
| `--aui-image-trail-duration` | `900ms` | Lifetime of each image. Overrides the `duration` prop. |

## Limitations

- With `prefers-reduced-motion` the effect is a no-op (no emission), and children stay intact.
- On touch devices it degrades to a no-op: there is no persistent pointer.
- Even with preloading, prefer lightweight images: many heavy images emitted quickly can cause jank.
