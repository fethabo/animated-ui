# Design: particle-field-image-dissolve-sticky-scenes

## Context

Tanda v0.6+ del ROADMAP.md: `ParticleField` (Tier 4), `ImageDissolve` (Tier 4) y `StickyScenes` (Tier 3). Los tres reutilizan infraestructura existente — motor canvas de `PixelBackground`, matriz Bayer del behavior `reveal`, motor de scroll de v0.5 — sin introducir ningún motor nuevo. Es la tanda más ambiciosa en términos de comportamiento de producto, pero no en términos de decisiones arquitectónicas: el único punto de diseño no trivial es `StickyScenes` y la extracción de la utilidad de dithering.

Constraints heredados (vinculantes, ver `openspec/specs/component-authoring/spec.md`): cero deps de runtime, `'use client'` + SSR-safe, customización en dos capas (props + `--aui-*`), `respectReducedMotion` default `true`, ejemplo standalone por componente, docs en README, tests de lógica pura.

## Goals / Non-Goals

**Goals:**
- `ParticleField` standalone con canvas + RAF, repulsión/atracción al cursor configurable
- `ImageDissolve` que reutiliza `BAYER_8` extraída a util compartida, sin breaking change en `PixelBackground`
- `StickyScenes` con subcomponente `Scene`, progreso como CSS var sin React state en hot path
- Tres ejemplos standalone y documentación completa en README

**Non-Goals:**
- Motor de canvas 3D / WebGL (no nativo-puro en los términos del paquete)
- CSS scroll-driven animations para `StickyScenes` (descartado en v0.5 — ver decisión resuelta en ROADMAP)
- `ImageDissolve` sobre contenido DOM genérico (requeriría html2canvas o similar — violación de zero-deps)
- Composición automática entre `ParticleField` y `StickyScenes` (se anidan, no se fusionan)
- Bump de versión y CHANGELOG (los maneja el usuario con tagman)

## Decisions

### D1: ParticleField implementa su propio canvas loop; no reutiliza el canvas-renderer de PixelBackground

**Decision:** `ParticleField` monta un `<canvas>` propio, ejecuta su RAF loop directamente, y administra el estado de las partículas (posiciones, velocidades) como un array mutable local que persiste entre frames. El lifecycle (mount → RAF → cleanup en unmount) sigue exactamente el patrón de `PixelBackground`, pero sin compartir el canvas-renderer ni el modelo de contributions.

**Rationale:** `PixelBackground` opera sobre un grid discreto de bloques indexados por `(row, col)`. Sus contributions reciben una celda de grid y retornan valores de opacidad o color para esa celda. Las partículas de `ParticleField` necesitan posiciones continuas (floating point `x`, `y`) con velocidades vectoriales que se integran cada frame — el modelo de datos es fundamentalmente distinto. Adaptar el canvas-renderer de `PixelBackground` para soportar ambos modelos añadiría complejidad sin beneficio neto.

**Alternativa considerada:** contribution de `PixelBackground` que simula partículas sobre el grid. Rechazada: las partículas quedarían limitadas a posiciones de grid, perdiendo el efecto fluido característico del componente.

**Alternativa considerada:** hook `useParticles` compartido entre `ParticleField` y futuras variantes. Rechazada para esta tanda: el "tercer consumidor" que justificaría la abstracción no existe aún (regla del AGENTS.md: reutilizar hooks existentes antes de crear nuevos, pero no abstraer prematuramente).

### D2: BAYER_8 se extrae a `src/utils/bayer-matrix.ts`; `ImageDissolve` la importa desde allí

**Decision:** La constante `BAYER_8` (matriz Bayer 8×8) se mueve de `src/components/PixelBackground/behaviors/reveal.ts` a `src/utils/bayer-matrix.ts` como export nombrado. `reveal.ts` actualiza su import; `ImageDissolve` importa desde el mismo módulo. El cambio es interno: el API pública de `PixelBackground` no se altera y el comportamiento del behavior `reveal` permanece idéntico.

**Rationale:** `ImageDissolve` requiere exactamente la misma matriz para el dithering ordered. Las alternativas son: (a) duplicar el código — viola DRY en lógica idéntica y crítica para la corrección visual; (b) importar directamente desde `PixelBackground/behaviors/reveal.ts` — crea acoplamiento cruzado entre componentes del paquete, de modo que un refactor interno de `PixelBackground` rompería `ImageDissolve`. El módulo en `src/utils/` sigue el mismo patrón que `scroll-driver.ts`: utilidad interna compartida que podría promoverse a hook público cuando un tercer consumidor lo justifique.

**Alternativa considerada:** importar `BAYER_8` directamente desde `PixelBackground`. Rechazada por el acoplamiento entre componentes.

**Alternativa considerada:** cada componente tiene su propia copia. Rechazada por duplicación de lógica visualmente crítica.

### D3: ImageDissolve opera sobre `<img>` con `drawImage`/`getImageData`; no es un wrapper DOM genérico

**Decision:** `ImageDissolve` acepta `src` (imagen actual), `nextSrc` (imagen destino, opcional para transiciones programáticas) y `alt`. Renderiza un `<img>` con un `<canvas>` superpuesto en `position: absolute`. Al iniciar la transición, copia el frame actual al canvas, swapea el `<img>` src, y anima la revelación dithered con RAF: en cada frame calcula qué píxeles del nuevo src ya cruzaron el threshold Bayer según el progreso y los dibuja desde `getImageData`.

