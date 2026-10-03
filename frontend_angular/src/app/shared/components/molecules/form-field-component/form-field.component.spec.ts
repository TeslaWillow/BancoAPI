// ./frontend_angular/src/app/shared/components/molecules/form-field/form-field.component.test.ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldComponent } from './form-field.component';

@Component({
  imports: [FormFieldComponent],
  template: `
    <app-form-field label="Correo" forId="correo" [required]="true" [errorMessage]="error">
      <input id="correo" type="email" />
    </app-form-field>
  `,
})
class HostComponent {
  public error: string | null = null;
}

describe('FormFieldComponent', () => {
  const FOR_ID = 'nombre';
  const LABEL = 'Nombre completo';

  let fixture: ComponentFixture<FormFieldComponent>;
  let component: FormFieldComponent;

  const query = <T extends HTMLElement = HTMLElement>(selector: string): T | null =>
    fixture.nativeElement.querySelector(selector) as T | null;

  const setInputs = async (inputs: Record<string, unknown>): Promise<void> => {
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldComponent);
    component = fixture.componentInstance;
    // "label" y "forId" son inputs requeridos: deben asignarse antes de la primera detección
    fixture.componentRef.setInput('label', LABEL);
    fixture.componentRef.setInput('forId', FOR_ID);
    await fixture.whenStable();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
    expect(query('.form-field')).not.toBeNull();
  });

  describe('label', () => {
    it('debe mostrar el texto del label', () => {
      expect(query('label')?.textContent).toContain(LABEL);
    });

    it('debe asociar el label al control mediante for', () => {
      expect(query<HTMLLabelElement>('label')?.htmlFor).toBe(FOR_ID);
    });

    it('debe actualizar el label y el for cuando cambian los inputs', async () => {
      await setInputs({ label: 'Correo', forId: 'correo' });

      expect(query('label')?.textContent).toContain('Correo');
      expect(query<HTMLLabelElement>('label')?.htmlFor).toBe('correo');
    });
  });

  describe('indicador de requerido', () => {
    it('no debe mostrar el asterisco por defecto', () => {
      expect(component.required()).toBe(false);
      expect(query('.form-field__required')).toBeNull();
    });

    it('debe mostrar el asterisco oculto para lectores de pantalla si es requerido', async () => {
      await setInputs({ required: true });

      const asterisk = query('.form-field__required');

      expect(asterisk).not.toBeNull();
      expect(asterisk?.textContent).toContain('*');
      expect(asterisk?.getAttribute('aria-hidden')).toBe('true');
    });

    it('debe quitar el asterisco cuando required vuelve a false', async () => {
      await setInputs({ required: true });
      await setInputs({ required: false });

      expect(query('.form-field__required')).toBeNull();
    });
  });

  describe('mensaje de error', () => {
    it('no debe renderizar el error por defecto', () => {
      expect(component.errorMessage()).toBeNull();
      expect(query('.form-field__error')).toBeNull();
    });

    it('no debe renderizar el error si el mensaje es una cadena vacía', async () => {
      await setInputs({ errorMessage: '' });

      expect(query('.form-field__error')).toBeNull();
    });

    it('debe mostrar el mensaje con role="alert" e id derivado de forId', async () => {
      await setInputs({ errorMessage: 'Campo obligatorio' });

      const error = query('.form-field__error');

      expect(error).not.toBeNull();
      expect(error?.textContent?.trim()).toBe('Campo obligatorio');
      expect(error?.getAttribute('role')).toBe('alert');
      expect(error?.id).toBe(`${FOR_ID}-error`);
    });

    it('debe actualizar el id del error cuando cambia forId', async () => {
      await setInputs({ errorMessage: 'Inválido', forId: 'correo' });

      expect(query('.form-field__error')?.id).toBe('correo-error');
    });

    it('debe ocultar el error cuando el mensaje vuelve a null', async () => {
      await setInputs({ errorMessage: 'Campo obligatorio' });
      await setInputs({ errorMessage: null });

      expect(query('.form-field__error')).toBeNull();
    });
  });

  describe('proyección de contenido', () => {
    let hostFixture: ComponentFixture<HostComponent>;

    const hostQuery = <T extends HTMLElement = HTMLElement>(selector: string): T | null =>
      hostFixture.nativeElement.querySelector(selector) as T | null;

    beforeEach(async () => {
      hostFixture = TestBed.createComponent(HostComponent);
      await hostFixture.whenStable();
    });

    it('debe proyectar el control dentro de .form-field__control', () => {
      const projected = hostQuery('.form-field__control input');

      expect(projected).not.toBeNull();
      expect(projected?.id).toBe('correo');
    });

    it('debe enlazar el label proyectado con el input proyectado', () => {
      const label = hostQuery<HTMLLabelElement>('label');
      const input = hostQuery<HTMLInputElement>('.form-field__control input');

      expect(label?.htmlFor).toBe(input?.id);
      expect(label?.textContent).toContain('Correo');
    });

    it('debe reflejar el error del componente padre', async () => {
      expect(hostQuery('.form-field__error')).toBeNull();

      hostFixture.componentInstance.error = 'Correo inválido';
      hostFixture.changeDetectorRef.markForCheck();
      await hostFixture.whenStable();

      expect(hostQuery('.form-field__error')?.textContent?.trim()).toBe('Correo inválido');
    });
  });
});
