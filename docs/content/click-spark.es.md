---
title: ClickSpark
description: Variante declarativa: cada click dentro del contenedor emite una ráfaga breve de chispas radiales en el punto del evento.
---

## Características

- Declarativa: sin ref ni handle. Envolvés tu contenido y cada `pointerdown` dentro del contenedor emite la ráfaga en el punto exacto del evento.
- El canvas es un overlay `pointer-events: none`: botones, links e inputs del contenido siguen siendo interactivos.
- Tu `onPointerDown` (si lo pasás) corre siempre — se compone con el handler del efecto.
- Clicks rápidos generan ráfagas concurrentes sobre el mismo canvas y RAF, que se auto-detiene al no quedar chispas — costo cero en reposo.
- Paleta configurable (`colors`): cada chispa sortea su color.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-clickspark-color-<i>` | color `i` de `colors` | Pisa el color `i` de la paleta default desde CSS en cascada. |

## Limitaciones

- Con `prefers-reduced-motion` activo los clicks no emiten chispas (movimiento decorativo no esencial); la interactividad de los children queda intacta.
