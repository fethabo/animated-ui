---
title: ParallaxLayers
description: Capas ligadas al scroll con profundidades independientes.
---

## Características

- Capas (`ParallaxLayers.Layer`) que se desplazan según el progreso de scroll, cada una con su `depth`.
- `depth` positivo acompaña el scroll (más lento: sensación de fondo); negativo va en contra.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-parallax-scroll-depth` | `40` | Offset máximo de capa (px). |

## Limitaciones

- Ligado al scroll de la ventana (usa el scroll-driver del paquete).
- Con `prefers-reduced-motion` las capas quedan en su posición de layout (el movimiento relativo en scroll es de lo más sensible para usuarios con sensibilidad vestibular).
