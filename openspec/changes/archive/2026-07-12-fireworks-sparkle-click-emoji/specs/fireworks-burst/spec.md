## ADDED Requirements

### Requirement: FireworksBurst dispara fuegos artificiales imperativamente

`FireworksBurst` SHALL montar un overlay pasivo (`pointer-events: none`, sin RAF en reposo) y exponer via ref un handle tipado `FireworksBurstHandle` con un método `fire(options?)`. Cada disparo SHALL lanzar uno o más cohetes que ascienden desde la base del contenedor y explotan en partículas radiales con gravedad, drag y fade. El RAF SHALL arrancar con el primer disparo y auto-detenerse cuando no queden partículas vivas; disparos concurrentes SHALL compartir RAF y canvas.

#### Scenario: Disparo básico

- **WHEN** el consumer invoca `ref.current.fire()`
- **THEN** un cohete SHALL ascender y explotar en partículas radiales que caen con gravedad y se desvanecen, y el RAF SHALL detenerse al morir la última partícula

#### Scenario: Costo cero en reposo

- **WHEN** el componente está montado y no hay disparos activos
- **THEN** NO SHALL haber ningún RAF corriendo

#### Scenario: Disparos concurrentes

- **WHEN** se invoca `fire()` mientras un disparo anterior sigue vivo
- **THEN** ambos disparos SHALL animarse simultáneamente sobre el mismo canvas y RAF

### Requirement: FireworksBurst es customizable por props y por disparo

Las props del componente SHALL actuar como defaults de cada disparo (`colors`, `particleCount`, `rockets`, `power`, `origin`), y el objeto `options` de `fire()` SHALL overridear esos defaults solo para ese disparo.

#### Scenario: Props como defaults

- **WHEN** el componente se monta con `colors={['#f00', '#0f0']}` y se invoca `fire()`
- **THEN** las partículas SHALL usar esos colores

#### Scenario: Options por disparo

- **WHEN** se invoca `fire({ rockets: 3 })` sobre un componente con `rockets={1}`
- **THEN** ese disparo SHALL lanzar 3 cohetes y los disparos siguientes sin options SHALL volver a 1

### Requirement: FireworksBurst usa aleatoriedad seedable por disparo

La aleatoriedad de cada disparo (trayectoria, velocidades radiales, variación de color) SHALL provenir de `createPrng` seedeado con un contador interno, sin `Math.random()`.

#### Scenario: Sin Math.random

- **WHEN** se ejecuta un disparo
- **THEN** toda la aleatoriedad SHALL derivar del PRNG seedable del paquete

### Requirement: FireworksBurst degrada a no-op de forma segura

Invocar `fire()` antes de la hidratación, sin canvas disponible o bajo `prefers-reduced-motion` (con `respectReducedMotion` default `true`) SHALL ser un no-op silencioso, sin errores.

#### Scenario: Reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y se invoca `fire()`
- **THEN** NO SHALL animarse nada ni lanzarse errores

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}` y la preferencia está activa
- **THEN** el disparo SHALL animarse normalmente

### Requirement: FireworksBurst es SSR-safe y extensible

`FireworksBurst` SHALL incluir `'use client'`, NO SHALL acceder a `window` ni `document` durante el render, y SHALL aceptar `className`, `style` y el spread de props HTML válidas de su elemento root. El overlay SHALL recortarse a su contenedor (sin portales ni funciones globales).

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, sin acceder al DOM
