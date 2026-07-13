---
title: ScrollProgress
description: Barra fija que refleja el progreso de scroll de la página.
---

## Características

- Barra fija (top/bottom del viewport) que espeja 1:1 el progreso de scroll de la página.
- Color, grosor, track y z-index configurables.
- Cero JS por frame más allá del listener de scroll pasivo.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-progress-color` | `#7c3aed` | Color de la barra. |
| `--aui-progress-height` | `3px` | Grosor. |
| `--aui-progress-bg` | `transparent` | Color del track. |
| `--aui-progress-z` | `50` | z-index del elemento fijo. |

## Limitaciones

- Es un elemento `position: fixed` global: refleja el scroll de la ventana, no de un contenedor.
- Se mantiene activo con `prefers-reduced-motion` (espeja el scroll que el usuario controla directo, como la scrollbar nativa).
