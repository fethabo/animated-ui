---
title: CursorTrail
description: Estela de partículas o línea fluida que sigue al puntero dentro de su contenedor, sobre un canvas overlay.
---

## Características

- Estela dibujada sobre un canvas overlay con `pointer-events: none`: los children siguen siendo interactivos (los clicks atraviesan la estela).
- Dos modos: `particles` (partículas con vida, fade y deriva leve) y `line` (línea fluida por los últimos puntos, con grosor y alpha decrecientes hacia la cola).
- Emisión throttleada por distancia recorrida (`emitEvery` px): con el puntero quieto no emite. El RAF corre solo mientras hay estela viva — costo cero en reposo.
- Paleta multicolor opcional (`colors`): cada partícula sortea su color (solo en `mode="particles"`; en `line` se usa el primero).
- Scoped a su contenedor: no hay efectos a nivel documento.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-cursor-trail-color` | `#7c3aed` | Color de la estela. Prevalece sobre la prop `color`. |
| `--aui-cursor-trail-size` | `8px` | Tamaño base de la estela. Prevalece sobre la prop `size`. |

## Limitaciones

- Con `prefers-reduced-motion` activo el efecto se desactiva por completo (sin dibujo ni RAF): la estela es decoración de movimiento, no feedback funcional.
- En dispositivos táctiles degrada a no-op: no hay un puntero persistente que seguir.
