---
title: TextScrollReveal
description: Texto que se enciende palabra por palabra al recorrer el viewport.
---

## Características

- Las palabras pasan de atenuadas a encendidas a medida que el contenedor recorre el viewport.
- Colores opcionales de inicio/fin (`fromColor`/`toColor`); sin ellos usa `currentColor`.
- `offset` define el tramo del recorrido en el que ocurre el encendido.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-text-scroll-from-opacity` | `0.15` | Opacidad de las palabras atenuadas. |
| `--aui-text-scroll-to-opacity` | `1` | Opacidad de las palabras encendidas. |
| `--aui-text-scroll-from-color` | `—` | Color de las palabras atenuadas. |
| `--aui-text-scroll-to-color` | `—` | Color de las palabras encendidas. |

## Limitaciones

- Ligado al scroll de la ventana; texto plano (se divide por palabra).
- Con `prefers-reduced-motion` el texto se muestra completo y encendido, estático.
