# Roadmap — @fethabo/animated-ui

Hoja de ruta de componentes animados. Cada idea se evalúa contra los criterios fundacionales del paquete (ver [AGENTS.md](AGENTS.md) y la spec [component-authoring](openspec/specs/component-authoring/spec.md)):

1. **Liviano** — cero dependencias de runtime; solo APIs nativas (CSS, canvas, WAAPI, observers) y React.
2. **Usable** — defaults visualmente atractivos; instalar e importar debe ser suficiente.
3. **Compatible** — Vite, Astro (island) y Next.js App Router, con React 18+ en JavaScript o TypeScript.
4. **Dual de consumo** — usable como componente del paquete **o** copiable como ejemplo standalone desde `/examples`.

## Motores de animación

El costo real de cada componente lo determina el "motor" que necesita. Hoy existen tres, establecidos en la foundation (`openspec/changes/archive/2026-06-10-animated-ui-foundation/design.md`):

| Motor | Técnica | Usado por | Estado |
| --- | --- | --- | --- |
| **CSS** | `@keyframes` inyectados via `injectStyles()`, cero JS por frame | AnimatedBackground | ✅ Existe |
| **Canvas** | `<canvas>` + `requestAnimationFrame`, contributions componibles por frame | PixelBackground | ✅ Existe |
| **WAAPI** | `element.animate()` con interpolación que preserva momentum | TiltCard | ✅ Existe |
| **Scroll (viewport)** | IntersectionObserver via hook `useInView` | ScrollReveal | ✅ Existe (v0.4) |
| **Scroll (posición continua)** | Listener pasivo + RAF escribiendo CSS vars (`subscribeScroll` en `src/utils/scroll-driver.ts`) | ParallaxLayers, ScrollProgress | ✅ Existe (v0.5) |

Hooks reutilizables ya disponibles: `useMousePosition`, `useReducedMotion`, `useResizeObserver`, `useInView`.

**Criterio de priorización:** maximizar componentes nuevos por decisión arquitectónica nueva. Las primeras tandas solo aplican convenciones existentes; el motor de scroll es la única decisión técnica genuinamente nueva del roadmap.

## Tier 1 — Efectos de mouse sobre contenedores

Motor existente (WAAPI + `useMousePosition`). Costo bajo, valor inmediato.

| Componente | Descripción | Notas técnicas |
| --- | --- | --- |
| **SpotlightCard** | Gradiente radial que sigue al cursor dentro del card, iluminando la zona bajo el mouse. | CSS custom property actualizada por `mousemove`; casi cero JS por frame. Componible con TiltCard. |
| **GlowBorder** | Borde con gradiente cónico animado, en loop autónomo o apuntando hacia el cursor. | `conic-gradient` + `@property` para animar el ángulo. CSS casi puro. |
| **MagneticElement** | Wrapper que "atrae" su contenido hacia el cursor al acercarse, con retorno elástico. | Mismo patrón WAAPI-con-momentum de TiltCard, aplicado a `translate`. |
| **RippleContainer** | Ondas expansivas desde el punto de click. | Keyframes inyectados + nodo efímero por click. |
| **MouseParallax** ✅ | Contenedor con capas a distintas profundidades desplazadas según la posición del mouse — parallax creativo **sin scroll**. | Primo natural de TiltCard. Hecho en v0.4: CSS vars por mousemove (patrón SpotlightCard) + `MouseParallax.Layer` con `depth`. |

## Tier 2 — Efectos de texto

Categoría nueva, sin decisiones arquitectónicas (RAF o CSS puro).

| Componente | Descripción | Notas técnicas |
| --- | --- | --- |
| **ShinyText** ✅ | Brillo que barre el texto en loop. | CSS puro con `background-clip: text`. Hecho en v0.3. |
| **GradientText** ✅ | Texto con gradiente animado. | Fusionado con ShinyText (colores de base y brillo customizables), como anticipaba el roadmap. |
| **ScrambleText** ✅ | El texto se "descifra" carácter por carácter (efecto decrypt/Matrix). | RAF que muta `textContent` via ref; sin DOM pesado ni re-renders por frame. Hecho en v0.3. |
| **SplitReveal** ✅ | Entrada con stagger por carácter, palabra o **línea**; presets `fade`/`slide-up`/`blur`; dispara al montar o en viewport. | Hecho en Wave A: CSS puro + `useInView`; texto completo en `aria-label` y unidades `aria-hidden`; split por línea medido en cliente (`useResizeObserver`). Change [`text-reveal-stacked-cards-lava`](openspec/changes/text-reveal-stacked-cards-lava/). |
| **TypewriterText** ✅ | Revelado tipo máquina de escribir, con cursor parpadeante y modo loop multi-string (escribe→borra→siguiente). | Hecho en Wave A: RAF que muta `textContent` por ref (patrón ScrambleText), progresión por timestamp, accesible via `aria-label`. Change [`text-reveal-stacked-cards-lava`](openspec/changes/text-reveal-stacked-cards-lava/). |

## Tier 3 — Scroll y parallax

Requiere decidir el motor de scroll (ver decisión pendiente abajo).

