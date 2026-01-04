/**
 * Tests para el componente UploadZone.
 * Incluye unit tests para validar el comportamiento de la zona de arrastre.
 * Valida: Requisitos 1.1, 1.2, 3.1, 3.2, 7.2
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UploadZone } from '../UploadZone';
import { Translations } from '@/lib/i18n';

/**
 * Crea un objeto de traducciones mock para testing.
 * 
 * @returns Objeto de traducciones con valores por defecto
 */
function createMockTranslations(): Translations {
  return {
    uploadZone: {
      title: 'Upload Image',
      description: 'Drag and drop an image here, or click to select',
      dragActive: 'Drop the image here'
    },
    uploadButton: {
      label: 'Select Image',
      ariaLabel: 'Select image from your device'
    },
    errors: {
      invalidFormat: 'Invalid file format',
      fileTooLarge: 'File is too large',
      multipleFiles: 'Please upload only one image'
    }
  };
}

/**
 * Unit Tests para UploadZone
 * Valida: Requisitos 1.1, 1.2, 3.1, 3.2, 7.2
 */
describe('UploadZone - Unit Tests', () => {
  /**
   * Verifica renderizado con children.
   * Requisito 1.1: La zona de arrastre debe ser claramente identificable.
   */
  it('debe renderizar con children correctamente', () => {
    const mockHandlers = {
      onDragEnter: vi.fn(),
      onDragLeave: vi.fn(),
      onDragOver: vi.fn(),
      onDrop: vi.fn()
    };
    const translations = createMockTranslations();
    
    render(
      <UploadZone 
        isDragging={false}
        translations={translations}
        {...mockHandlers}
      >
        <div data-testid="child-content">Test Content</div>
      </UploadZone>
    );
    
    // Verificar que el children se renderiza
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('debe renderizar múltiples children correctamente', () => {
    const mockHandlers = {
      onDragEnter: vi.fn(),
      onDragLeave: vi.fn(),
      onDragOver: vi.fn(),
      onDrop: vi.fn()
    };
    const translations = createMockTranslations();
    
    render(
      <UploadZone 
        isDragging={false}
        translations={translations}
        {...mockHandlers}
      >
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </UploadZone>
    );
    
    // Verificar que todos los children se renderizan
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });

  /**
   * Verifica clases CSS en estado inactivo.
   * Requisito 3.1: En estado inactivo debe mostrar borde punteado gris y fondo transparente.
   */
  it('debe tener clases CSS correctas en estado inactivo', () => {
    const mockHandlers = {
      onDragEnter: vi.fn(),
      onDragLeave: vi.fn(),
      onDragOver: vi.fn(),
      onDrop: vi.fn()
    };
    const translations = createMockTranslations();
    
    const { container } = render(
      <UploadZone 
        isDragging={false}
        translations={translations}
        {...mockHandlers}
      >
        <div>Content</div>
      </UploadZone>
    );
    
    // Obtener el div principal
    const zone = container.firstChild as HTMLElement;
    const className = zone.className;
    
    // Verificar clases de estado inactivo (actualizado para fondo oscuro)
    expect(className).toContain('border-gray-600');
    expect(className).toContain('border-dashed');
    expect(className).toContain('bg-transparent');
    expect(className).toContain('hover:border-brand-purple');
  });

  it('debe tener borde de 2px en estado inactivo', () => {
    const mockHandlers = {
      onDragEnter: vi.fn(),
      onDragLeave: vi.fn(),
      onDragOver: vi.fn(),
      onDrop: vi.fn()
    };
    const translations = createMockTranslations();
    
    const { container } = render(
      <UploadZone 
        isDragging={false}
        translations={translations}
        {...mockHandlers}
      >
        <div>Content</div>
      </UploadZone>
    );
    
    const zone = container.firstChild as HTMLElement;
    const className = zone.className;
    
    // Verificar que tiene borde de 2px
    expect(className).toContain('border-2');
  });

  it('debe tener bordes redondeados en estado inactivo', () => {
    const mockHandlers = {
      onDragEnter: vi.fn(),
      onDragLeave: vi.fn(),
      onDragOver: vi.fn(),
      onDrop: vi.fn()
    };
    const translations = createMockTranslations();
    
    const { container } = render(
      <UploadZone 
        isDragging={false}
        translations={translations}
        {...mockHandlers}
      >
        <div>Content</div>
      </UploadZone>
    );
    
    const zone = container.firstChild as HTMLElement;
    const className = zone.className;
    
    // Verificar que tiene bordes redondeados
    expect(className).toContain('rounded-lg');
  });

  /**
   * Verifica clases CSS en estado dragging.
   * Requisito 3.2: En estado activo debe cambiar a borde sólido púrpura y fondo con opacidad.
   */
  it('debe tener clases CSS correctas en estado dragging', () => {
    const mockHandlers = {
      onDragEnter: vi.fn(),
      onDragLeave: vi.fn(),
      onDragOver: vi.fn(),
      onDrop: vi.fn()
    };
    const translations = createMockTranslations();
    
    const { container } = render(
      <UploadZone 
        isDragging={true}
        translations={translations}
        {...mockHandlers}
      >
        <div>Content</div>
      </UploadZone>
    );
    
    // Obtener el div principal
    const zone = container.firstChild as HTMLElement;
    const className = zone.className;
    
    // Verificar clases de estado dragging
    expect(className).toContain('border-brand-purple');
    expect(className).toContain('border-solid');
    expect(className).toContain('bg-brand-purple/10');
  });

  it('NO debe tener clases de estado inactivo cuando isDragging es true', () => {
    const mockHandlers = {
      onDragEnter: vi.fn(),
      onDragLeave: vi.fn(),
      onDragOver: vi.fn(),
      onDrop: vi.fn()
    };
    const translations = createMockTranslations();
    
    const { container } = render(
      <UploadZone 
        isDragging={true}
        translations={translations}
        {...mockHandlers}
      >
        <div>Content</div>
      </UploadZone>
    );
    
    const zone = container.firstChild as HTMLElement;
    const className = zone.className;
    
    // Verificar que NO tiene clases de estado inactivo
    expect(className).not.toContain('border-gray-300');
    expect(className).not.toContain('border-dashed');
    expect(className).not.toContain('bg-transparent');
  });

  it('debe tener transición suave de 200ms', () => {
    const mockHandlers = {
      onDragEnter: vi.fn(),
      onDragLeave: vi.fn(),
      onDragOver: vi.fn(),
      onDrop: vi.fn()
    };
    const translations = createMockTranslations();
    
    const { container } = render(
      <UploadZone 
        isDragging={false}
        translations={translations}
        {...mockHandlers}
      >
        <div>Content</div>
      </UploadZone>
    );
    
    const zone = container.firstChild as HTMLElement;
    const className = zone.className;
    
    // Verificar clases de transición
    expect(className).toContain('transition-all');
    expect(className).toContain('duration-200');
    expect(className).toContain('ease-in-out');
  });

  /**
   * Verifica que handlers de eventos se invocan correctamente.
   * Requisito 1.2: El sistema debe responder a eventos de arrastre.
   */
  it('debe invocar onDragEnter cuando se arrastra sobre la zona', () => {
    const mockHandlers = {
      onDragEnter: vi.fn(),
      onDragLeave: vi.fn(),
      onDragOver: vi.fn(),
      onDrop: vi.fn()
    };
    const translations = createMockTranslations();
    
    const { container } = render(
      <UploadZone 
        isDragging={false}
        translations={translations}
        {...mockHandlers}
      >
        <div>Content</div>
      </UploadZone>
    );
    
    const zone = container.firstChild as HTMLElement;
    
    // Simular evento dragEnter
    const event = new Event('dragenter', { bubbles: true });
    zone.dispatchEvent(event);
    
    // Verificar que el handler fue invocado
    expect(mockHandlers.onDragEnter).toHaveBeenCalledTimes(1);
  });

  it('debe invocar onDragLeave cuando se sale de la zona', () => {
    const mockHandlers = {
      onDragEnter: vi.fn(),
      onDragLeave: vi.fn(),
      onDragOver: vi.fn(),
      onDrop: vi.fn()
    };
    const translations = createMockTranslations();
    
    const { container } = render(
      <UploadZone 
        isDragging={true}
        translations={translations}
        {...mockHandlers}
      >
        <div>Content</div>
      </UploadZone>
    );
    
    const zone = container.firstChild as HTMLElement;
    
    // Simular evento dragLeave
    const event = new Event('dragleave', { bubbles: true });
    zone.dispatchEvent(event);
    
    // Verificar que el handler fue invocado
    expect(mockHandlers.onDragLeave).toHaveBeenCalledTimes(1);
  });

  it('debe invocar onDragOver cuando se arrastra sobre la zona', () => {
    const mockHandlers = {
      onDragEnter: vi.fn(),
      onDragLeave: vi.fn(),
      onDragOver: vi.fn(),
      onDrop: vi.fn()
    };
    const translations = createMockTranslations();
    
    const { container } = render(
      <UploadZone 
        isDragging={true}
        translations={translations}
        {...mockHandlers}
      >
        <div>Content</div>
      </UploadZone>
    );
    
    const zone = container.firstChild as HTMLElement;
    
    // Simular evento dragOver
    const event = new Event('dragover', { bubbles: true });
    zone.dispatchEvent(event);
    
    // Verificar que el handler fue invocado
    expect(mockHandlers.onDragOver).toHaveBeenCalledTimes(1);
  });

  it('debe invocar onDrop cuando se suelta un archivo', () => {
    const mockHandlers = {
      onDragEnter: vi.fn(),
      onDragLeave: vi.fn(),
      onDragOver: vi.fn(),
      onDrop: vi.fn()
    };
    const translations = createMockTranslations();
    
    const { container } = render(
      <UploadZone 
        isDragging={true}
        translations={translations}
        {...mockHandlers}
      >
        <div>Content</div>
      </UploadZone>
    );
    
    const zone = container.firstChild as HTMLElement;
    
    // Simular evento drop
    const event = new Event('drop', { bubbles: true });
    zone.dispatchEvent(event);
    
    // Verificar que el handler fue invocado
    expect(mockHandlers.onDrop).toHaveBeenCalledTimes(1);
  });

  /**
   * Verifica textos desde translations.
   * Requisito 7.2: El sistema debe obtener todas las cadenas de texto desde archivos de traducción.
   */
  it('debe usar aria-label desde translations en inglés', () => {
    const mockHandlers = {
      onDragEnter: vi.fn(),
      onDragLeave: vi.fn(),
      onDragOver: vi.fn(),
      onDrop: vi.fn()
    };
    const translations = createMockTranslations();
    
    const { container } = render(
      <UploadZone 
        isDragging={false}
        translations={translations}
        {...mockHandlers}
      >
        <div>Content</div>
      </UploadZone>
    );
    
    const zone = container.firstChild as HTMLElement;
    
    // Verificar que tiene el aria-label correcto
    expect(zone.getAttribute('aria-label')).toBe('Drag and drop an image here, or click to select');
  });

  it('debe usar aria-label desde translations en español', () => {
    const mockHandlers = {
      onDragEnter: vi.fn(),
      onDragLeave: vi.fn(),
      onDragOver: vi.fn(),
      onDrop: vi.fn()
    };
    const translations: Translations = {
      uploadZone: {
        title: 'Subir Imagen',
        description: 'Arrastra y suelta una imagen aquí, o haz clic para seleccionar',
        dragActive: 'Suelta la imagen aquí'
      },
      uploadButton: {
        label: 'Seleccionar Imagen',
        ariaLabel: 'Seleccionar imagen desde tu dispositivo'
      },
      errors: {
        invalidFormat: 'Formato de archivo inválido',
        fileTooLarge: 'El archivo es demasiado grande',
        multipleFiles: 'Por favor sube solo una imagen a la vez'
      }
    };
    
    const { container } = render(
      <UploadZone 
        isDragging={false}
        translations={translations}
        {...mockHandlers}
      >
        <div>Content</div>
      </UploadZone>
    );
    
    const zone = container.firstChild as HTMLElement;
    
    // Verificar que tiene el aria-label en español
    expect(zone.getAttribute('aria-label')).toBe('Arrastra y suelta una imagen aquí, o haz clic para seleccionar');
  });

  it('debe usar texto por defecto cuando translations es undefined', () => {
    const mockHandlers = {
      onDragEnter: vi.fn(),
      onDragLeave: vi.fn(),
      onDragOver: vi.fn(),
      onDrop: vi.fn()
    };
    
    const { container } = render(
      <UploadZone 
        isDragging={false}
        translations={undefined as any}
        {...mockHandlers}
      >
        <div>Content</div>
      </UploadZone>
    );
    
    const zone = container.firstChild as HTMLElement;
    
    // Verificar que usa el texto por defecto
    expect(zone.getAttribute('aria-label')).toBe('Drag and drop an image here, or click to select');
  });

  /**
   * Verifica atributos de accesibilidad.
   * Requisito 6.3: El sistema debe proporcionar etiquetas descriptivas para todos los elementos interactivos.
   */
  it('debe tener role="button" para accesibilidad', () => {
    const mockHandlers = {
      onDragEnter: vi.fn(),
      onDragLeave: vi.fn(),
      onDragOver: vi.fn(),
      onDrop: vi.fn()
    };
    const translations = createMockTranslations();
    
    const { container } = render(
      <UploadZone 
        isDragging={false}
        translations={translations}
        {...mockHandlers}
      >
        <div>Content</div>
      </UploadZone>
    );
    
    const zone = container.firstChild as HTMLElement;
    
    // Verificar que tiene role="button"
    expect(zone.getAttribute('role')).toBe('button');
  });

  it('debe tener tabIndex={0} para navegación por teclado', () => {
    const mockHandlers = {
      onDragEnter: vi.fn(),
      onDragLeave: vi.fn(),
      onDragOver: vi.fn(),
      onDrop: vi.fn()
    };
    const translations = createMockTranslations();
    
    const { container } = render(
      <UploadZone 
        isDragging={false}
        translations={translations}
        {...mockHandlers}
      >
        <div>Content</div>
      </UploadZone>
    );
    
    const zone = container.firstChild as HTMLElement;
    
    // Verificar que tiene tabIndex="0"
    expect(zone.getAttribute('tabIndex')).toBe('0');
  });

  it('debe ser accesible mediante role="button"', () => {
    const mockHandlers = {
      onDragEnter: vi.fn(),
      onDragLeave: vi.fn(),
      onDragOver: vi.fn(),
      onDrop: vi.fn()
    };
    const translations = createMockTranslations();
    
    render(
      <UploadZone 
        isDragging={false}
        translations={translations}
        {...mockHandlers}
      >
        <div>Content</div>
      </UploadZone>
    );
    
    // Verificar que es accesible mediante su role
    const zone = screen.getByRole('button');
    expect(zone).toBeInTheDocument();
  });

  /**
   * Verifica dimensiones responsive.
   * Requisito 4.1: La zona debe tener altura mínima de 200px en móvil y 300px en desktop.
   */
  it('debe tener altura mínima de 200px para móvil', () => {
    const mockHandlers = {
      onDragEnter: vi.fn(),
      onDragLeave: vi.fn(),
      onDragOver: vi.fn(),
      onDrop: vi.fn()
    };
    const translations = createMockTranslations();
    
    const { container } = render(
      <UploadZone 
        isDragging={false}
        translations={translations}
        {...mockHandlers}
      >
        <div>Content</div>
      </UploadZone>
    );
    
    const zone = container.firstChild as HTMLElement;
    const className = zone.className;
    
    // Verificar que tiene min-h-[200px]
    expect(className).toContain('min-h-[200px]');
  });

  it('debe tener altura mínima de 300px para desktop (md breakpoint)', () => {
    const mockHandlers = {
      onDragEnter: vi.fn(),
      onDragLeave: vi.fn(),
      onDragOver: vi.fn(),
      onDrop: vi.fn()
    };
    const translations = createMockTranslations();
    
    const { container } = render(
      <UploadZone 
        isDragging={false}
        translations={translations}
        {...mockHandlers}
      >
        <div>Content</div>
      </UploadZone>
    );
    
    const zone = container.firstChild as HTMLElement;
    const className = zone.className;
    
    // Verificar que tiene md:min-h-[300px]
    expect(className).toContain('md:min-h-[300px]');
  });

  /**
   * Verifica layout y espaciado.
   * Requisito 5.5: El sistema debe mantener espaciado generoso usando múltiplos de 4px.
   */
  it('debe tener padding responsive (p-4 en móvil, md:p-8 en desktop)', () => {
    const mockHandlers = {
      onDragEnter: vi.fn(),
      onDragLeave: vi.fn(),
      onDragOver: vi.fn(),
      onDrop: vi.fn()
    };
    const translations = createMockTranslations();
    
    const { container } = render(
      <UploadZone 
        isDragging={false}
        translations={translations}
        {...mockHandlers}
      >
        <div>Content</div>
      </UploadZone>
    );
    
    const zone = container.firstChild as HTMLElement;
    const className = zone.className;
    
    // Verificar padding responsive
    expect(className).toContain('p-4');
    expect(className).toContain('md:p-8');
  });

  it('debe usar flexbox para centrar contenido', () => {
    const mockHandlers = {
      onDragEnter: vi.fn(),
      onDragLeave: vi.fn(),
      onDragOver: vi.fn(),
      onDrop: vi.fn()
    };
    const translations = createMockTranslations();
    
    const { container } = render(
      <UploadZone 
        isDragging={false}
        translations={translations}
        {...mockHandlers}
      >
        <div>Content</div>
      </UploadZone>
    );
    
    const zone = container.firstChild as HTMLElement;
    const className = zone.className;
    
    // Verificar clases de flexbox
    expect(className).toContain('flex');
    expect(className).toContain('flex-col');
    expect(className).toContain('items-center');
    expect(className).toContain('justify-center');
  });
});
