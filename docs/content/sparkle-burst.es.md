---
title: SparkleBurst
description: Ráfaga de destellos (estrellas) one-shot vía ref.
---

## Características

- API imperativa: `ref.current?.fire(options?)` dispara una ráfaga de estrellas.
- Las `options` overridean las props solo para ese disparo; los disparos se acumulan en el mismo canvas.
- Dispersión (`spread`), tamaño (`size`) y paleta configurables.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-sparkle-color-<i>` | `dorados + blanco` | Color `i` de la paleta default. |

## Limitaciones

- `fire()` es no-op antes de la hidratación.
- Con `prefers-reduced-motion` activo (default), `fire()` es no-op: el destello es celebración autónoma sin versión estática útil.
