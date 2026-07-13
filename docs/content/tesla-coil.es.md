---
title: TeslaCoil
description: Bobina de Tesla sobre canvas: un nodo central del que emanan rayos jagged, con arcos que saltan al cursor.
---

## Características

- Un nodo central emite `boltCount` rayos (arcos eléctricos jagged) hacia afuera, regenerándose para dar sensación de descarga continua. El trazo quebrado se genera con subdivisión midpoint-displacement seedada por el PRNG interno.
- Con `followCursor` (default) y el cursor encima, dirige `cursorBolts` rayos hacia el puntero — más gruesos, brillantes y con núcleo blanco que los ambientales —, regenerados cada frame para que crepiten siguiéndolo. El tracking es por ref, **sin re-renders por frame**.
- Con `cursorTrigger="click"` esos rayos salen solo mientras se mantiene presionado.
- El canvas tiene `pointer-events: none`: los `children` superpuestos (un botón, un título) siguen siendo interactivos.
- Acepta cualquier prop HTML válida de `<div>`.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-tesla-color` | `#7dd3fc` | Color de los rayos. Prevalece sobre la prop `color`. |
| `--aui-tesla-line-width` | `2px` | Grosor de los rayos. |
| `--aui-tesla-reach` | `160` | Alcance de los rayos en px (numérico, sin unidad). |
| `--aui-tesla-jitter` | `18` | Magnitud del jitter en px (numérico, sin unidad). |
| `--aui-tesla-frequency` | `12` | Regeneraciones por segundo (numérico, sin unidad). |

## Limitaciones

- El contenedor necesita una altura definida: el canvas cubre el espacio del root, que sin altura colapsa.
- En dispositivos touch (sin hover) se emiten solo los rayos ambientales.
- Con `prefers-reduced-motion` los rayos ambientales se dibujan una vez sin regenerarse.
