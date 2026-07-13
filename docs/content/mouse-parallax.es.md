---
title: MouseParallax
description: Capas que siguen el mouse con profundidades independientes.
---

## Características

- Capas (`MouseParallax.Layer`) que se desplazan según el mouse, cada una con su `depth`.
- `depth` positivo sigue al mouse; negativo se opone (profundidad invertida).
- `ease` suaviza el seguimiento.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-parallax-ease` | `0.2` | Suavizado del seguimiento. |
| `--aui-parallax-depth` | `20` | Offset máximo de capa (px). |

## Limitaciones

- Es un efecto de mouse: sin cursor (touch) las capas quedan en su lugar.
- Con `prefers-reduced-motion` las capas quedan estáticas (el efecto mueve contenido real).
