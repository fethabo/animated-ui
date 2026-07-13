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
| **Ruido coherente seedable** | Simplex 2D + fBm en módulo puro (`createNoise2D`/`fbm` en `src/utils/noise.ts`, permutación via `prng.ts`) — habilita movimiento orgánico continuo sobre el motor canvas | WavesBackground, FlowField, TopographicBackground | ✅ Existe (Wave H) |
| **SVG stroke (line-drawing)** | `stroke-dasharray`/`stroke-dashoffset` sobre paths SVG medidos con `getTotalLength()`, animados con CSS inyectado (cero JS por frame); generación procedural de paths seedable via `prng.ts` | TextHighlighter, DrawPath, ScribbleDecoration | ✅ Wave L |
| **FLIP (layout animado)** | Medir rects antes/después de un cambio de layout (First/Last), invertir la diferencia con `transform` y animarla con WAAPI (Invert/Play) — anima *cambios de layout reales*, no presentación (`invert`/`diffKeys` en `src/utils/flip.ts` + play con tracker por instancia en `flip-play.ts`) | AnimatedList, AutoHeight | ✅ Wave M |

Hooks reutilizables ya disponibles: `useMousePosition`, `useReducedMotion`, `useResizeObserver`, `useInView`.

**Criterio de priorización:** maximizar componentes nuevos por decisión arquitectónica nueva. Las primeras tandas solo aplican convenciones existentes; el motor de scroll es la única decisión técnica genuinamente nueva del roadmap.

## Tier 1 — Efectos de mouse sobre contenedores

Motor existente (WAAPI + `useMousePosition`). Costo bajo, valor inmediato.

| Componente | Descripción | Notas técnicas |
| --- | --- | --- |
| **SpotlightCard** | Gradiente radial que sigue al cursor dentro del card, iluminando la zona bajo el mouse. | CSS custom property actualizada por `mousemove`; casi cero JS por frame. Componible con TiltCard. |
| **GlowBorder** | Borde con gradiente cónico animado, en loop autónomo o apuntando hacia el cursor. | `conic-gradient` + `@property` para animar el ángulo. CSS casi puro. |
| **MagneticElement** | Wrapper que "atrae" su contenido hacia el cursor al acercarse, con retorno elástico. | Mismo patrón WAAPI-con-momentum de TiltCard, aplicado a `translate`. |
| **RippleContainer** ✅ | Ondas expansivas desde el punto de click. | Hecho en Wave E: keyframes inyectados + nodo efímero por `pointerdown` autolimpiado en `animationend` (sin estado React por onda); capa `pointer-events:none` con `border-radius` heredado; fade estático bajo reduced motion. Cierra el Tier 1. Change [`ripple-countup-text-scroll`](openspec/changes/ripple-countup-text-scroll/). |
| **Dock** ✅ | Ítems que se magnifican según la proximidad del cursor (dock de macOS). | Hecho en Wave G: generalización de MagneticElement a N hijos — campana `cos` por distancia en módulo puro (`magnify.ts`) + `scale` directo al style por ref (sin re-renders); retorno por transition CSS; `Dock.Item` componible; horizontal/vertical. Change [`dock-beam-marquee-horizontal`](openspec/changes/dock-beam-marquee-horizontal/). |
| **BorderBeam** ✅ | Punto/cometa de luz que recorre el perímetro del borde en loop. | Hecho en Wave G: CSS casi puro (`offset-path: border-box` + `offset-distance` animado; degradación `@supports` sin cometa). Hermano estético de GlowBorder. Change [`dock-beam-marquee-horizontal`](openspec/changes/dock-beam-marquee-horizontal/). |
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
| **CountUp** ✅ | Número que cuenta hasta su valor al entrar al viewport (stats de landing). | Hecho en Wave E: RAF + `useInView` (once), muta `textContent` por ref (patrón ScrambleText); formateo + ease-out en módulo puro (`format.ts`); SSR renderiza el valor final (SEO-safe) y `aria-label` anuncia el definitivo. Change [`ripple-countup-text-scroll`](openspec/changes/ripple-countup-text-scroll/). |
| **RotatingText** ✅ | Rota entre palabras con transición (fade / slide-up / flip): "Hacemos *webs* / *apps* / *magia*". | Hecho en Wave F: timer encadenado + CSS inyectado; ancho transicionado por medición al cambiar (layout estable); accesible sin `aria-live` (aria-label estático). Change [`rotating-glitch-wavy-text`](openspec/changes/rotating-glitch-wavy-text/). |
| **GlitchText** ✅ | Glitch RGB-split con jitter intermitente. | Hecho en Wave F: CSS puro con pseudo-elementos `attr(data-text)` + `clip-path` animado; ráfagas generadas por módulo puro (`glitch-css.ts`) según `frequency`; modos loop/hover. Change [`rotating-glitch-wavy-text`](openspec/changes/rotating-glitch-wavy-text/). |
| **WavyText** ✅ | Caracteres ondulando en loop continuo. | Hecho en Wave F: split por carácter extraído a util compartida (`src/utils/split-text.ts`) + `animation-delay` negativo escalonado por índice; solo `translateY` compositado. Change [`rotating-glitch-wavy-text`](openspec/changes/rotating-glitch-wavy-text/). |

