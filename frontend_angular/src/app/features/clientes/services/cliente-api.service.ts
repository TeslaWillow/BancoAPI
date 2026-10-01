// ./frontend_angular/src/app/features/clientes/services/cliente-api.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Cliente } from '../models/cliente.model';
import { ClienteAdapter, ClienteV1Response } from '../adapters/cliente.adapter';

@Injectable({
  providedIn: 'root',
})
export class ClienteApiService {
  private readonly _apiService = inject(ApiService);
  private readonly _endpoint = '/api/v1/clientes';

  public getAll(): Observable<Cliente[]> {
    return this._apiService
      .get<ClienteV1Response[]>(this._endpoint)
      .pipe(map((dtos) => dtos.map(ClienteAdapter.fromV1ToDomain)));
  }

  public getById(id: string): Observable<Cliente> {
    return this._apiService
      .get<ClienteV1Response>(`${this._endpoint}/${id}`)
      .pipe(map(ClienteAdapter.fromV1ToDomain));
  }

  public create(cliente: Partial<Cliente>): Observable<Cliente> {
    const payload = {
      nombres: cliente.fullName,
      identificacion: cliente.documentId,
    };

    return this._apiService
      .post<ClienteV1Response>(this._endpoint, payload)
      .pipe(map(ClienteAdapter.fromV1ToDomain));
  }
}
