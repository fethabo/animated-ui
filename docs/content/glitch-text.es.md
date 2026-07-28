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

## CSS Class Mode (Zero-JS)

Este componente se puede consumir sin React, aplicando directamente sus clases de CSS nativo.

```html
<link rel="stylesheet" href="node_modules/@fethabo/animated-ui/dist/css/glitch-text.css" />

<h1 class="aui-glitch aui-loop" data-text="Glitch CSS puro">Glitch CSS puro</h1>
```

O registrando el CSS dinámicamente desde JS:

```javascript
import { registerGlitchText } from '@fethabo/animated-ui'
// Inyecta el CSS en el <head> (idempotente)
registerGlitchText()
```

**Nota sobre `data-text`:** En modo CSS, es obligatorio duplicar el texto en el atributo `data-text` para que los pseudo-elementos funcionen (el componente de React hace esto automáticamente).
Las variantes de disparo se controlan con las modificadoras `aui-loop` (intermitente) o `aui-hover` (solo al pasar el mouse).

**Accesibilidad (Opt-out):** El modo CSS nativo aplica `prefers-reduced-motion` para frenar la animación de forma automática. Podés forzar su ejecución añadiendo `data-aui-motion` al elemento HTML: `<h1 class="aui-glitch aui-loop" data-text="..." data-aui-motion>...</h1>`.

## Limitaciones

- Acepta solo texto plano (`children: string`): las capas se duplican via `content: attr(data-text)`, que no soporta markup.
- Pensado para titulares — el `clip-path` animado sobre párrafos largos tiene costo de pintado.
- Con `prefers-reduced-motion` activo, `loop` queda estático; `hover` conserva un split estático atenuado, sin jitter.
