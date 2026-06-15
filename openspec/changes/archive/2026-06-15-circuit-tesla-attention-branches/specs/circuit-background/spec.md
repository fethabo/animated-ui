## ADDED Requirements

### Requirement: CircuitBackground genera pistas estilo PCB de forma procedural y determinista

`CircuitBackground` SHALL renderizar sobre `<canvas>` una red de pistas (trazos ortogonales, con segmentos a 90° y opcionalmente 45°) que evocan un circuito impreso, generadas proceduralmente sobre una grilla, con nodos/pads en uniones y terminaciones. La generación SHALL ser **determinista a partir de una semilla**: la misma `seed`, tamaño y densidad SHALL producir exactamente el mismo trazado. La generación NO SHALL usar `Math.random()` ni `Date.now()`; SHALL usar el PRNG seedable del paquete.

#### Scenario: Trazado reproducible con la misma seed

- **WHEN** se montan dos `CircuitBackground` con la misma `seed`, tamaño y `density`
- **THEN** ambos SHALL dibujar exactamente el mismo trazado de pistas

#### Scenario: Trazados distintos con seeds distintas

- **WHEN** dos instancias reciben seeds diferentes
- **THEN** SHALL mostrar trazados de pistas diferentes pero ambos con apariencia de circuito coherente

#### Scenario: Pistas con apariencia de PCB

- **WHEN** se monta `CircuitBackground` con la densidad default
- **THEN** las pistas SHALL seguir caminos ortogonales con giros en ángulo (no curvas aleatorias) y pads en uniones/terminaciones, evocando un circuito impreso

### Requirement: Pulsos de luz recorren las pistas

`CircuitBackground` SHALL animar pulsos de luz que viajan a lo largo de las pistas: cada pulso SHALL tener una cabeza brillante (glow) y una estela que se desvanece detrás. Los pulsos SHALL recorrer los caminos de la red (siguiendo las uniones) y reaparecer periódicamente. La cantidad, velocidad y frecuencia de aparición de los pulsos SHALL ser configurables.

#### Scenario: Luz avanzando por una pista

- **WHEN** el componente está animando y `respectReducedMotion` no lo inhibe
- **THEN** SHALL verse uno o más puntos de luz desplazándose a lo largo de las pistas, con estela que se atenúa detrás de la cabeza

#### Scenario: Frecuencia y velocidad de pulsos configurables

- **WHEN** el consumer pasa `pulseSpeed` y `pulseCount` (o equivalentes)
- **THEN** los pulsos SHALL desplazarse a esa velocidad y existir en esa cantidad simultánea

### Requirement: CircuitBackground es customizable via props y CSS custom properties

`CircuitBackground` SHALL exponer props para `seed`, `density` (densidad de pistas/grilla), `trackColor` (color de las pistas), `pulseColor` (color de la luz), `pulseSpeed`, `pulseCount` y `lineWidth`. Los parámetros estéticos SHALL materializarse como CSS custom properties con namespace `--aui-circuit-*` en el root, pisables desde CSS en cascada.

#### Scenario: Override del color de pista via CSS

- **WHEN** el consumer define `.mi-circuito { --aui-circuit-track-color: #1e3a5f; }`
- **THEN** las pistas SHALL dibujarse con ese color

#### Scenario: Densidad configurable

- **WHEN** el consumer pasa una `density` mayor
- **THEN** el trazado SHALL contener más pistas por área

### Requirement: CircuitBackground respeta prefers-reduced-motion

`CircuitBackground` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, las pistas SHALL dibujarse de forma estática (el circuito completo) pero los pulsos de luz NO SHALL animarse (loop detenido); MAY mostrarse algunos pulsos en posición fija o ninguno, en un cuadro estático coherente.

#### Scenario: Pulsos detenidos con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y `respectReducedMotion` es `true`
- **THEN** el circuito SHALL mostrarse dibujado pero sin luz en movimiento

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** los pulsos SHALL animarse aunque la preferencia esté activa

### Requirement: CircuitBackground es SSR-safe, responsive y extensible

`CircuitBackground` SHALL incluir `'use client'` y NO SHALL acceder a `window`, `document` ni al contexto canvas durante el render. El canvas SHALL inicializarse en `useEffect` y llenar el contenedor (dimensionado por el consumer), regenerando o reescalando el trazado al cambiar de tamaño. El componente SHALL aceptar `className`, `style` y el spread de props HTML válidas de su elemento root `<div>`. Como la generación es determinista por `seed`, el trazado SHALL ser estable entre el render del servidor y la hidratación (sin saltos visuales por aleatoriedad divergente).

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, sin acceder al DOM ni al canvas

#### Scenario: Regeneración responsive

- **WHEN** el contenedor cambia de tamaño
- **THEN** el trazado SHALL adaptarse al nuevo tamaño de forma determinista para la `seed` vigente
