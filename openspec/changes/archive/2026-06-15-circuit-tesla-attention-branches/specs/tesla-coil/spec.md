## ADDED Requirements

### Requirement: TeslaCoil emite rayos desde un nodo central hacia afuera

`TeslaCoil` SHALL renderizar sobre `<canvas>` un nodo central desde el cual emanan rayos (arcos eléctricos) hacia afuera en múltiples direcciones. Cada rayo SHALL dibujarse como una polilínea "jagged" (quebrada con desviaciones aleatorias del trazo recto) con un glow, regenerándose periódicamente para dar la sensación de descarga eléctrica continua. La aleatoriedad del trazo SHALL provenir del PRNG seedable del paquete (no de `Math.random()` en module-load).

#### Scenario: Rayos saliendo del centro

- **WHEN** el componente está animando y `respectReducedMotion` no lo inhibe
- **THEN** SHALL verse rayos jagged saliendo del nodo central hacia afuera, regenerándose con el tiempo

#### Scenario: Trazo eléctrico, no recto

- **WHEN** se dibuja un rayo
- **THEN** SHALL tener desviaciones quebradas a lo largo de su recorrido (no ser una línea recta), con apariencia de arco eléctrico

### Requirement: Los rayos se dirigen al cursor en hover

`TeslaCoil` SHALL aceptar la prop que habilita el seguimiento del cursor (e.g. `followCursor`, default `true`). Cuando el cursor está sobre el contenedor, además de los rayos ambientales, SHALL dirigir uno o más rayos desde el nodo central hacia la posición del puntero. El tracking del cursor SHALL hacerse por ref sin re-renders de React por frame. En dispositivos touch (sin cursor de hover) SHALL emitir solo los rayos ambientales.

#### Scenario: Rayo dirigido al puntero

- **WHEN** `followCursor` está activo y el cursor está sobre el contenedor
- **THEN** al menos un rayo SHALL apuntar desde el centro hacia la posición del cursor, actualizándose al moverse

#### Scenario: Los rayos al cursor son más intensos que los ambientales

- **WHEN** el cursor está sobre el contenedor con `followCursor` activo
- **THEN** los rayos dirigidos al cursor (`cursorBolts`) SHALL dibujarse más prominentes que los ambientales (más gruesos/brillantes), notándose claramente la interacción con el puntero

#### Scenario: Sin seguimiento en touch

- **WHEN** el dispositivo es touch-only
- **THEN** SHALL emitir solo rayos ambientales, sin dirigirse a un puntero

#### Scenario: Seguimiento desactivado

- **WHEN** el consumer pasa `followCursor={false}`
- **THEN** los rayos SHALL emanar solo de forma ambiental, ignorando el cursor

#### Scenario: Rayos al cursor solo con click

- **WHEN** el consumer pasa `cursorTrigger="click"`
- **THEN** los rayos dirigidos al cursor SHALL aparecer únicamente mientras se mantiene presionado el puntero (no con el simple hover)

#### Scenario: Convergencia en el puntero

- **WHEN** se dirigen varios rayos al cursor (`cursorBolts > 1`)
- **THEN** todos SHALL converger en el mismo punto del puntero (no terminar dispersos en una línea), aunque sus trazos diverjan en el camino

### Requirement: TeslaCoil es customizable via props y CSS custom properties

`TeslaCoil` SHALL exponer props para `color` (color de los rayos/glow), `boltCount` (cantidad de rayos ambientales), `cursorBolts` (cantidad de rayos dirigidos al cursor), `cursorTrigger` (`'hover'`/`'click'`), `lineWidth` (grosor), `frequency` (frecuencia de regeneración), `reach` (alcance/longitud de los rayos) y `jitter` (magnitud de la desviación jagged). Los parámetros estéticos SHALL materializarse como CSS custom properties con namespace `--aui-tesla-*` en el root, pisables desde CSS en cascada.

#### Scenario: Override del color via CSS

- **WHEN** el consumer define `.mi-tesla { --aui-tesla-color: #7dd3fc; }`
- **THEN** los rayos SHALL dibujarse con ese color

#### Scenario: Cantidad y alcance configurables

- **WHEN** el consumer pasa `boltCount={12}` y `reach={200}`
- **THEN** SHALL emitir 12 rayos ambientales con esa longitud máxima

### Requirement: TeslaCoil respeta prefers-reduced-motion

`TeslaCoil` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, el loop de regeneración de rayos SHALL detenerse y el canvas SHALL mostrar un estado estático coherente (por ejemplo, un conjunto de rayos fijo) sin parpadeo ni regeneración. El seguimiento del cursor, al ser input directo del usuario, MAY permanecer activo dibujando un rayo estático hacia el puntero.

#### Scenario: Sin regeneración con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y `respectReducedMotion` es `true`
- **THEN** los rayos ambientales NO SHALL regenerarse y el canvas SHALL mostrar un estado estático

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** los rayos SHALL regenerarse y animarse aunque la preferencia esté activa

### Requirement: TeslaCoil es SSR-safe, responsive y extensible

`TeslaCoil` SHALL incluir `'use client'` y NO SHALL acceder a `window`, `document` ni al contexto canvas durante el render. El canvas SHALL inicializarse en `useEffect` y adaptarse al tamaño del contenedor (dimensionado por el consumer). El nodo central SHALL ubicarse por default en el centro del contenedor y SHALL poder reposicionarse via prop (e.g. `origin`). El componente SHALL aceptar `children` (contenido superpuesto al efecto), `className`, `style` y el spread de props HTML válidas de su root `<div>`; el canvas SHALL tener `pointer-events: none` para no bloquear la interacción con el contenido.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, sin acceder al DOM ni al canvas

#### Scenario: Contenido superpuesto interactivo

- **WHEN** el consumer coloca un botón como `children` del TeslaCoil
- **THEN** el botón SHALL ser clickeable (el canvas del efecto no SHALL interceptar los eventos)
