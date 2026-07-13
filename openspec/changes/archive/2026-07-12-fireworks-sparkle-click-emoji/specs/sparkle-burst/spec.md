## ADDED Requirements

### Requirement: SparkleBurst dispara destellos imperativamente

`SparkleBurst` SHALL montar un overlay pasivo (`pointer-events: none`, sin RAF en reposo) y exponer via ref un handle tipado `SparkleBurstHandle` con `fire(options?)`. Cada disparo SHALL emitir estrellas de 4 puntas de vida corta alrededor de un punto de origen, con envolvente de escala (crecen rápido y se encogen), rotación individual y fade. Las estrellas SHALL dibujarse por path en canvas (no glifos de fuente). El RAF SHALL auto-detenerse con el pool vacío.

#### Scenario: Disparo básico

- **WHEN** el consumer invoca `ref.current.fire()`
- **THEN** un puñado de destellos SHALL aparecer alrededor del punto de origen, pulsar y desvanecerse, y el RAF SHALL detenerse al terminar

#### Scenario: Punto de origen por disparo

- **WHEN** se invoca `fire({ origin: { x: 0.8, y: 0.2 } })`
- **THEN** los destellos de ese disparo SHALL emitirse alrededor de ese punto (coordenadas relativas al contenedor)

### Requirement: SparkleBurst es customizable por props y por disparo

Las props (`colors`, `count`, `size`, `spread`, `duration`, `origin`) SHALL actuar como defaults; las options de `fire()` SHALL overridearlas solo para ese disparo. La aleatoriedad SHALL provenir de `createPrng` seedeado por contador interno.

#### Scenario: Override por disparo

- **WHEN** se invoca `fire({ count: 3 })` sobre un componente con `count={8}`
- **THEN** ese disparo SHALL emitir 3 destellos y los siguientes sin options SHALL volver a 8

### Requirement: SparkleBurst degrada a no-op de forma segura

Invocar `fire()` antes de la hidratación, sin canvas o bajo `prefers-reduced-motion` (con `respectReducedMotion` default `true`) SHALL ser un no-op silencioso.

#### Scenario: Reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y se invoca `fire()`
- **THEN** NO SHALL animarse nada ni lanzarse errores

### Requirement: SparkleBurst es SSR-safe y extensible

`SparkleBurst` SHALL incluir `'use client'`, NO SHALL acceder a `window` ni `document` durante el render, y SHALL aceptar `className`, `style` y el spread de props HTML válidas de su elemento root.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, sin acceder al DOM
