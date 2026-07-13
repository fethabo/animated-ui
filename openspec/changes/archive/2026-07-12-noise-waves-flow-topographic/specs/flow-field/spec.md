## ADDED Requirements

### Requirement: FlowField mueve partículas siguiendo un campo vectorial de ruido

`FlowField` SHALL renderizar sobre `<canvas>` partículas que avanzan siguiendo un campo vectorial derivado de ruido coherente (el ángulo de avance de cada partícula se obtiene del valor del ruido en su posición), dejando trazos orgánicos. La persistencia de los trazos SHALL lograrse pintando por frame un velo semitransparente del color de fondo (fade), sin almacenar historial de posiciones. La simulación SHALL vivir en un módulo puro testeable, con estado en refs y sin re-renders de React por frame, a razón de una muestra de ruido por partícula por frame.

#### Scenario: Trazos orgánicos

- **WHEN** el componente está montado
- **THEN** las partículas SHALL dibujar trayectorias curvas continuas que siguen el campo, desvaneciéndose gradualmente

#### Scenario: Partículas que salen del área

- **WHEN** una partícula sale de los límites del canvas
- **THEN** SHALL reposicionarse de forma determinista (wrap o respawn seedeado) sin discontinuidad visual abrupta

### Requirement: FlowField es determinista por seed

`FlowField` SHALL aceptar `seed`; el campo de ruido, las posiciones iniciales y los respawns SHALL derivarse del PRNG/ruido seedeado del paquete, sin `Math.random()`/`Date.now()` en la generación. La misma seed y dimensiones SHALL producir la misma evolución.

#### Scenario: Misma seed, misma simulación

- **WHEN** el componente se monta dos veces con la misma `seed` y dimensiones
- **THEN** las trayectorias SHALL ser idénticas frame a frame

### Requirement: FlowField es customizable via props y CSS custom properties

`FlowField` SHALL exponer props para `count` (cantidad de partículas), `speed`, `colors` (paleta de los trazos), `fade` (persistencia del trazo: cuánto tarda en desvanecerse), `scale` (zoom del campo de ruido), `background` (color de fondo que el componente pinta, necesario para el fade) y `seed`. Los colores SHALL materializarse además como CSS custom properties con namespace `--aui-flow-*`, pisables desde CSS en cascada.

#### Scenario: Persistencia configurable

- **WHEN** el consumer pasa `fade` alto
- **THEN** los trazos SHALL permanecer visibles más tiempo antes de desvanecerse

#### Scenario: Escala del campo

- **WHEN** el consumer aumenta `scale`
- **THEN** las curvas del campo SHALL volverse más amplias/suaves

### Requirement: FlowField respeta prefers-reduced-motion

`FlowField` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, el componente SHALL renderizar una composición estática determinista: trazos pre-simulados con un presupuesto fijo de pasos en el montaje, sin RAF corriendo.

#### Scenario: Trazos estáticos con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce`
- **THEN** SHALL verse una composición de trazos estática, sin animación en curso

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** la simulación SHALL animarse aunque la preferencia esté activa

### Requirement: FlowField es SSR-safe, responsivo y extensible

`FlowField` SHALL incluir `'use client'` y NO SHALL acceder a `window` ni `document` durante el render. SHALL adaptarse al tamaño del contenedor via observer (incluyendo `devicePixelRatio`) y aceptar `className`, `style` y el spread de props HTML válidas de su root. El componente SHALL posicionarse `absolute, inset: 0` para cubrir su contenedor y pintar su propio fondo (`background`).

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, sin acceder al DOM

#### Scenario: Resize del contenedor

- **WHEN** el contenedor cambia de tamaño
- **THEN** el canvas SHALL redimensionarse y la simulación SHALL reiniciarse de forma determinista
