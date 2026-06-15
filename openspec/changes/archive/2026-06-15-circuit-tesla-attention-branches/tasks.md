## 1. Primitiva compartida: PRNG seedable

- [x] 1.1 Crear `src/utils/prng.ts` (hash de seed tipo `xmur3` + generador `mulberry32`; API: `createPrng(seed: string | number) => () => number` y helpers `range`, `pick`, `int`)
- [x] 1.2 Tests vitest de `prng.ts`: determinismo (misma seed ⇒ misma secuencia), distribución razonable, sin uso de `Math.random`/`Date.now`
- [x] 1.3 Test SSR de que importar el módulo no toca el DOM ni aleatoriedad global

## 2. CircuitBackground (+ helper de pulso en polilínea)

- [x] 2.1 Crear `src/components/CircuitBackground/types.ts` (`seed`, `density`, `trackColor`, `pulseColor`, `pulseSpeed`, `pulseCount`, `lineWidth`, `respectReducedMotion`, `className`, `style`)
- [x] 2.2 Crear `src/components/CircuitBackground/router.ts`: ruteo procedural ortogonal sobre grilla con random walk seedado, pads en uniones/terminaciones, tramos rectos favorecidos; devuelve polilíneas + pads
- [x] 2.3 Tests vitest de `router.ts`: determinismo por seed, giros a 90°, densidad escala con el parámetro, no excede el área
- [x] 2.4 Crear `src/utils/polyline-pulse.ts` (recorrer una polilínea con una cabeza de luz + estela que decae; función pura de posición dado progreso) + tests
- [x] 2.5 Crear `src/components/CircuitBackground/index.tsx`: `'use client'`, canvas + RAF, dibujo de pistas/pads (una vez) y pulsos por frame, CSS vars `--aui-circuit-*`, reduced motion estático, resize determinista
- [x] 2.6 Test `index.ssr.test.ts`

## 3. TeslaCoil (+ helper de rayo jagged)

- [x] 3.1 Crear `src/utils/jagged-bolt.ts` (generar polilínea quebrada entre origen y destino con jitter seedado; subdivisión recursiva tipo midpoint-displacement) + tests
- [x] 3.2 Crear `src/components/TeslaCoil/types.ts` (`color`, `boltCount`, `lineWidth`, `frequency`, `reach`, `jitter`, `followCursor`, `origin`, `respectReducedMotion`, `children`, `className`, `style`)
- [x] 3.3 Crear `src/components/TeslaCoil/index.tsx`: `'use client'`, canvas + RAF con `pointer-events:none`, rayos ambientales que se regeneran, rayo dirigido al cursor por ref (sin re-render), reduced motion estático, touch sin seguimiento
- [x] 3.4 Test `index.ssr.test.ts` + verificación de que `children` queda interactivo

## 4. AttentionCue (idle-watcher + geometría de target — paso simple de la idea #6)

- [x] 4.1 Crear helper interno de idle + target: detección de inactividad (reset en pointermove/leave) y resolución de `target` (`RefObject | Element | string`) → rect y vector desde el cursor; con tests donde la lógica sea pura
- [x] 4.2 Crear `src/components/AttentionCue/types.ts` (`target?`, `idleDelay`, `color`, `duration`, `speed`, `maxDistance`, `respectReducedMotion`, `children`, `className`, `style`)
- [x] 4.3 Crear `src/components/AttentionCue/index.tsx`: `'use client'`, overlay `pointer-events:none`, trazo dirigido al target (modo directed) o ambiental (sin target), desvanecido al moverse, desactivado bajo reduced motion, CSS vars `--aui-cue-*`
- [x] 4.4 Test `index.ssr.test.ts` + verificación de clicks pasando a través del overlay

## 5. GuidingBranches (ramas orgánicas — paso final de la idea #6)

