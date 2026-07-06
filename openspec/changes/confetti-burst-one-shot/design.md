## Context

Wave I introduce la segunda decisión arquitectónica de las waves nuevas: cómo expresa el paquete un **efecto one-shot disparado por la app**, en contraste con los efectos continuos declarativos existentes. La decisión importa más que el componente: fija la convención para toda la categoría celebración/feedback.

## Goals / Non-Goals

- **Goal**: una convención de API para efectos disparables que sea idiomática en React, SSR-safe, tree-shakeable y de costo cero en reposo.
- **Goal**: estrenarla con `ConfettiBurst` reutilizando el motor canvas existente (física en módulo puro, estado en refs).
- **Non-goal**: un sistema de eventos/bus global; más efectos one-shot en esta tanda (fireworks, sparkles llegan después usando esta convención).

## Decisión: handle imperativo via ref sobre componente overlay

| Opción | Pros | Contras |
| --- | --- | --- |
| **A. Componente + `useImperativeHandle`** ✅ (`ref.current.fire(opts)`) | Idiomático React; el overlay declara *dónde* vive el efecto y el handle *cuándo* dispara; SSR trivial; tipable (`ConfettiBurstHandle`) | El consumer necesita un `useRef` |
| B. Hook `useConfetti()` que devuelve `[node, fire]` | Sin ref explícito | API inusual (hook que retorna JSX); complica className/style/props del overlay |
| C. Función imperativa global (estilo `canvas-confetti`) | Familiar para quien viene de la lib | Crea DOM fuera de React; rompe SSR/StrictMode; anti-patrón en el paquete |

Elegida **A**. Convención para la categoría: el componente monta un overlay pasivo (`pointer-events: none`, sin RAF), expone métodos por `useImperativeHandle`, y cada método acepta opciones que **overridean las props** para ese disparo (props = defaults, opciones = por-disparo).

## Ciclo de vida del RAF (costo cero en reposo)

```
montado ──fire()──▶ RAF corriendo ──sin partículas vivas──▶ RAF detenido
   ▲                    │ fire() adicional suma partículas       │
   └────────────────────┴────────────────────────────────────────┘
```

- El RAF arranca en el primer `fire()` y se auto-detiene cuando el pool queda vacío (patrón inverso a ParticleField, que corre siempre).
- Disparos concurrentes comparten el mismo RAF y pool (sin RAFs paralelos).
- `fire()` antes de la hidratación o sin canvas disponible es no-op seguro.

## Física y aleatoriedad

- `physics.ts` puro: spawn en abanico (`angle` + `spread` + `power` con jitter), integración con gravedad y drag, rotación/tumbling por copo, culling por salida del área u opacidad. Testeable sin DOM.
- La aleatoriedad de cada ráfaga usa `createPrng` con una seed derivada de un contador interno del componente — cumple la restricción del repo (nada de `Math.random()` directo) manteniendo variedad visual entre disparos.
- Formas: `rect` y `circle` en la primera versión (prop `shapes`); el copo rectangular con rotación 3D simulada (escala Y oscilante) da el look clásico.

## Reduced motion

`fire()` bajo `prefers-reduced-motion` (con `respectReducedMotion` default `true`) es **no-op**: el confetti es celebración autónoma, no información — no hay versión estática útil. El consumer que necesite feedback alternativo lo resuelve fuera (e.g. un mensaje), documentado en README.

## Riesgos / Trade-offs

- **Overlay acotado al contenedor**: el confetti se recorta al área del componente (`absolute inset:0`). Cubrir el viewport se logra montándolo en un contenedor `fixed` — documentado; evita que el paquete cree portales globales.
- **StrictMode double-mount**: el pool vive en refs y el RAF se detiene al desmontar — sin fugas ni disparos duplicados.
