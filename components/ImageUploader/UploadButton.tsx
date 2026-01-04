/**
 * Componente UploadButton - Botón para seleccionar archivos.
 * Proporciona una interfaz accesible y visualmente atractiva para activar el selector de archivos.
 */

import { UploadButtonProps } from './types';

/**
 * Botón de carga con estilos de la paleta del proyecto y accesibilidad completa.
 * 
 * @param onClick - Handler invocado cuando se hace clic en el botón
 * @param disabled - Indica si el botón está deshabilitado
 * @param translations - Objeto con traducciones para el texto del botón
 * @returns Componente de botón estilizado y accesible
 */
export function UploadButton({ 
  onClick, 
  disabled = false,
  translations 
}: UploadButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={translations?.uploadButton.ariaLabel || 'Select image from your device'}
      className={`
        min-h-11 px-6 py-3 
        rounded-lg font-medium 
        bg-brand-purple text-white 
        hover:bg-brand-secondary 
        focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2
        transition-all duration-200 ease-in-out
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {translations?.uploadButton.label || 'Select Image'}
    </button>
  );
}
