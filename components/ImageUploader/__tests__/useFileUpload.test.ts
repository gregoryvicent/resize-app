/**
 * Property-based tests para el hook useFileUpload.
 * Valida el comportamiento del hook mediante propiedades universales.
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { useFileUpload } from '../useFileUpload';

/**
 * Crea un evento de arrastre mock para testing.
 * 
 * @returns Evento de arrastre simulado con métodos preventDefault y stopPropagation
 */
function createMockDragEvent(): React.DragEvent {
  return {
    preventDefault: () => {},
    stopPropagation: () => {},
    dataTransfer: {
      files: [] as unknown as FileList,
    },
  } as React.DragEvent;
}

/**
 * Feature: image-upload-interface, Property 1: Cambio de estado al arrastrar
 * Valida: Requisitos 1.2, 3.2
 * 
 * Para cualquier evento de arrastre sobre la zona de carga, el estado isDragging 
 * debe cambiar a true y las clases CSS de feedback visual deben aplicarse.
 */
describe('Property 1: Cambio de estado al arrastrar', () => {
  it('debe activar isDragging a true para cualquier evento de drag enter', () => {
    fc.assert(
      fc.property(
        // Generador: cualquier valor arbitrario para simular diferentes contextos
        fc.anything(),
        () => {
          // Renderizar el hook
          const { result } = renderHook(() => useFileUpload());
          
          // Verificar estado inicial
          expect(result.current.isDragging).toBe(false);
          
          // Crear evento mock
          const mockEvent = createMockDragEvent();
          
          // Ejecutar handler de drag enter
          act(() => {
            result.current.handleDragEnter(mockEvent);
          });
          
          // Verificar que isDragging cambió a true
          expect(result.current.isDragging).toBe(true);
        }
      ),
      { numRuns: 100 } // Ejecutar 100 iteraciones como especifica el diseño
    );
  });

  it('debe mantener isDragging en true para múltiples eventos de drag enter consecutivos', () => {
    fc.assert(
      fc.property(
        // Generador: número de eventos consecutivos (entre 1 y 10)
        fc.integer({ min: 1, max: 10 }),
        (numEvents) => {
          const { result } = renderHook(() => useFileUpload());
          
          // Verificar estado inicial
          expect(result.current.isDragging).toBe(false);
          
          // Ejecutar múltiples eventos de drag enter
          act(() => {
            for (let i = 0; i < numEvents; i++) {
              const mockEvent = createMockDragEvent();
              result.current.handleDragEnter(mockEvent);
            }
          });
          
          // Verificar que isDragging sigue siendo true
          expect(result.current.isDragging).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe activar isDragging independientemente del callback onFileSelect', () => {
    fc.assert(
      fc.property(
        // Generador: booleano para decidir si se pasa callback o no
        fc.boolean(),
        (hasCallback) => {
          // Renderizar con o sin callback
          const callback = hasCallback ? () => {} : undefined;
          const { result } = renderHook(() => useFileUpload(callback));
          
          // Verificar estado inicial
          expect(result.current.isDragging).toBe(false);
          
          // Crear evento mock
          const mockEvent = createMockDragEvent();
          
          // Ejecutar handler de drag enter
          act(() => {
            result.current.handleDragEnter(mockEvent);
          });
          
          // Verificar que isDragging cambió a true independientemente del callback
          expect(result.current.isDragging).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: image-upload-interface, Property 3: Actualización de estado al recibir archivo
 * Valida: Requisitos 1.3, 2.3
 * 
 * Para cualquier archivo válido recibido (mediante arrastre o selección), el estado 
 * selectedFile debe actualizarse con el archivo y el callback onFileSelect debe invocarse.
 */
describe('Property 3: Actualización de estado al recibir archivo', () => {
  /**
   * Crea un archivo mock para testing.
   * 
   * @param name - Nombre del archivo
   * @param type - Tipo MIME del archivo
   * @param size - Tamaño del archivo en bytes
   * @returns Archivo simulado
   */
  function createMockFile(name: string, type: string, size: number): File {
    const blob = new Blob(['x'.repeat(size)], { type });
    return new File([blob], name, { type });
  }

  /**
   * Crea un evento de drop mock con archivos.
   * 
   * @param files - Array de archivos a incluir en el evento
   * @returns Evento de drop simulado
   */
  function createMockDropEvent(files: File[]): React.DragEvent {
    const fileList = {
      length: files.length,
      item: (index: number) => files[index] || null,
      ...files,
    } as unknown as FileList;

    return {
      preventDefault: () => {},
      stopPropagation: () => {},
      dataTransfer: {
        files: fileList,
      },
    } as React.DragEvent;
  }

  /**
   * Crea un evento de change mock para input file.
   * 
   * @param files - Array de archivos a incluir en el evento
   * @returns Evento de change simulado
   */
  function createMockChangeEvent(files: File[]): React.ChangeEvent<HTMLInputElement> {
    const fileList = {
      length: files.length,
      item: (index: number) => files[index] || null,
      ...files,
    } as unknown as FileList;

    return {
      target: {
        files: fileList,
      },
    } as React.ChangeEvent<HTMLInputElement>;
  }

  it('debe actualizar selectedFile para cualquier archivo válido mediante drop', () => {
    fc.assert(
      fc.property(
        // Generadores: nombre de archivo, tipo MIME de imagen, tamaño
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.constantFrom('image/jpeg', 'image/png', 'image/webp', 'image/gif'),
        fc.integer({ min: 1, max: 10 * 1024 * 1024 }), // 1 byte a 10MB
        (fileName, mimeType, fileSize) => {
          const { result } = renderHook(() => useFileUpload());
          
          // Verificar estado inicial
          expect(result.current.selectedFile).toBeNull();
          
          // Crear archivo mock
          const mockFile = createMockFile(fileName, mimeType, fileSize);
          const mockEvent = createMockDropEvent([mockFile]);
          
          // Ejecutar handler de drop
          act(() => {
            result.current.handleDrop(mockEvent);
          });
          
          // Verificar que selectedFile se actualizó con el archivo
          expect(result.current.selectedFile).not.toBeNull();
          expect(result.current.selectedFile?.name).toBe(fileName);
          expect(result.current.selectedFile?.type).toBe(mimeType);
          expect(result.current.selectedFile?.size).toBe(fileSize);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe actualizar selectedFile para cualquier archivo válido mediante input file', () => {
    fc.assert(
      fc.property(
        // Generadores: nombre de archivo, tipo MIME de imagen, tamaño
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.constantFrom('image/jpeg', 'image/png', 'image/webp', 'image/gif'),
        fc.integer({ min: 1, max: 10 * 1024 * 1024 }), // 1 byte a 10MB
        (fileName, mimeType, fileSize) => {
          const { result } = renderHook(() => useFileUpload());
          
          // Verificar estado inicial
          expect(result.current.selectedFile).toBeNull();
          
          // Crear archivo mock
          const mockFile = createMockFile(fileName, mimeType, fileSize);
          const mockEvent = createMockChangeEvent([mockFile]);
          
          // Ejecutar handler de file select
          act(() => {
            result.current.handleFileSelect(mockEvent);
          });
          
          // Verificar que selectedFile se actualizó con el archivo
          expect(result.current.selectedFile).not.toBeNull();
          expect(result.current.selectedFile?.name).toBe(fileName);
          expect(result.current.selectedFile?.type).toBe(mimeType);
          expect(result.current.selectedFile?.size).toBe(fileSize);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe invocar callback onFileSelect para cualquier archivo mediante drop', () => {
    fc.assert(
      fc.property(
        // Generadores: nombre de archivo, tipo MIME de imagen, tamaño
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.constantFrom('image/jpeg', 'image/png', 'image/webp', 'image/gif'),
        fc.integer({ min: 1, max: 10 * 1024 * 1024 }),
        (fileName, mimeType, fileSize) => {
          // Variable para capturar el archivo pasado al callback
          let callbackFile: File | null = null;
          const callback = (file: File) => {
            callbackFile = file;
          };
          
          const { result } = renderHook(() => useFileUpload(callback));
          
          // Crear archivo mock
          const mockFile = createMockFile(fileName, mimeType, fileSize);
          const mockEvent = createMockDropEvent([mockFile]);
          
          // Ejecutar handler de drop
          act(() => {
            result.current.handleDrop(mockEvent);
          });
          
          // Verificar que el callback fue invocado con el archivo correcto
          expect(callbackFile).not.toBeNull();
          expect(callbackFile?.name).toBe(fileName);
          expect(callbackFile?.type).toBe(mimeType);
          expect(callbackFile?.size).toBe(fileSize);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe invocar callback onFileSelect para cualquier archivo mediante input file', () => {
    fc.assert(
      fc.property(
        // Generadores: nombre de archivo, tipo MIME de imagen, tamaño
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.constantFrom('image/jpeg', 'image/png', 'image/webp', 'image/gif'),
        fc.integer({ min: 1, max: 10 * 1024 * 1024 }),
        (fileName, mimeType, fileSize) => {
          // Variable para capturar el archivo pasado al callback
          let callbackFile: File | null = null;
          const callback = (file: File) => {
            callbackFile = file;
          };
          
          const { result } = renderHook(() => useFileUpload(callback));
          
          // Crear archivo mock
          const mockFile = createMockFile(fileName, mimeType, fileSize);
          const mockEvent = createMockChangeEvent([mockFile]);
          
          // Ejecutar handler de file select
          act(() => {
            result.current.handleFileSelect(mockEvent);
          });
          
          // Verificar que el callback fue invocado con el archivo correcto
          expect(callbackFile).not.toBeNull();
          expect(callbackFile?.name).toBe(fileName);
          expect(callbackFile?.type).toBe(mimeType);
          expect(callbackFile?.size).toBe(fileSize);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe restaurar isDragging a false después de drop con archivo', () => {
    fc.assert(
      fc.property(
        // Generadores: nombre de archivo, tipo MIME de imagen, tamaño
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.constantFrom('image/jpeg', 'image/png', 'image/webp', 'image/gif'),
        fc.integer({ min: 1, max: 10 * 1024 * 1024 }),
        (fileName, mimeType, fileSize) => {
          const { result } = renderHook(() => useFileUpload());
          
          // Activar estado de arrastre
          const mockDragEnterEvent = createMockDragEvent();
          act(() => {
            result.current.handleDragEnter(mockDragEnterEvent);
          });
          
          // Verificar que isDragging está en true
          expect(result.current.isDragging).toBe(true);
          
          // Crear archivo mock y evento de drop
          const mockFile = createMockFile(fileName, mimeType, fileSize);
          const mockDropEvent = createMockDropEvent([mockFile]);
          
          // Ejecutar handler de drop
          act(() => {
            result.current.handleDrop(mockDropEvent);
          });
          
          // Verificar que isDragging volvió a false
          expect(result.current.isDragging).toBe(false);
          // Y que el archivo se seleccionó correctamente
          expect(result.current.selectedFile).not.toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe manejar correctamente cuando no hay archivos en el evento drop', () => {
    fc.assert(
      fc.property(
        // Generador: cualquier valor arbitrario
        fc.anything(),
        () => {
          const { result } = renderHook(() => useFileUpload());
          
          // Crear evento de drop sin archivos
          const mockEvent = createMockDropEvent([]);
          
          // Ejecutar handler de drop
          act(() => {
            result.current.handleDrop(mockEvent);
          });
          
          // Verificar que selectedFile sigue siendo null
          expect(result.current.selectedFile).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe manejar correctamente cuando no hay archivos en el evento change', () => {
    fc.assert(
      fc.property(
        // Generador: cualquier valor arbitrario
        fc.anything(),
        () => {
          const { result } = renderHook(() => useFileUpload());
          
          // Crear evento de change sin archivos
          const mockEvent = createMockChangeEvent([]);
          
          // Ejecutar handler de file select
          act(() => {
            result.current.handleFileSelect(mockEvent);
          });
          
          // Verificar que selectedFile sigue siendo null
          expect(result.current.selectedFile).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe actualizar selectedFile con el primer archivo cuando hay múltiples archivos en drop', () => {
    fc.assert(
      fc.property(
        // Generadores: dos archivos diferentes
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.constantFrom('image/jpeg', 'image/png', 'image/webp', 'image/gif'),
        fc.integer({ min: 1, max: 10 * 1024 * 1024 }),
        (fileName1, fileName2, mimeType, fileSize) => {
          const { result } = renderHook(() => useFileUpload());
          
          // Crear dos archivos mock
          const mockFile1 = createMockFile(fileName1, mimeType, fileSize);
          const mockFile2 = createMockFile(fileName2, mimeType, fileSize);
          const mockEvent = createMockDropEvent([mockFile1, mockFile2]);
          
          // Ejecutar handler de drop
          act(() => {
            result.current.handleDrop(mockEvent);
          });
          
          // Verificar que selectedFile es el primer archivo
          expect(result.current.selectedFile).not.toBeNull();
          expect(result.current.selectedFile?.name).toBe(fileName1);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: image-upload-interface, Property 4: Activación del selector de archivos
 * Valida: Requisitos 2.2
 * 
 * Para cualquier evento de click en el botón de carga, el input file nativo 
 * debe activarse mediante la referencia.
 */
describe('Property 4: Activación del selector de archivos', () => {
  it('debe activar el input file para cualquier llamada a triggerFileInput', () => {
    fc.assert(
      fc.property(
        // Generador: cualquier valor arbitrario para simular diferentes contextos
        fc.anything(),
        () => {
          // Renderizar el hook
          const { result } = renderHook(() => useFileUpload());
          
          // Crear un elemento input mock
          const mockInput = document.createElement('input');
          mockInput.type = 'file';
          
          // Espiar el método click
          const clickSpy = vi.spyOn(mockInput, 'click');
          
          // Asignar el mock a la referencia del hook
          (result.current.fileInputRef as React.MutableRefObject<HTMLInputElement>).current = mockInput;
          
          // Ejecutar triggerFileInput
          act(() => {
            result.current.triggerFileInput();
          });
          
          // Verificar que el método click fue invocado
          expect(clickSpy).toHaveBeenCalledTimes(1);
          
          // Limpiar
          clickSpy.mockRestore();
        }
      ),
      { numRuns: 100 } // Ejecutar 100 iteraciones como especifica el diseño
    );
  });

  it('debe activar el input file independientemente del callback onFileSelect', () => {
    fc.assert(
      fc.property(
        // Generador: booleano para decidir si se pasa callback o no
        fc.boolean(),
        (hasCallback) => {
          // Renderizar con o sin callback
          const callback = hasCallback ? () => {} : undefined;
          const { result } = renderHook(() => useFileUpload(callback));
          
          // Crear un elemento input mock
          const mockInput = document.createElement('input');
          mockInput.type = 'file';
          
          // Espiar el método click
          const clickSpy = vi.spyOn(mockInput, 'click');
          
          // Asignar el mock a la referencia del hook
          (result.current.fileInputRef as React.MutableRefObject<HTMLInputElement>).current = mockInput;
          
          // Ejecutar triggerFileInput
          act(() => {
            result.current.triggerFileInput();
          });
          
          // Verificar que el método click fue invocado independientemente del callback
          expect(clickSpy).toHaveBeenCalledTimes(1);
          
          // Limpiar
          clickSpy.mockRestore();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe manejar correctamente cuando fileInputRef.current es null', () => {
    fc.assert(
      fc.property(
        // Generador: cualquier valor arbitrario
        fc.anything(),
        () => {
          // Renderizar el hook
          const { result } = renderHook(() => useFileUpload());
          
          // Forzar fileInputRef.current a null
          (result.current.fileInputRef as React.MutableRefObject<HTMLInputElement | null>).current = null;
          
          // Ejecutar triggerFileInput no debería lanzar error
          expect(() => {
            act(() => {
              result.current.triggerFileInput();
            });
          }).not.toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe poder activar el input file múltiples veces consecutivas', () => {
    fc.assert(
      fc.property(
        // Generador: número de veces a activar (entre 1 y 10)
        fc.integer({ min: 1, max: 10 }),
        (numClicks) => {
          const { result } = renderHook(() => useFileUpload());
          
          // Crear un elemento input mock
          const mockInput = document.createElement('input');
          mockInput.type = 'file';
          
          // Espiar el método click
          const clickSpy = vi.spyOn(mockInput, 'click');
          
          // Asignar el mock a la referencia del hook
          (result.current.fileInputRef as React.MutableRefObject<HTMLInputElement>).current = mockInput;
          
          // Ejecutar triggerFileInput múltiples veces
          act(() => {
            for (let i = 0; i < numClicks; i++) {
              result.current.triggerFileInput();
            }
          });
          
          // Verificar que el método click fue invocado el número correcto de veces
          expect(clickSpy).toHaveBeenCalledTimes(numClicks);
          
          // Limpiar
          clickSpy.mockRestore();
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: image-upload-interface, Property 2: Restauración de estado al salir
 * Valida: Requisitos 1.4
 * 
 * Para cualquier evento de salida de arrastre, el estado isDragging debe volver 
 * a false y las clases CSS deben restaurarse al estado original.
 */
describe('Property 2: Restauración de estado al salir', () => {
  it('debe restaurar isDragging a false para cualquier evento de drag leave', () => {
    fc.assert(
      fc.property(
        // Generador: cualquier valor arbitrario para simular diferentes contextos
        fc.anything(),
        () => {
          // Renderizar el hook
          const { result } = renderHook(() => useFileUpload());
          
          // Primero activar el estado de arrastre
          const mockDragEnterEvent = createMockDragEvent();
          act(() => {
            result.current.handleDragEnter(mockDragEnterEvent);
          });
          
          // Verificar que isDragging está en true
          expect(result.current.isDragging).toBe(true);
          
          // Crear evento de drag leave
          const mockDragLeaveEvent = createMockDragEvent();
          
          // Ejecutar handler de drag leave
          act(() => {
            result.current.handleDragLeave(mockDragLeaveEvent);
          });
          
          // Verificar que isDragging volvió a false
          expect(result.current.isDragging).toBe(false);
        }
      ),
      { numRuns: 100 } // Ejecutar 100 iteraciones como especifica el diseño
    );
  });

  it('debe restaurar isDragging a false independientemente de cuántos drag enter previos', () => {
    fc.assert(
      fc.property(
        // Generador: número de eventos drag enter consecutivos (entre 1 y 10)
        fc.integer({ min: 1, max: 10 }),
        (numDragEnters) => {
          const { result } = renderHook(() => useFileUpload());
          
          // Ejecutar múltiples eventos de drag enter
          act(() => {
            for (let i = 0; i < numDragEnters; i++) {
              const mockEvent = createMockDragEvent();
              result.current.handleDragEnter(mockEvent);
            }
          });
          
          // Verificar que isDragging está en true
          expect(result.current.isDragging).toBe(true);
          
          // Ejecutar un solo drag leave
          const mockDragLeaveEvent = createMockDragEvent();
          act(() => {
            result.current.handleDragLeave(mockDragLeaveEvent);
          });
          
          // Verificar que isDragging volvió a false
          expect(result.current.isDragging).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe mantener isDragging en false para múltiples eventos de drag leave consecutivos', () => {
    fc.assert(
      fc.property(
        // Generador: número de eventos drag leave consecutivos (entre 1 y 10)
        fc.integer({ min: 1, max: 10 }),
        (numDragLeaves) => {
          const { result } = renderHook(() => useFileUpload());
          
          // Primero activar el estado de arrastre
          const mockDragEnterEvent = createMockDragEvent();
          act(() => {
            result.current.handleDragEnter(mockDragEnterEvent);
          });
          
          // Ejecutar múltiples eventos de drag leave
          act(() => {
            for (let i = 0; i < numDragLeaves; i++) {
              const mockEvent = createMockDragEvent();
              result.current.handleDragLeave(mockEvent);
            }
          });
          
          // Verificar que isDragging sigue siendo false
          expect(result.current.isDragging).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('debe restaurar isDragging independientemente del callback onFileSelect', () => {
    fc.assert(
      fc.property(
        // Generador: booleano para decidir si se pasa callback o no
        fc.boolean(),
        (hasCallback) => {
          // Renderizar con o sin callback
          const callback = hasCallback ? () => {} : undefined;
          const { result } = renderHook(() => useFileUpload(callback));
          
          // Activar el estado de arrastre
          const mockDragEnterEvent = createMockDragEvent();
          act(() => {
            result.current.handleDragEnter(mockDragEnterEvent);
          });
          
          // Verificar que isDragging está en true
          expect(result.current.isDragging).toBe(true);
          
          // Ejecutar drag leave
          const mockDragLeaveEvent = createMockDragEvent();
          act(() => {
            result.current.handleDragLeave(mockDragLeaveEvent);
          });
          
          // Verificar que isDragging volvió a false independientemente del callback
          expect(result.current.isDragging).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});
