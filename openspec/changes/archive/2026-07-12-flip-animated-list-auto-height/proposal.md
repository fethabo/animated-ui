## Why

Todo el paquete anima *presentación*; nada anima **cambios de layout reales** — la categoría que hace célebres a libs con dependencia (auto-animate, framer-motion `layout`) y que es perfectamente alcanzable zero-dep con FLIP + WAAPI. Wave M introduce ese motor (decisión arquitectónica → design.md propio) y lo estrena con los dos casos de mayor demanda: listas que reordenan y el dolor universal de transicionar `height: auto`.

## What Changes

- **Nuevo motor FLIP** (First-Last-Invert-Play): medir los rects de los elementos antes y después de un cambio de layout (`useLayoutEffect`, antes del paint), invertir la diferencia con `transform` y animarla hacia identidad con WAAPI. Lógica de medición/inversión en módulo puro testeable; sin re-renders extra ni estado de React por frame.
- **Nuevo `AnimatedList`**: contenedor cuyos hijos keyed animan **entrada** (fade/scale-in), **salida** (clon posicionado que anima y se remueve del DOM al terminar) y **reordenamiento** (FLIP) cuando la lista cambia entre renders. Pensado para filtros, sorting y todo-lists. Customizable: duración, easing, presets de entrada/salida, stagger.
- **Nuevo `AutoHeight`**: contenedor que transiciona su altura (y opcionalmente ancho) cuando su contenido cambia de tamaño — acordeones, tabs, disclosure, textos expandibles. Mide altura previa/nueva y anima entre ambas con WAAPI gestionando `overflow` durante la transición; es el caso degenerado (una dimensión) del mismo motor.

## Capabilities

### New Capabilities

- `flip-engine`: Primitiva interna FLIP — snapshot de rects, cálculo de inversión y play WAAPI, en módulo puro reutilizable.
- `animated-list`: Componente `AnimatedList` — entrada, salida y reordenamiento animados de hijos keyed.
- `auto-height`: Componente `AutoHeight` — transición animada de las dimensiones del contenedor al cambiar el contenido.

### Modified Capabilities

<!-- Ninguna. -->

## Impact

- **Código nuevo**: `src/utils/flip.ts` (módulo puro con tests) + `src/components/AnimatedList/`, `src/components/AutoHeight/`.
- **Exports**: dos componentes y sus tipos desde `src/index.ts` + dos entry points en `package.json#exports` y `tsup.config.ts` (la util queda interna).
- **Docs**: dos secciones en README, dos ejemplos standalone en `/examples`, dos demos con panel de controles en `test-app` (la demo de AnimatedList necesita controles de mutación de lista: agregar/quitar/mezclar); fila nueva en la tabla de motores del ROADMAP (ya agregada como ⬜).
- **Dependencias**: ninguna nueva (criterio no negociable). **Sin breaking changes** (todo aditivo).
- **Riesgo técnico a resolver en design.md**: coordinación de animaciones de salida con el ciclo de render de React (retener el nodo saliente sin pelear con reconciliación), y jsdom sin layout real (los tests de medición usan mocks de `getBoundingClientRect`).
