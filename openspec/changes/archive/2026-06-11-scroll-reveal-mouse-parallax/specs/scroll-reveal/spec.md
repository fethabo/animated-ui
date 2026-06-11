# scroll-reveal Delta Spec

## ADDED Requirements

### Requirement: ScrollReveal revela su contenido al entrar al viewport con CSS transitions

`ScrollReveal` SHALL renderizar sus hijos directos envueltos en items que parten ocultos (opacity 0 + desplazamiento según `direction`/`distance`) y transicionan a su estado final cuando el root interseca el viewport (via `useInView`). La animación SHALL implementarse con CSS transitions inyectadas via `injectStyles`: el JavaScript solo SHALL togglear un atributo en el root, sin ejecutar código por frame.

#### Scenario: Entrada al viewport

- **WHEN** el usuario scrollea y el componente alcanza el threshold de visibilidad
- **THEN** los items SHALL transicionar de oculto a visible con la dirección y distancia configuradas

#### Scenario: Sin re-reveal por default

- **WHEN** el componente ya reveló y vuelve a salir del viewport (con `once` default `true`)
- **THEN** el contenido SHALL permanecer visible

#### Scenario: Contenido presente en el markup desde SSR

- **WHEN** la página se renderiza en el servidor
- **THEN** el contenido SHALL estar presente en el HTML (oculto visualmente, disponible para crawlers), sin errores de render ni mismatch de hidratación

### Requirement: El stagger entre hijos es configurable

`ScrollReveal` SHALL aplicar a cada hijo directo un `transition-delay` incremental calculado como `stagger × índice`, de modo que los hijos entren en cascada. El índice SHALL materializarse como `--aui-reveal-i` inline por item.

#### Scenario: Tres hijos con stagger

- **WHEN** el componente tiene tres hijos directos y `stagger={0.2}`
- **THEN** el segundo hijo SHALL comenzar su transición 0.2s después del primero, y el tercero 0.4s después

### Requirement: El reveal es customizable via props y CSS custom properties

`ScrollReveal` SHALL exponer `direction` (`'up' | 'down' | 'left' | 'right' | 'none'`, default `'up'`), `distance`, `duration`, `stagger`, `threshold` y `once` como props con defaults razonables. Los parámetros visuales SHALL materializarse como `--aui-reveal-duration`, `--aui-reveal-distance`, `--aui-reveal-stagger` y `--aui-reveal-easing` en el root, pisables desde CSS en cascada.

#### Scenario: Override via CSS en cascada

- **WHEN** un consumer define `.mi-seccion { --aui-reveal-duration: 1.2s; }` sobre el componente
- **THEN** el valor de la cascada SHALL prevalecer sobre el default

#### Scenario: Dirección none (solo fade)

- **WHEN** el consumer pasa `direction="none"`
- **THEN** los items SHALL transicionar solo la opacidad, sin desplazamiento

### Requirement: ScrollReveal respeta prefers-reduced-motion mostrando el contenido directo

`ScrollReveal` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, los items SHALL renderizar visibles en su posición final, sin transición de entrada.

#### Scenario: Usuario con reduced motion activado

- **WHEN** el sistema tiene `prefers-reduced-motion: reduce` y `respectReducedMotion` no fue desactivado
- **THEN** el contenido SHALL ser visible sin animación de reveal

### Requirement: ScrollReveal es SSR-safe y extensible

`ScrollReveal` SHALL incluir `'use client'`, NO SHALL acceder a `window`/`document` durante el render, y SHALL aceptar `className`, `style` y el spread de props HTML válidas de su elemento root (que puede actuar como contenedor de layout, e.g. grid).

#### Scenario: Root como grid del consumer

- **WHEN** el consumer pasa `className` con estilos de grid al root
- **THEN** los items SHALL participar como celdas de ese layout sin romper el efecto
