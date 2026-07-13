## 1. CursorTrail

- [x] 1.1 Crear `src/components/CursorTrail/physics.ts`: módulo puro con emisión por umbral de distancia, pool de partículas (vida/fade/drift) y geometría del modo `line` (polyline con grosor/alpha decreciente); tests vitest (throttle por distancia, culling)
- [x] 1.2 Crear `src/components/CursorTrail/types.ts` (`mode`, `color`/`colors`, `size`, `length`/`life`, `emitEvery`, `respectReducedMotion`, `children`, `className`, `style`)
- [x] 1.3 Crear `src/components/CursorTrail/index.tsx`: `'use client'`, canvas overlay `pointer-events:none`, tracking del puntero por ref, RAF activo solo con partículas vivas, desactivado total bajo reduced motion
- [x] 1.4 Test `index.ssr.test.ts` + test de no-op bajo reduced motion

## 2. CustomCursor

- [x] 2.1 Crear `src/components/CustomCursor/types.ts` (`dotSize`, `ringSize`, `color`, `lag`, `hoverScale`, `hideNativeCursor`, `respectReducedMotion`, `children`, `className`, `style`)
- [x] 2.2 Crear `src/components/CustomCursor/index.tsx`: `'use client'`, guarda `(hover: hover) and (pointer: fine)` (touch = children intactos), dot+ring posicionados por CSS vars (`--aui-cursor-x/y`) sin re-renders, lag por transition, delegación `pointerover` + `closest(...)` para el estado `hover`, `data-aui-cursor-state`, `cursor: none` scoped al contenedor, reduced motion = seguimiento directo sin lag
- [x] 2.3 CSS inyectado con vars `--aui-cursor-*` (tamaños, color, lag, hoverScale) pisables en cascada
- [x] 2.4 Test `index.ssr.test.ts` + test de la guarda touch (sin nodos custom) y del atributo de estado en hover

## 3. ImageTrail

- [x] 3.1 Crear `src/components/ImageTrail/emitter.ts`: módulo puro con umbral de distancia, rotación cíclica del pool de imágenes y cap `maxConcurrent`; tests vitest
- [x] 3.2 Crear `src/components/ImageTrail/types.ts` (`images`, `size`, `emitEvery`, `duration`, `maxConcurrent`, `imageClassName`, `imageStyle`, `respectReducedMotion`, `children`, `className`, `style`)
- [x] 3.3 Crear `src/components/ImageTrail/index.tsx`: `'use client'`, capa `pointer-events:none`, nodos `<img>` efímeros autolimpiados en `animationend` (patrón RippleContainer) con keyframes inyectados, precarga de `images` en efecto, no-op bajo reduced motion
- [x] 3.4 Test `index.ssr.test.ts` + test de autolimpieza de nodos y de rotación cíclica

## 4. StarfieldBackground

- [x] 4.1 Crear `src/components/StarfieldBackground/starfield.ts`: módulo puro de generación del campo (posiciones/radios/fases via `createPrng(seed)`) y spawn/trayectoria de fugaces; tests vitest (determinismo por seed, regeneración por tamaño)
- [x] 4.2 Crear `src/components/StarfieldBackground/types.ts` (`seed`, `density`, `colors`, `background`, `speed`, `shootingStars`, `fixed`, `respectReducedMotion`, `className`, `style`)
- [x] 4.3 Crear `src/components/StarfieldBackground/index.tsx`: `'use client'`, capa offscreen estática (patrón CircuitBackground) + composición por frame (titileo alpha senoidal + fugaces), resize via `useResizeObserver` con regeneración determinista, reduced motion = frame estático sin RAF
- [x] 4.4 Test `index.ssr.test.ts`

## 5. MatrixRain

- [x] 5.1 Crear `src/components/MatrixRain/rain.ts`: módulo puro con estado por columna (posición/velocidad/delay de reinicio) y selección de glifos del charset via PRNG; tests vitest (determinismo, reinicio de columna)
- [x] 5.2 Crear `src/components/MatrixRain/types.ts` (`seed`, `charset`, `color`, `headColor`, `background`, `fontSize`, `speed`, `fixed`, `respectReducedMotion`, `className`, `style`)
- [x] 5.3 Crear `src/components/MatrixRain/index.tsx`: `'use client'`, veladura semitransparente por frame (patrón FlowField) + `fillText` de cabezas, grilla derivada de `fontSize` con cap de columnas, resize via `useResizeObserver`, reduced motion = frame estático de columnas pre-dibujadas
- [x] 5.4 Test `index.ssr.test.ts`

## 6. Exports y documentación

- [x] 6.1 Exportar los cinco componentes y sus tipos desde `src/index.ts`; agregar cinco entry points a `package.json#exports` y `tsup.config.ts`
- [x] 6.2 Documentar en README: fila en la tabla de componentes + sección (snippet, tabla de props, tabla de CSS custom properties donde aplique) por componente; notas de performance (densidad/fontSize) y del alcance del `cursor: none`
- [x] 6.3 Crear ejemplos standalone en `/examples` para los cinco componentes (sin importar el paquete, solo React)
- [x] 6.4 Marcar Wave K ✅ en `ROADMAP.md` (Tier 4: StarfieldBackground, MatrixRain; Tier 5: CursorTrail, CustomCursor, ImageTrail)

## 7. Verificación (definition-of-done)

- [x] 7.1 Demo + descriptor de controles en `test-app` para cada componente (incluye control estándar de `respectReducedMotion`) y alta en `demos/index.js`
- [x] 7.2 Verificación visual en `test-app`: trail en ambos modos con throttle; cursor custom con estados idle/hover/down y guarda touch; image trail con autolimpieza y cap; starfield determinista con fugaces; matrix rain con trail y reinicios — calibrar defaults de `emitEvery` (design.md, open question)
- [x] 7.3 Correr vitest completo + typecheck + build; confirmar tree-shaking de los entry points nuevos
- [x] 7.4 Revisar cumplimiento de la spec `component-authoring` para cada componente antes de archivar
