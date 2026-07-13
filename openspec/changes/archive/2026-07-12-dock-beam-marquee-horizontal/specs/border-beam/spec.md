## ADDED Requirements

### Requirement: BorderBeam hace recorrer un cometa de luz por el perímetro del borde

`BorderBeam` SHALL envolver a sus `children` y dibujar un cometa de luz (cabeza brillante con estela en degradé) que recorre el perímetro del borde del contenedor en loop continuo, siguiendo el `border-radius` del contenedor. El recorrido SHALL implementarse con CSS puro (`offset-path: border-box` + `offset-distance` animado), sin JavaScript por frame. En browsers sin soporte de `offset-path: border-box`, el cometa SHALL ocultarse sin afectar al contenedor ni a los `children` (degradación via `@supports`).

#### Scenario: Cometa en loop

- **WHEN** el componente está montado
- **THEN** el cometa SHALL recorrer el perímetro completo del borde en loop, incluyendo esquinas redondeadas

#### Scenario: Browser sin offset-path

- **WHEN** el browser no soporta `offset-path: border-box`
- **THEN** el contenedor y sus children SHALL renderizarse normalmente, sin cometa y sin errores

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
