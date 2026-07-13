# AGENTS.md — @fethabo/animated-ui

Guía para cualquier agente (AI o humano) que trabaje en este repositorio.

## Qué es este proyecto

Paquete npm de componentes React animados, livianos y zero-config: cero dependencias de runtime, estilos auto-inyectados, tree-shakeable, compatible con Vite, Astro y Next.js App Router (React 18+, JavaScript o TypeScript).

## Documentos vinculantes

| Documento | Qué define | Cuándo leerlo |
| --- | --- | --- |
| [openspec/specs/component-authoring/spec.md](openspec/specs/component-authoring/spec.md) | **Procedimiento de implementación y definition-of-done de todo componente nuevo.** Es vinculante: ningún change que agregue componentes se considera completo sin cumplir todos sus requirements. | **Siempre**, antes de implementar o modificar un componente |
| [ROADMAP.md](ROADMAP.md) | Hoja de ruta de componentes por tiers/motores, secuencia de releases y criterio de priorización. | Al proponer un change o evaluar una idea nueva |
| [openspec/specs/](openspec/specs/) | Specs por capability del comportamiento ya implementado. | Antes de modificar un componente existente |
| [README.md](README.md) | Documentación de cara al consumer. Debe actualizarse en el mismo change que toca la API. | Al cambiar props, CSS vars o agregar componentes |
| [docs/](docs/) | Web de documentación (Vite + React) de la versión publicada: una vista por componente, ES/EN, demo vivo, props auto-generadas desde los JSDoc, ejemplos. Se agrega la página del componente en el mismo change. | Al agregar un componente o cambiar su API |

## Criterios fundacionales (no negociables)

1. **Cero dependencias de runtime** — solo APIs nativas (CSS, canvas, WAAPI, observers) y React.
2. **Zero-config** — instalar e importar es suficiente; el CSS se auto-inyecta (`injectStyles`).
3. **Compatibilidad** — `'use client'` en todo componente; SSR-safe (nada de `window`/`document` en render); funciona en Vite, Astro y Next.js, con JS o TS.
4. **Consumo dual** — todo componente se usa desde el paquete **o** se copia standalone desde [/examples](examples/) (los ejemplos no importan el paquete).
5. **Accesibilidad de movimiento** — `respectReducedMotion` default `true` en todo componente.

## Flujo de trabajo

Este repo usa **OpenSpec** (schema `spec-driven`):

```
/opsx:propose  →  crear change (proposal + design si hay decisión nueva + specs + tasks)
/opsx:apply    →  implementar tasks cumpliendo component-authoring
/opsx:archive  →  archivar al completar; las specs deltas se promueven a openspec/specs/
```

- Una tanda del roadmap = un change.
- Verificación: `npm test` (vitest) + verificación visual en `test-app/`.
- Build: `npm run build` (tsup → ESM + CJS + `.d.ts`).

**Harness del `test-app`**: la verificación visual se hace con un panel de controles por componente que varía sus props en runtime (`test-app/src/harness/ControlPanel.jsx` + un módulo por componente en `test-app/src/demos/`). Todo componente nuevo SHALL llegar con su demo + descriptor de controles (es parte del definition-of-done de [component-authoring](openspec/specs/component-authoring/spec.md)): basta declarar el array de controles (`number`/`color`/`enum`/`boolean`/`text`/`multi`) y agregarlo a `demos/index.js`.

## Convenciones rápidas

- CSS custom properties con namespace `--aui-<componente>-*`.
- Estructura: `src/components/<Nombre>/{index.tsx, types.ts, <partes>/}`.
- Hooks compartidos en `src/hooks/` (`useMousePosition`, `useReducedMotion`, `useResizeObserver`, `useInView`) — reutilizar antes de crear nuevos.
- Motor de scroll de posición continua: `subscribeScroll`/`viewportProgress`/`pageProgress` en `src/utils/scroll-driver.ts` (interno) — reutilizar para efectos ligados al scroll.
- Exports en `src/index.ts` (componente + tipos públicos).
- Nombres de código en inglés. **JSDoc de los tipos públicos (props, tipos exportados) en inglés**: es lo que ve el consumer en el autocomplete y la fuente de las tablas de props de la web de docs (las traducciones al español viven en `docs/content/props-es/`). Comentarios internos de implementación, en español.

## Patrón one-shot imperativo (categoría celebración/feedback)

Los efectos **one-shot disparados por eventos de la app** (confetti, y a futuro fireworks, sparkles, emoji burst) siguen la convención fijada por `ConfettiBurst` (ver `openspec/changes/confetti-burst-one-shot/design.md`, luego archivado):

- El componente monta un **overlay pasivo** (`pointer-events: none`, sin RAF al montar) y expone métodos via `useImperativeHandle` con un handle tipado (`<Nombre>Handle`), e.g. `ref.current.fire(options?)`.
- **Props = defaults** de cada disparo; las **options del método las overridean solo para ese disparo**.
- El RAF arranca con el primer disparo y **se auto-detiene** cuando no quedan partículas vivas (costo cero en reposo); disparos concurrentes comparten RAF y canvas.
- Disparar antes de la hidratación, sin canvas o bajo `prefers-reduced-motion` es **no-op** (sin versión estática: el feedback alternativo corre por cuenta del consumer).
- La aleatoriedad por disparo usa `createPrng` con seed de un contador interno (nada de `Math.random()`).
- Nada de funciones imperativas globales ni portales: el overlay se recorta a su contenedor (viewport = contenedor `fixed`).
