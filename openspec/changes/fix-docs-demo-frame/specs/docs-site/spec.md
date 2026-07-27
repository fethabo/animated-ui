# docs-site Specification (delta)

## ADDED Requirements

### Requirement: El frame del demo no participa del render del componente

El frame en que la docs monta un demo (recorte, radio, altura, capas de composición, reset de box model) es chrome del sitio y NO SHALL alterar el render del componente que contiene. En particular NO SHALL introducir artefactos de borde en componentes con transform 3D o capas compositadas, ni recortar geometría que el mismo componente muestra completa en su demo de referencia del test-app.

Cuando un componente transforma su contenido fuera del plano (rotación 3D, escalado, parallax), el frame SHALL darle holgura suficiente para que la geometría transformada quepa sin recorte.

#### Scenario: Componente con transform 3D

- **WHEN** el usuario mueve el puntero sobre un demo cuyo componente rota su contenido en 3D (p. ej. TiltCard)
- **THEN** los bordes del contenido SHALL renderizarse limpios en toda la rotación, incluido el lado que rota hacia el viewer, con la misma calidad que en el demo de referencia del test-app

#### Scenario: Geometría transformada sin recorte

- **WHEN** un componente transformado alcanza su extensión máxima dentro del frame
- **THEN** el frame NO SHALL recortar la geometría resultante

## MODIFIED Requirements

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
artículo, sin desbordar horizontalmente el documento.

Un demo full-bleed SHALL ocupar el área de contenido disponible —el viewport
menos el chrome lateral del sitio— y NO SHALL superponerse al sidebar ni al
header ni ocultarlos, en ningún punto de su recorrido de scroll. El ancho
resultante SHALL estar disponible para el demo como CSS custom property, de modo
que sus paneles midan contra el área real en vez de asumir `100vw`. En los
breakpoints donde el sidebar deja de ser lateral, el área disponible SHALL ser
el viewport completo.

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

#### Scenario: Demo full-bleed y sidebar

- **WHEN** el usuario recorre un demo full-bleed (p. ej. HorizontalScrollSection) de principio a fin
- **THEN** el sidebar SHALL permanecer visible y operable durante todo el recorrido, y ningún panel del demo SHALL quedar oculto detrás de él

#### Scenario: Full-bleed en mobile

- **WHEN** el viewport está por debajo del breakpoint en que el sidebar deja de ser lateral
- **THEN** el demo full-bleed SHALL ocupar el viewport completo, sin dejar un hueco del ancho del sidebar

#### Scenario: Demo que muestra el efecto real

- **WHEN** el usuario abre un demo cuyo efecto requiere condiciones específicas (p. ej. ImageDissolve necesita una fuente que no tintee el canvas para muestrear píxeles)
- **THEN** el demo SHALL cumplir esas condiciones y mostrar el efecto tal como en el test-app (p. ej. las imágenes numeradas 1/2/3 con dithering visible)
