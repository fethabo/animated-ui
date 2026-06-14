## Context

Wave C es la tanda de **canvas generativo**. A diferencia de Waves A y B (que cosechan motores existentes), esta introduce primitivas que el paquete no tiene: un PRNG seedable y helpers de dibujo de trazos/pulsos/rayos. Los cuatro componentes usan el motor canvas + RAF ya establecido (patrón `ParticleField`/`PixelBackground`), pero comparten generadores. Por eso se agrupan en una tanda y se construyen en un orden que permite reutilización. La restricción dura del entorno y del repo: **cero dependencias de runtime** y **nada de `Math.random()`/`Date.now()` en la generación** (determinismo para SSR/Vite/Next/Astro y estabilidad entre repaints).

Componentes y su relación con las primitivas:

```
        prng.ts (seedable)        polyline-pulse.ts        jagged-bolt.ts        idle-watcher (hook)
              │                          │                       │                      │
   ┌──────────┼──────────┐               │              ┌────────┴────────┐    ┌────────┴────────┐
   ▼          ▼          ▼               ▼              ▼                 ▼    ▼                 ▼
CircuitBackground  (ruteo PCB)   pulso de luz en pista   TeslaCoil    GuidingBranches    AttentionCue   GuidingBranches
```

## Goals / Non-Goals

**Goals:**
- Entregar cuatro efectos canvas de alto impacto sin dependencias nuevas.
- Establecer un PRNG seedable reutilizable y helpers de dibujo generativo, todos en módulos puros testeables.
- Generación determinista: misma `seed` ⇒ mismo resultado, estable SSR↔hidratación.
- `GuidingBranches` con arquitectura de estéticas intercambiables (extensible sin romper API).
- Director de atención en dos pasos: `AttentionCue` (simple, primero) y `GuidingBranches` (orgánico, final).

**Non-Goals:**
- No se introduce WebGL ni ningún motor de shaders (restricción explícita del usuario).
- No se promueven el PRNG ni los helpers a API pública en esta tanda (se mantienen internos hasta que un tercer consumidor lo justifique, criterio del repo: ver `scroll-driver.ts`).
- El ruteo de `CircuitBackground` NO busca validez eléctrica real (no es un simulador): busca apariencia PCB convincente.
- `AttentionCue` y `GuidingBranches` NO implementan throttling de scroll ni lógica de tour multi-paso; son cues de un solo objetivo.

## Decisions

### Decisión 1: Orden de construcción para maximizar reutilización

Se construye en este orden, y la tanda lo refleja en `tasks.md`:
1. **`prng.ts`** (PRNG seedable, base de todo).
2. **`CircuitBackground`** → produce `polyline-pulse.ts` (recorrer una polilínea con una cabeza de luz + estela) y consolida el uso del PRNG para generación de grafos.
3. **`TeslaCoil`** → produce `jagged-bolt.ts` (generar/dibujar un rayo quebrado con jitter y glow).
4. **`AttentionCue`** → produce el `idle-watcher` (detección de inactividad + geometría cursor→target). Cue simple: un solo trazo dirigido.
5. **`GuidingBranches`** → reutiliza `prng`, `jagged-bolt` (para la estética `lightning`), `idle-watcher` y la geometría de target. Es el paso final por ser el más complejo (crecimiento ramificado + estéticas intercambiables).

*Alternativa descartada:* tandas separadas por componente — se descartó porque fragmentaría las primitivas compartidas y obligaría a re-decidir el PRNG y el modelo de idle en cada una.

### Decisión 2: PRNG seedable propio (mulberry32 / xmur3), zero-deps

Se implementa un PRNG pequeño y rápido (e.g. hash de string `xmur3` para derivar la seed + `mulberry32` como generador), suficiente para ruido visual. Determinista por seed, sin estado global. Resuelve a la vez: (a) la prohibición de `Math.random()` en module-load del harness, (b) la estabilidad SSR↔cliente, y (c) la reproducibilidad por `seed` que pide `CircuitBackground`. *Alternativa descartada:* `crypto.getRandomValues` — no es seedable ni determinista, y no está garantizado en SSR.

### Decisión 3: Router de circuito — random walk ortogonal sobre grilla con pads (no maze, no autorouter)

El trazado se genera como **múltiples caminos de random walk sobre una grilla**, con giros restringidos a 90° (y opcionalmente 45° como segmentos de bisel en las esquinas, estética PCB), sembrando pads en inicios/fines/uniones. Es O(grilla), determinista por seed, y produce la estética "pistas de circuito" sin la complejidad de un autorouter real (que resuelve conectividad punto-a-punto y es caro y difícil de hacer "lindo"). Se evita el cruce caótico limitando celdas ya ocupadas y favoreciendo tramos rectos largos antes de girar (las pistas PCB "respiran"). *Alternativas consideradas:*
- *Maze/laberinto (DFS backtracking):* genera caminos conectados pero se ve laberíntico, no PCB. Descartado.
- *Autorouter A\* punto-a-punto:* el más "real" pero el más caro y el más difícil de tunear visualmente; sobre-ingeniería para un fondo decorativo. Descartado.
- *Random walk con pads (elegido):* mejor relación apariencia/costo/control, y deja los caminos como polilíneas listas para que `polyline-pulse` las recorra.

