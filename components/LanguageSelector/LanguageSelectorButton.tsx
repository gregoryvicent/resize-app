import { SupportedLocale } from '@/lib/i18n';

/**
 * Props para el componente LanguageSelectorButton.
 */
interface LanguageSelectorButtonProps {
  currentLocale: SupportedLocale;
  isOpen: boolean;
  onClick: () => void;
}

/**
 * Botón del selector de idioma que muestra el idioma actual.
 * Incluye un icono de globo y un chevron que indica el estado del menú.
 * 
 * @param currentLocale - El idioma actualmente seleccionado
 * @param isOpen - Estado de apertura del menú desplegable
 * @param onClick - Función que se ejecuta al hacer clic en el botón
 */
export default function LanguageSelectorButton({ 
  currentLocale, 
  isOpen, 
  onClick 
}: LanguageSelectorButtonProps) {
  // Mapeo de locales a nombres de idiomas
  const languageNames: Record<SupportedLocale, string> = {
    es: 'Español',
    en: 'English'
  };

  return (
    <button
      onClick={onClick}
      aria-expanded={isOpen}
      aria-label="Selector de idioma"
      className="
        flex items-center gap-2 
        px-4 py-2 
        min-h-11 min-w-11
        bg-brand-purple hover:bg-brand-secondary 
        text-white 
        rounded-lg 
        transition-all duration-200 ease-in-out
        focus:ring-2 focus:ring-brand-purple focus:outline-none
      "
    >
      {/* Icono de globo */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
        />
      </svg>

      {/* Nombre del idioma actual */}
      <span className="font-medium">
        {languageNames[currentLocale]}
      </span>

      {/* Icono chevron que indica el estado del menú */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    </button>
  );
}
