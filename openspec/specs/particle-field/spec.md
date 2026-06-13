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

`ParticleField` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, el RAF loop SHALL detenerse y el canvas SHALL mostrar las partículas en su estado inicial estático, sin movimiento autónomo.

#### Scenario: Animación detenida con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y `respectReducedMotion` es `true`
- **THEN** las partículas NO SHALL moverse y el canvas SHALL mostrar un estado estático visualmente coherente

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
