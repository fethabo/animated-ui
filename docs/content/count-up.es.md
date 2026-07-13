---
title: CountUp
description: Número que cuenta desde `from` hasta `value` al entrar al viewport, con easing de salida.
---

## Características

- Cuenta desde `from` hasta `value` al entrar al viewport, con easing de salida (arranque rápido, frenado al llegar). La cuenta corre una sola vez por montaje.
- El RAF muta `textContent` por ref (patrón `ScrambleText`): cero re-renders por frame.
- SEO-safe: el markup SSR contiene el valor final formateado (correcto sin JavaScript y para crawlers); el texto se resetea al valor inicial recién cuando la cuenta arranca.
- Accesible: el root expone el valor final en `aria-label`, así los lectores de pantalla anuncian el valor definitivo y no los intermedios.
- Formateo con `decimals`, `separator` de miles, `prefix` y `suffix`.
- Acepta cualquier prop HTML válida de `<span>`.

## Limitaciones

- Los números de ancho variable pueden hacer "bailar" el layout durante la cuenta. Aplicá `font-variant-numeric: tabular-nums` al componente (o a su contenedor) para un ancho estable.
- La cuenta corre una sola vez por montaje: para re-dispararla hay que remontar el componente (por ejemplo, cambiando su `key`).
- Con `prefers-reduced-motion` activo muestra el valor final directo (coincide con el markup SSR — cero salto visual).
