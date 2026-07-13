## ADDED Requirements

### Requirement: ClickSpark emite chispas automáticas en cada click

`ClickSpark` SHALL envolver sus `children` y emitir una ráfaga breve de chispas en el punto de cada `pointerdown` dentro del contenedor, **sin handle imperativo ni ref**: el efecto es declarativo. Las chispas SHALL dibujarse en un canvas overlay `pointer-events: none` recortado al contenedor, con RAF que arranca en el primer click y se auto-detiene al vaciarse el pool. Clicks rápidos consecutivos SHALL generar ráfagas concurrentes sobre el mismo canvas.

#### Scenario: Click emite chispas

- **WHEN** el usuario hace `pointerdown` en cualquier punto del contenedor
- **THEN** una ráfaga de chispas SHALL emitirse desde ese punto y desvanecerse, y el RAF SHALL detenerse al terminar

#### Scenario: Children siguen interactivos

- **WHEN** el contenedor envuelve un botón y el usuario lo clickea
- **THEN** el click SHALL llegar al botón normalmente (el overlay NO SHALL interceptar eventos)

#### Scenario: Clicks concurrentes

- **WHEN** el usuario clickea varias veces en menos de un segundo
- **THEN** todas las ráfagas SHALL animarse simultáneamente compartiendo canvas y RAF

### Requirement: ClickSpark es customizable por props

`ClickSpark` SHALL aceptar `color`/`colors`, `count` (chispas por click), `size`, `radius` (alcance de la ráfaga) y `duration`. La aleatoriedad de cada ráfaga SHALL provenir de `createPrng` seedeado por contador interno.

#### Scenario: Customización básica

- **WHEN** el consumer pasa `colors={['#fbbf24']}` y `count={12}`
- **THEN** cada click SHALL emitir 12 chispas doradas

### Requirement: ClickSpark respeta prefers-reduced-motion

`ClickSpark` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, los clicks NO SHALL emitir chispas (movimiento decorativo no esencial) y la interactividad de los `children` SHALL permanecer intacta.

#### Scenario: Reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y el usuario clickea
- **THEN** NO SHALL emitirse chispas y el click SHALL seguir llegando al contenido

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}` y la preferencia está activa
- **THEN** las chispas SHALL emitirse normalmente

### Requirement: ClickSpark es SSR-safe y extensible

`ClickSpark` SHALL incluir `'use client'`, NO SHALL acceder a `window` ni `document` durante el render, y SHALL aceptar `className`, `style` y el spread de props HTML válidas de su elemento root.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, sin acceder al DOM
