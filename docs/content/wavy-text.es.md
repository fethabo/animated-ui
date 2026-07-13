---
title: WavyText
description: Caracteres ondulando en loop continuo: una ola recorre el texto sin romper la línea.
---

## Características

- Una ola recorre el texto de izquierda a derecha en loop continuo. CSS puro (keyframes + `animation-delay` escalonado por índice, seteado inline una sola vez), sin JS por frame.
- Anima solo `transform: translateY` (compositado), así la métrica de la línea circundante no cambia y el texto normal alrededor no se desplaza.
- Reutiliza el split por carácter del paquete: el texto completo va en `aria-label` y los caracteres son `aria-hidden`, con los espacios preservados.
- `amplitude`, `speed` y `stagger` configurables.
- Renderiza el elemento que le indiques con `as`, y acepta cualquier prop HTML válida de ese root.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-wavy-amplitude` | `6px` | Desplazamiento vertical máximo. Prevalece sobre `amplitude`. |
| `--aui-wavy-speed` | `1.6s` | Duración del ciclo de ola. Prevalece sobre `speed`. |
| `--aui-wavy-stagger` | `0.06s` | Desfase entre caracteres. Prevalece sobre `stagger`. |

## Limitaciones

- Acepta solo texto plano (`children: string`): se parte por carácter y no puede ondular markup.
- Con `prefers-reduced-motion` activo el texto queda estático en su línea base.
