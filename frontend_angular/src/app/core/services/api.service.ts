// ./frontend_angular/src/app/core/services/api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestOptions } from '../models/api-request.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly _http = inject(HttpClient);

  public get<T>(path: string, options?: RequestOptions): Observable<T> {
    return this._http.get<T>(path, this._buildOptions(options));
  }

  public getBlob(path: string, options?: Omit<RequestOptions, 'responseType'>): Observable<Blob> {
    return this._http.get(path, {
      ...this._buildOptions(options),
      responseType: 'blob',
    });
  }

  public post<T, K = unknown>(path: string, body: K, options?: RequestOptions): Observable<T> {
    return this._http.post<T>(path, body, this._buildOptions(options));
  }

  public put<T, K = unknown>(path: string, body: K, options?: RequestOptions): Observable<T> {
    return this._http.put<T>(path, body, this._buildOptions(options));
  }

  public patch<T, K = unknown>(path: string, body: K, options?: RequestOptions): Observable<T> {
    return this._http.patch<T>(path, body, this._buildOptions(options));
  }

  public delete<T>(path: string, options?: RequestOptions): Observable<T> {
    return this._http.delete<T>(path, options ? this._buildOptions(options) : undefined);
  }

  private _buildOptions(options?: RequestOptions): {
    headers?: HttpHeaders;
    params?: HttpParams;
    withCredentials?: boolean;
  } {
    if (!options) return {};

    let params = new HttpParams();
    if (options.params) {
      if (options.params instanceof HttpParams) {
        params = options.params;
      } else {
        Object.entries(options.params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params = params.set(key, String(value));
          }
        });
      }
    }

    let headers = new HttpHeaders();
    if (options.headers) {
      if (options.headers instanceof HttpHeaders) {
        headers = options.headers;
      } else {
        Object.entries(options.headers).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            headers = headers.set(key, Array.isArray(value) ? value.join(',') : String(value));
          }
        });
      }
    }

    return {
      headers,
      params,
      withCredentials: options.withCredentials,
    };
  }
}
