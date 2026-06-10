## 1. Project Setup

- [x] 1.1 Inicializar `package.json` con nombre `@fethabo/animated-ui`, versión `0.1.0`, peer deps de React 18+, y campos `main`/`module`/`types` apuntando a `dist/`
- [x] 1.2 Configurar `tsconfig.json` con target ES2020, JSX preserve, strict mode, y paths correctos
- [x] 1.3 Instalar y configurar `tsup` como build tool — entry points por componente + barrel export, output ESM y CJS con `.d.ts`
- [x] 1.4 Crear estructura de carpetas: `src/components/`, `src/hooks/`, `src/utils/`, `examples/`
- [x] 1.5 Configurar `.gitignore`, `tsup.config.ts`, y scripts de `package.json` (`build`, `dev`, `typecheck`)

## 2. CSS Injection System

- [x] 2.1 Implementar `src/utils/inject-styles.ts` — función `injectStyles(id: string, css: string)` con deduplicación por ID y guard de SSR (`typeof document !== 'undefined'`)
- [x] 2.2 Escribir tests de la función: no duplica style tags, no falla en SSR mock, los IDs siguen el formato `aui-<name>-styles`

## 3. Shared Hooks

- [x] 3.1 Implementar `src/hooks/useReducedMotion.ts` — retorna `boolean` basado en `window.matchMedia('(prefers-reduced-motion: reduce)')`
- [x] 3.2 Implementar `src/hooks/useMousePosition.ts` — retorna `{x, y}` relativo al elemento dado via `useRef`, con cleanup de event listeners
- [x] 3.3 Implementar `src/hooks/useResizeObserver.ts` — retorna `{width, height}` del elemento dado, reactivo al resize

## 4. AnimatedBackground — CSS Keyframes

- [x] 4.1 Crear `src/components/AnimatedBackground/types.ts` con la interfaz de props: `variant`, `colors`, `speed`, `intensity`, `fixed`, `className`, `style`, `respectReducedMotion`
- [x] 4.2 Crear `src/components/AnimatedBackground/variants/aurora.ts` — genera la string CSS con keyframes y CSS vars (`--aui-aurora-color-1..4`, `--aui-aurora-speed`, `--aui-aurora-blur`)
- [x] 4.3 Crear `src/components/AnimatedBackground/variants/mesh.ts` — gradientes radiales morphing con CSS vars
- [x] 4.4 Crear `src/components/AnimatedBackground/variants/noise.ts` — efecto grain/ruido con SVG `feTurbulence` animado o CSS
- [x] 4.5 Crear `src/components/AnimatedBackground/variants/beam.ts` — rayos de luz con CSS conic-gradient animado
- [x] 4.6 Implementar `src/components/AnimatedBackground/index.tsx` — monta el componente, llama `injectStyles` en `useEffect`, aplica CSS vars como inline styles, soporta `'use client'`, respeta `useReducedMotion`
- [x] 4.7 Verificar que todas las CSS custom properties están comentadas en el source con nombre, default, y descripción

## 5. PixelBackground — Canvas Renderer

- [x] 5.1 Crear `src/components/PixelBackground/types.ts` con interfaces: `PixelBackgroundProps`, `CellColorFn`, `BehaviorName`, `PixelBehavior`
- [x] 5.2 Implementar `src/components/PixelBackground/canvas-renderer.ts` — clase o módulo puro (sin React) que maneja: grilla de celdas, loop rAF, composición de behaviors por frame, dibujado en canvas
- [x] 5.3 Implementar `src/components/PixelBackground/behaviors/hover.ts` — calcula contribution de brillo basado en distancia gaussiana al mouse
- [x] 5.4 Implementar `src/components/PixelBackground/behaviors/idle.ts` — genera offsets de fase por celda (seeded), retorna `sin(t * speed + offset) * intensity`
- [x] 5.5 Implementar `src/components/PixelBackground/behaviors/reveal.ts` — ordena celdas por valor de matriz Bayer, aplica opacidad según progreso del reveal y posición en el orden dithered
- [x] 5.6 Implementar `src/components/PixelBackground/index.tsx` — monta canvas, usa `useResizeObserver` para adaptar dimensiones, instancia el canvas-renderer, pasa mouse position del `useMousePosition`, respeta `useReducedMotion` desactivando idle y reveal
- [x] 5.7 Verificar que el canvas se limpia correctamente en unmount (cancelar rAF, remover event listeners)

## 6. TiltCard — WAAPI Interaction

- [x] 6.1 Crear `src/components/TiltCard/types.ts` con `TiltCardProps` (incluyendo `maxAngle`, `perspective`, `glare`, `children`, `className`, `style`) y `TiltState` (`{ tiltX, tiltY, isHovering }`)
- [x] 6.2 Implementar la lógica de tilt en `src/components/TiltCard/index.tsx` — calcular ángulos desde posición del mouse relativa al centro del elemento, animar con `element.animate()` (WAAPI) con `fill: 'forwards'` y duración corta (~150ms)
- [x] 6.3 Implementar el render prop: detectar si `children` es función, si es así llamarla con el `TiltState` actual via `useState` sincronizado con el mouse
- [x] 6.4 Implementar el efecto glare: overlay `<div>` absoluto con `background: radial-gradient(...)` cuyos valores se calculan inversamente al tilt, solo renderizado si `glare={true}`
- [x] 6.5 Conectar `useReducedMotion` — si `reduce`, no animar (retornar tiltX=0, tiltY=0) pero mantener `isHovering` activo

## 7. Barrel Export y Tipos Públicos

- [x] 7.1 Crear `src/index.ts` exportando `AnimatedBackground`, `PixelBackground`, `TiltCard`, y sus tipos (`AnimatedBackgroundProps`, `PixelBackgroundProps`, `TiltCardProps`, `TiltState`)
- [ ] 7.2 Verificar que el build de tsup genera `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts` correctamente
- [ ] 7.3 Verificar tree-shaking: importar solo `TiltCard` y confirmar que el bundle no incluye código de los otros componentes

## 8. Ejemplos Copy-Paste

- [x] 8.1 Crear `examples/aurora-hero.tsx` — hero section completo con `AnimatedBackground variant="aurora"`, texto encima, sin imports del paquete (inline la lógica del componente)
- [x] 8.2 Crear `examples/pixel-card.tsx` — card con `PixelBackground` como fondo y `TiltCard` como wrapper, mostrando combinación de `hover` + `idle` behaviors
- [x] 8.3 Crear `examples/beam-section.tsx` — sección con `AnimatedBackground variant="beam"` mostrando customización de colores y velocidad

## 9. Verificación Final

- [ ] 9.1 Crear un proyecto Vite de prueba mínimo e instalar el paquete buildeado — verificar que los tres componentes funcionan
- [ ] 9.2 Verificar que no hay errores TypeScript con `tsc --noEmit`
- [ ] 9.3 Verificar que el paquete no tiene errores de SSR: renderizar cada componente con `renderToString` de React y confirmar que no lanza errores de `document`/`window`
