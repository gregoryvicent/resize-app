'use client';

import { useTranslations } from '@/lib/i18n';
import LanguageSelector from '@/components/LanguageSelector';

/**
 * Componente Header principal de la aplicación.
 * Incluye navegación, selector de idioma y espacio para logo.
 */
export default function Header() {
  const { locale, translations, isLoading, setLocale } = useTranslations();

  // Mostrar contenido por defecto solo si no hay traducciones cargadas aún
  if (!translations) {
    return (
      <header className="bg-brand-dark/80 backdrop-blur-sm border-b border-brand-purple/20 relative z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo / Brand */}
            <div className="flex items-center">
              <span className="text-2xl md:text-3xl font-bold text-white">
                Resize<span className="text-brand-accent">Images</span>
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#home"
                className="text-white hover:text-brand-accent transition-colors duration-200 font-medium"
              >
                Inicio
              </a>
              <a
                href="#templates"
                className="text-white hover:text-brand-accent transition-colors duration-200 font-medium"
              >
                Templates
              </a>
              <a
                href="#about"
                className="text-white hover:text-brand-accent transition-colors duration-200 font-medium"
              >
                Acerca de
              </a>
            </nav>

            {/* Language Selector Placeholder */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block w-32 h-10 bg-brand-dark/50 rounded-lg animate-pulse" />

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-white hover:text-brand-accent transition-colors duration-200 min-h-11 min-w-11 flex items-center justify-center"
                aria-label="Abrir menú"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-brand-dark/80 backdrop-blur-sm border-b border-brand-purple/20 relative z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <span className="text-2xl md:text-3xl font-bold text-white">
              Resize<span className="text-brand-accent">Images</span>
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#home"
              className="text-white hover:text-brand-accent transition-colors duration-200 font-medium"
            >
              {translations.header.nav.home}
            </a>
            <a
              href="#templates"
              className="text-white hover:text-brand-accent transition-colors duration-200 font-medium"
            >
              {translations.header.nav.templates}
            </a>
            <a
              href="#about"
              className="text-white hover:text-brand-accent transition-colors duration-200 font-medium"
            >
              {translations.header.nav.about}
            </a>
          </nav>

          {/* Language Selector and Mobile Menu */}
          <div className="flex items-center gap-4">
            <LanguageSelector
              currentLocale={locale}
              onLocaleChange={setLocale}
            />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white hover:text-brand-accent transition-colors duration-200 min-h-11 min-w-11 flex items-center justify-center"
              aria-label="Abrir menú"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
