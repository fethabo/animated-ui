# build-tooling-pnpm

## Why

El workflow de publish falla en `pnpm run build` con `ERR_MODULE_NOT_FOUND: Cannot find package 'esbuild' imported from scripts/build-css.mjs`. La causa no es CI: `scripts/build-css.mjs` importa `esbuild` directamente pero `esbuild` **no está declarado** en `package.json` — es una dependencia transitiva de `tsup` (que pide `^0.27.0`) y de `vite`/`vitest`.

Eso hace que el build funcione o rompa según qué gestor armó `node_modules`:

- **npm** (lo que se usa local) hoistea todo plano: `node_modules/esbuild` existe en la raíz y el import resuelve por accidente.
- **pnpm** (lo que usa CI) usa layout estricto con symlinks: solo los 8 devDeps declarados quedan linkeados en la raíz. `esbuild` vive en `node_modules/.pnpm/esbuild@0.27.7/` y su hoist va a `node_modules/.pnpm/node_modules/`, que está en el path de resolución de los paquetes *dentro* de `.pnpm` — no de un archivo en la raíz del repo como `scripts/build-css.mjs`.

El repo tiene además **dos lockfiles en la raíz** (`package-lock.json` mantenido y activo, `pnpm-lock.yaml` con un solo commit) y ningún campo `packageManager`, así que dev y CI resuelven árboles distintos por accidente. Este error es el primer síntoma de esa ambigüedad, no el problema completo: mientras convivan los dos locks van a seguir apareciendo divergencias de a una, y en el peor momento (durante un release).

La decisión tomada es **unificar la raíz en pnpm**.

## What Changes

- `esbuild` pasa a ser `devDependency` declarada con rango `^0.27.0` (idéntico al de `tsup`, para que pnpm deduplique al 0.27.7 que ya está en el lock, sin segunda copia). Cubre los dos consumidores directos: `scripts/build-css.mjs` y `scripts/treeshake-check.mjs`.
- pnpm queda como único gestor de la raíz, pineado con `packageManager` en `package.json`. Se elimina `package-lock.json` de la raíz y se regenera `pnpm-lock.yaml`.
- Los workflows dejan de hardcodear `version: 9` en `pnpm/action-setup@v4` para que la versión salga del `packageManager` (una sola fuente de verdad), y usan `--frozen-lockfile` explícito.
- Se allowlistea el build script de `esbuild` vía `onlyBuiltDependencies`, porque pnpm 10 no corre lifecycle scripts de dependencias por defecto.
- Guard para que `package-lock.json` no reaparezca en la raíz (entrada `/package-lock.json` en `.gitignore`, anclada para no afectar `docs/package-lock.json`).

## Non-goals

- **`docs/` no migra.** Es subproyecto aparte, tiene su propio `package-lock.json` trackeado y consume la librería vía `file:..`. Los pasos `npm install && npm run build` de `deploy-docs.yml` son intencionales y quedan como están.
- No se toca la lógica de `_generate-css.ts` ni el pipeline de generación de CSS. Solo se declara la dependencia que ya se usaba.
- No se cambian versiones de dependencias. La regeneración del lock debe ser no-op en versiones (ver Impact).

## Capabilities

### New Capabilities

- `build-tooling`: contrato del toolchain del repo — todo paquete importado por un script del repo SHALL estar declarado en `package.json`; la raíz SHALL tener un único gestor de paquetes pineado y un único lockfile; CI SHALL instalar con lockfile congelado; los build scripts de dependencias que el toolchain necesita SHALL estar allowlisteados explícitamente.

## Impact

- **Modificado**: `package.json` (devDep `esbuild`, campo `packageManager`, bloque `pnpm.onlyBuiltDependencies`), `.gitignore`, `.github/workflows/publish.yml`, `.github/workflows/deploy-docs.yml`.
- **Eliminado**: `package-lock.json` (raíz únicamente).
- **Regenerado**: `pnpm-lock.yaml` con pnpm 10.
- **Sin cambios de código**: ningún archivo de `src/`. `scripts/build-css.mjs` y `scripts/treeshake-check.mjs` quedan intactos — el fix es declarativo.
- **Riesgo de drift acotado y medido**: se compararon los dos lockfiles dep por dep y resuelven versiones **idénticas** (tsup 8.5.1, typescript 5.9.3, vitest 4.1.9, vite 8.0.16, esbuild 0.27.7, jsdom 24.1.3, react/react-dom 18.3.1, @types/react 18.3.31). La divergencia entre locks es de layout, no de versiones, así que regenerar es esperable como no-op. Si aparece drift, es señal de que algo más cambió y hay que revisarlo antes de mergear.
- **Riesgo principal**: los build scripts bloqueados por pnpm 10. `esbuild` tiene `postinstall: node install.js`; esbuild 0.27 normalmente resuelve el binario vía `optionalDependencies` (`@esbuild/linux-x64`, ya en el lock) aunque el postinstall no corra, pero esto **hay que verificarlo empíricamente**, no asumirlo. El allowlist elimina la duda a costo cero.
- **Verificación no salteable**: el `node_modules` actual es un híbrido npm+pnpm (directorios reales de npm *más* un `.pnpm/` residual), así que da falsos positivos. Toda validación arranca con `rm -rf node_modules`.
