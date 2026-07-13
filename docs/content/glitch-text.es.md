---
title: GlitchText
description: Texto con glitch RGB-split intermitente en CSS puro, pensado para titulares.
---

## Características

- Glitch RGB-split intermitente (ráfagas breves separadas por períodos estables) en CSS puro, sin JS por frame: dos capas del mismo texto en pseudo-elementos (`content: attr(data-text)`) desplazadas en sentidos opuestos y recortadas con `clip-path` animado.
- Los pseudo-elementos quedan fuera del árbol de accesibilidad, así el texto se lee una sola vez.
- Dos modos de disparo (`trigger`): `'loop'` (autónomo intermitente) y `'hover'` (solo mientras el cursor está encima).
- `intensity`, `frequency`, `burstDuration` y `colors` configurables.
- Renderiza el elemento que le indiques con `as`, y acepta cualquier prop HTML válida de ese root.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-glitch-color-1` | `#ff004d` | Canal desplazado a la izquierda. Prevalece sobre `colors[0]`. |
| `--aui-glitch-color-2` | `#00fff9` | Canal desplazado a la derecha. Prevalece sobre `colors[1]`. |
| `--aui-glitch-intensity` | `3px` | Desplazamiento de los canales. Prevalece sobre `intensity`. |
| `--aui-glitch-cycle` | `3s` | Duración del ciclo completo de ráfagas. |

## Limitaciones

- Acepta solo texto plano (`children: string`): las capas se duplican via `content: attr(data-text)`, que no soporta markup.
- Pensado para titulares — el `clip-path` animado sobre párrafos largos tiene costo de pintado.
- Con `prefers-reduced-motion` activo, `loop` queda estático; `hover` conserva un split estático atenuado, sin jitter.
