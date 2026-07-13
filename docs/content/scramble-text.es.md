---
title: ScrambleText
description: Texto que se "descifra" carácter por carácter (efecto decrypt/Matrix), con reveal accesible.
---

## Características

- Loop de `requestAnimationFrame` que muta el texto directamente vía ref, sin re-renders de React por frame; la progresión por timestamps garantiza la misma duración en displays de 60 y 144 Hz.
- Accesible durante la animación: el root expone `aria-label` con el texto final y los caracteres aleatorios intermedios quedan ocultos para lectores de pantalla.
- Tres modos de disparo (`trigger`): `'mount'` (al montar y al cambiar `text`), `'hover'` (re-anima en cada `mouseenter`) y `'both'`.
- `charset` y `scrambleColor` configurables.
- Acepta cualquier prop HTML válida de `<span>`.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-scramble-color` | `currentColor` | Color de los caracteres mientras dura el scramble; al terminar, el texto vuelve a heredar su color. |

## Limitaciones

- `text` es un string plano (no `children`): opera carácter por carácter y no puede scramblear elementos ni markup.
- Con fuentes proporcionales los caracteres aleatorios miden distinto que los finales y el ancho puede "vibrar" durante el scramble. Para textos sensibles a layout usá una fuente monospace o `font-variant-numeric: tabular-nums`.
- Con `prefers-reduced-motion` activo muestra el texto final directo; el trigger `hover` sigue funcionando (responde a input directo del usuario).
