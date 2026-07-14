# @fethabo/animated-ui

[![npm](https://img.shields.io/npm/v/@fethabo/animated-ui)](https://www.npmjs.com/package/@fethabo/animated-ui)

Componentes animados livianos para React: cero dependencias de runtime, tree-shakeable, y customizables al 100% via props y CSS custom properties (`--aui-*`).

```bash
npm install @fethabo/animated-ui
```

```jsx
import { AnimatedBackground } from '@fethabo/animated-ui'

export default function Hero() {
  return (
    <section style={{ position: 'relative', minHeight: '60vh' }}>
      <AnimatedBackground variant="aurora" />
      <h1 style={{ position: 'relative' }}>Hola mundo</h1>
    </section>
  )
}
```

No hace falta importar ningún CSS: los estilos se inyectan automáticamente al montar cada componente.

📖 **Documentación interactiva**: en **[animated-ui-docs.fethabo.cloud](https://animated-ui-docs.fethabo.cloud)** podés ver la documentación completa y los ejemplos de la última versión —cada componente con demo vivo, props, ejemplos con copiar y limitaciones, en español e inglés. El código de la web vive en [`docs/`](docs/).

## Compatibility

- **React 18+** (`react` y `react-dom` son peer dependencies).
- **Vite**, **Next.js App Router** (los componentes incluyen `'use client'`), y **Astro** (como island con `client:load`).
- **JavaScript y TypeScript**: el paquete publica JavaScript compilado; los tipos `.d.ts` los aprovechan los proyectos TypeScript automáticamente y los proyectos JavaScript los ignoran. No necesitás TypeScript para usarlo.
- **SSR-safe**: ningún componente accede a `document`/`window` durante el render; las animaciones arrancan tras la hidratación.
- Todos los componentes respetan `prefers-reduced-motion` por defecto (desactivable con `respectReducedMotion={false}`).

## Release Workflow

Las releases se manejan con `@fethabo/tagman`, que es la herramienta de release del repositorio.

- `npm run release` es el entrypoint único del flujo de release (`npm run release:dry-run` para previsualizar).
- La configuración vive en [tagman.config.json](tagman.config.json): repo `npm`, tags en formato `@fethabo/animated-ui@x.y.z`.
- `CHANGELOG.md` se genera a partir de los commits acumulados desde el tag anterior (convención de commits), sin edición manual.
- `package.json` se actualiza al momento de crear un nuevo tag, con la versión alineada al tag generado.
- La herramienta de release no forma parte de las dependencias de runtime del paquete publicado (`files: ["dist"]`).

## Components

| Componente | Descripción |
| --- | --- |
| [AnimatedBackground](#animatedbackground) | Background animado con CSS puro, con variantes `aurora`, `mesh`, `noise`, `beam`, `lava`, `grid`, `rays` y `dots`. |
| [PixelBackground](#pixelbackground) | Grilla de píxeles sobre canvas con behaviors combinables: `hover`, `idle` y `reveal`. |
| [TiltCard](#tiltcard) | Card con efecto 3D tilt via WAAPI, con glare opcional y render prop de estado. |
| [SpotlightCard](#spotlightcard) | Contenedor con spotlight radial que sigue al cursor, sin re-renders por frame. |
| [GlowBorder](#glowborder) | Borde de gradiente cónico animado, en loop autónomo o apuntando al cursor. |
| [MagneticElement](#magneticelement) | Wrapper que atrae su contenido hacia el cursor, con retorno elástico y render prop. |
| [RippleContainer](#ripplecontainer) | Ondas expansivas desde el punto de click (material ripple), con nodos efímeros autolimpiados. |
| [ShinyText](#shinytext) | Texto con un brillo que lo barre en loop, CSS puro; sirve también como texto con gradiente. |
| [ScrambleText](#scrambletext) | Texto que se "descifra" carácter por carácter (efecto decrypt/Matrix), accesible. |
| [TypewriterText](#typewritertext) | Revela texto carácter por carácter (máquina de escribir) con cursor parpadeante y modo loop multi-string, accesible. |
| [ScrollReveal](#scrollreveal) | Revela su contenido al entrar al viewport, con dirección y stagger entre hijos. |
| [SplitReveal](#splitreveal) | Parte el texto en char/word/line y revela cada unidad con stagger (presets `fade`/`slide-up`/`blur`), CSS puro y accesible. |
| [RotatingText](#rotatingtext) | Rota cíclicamente entre palabras con transición (`fade`/`slide-up`/`flip`) y layout estable, accesible sin `aria-live`. |
| [GlitchText](#glitchtext) | Glitch RGB-split intermitente para titulares, CSS puro con pseudo-elementos y `clip-path`. |
| [WavyText](#wavytext) | Caracteres ondulando en loop continuo (ola que recorre el texto), CSS puro y accesible. |
| [CountUp](#countup) | Número que cuenta hasta su valor al entrar al viewport, con easing de salida y formato configurable, SEO-safe. |
| [MouseParallax](#mouseparallax) | Capas con profundidad que se desplazan según el mouse, sin re-renders por frame. |
| [ParallaxLayers](#parallaxlayers) | Capas con profundidad ligadas a la posición de scroll, sin re-renders por frame. |
| [ScrollProgress](#scrollprogress) | Barra fija de progreso de lectura de la página, compositada. |
| [ParticleField](#particlefield) | Campo de partículas sobre canvas con repulsión/atracción al cursor, modos de deriva y líneas de conexión (constellation). |
| [ImageDissolve](#imagedissolve) | Transición entre imágenes con dithering ordered (matriz Bayer 8×8) al cambiar `src`. |
| [StickyScenes](#stickyscenes) | Secciones sticky que transicionan entre escenas durante el scroll, sin re-renders por frame. |
| [StackedCards](#stackedcards) | Cards que se fijan y se apilan una sobre otra al scrollear; las de abajo se encogen/oscurecen, sin re-renders por frame. |
| [TextScrollReveal](#textscrollreveal) | Párrafo cuyas palabras se "encienden" progresivamente según el avance del scroll (highlight progresivo), reversible y accesible. |
| [CircuitBackground](#circuitbackground) | Fondo de circuito PCB generado proceduralmente (seedable y determinista), con pulsos de luz recorriendo las pistas. |
| [TeslaCoil](#teslacoil) | Nodo central que arroja rayos jagged hacia afuera; en hover dirige un rayo al cursor. `children` interactivo. |
| [AttentionCue](#attentioncue) | Tras inactividad del mouse, dibuja un trazo dirigido a un elemento (modo directed) o ambiental. *Idle / Attention.* |
| [GuidingBranches](#guidingbranches) | Tras inactividad, ramas orgánicas generativas que crecen desde el puntero, con estéticas intercambiables. *Idle / Attention.* |
| [Dock](#dock) | Fila de ítems que se magnifican por proximidad del cursor (dock de macOS), horizontal o vertical. |
| [BorderBeam](#borderbeam) | Cometa de luz que recorre el perímetro del borde en loop, CSS casi puro (`offset-path`). |
| [Marquee](#marquee) | Cinta infinita de contenido sin costura, accesible, con pausa en hover y modo acoplado a la velocidad de scroll. |
| [HorizontalScrollSection](#horizontalscrollsection) | Sección sticky cuyo contenido se desplaza horizontalmente conducido por el scroll vertical. |
| [WavesBackground](#wavesbackground) | Fondo de líneas fluidas que ondulan orgánicamente con ruido simplex seedable. |
| [FlowField](#flowfield) | Partículas que siguen un campo vectorial de ruido dejando trazos orgánicos con fade, seedable. |
| [TopographicBackground](#topographicbackground) | Curvas de nivel animadas (mapa topográfico vivo) extraídas por marching squares, seedable. |
| [ConfettiBurst](#confettiburst) | Ráfaga de confetti one-shot disparable imperativamente via ref (`fire()`), para celebrar submits, logros, likes. *Celebración / Feedback.* |
| [FireworksBurst](#fireworksburst) | Fuegos artificiales one-shot: cohetes que ascienden y explotan en chispas radiales, via ref (`fire()`). *Celebración / Feedback.* |
| [SparkleBurst](#sparkleburst) | Destellos breves (estrellas de 4 puntas) alrededor de un punto, via ref (`fire()`) — likes, favoritos. *Celebración / Feedback.* |
| [EmojiBurst](#emojiburst) | Ráfaga de emojis con física de confetti, renderizados con la fuente de la plataforma (cero assets), via ref (`fire()`). *Celebración / Feedback.* |
| [ClickSpark](#clickspark) | Chispas automáticas en cada click dentro del contenedor — declarativo, sin ref; children interactivos. *Celebración / Feedback.* |
| [StarfieldBackground](#starfieldbackground) | Cielo estrellado vivo: estrellas titilando asíncronas + fugaces ocasionales, seedable y determinista. |
| [MatrixRain](#matrixrain) | Lluvia de glifos cayendo por columnas (code rain), seedable, con charset y colores configurables. |
| [CursorTrail](#cursortrail) | Estela de partículas o línea fluida que sigue al puntero dentro del contenedor. *Cursor.* |
| [CustomCursor](#customcursor) | Punto + anillo con lag elástico que reemplaza al cursor nativo dentro del contenedor; el anillo se agranda sobre interactivos. *Cursor.* |
| [ImageTrail](#imagetrail) | Imágenes efímeras que brotan siguiendo el mouse y se desvanecen (efecto agency/portfolio). *Cursor.* |
| [TextHighlighter](#texthighlighter) | Marcador a mano alzada que subraya/resalta/encierra/tacha texto inline, dibujándose al entrar al viewport. *SVG stroke.* |
| [DrawPath](#drawpath) | Cualquier SVG del consumer se "dibuja" trazo a trazo al entrar al viewport, con stagger entre paths. *SVG stroke.* |
| [ScribbleDecoration](#scribbledecoration) | Garabatos decorativos animados (flecha, asterisco, espiral…), procedurales, seedables y extensibles por función. *SVG stroke.* |
| [AnimatedList](#animatedlist) | Hijos keyed que animan entrada, salida y reordenamiento (filtros, sorting, todo-lists). *Layout / FLIP.* |
| [AutoHeight](#autoheight) | Contenedor que transiciona su altura (y opcionalmente ancho) al cambiar el contenido — la forma de animar `height: auto`. *Layout / FLIP.* |

## AnimatedBackground

Background animado renderizado con CSS puro (sin JS por frame). Se posiciona `absolute, inset: 0` para cubrir su contenedor `position: relative`, o el viewport completo con `fixed`. Cada variante tiene defaults visualmente atractivos y expone sus colores, velocidad e intensidad tanto por props como por CSS custom properties.

**Variante `lava`:** blobs opacos que ascienden y descienden fundiéndose con el truco "gooey" (`filter: blur() + contrast()`), evocando una lámpara de lava. El `filter` sobre áreas grandes tiene costo de pintado: rinde mejor en contenedores acotados que a pantalla completa en gama baja. Con `prefers-reduced-motion` degrada a una composición estática de los blobs fundidos.

**Variantes `grid` / `rays` / `dots`:** grilla retro-synthwave en perspectiva cuyas líneas avanzan hacia el horizonte (loop por período de celda exacto, sin salto), haces de luz que rotan lentamente en vaivén desde un vértice superior, y retícula de puntos con pulso suave de opacidad/escala. Mismo contrato de `colors`/`speed`/`intensity` que el resto.

```jsx
import { AnimatedBackground } from '@fethabo/animated-ui'

<div style={{ position: 'relative', height: 400 }}>
  <AnimatedBackground
    variant="beam"
    colors={['rgba(251,191,36,0.4)', 'rgba(249,115,22,0.3)']}
    speed={9}
  />
</div>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `variant` | `'aurora' \| 'mesh' \| 'noise' \| 'beam' \| 'lava' \| 'grid' \| 'rays' \| 'dots'` | `'aurora'` | Variante visual de la animación. |
| `colors` | `string[]` | colores de la variante | Paleta de la animación (hasta 4 colores); los no provistos caen al default de la variante. |
| `speed` | `number` | según variante | Segundos que tarda un ciclo completo de la animación. |
| `intensity` | `number` | `1` | Intensidad/opacidad global del efecto, de 0 a 1. |
| `fixed` | `boolean` | `false` | Si es `true` usa `position: fixed` para cubrir el viewport completo. |
| `respectReducedMotion` | `boolean` | `true` | Con `prefers-reduced-motion` muestra el gradiente estático, sin animación. |
| `className` | `string` | — | Clases adicionales para el elemento root (Tailwind, CSS modules, etc.). |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

Todas se pueden pisar desde tu CSS en cascada, e.g. `.mi-bg { --aui-aurora-speed: 20s; }`.

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-aurora-color-1` | `#5b21b6` | Primer gradiente de la aurora (violeta). |
| `--aui-aurora-color-2` | `#0ea5e9` | Segundo gradiente (cyan). |
| `--aui-aurora-color-3` | `#10b981` | Tercer gradiente (verde). |
| `--aui-aurora-color-4` | `#ec4899` | Cuarto gradiente (rosa). |
| `--aui-aurora-speed` | `14s` | Duración de un ciclo completo. |
| `--aui-aurora-blur` | `60px` | Desenfoque que difumina los gradientes. |
| `--aui-aurora-opacity` | `1` | Intensidad global del efecto. |
| `--aui-mesh-color-1` | `#7c3aed` | Blob superior izquierdo (violeta). |
| `--aui-mesh-color-2` | `#db2777` | Blob superior derecho (magenta). |
| `--aui-mesh-color-3` | `#2563eb` | Blob inferior derecho (azul). |
| `--aui-mesh-color-4` | `#0d9488` | Blob inferior izquierdo (teal). |
| `--aui-mesh-speed` | `18s` | Duración de un ciclo de morphing. |
| `--aui-mesh-blur` | `40px` | Desenfoque que funde los blobs. |
| `--aui-mesh-opacity` | `1` | Intensidad global del efecto. |
| `--aui-noise-base` | `#0a0a0a` | Color base de fondo bajo el grain. |
| `--aui-noise-opacity` | `0.12` | Opacidad del grain (intensidad). |
| `--aui-noise-speed` | `0.6s` | Velocidad del parpadeo del grain. |
| `--aui-beam-base` | `#050510` | Color de fondo detrás de los rayos. |
| `--aui-beam-color-1` | `rgba(124, 58, 237, 0.45)` | Primer haz de luz. |
| `--aui-beam-color-2` | `rgba(14, 165, 233, 0.35)` | Segundo haz de luz. |
| `--aui-beam-color-3` | `rgba(236, 72, 153, 0.3)` | Tercer haz de luz. |
| `--aui-beam-speed` | `16s` | Duración de una rotación completa. |
| `--aui-beam-blur` | `24px` | Desenfoque que suaviza los bordes de los rayos. |
| `--aui-beam-opacity` | `1` | Intensidad global del efecto. |
| `--aui-lava-base` | `#160a2b` | Color de fondo opaco detrás de los blobs. |
| `--aui-lava-color-1` | `#ff4d6d` | Primer color de blob. |
| `--aui-lava-color-2` | `#ff924d` | Segundo color de blob. |
| `--aui-lava-speed` | `16s` | Duración de un ascenso/descenso completo. |
| `--aui-lava-blur` | `16px` | Desenfoque del truco gooey. |
| `--aui-lava-contrast` | `16` | Contraste que "endurece" los bordes del blur (fusión gooey). |
| `--aui-lava-size` | `280px` | Diámetro base de los blobs. |
| `--aui-lava-opacity` | `1` | Intensidad global del efecto. |
| `--aui-grid-line` | `rgba(124, 58, 237, 0.5)` | Color de las líneas de la grilla synthwave. |
| `--aui-grid-base` | `#050510` | Color de fondo / cielo. |
| `--aui-grid-glow` | `rgba(236, 72, 153, 0.35)` | Glow del horizonte. |
| `--aui-grid-cell` | `48px` | Lado de la celda de la grilla. |
| `--aui-grid-speed` | `8s` | Duración de un avance de celda completo. |
| `--aui-grid-opacity` | `1` | Intensidad global del efecto. |
| `--aui-rays-color-1` | `rgba(251, 191, 36, 0.4)` | Primer haz de luz. |
| `--aui-rays-color-2` | `rgba(249, 115, 22, 0.28)` | Segundo haz de luz. |
| `--aui-rays-color-3` | `rgba(236, 72, 153, 0.22)` | Tercer haz de luz. |
| `--aui-rays-base` | `#050510` | Color de fondo. |
| `--aui-rays-speed` | `18s` | Duración de un barrido completo (vaivén). |
| `--aui-rays-blur` | `18px` | Desenfoque que suaviza los haces. |
| `--aui-rays-opacity` | `1` | Intensidad global del efecto. |
| `--aui-dots-color` | `rgba(124, 58, 237, 0.7)` | Color de los puntos. |
| `--aui-dots-base` | `#050510` | Color de fondo. |
| `--aui-dots-size` | `2px` | Radio de cada punto. |
| `--aui-dots-cell` | `28px` | Separación de la retícula. |
| `--aui-dots-speed` | `4s` | Duración de un pulso completo. |
| `--aui-dots-opacity` | `1` | Intensidad global (pico del pulso). |

## PixelBackground

Grilla de píxeles animada sobre `<canvas>` (una sola pasada de pintura por frame, sin miles de nodos DOM). Los behaviors se combinan libremente: `hover` ilumina las celdas cercanas al mouse con caída gaussiana, `idle` las hace parpadear de forma autónoma y asíncrona, y `reveal` las materializa al montar con dithering ordenado (matriz Bayer). El canvas se adapta solo al tamaño del contenedor.

```jsx
import { PixelBackground } from '@fethabo/animated-ui'

<div style={{ position: 'relative', height: 300 }}>
  <PixelBackground behaviors={['hover', 'idle', 'reveal']} color="#22d3ee" />
</div>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `behaviors` | `('hover' \| 'idle' \| 'reveal')[]` | `['hover']` | Behaviors activos; las contribuciones se componen por frame. |
| `cellSize` | `number` | `12` | Lado en px de cada celda cuadrada. |
| `gap` | `number` | `2` | Espacio en px entre celdas. |
| `color` | `string` | `'#7c3aed'` | Color estático para todas las celdas. |
| `cellColor` | `CellColorFn` | — | Color dinámico por celda; tiene prioridad sobre `color`. Ver abajo. |
| `baseOpacity` | `number` | `0.15` | Alpha base de las celdas sin contribución de behaviors (0 a 1). |
| `hoverRadius` | `number` | `120` | Radio en px de influencia del behavior `hover`. |
| `idleIntensity` | `number` | `1` | Amplitud del parpadeo del behavior `idle` (0 a 1). |
| `idleSpeed` | `number` | `1.5` | Velocidad del parpadeo `idle`. |
| `revealDuration` | `number` | `1200` | Duración en ms del reveal dithered. |
| `respectReducedMotion` | `boolean` | `true` | Con `prefers-reduced-motion` desactiva `idle` y `reveal`; `hover` sigue activo (responde a input directo del usuario). |
| `className` | `string` | — | Clases adicionales para el contenedor. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el contenedor. |

También acepta cualquier otra prop HTML válida de `<div>`.

### El callback `cellColor`

```ts
type CellColorFn = (x: number, y: number, proximity: number, idlePhase: number) => string
```

| Parámetro | Descripción |
| --- | --- |
| `x` | Columna de la celda en la grilla (entero, desde 0). |
| `y` | Fila de la celda en la grilla (entero, desde 0). |
| `proximity` | Contribución del behavior `hover` (0 a 1, 1 = bajo el cursor); `0` si no está activo. |
| `idlePhase` | Contribución del behavior `idle` (entre `-idleIntensity` y `+idleIntensity`); `0` si no está activo. |

Retorna cualquier color CSS válido. Ejemplo — gradiente por posición:

```jsx
<PixelBackground cellColor={(x, y) => `hsl(${(x * 7 + y * 3) % 360}, 70%, 60%)`} />
```

## TiltCard

Card con efecto 3D tilt que sigue al mouse, animado con la Web Animations API nativa (`element.animate()`): la interpolación entre estados preserva el momentum al cambiar de dirección, sin el "snap" de las CSS transitions. Soporta un overlay de brillo especular (`glare`) y expone su estado de animación via render prop para construir efectos derivados (parallax, color shifts).

```jsx
import { TiltCard } from '@fethabo/animated-ui'

<TiltCard glare maxAngle={12} className="rounded-xl shadow-2xl bg-white p-6">
  <h3>Mi card</h3>
  <p>Se inclina hacia el mouse.</p>
</TiltCard>
```

Con render prop:

```jsx
<TiltCard>
  {({ tiltX, tiltY, isHovering }) => (
    <div style={{ backgroundPosition: `${tiltY * 2}px ${tiltX * 2}px` }}>
      {isHovering ? 'hover' : 'reposo'}
    </div>
  )}
</TiltCard>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `maxAngle` | `number` | `15` | Ángulo máximo de rotación en grados, en cualquier eje. |
| `perspective` | `number` | `1000` | Profundidad de perspectiva 3D en px. `--aui-tilt-perspective` lo pisa via CSS. |
| `glare` | `boolean` | `false` | Agrega un overlay de brillo especular que se mueve inversamente al tilt. |
| `respectReducedMotion` | `boolean` | `true` | Con `prefers-reduced-motion` no rota (`tiltX`/`tiltY` quedan en 0), pero `isHovering` sigue funcionando. |
| `children` | `ReactNode \| (state: TiltState) => ReactNode` | — | Contenido del card, o función que recibe el `TiltState` actual. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>` (aria attributes, handlers, etc.).

### TiltState

Objeto que recibe el render prop en cada actualización del tilt:

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `tiltX` | `number` | Rotación actual sobre el eje X en grados (mouse arriba/abajo). |
| `tiltY` | `number` | Rotación actual sobre el eje Y en grados (mouse izquierda/derecha). |
| `isHovering` | `boolean` | `true` mientras el cursor está sobre el card. |

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-tilt-perspective` | valor de la prop `perspective` (`1000px`) | Profundidad de perspectiva 3D; valores más altos producen un efecto más sutil. |

## SpotlightCard

Contenedor con un spotlight radial que sigue al cursor, iluminando la zona bajo el mouse. El tracking escribe CSS custom properties directamente sobre el elemento (sin estado de React): mover el mouse no re-renderiza los children. El overlay tiene `pointer-events: none`, así que links y botones del contenido siguen siendo interactivos. El spotlight permanece activo con `prefers-reduced-motion` porque responde a input directo y no desplaza contenido.

```jsx
import { SpotlightCard } from '@fethabo/animated-ui'

<SpotlightCard
  color="rgba(34, 211, 238, 0.2)"
  radius={300}
  className="rounded-xl border bg-zinc-900 p-6"
>
  <h3>Mi card</h3>
  <p>La luz sigue al cursor.</p>
</SpotlightCard>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `color` | `string` | `rgba(255, 255, 255, 0.15)` | Color del spotlight (conviene usar alpha). |
| `radius` | `number` | `250` | Radio del spotlight en px. |
| `opacity` | `number` | `1` | Opacidad máxima del overlay en hover (0 a 1). |
| `respectReducedMotion` | `boolean` | `true` | Aceptada por consistencia de API; el spotlight queda activo en ambos casos (es input directo, sin movimiento de contenido). |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-spotlight-color` | `rgba(255, 255, 255, 0.15)` | Color del gradiente del spotlight. |
| `--aui-spotlight-radius` | `250px` | Radio del spotlight. |
| `--aui-spotlight-opacity` | `1` | Opacidad del overlay en hover. |

`--aui-spotlight-x` / `--aui-spotlight-y` son variables de runtime escritas por el componente; no las setees a mano.

## GlowBorder

Contenedor con un anillo de borde de gradiente cónico animado. Por default el gradiente rota en loop; con `followCursor` apunta hacia el cursor con momentum (mismo patrón WAAPI de TiltCard). La animación rota una capa con `transform` (corre en el compositor, soporte universal de browsers) en vez de animar el ángulo del gradiente con `@property`.

**Estructura del contenido:** el gradiente cubre todo el fondo del wrapper y el contenido lo tapa con su propio background, dejando visible solo el anillo del perímetro. Pasá el background de tu contenido via `contentStyle`/`contentClassName` — si ponés el background en el root via `className`, vas a tapar el anillo.

```jsx
import { GlowBorder } from '@fethabo/animated-ui'

<GlowBorder
  width={2}
  radius={16}
  colors={['#22d3ee', '#a78bfa']}
  contentStyle={{ background: '#12121f', padding: '2rem' }}
>
  <h3>Mi contenido</h3>
</GlowBorder>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `colors` | `string[]` | violeta/cyan/rosa | Colores del gradiente cónico (hasta 3); los no provistos caen al default. |
| `speed` | `number` | `4` | Segundos por rotación completa del loop. |
| `width` | `number` | `1` | Ancho del anillo en px. |
| `radius` | `number` | `12` | Border-radius exterior en px (el interior se calcula solo). |
| `opacity` | `number` | `1` | Intensidad del glow (0 a 1). |
| `followCursor` | `boolean` | `false` | Reemplaza el loop por orientar el gradiente hacia el cursor, con momentum. |
| `respectReducedMotion` | `boolean` | `true` | Con `prefers-reduced-motion` detiene el loop (gradiente estático); `followCursor` sigue activo (input directo). |
| `contentClassName` | `string` | — | Clases para el contenedor interno de contenido (donde va tu background). |
| `contentStyle` | `CSSProperties` | — | Estilos inline para el contenedor interno de contenido. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-glow-color-1` | `#7c3aed` | Primer color del cónico (violeta). |
| `--aui-glow-color-2` | `#0ea5e9` | Segundo color (cyan). |
| `--aui-glow-color-3` | `#ec4899` | Tercer color (rosa). |
| `--aui-glow-speed` | `4s` | Duración de una rotación del loop. |
| `--aui-glow-width` | `1px` | Ancho del anillo de borde. |
| `--aui-glow-radius` | `12px` | Border-radius exterior. |
| `--aui-glow-opacity` | `1` | Intensidad del glow. |

## MagneticElement

Wrapper que atrae su contenido hacia el cursor cuando se acerca, con retorno elástico al salir. La traslación usa WAAPI con interpolación que preserva momentum (patrón TiltCard sobre `translate`). Expone su estado via render prop para construir efectos derivados.

**Hit-area y layout:** la zona de atracción se agranda con padding transparente alrededor del contenido (`hitArea`), que **participa del layout** del wrapper. Con `hitArea={0}` el wrapper colapsa al tamaño del contenido y la atracción arranca recién al entrar en él.

```jsx
import { MagneticElement } from '@fethabo/animated-ui'

<MagneticElement strength={0.5} hitArea={60}>
  <button className="rounded-full bg-violet-600 px-8 py-3 text-white">
    Atrapame
  </button>
</MagneticElement>
```

Con render prop:

```jsx
<MagneticElement>
  {({ offsetX, offsetY, isActive }) => (
    <div style={{ boxShadow: `${-offsetX}px ${-offsetY}px 24px rgba(124,58,237,0.4)` }}>
      {isActive ? 'atraído' : 'reposo'}
    </div>
  )}
</MagneticElement>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `strength` | `number` | `0.35` | Intensidad de la atracción (0 a 1). |
| `hitArea` | `number` | `40` | Padding transparente en px que agranda la zona de atracción (participa del layout). |
| `respectReducedMotion` | `boolean` | `true` | Con `prefers-reduced-motion` el contenido no se mueve (offsets en 0), pero `isActive` sigue reportándose. |
| `children` | `ReactNode \| (state: MagneticState) => ReactNode` | — | Contenido a magnetizar, o función que recibe el `MagneticState` actual. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`.

### MagneticState

Objeto que recibe el render prop en cada actualización:

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `offsetX` | `number` | Desplazamiento horizontal actual del contenido en px. |
| `offsetY` | `number` | Desplazamiento vertical actual del contenido en px. |
| `isActive` | `boolean` | `true` mientras el cursor está dentro de la zona de atracción. |

## RippleContainer

Contenedor que dibuja una onda expansiva desde el punto exacto de cada click (material ripple). Cada onda es un nodo efímero creado imperativamente en `pointerdown` (la onda arranca al presionar, no al soltar) y removido del DOM al terminar su animación — sin estado de React por onda: los clicks rápidos generan ondas concurrentes sin re-renders ni acumulación de nodos. Las ondas viven en una capa `pointer-events: none` recortada al contenedor (hereda su `border-radius`), así nunca interceptan clicks ni foco de los children.

Con `prefers-reduced-motion`, la expansión se reemplaza por un fade estático breve en el punto del click: se preserva el feedback de interacción, no el movimiento.

```jsx
import { RippleContainer } from '@fethabo/animated-ui'

<RippleContainer color="rgba(255,255,255,0.5)" duration={700} style={{ borderRadius: 12 }}>
  <button className="mi-boton">Click acá</button>
</RippleContainer>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `color` | `string` | `currentColor` | Color de las ondas. |
| `duration` | `number` | `600` | Duración de cada onda (expansión + fade) en ms. |
| `maxRadius` | `number` | cubre el contenedor | Radio máximo de la onda en px; por default llega hasta la esquina más lejana desde el punto de click. |
| `opacity` | `number` | `0.25` | Opacidad inicial de la onda. |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, fade estático sin expansión. |
| `className` / `style` | — | — | Extensión del root. |

También acepta cualquier otra prop HTML válida de `<div>` — incluidos tus propios handlers: un `onPointerDown` del consumer sigue funcionando junto a la onda.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-ripple-color` | `currentColor` | Color de las ondas. Prevalece sobre `color`. |
| `--aui-ripple-duration` | `600ms` | Duración de cada onda. Prevalece sobre `duration`. |
| `--aui-ripple-opacity` | `0.25` | Opacidad inicial de la onda. Prevalece sobre `opacity`. |

## ShinyText

Texto con una franja de brillo que lo barre en loop. CSS puro: el gradiente se clipea a los glifos con `background-clip: text` y se desplaza animando `background-position` — cero JS por frame. Con colores custom de base y brillo funciona también como texto con gradiente animado. El texto sigue siendo texto real (seleccionable, copiable, legible por lectores de pantalla).

**Semántica:** renderiza un `<span>`; el heading o párrafo lo ponés vos envolviéndolo.

```jsx
import { ShinyText } from '@fethabo/animated-ui'

<h1>
  <ShinyText color="#71717a" highlight="#fafafa" speed={3}>
    Texto que brilla solo
  </ShinyText>
</h1>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `color` | `string` | `#71717a` | Color base del texto. |
| `highlight` | `string` | `#fafafa` | Color de la franja de brillo. |
| `speed` | `number` | `3` | Segundos por barrido completo del loop. |
| `angle` | `number` | `120` | Ángulo del gradiente/barrido en grados. |
| `respectReducedMotion` | `boolean` | `true` | Con `prefers-reduced-motion` detiene el barrido y queda el gradiente estático. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<span>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-shiny-color` | `#71717a` | Color base del texto. |
| `--aui-shiny-highlight` | `#fafafa` | Color de la franja de brillo. |
| `--aui-shiny-speed` | `3s` | Duración de un barrido del loop. |
| `--aui-shiny-angle` | `120deg` | Dirección del gradiente/barrido. |

## ScrambleText

Texto que se "descifra" carácter por carácter (efecto decrypt/Matrix). Un loop de `requestAnimationFrame` muta el texto directamente (sin re-renders de React por frame), con progresión por timestamps — misma duración en displays de 60 y 144 Hz. Es accesible durante la animación: el root expone `aria-label` con el texto final y los caracteres aleatorios intermedios están ocultos para lectores de pantalla.

**Tipografía:** con fuentes proporcionales los caracteres aleatorios miden distinto que los finales y el ancho puede "vibrar" durante el scramble. Para textos sensibles a layout usá una fuente monospace o `font-variant-numeric: tabular-nums`.

```jsx
import { ScrambleText } from '@fethabo/animated-ui'

<h1 style={{ fontFamily: 'monospace' }}>
  <ScrambleText text="Acceso concedido" trigger="both" />
</h1>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `text` | `string` | — (requerida) | Texto final a revelar. Es un string plano, no `children`: el scrambler opera carácter por carácter. |
| `speed` | `number` | `25` | Caracteres revelados por segundo. |
| `charset` | `string` | letras, números y símbolos | Pool de caracteres aleatorios mostrados durante el scramble. |
| `trigger` | `'mount' \| 'hover' \| 'both'` | `'mount'` | `'mount'` anima al montar y al cambiar `text`; `'hover'` re-anima en cada `mouseenter`; `'both'` combina ambos. |
| `scrambleColor` | `string` | `currentColor` | Color de los caracteres mientras dura el scramble. |
| `respectReducedMotion` | `boolean` | `true` | Con `prefers-reduced-motion` muestra el texto final directo; el trigger `hover` sigue activo (input directo). |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<span>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-scramble-color` | `currentColor` | Color de los caracteres mientras dura el scramble (al terminar, el texto vuelve a heredar su color). |

## TypewriterText

Revela texto carácter por carácter (efecto máquina de escribir). Mismo motor que `ScrambleText`: un loop de `requestAnimationFrame` muta el texto via ref (sin re-renders por frame), con progresión por timestamps — misma velocidad en displays de 60 y 144 Hz. Pasando un `string[]` con `loop`, cicla escribiendo → pausando → borrando → siguiente. El cursor parpadea con una animación CSS (sin JS por frame). Es accesible: el root expone `aria-label` con el texto completo y los caracteres intermedios están ocultos para lectores de pantalla.

**Tipografía:** el cursor es un elemento inline; con fuentes proporcionales el texto puede "saltar" al escribir. Para textos sensibles a layout usá monospace (mismo caveat que `ScrambleText`).

```jsx
import { TypewriterText } from '@fethabo/animated-ui'

// Un solo string
<TypewriterText text="Hola, soy Claude." speed={30} />

// Modo loop multi-string
<TypewriterText text={['Diseño', 'Código', 'Arte']} loop cursor="_" />
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `text` | `string \| string[]` | — (requerida) | Texto a escribir. Un `string[]` con `loop` cicla entre los strings. Es texto plano, no `children`. |
| `speed` | `number` | `30` | Caracteres escritos por segundo. |
| `startDelay` | `number` | `0` | Milisegundos antes de comenzar a escribir. |
| `cursor` | `boolean \| string` | `true` | Cursor al final: `true` usa `|`, un string usa ese glifo, `false` lo desactiva. |
| `deleteSpeed` | `number` | `30` | Caracteres borrados por segundo en modo loop. |
| `pauseDuration` | `number` | `1500` | Milisegundos de pausa con el string completo antes de borrar. |
| `loop` | `boolean` | `false` | Con un `string[]`, cicla indefinidamente (escribe→pausa→borra→siguiente). |
| `respectReducedMotion` | `boolean` | `true` | Con `prefers-reduced-motion` muestra el texto final completo de inmediato, sin escritura ni parpadeo. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<span>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-typewriter-cursor-speed` | `1s` | Velocidad de parpadeo del cursor (solo via CSS). |

## ScrollReveal

Revela su contenido al entrar al viewport (IntersectionObserver via el hook [`useInView`](#hooks)), con fade + desplazamiento configurable y stagger entre hijos directos. La entrada es una CSS transition pura: el JavaScript solo togglea un atributo, cero JS por frame.

**Layout:** cada hijo directo se envuelve en un `<div>` item (el que anima). El root acepta `className`/`style`, así puede ser él mismo tu grid o flex y los items actúan como celdas.

**Pre-hidratación:** el contenido se renderiza oculto desde el primer paint (sin flash) pero presente en el DOM (SEO, crawlers, lectores). Con reduced motion o en browsers sin IntersectionObserver se muestra directo. Es el comportamiento estándar de las librerías de reveal.

```jsx
import { ScrollReveal } from '@fethabo/animated-ui'

<ScrollReveal direction="up" stagger={0.15} className="grid grid-cols-3 gap-4">
  <Card>Uno</Card>
  <Card>Dos</Card>
  <Card>Tres</Card>
</ScrollReveal>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `direction` | `'up' \| 'down' \| 'left' \| 'right' \| 'none'` | `'up'` | Desde dónde entra el contenido (`'up'` aparece desde abajo; `'none'` solo fade). |
| `distance` | `number` | `24` | Desplazamiento inicial en px. |
| `duration` | `number` | `0.6` | Duración de la transición en segundos. |
| `stagger` | `number` | `0.1` | Segundos de delay incremental entre hijos directos. |
| `threshold` | `number` | `0.15` | Fracción visible del componente que dispara el reveal. |
| `once` | `boolean` | `true` | Si es `false`, el contenido se re-oculta al salir del viewport y re-revela al entrar. |
| `respectReducedMotion` | `boolean` | `true` | Con `prefers-reduced-motion` muestra el contenido directo, sin transición. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-reveal-duration` | `0.6s` | Duración de la transición de entrada. |
| `--aui-reveal-distance` | `24px` | Desplazamiento inicial. |
| `--aui-reveal-stagger` | `0.1s` | Delay incremental entre hijos. |
| `--aui-reveal-easing` | `cubic-bezier(0.22, 1, 0.36, 1)` | Curva de la transición (solo via CSS). |

`--aui-reveal-i` es una variable de runtime (índice por item, escrita por el componente); no la setees a mano. Los items animan con `translate` (propiedad independiente, browsers 2022+), que no pisa el `transform` de tu contenido.

## SplitReveal

Parte un texto en unidades (`char`, `word` o `line`) y revela cada una con stagger. La entrada es una CSS transition pura (cero JS por frame): el JavaScript solo togglea un atributo. Dispara al montar (`trigger="mount"`) o al entrar al viewport (`trigger="in-view"`, vía [`useInView`](#hooks)).

**Pre-hidratación y accesibilidad:** el texto se renderiza completo y visible desde el primer paint (SSR/SEO) y se parte en spans recién tras la hidratación. El root porta el texto completo en `aria-label` y las unidades partidas son `aria-hidden`, así los lectores de pantalla anuncian el texto original, no los fragmentos. Con reduced motion (o sin IntersectionObserver) se muestra el texto completo de inmediato.

**Modo `line`:** partir por línea depende del wrapping real (ancho del contenedor, fuente cargada). Se mide tras el montaje y se re-mide en resize (vía `useResizeObserver`); todas las palabras de una misma línea revelan juntas.

```jsx
import { SplitReveal } from '@fethabo/animated-ui'

<h1>
  <SplitReveal text="Animación con stagger" split="word" preset="slide-up" />
</h1>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `text` | `string` | — (requerida) | Texto a revelar. Es un string plano, no `children`. |
| `split` | `'char' \| 'word' \| 'line'` | `'word'` | Unidad de partición. |
| `preset` | `'fade' \| 'slide-up' \| 'blur'` | `'slide-up'` | Animación de entrada de cada unidad. |
| `trigger` | `'mount' \| 'in-view'` | `'in-view'` | Qué dispara el revelado. |
| `stagger` | `number` | `0.05` | Segundos de delay incremental entre unidades. |
| `duration` | `number` | `0.6` | Duración de la transición de cada unidad, en segundos. |
| `distance` | `number` | `16` | Desplazamiento inicial en px para `slide-up`. |
| `threshold` | `number` | `0.15` | Fracción visible que dispara el revelado con `trigger="in-view"`. |
| `once` | `boolean` | `true` | Si es `false`, se re-oculta al salir del viewport y re-revela al re-entrar. |
| `respectReducedMotion` | `boolean` | `true` | Con `prefers-reduced-motion` muestra el texto completo de inmediato, sin stagger ni animación. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<span>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-split-duration` | `0.6s` | Duración de la transición de cada unidad. |
| `--aui-split-stagger` | `0.05s` | Delay incremental entre unidades. |
| `--aui-split-distance` | `16px` | Desplazamiento inicial del preset `slide-up`. |
| `--aui-split-blur` | `8px` | Desenfoque inicial del preset `blur`. |
| `--aui-split-easing` | `cubic-bezier(0.22, 1, 0.36, 1)` | Curva de la transición (solo via CSS). |

`--aui-split-i` es una variable de runtime (índice por unidad, o índice de línea medido en modo `line`); no la setees a mano.

## RotatingText

Texto base opcional + una palabra que rota cíclicamente por una lista con transición animada: "Hacemos *webs* / *apps* / *magia*". El avance usa timers (sin RAF) y la transición es CSS inyectado. El ancho del contenedor de la palabra transiciona suavemente entre palabras de largos distintos (medición al cambiar, no por frame) — si querés eliminar incluso ese ajuste, fijá un `width` via CSS sobre `.aui-rotating-box`.

Accesible sin spam: el root expone un `aria-label` estático con el texto base + la lista completa, y la palabra animada es `aria-hidden` — sin `aria-live`. Con `prefers-reduced-motion` muestra la primera palabra estática.

```jsx
import { RotatingText } from '@fethabo/animated-ui'

<h1>
  <RotatingText words={['webs', 'apps', 'magia']} transition="slide-up" color="#a78bfa">
    Hacemos{' '}
  </RotatingText>
</h1>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `words` | `string[]` | — | Lista de palabras por las que rota. |
| `transition` | `'fade' \| 'slide-up' \| 'flip'` | `'slide-up'` | Preset de la transición entre palabras. |
| `interval` | `number` | `2200` | Ms que cada palabra permanece visible. |
| `duration` | `number` | `0.4` | Duración de la transición (y del ajuste de ancho) en segundos. |
| `color` | `string` | hereda | Color de la palabra rotante. |
| `loop` | `boolean` | `true` | Con `false`, se detiene en la última palabra. |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, primera palabra estática. |
| `children` | `ReactNode` | — | Texto base opcional que precede a la palabra. |
| `className` / `style` | — | — | Extensión del root. |

También acepta cualquier otra prop HTML válida de `<span>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-rotating-color` | hereda | Color de la palabra rotante. Prevalece sobre `color`. |
| `--aui-rotating-duration` | `0.4s` | Duración de la transición. |

## GlitchText

Texto con glitch RGB-split **intermitente** (ráfagas breves separadas por períodos estables), CSS puro sin JS por frame: dos capas del mismo texto en pseudo-elementos (`content: attr(data-text)`, fuera del árbol de accesibilidad — el texto se lee una sola vez) desplazadas en sentidos opuestos y recortadas con `clip-path` animado. `trigger="hover"` limita el glitch a mientras el cursor está encima.

> **Alcance:** acepta **solo texto plano** (`children: string`) y está pensado para **titulares** — el `clip-path` animado sobre párrafos largos tiene costo de pintado.

Con `prefers-reduced-motion`, `loop` queda estático; `hover` conserva un split estático atenuado, sin jitter.

```jsx
import { GlitchText } from '@fethabo/animated-ui'

<GlitchText as="h1" frequency={2} intensity={4}>ERROR 404</GlitchText>
<GlitchText trigger="hover" colors={['#f0f', '#0ff']}>hover me</GlitchText>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `children` | `string` | — | El texto (solo texto plano). |
| `as` | `ElementType` | `'span'` | Elemento root a renderizar. |
| `trigger` | `'loop' \| 'hover'` | `'loop'` | Glitch autónomo intermitente, o solo en hover. |
| `colors` | `[string, string]` | rojo/cyan | Colores de los dos canales desplazados. |
| `intensity` | `number` | `3` | Desplazamiento máximo de los canales en px. |
| `frequency` | `number` | `1` | Ráfagas por ciclo (~3s). |
| `burstDuration` | `number` | `0.3` | Duración de cada ráfaga en segundos. |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, texto estático (hover: split atenuado). |
| `className` / `style` | — | — | Extensión del root. |

También acepta cualquier otra prop HTML válida del elemento root.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-glitch-color-1` | `#ff004d` | Canal desplazado a la izquierda. Prevalece sobre `colors[0]`. |
| `--aui-glitch-color-2` | `#00fff9` | Canal desplazado a la derecha. |
| `--aui-glitch-intensity` | `3px` | Desplazamiento de los canales. Prevalece sobre `intensity`. |
| `--aui-glitch-cycle` | `3s` | Duración del ciclo completo de ráfagas. |

## WavyText

Caracteres ondulando en loop continuo: una ola recorre el texto de izquierda a derecha. CSS puro (keyframes + `animation-delay` escalonado por índice, seteado inline una sola vez), sin JS por frame; anima **solo `transform: translateY`** (compositado), así la métrica de la línea circundante no cambia. Reutiliza el split por carácter del paquete: el texto completo va en `aria-label` y los caracteres son `aria-hidden`, con los espacios preservados.

Con `prefers-reduced-motion` el texto queda estático en su línea base.

```jsx
import { WavyText } from '@fethabo/animated-ui'

<WavyText as="h2" amplitude={8} speed={1.4}>¡Olas en el texto!</WavyText>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `children` | `string` | — | El texto a ondular (texto plano). |
| `as` | `ElementType` | `'span'` | Elemento root a renderizar. |
| `amplitude` | `number` | `6` | Desplazamiento vertical máximo en px. |
| `speed` | `number` | `1.6` | Duración de un ciclo de ola en segundos. |
| `stagger` | `number` | `0.06` | Desfase entre caracteres consecutivos en segundos. |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, texto estático. |
| `className` / `style` | — | — | Extensión del root. |

También acepta cualquier otra prop HTML válida del elemento root.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-wavy-amplitude` | `6px` | Desplazamiento vertical máximo. Prevalece sobre `amplitude`. |
| `--aui-wavy-speed` | `1.6s` | Duración del ciclo de ola. Prevalece sobre `speed`. |
| `--aui-wavy-stagger` | `0.06s` | Desfase entre caracteres. Prevalece sobre `stagger`. |

## CountUp

Número que cuenta desde `from` hasta `value` al entrar al viewport, con easing de salida (arranque rápido, frenado al llegar) — el clásico de las stats de landing. El RAF muta `textContent` por ref (patrón ScrambleText): cero re-renders por frame. La cuenta corre una sola vez por montaje.

SEO-safe: el markup SSR contiene el valor final formateado (correcto sin JavaScript y para crawlers); el texto se resetea al valor inicial recién cuando la cuenta arranca. Accesible: el root expone el valor final en `aria-label`, así los lectores de pantalla anuncian el valor definitivo y no los intermedios. Con `prefers-reduced-motion` se muestra el valor final directo (coincide con el markup SSR — cero salto visual).

> **Tip:** los números de ancho variable pueden hacer "bailar" el layout durante la cuenta. Aplicá `font-variant-numeric: tabular-nums` al componente (o a su contenedor) para un ancho estable.

```jsx
import { CountUp } from '@fethabo/animated-ui'

<CountUp
  value={12500}
  separator="."
  suffix="+"
  duration={2500}
  style={{ fontVariantNumeric: 'tabular-nums' }}
/>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `value` | `number` | — | Valor final de la cuenta (lo que renderiza el SSR). |
| `from` | `number` | `0` | Valor inicial desde el que arranca la cuenta. |
| `duration` | `number` | `2000` | Duración de la cuenta en ms. |
| `decimals` | `number` | `0` | Cantidad de decimales, estable durante toda la cuenta. |
| `separator` | `string` | `''` | Separador de miles (e.g. `'.'`, `','`). |
| `prefix` | `string` | `''` | String antepuesto al número (e.g. `'$'`). |
| `suffix` | `string` | `''` | String pospuesto al número (e.g. `'+'`). |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, valor final directo sin cuenta. |
| `className` / `style` | — | — | Extensión del root. |

También acepta cualquier otra prop HTML válida de `<span>`.

## MouseParallax

Contenedor con capas a distintas profundidades que se desplazan según la posición del mouse — parallax creativo **sin scroll**. El tracking escribe CSS custom properties directamente sobre el root (patrón SpotlightCard): mover el mouse no re-renderiza los children. Cada capa se traslada con `calc()` puro suavizado por una transition del compositor.

Las capas se declaran con `MouseParallax.Layer`: `depth` positivo sigue al mouse, negativo se opone (profundidad invertida). Al salir el cursor, todo vuelve suavemente al centro. Es el efecto que el render prop de `TiltCard` insinuaba, como componente dedicado.

```jsx
import { MouseParallax } from '@fethabo/animated-ui'

<MouseParallax style={{ minHeight: '60vh' }}>
  <MouseParallax.Layer depth={40}>
    <Estrellas />
  </MouseParallax.Layer>
  <MouseParallax.Layer depth={-15}>
    <h1>Título en primer plano</h1>
  </MouseParallax.Layer>
</MouseParallax>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `ease` | `number` | `0.2` | Segundos del suavizado con que las capas siguen al mouse. |
| `respectReducedMotion` | `boolean` | `true` | Con `prefers-reduced-motion` las capas quedan estáticas (el efecto desplaza contenido real). |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

**`MouseParallax.Layer`:**

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `depth` | `number` | `20` | Desplazamiento máximo en px con el cursor en el borde; negativo se opone al mouse. |

Ambos aceptan cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-parallax-ease` | `0.2s` | Duración del suavizado de las capas. |
| `--aui-parallax-depth` | `20px` | Profundidad de cada capa (la setea `Layer` desde su prop). |

`--aui-parallax-x` / `--aui-parallax-y` son variables de runtime escritas por el componente; no las setees a mano.

## ParallaxLayers

Contenedor con capas a distintas profundidades ligadas a la **posición de scroll** — el primo de scroll de [MouseParallax](#mouseparallax), con la misma API de `Layer`. Un listener pasivo de scroll (coalescido por `requestAnimationFrame`) escribe el progreso del contenedor por el viewport como CSS custom property; las capas se trasladan con `calc()` puro. Sin estado de React: scrollear no re-renderiza nada, y el tracking **solo corre mientras el contenedor está cerca del viewport** (vía IntersectionObserver) — varios contenedores fuera de pantalla cuestan cero por frame.

`depth` positivo se mueve con el scroll (más lento que el contenido: sensación de fondo); negativo va contra él.

**Capas de fondo:** al desplazarse pueden revelar "huecos" en los bordes del contenedor — es el comportamiento estándar del parallax. Sobredimensioná la capa de fondo (e.g. `margin: -10% 0` o `inset: -10%`) para cubrirlos.

```jsx
import { ParallaxLayers } from '@fethabo/animated-ui'

<ParallaxLayers style={{ overflow: 'hidden' }}>
  <ParallaxLayers.Layer depth={80}>
    <Fondo style={{ margin: '-10% 0' }} />
  </ParallaxLayers.Layer>
  <ParallaxLayers.Layer depth={-30}>
    <h1>Primer plano</h1>
  </ParallaxLayers.Layer>
</ParallaxLayers>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `respectReducedMotion` | `boolean` | `true` | Con `prefers-reduced-motion` las capas quedan en su posición de layout (el efecto crea movimiento relativo durante el scroll). |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

**`ParallaxLayers.Layer`:**

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `depth` | `number` | `40` | Desplazamiento máximo en px a lo largo del recorrido por el viewport; negativo va contra el scroll. |

Ambos aceptan cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-parallax-scroll-depth` | `40px` | Profundidad de cada capa (la setea `Layer` desde su prop). |

`--aui-parallax-scroll` es una variable de runtime escrita por el componente (progreso [-1, 1] del contenedor por el viewport); no la setees a mano.

## ScrollProgress

Barra fija de progreso de lectura de la página. El progreso se escribe como CSS custom property por un listener pasivo coalescido por RAF, y la barra avanza con `transform: scaleX` — compositado, sin relayout ni re-renders de React. El track tiene `pointer-events: none` (no tapa clicks) y `aria-hidden` (es un reflejo decorativo de la posición de scroll; un `progressbar` actualizado por frame sería spam para lectores de pantalla). Permanece activa con `prefers-reduced-motion`: refleja 1:1 el scroll que el usuario controla, como la scrollbar nativa.

**Headers fijos:** si tu sitio tiene un header `fixed`/`sticky`, ajustá `zIndex` (o `--aui-progress-z`) para definir quién queda arriba.

```jsx
import { ScrollProgress } from '@fethabo/animated-ui'

<ScrollProgress color="#22d3ee" height={4} />
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `position` | `'top' \| 'bottom'` | `'top'` | Borde del viewport donde se fija la barra. |
| `color` | `string` | `#7c3aed` | Color de la barra. |
| `height` | `number` | `3` | Grosor en px. |
| `trackColor` | `string` | `transparent` | Color del track (fondo de la barra). |
| `zIndex` | `number` | `50` | z-index del elemento fijo. |
| `respectReducedMotion` | `boolean` | `true` | Aceptada por consistencia de API; la barra queda activa en ambos casos (refleja input directo, sin movimiento de contenido). |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-progress-color` | `#7c3aed` | Color de la barra. |
| `--aui-progress-height` | `3px` | Grosor de la barra. |
| `--aui-progress-bg` | `transparent` | Color del track. |
| `--aui-progress-z` | `50` | z-index del elemento fijo. |

`--aui-progress` es una variable de runtime escrita por el componente (progreso [0, 1] de la página); no la setees a mano.

## ParticleField

Campo de partículas autónomas sobre `<canvas>`, con repulsión/atracción configurable al cursor. Por default las partículas se mueven con velocidad aleatoria y rebotan en los bordes; dentro del radio del cursor reciben una fuerza proporcional a la proximidad. El cálculo es cursor-a-partícula (O(N)), no entre pares. El estado de las partículas vive en un ref que persiste entre frames: el RAF no re-renderiza React. Con `prefers-reduced-motion` el loop se detiene y el canvas muestra las partículas en su estado inicial estático.

Dos ejes opcionales extienden el campo sin cambiar el default:

- **`drift`** cambia el carácter del movimiento: `'snow'` (cae con deriva horizontal), `'embers'` (sube desvaneciéndose), `'bubbles'` (sube con bamboleo), `'warp'` (campo de estrellas: nacen a lo ancho del borde superior, caen acelerando en perspectiva y se abren hacia los costados). Los modos direccionales reingresan las partículas por el borde opuesto (wrap) en vez de rebotar; `'warp'` reingresa por el borde superior. `'bounce'` (default) es el comportamiento original.
- **`links`** activa el efecto *constellation*: líneas entre partículas cercanas (opacidad proporcional a la cercanía) y, con `linkCursor`, hacia el cursor. Esto introduce un cálculo entre pares **O(N²) opt-in** (apagado por default). Mantené `count` moderado (~80–120) y una `linkDistance` acotada al activarlo.

El canvas llena el contenedor — **dimensionalo vos** con `style`/`className` (ej. `height: '100vh'`); si el contenedor tiene tamaño cero, no se ve nada. En dispositivos touch (sin cursor de hover) las partículas se animan de forma autónoma según el `drift` configurado, ignorando el puntero.

```jsx
import { ParticleField } from '@fethabo/animated-ui'

// Constellation clásico
<div style={{ height: '100vh' }}>
  <ParticleField count={100} color="#22d3ee" links linkDistance={120} />
</div>

// Nieve cayendo
<div style={{ height: '100vh' }}>
  <ParticleField count={120} drift="snow" cursorInteraction="repel" />
</div>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `count` | `number` | `60` | Número de partículas. |
| `speed` | `number` | `0.4` | Rango de la velocidad inicial aleatoria en px/frame. |
| `radius` | `number` | `2` | Radio de cada partícula en px. |
| `color` | `string` | `#7c3aed` | Color de las partículas (cualquier color CSS). |
| `cursorInteraction` | `'repel' \| 'attract' \| 'none'` | `'repel'` | Reacción al cursor dentro del radio de influencia. |
| `cursorRadius` | `number` | `120` | Radio de influencia del cursor en px. |
| `drift` | `'bounce' \| 'snow' \| 'embers' \| 'bubbles' \| 'warp'` | `'bounce'` | Modo de deriva del movimiento. Los modos direccionales hacen wrap por el borde opuesto; `'warp'` es un campo de estrellas que nace en el borde superior y reingresa por arriba. |
| `links` | `boolean` | `false` | Dibuja líneas entre partículas cercanas (constellation). **Opt-in O(N²)**. |
| `linkDistance` | `number` | `120` | Distancia máxima en px para conectar dos partículas. |
| `linkColor` | `string` | — | Color de las líneas. Default: deriva del `color` de partícula. |
| `linkWidth` | `number` | `1` | Grosor de las líneas en px. |
| `linkCursor` | `boolean` | `true` | Conecta también las partículas cercanas al cursor con él (cuando `links` está activo). |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, detiene el RAF y muestra el estado inicial estático (con las líneas dibujadas una vez si `links` está activo). |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`.

> **Performance:** con `links={false}` (default) no se ejecuta ningún cálculo entre pares y el costo permanece O(N). Activar `links` introduce un doble loop O(N²) por frame (acotado con un descarte temprano por bounding box antes de la raíz cuadrada). Es tolerable para `count` típico de fondos; con `count` alto, reducí `linkDistance` o el `count`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-particle-color` | `#7c3aed` | Color de las partículas. Un override por cascada prevalece sobre la prop `color`. |
| `--aui-particle-radius` | `2px` | Radio de cada partícula. |
| `--aui-particle-link-color` | = `color` | Color de las líneas de conexión. Prevalece sobre la prop `linkColor`. |
| `--aui-particle-link-width` | `1px` | Grosor de las líneas de conexión. |
| `--aui-particle-link-distance` | `120px` | Distancia máxima para conectar partículas. |

## ImageDissolve

Transiciona entre dos imágenes con dithering ordered (matriz Bayer 8×8): al cambiar la prop `src`, la nueva imagen se materializa píxel a píxel desde los thresholds Bayer más bajos a los más altos, sobre un `<canvas>` superpuesto. Reutiliza la misma matriz Bayer que el behavior `reveal` de `PixelBackground`. SSR-safe: durante el render solo emite el `<img>` con su `alt`; el canvas y la animación arrancan tras la hidratación. Con `prefers-reduced-motion` el `src` se swapea al instante, sin dithering.

> **Prerequisito de CORS:** el efecto lee píxeles con `getImageData`, que falla sobre un canvas "tainted". La imagen debe ser **same-origin** o servir headers CORS (`Access-Control-Allow-Origin`). Ante una imagen cross-origin sin CORS, `ImageDissolve` degrada mostrando la imagen destino directamente, sin animación y sin lanzar errores. Para mejor fluidez, escalá tus imágenes al tamaño renderizado: el canvas trabaja en píxeles CSS, no al tamaño natural de la imagen.

```jsx
import { ImageDissolve } from '@fethabo/animated-ui'

const [src, setSrc] = useState('/foto-a.jpg')

<div style={{ width: 600 }}>
  <ImageDissolve src={src} alt="Galería" duration={1000} />
</div>
<button onClick={() => setSrc('/foto-b.jpg')}>Cambiar</button>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `src` | `string` | — | URL de la imagen. Cambiarla dispara la transición dithered. |
| `alt` | `string` | — | Texto alternativo (requerido); aplicado al `<img>` en todo momento. |
| `duration` | `number` | `800` | Duración de la transición en ms. |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, swapea el `src` al instante sin animar. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`.

## StickyScenes

Secciones sticky que transicionan entre "escenas" durante el scroll. El contenedor exterior mide `100dvh + nScenes × sceneDuration`; el inner wrapper es `position: sticky; top: 0; height: 100dvh`, así queda fijo mientras se scrollea el rango. El progreso se descompone en escena activa + progreso dentro de ella y se escribe como `--aui-scene-index` y `--aui-scene-progress` directamente sobre el inner wrapper — **sin React state en el hot path**: scrollear no re-renderiza nada (mismo principio que `ParallaxLayers`). Con `prefers-reduced-motion` el tracking de scroll sigue activo, pero las transitions de las escenas se anulan (cada escena aparece de inmediato).

Las escenas se declaran con `StickyScenes.Scene`. Cada una recibe `data-aui-active="true"` cuando es la escena en curso, y por defecto se apilan (`position: absolute; inset: 0`): **el consumer engancha ahí sus propias transitions CSS**, y puede usar `--aui-scene-progress` con `calc()` para efectos interpolados. La primera escena está activa al inicio.

```jsx
import { StickyScenes } from '@fethabo/animated-ui'

<StickyScenes sceneDuration={800}>
  <StickyScenes.Scene className="scene">
    <h1>Primera escena</h1>
  </StickyScenes.Scene>
  <StickyScenes.Scene className="scene">
    {/* interpola con el progreso dentro de la escena */}
    <h1 style={{ opacity: 'var(--aui-scene-progress, 0)' }}>Segunda escena</h1>
  </StickyScenes.Scene>
</StickyScenes>
```

```css
/* El consumer activa sus transiciones via data-aui-active. */
.scene { opacity: 0; transition: opacity 0.5s ease; }
.scene[data-aui-active] { opacity: 1; }
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `sceneDuration` | `number` | `600` | Píxeles de scroll dedicados a cada escena antes de transicionar. |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, mantiene el scroll activo pero anula las transitions de las escenas. |
| `children` | `ReactNode` | — | Escenas declaradas con `StickyScenes.Scene`. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

`StickyScenes.Scene` acepta `children`, `className`, `style` y cualquier prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-scene-index` | `0` | Índice entero de la escena activa. Variable de runtime escrita por el motor. |
| `--aui-scene-progress` | `0` | Progreso [0, 1] dentro de la escena activa, usable con `calc()`. Variable de runtime. |

Ambas son escritas por el componente en cada frame; no las setees a mano.

## StackedCards

Apila sus hijos directos durante el scroll: cada card se envuelve en un wrapper `position: sticky` que se fija a `offsetTop` y se va apilando sobre la anterior (la más reciente queda arriba). Las cards tapadas se encogen y/o oscurecen según cuántas tienen encima, creando profundidad. El apilado físico lo da el `sticky` nativo (el navegador hace el pin gratis); el scroll-driver (`subscribeScroll` + RAF) solo calcula la profundidad por card y la escribe como `--aui-stack-depth` — **sin React state en el hot path**. El tracking corre solo cuando el contenedor está cerca del viewport (vía [`useInView`](#hooks)).

**Recorrido:** cada wrapper reserva `cardTravel` px de scroll (también es su altura). Funciona mejor con cards de altura similar; con alturas muy dispares el recorrido reservado puede no calzar perfecto. Con `prefers-reduced-motion` el tracking se apaga y las cards quedan en un layout sticky estático y legible.

```jsx
import { StackedCards } from '@fethabo/animated-ui'

<StackedCards offsetTop={80} scaleStep={0.05} opacityStep={0.1} cardTravel={500}>
  <div className="card">Uno</div>
  <div className="card">Dos</div>
  <div className="card">Tres</div>
</StackedCards>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `offsetTop` | `number` | `0` | Píxeles desde el top del viewport donde se fija el stack (e.g. para un header fijo). |
| `scaleStep` | `number` | `0.05` | Cuánto se encoge cada card por nivel de profundidad (0–1). |
| `opacityStep` | `number` | `0` | Cuánto se oscurece cada card por nivel de profundidad (0–1). `0` desactiva el oscurecimiento. |
| `cardTravel` | `number` | `400` | Píxeles de scroll dedicados a cada card (define el recorrido y la altura del wrapper). |
| `respectReducedMotion` | `boolean` | `true` | Con `prefers-reduced-motion` deja las cards sticky estáticas, sin escala/opacidad ligadas al scroll. |
| `children` | `ReactNode` | — | Cada hijo directo se envuelve en un wrapper sticky. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-stack-offset` | `0px` | Offset superior donde se fija el stack. |
| `--aui-stack-scale-step` | `0.05` | Reducción de escala por nivel de profundidad. |
| `--aui-stack-opacity-step` | `0` | Oscurecimiento por nivel de profundidad. |
| `--aui-stack-travel` | `400px` | Recorrido de scroll / altura de cada wrapper. |

`--aui-stack-depth` (profundidad por card) y `--aui-stack-i` (índice por card) son variables de runtime escritas por el componente; podés usarlas con `calc()` para efectos derivados, pero no las setees a mano.

## TextScrollReveal

Párrafo particionado por palabra cuyas palabras pasan de apagadas a encendidas progresivamente según el avance del scroll (highlight progresivo), en orden y reversible al scrollear hacia atrás. El scroll-driver escribe una única CSS var de progreso (`--aui-text-scroll-progress`, 0→1) en el root; cada palabra resuelve su opacidad (y color, opcional) con `calc()` a partir de su índice — cero JS por palabra por frame y sin React state en el hot path. El tracking solo corre con el contenedor cerca del viewport: N párrafos fuera de pantalla cuestan cero por frame.

Accesible: el texto completo va en `aria-label` del root y las palabras son `aria-hidden` (patrón de split del paquete), sin espacios duplicados. Con `prefers-reduced-motion` el texto se muestra completamente encendido y estático.

```jsx
import { TextScrollReveal } from '@fethabo/animated-ui'

<TextScrollReveal fromOpacity={0.15} offset={[0.2, 0.6]} style={{ fontSize: '2rem', maxWidth: 640 }}>
  Cada palabra de este párrafo se enciende a medida que scrolleás, y se vuelve
  a apagar si scrolleás hacia atrás.
</TextScrollReveal>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `children` | `string` | — | El texto a encender (texto plano; se parte por palabra). |
| `as` | `ElementType` | `'p'` | Elemento root a renderizar. |
| `fromOpacity` | `number` | `0.15` | Opacidad de las palabras apagadas. |
| `toOpacity` | `number` | `1` | Opacidad de las palabras encendidas. |
| `fromColor` | `string` | — | Color de las palabras apagadas (opcional; sin colores usa `currentColor`). |
| `toColor` | `string` | — | Color de las palabras encendidas (opcional). |
| `offset` | `[number, number]` | `[0.2, 0.6]` | Porción del recorrido por el viewport en la que ocurre el encendido (0 = asoma por abajo, 1 = salió por arriba). |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, texto encendido estático sin tracking. |
| `className` / `style` | — | — | Extensión del root. |

También acepta cualquier otra prop HTML válida del elemento root.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-text-scroll-from-opacity` | `0.15` | Opacidad apagada. Prevalece sobre `fromOpacity`. |
| `--aui-text-scroll-to-opacity` | `1` | Opacidad encendida. Prevalece sobre `toOpacity`. |
| `--aui-text-scroll-from-color` | `currentColor` | Color apagado. Prevalece sobre `fromColor`. |
| `--aui-text-scroll-to-color` | `currentColor` | Color encendido. Prevalece sobre `toColor`. |

`--aui-text-scroll-progress` es una variable de runtime escrita por el scroll-driver; no la setees a mano.

## CircuitBackground

Fondo de circuito estilo PCB sobre `<canvas>`: las pistas (trazos ortogonales con giros a 90° y pads en uniones/terminaciones) se generan proceduralmente con un random walk sobre una grilla, y pulsos de luz (cabeza con glow + estela que decae) viajan por ellas. El ruteo favorece **tramos largos y continuos** —al toparse con otra pista o el borde, gira para rodear el obstáculo en vez de cortarse—, y la cantidad de pistas escala con `density`. La generación es **determinista por `seed`**: la misma `seed` + tamaño + `density` produce exactamente el mismo trazado, estable entre el render del servidor y la hidratación (sin saltos visuales). Toda la aleatoriedad pasa por un PRNG seedable interno — nunca `Math.random()`. Las pistas/pads se dibujan una sola vez en un canvas offscreen y se componen cada frame; solo los pulsos se recalculan por frame.

El canvas llena el contenedor — **dimensionalo vos** con `style`/`className`. Con `prefers-reduced-motion` el circuito se dibuja estático y los pulsos no se animan.

```jsx
import { CircuitBackground } from '@fethabo/animated-ui'

<div style={{ height: '100vh' }}>
  <CircuitBackground seed="hero" trackColor="#1e3a5f" pulseColor="#22d3ee" pulseCount={10} />
</div>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `seed` | `string \| number` | `'aui'` | Semilla del trazado. Misma seed + tamaño + `density` ⇒ mismo circuito. |
| `density` | `number` | `1` | Densidad de pistas por área: escala (lineal) la cantidad de trazos generados. |
| `trackColor` | `string` | `#1e3a5f` | Color de pistas y pads (cualquier color CSS). |
| `pulseColor` | `string` | `#22d3ee` | Color de los pulsos de luz. |
| `pulseSpeed` | `number` | `90` | Velocidad de los pulsos en px/s. |
| `pulseCount` | `number` | `8` | Cantidad de pulsos simultáneos. |
| `lineWidth` | `number` | `2` | Grosor de las pistas en px. |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, dibuja el circuito estático sin animar los pulsos. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-circuit-track-color` | `#1e3a5f` | Color de las pistas. Prevalece sobre la prop `trackColor`. |
| `--aui-circuit-pulse-color` | `#22d3ee` | Color de los pulsos. Prevalece sobre `pulseColor`. |
| `--aui-circuit-pulse-speed` | `90` | Velocidad de los pulsos en px/s (numérico, sin unidad). |
| `--aui-circuit-line-width` | `2px` | Grosor de las pistas. |

## TeslaCoil

Una bobina de Tesla sobre `<canvas>`: un nodo central del que emanan rayos (arcos eléctricos jagged) hacia afuera en todas direcciones, regenerándose para dar sensación de descarga continua. Con `followCursor` (default) y el cursor sobre el contenedor, dirige `cursorBolts` rayos hacia el puntero — más **gruesos, brillantes y con núcleo blanco** que los ambientales (como un arco que salta hacia la mano), todos convergiendo en el punto del cursor, y regenerados cada frame para que crepiten siguiéndolo. Con `cursorTrigger="click"` esos rayos salen **solo mientras se mantiene presionado**. El tracking es por ref, **sin re-renders por frame**. El trazo quebrado se genera con subdivisión midpoint-displacement seedada por el PRNG interno.

El canvas tiene `pointer-events: none`: los `children` superpuestos (un botón, un título) siguen siendo interactivos. En dispositivos touch (sin hover) se emiten solo los rayos ambientales. Con `prefers-reduced-motion` los rayos ambientales se dibujan una vez sin regenerarse.

```jsx
import { TeslaCoil } from '@fethabo/animated-ui'

<div style={{ height: 400 }}>
  <TeslaCoil color="#7dd3fc" boltCount={9} reach={200}>
    <button>Cargar</button>
  </TeslaCoil>
</div>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `color` | `string` | `#7dd3fc` | Color de los rayos y el glow. |
| `boltCount` | `number` | `7` | Cantidad de rayos ambientales. |
| `lineWidth` | `number` | `2` | Grosor de los rayos en px. |
| `frequency` | `number` | `12` | Regeneraciones por segundo de los rayos ambientales. |
| `reach` | `number` | `160` | Alcance/longitud máxima de los rayos en px. |
| `jitter` | `number` | `18` | Magnitud de la desviación jagged del trazo en px. |
| `followCursor` | `boolean` | `true` | Dirige rayos al cursor (ignorado en touch). |
| `cursorBolts` | `number` | `3` | Cantidad de rayos dirigidos al cursor (más intensos que los ambientales). |
| `cursorTrigger` | `'hover' \| 'click'` | `'hover'` | Cuándo salen los rayos al cursor: con el cursor encima, o solo mientras se mantiene presionado. |
| `origin` | `{ x: number; y: number }` | `{ x: 0.5, y: 0.5 }` | Posición del nodo central como fracción del contenedor. |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, no regenera los rayos (cuadro estático). |
| `children` | `ReactNode` | — | Contenido superpuesto e interactivo. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-tesla-color` | `#7dd3fc` | Color de los rayos. Prevalece sobre la prop `color`. |
| `--aui-tesla-line-width` | `2px` | Grosor de los rayos. |
| `--aui-tesla-reach` | `160` | Alcance de los rayos en px (numérico, sin unidad). |
| `--aui-tesla-jitter` | `18` | Magnitud del jitter en px (numérico, sin unidad). |
| `--aui-tesla-frequency` | `12` | Regeneraciones por segundo (numérico, sin unidad). |

## Idle / Attention

`AttentionCue` y `GuidingBranches` son **directores de atención**: reaccionan a la **inactividad** del puntero para guiar la mirada del usuario hacia un elemento (un CTA, un botón). Tras `idleDelay` ms sin movimiento dibujan un cue dirigido hacia un `target` (modo *directed*) o ambiental (sin `target`); cualquier movimiento lo retrae y reinicia el temporizador. Ambos usan un overlay `pointer-events: none` (nunca bloquean clicks) y, por ser efectos **autónomos disparados por temporizador**, se **desactivan por completo** con `prefers-reduced-motion`. `AttentionCue` es el cue simple (un trazo); `GuidingBranches` es la versión orgánica (ramas generativas con estéticas intercambiables).

> **UX:** usalos con mesura. Un `idleDelay` corto que dispare animaciones agresivas se siente intrusivo; el default es conservador. Son ayudas de atención, no dark patterns.

## AttentionCue

Director de atención simple. Tras `idleDelay` ms sin mover el puntero dentro de su área, dispara un **destello de luz** que viaja desde el cursor hacia un elemento `target` (modo **directed**, "mostrando el camino") o irradiando en varias direcciones alrededor del cursor (modo **ambient**, sin `target`). Por default se muestra **solo la luz** —un cometa con glow que aparece y se desvanece como un flash—, sin línea sólida debajo; `showGuide` agrega una línea-guía tenue. El recorrido puede cambiarse con `marker`: `'beam'` (haz de luz, default) o `'footprints'` (huellas que avanzan hacia el destino, alternando izquierda/derecha). El trazo puede arquearse (`curve`) y la punta cambiarse (`head`: flecha, punto o ninguna). El `target` acepta un `RefObject`, un `Element` o un selector CSS, y se resuelve al activarse el cue (si no matchea, degrada a ambient sin error). Cualquier movimiento del puntero lo desvanece y reinicia el temporizador. Todo el timing y el tracking operan por ref/handlers, sin re-renders por frame.

El overlay tiene `pointer-events: none`: los clicks pasan al contenido. Con `prefers-reduced-motion` el cue no se dibuja.

```jsx
import { useRef } from 'react'
import { AttentionCue } from '@fethabo/animated-ui'

const ctaRef = useRef(null)

<AttentionCue target={ctaRef} idleDelay={2500} color="#fbbf24" head="arrow" curve={0.3} maxDistance={240}>
  <div style={{ height: 400 }}>
    {/* ...contenido... */}
    <button ref={ctaRef}>Empezá acá</button>
  </div>
</AttentionCue>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `target` | `RefObject \| Element \| string` | — | Elemento hacia el que dirigir el cue. Sin él ⇒ modo ambient. |
| `idleDelay` | `number` | `2000` | Ms de inactividad antes de dibujar el cue. |
| `color` | `string` | `#fbbf24` | Color del trazo. |
| `duration` | `number` | `700` | Ms que el cometa permanece antes de re-barrer. |
| `speed` | `number` | `420` | Velocidad de avance del trazo en px/s. |
| `maxDistance` | `number` | `220` | Distancia máxima en px que el cue alcanza desde el puntero. |
| `lineWidth` | `number` | `3` | Grosor del trazo en px. |
| `head` | `'arrow' \| 'dot' \| 'none'` | `'arrow'` | Estilo de la punta del cue. |
| `marker` | `'beam' \| 'footprints'` | `'beam'` | Qué recorre el camino: el haz de luz o una hilera de huellas. |
| `curve` | `number` | `0` | Curvatura del trazo (0 = recto, 1 = muy curvo). |
| `showGuide` | `boolean` | `false` | Dibuja una línea-guía tenue bajo la luz; por default solo se ve la luz. |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, no dibuja el cue (efecto autónomo). |
| `children` | `ReactNode` | — | Área monitoreada / contenido. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-cue-color` | `#fbbf24` | Color del trazo. Prevalece sobre la prop `color`. |
| `--aui-cue-duration` | `700` | Permanencia del cometa en ms (numérico, sin unidad). |
| `--aui-cue-speed` | `420` | Velocidad de avance en px/s (numérico, sin unidad). |
| `--aui-cue-max-distance` | `220` | Distancia máxima desde el puntero en px (numérico, sin unidad). |
| `--aui-cue-line-width` | `3px` | Grosor del trazo. |
| `--aui-cue-curve` | `0` | Curvatura del trazo (numérico, sin unidad). Prevalece sobre `curve`. |

## GuidingBranches

Interacción del puntero pausado con su entorno. Tras `idleDelay` ms de inactividad, hace **crecer un trazo generativo** desde la posición del puntero, dibujándose progresivamente con sub-ramificaciones. El uso principal es **ambient** (sin `target`): el trazo se expande en los **360°** alrededor del puntero hasta la frontera (`maxDistance`). Opcionalmente, con `target`, la rama dominante se sesga hacia ese elemento (modo directed). Por default crece una vez y **queda estático** mientras el puntero siga quieto; con `loop` re-crece en ciclo. La aleatoriedad viene del PRNG seedable interno; cualquier movimiento lo retrae y reinicia el temporizador.

Las estéticas son **enchufables** y definen el carácter del trazo: `roots` (default, orgánico), `lightning` (relámpago, reutiliza el generador de rayo jagged) y `circuit` (ortogonal, pistas que se expanden a 90°). Se seleccionan con `aesthetic`; agregar una estética nueva es agregar un módulo en `aesthetics/` sin cambiar la API. La prop `curl` controla cuánto se **arquean** las raíces (subila para que `roots` parezca raíces sinuosas en vez de rayos rectos); las ramas se afinan hacia las puntas. El overlay es `pointer-events: none` (no bloquea clicks). Con `prefers-reduced-motion` el trazo no se dibuja.

```jsx
import { GuidingBranches } from '@fethabo/animated-ui'

// Ambient: el trazo se expande 360° donde el mouse queda quieto.
<GuidingBranches aesthetic="circuit" color="#34d399" maxDistance={280}>
  <div style={{ height: 500 }}>{/* ...contenido... */}</div>
</GuidingBranches>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `target` | `RefObject \| Element \| string` | — | Opcional. Elemento hacia el que sesgar la rama dominante (directed). Sin él ⇒ ambient 360°. |
| `aesthetic` | `'roots' \| 'lightning' \| 'circuit'` | `'roots'` | Estética del trazo: orgánico, rayo u ortogonal. |
| `idleDelay` | `number` | `2000` | Ms de inactividad antes de crecer las ramas. |
| `color` | `string` | `#34d399` | Color de las ramas. |
| `loop` | `boolean` | `false` | Con `true` el trazo re-crece en ciclo; con `false` crece una vez y queda estático hasta que el puntero se mueve. |
| `duration` | `number` | `1400` | Ms que las ramas permanecen completas antes de re-crecer (solo con `loop`). |
| `speed` | `number` | `320` | Velocidad de dibujado del crecimiento en px/s. |
| `maxDistance` | `number` | `260` | Distancia máxima en px que cualquier rama alcanza desde el puntero. |
| `density` | `number` | `4` | Densidad de ramificación (troncos / probabilidad de hijos). |
| `depth` | `number` | `3` | Profundidad máxima de sub-ramificación. |
| `lineWidth` | `number` | `2` | Grosor del trazo en px (las ramas finas se afinan). |
| `curl` | `number` | `0.6` | Curvatura de las raíces (0 = casi recto, 1 = muy sinuoso). Ortogonales lo ignoran. |
| `jitter` | `number` | `0` | Jitter del trazo para estéticas tipo relámpago (`0` ⇒ auto). |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, no dibuja las ramas (efecto autónomo). |
| `children` | `ReactNode` | — | Área monitoreada / contenido. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-branches-color` | `#34d399` | Color de las ramas. Prevalece sobre la prop `color`. |
| `--aui-branches-duration` | `1400` | Permanencia antes de re-crecer en ms (numérico, sin unidad). |
| `--aui-branches-speed` | `320` | Velocidad de dibujado en px/s (numérico, sin unidad). |
| `--aui-branches-max-distance` | `260` | Distancia máxima desde el puntero en px (numérico, sin unidad). |
| `--aui-branches-line-width` | `2px` | Grosor del trazo. |
| `--aui-branches-curl` | `0.6` | Curvatura de las raíces (numérico, sin unidad). Prevalece sobre `curl`. |
| `--aui-branches-jitter` | `0` | Jitter del trazo en px (numérico, sin unidad). |

## Dock

Fila de ítems que se magnifican según la proximidad del cursor (efecto dock de macOS): el ítem bajo el cursor alcanza `magnification` y los vecinos escalan decrecientemente con una campana suave dentro de `radius` px. El tracking escribe `scale` directo al style de cada ítem por refs — sin re-renders de React por frame; al salir el cursor, una transition CSS devuelve todo a escala base. Los ítems (declarados con `Dock.Item`) permanecen completamente interactivos: clicks, foco y orden de tabulación intactos.

> **Touch:** sin cursor no hay magnificación — el dock queda como fila estática completamente funcional. Con `prefers-reduced-motion`, ídem.

```jsx
import { Dock } from '@fethabo/animated-ui'

<Dock magnification={1.8} radius={140} gap={10}>
  <Dock.Item><button className="icono">🏠</button></Dock.Item>
  <Dock.Item><button className="icono">🔍</button></Dock.Item>
  <Dock.Item><button className="icono">⚙️</button></Dock.Item>
</Dock>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `magnification` | `number` | `1.5` | Escala máxima del ítem bajo el cursor. |
| `radius` | `number` | `120` | Radio de influencia en px (a esa distancia la escala vuelve a 1). |
| `gap` | `number` | `8` | Separación entre ítems en px. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Eje de la fila y de la magnificación. |
| `returnDuration` | `number` | `0.25` | Duración del retorno a escala base en segundos. |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, fila estática sin magnificación. |
| `className` / `style` | — | — | Extensión del root; `Dock.Item` también los acepta. |

También acepta cualquier otra prop HTML válida de `<div>` (ídem `Dock.Item`).

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-dock-gap` | `8px` | Separación entre ítems. Prevalece sobre `gap`. |
| `--aui-dock-return` | `0.25s` | Duración del retorno a escala base. |

## BorderBeam

Cometa de luz (cabeza brillante con estela en degradé) que recorre el perímetro del borde del contenedor en loop continuo — CSS casi puro (`offset-path: border-box` + `offset-distance` animado), sin JS por frame. Sigue el `border-radius` que le des al componente, incluyendo esquinas redondeadas. La capa del cometa es `pointer-events: none`: los clicks pasan al contenido. En browsers sin `offset-path: border-box` el cometa se oculta sin afectar nada (`@supports`). Con `prefers-reduced-motion` muestra un realce de borde estático sutil.

```jsx
import { BorderBeam } from '@fethabo/animated-ui'

<BorderBeam duration={8} colorFrom="#f59e0b" style={{ borderRadius: 16, padding: 24 }}>
  <h3>Card destacada</h3>
</BorderBeam>

{/* Varias instancias desincronizadas: */}
<BorderBeam delay={0}>…</BorderBeam>
<BorderBeam delay={-3}>…</BorderBeam>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `colorFrom` | `string` | `'#7c3aed'` | Color de la cabeza del cometa. |
| `colorTo` | `string` | `'#0ea5e9'` | Color de la cola del degradé. |
| `size` | `number` | `96` | Largo del cometa en px. |
| `duration` | `number` | `6` | Segundos por vuelta completa. |
| `delay` | `number` | `0` | Desfase inicial en segundos (negativo arranca avanzado). |
| `borderWidth` | `number` | `2` | Grosor del trazo (y del realce estático) en px. |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, realce de borde estático sin movimiento. |
| `className` / `style` | — | — | Extensión del root (poné acá el `border-radius`). |

También acepta cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-beam-color-from` | `#7c3aed` | Color de la cabeza. Prevalece sobre `colorFrom`. |
| `--aui-beam-color-to` | `#0ea5e9` | Color de la cola. |
| `--aui-beam-size` | `96px` | Largo del cometa. |
| `--aui-beam-duration` | `6s` | Segundos por vuelta. |
| `--aui-beam-delay` | `0s` | Desfase inicial. |
| `--aui-beam-border-width` | `2px` | Grosor del trazo. |

## Marquee

Cinta infinita de contenido (logos, testimonios) con desplazamiento continuo CSS puro — sin JS por frame en el modo base. El contenido se duplica internamente con las copias `aria-hidden` (los lectores de pantalla lo anuncian una sola vez) y el loop es sin costura. Si los children son más angostos que el contenedor, se repiten automáticamente hasta llenar la pista (medición por observer, una vez — no por frame).

`scrollVelocity` (opt-in) acopla la velocidad de la cinta y un skew sutil a la velocidad de scroll de la página via el scroll-driver del paquete; sin la prop no hay suscripción al scroll. Con `prefers-reduced-motion` el contenido queda estático en una sola pasada. Las direcciones `up`/`down` (columnas) requieren acotar la altura del componente.

```jsx
import { Marquee } from '@fethabo/animated-ui'

<Marquee speed={80} gap={40} pauseOnHover fadeEdges>
  <img src="/logo-a.svg" alt="Logo A" />
  <img src="/logo-b.svg" alt="Logo B" />
  <img src="/logo-c.svg" alt="Logo C" />
</Marquee>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `direction` | `'left' \| 'right' \| 'up' \| 'down'` | `'left'` | Dirección del desplazamiento. |
| `speed` | `number` | `60` | Velocidad en px/s. |
| `pauseOnHover` | `boolean` | `false` | Pausa con el cursor encima; reanuda al salir, sin salto. |
| `scrollVelocity` | `boolean` | `false` | Acopla velocidad y skew a la velocidad de scroll (opt-in). |
| `gap` | `number` | `24` | Separación entre ítems y repeticiones en px. |
| `fadeEdges` | `boolean` | `false` | Desvanece los extremos con una máscara de gradiente. |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, contenido estático en una sola pasada. |
| `className` / `style` | — | — | Extensión del root. |

También acepta cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-marquee-gap` | `24px` | Separación entre ítems/repeticiones. Prevalece sobre `gap`. |
| `--aui-marquee-duration` | `20s` | Duración del ciclo (el componente la deriva de `speed`; pisala para control manual). |

## HorizontalScrollSection

Sección cuyo contenido (una fila de paneles: los `children`) se desplaza **horizontalmente** conducido por el **scroll vertical**: el root provee el recorrido (su altura = `100dvh` + recorrido horizontal × `speed`), un inner sticky fija el viewport de la fila, y el scroll-driver escribe `--aui-hscroll-progress` (0→1) en el root — el desplazamiento es un `translateX(calc(...))` compositado, sin React state por frame. El scroll es reversible y el recorrido se recalcula ante resizes (observer, no por frame).

La var de progreso queda disponible para efectos derivados del consumer (`var(--aui-hscroll-progress)` en tu CSS dentro de la sección). Con `prefers-reduced-motion` degrada a paneles apilados verticalmente, alcanzables con scroll normal; todo el contenido está en el markup SSR.

```jsx
import { HorizontalScrollSection } from '@fethabo/animated-ui'

<HorizontalScrollSection speed={1}>
  <section style={{ width: '100vw', height: '100dvh' }}>Panel 1</section>
  <section style={{ width: '100vw', height: '100dvh' }}>Panel 2</section>
  <section style={{ width: '100vw', height: '100dvh' }}>Panel 3</section>
</HorizontalScrollSection>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `speed` | `number` | `1` | Multiplicador del recorrido vertical (más alto ⇒ desplazamiento más lento). |
| `easing` | `(t: number) => number` | lineal | Easing del mapeo scroll→desplazamiento. |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, paneles apilados verticalmente sin acople. |
| `className` / `style` | — | — | Extensión del root. |

También acepta cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-hscroll-progress` | `0` | Progreso del recorrido (0→1), escrito por el componente — leelo para efectos derivados. |
| `--aui-hscroll-travel` | `0px` | Recorrido horizontal medido en px. |

## WavesBackground

Fondo de líneas fluidas sobre `<canvas>`: cada línea horizontal se curva con ruido simplex evaluado en `(x, t)` — el tiempo entra como coordenada del campo, así la ondulación es orgánica, continua y sin repetición periódica visible. El muestreo es espaciado (~8 px por punto, nunca por pixel) y el estado vive en refs (sin re-renders por frame). **Determinista por `seed`**: misma seed + dimensiones ⇒ mismas ondas, estable entre repaints. Se posiciona `absolute, inset: 0` para cubrir su contenedor `position: relative` y se adapta a resizes (con `devicePixelRatio`).

Con `prefers-reduced-motion` las líneas se dibujan curvadas pero inmóviles (frame estático), sin RAF corriendo.

```jsx
import { WavesBackground } from '@fethabo/animated-ui'

<div style={{ position: 'relative', height: 400, background: '#050510' }}>
  <WavesBackground lines={30} amplitude={28} colors={['#22d3ee', '#a78bfa']} seed="hero" />
</div>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `lines` | `number` | `24` | Cantidad de líneas distribuidas verticalmente. |
| `amplitude` | `number` | `24` | Amplitud de la ondulación en px. |
| `speed` | `number` | `1` | Velocidad de la deriva temporal (`0` congela la forma). |
| `colors` | `string[]` | `['#22d3ee', '#a78bfa']` | Paleta: cada línea interpola su color entre los extremos según su posición vertical. |
| `lineWidth` | `number` | `1.5` | Grosor de las líneas en px. |
| `seed` | `string \| number` | `'aui'` | Semilla del campo (determinista, sin `Math.random`). |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, frame estático sin animación. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-waves-color-<i>` | color `i` de `colors` | Pisa el color `i` de la paleta desde CSS en cascada. |
| `--aui-waves-line-width` | `1.5px` | Grosor de las líneas. Prevalece sobre `lineWidth`. |

## FlowField

Partículas que siguen un campo vectorial de ruido simplex dejando trazos orgánicos sobre `<canvas>`: el ángulo de avance de cada partícula sale del valor del campo en su posición (una muestra de ruido por partícula por frame). La persistencia de los trazos se logra pintando por frame un velo semitransparente del color de fondo (`fade`) — sin historial de posiciones. **Determinista por `seed`** (posiciones iniciales, respawns y campo): misma seed + dimensiones ⇒ misma evolución, frame a frame.

> **Nota:** a diferencia de los demás fondos, `FlowField` **pinta su propio fondo** (`background`, no transparente): el velo del fade lo requiere. Elegí un `background` acorde a tu diseño.

Se posiciona `absolute, inset: 0` y ante un resize reinicia la simulación de forma determinista. Con `prefers-reduced-motion` muestra una composición estática de trazos pre-simulados (presupuesto fijo de pasos en el montaje), sin RAF corriendo.

```jsx
import { FlowField } from '@fethabo/animated-ui'

<div style={{ position: 'relative', height: 400 }}>
  <FlowField count={500} colors={['#22d3ee', '#a78bfa', '#f472b6']} background="#0a0a12" seed="flow" />
</div>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `count` | `number` | `400` | Cantidad de partículas trazando el campo. |
| `speed` | `number` | `1` | Avance de las partículas en px/frame. |
| `colors` | `string[]` | `['#22d3ee', '#a78bfa', '#f472b6']` | Paleta: cada partícula sortea su color. |
| `fade` | `number` | `0.95` | Persistencia del trazo (`0–1`): más alto ⇒ los trazos permanecen más tiempo. |
| `scale` | `number` | `200` | Zoom del campo en px: mayor ⇒ curvas más amplias y suaves. |
| `background` | `string` | `'#0a0a12'` | Color de fondo que el componente pinta (necesario para el fade). |
| `seed` | `string \| number` | `'aui'` | Semilla del campo y los respawns (determinista, sin `Math.random`). |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, composición estática de trazos pre-simulados. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-flow-color-<i>` | color `i` de `colors` | Pisa el color `i` de la paleta desde CSS en cascada. |
| `--aui-flow-background` | `#0a0a12` | Color del fondo/velo. Prevalece sobre `background`. |

## TopographicBackground

Curvas de nivel animadas (mapa topográfico vivo) sobre `<canvas>`: el terreno es un campo de ruido simplex fractal (fBm) muestreado sobre una grilla de celdas (~24 px, nunca por pixel), del que se extraen `levels` isolíneas con **marching squares** (interpolación en aristas: curvas suaves, sin artefactos de grilla). Las curvas se dibujan sobre una capa offscreen que se recalcula **a intervalos espaciados** — nunca en cada frame — y se copia al canvas visible sin parpadeos. **Determinista por `seed`**: misma seed + dimensiones ⇒ mismo mapa.

Con `speed={0}` el terreno queda fijo (sin RAF); con `speed > 0` se deforma lenta y continuamente. El recálculo por resize se debouncea (~150 ms). Con `prefers-reduced-motion` el mapa se dibuja una vez, estático. Se posiciona `absolute, inset: 0` sobre su contenedor `position: relative`.

```jsx
import { TopographicBackground } from '@fethabo/animated-ui'

<div style={{ position: 'relative', height: 400, background: '#0b1120' }}>
  <TopographicBackground levels={12} color="#38bdf8" seed="terrain" />
</div>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `levels` | `number` | `10` | Cantidad de niveles de contorno distribuidos por el rango del campo. |
| `color` | `string` | `'#38bdf8'` | Color de las curvas. |
| `lineWidth` | `number` | `1` | Grosor de las curvas en px. |
| `scale` | `number` | `220` | Zoom del terreno en px: mayor ⇒ relieves más amplios. |
| `speed` | `number` | `1` | Velocidad de la evolución del terreno (`0` = fijo, sin RAF). |
| `seed` | `string \| number` | `'aui'` | Semilla del terreno (determinista, sin `Math.random`). |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, mapa estático sin evolución. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-topo-color` | `#38bdf8` | Color de las curvas. Prevalece sobre la prop `color`. |
| `--aui-topo-line-width` | `1px` | Grosor de las curvas. Prevalece sobre `lineWidth`. |

## StarfieldBackground

Cielo estrellado vivo sobre `<canvas>`: estrellas que titilan con fases independientes (alpha senoidal por estrella, nunca en sincronía) y estrellas fugaces ocasionales que cruzan el canvas con un trazo que decae. **Determinista por `seed`**: misma seed + dimensiones ⇒ mismo cielo. El campo se pinta una sola vez en una capa offscreen (al montar y en cada resize, con regeneración determinista); por frame solo se compone el titileo y las fugaces.

**Performance:** `density` es la palanca principal — el costo por frame es proporcional a la cantidad de estrellas. Con `prefers-reduced-motion` se pinta el campo estático (sin titileo, fugaces ni RAF). Se posiciona `absolute, inset: 0` sobre su contenedor `position: relative`, o el viewport con `fixed`.

```jsx
import { StarfieldBackground } from '@fethabo/animated-ui'

<div style={{ position: 'relative', height: 400 }}>
  <StarfieldBackground density={1.2} shootingStars={10} seed="cielo" />
</div>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `seed` | `string \| number` | `'aui'` | Semilla del cielo (determinista, sin `Math.random`). |
| `density` | `number` | `1` | Multiplicador de la densidad de estrellas por área. |
| `colors` | `string[]` | `['#ffffff', '#bfdbfe', '#fde68a']` | Paleta: cada estrella sortea su color (determinista). |
| `background` | `string` | `'#050514'` | Color base del cielo. |
| `speed` | `number` | `1` | Velocidad del titileo (`0` lo congela). |
| `shootingStars` | `number` | `8` | Frecuencia media de fugaces, por minuto (`0` las desactiva). |
| `fixed` | `boolean` | `false` | `position: fixed` para cubrir el viewport completo. |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, campo estático sin titileo ni fugaces, sin RAF. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-starfield-color-<i>` | color `i` de `colors` | Pisa el color `i` de la paleta desde CSS en cascada. |
| `--aui-starfield-background` | `#050514` | Color base del cielo. Prevalece sobre `background`. |

## MatrixRain

Lluvia de glifos por columnas (code rain) sobre `<canvas>`: cada columna dibuja un glifo nuevo en su cabeza brillante y una veladura semitransparente del fondo desvanece los anteriores por frame — el trail sale gratis, sin buffer de historia. Al salir por abajo, cada columna reinicia desde arriba tras un delay pseudoaleatorio. **Determinista por `seed`**: misma seed + tamaño ⇒ misma disposición y secuencia. Glifos con fuente monospace del sistema.

> **Nota:** como `FlowField`, `MatrixRain` **pinta su propio fondo** (`background`, no transparente): la veladura del trail lo requiere.

**Performance:** la grilla de columnas deriva de `fontSize` (con cap interno): subir `fontSize` reduce las columnas — la palanca para pantallas grandes o gama baja. Con `prefers-reduced-motion` se pinta un frame estático de columnas pre-dibujadas a distintas alturas, sin RAF. Se posiciona `absolute, inset: 0`, o el viewport con `fixed`.

```jsx
import { MatrixRain } from '@fethabo/animated-ui'

<div style={{ position: 'relative', height: 400 }}>
  <MatrixRain color="#22c55e" fontSize={18} seed="matrix" />
</div>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `seed` | `string \| number` | `'aui'` | Semilla de la lluvia (determinista, sin `Math.random`). |
| `charset` | `string` | dígitos + ASCII + katakana | Glifos posibles (cada carácter del string es un glifo). |
| `color` | `string` | `'#22c55e'` | Color de la cola de glifos. |
| `headColor` | `string` | `'#d9ffe3'` | Color de la cabeza brillante de cada columna. |
| `background` | `string` | `'#040905'` | Color de fondo que el componente pinta (necesario para la veladura). |
| `fontSize` | `number` | `16` | Tamaño de los glifos en px; determina la densidad de columnas. |
| `speed` | `number` | `1` | Velocidad de caída. |
| `fixed` | `boolean` | `false` | `position: fixed` para cubrir el viewport completo. |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, frame estático de columnas pre-dibujadas, sin RAF. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-matrix-color` | `#22c55e` | Color de la cola. Prevalece sobre `color`. |
| `--aui-matrix-head-color` | `#d9ffe3` | Color de la cabeza. Prevalece sobre `headColor`. |
| `--aui-matrix-background` | `#040905` | Color del fondo/veladura. Prevalece sobre `background`. |

## CursorTrail

Estela que sigue al puntero dentro de su contenedor, dibujada sobre un canvas overlay `pointer-events: none` — los children siguen interactivos. Dos modos: `particles` (partículas con vida, fade y deriva leve) y `line` (línea fluida de los últimos puntos, con grosor y alpha decrecientes hacia la cola). La emisión se throttlea por distancia recorrida (`emitEvery` px) y el RAF corre solo mientras hay estela viva: con el puntero quieto no hay trabajo por frame.

Con `prefers-reduced-motion` el efecto se desactiva por completo (sin dibujo ni RAF): la estela es decoración de movimiento, no feedback funcional. En touch degrada a no-op (no hay puntero persistente).

```jsx
import { CursorTrail } from '@fethabo/animated-ui'

<CursorTrail mode="line" color="#22d3ee" style={{ height: 400 }}>
  <section>Contenido interactivo</section>
</CursorTrail>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `mode` | `'particles' \| 'line'` | `'particles'` | Estela de partículas o línea fluida. |
| `color` | `string` | `'#7c3aed'` | Color de la estela. También via `--aui-cursor-trail-color`. |
| `colors` | `string[]` | — | Paleta multicolor (cada partícula sortea; prioridad sobre `color`). |
| `size` | `number` | `8` | Diámetro de partícula / grosor de la cabeza de la línea, en px. También via `--aui-cursor-trail-size`. |
| `life` | `number` | `0.6` | Persistencia de la estela en segundos. |
| `length` | `number` | `36` | Máximo de puntos vivos de la línea (solo `mode="line"`). |
| `emitEvery` | `number` | `12` | Umbral de emisión: px de recorrido entre emisiones. |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, el efecto se desactiva por completo. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-cursor-trail-color` | `#7c3aed` | Color de la estela. Prevalece sobre `color`. |
| `--aui-cursor-trail-size` | `8px` | Tamaño base de la estela. Prevalece sobre `size`. |

## CustomCursor

Cursor personalizado — punto que sigue al puntero de inmediato + anillo que lo persigue con lag elástico — **dentro de su contenedor**, sin portales ni efectos a nivel documento. El posicionamiento usa CSS vars escritas por `pointermove` (`--aui-cursor-x/y`, cero re-renders por frame) y el lag es una CSS transition (sin RAF propio). El anillo se agranda sobre elementos interactivos, detectados por delegación (`a`, `button`, `[role="button"]` y cualquier elemento marcado con `data-aui-cursor`). El estado se expone como `data-aui-cursor-state="idle" | "hover" | "down"` sobre el root, para estilado custom.

> **Alcance del `cursor: none`:** con `hideNativeCursor` (default `true`) el cursor nativo se oculta **solo dentro del contenedor** y sus descendientes. Los inputs de texto y otros elementos con cursor propio también lo pierden: conviene no envolver formularios completos.

**Guardas:** en dispositivos sin `(hover: hover) and (pointer: fine)` (touch, pointers gruesos) no monta los nodos custom ni toca el cursor nativo — children intactos. Con `prefers-reduced-motion` el seguimiento es directo, sin lag elástico ni transiciones.

```jsx
import { CustomCursor } from '@fethabo/animated-ui'

<CustomCursor color="#f0abfc" hoverScale={2} style={{ minHeight: 400 }}>
  <a href="#demo">El anillo se agranda acá</a>
  <div data-aui-cursor>Y acá también</div>
</CustomCursor>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `dotSize` | `number` | `8` | Diámetro del punto central en px. También via `--aui-cursor-dot-size`. |
| `ringSize` | `number` | `36` | Diámetro del anillo en px. También via `--aui-cursor-ring-size`. |
| `color` | `string` | `'#7c3aed'` | Color del dot y del borde del ring. También via `--aui-cursor-color`. |
| `lag` | `number` | `0.15` | Retardo elástico del anillo en segundos. También via `--aui-cursor-lag`. |
| `hoverScale` | `number` | `1.5` | Factor de crecimiento del anillo en `hover`. También via `--aui-cursor-hover-scale`. |
| `hideNativeCursor` | `boolean` | `true` | Oculta el cursor nativo solo dentro del contenedor. |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, seguimiento directo sin lag. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-cursor-dot-size` | `8px` | Diámetro del dot. Prevalece sobre `dotSize`. |
| `--aui-cursor-ring-size` | `36px` | Diámetro del ring. Prevalece sobre `ringSize`. |
| `--aui-cursor-color` | `#7c3aed` | Color de dot y ring. Prevalece sobre `color`. |
| `--aui-cursor-lag` | `0.15s` | Duración del lag del ring. Prevalece sobre `lag`. |
| `--aui-cursor-hover-scale` | `1.5` | Escala del ring en hover. Prevalece sobre `hoverScale`. |

## ImageTrail

Imágenes efímeras que brotan siguiendo el puntero y se desvanecen (efecto agency/portfolio). El pool `images` rota secuencialmente en orden cíclico; la emisión se throttlea por distancia recorrida (`emitEvery` px) con un cap de nodos vivos (`maxConcurrent`). Cada imagen es un nodo `<img>` efímero que se remueve solo del DOM al terminar su animación — sin estado de React por imagen. Las URLs se **precargan** tras el montaje para evitar jank de decode en la primera emisión (aun así, conviene usar imágenes livianas). La capa es `pointer-events: none`: los children siguen interactivos.

Con `prefers-reduced-motion` el efecto es no-op (sin emisión). En touch degrada a no-op.

```jsx
import { ImageTrail } from '@fethabo/animated-ui'

<ImageTrail
  images={['/uno.jpg', '/dos.jpg', '/tres.jpg']}
  size={140}
  imageStyle={{ borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.35)' }}
  style={{ height: 400 }}
>
  <h2>Movete por acá</h2>
</ImageTrail>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `images` | `string[]` | — (requerida) | URLs del pool, emitidas en rotación cíclica. |
| `size` | `number` | `120` | Ancho máximo de cada imagen en px. También via `--aui-image-trail-size`. |
| `emitEvery` | `number` | `80` | Umbral de emisión: px de recorrido entre imágenes. |
| `duration` | `number` | `900` | Vida de cada imagen en ms. También via `--aui-image-trail-duration`. |
| `maxConcurrent` | `number` | `8` | Cap de imágenes vivas; alcanzado, la emisión espera. |
| `imageClassName` | `string` | — | Clase extra para cada `<img>` (border-radius, sombras). |
| `imageStyle` | `CSSProperties` | — | Estilos inline extra para cada `<img>`. |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, no se emiten imágenes. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-image-trail-size` | `120px` | Ancho máximo de las imágenes. Prevalece sobre `size`. |
| `--aui-image-trail-duration` | `900ms` | Vida de cada imagen. Prevalece sobre `duration`. |

## TextHighlighter

Marcador a mano alzada sobre texto inline: subraya, resalta, encierra, tacha o recuadra el contenido envuelto con un trazo procedural que se "dibuja" al dispararse (line-drawing por `stroke-dashoffset`, cero JS por frame). El path se genera con **jitter seedable** para el tamaño medido del texto (misma `seed` ⇒ mismo temblor) y se regenera al cambiar el tamaño. El texto queda intacto: real, seleccionable y legible por lectores de pantalla — el SVG es un overlay absoluto `aria-hidden` sin eventos.

> **Nota:** el shape se dibuja sobre el bounding box completo del span; en texto que wrappea en varias líneas puede verse tosco — conviene aplicarlo a **palabras o frases cortas**. En SSR se sirve solo el texto (el overlay aparece tras la hidratación).

```jsx
import { TextHighlighter } from '@fethabo/animated-ui'

<p>
  La parte <TextHighlighter shape="highlight" color="#facc15">importante</TextHighlighter>{' '}
  y la <TextHighlighter shape="circle" color="#f43f5e">clave</TextHighlighter> de la frase.
</p>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — (requerida) | Texto o contenido inline a resaltar; queda intacto. |
| `shape` | `'underline' \| 'wavy-underline' \| 'circle' \| 'highlight' \| 'strike' \| 'box'` | `'underline'` | Shape del marcador. |
| `color` | `string` | `currentColor` | Color del trazo. También via `--aui-highlighter-color`. |
| `strokeWidth` | `number` | `3` (`highlight`: `1em`) | Grosor del trazo en px. También via `--aui-highlighter-stroke-width`. |
| `duration` | `number` | `0.9` | Duración del dibujo en segundos. También via `--aui-highlighter-duration`. |
| `delay` | `number` | `0` | Segundos de espera antes de dibujar. También via `--aui-highlighter-delay`. |
| `trigger` | `'in-view' \| 'mount' \| 'hover'` | `'in-view'` | Qué dispara el dibujo. |
| `once` | `boolean` | `true` | Con `false`, se des-dibuja al salir (del viewport o del hover) y se redibuja al re-entrar. |
| `seed` | `string \| number` | estable por instancia | Semilla del jitter hand-drawn (determinista). |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, el shape aparece completo de inmediato, sin animación. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<span>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-highlighter-color` | `currentColor` | Color del trazo. Prevalece sobre `color`. |
| `--aui-highlighter-stroke-width` | `3` (`highlight`: `1em`) | Grosor del trazo. Prevalece sobre `strokeWidth`. |
| `--aui-highlighter-duration` | `0.9s` | Duración del dibujo. Prevalece sobre `duration`. |
| `--aui-highlighter-delay` | `0s` | Delay previo al dibujo. Prevalece sobre `delay`. |
| `--aui-highlighter-easing` | `cubic-bezier(0.45, 0, 0.35, 1)` | Curva del dibujo. |
| `--aui-highlighter-opacity` | `0.45` | Opacidad de la franja `highlight`. |

## DrawPath

Wrapper genérico de line-drawing: cualquier SVG del consumer se "dibuja" trazo a trazo al entrar al viewport (o al montar), con **stagger por orden documental** entre trazos. El SVG no se reestructura — se miden sus `path`/`line`/`polyline`/`circle`/`rect`/`ellipse` con `getTotalLength()` y se les aplican las vars de dash, respetando `stroke`/`stroke-width` existentes. Los elementos con `data-aui-no-draw` (o dentro de un grupo que lo tenga) quedan visibles sin animar, igual que los que no exponen `getTotalLength()` (browsers viejos).

> **Nota:** el markup SSR sirve el SVG **completo y visible** (SEO/no-JS); el "rebobinado" corre en un layout effect post-hidratación, así que puede verse un flash breve del SVG completo antes del dibujo. Los SVGs montados después del primer render no se re-escanean.

```jsx
import { DrawPath } from '@fethabo/animated-ui'

<DrawPath duration={1.5} stagger={0.25}>
  <svg viewBox="0 0 200 100" fill="none">
    <path d="M 10 80 Q 60 10 110 60" stroke="#0ea5e9" strokeWidth="3" />
    <circle cx="160" cy="50" r="30" stroke="#f59e0b" strokeWidth="3" />
  </svg>
</DrawPath>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — (requerida) | El SVG (o markup con SVGs) a dibujar; no se modifica estructuralmente. |
| `duration` | `number` | `1.2` | Duración del dibujo de cada trazo en segundos. También via `--aui-draw-duration`. |
| `stagger` | `number` | `0.15` | Segundos de delay incremental entre trazos. También via `--aui-draw-stagger`. |
| `delay` | `number` | `0` | Segundos de espera antes del primer trazo. También via `--aui-draw-delay`. |
| `trigger` | `'in-view' \| 'mount'` | `'in-view'` | Qué dispara el dibujo. |
| `once` | `boolean` | `true` | Con `false`, los trazos se rebobinan al salir del viewport y se redibujan al re-entrar. |
| `threshold` | `number` | `0.15` | Fracción visible que dispara con `trigger='in-view'`. |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, el SVG se muestra completo de inmediato, sin animación. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-draw-duration` | `1.2s` | Duración del dibujo de cada trazo. Prevalece sobre `duration`. |
| `--aui-draw-stagger` | `0.15s` | Delay incremental entre trazos. Prevalece sobre `stagger`. |
| `--aui-draw-delay` | `0s` | Delay previo al primer trazo. Prevalece sobre `delay`. |
| `--aui-draw-easing` | `cubic-bezier(0.45, 0, 0.35, 1)` | Curva del dibujo. |

## ScribbleDecoration

Garabato decorativo a mano alzada — flecha, asterisco, espiral, subrayado ondulado o círculo — generado proceduralmente con jitter **seedable** y dibujado por line-drawing al entrar al viewport o al montar. Con `repeat`, se dibuja, desvanece y redibuja en loop. El SVG es decoración pura (`aria-hidden`, sin eventos), dimensionado por su contenedor (tamaño default `8em × 4em`, pisable por CSS) y regenerado con la misma seed en cada resize.

La biblioteca de shapes es **extensible por contrato**: la prop `shape` acepta, además de los nombres builtin, una función `(size, seed, options) => d` (tipo `ScribbleShape` exportado) — el consumer agrega shapes propias sin tocar el paquete.

```jsx
import { ScribbleDecoration } from '@fethabo/animated-ui'

<ScribbleDecoration shape="arrow" color="#f43f5e" strokeWidth={4} />

// Shape custom por función:
<ScribbleDecoration shape={({ width, height }) => `M 0 ${height} L ${width} 0`} />
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `shape` | `'arrow' \| 'asterisk' \| 'spiral' \| 'underline' \| 'circle' \| ScribbleShape` | `'arrow'` | Garabato builtin o función custom `(size, seed, options) => d`. |
| `color` | `string` | `currentColor` | Color del trazo. También via `--aui-scribble-color`. |
| `strokeWidth` | `number` | `3` | Grosor del trazo en px. También via `--aui-scribble-stroke-width`. |
| `duration` | `number` | `0.9` | Duración del dibujo en segundos. También via `--aui-scribble-duration`. |
| `delay` | `number` | `0` | Segundos de espera antes de dibujar. También via `--aui-scribble-delay`. |
| `trigger` | `'in-view' \| 'mount'` | `'in-view'` | Qué dispara el dibujo. |
| `once` | `boolean` | `true` | Con `false`, se rebobina al salir del viewport y se redibuja al re-entrar. |
| `repeat` | `boolean` | `false` | Loop dibuja→desvanece→redibuja mientras esté disparado. |
| `seed` | `string \| number` | estable por instancia | Semilla del jitter (misma seed, shape y tamaño ⇒ mismo garabato). |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, el garabato se muestra completo y estático (sin dibujo ni loop). |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<span>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-scribble-color` | `currentColor` | Color del trazo. Prevalece sobre `color`. |
| `--aui-scribble-stroke-width` | `3` | Grosor del trazo. Prevalece sobre `strokeWidth`. |
| `--aui-scribble-duration` | `0.9s` | Duración del dibujo. Prevalece sobre `duration`. |
| `--aui-scribble-delay` | `0s` | Delay previo al dibujo. Prevalece sobre `delay`. |
| `--aui-scribble-easing` | `cubic-bezier(0.45, 0, 0.35, 1)` | Curva del dibujo. |
| `--aui-scribble-width` | `8em` | Ancho default del contenedor. |
| `--aui-scribble-height` | `4em` | Alto default del contenedor. |

## Layout animado (FLIP)

`AnimatedList` y `AutoHeight` animan **cambios de layout reales** (elementos que se reordenan, aparecen, desaparecen o cambian de tamaño entre renders), en contraste con los efectos de presentación del resto del paquete. El motor es FLIP (First-Last-Invert-Play): se capturan los rects antes del cambio, el browser layoutea, y la diferencia se invierte con `transform` y se anima hacia identidad con WAAPI — antes del paint, sin re-renders por frame. Con `prefers-reduced-motion` los cambios se aplican de inmediato, sin animación.

## AnimatedList

Contenedor cuyos hijos keyed animan **entrada** (preset configurable con stagger opcional), **salida** (un clon visual estático anima en el último rect del item y se remueve del DOM al terminar) y **reordenamiento** (FLIP) cuando la lista cambia entre renders — filtros, sorting, todo-lists. La identidad de cada hijo es su `key` de React, como en cualquier lista: no hay API paralela ni cambia la forma de renderizar del consumer. Si un cambio llega con animaciones en vuelo, cada item se redirige desde su posición visual actual, sin saltos.

El root puede ser el propio grid/flex del consumer (pasale tus clases con `className`); cada hijo va envuelto en un wrapper medible que actúa como celda (`itemClassName`/`itemStyle`). El primer render (SSR/hidratación) no anima.

Trade-offs para tener presentes: el clon de salida es **inerte** (un snapshot visual sin handlers ni updates — no lo uses para formularios en vuelo, y contenido vivo como `<canvas>`/`<video>` se congela durante la salida), y cada commit mide un rect por item — recomendado hasta ~100 items.

```jsx
import { AnimatedList } from '@fethabo/animated-ui'

function Todos() {
  const [items, setItems] = useState(['Diseñar', 'Implementar', 'Testear'])
  return (
    <>
      <button onClick={() => setItems((list) => [...list].sort())}>Ordenar</button>
      <AnimatedList as="ul" enter="scale-in" stagger={0.05}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </AnimatedList>
    </>
  )
}
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `duration` | `number` | `0.35` | Duración de cada animación (FLIP, entrada, salida) en segundos. |
| `easing` | `string` | `'ease'` | Easing de las animaciones. |
| `enter` | `'fade' \| 'scale-in' \| 'slide' \| 'none'` | `'fade'` | Preset de entrada para keys nuevas. |
| `exit` | `'fade' \| 'scale-out' \| 'none'` | `'fade'` | Preset de salida para keys removidas. |
| `stagger` | `number` | `0` | Segundos de delay incremental entre entradas simultáneas. |
| `as` | `ElementType` | `'div'` | Elemento del root (`'ul'`, `'ol'`, …). |
| `itemClassName` | `string` | — | Clase extra del wrapper medible de cada hijo (la "celda"). |
| `itemStyle` | `CSSProperties` | — | Estilo inline extra del wrapper de cada hijo. |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, cambios instantáneos: sin FLIP, entradas/salidas ni clones. |
| `className` / `style` | — | — | Extensión del root (puede ser tu grid/flex). |

También acepta cualquier otra prop HTML válida de su elemento root.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-animated-list-easing` | `ease` | Easing de las animaciones (se resuelve al momento de animar). |
| `--aui-animated-list-duration` | `0.35s` | Duración de cada animación (se resuelve al momento de animar). |

## AutoHeight

Contenedor que transiciona su **altura** (y opcionalmente su **ancho**, con `width`) cuando el contenido cambia de tamaño — acordeones, tabs, disclosure, textos expandibles: el dolor universal de transicionar `height: auto`. Detecta cambios de children entre renders (antes del paint, sin salto visible) y resizes del contenido via `ResizeObserver`, y anima entre la dimensión anterior y la nueva con WAAPI, aplicando `overflow: hidden` solo durante la transición. La altura nunca queda fijada: al terminar, el contenedor vuelve a `height: auto` y sigue el flujo normal del layout (re-wraps del viewport incluidos). Si el contenido vuelve a cambiar en vuelo, la transición se redirige desde la altura visual actual.

Trade-off para tener presente: animar `height` relayoutea por frame (no es compositado) — es *la* forma de animar `auto`; el costo queda local al contenedor y la duración corta lo hace imperceptible.

```jsx
import { AutoHeight } from '@fethabo/animated-ui'

function Disclosure() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen((o) => !o)}>Detalles</button>
      <AutoHeight duration={0.3}>
        {open ? <p>Un párrafo largo con todos los detalles…</p> : null}
      </AutoHeight>
    </>
  )
}
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `duration` | `number` | `0.3` | Duración de la transición en segundos. |
| `easing` | `string` | `'ease'` | Easing de la transición. |
| `width` | `boolean` | `false` | Anima también el ancho del contenedor. |
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, ajuste instantáneo manteniendo `height: auto`. |
| `className` / `style` | — | — | Extensión del root. |

También acepta cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-autoheight-easing` | `ease` | Easing de la transición (se resuelve al momento de animar). |
| `--aui-autoheight-duration` | `0.3s` | Duración de la transición (se resuelve al momento de animar). |

## Celebración / Feedback

Efectos **one-shot** disparados por eventos de la app (un submit exitoso, un logro, un like), en contraste con los efectos continuos declarativos del resto del paquete. El componente monta un overlay pasivo (sin animación ni RAF en reposo) y expone un **handle imperativo via ref**: la app declara *dónde* vive el efecto con JSX y decide *cuándo* dispara llamando un método del handle. Las props del componente son los **defaults** de cada disparo, y cada método acepta opciones que las **overridean solo para esa ráfaga**.

## ConfettiBurst

Ráfaga de confetti sobre un overlay `<canvas>` (`absolute, inset: 0`, `pointer-events: none` — los clicks pasan al contenido). No anima al montar: se dispara con `ref.current.fire(options?)`. Los copos salen en abanico desde `origin` según `angle`/`spread`/`power`, caen con gravedad y drag, y giran con tumbling 3D simulado. Disparos sucesivos se **acumulan** sobre el mismo canvas; el RAF arranca con el primer `fire()` y se detiene solo cuando no quedan copos vivos — **costo cero en reposo**. La aleatoriedad usa el PRNG seedable del paquete (varía entre disparos, sin `Math.random`).

El confetti se recorta al contenedor del componente. Para cubrir el viewport completo, montalo en un contenedor `position: fixed; inset: 0`.

```jsx
import { useRef } from 'react'
import { ConfettiBurst } from '@fethabo/animated-ui'
// TypeScript: import type { ConfettiBurstHandle } from '@fethabo/animated-ui'

function SubmitButton() {
  const confettiRef = useRef(null) // useRef<ConfettiBurstHandle>(null)

  const onSubmit = async () => {
    await submitForm()
    confettiRef.current?.fire() // ráfaga con los defaults de las props
    // o por disparo: confettiRef.current?.fire({ count: 200, origin: { x: 0.5, y: 1 } })
  }

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={onSubmit}>Enviar</button>
      <ConfettiBurst ref={confettiRef} colors={['#f43f5e', '#fbbf24', '#34d399']} />
    </div>
  )
}
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `count` | `number` | `80` | Cantidad de copos por ráfaga. |
| `colors` | `string[]` | paleta festiva de 5 colores | Paleta: cada copo sortea su color. También via `--aui-confetti-color-<i>`. |
| `shapes` | `('rect' \| 'circle')[]` | `['rect', 'circle']` | Formas disponibles para los copos. |
| `origin` | `{ x: number, y: number }` | `{ x: 0.5, y: 0.5 }` | Origen de la ráfaga, relativo al contenedor (`0–1` por eje). |
| `angle` | `number` | `90` | Dirección central del abanico en grados (`90` = hacia arriba). |
| `spread` | `number` | `60` | Apertura total del cono en grados. |
| `power` | `number` | `12` | Velocidad inicial en px/frame (potencia de la ráfaga). |
| `gravity` | `number` | `0.25` | Gravedad en px/frame² (qué tan rápido caen los copos). |
| `respectReducedMotion` | `boolean` | `true` | Con `prefers-reduced-motion`, `fire()` es un **no-op** (ver abajo). |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`.

**`fire(options?)`** acepta las mismas opciones que las props visuales (`count`, `colors`, `shapes`, `origin`, `angle`, `spread`, `power`, `gravity`) y las overridea **solo para esa ráfaga**; las props siguen siendo los defaults de los disparos siguientes. `fire()` antes de la hidratación (o sin canvas disponible) es un no-op seguro. El tipo `ConfettiBurstHandle` tipa el ref en TypeScript.

> **Reduced motion:** con `prefers-reduced-motion` activo (y `respectReducedMotion` default), `fire()` no anima nada — el confetti es celebración autónoma sin versión estática útil. Si tu flujo necesita feedback igualmente, resolvelo fuera del componente (e.g. un mensaje de éxito).

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-confetti-color-<i>` | color `i` de `colors` | Pisa el color `i` de la paleta default desde CSS en cascada (no afecta `colors` pasados en `fire()`). |

## FireworksBurst

Fuegos artificiales one-shot sobre un overlay `<canvas>` pasivo (mismo contrato que [ConfettiBurst](#confettiburst)): cada `fire(options?)` lanza uno o más cohetes desde la base (`origin`, default centro-abajo) que ascienden con un wobble lateral y explotan en el apex en chispas radiales que caen con gravedad y se desvanecen. Varios cohetes por disparo despegan escalonados. Disparos sucesivos se acumulan; el RAF arranca con el primer `fire()` y se detiene solo al morir la última chispa — costo cero en reposo.

```jsx
import { useRef } from 'react'
import { FireworksBurst } from '@fethabo/animated-ui'
// TypeScript: import type { FireworksBurstHandle } from '@fethabo/animated-ui'

function Logro() {
  const ref = useRef(null) // useRef<FireworksBurstHandle>(null)
  return (
    <div style={{ position: 'relative', height: 400 }}>
      <button onClick={() => ref.current?.fire({ rockets: 3 })}>¡Logro desbloqueado!</button>
      <FireworksBurst ref={ref} particleCount={80} />
    </div>
  )
}
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `rockets` | `number` | `1` | Cohetes por ráfaga (despegue escalonado). |
| `particleCount` | `number` | `60` | Chispas por explosión. |
| `colors` | `string[]` | paleta festiva de 5 colores | Paleta: cada cohete sortea el color de su explosión. También via `--aui-fireworks-color-<i>`. |
| `origin` | `{ x: number, y: number }` | `{ x: 0.5, y: 1 }` | Base de lanzamiento, relativa al contenedor (`0–1` por eje). |
| `power` | `number` | `13` | Impulso de ascenso en px/frame (define también la altura del apex). |
| `gravity` | `number` | `0.18` | Gravedad en px/frame² (frena el ascenso y hace caer las chispas). |
| `respectReducedMotion` | `boolean` | `true` | Con `prefers-reduced-motion`, `fire()` es un no-op (convención de la categoría). |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`. **`fire(options?)`** acepta `rockets`, `particleCount`, `colors`, `origin`, `power` y `gravity`, y las overridea solo para esa ráfaga. El tipo `FireworksBurstHandle` tipa el ref en TypeScript.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-fireworks-color-<i>` | color `i` de `colors` | Pisa el color `i` de la paleta default desde CSS en cascada (no afecta `colors` pasados en `fire()`). |

## SparkleBurst

Destellos one-shot: estrellas de 4 puntas que aparecen escalonadas alrededor de un punto, crecen rápido, giran y se apagan (~1 segundo). Pensado para feedback breve y localizado — un like, un favorito, un logro chico — donde el confetti sería demasiado. Mismo contrato imperativo que [ConfettiBurst](#confettiburst); las estrellas se dibujan por path en canvas (no dependen de fuentes).

```jsx
import { useRef } from 'react'
import { SparkleBurst } from '@fethabo/animated-ui'
// TypeScript: import type { SparkleBurstHandle } from '@fethabo/animated-ui'

function LikeButton() {
  const ref = useRef(null) // useRef<SparkleBurstHandle>(null)
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => ref.current?.fire()}>❤️ Like</button>
      <SparkleBurst ref={ref} colors={['#fde047', '#ffffff']} spread={40} />
    </div>
  )
}
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `count` | `number` | `8` | Destellos por ráfaga. |
| `colors` | `string[]` | dorados y blanco | Paleta: cada destello sortea su color. También via `--aui-sparkle-color-<i>`. |
| `origin` | `{ x: number, y: number }` | `{ x: 0.5, y: 0.5 }` | Centro de la dispersión, relativo al contenedor (`0–1` por eje). |
| `spread` | `number` | `60` | Radio de dispersión alrededor del origen, en px. |
| `size` | `number` | `12` | Radio exterior máximo de cada estrella, en px. |
| `duration` | `number` | `0.9` | Vida total de la ráfaga en segundos. |
| `respectReducedMotion` | `boolean` | `true` | Con `prefers-reduced-motion`, `fire()` es un no-op (convención de la categoría). |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`. **`fire(options?)`** acepta `count`, `colors`, `origin`, `spread`, `size` y `duration`, y las overridea solo para esa ráfaga — `origin` por disparo es útil para destellar exactamente donde ocurrió el evento. El tipo `SparkleBurstHandle` tipa el ref en TypeScript.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-sparkle-color-<i>` | color `i` de `colors` | Pisa el color `i` de la paleta default desde CSS en cascada (no afecta `colors` pasados en `fire()`). |

## EmojiBurst

Ráfaga de emojis one-shot con física de confetti (abanico, gravedad, drag, giro): `fire()` lanza 🎉 ✨ ❤️ — o los que definas — desde el `origin`. Los emojis se renderizan con `fillText` y la **fuente de emojis de la plataforma**: cero assets ni fuentes externas, y el aspecto varía entre sistemas operativos (Windows/Android/iOS), que es el comportamiento esperado. Mismo contrato imperativo que [ConfettiBurst](#confettiburst).

> **Performance:** `fillText` por partícula es más caro que las formas del confetti; el default de `count` es conservador (30). Si necesitás una lluvia densa, preferí `ConfettiBurst`.

```jsx
import { useRef } from 'react'
import { EmojiBurst } from '@fethabo/animated-ui'
// TypeScript: import type { EmojiBurstHandle } from '@fethabo/animated-ui'

function Reaction() {
  const ref = useRef(null) // useRef<EmojiBurstHandle>(null)
  return (
    <div style={{ position: 'relative', height: 300 }}>
      <button onClick={() => ref.current?.fire({ emojis: ['❤️'] })}>❤️</button>
      <button onClick={() => ref.current?.fire({ emojis: ['🎉', '🥳'] })}>🎉</button>
      <EmojiBurst ref={ref} />
    </div>
  )
}
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `emojis` | `string[]` | `['🎉', '✨', '❤️']` | Lista de la que cada partícula sortea su emoji. |
| `count` | `number` | `30` | Emojis por ráfaga (conservador por el costo de `fillText`). |
| `size` | `number` | `24` | Tamaño de fuente base en px (cada emoji jittéa alrededor). |
| `origin` | `{ x: number, y: number }` | `{ x: 0.5, y: 0.5 }` | Origen de la ráfaga, relativo al contenedor (`0–1` por eje). |
| `angle` | `number` | `90` | Dirección central del abanico en grados (`90` = hacia arriba). |
| `spread` | `number` | `70` | Apertura total del cono en grados. |
| `power` | `number` | `11` | Velocidad inicial en px/frame. |
| `gravity` | `number` | `0.25` | Gravedad en px/frame². |
| `respectReducedMotion` | `boolean` | `true` | Con `prefers-reduced-motion`, `fire()` es un no-op (convención de la categoría). |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`. **`fire(options?)`** acepta `emojis`, `count`, `size`, `origin`, `angle`, `spread`, `power` y `gravity`, y las overridea solo para esa ráfaga. El tipo `EmojiBurstHandle` tipa el ref en TypeScript. No expone CSS custom properties: el color lo aporta cada emoji.

## ClickSpark

La variante **declarativa** de la categoría: sin ref ni handle — envolvé tu contenido y cada click (`pointerdown`) dentro del contenedor emite una ráfaga breve de chispas radiales en el punto exacto del evento. El canvas es un overlay `pointer-events: none`: botones, links e inputs del contenido siguen siendo interactivos, y tu `onPointerDown` (si lo pasás) corre siempre. Clicks rápidos generan ráfagas concurrentes sobre el mismo canvas y RAF, que se auto-detiene al no quedar chispas — costo cero en reposo.

```jsx
import { ClickSpark } from '@fethabo/animated-ui'

<ClickSpark colors={['#fbbf24', '#fde68a']} radius={50}>
  <button>Cada click chispea</button>
</ClickSpark>
```

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `colors` | `string[]` | dorados | Paleta: cada chispa sortea su color. También via `--aui-clickspark-color-<i>`. |
| `count` | `number` | `8` | Chispas por click. |
| `size` | `number` | `8` | Largo base del segmento de chispa en px. |
| `radius` | `number` | `40` | Alcance aproximado de la ráfaga en px. |
| `duration` | `number` | `0.4` | Vida de cada ráfaga en segundos. |
| `respectReducedMotion` | `boolean` | `true` | Con `prefers-reduced-motion` los clicks no emiten chispas; la interactividad del contenido queda intacta. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>` (incluidos handlers como `onPointerDown`, que se componen con el del efecto).

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-clickspark-color-<i>` | color `i` de `colors` | Pisa el color `i` de la paleta default desde CSS en cascada. |

## Hooks

Los hooks que usan los componentes son públicos y reutilizables:

| Hook | Descripción |
| --- | --- |
| `useReducedMotion()` | `true` si el usuario tiene activado `prefers-reduced-motion`. SSR-safe, reactivo. |
| `useMousePosition(ref)` | Posición del mouse relativa al elemento (`{x, y}` en px, `null` fuera). Pasa por estado de React: re-renderiza por movimiento. |
| `useResizeObserver(ref)` | Tamaño actual del elemento, reactivo a cambios. |
| `useInView(ref, options?)` | `true` cuando el elemento interseca el viewport (IntersectionObserver). Opciones: `threshold` (default `0.15`), `rootMargin` (`'0px'`), `once` (`true`: deja de observar tras la primera intersección). SSR-safe; si el browser no tiene IntersectionObserver retorna `true` (nunca deja contenido oculto). |

## License

MIT
