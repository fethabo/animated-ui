# docs-site

## ADDED Requirements

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