## Tier 3 — Scroll y parallax

Requiere decidir el motor de scroll (ver decisión pendiente abajo).

| Componente | Descripción | Motor mínimo |
| --- | --- | --- |
| **ScrollReveal** ✅ | Entrada animada al entrar al viewport, con stagger entre hijos. | Hecho en v0.4 con el hook nuevo `useInView` (IntersectionObserver), **antes** de decidir el motor completo, como estaba previsto. |
| **ParallaxLayers** ✅ | Capas con profundidades distintas ligadas a la posición de scroll. | Hecho en v0.5: `Layer` con `depth` (API simétrica a MouseParallax); el tracking solo corre con el contenedor cerca del viewport (`useInView` + scroll driver). |
| **ScrollProgress** ✅ | Barra/indicador de progreso de lectura. | Hecho en v0.5: barra fija con `scaleX` compositado, `aria-hidden`, activa bajo reduced motion. |
| **StickyScenes** ✅ | Secciones sticky que transicionan entre "escenas" durante el scroll (storytelling). | Hecho en v0.6: inner wrapper `position: sticky` + altura `100dvh + nScenes × sceneDuration`; progreso como `--aui-scene-index`/`--aui-scene-progress` y activación via `data-aui-active`, sin React state en el hot path. Reutiliza el motor de v0.5. |
| **StackedCards** ✅ | Cards que se fijan y se **apilan** una sobre otra al scrollear; las de abajo se encogen y oscurecen. | Hecho en Wave A: `position: sticky` nativo + scroll-driver para la profundidad (`--aui-stack-depth`), sin React state en el hot path. Distinto de StickyScenes (que hace cross-fade en un viewport fijo). Change [`text-reveal-stacked-cards-lava`](openspec/changes/text-reveal-stacked-cards-lava/). |
| **TextScrollReveal** ✅ | Párrafo cuyas palabras pasan de apagadas a "encendidas" a medida que se scrollea (highlight progresivo, el efecto de landing de moda). | Hecho en Wave E: split por palabra (util compartida `split-text.ts`) + scroll-driver escribiendo `--aui-text-scroll-progress`; opacidad/color por palabra via `calc()` con índice, sin React state en el hot path; remapeo de rango en módulo puro (`progress.ts`); tracking solo cerca del viewport. Change [`ripple-countup-text-scroll`](openspec/changes/ripple-countup-text-scroll/). |
| **HorizontalScrollSection** ✅ | Sección sticky cuyo contenido se desplaza **horizontalmente** conducido por el scroll vertical. | Hecho en Wave G: `position: sticky` + scroll-driver → `--aui-hscroll-progress` y `translateX(calc(...))` compositado (patrón StickyScenes); recorrido medido por observer; reduced motion = paneles apilados. Change [`dock-beam-marquee-horizontal`](openspec/changes/dock-beam-marquee-horizontal/). |
| **Marquee** ✅ | Cinta infinita de logos/contenido, pausable en hover; modo opcional `scrollVelocity` donde la velocidad y el skew responden a la velocidad de scroll. | Hecho en Wave G: base CSS pura (duplicación `aria-hidden` + keyframes de translate de media pista, repeticiones calculadas en `repeat.ts`); el modo velocity deriva la velocidad en el callback del scroll-driver (playbackRate + var de skew). Change [`dock-beam-marquee-horizontal`](openspec/changes/dock-beam-marquee-horizontal/). |

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
| **CircuitBackground** ✅ | Fondo de circuito PCB generado proceduralmente (seedable), con pulsos de luz recorriendo las pistas. | Hecho en Wave C: canvas + RAF + **PRNG seedable** nuevo (`src/utils/prng.ts`) y `polyline-pulse`. Ruteo = random walk ortogonal con pads (`router.ts`, no autorouter). Capa estática offscreen + pulsos por frame. Change [`circuit-tesla-attention-branches`](openspec/changes/circuit-tesla-attention-branches/). |
| **TeslaCoil** ✅ | Nodo central que arroja rayos jagged hacia afuera; en hover dirige rayos al cursor. | Hecho en Wave C: canvas + RAF + helper `jagged-bolt` (midpoint-displacement seedado). `pointer-events:none` sobre `children`; tracking del cursor por ref. Change [`circuit-tesla-attention-branches`](openspec/changes/circuit-tesla-attention-branches/). |
| **WavesBackground** ✅ | Líneas fluidas que ondulan orgánicamente (flow lines) generadas con ruido coherente. | Hecho en Wave H: canvas + RAF + **`noise.ts`** (simplex 2D seedable, módulo puro nuevo — la decisión arquitectónica de la wave, análoga a lo que fue `prng.ts` en Wave C); geometría en `geometry.ts` (muestreo ~8 px, color interpolado por línea). Change [`noise-waves-flow-topographic`](openspec/changes/noise-waves-flow-topographic/). |
| **FlowField** ✅ | Partículas que siguen un campo vectorial de ruido dejando trazos orgánicos. | Hecho en Wave H: reutiliza el patrón física-en-módulo-puro de ParticleField (`simulation.ts`) + `noise.ts` como campo de dirección; persistencia por velo semitransparente del fondo (una muestra de ruido por partícula por frame). Change [`noise-waves-flow-topographic`](openspec/changes/noise-waves-flow-topographic/). |
| **TopographicBackground** ✅ | Curvas de nivel animadas (mapa topográfico vivo), seedable. | Hecho en Wave H: marching squares en módulo puro sobre grilla de ~24 px del campo fBm; capa offscreen recalculada a intervalos (patrón CircuitBackground) + resize con debounce. Change [`noise-waves-flow-topographic`](openspec/changes/noise-waves-flow-topographic/). |
| **ConfettiBurst** ✅ | Ráfaga de confetti one-shot para celebración/feedback (submit exitoso, logro), disparable imperativamente. | Hecho en Wave I: canvas + RAF con física en módulo puro (`physics.ts`: abanico `angle`/`spread`/`power`, gravedad, drag, tumbling; culling in-place). **Decisión nueva: patrón de efecto one-shot imperativo** (handle por ref con `fire(opts)`; props = defaults, options por disparo; RAF que arranca al disparar y se auto-detiene con el pool vacío) — convención documentada en AGENTS.md para futuros efectos de la categoría (fireworks, sparkles). Change [`confetti-burst-one-shot`](openspec/changes/confetti-burst-one-shot/). |
| **StarfieldBackground** ✅ | Cielo estrellado vivo: estrellas que titilan de forma asíncrona + estrellas fugaces ocasionales, seedable. | Hecho en Wave K: canvas + RAF + `prng.ts`; campo de estrellas en capa estática offscreen (patrón CircuitBackground, `starfield.ts` puro) + titileo alpha senoidal/fugaces por frame. Change [`cursor-trail-starfield-matrix`](openspec/changes/cursor-trail-starfield-matrix/). |
| **MatrixRain** ✅ | Lluvia de glifos cayendo por columnas (code rain estilo Matrix), seedable. | Hecho en Wave K: canvas + RAF; estado por columna en `rain.ts` puro, `fillText` de cabezas con trail por veladura semitransparente (patrón FlowField); charset configurable, grilla por `fontSize` con cap de columnas. Change [`cursor-trail-starfield-matrix`](openspec/changes/cursor-trail-starfield-matrix/). |

