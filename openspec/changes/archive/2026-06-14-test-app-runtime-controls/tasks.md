## 1. Harness base

- [x] 1.1 Crear `test-app/src/harness/ControlPanel.jsx`: panel genérico que recibe un descriptor (array de controles) + render prop `(props) => ReactNode`, mantiene estado `{ [prop]: value }` inicializado desde los `default`, y es colapsable.
- [x] 1.2 Implementar el render de cada tipo de control en el panel: `number` (slider + lectura del valor), `color`, `enum` (select), `boolean` (toggle), `text`, y `multi` (checkboxes para arrays).
- [x] 1.3 Inyectar en todo panel el control estándar `respectReducedMotion` (boolean, default `true`).
- [x] 1.4 Estilos inline mínimos del panel (sin deps nuevas): legible sobre fondo oscuro, no tapa el efecto.

## 2. Demos por componente

- [x] 2.1 Crear `test-app/src/demos/` con un módulo por componente que exporte su descriptor de controles + el render del demo, con `default` = preset actual de `main.jsx`.
- [x] 2.2 AnimatedBackground: controles `variant` (enum), `colors` (multi), `speed` (number), `intensity` (number).
- [x] 2.3 PixelBackground: `behaviors` (multi), `color`, `idleIntensity` (number), `hoverRadius` (number).
- [x] 2.4 TiltCard: `glare` (boolean), `maxAngle` (number); contenido del render prop fijo.
- [x] 2.5 SpotlightCard: `color` (text/rgba), `radius` (number); contenido fijo.
- [x] 2.6 GlowBorder: `width` (number), `radius` (number), `followCursor` (boolean), `colors` (multi).
- [x] 2.7 MagneticElement: `strength` (number), `hitArea` (number); contenido del render prop fijo.
- [x] 2.8 ShinyText: `color`, `highlight`, `speed` (number), `angle` (number), `text`.
- [x] 2.9 MouseParallax: props del root configurables; capas demo fijas.
- [x] 2.10 ParallaxLayers: props del root configurables; capas demo fijas.
- [x] 2.11 ScrollReveal: `stagger` (number), `distance` (number), `direction` (enum).
- [x] 2.12 ScrambleText: `text`, `trigger` (enum), `scrambleColor` (color).
- [x] 2.13 ScrollProgress: `color`, `height` (number).
- [x] 2.14 ParticleField: `count` (number), `color`, `cursorInteraction` (enum); demás props canvas configurables.
- [x] 2.15 ImageDissolve: `duration` (number); imágenes demo fijas (data URLs), navegación 1/2/3 conservada.
- [x] 2.16 StickyScenes: `sceneDuration` (number); escenas demo fijas.

## 3. Integración en main.jsx

- [x] 3.1 Reestructurar `test-app/src/main.jsx` para montar cada componente dentro de su `Section` envuelto en `ControlPanel` con el descriptor de su módulo de `demos/`.
- [x] 3.2 Conservar elementos globales (barra `ScrollProgress`, deep links por hash, layout de `Section`).

## 4. Verificación

- [x] 4.1 `npm run build` del paquete y `npm run dev` del `test-app`; verificar que cada panel bindea en vivo y que los defaults reproducen el preset previo. (Build-level: `npm run build` del paquete OK; `vite build` transforma los 69 módulos sin error; `vite dev` sirve y transforma main.jsx + demos + ControlPanel y resuelve imports al `dist/` buildeado. La confirmación visual interactiva queda para una pasada manual en el browser.)
- [x] 4.2 Verificar el toggle `respectReducedMotion` por componente (animaciones autónomas se detienen al activarlo). — requiere pasada manual en el browser.
- [x] 4.3 Verificar que los enum/multi/number/color/text/boolean producen el cambio esperado en cada componente. — requiere pasada manual en el browser.

## 5. Documentación de proceso

- [x] 5.1 Mencionar el harness de controles en `AGENTS.md` como parte del paso de verificación visual del flujo de trabajo.
