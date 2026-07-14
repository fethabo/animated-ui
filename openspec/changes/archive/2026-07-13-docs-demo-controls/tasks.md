# Tasks: docs-demo-controls

## 1. Contrato de controles + panel

- [x] 1.1 Tipar `DemoControl` (union number/boolean/enum/color/text/multi) y el contrato de demo (`export const controls?`) en `docs/src/content.ts`; exponerlo en el loader del demo (`demoFor` ya devuelve el módulo — sumar `controls`)
- [x] 1.2 Crear `docs/src/components/ControlPanel.tsx` (+ `control-panel.css`): estado desde defaults, inyección automática de `respectReducedMotion`, un input por `type` (range/checkbox/select/color/text/chips-swatches), colapsable, estética `--docs-*`, overlay en esquina de `.docs-demo`
- [x] 1.3 Integrar en `ComponentPage`: si el módulo del demo exporta `controls`, envolver `<ControlPanel controls={controls}>{(state) => <Demo {...state} />}</ControlPanel>`; si no, montar `<Demo />` como hoy. Mantener `React.lazy` y `demoLayout`

## 2. Fixes visuales

- [x] 2.1 Scrollbars visibles sobre dark en `docs/src/styles/base.css` (WebKit `::-webkit-scrollbar*` + Firefox `scrollbar-color`/`scrollbar-width`); unificar y quitar los `scrollbar-width: thin` sueltos de `layout.css` y `code-block.css`
- [x] 2.2 Fix demo TiltCard (`docs/src/demos/tilt-card.tsx`): mover el estilo de la card a un `<div>` hijo, root del TiltCard mínimo (`position: relative`), replicando el patrón del test-app; verificar que tilt+glare toman la card como referencia
- [x] 2.3 Auditar los demos de tarjetas/mouse (SpotlightCard, GlowBorder, BorderBeam, MagneticElement, RippleContainer, TeslaCoil) por el mismo antipatrón de estilo en el root; corregir los que apliquen

## 3. Migración de demos a controles

- [x] 3.1 Variantes/presets (enum) — prioridad del pedido: AnimatedBackground `variant`, RotatingText `transition`, ParticleField `drift`, SplitReveal `preset`/`split`, Dock `orientation`, Marquee `direction`, GuidingBranches `aesthetic`, ScribbleDecoration `shape`, ScrollReveal `direction`
- [x] 3.2 Props escalares/colores expresivas en demos de alto valor: TiltCard (`glare`/`maxAngle`/`perspective`), WavesBackground, FlowField, ConfettiBurst y demás bursts (defaults del próximo `fire()`), ParticleField (`count`/`links`), ShinyText, WavyText, GlitchText — rangos tomados del test-app cuando existan
- [x] 3.3 Verificar que los demos migrados aceptan las props controladas y que los defaults del panel coinciden con los tipos reales del componente

## 4. Verificación

- [x] 4.1 `npm run build` (docs) estricto + `tsc --noEmit` OK
- [x] 4.2 QA en browser (Playwright/Chrome): panel varía variante en vivo sin recargar y sin tocar el código; TiltCard tiltea la card completa; scrollbar visible en sidebar y bloque de código; demos sin controles siguen andando; un one-shot con controles dispara con los nuevos defaults
