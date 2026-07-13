## Why

Wave F cierra la categoría de texto expresivo del Tier 2 con tres efectos clásicos que el paquete aún no cubre: rotación de palabras (el "Hacemos *webs* / *apps* / *magia*" de los heros), glitch RGB-split y ondulación continua por carácter. Los tres son CSS puro o timers triviales sobre convenciones ya existentes (keyframes inyectados, split accesible de SplitReveal), por lo que la tanda no requiere ninguna decisión arquitectónica nueva y complementa a TypewriterText/ScrambleText con estéticas distintas para el mismo caso de uso.

## What Changes

- **Nuevo `RotatingText`**: rota cíclicamente entre una lista de palabras/frases con transición configurable (`fade` / `slide-up` / `flip`), intervalo configurable y loop. La palabra visible se anima con CSS; el avance es un timer, sin RAF.
- **Nuevo `GlitchText`**: glitch RGB-split con jitter intermitente sobre el texto, CSS puro con pseudo-elementos y `clip-path` (sin JS por frame). Modos `loop` (intermitente autónomo) y `hover` (solo al pasar el cursor).
- **Nuevo `WavyText`**: caracteres ondulando en loop continuo, split por carácter con `animation-delay` escalonado, CSS puro. Amplitud y velocidad configurables.
- Los tres reutilizan el contrato de accesibilidad de texto del paquete: texto completo legible por lectores de pantalla, unidades animadas `aria-hidden`.

## Capabilities

### New Capabilities

- `rotating-text`: Componente `RotatingText` — rotación cíclica entre palabras con transiciones preset, accesible.
- `glitch-text`: Componente `GlitchText` — glitch RGB-split intermitente CSS puro, con modos loop y hover.
- `wavy-text`: Componente `WavyText` — ondulación continua por carácter con stagger, CSS puro.

### Modified Capabilities

<!-- Ninguna. -->

## Impact

- **Código nuevo**: `src/components/RotatingText/`, `src/components/GlitchText/`, `src/components/WavyText/`. `WavyText` consume la util de split compartida si Wave E la extrajo (`src/utils/split-text.ts`); si no, la extracción se hace en esta tanda.
- **Exports**: tres componentes y sus tipos desde `src/index.ts` + tres entry points nuevos en `package.json#exports`.
- **Docs**: tres secciones nuevas en README, tres ejemplos standalone en `/examples`, tres demos con panel de controles en `test-app`.
- **Dependencias**: ninguna nueva. **Sin breaking changes** (todo aditivo).
