## MODIFIED Requirements

### Requirement: El componente soporta cinco variantes de animación

AnimatedBackground SHALL soportar las variantes `aurora`, `mesh`, `noise`, `beam` y `lava`, seleccionables via prop `variant`. Cada variante SHALL tener valores visuales distintos y ser visualmente atractiva en su estado default. La variante `lava` SHALL implementarse con CSS puro (sin JS por frame): blobs de color que ascienden y descienden lentamente y se funden entre sí mediante el truco "gooey" (`filter: blur()` + `contrast()` sobre un contenedor de blobs opacos), evocando una lámpara de lava.

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

#### Scenario: Colores configurables de la variante lava

- **WHEN** el consumer pasa `variant="lava"` con `colors={['#ff6b6b', '#f59e0b']}`
- **THEN** los blobs de lava SHALL usar esos colores en lugar de los defaults de la variante

## ADDED Requirements

### Requirement: La variante lava degrada de forma legible bajo prefers-reduced-motion

Con `prefers-reduced-motion: reduce` activo y `respectReducedMotion` en `true`, la variante `lava` SHALL mostrar un estado estático visualmente coherente (los blobs fundidos en una composición fija) sin el ascenso/descenso animado, consistente con cómo las demás variantes degradan a su gradiente estático.

#### Scenario: Lava estática con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce`, `respectReducedMotion` es `true` y `variant="lava"`
- **THEN** los blobs SHALL mostrarse en una composición estática sin movimiento autónomo
