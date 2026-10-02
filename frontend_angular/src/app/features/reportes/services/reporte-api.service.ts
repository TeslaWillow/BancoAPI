// ./src/app/features/reportes/services/reporte-api.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  MovimientoReporte,
  ReporteBackendResponseDTO,
  ReporteFilterParams,
} from '../models/reporte.model';
import { ReporteAdapter } from '../adapters/reporte.adapter';
import { ApiService } from '../../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class ReporteApiService {
  private readonly _api = inject(ApiService);
  private readonly _apiUrl = '/api/v1/reportes';

  public getReportData(params: ReporteFilterParams): Observable<MovimientoReporte[]> {
    const httpParams = new HttpParams()
      .set('fechaInicio', params.startDate)
      .set('fechaFin', params.endDate)
      .set('cliente', params.clientId);

    return this._api
      .get<ReporteBackendResponseDTO>(this._apiUrl, { params: httpParams })
      .pipe(map(ReporteAdapter.toDomainList));
  }

  public downloadPdf(params: ReporteFilterParams): Observable<Blob> {
    const httpParams = new HttpParams()
      .set('fechaInicio', params.startDate)
      .set('fechaFin', params.endDate)
      .set('clienteId', params.clientId);

    return this._api.getBlob(`${this._apiUrl}/pdf`, {
      params: httpParams,
    });
  }
}
