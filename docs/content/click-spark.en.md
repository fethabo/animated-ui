---
title: ClickSpark
description: The declarative variant: each click inside the container emits a short burst of radial sparks at the event point.
---

## Features

- Declarative: no ref or handle. You wrap your content and every `pointerdown` inside the container emits the burst at the exact event point.
- The canvas is a `pointer-events: none` overlay: buttons, links and inputs in the content stay interactive.
- Your `onPointerDown` (if provided) always runs — it composes with the effect's handler.
- Fast clicks produce concurrent bursts over the same canvas and RAF, which stops itself once no sparks remain — zero cost at rest.
- Configurable palette (`colors`): each spark picks its color at random.

## CSS Custom Properties

| Variable | Default | Description |
| --- | --- | --- |
| `--aui-clickspark-color-<i>` | color `i` from `colors` | Overrides color `i` of the default palette from cascading CSS. |

## Limitations

- With `prefers-reduced-motion` enabled clicks emit no sparks (non-essential decorative motion); the interactivity of the children stays intact.
