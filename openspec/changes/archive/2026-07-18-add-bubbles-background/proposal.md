## Why

`AnimatedBackground` ofrece ocho variantes pero ninguna cubre el efecto clásico de burbujas ascendiendo lentamente — un fondo suave y calmo muy pedido para heros, secciones de pricing y landing pages con estética liviana/acuática. Es una extensión de bajo costo que reutiliza el contrato de variantes existente sin tocar el API público del componente.

## What Changes

- Nueva variante `bubbles` para `AnimatedBackground`: círculos translúcidos de distintos tamaños que ascienden lentamente desde la parte inferior, con leve deriva horizontal, en loop continuo.
- Implementación con CSS puro (gradientes + `@keyframes`, sin JS por frame), siguiendo el patrón de las variantes existentes (`lava`, `dots`, etc.).
- Cumple el contrato común de variantes: props `colors` / `speed` / `intensity`, CSS custom properties con namespace `--aui-bubbles-*`, y degradación estática bajo `prefers-reduced-motion`.
- Se agrega `'bubbles'` a `AnimatedBackgroundVariantName` y al registro de variantes.
- Documentación completa según `component-authoring`: README, ejemplo standalone en `/examples`, demo en `test-app`, y página/props en `docs/` (es/en).

Sin breaking changes.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

- `animated-background`: el requirement de variantes soportadas pasa de ocho a nueve, agregando `bubbles` (burbujas translúcidas que ascienden lentamente) con el mismo contrato de `colors`/`speed`/`intensity`, CSS vars `--aui-bubbles-*` y reduced motion que las demás.

## Impact

- `src/components/AnimatedBackground/types.ts`: agregar `'bubbles'` al union `AnimatedBackgroundVariantName`.
- `src/components/AnimatedBackground/variants/bubbles.ts`: nuevo módulo de variante.
- `src/components/AnimatedBackground/index.tsx`: registrar la variante en `VARIANTS`.
- `src/components/AnimatedBackground/index.ssr.test.ts`: cubrir la variante nueva si el test itera variantes.
- `README.md`: tabla de variantes / CSS custom properties de `bubbles`.
- `examples/`: ejemplo standalone copy-paste del efecto.
- `test-app`: la demo de `AnimatedBackground` debe ofrecer `bubbles` en su selector de variante.
- `docs/`: demo, prosa es/en y `props.es.json` de `animated-background` actualizados con la variante nueva.
- Sin dependencias nuevas ni cambios de API pública más allá del valor adicional del union type.
