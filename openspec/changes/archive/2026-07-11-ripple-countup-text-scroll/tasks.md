## 1. Infraestructura compartida: split de texto

- [x] 1.1 Evaluar la extracción del split char/word de `SplitReveal` a `src/utils/split-text.ts` (módulo puro); si el acoplamiento con los presets es alto, documentar el fallback (split propio en TextScrollReveal) y saltar 1.2–1.3 — ya resuelto: Wave F extrajo `src/utils/split-text.ts` (lo consumen SplitReveal y WavyText)
- [x] 1.2 Extraer `split-text.ts` con la lógica pura de split por char/word (el split por línea queda en `SplitReveal`) + tests vitest propios — ya existía (Wave F) con `split-text.test.ts`
- [x] 1.3 Verificar que los tests existentes de `SplitReveal` pasan sin cambios de comportamiento — 25 tests verdes (SplitReveal + split-text)

## 2. RippleContainer

- [x] 2.1 Crear `src/components/RippleContainer/types.ts` (`color`, `duration`, `maxRadius`, `opacity`, `respectReducedMotion`, `children`, `className`, `style`)
- [x] 2.2 Crear `src/components/RippleContainer/index.tsx`: `'use client'`, keyframes via `injectStyles`, listener `pointerdown` en el contenedor, nodo efímero por onda posicionado en el punto del evento, cleanup en `animationend`, capa de ondas `pointer-events:none`, CSS vars `--aui-ripple-*`, fade estático bajo reduced motion
- [x] 2.3 Test `index.ssr.test.ts` + test de que los nodos de onda se remueven del DOM al terminar

## 3. CountUp

- [x] 3.1 Crear `src/components/CountUp/format.ts`: formateo puro (`decimals`, `separator`, `prefix`, `suffix`) + easing de salida; con tests vitest (valores intermedios con decimales estables, separador de miles)
- [x] 3.2 Crear `src/components/CountUp/types.ts` (`value`, `from`, `duration`, `decimals`, `separator`, `prefix`, `suffix`, `respectReducedMotion`, `className`, `style`)
- [x] 3.3 Crear `src/components/CountUp/index.tsx`: `'use client'`, SSR renderiza el valor final formateado, `useInView` (once) dispara el RAF que muta `textContent` por ref, `aria-label` con el valor final, reduced motion muestra el valor final directo
- [x] 3.4 Test `index.ssr.test.ts` (markup del servidor contiene el valor final formateado)

## 4. TextScrollReveal

- [x] 4.1 Crear `src/components/TextScrollReveal/types.ts` (`children` texto, `as`, `fromOpacity`, `toOpacity`, `fromColor?`, `toColor?`, `offset`, `respectReducedMotion`, `className`, `style`)
- [x] 4.2 Crear `src/components/TextScrollReveal/index.tsx`: `'use client'`, split por palabra (util de 1.2 o fallback), `aria-label` completo + palabras `aria-hidden`, scroll-driver escribiendo `--aui-text-scroll-progress` en el root solo cerca del viewport (`useInView`), opacidad por palabra via `calc()` con índice inline, reduced motion = texto encendido estático
- [x] 4.3 Test `index.ssr.test.ts` + test del cálculo de rango/offset (lógica pura en `progress.ts`)

## 5. Exports y documentación

- [x] 5.1 Exportar `RippleContainer`, `CountUp`, `TextScrollReveal` y sus tipos desde `src/index.ts`; agregar los tres entry points a `package.json#exports` y `tsup.config.ts`
- [x] 5.2 Documentar en README: fila en la tabla de componentes + sección (snippet, tabla de props, tabla de CSS custom properties) por componente; nota de `tabular-nums` en CountUp
- [x] 5.3 Crear ejemplos standalone en `/examples` para los tres componentes (sin importar el paquete, solo React)
- [x] 5.4 Marcar Wave E ✅ en `ROADMAP.md` (Tier 1: RippleContainer; Tier 2: CountUp; Tier 3: TextScrollReveal)

## 6. Verificación (definition-of-done)

- [x] 6.1 Demo + descriptor de controles en `test-app` para cada componente (incluye control estándar de `respectReducedMotion`, inyectado por el harness) y alta en `demos/index.js`
- [x] 6.2 Verificación visual en `test-app`: ondas concurrentes y autolimpieza; cuenta con formato y easing; encendido progresivo reversible al scrollear — verificado con Chrome headless via CDP (3 ondas concurrentes → 0 nodos tras animationend; cuenta intermedia "4.822+" → final "12.500+"/"99.9%"; progreso 0.046 → 1 → 0.046 reversible, palabras encendidas en orden en los screenshots; cero errores de consola)
- [x] 6.3 Correr vitest completo + typecheck + build; confirmar tree-shaking de los entry points nuevos — 468 tests verdes, typecheck limpio, build OK; import de solo `CountUp` desde el barrel bundlea 4.2 KB sin código de otros componentes
- [x] 6.4 Revisar cumplimiento de la spec `component-authoring` para cada componente antes de archivar — APIs nativas sin deps, estructura estándar, `'use client'` + SSR-safe (tests ssr), `injectStyles` en effect (CountUp no requiere CSS), props + vars `--aui-*`, `respectReducedMotion` default `true`, root extensible, exports tree-shakeables, README + examples + panel de controles
