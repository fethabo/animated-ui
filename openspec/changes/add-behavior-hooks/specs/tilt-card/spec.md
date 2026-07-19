# tilt-card Specification (delta)

## ADDED Requirements

### Requirement: El tilt es consumible como hook sobre un elemento del consumer

El efecto SHALL exponerse como `useTilt(options)` cumpliendo el contrato de la capability `behavior-hooks`. En modo hook la perspectiva SHALL aplicarse dentro del propio transform del host (`perspective(N) rotateX() rotateY()`), sin elemento wrapper externo. La opción `glare` NO SHALL estar disponible en modo hook (requiere overlay y contexto `preserve-3d`); su ausencia SHALL reflejarse en el tipo de opciones. El componente `TiltCard` SHALL delegar en el mismo motor que el hook, preservando su API y DOM actuales.

#### Scenario: Tilt sobre un elemento ajeno

- **WHEN** el consumer ata `useTilt({ maxAngle: 10 })` a su propio elemento via ref
- **THEN** el elemento SHALL inclinarse en 3D siguiendo al mouse con la misma interpolación con momentum que `TiltCard`

#### Scenario: Glare solo en modo componente

- **WHEN** el consumer necesita el efecto glare
- **THEN** SHALL usar el componente `TiltCard` (las opciones de `useTilt` no incluyen `glare`)
