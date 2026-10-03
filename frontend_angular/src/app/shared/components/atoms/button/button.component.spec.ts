// ./frontend_angular/src/app/shared/components/atoms/button/button.component.test.ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent, ButtonSize, ButtonType, ButtonVariant } from './button.component';

// Componente para probar el componente ButtonComponent
@Component({
  imports: [ButtonComponent],
  template: `<app-button (clicked)="onClicked()">Guardar</app-button>`,
})
class HostComponent {
  public clicks = 0;

  public onClicked(): void {
    this.clicks++;
  }
}

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonComponent>;
  let component: ButtonComponent;

  const getButton = (): HTMLButtonElement =>
    fixture.nativeElement.querySelector('button') as HTMLButtonElement;

  const setInputs = async (inputs: Record<string, unknown>): Promise<void> => {
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    await fixture.whenStable();
  };

  const createClickEvent = (): MouseEvent =>
    new MouseEvent('click', { bubbles: true, cancelable: true });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
    expect(getButton()).not.toBeNull();
  });

  describe('valores por defecto', () => {
    it('debe usar type="button", variante primary y tamaño md', () => {
      const button = getButton();

      expect(button.type).toBe('button');
      expect(button.classList).toContain('btn');
      expect(button.classList).toContain('btn--primary');
      expect(button.classList).toContain('btn--md');
    });

    it('debe estar habilitado, sin loading y sin aria-label', () => {
      const button = getButton();

      expect(button.disabled).toBe(false);
      expect(button.getAttribute('aria-disabled')).toBe('false');
      expect(button.hasAttribute('aria-label')).toBe(false);
      expect(button.classList).not.toContain('btn--loading');
      expect(fixture.nativeElement.querySelector('.btn__spinner')).toBeNull();
    });
  });

  describe('inputs de apariencia', () => {
    it.each<ButtonType>(['button', 'submit', 'reset'])('debe aplicar type="%s"', async (type) => {
      await setInputs({ type });

      expect(getButton().type).toBe(type);
    });

    it.each<ButtonVariant>(['primary', 'secondary', 'outline', 'ghost', 'danger'])(
      'debe aplicar la clase btn--%s',
      async (variant) => {
        await setInputs({ variant });

        expect(getButton().classList).toContain(`btn--${variant}`);
      },
    );

    it.each<ButtonSize>(['sm', 'md', 'lg'])('debe aplicar la clase btn--%s', async (size) => {
      await setInputs({ size });

      expect(getButton().classList).toContain(`btn--${size}`);
    });

    it('debe reemplazar la clase de variante anterior al cambiar el input', async () => {
      await setInputs({ variant: 'danger' });
      await setInputs({ variant: 'ghost' });

      expect(getButton().classList).toContain('btn--ghost');
      expect(getButton().classList).not.toContain('btn--danger');
    });
  });

  describe('accesibilidad', () => {
    it('debe establecer aria-label cuando se proporciona', async () => {
      await setInputs({ ariaLabel: 'Guardar cambios' });

      expect(getButton().getAttribute('aria-label')).toBe('Guardar cambios');
    });

    it('debe establecer disabled y aria-disabled cuando disabled es true', async () => {
      await setInputs({ disabled: true });

      expect(getButton().disabled).toBe(true);
      expect(getButton().getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('estado de carga', () => {
    beforeEach(async () => {
      await setInputs({ isLoading: true });
    });

    it('debe deshabilitar el botón y marcar aria-disabled', () => {
      expect(getButton().disabled).toBe(true);
      expect(getButton().getAttribute('aria-disabled')).toBe('true');
    });

    it('debe agregar la clase btn--loading', () => {
      expect(getButton().classList).toContain('btn--loading');
    });

    it('debe mostrar el spinner y el texto para lectores de pantalla', () => {
      const spinner = fixture.nativeElement.querySelector('.btn__spinner');
      const srOnly = fixture.nativeElement.querySelector('.sr-only');

      expect(spinner).not.toBeNull();
      expect(spinner.getAttribute('aria-hidden')).toBe('true');
      expect(srOnly?.textContent?.trim()).toBe('Cargando...');
    });

    it('debe ocultar el contenido proyectado', () => {
      const content = fixture.nativeElement.querySelector('button > span:last-of-type');

      expect(content.classList).toContain('btn__content--hidden');
    });

    it('debe quitar spinner y mostrar el contenido al terminar la carga', async () => {
      await setInputs({ isLoading: false });

      const content = fixture.nativeElement.querySelector('button > span:last-of-type');

      expect(fixture.nativeElement.querySelector('.btn__spinner')).toBeNull();
      expect(fixture.nativeElement.querySelector('.sr-only')).toBeNull();
      expect(content.classList).not.toContain('btn__content--hidden');
      expect(getButton().disabled).toBe(false);
    });
  });

  describe('handleClick', () => {
    let clickedSpy: jest.Mock;

    beforeEach(() => {
      clickedSpy = jest.fn();
      component.clicked.subscribe(clickedSpy);
    });

    it('debe emitir clicked con el evento cuando está habilitado', () => {
      getButton().click();

      expect(clickedSpy).toHaveBeenCalledTimes(1);
      expect(clickedSpy).toHaveBeenCalledWith(expect.any(MouseEvent));
    });

    it('no debe bloquear el evento cuando está habilitado', () => {
      const event = createClickEvent();
      const preventDefault = jest.spyOn(event, 'preventDefault');
      const stopPropagation = jest.spyOn(event, 'stopPropagation');

      component.handleClick(event);

      expect(preventDefault).not.toHaveBeenCalled();
      expect(stopPropagation).not.toHaveBeenCalled();
      expect(clickedSpy).toHaveBeenCalledWith(event);
    });

    it.each([
      ['disabled', { disabled: true }],
      ['isLoading', { isLoading: true }],
    ])('no debe emitir y debe bloquear el evento cuando %s es true', async (_label, inputs) => {
      await setInputs(inputs);

      const event = createClickEvent();
      const preventDefault = jest.spyOn(event, 'preventDefault');
      const stopPropagation = jest.spyOn(event, 'stopPropagation');

      component.handleClick(event);

      expect(clickedSpy).not.toHaveBeenCalled();
      expect(preventDefault).toHaveBeenCalledTimes(1);
      expect(stopPropagation).toHaveBeenCalledTimes(1);
    });

    it('no debe emitir al hacer click en el DOM si está deshabilitado', async () => {
      await setInputs({ disabled: true });

      getButton().click();

      expect(clickedSpy).not.toHaveBeenCalled();
    });
  });

  describe('proyección de contenido', () => {
    let hostFixture: ComponentFixture<HostComponent>;

    beforeEach(async () => {
      hostFixture = TestBed.createComponent(HostComponent);
      await hostFixture.whenStable();
    });

    it('debe renderizar el contenido proyectado dentro del botón', () => {
      const button: HTMLButtonElement = hostFixture.nativeElement.querySelector('button');

      expect(button.textContent).toContain('Guardar');
    });

    it('debe notificar al componente padre cuando se hace click', () => {
      const button: HTMLButtonElement = hostFixture.nativeElement.querySelector('button');

      button.click();

      expect(hostFixture.componentInstance.clicks).toBe(1);
    });
  });
});
