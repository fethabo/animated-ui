# build-tooling-pnpm — Tasks

## 0. Punto de partida limpio (bloqueante)

- [x] 0.1 `rm -rf node_modules` — el `node_modules` actual es un híbrido npm+pnpm (directorios reales de npm + `.pnpm/` residual) y produce falsos positivos en toda validación posterior. Sin este paso, el resto de las tareas no prueban nada.
- [x] 0.2 Registrar la versión exacta de pnpm local (`pnpm --version`, hoy 10.28.2) para usarla en el campo `packageManager`

## 1. Declarar la dependencia faltante

- [x] 1.1 Agregar `"esbuild": "^0.27.0"` a `devDependencies` de `package.json` — mismo rango que declara `tsup`, para que pnpm deduplique a la instancia 0.27.7 ya presente en el lock en vez de crear una segunda copia
- [x] 1.2 Verificar que no queda ningún otro import de paquete indeclarado en `scripts/`: los imports por nombre deben estar todos en `devDependencies` (los conocidos son `esbuild` en `build-css.mjs` y `treeshake-check.mjs`, y `react`/`react-dom` en `ssr-check.mjs`, que ya están declarados)

## 2. Unificar en pnpm

- [x] 2.1 Agregar `"packageManager": "pnpm@<versión de 0.2>"` a `package.json`
- [x] 2.2 Agregar `"pnpm": { "onlyBuiltDependencies": ["esbuild"] }` a `package.json` — pnpm 10 no corre lifecycle scripts de dependencias por defecto y `esbuild` declara `postinstall: node install.js`
- [x] 2.3 Eliminar `package-lock.json` de la **raíz** únicamente; `docs/package-lock.json` NO se toca
- [x] 2.4 Agregar `/package-lock.json` a `.gitignore` — **con el slash inicial**, anclado a la raíz. Sin anclar, ignoraría `docs/package-lock.json` y rompería el deploy de la docs
- [x] 2.5 Regenerar `pnpm-lock.yaml` con pnpm 10 (`pnpm install`)

## 3. Alinear los workflows

- [x] 3.1 `publish.yml`: quitar `version: 9` de `pnpm/action-setup@v4` para que la versión salga de `packageManager`
- [x] 3.2 `publish.yml`: `pnpm install` → `pnpm install --frozen-lockfile`
- [x] 3.3 `deploy-docs.yml`: mismos dos cambios en el paso de build de la librería (líneas del `pnpm/action-setup` y del `pnpm install`)
- [x] 3.4 `deploy-docs.yml`: confirmar que los pasos `npm install && npm run build` con `working-directory: docs` quedan **sin modificar** — el subproyecto docs sigue en npm por diseño

## 4. Verificación

- [x] 4.1 `pnpm install` desde cero y **leer la salida**: anotar si reporta *ignored build scripts*. Confirma o descarta empíricamente la duda sobre el `postinstall` de esbuild documentada en `design.md`, en vez de asumirla
- [x] 4.2 Confirmar que `esbuild` quedó resoluble desde la raíz con layout estricto: `node -e "import('esbuild').then(m => console.log(typeof m.build))"` desde la raíz del repo
- [x] 4.3 `pnpm run build` — el comando que fallaba. Debe completarse y generar `dist/css/*.css`
- [x] 4.4 `node scripts/treeshake-check.mjs` — misma bomba latente que `build-css.mjs`, nunca ejercitada en CI. Debe pasar
- [x] 4.5 `node scripts/ssr-check.mjs`
- [x] 4.6 `pnpm test` y `pnpm run typecheck`
- [x] 4.7 Revisar el diff de `pnpm-lock.yaml`: **se espera no-op en versiones resueltas** (se verificó que ambos lockfiles resolvían idénticas versiones antes del change). Si aparecen versiones nuevas, entenderlas antes de mergear en vez de aceptarlas como ruido — puede indicar que algo más cambió
- [x] 4.8 Confirmar con `git status` que `docs/package-lock.json` sigue trackeado y sin cambios

## 5. Validación end-to-end del publish

- [ ] 5.1 Disparar `publish.yml` por `workflow_dispatch` para ejercitar `pnpm install --frozen-lockfile` + `pnpm run build` en CI real. Nota: `workflow_dispatch` llega hasta `npm publish`, así que evaluar si conviene correrlo sobre una versión ya publicada (el publish fallará por versión duplicada, después de haber probado el build) o esperar al próximo release real
- [x] 5.2 Verificar que la cadena `publish → deploy-docs` sigue enganchada: el `workflow_run` de `deploy-docs.yml` matchea el nombre exacto `"Publish to NPM"`, que este change no toca
