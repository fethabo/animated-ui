## MODIFIED Requirements

### Requirement: Los demos pueden exponer un panel de controles interactivo

Un demo SHALL poder declarar un descriptor de controles (`export const controls`)
con inputs tipados (number, boolean, enum, color, text, multi). Cuando el demo
declara controles, la vista SHALL renderizar un panel que varía las props del
demo en runtime, sin recargar, y SHALL incluir siempre un control para
`respectReducedMotion`. Un demo sin controles declarados SHALL seguir
renderizándose sin panel.

El estado del panel SHALL reinicializarse a los valores por default del demo
actual al navegar a otra vista de componente: NO SHALL conservar valores del
componente anterior ni exponer `undefined` para props que el componente actual
no declara. El panel SHALL ofrecer un control "Reset" que devuelva todas las
props a sus valores por default.

El panel SHALL ubicarse fuera del frame recortado del demo (no como overlay
dentro de un contenedor `overflow:hidden`), de modo que todos los controles sean
accesibles independientemente de la altura del demo. Los demos que scrollean
contra la ventana (flow / full-bleed) SHALL mantener el panel anclado al
viewport.

El panel SHALL mostrar un snippet de código generado en vivo con las props
seleccionadas, incluyendo **únicamente** las props cuyo valor difiere de su
default (`respectReducedMotion` incluido solo si se lo modificó), y SHALL ofrecer
un botón para copiar ese snippet al portapapeles. Este snippet builder es una
salida separada y NO SHALL reemplazar ni modificar los dos tabs de ejemplo
(Uso del paquete / Standalone), que permanecen estables.

#### Scenario: Variar una variante en runtime

- **WHEN** el usuario abre un demo con un control `enum` para una prop de variante (p. ej. AnimatedBackground `variant`) y elige otra opción
- **THEN** el demo SHALL re-renderizarse con esa variante sin recargar, y los tabs de ejemplo (Uso/Standalone) NO SHALL cambiar

#### Scenario: Demo sin controles

- **WHEN** un demo no declara `controls`
- **THEN** la vista SHALL montar el demo directamente, sin panel de controles

#### Scenario: Control de movimiento reducido siempre presente

- **WHEN** se abre el panel de controles de cualquier demo que los declare
- **THEN** SHALL existir un control para `respectReducedMotion` aunque el demo no lo haya declarado explícitamente

#### Scenario: Estado reiniciado al navegar entre componentes

- **WHEN** el usuario ajusta controles en un componente A y luego navega a un componente B que declara controles distintos (o con props de nombre coincidente)
- **THEN** el panel de B SHALL mostrar los valores por default de B, sin heredar valores de A ni exhibir `undefined`, y el demo de B NO SHALL recibir props ajenas

#### Scenario: Reset a valores por default

- **WHEN** el usuario modifica varios controles y acciona "Reset"
- **THEN** todos los controles SHALL volver a sus valores por default y el demo SHALL re-renderizarse acorde

#### Scenario: Panel accesible en demos de poca altura

- **WHEN** un demo de poca altura declara suficientes controles como para exceder el alto del frame
- **THEN** todos los controles SHALL ser visibles y operables (el panel NO SHALL quedar recortado por el frame del demo)

#### Scenario: Snippet builder con solo props modificadas

- **WHEN** el usuario cambia una prop respecto de su default y deja el resto en default
- **THEN** el snippet generado SHALL incluir únicamente la(s) prop(s) modificada(s), y el botón de copiar SHALL colocar ese snippet en el portapapeles con confirmación visual

### Requirement: El demo refleja el uso correcto del componente

Cada demo SHALL renderizar el componente de forma visualmente correcta, aplicando
el estilo del "objeto" del demo donde el componente lo espera. En componentes que
envuelven o transforman a sus `children` mediante un wrapper interno (p. ej.
TiltCard aplica el tilt a un elemento interno y el `perspective` al root), el
estilo visual SHALL ir en un hijo del componente, no en su elemento root.

Cada demo SHALL alcanzar paridad visual y funcional con su demo de referencia en
el test-app (`test-app/src/demos/*.jsx`): SHALL mostrar el efecto que el
componente produce y SHALL tener padding/centrado adecuados. Los componentes
scroll-driven inherentemente full-viewport (sticky contra la ventana o paneles
`100vw`) SHALL poder declararse en modo full-bleed, rompiendo el ancho del
artículo y scrolleando contra la ventana, sin desbordar horizontalmente el
documento.

#### Scenario: TiltCard toma como referencia la card

- **WHEN** el usuario mueve el mouse sobre el demo de TiltCard
- **THEN** el tilt y el glare SHALL operar sobre la card estilada completa (no solo sobre el texto/contenido), tomando la card como referencia

#### Scenario: Demo con padding y centrado

- **WHEN** el usuario abre un demo cuyo contenido no ocupa todo el frame (p. ej. AnimatedList, AutoHeight)
- **THEN** el contenido SHALL renderizarse con padding y centrado, no pegado al borde superior-izquierdo del frame

#### Scenario: Demo scroll-driven con recorrido

- **WHEN** el usuario abre un demo cuyo efecto depende del scroll (p. ej. TextScrollReveal)
- **THEN** el demo SHALL proveer recorrido de scroll suficiente para que el efecto sea observable de principio a fin

#### Scenario: Demo full-bleed sin desborde

- **WHEN** el usuario abre un demo full-viewport (p. ej. StickyScenes, HorizontalScrollSection)
- **THEN** las escenas/paneles SHALL renderizarse correctamente (sin apilarse ni desbordar horizontalmente el documento) y el efecto SHALL responder al scroll de la ventana

#### Scenario: Demo que muestra el efecto real

- **WHEN** el usuario abre un demo cuyo efecto requiere condiciones específicas (p. ej. ImageDissolve necesita una fuente que no tintee el canvas para muestrear píxeles)
- **THEN** el demo SHALL cumplir esas condiciones y mostrar el efecto tal como en el test-app (p. ej. las imágenes numeradas 1/2/3 con dithering visible)
