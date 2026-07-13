## Why

El paquete tiene canvas + RAF y un PRNG seedable, pero no puede generar movimiento **orgánico y continuo** (ondas fluidas, campos de dirección, curvas de nivel): eso requiere ruido coherente, no aleatoriedad pura. Wave H introduce la primitiva `noise.ts` (simplex 2D seedable, módulo puro) — la decisión arquitectónica análoga a lo que fue `prng.ts` en Wave C — y la amortiza de inmediato con tres fondos generativos de alta demanda. Una primitiva → tres componentes, maximizando el criterio de priorización del roadmap.

## What Changes

- **Nueva primitiva `src/utils/noise.ts`**: ruido simplex 2D seedable y determinista (tabla de permutación construida con el PRNG existente), API pura sin DOM, con helper fBm (octavas) opcional. Interna al paquete.
- **Nuevo `WavesBackground`**: fondo de líneas fluidas horizontales cuya forma ondula orgánicamente (cada línea curvada por `noise(x, t)`), con deriva temporal continua. Densidad, amplitud, velocidad, colores y seed configurables.
- **Nuevo `FlowField`**: partículas que siguen un campo vectorial de ruido (ángulo derivado del noise) dejando trazos orgánicos con fade. Cantidad, velocidad, paleta, persistencia del trazo y seed configurables.
- **Nuevo `TopographicBackground`**: curvas de nivel (mapa topográfico) extraídas del campo de ruido con marching squares, con evolución temporal lenta opcional. Cantidad de niveles, colores, grosor y seed configurables.
- Los tres siguen el patrón canvas establecido: física/geometría en módulos puros testeables, estado en refs (sin re-renders por frame), y capa estática offscreen donde aplica (patrón CircuitBackground).

## Capabilities

### New Capabilities

- `waves-background`: Componente `WavesBackground` — líneas fluidas ondulantes generadas con ruido coherente, seedable.
- `flow-field`: Componente `FlowField` — partículas siguiendo un campo vectorial de ruido con trazos persistentes, seedable.
- `topographic-background`: Componente `TopographicBackground` — curvas de nivel animadas extraídas por marching squares, seedable.

### Modified Capabilities

<!-- Ninguna. La primitiva noise.ts es infraestructura interna, documentada en design.md. -->

## Impact

- **Código nuevo**: `src/utils/noise.ts` (+ tests de determinismo y rango); `src/components/WavesBackground/`, `src/components/FlowField/`, `src/components/TopographicBackground/` con sus módulos puros (`marching-squares.ts` en Topographic, muestreo de campo en FlowField).
- **Exports**: tres componentes y sus tipos desde `src/index.ts` + tres entry points en `package.json#exports`; `noise.ts` permanece interna (mismo criterio que `prng.ts`).
- **Docs**: tres secciones en README, tres ejemplos standalone en `/examples`, tres demos con panel de controles en `test-app`; actualización del ROADMAP (motor/primitivas).
- **Restricción de generación**: toda aleatoriedad y ruido pasan por `prng.ts`/`noise.ts` seedeados — prohibido `Math.random()`/`Date.now()` en la generación (determinismo SSR↔hidratación y estabilidad entre repaints).
- **Dependencias**: ninguna nueva. **Sin breaking changes** (todo aditivo).
