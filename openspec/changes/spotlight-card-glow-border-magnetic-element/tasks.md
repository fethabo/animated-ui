# Tasks: spotlight-card-glow-border-magnetic-element

## 1. SpotlightCard

- [ ] 1.1 Crear `src/components/SpotlightCard/types.ts` con `SpotlightCardProps` (color, radius, opacity, respectReducedMotion, className, style + spread de props HTML del div root)
- [ ] 1.2 Implementar `src/components/SpotlightCard/index.tsx`: `'use client'`, overlay con `radial-gradient` centrado en `var(--aui-spotlight-x) var(--aui-spotlight-y)`, `pointer-events: none`, CSS via `injectStyles` en `useEffect`
- [ ] 1.3 Implementar tracking de cursor: escribir `--aui-spotlight-x/y` con `element.style.setProperty` en `mousemove` (sin setState); transición de opacidad del overlay en `mouseenter`/`mouseleave` via CSS
- [ ] 1.4 Materializar props `color`, `radius`, `opacity` como `--aui-spotlight-color/radius/opacity` inline en el root, pisables desde CSS en cascada
- [ ] 1.5 Tests vitest: test SSR (`*.ssr.test.ts` verifica que el componente renderiza sin acceder a `window`/`document`) + test del generador de estilos CSS (vars con fallback)

## 2. GlowBorder

- [ ] 2.1 Crear `src/components/GlowBorder/types.ts` con `GlowBorderProps` (colors, speed, width, radius, opacity, followCursor, respectReducedMotion, className, style + spread)
- [ ] 2.2 Implementar estructura de tres capas en `src/components/GlowBorder/index.tsx`: root (padding = width, overflow hidden, border-radius) → capa glow oversized con `conic-gradient` rotando via `@keyframes transform: rotate` → contenido con background propio; CSS via `injectStyles`
- [ ] 2.3 Implementar modo `followCursor`: calcular ángulo `atan2` desde el centro del componente hacia el cursor; interpolar con WAAPI-con-momentum (patrón TiltCard) sobre `transform: rotate` de la capa glow; cancelar keyframes al activar y restablecer al desactivar
- [ ] 2.4 Materializar props como `--aui-glow-color-1..3/speed/width/radius/opacity` inline en el root; detener loop bajo reduced motion (gradiente estático); modo `followCursor` queda activo bajo reduced motion
- [ ] 2.5 Implementar módulo puro `src/components/GlowBorder/geometry.ts` con el cálculo de ángulo `atan2` (testeable de forma aislada)
- [ ] 2.6 Tests vitest: test unitario de `geometry.ts` (ángulo en las cuatro esquinas, desde el centro) + test SSR del componente

## 3. MagneticElement

- [ ] 3.1 Crear `src/components/MagneticElement/types.ts` con `MagneticElementProps`, `MagneticState = { offsetX: number, offsetY: number, isActive: boolean }` y soporte de `children` como `ReactNode | (state: MagneticState) => ReactNode`
- [ ] 3.2 Implementar módulo puro `src/components/MagneticElement/offset.ts` con el cálculo de `(rect, clientX, clientY, strength)` → `{ offsetX, offsetY }` (testeable de forma aislada)
- [ ] 3.3 Implementar `src/components/MagneticElement/index.tsx`: `'use client'`, root con padding `hitArea` (transparente, amplía la zona sensible), contenido trasladado con WAAPI-con-momentum sobre `translate` hacia el cursor, escalado por `strength`
- [ ] 3.4 Implementar retorno elástico al salir del root: keyframes WAAPI con overshoot de regreso a `translate(0, 0)`; actualizar `isActive` y `offsetX/Y` en el callback del render prop
- [ ] 3.5 Con reduced motion: `offsetX`/`offsetY` quedan en 0, WAAPI no se ejecuta; `isActive` sigue reportándose
- [ ] 3.6 Tests vitest: tests unitarios de `offset.ts` (centro → offset nulo, esquina → offset proporcional a strength, clamping) + test SSR del componente con children como función

## 4. Integración del paquete

- [ ] 4.1 Exportar `SpotlightCard`, `GlowBorder`, `MagneticElement` y sus tipos públicos desde `src/index.ts`; verificar que importar uno no arrastra el código de los demás al bundle
- [ ] 4.2 Verificar typecheck completo y build limpio con tsup (ESM + CJS + `.d.ts`) sin regresiones en componentes existentes
- [ ] 4.3 Correr suite completa de tests (`npm test`) sin regresiones

## 5. Documentación y ejemplos

- [ ] 5.1 Crear `examples/spotlight-card.tsx` standalone (sin importar el paquete, solo React; TypeScript mínimo convertible a `.jsx` removiendo anotaciones de tipo inline)
- [ ] 5.2 Crear `examples/glow-border.tsx` standalone (incluir variante `followCursor`)
- [ ] 5.3 Crear `examples/magnetic-element.tsx` standalone (incluir uso del render prop para un efecto derivado)
- [ ] 5.4 README: tres filas nuevas en la tabla de componentes + sección por componente (snippet de uso, tabla de props, tabla de CSS custom properties); documentar la estructura de wrapper de GlowBorder y el hit-area de MagneticElement
- [ ] 5.5 Actualizar ROADMAP.md: marcar v0.2 como ✅ en la tabla de releases y SpotlightCard/GlowBorder/MagneticElement como hechos en la tabla del Tier 1

## 6. Verificación final

- [ ] 6.1 Agregar los tres componentes a `test-app` y verificar visualmente (spotlight tracking, glow loop y followCursor, atracción magnética con retorno elástico, reduced motion desactivando loop y traslación)
- [ ] 6.2 Revisar el definition-of-done de `component-authoring` punto por punto antes de dar por completo el change

> Nota: bump de versión y CHANGELOG quedan fuera de este change — los maneja el usuario con tagman.
