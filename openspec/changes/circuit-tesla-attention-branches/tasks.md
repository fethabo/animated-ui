## 1. Primitiva compartida: PRNG seedable

- [ ] 1.1 Crear `src/utils/prng.ts` (hash de seed tipo `xmur3` + generador `mulberry32`; API: `createPrng(seed: string | number) => () => number` y helpers `range`, `pick`, `int`)
- [ ] 1.2 Tests vitest de `prng.ts`: determinismo (misma seed ⇒ misma secuencia), distribución razonable, sin uso de `Math.random`/`Date.now`
- [ ] 1.3 Test SSR de que importar el módulo no toca el DOM ni aleatoriedad global

## 2. CircuitBackground (+ helper de pulso en polilínea)

- [ ] 2.1 Crear `src/components/CircuitBackground/types.ts` (`seed`, `density`, `trackColor`, `pulseColor`, `pulseSpeed`, `pulseCount`, `lineWidth`, `respectReducedMotion`, `className`, `style`)
- [ ] 2.2 Crear `src/components/CircuitBackground/router.ts`: ruteo procedural ortogonal sobre grilla con random walk seedado, pads en uniones/terminaciones, tramos rectos favorecidos; devuelve polilíneas + pads
- [ ] 2.3 Tests vitest de `router.ts`: determinismo por seed, giros a 90°, densidad escala con el parámetro, no excede el área
- [ ] 2.4 Crear `src/utils/polyline-pulse.ts` (recorrer una polilínea con una cabeza de luz + estela que decae; función pura de posición dado progreso) + tests
- [ ] 2.5 Crear `src/components/CircuitBackground/index.tsx`: `'use client'`, canvas + RAF, dibujo de pistas/pads (una vez) y pulsos por frame, CSS vars `--aui-circuit-*`, reduced motion estático, resize determinista
- [ ] 2.6 Test `index.ssr.test.ts`

## 3. TeslaCoil (+ helper de rayo jagged)

- [ ] 3.1 Crear `src/utils/jagged-bolt.ts` (generar polilínea quebrada entre origen y destino con jitter seedado; subdivisión recursiva tipo midpoint-displacement) + tests
- [ ] 3.2 Crear `src/components/TeslaCoil/types.ts` (`color`, `boltCount`, `lineWidth`, `frequency`, `reach`, `jitter`, `followCursor`, `origin`, `respectReducedMotion`, `children`, `className`, `style`)
- [ ] 3.3 Crear `src/components/TeslaCoil/index.tsx`: `'use client'`, canvas + RAF con `pointer-events:none`, rayos ambientales que se regeneran, rayo dirigido al cursor por ref (sin re-render), reduced motion estático, touch sin seguimiento
- [ ] 3.4 Test `index.ssr.test.ts` + verificación de que `children` queda interactivo

## 4. AttentionCue (idle-watcher + geometría de target — paso simple de la idea #6)

- [ ] 4.1 Crear helper interno de idle + target: detección de inactividad (reset en pointermove/leave) y resolución de `target` (`RefObject | Element | string`) → rect y vector desde el cursor; con tests donde la lógica sea pura
- [ ] 4.2 Crear `src/components/AttentionCue/types.ts` (`target?`, `idleDelay`, `color`, `duration`, `speed`, `maxDistance`, `respectReducedMotion`, `children`, `className`, `style`)
- [ ] 4.3 Crear `src/components/AttentionCue/index.tsx`: `'use client'`, overlay `pointer-events:none`, trazo dirigido al target (modo directed) o ambiental (sin target), desvanecido al moverse, desactivado bajo reduced motion, CSS vars `--aui-cue-*`
- [ ] 4.4 Test `index.ssr.test.ts` + verificación de clicks pasando a través del overlay

## 5. GuidingBranches (ramas orgánicas — paso final de la idea #6)

- [ ] 5.1 Crear `src/components/GuidingBranches/types.ts` (`target?`, `aesthetic`, `idleDelay`, `color`, `duration`, `speed`, `maxDistance`, densidad/profundidad de ramificación, `respectReducedMotion`, `children`, `className`, `style`)
- [ ] 5.2 Crear `src/components/GuidingBranches/aesthetics/` con módulos enchufables: `roots.ts` (default) y `lightning.ts` (reutiliza `jagged-bolt`); contrato común de generación/avance dado prng + origen + sesgo direccional + parámetros
- [ ] 5.3 Tests vitest de las estéticas (crecimiento acotado por `maxDistance`, sesgo hacia el target en modo directed, determinismo por seed)
- [ ] 5.4 Crear `src/components/GuidingBranches/index.tsx`: `'use client'`, canvas overlay `pointer-events:none`, reutiliza el idle-watcher + geometría de target del paso 4, selección de estética por prop, crecimiento animado por RAF, retracción al moverse, desactivado bajo reduced motion, CSS vars `--aui-branches-*`
- [ ] 5.5 Test `index.ssr.test.ts` + verificación de que el target sigue clickeable

## 6. Exports y documentación

- [ ] 6.1 Exportar `CircuitBackground`, `TeslaCoil`, `AttentionCue`, `GuidingBranches` y sus tipos desde `src/index.ts` (PRNG y helpers permanecen internos)
- [ ] 6.2 Documentar en README las cuatro secciones (snippet, props, CSS custom properties) y una nota sobre la categoría "Idle / Attention"
- [ ] 6.3 Crear ejemplos standalone en `/examples` para los cuatro componentes (sin importar el paquete, solo React)
- [ ] 6.4 Actualizar `ROADMAP.md`: Tier 4 (CircuitBackground, TeslaCoil) + categoría nueva de cursor/idle (AttentionCue, GuidingBranches)

## 7. Verificación (definition-of-done)

- [ ] 7.1 Verificar visualmente en `test-app`: calidad del trazado del circuito (criterio de aceptación), rayos de la bobina (ambient + cursor), cue dirigido a un botón, ramas en ambient y directed con al menos dos estéticas
- [ ] 7.2 Confirmar determinismo SSR↔hidratación (sin saltos visuales) en Next/Astro
- [ ] 7.3 Correr vitest completo y typecheck; confirmar tree-shaking
- [ ] 7.4 Revisar cumplimiento de la spec `component-authoring` para cada componente antes de archivar
