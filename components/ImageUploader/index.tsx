/**
 * Componente principal ImageUploader.
 * Orquesta la funcionalidad completa de carga de imágenes mediante arrastrar y soltar
 * o selección tradicional con botón. Integra internacionalización y feedback visual.
 */

'use client';

import { useFileUpload } from './useFileUpload';
import { useTranslations } from '@/lib/i18n';
import { UploadZone } from './UploadZone';
import { UploadButton } from './UploadButton';
import { UploadIcon } from './UploadIcon';
import type { ImageUploaderProps } from './types';

/**
 * Componente principal de carga de imágenes con soporte para drag & drop
 * y selección tradicional mediante botón.
 * 
 * @param onFileSelect - Callback opcional invocado cuando el usuario selecciona un archivo
 * @param className - Clases CSS adicionales para el contenedor principal
 * @returns Componente de carga de imágenes completo con internacionalización
 * 
 * @example
 * ```tsx
 * <ImageUploader 
 *   onFileSelect={(file) => console.log('Archivo seleccionado:', file.name)}
 * />
 * ```
 */
export function ImageUploader({ 
  onFileSelect, 
  className = '' 
}: ImageUploaderProps) {
  // Hook para manejar la lógica de carga de archivos
  const {
    isDragging,
    selectedFile,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileSelect,
    triggerFileInput,
    fileInputRef,
  } = useFileUpload(onFileSelect);

  // Hook para manejar las traducciones
  const { translations, isLoading } = useTranslations();

  // Mostrar estado de carga solo si no hay traducciones cargadas aún
  if (!translations) {
    return (
      <div className={`flex items-center justify-center min-h-[200px] md:min-h-[300px] ${className}`}>
        <div className="text-gray-300 text-lg">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 md:p-8 ${className}`}>
      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
        aria-hidden="true"
      />

      {/* Zona de arrastre y soltar */}
      <UploadZone
        isDragging={isDragging}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        translations={translations}
      >
        {/* Ícono de carga */}
        <UploadIcon 
          className={`mb-6 ${isDragging ? 'text-brand-purple' : 'text-gray-300'}`}
          size={80}
        />

        {/* Título */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-4">
          {translations.uploadZone.title}
        </h2>

        {/* Texto instructivo */}
        <p className="text-lg md:text-xl text-gray-300 mb-6 text-center max-w-2xl">
          {isDragging 
            ? translations.uploadZone.dragActive 
            : translations.uploadZone.description
          }
        </p>

        {/* Botón de carga */}
        <UploadButton
          onClick={triggerFileInput}
          translations={translations}
        />

        {/* Mostrar nombre del archivo si hay uno seleccionado */}
        {selectedFile && (
          <p className="mt-6 text-base text-gray-300">
            {selectedFile.name}
          </p>
        )}
      </UploadZone>
    </div>
  );
}
