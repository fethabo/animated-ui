---
title: WavesBackground
description: Fondo de líneas onduladas por un campo de ruido determinístico, en canvas.
---

## Características

- Campo de ruido determinístico: la misma `seed` + dimensiones producen siempre las mismas ondas (sin `Math.random`), estable entre renders y SSR-safe.
- Paleta interpolada: con más de un color, cada línea toma su color según su posición vertical entre los extremos de la paleta.
- Un solo canvas con RAF; `speed={0}` congela la ondulación sin desmontar nada.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-waves-color-<i>` | paleta default | Color `i` de la paleta (1-indexed). |
| `--aui-waves-line-width` | `1.5px` | Grosor de las líneas. |

## Limitaciones

- Es un fondo decorativo: se posiciona absoluto dentro de su contenedor (`position: relative` en el padre).
- Con `prefers-reduced-motion` las líneas se dibujan curvadas pero inmóviles, sin RAF.
- Muchas líneas + contenedores grandes elevan el costo por frame (canvas 2D).
