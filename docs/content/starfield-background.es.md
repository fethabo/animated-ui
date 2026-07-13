---
title: StarfieldBackground
description: Campo de estrellas con parpadeo y estrellas fugaces — en canvas.
---

## Características

- Cielo determinístico: la misma `seed` + dimensiones producen el mismo campo (sin `Math.random`).
- Estrellas fugaces con frecuencia configurable (`shootingStars` por minuto; `0` las desactiva).
- Modo `fixed` para cubrir todo el viewport (`position: fixed`).

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-starfield-color-<i>` | `paleta` | Color `i` de la paleta de estrellas. |
| `--aui-starfield-background` | `#050514` | Color base del cielo. |

## Limitaciones

- Fondo decorativo: por defecto absoluto dentro de un contenedor `position: relative`.
- Con `prefers-reduced-motion` se pinta el campo estático, sin parpadeo ni fugaces.
