---
title: CustomCursor
description: Cursor personalizado (dot + anillo con lag elástico) scoped a su contenedor, sin portales ni efectos a nivel documento.
---

## Características

- Un punto que sigue al puntero de inmediato más un anillo que lo persigue con lag elástico, **dentro de su contenedor**.
- Posicionamiento via CSS vars escritas por `pointermove` (`--aui-cursor-x/y`): cero re-renders por frame. El lag es una CSS transition, sin RAF propio.
- El anillo se agranda sobre elementos interactivos, detectados por delegación (`a`, `button`, `[role="button"]` y cualquier elemento con `data-aui-cursor`).
- Expone el estado como `data-aui-cursor-state="idle" | "hover" | "down"` sobre el root, para estilado custom.
- Con `hideNativeCursor` (default) el cursor nativo se oculta solo dentro del contenedor y sus descendientes.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-cursor-dot-size` | `8px` | Diámetro del dot. Prevalece sobre la prop `dotSize`. |
| `--aui-cursor-ring-size` | `36px` | Diámetro del ring. Prevalece sobre la prop `ringSize`. |
| `--aui-cursor-color` | `#7c3aed` | Color de dot y ring. Prevalece sobre la prop `color`. |
| `--aui-cursor-lag` | `0.15s` | Duración del lag del ring. Prevalece sobre la prop `lag`. |
| `--aui-cursor-hover-scale` | `1.5` | Escala del ring en hover. Prevalece sobre la prop `hoverScale`. |

## Limitaciones

- En dispositivos sin `(hover: hover) and (pointer: fine)` (touch, pointers gruesos) no monta los nodos custom ni toca el cursor nativo — los children quedan intactos.
- Con `prefers-reduced-motion` el seguimiento es directo, sin lag elástico ni transiciones.
- Como `hideNativeCursor` oculta el cursor nativo en todo el contenedor, los inputs de texto también lo pierden: conviene no envolver formularios completos.
