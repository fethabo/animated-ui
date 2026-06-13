# Proposal: particle-field-image-dissolve-sticky-scenes

## Why

La tanda v0.6+ cierra dos frentes a la vez: completa el Tier 4 (canvas ambicioso) con `ParticleField` e `ImageDissolve`, y cierra el Tier 3 con `StickyScenes` — el componente de scroll más ambicioso del roadmap. El valor de esta tanda está en la reutilización agresiva de lo que ya existe: `ParticleField` aplica el patrón canvas + RAF de `PixelBackground`; `ImageDissolve` expone como componente de primera clase la matriz Bayer que ya vive en el behavior `reveal` de `PixelBackground` (la "joya escondida" del roadmap); y `StickyScenes` reutiliza íntegramente el motor de scroll de v0.5 (`subscribeScroll` + CSS vars, sin React state en el hot path) sin ninguna nueva decisión de motor.

## What Changes

- Nuevo componente `ParticleField`: campo de partículas sobre canvas con repulsión/atracción configurable al cursor. Implementa su propio canvas + RAF (incompatible con el modelo de grid de `PixelBackground`) siguiendo el mismo patrón de lifecycle.
- Nuevo componente `ImageDissolve`: transición entre dos imágenes usando dithering ordered (matriz Bayer 8×8), activada por cambio de `src`. Trabaja con `drawImage` + `getImageData` sobre un canvas superpuesto; sin dependencias externas.
- Nuevo componente `StickyScenes`: secciones sticky que transicionan entre "escenas" durante el scroll. Subcomponente público `StickyScenes.Scene`. Progreso escrito como `--aui-scene-progress` (CSS var) sin React state en el hot path — mismo patrón que `ParallaxLayers`.
- Refactor interno: extracción de `BAYER_8` de `src/components/PixelBackground/behaviors/reveal.ts` a `src/utils/bayer-matrix.ts`; `reveal.ts` pasa a importar desde allí. API pública de `PixelBackground` sin cambios.
- Tres ejemplos standalone nuevos en `/examples` (uno por componente, sin importar el paquete).
- Documentación de los tres componentes en el README.

Sin breaking changes: solo se agregan exports nuevos; el refactor de `reveal.ts` es interno.

**Fuera de alcance de este change**: bump de versión y CHANGELOG (los maneja el usuario con tagman); composición automática entre componentes; motor de canvas 3D o WebGL; CSS scroll-driven animations (descartado en v0.5 por soporte de browsers).

## Capabilities

### New Capabilities

- `particle-field`: canvas con campo de partículas autónomas, repulsión/atracción al cursor configurable, customizable via props y `--aui-particle-*`.
- `image-dissolve`: transición de imagen con dithering ordered (Bayer 8×8), customizable via props (duración, dirección).
- `sticky-scenes`: contenedor sticky con transición entre escenas ligada al scroll; subcomponente público `StickyScenes.Scene`; progreso como `--aui-scene-progress` y activación via `data-aui-active`.

### Modified Capabilities

- `pixel-background`: refactor interno del behavior `reveal` (extrae `BAYER_8` a `src/utils/bayer-matrix.ts`). Sin cambios en API pública ni en comportamiento observable.

## Impact

- **Código nuevo**: `src/components/ParticleField/`, `src/components/ImageDissolve/`, `src/components/StickyScenes/`, `src/utils/bayer-matrix.ts`; exports en `src/index.ts`.
- **Reutiliza**: `injectStyles`, `useReducedMotion`, `useInView` (activación lazy de ParticleField y StickyScenes cuando el contenedor es visible); `subscribeScroll` (StickyScenes); patrón canvas + RAF de `PixelBackground`; `BAYER_8` extraída a util compartida.
- **Refactor**: `PixelBackground/behaviors/reveal.ts` importa `BAYER_8` desde `src/utils/bayer-matrix.ts`.
- **Docs**: README (tres secciones nuevas + tres filas en la tabla de componentes), `/examples` (tres archivos nuevos).
- **Sin dependencias nuevas**: canvas 2D context, `drawImage`, `getImageData` y `requestAnimationFrame` son APIs nativas, conforme a `component-authoring`.
- **Verificación**: tests vitest de lógica pura (cálculo de posición y velocidad de partículas, bayer-matrix, cálculo de progreso de escenas) + patrón `*.ssr.test.ts` + verificación visual en `test-app`.
- **Versionado**: excluido — bump de versión y CHANGELOG los maneja el usuario con tagman.
