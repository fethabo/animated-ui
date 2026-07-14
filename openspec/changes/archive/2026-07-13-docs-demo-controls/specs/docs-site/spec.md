# docs-site (delta)

## ADDED Requirements

### Requirement: Los demos pueden exponer un panel de controles interactivo

Un demo SHALL poder declarar un descriptor de controles (`export const controls`)
con inputs tipados (number, boolean, enum, color, text, multi). Cuando el demo
declara controles, la vista SHALL renderizar un panel que varía las props del
demo en runtime, sin recargar, y SHALL incluir siempre un control para
`respectReducedMotion`. Un demo sin controles declarados SHALL seguir
renderizándose sin panel. El panel NO SHALL modificar el código de ejemplo
mostrado (los controles exploran el demo vivo, no generan el snippet).

#### Scenario: Variar una variante en runtime

- **WHEN** el usuario abre un demo con un control `enum` para una prop de variante (p. ej. AnimatedBackground `variant`) y elige otra opción
- **THEN** el demo SHALL re-renderizarse con esa variante sin recargar, y el bloque de código NO SHALL cambiar

#### Scenario: Demo sin controles

- **WHEN** un demo no declara `controls`
- **THEN** la vista SHALL montar el demo directamente, sin panel de controles

#### Scenario: Control de movimiento reducido siempre presente

- **WHEN** se abre el panel de controles de cualquier demo que los declare
- **THEN** SHALL existir un control para `respectReducedMotion` aunque el demo no lo haya declarado explícitamente

### Requirement: El scroll es visible sobre el tema dark

Las áreas scrolleables del sitio (sidebar, bloques de código, y el scroll de la
página) SHALL mostrar una scrollbar con contraste suficiente sobre el fondo dark
(WebKit y Firefox). La scrollbar NO SHALL quedar invisible por falta de color de
thumb.

#### Scenario: Sidebar/código con overflow

- **WHEN** el contenido de una zona scrolleable excede su alto/ancho visible
- **THEN** la scrollbar SHALL ser visible (thumb con color contrastante) y operable

### Requirement: El demo refleja el uso correcto del componente

Cada demo SHALL renderizar el componente de forma visualmente correcta, aplicando
el estilo del "objeto" del demo donde el componente lo espera. En componentes que
envuelven o transforman a sus `children` mediante un wrapper interno (p. ej.
TiltCard aplica el tilt a un elemento interno y el `perspective` al root), el
estilo visual SHALL ir en un hijo del componente, no en su elemento root.

#### Scenario: TiltCard toma como referencia la card

- **WHEN** el usuario mueve el mouse sobre el demo de TiltCard
- **THEN** el tilt y el glare SHALL operar sobre la card estilada completa (no solo sobre el texto/contenido), tomando la card como referencia
