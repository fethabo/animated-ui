---
title: GuidingBranches
description: Ramas que crecen desde el puntero tras inactividad.
---

## Características

- Tras `idleDelay` ms sin mover el puntero, crecen ramas (raíces, rayo o circuito) desde su posición.
- Modo ambiente (sin `target`): ramas 360° alrededor del puntero; con `target` la rama dominante se sesga hacia él.
- `aesthetic`, `density`, `depth` y `curl` moldean el trazo.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-branches-color` | `#34d399` | Color de las ramas. |
| `--aui-branches-speed` | `320` | Velocidad de crecimiento (px/s). |
| `--aui-branches-max-distance` | `260` | Distancia máxima desde el puntero. |
| `--aui-branches-curl` | `0.6` | Curvatura del trazo. |

## Limitaciones

- El overlay no intercepta clicks del contenido que envuelve.
- Con `prefers-reduced-motion` las ramas (efecto autónomo por timer) NO se dibujan.
