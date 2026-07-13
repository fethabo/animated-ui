## ADDED Requirements

### Requirement: ScribbleDecoration renderiza garabatos procedurales animados

`ScribbleDecoration` SHALL renderizar un garabato decorativo hand-drawn (SVG generado proceduralmente, seedable) que se dibuja con line-drawing al entrar al viewport o al montar. Shapes builtin: `arrow`, `asterisk`, `spiral`, `underline`, `circle`. El SVG SHALL ser `aria-hidden` (decoración pura) y dimensionarse por su contenedor.

#### Scenario: Garabato al entrar al viewport

- **WHEN** el componente entra al viewport con `shape="arrow"`
- **THEN** una flecha a mano alzada SHALL dibujarse progresivamente

#### Scenario: Determinismo por seed

- **WHEN** dos instancias usan la misma `shape`, `seed` y tamaño
- **THEN** ambas SHALL renderizar el mismo garabato

### Requirement: ScribbleDecoration acepta shapes custom por contrato

La prop `shape` SHALL aceptar, además de los nombres builtin, una **función** con el contrato del paquete (`(size, seed, options) => d`) que retorne el path a dibujar — la biblioteca de shapes SHALL ser extensible por el consumer sin modificar el paquete (patrón `aesthetics/` de GuidingBranches). Las shapes builtin SHALL vivir en módulos separados tree-shakeables.

#### Scenario: Shape custom

- **WHEN** el consumer pasa una función que genera un path válido
- **THEN** el componente SHALL dibujar ese path con el mismo motor de animación

### Requirement: ScribbleDecoration es customizable

`ScribbleDecoration` SHALL aceptar `shape`, `color`, `strokeWidth`, `duration`, `delay`, `trigger` (`'in-view'` default | `'mount'`), `once`, `repeat` (re-dibujo cíclico opcional), `seed`, `className` y `style`, con CSS custom properties `--aui-scribble-*`.

#### Scenario: Loop de re-dibujo

- **WHEN** el consumer pasa `repeat={true}`
- **THEN** el garabato SHALL dibujarse, desvanecerse y redibujarse cíclicamente

### Requirement: ScribbleDecoration respeta prefers-reduced-motion

`ScribbleDecoration` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, el garabato SHALL mostrarse completo y estático (sin dibujo ni loop).

#### Scenario: Garabato estático

- **WHEN** el browser reporta `prefers-reduced-motion: reduce`
- **THEN** el garabato SHALL verse completo sin animación

### Requirement: ScribbleDecoration es SSR-safe y extensible

`ScribbleDecoration` SHALL incluir `'use client'`, NO SHALL acceder a `window` ni `document` durante el render, y SHALL aceptar el spread de props HTML válidas de su elemento root.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, sin acceder al DOM
