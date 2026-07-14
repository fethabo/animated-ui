# docs-site Specification

## Purpose

Definir la web de documentación de `@fethabo/animated-ui`: una SPA en `docs/` (Vite + React) con una vista independiente por componente, layout con header y sidebar indexado por categoría, demos vivos lazy, ejemplos de código resaltados en build time, y una estética dark que hace dogfooding de la propia librería respetando `prefers-reduced-motion`.
## Requirements
### Requirement: La web de documentación es una SPA con una vista independiente por componente

La app SHALL vivir en `docs/` (Vite + React, dependencia `@fethabo/animated-ui` vía `file:..`) y SHALL exponer una ruta propia por componente (`/:lang/components/:slug`) con history routing (URLs sin hash). Cada vista SHALL ser navegable directamente por URL (deep link) y recargable sin 404 en el hosting.

#### Scenario: Deep link a un componente

- **WHEN** un usuario abre `https://<host>/es/components/tilt-card` directamente (sin navegar desde la home)
- **THEN** la app SHALL renderizar la vista de TiltCard con su demo, props y ejemplos

#### Scenario: Navegación entre componentes

- **WHEN** el usuario selecciona otro componente en el sidebar
- **THEN** la app SHALL cambiar de vista sin recarga completa y SHALL actualizar la URL

### Requirement: El layout tiene header y sidebar con índice agrupado por categoría

Todas las vistas SHALL compartir un layout con: header (nombre de la librería, versión publicada leída de `package.json`, selector de idioma, link al repo de GitHub) y sidebar con el índice completo de componentes agrupado por categoría, marcando el componente activo. El sidebar SHALL incluir un filtro por nombre.

#### Scenario: Usuario explora por categoría

- **WHEN** el usuario abre cualquier vista
- **THEN** el sidebar SHALL mostrar todas las categorías con sus componentes y SHALL resaltar el componente activo

#### Scenario: Filtro del índice

- **WHEN** el usuario escribe "text" en el filtro del sidebar
- **THEN** el índice SHALL reducirse a los componentes cuyo nombre coincide, conservando su agrupación por categoría

### Requirement: Cada vista de componente muestra demo vivo, ejemplos, props, CSS vars y limitaciones

Cada vista SHALL incluir, en este orden: título y descripción, demo vivo interactivo, ejemplos de código en dos tabs ("Uso del paquete" y "Standalone copy-paste") ambos con botón de copiar, tabla de props (nombre, tipo, default, descripción), tabla de CSS custom properties `--aui-*`, y sección de limitaciones/notas. El código de los ejemplos SHALL mostrarse con syntax highlighting generado en build time (sin highlighter en el bundle del cliente).

#### Scenario: Copiar ejemplo standalone

- **WHEN** el usuario pulsa el botón de copiar en el tab "Standalone copy-paste"
- **THEN** el portapapeles SHALL contener el contenido literal de `examples/<slug>.tsx` y la UI SHALL confirmar la copia

#### Scenario: Ejemplo de uso del paquete

- **WHEN** el usuario abre el tab "Uso del paquete"
- **THEN** SHALL ver un snippet con el import por subpath (`@fethabo/animated-ui/<slug>`) y un uso mínimo del componente

### Requirement: Los demos se cargan lazy por ruta

Cada demo SHALL cargarse con import dinámico al entrar a su vista. Los demos one-shot (confetti, fireworks, etc.) SHALL dispararse por interacción del usuario, no automáticamente en el mount.

#### Scenario: Navegación sin costo de demos ajenos

- **WHEN** el usuario visita la vista de ShinyText
- **THEN** el bundle descargado NO SHALL incluir el código de demos de otras vistas (e.g. canvas de ParticleField)

#### Scenario: Demo one-shot

- **WHEN** el usuario entra a la vista de ConfettiBurst
- **THEN** el burst SHALL ejecutarse solo al accionar el disparador del demo

### Requirement: La estética es dark, liviana y usa la propia librería

