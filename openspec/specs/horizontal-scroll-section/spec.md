# horizontal-scroll-section Specification

## Purpose
Componente `HorizontalScrollSection`: desplaza una fila de paneles horizontalmente conducida por el scroll vertical (inner `position: sticky` + CSS custom property de progreso `--aui-hscroll-progress` via el scroll-driver del paquete), customizable via props y CSS custom properties, SSR-safe, con degradación a layout apilado bajo `prefers-reduced-motion`.

## Requirements

### Requirement: HorizontalScrollSection desplaza su contenido horizontalmente conducido por el scroll vertical

`HorizontalScrollSection` SHALL renderizar una sección cuyo contenido (una fila de paneles) se desplaza horizontalmente a medida que el usuario scrollea verticalmente: un inner `position: sticky` fija el viewport de la fila mientras el root provee el recorrido vertical, y el progreso (0→1) SHALL escribirse como CSS custom property (`--aui-hscroll-progress`) via el scroll-driver del paquete. El desplazamiento SHALL resolverse con `transform: translateX(calc(...))` compositado, sin React state ni estilos recalculados por JS en el hot path. El recorrido horizontal (`travel`) SHALL derivarse del ancho real de la fila menos el viewport, medido con observer (no por frame).

#### Scenario: Scroll vertical mueve la fila

- **WHEN** el usuario scrollea verticalmente a través de la sección
- **THEN** la fila SHALL desplazarse horizontalmente en proporción, mostrando el último panel al final del recorrido

#### Scenario: Scroll reversible

- **WHEN** el usuario scrollea hacia atrás
- **THEN** la fila SHALL volver hacia el primer panel proporcionalmente

#### Scenario: Resize

- **WHEN** el viewport o el contenido cambian de tamaño
- **THEN** el recorrido SHALL recalcularse y el progreso SHALL mantenerse consistente

### Requirement: HorizontalScrollSection expone su progreso para efectos derivados

La CSS custom property de progreso SHALL estar disponible en el root para que los consumers construyan efectos derivados (parallax interno, indicadores) con `calc()`, siguiendo el patrón de StickyScenes.

#### Scenario: Efecto derivado del consumer

- **WHEN** el consumer usa `var(--aui-hscroll-progress)` en CSS propio dentro de la sección
- **THEN** el valor SHALL reflejar el progreso actual (0→1) del recorrido

### Requirement: HorizontalScrollSection es customizable via props y CSS custom properties

`HorizontalScrollSection` SHALL exponer props para la velocidad/extensión del recorrido (`speed` o multiplicador de recorrido) y el easing del mapeo scroll→desplazamiento. Los parámetros SHALL materializarse como CSS custom properties con namespace `--aui-hscroll-*`, pisables desde CSS en cascada.

#### Scenario: Recorrido extendido

- **WHEN** el consumer aumenta el multiplicador de recorrido
- **THEN** la sección SHALL requerir más scroll vertical para completar el desplazamiento horizontal

### Requirement: HorizontalScrollSection respeta prefers-reduced-motion

`HorizontalScrollSection` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, la sección SHALL degradar a un layout accesible sin acople scroll→transform: los paneles SHALL apilarse verticalmente como secciones normales (sin sticky ni desplazamiento lateral).

#### Scenario: Layout apilado con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce`
- **THEN** los paneles SHALL renderizarse apilados verticalmente y alcanzables con scroll normal

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** el desplazamiento horizontal SHALL operar aunque la preferencia esté activa

### Requirement: HorizontalScrollSection es SSR-safe y extensible

`HorizontalScrollSection` SHALL incluir `'use client'` y NO SHALL acceder a `window` ni `document` durante el render (mediciones en efectos). SHALL aceptar `children` (los paneles), `className`, `style` y el spread de props HTML válidas de su root. Todo el contenido SHALL estar presente en el markup SSR (alcanzable sin JavaScript).

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores y todos los paneles SHALL estar en el markup
