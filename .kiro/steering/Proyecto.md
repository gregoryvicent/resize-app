---
inclusion: always
---

# Proyecto: Resize Images

## Descripción del Producto
Herramienta web para redimensionar imágenes usando templates predefinidos optimizados para diferentes redes sociales. Interfaz moderna, amigable y visualmente atractiva orientada a creadores de contenido jóvenes.

## Stack Tecnológico
- **Framework**: Next.js 16 (App Router)
- **React**: 19.2.3
- **TypeScript**: 5.x (modo strict habilitado)
- **Estilos**: Tailwind CSS 4
- **Linting**: ESLint con configuración Next.js

## Arquitectura y Estructura
- Usar App Router de Next.js (`app/` directory)
- Componentes de servidor por defecto, usar `'use client'` solo cuando sea necesario
- Rutas de alias configuradas: `@/*` apunta a la raíz del proyecto

## Convenciones de Código

### TypeScript
- Modo strict habilitado - todos los tipos deben ser explícitos
- Usar interfaces para props de componentes
- Preferir `type` para uniones y tipos complejos
- Target: ES2017

### React y Next.js
- Usar componentes funcionales con hooks
- Preferir Server Components cuando sea posible
- Usar `next/image` para todas las imágenes
- Metadata debe definirse en layouts y pages usando el objeto `metadata`

### Estilos
- Tailwind CSS para todos los estilos
- Usar clases utilitarias de Tailwind
- Seguir el patrón de diseño existente: fondos claros/oscuros con `dark:` variants
- Mantener diseño responsive con breakpoints de Tailwind (`sm:`, `md:`, etc.)

### Estructura de Archivos
- Componentes reutilizables en carpetas con su propio archivo
- Páginas en `app/` siguiendo la estructura de rutas de Next.js
- Assets estáticos en `public/`

## Funcionalidad Principal
- Carga de imágenes del usuario
- Templates predefinidos para redes sociales (Instagram, Facebook, Twitter, LinkedIn, etc.)
- Previsualización en tiempo real
- Descarga de imágenes redimensionadas
- Interfaz drag-and-drop intuitiva

## Experiencia de Usuario
- Diseño minimalista y moderno
- Flujo de trabajo simple: cargar → seleccionar template → descargar
- Feedback visual inmediato
- Soporte para modo claro y oscuro
- Responsive para móviles y desktop