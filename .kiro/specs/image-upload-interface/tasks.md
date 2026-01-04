# Plan de Implementación

- [x] 1. Configurar Tailwind con colores de la paleta del proyecto
  - Extender `tailwind.config.ts` con los colores personalizados: brand-dark (#090040), brand-purple (#B13BFF), brand-secondary (#471396), brand-accent (#FFCC00)
  - Verificar que la configuración se aplica correctamente
  - _Requisitos: 5.1, 5.2_

- [x] 2. Crear archivos de traducción para internacionalización
  - Crear carpeta `locales/`
  - Crear `locales/en.json` con todas las traducciones en inglés
  - Crear `locales/es.json` con todas las traducciones en español
  - Incluir traducciones para: uploadZone (title, description, dragActive), uploadButton (label, ariaLabel), errors (invalidFormat, fileTooLarge, multipleFiles)
  - _Requisitos: 7.2, 7.3, 7.4, 7.5_

- [x] 3. Implementar utilidades de internacionalización
  - Crear `lib/i18n.ts` con función getBrowserLocale() para detectar idioma del navegador
  - Implementar función loadTranslations() para cargar archivos JSON de traducciones
  - Crear custom hook useTranslations() que detecta idioma y carga traducciones automáticamente
  - Definir tipos TypeScript: Translations, SupportedLocale
  - _Requisitos: 7.1, 7.2, 7.3, 7.4_

- [x] 3.1 Escribir property test para carga de traducciones
  - **Property 8: Carga de traducciones correctas**
  - **Valida: Requisitos 7.2, 7.3, 7.4**

- [x] 3.2 Escribir unit tests para utilidades i18n
  - Verificar que getBrowserLocale() retorna 'en' o 'es' correctamente
  - Verificar que loadTranslations() carga el archivo JSON correcto
  - Verificar fallback a inglés cuando el idioma no es soportado
  - _Requisitos: 7.1, 7.3, 7.4_

- [x] 4. Crear estructura de componentes y tipos TypeScript
  - Crear carpeta `components/ImageUploader/`
  - Definir interfaces en `types.ts`: `ImageUploaderProps`, `UploadZoneProps`, `UploadButtonProps`, `UploadIconProps`, `UseFileUploadReturn`, `FileUploadState`
  - _Requisitos: 1.1, 2.1, 3.1_

- [x] 5. Implementar custom hook useFileUpload
  - Crear `useFileUpload.ts` con lógica de estado para isDragging y selectedFile
  - Implementar handlers: handleDragEnter, handleDragLeave, handleDragOver, handleDrop
  - Implementar handleFileSelect para selección mediante botón
  - Implementar triggerFileInput y fileInputRef
  - Prevenir comportamiento por defecto del navegador en eventos de arrastre
  - _Requisitos: 1.2, 1.3, 1.4, 2.2, 2.3_

- [x] 5.1 Escribir property test para cambio de estado al arrastrar
  - **Property 1: Cambio de estado al arrastrar**
  - **Valida: Requisitos 1.2, 3.2**

- [x] 5.2 Escribir property test para restauración de estado
  - **Property 2: Restauración de estado al salir**
  - **Valida: Requisitos 1.4**

- [x] 5.3 Escribir property test para actualización de archivo
  - **Property 3: Actualización de estado al recibir archivo**
  - **Valida: Requisitos 1.3, 2.3**

- [x] 5.4 Escribir property test para activación del selector
  - **Property 4: Activación del selector de archivos**
  - **Valida: Requisitos 2.2**

- [x] 6. Crear componente UploadIcon
  - Implementar `UploadIcon.tsx` con SVG de nube y flecha hacia arriba
  - Hacer el ícono configurable por tamaño (default 64px)
  - Aplicar color adaptable según props
  - _Requisitos: 3.1_

- [x] 7. Crear componente UploadButton
  - Implementar `UploadButton.tsx` con estilos de la paleta
  - Aplicar color primario brand-purple con hover brand-secondary
  - Asegurar tamaño mínimo táctil de 44x44px (min-h-11)
  - Implementar transición suave de 200ms
  - Agregar atributos de accesibilidad usando traducciones: aria-label desde translations
  - Implementar indicador de foco visible con ring
  - Recibir translations como prop para textos dinámicos
  - _Requisitos: 2.1, 3.4, 4.2, 5.2, 6.1, 7.2_

- [x] 7.1 Escribir property test para estilos hover
  - **Property 5: Aplicación de estilos hover**
  - **Valida: Requisitos 3.4**

- [x] 7.2 Escribir property test para indicador de foco
  - **Property 6: Indicador de foco visible**
  - **Valida: Requisitos 6.1**

- [x] 7.3 Escribir property test para activación por teclado
  - **Property 7: Activación por teclado**
  - **Valida: Requisitos 6.4**

- [x] 7.4 Escribir unit tests para UploadButton
  - Verificar renderizado con texto correcto desde translations
  - Verificar que onClick se invoca al hacer clic
  - Verificar atributos de accesibilidad presentes
  - _Requisitos: 2.1, 6.3, 7.2_

- [x] 8. Crear componente UploadZone
  - Implementar `UploadZone.tsx` con área de arrastre y soltar
  - Aplicar estilos condicionales según isDragging: borde punteado gris (inactivo) vs borde sólido púrpura (activo)
  - Implementar fondo con opacidad cuando isDragging es true (bg-brand-purple/10)
  - Aplicar transiciones suaves (duration-200)
  - Configurar altura responsive: min-h-[200px] móvil, md:min-h-[300px] desktop
  - Agregar atributos de accesibilidad usando traducciones: role="button", tabIndex, aria-label desde translations
  - Recibir translations como prop para textos dinámicos
  - _Requisitos: 1.1, 1.2, 1.4, 3.1, 3.2, 4.1, 4.3, 5.5, 6.3, 7.2_

- [x] 8.1 Escribir unit tests para UploadZone
  - Verificar renderizado con children
  - Verificar clases CSS en estado inactivo
  - Verificar clases CSS en estado dragging
  - Verificar que handlers de eventos se invocan correctamente
  - Verificar textos desde translations
  - _Requisitos: 1.1, 1.2, 3.1, 3.2, 7.2_

- [x] 9. Crear componente principal ImageUploader
  - Implementar `ImageUploader/index.tsx` como Client Component ('use client')
  - Integrar useFileUpload hook y useTranslations hook
  - Renderizar input file oculto con ref y accept="image/jpeg,image/png,image/webp,image/gif"
  - Componer UploadZone, UploadIcon, UploadButton y texto instructivo usando translations
  - Pasar props, handlers y translations a subcomponentes
  - Aplicar espaciado generoso con múltiplos de 4px (p-4, md:p-8)
  - Mostrar loading state mientras se cargan las traducciones
  - _Requisitos: 1.1, 1.5, 2.1, 3.1, 5.4, 5.5, 7.1, 7.2_

- [x] 9.1 Escribir unit tests para ImageUploader
  - Verificar renderizado inicial con todos los elementos (zona, botón, ícono, texto)
  - Verificar que texto instructivo tiene tamaño mínimo de 16px en móvil
  - Verificar colores de la paleta aplicados correctamente
  - Verificar dimensiones responsive
  - Verificar que se muestran traducciones correctas según idioma
  - _Requisitos: 1.1, 2.1, 3.1, 4.1, 4.2, 4.3, 5.1, 5.2, 5.4, 7.2, 7.3, 7.4_

- [x] 9.2 Escribir test de integración para flujo completo
  - Verificar flujo: renderizado inicial → arrastrar archivo → cambio visual → soltar → callback invocado
  - Verificar flujo: renderizado inicial → click botón → seleccionar archivo → callback invocado
  - Verificar que traducciones se cargan y muestran correctamente
  - _Requisitos: 1.2, 1.3, 2.2, 2.3, 7.1, 7.2_

- [x] 10. Integrar ImageUploader en la página principal
  - Actualizar `app/page.tsx` para usar el componente ImageUploader
  - Aplicar layout centrado y responsive
  - Agregar título y descripción de la aplicación usando traducciones
  - Mantener diseño minimalista según guía de estilos
  - _Requisitos: 1.1, 5.5, 7.2_

- [x] 11. Checkpoint - Verificar que todo funciona correctamente
  - Asegurar que todos los tests pasan, preguntar al usuario si surgen dudas
