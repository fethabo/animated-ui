---
title: HorizontalScrollSection
description: Paneles que se recorren horizontalmente al scrollear vertical.
---

## Características

- Convierte el scroll vertical en recorrido horizontal de sus paneles hijos (sticky track).
- `speed` multiplica el recorrido vertical necesario; `easing` mapea el progreso.
- Expone `--aui-hscroll-progress` (0–1) para efectos ligados.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-hscroll-progress` | `0` | Progreso del recorrido horizontal (0–1). |

## Limitaciones

- Define su propia altura de recorrido (alta): va como sección de página completa.
- Usa `position: sticky`: no puede vivir dentro de un ancestro con `overflow: hidden`.
- Con `prefers-reduced-motion` los paneles se apilan verticalmente como secciones normales.
