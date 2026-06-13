# Tasks: particle-field-image-dissolve-sticky-scenes

## 1. Utilidad compartida: bayer-matrix

- [x] 1.1 Crear `src/utils/bayer-matrix.ts`: exportar `BAYER_8` (la constante 8×8 extraída de `PixelBackground/behaviors/reveal.ts`) y una función pura `bayerThreshold(row: number, col: number): number` → [0, 1] que normaliza el valor de la celda a [0, 1]
- [x] 1.2 Actualizar `src/components/PixelBackground/behaviors/reveal.ts` para importar `bayerThreshold` desde `src/utils/bayer-matrix.ts`; verificar que el comportamiento del behavior `reveal` es idéntico al anterior
- [x] 1.3 Tests vitest de `bayer-matrix.ts`: verificar que `bayerThreshold(0,0)` retorna el valor normalizado correcto, que cubre el rango completo [0,1) y que el patrón es el Bayer 8×8 estándar

## 2. ParticleField

- [x] 2.1 Crear `src/components/ParticleField/types.ts` con `ParticleFieldProps` (count, speed, radius, color, cursorInteraction, cursorRadius, respectReducedMotion, className, style + spread HTML)
- [x] 2.2 Implementar módulo puro `src/components/ParticleField/physics.ts` con las funciones de inicialización de partículas (`createParticles`), integración de velocidad por frame (`stepParticles`), rebote en bordes y cálculo de fuerza cursor-a-partícula (testeable de forma aislada)
- [x] 2.3 Implementar `src/components/ParticleField/index.tsx`: `'use client'`, canvas que llena el contenedor (`useResizeObserver` para redimensionado), RAF loop en `useEffect`, materializar props estéticas como `--aui-particle-color/radius` inline en el root; CSS via `injectStyles`
- [x] 2.4 Detener RAF bajo reduced motion (vía `useReducedMotion`); mostrar estado inicial estático en el canvas
- [x] 2.5 Tests vitest de `physics.ts`: createParticles (count, posiciones dentro del bounds), stepParticles (integración, rebote en borde), fuerza cursor (repulsión/atracción dentro del radio, sin efecto fuera)

## 3. ImageDissolve

- [x] 3.1 Crear `src/components/ImageDissolve/types.ts` con `ImageDissolveProps` (src, alt, duration, respectReducedMotion, className, style + spread HTML)
- [x] 3.2 Implementar módulo puro `src/components/ImageDissolve/dissolve.ts` con la lógica de animación: dado un `ImageData` de origen y destino, el progreso [0,1] y la función `bayerThreshold`, retorna el `ImageData` del frame actual; testeable sin DOM
- [x] 3.3 Implementar `src/components/ImageDissolve/index.tsx`: `'use client'`, `<img>` + `<canvas>` superpuesto, `useEffect` que observa cambios de `src`; captura imagen anterior con `drawImage` antes de swapear `<img>.src`; RAF que avanza el progreso Bayer; degradación silenciosa ante `SecurityError` de `getImageData` (imagen cross-origin sin CORS)
- [x] 3.4 Con reduced motion: swap instantáneo de `src` sin canvas animation
- [x] 3.5 Tests vitest de `dissolve.ts`: frame en progress=0 (solo imagen origen), progress=1 (solo imagen destino), progreso intermedio (píxeles con threshold ≤ progress aparecen del destino); test SSR del componente (renderiza `<img>` con `alt` sin acceder al canvas)

## 4. StickyScenes

- [x] 4.1 Crear `src/components/StickyScenes/types.ts` con `StickyScenesProps` (children, sceneDuration, respectReducedMotion, className, style + spread HTML) y `StickySceneProps` (children, className, style + spread HTML)
- [x] 4.2 Implementar módulo puro `src/components/StickyScenes/progress.ts` con `stickyProgress(containerTop: number, containerHeight: number, viewportHeight: number): number` → [0,1] y `sceneAt(totalProgress: number, nScenes: number): { sceneIndex: number, sceneProgress: number }` (testeables de forma aislada)
- [x] 4.3 Implementar `src/components/StickyScenes/index.tsx`: `'use client'`, contenedor exterior con altura `viewportHeight + nScenes × sceneDuration`, inner wrapper `position: sticky; top: 0; height: 100dvh`; `subscribeScroll` en `useEffect` que escribe `--aui-scene-progress` y `--aui-scene-index` via `setProperty`; actualizar `data-aui-active` en cada `Scene` referenciada por ref
- [x] 4.4 Implementar `StickyScenes.Scene`: wrapper `<div>` que recibe `data-aui-active` del parent via ref/context, acepta `className`, `style` y spread de props HTML; CSS via `injectStyles`
- [x] 4.5 Con reduced motion: inyectar CSS con `transition: none` sobre los wrappers de Scene para suprimir transiciones animadas; el tracking de scroll sigue activo
- [x] 4.6 Tests vitest de `progress.ts`: `stickyProgress` (top=0 → 0, top=-(containerHeight-viewportHeight) → 1, clamping); `sceneAt` (progreso en límites entre escenas, primera y última escena)

## 5. Integración del paquete

- [x] 5.1 Exportar `ParticleField`, `ImageDissolve`, `StickyScenes` (con `.Scene`) y sus tipos públicos desde `src/index.ts`; verificar tree-shaking
- [x] 5.2 Verificar typecheck completo y build limpio con tsup (ESM + CJS + `.d.ts`) sin regresiones; en particular verificar que la actualización de `reveal.ts` no cambia el output del componente `PixelBackground`
- [x] 5.3 Correr suite completa de tests (`npm test`) sin regresiones

## 6. Documentación y ejemplos

- [x] 6.1 Crear `examples/particle-field.tsx` standalone (solo React; demo con repulsión al cursor y un panel de controles simple para `count` y `cursorInteraction`)
- [x] 6.2 Crear `examples/image-dissolve.tsx` standalone (galería de tres imágenes que transicionan on-click usando el efecto Bayer)
- [x] 6.3 Crear `examples/sticky-scenes.tsx` standalone (tres escenas con contenido distinto; la segunda usa `--aui-scene-progress` para una transición interpolada via `calc()`)
- [x] 6.4 README: tres filas nuevas en la tabla de componentes + sección por componente (snippet de uso, tabla de props, tabla de CSS custom properties); documentar el prerequisito de CORS de `ImageDissolve` y el layout de las Scene de `StickyScenes`
- [x] 6.5 Actualizar ROADMAP.md: marcar v0.6+ como ✅ y actualizar las tablas de Tier 3 (`StickyScenes`) y Tier 4 (`ParticleField`, `ImageDissolve`)

## 7. Verificación final

- [x] 7.1 Agregar los tres componentes a `test-app` y verificar visualmente (partículas con repulsión, dissolve con imagen same-origin, sticky con tres escenas y progreso `calc()`, reduced motion en los tres)
- [x] 7.2 Revisar el definition-of-done de `component-authoring` punto por punto antes de dar por completo el change

> Nota: bump de versión y CHANGELOG quedan fuera de este change — los maneja el usuario con tagman.
