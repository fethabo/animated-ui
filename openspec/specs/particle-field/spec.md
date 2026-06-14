# particle-field Specification

## Purpose
Componente `ParticleField`: campo de partículas animadas renderizado sobre `<canvas>` con un RAF loop que actualiza y dibuja en cada frame. Las partículas se mueven de forma autónoma con velocidad aleatoria y rebotan en los bordes, reaccionan al cursor con repulsión o atracción configurable (cálculo O(N) cursor-a-partícula), y son customizables via props y CSS custom properties. Respeta `prefers-reduced-motion` deteniendo la animación, es SSR-safe (sin acceso a DOM/canvas en render) y extensible.

## Requirements

### Requirement: ParticleField renderiza un campo de partículas animadas sobre canvas

`ParticleField` SHALL montar un `<canvas>` que llene el contenedor y ejecutar un RAF loop que actualiza posiciones de partículas y las dibuja en cada frame. Las partículas SHALL moverse de forma autónoma con velocidad inicial aleatoria dentro de rangos configurables, y SHALL rebotar en los bordes del canvas.

#### Scenario: Partículas se mueven al montar

- **WHEN** el componente se monta y `respectReducedMotion` no inhibe la animación
- **THEN** las partículas SHALL comenzar a moverse desde posiciones aleatorias con velocidades aleatorias dentro del rango configurado

#### Scenario: Partículas rebotan en los bordes

- **WHEN** una partícula alcanza el borde del canvas
- **THEN** su velocidad SHALL invertirse en el eje correspondiente, manteniéndola dentro del área visible

### Requirement: Las partículas reaccionan al cursor con repulsión o atracción configurable

`ParticleField` SHALL aceptar la prop `cursorInteraction` (`'repel' | 'attract' | 'none'`, default `'repel'`). Con interacción activa, las partículas dentro del radio de influencia del cursor SHALL recibir una fuerza proporcional a la distancia cursor-partícula. La fuerza SHALL calcularse por cursor-a-partícula (O(N)), no entre pares de partículas.

#### Scenario: Repulsión al acercar el cursor

- **WHEN** `cursorInteraction` es `'repel'` y el cursor se acerca a partículas dentro del radio de influencia
- **THEN** las partículas SHALL alejarse del cursor con velocidad proporcional a la proximidad

#### Scenario: Sin interacción en touch

- **WHEN** el dispositivo no dispone de cursor (touch-only)
- **THEN** las partículas SHALL ignorar eventos de puntero y animarse de forma autónoma

### Requirement: ParticleField es customizable via props y CSS custom properties

`ParticleField` SHALL aceptar `count` (número de partículas), `speed` (factor de velocidad), `radius` (tamaño de cada partícula en px), `color` (color de las partículas) y `cursorRadius` (radio de influencia del cursor en px), materializando los parámetros estéticos como `--aui-particle-color`, `--aui-particle-radius` en el root, pisables desde CSS en cascada.

#### Scenario: Customización del color via CSS

- **WHEN** el consumer define `.mi-campo { --aui-particle-color: #22d3ee; }`
- **THEN** las partículas SHALL dibujarse con ese color

#### Scenario: Reducir el número de partículas

- **WHEN** el consumer pasa `count={30}`
- **THEN** el canvas SHALL mostrar exactamente 30 partículas

### Requirement: ParticleField respeta prefers-reduced-motion deteniendo la animación

`ParticleField` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, el RAF loop SHALL detenerse y el canvas SHALL mostrar las partículas en su estado inicial estático, sin movimiento autónomo, **independientemente del modo `drift` y de si `links` está activo**. Si `links` está activo, las líneas de conexión del estado estático SHALL dibujarse una vez (cuadro estático coherente) sin recalcularse por frame.

#### Scenario: Animación detenida con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y `respectReducedMotion` es `true`
- **THEN** las partículas NO SHALL moverse y el canvas SHALL mostrar un estado estático visualmente coherente

#### Scenario: Líneas en estado estático

- **WHEN** `links` está activo y `prefers-reduced-motion: reduce` está vigente
- **THEN** las líneas de conexión SHALL dibujarse una vez sobre el estado inicial, sin loop por frame

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** el RAF loop SHALL correr normalmente aunque la preferencia esté activa

### Requirement: ParticleField es SSR-safe y extensible

`ParticleField` SHALL incluir `'use client'` y NO SHALL acceder a `window`, `document` ni al contexto canvas durante el render. El canvas SHALL inicializarse en `useEffect`. `ParticleField` SHALL aceptar `className`, `style` y el spread de props HTML válidas de su elemento root `<div>`.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, sin acceder al DOM ni al canvas

#### Scenario: Dimensionamiento responsive

- **WHEN** el contenedor cambia de tamaño
- **THEN** el canvas SHALL redimensionarse y las posiciones de partículas SHALL reescalarse proporcionalmente

### Requirement: ParticleField puede dibujar líneas de conexión entre partículas cercanas

