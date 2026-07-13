---
title: BorderBeam
description: Cometa de luz que recorre el perímetro del borde del contenedor en loop continuo.
---

## Características

- CSS casi puro (`offset-path: border-box` + `offset-distance` animado), sin JS por frame: una cabeza brillante con estela en degradé recorre el borde en loop.
- Sigue el `border-radius` que le des al componente, incluyendo esquinas redondeadas.
- La capa del cometa es `pointer-events: none`: los clicks pasan al contenido.
- `delay` (negativo arranca "ya avanzado") permite desincronizar múltiples instancias.
- Acepta cualquier prop HTML válida de `<div>` (poné acá el `border-radius`).

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-beam-color-from` | `#7c3aed` | Color de la cabeza. Prevalece sobre `colorFrom`. |
| `--aui-beam-color-to` | `#0ea5e9` | Color de la cola. |
| `--aui-beam-size` | `96px` | Largo del cometa. |
| `--aui-beam-duration` | `6s` | Segundos por vuelta. |
| `--aui-beam-delay` | `0s` | Desfase inicial. |
| `--aui-beam-border-width` | `2px` | Grosor del trazo. |

## Limitaciones

- En browsers sin `offset-path: border-box` el cometa se oculta sin afectar nada (`@supports`).
- Con `prefers-reduced-motion` muestra un realce de borde estático sutil, sin movimiento.
