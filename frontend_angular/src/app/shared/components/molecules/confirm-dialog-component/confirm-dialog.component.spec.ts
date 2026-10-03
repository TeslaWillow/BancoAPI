// ./frontend_angular/src/app/shared/components/molecules/confirm-dialog/confirm-dialog.component.test.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let component: ConfirmDialogComponent;

  const query = <T extends HTMLElement = HTMLElement>(selector: string): T | null =>
    fixture.nativeElement.querySelector(selector) as T | null;

  const getButtons = (): HTMLButtonElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('app-button button'));

  const getCancelButton = (): HTMLButtonElement => getButtons()[0];
  const getConfirmButton = (): HTMLButtonElement => getButtons()[1];

  const setInputs = async (inputs: Record<string, unknown>): Promise<void> => {
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    await fixture.whenStable();
  };

  const openDialog = (): Promise<void> => setInputs({ isOpen: true });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('visibilidad', () => {
    it('debe estar cerrado por defecto', () => {
      expect(component.isOpen).toBe(false);
      expect(query('.modal-backdrop')).toBeNull();
      expect(query('.modal-content')).toBeNull();
    });

    it('debe renderizar el modal cuando isOpen es true', async () => {
      await openDialog();

      expect(query('.modal-backdrop')).not.toBeNull();
      expect(query('.modal-content')).not.toBeNull();
    });

    it('debe ocultar el modal cuando isOpen vuelve a false', async () => {
      await openDialog();
      await setInputs({ isOpen: false });

      expect(query('.modal-backdrop')).toBeNull();
    });
  });

  describe('contenido', () => {
    beforeEach(async () => {
      await openDialog();
    });

    it('debe mostrar el título y el mensaje por defecto', () => {
      expect(query('h3')?.textContent?.trim()).toBe('Confirmar Acción');
      expect(query('.modal-content p')?.textContent?.trim()).toBe(
        '¿Está seguro de realizar esta acción?',
      );
    });

    it('debe mostrar el título y el mensaje personalizados', async () => {
      await setInputs({
        title: 'Eliminar cliente',
        message: 'Esta acción no se puede deshacer.',
      });

      expect(query('h3')?.textContent?.trim()).toBe('Eliminar cliente');
      expect(query('.modal-content p')?.textContent?.trim()).toBe(
        'Esta acción no se puede deshacer.',
      );
    });

    it('debe renderizar los botones Cancelar y Confirmar en ese orden', () => {
      const buttons = getButtons();

      expect(buttons).toHaveLength(2);
      expect(buttons[0].textContent).toContain('Cancelar');
      expect(buttons[1].textContent).toContain('Confirmar');
    });

    it('debe usar la variante outline para Cancelar y danger para Confirmar', () => {
      expect(getCancelButton().classList).toContain('btn--outline');
      expect(getConfirmButton().classList).toContain('btn--danger');
    });
  });

  describe('eventos', () => {
    let confirmSpy: jest.SpyInstance;
    let cancelSpy: jest.SpyInstance;

    beforeEach(async () => {
      confirmSpy = jest.spyOn(component.confirm, 'emit');
      cancelSpy = jest.spyOn(component.cancel, 'emit');
      await openDialog();
    });

    it('debe emitir confirm (y no cancel) al hacer click en Confirmar', () => {
      getConfirmButton().click();

      expect(confirmSpy).toHaveBeenCalledTimes(1);
      expect(cancelSpy).not.toHaveBeenCalled();
    });

    it('debe emitir cancel una sola vez (y no confirm) al hacer click en Cancelar', () => {
      getCancelButton().click();

      expect(cancelSpy).toHaveBeenCalledTimes(1);
      expect(confirmSpy).not.toHaveBeenCalled();
    });

    it('debe emitir cancel al hacer click en el backdrop', () => {
      query('.modal-backdrop')?.click();

      expect(cancelSpy).toHaveBeenCalledTimes(1);
      expect(confirmSpy).not.toHaveBeenCalled();
    });

    it('no debe emitir nada al hacer click dentro del contenido del modal', () => {
      query('.modal-content')?.click();
      query('h3')?.click();
      query('.modal-content p')?.click();

      expect(cancelSpy).not.toHaveBeenCalled();
      expect(confirmSpy).not.toHaveBeenCalled();
    });
  });

  describe('métodos públicos', () => {
    it('onConfirm debe emitir confirm', () => {
      const spy = jest.fn();
      component.confirm.subscribe(spy);

      component.onConfirm();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('onCancel debe emitir cancel', () => {
      const spy = jest.fn();
      component.cancel.subscribe(spy);

      component.onCancel();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
