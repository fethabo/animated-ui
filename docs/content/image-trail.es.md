---
title: ImageTrail
description: Imágenes efímeras que brotan siguiendo al puntero y se desvanecen (efecto agency/portfolio).
---

## Características

- El pool `images` rota secuencialmente en orden cíclico: agotado el array, la selección reinicia desde la primera.
- Emisión throttleada por distancia recorrida (`emitEvery` px), con un cap de nodos vivos (`maxConcurrent`).
- Cada imagen es un nodo `<img>` efímero que se remueve solo del DOM al terminar su animación — sin estado de React por imagen.
- Las URLs se precargan tras el montaje para evitar jank de decode en la primera emisión.
- La capa es `pointer-events: none`: los children siguen interactivos. Scoped a su contenedor.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-image-trail-size` | `120px` | Ancho máximo de las imágenes. Prevalece sobre la prop `size`. |
| `--aui-image-trail-duration` | `900ms` | Vida de cada imagen. Prevalece sobre la prop `duration`. |

## Limitaciones

- Con `prefers-reduced-motion` el efecto es no-op (sin emisión), y los children quedan intactos.
- En dispositivos táctiles degrada a no-op: no hay puntero persistente.
- Aun con precarga, conviene usar imágenes livianas: muchas imágenes pesadas emitidas rápido pueden generar jank.
