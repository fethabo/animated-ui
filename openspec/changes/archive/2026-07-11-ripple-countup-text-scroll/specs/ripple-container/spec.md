## ADDED Requirements

### Requirement: RippleContainer dibuja una onda expansiva desde el punto de click

`RippleContainer` SHALL envolver a sus `children` y, ante cada `pointerdown` dentro de su área, dibujar una onda circular que se expande desde el punto exacto del evento hasta desvanecerse. Cada onda SHALL implementarse como un nodo efímero creado imperativamente (sin estado de React por onda) y SHALL removerse del DOM al terminar su animación. Múltiples clicks en rápida sucesión SHALL producir ondas concurrentes e independientes.

#### Scenario: Onda desde el punto de click

- **WHEN** el usuario hace click en una posición del contenedor
- **THEN** una onda circular SHALL expandirse desde esa posición exacta hasta desvanecerse

#### Scenario: Clicks concurrentes

- **WHEN** el usuario hace tres clicks rápidos en posiciones distintas
- **THEN** tres ondas independientes SHALL animarse simultáneamente

#### Scenario: Autolimpieza del DOM

- **WHEN** la animación de una onda termina
- **THEN** su nodo SHALL removerse del DOM, sin acumular nodos tras usos repetidos

### Requirement: RippleContainer es customizable via props y CSS custom properties

`RippleContainer` SHALL exponer props para `color`, `duration` (ms de expansión y fade), `maxRadius` (radio máximo; por default la onda cubre el contenedor desde el punto de click) y `opacity` (opacidad inicial de la onda). Los parámetros estéticos SHALL materializarse como CSS custom properties con namespace `--aui-ripple-*` en el root, pisables desde CSS en cascada.

#### Scenario: Override del color via CSS

- **WHEN** el consumer define `.mi-boton { --aui-ripple-color: rgba(255,255,255,0.4); }`
- **THEN** las ondas SHALL dibujarse con ese color

#### Scenario: Duración configurable

- **WHEN** el consumer pasa `duration={900}`
- **THEN** cada onda SHALL tardar 900 ms en expandirse y desvanecerse

### Requirement: RippleContainer respeta prefers-reduced-motion

`RippleContainer` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, la onda expansiva SHALL sustituirse por un realce estático breve (fade sin expansión) en el punto del click, preservando el feedback de interacción sin movimiento.

#### Scenario: Feedback sin movimiento

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y el usuario hace click
- **THEN** SHALL mostrarse un fade estático breve sin expansión de la onda

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** la onda SHALL expandirse normalmente aunque la preferencia esté activa

### Requirement: RippleContainer es SSR-safe y no interfiere con la interacción

`RippleContainer` SHALL incluir `'use client'` y NO SHALL acceder a `window` ni `document` durante el render; los estilos SHALL inyectarse via `injectStyles` en un `useEffect`. Las ondas SHALL dibujarse en una capa con `pointer-events: none` que NO SHALL interceptar clicks ni foco de los `children`. El componente SHALL aceptar `children`, `className`, `style` y el spread de props HTML válidas de su root, incluyendo handlers del consumer (`onPointerDown` propio del consumer SHALL seguir funcionando).

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, sin acceder al DOM

#### Scenario: Children interactivos

- **WHEN** el contenedor envuelve un `<button>` con `onClick`
- **THEN** el click SHALL disparar tanto la onda como el `onClick` del botón
