# Design — harden-docs-deploy

## Contexto

Evidencia del release `0.7.2` (run 29306314409):

- `release: published` a las 04:34:40 disparó **ambos** workflows en paralelo.
- Publish terminó OK a las ~04:35:18 (38s).
- Deploy-docs falló a las 04:35:45 en `Setup SSH key`: `ssh-keyscan` arrancó 04:35:40 y murió exactamente 5s después (su timeout default), exit 1, con stderr redirigido a `/dev/null`. Fallo transitorio del lado del servidor/red; el re-run manual (attempt 2) anduvo.

Conclusión: el fallo observado fue de conexión SSH, no de ordering. Pero el ordering tiene un problema propio: si el publish falla, la docs se deploya igual (la docs se buildea desde `file:..`, no depende de npm, así que el build sale aunque el paquete no exista).

## Decisión 1: `workflow_run` en lugar de `release` + `needs`

Alternativas consideradas:

| Opción | Pros | Contras |
|---|---|---|
| Unir todo en un workflow con `needs` | Encadenamiento nativo, atómico | Mezcla permisos (`id-token: write` del publish con secrets SSH); un re-run re-publica o hay que filtrar jobs |
| `workflow_run` (elegida) | Workflows separados, permisos separados, re-run del deploy no toca npm | El checkout default NO es el tag; el nombre del workflow publish pasa a ser contrato |
| Polling a npm desde deploy-docs | No acopla workflows | Frágil, lento, no distingue "todavía no" de "falló" |

`workflow_run` solo dispara para workflows definidos en la rama default — `publish.yml` vive en `main`, se cumple.

### Guardas del trigger

El job de deploy corre solo si:

```
github.event_name == 'workflow_dispatch' ||
(github.event.workflow_run.conclusion == 'success' &&
 github.event.workflow_run.event == 'release')
```

- `conclusion == 'success'`: si el publish falla, la web no cambia (requirement).
- `event == 'release'`: un publish lanzado por `workflow_dispatch` manual corre sobre `main`, y deployar docs desde ahí violaría "la web refleja solo tags publicados". Si algún día se quiere ese flujo, se corre el deploy manual aparte.

## Decisión 2: checkout de `workflow_run.head_sha`

Con `workflow_run`, el checkout default apunta al commit de la rama default, no al tag de la release. Para conservar "la web se buildea desde el tag publicado":

```yaml
- uses: actions/checkout@v5
  with:
    ref: ${{ github.event.workflow_run.head_sha || github.ref }}
```

`head_sha` del run del publish disparado por release es el commit del tag. El fallback `github.ref` cubre el caso `workflow_dispatch` (comportamiento actual: la ref desde la que se dispara).

## Decisión 3: resiliencia SSH

- `ssh-keyscan -T 15` (timeout explícito) con hasta 5 intentos y espera incremental entre intentos (~10s base). El fallo observado se resolvió solo con ~2 minutos de espera; 5 intentos con backoff cubren ese perfil sin colgar el job indefinidamente.
- **No** redirigir stderr a `/dev/null`: el motivo del fallo tiene que quedar en el log.
- Tras el loop, validar que `~/.ssh/known_hosts` contiene al menos una entrada; si no, fallar con mensaje explícito.
- `rsync` con hasta 3 intentos (mismo patrón de retry), porque la misma inestabilidad puede aparecer en la transferencia. `--delete` es idempotente entre reintentos.
- Se mantiene el grupo de `concurrency` existente (`deploy-docs`, cancel-in-progress).

## Riesgos

- **Renombrar `Publish to NPM` rompe el trigger silenciosamente** (el deploy simplemente no se dispara). Mitigación: comentario cruzado en ambos YAML.
- `workflow_run.head_sha` en un publish re-corrido (re-run del publish de una release) sigue siendo el commit del tag — correcto.
- Si el publish de una release falla y se corrige re-corriéndolo, el `workflow_run` se dispara de nuevo al pasar a `success` — el deploy sale solo, sin intervención. Comportamiento deseado.