`ParticleField` SHALL aceptar la prop `links` (`boolean`, default `false`). Cuando es `true`, SHALL dibujar un segmento entre cada par de partículas cuya distancia sea menor a `linkDistance`, con opacidad proporcional a la cercanía (más cerca = más opaco, desvaneciéndose a 0 en `linkDistance`). El cálculo de pares SHALL ser opt-in: con `links` en `false` (default) NO SHALL ejecutarse ningún cálculo O(N²) y el costo SHALL permanecer O(N), preservando el comportamiento actual.

#### Scenario: Constelación activada

- **WHEN** el consumer pasa `links={true}`
- **THEN** las partículas a menos de `linkDistance` SHALL conectarse con líneas cuya opacidad decrece con la distancia

#### Scenario: Costo O(N) preservado por default

- **WHEN** el consumer no pasa `links` (o pasa `links={false}`)
- **THEN** NO SHALL calcularse distancias entre pares de partículas y el comportamiento SHALL ser idéntico al actual

### Requirement: Las líneas de conexión son customizables y pueden incluir el cursor

`ParticleField` SHALL aceptar `linkDistance` (px, distancia máxima para conectar), `linkColor` (color de las líneas, default derivado del color de partícula) y `linkWidth` (grosor en px). SHALL aceptar `linkCursor` (`boolean`, default `true` cuando `links` está activo): con cursor presente, las partículas dentro de `linkDistance` del cursor SHALL conectarse también a él. Los parámetros estéticos SHALL materializarse como `--aui-particle-link-color`, `--aui-particle-link-width` y `--aui-particle-link-distance` en el root, pisables desde CSS.

#### Scenario: Líneas hacia el cursor

- **WHEN** `links` y `linkCursor` están activos y el cursor está sobre el campo
- **THEN** las partículas cercanas al cursor SHALL conectarse a él con líneas

#### Scenario: Override del color de las líneas via CSS

- **WHEN** el consumer define `.mi-campo { --aui-particle-link-color: rgba(34,211,238,0.4); }`
- **THEN** las líneas SHALL dibujarse con ese color

#### Scenario: Distancia de conexión configurable

- **WHEN** el consumer pasa `linkDistance={80}`
- **THEN** solo las partículas a menos de 80 px SHALL conectarse

### Requirement: ParticleField soporta modos de deriva del movimiento

`ParticleField` SHALL aceptar la prop `drift` (`'bounce' | 'snow' | 'embers' | 'bubbles' | 'warp'`, default `'bounce'`). `bounce` SHALL reproducir el comportamiento actual (velocidad aleatoria, rebote en bordes). `snow` SHALL hacer caer las partículas hacia abajo con deriva horizontal suave. `embers` SHALL hacerlas ascender desvaneciéndose. `bubbles` SHALL hacerlas ascender con un leve bamboleo lateral. `warp` SHALL hacer nacer las partículas a lo ancho del borde superior y caer acelerando en perspectiva, abriéndose hacia los costados a medida que descienden (campo de estrellas). Los modos con dirección dominante (`snow`, `embers`, `bubbles`) SHALL reingresar las partículas por el borde opuesto (wrap) al salir, en lugar de rebotar; `warp` SHALL reingresarlas por el borde superior, distribuidas a lo ancho.

#### Scenario: Default reproduce el comportamiento actual

- **WHEN** el consumer no pasa `drift`
- **THEN** las partículas SHALL moverse con velocidad aleatoria y rebotar en los bordes, idéntico al comportamiento previo

#### Scenario: Modo nieve

- **WHEN** el consumer pasa `drift="snow"`
- **THEN** las partículas SHALL caer hacia abajo con deriva horizontal y reingresar por arriba al salir por abajo

#### Scenario: Modo brasas

- **WHEN** el consumer pasa `drift="embers"`
- **THEN** las partículas SHALL ascender y desvanecerse, reingresando desde abajo

#### Scenario: Wrap en lugar de rebote en modos direccionales

- **WHEN** una partícula en modo `snow`/`embers`/`bubbles` sale por un borde
- **THEN** SHALL reaparecer por el borde opuesto en lugar de invertir su velocidad

#### Scenario: Campo de estrellas (warp)

- **WHEN** el consumer pasa `drift="warp"`
- **THEN** las partículas SHALL nacer a lo ancho del borde superior, caer acelerando en perspectiva y abrirse hacia los costados; al salir SHALL reingresar por arriba distribuidas a lo ancho

### Requirement: Los modos de deriva e interacción con cursor coexisten

La interacción con el cursor (`cursorInteraction`) SHALL seguir funcionando en todos los modos de `drift`: la fuerza del cursor se aplica sobre la velocidad además de la deriva del modo. En dispositivos touch (sin cursor) las partículas SHALL animarse según el `drift` configurado, ignorando el puntero.

#### Scenario: Repulsión sobre nieve

- **WHEN** `drift="snow"`, `cursorInteraction="repel"` y el cursor se acerca a partículas
- **THEN** las partículas SHALL alejarse del cursor mientras siguen, en conjunto, su caída

#### Scenario: Deriva autónoma en touch

- **WHEN** el dispositivo es touch-only y `drift="bubbles"`
- **THEN** las partículas SHALL ascender con bamboleo ignorando eventos de puntero
