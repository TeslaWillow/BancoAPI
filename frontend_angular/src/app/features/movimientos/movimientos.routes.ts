// ./frontend_angular/src/app/features/cuentas/cuentas.routes.ts
import { Routes } from '@angular/router';

export const MOVIMIENTOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/movimientos-page-component/movimientos-page.component').then(
        (m) => m.MovimientosPageComponent,
      ),
  },
];
