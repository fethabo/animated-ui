# animated-list Specification

## Purpose
Componente `AnimatedList`: envuelve hijos keyed y anima **reordenamientos** (FLIP), **entradas** (preset configurable con `stagger` opcional) y **salidas** (clon visual estático que se remueve al terminar) cuando la lista cambia entre renders — filtros, sorting, todo-lists. La identidad de cada hijo es su `key` de React, sin API paralela. Respeta `prefers-reduced-motion`, es SSR-safe y no provoca re-renders por animación.

## Requirements

### Requirement: AnimatedList anima reordenamientos con FLIP

`AnimatedList` SHALL envolver hijos keyed y, cuando el orden de las keys cambia entre renders, animar cada hijo persistente desde su posición anterior a la nueva mediante el motor FLIP (WAAPI, sin re-renders por frame). La identidad SHALL derivar de la `key` de React de cada hijo, sin API paralela de identificación.

#### Scenario: Reordenamiento animado

- **WHEN** el consumer re-renderiza la lista con las mismas keys en otro orden
- **THEN** cada item SHALL deslizarse desde su posición anterior hacia la nueva

#### Scenario: Interrupción suave

- **WHEN** un segundo reorden llega antes de terminar la animación del primero
- **THEN** los items SHALL redirigirse desde su posición visual actual, sin saltos

### Requirement: AnimatedList anima entradas y salidas

Las keys nuevas SHALL animar su entrada (preset configurable: fade / scale-in / slide, con `stagger` opcional). Las keys ausentes SHALL animar su salida mediante un clon visual estático posicionado en el último rect del item, que anima (fade/scale) y se remueve del DOM al terminar — el hijo real desaparece del render normalmente; el clon SHALL ser inerte y `aria-hidden`.

#### Scenario: Entrada animada

- **WHEN** el render nuevo incluye una key que no existía
- **THEN** ese item SHALL entrar con el preset configurado mientras los persistentes hacen FLIP a sus nuevas posiciones

#### Scenario: Salida animada y limpia

- **WHEN** el render nuevo omite una key existente
- **THEN** un clon visual SHALL animar la salida en la posición del item y removerse del DOM al terminar, sin nodos residuales

### Requirement: AnimatedList es customizable

`AnimatedList` SHALL aceptar `duration` y `easing` (ambos también overridables via CSS var: `--aui-animated-list-duration`, `--aui-animated-list-easing`), presets de entrada/salida (`enter`, `exit`), `stagger` (solo entradas), `as` (elemento root, default `div`) e `itemClassName`/`itemStyle` para el wrapper medible de cada hijo, además de `className` y `style` en el root — el root puede ser el propio grid/flex del consumer.

#### Scenario: Lista como grid

- **WHEN** el consumer pasa `className` con estilos de grid al root
- **THEN** los wrappers de items SHALL actuar como celdas y el FLIP SHALL animar los movimientos dentro del grid

### Requirement: AnimatedList respeta prefers-reduced-motion

`AnimatedList` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, los cambios SHALL aplicarse instantáneamente: sin FLIP, sin animaciones de entrada/salida ni clones.

#### Scenario: Cambios instantáneos

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y la lista se reordena
- **THEN** los items SHALL aparecer en sus nuevas posiciones de inmediato, sin animación

### Requirement: AnimatedList es SSR-safe y extensible

`AnimatedList` SHALL incluir `'use client'`, NO SHALL acceder a `window` ni `document` durante el render, y SHALL aceptar el spread de props HTML válidas de su elemento root. El primer render (SSR e hidratación) SHALL mostrar los hijos en su estado final, sin animar.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores con todos los hijos presentes en el markup
