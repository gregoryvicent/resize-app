# Documento de Requisitos

## Introducción

Este documento define los requisitos para la sección Hero animada de la aplicación Resize Images. Esta sección será la primera que verán los usuarios al cargar la página, ubicada arriba de la interfaz de carga de imágenes. La funcionalidad presenta un mensaje central atractivo rodeado de rectángulos animados que representan diferentes tamaños de pantallas de redes sociales, creando una experiencia visual dinámica que comunica el propósito de la aplicación.

## Glosario

- **Sección Hero**: El área principal de presentación en la parte superior de la página que introduce el propósito de la aplicación
- **Título Central**: El texto principal "Selecciona una foto, súbela a todas partes" que comunica el valor de la aplicación
- **Rectángulo de Red Social**: Un elemento visual rectangular animado que representa el tamaño de imagen de una red social específica
- **Etiqueta de Red Social**: El texto que identifica la red social asociada a cada rectángulo (ej: "Instagram", "Facebook")
- **Secuencia de Animación**: El orden temporal en que los rectángulos aparecen y desaparecen
- **Estado de Visibilidad**: El estado de un rectángulo que puede ser visible u oculto
- **Transición de Opacidad**: El efecto visual de aparición o desaparición gradual de un rectángulo
- **Proporción de Aspecto**: La relación entre ancho y alto de cada rectángulo que representa el formato de imagen de cada red social

## Requisitos

### Requisito 1

**Historia de Usuario:** Como creador de contenido, quiero ver un mensaje claro y atractivo al cargar la página, para que entienda inmediatamente el propósito de la aplicación.

#### Criterios de Aceptación

1. WHEN la página se carga, THEN la Sección Hero SHALL mostrar el Título Central "Selecciona una foto, súbela a todas partes" en posición centrada
2. WHEN el Título Central se muestra, THEN la Sección Hero SHALL usar tamaño de fuente mínimo de 32 píxeles en dispositivos móviles y 48 píxeles en escritorio
3. WHEN el Título Central se renderiza, THEN la Sección Hero SHALL aplicar el color de texto usando la paleta definida del proyecto
4. WHEN la página se carga, THEN la Sección Hero SHALL ocupar el ancho completo del viewport con altura mínima de 400 píxeles en móvil y 500 píxeles en escritorio

### Requisito 2

**Historia de Usuario:** Como creador de contenido, quiero ver representaciones visuales de diferentes redes sociales, para que comprenda que la aplicación soporta múltiples plataformas.

#### Criterios de Aceptación

1. WHEN la Sección Hero se renderiza, THEN la Sección Hero SHALL mostrar un mínimo de 6 Rectángulos de Red Social representando diferentes plataformas
2. WHEN cada Rectángulo de Red Social se muestra, THEN la Sección Hero SHALL incluir una Etiqueta de Red Social visible que identifique la plataforma
3. WHEN se define cada Rectángulo de Red Social, THEN la Sección Hero SHALL usar la Proporción de Aspecto correcta correspondiente al formato de imagen de esa red social
4. WHEN los Rectángulos de Red Social se posicionan, THEN la Sección Hero SHALL distribuirlos alrededor del Título Central sin obstruir su legibilidad
5. WHEN se aplican estilos a los Rectángulos de Red Social, THEN la Sección Hero SHALL usar colores de la paleta del proyecto con bordes visibles

### Requisito 3

**Historia de Usuario:** Como creador de contenido, quiero ver animaciones fluidas de los rectángulos de redes sociales, para que la experiencia sea dinámica y atractiva visualmente.

#### Criterios de Aceptación

1. WHEN la página se carga, THEN la Sección Hero SHALL iniciar la Secuencia de Animación de los Rectángulos de Red Social automáticamente
2. WHEN un Rectángulo de Red Social cambia su Estado de Visibilidad, THEN la Sección Hero SHALL aplicar una Transición de Opacidad con duración entre 500 y 800 milisegundos
3. WHEN la Secuencia de Animación se ejecuta, THEN la Sección Hero SHALL mostrar y ocultar los rectángulos en orden predefinido sin superposiciones temporales
4. WHEN un Rectángulo de Red Social aparece, THEN la Sección Hero SHALL transicionar desde opacidad 0 hasta opacidad 1
5. WHEN un Rectángulo de Red Social desaparece, THEN la Sección Hero SHALL transicionar desde opacidad 1 hasta opacidad 0
6. WHEN la Secuencia de Animación completa un ciclo, THEN la Sección Hero SHALL reiniciar la secuencia automáticamente creando un loop continuo

### Requisito 4

