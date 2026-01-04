/**
 * Componente UploadIcon - Ícono visual de carga de archivos.
 * Muestra un SVG de nube con flecha hacia arriba para indicar la funcionalidad de carga.
 */

import { UploadIconProps } from './types';

/**
 * Ícono de carga con diseño de nube y flecha.
 * 
 * @param className - Clases CSS adicionales para personalizar el ícono
 * @param size - Tamaño del ícono en píxeles (default: 64)
 * @returns Componente SVG del ícono de carga
 */
export function UploadIcon({ className = '', size = 64 }: UploadIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Nube */}
      <path
        d="M52 36C54.7614 36 57 33.7614 57 31C57 28.2386 54.7614 26 52 26C51.8479 26 51.6972 26.0068 51.5481 26.0201C51.1999 20.6063 16.6001 20.6063 16.2519 26.0201C16.1028 26.0068 15.9521 26 15.8 26C13.0386 26 10.8 28.2386 10.8 31C10.8 33.7614 13.0386 36 15.8 36H52Z"
        fill="currentColor"
        opacity="0.2"
      />
      
      {/* Flecha hacia arriba */}
      <path
        d="M32 42V22M32 22L24 30M32 22L40 30"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
