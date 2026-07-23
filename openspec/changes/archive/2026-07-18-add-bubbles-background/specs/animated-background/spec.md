## RENAMED Requirements

- FROM: `### Requirement: El componente soporta ocho variantes de animación`
- TO: `### Requirement: El componente soporta nueve variantes de animación`

## MODIFIED Requirements

### Requirement: El componente soporta nueve variantes de animación

AnimatedBackground SHALL soportar las variantes `aurora`, `mesh`, `noise`, `beam`, `lava`, `grid`, `rays`, `dots` y `bubbles`, seleccionables via prop `variant`. Cada variante SHALL tener valores visuales distintos y ser visualmente atractiva en su estado default. Las variantes nuevas SHALL implementarse con CSS puro (sin JS por frame) y cumplir el mismo contrato de `colors`/`speed`/`intensity` y CSS custom properties (`--aui-grid-*`, `--aui-rays-*`, `--aui-dots-*`, `--aui-bubbles-*`) que las existentes: `grid` es una grilla retro-synthwave en perspectiva cuyas líneas se desplazan hacia el horizonte; `rays` son haces de luz que rotan lentamente desde un vértice; `dots` es un patrón de puntos con pulso suave de opacidad/escala; `bubbles` son burbujas translúcidas de distintos tamaños que ascienden lentamente desde la parte inferior con leve deriva horizontal, en loop continuo.

#### Scenario: Variante aurora

- **WHEN** se renderiza `<AnimatedBackground variant="aurora" />`
- **THEN** el background SHALL mostrar gradientes de colores vibrantes que se mueven lentamente simulando una aurora boreal

#### Scenario: Variante mesh

- **WHEN** se renderiza `<AnimatedBackground variant="mesh" />`
- **THEN** el background SHALL mostrar blobs de color suaves que se deforman y mueven en un patrón orgánico

#### Scenario: Variante noise

- **WHEN** se renderiza `<AnimatedBackground variant="noise" />`
- **THEN** el background SHALL mostrar un efecto de ruido o grain animado sutil sobre un color base

#### Scenario: Variante beam

- **WHEN** se renderiza `<AnimatedBackground variant="beam" />`
- **THEN** el background SHALL mostrar rayos o haces de luz que cruzan el fondo en movimiento suave

#### Scenario: Variante lava

- **WHEN** se renderiza `<AnimatedBackground variant="lava" />`
- **THEN** el background SHALL mostrar blobs que ascienden y descienden lentamente, fundiéndose y separándose con bordes orgánicos tipo lámpara de lava

#### Scenario: Variante grid

- **WHEN** se renderiza `<AnimatedBackground variant="grid" />`
- **THEN** el background SHALL mostrar una grilla en perspectiva cuyas líneas se desplazan continuamente hacia el horizonte

#### Scenario: Variante rays

- **WHEN** se renderiza `<AnimatedBackground variant="rays" />`
- **THEN** el background SHALL mostrar haces de luz rotando lentamente desde un vértice

#### Scenario: Variante dots

- **WHEN** se renderiza `<AnimatedBackground variant="dots" />`
- **THEN** el background SHALL mostrar un patrón de puntos con un pulso suave de opacidad/escala

#### Scenario: Variante bubbles

- **WHEN** se renderiza `<AnimatedBackground variant="bubbles" />`
- **THEN** el background SHALL mostrar burbujas translúcidas de distintos tamaños que ascienden lentamente desde la parte inferior, con leve deriva horizontal, en loop continuo

#### Scenario: Colores configurables de las variantes nuevas

- **WHEN** el consumer pasa `variant="grid"` con `colors={['#22d3ee', '#0f172a']}`
- **THEN** la variante SHALL usar esos colores en lugar de los defaults, igual que las variantes existentes

#### Scenario: Reduced motion en las variantes nuevas

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` con `variant` en `grid`, `rays`, `dots` o `bubbles`
- **THEN** la variante SHALL mostrar su composición estática sin animación, como el resto de las variantes

## ADDED Requirements

### Requirement: La variante bubbles degrada de forma legible bajo prefers-reduced-motion

Con `prefers-reduced-motion: reduce` activo y `respectReducedMotion` en `true`, la variante `bubbles` SHALL mostrar un estado estático visualmente coherente (burbujas distribuidas a distintas alturas del contenedor, no apiladas fuera de vista en la parte inferior) sin el ascenso animado, consistente con cómo las demás variantes degradan a su composición estática.

#### Scenario: Bubbles estática con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce`, `respectReducedMotion` es `true` y `variant="bubbles"`
- **THEN** las burbujas SHALL mostrarse distribuidas de forma estática dentro del contenedor, sin movimiento autónomo
