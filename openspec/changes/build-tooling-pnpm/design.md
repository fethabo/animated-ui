# build-tooling-pnpm — Design

## Contexto: por qué el bug es invisible localmente

```
                      import { build } from 'esbuild'
                      desde scripts/build-css.mjs
                                  │
                                  ▼
              ┌───────────────────────────────────────┐
              │  Node sube buscando node_modules/     │
              │  desde /repo/scripts/                 │
              └───────────────────────────────────────┘
                     │                        │
        LOCAL (npm)  │                        │  CI (pnpm)
                     ▼                        ▼
   node_modules/                     node_modules/
   ├── esbuild/        ← DIR REAL    ├── tsup -> .pnpm/tsup@8.5.1/…
   ├── tsup/                         ├── vitest -> …
   ├── typescript/                   ├── typescript -> …
   └── …139 entradas planas          │   (solo los 8 declarados)
                                     └── .pnpm/
          ✅ RESUELVE                     ├── esbuild@0.27.7/  ← acá está
                                          └── node_modules/
                                              └── esbuild  ← hoist interno,
                                                              invisible desde
                                                              la raíz del repo
                                          ❌ ERR_MODULE_NOT_FOUND
```

Evidencia recogida sobre el repo actual:

| Verificación | Resultado |
|---|---|
| `grep esbuild package.json` | no declarado |
| `node_modules/esbuild` | directorio real → layout npm |
| `node_modules/.package-lock.json` | existe → último install fue npm |
| `node_modules/.pnpm/esbuild@0.27.7` | existe → pnpm sí lo bajaba |
| `node_modules/.pnpm/node_modules/esbuild` | existe → hoisteado ahí adentro, fuera del alcance de `/scripts` |
| `pnpm --version` local | 10.28.2 |
| `pnpm/action-setup@v4` en CI | `version: 9` hardcodeado en ambos workflows |

## Decisión 1: declarar `esbuild`, no ajustar el layout

`esbuild` es una dependencia **directa** de los scripts del repo. Declararla es corregir el `package.json` para que diga la verdad, no un workaround.

| Alternativa | Por qué se descarta |
|---|---|
| `.npmrc` con `shamefully-hoist=true` | Enmascara el bug: el repo sigue dependiendo del layout del gestor y de suerte transitiva. El nombre de la opción es la advertencia. |
| Cambiar CI a `npm ci` | Alinea con el lock que se mantiene de verdad, pero deja el import indeclarado. El bug vuelve el día que alguien corra pnpm, o el día que `tsup` deje de depender de esbuild. |
| Correr `_generate-css.ts` con el TS nativo de Node 24 | Se investigó y no aplica: los imports son extensionless (`'../src/components/ShinyText/styles'`) y el type-stripping de Node no reescribe especificadores ni resuelve extensiones. Requeriría tocar todos los imports. |
| Importar los CSS desde `dist/` ya construido (el `build` corre `tsup` antes) | No aplica: `shinyCss`, `borderBeamCss`, `animatedBackgroundCss`, `glitchTextCss`, `buildGlitchCss` y `VARIANTS` **no** se exportan desde `src/index.ts` — son internos a propósito. Exponerlos para el build script sería ampliar la API pública por una razón equivocada. |

**Rango elegido: `^0.27.0`** — idéntico al que declara `tsup`. Esto hace que pnpm resuelva a la misma instancia 0.27.7 que ya está en el lock, en vez de crear una segunda copia. Un rango más laxo (`*`) o un pin exacto (`0.27.7`) romperían esa dedupe en el próximo bump de tsup.

Esto no viola el criterio de cero dependencias de runtime (`project-setup`): es `devDependencies`, y `files: ["dist"]` ya excluye `scripts/` del tarball publicado.

## Decisión 2: pnpm como único gestor, versión pineada

Hoy hay tres fuentes de verdad en conflicto: `package-lock.json`, `pnpm-lock.yaml`, y el `version: 9` hardcodeado en las actions. Con pnpm elegido, la cadena queda:

```
package.json → "packageManager": "pnpm@10.x"
                       │
       ┌───────────────┴────────────────┐
       ▼                                ▼
  local: corepack 0.31.0          CI: pnpm/action-setup@v4
  respeta packageManager          sin `version:` → lee packageManager
       │                                │
       └──────────► pnpm-lock.yaml ◄────┘
                    (único lockfile de la raíz)
```

