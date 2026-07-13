---
title: Marquee
description: Cinta infinita sin costura, horizontal o vertical.
---

## Características

- Desplazamiento continuo sin costura en 4 direcciones (`left`/`right`/`up`/`down`).
- `pauseOnHover` pausa al pasar el cursor; `fadeEdges` difumina los bordes con máscara.
- Modo opt-in `scrollVelocity`: la velocidad y un skew responden a la velocidad de scroll de la página.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-marquee-gap` | `24px` | Espacio entre ítems y repeticiones. |

## Limitaciones

- Duplica el contenido para el loop sin costura: contenido muy pesado se monta varias veces.
- Con `prefers-reduced-motion` el contenido queda estático en una sola pasada, sin duplicados.
