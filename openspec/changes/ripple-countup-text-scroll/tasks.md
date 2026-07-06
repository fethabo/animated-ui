## 1. Infraestructura compartida: split de texto

- [ ] 1.1 Evaluar la extracción del split char/word de `SplitReveal` a `src/utils/split-text.ts` (módulo puro); si el acoplamiento con los presets es alto, documentar el fallback (split propio en TextScrollReveal) y saltar 1.2–1.3
- [ ] 1.2 Extraer `split-text.ts` con la lógica pura de split por char/word (el split por línea queda en `SplitReveal`) + tests vitest propios
- [ ] 1.3 Verificar que los tests existentes de `SplitReveal` pasan sin cambios de comportamiento

## 2. RippleContainer

- [ ] 2.1 Crear `src/components/RippleContainer/types.ts` (`color`, `duration`, `maxRadius`, `opacity`, `respectReducedMotion`, `children`, `className`, `style`)
- [ ] 2.2 Crear `src/components/RippleContainer/index.tsx`: `'use client'`, keyframes via `injectStyles`, listener `pointerdown` en el contenedor, nodo efímero por onda posicionado en el punto del evento, cleanup en `animationend`, capa de ondas `pointer-events:none`, CSS vars `--aui-ripple-*`, fade estático bajo reduced motion
- [ ] 2.3 Test `index.ssr.test.ts` + test de que los nodos de onda se remueven del DOM al terminar

## 3. CountUp

- [ ] 3.1 Crear `src/components/CountUp/format.ts`: formateo puro (`decimals`, `separator`, `prefix`, `suffix`) + easing de salida; con tests vitest (valores intermedios con decimales estables, separador de miles)
- [ ] 3.2 Crear `src/components/CountUp/types.ts` (`value`, `from`, `duration`, `decimals`, `separator`, `prefix`, `suffix`, `respectReducedMotion`, `className`, `style`)
- [ ] 3.3 Crear `src/components/CountUp/index.tsx`: `'use client'`, SSR renderiza el valor final formateado, `useInView` (once) dispara el RAF que muta `textContent` por ref, `aria-label` con el valor final, reduced motion muestra el valor final directo
- [ ] 3.4 Test `index.ssr.test.ts` (markup del servidor contiene el valor final formateado)

## 4. TextScrollReveal

- [ ] 4.1 Crear `src/components/TextScrollReveal/types.ts` (`children` texto, `as`, `fromOpacity`, `toOpacity`, `fromColor?`, `toColor?`, `offset`, `respectReducedMotion`, `className`, `style`)
- [ ] 4.2 Crear `src/components/TextScrollReveal/index.tsx`: `'use client'`, split por palabra (util de 1.2 o fallback), `aria-label` completo + palabras `aria-hidden`, scroll-driver escribiendo `--aui-text-scroll-progress` en el root solo cerca del viewport (`useInView`), opacidad por palabra via `calc()` con índice inline, reduced motion = texto encendido estático
- [ ] 4.3 Test `index.ssr.test.ts` + test del cálculo de rango/offset (lógica pura)

## 5. Exports y documentación

- [ ] 5.1 Exportar `RippleContainer`, `CountUp`, `TextScrollReveal` y sus tipos desde `src/index.ts`; agregar los tres entry points a `package.json#exports` y `tsup.config.ts`
- [ ] 5.2 Documentar en README: fila en la tabla de componentes + sección (snippet, tabla de props, tabla de CSS custom properties) por componente; nota de `tabular-nums` en CountUp
- [ ] 5.3 Crear ejemplos standalone en `/examples` para los tres componentes (sin importar el paquete, solo React)
- [ ] 5.4 Marcar Wave E ✅ en `ROADMAP.md` (Tier 1: RippleContainer; Tier 2: CountUp; Tier 3: TextScrollReveal)

## 6. Verificación (definition-of-done)

- [ ] 6.1 Demo + descriptor de controles en `test-app` para cada componente (incluye control estándar de `respectReducedMotion`) y alta en `demos/index.js`
- [ ] 6.2 Verificación visual en `test-app`: ondas concurrentes y autolimpieza; cuenta con formato y easing; encendido progresivo reversible al scrollear
- [ ] 6.3 Correr vitest completo + typecheck + build; confirmar tree-shaking de los entry points nuevos
- [ ] 6.4 Revisar cumplimiento de la spec `component-authoring` para cada componente antes de archivar
