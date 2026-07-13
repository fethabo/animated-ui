## ADDED Requirements

### Requirement: TextHighlighter dibuja un resaltado hand-drawn sobre el texto

`TextHighlighter` SHALL envolver texto inline y dibujar sobre/detrás de él un shape de marcador a mano alzada con animación de line-drawing (motor SVG stroke) al dispararse. Shapes: `underline` (default), `wavy-underline`, `circle`, `highlight` (franja gruesa translúcida), `strike` y `box`. El SVG overlay SHALL ser `aria-hidden`, `pointer-events: none` y absolutamente posicionado: el texto SHALL permanecer seleccionable, legible por lectores de pantalla y sin cambios de layout.

#### Scenario: Subrayado al entrar al viewport

- **WHEN** el elemento entra al viewport con `shape="underline"`
- **THEN** el subrayado SHALL dibujarse progresivamente de un extremo al otro bajo el texto

#### Scenario: Texto intacto

- **WHEN** el resaltado está dibujado
- **THEN** el texto SHALL seguir siendo texto real seleccionable y el SVG SHALL estar oculto para lectores de pantalla

### Requirement: TextHighlighter genera el shape procedural y seedable

El path del shape SHALL generarse proceduralmente para el tamaño medido del texto (via `useResizeObserver`), con jitter seedable (`seed` opcional, default estable por instancia): el temblor a mano alzada SHALL ser determinista para la misma seed y tamaño, y SHALL regenerarse al cambiar el tamaño.

#### Scenario: Regeneración en resize

- **WHEN** el contenedor cambia de ancho y el texto re-wrappea
- **THEN** el shape SHALL regenerarse para el nuevo bounding box con la misma seed

### Requirement: TextHighlighter es customizable y disparable

`TextHighlighter` SHALL aceptar `shape`, `color`, `strokeWidth`, `duration`, `delay`, `trigger` (`'in-view'` default | `'mount'` | `'hover'`), `once` (default `true`), `seed`, `className` y `style`, con CSS custom properties `--aui-highlighter-*` para color, grosor y duración.

#### Scenario: Trigger hover

- **WHEN** el consumer pasa `trigger="hover"` y el puntero entra al texto
- **THEN** el shape SHALL dibujarse; con `once={false}` SHALL des-dibujarse al salir y redibujarse al re-entrar

### Requirement: TextHighlighter respeta prefers-reduced-motion

`TextHighlighter` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, el shape SHALL mostrarse completo de inmediato al dispararse el trigger, sin animación de dibujo (la estética hand-drawn se conserva).

#### Scenario: Trazo completo directo

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y el elemento entra al viewport
- **THEN** el resaltado SHALL aparecer completo sin animación

### Requirement: TextHighlighter es SSR-safe y extensible

`TextHighlighter` SHALL incluir `'use client'`, NO SHALL acceder a `window` ni `document` durante el render, y SHALL aceptar el spread de props HTML válidas de su elemento root (`<span>`).

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores y el texto SHALL estar presente en el markup
