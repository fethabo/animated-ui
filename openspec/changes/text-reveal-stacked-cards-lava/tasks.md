## 1. TypewriterText

- [ ] 1.1 Crear `src/components/TypewriterText/types.ts` con `TypewriterTextProps` (`text: string | string[]`, `speed`, `startDelay`, `cursor`, `deleteSpeed`, `pauseDuration`, `loop`, `respectReducedMotion`, `className`, `style`, spread de `<span>`)
- [ ] 1.2 Crear `src/components/TypewriterText/typewriter.ts` (lógica pura: dado tiempo transcurrido y config, qué substring mostrar; máquina de estados type→pause→delete→next para modo multi-string)
- [ ] 1.3 Tests vitest de `typewriter.ts` (progresión por timestamp, transiciones del loop, borde de string único vs arreglo)
- [ ] 1.4 Crear `src/components/TypewriterText/index.tsx`: `'use client'`, RAF que muta `textContent` por ref, cursor parpadeante via CSS inyectado (`--aui-typewriter-cursor-speed`), `aria-label` con texto completo, manejo de `respectReducedMotion`
- [ ] 1.5 Test `index.ssr.test.ts` (render sin acceso a DOM)

## 2. SplitReveal

- [ ] 2.1 Crear `src/components/SplitReveal/types.ts` con `SplitRevealProps` (`text`, `split: 'char'|'word'|'line'`, `preset: 'fade'|'slide-up'|'blur'`, `trigger: 'mount'|'in-view'`, `stagger`, `duration`, `distance`, `threshold`, `once`, `respectReducedMotion`, `className`, `style`)
- [ ] 2.2 Crear `src/components/SplitReveal/split.ts` (lógica pura: partir string en char/word preservando espacios; agrupar palabras por línea dado un mapa de `offsetTop`)
- [ ] 2.3 Tests vitest de `split.ts` (char/word, preservación de espacios, agrupado por línea)
- [ ] 2.4 Crear `src/components/SplitReveal/styles.ts` (generador de CSS de los presets fade/slide-up/blur con `--aui-split-*`) + test
- [ ] 2.5 Crear `src/components/SplitReveal/index.tsx`: `'use client'`, render del texto completo pre-hidratación, split en cliente con spans `aria-hidden` + `aria-label`, disparo via `useInView` o mount, re-medir por línea con `useResizeObserver`
- [ ] 2.6 Test `index.ssr.test.ts` (texto completo presente en markup, sin acceso a DOM)

## 3. StackedCards

- [ ] 3.1 Crear `src/components/StackedCards/types.ts` con `StackedCardsProps` (`offsetTop`, `scaleStep`, `opacityStep`, `cardTravel`/`gap`, `respectReducedMotion`, `className`, `style`) y `StackedCard` si aplica subcomponente
- [ ] 3.2 Crear `src/components/StackedCards/progress.ts` (lógica pura: dado scroll/posición del contenedor y N cards, calcular profundidad entera y progreso fraccional por card) + tests vitest
- [ ] 3.3 Crear `src/components/StackedCards/index.tsx`: `'use client'`, wrappers con `position: sticky; top: var(--aui-stack-offset)`, altura reservada del contenedor, `subscribeScroll` + `useInView` escribiendo `--aui-stack-depth`/progreso, interpolación `scale`/`opacity` en el compositor
- [ ] 3.4 Test `index.ssr.test.ts` (cards presentes en markup, sin acceso a DOM)

## 4. Variante lava de AnimatedBackground

- [ ] 4.1 Crear `src/components/AnimatedBackground/variants/lava.ts` (blobs opacos animados con `@keyframes translateY` a distinta fase + `filter: blur() contrast()` gooey; CSS vars `--aui-lava-*` para colores/velocidad/blur)
- [ ] 4.2 Agregar `'lava'` al union `AnimatedBackgroundVariantName` en `types.ts` y registrarla en el selector de variantes de `index.tsx`
- [ ] 4.3 Implementar el estado estático bajo reduced motion para `lava` (composición fija sin movimiento)
- [ ] 4.4 Test/verificación de que la variante se inyecta y selecciona correctamente

## 5. Exports y documentación

- [ ] 5.1 Exportar `TypewriterText`, `SplitReveal`, `StackedCards` y sus tipos desde `src/index.ts`
- [ ] 5.2 Documentar en README: filas en la tabla de componentes + secciones con snippet, tabla de props y tabla de CSS custom properties para los tres componentes; fila de la variante `lava` y sus `--aui-lava-*`
- [ ] 5.3 Crear ejemplos standalone en `/examples` para los tres componentes y un ejemplo de la variante `lava` (sin importar el paquete, solo React)
- [ ] 5.4 Actualizar `ROADMAP.md`: marcar SplitReveal (Tier 2) ✅, agregar TypewriterText (Tier 2), StackedCards (Tier 3) y la variante lava (Tier 4/AnimatedBackground)

## 6. Verificación (definition-of-done)

- [ ] 6.1 Verificar los cuatro efectos visualmente en `test-app` (incluyendo reduced motion y SSR en Next/Astro)
- [ ] 6.2 Correr la suite de vitest completa y el typecheck; confirmar tree-shaking (import individual no arrastra los demás)
- [ ] 6.3 Revisar el cumplimiento de la spec `component-authoring` para cada componente antes de archivar
