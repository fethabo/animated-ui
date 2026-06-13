# image-dissolve Specification

## Purpose
Componente `ImageDissolve`: transiciona entre dos imágenes con dithering ordered (matriz Bayer 8×8), renderizando un `<img>` con un `<canvas>` superpuesto que revela la nueva imagen píxel a píxel según el threshold Bayer. Requiere imágenes same-origin o con CORS habilitado (degrada a swap directo si el canvas queda tainted), es customizable via props (`duration`, `alt`), respeta `prefers-reduced-motion` omitiendo la animación, y es SSR-safe (el `<img>` con su `alt` siempre presente, canvas inicializado en `useEffect`) y extensible.

## Requirements

### Requirement: ImageDissolve transiciona entre dos imágenes con dithering ordered (Bayer 8×8)

`ImageDissolve` SHALL renderizar un `<img>` con un `<canvas>` superpuesto (`position: absolute`). Al cambiar la prop `src`, SHALL iniciar una animación que revela la nueva imagen píxel a píxel según el orden de la matriz Bayer 8×8: los píxeles con threshold Bayer bajo aparecen primero, creando el patrón de materialización dithered característico.

#### Scenario: Transición al cambiar src

- **WHEN** la prop `src` cambia a una nueva URL
- **THEN** la nueva imagen SHALL aparecer progresivamente con el patrón de dithering Bayer, desde los píxeles de threshold más bajo hasta los más alto

#### Scenario: Estado estático antes de la primera transición

- **WHEN** el componente se monta sin transición activa
- **THEN** SHALL mostrar la imagen del `src` inicial sin canvas visible, como un `<img>` normal

### Requirement: La transición requiere que el src sea same-origin o tenga CORS habilitado

`ImageDissolve` SHALL usar `drawImage` y `getImageData` sobre canvas para acceder a los datos de píxel. Si la imagen es cross-origin sin los headers CORS correctos (`crossOrigin="anonymous"` + `Access-Control-Allow-Origin`), el canvas quedará "tainted" y `getImageData` lanzará `SecurityError`. En ese caso `ImageDissolve` SHALL degradar mostrando la imagen destino directamente sin animación, sin lanzar errores no capturados.

#### Scenario: Imagen same-origin

- **WHEN** `src` apunta a una imagen del mismo origen
- **THEN** la transición dithered SHALL ejecutarse normalmente

#### Scenario: Imagen cross-origin sin CORS

- **WHEN** `src` apunta a una imagen cross-origin sin headers CORS
- **THEN** `ImageDissolve` SHALL mostrar la imagen destino directamente, sin animación dithered y sin lanzar errores al consumer

### Requirement: ImageDissolve es customizable via props

`ImageDissolve` SHALL aceptar `duration` (ms, duración de la transición, default `800`) y `alt` (texto alternativo de la imagen, requerido). El `alt` SHALL aplicarse al `<img>` subyacente en todo momento.

#### Scenario: Transición lenta

- **WHEN** el consumer pasa `duration={2000}`
- **THEN** la transición SHALL completarse en aproximadamente 2 segundos

#### Scenario: Accesibilidad en SSR y sin JS

- **WHEN** el componente se renderiza en un entorno SSR o sin JavaScript
- **THEN** el `<img>` SHALL estar presente en el DOM con su `alt` correcto

### Requirement: ImageDissolve respeta prefers-reduced-motion omitiendo la animación

`ImageDissolve` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, al cambiar `src` SHALL swapear la imagen instantáneamente sin animar el canvas.

#### Scenario: Swap instantáneo con reduced motion

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y `src` cambia
- **THEN** la nueva imagen SHALL aparecer de inmediato, sin ninguna animación de dithering

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** la transición dithered SHALL ejecutarse normalmente aunque la preferencia esté activa

### Requirement: ImageDissolve es SSR-safe y extensible

`ImageDissolve` SHALL incluir `'use client'` y NO SHALL acceder a `window`, `document` ni al contexto canvas durante el render. El canvas y la animación SHALL inicializarse en `useEffect`. `ImageDissolve` SHALL aceptar `className`, `style` y el spread de props HTML válidas de su elemento root `<div>`.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, mostrando el `<img>` estático con `alt` correcto
