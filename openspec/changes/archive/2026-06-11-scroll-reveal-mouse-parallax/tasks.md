# Tasks: scroll-reveal-mouse-parallax

## 1. Hook useInView

- [x] 1.1 Implementar `src/hooks/useInView.ts`: IntersectionObserver en `useEffect`, opciones `threshold`/`rootMargin`/`once`, `false` en SSR/primer render, `true` como fallback si no hay IntersectionObserver, disconnect al desmontar
- [x] 1.2 Tests vitest de `useInView`: test SSR (patrón `*.ssr.test.ts`) + comportamiento con IntersectionObserver mockeado (entra, once, modo continuo, fallback sin IO)

## 2. ScrollReveal

- [x] 2.1 Crear `src/components/ScrollReveal/types.ts` con `ScrollRevealProps` (children, direction, distance, duration, stagger, threshold, once, respectReducedMotion, className, style + spread del root)
- [x] 2.2 Crear generador de CSS como módulo puro testeable (estado oculto por dirección, transición a visible bajo `data-aui-visible`, delay por `--aui-reveal-i`, easing/duración/distancia via vars con fallback) + helper de vars inline
- [x] 2.3 Implementar `src/components/ScrollReveal/index.tsx`: `'use client'`, `useInView` + `injectStyles`, hijos directos envueltos en `.aui-reveal-item` con `--aui-reveal-i` inline, `data-aui-visible` en el root, contenido visible directo bajo reduced motion
- [x] 2.4 Tests vitest del generador de CSS (direcciones, dirección `none` solo fade, vars con fallback) y SSR del componente (markup contiene el contenido)

## 3. MouseParallax

- [x] 3.1 Crear `src/components/MouseParallax/types.ts` con `MouseParallaxProps` (children, ease, respectReducedMotion + spread del root) y `MouseParallaxLayerProps` (depth + spread)
- [x] 3.2 Implementar normalización pura `parallaxOffset(rect, clientX, clientY)` → `{x, y}` en [-1, 1] como módulo testeable
- [x] 3.3 Implementar `src/components/MouseParallax/index.tsx`: root que escribe `--aui-parallax-x/y` por mousemove (sin estado de React), reset a 0 en mouseleave, handler inerte bajo reduced motion (via `useReducedMotion`: los handlers disparan post-hidratación, donde el hook ya es correcto), CSS de capas inyectado via `injectStyles`
- [x] 3.4 Implementar `MouseParallax.Layer` con `depth` → `--aui-parallax-depth` inline y translate por `calc()`
- [x] 3.5 Tests vitest de `parallaxOffset` (centro → 0, esquinas → ±1, clamping fuera del rect) + test SSR de `MouseParallax` con layers

## 4. Integración del paquete

- [x] 4.1 Exportar `useInView`, `ScrollReveal`, `MouseParallax` (con `.Layer`) y tipos públicos desde `src/index.ts`; entries en `tsup.config.ts` y subpaths `./scroll-reveal` y `./mouse-parallax` en `package.json`
- [x] 4.2 Verificar typecheck, build (`tsup`) y suite completa de tests sin regresiones

## 5. Documentación y ejemplos

- [x] 5.1 Crear `/examples/scroll-reveal.tsx` standalone (solo React, TypeScript mínimo, sin importar el paquete)
- [x] 5.2 Crear `/examples/mouse-parallax.tsx` standalone (solo React, TypeScript mínimo, sin importar el paquete)
- [x] 5.3 README: filas en la tabla de componentes, secciones de ScrollReveal y MouseParallax (snippet, props, CSS vars), documentar `useInView` junto a los demás hooks, el trade-off de contenido oculto pre-hidratación y el patrón de root-como-grid
- [x] 5.4 Actualizar ROADMAP.md: MouseParallax (Tier 1) y ScrollReveal (Tier 3) hechos, v0.4 ✅, hook `useInView` disponible en la tabla de motores/hooks

## 6. Verificación final

- [x] 6.1 Agregar ambos componentes a `test-app` (sección con scroll real para ScrollReveal, escena con capas para MouseParallax) y verificar visualmente (reveal con stagger, once, parallax con profundidades opuestas, reduced motion)
- [x] 6.2 Revisar el definition-of-done de `component-authoring` punto por punto antes de dar por completo el change

> Nota: bump de versión y CHANGELOG quedan fuera de este change — los maneja el usuario con tagman.
