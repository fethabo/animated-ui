---
title: EmojiBurst
description: Ráfaga de emojis one-shot vía ref.
---

## Características

- API imperativa: `ref.current?.fire(options?)` dispara un abanico de emojis con física (abanico, gravedad).
- Lista de emojis configurable; se renderiza con la fuente de emoji del sistema (sin assets).
- Los disparos se acumulan en el mismo canvas.

## Limitaciones

- El look de los emojis varía según el sistema operativo (usa `fillText`).
- `count` default conservador (30): `fillText` por partícula es más caro que las formas de confetti.
- Con `prefers-reduced-motion` activo (default), `fire()` es no-op.
