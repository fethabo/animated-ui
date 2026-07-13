## ADDED Requirements

### Requirement: CursorTrail dibuja una estela que sigue al puntero

`CursorTrail` SHALL montar un canvas overlay (`pointer-events: none`, recortado a su contenedor) y dibujar una estela que sigue al puntero mientras se mueve dentro del contenedor, en dos modos: `particles` (partículas con vida, fade y deriva) y `line` (línea fluida de los últimos puntos con grosor/alpha decreciente). La emisión SHALL throttlearse por distancia recorrida (umbral configurable), y la física/geometría SHALL vivir en módulos puros testeables. Los `children` SHALL permanecer interactivos.

#### Scenario: Estela en modo particles

- **WHEN** el puntero se mueve dentro del contenedor con `mode="particles"`
- **THEN** partículas SHALL emitirse a lo largo del recorrido, desvanecerse al agotar su vida, y el canvas SHALL quedar limpio al detenerse el mouse

#### Scenario: Emisión throttleada

- **WHEN** el puntero se mueve una distancia menor al umbral de emisión
- **THEN** NO SHALL emitirse partículas nuevas

#### Scenario: Children interactivos

- **WHEN** el contenedor envuelve un link y el usuario lo clickea
- **THEN** el click SHALL llegar al link (el overlay NO SHALL interceptar eventos)

### Requirement: CursorTrail es customizable

`CursorTrail` SHALL aceptar `mode` (`'particles' | 'line'`, default `'particles'`), `color`/`colors`, `size`, `length`/`life` (persistencia de la estela) y `emitEvery` (umbral de emisión en px), además de `className` y `style`.

#### Scenario: Modo línea con color custom

- **WHEN** el consumer pasa `mode="line"` y `color="#22d3ee"`
- **THEN** la estela SHALL renderizarse como línea fluida cyan con alpha decreciente hacia la cola

### Requirement: CursorTrail respeta prefers-reduced-motion

`CursorTrail` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, el efecto SHALL desactivarse por completo (sin canvas activo ni RAF): la estela es decoración de movimiento, no feedback funcional.

#### Scenario: Reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y el puntero se mueve
- **THEN** NO SHALL dibujarse estela alguna ni correr ningún RAF

### Requirement: CursorTrail es SSR-safe y extensible

`CursorTrail` SHALL incluir `'use client'`, NO SHALL acceder a `window` ni `document` durante el render, y SHALL aceptar el spread de props HTML válidas de su elemento root.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, sin acceder al DOM
