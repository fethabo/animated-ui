## 1. Variante bubbles

- [x] 1.1 Agregar `'bubbles'` al union `AnimatedBackgroundVariantName` en `src/components/AnimatedBackground/types.ts`
- [x] 1.2 Crear `src/components/AnimatedBackground/variants/bubbles.ts`: capas de radial-gradients tileadas `repeat-y` en `::before`/`::after`, ascenso seamless por `translateY` (recorrido múltiplo exacto de la altura de tile) + sway horizontal suave en los mismos keyframes, translucidez via `color-mix()`, según design.md
- [x] 1.3 Documentar en el header del módulo las CSS vars `--aui-bubbles-*` (base, color-1, color-2, speed default `24s`, size, opacity) con propósito, default y cómo pisarlas
- [x] 1.4 Implementar `cssVars()`: `colors[0..1]` → tintes, `colors[2]` → base, `speed` → `--aui-bubbles-speed`, `intensity` → `--aui-bubbles-opacity`
- [x] 1.5 Registrar `bubbles` en `VARIANTS` de `src/components/AnimatedBackground/index.tsx`

## 2. Verificación

- [x] 2.1 Cubrir la variante `bubbles` en `src/components/AnimatedBackground/index.ssr.test.ts` (render SSR sin errores) y correr `vitest`
- [x] 2.2 Verificar visualmente en `test-app`: loop de ascenso sin salto en el wrap, sway sutil, defaults atractivos, y estado estático legible (burbujas distribuidas) simulando `prefers-reduced-motion`
- [x] 2.3 Actualizar el panel de controles del demo de `AnimatedBackground` en `test-app` para incluir `bubbles` en el selector de `variant`

## 3. Documentación

- [x] 3.1 Actualizar `README.md`: variante `bubbles` en la sección de `AnimatedBackground` y tabla de CSS custom properties `--aui-bubbles-*`
- [x] 3.2 Crear ejemplo standalone `examples/bubbles-section.tsx` (solo React, sin importar el paquete, TypeScript mínimo)
- [x] 3.3 Actualizar docs web: demo (`docs/src/demos/animated-background.tsx`), snippet de uso (`docs/content/usage/animated-background.tsx`), prosa `docs/content/animated-background.es.md` / `.en.md`, y `docs/content/props-es/animated-background.json` si la superficie de props lo requiere
- [x] 3.4 Correr el build de docs para verificar que no falla por contenido faltante
