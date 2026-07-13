## 1. Motor SVG stroke (primitivas internas)

- [x] 1.1 Crear `src/utils/hand-drawn.ts`: módulo puro generador de paths `d` con jitter seedable (`createPrng`) para shapes paramétricas (underline, wavy-underline, circle, highlight, strike, box, arrow, asterisk, spiral), con doble pasada opcional para el look marcador; tests vitest (determinismo por seed, bounds por dimensiones, validez sintáctica del `d`)
- [x] 1.2 Crear `src/utils/svg-stroke.ts`: helper de line-drawing — medir `getTotalLength()` con guarda para elementos que no lo exponen (quedan visibles sin animar), setear dash vars inline y clase de animación con delay indexado; keyframes/clases via `injectStyles`; evaluar fusión con 1.1 si queda en <30 líneas (design.md, open question)
- [x] 1.3 Tests del helper con `getTotalLength` mockeado (jsdom) + test SSR (markup visible completo, sin dash)

## 2. TextHighlighter

- [x] 2.1 Crear `src/components/TextHighlighter/types.ts` (`shape`, `color`, `strokeWidth`, `duration`, `delay`, `trigger`, `once`, `seed`, `respectReducedMotion`, `children`, `className`, `style`)
- [x] 2.2 Crear `src/components/TextHighlighter/index.tsx`: `'use client'`, span relativo + SVG overlay absoluto `aria-hidden`/`pointer-events:none`, medición por `useResizeObserver` con regeneración del path (misma seed), triggers `in-view`/`mount`/`hover` (retrigger con `once={false}`), rebobinado en `useLayoutEffect`, reduced motion = trazo completo directo; CSS vars `--aui-highlighter-*`
- [x] 2.3 Test `index.ssr.test.ts` (texto presente y visible en el markup) + test de regeneración en resize y de accesibilidad (SVG oculto, texto real)

## 3. DrawPath

- [x] 3.1 Crear `src/components/DrawPath/types.ts` (`duration`, `stagger`, `delay`, `trigger`, `once`, `threshold`, `respectReducedMotion`, `children`, `className`, `style`)
- [x] 3.2 Crear `src/components/DrawPath/index.tsx`: `'use client'`, query de descendientes con trazo (`path, line, polyline, circle, rect, ellipse`), skip de `data-aui-no-draw`, respeto de estilos del consumer, stagger por orden documental, rebobinado/redibujo con `once={false}` (patrón ScrollReveal), reduced motion = completo directo; CSS vars `--aui-draw-*`
- [x] 3.3 Test `index.ssr.test.ts` (SVG del consumer completo en markup) + test del opt-out `data-aui-no-draw` y de la guarda sin `getTotalLength`

## 4. ScribbleDecoration

- [x] 4.1 Crear `src/components/ScribbleDecoration/shapes/` con las shapes builtin como módulos separados tree-shakeables cumpliendo el contrato `(size, seed, options) => d` (reutilizan `hand-drawn.ts`)
- [x] 4.2 Crear `src/components/ScribbleDecoration/types.ts` (`shape` — nombre builtin o función custom, `color`, `strokeWidth`, `duration`, `delay`, `trigger`, `once`, `repeat`, `seed`, `respectReducedMotion`, `className`, `style`)
- [x] 4.3 Crear `src/components/ScribbleDecoration/index.tsx`: `'use client'`, SVG `aria-hidden` dimensionado por contenedor, motor de dash compartido, modo `repeat` cíclico (dibuja→desvanece→redibuja), reduced motion = completo estático; CSS vars `--aui-scribble-*`
- [x] 4.4 Test `index.ssr.test.ts` + test de shape custom por función y de determinismo por seed

## 5. Exports y documentación

- [x] 5.1 Exportar los tres componentes y sus tipos (incluido el tipo del contrato `ScribbleShape`) desde `src/index.ts`; agregar tres entry points a `package.json#exports` y `tsup.config.ts` (las utils del motor quedan internas)
- [x] 5.2 Documentar en README: fila en la tabla de componentes + sección por componente (snippet, props, CSS vars); notas del flash de rebobinado post-hidratación y de la recomendación de frases cortas en TextHighlighter
- [x] 5.3 Crear ejemplos standalone en `/examples` para los tres componentes (sin importar el paquete, solo React)
- [x] 5.4 Marcar Wave L ✅ en `ROADMAP.md` (Tier 7 + fila del motor SVG stroke a ✅)

## 6. Verificación (definition-of-done)

- [x] 6.1 Demo + descriptor de controles en `test-app` para cada componente (selector de shape, seed, triggers; incluye control estándar de `respectReducedMotion`) y alta en `demos/index.js`
- [x] 6.2 Verificación visual en `test-app`: los 6 shapes de TextHighlighter sobre texto corto y multi-línea; DrawPath con un SVG multi-path y stagger; ScribbleDecoration con repeat y shape custom; retrigger con `once={false}` en los tres
- [x] 6.3 Correr vitest completo + typecheck + build; confirmar tree-shaking de los entry points y de las shapes builtin
- [x] 6.4 Revisar cumplimiento de la spec `component-authoring` para cada componente antes de archivar
