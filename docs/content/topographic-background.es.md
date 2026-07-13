---
title: TopographicBackground
description: Curvas de nivel de un terreno por ruido que se deforma lento — en canvas.
---

## Características

- Líneas de contorno (curvas de nivel) de un campo de ruido que evoluciona gradualmente.
- Determinístico: la misma `seed` + dimensiones producen el mismo mapa (sin `Math.random`), SSR-safe.
- `speed={0}` deja el terreno fijo y no corre RAF.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-topo-color` | `#38bdf8` | Color de las curvas. |
| `--aui-topo-line-width` | `1px` | Grosor de las curvas. |

## Limitaciones

- Fondo decorativo: absoluto dentro de un contenedor `position: relative`.
- Con `prefers-reduced-motion` el mapa se dibuja una vez, estático.
