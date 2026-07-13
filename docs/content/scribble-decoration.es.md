---
title: ScribbleDecoration
description: Garabatos dibujados a mano (flecha, círculo, subrayado…) sobre texto.
---

## Características

- Dibuja un garabato hecho a mano: `arrow`, `asterisk`, `spiral`, `underline`, `circle`, o una función custom.
- Jitter determinístico por `seed`: mismo seed + forma + tamaño ⇒ mismo garabato.
- `trigger` in-view o mount; `repeat` para dibujar/desvanecer en loop.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-scribble-color` | `currentColor` | Color del trazo. |
| `--aui-scribble-stroke-width` | `3px` | Grosor. |
| `--aui-scribble-duration` | `0.9s` | Duración del dibujo. |
| `--aui-scribble-delay` | `0s` | Espera antes de dibujar. |

## Limitaciones

- Es decoración: se renderiza como `<span>` con un SVG superpuesto.
- Con `prefers-reduced-motion` el garabato se muestra completo y estático, sin dibujo ni loop.
