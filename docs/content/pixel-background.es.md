---
title: PixelBackground
description: Grilla de píxeles sobre canvas con behaviors combinables — hover, idle y reveal — en una sola pasada de pintura por frame.
---

## Características

- Grilla de píxeles sobre `<canvas>`: una sola pasada de pintura por frame, sin miles de nodos DOM. El canvas se adapta solo al tamaño del contenedor.
- Behaviors combinables libremente: `hover` ilumina las celdas cercanas al mouse con caída gaussiana, `idle` las hace parpadear de forma autónoma y asíncrona, y `reveal` las materializa al montar con dithering ordenado (matriz Bayer).
- Color estático para todas las celdas (`color`) o color dinámico por celda con el callback `cellColor`, que recibe la posición de la celda y las contribuciones de `hover` e `idle`.
- Grilla configurable via `cellSize` y `gap`; alpha base de reposo via `baseOpacity`.
- Acepta cualquier prop HTML válida de `<div>`.

## El callback `cellColor`

```ts
type CellColorFn = (x: number, y: number, proximity: number, idlePhase: number) => string
```

| Parámetro | Descripción |
| --- | --- |
| `x` | Columna de la celda en la grilla (entero, desde 0). |
| `y` | Fila de la celda en la grilla (entero, desde 0). |
| `proximity` | Contribución del behavior `hover` (0 a 1, 1 = bajo el cursor); `0` si no está activo. |
| `idlePhase` | Contribución del behavior `idle` (entre `-idleIntensity` y `+idleIntensity`); `0` si no está activo. |

Retorna cualquier color CSS válido.

## CSS Custom Properties

No expone CSS custom properties: la apariencia se controla por props (`color`, `cellColor`, `cellSize`, `gap`, `baseOpacity`).

## Limitaciones

- El behavior `hover` depende del mouse: en dispositivos táctiles no aporta iluminación (quedan `idle`/`reveal` según los actives).
- Es un background decorativo: montalo dentro de un contenedor `position: relative` y superponé tu contenido encima.
- Con `prefers-reduced-motion` se desactivan `idle` y `reveal`; `hover` sigue activo porque responde a input directo del usuario (salvo que pongas `respectReducedMotion={false}`).
