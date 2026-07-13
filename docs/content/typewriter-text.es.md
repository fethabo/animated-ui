---
title: TypewriterText
description: Revela texto carácter por carácter (efecto máquina de escribir), con modo loop multi-string.
---

## Características

- Mismo motor que `ScrambleText`: un loop de `requestAnimationFrame` muta el texto vía ref (sin re-renders por frame), con progresión por timestamps — misma velocidad en displays de 60 y 144 Hz.
- Pasando un `string[]` con `loop`, cicla escribiendo → pausando → borrando → siguiente.
- Cursor opcional que parpadea con una animación CSS (sin JS por frame); `true` usa `|`, un string usa ese glifo, `false` lo desactiva.
- Accesible: el root expone `aria-label` con el texto completo y los caracteres intermedios quedan ocultos para lectores de pantalla.
- Acepta cualquier prop HTML válida de `<span>`.

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-typewriter-cursor-speed` | `1s` | Velocidad de parpadeo del cursor (solo via CSS). |

## Limitaciones

- `text` es texto plano (no `children`): el motor opera carácter por carácter.
- El cursor es un elemento inline; con fuentes proporcionales el texto puede "saltar" al escribir. Para textos sensibles a layout usá monospace.
- Con `prefers-reduced-motion` activo muestra el texto final completo de inmediato, sin escritura ni parpadeo del cursor.
