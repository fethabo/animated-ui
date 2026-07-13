---
title: SpotlightCard
description: Contenedor con un spotlight radial que sigue al cursor e ilumina la zona bajo el mouse.
---

## Características

- El tracking escribe CSS custom properties directamente sobre el elemento (sin estado de React): mover el mouse no re-renderiza los children.
- El overlay tiene `pointer-events: none`, así que links y botones del contenido siguen siendo interactivos.
- El spotlight permanece activo con `prefers-reduced-motion` porque responde a input directo y no desplaza contenido.
- Acepta cualquier prop HTML válida de `<div>` (aria attributes, handlers, etc.).

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-spotlight-color` | `rgba(255, 255, 255, 0.15)` | Color del gradiente del spotlight. |
| `--aui-spotlight-radius` | `250px` | Radio del spotlight. |
| `--aui-spotlight-opacity` | `1` | Opacidad del overlay en hover. |

`--aui-spotlight-x` / `--aui-spotlight-y` son variables de runtime que escribe el componente; no las setees a mano.

## Limitaciones

- El spotlight es un efecto de hover: en dispositivos táctiles no hay interacción.
- `respectReducedMotion` se acepta por consistencia de API, pero el spotlight queda activo en ambos casos (es input directo, sin movimiento de contenido).
