# Tasks: parallax-layers-scroll-progress

## 1. Motor de scroll (util interna)

- [x] 1.1 Implementar `src/utils/scroll-driver.ts`: `subscribeScroll(callback)` con listeners pasivos de `scroll`/`resize` sobre window, coalescing por RAF (máx. una ejecución por frame), ejecución inicial al suscribir, retorna cleanup; SSR-safe (no-op sin window)
- [x] 1.2 Implementar lógica pura de progreso: `viewportProgress(rectTop, rectHeight, viewportHeight)` → [-1, 1] clampeado y `pageProgress(scrollTop, scrollHeight, clientHeight)` → [0, 1] con guarda de división por cero
- [x] 1.3 Tests vitest de la lógica pura (asomando/-1, centrado/0, saliendo/1, clamping; página sin overflow → 0) + test SSR del driver (patrón `*.ssr.test.ts`) + test de coalescing (múltiples eventos → un callback por frame, con RAF mockeado)

## 2. ParallaxLayers

- [x] 2.1 Crear `src/components/ParallaxLayers/types.ts` con `ParallaxLayersProps` (children, respectReducedMotion + spread del root) y `ParallaxLayersLayerProps` (depth + spread)
- [x] 2.2 Implementar `src/components/ParallaxLayers/index.tsx`: root que se suscribe al driver solo mientras `useInView` (`once: false`, `rootMargin: '100px'`, `threshold: 0`) reporta visible, escribe `--aui-parallax-scroll` via `viewportProgress`, no se suscribe bajo reduced motion (vars a 0); CSS de capas inyectado via `injectStyles` (translate por `calc()`, sin transition)
- [x] 2.3 Implementar `ParallaxLayers.Layer` con `depth` → `--aui-parallax-scroll-depth` inline (default `40px` como fallback en el CSS)
- [x] 2.4 Test SSR de `ParallaxLayers` con layers (markup con capas en posición original)

## 3. ScrollProgress

- [x] 3.1 Crear `src/components/ScrollProgress/types.ts` con `ScrollProgressProps` (position, color, height, trackColor, zIndex, respectReducedMotion + spread del root)
- [x] 3.2 Implementar `src/components/ScrollProgress/index.tsx`: track fijo top/bottom con `pointer-events: none` y `aria-hidden`, barra interior con `transform: scaleX(var(--aui-progress, 0))` y `transform-origin: left`, driver escribe `--aui-progress` via `pageProgress`; CSS via `injectStyles`, vars `--aui-progress-*` inline desde props
- [x] 3.3 Tests: generador/estructura de CSS si se extrae como módulo + test SSR (barra en 0, `aria-hidden` presente) — CSS quedó como const del componente (sin lógica que amerite módulo aparte); cubierto por SSR + tests del driver

## 4. Integración del paquete

- [x] 4.1 Exportar `ParallaxLayers` (con `.Layer`), `ScrollProgress` y tipos públicos desde `src/index.ts`; entries en `tsup.config.ts` y subpaths `./parallax-layers` y `./scroll-progress` en `package.json`
- [x] 4.2 Verificar typecheck, build (`tsup`) y suite completa de tests sin regresiones

## 5. Documentación y ejemplos

- [x] 5.1 Crear `/examples/parallax-layers.tsx` standalone (solo React, TypeScript mínimo, sin importar el paquete)
- [x] 5.2 Crear `/examples/scroll-progress.tsx` standalone (solo React, TypeScript mínimo, sin importar el paquete)
- [x] 5.3 README: filas en la tabla de componentes, secciones de ambos (snippet, props, CSS vars), documentar el patrón de capas sobredimensionadas para evitar huecos en ParallaxLayers y el z-index/headers fijos en ScrollProgress
- [x] 5.4 Actualizar ROADMAP.md: v0.5 ✅, ParallaxLayers y ScrollProgress hechos en Tier 3, motor de scroll de posición continua decidido (listener + RAF escribiendo CSS vars) con nota del criterio de migración futura a CSS scroll-driven animations
- [x] 5.5 Actualizar AGENTS.md si menciona los motores disponibles (hooks + motor de scroll agregados a Convenciones rápidas)

## 6. Verificación final

- [x] 6.1 Agregar ambos componentes a `test-app` (página con altura suficiente para scroll real; ParallaxLayers con capas de profundidades opuestas; ScrollProgress global) y verificar visualmente (parallax suave, sin trabajo fuera de viewport, barra de progreso, reduced motion)
- [x] 6.2 Revisar el definition-of-done de `component-authoring` punto por punto antes de dar por completo el change

> Nota: bump de versión y CHANGELOG quedan fuera de este change — los maneja el usuario con tagman.
