---
title: RotatingText
description: Texto base + una palabra que rota cíclicamente por una lista, con layout de ancho estable.
---

## Características

- Texto base opcional (`children`) más una palabra que rota cíclicamente por una lista con transición animada. El avance usa timers (sin RAF) y la transición es CSS inyectado.
- El ancho del contenedor de la palabra transiciona suavemente entre palabras de largos distintos (medición al cambiar, no por frame).
- Tres presets de transición: `slide-up`, `fade`, `flip`.
- Accesible sin spam: el root expone un `aria-label` estático con el texto base + la lista completa, y la palabra animada es `aria-hidden` (sin `aria-live`).
- Acepta cualquier prop HTML válida de `<span>`.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-rotating-color` | hereda | Color de la palabra rotante. Prevalece sobre `color`. |
| `--aui-rotating-duration` | `0.4s` | Duración de la transición. |

## Limitaciones

- Si querés eliminar incluso el ajuste de ancho, fijá un `width` via CSS sobre `.aui-rotating-box`.
- Con `prefers-reduced-motion` activo muestra la primera palabra estática.
