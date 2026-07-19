# glow-border Specification (delta)

## ADDED Requirements

### Requirement: El glow border es consumible como hook sobre un elemento del consumer

El efecto SHALL exponerse como `useGlowBorder(options)` cumpliendo el contrato de la capability `behavior-hooks`. El hook SHALL inyectar la capa cónica como hija del host y aplicar sobre el host el padding perimetral (`--aui-glow-width`), `overflow: hidden` e `isolation: isolate` que el anillo requiere, restaurándolos al destruir. En modo hook NO SHALL existir el wrapper `.aui-glow-content`: el contenido del consumer SHALL aportar su propio background para tapar el centro del gradiente, y ese contrato SHALL documentarse (el padding del host pasa a ser el ancho del glow). El componente `GlowBorder` SHALL delegar en el mismo motor, preservando su API y DOM actuales, incluyendo el modo `followCursor`.

#### Scenario: Glow sobre un elemento ajeno

- **WHEN** el consumer ata `useGlowBorder({ speed: 6 })` a un contenedor cuyo hijo tiene background propio
- **THEN** el contenedor SHALL mostrar el anillo de gradiente cónico animado en su perímetro

#### Scenario: followCursor en modo hook

- **WHEN** el consumer pasa `followCursor: true` al hook
- **THEN** el gradiente SHALL apuntar hacia el cursor con momentum, igual que en el componente

#### Scenario: Host restaurado al destruir

- **WHEN** el efecto se destruye
- **THEN** el host SHALL recuperar su `padding`, `overflow` e `isolation` previos y la capa cónica SHALL removerse
