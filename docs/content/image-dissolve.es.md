---
title: ImageDissolve
description: Transición dithered entre imágenes al cambiar el `src` — en canvas.
---

## Características

- Al cambiar `src`, transiciona entre la imagen anterior y la nueva con un disuelto dithered.
- `duration` controla la transición en ms.
- Requiere `alt` para accesibilidad.

## Limitaciones

- Trabaja sobre imágenes cargadas: el disuelto ocurre al cambiar el `src`.
- Con `prefers-reduced-motion` el `src` se cambia al instante sin animar el canvas.