### Decisión 4: Modelo de "idle + target" compartido entre AttentionCue y GuidingBranches

La detección de inactividad (timer que se resetea en `pointermove`/`pointerleave`) y la resolución del `target` (aceptar `RefObject | Element | string selector` → calcular el rect y el vector desde el cursor) se encapsulan en un helper interno reutilizable. `AttentionCue` lo usa para dibujar un único trazo; `GuidingBranches` lo usa para sesgar el crecimiento. *Alternativa descartada:* duplicar la lógica de idle en cada componente — descartada por DRY y porque el comportamiento de reset debe ser idéntico.

### Decisión 5: Estéticas de GuidingBranches como módulos enchufables

Cada estética (`roots`, `lightning`, `vines`, …) es un módulo en `GuidingBranches/aesthetics/` que expone una función pura de generación/avance del crecimiento dado el PRNG, el origen, el sesgo direccional y los parámetros (`color`, `speed`, `duration`, `maxDistance`, densidad). El componente selecciona el módulo por la prop `aesthetic`. Esto cumple el pedido del usuario: "definido de forma que podamos agregar nuevas estéticas" sin tocar la API. Sigue el patrón `variants/` de `AnimatedBackground` y `behaviors/` de `PixelBackground`. *Alternativa descartada:* una sola función con muchos `if` por estética — descartada por no escalar a estéticas nuevas limpiamente.

### Decisión 6: Idle/branches/cue se desactivan bajo reduced motion; tesla/circuit degradan a estático

`AttentionCue` y `GuidingBranches` son efectos **autónomos disparados por temporizador** (no por input directo), por lo que con reduced motion NO se dibujan en absoluto (consistente con cómo el paquete trata loops/idle). `CircuitBackground` y `TeslaCoil` degradan a un cuadro estático (circuito dibujado sin pulsos; rayos fijos), porque su contenido base sigue siendo informativo/decorativo aun sin movimiento. El seguimiento del cursor de `TeslaCoil`, al ser input directo, MAY permanecer.

## Risks / Trade-offs

- **[El router puede verse "spaghetti" en vez de PCB]** → Es el mayor riesgo de calidad. Mitigación: favorecer tramos rectos largos, limitar densidad de giros, sembrar pads, y exponer `seed` para que el consumer elija un trazado que le guste. La calidad del router es criterio de aceptación de la tanda (verificación visual obligatoria).
- **[`Math.random`/`Date.now` prohibidos]** → Todo aleatorio pasa por `prng.ts` sembrado por una `seed` (prop) o por una semilla por defecto fija; el tiempo de animación viene del timestamp del RAF (no de `Date.now()` en module-load).
- **[Glow/shadowBlur en canvas es caro por frame]** → Acotar `shadowBlur`, dibujar el glow solo en la cabeza de los pulsos/puntas de rayo, y limitar la cantidad de elementos animados simultáneos. Documentar `count`/`boltCount` razonables.
- **[GuidingBranches puede sentirse intrusivo como UX]** → `idleDelay` configurable y default conservador; se desactiva con reduced motion; el overlay es `pointer-events:none` para nunca bloquear. Documentar buenas prácticas (no abusar como "dark pattern").
- **[Resolver `target` por selector es frágil si el DOM cambia]** → Resolver el target al momento de activarse el cue (no cachear el rect); si no se encuentra, degradar a modo ambient sin error.
- **[SSR y canvas]** → Igual que `ParticleField`: nada de canvas/DOM en render; init en `useEffect`; determinismo por seed evita saltos en hidratación.

## Migration Plan

Aditivo, sin breaking changes. Orden de implementación = Decisión 1:
1. `src/utils/prng.ts` + tests.
2. `CircuitBackground` (+ `polyline-pulse.ts` + tests del router y del recorrido).
3. `TeslaCoil` (+ `jagged-bolt.ts` + tests).
4. `AttentionCue` (+ idle-watcher/target-geometry + tests).
5. `GuidingBranches` (+ `aesthetics/` + tests), reutilizando lo anterior.
6. Exports en `src/index.ts`, README (4 secciones), `/examples` (4 archivos), `ROADMAP.md`.

Rollback: revertir el commit de la tanda; al ser aditivo no afecta a consumers.

## Open Questions

- ¿`AttentionCue` y `GuidingBranches` deberían compartir un nombre/familia común en el README (p. ej. categoría "Idle / Attention")? Propuesta: sí, documentarlos juntos.
- ¿`CircuitBackground` debería permitir 45° además de 90°? Propuesta: empezar con 90° + biseles opcionales; el 45° pleno queda como mejora futura por seed/prop.
- ¿El PRNG/seedable se promueve a hook/util público en esta tanda? Propuesta: no; mantener interno hasta que haya un tercer consumidor (criterio establecido con `scroll-driver`).
- Estéticas iniciales de `GuidingBranches`: se propone entregar `roots` (default) y `lightning` (reusa `jagged-bolt`); `vines` queda como ejemplo de extensión futura.
