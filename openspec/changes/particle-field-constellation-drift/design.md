## Context

`ParticleField` (entregado en v0.6) usa el motor canvas + RAF con física en un módulo puro (`src/components/ParticleField/physics.ts`): velocidad aleatoria, rebote en bordes, fuerza cursor-a-partícula O(N), estado en ref sin re-renders. Esta tanda (Wave B) lo extiende con dos ejes ortogonales —líneas de conexión y modos de deriva— sin tocar el motor ni agregar dependencias. Se documenta en `design.md` porque la prop `links` cambia la clase de complejidad (introduce O(N²) opt-in) y porque la decisión "extender vs. nuevo componente" merece registro.

## Goals / Non-Goals

**Goals:**
- Agregar el efecto "constellation/network" (líneas entre partículas cercanas y al cursor) como capacidad opt-in.
- Agregar modos de deriva (`snow`, `embers`, `bubbles`) que reusen el mismo motor y la misma superficie de props.
- Preservar el comportamiento actual byte por byte cuando se usan los defaults (`drift='bounce'`, `links=false`).
- Mantener la física en el módulo puro testeable.

**Non-Goals:**
- No se crea un `ConstellationField` separado: se extiende `ParticleField` (decisión 1).
- No se implementa colisión entre partículas ni física de fluidos.
- No se introduce particionado espacial (quadtree) en esta tanda; el O(N²) se acota con `count` moderado y `linkDistance` (ver riesgos).
- No se cambia el modelo de color por-partícula existente más allá de agregar el color de líneas.

## Decisions

### Decisión 1: Extender `ParticleField`, no crear un componente nuevo

Las líneas y los modos de deriva son variaciones del mismo motor (partículas sobre canvas con RAF). Un componente paralelo (`ConstellationField`, `SnowField`) duplicaría el setup de canvas, resize, DPR, tracking de cursor y reduced motion. Se sigue el precedente de `PixelBackground`, que creció con behaviors combinables en vez de multiplicar componentes. *Alternativa descartada:* componentes separados por efecto — descartada por duplicación de motor y por fragmentar la API que el usuario ya conoce.

### Decisión 2: Las líneas son opt-in para preservar el costo O(N)

El design original de `ParticleField` eligió explícitamente fuerza O(N) cursor-a-partícula (no entre pares). Las líneas de conexión son inherentemente O(N²) (hay que medir distancias entre pares). Para no degradar el caso común, `links` arranca en `false` y el doble loop solo corre cuando se activa. Se documenta el trade-off y se acota con `linkDistance` (las partículas fuera de rango se descartan barato con una comparación de bounding box antes de la raíz cuadrada). *Alternativa descartada para esta tanda:* quadtree/grid spatial hashing — reduciría a ~O(N) pero agrega complejidad y código; se difiere hasta que el perfil lo justifique (con `count` típico de fondos, N²  es tolerable).

### Decisión 3: Modos de deriva como estrategias de integración en `physics.ts`

`drift` selecciona cómo se integra el movimiento por frame y cómo se trata el borde:
- `bounce` (default): velocidad aleatoria + inversión en bordes (lo actual, sin cambios).
- `snow`: velocidad vertical positiva dominante + ruido horizontal suave; wrap por arriba.
- `embers`: velocidad vertical negativa + desvanecimiento por vida (alpha decae, reingresa desde abajo con alpha pleno).
- `bubbles`: velocidad vertical negativa + bamboleo sinusoidal horizontal; wrap por abajo.

La selección se implementa como una función pura por modo dentro de `physics.ts`, manteniendo `stepParticles` testeable. La fuerza del cursor se suma sobre la velocidad resultante en todos los modos. *Alternativa descartada:* un sistema de "behaviors" combinables como `PixelBackground` — los modos de deriva son mutuamente excluyentes (una partícula no cae y sube a la vez), así que un enum `drift` es más claro que behaviors componibles.

### Decisión 4: `embers` necesita ciclo de vida; el resto no

Para que las brasas se desvanezcan, cada partícula lleva una vida normalizada que decae y se reinicia al reingresar. Esto agrega un campo opcional al tipo `Particle` (`life`), usado solo por `embers`; los demás modos lo ignoran. Se mantiene la estructura de datos plana (sin clases) para no cambiar el patrón actual.

## Risks / Trade-offs

- **[O(N²) de las líneas escala mal con `count` alto]** → Opt-in (off por default), descarte temprano por bounding box antes del `sqrt`, y documentación recomendando `count` moderado (~80–120) y `linkDistance` acotada al activar `links`. Quadtree queda como mejora futura si hace falta.
- **[Wrap vs bounce cambia la sensación visual]** → Es intencional por modo; se documenta. `bounce` sigue rebotando para no alterar el default.
- **[Desvanecimiento de `embers` y dibujo por-partícula con alpha]** → El alpha por partícula obliga a setear `globalAlpha` o color rgba por partícula en el draw; se agrupa por lotes donde se pueda para no matar el rendimiento. Aceptable para `count` de fondo.
- **[Reduced motion con `links`]** → Se dibuja un único cuadro estático con líneas calculadas una vez (no por frame), evitando el costo O(N²) recurrente en el estado estático.

## Migration Plan

Aditivo, sin breaking changes:
1. Extender `physics.ts` con los modos de deriva y el campo `life` opcional; sumar tests por modo.
2. Agregar el cálculo y dibujo de líneas en `index.tsx` detrás de `links`.
3. Extender `types.ts` y exportar `DriftMode`.
4. Documentar README + actualizar ejemplo `/examples` + `ROADMAP.md` (Tier 4).

Rollback: revertir el commit; los defaults garantizan que consumers existentes no perciban cambio aunque no se revierta.

## Open Questions

- ¿`linkColor` default debería derivar del `color` de partícula con alpha reducido, o ser una var independiente? Se propone derivar con alpha por default y permitir override por prop/CSS.
- ¿Conviene un quinto modo `rain` (vertical rápido, sin deriva)? Se deja fuera del alcance; el enum permite sumarlo después sin romper la API.
