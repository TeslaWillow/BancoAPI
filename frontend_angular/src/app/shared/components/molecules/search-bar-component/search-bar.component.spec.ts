// ./frontend_angular/src/app/shared/components/molecules/search-bar/search-bar.component.test.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let fixture: ComponentFixture<SearchBarComponent>;
  let component: SearchBarComponent;

  const getInput = (): HTMLInputElement =>
    fixture.nativeElement.querySelector('input') as HTMLInputElement;

  const getLabel = (): HTMLLabelElement =>
    fixture.nativeElement.querySelector('label') as HTMLLabelElement;

  const getClearButton = (): HTMLButtonElement | null =>
    fixture.nativeElement.querySelector('.search-bar__clear');

  const setInputs = async (inputs: Record<string, unknown>): Promise<void> => {
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    await fixture.whenStable();
  };

  const typeInto = async (text: string): Promise<void> => {
    const input = getInput();
    input.value = text;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.search-bar')).not.toBeNull();
  });

  describe('valores por defecto', () => {
    it('debe renderizar un input de texto vacío con el placeholder "Buscar"', () => {
      const input = getInput();

      expect(input.type).toBe('text');
      expect(input.value).toBe('');
      expect(input.placeholder).toBe('Buscar');
    });

    it('debe tener un label accesible asociado al input', () => {
      const label = getLabel();

      expect(label.textContent?.trim()).toBe('Buscar registros');
      expect(label.htmlFor).toBe(getInput().id);
      expect(label.classList).toContain('sr-only');
    });

    it('no debe mostrar el botón de limpiar', () => {
      expect(getClearButton()).toBeNull();
    });
  });

  describe('inputs', () => {
    it('debe aplicar el placeholder', async () => {
      await setInputs({ placeholder: 'Buscar clientes...' });

      expect(getInput().placeholder).toBe('Buscar clientes...');
    });

    it('debe aplicar el ariaLabel al label', async () => {
      await setInputs({ ariaLabel: 'Buscar cuentas' });

      expect(getLabel().textContent?.trim()).toBe('Buscar cuentas');
    });
  });

  describe('escritura', () => {
    let searchSpy: jest.Mock;

    beforeEach(() => {
      searchSpy = jest.fn();
      component.search.subscribe(searchSpy);
    });

    it('debe actualizar searchTerm y emitir search con el valor escrito', async () => {
      await typeInto('ana');

      expect(component.searchTerm()).toBe('ana');
      expect(searchSpy).toHaveBeenCalledTimes(1);
      expect(searchSpy).toHaveBeenCalledWith('ana');
    });

    it('debe emitir search por cada cambio del input', async () => {
      await typeInto('a');
      await typeInto('an');
      await typeInto('ana');

      expect(searchSpy).toHaveBeenCalledTimes(3);
      expect(searchSpy).toHaveBeenNthCalledWith(1, 'a');
      expect(searchSpy).toHaveBeenNthCalledWith(2, 'an');
      expect(searchSpy).toHaveBeenNthCalledWith(3, 'ana');
    });

    it('debe emitir cadena vacía si el usuario borra todo el texto', async () => {
      await typeInto('ana');
      await typeInto('');

      expect(component.searchTerm()).toBe('');
      expect(searchSpy).toHaveBeenLastCalledWith('');
    });
  });

  describe('botón de limpiar', () => {
    it('debe mostrarse cuando hay texto de búsqueda', async () => {
      await typeInto('ana');

      expect(getClearButton()).not.toBeNull();
    });

    it('debe tener type="button" y aria-label descriptivo', async () => {
      await typeInto('ana');

      const button = getClearButton();

      expect(button?.type).toBe('button');
      expect(button?.getAttribute('aria-label')).toBe('Limpiar búsqueda');
    });

    it('debe ocultarse cuando el texto queda vacío', async () => {
      await typeInto('ana');
      await typeInto('');

      expect(getClearButton()).toBeNull();
    });

    it('debe vaciar el input, ocultarse y emitir "" al hacer click', async () => {
      const searchSpy = jest.fn();
      component.search.subscribe(searchSpy);
      await typeInto('ana');
      searchSpy.mockClear();

      getClearButton()?.click();
      await fixture.whenStable();

      expect(component.searchTerm()).toBe('');
      expect(getInput().value).toBe('');
      expect(getClearButton()).toBeNull();
      expect(searchSpy).toHaveBeenCalledTimes(1);
      expect(searchSpy).toHaveBeenCalledWith('');
    });
  });

  describe('métodos públicos', () => {
    it('onInput debe leer el valor del evento, guardarlo y emitirlo', () => {
      const searchSpy = jest.fn();
      component.search.subscribe(searchSpy);
      const input = document.createElement('input');
      input.value = 'directo';
      const event = { target: input } as unknown as Event;

      component.onInput(event);

      expect(component.searchTerm()).toBe('directo');
      expect(searchSpy).toHaveBeenCalledWith('directo');
    });

    it('clearSearch debe vaciar searchTerm y emitir cadena vacía', () => {
      const searchSpy = jest.fn();
      component.search.subscribe(searchSpy);
      component.searchTerm.set('algo');

      component.clearSearch();

      expect(component.searchTerm()).toBe('');
      expect(searchSpy).toHaveBeenCalledWith('');
    });
  });
});
