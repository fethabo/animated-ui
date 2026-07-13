---
title: AutoHeight
description: Transiciona suavemente la altura (y opcional el ancho) al cambiar el contenido.
---

## Características

- Cuando su contenido cambia de tamaño, la altura transiciona en vez de saltar.
- Al terminar vuelve a `height: auto`: sigue el flujo normal del layout (responsive), sin altura fija residual.
- `width` anima también el ancho; interrumpir a mitad de transición encadena sin saltos.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-autoheight-easing` | `ease` | Easing de la transición. |

## Limitaciones

- Mide el contenido con ResizeObserver: contenido con imágenes sin dimensiones puede medir tarde.
- Con `prefers-reduced-motion` el contenedor se ajusta de inmediato manteniendo `height: auto`.