**Historia de Usuario:** Como creador de contenido que usa dispositivos móviles, quiero que la sección Hero sea completamente funcional y visualmente atractiva en mi teléfono, para que tenga una buena experiencia en cualquier dispositivo.

#### Criterios de Aceptación

1. WHEN la página se carga en un dispositivo móvil, THEN la Sección Hero SHALL reducir el número de Rectángulos de Red Social visibles simultáneamente para evitar saturación visual
2. WHEN la página se carga en un dispositivo móvil, THEN la Sección Hero SHALL ajustar el tamaño de los Rectángulos de Red Social proporcionalmente al viewport
3. WHEN la página se carga en un dispositivo de escritorio, THEN la Sección Hero SHALL mostrar todos los Rectángulos de Red Social con tamaños más grandes
4. WHEN el usuario cambia la orientación del dispositivo, THEN la Sección Hero SHALL reposicionar los elementos manteniendo la composición visual equilibrada

### Requisito 5

**Historia de Usuario:** Como creador de contenido, quiero que la sección Hero siga los principios de diseño del proyecto, para que la experiencia sea consistente con el resto de la aplicación.

#### Criterios de Aceptación

1. WHEN la Sección Hero se renderiza, THEN la Sección Hero SHALL usar exclusivamente los colores definidos en la paleta del proyecto (#0A0028, #090040, #B13BFF, #471396, #FFCC00)
2. WHEN se aplica el fondo de la Sección Hero, THEN la Sección Hero SHALL usar el color de fondo de marca (#0A0028)
3. WHEN se estilizan los Rectángulos de Red Social, THEN la Sección Hero SHALL usar el color púrpura de marca (#B13BFF) para bordes o fondos
4. WHEN se muestran las Etiquetas de Red Social, THEN la Sección Hero SHALL usar tamaño de fuente mínimo de 12 píxeles con contraste adecuado
5. WHEN se aplican espaciados, THEN la Sección Hero SHALL usar múltiplos de 4 píxeles siguiendo la escala de Tailwind CSS

### Requisito 6

**Historia de Usuario:** Como creador de contenido con necesidades de accesibilidad, quiero que la sección Hero sea accesible, para que pueda percibir el contenido independientemente de mis capacidades.

#### Criterios de Aceptación

1. WHEN se muestran animaciones, THEN la Sección Hero SHALL respetar la preferencia del sistema operativo para movimiento reducido (prefers-reduced-motion)
2. WHEN el usuario tiene movimiento reducido activado, THEN la Sección Hero SHALL mostrar los Rectángulos de Red Social en estado estático sin animaciones
3. WHEN se muestra texto sobre fondos de color, THEN la Sección Hero SHALL mantener una relación de contraste mínima de 4.5:1 según WCAG AA
4. WHEN se renderizan elementos decorativos, THEN la Sección Hero SHALL marcar los Rectángulos de Red Social como decorativos para lectores de pantalla usando aria-hidden

### Requisito 7

**Historia de Usuario:** Como creador de contenido internacional, quiero que el título de la sección Hero esté disponible en mi idioma, para que pueda entender el mensaje en inglés o español según mi preferencia.

#### Criterios de Aceptación

1. WHEN la aplicación se carga, THEN la Sección Hero SHALL determinar el idioma del navegador del usuario y mostrar el Título Central en inglés o español
2. WHEN el idioma es español, THEN la Sección Hero SHALL mostrar "Selecciona una foto, súbela a todas partes"
3. WHEN el idioma es inglés, THEN la Sección Hero SHALL mostrar "Select a photo, upload it everywhere"
4. WHEN se muestran Etiquetas de Red Social, THEN la Sección Hero SHALL obtener los nombres de las redes sociales desde archivos de traducción JSON
5. WHEN se agregan nuevos textos a la Sección Hero, THEN la Sección Hero SHALL mantener ambas traducciones sincronizadas en los archivos JSON

### Requisito 8

**Historia de Usuario:** Como desarrollador del sistema, quiero que las animaciones sean eficientes y no afecten el rendimiento, para que la aplicación sea rápida y fluida en todos los dispositivos.

#### Criterios de Aceptación

1. WHEN las animaciones se ejecutan, THEN la Sección Hero SHALL usar propiedades CSS que activen aceleración por hardware (transform, opacity)
2. WHEN se implementa la Secuencia de Animación, THEN la Sección Hero SHALL evitar animaciones de propiedades que causen reflow (width, height, top, left)
3. WHEN múltiples Rectángulos de Red Social se animan, THEN la Sección Hero SHALL mantener una tasa de frames por segundo mínima de 30 FPS
4. WHEN la página se carga, THEN la Sección Hero SHALL inicializar las animaciones después de que el contenido crítico esté renderizado
