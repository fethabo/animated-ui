## Context

Wave H introduce la única decisión arquitectónica nueva de las waves E–H: **ruido coherente seedable** como primitiva del paquete. Los tres componentes de la tanda son consumidores del mismo módulo; este design documenta la elección del algoritmo, la API y los presupuestos de performance.

## Goals / Non-Goals

- **Goal**: una primitiva de ruido 2D determinista, pura (sin DOM), barata de evaluar por muestra, que habilite movimiento orgánico continuo en componentes canvas.
- **Goal**: tres componentes que la amorticen de inmediato con presupuestos de muestreo acotados (muestrear sobre grillas/líneas, nunca por pixel).
- **Non-goal**: ruido 3D/4D, ruido por shader (llegará con el motor WebGL de Wave D), o exponer `noise.ts` como API pública.

## Decisión 1: algoritmo — simplex 2D

| Opción | Pros | Contras |
| --- | --- | --- |
| Value noise | Trivial de implementar | Aspecto "blocky", artefactos direccionales visibles en líneas fluidas |
| Perlin clásico | Conocido | Artefactos alineados a ejes; más caro que simplex en 2D |
| **Simplex 2D** ✅ | Isótropo (sin sesgo de eje), continuo, barato por muestra, implementación compacta (~100 líneas) | Ligeramente más complejo de escribir |

Elegido **simplex 2D** (implementación propia, dependency-less, sobre grilla triangular). La tabla de permutación se construye con `createPrng(seed)` existente → mismo contrato de determinismo que el resto del paquete: misma seed ⇒ mismo campo, estable entre repaints y SSR↔hidratación.

## Decisión 2: API del módulo

```ts
// src/utils/noise.ts — módulo puro, sin DOM
createNoise2D(seed: string | number): (x: number, y: number) => number  // rango [-1, 1]
fbm(noise: Noise2D, octaves: number, lacunarity?: number, gain?: number): Noise2D
```

- Factory (no singleton): cada componente crea su instancia con su seed — sin estado global compartido.
- `fbm` compone octavas para detalle fractal (lo usan Topographic y opcionalmente Waves); es un decorator sobre la misma firma, así los consumidores no distinguen ruido simple de fractal.
- El tiempo se inyecta como coordenada (`noise(x, t * speed)`): la animación es un corte deslizante del campo 2D — sin estado temporal dentro del módulo.

## Decisión 3: presupuestos de muestreo por componente

El costo de simplex es ~30–50 ns/muestra; el enemigo es muestrear por pixel. Presupuestos:

| Componente | Estrategia de muestreo | Muestras/frame (orden) |
| --- | --- | --- |
| WavesBackground | N líneas × puntos cada ~8 px de ancho | ~1–3 k |
| FlowField | 1 muestra por partícula por frame (el trazo persiste via fade del canvas, no re-render del campo) | = `count` (~200–800) |
| TopographicBackground | Grilla de celdas (~24 px) para marching squares; evolución temporal **lenta** → recalcular niveles cada K frames sobre capa offscreen, no por frame | ~2–5 k cada K frames |

FlowField usa el truco de persistencia estándar: en vez de limpiar el canvas, cada frame pinta un rect semitransparente del color de fondo (`fade`) — los trazos se desvanecen solos, cero costo de historial.

## Decisión 4: reduced motion en generativos continuos

Los tres son efectos autónomos ⇒ bajo `prefers-reduced-motion` se desactiva la animación pero **no** el visual: cada componente renderiza una composición estática determinista (un frame del campo con `t=0` para Waves/Topographic; para FlowField, trazos pre-simulados con un presupuesto fijo de pasos en el mount). Consistente con CircuitBackground (estático) y con el criterio de la foundation.

## Riesgos / Trade-offs

- **Calidad del simplex propio**: mitigado con tests de rango ([-1,1]), continuidad (muestras vecinas acotadas) y determinismo por seed.
- **Topographic en resize**: recalcular marching squares en cada resize puede costar — mitigado con debounce del `useResizeObserver` existente y la capa offscreen.
- **FlowField y `prefers-contrast`/fondos claros**: el fade por rect semitransparente asume fondo conocido — el color de fondo es prop (`background`) y se documenta que el componente pinta su propio fondo (no transparente), a diferencia de ParticleField.
