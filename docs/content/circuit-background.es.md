---
title: CircuitBackground
description: Trazas de circuito con pulsos de luz que las recorren — en canvas.
---

## Características

- Layout de circuito determinístico (misma `seed` + tamaño + `density` ⇒ mismo circuito), estable SSR↔hidratación.
- Pulsos de luz que viajan por las trazas; `pulseCount` y `pulseSpeed` los controlan.
- Colores separados para trazas (`trackColor`) y pulsos (`pulseColor`).

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-circuit-track-color` | `#1e3a5f` | Color de trazas y pads. |
| `--aui-circuit-pulse-color` | `#22d3ee` | Color de los pulsos. |
| `--aui-circuit-pulse-speed` | `90` | Velocidad de los pulsos (px/s). |
| `--aui-circuit-line-width` | `2px` | Grosor de las trazas. |

## Limitaciones

- Fondo decorativo: absoluto dentro de un contenedor `position: relative`.
- Con `prefers-reduced-motion` las trazas se dibujan estáticas y los pulsos no animan.
