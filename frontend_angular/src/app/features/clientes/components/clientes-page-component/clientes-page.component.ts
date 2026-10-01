// ./frontend_angular/src/app/features/clientes/pages/clientes-page/clientes-page.component.ts
import { Component, inject, signal, computed, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-clientes-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderActionsComponent,
    TableComponent,
    ModalComponent,
    ClienteFormComponent,
  ],
  templateUrl: './clientes-page.component.html',
  styleUrls: ['./clientes-page.component.scss'],
})
export class ClientesPageComponent implements OnInit {
  private readonly clienteApiService = inject(ClienteApiService);

  clientes = signal<Cliente[]>([]);
  searchQuery = signal<string>('');
  isLoading = signal<boolean>(false);
  isModalOpen = signal<boolean>(false);

  columns: TableColumn<Cliente>[] = [
    { key: 'id', header: 'ID' },
    { key: 'fullName', header: 'Nombre Completo' },
    { key: 'documentId', header: 'Identificación' },
  ];

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
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  handleCreateCliente(payload: CreateClienteFormPayload): void {
    this.clienteApiService.create(payload).subscribe({
      next: (newCliente) => {
        this.clientes.update((list) => [...list, newCliente]);
        this.closeModal();
      },
    });
  }
}
