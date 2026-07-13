---
title: DrawPath
description: Anima el trazado (line-drawing) de los SVG que envuelve.
---

## Características

- Mide los elementos con trazo del SVG hijo y les aplica la animación de dibujo, respetando `stroke`/`stroke-width` existentes.
- No reestructura el SVG del consumer; elementos con `data-aui-no-draw` quedan visibles sin animar.
- `stagger` escalona los trazos en orden de documento; `trigger` in-view o mount.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-draw-duration` | `1.2s` | Duración de cada trazo. |
| `--aui-draw-stagger` | `0.15s` | Delay incremental entre trazos. |
| `--aui-draw-delay` | `0s` | Espera antes del primer trazo. |

## Limitaciones

- Opera sobre elementos con `stroke` (paths, líneas, etc.): rellenos no se animan.
- Con `prefers-reduced-motion` el SVG se muestra dibujado completo al instante.
