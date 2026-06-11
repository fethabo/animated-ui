# parallax-layers Specification

## Purpose
Componente `ParallaxLayers`: desplaza capas declaradas con `ParallaxLayers.Layer` según el progreso del contenedor por el viewport durante el scroll, escribiendo una CSS custom property directamente sobre el DOM (sin re-renders de React, coalescido por `requestAnimationFrame`) y dejando que el desplazamiento corra en CSS puro. El tracking solo corre mientras el contenedor está cerca del viewport. Customizable via props, SSR-safe, extensible y respetuoso de `prefers-reduced-motion`.

## Requirements

### Requirement: ParallaxLayers desplaza capas según el progreso del contenedor por el viewport, sin re-renders de React

`ParallaxLayers` SHALL medir su posición en el viewport con un listener pasivo de `scroll`/`resize` coalescido por `requestAnimationFrame` (máximo una actualización por frame) y escribir `--aui-parallax-scroll` (progreso normalizado a [-1, 1]: -1 asomando por abajo, 0 centrado, 1 saliendo por arriba, clampeado) directamente sobre el elemento, sin pasar por estado de React. Las capas SHALL desplazarse con CSS puro (`calc()` sobre esa var) sin transition.

#### Scenario: Usuario scrollea con el contenedor visible

- **WHEN** el contenedor está en el viewport y el usuario scrollea
- **THEN** las capas SHALL desplazarse proporcionalmente a su `depth` y al progreso del contenedor, sin re-renderizar los children

#### Scenario: La normalización del progreso es pura y testeable

- **WHEN** se evalúa la lógica de progreso con posiciones conocidas (asomando, centrado, saliendo)
- **THEN** SHALL retornar -1, 0 y 1 respectivamente, clampeando posiciones fuera del rango

### Requirement: El tracking de scroll solo corre mientras el contenedor está cerca del viewport

`ParallaxLayers` SHALL observar su visibilidad (via `useInView` con `once: false` y margen) y suscribirse al scroll únicamente mientras interseca; fuera del viewport NO SHALL ejecutar trabajo por frame.

#### Scenario: Contenedor fuera de pantalla

- **WHEN** el contenedor está lejos del viewport y el usuario scrollea en otra parte de la página
- **THEN** el componente NO SHALL ejecutar su callback de scroll ni medir layout

### Requirement: Las capas se declaran con ParallaxLayers.Layer y profundidad configurable

El paquete SHALL exponer `ParallaxLayers.Layer`, que acepta `depth` (px de desplazamiento máximo; positivo se mueve con el scroll —efecto fondo—, negativo contra él) materializado como `--aui-parallax-scroll-depth` inline en la capa, con la misma semántica de API que `MouseParallax.Layer`.

#### Scenario: Capas con profundidades distintas

- **WHEN** el consumer declara una capa con `depth={60}` y otra con `depth={-20}`
- **THEN** al scrollear la primera SHALL desplazarse en el sentido del scroll con mayor amplitud y la segunda en sentido contrario

### Requirement: ParallaxLayers respeta prefers-reduced-motion quedando estático

`ParallaxLayers` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, NO SHALL suscribirse al scroll y las capas SHALL permanecer en su posición de layout (vars en 0).

#### Scenario: Usuario con reduced motion activado

- **WHEN** el sistema tiene `prefers-reduced-motion: reduce` y el usuario scrollea
- **THEN** las capas NO SHALL desplazarse y el contenido SHALL permanecer legible en su posición original

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** el parallax SHALL funcionar normalmente

### Requirement: ParallaxLayers es SSR-safe y extensible

`ParallaxLayers` y `ParallaxLayers.Layer` SHALL incluir `'use client'`, NO SHALL acceder a `window`/`document` durante el render (listeners y mediciones solo en `useEffect`), y SHALL aceptar `className`, `style` y el spread de props HTML válidas de sus elementos root.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, con las capas en su posición original hasta la hidratación
