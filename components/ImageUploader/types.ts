/**
 * Tipos e interfaces para el componente ImageUploader.
 * Define las estructuras de datos y props para todos los componentes relacionados.
 */

/**
 * Props para el componente principal ImageUploader.
 */
export interface ImageUploaderProps {
  /** Callback invocado cuando el usuario selecciona un archivo */
  onFileSelect?: (file: File) => void;
  /** Clases CSS adicionales para el contenedor principal */
  className?: string;
}

/**
 * Props para el componente UploadZone (zona de arrastre y soltar).
 */
export interface UploadZoneProps {
  /** Indica si actualmente se está arrastrando un archivo sobre la zona */
  isDragging: boolean;
  /** Handler para cuando un archivo entra en la zona de arrastre */
  onDragEnter: (e: React.DragEvent) => void;
  /** Handler para cuando un archivo sale de la zona de arrastre */
  onDragLeave: (e: React.DragEvent) => void;
  /** Handler para cuando un archivo está sobre la zona (necesario para permitir drop) */
  onDragOver: (e: React.DragEvent) => void;
  /** Handler para cuando un archivo se suelta en la zona */
  onDrop: (e: React.DragEvent) => void;
  /** Contenido a renderizar dentro de la zona */
  children: React.ReactNode;
  /** Traducciones para textos de accesibilidad */
  translations?: {
    uploadZone: {
      description: string;
    };
  };
}

/**
 * Props para el componente UploadButton (botón de selección de archivos).
 */
export interface UploadButtonProps {
  /** Handler invocado cuando se hace clic en el botón */
  onClick: () => void;
  /** Indica si el botón está deshabilitado */
  disabled?: boolean;
  /** Traducciones para el texto del botón */
  translations?: {
    uploadButton: {
      label: string;
      ariaLabel: string;
    };
  };
}

/**
 * Props para el componente UploadIcon (ícono visual de carga).
 */
export interface UploadIconProps {
  /** Clases CSS adicionales para el ícono */
  className?: string;
  /** Tamaño del ícono en píxeles (default: 64) */
  size?: number;
}

/**
 * Estado interno del proceso de carga de archivos.
 */
export interface FileUploadState {
  /** Indica si actualmente se está arrastrando un archivo */
  isDragging: boolean;
  /** Archivo seleccionado por el usuario (null si no hay archivo) */
  selectedFile: File | null;
  /** Mensaje de error si ocurre algún problema (null si no hay error) */
  error: string | null;
}

/**
 * Valor de retorno del hook useFileUpload.
 * Proporciona estado y handlers para manejar la carga de archivos.
 */
export interface UseFileUploadReturn {
  /** Indica si actualmente se está arrastrando un archivo sobre la zona */
  isDragging: boolean;
  /** Archivo seleccionado por el usuario (null si no hay archivo) */
  selectedFile: File | null;
  /** Handler para cuando un archivo entra en la zona de arrastre */
  handleDragEnter: (e: React.DragEvent) => void;
  /** Handler para cuando un archivo sale de la zona de arrastre */
  handleDragLeave: (e: React.DragEvent) => void;
  /** Handler para cuando un archivo está sobre la zona */
  handleDragOver: (e: React.DragEvent) => void;
  /** Handler para cuando un archivo se suelta en la zona */
  handleDrop: (e: React.DragEvent) => void;
  /** Handler para cuando se selecciona un archivo mediante el input */
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Función para activar programáticamente el input de archivos */
  triggerFileInput: () => void;
  /** Referencia al elemento input de archivos */
  fileInputRef: React.RefObject<HTMLInputElement>;
}
