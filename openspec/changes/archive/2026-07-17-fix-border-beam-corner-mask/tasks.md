## 1. Componente

- [x] 1.1 Agregar la máscara de anillo a `.aui-border-beam-layer` en el CSS inyectado de `src/components/BorderBeam/index.tsx` (`mask-image` doble + `mask-clip: padding-box, border-box` + `mask-composite: intersect` + `padding` igual a `--aui-beam-border-width`), validando que solo se pinte el anillo (D1 del design)
- [x] 1.2 Ampliar el gate `@supports` para que el cometa solo se muestre con soporte de `offset-path: border-box` **y** del enmascarado compuesto; sin cualquiera de los dos, el cometa se oculta sin afectar contenedor ni children (D2)
- [x] 1.3 Verificar que el realce estático de reduced motion (`box-shadow: inset` sobre la capa) sigue viéndose correcto con la máscara aplicada; si la máscara lo degrada, limitarla al estado animado (D2/riesgos del design)
- [x] 1.4 Reescribir el comentario del CSS y el docstring del componente para describir el mecanismo real: cabeza sobre el path + estela recortada al anillo por la máscara (D3); sin cambios en `types.ts`

## 2. Ejemplo standalone

- [x] 2.1 Aplicar la misma máscara, gate `@supports` y comentario corregido a `examples/border-beam.tsx` (D4)

## 3. Verificación

- [x] 3.1 Correr los tests existentes (`npx vitest run src/components/BorderBeam`) y `npx eslint` sobre los archivos modificados (repo sin ESLint configurado: no hay `eslint.config.*`/`.eslintrc*`, paso omitido; tests: 4/4 passed)
- [x] 3.2 Verificación visual en `test-app`: con `border-radius` grande y `size` largo, la estela dobla las esquinas sin sobresalir del contenedor ni cruzarlas en línea recta (scenario "Estela confinada al anillo") — confirmado con Playwright headless sobre el build actual (`size: 300`, `duration: 2.5s`): la estela dobla la esquina inferior izquierda pegada al anillo, sin salirse del contenedor
- [x] 3.3 Verificación visual del caso extremo `size` ≫ `border-radius` (el cometa puede acortarse un instante en esquinas — confirmar que lee bien) y del estado reduced motion — con `size: 300` (≫ `border-radius: 18`) el efecto se ve bien; el estado `respectReducedMotion` muestra el realce estático (`box-shadow: inset`) confinado correctamente al anillo, sin cometa
