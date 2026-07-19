# spotlight-card Specification (delta)

## ADDED Requirements

### Requirement: El spotlight es consumible como hook sobre un elemento del consumer

El efecto SHALL exponerse como `useSpotlight(options)` cumpliendo el contrato de la capability `behavior-hooks`. El hook SHALL inyectar el overlay del spotlight como hija del host (`aria-hidden`, `pointer-events: none`, `border-radius: inherit`) y removerla al destruir. El tracking del cursor SHALL escribir las CSS vars `--aui-spotlight-x/y` sobre el host sin provocar re-renders. El componente `SpotlightCard` SHALL delegar en el mismo motor, preservando su API y DOM actuales.

#### Scenario: Spotlight sobre un elemento ajeno

- **WHEN** el consumer ata `useSpotlight({ radius: 300 })` a su card via ref
- **THEN** el card SHALL mostrar el spotlight radial siguiendo al cursor, con el contenido intacto e interactivo

#### Scenario: Overlay removido al destruir

- **WHEN** el componente del consumer se desmonta
- **THEN** el overlay inyectado NO SHALL permanecer en el DOM
