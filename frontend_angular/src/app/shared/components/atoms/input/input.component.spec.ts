// ./frontend_angular/src/app/shared/components/atoms/input/input.component.test.ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { InputComponent } from './input.component';

@Component({
  imports: [InputComponent, ReactiveFormsModule],
  template: `<app-input id="nombre" label="Nombre" [formControl]="control" />`,
})
class HostComponent {
  public control = new FormControl<string>('', { nonNullable: true });
}

describe('InputComponent', () => {
  const INPUT_ID = 'test-input';

  let fixture: ComponentFixture<InputComponent>;
  let component: InputComponent;

  const getInput = (): HTMLInputElement =>
    fixture.nativeElement.querySelector('input') as HTMLInputElement;

  const getLabel = (): HTMLLabelElement | null => fixture.nativeElement.querySelector('label');

  const getError = (): HTMLElement | null =>
    fixture.nativeElement.querySelector('.input-field__error');

  const setInputs = async (inputs: Record<string, unknown>): Promise<void> => {
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    await fixture.whenStable();
  };

  const typeInto = (el: HTMLInputElement, text: string): void => {
    el.value = text;
    el.dispatchEvent(new Event('input'));
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    // "id" es un input requerido: debe asignarse antes de la primera detección
    fixture.componentRef.setInput('id', INPUT_ID);
    await fixture.whenStable();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
    expect(getInput()).not.toBeNull();
  });

  describe('valores por defecto', () => {
    it('debe renderizar un input de texto vacío, sin label ni error', () => {
      const input = getInput();

      expect(input.id).toBe(INPUT_ID);
      expect(input.type).toBe('text');
      expect(input.value).toBe('');
      expect(input.placeholder).toBe('');
      expect(input.disabled).toBe(false);
      expect(getLabel()).toBeNull();
      expect(getError()).toBeNull();
    });
  });

  describe('atributos del input', () => {
    it.each(['text', 'number', 'email', 'password'] as const)(
      'debe aplicar type="%s"',
      async (type) => {
        await setInputs({ type });

        expect(getInput().type).toBe(type);
      },
    );

    it('debe aplicar el placeholder', async () => {
      await setInputs({ placeholder: 'Ingrese su nombre' });

      expect(getInput().placeholder).toBe('Ingrese su nombre');
    });

    it('debe aplicar el id al elemento input', async () => {
      await setInputs({ id: 'otro-id' });

      expect(getInput().id).toBe('otro-id');
    });
  });

  describe('label', () => {
    it('no debe renderizar el label si está vacío', () => {
      expect(getLabel()).toBeNull();
    });

    it('debe renderizar el label asociado al input', async () => {
      await setInputs({ label: 'Nombre' });

      const label = getLabel();

      expect(label).not.toBeNull();
      expect(label?.textContent).toContain('Nombre');
      expect(label?.htmlFor).toBe(INPUT_ID);
    });

    it('no debe mostrar el asterisco si no es requerido', async () => {
      await setInputs({ label: 'Nombre' });

      expect(fixture.nativeElement.querySelector('.input-field__required')).toBeNull();
    });

    it('debe mostrar el asterisco oculto para lectores de pantalla si es requerido', async () => {
      await setInputs({ label: 'Nombre', required: true });

      const asterisk = fixture.nativeElement.querySelector('.input-field__required');

      expect(asterisk).not.toBeNull();
      expect(asterisk.textContent).toContain('*');
      expect(asterisk.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('mensaje de error', () => {
    it('debe marcar aria-invalid="false" y no tener aria-describedby sin error', () => {
      const input = getInput();

      expect(input.getAttribute('aria-invalid')).toBe('false');
      expect(input.hasAttribute('aria-describedby')).toBe(false);
      expect(input.classList).not.toContain('input-field__control--error');
    });

    describe('cuando hay un error', () => {
      beforeEach(async () => {
        await setInputs({ errorMessage: 'Campo obligatorio' });
      });

      it('debe mostrar el mensaje con role="alert"', () => {
        const error = getError();

        expect(error).not.toBeNull();
        expect(error?.textContent?.trim()).toBe('Campo obligatorio');
        expect(error?.getAttribute('role')).toBe('alert');
        expect(error?.id).toBe(`${INPUT_ID}-error`);
      });

      it('debe marcar aria-invalid="true" y enlazar aria-describedby', () => {
        const input = getInput();

        expect(input.getAttribute('aria-invalid')).toBe('true');
        expect(input.getAttribute('aria-describedby')).toBe(`${INPUT_ID}-error`);
      });

      it('debe agregar la clase de error al input', () => {
        expect(getInput().classList).toContain('input-field__control--error');
      });

      it('debe limpiar el estado de error cuando el mensaje desaparece', async () => {
        await setInputs({ errorMessage: null });

        expect(getError()).toBeNull();
        expect(getInput().getAttribute('aria-invalid')).toBe('false');
        expect(getInput().hasAttribute('aria-describedby')).toBe(false);
        expect(getInput().classList).not.toContain('input-field__control--error');
      });
    });
  });

  describe('ControlValueAccessor', () => {
    it('writeValue debe reflejar el valor en el input', async () => {
      component.writeValue('Héctor');
      await fixture.whenStable();

      expect(component.value()).toBe('Héctor');
      expect(getInput().value).toBe('Héctor');
    });

    it.each([null, undefined])('writeValue con %s debe dejar el valor vacío', async (nullish) => {
      component.writeValue('algo');
      component.writeValue(nullish as unknown as string);
      await fixture.whenStable();

      expect(component.value()).toBe('');
      expect(getInput().value).toBe('');
    });

    it('debe llamar a onChange y actualizar el valor al escribir', () => {
      const onChange = jest.fn();
      component.registerOnChange(onChange);

      typeInto(getInput(), 'hola');

      expect(component.value()).toBe('hola');
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('hola');
    });

    it('debe llamar a onTouched al perder el foco', () => {
      const onTouched = jest.fn();
      component.registerOnTouched(onTouched);

      getInput().dispatchEvent(new Event('blur'));

      expect(onTouched).toHaveBeenCalledTimes(1);
    });

    it('no debe lanzar errores al escribir o perder foco sin callbacks registrados', () => {
      expect(() => {
        typeInto(getInput(), 'texto');
        getInput().dispatchEvent(new Event('blur'));
      }).not.toThrow();
    });

    it('setDisabledState debe deshabilitar y rehabilitar el input', async () => {
      component.setDisabledState(true);
      await fixture.whenStable();
      expect(getInput().disabled).toBe(true);

      component.setDisabledState(false);
      await fixture.whenStable();
      expect(getInput().disabled).toBe(false);
    });
  });

  describe('integración con formularios reactivos', () => {
    let hostFixture: ComponentFixture<HostComponent>;
    let control: FormControl<string>;

    const getHostInput = (): HTMLInputElement =>
      hostFixture.nativeElement.querySelector('input') as HTMLInputElement;

    beforeEach(async () => {
      hostFixture = TestBed.createComponent(HostComponent);
      control = hostFixture.componentInstance.control;
      await hostFixture.whenStable();
    });

    it('debe renderizar el label recibido', () => {
      expect(hostFixture.nativeElement.querySelector('label').textContent).toContain('Nombre');
    });

    it('debe actualizar el FormControl al escribir', () => {
      typeInto(getHostInput(), 'Ana');

      expect(control.value).toBe('Ana');
    });

    it('debe reflejar en el input los cambios hechos desde el FormControl', async () => {
      control.setValue('Carlos');
      await hostFixture.whenStable();

      expect(getHostInput().value).toBe('Carlos');
    });

    it('debe marcar el control como touched al perder el foco', () => {
      expect(control.touched).toBe(false);

      getHostInput().dispatchEvent(new Event('blur'));

      expect(control.touched).toBe(true);
    });

    it('debe deshabilitar el input al deshabilitar el FormControl', async () => {
      control.disable();
      await hostFixture.whenStable();
      expect(getHostInput().disabled).toBe(true);

      control.enable();
      await hostFixture.whenStable();
      expect(getHostInput().disabled).toBe(false);
    });
  });
});
