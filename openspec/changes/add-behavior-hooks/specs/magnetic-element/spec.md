# magnetic-element Specification (delta)

## ADDED Requirements

### Requirement: El efecto magnético es consumible como hook sobre un elemento del consumer

El efecto SHALL exponerse como `useMagnetic(options)` cumpliendo el contrato de la capability `behavior-hooks`. El hook SHALL trasladar el propio host via WAAPI con la misma interpolación y retorno elástico que `MagneticElement`. La opción `hitArea` NO SHALL estar disponible en modo hook: la zona de atracción es el área del host (la zona extendida requiere el wrapper de padding del componente, y el criterio de no usar listeners globales se mantiene). El componente `MagneticElement` SHALL delegar en el mismo motor, preservando su API y DOM actuales.

#### Scenario: Magnetismo sobre un elemento ajeno

- **WHEN** el consumer ata `useMagnetic({ strength: 0.5 })` a su botón via ref
- **THEN** el botón SHALL atraerse hacia el cursor mientras esté encima y volver con easing elástico al salir

#### Scenario: Zona de atracción extendida solo en modo componente

- **WHEN** el consumer necesita que la atracción empiece antes de tocar el elemento (`hitArea`)
- **THEN** SHALL usar el componente `MagneticElement` (las opciones de `useMagnetic` no incluyen `hitArea`)
