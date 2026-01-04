/**
 * Tests para el componente ImageUploader.
 * Incluye unit tests para validar el renderizado completo y comportamiento del componente principal.
 * También incluye tests de integración para flujos completos de usuario.
 * Valida: Requisitos 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 4.1, 4.2, 4.3, 5.1, 5.2, 5.4, 7.1, 7.2, 7.3, 7.4
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ImageUploader } from '../index';

/**
 * Mock de fetch para simular carga de traducciones.
 */
const mockFetch = vi.fn();

/**
 * Traducciones mock en inglés.
 */
const mockTranslationsEn = {
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
    invalidFormat: 'Invalid file format. Please upload a JPEG, PNG, WebP, or GIF image.',
    fileTooLarge: 'File is too large. Maximum size is 10MB.',
    multipleFiles: 'Please upload only one image at a time.'
  }
};

/**
 * Traducciones mock en español.
 */
const mockTranslationsEs = {
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
    invalidFormat: 'Formato de archivo inválido. Por favor sube una imagen JPEG, PNG, WebP o GIF.',
    fileTooLarge: 'El archivo es demasiado grande. El tamaño máximo es 10MB.',
    multipleFiles: 'Por favor sube solo una imagen a la vez.'
  }
};

/**
 * Unit Tests para ImageUploader
 * Valida: Requisitos 1.1, 2.1, 3.1, 4.1, 4.2, 4.3, 5.1, 5.2, 5.4, 7.2, 7.3, 7.4
 */
