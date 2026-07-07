## 1. Prerequisito: split de texto compartido

- [x] 1.1 Verificar si Wave E extrajo `src/utils/split-text.ts`; si no existe, extraer aquí el split char/word de `SplitReveal` a módulo puro con tests (los tests existentes de `SplitReveal` deben pasar sin cambios)

## 2. RotatingText

- [x] 2.1 Crear `src/components/RotatingText/types.ts` (`words`, `transition`, `interval`, `loop`, `respectReducedMotion`, `className`, `style`; texto base como `children` opcional)
- [x] 2.2 Crear `src/components/RotatingText/index.tsx`: `'use client'`, timer encadenado para el avance, presets `fade`/`slide-up`/`flip` via `injectStyles`, transición de ancho medida por ref al cambiar de palabra, `aria-label` estático (base + lista) + palabra visible `aria-hidden`, sin `aria-live`, reduced motion = primera palabra fija, CSS vars `--aui-rotating-*`
- [x] 2.3 Test `index.ssr.test.ts` (markup del servidor contiene la primera palabra) + test del ciclo (avance y detención con `loop={false}`)

## 3. GlitchText

- [x] 3.1 Crear `src/components/GlitchText/types.ts` (`children: string`, `as`, `trigger`, `colors`, `intensity`, `frequency`, `respectReducedMotion`, `className`, `style`)
- [x] 3.2 Crear `src/components/GlitchText/index.tsx`: `'use client'`, CSS puro via `injectStyles` (pseudo-elementos con `content: attr(data-text)` + `clip-path` animado + jitter intermitente), modos `loop`/`hover`, reduced motion = estático en loop, CSS vars `--aui-glitch-*`
- [x] 3.3 Test `index.ssr.test.ts` + test de que el generador de CSS (lógica pura) produce las ráfagas según `frequency`

## 4. WavyText

- [x] 4.1 Crear `src/components/WavyText/types.ts` (`children: string`, `as`, `amplitude`, `speed`, `stagger`, `respectReducedMotion`, `className`, `style`)
- [x] 4.2 Crear `src/components/WavyText/index.tsx`: `'use client'`, split por carácter (util compartida), chars `inline-block` con `animation-delay` por índice inline, solo `translateY`, `aria-label` + chars `aria-hidden`, espacios preservados, reduced motion = estático, CSS vars `--aui-wavy-*`
- [x] 4.3 Test `index.ssr.test.ts` + test de preservación de espacios en el split

## 5. Exports y documentación

- [x] 5.1 Exportar `RotatingText`, `GlitchText`, `WavyText` y sus tipos desde `src/index.ts`; agregar entry points a `package.json#exports` y `tsup.config.ts`
- [x] 5.2 Documentar en README: fila en la tabla + sección (snippet, props, CSS custom properties) por componente; notas de alcance (GlitchText para titulares, no párrafos)
- [x] 5.3 Crear ejemplos standalone en `/examples` para los tres componentes (solo React)
- [x] 5.4 Marcar Wave F ✅ en `ROADMAP.md` (Tier 2)

## 6. Verificación (definition-of-done)

- [x] 6.1 Demo + descriptor de controles en `test-app` por componente (incluye `respectReducedMotion`) y alta en `demos/index.js`
- [ ] 6.2 Verificación visual en `test-app`: rotación con los tres presets y anchos dispares; glitch en loop y hover; ola continua sin romper la línea
- [x] 6.3 Correr vitest completo + typecheck + build; confirmar tree-shaking
- [x] 6.4 Revisar cumplimiento de la spec `component-authoring` para cada componente antes de archivar
