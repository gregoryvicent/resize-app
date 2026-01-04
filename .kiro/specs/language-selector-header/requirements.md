# Documento de Requisitos

## Introducción

Este documento describe los requisitos para implementar un selector de idioma en el componente Header de la aplicación Resize Images. El selector reemplazará el botón "Comenzar" existente y permitirá a los usuarios alternar entre español e inglés, utilizando los archivos de traducción ya existentes (es.json y en.json).

## Glosario

- **Header**: Componente de encabezado principal de la aplicación ubicado en la parte superior de todas las páginas
- **Selector de Idioma**: Componente desplegable (dropdown) que permite al usuario elegir entre los idiomas disponibles
- **Sistema de i18n**: Sistema de internacionalización existente que gestiona las traducciones mediante archivos JSON
- **Locale**: Código de idioma (ej: 'es' para español, 'en' para inglés)

## Requisitos

### Requisito 1

**Historia de Usuario:** Como usuario de la aplicación, quiero poder cambiar el idioma de la interfaz entre español e inglés, para que pueda usar la aplicación en mi idioma preferido.

#### Criterios de Aceptación

1. CUANDO un usuario visualiza el Header ENTONCES el sistema DEBERÁ mostrar un selector de idioma en lugar del botón "Comenzar"
2. CUANDO un usuario hace clic en el selector de idioma ENTONCES el sistema DEBERÁ mostrar un menú desplegable con las opciones "Español" e "English"
3. CUANDO un usuario selecciona un idioma del menú desplegable ENTONCES el sistema DEBERÁ cambiar todas las traducciones de la aplicación al idioma seleccionado
4. CUANDO un usuario selecciona un idioma ENTONCES el sistema DEBERÁ cerrar el menú desplegable automáticamente
5. CUANDO el idioma cambia ENTONCES el sistema DEBERÁ actualizar el texto del selector para mostrar el idioma actualmente seleccionado

### Requisito 2

**Historia de Usuario:** Como usuario, quiero que el selector de idioma sea visualmente consistente con el diseño existente, para que la interfaz se vea cohesiva y profesional.

#### Criterios de Aceptación

1. CUANDO el selector de idioma se renderiza ENTONCES el sistema DEBERÁ usar los colores de la paleta de marca (brand-purple, brand-secondary, brand-accent)
2. CUANDO un usuario pasa el cursor sobre el selector ENTONCES el sistema DEBERÁ mostrar un efecto hover con transición suave
3. CUANDO el menú desplegable está abierto ENTONCES el sistema DEBERÁ tener un fondo con backdrop-blur y bordes consistentes con el diseño
4. CUANDO el selector se muestra en dispositivos móviles ENTONCES el sistema DEBERÁ mantener un tamaño táctil mínimo de 44x44px
5. CUANDO el selector tiene foco del teclado ENTONCES el sistema DEBERÁ mostrar un anillo de enfoque visible usando focus:ring-2 focus:ring-brand-purple

### Requisito 3

**Historia de Usuario:** Como usuario, quiero que el selector de idioma sea accesible mediante teclado y lectores de pantalla, para que todos puedan usar la funcionalidad independientemente de sus capacidades.

#### Criterios de Aceptación

1. CUANDO un usuario navega con teclado ENTONCES el sistema DEBERÁ permitir abrir y cerrar el selector usando las teclas Enter y Escape
2. CUANDO un usuario navega con teclado ENTONCES el sistema DEBERÁ permitir seleccionar opciones usando las teclas de flecha arriba/abajo y Enter
3. CUANDO un lector de pantalla lee el selector ENTONCES el sistema DEBERÁ proporcionar etiquetas aria-label descriptivas
4. CUANDO el menú desplegable está abierto ENTONCES el sistema DEBERÁ establecer aria-expanded="true" en el botón del selector
5. CUANDO el menú desplegable está cerrado ENTONCES el sistema DEBERÁ establecer aria-expanded="false" en el botón del selector

### Requisito 4

**Historia de Usuario:** Como usuario, quiero que mis traducciones se actualicen en toda la aplicación cuando cambio el idioma, para que toda la interfaz refleje mi selección de idioma.

#### Criterios de Aceptación

1. CUANDO un usuario cambia el idioma ENTONCES el sistema DEBERÁ actualizar todas las traducciones del Header (navegación, logo)
2. CUANDO un usuario cambia el idioma ENTONCES el sistema DEBERÁ actualizar todas las traducciones del HeroSection
3. CUANDO un usuario cambia el idioma ENTONCES el sistema DEBERÁ actualizar todas las traducciones del ImageUploader
4. CUANDO un usuario cambia el idioma ENTONCES el sistema DEBERÁ cargar el archivo JSON correspondiente (es.json o en.json)
5. CUANDO las traducciones se están cargando ENTONCES el sistema DEBERÁ mantener el idioma anterior visible hasta que las nuevas traducciones estén disponibles

### Requisito 5

**Historia de Usuario:** Como usuario, quiero que el selector de idioma funcione correctamente en todos los tamaños de pantalla, para que pueda cambiar el idioma desde cualquier dispositivo.

#### Criterios de Aceptación

1. CUANDO el selector se muestra en pantallas móviles (< 640px) ENTONCES el sistema DEBERÁ mostrar el selector con tamaño y espaciado apropiados
2. CUANDO el selector se muestra en pantallas tablet (640px - 1024px) ENTONCES el sistema DEBERÁ mantener la funcionalidad completa del desplegable
3. CUANDO el selector se muestra en pantallas desktop (> 1024px) ENTONCES el sistema DEBERÁ mostrar el selector junto a los elementos de navegación
4. CUANDO el menú desplegable se abre en móvil ENTONCES el sistema DEBERÁ posicionar el menú para que no se salga de la pantalla
5. CUANDO el usuario interactúa con el selector en pantalla táctil ENTONCES el sistema DEBERÁ responder apropiadamente a eventos touch

### Requisito 6

**Historia de Usuario:** Como desarrollador, quiero que el selector de idioma use el sistema de i18n existente, para mantener la consistencia del código y facilitar el mantenimiento.

#### Criterios de Aceptación

1. CUANDO el selector de idioma se implementa ENTONCES el sistema DEBERÁ usar el hook useTranslations existente de lib/i18n.ts
2. CUANDO el selector cambia el idioma ENTONCES el sistema DEBERÁ llamar a la función setLocale del hook useTranslations
3. CUANDO se agregan traducciones para el Header ENTONCES el sistema DEBERÁ añadirlas a los archivos es.json y en.json existentes
4. CUANDO el componente Header se renderiza ENTONCES el sistema DEBERÁ ser un Client Component (usar 'use client')
5. CUANDO el selector lee el idioma actual ENTONCES el sistema DEBERÁ obtenerlo de la propiedad locale del hook useTranslations
