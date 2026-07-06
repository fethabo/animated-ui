## Why

Wave E son los tres quick wins de mayor demanda del roadmap con costo mínimo: `RippleContainer` es la única deuda pendiente del Tier 1 (prometido desde v0.2), y `CountUp` + `TextScrollReveal` son dos de los efectos más pedidos en landings modernas (stats que cuentan al entrar al viewport, párrafos que se "encienden" al scrollear). Los tres se construyen enteramente con motores y convenciones ya existentes — keyframes inyectados, RAF-por-ref con `useInView`, y el scroll-driver de v0.5 — por lo que la tanda no requiere ninguna decisión arquitectónica nueva.

## What Changes

- **Nuevo `RippleContainer`**: contenedor que dibuja ondas expansivas desde el punto de click (material ripple). Keyframes inyectados + nodo efímero por click que se autolimpia al terminar la animación; múltiples clicks generan ondas concurrentes. Customizable: color, duración, radio máximo, opacidad inicial.
- **Nuevo `CountUp`**: número que cuenta desde un valor inicial hasta su valor final al entrar al viewport, con easing de salida. RAF que muta `textContent` por ref (patrón ScrambleText), sin re-renders por frame. Formato configurable: decimales, separador de miles, prefijo/sufijo. El markup SSR contiene el valor final (SEO-safe).
- **Nuevo `TextScrollReveal`**: párrafo particionado por palabra cuyas palabras pasan de apagadas a encendidas progresivamente según el avance del scroll (highlight progresivo). Split accesible (patrón SplitReveal) + scroll-driver escribiendo una CSS var de progreso; la opacidad por palabra se resuelve con `calc()` por índice, sin React state en el hot path.
- **Infraestructura compartida**: si la extracción resulta limpia, la lógica de split por unidad de `SplitReveal` se extrae a un módulo interno compartido para reutilizarla en `TextScrollReveal` (y en futuros efectos de texto de Wave F).

## Capabilities

### New Capabilities

- `ripple-container`: Componente `RippleContainer` — ondas expansivas desde el punto de click, con nodos efímeros autolimpiados.
- `count-up`: Componente `CountUp` — contador numérico animado al entrar al viewport, con formato configurable y accesible.
- `text-scroll-reveal`: Componente `TextScrollReveal` — highlight progresivo de palabras ligado a la posición de scroll.

### Modified Capabilities

<!-- Ninguna. -->

## Impact

- **Código nuevo**: `src/components/RippleContainer/`, `src/components/CountUp/`, `src/components/TextScrollReveal/`. Posible util interna `src/utils/split-text.ts` extraída de `SplitReveal` (refactor interno sin cambio de comportamiento).
- **Exports**: tres componentes y sus tipos desde `src/index.ts` + tres entry points nuevos en `package.json#exports`.
- **Docs**: tres secciones nuevas en README, tres ejemplos standalone en `/examples`, tres demos con panel de controles en `test-app`.
- **Dependencias**: ninguna nueva (criterio no negociable). **Sin breaking changes** (todo aditivo; el refactor de split preserva la API y el comportamiento de `SplitReveal`).
