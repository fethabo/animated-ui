# animated-background Specification (delta)

## ADDED Requirements

### Requirement: Las variantes de AnimatedBackground son consumibles en modo clase

Cada variante SHALL ser consumible aplicando `class="aui-bg aui-<variante>"` a un elemento capa dentro de un contenedor con `position: relative` (o con la clase más `position: fixed` para cubrir el viewport), cumpliendo el contrato de la capability `css-class-mode`, con sus parámetros (`colors`, `speed`, `intensity`) disponibles como CSS vars de la variante. Las animaciones SHALL desactivarse bajo `prefers-reduced-motion: reduce` salvo opt-out `data-aui-motion`, reemplazando el gating por atributo seteado en JS. NO SHALL ofrecerse un "modo host" que aplique la variante directamente sobre el contenedor del consumer: la capa `absolute inset: 0` es el contrato (evita colisiones con el background y los pseudo-elementos del host).

#### Scenario: Capa por clase dentro de un contenedor ajeno

- **WHEN** el consumer agrega `<div class="aui-bg aui-aurora" aria-hidden="true"></div>` dentro de su contenedor `position: relative` con el CSS disponible
- **THEN** el fondo aurora SHALL animarse detrás del contenido sin JS de la librería

#### Scenario: Reduced motion en modo clase

- **WHEN** el sistema reporta `prefers-reduced-motion: reduce` y la capa no tiene `data-aui-motion`
- **THEN** la variante SHALL mostrarse estática (sin animaciones, incluidas las de pseudo-elementos)
