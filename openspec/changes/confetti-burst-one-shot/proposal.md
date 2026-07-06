## Why

Todos los componentes del paquete son efectos **continuos y declarativos** (se montan y animan solos). El paquete no tiene forma de expresar efectos **one-shot disparados por eventos de la app** — celebrar un submit exitoso, un logro, un like — que es una categoría de alta demanda (el nicho de `canvas-confetti`, que además trae dependencia). Wave I introduce el patrón de efecto one-shot imperativo (handle via ref) como decisión arquitectónica del paquete y lo estrena con `ConfettiBurst`, abriendo la categoría celebración/feedback.

## What Changes

- **Nueva decisión arquitectónica: patrón one-shot imperativo** — componentes overlay que no animan al montar sino cuando el consumer invoca un método del handle expuesto por ref (`useImperativeHandle`). El RAF corre únicamente mientras hay partículas vivas y se detiene solo (cero costo en reposo). Documentado en design.md como convención reutilizable para futuros efectos disparables (fireworks, emoji burst, sparkles).
- **Nuevo `ConfettiBurst`**: overlay `pointer-events: none` con handle `fire(options?)` que dispara una ráfaga de confetti con física simple (velocidad inicial en abanico, gravedad, drag, rotación de copos). Disparos múltiples se acumulan. Origen, cantidad, colores, formas, dispersión y potencia configurables por props (defaults) y por opciones de cada `fire()`.
- **Nuevo tipo público `ConfettiBurstHandle`** para tipar el ref del consumer.

## Capabilities

### New Capabilities

- `confetti-burst`: Componente `ConfettiBurst` — ráfaga de confetti one-shot disparable imperativamente via handle por ref, con física en módulo puro.

### Modified Capabilities

<!-- Ninguna. -->

## Impact

- **Código nuevo**: `src/components/ConfettiBurst/` (`index.tsx`, `types.ts`, `physics.ts` puro). El patrón one-shot queda documentado para futuros componentes de la categoría.
- **Exports**: `ConfettiBurst` + `ConfettiBurstHandle` y tipos desde `src/index.ts`; entry point nuevo en `package.json#exports`.
- **Docs**: sección en README (incluyendo el patrón de uso con `useRef`), ejemplo standalone en `/examples`, demo con panel de controles + botón de disparo en `test-app`.
- **Dependencias**: ninguna nueva. **Sin breaking changes** (todo aditivo).
