# Design: docs-demo-controls

## Context

En la docs, cada componente tiene un demo curado como módulo `docs/src/demos/<slug>.tsx` con `export default` (un componente React sin props) y, opcionalmente, `export const demoLayout = 'flow'`. `ComponentPage` lo carga con `React.lazy` y lo monta dentro de `.docs-demo`.

El `test-app/` resuelve la interactividad con un `ControlPanel` (`test-app/src/harness/ControlPanel.jsx`): cada demo exporta un descriptor `controls` (array de `{ prop, type, ... , default }`) y una función `render(props)`. El panel mantiene el estado, renderiza los inputs según `type` (`number`→range, `boolean`→checkbox, `enum`→select, `color`, `text`, `multi`→chips/swatches) e inyecta `respectReducedMotion` automáticamente.

Dos defectos actuales en la docs:
- El scroll (sidebar, bloques de código, página) usa `scrollbar-width: thin` sin color: sobre el fondo dark el thumb es casi invisible.
- El demo de TiltCard estila la card en el **root** del componente. El TiltCard aplica el `transform` del tilt a un div **interno** que envuelve `children` (el root es el contenedor de `perspective`, que por definición CSS no rota) y el overlay de glare es `inset: 0` de ese interno. Al no envolver el contenido en una card con estilo, el interno mide solo el texto → el tilt y el glare toman como referencia el contenido, no la card (lo que se ve en la captura).

## Goals / Non-Goals

**Goals:**
- Panel de controles opcional por demo, con el mismo poder que el del test-app (incluye variar variantes/presets), integrado a la estética dark de la docs.
- Contrato aditivo: los demos existentes sin controles siguen funcionando sin cambios.
- Scroll visible y consistente sobre el tema dark.
- Demo de TiltCard correcto (y auditar el resto por el mismo antipatrón).

**Non-Goals:**
- No se comparte código con el `ControlPanel` del test-app (son apps separadas; se reimplementa en TS con la estética de la docs).
- No se agregan controles a los 50 demos: solo donde aporta (variantes/presets y props expresivas).
- No se toca la librería (`src/`) ni el test-app.
- No se genera el snippet de código a partir del estado de los controles (el código mostrado sigue siendo el ejemplo curado; los controles son para explorar el demo vivo, no para copiar props).

## Decisions

### D1 — Contrato de demo aditivo: `export const controls`

El módulo de demo puede exportar, además del `default`, un `controls: DemoControl[]`. Regla de render en `ComponentPage`:

- **Con `controls`**: el `default` es un componente que **recibe las props controladas** (`function Demo(props)`), y la vista lo envuelve: `<ControlPanel controls={controls}>{(state) => <Demo {...state} />}</ControlPanel>`.
- **Sin `controls`**: se monta `<Demo />` como hoy.

Alternativa considerada — replicar 1:1 el contrato del test-app (`export default { controls, render }` en vez de un componente): se descarta para no romper los 50 demos ya escritos como componentes `export default` ni el mecanismo `React.lazy`/`demoLayout` existente. El enfoque aditivo (una export opcional más) es el de menor fricción.

`DemoControl` se tipa en `docs/src/content.ts`:

```ts
type DemoControl =
  | { prop: string; type: 'number'; min: number; max: number; step?: number; default: number; label?: string }
  | { prop: string; type: 'boolean'; default: boolean; label?: string }
  | { prop: string; type: 'enum'; options: string[]; default: string; label?: string }
  | { prop: string; type: 'color'; default: string; label?: string }
  | { prop: string; type: 'text'; default: string; label?: string }
  | { prop: string; type: 'multi'; options: string[]; default: string[]; asColors?: boolean; label?: string }
```

### D2 — `ControlPanel` propio en la docs (TS, estética dark)

Se reimplementa en `docs/src/components/ControlPanel.tsx` portando la lógica del harness (estado desde defaults, inyección de `respectReducedMotion`, un input por `type`) pero con CSS de la docs (`--docs-*`) y colapsable. Vive como overlay dentro de `.docs-demo` (posición absoluta, esquina), sin tapar el contenido central del demo.

### D3 — Migración selectiva de demos a controles

Se agregan controles a los demos donde la interactividad enseña algo que el estático no: primero los de **variantes/presets** (el pedido explícito) y luego props escalares expresivas.

- `variant`/`preset`/`transition`/`drift`/`aesthetic`/`direction`/`orientation`/`shape` → `enum`.
- ángulos, velocidades, cantidades, radios, amplitudes → `number` (con rangos sensatos, tomados de los del test-app cuando existen).
- colores → `color`; paletas → `multi` con `asColors`.

Los demos one-shot (bursts) mantienen su botón `fire()`; los controles ajustan los defaults del próximo disparo. Los demos que se re-montan por `key` (CountUp, SplitReveal) siguen con su botón replay; el panel puede convivir.

### D4 — Scrollbars visibles sobre dark

En `base.css`, estilo global de scrollbar: WebKit (`::-webkit-scrollbar`, `-thumb`, `-track`) con thumb `--docs-border`/hover más claro sobre track transparente, y Firefox (`scrollbar-color` + `scrollbar-width: thin`). Reemplaza los `scrollbar-width: thin` sueltos del sidebar y los code blocks por el estilo unificado, asegurando contraste visible.

### D5 — Fix del antipatrón de estilo en demos (TiltCard)

Regla de autoría: el estilo visual del "objeto" del demo va en un **hijo** del componente cuando el componente envuelve/transforma a sus children (TiltCard, y cualquiera que aplique transform a un wrapper interno). Fix concreto de TiltCard: root con `position: relative` (y opcional `perspective`), y una card hija con fondo/padding/borde/tamaño — replicando el patrón del test-app. Se audita el resto de los demos de la categoría tarjetas/mouse (SpotlightCard, GlowBorder, BorderBeam, MagneticElement, RippleContainer, TeslaCoil) por el mismo error.

## Risks / Trade-offs

- [Divergencia con el `ControlPanel` del test-app (dos implementaciones)] → Aceptado: son apps independientes con estéticas distintas; compartir código acoplaría la web pública a la herramienta interna. El contrato de `controls` es casi idéntico, así que portar un demo es mecánico.
- [Un control con un `prop`/`default` que no existe en el componente rompería el demo en runtime] → Los defaults se toman de los tipos reales (y de los rangos del test-app); el `typecheck` de la docs no valida el binding dinámico, así que la verificación es la pasada de QA en browser.
- [Agregar controles a demos scroll-driven (`demoLayout: 'flow'`) complica el layout del panel] → Se limita el panel a los demos con frame normal; los `flow` (sticky) quedan sin panel salvo que se justifique.
- [El fix de TiltCard podría existir en otros demos ya "OK visualmente" por casualidad] → La auditoría de la categoría cards/mouse es explícita en tasks para no dejar el antipatrón latente.
