## ADDED Requirements

### Requirement: Dock magnifica sus ítems según la proximidad del cursor

`Dock` SHALL renderizar una fila de ítems (declarados con el subcomponente `Dock.Item`) que se magnifican en función de la distancia de cada uno al cursor: el ítem bajo el cursor alcanza la escala máxima (`magnification`) y los vecinos escalan decrecientemente dentro de un radio de influencia (`radius`), con una curva suave. El tracking SHALL operar por refs y estilos directos, sin re-renders de React por frame, y solo mientras el cursor está dentro del dock. Al salir el cursor, los ítems SHALL volver a su escala base con una transición suave.

#### Scenario: Magnificación por proximidad

- **WHEN** el cursor se posa sobre un ítem del dock
- **THEN** ese ítem SHALL alcanzar la escala máxima y sus vecinos SHALL escalar decrecientemente según su distancia

#### Scenario: Retorno al salir

- **WHEN** el cursor sale del área del dock
- **THEN** todos los ítems SHALL volver suavemente a su escala base

#### Scenario: Touch sin cursor

- **WHEN** el dispositivo no tiene puntero (touch)
- **THEN** el dock SHALL renderizarse como fila estática completamente funcional, sin magnificación

### Requirement: Dock soporta orientación horizontal y vertical

`Dock` SHALL exponer `orientation` (`horizontal` default, `vertical`), aplicando la magnificación sobre el eje correspondiente.

#### Scenario: Dock vertical

- **WHEN** el consumer pasa `orientation="vertical"`
- **THEN** los ítems SHALL apilarse verticalmente y la magnificación SHALL calcularse por distancia vertical al cursor

### Requirement: Dock es customizable via props y CSS custom properties

`Dock` SHALL exponer `magnification` (escala máxima, default razonable ~1.5), `radius` (px de influencia), `gap` (separación entre ítems) y la duración del retorno. Los parámetros estéticos SHALL materializarse como CSS custom properties con namespace `--aui-dock-*` en el root, pisables desde CSS en cascada.

#### Scenario: Magnificación configurable

- **WHEN** el consumer pasa `magnification={2}`
- **THEN** el ítem bajo el cursor SHALL escalar al doble de su tamaño base

#### Scenario: Override via CSS

- **WHEN** el consumer define `.mi-dock { --aui-dock-gap: 16px; }`
- **THEN** la separación entre ítems SHALL usar el valor de la cascada

### Requirement: Dock respeta prefers-reduced-motion y preserva la interacción

`Dock` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, la magnificación SHALL desactivarse (fila estática). Los ítems SHALL permanecer completamente interactivos (clicks, foco, teclado): la magnificación NO SHALL interceptar eventos ni romper el orden de tabulación.

#### Scenario: Estático con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce`
- **THEN** los ítems SHALL renderizarse a escala base sin magnificación

#### Scenario: Navegación por teclado

- **WHEN** el usuario tabula por los ítems del dock
- **THEN** el foco SHALL recorrerlos en orden normal y los clicks/Enter SHALL funcionar

### Requirement: Dock es SSR-safe y extensible

`Dock` SHALL incluir `'use client'` y NO SHALL acceder a `window` ni `document` durante el render. Tanto `Dock` como `Dock.Item` SHALL aceptar `className`, `style` y el spread de props HTML válidas de su elemento root.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, mostrando la fila a escala base
