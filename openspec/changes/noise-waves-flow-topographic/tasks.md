## 1. Primitiva compartida: ruido coherente seedable

- [x] 1.1 Crear `src/utils/noise.ts`: simplex 2D propio (tabla de permutación via `createPrng` existente), API `createNoise2D(seed) => (x, y) => number` en rango [-1, 1] + decorator `fbm(noise, octaves, lacunarity?, gain?)`
- [x] 1.2 Tests vitest de `noise.ts`: determinismo (misma seed ⇒ mismos valores), rango [-1, 1], continuidad (muestras vecinas acotadas), isotropía razonable, `fbm` preserva la firma; sin `Math.random`/`Date.now`
- [x] 1.3 Test SSR de que importar el módulo no toca el DOM

## 2. WavesBackground

- [x] 2.1 Crear `src/components/WavesBackground/types.ts` (`lines`, `amplitude`, `speed`, `colors`, `lineWidth`, `seed`, `respectReducedMotion`, `className`, `style`)
- [x] 2.2 Crear `src/components/WavesBackground/geometry.ts` (módulo puro: puntos de cada línea dado noise + t, espaciado ~8 px, interpolación de color por línea) + tests
- [x] 2.3 Crear `src/components/WavesBackground/index.tsx`: `'use client'`, canvas `absolute inset:0` + RAF, resize via observer con DPR, reduced motion = frame estático `t=0`, CSS vars `--aui-waves-*`
- [x] 2.4 Test `index.ssr.test.ts`

## 3. FlowField

- [x] 3.1 Crear `src/components/FlowField/types.ts` (`count`, `speed`, `colors`, `fade`, `scale`, `background`, `seed`, `respectReducedMotion`, `className`, `style`)
- [x] 3.2 Crear `src/components/FlowField/simulation.ts` (módulo puro: avance de partículas por ángulo del ruido, wrap/respawn determinista, pre-simulación con presupuesto fijo para reduced motion) + tests (determinismo, partículas dentro de límites tras wrap)
- [x] 3.3 Crear `src/components/FlowField/index.tsx`: `'use client'`, canvas + RAF, persistencia por velo semitransparente del color `background`, estado en refs, reduced motion = trazos pre-simulados estáticos, CSS vars `--aui-flow-*`
- [x] 3.4 Test `index.ssr.test.ts`

## 4. TopographicBackground

- [x] 4.1 Crear `src/components/TopographicBackground/types.ts` (`levels`, `color`, `lineWidth`, `scale`, `speed`, `seed`, `respectReducedMotion`, `className`, `style`)
- [x] 4.2 Crear `src/components/TopographicBackground/marching-squares.ts` (módulo puro: extracción de contornos por nivel sobre grilla de celdas, interpolación en aristas) + tests con campos sintéticos conocidos
- [x] 4.3 Crear `src/components/TopographicBackground/index.tsx`: `'use client'`, capa offscreen recalculada a intervalos (no por frame), `speed=0`/reduced motion = estático sin RAF, resize con debounce, CSS vars `--aui-topo-*`
- [x] 4.4 Test `index.ssr.test.ts`

## 5. Exports y documentación

- [x] 5.1 Exportar `WavesBackground`, `FlowField`, `TopographicBackground` y sus tipos desde `src/index.ts` (`noise.ts` queda interna, criterio `prng.ts`); agregar entry points a `package.json#exports` y `tsup.config.ts`
- [x] 5.2 Documentar en README: fila en la tabla + sección (snippet, props, CSS custom properties) por componente; nota de que FlowField pinta su propio fondo
- [x] 5.3 Crear ejemplos standalone en `/examples` para los tres componentes (solo React; el ejemplo incluye un simplex mínimo inline)
- [x] 5.4 Actualizar `ROADMAP.md`: marcar Wave H ✅ y registrar `noise.ts` en la tabla de motores/primitivas

## 6. Verificación (definition-of-done)

- [x] 6.1 Demo + descriptor de controles en `test-app` por componente (incluye `seed` y `respectReducedMotion`) y alta en `demos/index.js`
- [ ] 6.2 Verificación visual: ondulación continua sin repetición evidente; trazos del flow field con fade; curvas topográficas sin artefactos de grilla; evolución lenta sin parpadeo
- [x] 6.3 Verificar presupuestos de performance del design (muestreo por grilla/línea, offscreen en Topographic, un sample por partícula) y determinismo SSR↔hidratación
- [x] 6.4 Correr vitest completo + typecheck + build; confirmar tree-shaking
- [x] 6.5 Revisar cumplimiento de la spec `component-authoring` para cada componente antes de archivar
