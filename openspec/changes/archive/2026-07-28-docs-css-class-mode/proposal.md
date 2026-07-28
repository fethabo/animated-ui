## Why

La implementación reciente (`add-css-class-mode`) introdujo un modo de consumo mediante clases de CSS estáticas para cuatro componentes puramente visuales, permitiendo animaciones complejas con cero JavaScript en runtime. Es indispensable actualizar la web de documentación para que los consumidores conozcan y adopten esta nueva forma de uso, sus limitaciones y su integración con las funciones de registro (`register*()`).

## What Changes

- Se añadirá una sección de "CSS Class Mode" en la documentación de los siguientes 4 componentes:
  - `AnimatedBackground`
  - `ShinyText`
  - `GlitchText`
  - `BorderBeam`
- Las recetas incluirán ejemplos claros del HTML nativo necesario, cómo se deben invocar las funciones `register*()` (o importar los `.css` compilados), y cómo aplicar el atributo `data-aui-motion` para forzar las animaciones saltándose el `prefers-reduced-motion`.
- Se modificarán las vistas de la app de documentación (`docs/`) para renderizar estas secciones en español e inglés.

## Capabilities

### New Capabilities
- `docs-css-class-mode`: Actualización de la documentación en la app web de `docs/` para enseñar el uso del CSS Class mode, su marcado en HTML nativo y las funciones idempotentes de registro.

### Modified Capabilities


## Impact

- Modificación de la app de Vite/React de documentación (carpeta `docs/`), específicamente agregando contenido en `docs/src/content.ts` o los componentes internos que renderizan la documentación de cada componente.
- No impacta el código de la librería `@fethabo/animated-ui` ni sus builds, es únicamente un cambio del sitio web de referencia.
