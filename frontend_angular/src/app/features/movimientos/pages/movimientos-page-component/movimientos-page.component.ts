// ./src/app/features/movimientos/pages/movimientos-page/movimientos-page.component.ts
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MovimientoApiService } from '../../services/movimiento-api.service';
import { CuentaApiService } from '../../../cuentas/services/cuenta-api.service';
import { Movimiento, CreateMovimientoFormPayload } from '../../models/movimiento.model';
import { Cuenta } from '../../../cuentas/models/cuenta.model';
import { MovimientoFormComponent } from '../../components/movimiento-form-component/movimiento-form.component';

@Component({
  selector: 'app-movimientos-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MovimientoFormComponent],
  templateUrl: './movimientos-page.component.html',
  styleUrl: './movimientos-page.component.scss',
})
export class MovimientosPageComponent implements OnInit {
  private readonly movimientoApi = inject(MovimientoApiService);
  private readonly cuentaApi = inject(CuentaApiService);

  readonly movimientos = signal<Movimiento[]>([]);
  readonly cuentas = signal<Cuenta[]>([]);
  readonly searchTerm = signal<string>('');
  readonly isModalOpen = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  readonly filteredMovimientos = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.movimientos();

    return this.movimientos().filter(
      (m) =>
        m.accountNumber.toLowerCase().includes(term) || m.movementType.toLowerCase().includes(term),
    );
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.movimientoApi.getAll().subscribe({
      next: (data) => this.movimientos.set(data),
      error: (err) => console.error('Error al cargar movimientos', err),
    });

    this.cuentaApi.getAll().subscribe({
      next: (data) => this.cuentas.set(data),
      error: (err) => console.error('Error al cargar cuentas', err),
    });
  }

  openModal(): void {
    this.errorMessage.set(null);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.errorMessage.set(null);
    this.isModalOpen.set(false);
  }

  handleCreate(payload: CreateMovimientoFormPayload): void {
    this.errorMessage.set(null);
    this.movimientoApi.create(payload).subscribe({
      next: () => {
        this.closeModal();
        this.loadData();
      },
      error: (error: HttpErrorResponse) => {
        const msg = error.error?.message || 'Error al procesar el movimiento.';
        this.errorMessage.set(msg);
      },
    });
  }
}
