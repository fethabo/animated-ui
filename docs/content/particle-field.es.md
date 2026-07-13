---
title: ParticleField
description: Campo de partículas interactivo con modos de deriva y links.
---

## Características

- Partículas que reaccionan al cursor (`repel`/`attract`/`none`) dentro de un radio.
- Cinco modos de deriva: `bounce`, `snow`, `embers`, `bubbles`, `warp`.
- Efecto constelación opt-in (`links`): conecta partículas cercanas con líneas (introduce un cómputo O(N²); sin `links` el costo queda O(N)).

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-particle-radius` | `2px` | Radio de cada partícula. |
| `--aui-particle-color` | `#7c3aed` | Color de las partículas. |
| `--aui-particle-link-distance` | `120px` | Distancia máxima de conexión. |
| `--aui-particle-link-color` | `derivado` | Color de las líneas. |

## Limitaciones

- Fondo/overlay decorativo: absoluto dentro de un contenedor `position: relative` (fondo transparente).
- `links` activa un cómputo O(N²): con muchas partículas puede pesar.
- Con `prefers-reduced-motion` el RAF se detiene y el canvas muestra las partículas estáticas.
