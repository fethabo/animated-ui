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

## Limitaciones

- La atracción es un efecto de hover: en dispositivos táctiles no hay interacción.
- Con `prefers-reduced-motion` el contenido no se mueve (offsets en `0`), pero `isActive` sigue reportándose.
