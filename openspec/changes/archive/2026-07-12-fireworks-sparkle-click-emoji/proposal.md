## Why

Wave I dejó pagado el **patrón one-shot imperativo** (overlay pasivo + `fire()` via ref + RAF auto-detenible + PRNG por disparo, convención en AGENTS.md) y el propio design de ConfettiBurst anticipa sus sucesores ("fireworks, sparkles"). Wave J es la tanda más barata disponible del roadmap: cuatro efectos de celebración/feedback que aplican ese patrón sin ninguna decisión arquitectónica nueva, completando el Tier 6 que ConfettiBurst abrió.

## What Changes

- **Nuevo `FireworksBurst`**: fuegos artificiales one-shot — un cohete asciende desde la base y explota en partículas radiales con gravedad y fade. Física en módulo puro con dos fases (ascenso → explosión); handle `fire(options?)` via ref. Customizable: colores, cantidad de partículas, altura de explosión, cantidad de cohetes por disparo.
- **Nuevo `SparkleBurst`**: destellos/estrellitas breves alrededor de un punto (feedback de like, favorito, logro chico). Partículas con rotación y escala pulsante de vida corta, dibujadas como estrellas de 4 puntas por path en canvas; handle `fire(options?)` con punto de origen configurable.
- **Nuevo `EmojiBurst`**: ráfaga de emojis (🎉 ❤️ 👍) con la física de abanico/gravedad/drag de ConfettiBurst, renderizados con `fillText` sobre canvas — cero assets. Props: lista de emojis, tamaño, spread, power.
- **Nuevo `ClickSpark`**: variante **declarativa** de la categoría — chispas automáticas en cada click/`pointerdown` dentro del contenedor, sin ref. Internamente dispara el mismo motor one-shot; los `children` permanecen interactivos.
- **Infraestructura compartida**: el esqueleto común del patrón (pool de partículas, RAF que arranca/auto-se-detiene, canvas overlay con resize, seed por contador) se extrae de `ConfettiBurst` a un módulo interno reutilizable si la extracción resulta limpia; si el acoplamiento es alto, cada componente replica el esqueleto (son ~100 líneas) y la extracción se difiere.

## Capabilities

### New Capabilities

- `fireworks-burst`: Componente `FireworksBurst` — fuegos artificiales one-shot imperativos con fase de ascenso y explosión radial.
- `sparkle-burst`: Componente `SparkleBurst` — destellos breves one-shot imperativos alrededor de un punto.
- `emoji-burst`: Componente `EmojiBurst` — ráfaga one-shot imperativa de emojis con física de confetti.
- `click-spark`: Componente `ClickSpark` — chispas automáticas por click dentro de un contenedor, declarativo.

### Modified Capabilities

<!-- Ninguna. `confetti-burst` no cambia de comportamiento; una eventual extracción de esqueleto es refactor interno sin cambio de spec. -->

## Impact

- **Código nuevo**: `src/components/FireworksBurst/`, `src/components/SparkleBurst/`, `src/components/EmojiBurst/`, `src/components/ClickSpark/`; posible módulo interno compartido extraído de `ConfettiBurst` (refactor sin cambio de comportamiento).
- **Exports**: cuatro componentes, sus tipos y sus handles (`FireworksBurstHandle`, `SparkleBurstHandle`, `EmojiBurstHandle`) desde `src/index.ts` + cuatro entry points en `package.json#exports` y `tsup.config.ts`.
- **Docs**: cuatro secciones en README, cuatro ejemplos standalone en `/examples`, cuatro demos con panel de controles en `test-app`.
- **Dependencias**: ninguna nueva (criterio no negociable). **Sin breaking changes** (todo aditivo).