### Post-Wave D (requieren el motor WebGL)

Cuando exista el esqueleto WebGL de GooeyBlobs (Wave D), se vuelven baratos y se evalúan como tanda propia — **no se planifican antes**:

- **ShaderGradient** — fondos tipo seda/líquido por fragment shader.
- **ImageDistortion** — distorsión de imagen en hover (efecto agency-style).
- **AuroraGL** — variante rica en shader de la aurora CSS.

## Tier 5 — Cursor / Idle

Efectos donde el puntero es el **objeto visual** (no solo input): dirigir la atención tras inactividad (AttentionCue, GuidingBranches) o decorar/reemplazar el cursor (Wave K). Canvas overlay o nodos `pointer-events:none`. Los efectos autónomos se desactivan bajo `prefers-reduced-motion`; los que solo siguen input directo pueden permanecer.

| Componente | Descripción | Notas técnicas |
| --- | --- | --- |
| **AttentionCue** ✅ | Tras inactividad del mouse, dibuja un trazo dirigido hacia un elemento referenciado ("mostrar el camino" a un botón). Modos ambient/directed. | Hecho en Wave C (idea #6 · **paso 1, cue simple**): idle-watcher + geometría cursor→`target` (`RefObject`/`Element`/selector) en `src/utils/idle-target.ts`. Overlay `pointer-events:none`; desactivado bajo reduced motion. Change [`circuit-tesla-attention-branches`](openspec/changes/circuit-tesla-attention-branches/). |
| **GuidingBranches** ✅ | Igual idea pero con **ramas orgánicas** que crecen desde el puntero; ambient (todas direcciones) o directed (sesgadas al target). | Hecho en Wave C (idea #6 · **paso final**): estéticas **intercambiables y extensibles** (`roots`/`lightning`) como módulos en `aesthetics/` (contrato común + esqueleto compartido); reutiliza PRNG, `jagged-bolt` e idle-watcher. Change [`circuit-tesla-attention-branches`](openspec/changes/circuit-tesla-attention-branches/). |
| **CursorTrail** ✅ | Estela de partículas o línea fluida que sigue al puntero. | Hecho en Wave K: canvas overlay `pointer-events:none` + física en módulo puro (`physics.ts`, patrón ParticleField); emisión throttleada por distancia recorrida, RAF activo solo con estela viva. Sigue input directo pero desplaza contenido visual autónomo → se desactiva bajo reduced motion. Change [`cursor-trail-starfield-matrix`](openspec/changes/cursor-trail-starfield-matrix/). |
| **CustomCursor** ✅ | Punto + anillo con lag elástico que reemplaza al cursor nativo; el anillo se agranda sobre elementos interactivos. | Hecho en Wave K: CSS vars runtime por pointermove (patrón SpotlightCard) + lag por transition; detección de interactivos por delegación (`closest('a, button, [role=button], [data-aui-cursor]')`), estado en `data-aui-cursor-state`. Restaura el cursor nativo en touch, sin hover y bajo reduced motion. Change [`cursor-trail-starfield-matrix`](openspec/changes/cursor-trail-starfield-matrix/). |
| **ImageTrail** ✅ | Imágenes que brotan siguiendo el mouse y se desvanecen (efecto agency/portfolio). | Hecho en Wave K: nodos `<img>` efímeros autolimpiados en `animationend` (patrón RippleContainer) con pool rotado cíclicamente y cap `maxConcurrent` (`emitter.ts` puro); precarga de imágenes al montar. Change [`cursor-trail-starfield-matrix`](openspec/changes/cursor-trail-starfield-matrix/). |

## Tier 6 — Celebración / feedback (one-shot imperativo)

Categoría abierta por ConfettiBurst (Wave I). Cada pieza aplica el **patrón one-shot imperativo** ya convencionalizado en AGENTS.md: overlay pasivo `pointer-events:none`, handle tipado via ref (`fire(options?)`), RAF que arranca al disparar y se auto-detiene con el pool vacío, PRNG seedable por disparo. Costo mínimo por componente — el esqueleto ya está pagado.

| Componente | Descripción | Notas técnicas |
| --- | --- | --- |
| **FireworksBurst** ✅ | Fuegos artificiales: cohetes que ascienden y explotan en partículas radiales con gravedad y fade. | Hecho en Wave J: física en módulo puro con un solo pool tipado por fase (`rocket` con wobble y apex → `spark` radial); despegue escalonado multi-cohete. El esqueleto one-shot se extrajo de ConfettiBurst a `src/components/shared/use-one-shot-canvas.ts` (1 callback `stepAndDraw` + spawn por disparo). Change [`fireworks-sparkle-click-emoji`](openspec/changes/fireworks-sparkle-click-emoji/). |
| **SparkleBurst** ✅ | Destellos/estrellitas breves alrededor de un punto (like, favorito, logro chico). | Hecho en Wave J: aparición escalonada + envolvente de vida (`sparkleScale`: crece rápido → se encoge) + rotación individual; estrella de 4 puntas por path (`starGeometry`, sin glifos de fuente). Change [`fireworks-sparkle-click-emoji`](openspec/changes/fireworks-sparkle-click-emoji/). |
| **EmojiBurst** ✅ | Ráfaga de emojis (🎉 ❤️ 👍) con física de confetti. | Hecho en Wave J: `fillText` sobre canvas (cero assets, `font` re-seteado solo al cambiar tamaño); física propia con rotación 2D (el tumbling 3D quedó específico del confetti); `count` default conservador (30). Change [`fireworks-sparkle-click-emoji`](openspec/changes/fireworks-sparkle-click-emoji/). |
| **ClickSpark** ✅ | Chispas automáticas en cada click dentro del contenedor, sin ref (variante declarativa de la categoría). | Hecho en Wave J: `onPointerDown` compuesto con el del consumer + mismo motor one-shot; alcance calibrado por la integral geométrica del drag (`v0 = radius·(1−d)/d`); children interactivos (overlay `pointer-events:none`). Change [`fireworks-sparkle-click-emoji`](openspec/changes/fireworks-sparkle-click-emoji/). |

## Tier 7 — SVG stroke (line-drawing)

**Primer uso de SVG del paquete** — motor nativo sin explotar hasta ahora. La técnica: animar `stroke-dashoffset` desde `getTotalLength()` hasta 0 con CSS inyectado (cero JS por frame), sobre paths provistos por el consumer o **generados proceduralmente** (seedables via `prng.ts`) para la estética hand-drawn. Una decisión de motor → tres componentes (misma economía que `noise.ts` en Wave H).

| Componente | Descripción | Notas técnicas |
| --- | --- | --- |
| **TextHighlighter** ✅ | Marcador que subraya/resalta/encierra/tacha una palabra al entrar al viewport, con temblor a mano alzada. | Hecho en Wave L: SVG overlay absoluto `aria-hidden` medido con `useResizeObserver`; path procedural seedable (`hand-drawn.ts`); triggers `in-view`/`mount`/`hover`; shapes: `underline`/`wavy-underline`/`circle`/`highlight`/`strike`/`box`. Change [`svg-stroke-highlighter-scribble`](openspec/changes/svg-stroke-highlighter-scribble/). |
| **DrawPath** ✅ | Wrapper genérico: cualquier SVG del consumer se "dibuja" trazo a trazo al entrar al viewport. | Hecho en Wave L: mide `getTotalLength()` de cada trazo descendiente (guarda para los que no lo exponen) y setea dash vars + stagger por orden documental; opt-out `data-aui-no-draw`; SSR completo y visible. Change [`svg-stroke-highlighter-scribble`](openspec/changes/svg-stroke-highlighter-scribble/). |
| **ScribbleDecoration** ✅ | Flechas, asteriscos, espirales y garabatos decorativos animados, procedurales y seedables. | Hecho en Wave L: shapes builtin como módulos tree-shakeables bajo el contrato `ScribbleShape` (`(size, seed, options) => d`, extensible por función del consumer); modo `repeat` cíclico; mismo motor de dash. Change [`svg-stroke-highlighter-scribble`](openspec/changes/svg-stroke-highlighter-scribble/). |

## Tier 8 — Layout animado (FLIP)

El hueco más "de producto" del paquete: todo lo anterior anima *presentación*; esto anima **cambios de layout reales** (la categoría que hace famosas a libs con dependencia como auto-animate o framer-motion `layout`). Motor FLIP con WAAPI, zero-dep: medir rects antes/después del render, invertir la diferencia con `transform`, animar hacia identidad.

| Componente | Descripción | Notas técnicas |
| --- | --- | --- |
| **AnimatedList** ✅ | Hijos que animan entrada, salida y **reordenamiento** (filtros, sorting, todo-lists). | Hecho en Wave M: FLIP sobre hijos keyed — snapshot First en fase de render (rects visuales: interrupciones sin salto), Last + play en `useLayoutEffect` antes del paint; salida = clon estático `aria-hidden` posicionado que anima y se remueve en finish. Change [`flip-animated-list-auto-height`](openspec/changes/flip-animated-list-auto-height/). |
| **AutoHeight** ✅ | Contenedor que transiciona su altura al cambiar el contenido (acordeones, tabs, disclosure) — el dolor universal de `height: auto`. | Hecho en Wave M: altura previa/nueva animada con WAAPI (`overflow: hidden` solo durante la transición, sin fijar `height` inline: al expirar el efecto queda `auto`); `width` opcional. Caso degenerado (1 dimensión) del mismo motor. Change [`flip-animated-list-auto-height`](openspec/changes/flip-animated-list-auto-height/). |

## Extensiones de componentes existentes

No suman entry points nuevos; extienden componentes ya publicados aplicando sus convenciones.

| Extensión | Descripción | Notas técnicas |
| --- | --- | --- |
| **AnimatedBackground: variantes `grid` / `rays` / `dots`** ✅ | Grilla retro-synthwave con perspectiva, rayos de luz rotando lentamente, y patrón de dots con pulso. | Hechas en Wave G: CSS puro con keyframes inyectados, mismo contrato de `colors`/`speed`/`intensity` y vars `--aui-*` que las variantes existentes. Change [`dock-beam-marquee-horizontal`](openspec/changes/dock-beam-marquee-horizontal/). |
| **GuidingBranches: estética `circuit`** ✅ | Ramas ortogonales tipo pista PCB. | Hecha en Wave C como módulo enchufable en `aesthetics/`. |

## Web de documentación

La web (`docs/`, change [`docs-site`](openspec/changes/docs-site/)) queda como infraestructura viva: cada componente nuevo suma su página como parte del definition-of-done. Mejoras futuras identificadas (no bloqueantes):

| Mejora | Notas |
| --- | --- |
| Tema light (toggle) | El sitio es dark-only en v1; las vars `--docs-*` ya aíslan el tema, sumar light es un set alternativo + toggle. |
| Playground de props editable | Hoy el demo es curado; portar el patrón del `ControlPanel` del test-app para variar props en runtime desde la web. |
| Buscador full-text | El filtro por nombre del sidebar alcanza para ~50 componentes; un índice de contenido escala mejor a futuro. |
| Prerendering / SEO | La SPA se sirve tal cual (SEO fuera de alcance en v1); evaluar `vite-plugin-ssg` si se quiere indexación. |

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
| **Wave C** ✅ | CircuitBackground + TeslaCoil + AttentionCue + GuidingBranches | **Primitivas generativas nuevas**: PRNG seedable (`prng.ts`) + helpers de trazo/pulso/rayo (`polyline-pulse`, `jagged-bolt`) + modelo idle/target (`idle-target.ts`); abre Tier 5 (cursor/idle). Change: [`circuit-tesla-attention-branches`](openspec/changes/circuit-tesla-attention-branches/). |
| **Wave D** ⬜ | GooeyBlobs / LavaLamp (metaball lava lamp con luz) | **Primer motor WebGL** (fragment shader de metaballs + sim de flotación; design.md propio). Sustituye al placeholder CSS `lava` para el caso rico; la variante CSS queda como fallback. Se planifica una vez avanzados los propose de Wave B y C. |
| **Wave E** ✅ | RippleContainer + CountUp + TextScrollReveal | Ninguna — keyframes inyectados, RAF-por-ref (`useInView`) y scroll-driver existentes. Los tres de mayor demanda/costo. Change: [`ripple-countup-text-scroll`](openspec/changes/ripple-countup-text-scroll/). |
| **Wave F** ✅ | RotatingText + GlitchText + WavyText | Ninguna — CSS puro + split de SplitReveal + timers. Cierra la categoría texto expresivo. Change: [`rotating-glitch-wavy-text`](openspec/changes/rotating-glitch-wavy-text/). |
| **Wave G** ✅ | Dock + BorderBeam + Marquee + HorizontalScrollSection + variantes `grid`/`rays`/`dots` | Ninguna — WAAPI/`useMousePosition`, CSS puro y scroll-driver existentes. Change: [`dock-beam-marquee-horizontal`](openspec/changes/dock-beam-marquee-horizontal/). |
| **Wave H** ✅ | WavesBackground + FlowField + TopographicBackground | **Ruido coherente seedable** (`noise.ts`, simplex 2D + fBm en módulo puro; design.md propio). Una primitiva → tres fondos. Change: [`noise-waves-flow-topographic`](openspec/changes/noise-waves-flow-topographic/). |
| **Wave I** ✅ | ConfettiBurst | **Patrón one-shot imperativo** (handle `fire()` via ref; design.md propio, convención registrada en AGENTS.md). Abre la categoría celebración/feedback. Change: [`confetti-burst-one-shot`](openspec/changes/confetti-burst-one-shot/). |
| **Wave J** ✅ | FireworksBurst + SparkleBurst + EmojiBurst + ClickSpark | Ninguna — aplica el patrón one-shot de Wave I; de paso el esqueleto (overlay+pool+RAF auto-detenible) se extrajo a un hook interno compartido (`use-one-shot-canvas`) que ConfettiBurst también consume. Cierra el grueso del Tier 6. Change: [`fireworks-sparkle-click-emoji`](openspec/changes/fireworks-sparkle-click-emoji/). |
| **Wave K** ✅ | CursorTrail + CustomCursor + ImageTrail + StarfieldBackground + MatrixRain | Ninguna — canvas overlay, `useMousePosition`, `prng.ts` y patrones existentes (ParticleField, CircuitBackground, FlowField). Cierra el Tier 5 (cursor) y los fondos temáticos del Tier 4. Change: [`cursor-trail-starfield-matrix`](openspec/changes/cursor-trail-starfield-matrix/). |
| **Wave L** ✅ | TextHighlighter + DrawPath + ScribbleDecoration | **Motor SVG stroke** (line-drawing con `stroke-dashoffset` + paths procedurales seedables; design.md propio). Abre el Tier 7. Change: [`svg-stroke-highlighter-scribble`](openspec/changes/svg-stroke-highlighter-scribble/). |
| **Wave M** ✅ | AnimatedList + AutoHeight | **Motor FLIP** (medición de rects + inversión WAAPI; design.md propio). Abre el Tier 8, la categoría layout. Change: [`flip-animated-list-auto-height`](openspec/changes/flip-animated-list-auto-height/). |
| **Docs** ✅ | Web de documentación (`docs/`) | **Sitio Vite + React** con una vista por componente, ES/EN, demos vivos, props auto-generadas desde los JSDoc (migrados a inglés como fuente canónica), ejemplos con copiar y deploy a Hostinger atado al release. Change: [`docs-site`](openspec/changes/docs-site/). |

Wave D es independiente de E–M: puede intercalarse en cualquier punto (E–G y J–K no dependen de nada nuevo; H, I, L y M solo de sus propias primitivas). Las piezas post-WebGL (ShaderGradient, ImageDistortion, AuroraGL) se proponen recién después de D. Entre las waves nuevas: J solo depende del patrón de Wave I (ya existente); K es independiente (ImageTrail se beneficia del patrón de nodos efímeros de RippleContainer si Wave E ya está aplicada, pero no lo requiere); L y M son independientes entre sí y del resto — cada una abre su propio motor.

Una tanda = un change de OpenSpec (`/opsx:propose` → `/opsx:apply` → `/opsx:archive`).

## Cómo agregar una idea nueva al roadmap

1. Clasificarla por **motor** (CSS / canvas / WAAPI / scroll) — eso determina el tier y el costo.
2. Verificarla contra los cuatro criterios fundacionales del encabezado. Si requiere una dependencia de runtime, se descarta o se rediseña.
3. Agregarla a la tabla del tier correspondiente con sus notas técnicas.
4. Al implementarla, seguir la spec [component-authoring](openspec/specs/component-authoring/spec.md) — es vinculante.
