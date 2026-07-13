---
title: Dock
description: Barra estilo macOS: los ítems se magnifican por proximidad del cursor.
---

## Características

- Los ítems (`Dock.Item`) se agrandan según la cercanía del cursor, como el Dock de macOS.
- Horizontal o vertical (`orientation`); `magnification` y `radius` controlan el efecto.
- Los ítems siguen siendo interactivos (botones, links clickeables).

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-dock-gap` | `8px` | Espacio entre ítems. |
| `--aui-dock-return` | `0.25s` | Duración del retorno a escala base. |

## Limitaciones

- Es un efecto de mouse: en touch la fila queda estática (los ítems siguen funcionando).
- Con `prefers-reduced-motion` la fila queda estática.
