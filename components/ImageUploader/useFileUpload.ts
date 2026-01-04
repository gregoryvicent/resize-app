/**
 * Custom hook para manejar la lógica de carga de archivos.
 * Gestiona el estado de arrastre, selección de archivos y eventos relacionados.
 */

import { useState, useRef, useCallback } from 'react';
import type { UseFileUploadReturn } from './types';

/**
 * Hook personalizado que encapsula la lógica de carga de archivos mediante
 * arrastrar y soltar o selección tradicional.
 * 
 * @param onFileSelect - Callback opcional invocado cuando se selecciona un archivo
 * @returns Objeto con estado y handlers para manejar la carga de archivos
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const {
 *     isDragging,
 *     selectedFile,
 *     handleDragEnter,
 *     handleDrop,
 *     triggerFileInput,
 *     fileInputRef
 *   } = useFileUpload((file) => console.log('Archivo seleccionado:', file));
 * 
 *   return (
 *     <div onDragEnter={handleDragEnter} onDrop={handleDrop}>
 *       <input ref={fileInputRef} type="file" hidden />
 *       <button onClick={triggerFileInput}>Seleccionar archivo</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useFileUpload(
  onFileSelect?: (file: File) => void
): UseFileUploadReturn {
  // Estado para controlar si se está arrastrando un archivo sobre la zona
  const [isDragging, setIsDragging] = useState(false);
  
  // Estado para almacenar el archivo seleccionado
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Referencia al input file oculto
  const fileInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;

  /**
   * Handler para cuando un archivo entra en la zona de arrastre.
   * Activa el estado visual de arrastre.
   * Previene el comportamiento por defecto del navegador.
   */
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  /**
   * Handler para cuando un archivo sale de la zona de arrastre.
   * Restaura el estado visual original.
   * Previene el comportamiento por defecto del navegador.
   */
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  /**
   * Handler para cuando un archivo está sobre la zona de arrastre.
   * Necesario para permitir el evento drop.
   * Previene el comportamiento por defecto del navegador.
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  /**
   * Handler para cuando un archivo se suelta en la zona de arrastre.
   * Procesa el archivo y actualiza el estado.
   * Previene el comportamiento por defecto del navegador.
   */
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Restaurar estado de arrastre
      setIsDragging(false);

      // Obtener archivos del evento
      const files = e.dataTransfer.files;
      
      // Verificar que hay al menos un archivo
      if (files && files.length > 0) {
        const file = files[0];
        
        // Actualizar estado con el archivo seleccionado
        setSelectedFile(file);
        
        // Invocar callback si está definido
        if (onFileSelect) {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect]
  );

  /**
   * Handler para cuando se selecciona un archivo mediante el input tradicional.
   * Procesa el archivo y actualiza el estado.
   */
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      
      // Verificar que hay al menos un archivo
      if (files && files.length > 0) {
        const file = files[0];
        
        // Actualizar estado con el archivo seleccionado
        setSelectedFile(file);
        
        // Invocar callback si está definido
        if (onFileSelect) {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect]
  );

  /**
   * Función para activar programáticamente el input de archivos.
   * Simula un click en el input oculto.
   */
  const triggerFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  return {
    isDragging,
    selectedFile,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileSelect,
    triggerFileInput,
    fileInputRef,
  };
}
