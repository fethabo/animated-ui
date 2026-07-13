---
title: ScrollReveal
description: Revela sus hijos al entrar al viewport, con dirección y stagger.
---

## Características

- Anima la entrada (fade + desplazamiento direccional) al entrar al viewport, vía IntersectionObserver.
- `stagger` escalona la entrada de los hijos directos.
- Con `once={false}` se re-oculta al salir y re-revela al volver a entrar.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-reveal-distance` | `24px` | Offset inicial. |
| `--aui-reveal-duration` | `0.6s` | Duración de la transición. |
| `--aui-reveal-stagger` | `0.1s` | Delay incremental entre hijos. |

## Limitaciones

- SSR-safe: el contenido existe en el DOM (accesible/SEO); solo se anima su aparición.
- Con `prefers-reduced-motion` el contenido se muestra directo en su posición final.
