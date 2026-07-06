## RENAMED Requirements

- FROM: `### Requirement: El componente soporta cinco variantes de animación`
- TO: `### Requirement: El componente soporta ocho variantes de animación`

## MODIFIED Requirements

### Requirement: El componente soporta ocho variantes de animación

AnimatedBackground SHALL soportar las variantes `aurora`, `mesh`, `noise`, `beam`, `lava`, `grid`, `rays` y `dots`, seleccionables via prop `variant`. Cada variante SHALL tener valores visuales distintos y ser visualmente atractiva en su estado default. Las variantes nuevas SHALL implementarse con CSS puro (sin JS por frame) y cumplir el mismo contrato de `colors`/`speed`/`intensity` y CSS custom properties (`--aui-grid-*`, `--aui-rays-*`, `--aui-dots-*`) que las existentes: `grid` es una grilla retro-synthwave en perspectiva cuyas líneas se desplazan hacia el horizonte; `rays` son haces de luz que rotan lentamente desde un vértice; `dots` es un patrón de puntos con pulso suave de opacidad/escala.

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

#### Scenario: Colores configurables de las variantes nuevas

- **WHEN** el consumer pasa `variant="grid"` con `colors={['#22d3ee', '#0f172a']}`
- **THEN** la variante SHALL usar esos colores en lugar de los defaults, igual que las variantes existentes

#### Scenario: Reduced motion en las variantes nuevas

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` con `variant` en `grid`, `rays` o `dots`
- **THEN** la variante SHALL mostrar su composición estática sin animación, como el resto de las variantes
