---
title: StackedCards
description: Cards que se apilan y encogen a medida que scrolleás.
---

## Características

- Cada hijo se fija (sticky) y se encoge/oscurece según su profundidad en la pila al avanzar el scroll.
- `scaleStep` y `opacityStep` controlan el encogido y oscurecido por nivel.
- `cardTravel` define los px de scroll por card.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-stack-offset` | `0` | Px desde el top donde se fija la pila. |
| `--aui-stack-scale-step` | `0.05` | Encogido por nivel. |
| `--aui-stack-opacity-step` | `0` | Oscurecido por nivel. |
| `--aui-stack-travel` | `400px` | Px de scroll por card. |

## Limitaciones

- Usa `position: sticky`: no puede vivir dentro de un ancestro con `overflow: hidden`.
- Con `prefers-reduced-motion` las cards quedan en un layout sticky estático y legible, sin los transforms ligados al scroll.
