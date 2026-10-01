// ./frontend_angular/src/app/core/models/api-request.model.ts
import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface RequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?:
    | HttpParams
    | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
  responseType?: 'json';
  withCredentials?: boolean;
}