- [x] 5.1 Crear `src/components/GuidingBranches/types.ts` (`target?`, `aesthetic`, `idleDelay`, `color`, `duration`, `speed`, `maxDistance`, densidad/profundidad de ramificación, `respectReducedMotion`, `children`, `className`, `style`)
- [x] 5.2 Crear `src/components/GuidingBranches/aesthetics/` con módulos enchufables: `roots.ts` (default) y `lightning.ts` (reutiliza `jagged-bolt`); contrato común de generación/avance dado prng + origen + sesgo direccional + parámetros
- [x] 5.3 Tests vitest de las estéticas (crecimiento acotado por `maxDistance`, sesgo hacia el target en modo directed, determinismo por seed)
- [x] 5.4 Crear `src/components/GuidingBranches/index.tsx`: `'use client'`, canvas overlay `pointer-events:none`, reutiliza el idle-watcher + geometría de target del paso 4, selección de estética por prop, crecimiento animado por RAF, retracción al moverse, desactivado bajo reduced motion, CSS vars `--aui-branches-*`
- [x] 5.5 Test `index.ssr.test.ts` + verificación de que el target sigue clickeable

## 6. Exports y documentación

- [x] 6.1 Exportar `CircuitBackground`, `TeslaCoil`, `AttentionCue`, `GuidingBranches` y sus tipos desde `src/index.ts` (PRNG y helpers permanecen internos)
- [x] 6.2 Documentar en README las cuatro secciones (snippet, props, CSS custom properties) y una nota sobre la categoría "Idle / Attention"
- [x] 6.3 Crear ejemplos standalone en `/examples` para los cuatro componentes (sin importar el paquete, solo React)
- [x] 6.4 Actualizar `ROADMAP.md`: Tier 4 (CircuitBackground, TeslaCoil) + categoría nueva de cursor/idle (AttentionCue, GuidingBranches)

## 7. Verificación (definition-of-done)

- [x] 7.1 Verificar visualmente en `test-app`: calidad del trazado del circuito (criterio de aceptación), rayos de la bobina (ambient + cursor), cue dirigido a un botón, ramas en ambient y directed con al menos dos estéticas
- [x] 7.2 Confirmar determinismo SSR↔hidratación (sin saltos visuales) en Next/Astro
- [x] 7.3 Correr vitest completo y typecheck; confirmar tree-shaking
- [x] 7.4 Revisar cumplimiento de la spec `component-authoring` para cada componente antes de archivar

## 8. Refinamientos (feedback de verificación visual)

- [x] 8.1 CircuitBackground: ruteo más continuo (tramos largos; el walk rodea obstáculos en vez de cortarse) y `density` escala claramente la cantidad de trazos
- [x] 8.2 TeslaCoil: rayos al cursor más notorios (varios `cursorBolts`, más gruesos/brillantes con núcleo blanco, regenerados por frame) + demo/example con tarjeta para que el contenido no se pierda
- [x] 8.3 AttentionCue: por default **solo luz** (destello con glow que aparece/desaparece, sin línea sólida); props nuevas `head` (punta), `curve` (curvatura) y `showGuide`; CSS var `--aui-cue-curve`
- [x] 8.4 GuidingBranches: foco **ambient 360°** (interacción del puntero con su entorno; `target` opcional) + estética nueva `circuit` (ortogonal) enchufable
- [x] 8.5 Actualizar specs (deltas), README, ejemplos `/examples` y demos del test-app para los refinamientos; vitest + typecheck + build verdes
- [x] 8.6 Fix overlap del título del harness con el contenido centrado de un demo (título como overlay superior `pointer-events:none`)
- [x] 8.7 AttentionCue: prop `marker` (`'beam' | 'footprints'`) — huellas que avanzan hacia el destino
- [x] 8.8 GuidingBranches: `roots` con curvatura orgánica configurable (`curl` + CSS var `--aui-branches-curl`) y afinado de ramas (taper por profundidad)
- [x] 8.9 AttentionCue: `curve` con bezier cúbica que termina apuntando al ref (la punta siempre mira al target) + orientación correcta de `footprints` (hacia el destino)
- [x] 8.10 TeslaCoil: los rayos al cursor convergen todos en el punto del puntero (no terminan en línea) + demo/example dejan ver el nodo central (botón abajo, sin cartel encima)
- [x] 8.11 GuidingBranches: prop `loop` (default `false`) — el trazo queda estático hasta que el puntero se mueve
- [x] 8.12 AttentionCue: huella de 2 blobs invertida (suela adelante, dedito atrás) — orientación correcta hacia el destino
- [x] 8.13 TeslaCoil: prop `cursorTrigger` (`'hover' | 'click'`) — rayos al cursor solo con click si se pide