El sitio SHALL usar un único tema dark en v1, con CSS plano y custom properties propias bajo el namespace `--docs-*` (sin redefinir variables `--aui-*` globalmente). El chrome del sitio SHALL consumir componentes de la propia librería en al menos la home y la galería de categorías (dogfooding). No SHALL usarse frameworks de docs ni frameworks de CSS.

#### Scenario: Dogfooding visible

- **WHEN** el usuario abre la home
- **THEN** al menos un componente de la librería SHALL estar en uso como parte del chrome del sitio (e.g. `AnimatedBackground` en el hero)

### Requirement: La web respeta prefers-reduced-motion

Las animaciones del chrome del sitio y los demos SHALL respetar `prefers-reduced-motion` (los componentes de la librería ya lo hacen por default; el sitio NO SHALL desactivar ese comportamiento con `respectReducedMotion={false}` salvo en demos cuyo propósito explícito sea mostrar ese opt-out).

#### Scenario: Usuario con reduced motion

- **WHEN** el sistema del usuario tiene activado `prefers-reduced-motion: reduce`
- **THEN** el chrome del sitio SHALL renderizarse sin animación decorativa y los demos SHALL degradar según su spec de componente

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

### Requirement: El scroll es visible sobre el tema dark

Las áreas scrolleables del sitio SHALL mostrar una scrollbar con contraste
suficiente sobre el fondo dark (sidebar, bloques de código, y el scroll de la
página; WebKit y Firefox). La scrollbar NO SHALL quedar invisible por falta de
color de thumb.

#### Scenario: Sidebar/código con overflow

- **WHEN** el contenido de una zona scrolleable excede su alto/ancho visible
- **THEN** la scrollbar SHALL ser visible (thumb con color contrastante) y operable

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

### Requirement: Todo demo expone controles completos para sus props controlables

Cada demo de componente SHALL declarar controles que cubran todas sus props
públicas controlables — escalares (number), booleanas, enumeradas y de color —
usando el `props.json` generado como checklist de cobertura. Las props no
controlables SHALL excluirse según una lista de exclusión explícita y versionada
(contenido/children, refs/handles, `className`/`style`, props de función,
`seed`, `target`, `src`/`alt`). El build SHALL fallar si un demo no declara
controles o si le falta un control para una prop controlable no excluida.

#### Scenario: Demo sin cobertura completa

- **WHEN** un componente expone una prop pública controlable (p. ej. una prop de color) y su demo no declara un control para ella
- **THEN** el build de la docs SHALL fallar identificando el componente y la prop sin control

#### Scenario: Prop excluida no exige control

- **WHEN** una prop es de contenido, función, ref, `className`/`style`, `seed`, `target` o `src`/`alt`
- **THEN** el build NO SHALL exigir un control para ella

### Requirement: Los demos con props de color exponen controles de color

Todo demo cuyo componente tenga props de color SHALL exponerlas como controles:
una prop de color simple como control `color` (selección libre), y una prop de
paleta (`colors[]`) como control `multi` de swatches que permita variar la
paleta en runtime.

#### Scenario: Color simple

- **WHEN** el usuario abre el panel de un demo con una prop de color simple
- **THEN** SHALL ver un control de color que, al cambiarlo, actualiza el demo en vivo

#### Scenario: Paleta

- **WHEN** el componente acepta una paleta `colors[]`
- **THEN** el panel SHALL ofrecer un control de swatches para variar qué colores integran la paleta, reflejándose en el demo

### Requirement: El panel de controles es alcanzable en demos de layout flow

El panel de controles SHALL permanecer alcanzable en los demos con
`demoLayout: 'flow'` (scroll-driven / sticky, de alto grande) mientras se
scrollea el demo (posicionamiento fijo al viewport), sin quedar fuera de vista.

#### Scenario: Demo alto scroll-driven

- **WHEN** el usuario scrollea un demo `flow` con controles
- **THEN** el toggle del panel SHALL seguir visible y operable

