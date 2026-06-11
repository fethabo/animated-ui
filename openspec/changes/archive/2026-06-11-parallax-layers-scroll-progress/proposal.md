# Proposal: parallax-layers-scroll-progress

## Why

El roadmap define la tanda v0.5 como `ParallaxLayers` + `ScrollProgress`, los dos componentes que necesitan posición continua de scroll. Es la tanda que resuelve la única decisión arquitectónica genuinamente nueva pendiente del roadmap: el **motor de scroll** (scroll listener + RAF vs CSS scroll-driven animations), documentada como decisión abierta desde la foundation y diferida deliberadamente hasta este change. Con `useInView` ya cubriendo entrar/salir del viewport (v0.4), esto completa el territorio scroll para todo lo que viene (StickyScenes en v0.6+ reutiliza el mismo motor).

## What Changes

- **Decisión arquitectónica**: motor de scroll de posición continua — listener pasivo de `scroll` + RAF que escribe CSS custom properties directamente sobre el elemento (sin estado de React), encapsulado en una util interna compartida. CSS scroll-driven animations queda descartada por ahora (requiere mantener un fallback JS completo igual); el design documenta la comparación y el criterio de migración futura.
- Nuevo componente `ParallaxLayers`: contenedor con capas a distintas profundidades (`ParallaxLayers.Layer` con prop `depth`) desplazadas según el progreso del contenedor a través del viewport — el primo de scroll de `MouseParallax`, con API simétrica.
- Nuevo componente `ScrollProgress`: barra de progreso de lectura de la página, fija arriba o abajo, animada con `scale` compositado.
- Util interna compartida `scroll-driver` (suscripción a scroll con throttle por RAF) + lógica pura de progreso testeable.
- Dos ejemplos standalone nuevos en `/examples` (uno por componente, sin importar el paquete).
- Documentación de los dos componentes en el README; actualización del ROADMAP (v0.5, Tier 3, motor de scroll decidido).

Sin breaking changes: solo se agregan exports nuevos.

**Fuera de alcance de este change**: bump de versión y CHANGELOG (los maneja el usuario con tagman); `StickyScenes` (v0.6+); exponer el motor de scroll como hook público (queda interno hasta que un tercer consumidor lo justifique, mismo criterio que v0.2).

## Capabilities

### New Capabilities

- `parallax-layers`: contenedor de capas con profundidad ligadas a la posición de scroll, customizable via props y `--aui-parallax-scroll-*`, sin re-renders de React por frame.
- `scroll-progress`: indicador de progreso de lectura de la página, customizable via props y `--aui-progress-*`, sin re-renders de React por frame.

### Modified Capabilities

(ninguna — los componentes y hooks existentes no cambian su comportamiento)

## Impact

- **Código nuevo**: `src/utils/scroll-driver.ts` (+ lógica pura de progreso), `src/components/ParallaxLayers/`, `src/components/ScrollProgress/`; exports en `src/index.ts`, entries en tsup y subpaths en `package.json`.
- **Reutiliza**: `injectStyles`, `useReducedMotion`; el patrón de CSS vars sin re-renders (SpotlightCard/MouseParallax) y el patrón de subcomponente `Layer` (MouseParallax).
- **Docs**: README (dos componentes), `/examples` (dos archivos), ROADMAP (estados + motor decidido).
- **Sin dependencias nuevas**: scroll events, RAF y CSS transforms son APIs nativas, conforme a `component-authoring`.
- **Verificación**: tests vitest para lógica pura y SSR + verificación visual en `test-app` (requiere scroll real).
- **Versionado**: excluido — tagman (a cargo del usuario).
