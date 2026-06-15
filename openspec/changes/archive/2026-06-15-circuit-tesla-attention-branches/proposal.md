## Why

Wave C es la tanda "flagship" de canvas generativo: cuatro efectos de alto impacto visual que el paquete no puede hacer hoy porque le faltan **primitivas generativas** (un PRNG seedable y helpers de dibujo de trazos/pulsos). Son los efectos más diferenciadores del roadmap: un fondo de circuito eléctrico, una bobina de Tesla con rayos, y un director de atención que dibuja el camino hacia un elemento cuando el mouse queda quieto (primero un cue simple, luego ramas orgánicas). Tres de los cuatro comparten primitivas, por lo que conviene construirlos en una sola tanda y en orden: el circuito establece el PRNG seedable y el recorrido de polilínea con luz; la bobina establece el generador de "rayo jagged"; las ramas orgánicas reutilizan ambos.

## What Changes

- **Nuevo `CircuitBackground`**: fondo sobre `<canvas>` con pistas estilo PCB generadas proceduralmente (ruteo ortogonal sobre grilla con nodos/pads), y pulsos de luz que viajan por las pistas (cabeza con glow + estela que se desvanece). Generación **seedable y determinista** (estable entre repaints/SSR). Customizable: densidad, colores de pista y de luz, velocidad y frecuencia de pulsos, seed.
- **Nuevo `TeslaCoil`**: contenedor con un nodo central que arroja rayos (arcos eléctricos jagged) hacia afuera en todas direcciones; con el cursor sobre el contenedor, además dirige rayos hacia el puntero. Reutiliza el generador de rayo. Customizable: color, cantidad/grosor de rayos, frecuencia, alcance, jitter.
- **Nuevo `AttentionCue`** (idea #6, paso 1 — cue simple): wrapper que detecta inactividad del mouse y, tras un retardo, dibuja un trazo/indicador animado **dirigido hacia un elemento referenciado** (un `ref` o selector) para "mostrar el camino" hacia, por ejemplo, un botón. Modo ambient (sin target) y modo directed (hacia el target). Se desvanece al moverse el mouse.
- **Nuevo `GuidingBranches`** (idea #6, paso final — ramas orgánicas): misma idea que `AttentionCue` pero con ramas orgánicas generativas que crecen desde el puntero (tipo raíces/rayo), en modo ambient (todas las direcciones) o directed (sesgadas hacia el target). Diseñado para soportar **estéticas intercambiables** y personalizables (color, duración, velocidad, distancia máxima desde el mouse, densidad de ramificación).
- **Nueva infraestructura compartida**: util de PRNG seedable (`src/utils/prng.ts`) y helpers de dibujo de trazos/pulsos/rayos reutilizables, todos zero-deps y testeables.

## Capabilities

### New Capabilities

- `circuit-background`: Componente `CircuitBackground` — fondo de circuito PCB procedural seedable con pulsos de luz recorriendo las pistas.
- `tesla-coil`: Componente `TeslaCoil` — nodo central que emite rayos jagged hacia afuera y dirigidos al cursor en hover.
- `attention-cue`: Componente `AttentionCue` — director de atención simple que, tras inactividad del mouse, dibuja un trazo dirigido a un elemento referenciado (modos ambient/directed).
- `guiding-branches`: Componente `GuidingBranches` — ramas orgánicas generativas desde el puntero en idle, con estéticas intercambiables y sesgo opcional hacia un target.

### Modified Capabilities

<!-- Ninguna. -->

## Impact

- **Código nuevo**: `src/components/CircuitBackground/`, `src/components/TeslaCoil/`, `src/components/AttentionCue/`, `src/components/GuidingBranches/`. Utils nuevas en `src/utils/prng.ts` y helpers de dibujo generativo (trazo de polilínea con pulso, rayo jagged) en módulos puros compartidos.
- **Exports**: cuatro componentes y sus tipos desde `src/index.ts`; el PRNG y helpers permanecen internos al paquete (se promueven a públicos solo si un tercer consumidor lo justifica, criterio del repo).
- **Docs**: cuatro secciones nuevas en README + cuatro ejemplos standalone en `/examples`; `ROADMAP.md` (Tier 4 canvas + categoría nueva "cursor/idle").
- **Restricción de generación aleatoria**: se prohíbe `Math.random()` / `Date.now()` en module-load y en la generación; toda aleatoriedad pasa por el PRNG seedable (determinismo para SSR y estabilidad entre repaints).
- **Dependencias**: ninguna nueva (criterio no negociable). **Sin breaking changes** (todo aditivo).
