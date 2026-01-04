# Plan de Implementación

- [x] 1. Agregar traducciones del Header a los archivos JSON
  - Agregar la sección "header" con traducciones de navegación y selector de idioma a es.json y en.json
  - Actualizar la interfaz Translations en lib/i18n.ts para incluir los nuevos campos
  - _Requirements: 6.3_

- [x] 2. Crear componente LanguageSelector
- [x] 2.1 Crear estructura base del componente LanguageSelector
  - Crear carpeta components/LanguageSelector/
  - Crear archivo index.tsx con el componente principal
  - Definir props interface (currentLocale, onLocaleChange)
  - Implementar estado local para isOpen
  - _Requirements: 1.1, 6.1_

- [x] 2.2 Implementar lógica de apertura/cierre del menú
  - Agregar función toggleMenu para abrir/cerrar
  - Implementar useEffect para cerrar al hacer clic fuera
  - Implementar cierre con tecla Escape
  - Limpiar event listeners en cleanup
  - _Requirements: 1.2, 1.4, 3.1_

- [x] 2.3 Crear componente LanguageSelectorButton
  - Crear archivo LanguageSelectorButton.tsx
  - Implementar botón con icono de globo/chevron
  - Mostrar nombre del idioma actual
  - Aplicar estilos con colores de marca y efectos hover
  - Agregar atributos ARIA (aria-expanded, aria-label)
  - _Requirements: 1.5, 2.1, 2.2, 2.4, 2.5, 3.3, 3.4, 3.5_

- [x] 2.4 Crear componente LanguageDropdownMenu
  - Crear archivo LanguageDropdownMenu.tsx
  - Renderizar condicionalmente basado en isOpen
  - Mostrar opciones para Español e English
  - Marcar visualmente la opción seleccionada
  - Aplicar estilos con backdrop-blur y bordes
  - Manejar clicks en opciones y llamar a onSelectLocale
  - _Requirements: 1.2, 1.3, 2.3, 5.1, 5.3_

- [ ]* 2.5 Escribir unit tests para LanguageSelector
  - Test: selector se renderiza con idioma actual
  - Test: hacer clic abre el menú
  - Test: menú muestra ambas opciones
  - Test: hacer clic en opción llama a onLocaleChange
  - Test: aria-expanded está presente y correcto
  - Test: aria-label está presente
  - _Requirements: 1.1, 1.2, 1.3, 3.3, 3.4, 3.5_

- [ ]* 2.6 Escribir property test para cambio de idioma invoca setLocale
  - **Property 1: Cambio de idioma invoca setLocale**
  - **Validates: Requirements 1.3, 6.2**
  - Generar locale aleatorio ('es' o 'en')
  - Verificar que setLocale se llama con ese locale

- [ ]* 2.7 Escribir property test para selección cierra el menú
  - **Property 2: Selección cierra el menú**
  - **Validates: Requirements 1.4**
  - Generar locale aleatorio
  - Verificar que después de seleccionar, isOpen es false

- [ ]* 2.8 Escribir property test para texto del selector
  - **Property 3: Texto del selector refleja idioma actual**
  - **Validates: Requirements 1.5**
  - Generar locale aleatorio
  - Verificar que el texto corresponde al idioma

- [ ]* 2.9 Escribir property test para aria-expanded
  - **Property 4: aria-expanded refleja estado del menú**
  - **Validates: Requirements 3.4, 3.5**
  - Generar estado booleano aleatorio
  - Verificar que aria-expanded coincide con el estado

- [x] 3. Modificar componente Header para usar LanguageSelector
- [x] 3.1 Convertir Header a Client Component
  - Agregar 'use client' al inicio del archivo
  - Importar y usar el hook useTranslations
  - Manejar estado de carga (isLoading)
  - _Requirements: 6.4, 6.1, 6.5_

- [x] 3.2 Integrar LanguageSelector en Header
  - Importar componente LanguageSelector
  - Reemplazar botón "Comenzar" con LanguageSelector
  - Pasar locale y setLocale como props
  - _Requirements: 1.1, 6.2_

- [x] 3.3 Usar traducciones en elementos del Header
  - Actualizar enlaces de navegación para usar translations.header.nav
  - Actualizar texto del logo si es necesario
  - _Requirements: 4.1_

- [ ]* 3.4 Escribir unit tests para Header modificado
  - Test: Header usa useTranslations
  - Test: Header es Client Component
  - Test: enlaces de navegación usan traducciones
  - Test: LanguageSelector está presente
  - _Requirements: 6.1, 6.4, 4.1, 1.1_

- [ ]* 3.5 Escribir property test para actualización de traducciones
  - **Property 5: Cambio de idioma actualiza todas las traducciones**
  - **Validates: Requirements 4.1, 4.2, 4.3**
  - Generar locale aleatorio
  - Verificar que todas las secciones usan traducciones del nuevo locale

- [ ]* 3.6 Escribir property test para carga de archivo JSON
  - **Property 6: Cambio de idioma carga archivo JSON correcto**
  - **Validates: Requirements 4.4**
  - Generar locale aleatorio
  - Verificar que loadTranslations se llama con el locale correcto

- [x] 4. Checkpoint - Asegurar que todas las pruebas pasan
  - Asegurar que todas las pruebas pasan, preguntar al usuario si surgen dudas.

- [x] 5. Verificar integración completa
- [x] 5.1 Verificar que HeroSection usa traducciones actualizadas
  - Confirmar que HeroSection ya usa useTranslations
  - Verificar que las traducciones se actualizan al cambiar idioma
  - _Requirements: 4.2_

- [x] 5.2 Verificar que ImageUploader usa traducciones actualizadas
  - Confirmar que ImageUploader ya usa useTranslations
  - Verificar que las traducciones se actualizan al cambiar idioma
  - _Requirements: 4.3_

- [x] 5.3 Verificar comportamiento durante carga de traducciones
  - Verificar que las traducciones anteriores permanecen visibles durante isLoading
  - Verificar que no hay parpadeos o contenido vacío
  - _Requirements: 4.5_

- [ ]* 5.4 Escribir integration test para flujo completo
  - Test: usuario abre selector, selecciona idioma, traducciones se actualizan, menú se cierra
  - Test: idioma seleccionado persiste en la sesión
  - _Requirements: 1.2, 1.3, 1.4, 4.1, 4.2, 4.3_

- [ ] 6. Checkpoint final - Asegurar que todas las pruebas pasan
  - Asegurar que todas las pruebas pasan, preguntar al usuario si surgen dudas.
