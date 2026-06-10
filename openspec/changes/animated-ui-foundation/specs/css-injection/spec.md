## ADDED Requirements

### Requirement: Los estilos se inyectan automáticamente sin imports del consumer
Los componentes SHALL inyectar sus estilos CSS necesarios (keyframes, CSS vars base) en el `<head>` del documento automáticamente al montarse, sin requerir ningún import de stylesheet por parte del consumer.

#### Scenario: Componente funciona sin import de CSS
- **WHEN** un consumer usa `<AnimatedBackground variant="aurora" />` sin ningún import de CSS
- **THEN** las animaciones SHALL funcionar correctamente

### Requirement: Los estilos se inyectan como máximo una vez por componente
El sistema SHALL verificar si los estilos de un componente ya fueron inyectados antes de agregar un nuevo `<style>` tag, evitando duplicación cuando múltiples instancias del mismo componente existen en la página.

#### Scenario: Múltiples instancias, un solo style tag
- **WHEN** el consumer renderiza tres instancias de `<PixelBackground>` en la misma página
- **THEN** el DOM SHALL contener exactamente un `<style>` tag correspondiente a los estilos de `PixelBackground`

### Requirement: La inyección no ocurre durante SSR
El sistema SHALL ejecutar la inyección de estilos únicamente en entornos donde `document` existe. En SSR el componente SHALL renderizar su markup sin lanzar errores.

#### Scenario: No hay error en SSR con Next.js
- **WHEN** un componente es renderizado en el servidor de Next.js
- **THEN** el servidor SHALL renderizar el markup HTML sin errores relacionados a `document`

#### Scenario: Las animaciones aparecen tras la hidratación
- **WHEN** el HTML renderizado en SSR llega al browser y React hidrata el componente
- **THEN** los estilos se inyectan y las animaciones SHALL comenzar a funcionar

### Requirement: Los style tags tienen IDs únicos y estables
Cada bloque de CSS inyectado SHALL identificarse con un `id` predecible y estable basado en el nombre del componente, facilitando debugging e inspección en DevTools.

#### Scenario: Style tag identificable en DevTools
- **WHEN** un developer inspecciona el `<head>` en DevTools del browser
- **THEN** SHALL ver tags con IDs del formato `aui-<component-name>-styles` (e.g., `aui-animated-background-styles`)

### Requirement: Los valores dinámicos de animación se exponen como CSS custom properties inline
Los valores de animación que varían con props (velocidad, colores, intensidad) SHALL setearse como CSS custom properties inline en el elemento root del componente, permitiendo que el consumer los pise via CSS en cascada.

#### Scenario: Override de CSS var desde stylesheet del consumer
- **WHEN** el consumer escribe `.my-bg { --aui-aurora-speed: 15s; }` en su CSS
- **THEN** el componente con className `my-bg` SHALL usar esa velocidad personalizada en lugar del default
