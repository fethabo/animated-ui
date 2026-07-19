# glitch-text Specification (delta)

## ADDED Requirements

### Requirement: GlitchText es consumible en modo clase con cadencia default

El efecto SHALL ser consumible aplicando `class="aui-glitch"` más el atributo `data-text` (duplicando el texto plano del elemento), cumpliendo el contrato de la capability `css-class-mode`. `colors` e `intensity` SHALL estar disponibles como CSS vars; la cadencia (`frequency`, `burstDuration`) SHALL quedar en los defaults en los archivos CSS publicados, porque sus keyframes se generan por configuración. La función de registro MAY aceptar la configuración de cadencia y generar su variante en runtime. La receta SHALL documentar la duplicación manual del texto en `data-text` y la limitación de cadencia.

#### Scenario: Clase con data-text

- **WHEN** el consumer aplica `class="aui-glitch" data-text="ERROR"` a un elemento cuyo texto es "ERROR"
- **THEN** el glitch RGB-split SHALL ejecutarse con la cadencia default, con las capas desplazadas mostrando el mismo texto

#### Scenario: Cadencia custom requiere componente o registro

- **WHEN** el consumer necesita `frequency` o `burstDuration` distintos de los defaults usando solo el archivo CSS publicado
- **THEN** la receta SHALL indicar que debe usar el componente o la función de registro con configuración
