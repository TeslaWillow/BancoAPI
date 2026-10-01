// ./frontend_angular/src/app/core/interceptors/error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let customErrorMessage = 'Ocurrió un error en la comunicación con el servidor.';

      if (error.status === 0) {
        customErrorMessage = 'No hay conexión con el servidor backend.';
      } else if (error.status >= 400 && error.status < 500) {
        customErrorMessage = error.error?.message || 'Petición inválida.';
      } else if (error.status >= 500) {
        customErrorMessage = 'Error interno del servidor.';
      }

      console.error(`[HTTP ${error.status}]: ${customErrorMessage}`);
      return throwError(() => new Error(customErrorMessage));
    }),
  );
};
