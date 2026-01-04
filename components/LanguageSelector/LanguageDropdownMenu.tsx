import { SupportedLocale } from '@/lib/i18n';

/**
 * Props para el componente LanguageDropdownMenu.
 */
interface LanguageDropdownMenuProps {
  isOpen: boolean;
  currentLocale: SupportedLocale;
  onSelectLocale: (locale: SupportedLocale) => void;
}

/**
 * Opción de idioma en el menú desplegable.
 */
interface LanguageOption {
  locale: SupportedLocale;
  name: string;
}

/**
 * Menú desplegable con las opciones de idioma disponibles.
 * Se muestra condicionalmente basado en el estado isOpen.
 * 
 * @param isOpen - Estado de apertura del menú
 * @param currentLocale - El idioma actualmente seleccionado
 * @param onSelectLocale - Función que se ejecuta cuando se selecciona un idioma
 */
export default function LanguageDropdownMenu({ 
  isOpen, 
  currentLocale, 
  onSelectLocale 
}: LanguageDropdownMenuProps) {
  // Opciones de idioma disponibles
  const languageOptions: LanguageOption[] = [
    { locale: 'es', name: 'Español' },
    { locale: 'en', name: 'English' }
  ];

  // No renderizar si el menú está cerrado
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="
        absolute top-full right-0 mt-2
        min-w-[160px]
        bg-white/95 dark:bg-brand-dark/95
        backdrop-blur-md
        border-2 border-brand-purple
        rounded-lg
        shadow-lg
        overflow-hidden
        z-[9999]
      "
      role="menu"
      aria-label="Opciones de idioma"
    >
      {languageOptions.map((option) => {
        const isSelected = option.locale === currentLocale;
        
        return (
          <button
            key={option.locale}
            onClick={() => onSelectLocale(option.locale)}
            role="menuitem"
            className={`
              w-full
              px-4 py-3
              text-left
              transition-all duration-200
              ${
                isSelected
                  ? 'bg-brand-purple text-white font-semibold'
                  : 'text-brand-dark dark:text-white hover:bg-brand-purple/10'
              }
            `}
          >
            <span className="flex items-center justify-between">
              <span>{option.name}</span>
              {isSelected && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
