## Why

Wave G amplía contenedores y loops con cuatro componentes de alta demanda (dock magnificado tipo macOS, cometa de borde, marquee infinito y sección de scroll horizontal) más tres variantes nuevas del background CSS. Todo se construye con motores existentes — `useMousePosition` + transforms por ref, CSS puro y el scroll-driver de v0.5 — sin ninguna decisión arquitectónica nueva; es la tanda que más superficie pública agrega por unidad de riesgo técnico.

## What Changes

- **Nuevo `Dock`**: fila de ítems que se magnifican según la proximidad del cursor (efecto dock de macOS), generalizando el patrón de MagneticElement a N hijos. Subcomponente `Dock.Item`; magnificación y radio de influencia configurables; horizontal o vertical.
- **Nuevo `BorderBeam`**: punto/cometa de luz que recorre el perímetro del borde del contenedor en loop, CSS casi puro (`offset-path: border-box`). Hermano estético de GlowBorder (que anima un gradiente cónico completo; BorderBeam anima un cometa puntual).
- **Nuevo `Marquee`**: cinta infinita de contenido (logos, testimonios) con desplazamiento continuo CSS, dirección configurable, pausa en hover, y modo opt-in `scrollVelocity` donde la velocidad y el skew responden a la velocidad de scroll (via scroll-driver).
- **Nuevo `HorizontalScrollSection`**: sección sticky cuyo contenido se desplaza horizontalmente conducido por el scroll vertical (patrón StickyScenes aplicado a `translateX`).
- **`AnimatedBackground`: variantes nuevas `grid`, `rays` y `dots`**: grilla retro-synthwave con perspectiva, rayos de luz rotando lentamente, y patrón de puntos con pulso. Mismo contrato de `colors`/`speed`/`intensity` y CSS vars que las variantes existentes.

## Capabilities

### New Capabilities

- `dock`: Componente `Dock` — ítems magnificados por proximidad del cursor, con `Dock.Item` y orientación configurable.
- `border-beam`: Componente `BorderBeam` — cometa de luz recorriendo el perímetro del borde en loop, CSS casi puro.
- `marquee`: Componente `Marquee` — cinta infinita accesible con pausa en hover y modo opcional acoplado a la velocidad de scroll.
- `horizontal-scroll-section`: Componente `HorizontalScrollSection` — desplazamiento horizontal conducido por scroll vertical, sin React state en el hot path.

### Modified Capabilities

- `animated-background`: se agregan las variantes `grid`, `rays` y `dots` al conjunto existente (`aurora`, `mesh`, `noise`, `beam`, `lava`), con el mismo contrato de props y CSS vars.

## Impact

- **Código nuevo**: `src/components/Dock/`, `src/components/BorderBeam/`, `src/components/Marquee/`, `src/components/HorizontalScrollSection/`; tres módulos de variante nuevos en `src/components/AnimatedBackground/variants/`.
- **Exports**: cuatro componentes y sus tipos desde `src/index.ts` + cuatro entry points nuevos en `package.json#exports`; el tipo de `variant` de AnimatedBackground se amplía (aditivo).
- **Docs**: cuatro secciones nuevas en README + actualización de la sección AnimatedBackground; ejemplos standalone en `/examples`; demos con panel de controles en `test-app` (y variantes nuevas en el demo existente de AnimatedBackground).
- **Dependencias**: ninguna nueva. **Sin breaking changes** (la ampliación del union type de `variant` es aditiva).
