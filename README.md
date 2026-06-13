# @fethabo/animated-ui

![npm](https://img.shields.io/npm/v/@fethabo/animated-ui)

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
| [AnimatedBackground](#animatedbackground) | Background animado con CSS puro, con variantes `aurora`, `mesh`, `noise` y `beam`. |
| [PixelBackground](#pixelbackground) | Grilla de píxeles sobre canvas con behaviors combinables: `hover`, `idle` y `reveal`. |
| [TiltCard](#tiltcard) | Card con efecto 3D tilt via WAAPI, con glare opcional y render prop de estado. |
| [SpotlightCard](#spotlightcard) | Contenedor con spotlight radial que sigue al cursor, sin re-renders por frame. |
| [GlowBorder](#glowborder) | Borde de gradiente cónico animado, en loop autónomo o apuntando al cursor. |
| [MagneticElement](#magneticelement) | Wrapper que atrae su contenido hacia el cursor, con retorno elástico y render prop. |
| [ShinyText](#shinytext) | Texto con un brillo que lo barre en loop, CSS puro; sirve también como texto con gradiente. |
| [ScrambleText](#scrambletext) | Texto que se "descifra" carácter por carácter (efecto decrypt/Matrix), accesible. |
| [ScrollReveal](#scrollreveal) | Revela su contenido al entrar al viewport, con dirección y stagger entre hijos. |
| [MouseParallax](#mouseparallax) | Capas con profundidad que se desplazan según el mouse, sin re-renders por frame. |
| [ParallaxLayers](#parallaxlayers) | Capas con profundidad ligadas a la posición de scroll, sin re-renders por frame. |
| [ScrollProgress](#scrollprogress) | Barra fija de progreso de lectura de la página, compositada. |
| [ParticleField](#particlefield) | Campo de partículas sobre canvas con repulsión/atracción configurable al cursor. |
| [ImageDissolve](#imagedissolve) | Transición entre imágenes con dithering ordered (matriz Bayer 8×8) al cambiar `src`. |
| [StickyScenes](#stickyscenes) | Secciones sticky que transicionan entre escenas durante el scroll, sin re-renders por frame. |

## AnimatedBackground

Background animado renderizado con CSS puro (sin JS por frame). Se posiciona `absolute, inset: 0` para cubrir su contenedor `position: relative`, o el viewport completo con `fixed`. Cada variante tiene defaults visualmente atractivos y expone sus colores, velocidad e intensidad tanto por props como por CSS custom properties.

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
| `variant` | `'aurora' \| 'mesh' \| 'noise' \| 'beam'` | `'aurora'` | Variante visual de la animación. |
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

Campo de partículas autónomas sobre `<canvas>`, con repulsión/atracción configurable al cursor. Las partículas se mueven con velocidad aleatoria y rebotan en los bordes; dentro del radio del cursor reciben una fuerza proporcional a la proximidad. El cálculo es cursor-a-partícula (O(N)), no entre pares. El estado de las partículas vive en un ref que persiste entre frames: el RAF no re-renderiza React. Con `prefers-reduced-motion` el loop se detiene y el canvas muestra las partículas en su estado inicial estático.

El canvas llena el contenedor — **dimensionalo vos** con `style`/`className` (ej. `height: '100vh'`); si el contenedor tiene tamaño cero, no se ve nada. En dispositivos touch (sin cursor de hover) las partículas se animan de forma autónoma, ignorando el puntero.

```jsx
import { ParticleField } from '@fethabo/animated-ui'

<div style={{ height: '100vh' }}>
  <ParticleField count={80} color="#22d3ee" cursorInteraction="repel" />
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
| `respectReducedMotion` | `boolean` | `true` | Con `reduce`, detiene el RAF y muestra el estado inicial estático. |
| `className` | `string` | — | Clases adicionales para el elemento root. |
| `style` | `CSSProperties` | — | Estilos inline adicionales para el elemento root. |

También acepta cualquier otra prop HTML válida de `<div>`.

### CSS Custom Properties

| Variable | Default | Descripción |
| --- | --- | --- |
| `--aui-particle-color` | `#7c3aed` | Color de las partículas. Un override por cascada prevalece sobre la prop `color`. |
| `--aui-particle-radius` | `2px` | Radio de cada partícula. |

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