**Rationale:** Para el efecto de dithering se necesita acceso pixel-a-pixel. `getImageData` es la única API nativa que lo da, y requiere que el source sea una imagen (o un canvas). Generalizar a "cualquier DOM element" requeriría capturar el DOM como imagen — html2canvas u `OffscreenCanvas` con `SVGForeignObject` (soporte limitado y complejo) — que viola el constraint de zero-deps. Limitarse a imágenes permite una implementación completamente nativa con `drawImage` + `getImageData` + la máscara Bayer.

**Alternativa considerada:** wrapper genérico para cualquier contenido. Rechazada por los constraints de zero-deps.

**Nota de SSR:** el canvas y la animación se inician en `useEffect` post-hidratación. Durante SSR se renderiza solo el `<img>` estático con `alt` correcto — accesible y sin flash.

### D4: StickyScenes escribe el progreso como CSS vars en el root; las escenas son subcomponentes con `data-aui-active`

**Decision:** `<StickyScenes>` renderiza un contenedor con altura total `viewportHeight + nScenes × sceneDuration` (px, configurable). El inner wrapper es `position: sticky; top: 0; height: 100dvh`. `subscribeScroll` trackea cuánto se ha scrolleado dentro del rango sticky del contenedor; ese valor se descompone en `sceneIndex` y `sceneProgress` (0–1 dentro de la escena), escritos como `--aui-scene-index` y `--aui-scene-progress` directamente en el inner wrapper con `element.style.setProperty`. Sin `setState` en el callback. `StickyScenes.Scene` recibe `data-aui-active` cuando es la escena visible, y es el punto de anclaje para las transiciones CSS del consumer.

**Rationale:** El motor de scroll de v0.5 establece el principio: el hot path de scroll no pasa por React state (provoca re-renders por frame). Las CSS vars permiten que el consumer anime con CSS transitions nativas activadas por `data-aui-active`, igual que `ScrollReveal` usa `data-aui-visible`. El progreso continuo `--aui-scene-progress` queda disponible para `calc()` dentro de cada escena, habilitando efectos interpolados en CSS puro.

**Alternativa considerada:** render prop `({ sceneIndex, progress }) => ReactNode`. Rechazada: cualquier consumer que use el render prop para actualizar estado en el hot path del scroll provocaría re-renders por frame — el anti-patrón que el motor de v0.5 fue diseñado para evitar.

**Alternativa considerada:** CSS scroll-driven animations (`animation-timeline: scroll()`). Descartada en la decisión resuelta de v0.5 (ver ROADMAP): el baseline de browsers que incluye Firefox 136+ y Safari 26+ obligaría a mantener un fallback JS completo en paralelo, duplicando la complejidad sin reducirla.

**Criterio de migración futura:** cuando el baseline de browsers incluya scroll-driven animations de forma generalizada, la implementación puede migrar por dentro (las vars y `data-aui-active` quedan; cambia quién las escribe), sin cambiar la API pública — mismo criterio documentado para `ParallaxLayers`.

### D5: respectReducedMotion diferenciado por componente

| Componente | Con `prefers-reduced-motion: reduce` |
| --- | --- |
| `ParticleField` | RAF **detenido** — animación autónoma → se apaga. El canvas renderiza el estado inicial estático (partículas en sus posiciones de spawn). |
| `ImageDissolve` | Transición dithered **omitida** — el src se swapea instantáneamente, sin canvas animation. El canvas se oculta. Transición autónoma → se apaga. |
| `StickyScenes` | El tracking de scroll **sigue activo** (el usuario navega con propósito); pero las transitions CSS de entrada/salida de escenas se deshabilitan: la escena activa se muestra inmediatamente con `transition: none` inyectado bajo reduced motion. El contenido sigue siendo funcional y legible. |

## Risks / Trade-offs

- **`getImageData` requiere que la imagen sea same-origin o tenga CORS habilitado**: si el src es cross-origin sin headers CORS, el canvas queda "tainted" y `getImageData` lanza `SecurityError`. Mitigación: documentado claramente en README como prerequisito; sin workaround posible sin violar zero-deps.
- **ParticleField con muchas partículas puede ser costoso en mobile**: el RAF loop con N partículas y cálculo de fuerzas es O(N²) si hay interacción entre pares. Mitigación: el default de partículas es conservador; la repulsión es solo cursor-a-partícula (O(N)); interacción entre partículas queda como prop avanzada con warning en docs.
- **StickyScenes en viewports muy cortos o con teclados virtuales**: la altura `100dvh` mitiga el problema clásico de iOS con la barra de navegación, pero cambios de tamaño del viewport durante el scroll (teclado virtual) pueden desincronizar el cálculo sticky. Mitigación: `subscribeScroll` ya escucha `resize`; recalcula al cambiar el viewport.
- **ImageDissolve con imágenes de alta resolución**: `getImageData` de una imagen 4K por frame es costoso. Mitigación: la animación escala el canvas al tamaño renderizado (no al tamaño natural de la imagen); documentar que imágenes muy grandes pueden degradar la fluidez.
- **Wrappers de StickyScenes.Scene participan del layout sticky**: dentro del inner wrapper sticky, la distribución del espacio entre escenas es responsabilidad del consumer (las escenas se superponen `position: absolute` una sobre otra, o se usa la escena activa como contenido único). Documentado con ejemplo en README.
