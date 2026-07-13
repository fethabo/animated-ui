---
title: FireworksBurst
description: Fuegos artificiales one-shot: cohetes que ascienden con wobble y explotan en el apex, disparados imperativamente por ref.
---

## Características

- One-shot imperativo: no anima al montar. Cada `fire(options?)` lanza uno o más cohetes desde `origin` (default centro-abajo) que ascienden con un wobble lateral y explotan en el apex en chispas radiales que caen con gravedad y se desvanecen.
- Overlay `<canvas>` pasivo (`absolute, inset: 0`, `pointer-events: none`): los clicks pasan al contenido. El RAF arranca con el primer `fire()` y se detiene al morir la última chispa — costo cero en reposo.
- Varios cohetes por disparo (`rockets`) despegan escalonados; los disparos sucesivos se acumulan sobre el mismo canvas.
- Las props son los defaults de cada disparo; `fire(options?)` acepta `rockets`, `particleCount`, `colors`, `origin`, `power` y `gravity`, y los overridea solo para esa ráfaga.
- Aleatoriedad con el PRNG seedable del paquete (varía entre disparos, sin `Math.random`). El tipo `FireworksBurstHandle` tipa el ref en TypeScript.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-fireworks-color-<i>` | color `i` de `colors` | Pisa el color `i` de la paleta default desde CSS en cascada (no afecta `colors` pasados en `fire()`). |

## Limitaciones

- Los fuegos se recortan al contenedor del componente; para cubrir el viewport completo, montalo en un contenedor `position: fixed; inset: 0`.
- Con `prefers-reduced-motion` activo (y `respectReducedMotion` default), `fire()` es un no-op: son una celebración autónoma sin versión estática útil. Si tu flujo necesita feedback igual, resolvelo fuera del componente.
- `fire()` antes de la hidratación (o sin canvas disponible) es un no-op seguro.
