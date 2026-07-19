# shiny-text Specification (delta)

## ADDED Requirements

### Requirement: ShinyText es consumible en modo clase

El efecto SHALL ser consumible aplicando `class="aui-shiny"` a cualquier elemento de texto, cumpliendo el contrato de la capability `css-class-mode`, con todos sus parámetros (`color`, `highlight`, `speed`, `angle`) disponibles como CSS vars. El loop SHALL activarse por la clase (sin atributo seteado por JS) y desactivarse bajo `prefers-reduced-motion: reduce` salvo opt-out `data-aui-motion`. El componente SHALL conservar su API pública y su semántica de `respectReducedMotion`.

#### Scenario: Clase sobre un heading ajeno

- **WHEN** el consumer aplica `class="aui-shiny"` y `style="--aui-shiny-speed: 5s"` a un `<h1>` con el CSS disponible
- **THEN** el barrido de brillo SHALL ejecutarse en loop de 5s sin JS de la librería

#### Scenario: Reduced motion en modo clase

- **WHEN** el sistema reporta `prefers-reduced-motion: reduce` y el elemento no tiene `data-aui-motion`
- **THEN** el texto SHALL mostrarse con el gradiente estático, sin animación
