---
title: AnimatedList
description: Lista que anima entrada, salida y reordenamiento (FLIP) de sus ítems.
---

## Características

- Las keys nuevas animan su entrada, las removidas su salida (clon), y las persistentes su reordenamiento (FLIP).
- Presets de entrada (`fade`/`scale-in`/`slide`/`none`) y salida (`fade`/`scale-out`/`none`).
- Funciona con layouts flex y grid (FLIP bidimensional); `stagger` escalona entradas simultáneas.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-animated-list-easing` | `ease` | Easing de las animaciones. |

## Limitaciones

- Cada hijo necesita una `key` de React estable (como en cualquier lista).
- Con `prefers-reduced-motion` los cambios se aplican de inmediato: sin FLIP, sin entradas/salidas ni clones.
