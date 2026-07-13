---
title: MatrixRain
description: Lluvia de glifos estilo Matrix con cabezas brillantes — en canvas.
---

## Características

- Columnas de glifos que caen, con la cabeza de cada columna resaltada (`headColor`).
- Determinístico: la misma `seed` + dimensiones producen el mismo layout y secuencia.
- El componente pinta su propio fondo (necesario para el overlay de fade de la estela).
- `charset` configurable; `fontSize` define la grilla (más grande = menos columnas, palanca de performance).

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-matrix-color` | `#22c55e` | Color de la estela. |
| `--aui-matrix-head-color` | `#d9ffe3` | Color de la cabeza de columna. |
| `--aui-matrix-background` | `#040905` | Color de fondo. |

## Limitaciones

- Fondo decorativo: por defecto absoluto dentro de un contenedor `position: relative`.
- Con `prefers-reduced-motion` se pinta un frame estático de columnas, sin RAF.
