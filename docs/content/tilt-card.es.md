---
title: TiltCard
description: Card con efecto 3D tilt que sigue al mouse, con momentum real vía Web Animations API.
---

## Características

- Animado con la Web Animations API nativa (`element.animate()`): la interpolación entre estados preserva el momentum al cambiar de dirección, sin el "snap" de las CSS transitions.
- Overlay de brillo especular opcional (`glare`) que se mueve inversamente al tilt.
- Expone su estado via render prop — `{ tiltX, tiltY, isHovering }` — para construir efectos derivados (parallax internos, color shifts).
- Acepta cualquier prop HTML válida de `<div>` (aria attributes, handlers, etc.).

## CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-tilt-perspective` | `1000px` | Profundidad de perspectiva 3D; pisa la prop `perspective`. |

## Modo hook: `useTilt`

El mismo efecto como behavior hook, para aplicarlo sobre **tu** elemento (una card de tu design system, un `div` propio) sin wrapper. El hook devuelve un callback ref; funciona con cualquier componente que forwardee `ref` a un nodo DOM, y al desmontar restaura el elemento a su estado original. La perspectiva se aplica dentro del propio `transform` del elemento.

```tsx
import { useTilt } from '@fethabo/animated-ui/tilt-card'

function MiCard() {
  const tiltRef = useTilt({ maxAngle: 10 })
  return <Card ref={tiltRef}>Se inclina hacia el mouse.</Card>
}
```

Opciones: `maxAngle` (default `15`), `perspective` (default `1000`), `respectReducedMotion` (default `true`). `glare` y el render prop son exclusivos del componente.

## Limitaciones

- El tilt es un efecto de hover: en dispositivos táctiles no hay interacción (el card se muestra plano).
- Con `prefers-reduced-motion` activo, `tiltX`/`tiltY` quedan en `0` pero `isHovering` sigue funcionando.
- En modo hook no hay `glare` (requiere overlay y contexto `preserve-3d`) ni render prop.
