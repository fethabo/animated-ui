## ADDED Requirements

### Requirement: AutoHeight transiciona las dimensiones del contenedor

`AutoHeight` SHALL animar la altura de su contenedor cuando el contenido cambia de tamaño (por cambio de children entre renders o por resize del contenido, detectado via `useResizeObserver`): medir la altura previa y la nueva, animar entre ambas con WAAPI y restaurar `height: auto` al terminar, con `overflow: hidden` aplicado solo durante la transición. Opcionalmente (`width={true}`) SHALL animar también el ancho.

#### Scenario: Contenido que crece

- **WHEN** el contenido del contenedor pasa de 100px a 300px de alto
- **THEN** el contenedor SHALL transicionar suavemente entre ambas alturas y quedar en `height: auto` al terminar

#### Scenario: Layout fluido después de animar

- **WHEN** la transición terminó y el viewport cambia de ancho re-wrappeando el contenido
- **THEN** el contenedor SHALL seguir su flujo normal (sin altura fija residual)

#### Scenario: Cambio durante la transición

- **WHEN** el contenido vuelve a cambiar antes de terminar la transición anterior
- **THEN** la animación SHALL redirigirse desde la altura visual actual hacia la nueva, sin saltos

### Requirement: AutoHeight es customizable

`AutoHeight` SHALL aceptar `duration`, `easing` (via CSS var `--aui-autoheight-easing`), `width` (animar también el ancho, default `false`), `className` y `style`.

#### Scenario: Duración custom

- **WHEN** el consumer pasa `duration={0.6}`
- **THEN** la transición de altura SHALL durar 0.6 segundos

### Requirement: AutoHeight respeta prefers-reduced-motion

`AutoHeight` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, los cambios de tamaño SHALL aplicarse instantáneamente (sin transición), manteniendo `height: auto`.

#### Scenario: Cambio instantáneo

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y el contenido cambia de tamaño
- **THEN** el contenedor SHALL ajustarse de inmediato, sin animación

### Requirement: AutoHeight es SSR-safe y extensible

`AutoHeight` SHALL incluir `'use client'`, NO SHALL acceder a `window` ni `document` durante el render, y SHALL aceptar el spread de props HTML válidas de su elemento root. En SSR el contenedor SHALL renderizarse con altura natural (`auto`), sin estilos de medición.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores y el contenido SHALL fluir con altura natural
