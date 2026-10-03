// ./frontend_angular/src/app/shared/components/molecules/header-actions/header-actions.component.test.ts
import { Component, input, output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SearchBarComponent } from '../search-bar-component/search-bar.component';
import { HeaderActionsComponent } from './header-actions.component';

@Component({
  selector: 'app-search-bar',
  template: '',
})
class SearchBarStubComponent {
  public placeholder = input<string>('');
  public search = output<string>();
}

describe('HeaderActionsComponent', () => {
  let fixture: ComponentFixture<HeaderActionsComponent>;
  let component: HeaderActionsComponent;

  const getSearchBar = (): SearchBarStubComponent =>
    fixture.debugElement.query(By.directive(SearchBarStubComponent))
      .componentInstance as SearchBarStubComponent;

  const getButton = (): HTMLButtonElement =>
    fixture.nativeElement.querySelector('app-button button') as HTMLButtonElement;

  const setInputs = async (inputs: Record<string, unknown>): Promise<void> => {
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderActionsComponent],
    })
      .overrideComponent(HeaderActionsComponent, {
        remove: { imports: [SearchBarComponent] },
        add: { imports: [SearchBarStubComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderActionsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.header-actions')).not.toBeNull();
  });

  describe('valores por defecto', () => {
    it('debe usar "Buscar" como placeholder de la barra de búsqueda', () => {
      expect(getSearchBar().placeholder()).toBe('Buscar');
    });

    it('debe mostrar "Nuevo" como texto del botón', () => {
      expect(getButton().textContent).toContain('Nuevo');
    });

    it('debe renderizar el botón con la variante secondary', () => {
      expect(getButton().classList).toContain('btn--secondary');
    });
  });

  describe('inputs', () => {
    it('debe pasar searchPlaceholder a la barra de búsqueda', async () => {
      await setInputs({ searchPlaceholder: 'Buscar clientes...' });

      expect(getSearchBar().placeholder()).toBe('Buscar clientes...');
    });

    it('debe mostrar buttonText en el botón', async () => {
      await setInputs({ buttonText: 'Nuevo cliente' });

      expect(getButton().textContent).toContain('Nuevo cliente');
      expect(getButton().textContent).not.toContain('Nuevo\n');
    });
  });

  describe('eventos', () => {
    let searchSpy: jest.Mock;
    let actionClickSpy: jest.Mock;

    beforeEach(() => {
      searchSpy = jest.fn();
      actionClickSpy = jest.fn();
      component.search.subscribe(searchSpy);
      component.actionClick.subscribe(actionClickSpy);
    });

    it('debe re-emitir search con el texto emitido por la barra de búsqueda', () => {
      getSearchBar().search.emit('ana');

      expect(searchSpy).toHaveBeenCalledTimes(1);
      expect(searchSpy).toHaveBeenCalledWith('ana');
      expect(actionClickSpy).not.toHaveBeenCalled();
    });

    it('debe re-emitir cada búsqueda por separado', () => {
      getSearchBar().search.emit('a');
      getSearchBar().search.emit('an');
      getSearchBar().search.emit('');

      expect(searchSpy).toHaveBeenCalledTimes(3);
      expect(searchSpy).toHaveBeenNthCalledWith(1, 'a');
      expect(searchSpy).toHaveBeenNthCalledWith(2, 'an');
      expect(searchSpy).toHaveBeenNthCalledWith(3, '');
    });

    it('debe emitir actionClick al hacer click en el botón', () => {
      getButton().click();

      expect(actionClickSpy).toHaveBeenCalledTimes(1);
      expect(searchSpy).not.toHaveBeenCalled();
    });

    it('debe emitir actionClick una vez por cada click', () => {
      getButton().click();
      getButton().click();

      expect(actionClickSpy).toHaveBeenCalledTimes(2);
    });
  });
});
