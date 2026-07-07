# waves-background Specification

## Purpose
Componente `WavesBackground`: renderiza sobre `<canvas>` líneas horizontales fluidas cuya forma ondula con ruido coherente, produciendo una deriva orgánica y continua. Es determinista por `seed`, customizable via props y CSS custom properties (`--aui-waves-*`), respeta `prefers-reduced-motion` con un frame estático, y es SSR-safe, responsive y extensible.

## Requirements

### Requirement: WavesBackground dibuja líneas fluidas ondulantes generadas con ruido coherente

`WavesBackground` SHALL renderizar sobre `<canvas>` un conjunto de líneas horizontales cuya forma se curva con ruido coherente (simplex) evaluado sobre la coordenada horizontal y el tiempo, produciendo una ondulación orgánica y continua (sin saltos ni patrones repetitivos evidentes). La animación SHALL correr en un RAF con estado en refs, sin re-renders de React por frame, y el muestreo del ruido SHALL hacerse por puntos espaciados sobre cada línea (no por pixel). El componente SHALL posicionarse `absolute, inset: 0` para cubrir su contenedor.

#### Scenario: Ondulación orgánica continua

- **WHEN** el componente está montado
- **THEN** las líneas SHALL ondular de forma suave y continua, sin discontinuidades ni repetición periódica visible

#### Scenario: Sin re-renders por frame

- **WHEN** la animación está corriendo
- **THEN** el componente NO SHALL disparar renders de React por frame

### Requirement: WavesBackground es determinista por seed

`WavesBackground` SHALL aceptar una prop `seed`; toda la generación (campo de ruido, fases por línea) SHALL derivarse del PRNG/ruido seedeado del paquete. La misma seed con las mismas dimensiones SHALL producir el mismo campo, estable entre repaints y sin `Math.random()`/`Date.now()` en la generación.

#### Scenario: Misma seed, mismo campo

- **WHEN** el componente se monta dos veces con la misma `seed` y dimensiones
- **THEN** la forma de las ondas en un instante dado SHALL ser idéntica

### Requirement: WavesBackground es customizable via props y CSS custom properties

`WavesBackground` SHALL exponer props para `lines` (cantidad), `amplitude`, `speed` (deriva temporal), `colors` (paleta de las líneas, con degradado entre líneas si hay más de un color), `lineWidth` y `seed`. Los parámetros estéticos SHALL materializarse como CSS custom properties con namespace `--aui-waves-*` donde aplique (colores, opacidad), pisables desde CSS en cascada.

#### Scenario: Densidad configurable

- **WHEN** el consumer pasa `lines={40}`
- **THEN** SHALL dibujarse 40 líneas distribuidas verticalmente

#### Scenario: Paleta con degradado

- **WHEN** el consumer pasa `colors={['#22d3ee', '#a78bfa']}`
- **THEN** las líneas SHALL interpolar su color entre ambos extremos de la paleta

### Requirement: WavesBackground respeta prefers-reduced-motion

`WavesBackground` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, el componente SHALL renderizar una composición estática determinista (un frame del campo con tiempo fijo), sin RAF corriendo.

#### Scenario: Frame estático con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce`
- **THEN** las líneas SHALL dibujarse una vez, curvadas pero inmóviles, sin loop de animación

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** la ondulación SHALL animarse aunque la preferencia esté activa

### Requirement: WavesBackground es SSR-safe, responsivo y extensible

`WavesBackground` SHALL incluir `'use client'` y NO SHALL acceder a `window` ni `document` durante el render (canvas y mediciones en efectos). SHALL adaptarse al tamaño de su contenedor via observer (incluyendo `devicePixelRatio`). SHALL aceptar `className`, `style` y el spread de props HTML válidas de su root.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, sin acceder al DOM

#### Scenario: Resize del contenedor

- **WHEN** el contenedor cambia de tamaño
- **THEN** el canvas SHALL redimensionarse y las ondas SHALL regenerarse de forma determinista
