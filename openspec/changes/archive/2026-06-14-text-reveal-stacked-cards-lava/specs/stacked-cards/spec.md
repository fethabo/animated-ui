## ADDED Requirements

### Requirement: StackedCards apila sus hijos con sticky durante el scroll

`StackedCards` SHALL renderizar cada hijo directo como una "card" envuelta en un wrapper con `position: sticky` anclado a un offset superior, de modo que al scrollear las cards se fijen y se vayan apilando una sobre la otra en orden de aparición. El contenedor SHALL dimensionarse para reservar suficiente recorrido de scroll para que cada card alcance su posición fija antes de que llegue la siguiente. La card más reciente SHALL quedar arriba del stack.

#### Scenario: Cards se fijan y apilan al scrollear

- **WHEN** el usuario scrollea a través de un `StackedCards` con varias cards
- **THEN** cada card SHALL fijarse al llegar a su offset superior y la siguiente SHALL deslizarse por encima al continuar el scroll

#### Scenario: Orden de apilado

- **WHEN** hay tres cards y el usuario scrollea hasta el final
- **THEN** la tercera card SHALL quedar visible arriba, con la primera y la segunda apiladas debajo

### Requirement: Las cards inferiores se encogen y oscurecen progresivamente

`StackedCards` SHALL aplicar a las cards que quedan tapadas una reducción de escala y/o un oscurecimiento progresivo en función de cuántas cards tienen encima, creando profundidad visual. La interpolación SHALL escribirse como CSS custom properties sobre cada card (sin estado de React en el hot path) y el movimiento SHALL correr en el compositor (`transform`/`opacity`). SHALL aceptar `scaleStep` (cuánto se encoge cada card por nivel de profundidad) y `opacityStep` (cuánto se oscurece por nivel).

#### Scenario: Profundidad por escala

- **WHEN** una card queda tapada por dos cards y `scaleStep` está configurado
- **THEN** SHALL renderizarse a una escala menor que una card tapada por una sola card

#### Scenario: Desactivar el oscurecimiento

- **WHEN** el consumer pasa `opacityStep={0}`
- **THEN** las cards tapadas NO SHALL oscurecerse, solo (opcionalmente) encogerse

### Requirement: StackedCards reutiliza el motor de scroll sin estado en el hot path

`StackedCards` SHALL usar el scroll-driver existente (`subscribeScroll` + `requestAnimationFrame`) para calcular el progreso y escribir CSS custom properties, sin re-renderizar React por frame. El tracking SHALL correr solo mientras el contenedor está cerca del viewport (vía `useInView`/IntersectionObserver), de modo que múltiples instancias fuera de pantalla no cuesten por frame. SHALL aceptar `offsetTop` (px desde el top del viewport donde se fija el stack, default `0`) y `gap`/`cardHeight` o equivalente para definir el recorrido por card.

#### Scenario: Sin trabajo fuera de pantalla

- **WHEN** un `StackedCards` está lejos del viewport
- **THEN** NO SHALL ejecutarse cálculo de scroll por frame para esa instancia

#### Scenario: Offset superior configurable (header fijo)

- **WHEN** el consumer pasa `offsetTop={80}` para dejar lugar a un header fijo
- **THEN** las cards SHALL fijarse a 80 px del top del viewport

### Requirement: StackedCards es customizable via props y CSS custom properties

`StackedCards` SHALL materializar sus parámetros (`offsetTop`, `scaleStep`, `opacityStep`) como CSS custom properties con namespace `--aui-stack-*` en el root, pisables desde CSS en cascada. Cada card SHALL exponer su nivel de profundidad como variable de runtime usable con `calc()` por consumers que quieran efectos derivados.

#### Scenario: Override del scaleStep via CSS

- **WHEN** el consumer define `.mi-stack { --aui-stack-scale-step: 0.04; }`
- **THEN** cada nivel de profundidad SHALL reducir la escala en ese factor

### Requirement: StackedCards respeta prefers-reduced-motion

`StackedCards` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, las cards SHALL mostrarse en un layout estático legible (apiladas o en flujo normal) sin las transformaciones de escala/opacidad ligadas al scroll, manteniendo el contenido accesible. El sticky nativo (que refleja el scroll que el usuario controla) MAY permanecer.

#### Scenario: Sin transformaciones autónomas con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y `respectReducedMotion` es `true`
- **THEN** las cards NO SHALL aplicar escala/oscurecimiento ligados al scroll y el contenido SHALL quedar legible

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** el efecto de apilado SHALL animarse aunque la preferencia esté activa

### Requirement: StackedCards es SSR-safe y extensible

`StackedCards` SHALL incluir `'use client'` y NO SHALL acceder a `window` ni `document` durante el render. Cada hijo directo SHALL renderizarse en el markup desde el primer paint. El componente SHALL aceptar `className`, `style` y el spread de props HTML válidas de su elemento root `<div>`.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores y las cards SHALL estar presentes en el markup estático

#### Scenario: Número arbitrario de cards

- **WHEN** el consumer pasa N hijos directos
- **THEN** el componente SHALL apilar las N cards sin límite fijo, reservando recorrido de scroll proporcional
