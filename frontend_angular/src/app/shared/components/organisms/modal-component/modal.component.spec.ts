// ./frontend_angular/src/app/shared/components/organisms/modal/modal.component.test.ts
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';

@Component({
  imports: [ModalComponent],
  template: `
    <app-modal
      [isOpen]="isOpen()"
      title="Nuevo cliente"
      [closeOnBackdropClick]="closeOnBackdrop()"
      (closeModal)="closed()"
    >
      <p modal-body id="projected-body">Contenido del cuerpo</p>
      <button modal-footer id="projected-footer" type="button">Guardar</button>
    </app-modal>
  `,
})
class HostComponent {
  public isOpen = signal(true);
  public closeOnBackdrop = signal(false);
  public closeCount = 0;

  public closed(): void {
    this.closeCount++;
  }
}

describe('ModalComponent', () => {
  const TITLE = 'Nuevo cliente';

  let fixture: ComponentFixture<ModalComponent>;
  let component: ModalComponent;
  let closeSpy: jest.Mock;

  const query = <T extends HTMLElement = HTMLElement>(selector: string): T | null =>
    fixture.nativeElement.querySelector(selector) as T | null;

  const setInputs = async (inputs: Record<string, unknown>): Promise<void> => {
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    await fixture.whenStable();
  };

  const pressEscape = (): KeyboardEvent => {
    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
    return event;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    // "isOpen" y "title" son inputs requeridos: deben asignarse antes de la primera detección
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('title', TITLE);
    await fixture.whenStable();

    closeSpy = jest.fn();
    component.closeModal.subscribe(closeSpy);
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('visibilidad', () => {
    it('debe renderizar el modal cuando isOpen es true', () => {
      expect(query('.modal-backdrop')).not.toBeNull();
      expect(query('.modal')).not.toBeNull();
    });

    it('no debe renderizar nada cuando isOpen es false', async () => {
      await setInputs({ isOpen: false });

      expect(query('.modal-backdrop')).toBeNull();
      expect(query('.modal')).toBeNull();
    });

    it('debe volver a mostrarse al reabrirse', async () => {
      await setInputs({ isOpen: false });
      await setInputs({ isOpen: true });

      expect(query('.modal')).not.toBeNull();
    });
  });

  describe('contenido y accesibilidad', () => {
    it('debe mostrar el título en el encabezado', () => {
      expect(query('.modal__title')?.textContent?.trim()).toBe(TITLE);
    });

    it('debe actualizar el título cuando cambia el input', async () => {
      await setInputs({ title: 'Editar cliente' });

      expect(query('.modal__title')?.textContent?.trim()).toBe('Editar cliente');
    });

    it('debe exponer role="dialog", aria-modal y aria-label con el título', () => {
      const backdrop = query('.modal-backdrop');

      expect(backdrop?.getAttribute('role')).toBe('dialog');
      expect(backdrop?.getAttribute('aria-modal')).toBe('true');
      expect(backdrop?.getAttribute('aria-label')).toBe(TITLE);
    });

    it('debe renderizar el botón de cerrar con type="button" y aria-label', () => {
      const closeButton = query<HTMLButtonElement>('.modal__close');

      expect(closeButton).not.toBeNull();
      expect(closeButton?.type).toBe('button');
      expect(closeButton?.getAttribute('aria-label')).toBe('Cerrar modal');
    });
  });

  describe('botón de cerrar', () => {
    it('debe emitir closeModal al hacer click', () => {
      query('.modal__close')?.click();

      expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    it('debe emitir closeModal aunque closeOnBackdropClick sea false', () => {
      expect(component.closeOnBackdropClick()).toBe(false);

      query('.modal__close')?.click();

      expect(closeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('click fuera del modal (backdrop)', () => {
    it('no debe cerrarse por defecto', () => {
      expect(component.closeOnBackdropClick()).toBe(false);

      query('.modal-backdrop')?.click();

      expect(closeSpy).not.toHaveBeenCalled();
      expect(query('.modal')).not.toBeNull();
    });

    it('debe cerrarse al hacer click en el backdrop si closeOnBackdropClick es true', async () => {
      await setInputs({ closeOnBackdropClick: true });

      query('.modal-backdrop')?.click();

      expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    it('no debe cerrarse al hacer click dentro del modal aunque closeOnBackdropClick sea true', async () => {
      await setInputs({ closeOnBackdropClick: true });

      query('.modal')?.click();
      query('.modal__header')?.click();
      query('.modal__title')?.click();
      query('.modal__body')?.click();
      query('.modal__footer')?.click();

      expect(closeSpy).not.toHaveBeenCalled();
    });

    it('debe volver a ignorar el backdrop si closeOnBackdropClick regresa a false', async () => {
      await setInputs({ closeOnBackdropClick: true });
      await setInputs({ closeOnBackdropClick: false });

      query('.modal-backdrop')?.click();

      expect(closeSpy).not.toHaveBeenCalled();
    });

    it('onBackdropClick debe ignorar eventos cuyo target no es el backdrop', async () => {
      await setInputs({ closeOnBackdropClick: true });
      const inner = document.createElement('div');
      inner.className = 'modal';

      component.onBackdropClick({ target: inner } as unknown as MouseEvent);

      expect(closeSpy).not.toHaveBeenCalled();
    });
  });

  describe('tecla Escape', () => {
    it('debe emitir closeModal y prevenir el comportamiento por defecto cuando está abierto', () => {
      const event = pressEscape();

      expect(closeSpy).toHaveBeenCalledTimes(1);
      expect(event.defaultPrevented).toBe(true);
    });

    it('debe cerrarse con Escape aunque closeOnBackdropClick sea false', () => {
      expect(component.closeOnBackdropClick()).toBe(false);

      pressEscape();

      expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    it('no debe emitir ni prevenir el evento cuando está cerrado', async () => {
      await setInputs({ isOpen: false });

      const event = pressEscape();

      expect(closeSpy).not.toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(false);
    });

    it('debe ignorar otras teclas', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));

      expect(closeSpy).not.toHaveBeenCalled();
    });
  });

  describe('proyección de contenido', () => {
    let hostFixture: ComponentFixture<HostComponent>;
    let host: HostComponent;

    const hostQuery = <T extends HTMLElement = HTMLElement>(selector: string): T | null =>
      hostFixture.nativeElement.querySelector(selector) as T | null;

    beforeEach(async () => {
      hostFixture = TestBed.createComponent(HostComponent);
      host = hostFixture.componentInstance;
      await hostFixture.whenStable();
    });

    it('debe proyectar [modal-body] dentro de .modal__body', () => {
      const body = hostQuery('.modal__body #projected-body');

      expect(body).not.toBeNull();
      expect(body?.textContent).toContain('Contenido del cuerpo');
    });

    it('debe proyectar [modal-footer] dentro de .modal__footer', () => {
      const footer = hostQuery('.modal__footer #projected-footer');

      expect(footer).not.toBeNull();
      expect(footer?.textContent).toContain('Guardar');
    });

    it('no debe cerrarse al hacer click en el backdrop con la configuración por defecto', async () => {
      hostQuery('.modal-backdrop')?.click();
      await hostFixture.whenStable();

      expect(host.closeCount).toBe(0);
      expect(hostQuery('.modal')).not.toBeNull();
    });

    it('debe notificar al padre al hacer click en el backdrop si se habilita closeOnBackdropClick', async () => {
      host.closeOnBackdrop.set(true);
      await hostFixture.whenStable();

      hostQuery('.modal-backdrop')?.click();

      expect(host.closeCount).toBe(1);
    });

    it('debe notificar al padre al hacer click en el botón de cerrar', () => {
      hostQuery('.modal__close')?.click();

      expect(host.closeCount).toBe(1);
    });

    it('debe dejar de renderizar el contenido proyectado cuando el padre lo cierra', async () => {
      host.isOpen.set(false);
      await hostFixture.whenStable();

      expect(hostQuery('.modal')).toBeNull();
    });
  });
});
