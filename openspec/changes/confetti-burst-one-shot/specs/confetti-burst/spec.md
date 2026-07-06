## ADDED Requirements

### Requirement: ConfettiBurst expone un handle imperativo para disparar ráfagas

`ConfettiBurst` SHALL renderizar un overlay pasivo (canvas `absolute, inset: 0`, `pointer-events: none`) que no anima al montar, y SHALL exponer via ref (`useImperativeHandle`) un handle tipado (`ConfettiBurstHandle`) con el método `fire(options?)`. Cada invocación de `fire` SHALL disparar una ráfaga de confetti; las opciones del disparo SHALL overridear las props del componente para esa ráfaga. Disparos sucesivos o concurrentes SHALL acumular partículas sobre el mismo canvas y RAF. `fire()` antes de la hidratación SHALL ser un no-op seguro.

#### Scenario: Disparo imperativo

- **WHEN** el consumer invoca `ref.current.fire()` (e.g. tras un submit exitoso)
- **THEN** una ráfaga de confetti SHALL animarse desde el origen configurado

#### Scenario: Opciones por disparo

- **WHEN** el consumer invoca `fire({ count: 200, origin: { x: 0.5, y: 1 } })`
- **THEN** esa ráfaga SHALL usar esos valores, sin alterar los defaults de las props para disparos futuros

#### Scenario: Disparos acumulativos

- **WHEN** el consumer dispara dos ráfagas en rápida sucesión
- **THEN** ambas SHALL animarse simultáneamente compartiendo el mismo RAF

### Requirement: ConfettiBurst anima con física simple y costo cero en reposo

Las partículas SHALL moverse con física simple en un módulo puro testeable (velocidad inicial en abanico según `angle`/`spread`/`power`, gravedad, drag y rotación por copo). El RAF SHALL arrancar con el primer `fire()` y SHALL detenerse automáticamente cuando no queden partículas vivas; en reposo el componente NO SHALL ejecutar trabajo por frame. El estado SHALL vivir en refs, sin re-renders de React por frame.

#### Scenario: RAF se detiene solo

- **WHEN** todas las partículas de una ráfaga terminaron (salieron del área o se desvanecieron)
- **THEN** el loop de animación SHALL detenerse hasta el próximo `fire()`

#### Scenario: Física verificable

- **WHEN** se ejecutan los tests del módulo de física
- **THEN** SHALL verificarse el abanico de spawn, la caída por gravedad y el culling, sin DOM

### Requirement: ConfettiBurst es customizable via props y opciones

`ConfettiBurst` SHALL exponer como props (defaults de cada disparo): `count`, `colors`, `shapes` (`rect`/`circle`), `origin` (posición relativa 0–1 dentro del contenedor), `angle`, `spread`, `power` y `gravity`. Los colores default SHALL materializarse además como CSS custom properties con namespace `--aui-confetti-*`, pisables desde CSS en cascada. La aleatoriedad de cada ráfaga SHALL derivarse del PRNG seedable del paquete (sin `Math.random()` directo), variando entre disparos.

#### Scenario: Paleta custom

- **WHEN** el consumer pasa `colors={['#f43f5e', '#fbbf24', '#34d399']}`
- **THEN** los copos SHALL sortearse entre esos colores

#### Scenario: Abanico configurable

- **WHEN** el consumer pasa `angle={90}` y `spread={45}`
- **THEN** la ráfaga SHALL salir hacia arriba en un cono de 45 grados

### Requirement: ConfettiBurst respeta prefers-reduced-motion

`ConfettiBurst` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, `fire()` SHALL ser un no-op (el confetti es celebración autónoma sin versión estática útil); el README SHALL documentar que el feedback alternativo corre por cuenta del consumer.

#### Scenario: No-op con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y el consumer invoca `fire()`
- **THEN** NO SHALL animarse confetti

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** `fire()` SHALL animar la ráfaga aunque la preferencia esté activa

### Requirement: ConfettiBurst es SSR-safe y no interfiere con la interacción

`ConfettiBurst` SHALL incluir `'use client'` y NO SHALL acceder a `window` ni `document` durante el render. El overlay SHALL tener `pointer-events: none` (los clicks pasan al contenido) y recortarse al contenedor del componente. SHALL aceptar `className`, `style` y el spread de props HTML válidas de su root, y desmontar limpiamente con el RAF detenido (sin fugas bajo StrictMode).

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, sin acceder al DOM

#### Scenario: Contenido interactivo bajo el overlay

- **WHEN** hay una ráfaga animándose sobre elementos interactivos
- **THEN** los clicks SHALL pasar a través del overlay
