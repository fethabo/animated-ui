# component-authoring Specification

## Purpose

Definir el procedimiento de implementación y el definition-of-done de todo componente nuevo del paquete `@fethabo/animated-ui`. Esta spec es vinculante: cualquier change que agregue o modifique componentes debe cumplir estos requirements, y cualquier agente (humano o AI) que implemente componentes debe verificarlos antes de dar por terminado el trabajo.

### Procedimiento de implementación (informativo)

1. **Proponer**: crear un change con `/opsx:propose`. Una tanda del [ROADMAP.md](../../../ROADMAP.md) = un change. Si el componente requiere una decisión arquitectónica nueva (e.g. un motor de animación nuevo), el change incluye un `design.md` que la documente.
2. **Clasificar por motor**: CSS keyframes inyectados, canvas + RAF, WAAPI, o scroll. Reutilizar los hooks existentes (`useMousePosition`, `useReducedMotion`, `useResizeObserver`) antes de crear nuevos.
3. **Implementar** con `/opsx:apply`, cumpliendo todos los requirements de esta spec.
4. **Verificar**: tests con vitest + verificación visual manual en `test-app`.
5. **Documentar**: README (tabla de componentes, props, CSS custom properties) + ejemplo standalone en `/examples`.
6. **Archivar** el change con `/opsx:archive`.

## Requirements

### Requirement: Todo componente usa solo APIs nativas

Un componente SHALL implementarse exclusivamente con APIs nativas del browser (CSS, `<canvas>`, Web Animations API, observers) y React. NO SHALL introducir dependencias de runtime al `package.json`.

#### Scenario: Un change propone una dependencia de runtime

- **WHEN** la implementación de un componente requiere una librería externa de runtime
- **THEN** el componente SHALL ser rediseñado para usar APIs nativas, o descartado del roadmap

### Requirement: Todo componente sigue la estructura de directorios estándar

Cada componente SHALL vivir en `src/components/<Nombre>/` con `index.tsx` (el componente) y `types.ts` (tipos públicos). Las partes componibles (variantes, behaviors) SHALL ir en subdirectorios propios.

#### Scenario: Componente con variantes

- **WHEN** un componente tiene variantes visuales o behaviors combinables
- **THEN** cada variante/behavior SHALL ser un módulo propio en un subdirectorio (e.g. `variants/`, `behaviors/`), siguiendo el patrón de `AnimatedBackground` y `PixelBackground`

### Requirement: Todo componente es compatible con Next.js App Router, Vite y Astro

Cada archivo de componente SHALL incluir `'use client'` como primera línea. Ningún componente SHALL acceder a `window` ni `document` durante el render: todo acceso al DOM SHALL ocurrir dentro de `useEffect` o event handlers.

#### Scenario: Render en servidor (SSR)

- **WHEN** un componente se renderiza en un entorno SSR (Next.js, Astro)
- **THEN** el render SHALL completarse sin errores, produciendo el markup estático sin animación hasta la hidratación

### Requirement: Los estilos se inyectan en runtime sin imports del consumer

Todo CSS del componente SHALL inyectarse via `injectStyles(styleId, css)` dentro de un `useEffect`. El consumer NO SHALL necesitar importar ningún archivo CSS.

#### Scenario: Montaje múltiple del mismo componente

- **WHEN** varias instancias del mismo componente se montan en la página
- **THEN** el `<style>` tag SHALL inyectarse una sola vez (deduplicado por id)

### Requirement: La customización opera en dos capas: props y CSS custom properties

Todo parámetro visual del componente SHALL exponerse como prop con default razonable, y SHALL materializarse como CSS custom property con namespace `--aui-<componente>-*` seteada inline en el elemento root, de modo que el consumer pueda pisarla desde CSS en cascada.

#### Scenario: Override via CSS sin tocar props

- **WHEN** un consumer define `.mi-clase { --aui-<componente>-<param>: <valor>; }` sobre el componente
- **THEN** el valor de la cascada SHALL prevalecer sobre el default de la prop

### Requirement: Todo componente respeta prefers-reduced-motion por defecto

Cada componente SHALL aceptar `respectReducedMotion` con default `true`. Con la preferencia activa, los efectos autónomos (loops, idle, reveals) SHALL desactivarse; los efectos que responden a input directo del usuario (hover, click) MAY permanecer activos.

#### Scenario: Usuario con reduced motion activado

- **WHEN** el sistema operativo del usuario tiene `prefers-reduced-motion: reduce` y `respectReducedMotion` no fue desactivado
- **THEN** el componente SHALL renderizar su estado estático sin animaciones autónomas

#### Scenario: Opt-out explícito del consumer

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** el componente SHALL animar normalmente

### Requirement: El elemento root es extensible por el consumer

Todo componente SHALL aceptar `className`, `style`, y el spread de las props HTML válidas de su elemento root (aria attributes, handlers, data attributes).

#### Scenario: Integración con Tailwind o CSS modules

- **WHEN** el consumer pasa `className` y `style` al componente
- **THEN** ambos SHALL aplicarse al elemento root sin pisar los estilos funcionales del componente

### Requirement: El estado de animación se expone via render prop cuando es útil para efectos derivados

Cuando un componente tiene estado de animación que habilita efectos derivados (parallax, color shifts), SHALL aceptar `children` como función `(state) => ReactNode`, siguiendo el patrón de `TiltState` en `TiltCard`.