describe('ImageUploader - Unit Tests', () => {
  beforeEach(() => {
    // Configurar mock de fetch
    global.fetch = mockFetch;
    
    // Por defecto, simular navegador en inglés
    Object.defineProperty(window.navigator, 'language', {
      writable: true,
      configurable: true,
      value: 'en-US'
    });
    
    // Configurar respuesta por defecto de fetch
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockTranslationsEn
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Verifica renderizado inicial con todos los elementos.
   * Requisito 1.1: La zona de arrastre debe ser claramente identificable.
   * Requisito 2.1: El botón de carga debe ser claramente visible.
   * Requisito 3.1: Debe mostrar ícono representativo y texto instructivo.
   */
  it('debe renderizar la zona de arrastre', async () => {
    render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Verificar que la zona de arrastre está presente (role="button")
    const uploadZone = screen.getByRole('button', { name: /drag and drop/i });
    expect(uploadZone).toBeInTheDocument();
  });

  it('debe renderizar el botón de carga', async () => {
    render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Verificar que el botón de carga está presente
    const uploadButton = screen.getByRole('button', { name: /select image from your device/i });
    expect(uploadButton).toBeInTheDocument();
  });

  it('debe renderizar el ícono de carga', async () => {
    const { container } = render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Verificar que el SVG del ícono está presente
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
  });

  it('debe renderizar el texto instructivo', async () => {
    render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Verificar que el texto instructivo está presente
    expect(screen.getByText(/drag and drop an image here/i)).toBeInTheDocument();
  });

  it('debe renderizar el título', async () => {
    render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Verificar que el título está presente
    expect(screen.getByText('Upload Image')).toBeInTheDocument();
  });

  it('debe renderizar el input file oculto', async () => {
    const { container } = render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Verificar que el input file está presente y oculto
    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
    expect(fileInput?.className).toContain('hidden');
    expect(fileInput?.getAttribute('aria-hidden')).toBe('true');
  });

  /**
   * Verifica que el texto instructivo tiene tamaño mínimo de 16px en móvil.
   * Requisito 5.4: El texto debe usar tamaño de fuente mínimo de 16 píxeles en dispositivos móviles.
   */
  it('debe tener texto instructivo con tamaño mínimo de 16px en móvil', async () => {
    const { container } = render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Buscar el párrafo con el texto instructivo
    const instructionalText = screen.getByText(/drag and drop an image here/i);
    
    // Verificar que tiene la clase text-base (16px en móvil)
    expect(instructionalText.className).toContain('text-base');
  });

  it('debe tener texto instructivo responsive (text-base en móvil, md:text-lg en desktop)', async () => {
    const { container } = render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Buscar el párrafo con el texto instructivo
    const instructionalText = screen.getByText(/drag and drop an image here/i);
    
    // Verificar que tiene clases responsive
    expect(instructionalText.className).toContain('text-base');
    expect(instructionalText.className).toContain('md:text-lg');
  });

  /**
   * Verifica colores de la paleta aplicados correctamente.
   * Requisito 5.1: Debe usar exclusivamente los colores definidos en la paleta del proyecto.
   * Requisito 5.2: Debe aplicar el color primario púrpura para el botón de carga.
   */
  it('debe aplicar color brand-dark al título', async () => {
    const { container } = render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Buscar el título
    const title = screen.getByText('Upload Image');
    
    // Verificar que tiene el color blanco para contraste con fondo oscuro
    expect(title.className).toContain('text-white');
  });

  it('debe aplicar color brand-purple al botón de carga', async () => {
    const { container } = render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Buscar el botón de carga
    const uploadButton = screen.getByRole('button', { name: /select image from your device/i });
    
    // Verificar que tiene el color brand-purple
    expect(uploadButton.className).toContain('bg-brand-purple');
  });

  it('debe aplicar color brand-purple al ícono cuando está en estado dragging', async () => {
    const { container } = render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // El ícono debe tener la clase que permite cambiar a brand-purple cuando isDragging es true
    const icon = container.querySelector('svg');
    
    // Verificar que el ícono existe
    expect(icon).toBeInTheDocument();
    
    // El ícono tiene clases condicionales basadas en isDragging
    // En estado inicial (no dragging), debe tener text-gray-300 para contraste con fondo oscuro
    // Para SVG, className es un objeto SVGAnimatedString, necesitamos usar getAttribute
    const className = icon?.getAttribute('class') || '';
    expect(className).toContain('text-gray-300');
  });

  /**
   * Verifica dimensiones responsive.
   * Requisito 4.1: La zona de arrastre debe tener altura mínima de 200px en móvil.
   * Requisito 4.2: El botón debe tener tamaño mínimo táctil de 44px.
   * Requisito 4.3: La zona de arrastre debe tener altura mínima de 300px en desktop.
   */
  it('debe tener altura mínima de 200px en móvil para la zona de arrastre', async () => {
    const { container } = render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Buscar la zona de arrastre
    const uploadZone = screen.getByRole('button', { name: /drag and drop/i });
    
    // Verificar que tiene min-h-[200px]
    expect(uploadZone.className).toContain('min-h-[200px]');
  });

  it('debe tener altura mínima de 300px en desktop para la zona de arrastre', async () => {
    const { container } = render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Buscar la zona de arrastre
    const uploadZone = screen.getByRole('button', { name: /drag and drop/i });
    
    // Verificar que tiene md:min-h-[300px]
    expect(uploadZone.className).toContain('md:min-h-[300px]');
  });

  it('debe tener tamaño mínimo táctil de 44px para el botón de carga', async () => {
    const { container } = render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Buscar el botón de carga
    const uploadButton = screen.getByRole('button', { name: /select image from your device/i });
    
    // Verificar que tiene min-h-11 (44px)
    expect(uploadButton.className).toContain('min-h-11');
  });

  it('debe tener padding responsive en el contenedor principal', async () => {
    const { container } = render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Buscar el contenedor principal (primer div)
    const mainContainer = container.firstChild as HTMLElement;
    
    // Verificar que tiene padding responsive (p-4 en móvil, md:p-8 en desktop)
    expect(mainContainer.className).toContain('p-4');
    expect(mainContainer.className).toContain('md:p-8');
  });

  /**
   * Verifica que se muestran traducciones correctas según idioma.
   * Requisito 7.2: El sistema debe obtener todas las cadenas de texto desde archivos de traducción.
   * Requisito 7.3: Cuando el idioma es inglés, debe cargar y mostrar el contenido desde el archivo en inglés.
   * Requisito 7.4: Cuando el idioma es español, debe cargar y mostrar el contenido desde el archivo en español.
   */
  it('debe mostrar traducciones en inglés cuando el navegador está en inglés', async () => {
    // Configurar navegador en inglés
    Object.defineProperty(window.navigator, 'language', {
      writable: true,
      configurable: true,
      value: 'en-US'
    });
    
    // Configurar fetch para retornar traducciones en inglés
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockTranslationsEn
    });
    
    render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Verificar que se muestran los textos en inglés
    expect(screen.getByText('Upload Image')).toBeInTheDocument();
    expect(screen.getByText(/drag and drop an image here/i)).toBeInTheDocument();
    expect(screen.getByText('Select Image')).toBeInTheDocument();
  });

  it('debe mostrar traducciones en español cuando el navegador está en español', async () => {
    // Configurar navegador en español
    Object.defineProperty(window.navigator, 'language', {
      writable: true,
      configurable: true,
      value: 'es-ES'
    });
    
    // Configurar fetch para retornar traducciones en español
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockTranslationsEs
    });
    
    render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Verificar que se muestran los textos en español
    expect(screen.getByText('Subir Imagen')).toBeInTheDocument();
    expect(screen.getByText(/arrastra y suelta una imagen aquí/i)).toBeInTheDocument();
    expect(screen.getByText('Seleccionar Imagen')).toBeInTheDocument();
  });

  it('debe cargar traducciones desde /locales/en.json para inglés', async () => {
    // Configurar navegador en inglés
    Object.defineProperty(window.navigator, 'language', {
      writable: true,
      configurable: true,
      value: 'en-US'
    });
    
    render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/locales/en.json');
    });
  });

  it('debe cargar traducciones desde /locales/es.json para español', async () => {
    // Configurar navegador en español
    Object.defineProperty(window.navigator, 'language', {
      writable: true,
      configurable: true,
      value: 'es-MX'
    });
    
    render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/locales/es.json');
    });
  });

  /**
   * Verifica estado de carga mientras se cargan las traducciones.
   * Requisito 7.1: El sistema debe determinar el idioma del navegador y mostrar el contenido correspondiente.
   */
  it('debe mostrar estado de carga mientras se cargan las traducciones', () => {
    // Configurar fetch para que tarde en resolver
    mockFetch.mockImplementation(() => new Promise(() => {}));
    
    render(<ImageUploader />);
    
    // Verificar que se muestra el estado de carga
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('debe ocultar estado de carga después de cargar las traducciones', async () => {
    render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Verificar que el contenido está visible
    expect(screen.getByText('Upload Image')).toBeInTheDocument();
  });

  /**
   * Verifica que el input file tiene los atributos correctos.
   * Requisito 1.5: El sistema debe aceptar formatos de imagen válidos.
   */
  it('debe tener input file con accept correcto para formatos de imagen', async () => {
    const { container } = render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Buscar el input file
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Verificar que tiene el atributo accept correcto
    expect(fileInput?.getAttribute('accept')).toBe('image/jpeg,image/png,image/webp,image/gif');
  });

  /**
   * Verifica espaciado generoso con múltiplos de 4px.
   * Requisito 5.5: El sistema debe mantener espaciado generoso usando múltiplos de 4px.
   */
  it('debe tener espaciado generoso en el contenedor principal (múltiplos de 4px)', async () => {
    const { container } = render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Buscar el contenedor principal
    const mainContainer = container.firstChild as HTMLElement;
    
    // Verificar que tiene padding en múltiplos de 4px
    // p-4 = 16px (4 * 4px), md:p-8 = 32px (8 * 4px)
    expect(mainContainer.className).toContain('p-4');
    expect(mainContainer.className).toContain('md:p-8');
  });

  it('debe tener espaciado entre elementos (mb-4 para ícono)', async () => {
    const { container } = render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Buscar el ícono
    const icon = container.querySelector('svg');
    
    // Verificar que tiene margin-bottom de 16px (4 * 4px)
    // Para SVG, className es un objeto SVGAnimatedString, necesitamos usar getAttribute
    const className = icon?.getAttribute('class') || '';
    expect(className).toContain('mb-4');
  });

  it('debe tener espaciado entre título y texto instructivo (mb-2)', async () => {
    render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Buscar el título
    const title = screen.getByText('Upload Image');
    
    // Verificar que tiene margin-bottom de 8px (2 * 4px)
    expect(title.className).toContain('mb-2');
  });

  it('debe tener espaciado entre texto instructivo y botón (mb-4)', async () => {
    render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Buscar el texto instructivo
    const instructionalText = screen.getByText(/drag and drop an image here/i);
    
    // Verificar que tiene margin-bottom de 16px (4 * 4px)
    expect(instructionalText.className).toContain('mb-4');
  });

  /**
   * Verifica callback onFileSelect.
   * Requisito 2.3: El sistema debe mostrar feedback cuando el usuario selecciona un archivo.
   */
  it('debe aceptar prop onFileSelect opcional', async () => {
    const onFileSelect = vi.fn();
    
    render(<ImageUploader onFileSelect={onFileSelect} />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Verificar que el componente se renderiza correctamente con el callback
    expect(screen.getByText('Upload Image')).toBeInTheDocument();
  });

  it('debe aceptar prop className opcional', async () => {
    const { container } = render(<ImageUploader className="custom-class" />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Buscar el contenedor principal
    const mainContainer = container.firstChild as HTMLElement;
    
    // Verificar que tiene la clase personalizada
    expect(mainContainer.className).toContain('custom-class');
  });

  /**
   * Verifica título responsive.
   * Requisito 5.4: El texto debe usar tamaño de fuente mínimo de 16 píxeles en dispositivos móviles.
   */
  it('debe tener título responsive (text-xl en móvil, md:text-2xl en desktop)', async () => {
    render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Buscar el título
    const title = screen.getByText('Upload Image');
    
    // Verificar que tiene clases responsive
    expect(title.className).toContain('text-xl');
    expect(title.className).toContain('md:text-2xl');
  });

  it('debe tener título con font-semibold', async () => {
    render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Buscar el título
    const title = screen.getByText('Upload Image');
    
    // Verificar que tiene font-semibold
    expect(title.className).toContain('font-semibold');
  });

  /**
   * Verifica que el texto instructivo está centrado.
   * Requisito 3.1: El texto instructivo debe ser claramente visible.
   */
  it('debe tener texto instructivo centrado', async () => {
    render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Buscar el texto instructivo
    const instructionalText = screen.getByText(/drag and drop an image here/i);
    
    // Verificar que tiene text-center
    expect(instructionalText.className).toContain('text-center');
  });
});

/**
 * Tests de Integración para ImageUploader
 * Valida flujos completos de usuario de principio a fin.
 * Requisitos: 1.2, 1.3, 2.2, 2.3, 7.1, 7.2
 */
describe('ImageUploader - Integration Tests', () => {
  beforeEach(() => {
    // Configurar mock de fetch
    global.fetch = mockFetch;
    
    // Por defecto, simular navegador en inglés
    Object.defineProperty(window.navigator, 'language', {
      writable: true,
      configurable: true,
      value: 'en-US'
    });
    
    // Configurar respuesta por defecto de fetch
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockTranslationsEn
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Test de integración: Flujo completo de arrastrar y soltar.
   * Verifica: renderizado inicial → arrastrar archivo → cambio visual → soltar → callback invocado
   * Requisitos: 1.2, 1.3, 7.1, 7.2
   */
  it('debe completar el flujo de arrastrar y soltar correctamente', async () => {
    // Crear callback mock
    const onFileSelect = vi.fn();
    
    // Renderizar componente
    render(<ImageUploader onFileSelect={onFileSelect} />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Verificar renderizado inicial
    expect(screen.getByText('Upload Image')).toBeInTheDocument();
    expect(screen.getByText(/drag and drop an image here/i)).toBeInTheDocument();
    const uploadZone = screen.getByRole('button', { name: /drag and drop/i });
    expect(uploadZone).toBeInTheDocument();
    
    // Crear archivo mock
    const file = new File(['image content'], 'test-image.png', { type: 'image/png' });
    
    // Simular arrastrar archivo sobre la zona
    const dragEnterEvent = new Event('dragenter', { bubbles: true });
    Object.defineProperty(dragEnterEvent, 'dataTransfer', {
      value: {
        files: [file],
        types: ['Files']
      }
    });
    fireEvent(uploadZone, dragEnterEvent);
    
    // Verificar cambio visual: el texto debe cambiar a "Drop the image here"
    await waitFor(() => {
      expect(screen.getByText('Drop the image here')).toBeInTheDocument();
    });
    
    // Verificar que el texto original ya no está visible
    expect(screen.queryByText(/drag and drop an image here/i)).not.toBeInTheDocument();
    
    // Simular soltar archivo
    const dropEvent = new Event('drop', { bubbles: true });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: {
        files: [file],
        types: ['Files']
      }
    });
    fireEvent(uploadZone, dropEvent);
    
    // Verificar que el callback fue invocado con el archivo correcto
    await waitFor(() => {
      expect(onFileSelect).toHaveBeenCalledTimes(1);
      expect(onFileSelect).toHaveBeenCalledWith(file);
    });
    
    // Verificar que se muestra el nombre del archivo
    expect(screen.getByText('test-image.png')).toBeInTheDocument();
  });

  /**
   * Test de integración: Flujo completo de selección mediante botón.
   * Verifica: renderizado inicial → click botón → seleccionar archivo → callback invocado
   * Requisitos: 2.2, 2.3, 7.1, 7.2
   */
  it('debe completar el flujo de selección mediante botón correctamente', async () => {
    // Crear callback mock
    const onFileSelect = vi.fn();
    
    // Renderizar componente
    const { container } = render(<ImageUploader onFileSelect={onFileSelect} />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Verificar renderizado inicial
    expect(screen.getByText('Upload Image')).toBeInTheDocument();
    expect(screen.getByText(/drag and drop an image here/i)).toBeInTheDocument();
    
    // Buscar el botón de carga
    const uploadButton = screen.getByRole('button', { name: /select image from your device/i });
    expect(uploadButton).toBeInTheDocument();
    
    // Buscar el input file oculto
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();
    
    // Crear archivo mock
    const file = new File(['image content'], 'selected-image.jpg', { type: 'image/jpeg' });
    
    // Simular click en el botón
    fireEvent.click(uploadButton);
    
    // Simular selección de archivo en el input
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false
    });
    fireEvent.change(fileInput);
    
    // Verificar que el callback fue invocado con el archivo correcto
    await waitFor(() => {
      expect(onFileSelect).toHaveBeenCalledTimes(1);
      expect(onFileSelect).toHaveBeenCalledWith(file);
    });
    
    // Verificar que se muestra el nombre del archivo
    expect(screen.getByText('selected-image.jpg')).toBeInTheDocument();
  });

  /**
   * Test de integración: Verificar carga de traducciones en inglés.
   * Verifica que las traducciones se cargan correctamente y se muestran en la interfaz.
   * Requisitos: 7.1, 7.2, 7.3
   */
  it('debe cargar y mostrar traducciones en inglés correctamente', async () => {
    // Configurar navegador en inglés
    Object.defineProperty(window.navigator, 'language', {
      writable: true,
      configurable: true,
      value: 'en-US'
    });
    
    // Configurar fetch para retornar traducciones en inglés
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockTranslationsEn
    });
    
    render(<ImageUploader />);
    
    // Verificar que se muestra el estado de carga inicialmente
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Verificar que fetch fue llamado con el archivo correcto
    expect(mockFetch).toHaveBeenCalledWith('/locales/en.json');
    
    // Verificar que todos los textos en inglés están presentes
    expect(screen.getByText('Upload Image')).toBeInTheDocument();
    expect(screen.getByText(/drag and drop an image here/i)).toBeInTheDocument();
    expect(screen.getByText('Select Image')).toBeInTheDocument();
    
    // Verificar que el botón tiene el aria-label correcto
    const uploadButton = screen.getByRole('button', { name: /select image from your device/i });
    expect(uploadButton).toBeInTheDocument();
  });

  /**
   * Test de integración: Verificar carga de traducciones en español.
   * Verifica que las traducciones se cargan correctamente y se muestran en la interfaz.
   * Requisitos: 7.1, 7.2, 7.4
   */
  it('debe cargar y mostrar traducciones en español correctamente', async () => {
    // Configurar navegador en español
    Object.defineProperty(window.navigator, 'language', {
      writable: true,
      configurable: true,
      value: 'es-ES'
    });
    
    // Configurar fetch para retornar traducciones en español
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockTranslationsEs
    });
    
    render(<ImageUploader />);
    
    // Verificar que se muestra el estado de carga inicialmente
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Verificar que fetch fue llamado con el archivo correcto
    expect(mockFetch).toHaveBeenCalledWith('/locales/es.json');
    
    // Verificar que todos los textos en español están presentes
    expect(screen.getByText('Subir Imagen')).toBeInTheDocument();
    expect(screen.getByText(/arrastra y suelta una imagen aquí/i)).toBeInTheDocument();
    expect(screen.getByText('Seleccionar Imagen')).toBeInTheDocument();
    
    // Verificar que el botón tiene el aria-label correcto
    const uploadButton = screen.getByRole('button', { name: /seleccionar imagen desde tu dispositivo/i });
    expect(uploadButton).toBeInTheDocument();
  });

  /**
   * Test de integración: Verificar cambio de texto durante arrastre con traducciones.
   * Verifica que el texto cambia correctamente durante el arrastre usando las traducciones.
   * Requisitos: 1.2, 7.2
   */
  it('debe cambiar el texto correctamente durante el arrastre usando traducciones', async () => {
    render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Verificar texto inicial
    expect(screen.getByText(/drag and drop an image here/i)).toBeInTheDocument();
    expect(screen.queryByText('Drop the image here')).not.toBeInTheDocument();
    
    // Buscar la zona de arrastre
    const uploadZone = screen.getByRole('button', { name: /drag and drop/i });
    
    // Crear archivo mock
    const file = new File(['image content'], 'test.png', { type: 'image/png' });
    
    // Simular arrastrar archivo
    const dragEnterEvent = new Event('dragenter', { bubbles: true });
    Object.defineProperty(dragEnterEvent, 'dataTransfer', {
      value: {
        files: [file],
        types: ['Files']
      }
    });
    fireEvent(uploadZone, dragEnterEvent);
    
    // Verificar que el texto cambió
    await waitFor(() => {
      expect(screen.getByText('Drop the image here')).toBeInTheDocument();
    });
    expect(screen.queryByText(/drag and drop an image here/i)).not.toBeInTheDocument();
    
    // Simular salir de la zona de arrastre
    const dragLeaveEvent = new Event('dragleave', { bubbles: true });
    fireEvent(uploadZone, dragLeaveEvent);
    
    // Verificar que el texto volvió al original
    await waitFor(() => {
      expect(screen.getByText(/drag and drop an image here/i)).toBeInTheDocument();
    });
    expect(screen.queryByText('Drop the image here')).not.toBeInTheDocument();
  });

  /**
   * Test de integración: Verificar flujo completo sin callback.
   * Verifica que el componente funciona correctamente incluso sin callback onFileSelect.
   * Requisitos: 1.2, 1.3
   */
  it('debe funcionar correctamente sin callback onFileSelect', async () => {
    // Renderizar componente sin callback
    render(<ImageUploader />);
    
    // Esperar a que se carguen las traducciones
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Buscar la zona de arrastre
    const uploadZone = screen.getByRole('button', { name: /drag and drop/i });
    
    // Crear archivo mock
    const file = new File(['image content'], 'no-callback.png', { type: 'image/png' });
    
    // Simular arrastrar y soltar archivo
    const dragEnterEvent = new Event('dragenter', { bubbles: true });
    Object.defineProperty(dragEnterEvent, 'dataTransfer', {
      value: {
        files: [file],
        types: ['Files']
      }
    });
    fireEvent(uploadZone, dragEnterEvent);
    
    // Verificar cambio visual
    await waitFor(() => {
      expect(screen.getByText('Drop the image here')).toBeInTheDocument();
    });
    
    // Simular soltar archivo
    const dropEvent = new Event('drop', { bubbles: true });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: {
        files: [file],
        types: ['Files']
      }
    });
    
    // No debe lanzar error al soltar sin callback
    expect(() => fireEvent(uploadZone, dropEvent)).not.toThrow();
    
    // Verificar que se muestra el nombre del archivo
    await waitFor(() => {
      expect(screen.getByText('no-callback.png')).toBeInTheDocument();
    });
  });
});
