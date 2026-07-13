# count-up Specification

## Purpose
Componente `CountUp`: número que cuenta desde un valor inicial hasta su valor final al entrar al viewport (una vez por montaje), con easing de salida y RAF que muta `textContent` por ref (sin re-renders por frame); formato configurable (decimales estables, separador de miles, prefijo/sufijo), SEO-safe (el SSR renderiza el valor final), accesible (`aria-label` con el valor definitivo) y respetuoso de `prefers-reduced-motion`.

## Requirements

### Requirement: CountUp anima la cuenta hasta el valor final al entrar al viewport

`CountUp` SHALL renderizar un valor numérico y, al entrar su elemento al viewport (via `useInView`), animar la cuenta desde un valor inicial (`from`, default `0`) hasta el valor final (`value`) durante una duración configurable (`duration`), con easing de salida (arranque rápido, frenado al llegar). La animación SHALL ejecutarse una sola vez por montaje (comportamiento "once") y SHALL correr en un RAF que muta `textContent` por ref, sin re-renders de React por frame.

#### Scenario: Cuenta al entrar al viewport

- **WHEN** el elemento entra al viewport por scroll
- **THEN** el número SHALL contar desde `from` hasta `value` y detenerse exactamente en `value`

#### Scenario: Fuera del viewport no arranca

- **WHEN** el elemento todavía no entró al viewport
- **THEN** la cuenta NO SHALL comenzar

#### Scenario: Sin re-renders por frame

- **WHEN** la cuenta está en progreso
- **THEN** la actualización del número SHALL ocurrir mutando `textContent` por ref, sin `setState` por frame

### Requirement: CountUp formatea el valor de forma configurable

`CountUp` SHALL exponer props de formato: `decimals` (cantidad de decimales), `separator` (separador de miles, default sin separador), `prefix` y `suffix` (strings antepuesto/pospuesto, e.g. `"$"`, `"+"`). El formato SHALL aplicarse tanto durante la animación como en el valor final.

#### Scenario: Separador de miles y sufijo

- **WHEN** el consumer pasa `value={12500}`, `separator="."` y `suffix="+"`
- **THEN** el valor final renderizado SHALL ser `12.500+`

#### Scenario: Decimales estables durante la cuenta

- **WHEN** el consumer pasa `decimals={1}`
- **THEN** todos los valores intermedios SHALL renderizarse con exactamente 1 decimal

### Requirement: CountUp es SEO-safe y accesible

El markup renderizado en servidor SHALL contener el valor final formateado (no el valor inicial), de modo que el contenido sea correcto sin JavaScript y para crawlers. Tras la hidratación, el componente MAY resetear el texto al valor inicial recién cuando la animación va a comenzar. El elemento SHALL exponer el valor final en `aria-label` durante la animación, para que los lectores de pantalla anuncien el valor definitivo y no los intermedios.

#### Scenario: Render en servidor con valor final

- **WHEN** el componente se renderiza en SSR con `value={42}`
- **THEN** el markup SHALL contener `42` formateado

#### Scenario: Lector de pantalla

- **WHEN** un lector de pantalla lee el elemento durante la animación
- **THEN** SHALL anunciar el valor final, no un valor intermedio

### Requirement: CountUp respeta prefers-reduced-motion

`CountUp` SHALL aceptar `respectReducedMotion` (default `true`). Con la preferencia activa, el componente SHALL mostrar el valor final directamente, sin animación de cuenta.

#### Scenario: Valor final directo

- **WHEN** el browser reporta `prefers-reduced-motion: reduce` y el elemento entra al viewport
- **THEN** el valor final SHALL mostrarse de inmediato, sin cuenta animada

#### Scenario: Opt-out explícito

- **WHEN** el consumer pasa `respectReducedMotion={false}`
- **THEN** la cuenta SHALL animarse aunque la preferencia esté activa

### Requirement: CountUp es SSR-safe y extensible

`CountUp` SHALL incluir `'use client'` y NO SHALL acceder a `window` ni `document` durante el render. SHALL aceptar `className`, `style` y el spread de props HTML válidas de su elemento root.

#### Scenario: Render en servidor

- **WHEN** el componente se renderiza en un entorno SSR
- **THEN** el render SHALL completarse sin errores, sin acceder al DOM
