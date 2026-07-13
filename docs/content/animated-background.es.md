---
title: AnimatedBackground
description: Background animado renderizado con CSS puro (sin JS por frame), con variantes aurora, mesh, noise, beam, lava, grid, rays y dots.
---

## Características

- Renderizado con CSS puro, sin JavaScript por frame: se posiciona `absolute, inset: 0` para cubrir su contenedor `position: relative`, o el viewport completo con `fixed`.
- Ocho variantes visuales con defaults atractivos: `aurora`, `mesh`, `noise`, `beam`, `lava`, `grid`, `rays` y `dots`.
- Cada variante expone sus colores, velocidad e intensidad tanto por props (`colors`, `speed`, `intensity`) como por CSS custom properties, pisables en cascada.
- Variante `lava`: blobs opacos que ascienden y descienden fundiéndose con el truco "gooey" (`filter: blur() + contrast()`), evocando una lámpara de lava.
- Variantes `grid` / `rays` / `dots`: grilla retro-synthwave en perspectiva (loop por período de celda exacto, sin salto), haces de luz que rotan en vaivén desde un vértice superior, y retícula de puntos con pulso suave de opacidad/escala.
- Acepta cualquier prop HTML válida de `<div>`.

## CSS Custom Properties

Todas se pueden pisar desde tu CSS en cascada, e.g. `.mi-bg { --aui-aurora-speed: 20s; }`.

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-aurora-color-1` | `#5b21b6` | Primer gradiente de la aurora (violeta). |
| `--aui-aurora-color-2` | `#0ea5e9` | Segundo gradiente (cyan). |
| `--aui-aurora-color-3` | `#10b981` | Tercer gradiente (verde). |
| `--aui-aurora-color-4` | `#ec4899` | Cuarto gradiente (rosa). |
| `--aui-aurora-speed` | `14s` | Duración de un ciclo completo. |
| `--aui-aurora-blur` | `60px` | Desenfoque que difumina los gradientes. |
| `--aui-aurora-opacity` | `1` | Intensidad global del efecto. |
| `--aui-mesh-color-1` | `#7c3aed` | Blob superior izquierdo (violeta). |
| `--aui-mesh-color-2` | `#db2777` | Blob superior derecho (magenta). |
| `--aui-mesh-color-3` | `#2563eb` | Blob inferior derecho (azul). |
| `--aui-mesh-color-4` | `#0d9488` | Blob inferior izquierdo (teal). |
| `--aui-mesh-speed` | `18s` | Duración de un ciclo de morphing. |
| `--aui-mesh-blur` | `40px` | Desenfoque que funde los blobs. |
| `--aui-mesh-opacity` | `1` | Intensidad global del efecto. |
| `--aui-noise-base` | `#0a0a0a` | Color base de fondo bajo el grain. |
| `--aui-noise-opacity` | `0.12` | Opacidad del grain (intensidad). |
| `--aui-noise-speed` | `0.6s` | Velocidad del parpadeo del grain. |
| `--aui-beam-base` | `#050510` | Color de fondo detrás de los rayos. |
| `--aui-beam-color-1` | `rgba(124, 58, 237, 0.45)` | Primer haz de luz. |
| `--aui-beam-color-2` | `rgba(14, 165, 233, 0.35)` | Segundo haz de luz. |
| `--aui-beam-color-3` | `rgba(236, 72, 153, 0.3)` | Tercer haz de luz. |
| `--aui-beam-speed` | `16s` | Duración de una rotación completa. |
| `--aui-beam-blur` | `24px` | Desenfoque que suaviza los bordes de los rayos. |
| `--aui-beam-opacity` | `1` | Intensidad global del efecto. |
| `--aui-lava-base` | `#160a2b` | Color de fondo opaco detrás de los blobs. |
| `--aui-lava-color-1` | `#ff4d6d` | Primer color de blob. |
| `--aui-lava-color-2` | `#ff924d` | Segundo color de blob. |
| `--aui-lava-speed` | `16s` | Duración de un ascenso/descenso completo. |
| `--aui-lava-blur` | `16px` | Desenfoque del truco gooey. |
| `--aui-lava-contrast` | `16` | Contraste que "endurece" los bordes del blur (fusión gooey). |
| `--aui-lava-size` | `280px` | Diámetro base de los blobs. |
| `--aui-lava-opacity` | `1` | Intensidad global del efecto. |
| `--aui-grid-line` | `rgba(124, 58, 237, 0.5)` | Color de las líneas de la grilla synthwave. |
| `--aui-grid-base` | `#050510` | Color de fondo / cielo. |
| `--aui-grid-glow` | `rgba(236, 72, 153, 0.35)` | Glow del horizonte. |
| `--aui-grid-cell` | `48px` | Lado de la celda de la grilla. |
| `--aui-grid-speed` | `8s` | Duración de un avance de celda completo. |
| `--aui-grid-opacity` | `1` | Intensidad global del efecto. |
| `--aui-rays-color-1` | `rgba(251, 191, 36, 0.4)` | Primer haz de luz. |
| `--aui-rays-color-2` | `rgba(249, 115, 22, 0.28)` | Segundo haz de luz. |
| `--aui-rays-color-3` | `rgba(236, 72, 153, 0.22)` | Tercer haz de luz. |
| `--aui-rays-base` | `#050510` | Color de fondo. |
| `--aui-rays-speed` | `18s` | Duración de un barrido completo (vaivén). |
| `--aui-rays-blur` | `18px` | Desenfoque que suaviza los haces. |
| `--aui-rays-opacity` | `1` | Intensidad global del efecto. |
| `--aui-dots-color` | `rgba(124, 58, 237, 0.7)` | Color de los puntos. |
| `--aui-dots-base` | `#050510` | Color de fondo. |
| `--aui-dots-size` | `2px` | Radio de cada punto. |
| `--aui-dots-cell` | `28px` | Separación de la retícula. |
| `--aui-dots-speed` | `4s` | Duración de un pulso completo. |
| `--aui-dots-opacity` | `1` | Intensidad global (pico del pulso). |

## Limitaciones

- La variante `lava` usa `filter` sobre áreas grandes, que tiene costo de pintado: rinde mejor en contenedores acotados que a pantalla completa en gama baja.
- Es un background decorativo: no lleva contenido propio, montalo dentro de un contenedor `position: relative` (o usá `fixed`) y superponé tu contenido encima.
- Con `prefers-reduced-motion` muestra el gradiente estático, sin animación (salvo que pongas `respectReducedMotion={false}`).
