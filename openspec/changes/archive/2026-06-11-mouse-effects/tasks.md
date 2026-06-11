## 1. SpotlightCard

- [x] 1.1 Crear `src/components/SpotlightCard/types.ts` con `SpotlightCardProps` (color, radius, opacity, respectReducedMotion, className, style, spread de props HTML del div)
- [x] 1.2 Crear `src/components/SpotlightCard/index.tsx`: `'use client'`, root + overlay con `radial-gradient` en `var(--aui-spotlight-x/y)`, `pointer-events: none`, CSS via `injectStyles` en `useEffect`
- [x] 1.3 Implementar tracking de cursor escribiendo `--aui-spotlight-x/y` con `setProperty` en mousemove (sin setState) y transición de opacidad en enter/leave
- [x] 1.4 Materializar props como `--aui-spotlight-color/radius/opacity` inline en el root, pisables desde CSS

## 2. GlowBorder

- [x] 2.1 Crear `src/components/GlowBorder/types.ts` con `GlowBorderProps` (colors, speed, width, radius, opacity, followCursor, respectReducedMotion, className, style, spread)
- [x] 2.2 Crear `src/components/GlowBorder/index.tsx`: estructura de tres capas (root con padding = width y overflow hidden → capa cónica oversized → contenido con background propio), keyframes de `transform: rotate` via `injectStyles`
- [x] 2.3 Implementar modo `followCursor`: ángulo via `atan2` desde el centro, interpolado con momentum usando WAAPI (patrón TiltCard); sin saltos al salir el cursor
- [x] 2.4 Materializar props como `--aui-glow-color-1..3/speed/width/radius/opacity` inline en el root; con reduced motion detener el loop (gradiente estático) salvo `respectReducedMotion={false}`

## 3. MagneticElement

- [x] 3.1 Crear `src/components/MagneticElement/types.ts` con `MagneticElementProps` y `MagneticState = { offsetX, offsetY, isActive }`; children como `ReactNode | (state) => ReactNode`
- [x] 3.2 Crear `src/components/MagneticElement/index.tsx`: root con padding transparente `hitArea` (default 40), contenido trasladado con WAAPI-con-momentum hacia el cursor escalado por `strength` (default 0.35)
- [x] 3.3 Implementar retorno elástico al salir (keyframes WAAPI con overshoot) y render prop con estado actualizado
- [x] 3.4 Con reduced motion: offsets en 0, `isActive` sigue reportándose; opt-out con `respectReducedMotion={false}`

## 4. Integración del paquete

- [x] 4.1 Exportar los tres componentes y sus tipos públicos desde `src/index.ts` (verificar tree-shaking: importar uno no arrastra los demás)
- [x] 4.2 Tests vitest de la lógica pura extraíble (cálculo de ángulo/atan2 de GlowBorder, escalado de offsets de MagneticElement, generadores de CSS) incluyendo patrón `*.ssr.test.ts` donde haya acceso a DOM
- [x] 4.3 `npm run build` limpio (ESM + CJS + `.d.ts`) y verificación visual de los tres componentes en `test-app` (incluye prueba con `prefers-reduced-motion` emulado)

## 5. Documentación y ejemplos

- [x] 5.1 Crear `examples/spotlight-card.tsx` standalone (sin importar el paquete, TypeScript mínimo convertible a `.jsx`)
- [x] 5.2 Crear `examples/glow-border.tsx` standalone
- [x] 5.3 Crear `examples/magnetic-element.tsx` standalone
- [x] 5.4 README: tres filas nuevas en la tabla de componentes + sección por componente (snippet de uso, tabla de props, tabla de CSS custom properties; documentar hit-area en layout y estructura de contenido de GlowBorder)
- [x] 5.5 Bump de versión a `0.2.0` y entrada en CHANGELOG.md
