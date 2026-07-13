## 1. Motor FLIP (primitiva interna)

- [x] 1.1 Crear `src/utils/flip.ts`: funciones puras — delta de inversión entre pares de rects (traslación + escala opcional) y diff de keys entre renders (entradas/salidas/persistentes); tests vitest con rects sintéticos (sin DOM)
- [x] 1.2 Crear el helper de play WAAPI: lanzar `element.animate()` desde la inversión, rastreo por `WeakMap<Element, Animation>` local a la instancia, cancelación leyendo la posición visual actual para encadenar sin saltos (design.md, decisión 5)
- [x] 1.3 Tests del helper con WAAPI stubbeado en jsdom (se afirma sobre las llamadas a `animate` y las cancelaciones)

## 2. AnimatedList

- [x] 2.1 Crear `src/components/AnimatedList/types.ts` (`duration`, `easing`, `enter`, `exit`, `stagger`, `as`, `itemClassName`, `itemStyle`, `respectReducedMotion`, `children`, `className`, `style`)
- [x] 2.2 Crear `src/components/AnimatedList/index.tsx`: `'use client'`, wrappers medibles por hijo keyed (clonando `Children`), snapshot First por commit + medición Last y play en `useLayoutEffect` (antes del paint), clasificación por diff de keys
- [x] 2.3 Implementar entradas (presets fade/scale-in/slide + `stagger`) y salidas por clon estático (`cloneNode(true)` posicionado absoluto en el último rect, `aria-hidden`, animación de salida y remoción en `finish`, sin nodos residuales)
- [x] 2.4 Reduced motion = cambios instantáneos (sin FLIP, sin clones); primer render (SSR/hidratación) sin animar
- [x] 2.5 Test `index.ssr.test.ts` + tests con rects mockeados: reorden llama a `animate` con la inversión esperada, salida crea y remueve el clon, keys nuevas reciben preset de entrada

## 3. AutoHeight

- [x] 3.1 Crear `src/components/AutoHeight/types.ts` (`duration`, `easing`, `width`, `respectReducedMotion`, `children`, `className`, `style`)
- [x] 3.2 Crear `src/components/AutoHeight/index.tsx`: `'use client'`, medición previa/nueva (cambios de children por render + `useResizeObserver` del contenido), animación WAAPI de `height` (y `width` opcional) con `overflow: hidden` solo durante la transición y restauración de `height: auto` en `finish`; interrupciones redirigen desde la altura visual actual
- [x] 3.3 Reduced motion = ajuste instantáneo manteniendo `height: auto`
- [x] 3.4 Test `index.ssr.test.ts` (altura natural en markup) + test de restauración de `auto` al terminar (WAAPI stubbeado)

## 4. Exports y documentación

- [x] 4.1 Exportar `AnimatedList` y `AutoHeight` con sus tipos desde `src/index.ts`; agregar dos entry points a `package.json#exports` y `tsup.config.ts` (`flip.ts` queda interno)
- [x] 4.2 Documentar en README: fila en la tabla de componentes + sección por componente (snippet con lista mutable, props, CSS vars); notas de los trade-offs documentables (clon inerte en salidas, cap recomendado de items, reflow local de `height`)
- [x] 4.3 Crear ejemplos standalone en `/examples` para ambos componentes (sin importar el paquete, solo React)
- [x] 4.4 Marcar Wave M ✅ en `ROADMAP.md` (Tier 8 + fila del motor FLIP a ✅)

## 5. Verificación (definition-of-done)

- [x] 5.1 Demo + descriptor de controles en `test-app` para ambos (AnimatedList con botones de mutación: agregar/quitar/mezclar/ordenar; AutoHeight con contenido intercambiable; control estándar de `respectReducedMotion`) y alta en `demos/index.js`
- [x] 5.2 Verificación visual en `test-app`: reorden sin saltos (incluido reorden durante animación en vuelo), salidas sin nodos residuales, lista como grid, AutoHeight que vuelve a fluir tras animar; decidir el open question del stagger en reorden con la demo a la vista
- [x] 5.3 Correr vitest completo + typecheck + build; confirmar tree-shaking de los entry points nuevos
- [x] 5.4 Revisar cumplimiento de la spec `component-authoring` para cada componente antes de archivar (gap encontrado y corregido: `duration` no tenía CSS custom property — se agregaron `--aui-animated-list-duration` y `--aui-autoheight-duration` con resolve-at-play-time)
