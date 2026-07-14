## Context

Cambio doc-only. La documentación online ya está desplegada en `https://animated-ui-docs.fethabo.cloud`. El README (línea ~26) enlaza solo la carpeta local `docs/`; `package.json.homepage` apunta al README de GitHub. Falta un puntero descubrible a la doc online desde npm.

## Goals / Non-Goals

**Goals:**
- El README enlaza la URL de la documentación online, explicando que ahí está la documentación completa y los ejemplos de la última versión.
- El campo `homepage` del paquete lleva a la documentación online.

**Non-Goals:**
- No se agrega badge/estética nueva ni se reescribe el README.
- No se cambia el deploy ni la infraestructura de la doc.
- No se toca el código del paquete.

## Decisions

### D1 — Conservar el link a `docs/` y agregar el link online
Se mantiene la referencia a la carpeta [`docs/`](docs/) (útil para contribuidores) y se antepone/destaca el link a la URL publicada (útil para consumidores desde npm). Una sola línea clara con ambos, sin duplicar secciones.

- **Alternativa considerada:** reemplazar por completo el link a `docs/`. Rechazada: la carpeta local sigue siendo relevante para quien clona el repo.

### D2 — `homepage` → documentación online
Se cambia `package.json.homepage` de `https://github.com/fethabo/animated-ui#readme` a `https://animated-ui-docs.fethabo.cloud`. Es el destino natural del link "homepage" que npm muestra en la página del paquete.

- **Alternativa considerada:** dejar `homepage` en GitHub y solo tocar el README. Rechazada: el pedido incluye la "info del proyecto", y `homepage` es el campo de descubrimiento que ve el usuario de npm.

## Risks / Trade-offs

- **La URL podría caerse / cambiar** → El README y `homepage` quedarían con un link muerto. Mitigación: la URL ya está desplegada y es la canónica del proyecto; si cambia, es un edit trivial.

## Open Questions

- Ninguna.
