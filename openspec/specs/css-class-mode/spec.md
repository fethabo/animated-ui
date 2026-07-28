# css-class-mode Specification (delta)

## ADDED Requirements

### Requirement: Los efectos Pure CSS son consumibles por clase sin montar componentes

Todo efecto elegible para modo clase SHALL poder aplicarse agregando sus clases `aui-*` (y el markup de su receta, si la tiene) a elementos arbitrarios, sin montar ningún componente React. Un efecto SHALL ser elegible solo si su runtime es 100% CSS (sin JS por frame, sin observers, sin estado) y su estructura requerida es expresable como receta estática de markup.

#### Scenario: Efecto por clase en un elemento ajeno

- **WHEN** el consumer aplica `class="aui-shiny"` a un elemento de texto con el CSS del efecto disponible
- **THEN** el efecto SHALL funcionar idéntico al del componente con props default

#### Scenario: Efecto no elegible

- **WHEN** un efecto requiere JS en runtime (observers, estado, canvas) o transforma la estructura de sus children
- **THEN** NO SHALL ofrecerse en modo clase

### Requirement: El CSS se distribuye por dos canales desde una fuente única

El CSS de cada efecto class-mode SHALL vivir como función pura en su `styles.ts` y distribuirse por: (1) una función de registro exportada (`register*()`) que inyecta via `injectStyles` de forma idempotente, y (2) archivos publicados en `dist/css/` (`<efecto>.css` por efecto + bundle `animated-ui.css`) generados en build desde esa misma función. Ambos canales SHALL emitir CSS idéntico al que inyecta el componente.

#### Scenario: Registro programático

- **WHEN** el consumer llama `registerShinyText()` dos veces
- **THEN** el CSS SHALL inyectarse una sola vez (deduplicado por `styleId`) y la clase quedar disponible

#### Scenario: Import de archivo CSS

- **WHEN** el consumer importa `@fethabo/animated-ui/css/<efecto>.css` en un contexto sin React
- **THEN** las clases del efecto SHALL funcionar sin ningún JS de la librería

#### Scenario: Coexistencia de canales

- **WHEN** el consumer importa el archivo CSS y además monta el componente del mismo efecto
- **THEN** el comportamiento SHALL ser el mismo que con un solo canal (reglas idénticas, sin conflictos)

### Requirement: Reduced motion se garantiza en CSS con opt-out por atributo

El CSS de todo efecto class-mode SHALL incluir una regla `@media (prefers-reduced-motion: reduce)` que desactiva las animaciones autónomas (o aplica el estado estático alternativo del efecto) salvo que el elemento tenga el atributo de opt-out `data-aui-motion`. Los componentes de estos efectos SHALL conservar la prop `respectReducedMotion` (default `true`) con semántica idéntica: con `false`, el componente SHALL setear `data-aui-motion` en su root.

#### Scenario: Modo clase con preferencia activa

- **WHEN** un elemento con clase `aui-*` se muestra en un sistema con `prefers-reduced-motion: reduce`
- **THEN** el efecto SHALL quedar en su estado estático sin ejecutar JS alguno

#### Scenario: Opt-out en modo clase

- **WHEN** el consumer agrega `data-aui-motion` al elemento
- **THEN** el efecto SHALL animar aun con la preferencia activa

#### Scenario: Paridad del componente

- **WHEN** el componente se usa con `respectReducedMotion` en `true` o `false` bajo la preferencia activa
- **THEN** el comportamiento observable SHALL ser idéntico al anterior a este change

### Requirement: La parametrización en modo clase opera via CSS custom properties

Todo parámetro estético disponible en modo clase SHALL expresarse como CSS var `--aui-*` con fallback en el CSS (mismas vars que el modo componente). Los parámetros no expresables como vars (e.g. keyframes generados por configuración) SHALL quedar en sus defaults en los archivos publicados, y esa limitación SHALL documentarse en la receta del efecto.

#### Scenario: Override por var inline

- **WHEN** el consumer setea `style="--aui-shiny-speed: 5s"` junto a la clase
- **THEN** el efecto SHALL usar ese valor en lugar del default

#### Scenario: Parámetro no expresable como var

- **WHEN** un parámetro del efecto requiere keyframes generados por configuración
- **THEN** el archivo CSS publicado SHALL incluir solo la configuración default y la receta SHALL indicar que ese parámetro requiere el componente o la función de registro

### Requirement: El empaquetado preserva los archivos CSS y el tree-shaking

`package.json` SHALL declarar exports para los archivos CSS publicados y un `sideEffects` que excluya `**/*.css` de la purga de los bundlers, manteniendo el tree-shaking del código JS. Las funciones de registro SHALL exportarse desde el entry de su componente y el barrel, sin entries nuevos de build.

#### Scenario: Import del CSS no purgado

- **WHEN** un consumer con bundler importa un `.css` publicado sin usar ningún símbolo JS del paquete
- **THEN** el CSS SHALL permanecer en el build final

#### Scenario: Tree-shaking intacto

- **WHEN** un consumer importa un solo componente del paquete
- **THEN** el bundle NO SHALL incluir código de otros componentes ni CSS de efectos no usados

### Requirement: Cada efecto class-mode documenta su receta

El README y la web de documentación SHALL incluir, por efecto class-mode: el markup mínimo requerido, las clases y atributos, las CSS vars disponibles con defaults, y las limitaciones respecto al modo componente.

#### Scenario: Receta con markup requerido

- **WHEN** un efecto requiere estructura hija (e.g. BorderBeam) o atributos (e.g. `data-text`)
- **THEN** la receta SHALL mostrar el markup completo copy-paste y el efecto SHALL funcionar al copiarlo
