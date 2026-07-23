---
title: MagneticElement
description: Wrapper que atrae su contenido hacia el cursor al acercarse, con retorno elástico al salir.
---

## Características

- La traslación usa WAAPI con interpolación que preserva momentum (patrón TiltCard sobre `translate`).
- Expone su estado via render prop — `{ offsetX, offsetY, isActive }` — para construir efectos derivados (sombras, glows, cambios de color).
- La zona de atracción se agranda con padding transparente alrededor del contenido (`hitArea`), que **participa del layout** del wrapper. Con `hitArea={0}` el wrapper colapsa al tamaño del contenido y la atracción arranca recién al entrar en él.
- Acepta cualquier prop HTML válida de `<div>`.

## CSS Custom Properties

Este componente no expone CSS custom properties: todo se configura por props.

## Modo hook: `useMagnetic`

El mismo efecto sobre **tu** elemento, sin wrapper: el propio elemento se atrae hacia el cursor mientras está encima y vuelve con retorno elástico al salir. El hook devuelve un callback ref y restaura el elemento al desmontar.

```tsx
import { useMagnetic } from '@fethabo/animated-ui/magnetic-element'

function MiBoton() {
  const magneticRef = useMagnetic({ strength: 0.5 })
  return <Button ref={magneticRef}>Atrapame</Button>
}
```

Opciones: `strength` (default `0.35`), `respectReducedMotion` (default `true`).

## Limitaciones

- La atracción es un efecto de hover: en dispositivos táctiles no hay interacción.
- Con `prefers-reduced-motion` el contenido no se mueve (offsets en `0`), pero `isActive` sigue reportándose.
- En modo hook no hay `hitArea` (la zona extendida requiere el wrapper de padding del componente, que la logra sin listeners globales) ni render prop: la zona de atracción es el área del propio elemento.
