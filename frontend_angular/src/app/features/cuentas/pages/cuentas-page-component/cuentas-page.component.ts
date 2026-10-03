// ./src/app/features/cuentas/pages/cuentas-page/cuentas-page.component.ts
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CuentaApiService } from '../../services/cuenta-api.service';
import { ClienteApiService } from '../../../clientes/services/cliente-api.service';
import { Cuenta, CreateCuentaFormPayload } from '../../models/cuenta.model';
import { Cliente } from '../../../clientes/models/cliente.model';
import { CuentaFormComponent } from '../../components/cuenta-form-component/cuenta-form.component';
import { ButtonComponent } from '../../../../shared/components/atoms/button/button.component';
import { ConfirmDialogComponent } from '../../../../shared/components/molecules/confirm-dialog-component/confirm-dialog.component';

@Component({
  selector: 'app-cuentas-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CuentaFormComponent,
    ButtonComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './cuentas-page.component.html',
  styleUrl: './cuentas-page.component.scss',
})
export class CuentasPageComponent implements OnInit {
  private readonly cuentaApi = inject(CuentaApiService);
  private readonly clienteApi = inject(ClienteApiService);

  readonly cuentas = signal<Cuenta[]>([]);
  readonly clientes = signal<Cliente[]>([]);
  readonly searchTerm = signal<string>('');
  readonly isLoading = signal<boolean>(false);
  readonly isModalOpen = signal<boolean>(false);

  readonly cuentaToEdit = signal<Cuenta | null>(null);
  readonly isEditMode = computed(() => this.cuentaToEdit() !== null);
  readonly modalTitle = computed(() =>
    this.isEditMode() ? 'Editar Cuenta' : 'Registrar Nueva Cuenta',
  );

  readonly cuentaToDelete = signal<Cuenta | null>(null);
  readonly isConfirmDialogOpen = signal<boolean>(false);
  readonly confirmDialogMessage = computed(() => {
    const cuenta = this.cuentaToDelete();
    if (!cuenta) {
      return '¿Está seguro de eliminar esta cuenta? La cuenta quedará inactiva.';
    }
    return `¿Está seguro de eliminar la cuenta "${cuenta.accountNumber}"? La cuenta quedará inactiva.`;
  });

  readonly filteredCuentas = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.cuentas();

    return this.cuentas().filter(
      (cuenta) =>
        cuenta.accountNumber.toLowerCase().includes(term) ||
        cuenta.accountType.toLowerCase().includes(term),
    );
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.cuentaApi.getAll().subscribe({
      next: (data) => {
        this.cuentas.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error al cargar cuentas', err);
      },
    });

    this.clienteApi.getAll().subscribe({
      next: (data) => this.clientes.set(data),
      error: (err) => console.error('Error al cargar clientes', err),
    });
  }

  openModal(): void {
    this.cuentaToEdit.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(cuenta: Cuenta): void {
    this.cuentaToEdit.set(cuenta);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.cuentaToEdit.set(null);
  }

  handleCreate(payload: CreateCuentaFormPayload): void {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.cuentaApi.create(payload).subscribe({
      next: () => {
        this.closeModal();
        this.isLoading.set(false);
        this.loadData();
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error al crear cuenta', err);
      },
    });
  }

  handleUpdate(changes: Partial<CreateCuentaFormPayload>): void {
    const cuenta = this.cuentaToEdit();
    if (!cuenta || this.isLoading()) return;

    // Sin cambios no hay nada que enviar al backend
    if (Object.keys(changes).length === 0) {
      this.closeModal();
      return;
    }

    this.isLoading.set(true);
    this.cuentaApi.update(cuenta.accountNumber, changes, cuenta).subscribe({
      next: () => {
        this.closeModal();
        this.isLoading.set(false);
        this.loadData();
      },
      error: (err) => {
        // El modal permanece abierto para que el usuario pueda corregir y reintentar
        this.isLoading.set(false);
        console.error('Error al actualizar cuenta', err);
      },
    });
  }

  promptDelete(cuenta: Cuenta): void {
    this.cuentaToDelete.set(cuenta);
    this.isConfirmDialogOpen.set(true);
  }

  cancelDelete(): void {
    this.isConfirmDialogOpen.set(false);
    this.cuentaToDelete.set(null);
  }

  confirmDelete(): void {
    const cuenta = this.cuentaToDelete();
    if (!cuenta) {
      this.cancelDelete();
      return;
    }

    this.cuentaApi.delete(cuenta.accountNumber).subscribe({
      next: () => {
        this.cancelDelete();
        this.loadData();
      },
      error: (err) => {
        console.error('Error al eliminar cuenta', err);
        this.cancelDelete();
      },
    });
  }
}
