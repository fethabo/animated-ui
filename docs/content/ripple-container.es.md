---
title: RippleContainer
description: Contenedor que dibuja una onda expansiva desde el punto exacto de cada click (material ripple).
---

## Características

- Cada onda es un nodo efímero creado imperativamente en `pointerdown` (la onda arranca al presionar, no al soltar) y removido del DOM al terminar su animación — sin estado de React por onda: los clicks rápidos generan ondas concurrentes sin re-renders ni acumulación de nodos.
- Las ondas viven en una capa `pointer-events: none` recortada al contenedor (hereda su `border-radius`), así nunca interceptan clicks ni foco de los children.
- Convive con tus propios handlers: un `onPointerDown`/`onClick` del consumer sigue funcionando junto a la onda.
- Acepta cualquier prop HTML válida de `<div>`.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-ripple-color` | `currentColor` | Color de las ondas. Prevalece sobre `color`. |
| `--aui-ripple-duration` | `600ms` | Duración de cada onda. Prevalece sobre `duration`. |
| `--aui-ripple-opacity` | `0.25` | Opacidad inicial de la onda. Prevalece sobre `opacity`. |

## Limitaciones

- Con `prefers-reduced-motion`, la expansión se reemplaza por un fade estático breve en el punto del click: se preserva el feedback de interacción, no el movimiento.
