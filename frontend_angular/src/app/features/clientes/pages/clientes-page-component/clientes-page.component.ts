// ./frontend_angular/src/app/features/clientes/pages/clientes-page/clientes-page.component.ts
import { Component, inject, signal, computed, OnInit, viewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteApiService } from '../../services/cliente-api.service';
import { Cliente, CreateClienteFormPayload } from '../../models/cliente.model';
import { HeaderActionsComponent } from '../../../../shared/components/molecules/header-actions-component/header-actions.component';
import {
  TableComponent,
  TableColumn,
} from '../../../../shared/components/organisms/table-component/table.component';
import { ModalComponent } from '../../../../shared/components/organisms/modal-component/modal.component';
import { ClienteFormComponent } from '../../components/cliente-form-component/cliente-form.component';
import { ConfirmDialogComponent } from '../../../../shared/components/molecules/confirm-dialog-component/confirm-dialog.component';
import { ButtonComponent } from '../../../../shared/components/atoms/button/button.component';

@Component({
  selector: 'app-clientes-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderActionsComponent,
    TableComponent,
    ModalComponent,
    ClienteFormComponent,
    ConfirmDialogComponent,
    ButtonComponent,
  ],
  templateUrl: './clientes-page.component.html',
  styleUrls: ['./clientes-page.component.scss'],
})
export class ClientesPageComponent implements OnInit {
  private readonly clienteApiService = inject(ClienteApiService);

  readonly actionsTemplate = viewChild<TemplateRef<{ $implicit: Cliente }>>('actionsTemplate');

  clientes = signal<Cliente[]>([]);
  searchQuery = signal<string>('');
  isLoading = signal<boolean>(false);
  isModalOpen = signal<boolean>(false);

  clienteToEdit = signal<Cliente | null>(null);
  isEditMode = computed(() => this.clienteToEdit() !== null);
  modalTitle = computed(() => (this.isEditMode() ? 'Editar Cliente' : 'Registrar Nuevo Cliente'));

  clienteToDelete = signal<Cliente | null>(null);
  isConfirmDialogOpen = signal<boolean>(false);

  confirmDialogMessage = computed(() => {
    const c = this.clienteToDelete();
    if (!c) {
      return '¿Está seguro de eliminar este cliente? Esta acción también desactivará todas sus cuentas asociadas.';
    }
    return `¿Está seguro de eliminar al cliente "${c.fullName}"? Esta acción también desactivará todas sus cuentas asociadas.`;
  });

  readonly columns = computed<TableColumn<Cliente>[]>(() => [
    { key: 'id', header: 'ID' },
    { key: 'fullName', header: 'Nombre Completo' },
    { key: 'documentId', header: 'Identificación' },
    {
      key: 'actions',
      header: 'Acciones',
      cellTemplate: this.actionsTemplate(),
    },
  ]);

  filteredClientes = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.clientes();

    return this.clientes().filter(
      (c) => c.fullName.toLowerCase().includes(query) || c.documentId.toLowerCase().includes(query),
    );
  });

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.isLoading.set(true);
    this.clienteApiService.getAll().subscribe({
      next: (data) => {
        this.clientes.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  openModal(): void {
    this.clienteToEdit.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(cliente: Cliente): void {
    this.clienteToEdit.set(cliente);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.clienteToEdit.set(null);
  }

  handleSubmitCliente(payload: CreateClienteFormPayload): void {
    if (this.isEditMode()) {
      this.handleUpdateCliente(payload);
    } else {
      this.handleCreateCliente(payload);
    }
  }

  handleCreateCliente(payload: CreateClienteFormPayload): void {
    this.clienteApiService.create(payload).subscribe({
      next: (newCliente) => {
        this.clientes.update((list) => [...list, newCliente]);
        this.closeModal();
      },
    });
  }

  handleUpdateCliente(payload: CreateClienteFormPayload): void {
    const cliente = this.clienteToEdit();
    if (!cliente || cliente.id == null) {
      this.closeModal();
      return;
    }

    this.clienteApiService.update(cliente.id, payload, cliente).subscribe({
      next: (updatedCliente) => {
        this.clientes.update((list) =>
          list.map((c) => (c.id === updatedCliente.id ? updatedCliente : c)),
        );
        this.closeModal();
      },
      error: (err) => {
        // El modal permanece abierto para que el usuario pueda corregir y reintentar
        console.error('Error al actualizar cliente', err);
      },
    });
  }

  promptDelete(cliente: Cliente): void {
    this.clienteToDelete.set(cliente);
    this.isConfirmDialogOpen.set(true);
  }

  cancelDelete(): void {
    this.isConfirmDialogOpen.set(false);
    this.clienteToDelete.set(null);
  }

  confirmDelete(): void {
    const cliente = this.clienteToDelete();
    if (!cliente || cliente.id == null) {
      this.cancelDelete();
      return;
    }

    this.clienteApiService.delete(cliente.id).subscribe({
      next: () => {
        this.loadClientes();
        this.cancelDelete();
      },
      error: (err) => {
        console.error('Error al eliminar cliente', err);
        this.cancelDelete();
      },
    });
  }
}
