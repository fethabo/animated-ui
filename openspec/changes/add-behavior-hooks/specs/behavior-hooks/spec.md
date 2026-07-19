# behavior-hooks Specification (delta)

## ADDED Requirements

### Requirement: Todo behavior hook devuelve un callback ref que ata el efecto al elemento del consumer

Cada behavior hook (`useTilt`, `useMagnetic`, `useSpotlight`, `useGlowBorder`) SHALL aceptar un objeto de opciones y devolver un callback ref `(node: HTMLElement | null) => void`. Al recibir un nodo, el hook SHALL atar el efecto a ese nodo; al recibir `null` o un nodo distinto, SHALL destruir la instancia anterior antes de atar la nueva. El hook SHALL funcionar con cualquier componente que forwardee `ref` a un elemento DOM, sin requerir ninguna UI library específica.

#### Scenario: Consumo sobre un componente de terceros

- **WHEN** el consumer pasa el ref devuelto a un componente que forwardea `ref` a su nodo DOM (e.g. `<Card ref={useTilt()}>`)
- **THEN** el efecto SHALL aplicarse sobre ese nodo sin introducir ningún elemento wrapper adicional

#### Scenario: El nodo cambia de identidad

- **WHEN** React invoca el callback ref con un nodo distinto al anterior
- **THEN** el hook SHALL destruir la instancia previa (restaurando aquel host) y atar el efecto al nuevo nodo

#### Scenario: Desmontaje

- **WHEN** el componente del consumer se desmonta
- **THEN** el hook SHALL destruir la instancia y no dejar listeners, capas ni timers activos

### Requirement: El hook mejora el host y lo restaura al destruir

Un behavior hook SHALL limitarse a: setear CSS custom properties `--aui-*` inline, agregar clases con prefijo `aui-`, forzar `position: relative` únicamente cuando el computed style del host es `static`, e inyectar capas hijas propias (`aria-hidden`, `pointer-events: none`) cuando el efecto las requiere. Al destruir, el host SHALL quedar en su estado original: vars removidas, clases removidas, `position` inline restaurado y capas inyectadas removidas. El hook NO SHALL leer ni escribir `innerHTML` del host, NO SHALL envolver ni reordenar los children del consumer, y NO SHALL registrar listeners globales (`window`/`document`).

#### Scenario: Restauración completa

- **WHEN** el efecto se destruye sobre un host que antes de atarse no tenía estilos inline
- **THEN** el host NO SHALL conservar ninguna CSS var `--aui-*`, clase `aui-`, `position` inline ni capa inyectada

#### Scenario: Host con position propio

- **WHEN** el host ya tiene `position` distinto de `static`
- **THEN** el hook NO SHALL modificar su `position`

### Requirement: Los behavior hooks son SSR-safe

Un behavior hook NO SHALL acceder a `window` ni `document` durante el render: todo trabajo SHALL ocurrir dentro del callback ref o de effects. Renderizar un componente que usa el hook en un entorno sin DOM SHALL completarse sin errores.

#### Scenario: Render en servidor

- **WHEN** un componente del consumer que usa un behavior hook se renderiza en SSR (Next.js, Astro)
- **THEN** el render SHALL producir el markup estático sin errores, y el efecto SHALL atarse recién en la hidratación

### Requirement: Los behavior hooks respetan prefers-reduced-motion por defecto

Cada behavior hook SHALL aceptar la opción `respectReducedMotion` con default `true`. Con la preferencia activa, los movimientos del efecto SHALL desactivarse siguiendo la misma semántica que el componente homólogo, y el hook SHALL reaccionar en vivo a cambios de la preferencia.

#### Scenario: Usuario con reduced motion

- **WHEN** el sistema reporta `prefers-reduced-motion: reduce` y el consumer no desactivó `respectReducedMotion`
- **THEN** el efecto NO SHALL producir movimiento sobre el host

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion: false`
- **THEN** el efecto SHALL animar normalmente

### Requirement: Las opciones del hook se actualizan en vivo sin re-atar el efecto

Cambios en las opciones entre renders SHALL detectarse por shallow-compare y aplicarse sobre la instancia existente. Cambios que solo afectan CSS vars SHALL re-aplicarse sin reconstruir listeners ni capas. El consumer NO SHALL necesitar memoizar el objeto de opciones.

#### Scenario: Cambio de opción estética

- **WHEN** el consumer cambia una opción que mapea a una CSS var (e.g. el color del spotlight)
- **THEN** el efecto SHALL reflejar el nuevo valor sin destruir ni re-crear capas o listeners

#### Scenario: Objeto de opciones nuevo con valores iguales

- **WHEN** el consumer pasa en cada render un objeto literal con los mismos valores
- **THEN** el hook NO SHALL re-atar ni reconstruir nada

### Requirement: Componente y hook comparten un único motor por efecto

Cada efecto con modo hook SHALL implementarse en un módulo motor imperativo (`attach(host, options) → { update, destroy }`) sin dependencias de React, consumido tanto por el hook como por el componente existente. El comportamiento observable del componente NO SHALL cambiar por el refactor. El motor SHALL ser idempotente bajo ciclos attach → destroy → attach (StrictMode).

#### Scenario: Paridad componente/hook

- **WHEN** el mismo efecto se usa via componente y via hook con opciones equivalentes
- **THEN** ambos SHALL producir el mismo comportamiento visual

#### Scenario: StrictMode

- **WHEN** React monta, desmonta y re-monta el host en desarrollo
- **THEN** el efecto SHALL quedar atado una sola vez, sin listeners ni capas duplicadas

### Requirement: Los hooks se exportan preservando tree-shaking y zero-config

Cada behavior hook SHALL exportarse desde el entry de su componente (subpath export existente) y desde el barrel `src/index.ts`. El CSS que el efecto requiere SHALL inyectarse via `injectStyles` en el primer attach, sin que el consumer importe CSS. Las opciones no disponibles en modo hook (e.g. `glare`, `hitArea`) NO SHALL existir en el tipo de opciones del hook.

#### Scenario: Import por subpath

- **WHEN** el consumer importa `import { useTilt } from '@fethabo/animated-ui/tilt-card'`
- **THEN** el bundle NO SHALL incluir código de otros componentes del paquete

#### Scenario: Opción no soportada

- **WHEN** el consumer intenta pasar al hook una opción exclusiva del modo componente
- **THEN** TypeScript SHALL reportar error de compilación

### Requirement: El modo hook se documenta junto a su componente

Cada behavior hook SHALL documentarse como sección del componente homólogo en el README y en la web de documentación (snippet de uso, tabla de opciones, limitaciones respecto al modo componente), y SHALL tener verificación visual en `test-app` junto al componente. Los JSDoc de las opciones públicas SHALL escribirse en inglés con sus defaults explícitos.

#### Scenario: Hook nuevo sin docs

- **WHEN** un change agrega un behavior hook sin su sección en README y docs
- **THEN** el change NO SHALL considerarse completo ni archivarse
