# border-beam Specification

## Purpose
Componente `BorderBeam`: envuelve a sus `children` y dibuja un cometa de luz que recorre el perímetro del borde del contenedor en loop continuo mediante CSS puro (`offset-path: border-box`), customizable via props y CSS custom properties (`--aui-beam-*`), SSR-safe y respetuoso de `prefers-reduced-motion`.

## Requirements

### Requirement: BorderBeam hace recorrer un cometa de luz por el perímetro del borde

`BorderBeam` SHALL envolver a sus `children` y dibujar un cometa de luz (cabeza brillante con estela en degradé) que recorre el perímetro del borde del contenedor en loop continuo, siguiendo el `border-radius` del contenedor. El recorrido SHALL implementarse con CSS puro (`offset-path: border-box` + `offset-distance` animado), sin JavaScript por frame. El cometa SHALL quedar visualmente confinado al anillo del borde (la banda de espesor `borderWidth` entre `border-box` y `padding-box`, enmascarada con `mask-clip`/`mask-composite`): ninguna parte del cometa —incluida la estela— SHALL dibujarse fuera del contenedor ni cruzar las esquinas redondeadas en línea recta. En browsers sin soporte de `offset-path: border-box` o del enmascarado compuesto requerido, el cometa SHALL ocultarse sin afectar al contenedor ni a los `children` (degradación via `@supports`).

#### Scenario: Cometa en loop

- **WHEN** el componente está montado
- **THEN** el cometa SHALL recorrer el perímetro completo del borde en loop, incluyendo esquinas redondeadas

#### Scenario: Estela confinada al anillo en esquinas redondeadas

- **WHEN** el contenedor tiene `border-radius` y el cometa atraviesa una esquina
- **THEN** la estela SHALL verse recortada al anillo del borde, sin sobresalir del contenedor ni atravesar la esquina en línea recta

#### Scenario: Browser sin offset-path

- **WHEN** el browser no soporta `offset-path: border-box`
- **THEN** el contenedor y sus children SHALL renderizarse normalmente, sin cometa y sin errores

#### Scenario: Browser sin enmascarado compuesto

- **WHEN** el browser no soporta el enmascarado compuesto requerido para confinar el cometa al anillo
- **THEN** el cometa SHALL ocultarse por completo (nunca mostrarse sin máscara), y el contenedor y sus children SHALL renderizarse normalmente

### Requirement: BorderBeam es customizable via props y CSS custom properties

`BorderBeam` SHALL exponer props para `colorFrom`/`colorTo` (degradé del cometa), `size` (largo del cometa), `duration` (segundos por vuelta), `delay` (desfase inicial, para desincronizar múltiples instancias) y `borderWidth`. Los parámetros SHALL materializarse como CSS custom properties con namespace `--aui-beam-*` en el root, pisables desde CSS en cascada.

#### Scenario: Velocidad configurable

- **WHEN** el consumer pasa `duration={8}`
- **THEN** el cometa SHALL tardar 8 segundos por vuelta completa

#### Scenario: Instancias desfasadas

- **WHEN** el consumer monta dos `BorderBeam` con `delay` distinto
- **THEN** los cometas SHALL recorrer sus perímetros desfasados entre sí

#### Scenario: Override via CSS

- **WHEN** el consumer define `.mi-card { --aui-beam-color-from: #f59e0b; }`
- **THEN** el cometa SHALL usar ese color de cabeza

### Requirement: BorderBeam respeta prefers-reduced-motion

`BorderBeam` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, el recorrido SHALL desactivarse mostrando un realce de borde estático sutil (sin movimiento).

#### Scenario: Borde estático con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce`
- **THEN** SHALL mostrarse un borde con realce estático, sin cometa en movimiento

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** el cometa SHALL animarse aunque la preferencia esté activa

### Requirement: BorderBeam es SSR-safe y no interfiere con el contenido

`BorderBeam` SHALL incluir `'use client'` y NO SHALL acceder a `window` ni `document` durante el render; los estilos SHALL inyectarse via `injectStyles`. La capa del cometa SHALL tener `pointer-events: none`. El componente SHALL aceptar `children`, `className`, `style` y el spread de props HTML válidas de su root.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, sin acceder al DOM

#### Scenario: Contenido interactivo

- **WHEN** el contenedor envuelve elementos interactivos
- **THEN** los clicks SHALL pasar a través de la capa del cometa


## ADDED Requirements

### Requirement: BorderBeam es consumible en modo clase con receta de markup

El efecto SHALL ser consumible copiando la receta de markup documentada — host `.aui-border-beam` conteniendo `.aui-border-beam-layer` con `.aui-border-beam-comet` — cumpliendo el contrato de la capability `css-class-mode`, con sus parámetros (`colorFrom`, `colorTo`, `size`, `duration`, `delay`, `borderWidth`) disponibles como CSS vars sobre el host. Bajo `prefers-reduced-motion: reduce` sin opt-out `data-aui-motion`, el cometa SHALL ocultarse y mostrarse el realce de borde estático, reemplazando el gating por atributo seteado en JS.

#### Scenario: Receta sobre un contenedor ajeno

- **WHEN** el consumer copia la receta dentro de su card (con `border-radius` en el host de la receta) y el CSS está disponible
- **THEN** el cometa SHALL recorrer el perímetro respetando el `border-radius`, sin JS de la librería

#### Scenario: Reduced motion en modo clase

- **WHEN** el sistema reporta `prefers-reduced-motion: reduce` y el host de la receta no tiene `data-aui-motion`
- **THEN** SHALL mostrarse el realce de borde estático en lugar del cometa
