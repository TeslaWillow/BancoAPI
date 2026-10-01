// ./frontend_angular/src/app/shared/components/organisms/table/table.component.ts
import { Component, input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn<T> {
  key: string;
  header: string;
  cellTemplate?: TemplateRef<{ $implicit: T }>;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> {
  columns = input.required<TableColumn<T>[]>();
  data = input.required<T[]>();
  isLoading = input<boolean>(false);
  emptyMessage = input<string>('No se encontraron registros.');
  ariaLabel = input<string>('Tabla de datos');

  getValue(item: T, key: string): unknown {
    const keys = key.split('.');
    let value: unknown = item;
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    return value ?? 'N/A';
  }
}
