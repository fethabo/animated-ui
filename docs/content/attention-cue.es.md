---
title: AttentionCue
description: Pista de luz que aparece tras inactividad y apunta a un elemento.
---

## Características

- Tras `idleDelay` ms sin mover el puntero, dibuja un trazo de luz (o huellas) hacia un `target`.
- Modo dirigido (con `target`) o ambiente (sin él).
- `marker` elige entre haz de luz (`beam`) o huellas (`footprints`); `head` define la punta.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-cue-color` | `#fbbf24` | Color del trazo. |
| `--aui-cue-duration` | `700` | Duración del dibujo (ms). |
| `--aui-cue-speed` | `420` | Velocidad del trazo (px/s). |
| `--aui-cue-max-distance` | `220` | Distancia máxima desde el puntero. |

## Limitaciones

- El overlay no intercepta clicks del contenido que envuelve.
- Con `prefers-reduced-motion` la pista (efecto autónomo por timer) NO se dibuja.