| Componente | Descripción | Motor mínimo |
| --- | --- | --- |
| **ScrollReveal** ✅ | Entrada animada al entrar al viewport, con stagger entre hijos. | Hecho en v0.4 con el hook nuevo `useInView` (IntersectionObserver), **antes** de decidir el motor completo, como estaba previsto. |
| **ParallaxLayers** ✅ | Capas con profundidades distintas ligadas a la posición de scroll. | Hecho en v0.5: `Layer` con `depth` (API simétrica a MouseParallax); el tracking solo corre con el contenedor cerca del viewport (`useInView` + scroll driver). |
| **ScrollProgress** ✅ | Barra/indicador de progreso de lectura. | Hecho en v0.5: barra fija con `scaleX` compositado, `aria-hidden`, activa bajo reduced motion. |
| **StickyScenes** ✅ | Secciones sticky que transicionan entre "escenas" durante el scroll (storytelling). | Hecho en v0.6: inner wrapper `position: sticky` + altura `100dvh + nScenes × sceneDuration`; progreso como `--aui-scene-index`/`--aui-scene-progress` y activación via `data-aui-active`, sin React state en el hot path. Reutiliza el motor de v0.5. |
| **StackedCards** ✅ | Cards que se fijan y se **apilan** una sobre otra al scrollear; las de abajo se encogen y oscurecen. | Hecho en Wave A: `position: sticky` nativo + scroll-driver para la profundidad (`--aui-stack-depth`), sin React state en el hot path. Distinto de StickyScenes (que hace cross-fade en un viewport fijo). Change [`text-reveal-stacked-cards-lava`](openspec/changes/text-reveal-stacked-cards-lava/). |

### Decisión resuelta (v0.5): motor de scroll

```
                    ¿Motor de scroll?
                          │
        ┌─────────────────┼──────────────────────┐
        ▼                 ▼                      ▼
 IntersectionObserver  scroll listener      CSS Scroll-Driven
 (entrar/salir de      + RAF (posición      Animations
  viewport)            continua)            (animation-timeline)
        │                 │                      │
  ✅ useInView (v0.4)  ✅ ELEGIDO (v0.5)     ⬜ Descartada por ahora:
  Alcanza para        subscribeScroll en    soporte reciente (Safari 26+,
  ScrollReveal.       scroll-driver.ts.     Firefox 136+) obligaría a
                                            mantener un fallback JS
                                            completo en paralelo.
```

El motor elegido escribe CSS vars sobre el elemento (sin estado de React); el movimiento corre en el compositor via `calc()`. **Criterio de migración futura**: cuando el baseline de browsers incluya scroll-driven animations de forma generalizada, el motor puede migrar por dentro sin cambiar la API pública (las vars y `calc()` quedan; cambia quién las anima). Rationale completo: `openspec/changes/archive/*parallax-layers-scroll-progress/design.md`.

## Tier 4 — Canvas ambicioso

Motor existente, pero costo alto por pieza.

| Componente | Descripción | Notas técnicas |
| --- | --- | --- |
| **ParticleField** ✅ | Partículas con repulsión/atracción al cursor. | Hecho en v0.6: canvas + RAF propio con física en módulo puro (`physics.ts`); fuerza cursor-a-partícula (O(N)), rebote en bordes, estado en ref (sin re-renders por frame). |
| **ParticleField: constellation + drift** ✅ | Extensión: líneas entre partículas cercanas y al cursor (opt-in O(N²)) + modos de deriva (`snow`/`embers`/`bubbles`). | Hecho en Wave B: líneas en módulo puro `links.ts` (descarte por bounding box antes del `sqrt`), modos de deriva en `physics.ts` (relajación a velocidad terminal + wrap; `life` para el fade de `embers`); defaults (`drift='bounce'`, `links=false`) preservan el comportamiento actual. Change [`particle-field-constellation-drift`](openspec/changes/particle-field-constellation-drift/). |
| **GooeyBlobs / LavaLamp** 🔜 | Lámpara de lava "de verdad": burbujas no deterministas de tamaños variables que ascienden/descienden por flotación térmica, se desvían al cruzarse, derivan horizontalmente y se funden con bordes gooey, **con luz** (glow retroiluminado tipo bulbo + specular sutil). Funciona en cualquier aspecto. | **Primer motor WebGL** del paquete (decisión arquitectónica nueva → design.md propio). Dos partes: **sim CPU liviano** (N≈20–30 blobs con `pos/vel/radio/temp`, flotación hot↑/cold↓, fuerzas suaves para el desvío, h-drift, paredes; O(N²) ok) + **render por fragment-shader** (campo metaball `Σ rᵢ²/d²`, umbral `smoothstep` para el gooey, luz desde `∇F` + rampa vertical). Raw WebGL, dependency-less. La variante CSS `lava` ✅ (Wave A) queda como **fallback** estático para SSR / sin-WebGL / reduced-motion. Opcional: reacción al cursor. Es el efecto que antes figuraba como "WaveCanvas / GooeyBlobs". **Wave D** (tras B y C). |
| **ImageDissolve** ✅ | Transición de imagen con dithering ordenado. | Hecho en v0.6: ♻️ reutiliza la matriz Bayer (extraída a `src/utils/bayer-matrix.ts`, compartida con el behavior `reveal` de PixelBackground); `drawImage` + `getImageData` sobre canvas superpuesto, con degradación ante CORS. |
| **CircuitBackground** 🔜 | Fondo de circuito PCB generado proceduralmente (seedable), con pulsos de luz recorriendo las pistas. | Canvas + RAF + **PRNG seedable** nuevo (`src/utils/prng.ts`) y `polyline-pulse`. Ruteo = random walk ortogonal con pads (no autorouter). Wave C — change [`circuit-tesla-attention-branches`](openspec/changes/circuit-tesla-attention-branches/). |
| **TeslaCoil** 🔜 | Nodo central que arroja rayos jagged hacia afuera; en hover dirige rayos al cursor. | Canvas + RAF + helper `jagged-bolt` (midpoint-displacement seedado). `pointer-events:none` sobre `children`. Wave C. |

