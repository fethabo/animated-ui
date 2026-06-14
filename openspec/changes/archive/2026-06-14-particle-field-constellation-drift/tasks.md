## 1. Física: modos de deriva

- [x] 1.1 Extender `src/components/ParticleField/types.ts` con `DriftMode` (`'bounce'|'snow'|'embers'|'bubbles'`) y las nuevas props (`drift`, `links`, `linkDistance`, `linkColor`, `linkWidth`, `linkCursor`)
- [x] 1.2 Agregar campo opcional `life` al tipo `Particle` y a `createParticles` (inicialización por modo)
- [x] 1.3 Implementar las estrategias de integración por modo en `physics.ts` (bounce sin cambios; snow/embers/bubbles con wrap; embers con decaimiento de vida)
- [x] 1.4 Tests vitest de `physics.ts`: cada modo (dirección dominante, wrap por borde correcto, decaimiento/reinicio de vida en embers, default idéntico al actual)

## 2. Líneas de conexión (constellation)

- [x] 2.1 Implementar el cálculo de pares O(N²) opt-in con descarte por bounding box antes del `sqrt`, y conexión opcional al cursor, en módulo puro testeable (e.g. `links.ts`)
- [x] 2.2 Tests vitest de `links.ts`: pares dentro/fuera de `linkDistance`, opacidad proporcional a la cercanía, inclusión del cursor
- [x] 2.3 Dibujar las líneas en el draw de `index.tsx` detrás de `links`, leyendo `--aui-particle-link-color/-width/-distance` de la cascada

## 3. Integración en el componente

- [x] 3.1 Cablear las nuevas props en `index.tsx`: pasar `drift` a `stepParticles`, aplicar fuerza de cursor sobre la deriva, manejar alpha por partícula en embers
- [x] 3.2 Materializar las nuevas CSS vars (`--aui-particle-link-*`) en el root y verificar override por cascada
- [x] 3.3 Implementar el estado estático bajo reduced motion incluyendo el dibujo único de líneas si `links` está activo
- [x] 3.4 Verificar que los defaults (`drift='bounce'`, `links=false`) reproducen el comportamiento actual (test de regresión en `physics.ts`)

## 4. Exports y documentación

- [x] 4.1 Exportar el tipo `DriftMode` desde `src/index.ts` y confirmar `ParticleFieldProps` extendido
- [x] 4.2 Actualizar la sección `ParticleField` del README: nuevas props (`drift`, `links`, `linkDistance`, `linkColor`, `linkWidth`, `linkCursor`), nuevas CSS vars, y nota de performance sobre el O(N²) opt-in
- [x] 4.3 Actualizar el ejemplo de `/examples/ParticleField` mostrando constellation y un modo de deriva
- [x] 4.4 Actualizar `ROADMAP.md` (Tier 4) reflejando la extensión de ParticleField

## 5. Verificación (definition-of-done)

- [x] 5.1 Verificar visualmente en `test-app`: constellation (con y sin cursor), los tres modos de deriva, reduced motion y SSR
- [x] 5.2 Correr vitest completo y typecheck
- [x] 5.3 Revisar cumplimiento de la spec `component-authoring` antes de archivar
