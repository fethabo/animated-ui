# use-in-view Delta Spec

## ADDED Requirements

### Requirement: useInView reporta la visibilidad de un elemento via IntersectionObserver

El hook `useInView(ref, options)` SHALL retornar un boolean que indica si el elemento referenciado interseca el viewport, observándolo con IntersectionObserver creado dentro de `useEffect`. SHALL aceptar `threshold` (default `0.15`), `rootMargin` (default `'0px'`) y `once` (default `true`). El observer SHALL desconectarse al desmontar.

#### Scenario: Elemento entra al viewport

- **WHEN** el elemento referenciado alcanza el threshold de intersección
- **THEN** el hook SHALL retornar `true`

#### Scenario: Modo once (default)

- **WHEN** `once` es `true` y el elemento ya intersecó una vez
- **THEN** el hook SHALL dejar de observar y el valor SHALL permanecer `true` aunque el elemento salga del viewport

#### Scenario: Modo continuo

- **WHEN** `once` es `false` y el elemento sale del viewport
- **THEN** el hook SHALL volver a retornar `false`

### Requirement: useInView es SSR-safe con fallback visible

En SSR y en el primer render de cliente el hook SHALL retornar `false` sin acceder a `window`/`document` durante el render. Si `IntersectionObserver` no está disponible en el entorno, el hook SHALL retornar `true` (nunca dejar contenido dependiente oculto para siempre).

#### Scenario: Render en servidor

- **WHEN** el hook se ejecuta en un entorno sin DOM
- **THEN** SHALL retornar `false` sin lanzar errores

#### Scenario: Browser sin IntersectionObserver

- **WHEN** `IntersectionObserver` es `undefined` en el cliente
- **THEN** el hook SHALL retornar `true` tras el primer effect
