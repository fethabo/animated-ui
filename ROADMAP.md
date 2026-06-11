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
| **SplitReveal** | Entrada con stagger por carácter o palabra. | ⚠️ Partir texto en spans rompe accesibilidad: requiere `aria-label` con el texto completo en el contenedor. |

## Tier 3 — Scroll y parallax

Requiere decidir el motor de scroll (ver decisión pendiente abajo).

| Componente | Descripción | Motor mínimo |
| --- | --- | --- |
| **ScrollReveal** ✅ | Entrada animada al entrar al viewport, con stagger entre hijos. | Hecho en v0.4 con el hook nuevo `useInView` (IntersectionObserver), **antes** de decidir el motor completo, como estaba previsto. |
| **ParallaxLayers** ✅ | Capas con profundidades distintas ligadas a la posición de scroll. | Hecho en v0.5: `Layer` con `depth` (API simétrica a MouseParallax); el tracking solo corre con el contenedor cerca del viewport (`useInView` + scroll driver). |
| **ScrollProgress** ✅ | Barra/indicador de progreso de lectura. | Hecho en v0.5: barra fija con `scaleX` compositado, `aria-hidden`, activa bajo reduced motion. |
| **StickyScenes** | Secciones sticky que transicionan entre "escenas" durante el scroll (storytelling). | Posición continua + coreografía; el más ambicioso del tier. Reutiliza el motor de v0.5. |

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
| **ParticleField** | Partículas con repulsión/atracción al cursor. | Canvas + RAF; reutiliza el patrón de contributions de PixelBackground. |
| **WaveCanvas / GooeyBlobs** | Blobs orgánicos que respiran y reaccionan al mouse. | Canvas; evaluar costo de blur por frame. |
| **ImageDissolve** | Transición de imagen con dithering ordenado. | ♻️ Reutiliza la matriz Bayer del behavior `reveal` de PixelBackground — joya escondida del roadmap. |

## Secuencia de releases

| Versión | Contenido | Decisión arquitectónica nueva |
| --- | --- | --- |
| **v0.2** | SpotlightCard + GlowBorder + MagneticElement | Ninguna — motor existente |
| **v0.3** ✅ | ShinyText + ScrambleText | Ninguna — abre categoría texto |
| **v0.4** ✅ | ScrollReveal + MouseParallax | Hook `useInView` (IntersectionObserver) |
| **v0.5** ✅ | ParallaxLayers + ScrollProgress | **Motor de scroll** (design.md propio) |
| **v0.6+** | ParticleField / ImageDissolve / StickyScenes | Según pieza |

Una tanda = un change de OpenSpec (`/opsx:propose` → `/opsx:apply` → `/opsx:archive`).

## Cómo agregar una idea nueva al roadmap

1. Clasificarla por **motor** (CSS / canvas / WAAPI / scroll) — eso determina el tier y el costo.
2. Verificarla contra los cuatro criterios fundacionales del encabezado. Si requiere una dependencia de runtime, se descarta o se rediseña.
3. Agregarla a la tabla del tier correspondiente con sus notas técnicas.
4. Al implementarla, seguir la spec [component-authoring](openspec/specs/component-authoring/spec.md) — es vinculante.
