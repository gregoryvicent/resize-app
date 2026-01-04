/**
 * Componente UploadZone - Área de arrastre y soltar para carga de archivos.
 * Proporciona feedback visual durante el arrastre y maneja eventos de drag & drop.
 */

import { UploadZoneProps } from './types';

/**
 * Zona de arrastre con estilos condicionales y accesibilidad completa.
 * 
 * @param isDragging - Indica si actualmente se está arrastrando un archivo sobre la zona
 * @param onDragEnter - Handler para cuando un archivo entra en la zona
 * @param onDragLeave - Handler para cuando un archivo sale de la zona
 * @param onDragOver - Handler para cuando un archivo está sobre la zona
 * @param onDrop - Handler para cuando un archivo se suelta en la zona
 * @param children - Contenido a renderizar dentro de la zona
 * @param translations - Objeto con traducciones para accesibilidad
 * @returns Componente de zona de arrastre estilizado y accesible
 */
export function UploadZone({
  isDragging,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  children,
  translations
}: UploadZoneProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={translations?.uploadZone.description || 'Drag and drop an image here, or click to select'}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`
        min-h-[400px] md:min-h-[500px]
        border-2 rounded-lg
        transition-all duration-200 ease-in-out
        flex flex-col items-center justify-center
        p-8 md:p-12
        ${
          isDragging
            ? 'border-brand-purple border-solid bg-brand-purple/10'
            : 'border-gray-600 border-dashed bg-transparent hover:border-brand-purple'
        }
      `}
    >
      {children}
    </div>
  );
}
