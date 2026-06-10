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

## Components

| Componente | Descripción |
| --- | --- |
| [AnimatedBackground](#animatedbackground) | Background animado con CSS puro, con variantes `aurora`, `mesh`, `noise` y `beam`. |
| [PixelBackground](#pixelbackground) | Grilla de píxeles sobre canvas con behaviors combinables: `hover`, `idle` y `reveal`. |
| [TiltCard](#tiltcard) | Card con efecto 3D tilt via WAAPI, con glare opcional y render prop de estado. |

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

## License

MIT
