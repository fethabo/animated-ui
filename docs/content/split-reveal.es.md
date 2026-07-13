---
title: SplitReveal
description: Parte un texto en char, word o line y revela cada unidad con stagger al montar o al entrar al viewport.
---

## Características

- Parte el texto en unidades (`char`, `word` o `line`) y revela cada una con stagger. La entrada es una CSS transition pura (cero JS por frame): el JavaScript solo togglea un atributo.
- Tres presets de entrada (`slide-up`, `fade`, `blur`) y dos disparadores: `'mount'` o `'in-view'` (vía IntersectionObserver).
- Pre-hidratación y accesibilidad: el texto se renderiza completo y visible desde el primer paint (SSR/SEO) y se parte en spans recién tras la hidratación. El root porta el texto completo en `aria-label` y las unidades son `aria-hidden`.
- Modo `line`: partir por línea depende del wrapping real (ancho, fuente cargada); se mide tras el montaje y se re-mide en resize.
- Acepta cualquier prop HTML válida de `<span>`.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-split-duration` | `0.6s` | Duración de la transición de cada unidad. |
| `--aui-split-stagger` | `0.05s` | Delay incremental entre unidades. |
| `--aui-split-distance` | `16px` | Desplazamiento inicial del preset `slide-up`. |
| `--aui-split-blur` | `8px` | Desenfoque inicial del preset `blur`. |
| `--aui-split-easing` | `cubic-bezier(0.22, 1, 0.36, 1)` | Curva de la transición (solo via CSS). |

## Limitaciones

- `text` es un string plano (no `children`): el componente lo parte en unidades.
- El re-disparo (`once={false}`) solo aplica con `trigger='in-view'`.
- `--aui-split-i` es una variable de runtime (índice por unidad, o índice de línea en modo `line`); no la setees a mano.
- Con `prefers-reduced-motion` activo muestra el texto completo de inmediato, sin stagger ni animación.
