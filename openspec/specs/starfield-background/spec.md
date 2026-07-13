# starfield-background Specification

## Purpose
Componente `StarfieldBackground`: renderiza sobre `<canvas>` un cielo estrellado procedural y determinista por `seed` (campo en capa offscreen, titileo asíncrono compuesto por frame) con estrellas fugaces ocasionales configurables. Es customizable via props (`density`, `colors`, `background`, `speed`, `shootingStars`, `fixed`), respeta `prefers-reduced-motion` pintando el campo estático, y es SSR-safe, responsive y extensible.

## Requirements

### Requirement: StarfieldBackground renderiza un cielo estrellado vivo y seedable

`StarfieldBackground` SHALL renderizar sobre `<canvas>` un campo de estrellas generado proceduralmente con el PRNG seedable del paquete (`createPrng(seed)`): misma `seed` y mismo tamaño SHALL producir el mismo cielo. El campo (posiciones, radios, fases) SHALL pintarse en una capa offscreen al montar y al redimensionar; por frame solo SHALL componerse el titileo (variación de alpha por estrella, asíncrona entre estrellas) y las estrellas fugaces. El componente SHALL posicionarse `absolute, inset: 0` para cubrir su contenedor `position: relative`, o el viewport con `fixed`.

#### Scenario: Determinismo por seed

- **WHEN** dos instancias se montan con la misma `seed` y el mismo tamaño de contenedor
- **THEN** ambas SHALL mostrar el mismo campo de estrellas

#### Scenario: Titileo asíncrono

- **WHEN** el fondo está animando
- **THEN** las estrellas SHALL variar su brillo con fases independientes (no en sincronía)

#### Scenario: Regeneración en resize

- **WHEN** el contenedor cambia de tamaño
- **THEN** el campo SHALL regenerarse determinísticamente para el tamaño nuevo

### Requirement: StarfieldBackground emite estrellas fugaces ocasionales

El componente SHALL dibujar estrellas fugaces (trazo con gradiente que decae a lo largo de la trayectoria) a intervalos aleatorios controlados por una frecuencia media configurable (`shootingStars`, con valor `0` que las desactiva). Su spawn SHALL usar el PRNG del componente.

#### Scenario: Fugaz ocasional

- **WHEN** el fondo está animando con `shootingStars` mayor a 0
- **THEN** ocasionalmente una estrella fugaz SHALL cruzar el canvas y desvanecerse

#### Scenario: Fugaces desactivadas

- **WHEN** el consumer pasa `shootingStars={0}`
- **THEN** NO SHALL emitirse estrellas fugaces

### Requirement: StarfieldBackground es customizable

`StarfieldBackground` SHALL aceptar `seed`, `density` (estrellas por área), `colors` (paleta de estrellas), `background` (color base), `speed` (velocidad del titileo), `shootingStars` y `fixed`, además de `className` y `style`.

#### Scenario: Densidad y paleta custom

- **WHEN** el consumer pasa `density` alta y `colors={['#fff', '#bfdbfe']}`
- **THEN** el campo SHALL mostrar más estrellas usando esa paleta

### Requirement: StarfieldBackground respeta prefers-reduced-motion

`StarfieldBackground` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, SHALL pintarse el campo estático (sin titileo ni fugaces, sin RAF).

#### Scenario: Frame estático

- **WHEN** el browser reporta `prefers-reduced-motion: reduce`
- **THEN** el campo de estrellas SHALL verse estático, sin animación ni RAF corriendo

### Requirement: StarfieldBackground es SSR-safe y extensible

`StarfieldBackground` SHALL incluir `'use client'`, NO SHALL acceder a `window` ni `document` durante el render, y SHALL aceptar el spread de props HTML válidas de su elemento root.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, sin acceder al DOM
