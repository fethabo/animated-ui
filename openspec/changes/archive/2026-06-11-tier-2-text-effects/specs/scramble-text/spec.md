# scramble-text Delta Spec

## ADDED Requirements

### Requirement: ScrambleText revela el texto carácter por carácter con caracteres aleatorios intermedios

`ScrambleText` SHALL aceptar el texto final como prop `text: string` y revelarlo progresivamente: los caracteres aún no revelados se muestran como caracteres aleatorios de un `charset` configurable, actualizados en un loop de `requestAnimationFrame`. La actualización SHALL mutar `textContent` directamente via ref, sin `setState` por frame. Los espacios del texto original SHALL preservarse en todos los frames. El scrambler SHALL operar por code points (no por unidades UTF-16).

#### Scenario: Reveal al montar

- **WHEN** `ScrambleText` se monta con `trigger` default (`'mount'`)
- **THEN** el texto aparece scrambled y se revela carácter por carácter hasta mostrar `text` completo, y el loop RAF se detiene

#### Scenario: Velocidad independiente del refresh rate

- **WHEN** el componente corre en displays de 60 Hz y 144 Hz con la misma prop `speed`
- **THEN** la duración total del reveal SHALL ser equivalente (progresión por timestamps, no por conteo de frames)

#### Scenario: Cambio de la prop text

- **WHEN** la prop `text` cambia mientras el componente está montado
- **THEN** el scramble se re-ejecuta hacia el texto nuevo

### Requirement: ScrambleText es accesible durante la animación

El elemento root SHALL exponer `aria-label` con el texto final completo, y el span interior que muta SHALL llevar `aria-hidden="true"`, de modo que los caracteres aleatorios intermedios nunca se anuncien a tecnologías asistivas.

#### Scenario: Lector de pantalla durante el scramble

- **WHEN** un lector de pantalla lee el componente mientras la animación está en curso
- **THEN** SHALL anunciar únicamente el texto final, estable, sin caracteres aleatorios

### Requirement: El trigger del scramble es configurable

`ScrambleText` SHALL aceptar `trigger: 'mount' | 'hover' | 'both'` (default `'mount'`). Con `'hover'` o `'both'`, un `mouseenter` en el root SHALL re-ejecutar el scramble.

#### Scenario: Re-scramble por hover

- **WHEN** `trigger` incluye hover y el cursor entra al componente
- **THEN** el texto se scramblea y revela nuevamente

### Requirement: ScrambleText respeta prefers-reduced-motion mostrando el texto final

`ScrambleText` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, el reveal autónomo (`mount` y cambios de `text`) SHALL desactivarse mostrando el texto final directamente; el trigger `hover` MAY permanecer activo por ser input directo.

#### Scenario: Usuario con reduced motion activado

- **WHEN** el sistema tiene `prefers-reduced-motion: reduce` y `respectReducedMotion` no fue desactivado
- **THEN** el componente renderiza `text` directamente sin animación al montar

### Requirement: ScrambleText es SSR-safe y extensible

`ScrambleText` SHALL incluir `'use client'`, SHALL renderizar el texto final en el render inicial (server y cliente, sin mismatch de hidratación) arrancando la animación recién en `useEffect`, y SHALL aceptar `className`, `style` y el spread de props HTML válidas de su elemento root. El color de los caracteres durante el scramble SHALL ser customizable via `--aui-scramble-color` (default `currentColor`).

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el markup contiene el texto final estático y el render completa sin errores

#### Scenario: Lógica pura testeable

- **WHEN** se ejecuta `scrambleFrame` con una fuente de aleatoriedad inyectada
- **THEN** el resultado SHALL ser determinista y verificable por tests unitarios sin DOM
