// ./frontend_angular/src/app/core/handlers/global-error.handler.ts
import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  public handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : 'Error inesperado';
    console.error('[Global Error Handler]:', error ?? message);

    // TODO: show a toast
  }
}
