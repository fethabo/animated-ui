# svg-stroke-engine Specification

## Purpose
Primitiva interna de line-drawing compartida por `TextHighlighter`, `DrawPath` y `ScribbleDecoration`: mide paths SVG con `getTotalLength()`, setea `stroke-dasharray`/`stroke-dashoffset` y anima el offset a 0 vía clases y keyframes inyectados con `injectStyles` (cero JavaScript por frame), más un módulo puro y seedable de generación de paths hand-drawn. No se exporta del paquete público (utilidad interna, como `noise.ts`).

## Requirements

### Requirement: El motor SVG stroke anima line-drawing con CSS puro

El paquete SHALL proveer una primitiva interna de line-drawing que, dado un elemento SVG con longitud medible, setee `stroke-dasharray`/`stroke-dashoffset` a partir de `getTotalLength()` y anime el offset a 0 mediante clases y keyframes inyectados via `injectStyles` — cero JavaScript por frame durante la animación. El stagger entre paths SHALL resolverse por delay indexado (CSS var de índice, patrón SplitReveal). La primitiva SHALL ser interna (no exportada del paquete), como `noise.ts`.

#### Scenario: Dibujo por dash sin JS por frame

- **WHEN** un componente del motor arma un path para dibujarse
- **THEN** el path SHALL recibir dash array/offset iguales a su longitud medida y una clase cuya animación CSS lleve el offset a 0, sin RAF ni JS por frame

#### Scenario: Elemento sin getTotalLength

- **WHEN** un elemento SVG no expone `getTotalLength()` (browser antiguo)
- **THEN** el elemento SHALL quedar visible con su trazo completo, sin animación ni errores

### Requirement: El generador hand-drawn produce paths seedables en módulo puro

El paquete SHALL proveer un módulo puro (sin DOM) que genere strings `d` de paths con estética a mano alzada (jitter de puntos de control via `createPrng(seed)`) para shapes paramétricas por dimensiones. Misma seed y mismas dimensiones SHALL producir el mismo path. El módulo SHALL ser testeable con vitest sin browser.

#### Scenario: Determinismo

- **WHEN** se genera una shape con la misma seed y dimensiones dos veces
- **THEN** ambos strings `d` SHALL ser idénticos

#### Scenario: Adaptación a dimensiones

- **WHEN** se genera la misma shape para dos tamaños distintos
- **THEN** cada path SHALL cubrir las dimensiones solicitadas (bounds correctos)

### Requirement: El markup SSR del motor es completo y visible

Los componentes del motor SHALL renderizar en SSR los paths completos y visibles (sin dash aplicado); el "rebobinado" (setear dash/offset inicial) SHALL ocurrir en el cliente en `useLayoutEffect`, antes de armar el trigger de animación.

#### Scenario: SSR sin JavaScript

- **WHEN** la página se sirve sin que el JavaScript se ejecute
- **THEN** los trazos SHALL verse completos (contenido no oculto para SEO/no-JS)
