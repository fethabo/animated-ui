---
title: FlowField
description: Partículas que trazan un campo de flujo por ruido, dejando estelas — en canvas.
---

## Características

- Cientos de partículas siguen un campo de ruido determinístico y dejan estelas que se desvanecen (`fade`).
- Determinístico: la misma `seed` + dimensiones producen la misma evolución (sin `Math.random`), estable entre renders y SSR-safe.
- El componente pinta su propio fondo (`background`): es opaco, necesario para el fade de las estelas (a diferencia de ParticleField).
- `scale` controla el zoom del campo: valores altos ⇒ curvas más anchas y suaves.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-flow-color-<i>` | paleta default | Color `i` de la paleta de estelas (1-indexed). |
| `--aui-flow-background` | `#0a0a12` | Color de fondo que pinta el canvas. |

## Limitaciones

- Es un fondo decorativo: se posiciona absoluto dentro de un contenedor `position: relative`.
- Con `prefers-reduced-motion` dibuja una composición estática de estelas pre-simuladas, sin RAF.
- Muchas partículas + contenedores grandes elevan el costo por frame.
