# scroll-progress Delta Spec

## ADDED Requirements

### Requirement: ScrollProgress muestra el progreso de lectura de la página sin re-renders de React

`ScrollProgress` SHALL renderizar una barra fija (`position: fixed`, arriba o abajo según la prop `position`, default `'top'`) cuyo avance refleja el progreso de scroll de la página. El progreso SHALL calcularse con lógica pura (`scrollTop / (scrollHeight - clientHeight)`, clampeado a [0, 1] y 0 si la página no tiene overflow) y escribirse como `--aui-progress` directamente sobre el elemento via listener pasivo coalescido por RAF, sin estado de React. La barra SHALL animarse con `transform: scaleX` (compositado), no con `width`.

#### Scenario: Usuario scrollea la página

- **WHEN** el usuario scrollea desde el inicio hasta el final del documento
- **THEN** la barra SHALL avanzar de vacía a completa, sin re-renderizar ningún subtree de React

#### Scenario: Página sin overflow

- **WHEN** el documento no tiene contenido scrolleable
- **THEN** el progreso SHALL ser 0 (sin división por cero) y la barra SHALL renderizar vacía

#### Scenario: Resize del viewport

- **WHEN** el viewport cambia de tamaño alterando la proporción de scroll
- **THEN** el progreso SHALL recalcularse

### Requirement: La barra es customizable via props y CSS custom properties y no interfiere con la página

`ScrollProgress` SHALL exponer color, grosor, color del track y z-index como props materializadas como `--aui-progress-color` (default `#7c3aed`), `--aui-progress-height` (default `3px`), `--aui-progress-bg` (default `transparent`) y `--aui-progress-z` (default `50`), pisables desde CSS en cascada. El track SHALL tener `pointer-events: none`.

#### Scenario: Override via CSS en cascada

- **WHEN** un consumer define `.mi-barra { --aui-progress-color: #22d3ee; }` sobre el componente
- **THEN** el valor de la cascada SHALL prevalecer sobre el default

#### Scenario: Contenido clickeable debajo de la barra

- **WHEN** un elemento interactivo del consumer queda debajo del área de la barra
- **THEN** SHALL recibir clicks normalmente

### Requirement: ScrollProgress es accesible sin spam y permanece activo bajo reduced motion

El elemento SHALL llevar `aria-hidden="true"` por default (es un reflejo decorativo de la posición de scroll que el browser ya expone; un `progressbar` actualizado por frame generaría anuncios constantes). Dado que refleja 1:1 input directo del usuario sin desplazar contenido, SHALL permanecer activo con `prefers-reduced-motion: reduce`; `respectReducedMotion` se acepta por consistencia de API sin efecto en esta versión.

#### Scenario: Lector de pantalla recorre la página

- **WHEN** un lector de pantalla navega el documento con la barra montada
- **THEN** la barra NO SHALL anunciarse ni interrumpir la lectura

#### Scenario: Usuario con reduced motion activado

- **WHEN** el sistema tiene `prefers-reduced-motion: reduce` y el usuario scrollea
- **THEN** la barra SHALL seguir reflejando el progreso normalmente

### Requirement: ScrollProgress es SSR-safe y extensible

`ScrollProgress` SHALL incluir `'use client'`, NO SHALL acceder a `window`/`document` durante el render (el listener arranca en `useEffect`; el render inicial produce la barra en 0), y SHALL aceptar `className`, `style` y el spread de props HTML válidas de su elemento root.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, con la barra vacía hasta la hidratación
