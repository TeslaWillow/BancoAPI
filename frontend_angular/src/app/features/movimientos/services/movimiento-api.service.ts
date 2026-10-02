// ./src/app/features/movimientos/services/movimiento-api.service.ts
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  Movimiento,
  MovimientoBackendDTO,
  CreateMovimientoFormPayload,
} from '../models/movimiento.model';
import { MovimientoAdapter } from '../adapters/movimiento.adapter';
import { ApiService } from '../../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class MovimientoApiService {
  private readonly _api = inject(ApiService);
  private readonly _apiUrl = '/api/v1/movimientos';

  public getAll(): Observable<Movimiento[]> {
    return this._api
      .get<MovimientoBackendDTO[]>(this._apiUrl)
      .pipe(map(MovimientoAdapter.toDomainList));
  }

  public create(payload: CreateMovimientoFormPayload): Observable<Movimiento> {
    const body = MovimientoAdapter.toApiCreate(payload);
    return this._api
      .post<MovimientoBackendDTO>(this._apiUrl, body)
      .pipe(map(MovimientoAdapter.toDomain));
  }
}
