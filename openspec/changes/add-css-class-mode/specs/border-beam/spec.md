# border-beam Specification (delta)

## ADDED Requirements

### Requirement: BorderBeam es consumible en modo clase con receta de markup

El efecto SHALL ser consumible copiando la receta de markup documentada — host `.aui-border-beam` conteniendo `.aui-border-beam-layer` con `.aui-border-beam-comet` — cumpliendo el contrato de la capability `css-class-mode`, con sus parámetros (`colorFrom`, `colorTo`, `size`, `duration`, `delay`, `borderWidth`) disponibles como CSS vars sobre el host. Bajo `prefers-reduced-motion: reduce` sin opt-out `data-aui-motion`, el cometa SHALL ocultarse y mostrarse el realce de borde estático, reemplazando el gating por atributo seteado en JS.

#### Scenario: Receta sobre un contenedor ajeno

- **WHEN** el consumer copia la receta dentro de su card (con `border-radius` en el host de la receta) y el CSS está disponible
- **THEN** el cometa SHALL recorrer el perímetro respetando el `border-radius`, sin JS de la librería

#### Scenario: Reduced motion en modo clase

- **WHEN** el sistema reporta `prefers-reduced-motion: reduce` y el host de la receta no tiene `data-aui-motion`
- **THEN** SHALL mostrarse el realce de borde estático en lugar del cometa
