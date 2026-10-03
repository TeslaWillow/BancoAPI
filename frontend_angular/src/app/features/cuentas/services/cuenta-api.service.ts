// ./src/app/features/cuentas/services/cuenta-api.service.ts
import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';
import { Cuenta, CuentaBackendDTO, CreateCuentaFormPayload } from '../models/cuenta.model';
import { CuentaAdapter } from '../adapters/cuenta.adapter';
import { ApiService } from '../../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class CuentaApiService {
  private readonly _api = inject(ApiService);
  private readonly _apiUrl = '/api/v1/cuentas';

  public getAll(): Observable<Cuenta[]> {
    return this._api.get<CuentaBackendDTO[]>(this._apiUrl).pipe(map(CuentaAdapter.toDomainList));
  }

  public create(payload: CreateCuentaFormPayload): Observable<Cuenta> {
    const body = CuentaAdapter.toApiCreate(payload);
    return this._api.post<CuentaBackendDTO>(this._apiUrl, body).pipe(map(CuentaAdapter.toDomain));
  }

  public update(
    accountNumber: string,
    payload: Partial<CreateCuentaFormPayload>,
    cuenta: Cuenta,
  ): Observable<Cuenta> {
    const body = CuentaAdapter.toApiUpdate(payload, cuenta);
    return this._api
      .put<CuentaBackendDTO>(`${this._apiUrl}/${accountNumber}`, body)
      .pipe(map(CuentaAdapter.toDomain));
  }

  // Softdelete por el estado
  public delete(accountNumber: string): Observable<void> {
    return this._api.delete<void>(`${this._apiUrl}/${accountNumber}`);
  }
}
