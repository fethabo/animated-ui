---
title: ConfettiBurst
description: Ráfagas de confetti one-shot disparadas imperativamente vía ref.
---

## Características

- API imperativa: `ref.current?.fire(options?)` dispara una ráfaga; las `options` overridean las props **solo para ese disparo**.
- Disparos sucesivos se acumulan sobre el mismo canvas, sin remontar el componente.
- Física simple por copo (velocidad inicial, abanico, gravedad) con formas `rect`/`circle` y paleta configurable.
- El canvas es overlay del contenedor y no intercepta el mouse (`pointer-events: none`).

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-confetti-color-<i>` | paleta festiva | Color `i` de la paleta default (1-indexed). |

## Limitaciones

- `fire()` es no-op antes de la hidratación.
- Con `prefers-reduced-motion` activo (y `respectReducedMotion` default), `fire()` es un no-op: el confetti es celebración autónoma sin versión estática útil — el feedback alternativo corre por cuenta del consumer.
