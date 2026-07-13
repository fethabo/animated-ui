---
title: StickyScenes
description: Secuencia de escenas fijas que transicionan con el scroll.
---

## Características

- Escenas (`StickyScenes.Scene`) que se fijan y transicionan una a la otra a medida que scrolleás.
- Cada escena expone `--aui-scene-progress` (0–1) para interpolar transforms/colores vía `calc()` puro.
- `sceneDuration` define los px de scroll por escena; la altura total es `100dvh + nEscenas × sceneDuration`.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-scene-progress` | `0` | Progreso de la escena activa (0–1), inyectado por el componente. |

## Limitaciones

- Maneja su propia altura de scroll (alta por diseño): va como sección de página completa, no dentro de un contenedor chico.
- Usa `position: sticky`: no puede vivir dentro de un ancestro con `overflow: hidden`.
- Con `prefers-reduced-motion` sigue el scroll pero sin transiciones (muestra cada escena directo).
