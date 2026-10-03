// ./frontend_angular/src/app/features/clientes/services/cliente-api.service.ts
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Cliente, ClienteBackendDTO, CreateClienteFormPayload } from '../models/cliente.model';
import { ClienteAdapter } from '../adapters/cliente.adapter';
import { ApiService } from '../../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class ClienteApiService {
  private readonly api = inject(ApiService);
  private readonly apiUrl = '/api/v1/clientes';

  public getAll(): Observable<Cliente[]> {
    return this.api.get<ClienteBackendDTO[]>(this.apiUrl).pipe(map(ClienteAdapter.toDomainList));
  }

  public create(payload: CreateClienteFormPayload): Observable<Cliente> {
    const body = ClienteAdapter.toApiCreate(payload);
    return this.api.post<ClienteBackendDTO>(this.apiUrl, body).pipe(map(ClienteAdapter.toDomain));
  }

  public update(
    id: number | string,
    payload: Partial<CreateClienteFormPayload>,
    cliente: Cliente,
  ): Observable<Cliente> {
    const body = ClienteAdapter.toApiUpdate(payload, cliente);
    return this.api
      .put<ClienteBackendDTO>(`${this.apiUrl}/${id}`, body)
      .pipe(map(ClienteAdapter.toDomain));
  }

  public delete(id: number | string): Observable<void> {
    return this.api.delete<void>(`${this.apiUrl}/${id}`);
  }
}
