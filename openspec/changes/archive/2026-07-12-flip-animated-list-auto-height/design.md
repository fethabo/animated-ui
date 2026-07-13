## Context

Todos los motores actuales animan *presentación* (fondos, texto, hover, scroll). Ninguno anima **cambios de layout**: elementos que se reordenan, aparecen, desaparecen o cambian de tamaño entre renders. La técnica estándar zero-dep es FLIP (First-Last-Invert-Play): capturar rects antes del cambio, dejar que el browser layoutee, invertir la diferencia con `transform` y animarla a identidad con WAAPI. Es una decisión arquitectónica nueva (design.md propio, como el motor de scroll en v0.5): define cuándo se mide, cómo se coordinan las salidas con la reconciliación de React y qué queda en módulo puro.

## Goals / Non-Goals

**Goals:**

- Motor FLIP interno reutilizable: snapshot de rects, cálculo de inversión (delta x/y/escala) en módulo puro testeable, y play con WAAPI.
- `AnimatedList`: entrada, salida y reordenamiento animados de hijos keyed, sin que el consumer cambie su forma de renderizar la lista.
- `AutoHeight`: transición de las dimensiones del contenedor al cambiar el contenido.
- Cero re-renders extra por animación; sin estado de React por frame.

**Non-Goals:**

- No es un sistema de "shared element transitions" entre componentes distantes (eso es View Transitions API, descartada por baseline como scroll-driven en v0.5).
- No anima cambios de layout inducidos por resize del viewport (solo cambios entre renders / cambios de contenido).
- AnimatedList no implementa drag & drop ni virtualización.
- No se exporta el motor como API pública en esta wave (queda interno; se puede promover después si hay demanda).

## Decisions

### 1. Medición First en render-phase controlado, Play en `useLayoutEffect`

`AnimatedList` captura los rects **First** de los hijos actuales inmediatamente antes de aplicar el render nuevo (snapshot lazy: se toma en cada commit y se conserva el del commit anterior), y en `useLayoutEffect` del commit nuevo mide **Last**, calcula la inversión y lanza `element.animate()` — antes del paint, así el usuario nunca ve el salto. El cálculo del delta (traslación; escala opcional para cambios de tamaño) vive en `src/utils/flip.ts` como funciones puras sobre pares de rects (testeables con rects sintéticos, sin jsdom layout).

Alternativa considerada: `MutationObserver` estilo auto-animate — rechazada: observar el DOM es más mágico pero pelea con React (mutaciones que no vienen de render) y complica el cleanup; el paquete es explícitamente React-first.

### 2. Identidad por `key` de React, sin API paralela

Los hijos de `AnimatedList` se identifican por su `key` de React (obligatoria, como en cualquier lista). El componente clona `Children` para envolver cada hijo en un wrapper medible (`display: contents` no es medible — el wrapper es un elemento real cuyo estilo de layout hereda del consumer via prop `itemAs`/`itemClassName`). Diffear keys entre renders clasifica: nuevas → entrada, ausentes → salida, persistentes → FLIP.

### 3. Salidas: clon estático posicionado, no retención del hijo real

Al desaparecer una key, el hijo ya no existe en el render nuevo. En lugar de retenerlo (retención de children = pelear con la reconciliación y con estado stale), el wrapper saliente se **clona** (`cloneNode(true)`, snapshot visual estático), se posiciona absoluto en su último rect dentro del contenedor, anima su salida (fade/scale via WAAPI) y se remueve en `finish`. Trade-off aceptado: el clon es inerte (sin handlers ni updates durante la salida) — correcto para una animación de ~300 ms; documentado.

### 4. AutoHeight: mismo principio, una dimensión, sin clones

`AutoHeight` mide la altura (y opcionalmente el ancho) del contenido antes/después del cambio (resize del contenido detectado por `useResizeObserver` + cambios de children por render) y anima `height` explícita entre ambos valores con WAAPI, fijando `overflow: hidden` solo durante la transición y restaurando `height: auto` en `finish` (para que el layout siga fluido). Animar `height` no es compositado — trade-off asumido y documentado: es *la* forma de animar `auto`, el costo es local al contenedor y la duración corta; alternativa `transform: scaleY` rechazada (distorsiona el contenido).

### 5. Interrupciones: cancelar y re-invertir desde la posición actual

Si un nuevo cambio llega con animaciones en vuelo, las WAAPI activas se cancelan leyendo primero la posición actual (`getComputedStyle`/`animation.currentTime`) y el nuevo FLIP parte desde ahí — sin saltos. El motor mantiene un `WeakMap<Element, Animation>` para rastrear y cancelar por elemento (sin registro global entre instancias).

### 6. Reduced motion: cambios instantáneos

Con `prefers-reduced-motion`, ambos componentes aplican los cambios sin animación (los elementos aparecen/desaparecen/se reubican de inmediato). El movimiento acá es inferido (no input directo), así que se desactiva por completo — precedente de la política del paquete.

## Risks / Trade-offs

- [jsdom no tiene layout: `getBoundingClientRect` devuelve ceros] → la lógica de diff/inversión se testea en `flip.ts` con rects sintéticos; los tests de componente mockean rects y afirman sobre las llamadas a `animate` (jsdom soporta stub de WAAPI); la verificación de movimiento real es visual en `test-app`.
- [Clones de salida con contenido complejo (canvas, video) se congelan] → aceptado y documentado; el clon es un snapshot visual.
- [`cloneNode` no copia estado de inputs no controlados] → documentado: las salidas animadas son para items visuales, no formularios en vuelo.
- [Reordenamientos muy grandes (cientos de items) miden N rects por commit] → medición es barata comparada con el layout que ya ocurrió; cap documentado (~100 items) y `stagger` opcional solo en entradas.
- [Animar `height` causa reflow por frame en AutoHeight] → local al contenedor, duración corta, documentado (decisión 4).

## Migration Plan

Cambio aditivo; sin migración para consumers. La fila del motor ya figura como ⬜ en ROADMAP (pasa a ✅ al completar). Rollback = no publicar los exports nuevos.

## Open Questions

- ¿`AnimatedList` soporta `stagger` en el FLIP de reorden (no solo en entradas)? Se decide con la demo a la vista; default sin stagger en reorden (simultáneo se percibe más natural).