Sacarle el `version: 9` a la action es parte del fix, no cosmética: si se regenera el lock con pnpm 10 local y CI sigue en pnpm 9, se cambia un skew por otro. Las dos versiones escriben `lockfileVersion: 9.0`, así que el desajuste no fallaría ruidosamente — se manifestaría como comportamiento distinto entre entornos, que es exactamente el problema que este change viene a cerrar.

`--frozen-lockfile` explícito en CI: pnpm ya lo activa solo cuando detecta `CI=true`, pero escribirlo documenta la intención y hace que un `package.json` editado sin regenerar el lock falle en el `install` con un mensaje claro, en vez de más adelante.

## Decisión 3: allowlistear el build script de `esbuild`

pnpm 10 cambió el default respecto de pnpm 9: **no corre lifecycle scripts de dependencias** salvo allowlist explícito. `esbuild/package.json` declara `postinstall: node install.js`.

```json
"pnpm": { "onlyBuiltDependencies": ["esbuild"] }
```

Grado de certeza al momento de escribir este diseño: esbuild 0.27 resuelve su binario vía `optionalDependencies` (`@esbuild/linux-x64` y hermanos, ya presentes en el lock), así que era **probable** que funcionara incluso con el postinstall bloqueado — pero no estaba verificado. El allowlist cuesta una línea y vuelve la pregunta irrelevante.

**Resultado verificado (tarea 4.1):** con el allowlist puesto, `pnpm install` en pnpm 10.28.2 reporta

```
.../esbuild@0.27.7/node_modules/esbuild postinstall$ node install.js
.../esbuild@0.27.7/node_modules/esbuild postinstall: Done
```

y **no** emite ningún warning de *ignored build scripts*. Queda como comportamiento observado, no inferido. No se probó el escenario contrario (sin allowlist), así que la pregunta de si esbuild se recupera solo sigue abierta — y deliberadamente irrelevante.

## Decisión 4: `docs/` se queda en npm

`docs/` tiene su propio `package.json` + `package-lock.json` trackeado y consume la librería por `file:..`. Los pasos `npm install && npm run build` de `deploy-docs.yml` son deliberados. Mezclar el gestor del subproyecto en este change ampliaría el alcance sin resolver nada.

Consecuencia de diseño: el guard de `.gitignore` tiene que ser **anclado** (`/package-lock.json`, con slash inicial) para no ignorar `docs/package-lock.json`. Un patrón sin anclar rompería el deploy de la docs al dejar su lock fuera del repo.

## Riesgo: el `node_modules` actual produce falsos positivos

El `node_modules` de trabajo es un híbrido: directorios reales de npm (install de jul 27) **más** un `.pnpm/` residual (jun 16). En ese estado, `pnpm run build` puede pasar por la razón equivocada — resolviendo el `esbuild` real que dejó npm, no el que declaramos.

Por eso toda validación arranca con `rm -rf node_modules`. Sin eso, el change se puede declarar terminado sin haber probado nada.

## Drift de versiones: medido, no asumido

Se comparó dep por dep el árbol resuelto de ambos lockfiles antes de escribir este change:

| dep | package-lock.json | pnpm-lock.yaml |
|---|---|---|
| tsup | 8.5.1 | 8.5.1 |
| typescript | 5.9.3 | 5.9.3 |
| vitest | 4.1.9 | 4.1.9 |
| vite | 8.0.16 | 8.0.16 |
| esbuild | 0.27.7 | 0.27.7 |
| jsdom | 24.1.3 | 24.1.3 |
| react / react-dom | 18.3.1 | 18.3.1 |
| @types/react | 18.3.31 | 18.3.31 |
| @types/react-dom | 18.3.7 | 18.3.7 |

Idénticos. La diferencia de mtime entre los locks (jun 16 vs jul 27) no implica drift de versiones. Esto baja el riesgo del change de forma sustancial: regenerar `pnpm-lock.yaml` debería mover solo metadata, no resoluciones — y en particular no debería re-disparar el requisito de `jsx: react-jsx` de vitest 4, porque vitest/vite no se mueven.

Si al regenerar aparecen versiones nuevas, es señal de que hay algo más en juego y hay que entenderlo antes de mergear, no aceptarlo como ruido.

## Efecto lateral resuelto de yapa

`scripts/treeshake-check.mjs:8` tiene el mismo `import { build } from 'esbuild'`. Hoy no explota porque ningún workflow lo corre, pero es la misma bomba con otro fusible. La declaración lo cubre sin tocar el archivo. Se incluye en la verificación para confirmarlo.
