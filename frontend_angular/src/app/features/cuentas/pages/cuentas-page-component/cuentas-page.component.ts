// ./src/app/features/cuentas/pages/cuentas-page/cuentas-page.component.ts
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CuentaApiService } from '../../services/cuenta-api.service';
import { ClienteApiService } from '../../../clientes/services/cliente-api.service';
import { Cuenta, CreateCuentaFormPayload } from '../../models/cuenta.model';
import { Cliente } from '../../../clientes/models/cliente.model';
import { CuentaFormComponent } from '../../components/cuenta-form-component/cuenta-form.component';

@Component({
  selector: 'app-cuentas-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CuentaFormComponent],
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
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
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
}
