'use client';

import { useState, useEffect, useRef } from 'react';
import { SupportedLocale } from '@/lib/i18n';
import LanguageSelectorButton from './LanguageSelectorButton';
import LanguageDropdownMenu from './LanguageDropdownMenu';

/**
 * Props para el componente LanguageSelector.
 */
interface LanguageSelectorProps {
  currentLocale: SupportedLocale;
  onLocaleChange: (locale: SupportedLocale) => void;
}

/**
 * Componente selector de idioma con menú desplegable.
 * Permite al usuario alternar entre español e inglés.
 * 
 * @param currentLocale - El idioma actualmente seleccionado
 * @param onLocaleChange - Función callback que se ejecuta cuando el usuario selecciona un idioma
 * 
 * @example
 * <LanguageSelector 
 *   currentLocale={locale} 
 *   onLocaleChange={setLocale} 
 * />
 */
export default function LanguageSelector({ currentLocale, onLocaleChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  /**
   * Alterna el estado de apertura/cierre del menú desplegable.
   */
  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  /**
   * Maneja la selección de un idioma.
   * Cierra el menú y notifica el cambio al componente padre.
   */
  const handleSelectLocale = (locale: SupportedLocale) => {
    onLocaleChange(locale);
    setIsOpen(false);
  };

  // Efecto para cerrar el menú al hacer clic fuera o presionar Escape
  useEffect(() => {
    /**
     * Cierra el menú si se hace clic fuera del componente.
     */
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    /**
     * Cierra el menú si se presiona la tecla Escape.
     */
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    // Agregar event listeners solo si el menú está abierto
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    // Cleanup: remover event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  return (
    <div ref={selectorRef} className="relative">
      <LanguageSelectorButton
        currentLocale={currentLocale}
        isOpen={isOpen}
        onClick={toggleMenu}
      />
      <LanguageDropdownMenu
        isOpen={isOpen}
        currentLocale={currentLocale}
        onSelectLocale={handleSelectLocale}
      />
    </div>
  );
}