## Tier 5 — Cursor / Idle (director de atención)

Categoría nueva. Efectos que reaccionan a la **inactividad** del puntero para guiar la atención del usuario hacia un elemento. Canvas overlay `pointer-events:none`. Se desactivan bajo `prefers-reduced-motion` (son autónomos, no input directo).

| Componente | Descripción | Notas técnicas |
| --- | --- | --- |
| **AttentionCue** 🔜 | Tras inactividad del mouse, dibuja un trazo dirigido hacia un elemento referenciado ("mostrar el camino" a un botón). Modos ambient/directed. | Idea #6 · **paso 1 (cue simple)**. idle-watcher + geometría cursor→`target` (`RefObject`/`Element`/selector). Customizable: `idleDelay`, `color`, `duration`, `speed`, `maxDistance`. Wave C. |
| **GuidingBranches** 🔜 | Igual idea pero con **ramas orgánicas** que crecen desde el puntero; ambient (todas direcciones) o directed (sesgadas al target). | Idea #6 · **paso final**. Estéticas **intercambiables y extensibles** (`roots`/`lightning`/…) como módulos en `aesthetics/`; reutiliza PRNG, `jagged-bolt` e idle-watcher. Customizable: color, duración, velocidad, distancia máxima, densidad. Wave C. |

## Secuencia de releases

| Versión | Contenido | Decisión arquitectónica nueva |
| --- | --- | --- |
| **v0.2** ✅ | SpotlightCard + GlowBorder + MagneticElement | Ninguna — motor existente |
| **v0.3** ✅ | ShinyText + ScrambleText | Ninguna — abre categoría texto |
| **v0.4** ✅ | ScrollReveal + MouseParallax | Hook `useInView` (IntersectionObserver) |
| **v0.5** ✅ | ParallaxLayers + ScrollProgress | **Motor de scroll** (design.md propio) |
| **v0.6+** ✅ | ParticleField + ImageDissolve + StickyScenes | Ninguna nueva — reutiliza canvas+RAF, la matriz Bayer y el motor de scroll de v0.5; cierra Tier 4 (canvas) y Tier 3 (scroll). |
| **Wave A** ✅ | TypewriterText + SplitReveal + StackedCards + variante `lava` | Ninguna — reutiliza RAF de texto, CSS puro + `useInView`, scroll-driver y variantes CSS. Change: [`text-reveal-stacked-cards-lava`](openspec/changes/text-reveal-stacked-cards-lava/). |
| **Wave B** ✅ | ParticleField: constellation/links + modos de deriva | Ninguna — extiende el motor canvas existente (líneas O(N²) opt-in). Change: [`particle-field-constellation-drift`](openspec/changes/particle-field-constellation-drift/). |
| **Wave C** ⬜ | CircuitBackground + TeslaCoil + AttentionCue + GuidingBranches | **Primitivas generativas nuevas**: PRNG seedable + helpers de trazo/pulso/rayo (design.md propio). Change: [`circuit-tesla-attention-branches`](openspec/changes/circuit-tesla-attention-branches/). |
| **Wave D** ⬜ | GooeyBlobs / LavaLamp (metaball lava lamp con luz) | **Primer motor WebGL** (fragment shader de metaballs + sim de flotación; design.md propio). Sustituye al placeholder CSS `lava` para el caso rico; la variante CSS queda como fallback. Se planifica una vez avanzados los propose de Wave B y C. |

Una tanda = un change de OpenSpec (`/opsx:propose` → `/opsx:apply` → `/opsx:archive`).

## Cómo agregar una idea nueva al roadmap

1. Clasificarla por **motor** (CSS / canvas / WAAPI / scroll) — eso determina el tier y el costo.
2. Verificarla contra los cuatro criterios fundacionales del encabezado. Si requiere una dependencia de runtime, se descarta o se rediseña.
3. Agregarla a la tabla del tier correspondiente con sus notas técnicas.
4. Al implementarla, seguir la spec [component-authoring](openspec/specs/component-authoring/spec.md) — es vinculante.
