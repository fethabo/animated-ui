## Why

`ParticleField` hoy hace una sola cosa: partículas que rebotan y reaccionan al cursor con repulsión/atracción (fuerza O(N) cursor-a-partícula). Las dos extensiones más pedidas para campos de partículas de fondo son (a) **constelación/network** — líneas que conectan partículas cercanas y al cursor, el clásico "particles.js hero" — y (b) **modos de deriva** que cambian el carácter del movimiento (nieve cayendo, brasas subiendo, burbujas). Ambas caben en el motor canvas + RAF ya existente, sin dependencias nuevas. Extender `ParticleField` (en vez de crear componentes paralelos) mantiene un solo motor y una superficie de props coherente, igual que `PixelBackground` creció con behaviors combinables.

## What Changes

- **Líneas de conexión (constellation)**: nueva prop `links` para dibujar segmentos entre partículas a menos de cierta distancia, con opacidad proporcional a la cercanía, y opcionalmente líneas hacia el cursor. Esto introduce un cálculo entre pares O(N²) **opt-in** (apagado por default para preservar el costo O(N) actual), con `linkDistance`, `linkColor` y `linkWidth` configurables.
- **Modos de deriva (drift)**: nueva prop `drift` (`'bounce' | 'snow' | 'embers' | 'bubbles'`, default `'bounce'` = comportamiento actual). `snow` cae con deriva horizontal suave, `embers` sube y se desvanece, `bubbles` asciende con leve bamboleo. Los modos con dirección reingresan partículas por el borde opuesto (wrap) en vez de rebotar.
- **Sin cambios incompatibles**: los defaults reproducen exactamente el comportamiento actual (`drift='bounce'`, `links=false`), por lo que el componente existente sigue funcionando idéntico.

## Capabilities

### New Capabilities

<!-- Ninguna capability nueva: se extiende la existente. -->

### Modified Capabilities

- `particle-field`: Se agregan líneas de conexión opt-in (constellation, O(N²) opt-in) y modos de deriva (`bounce`/`snow`/`embers`/`bubbles`), manteniendo el comportamiento actual como default.

## Impact

- **Código**: extiende `src/components/ParticleField/physics.ts` (modos de deriva: integración del movimiento, wrap vs bounce, ciclo de vida para embers) y `index.tsx` (dibujo de líneas, lectura de nuevas CSS vars). Tipos nuevos en `types.ts`.
- **Exports**: nuevos tipos (`DriftMode`) desde `src/index.ts`; `ParticleFieldProps` extendido.
- **Docs**: actualizar la sección `ParticleField` del README (nuevas props y CSS vars `--aui-particle-link-*`), actualizar el ejemplo de `/examples`, y `ROADMAP.md` (Tier 4).
- **Performance**: el costo O(N²) de las líneas es opt-in y documentado; se acota con `linkDistance` y se recomienda mantener `count` moderado al activarlo.
- **Dependencias**: ninguna nueva. **Sin breaking changes**.
