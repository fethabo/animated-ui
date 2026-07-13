## ADDED Requirements

### Requirement: DrawPath dibuja los trazos del SVG del consumer

`DrawPath` SHALL envolver un SVG provisto por el consumer (como `children`) y animar el dibujo de sus elementos con trazo (`path`, `line`, `polyline`, `circle`, `rect`, `ellipse`) mediante el motor SVG stroke, al entrar al viewport (`useInView`, default) o al montar. El SVG del consumer NO SHALL reestructurarse: solo se miden sus elementos y se les aplican vars de dash y la clase de animación, respetando `stroke`/`strokeWidth` existentes. Elementos con `data-aui-no-draw` SHALL saltearse (quedan visibles sin animar).

#### Scenario: SVG multi-path con stagger

- **WHEN** el SVG envuelto tiene varios paths y entra al viewport
- **THEN** cada path SHALL dibujarse progresivamente con delay incremental según su orden documental

#### Scenario: Opt-out por elemento

- **WHEN** un elemento del SVG tiene `data-aui-no-draw`
- **THEN** ese elemento SHALL verse completo desde el inicio, sin animación

#### Scenario: Estilos del consumer respetados

- **WHEN** los paths del consumer definen su propio `stroke` y `stroke-width`
- **THEN** el dibujo SHALL usar esos estilos sin modificarlos

### Requirement: DrawPath es customizable y disparable

`DrawPath` SHALL aceptar `duration`, `stagger`, `delay`, `easing` (via CSS var), `trigger` (`'in-view'` default | `'mount'`), `once` (default `true`; con `false` SHALL rebobinar al salir del viewport y redibujar al re-entrar), `threshold`, `className` y `style`, con CSS custom properties `--aui-draw-*`.

#### Scenario: Retrigger

- **WHEN** el consumer pasa `once={false}` y el SVG sale y vuelve a entrar al viewport
- **THEN** los trazos SHALL rebobinarse sin transición al salir y redibujarse al re-entrar

### Requirement: DrawPath respeta prefers-reduced-motion

`DrawPath` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, el SVG SHALL mostrarse completo de inmediato, sin animación de dibujo.

#### Scenario: SVG completo directo

- **WHEN** el browser reporta `prefers-reduced-motion: reduce`
- **THEN** todos los trazos SHALL verse completos sin animación

### Requirement: DrawPath es SSR-safe y extensible

`DrawPath` SHALL incluir `'use client'`, NO SHALL acceder a `window` ni `document` durante el render, y SHALL aceptar el spread de props HTML válidas de su elemento root. En SSR el SVG del consumer SHALL renderizarse completo y visible.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores con el SVG completo en el markup
