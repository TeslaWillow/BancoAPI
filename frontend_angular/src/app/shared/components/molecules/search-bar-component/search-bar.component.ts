// ./frontend_angular/src/app/shared/components/molecules/search-bar/search-bar.component.ts
import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  public placeholder = input<string>('Buscar');
  public ariaLabel = input<string>('Buscar registros');

  public search = output<string>();
  public searchTerm = signal<string>('');

  public onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.search.emit(value);
  }

  public clearSearch(): void {
    this.searchTerm.set('');
    this.search.emit('');
  }
}