#### Scenario: Consumer construye un efecto derivado

- **WHEN** el consumer pasa una función como `children`
- **THEN** SHALL recibir el objeto de estado actualizado en cada frame relevante de la animación

### Requirement: Todo componente se exporta preservando tree-shaking

Cada componente y sus tipos públicos SHALL exportarse desde `src/index.ts`. Importar un componente NO SHALL arrastrar código de los demás al bundle del consumer.

#### Scenario: Consumer importa un solo componente

- **WHEN** un consumer importa `import { SpotlightCard } from '@fethabo/animated-ui'`
- **THEN** el bundle final NO SHALL incluir código de otros componentes del paquete

### Requirement: Todo componente se documenta en el README

El README SHALL incluir, por componente: una fila en la tabla de componentes, un snippet de uso, la tabla de props (tipo, default, descripción), y la tabla de CSS custom properties (variable, default, descripción).

#### Scenario: Componente nuevo mergeado sin docs

- **WHEN** un change agrega un componente sin su sección en el README
- **THEN** el change NO SHALL considerarse completo ni archivarse

### Requirement: Todo componente tiene un ejemplo standalone copy-paste

Cada componente SHALL tener un archivo en `/examples` que reimplementa el efecto de forma autocontenida, sin importar `@fethabo/animated-ui` — solo React. El ejemplo SHALL usar TypeScript mínimo (sin interfaces elaboradas ni genéricos), convertible a `.jsx` removiendo anotaciones de tipo inline.

#### Scenario: Developer copia el ejemplo a su proyecto

- **WHEN** un developer copia el archivo de `/examples` a un proyecto React sin el paquete instalado
- **THEN** el archivo SHALL funcionar con solo tener React instalado

### Requirement: La lógica pura tiene tests y el componente se verifica en test-app

Toda lógica pura extraíble (cálculos de animación, generadores de CSS, utils) SHALL tener tests unitarios con vitest, incluyendo un test de entorno SSR cuando la lógica toca el DOM. El componente SHALL verificarse visualmente en `test-app` antes de archivar el change.

#### Scenario: Lógica con acceso al DOM

- **WHEN** una util o hook accede a `document`/`window`
- **THEN** SHALL existir un test que verifique que no lanza errores en entorno sin DOM (patrón `*.ssr.test.ts`)

### Requirement: Todo componente shippea un panel de controles en el test-app

Cada componente SHALL incluir, en el harness del `test-app`, un panel de controles que exponga sus props configurables (escalares y de tipo array) como controles en vivo, siguiendo la capability `test-app-harness`. El panel SHALL permitir variar esas props en runtime sin recargar, e incluir el control estándar de `respectReducedMotion`. Las props no controlables (render props, `children` complejos, fuentes de imagen) MAY quedar fijas en el demo. Un change que agregue o modifique las props de un componente NO SHALL considerarse completo ni archivarse sin actualizar su panel de controles en el mismo change.

#### Scenario: Componente nuevo sin panel de controles

- **WHEN** un change agrega un componente al paquete sin su panel de controles en el `test-app`
- **THEN** el change NO SHALL considerarse completo ni archivarse

#### Scenario: Cambio de API sin actualizar el panel

- **WHEN** un change agrega, renombra o elimina una prop configurable de un componente existente
- **THEN** el panel de controles de ese componente SHALL actualizarse en el mismo change para reflejar la nueva superficie de props

### Requirement: Los JSDoc de las props públicas se escriben en inglés

Los comentarios JSDoc de los tipos públicos en `src/**/types.ts` (props, tipos exportados, render-prop states) SHALL escribirse en inglés: son la fuente canónica que ve el consumer npm en el autocomplete y de la que se generan las tablas de props de la web de documentación. Cada JSDoc de prop SHALL conservar el default explícito (`Default: \`<valor>\``) y las notas de comportamiento. Las traducciones al español viven en la capa de contenido de `docs/` y NO SHALL escribirse en el código fuente.

#### Scenario: Componente nuevo con JSDoc en español

- **WHEN** un change agrega o modifica props con JSDoc en español en `types.ts`
- **THEN** el change NO SHALL considerarse completo hasta migrar esos JSDoc a inglés

#### Scenario: Prop con default

- **WHEN** una prop opcional tiene valor default
- **THEN** su JSDoc SHALL declararlo en inglés con el formato `Default: \`<valor>\``

### Requirement: Todo componente se documenta en la web de documentación

Todo componente nuevo o con cambios de API pública SHALL tener su página en `docs/` como parte del definition-of-done: entrada en el manifest del registry con categoría, prosa en español e inglés, demo curado, snippet de uso del paquete, y entradas en `props.es.json` para todas sus props públicas. Esta obligación es adicional a (no reemplaza) la documentación en el README.

#### Scenario: Componente nuevo mergeado sin página de docs

- **WHEN** un change agrega un componente a los `exports` sin sus artefactos en `docs/`
- **THEN** el build de la docs SHALL fallar y el change NO SHALL considerarse completo ni archivarse

#### Scenario: Cambio de props sin actualizar traducciones

- **WHEN** un change agrega o renombra props sin actualizar `props.es.json`
- **THEN** el build de la docs SHALL fallar señalando las props sin traducción
