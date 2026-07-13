## ADDED Requirements

### Requirement: EmojiBurst dispara ráfagas de emojis imperativamente

`EmojiBurst` SHALL montar un overlay pasivo (`pointer-events: none`, sin RAF en reposo) y exponer via ref un handle tipado `EmojiBurstHandle` con `fire(options?)`. Cada disparo SHALL emitir un abanico de emojis renderizados con `fillText` sobre canvas (sin assets), con física de confetti: velocidad inicial por abanico (`angle`/`spread`/`power`), gravedad, drag, rotación 2D y fade. El RAF SHALL auto-detenerse con el pool vacío.

#### Scenario: Disparo básico

- **WHEN** el consumer invoca `ref.current.fire()`
- **THEN** los emojis SHALL salir en abanico, caer con gravedad rotando y desvanecerse, y el RAF SHALL detenerse al morir el último

#### Scenario: Emojis nativos de plataforma

- **WHEN** los emojis se renderizan
- **THEN** SHALL usarse `fillText` con la fuente de emojis de la plataforma, sin cargar imágenes ni fuentes externas

### Requirement: EmojiBurst es customizable por props y por disparo

Las props (`emojis` — lista de la que cada partícula toma uno, `count`, `size`, `angle`, `spread`, `power`, `origin`) SHALL actuar como defaults; las options de `fire()` SHALL overridearlas solo para ese disparo. La selección de emoji por partícula y la variación de trayectorias SHALL provenir de `createPrng` seedeado por contador interno.

#### Scenario: Lista de emojis por disparo

- **WHEN** se invoca `fire({ emojis: ['❤️'] })` sobre un componente con `emojis={['🎉', '👍']}`
- **THEN** ese disparo SHALL emitir solo ❤️ y los siguientes sin options SHALL volver a la lista default

### Requirement: EmojiBurst degrada a no-op de forma segura

Invocar `fire()` antes de la hidratación, sin canvas o bajo `prefers-reduced-motion` (con `respectReducedMotion` default `true`) SHALL ser un no-op silencioso.

#### Scenario: Reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y se invoca `fire()`
- **THEN** NO SHALL animarse nada ni lanzarse errores

### Requirement: EmojiBurst es SSR-safe y extensible

`EmojiBurst` SHALL incluir `'use client'`, NO SHALL acceder a `window` ni `document` durante el render, y SHALL aceptar `className`, `style` y el spread de props HTML válidas de su elemento root.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, sin acceder al DOM
