---
title: TextHighlighter
description: Marcador a mano alzada sobre texto inline: subraya, resalta, encierra, tacha o recuadra con un trazo procedural.
---

## Características

- Marca texto inline con un trazo procedural que se "dibuja" al dispararse (line-drawing por `stroke-dashoffset`, cero JS por frame): subraya, resalta, encierra, tacha o recuadra.
- Seis shapes: `underline`, `wavy-underline`, `circle`, `highlight`, `strike`, `box`.
- El path se genera con jitter seedable para el tamaño medido del texto (misma `seed` ⇒ mismo temblor) y se regenera al cambiar el tamaño.
- El texto queda intacto: real, seleccionable y legible por lectores de pantalla — el SVG es un overlay absoluto `aria-hidden` sin eventos.
- Tres disparadores (`trigger`): `'in-view'`, `'mount'` y `'hover'`, con re-dibujo opcional (`once={false}`).
- Acepta cualquier prop HTML válida de `<span>`.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-highlighter-color` | `currentColor` | Color del trazo. Prevalece sobre `color`. |
| `--aui-highlighter-stroke-width` | `3` (`highlight`: `1em`) | Grosor del trazo. Prevalece sobre `strokeWidth`. |
| `--aui-highlighter-duration` | `0.9s` | Duración del dibujo. Prevalece sobre `duration`. |
| `--aui-highlighter-delay` | `0s` | Delay previo al dibujo. Prevalece sobre `delay`. |
| `--aui-highlighter-easing` | `cubic-bezier(0.45, 0, 0.35, 1)` | Curva del dibujo. |
| `--aui-highlighter-opacity` | `0.45` | Opacidad de la franja `highlight`. |

## Limitaciones

- El shape se dibuja sobre el bounding box completo del span; en texto que wrappea en varias líneas puede verse tosco — conviene aplicarlo a palabras o frases cortas.
- En SSR se sirve solo el texto; el overlay aparece tras la hidratación.
- Con `prefers-reduced-motion` activo el shape aparece completo de inmediato al dispararse, sin animación.
